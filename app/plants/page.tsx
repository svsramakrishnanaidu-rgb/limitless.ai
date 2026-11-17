"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, Bookmark, Leaf, ScanLine, Search } from "lucide-react";
import { PLANTS, type Plant } from "@/lib/content/plants";
import { Glass, Modal, PageHeader, Callout, EmptyState } from "@/components/ui";
import { useSaved } from "@/lib/health";

export default function PlantsPage() {
  const [query, setQuery] = useState("");
  const [onlyToxic, setOnlyToxic] = useState(false);
  const [openPlant, setOpenPlant] = useState<Plant | null>(null);
  const { toggle, has } = useSaved();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PLANTS.filter((p) => {
      if (onlyToxic && !p.danger) return false;
      if (!q) return true;
      return (
        p.commonName.toLowerCase().includes(q) ||
        p.scientificName.toLowerCase().includes(q) ||
        p.family.toLowerCase().includes(q) ||
        p.regionalNames.some((r) => r.name.includes(query.trim()))
      );
    });
  }, [query, onlyToxic]);

  return (
    <div>
      <PageHeader
        eyebrow="Medicinal plants"
        title="Botanical safety, not botanicals as cures"
        description="Common medicinal plants with regional names, documented uses, toxicity and the poisonous plants they are confused with."
        actions={
          <Link href="/scanner" className="gold-button">
            <ScanLine size={16} aria-hidden /> Scan a plant
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-md">
          <Search size={16} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
          <input
            type="search"
            className="field"
            style={{ paddingLeft: "2.4rem" }}
            placeholder="Tulasi, Ocimum, వేప…"
            aria-label="Search plants"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="button" className="chip" data-active={onlyToxic} onClick={() => setOnlyToxic((v) => !v)} aria-pressed={onlyToxic}>
          <AlertTriangle size={14} aria-hidden /> Poisonous only
        </button>
      </div>

      <Callout tone="danger" title="Never eat a plant from an app">
        Photo and text identification cannot confirm a species. Several plants in this list are deadly, and edible species have toxic lookalikes. Confirm any plant with a botanist, agricultural extension officer or recognised herbarium before use.
      </Callout>

      {filtered.length === 0 ? (
        <Glass className="card-pad mt-4">
          <EmptyState icon={<Search size={18} aria-hidden />} title="No plants match" description="Try the scientific name or a regional name." />
        </Glass>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((plant) => (
            <Glass key={plant.slug} interactive className="card-pad flex h-full flex-col">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div
                  className="grid h-14 w-14 place-items-center rounded-2xl"
                  style={{
                    border: `1px solid ${plant.danger ? "rgba(229,72,77,0.45)" : "var(--line-strong)"}`,
                    background: plant.danger
                      ? "rgba(229,72,77,0.08)"
                      : "radial-gradient(circle at 35% 30%, rgba(0,167,139,0.2), transparent 70%)",
                    color: plant.danger ? "var(--danger)" : "var(--accent)",
                  }}
                  aria-hidden
                >
                  {plant.danger ? <AlertTriangle size={22} /> : <Leaf size={22} />}
                </div>
                <div className="flex gap-1.5">
                  {plant.danger && <span className="badge badge-danger">Toxic</span>}
                  <button
                    type="button"
                    className="icon-button"
                    style={{ width: 32, height: 32 }}
                    aria-label={has("plant", plant.slug) ? `Remove ${plant.commonName} from saved` : `Save ${plant.commonName}`}
                    aria-pressed={has("plant", plant.slug)}
                    onClick={() => toggle({ type: "plant", slug: plant.slug, title: plant.commonName })}
                  >
                    <Bookmark
                      size={14}
                      aria-hidden
                      fill={has("plant", plant.slug) ? "var(--gold)" : "none"}
                      color={has("plant", plant.slug) ? "var(--gold)" : "currentColor"}
                    />
                  </button>
                </div>
              </div>
              <button type="button" className="text-left" onClick={() => setOpenPlant(plant)}>
                <h2 className="brand-serif text-[1.18rem] leading-snug">{plant.commonName}</h2>
                <p className="tiny italic muted mt-0.5">{plant.scientificName}</p>
                <p className="small muted mt-2" style={{ lineHeight: 1.5 }}>{plant.summary}</p>
              </button>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {plant.regionalNames.slice(0, 3).map((r) => (
                  <span key={r.language} className="badge">{r.name}</span>
                ))}
              </div>
              <button type="button" className="ghost-button mt-3 w-full" onClick={() => setOpenPlant(plant)}>
                View identification details
              </button>
            </Glass>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(openPlant)}
        onClose={() => setOpenPlant(null)}
        title={openPlant ? `${openPlant.commonName} · ${openPlant.scientificName}` : ""}
        wide
      >
        {openPlant && (
          <div className="flex flex-col gap-4">
            {openPlant.danger && (
              <Callout tone="danger" title="Toxic plant">
                This plant is dangerous. Do not handle, taste, burn or prepare it. Seek emergency care for any suspected ingestion.
              </Callout>
            )}
            <div>
              <p className="eyebrow mb-1">Identification</p>
              <p className="small" style={{ lineHeight: 1.65 }}>{openPlant.description}</p>
              <p className="tiny muted mt-2">Family: {openPlant.family}</p>
              <p className="tiny muted">Parts used: {openPlant.partsUsed.join(", ")}</p>
            </div>
            <div>
              <p className="eyebrow mb-1">Regional names</p>
              <div className="flex flex-wrap gap-1.5">
                {openPlant.regionalNames.map((r) => (
                  <span key={r.language} className="badge">{r.language}: {r.name}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow mb-1">Evidence</p>
              <p className="small" style={{ lineHeight: 1.6 }}>{openPlant.evidence}</p>
            </div>
            <div>
              <p className="eyebrow mb-1">Traditional uses</p>
              <ul className="small med-prose list-disc pl-5">
                {openPlant.traditionalUses.map((u) => <li key={u}>{u}</li>)}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-1">Toxicity</p>
              <p className="small" style={{ lineHeight: 1.6 }}>{openPlant.toxicity}</p>
            </div>
            <div>
              <p className="eyebrow mb-1">Safety precautions</p>
              <ul className="small med-prose list-disc pl-5">
                {openPlant.safety.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-1">Similar-looking plants</p>
              <ul className="flex flex-col gap-2">
                {openPlant.lookalikes.map((l) => (
                  <li key={l.name} className="rounded-xl border p-3" style={{ borderColor: l.risk === "High" ? "rgba(229,72,77,0.4)" : "var(--line)" }}>
                    <p className="small font-medium">{l.name}</p>
                    <p className="tiny mb-1" style={{ color: l.risk === "High" ? "var(--danger)" : "var(--muted)" }}>Lookalike risk: {l.risk}</p>
                    <p className="tiny muted" style={{ lineHeight: 1.5 }}>{l.note}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-1">Reference</p>
              <a href={openPlant.reference[0].url} target="_blank" rel="noopener noreferrer nofollow" className="small underline" style={{ color: "var(--gold)" }}>
                {openPlant.reference[0].title} — {openPlant.reference[0].publisher}
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
