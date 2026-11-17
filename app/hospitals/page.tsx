"use client";

import { useCallback, useState } from "react";
import { Compass, ExternalLink, MapPin, Navigation, Phone, RotateCcw, Search } from "lucide-react";
import { Glass, PageHeader, EmptyState, Callout, Skeleton } from "@/components/ui";
import { usePrefs } from "@/components/providers";

type Facility = {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
  lat: number;
  lon: number;
  address: string;
  phone?: string;
  website?: string;
  emergency: boolean;
  ayush: boolean;
};

type Centre = { lat: number; lon: number; label: string };

const RADII = [2000, 5000, 10000];

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function classify(tags: Record<string, string>): string {
  const hc = (tags.healthcare ?? "").toLowerCase();
  const amenity = (tags.amenity ?? "").toLowerCase();
  if (hc === "hospital" || amenity === "hospital") return "Hospital";
  if (hc === "clinic" || amenity === "clinic") return "Clinic";
  if (hc === "pharmacy" || amenity === "pharmacy") return "Pharmacy";
  if (hc === "doctor") return "Doctor";
  if (hc === "centre") return "Health centre";
  return "Health facility";
}

function buildAddress(tags: Record<string, string>) {
  return [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"] ?? tags["addr:neighbourhood"],
    tags["addr:city"] ?? tags["addr:town"] ?? tags["addr:village"],
    tags["addr:postcode"],
  ]
    .filter(Boolean)
    .join(", ");
}

export default function HospitalsPage() {
  const { prefs } = usePrefs();
  const [centre, setCentre] = useState<Centre | null>(null);
  const [radius, setRadius] = useState(5000);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeQuery, setPlaceQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Hospital" | "Clinic" | "Pharmacy">("All");
  const [searched, setSearched] = useState(false);

  const queryOverpass = useCallback(async (lat: number, lon: number, r: number) => {
    setLoading(true);
    setError(null);
    const query = `[out:json][timeout:25];
(
  nwr["amenity"~"^(hospital|clinic|pharmacy)$"](around:${r},${lat},${lon});
  nwr["healthcare"~"^(hospital|clinic|doctor|pharmacy|centre)$"](around:${r},${lat},${lon});
);
out center tags 80;`;

    try {
      // Public Overpass instances occasionally return 406/429/502 under load.
      // Try the documented mirrors before surfacing a failure.
      const endpoints = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
        "https://overpass.private.coffee/api/interpreter",
      ];
      let data: {
        elements?: { id: number; type: string; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }[];
      } | null = null;
      let lastStatus = 0;

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `data=${encodeURIComponent(query)}`,
            signal: AbortSignal.timeout(25_000),
          });
          if (!res.ok) {
            lastStatus = res.status;
            continue;
          }
          data = await res.json();
          break;
        } catch {
          lastStatus = 0;
        }
      }

      if (!data) {
        throw new Error(
          `OpenStreetMap's public servers are busy right now${lastStatus ? ` (status ${lastStatus})` : ""}. Wait a moment and press Refresh, or try a smaller radius.`
        );
      }

      const parsed = data as {
        elements?: { id: number; type: string; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }[];
      };

      const mapped = (parsed.elements ?? []).reduce<Facility[]>((acc, el) => {
        const tags = el.tags ?? {};
        const lat2 = el.lat ?? el.center?.lat;
        const lon2 = el.lon ?? el.center?.lon;
        const name = tags.name ?? tags["name:en"] ?? "";
        if (!lat2 || !lon2 || !name) return acc;
        const hc = (tags.healthcare ?? "").toLowerCase();
        const ayush = ["ayurveda", "homeopathy", "unani", "siddha", "naturopathy"].includes(hc) ||
          /ayush|ayurved|homeopath|unani|siddha/i.test(name);
        acc.push({
          id: `${el.type}-${el.id}`,
          name,
          type: classify(tags),
          distanceKm: Number(haversine(lat, lon, lat2, lon2).toFixed(2)),
          lat: lat2,
          lon: lon2,
          address: buildAddress(tags),
          phone: tags.phone ?? tags["contact:phone"],
          website: tags.website ?? tags["contact:website"],
          emergency: tags.emergency === "yes",
          ayush,
        });
        return acc;
      }, []);

      mapped.sort((a, b) => a.distanceKm - b.distanceKm);

      setFacilities(mapped.slice(0, 60));
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load map data.");
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const locate = () => {
    if (!navigator.geolocation) {
      setError("This browser cannot access your location. Search for a town or postcode instead.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          label: "Your current location",
        };
        setCentre(next);
        setLocating(false);
        void queryOverpass(next.lat, next.lon, radius);
      },
      () => {
        setLocating(false);
        setError("Location permission was refused or unavailable. Search for a town or area instead — nothing is stored.");
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 }
    );
  };

  const searchPlace = async () => {
    const q = placeQuery.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
        { headers: { Accept: "application/json" } }
      );
      if (!res.ok) throw new Error("Place search is unavailable right now.");
      const results = (await res.json()) as { lat: string; lon: string; display_name: string }[];
      if (!results.length) {
        setError(`No place found for "${q}". Try a town, district or postcode.`);
        setLoading(false);
        return;
      }
      const next = { lat: Number(results[0].lat), lon: Number(results[0].lon), label: results[0].display_name };
      setCentre(next);
      setLoading(false);
      void queryOverpass(next.lat, next.lon, radius);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Place search failed.");
      setLoading(false);
    }
  };

  const visible = filter === "All" ? facilities : facilities.filter((f) => f.type === filter);
  const mapSrc = centre
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${centre.lon - 0.03}%2C${centre.lat - 0.02}%2C${centre.lon + 0.03}%2C${centre.lat + 0.02}&layer=mapnik&marker=${centre.lat}%2C${centre.lon}`
    : null;

  return (
    <div>
      <PageHeader
        eyebrow="Hospital and healthcare locator"
        title="What is actually near you"
        description="Live OpenStreetMap data. LIMITLESS does not invent facilities, ratings or available services — and map coverage varies by area."
      />

      <Glass className="card-pad mb-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="button" className="gold-button shrink-0" onClick={locate} disabled={locating || loading}>
              <Compass size={16} aria-hidden /> {locating ? "Getting location…" : "Use my location"}
            </button>
            <div className="flex flex-1 gap-2">
              <input
                className="field"
                placeholder="Or search a town, district or postcode"
                aria-label="Search a place"
                value={placeQuery}
                onChange={(e) => setPlaceQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void searchPlace();
                }}
              />
              <button type="button" className="ghost-button shrink-0" onClick={() => void searchPlace()} disabled={loading || !placeQuery.trim()}>
                <Search size={15} aria-hidden /> Search
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="tiny muted">Radius</span>
            {RADII.map((r) => (
              <button
                key={r}
                type="button"
                className="chip"
                data-active={radius === r}
                onClick={() => {
                  setRadius(r);
                  if (centre) void queryOverpass(centre.lat, centre.lon, r);
                }}
              >
                {r / 1000} km
              </button>
            ))}
            {centre && (
              <button type="button" className="chip ml-auto" onClick={() => void queryOverpass(centre.lat, centre.lon, radius)} disabled={loading}>
                <RotateCcw size={13} aria-hidden /> Refresh
              </button>
            )}
          </div>
          {centre && <p className="tiny muted">Searching near: {centre.label}</p>}
        </div>
      </Glass>

      {error && (
        <div className="mb-4">
          <Callout tone="danger" title="Could not load facilities">{error}</Callout>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div>
          {loading ? (
            <div className="flex flex-col gap-2">
              {[0, 1, 2, 3].map((i) => (
                <Glass key={i} className="card-pad">
                  <Skeleton className="mb-2 h-4 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </Glass>
              ))}
            </div>
          ) : !searched ? (
            <Glass className="card-pad">
              <EmptyState
                icon={<MapPin size={18} aria-hidden />}
                title="Choose a location"
                description="Use your location or search for a place to list hospitals, clinics and pharmacies from OpenStreetMap. Location is only used for this search."
              />
            </Glass>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap gap-2">
                {(["All", "Hospital", "Clinic", "Pharmacy"] as const).map((f) => (
                  <button key={f} type="button" className="chip" data-active={filter === f} onClick={() => setFilter(f)}>
                    {f}
                  </button>
                ))}
                <span className="tiny muted ml-auto self-center">{visible.length} results</span>
              </div>

              {visible.length === 0 ? (
                <Glass className="card-pad">
                  <EmptyState
                    icon={<MapPin size={18} aria-hidden />}
                    title="No facilities found in this area"
                    description="OpenStreetMap coverage is incomplete, especially in rural areas. Try a wider radius or search a nearby town, and call ahead before travelling."
                  />
                </Glass>
              ) : (
                <ul className="flex flex-col gap-2">
                  {visible.map((facility) => (
                    <li key={facility.id}>
                      <Glass className="card-pad">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium leading-snug">{facility.name}</p>
                            <p className="tiny muted mt-0.5">
                              {facility.type} · {facility.distanceKm} km away
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1">
                            {facility.emergency && <span className="badge badge-danger">Emergency</span>}
                            {facility.ayush && <span className="badge badge-green">AYUSH</span>}
                          </div>
                        </div>
                        {facility.address && <p className="small muted mt-2">{facility.address}</p>}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <a
                            href={`https://www.openstreetmap.org/?mlat=${facility.lat}&mlon=${facility.lon}#map=18/${facility.lat}/${facility.lon}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ghost-button"
                            style={{ minHeight: 36, paddingInline: 12 }}
                          >
                            <Navigation size={14} aria-hidden /> Directions
                          </a>
                          {facility.phone && (
                            <a href={`tel:${facility.phone.replace(/[^\d+]/g, "")}`} className="ghost-button" style={{ minHeight: 36, paddingInline: 12 }}>
                              <Phone size={14} aria-hidden /> Call
                            </a>
                          )}
                          {facility.website && (
                            <a href={facility.website} target="_blank" rel="noopener noreferrer nofollow" className="ghost-button" style={{ minHeight: 36, paddingInline: 12 }}>
                              <ExternalLink size={14} aria-hidden /> Website
                            </a>
                          )}
                        </div>
                      </Glass>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Glass style={{ padding: 0, overflow: "hidden" }}>
            {mapSrc ? (
              <iframe
                title="OpenStreetMap location"
                src={mapSrc}
                style={{ width: "100%", height: 300, border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center gap-2 px-6 text-center">
                <MapPin size={28} style={{ color: "var(--gold)" }} aria-hidden />
                <p className="small muted">The map appears after you choose a location.</p>
              </div>
            )}
          </Glass>

          <Glass className="card-pad">
            <h2 className="section-title mb-2">Before you travel</h2>
            <ul className="med-prose small list-disc pl-5">
              <li>Call the facility to confirm it is open and can handle your problem; map presence does not mean a service is available.</li>
              <li>For a life-threatening emergency, call {prefs.country === "IN" ? "112" : prefs.country === "US" ? "911" : prefs.country === "GB" ? "999" : "your local emergency number"} rather than travelling yourself.</li>
              <li>Carry identification, medicine lists and any referral letter.</li>
              <li>Data comes from OpenStreetMap contributors under the ODbL licence and may be incomplete or out of date.</li>
            </ul>
            <p className="tiny muted mt-2">LIMITLESS does not display ratings or waiting times because it has no verified source for them.</p>
          </Glass>
        </div>
      </div>
    </div>
  );
}
