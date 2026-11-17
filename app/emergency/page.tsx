"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Ambulance, Cross, MapPin, Phone, Plus, Printer, Share2, ShieldPlus, Trash2 } from "lucide-react";
import { EMERGENCY_DISCLAIMER, EMERGENCY_NUMBERS, EMERGENCY_REVIEWED, FIRST_AID } from "@/lib/content/emergency";
import { Glass, PageHeader, Modal, Field, Callout, EmptyState } from "@/components/ui";
import { useStored, prettyDate, dateKey } from "@/lib/store";
import { usePrefs, useToast } from "@/components/providers";
import type { EmergencyContact, Profile } from "@/lib/types";

const EMPTY_PROFILE: Profile = {
  name: "",
  bloodGroup: "",
  allergies: "",
  conditions: "",
  medications: "",
  heightCm: null,
  emergencyContacts: [],
};

export default function EmergencyPage() {
  const { prefs, setPref } = usePrefs();
  const toast = useToast();
  const [profile, setProfile] = useStored<Profile>("profile", EMPTY_PROFILE);
  const [openContact, setOpenContact] = useState(false);
  const [openSos, setOpenSos] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", relation: "", phone: "" });
  const [contactError, setContactError] = useState<string | null>(null);
  const [openFirstAid, setOpenFirstAid] = useState<string | null>(null);

  const country = useMemo(
    () => EMERGENCY_NUMBERS.find((c) => c.code === prefs.country) ?? EMERGENCY_NUMBERS[0],
    [prefs.country]
  );

  const addContact = () => {
    if (!contactForm.name.trim()) {
      setContactError("Enter a name.");
      return;
    }
    const digits = contactForm.phone.replace(/[^\d+]/g, "");
    if (digits.length < 6) {
      setContactError("Enter a phone number with at least 6 digits.");
      return;
    }
    setProfile((prev) => ({
      ...prev,
      emergencyContacts: [
        ...prev.emergencyContacts,
        { id: `${Date.now()}`, name: contactForm.name.trim(), relation: contactForm.relation.trim(), phone: digits },
      ],
    }));
    setContactForm({ name: "", relation: "", phone: "" });
    setContactError(null);
    setOpenContact(false);
    toast.push("Trusted contact saved.", "success");
  };

  const removeContact = (id: string) => {
    if (!window.confirm("Remove this emergency contact?")) return;
    setProfile((prev) => ({ ...prev, emergencyContacts: prev.emergencyContacts.filter((c) => c.id !== id) }));
  };

  const shareLocation = async () => {
    if (!navigator.geolocation) {
      toast.push("Location is not available in this browser.", "error");
      return;
    }
    const position = await new Promise<GeolocationPosition | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos),
        () => resolve(null),
        { timeout: 8000, maximumAge: 30000 }
      );
    });
    if (!position) {
      toast.push("Location permission was not granted, so no location was shared.", "error");
      return;
    }
    const { latitude, longitude } = position.coords;
    const message = `I need help. My location: https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Emergency location", text: message });
        toast.push("Location passed to your share sheet.", "success");
        return;
      } catch {
        /* dismissed */
      }
    }
    await navigator.clipboard.writeText(message);
    toast.push("Location copied. LIMITLESS cannot send messages on your behalf — paste it to a trusted contact.", "info");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Emergency assistance"
        title="Get help, then read"
        description="No sign-in, animation or paywall stands between you and these numbers."
        actions={
          <button type="button" className="ghost-button" onClick={() => window.print()}>
            <Printer size={15} aria-hidden /> Print medical card
          </button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Glass className="card-pad" style={{ borderColor: "rgba(229,72,77,0.4)" }}>
            <div className="flex flex-col items-center text-center">
              <button
                type="button"
                onClick={() => setOpenSos(true)}
                className="grid h-24 w-24 place-items-center rounded-full"
                style={{
                  border: "1px solid rgba(229,72,77,0.6)",
                  background: "radial-gradient(circle at 40% 30%, rgba(229,72,77,0.35), rgba(229,72,77,0.08) 70%)",
                  color: "#fff",
                  boxShadow: "0 0 40px rgba(229,72,77,0.25)",
                }}
                aria-label={`Open emergency actions for ${country.country}`}
              >
                <ShieldPlus size={38} aria-hidden />
              </button>
              <h2 className="brand-serif mt-3" style={{ fontSize: "1.6rem" }}>Emergency SOS</h2>
              <p className="small muted mt-1" style={{ maxWidth: "38ch" }}>
                Call {country.emergency} in {country.country}. LIMITLESS cannot place the call for you — the next screen opens your phone dialler.
              </p>
              <a href={`tel:${country.emergency}`} className="gold-button mt-4 w-full" style={{ maxWidth: 320, background: "linear-gradient(135deg,#ff9a9b,#e5484d)", color: "#fff", borderColor: "#f2a3a5" }}>
                <Phone size={16} aria-hidden /> Call {country.emergency} now
              </a>
              <div className="mt-2 flex w-full gap-2" style={{ maxWidth: 320 }}>
                <a href={`tel:${country.ambulance}`} className="ghost-button flex-1 justify-center" style={{ borderColor: "rgba(229,72,77,0.4)", color: "var(--danger)" }}>
                  <Ambulance size={15} aria-hidden /> Ambulance {country.ambulance}
                </a>
                <button type="button" className="ghost-button flex-1 justify-center" onClick={() => void shareLocation()}>
                  <Share2 size={15} aria-hidden /> Share location
                </button>
              </div>
            </div>
          </Glass>

          <Glass className="card-pad">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="section-title">Verified numbers</h2>
              <label className="sr-only" htmlFor="emergency-country">Country</label>
              <select
                id="emergency-country"
                className="field"
                style={{ width: 180, minHeight: 38, fontSize: "0.8rem" }}
                value={prefs.country}
                onChange={(e) => setPref("country", e.target.value)}
              >
                {EMERGENCY_NUMBERS.map((c) => <option key={c.code} value={c.code}>{c.country}</option>)}
              </select>
            </div>
            <ul className="flex flex-col gap-2">
              {[
                { label: "All emergency services", number: country.emergency },
                { label: "Ambulance", number: country.ambulance },
                { label: "Police", number: country.police },
                ...(country.poison ? [{ label: "Poison information", number: country.poison }] : []),
              ].map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2" style={{ borderColor: "var(--line)" }}>
                  <span className="small">{row.label}</span>
                  <a href={`tel:${row.number.replace(/[^\d+]/g, "")}`} className="small font-medium underline" style={{ color: "var(--gold)" }}>
                    {row.number}
                  </a>
                </li>
              ))}
            </ul>
            <p className="tiny muted mt-2">{country.notes}</p>
            <p className="tiny muted mt-1">Reviewed {prettyDate(EMERGENCY_REVIEWED)}. Numbers can change — confirm locally.</p>
          </Glass>

          <Glass className="card-pad">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="section-title">Trusted contacts</h2>
              <button type="button" className="ghost-button" style={{ minHeight: 36 }} onClick={() => setOpenContact(true)}>
                <Plus size={14} aria-hidden /> Add
              </button>
            </div>
            {profile.emergencyContacts.length ? (
              <ul className="flex flex-col gap-2">
                {profile.emergencyContacts.map((contact) => (
                  <li key={contact.id} className="flex items-center gap-2 rounded-xl border px-3 py-2" style={{ borderColor: "var(--line)" }}>
                    <div className="min-w-0 flex-1">
                      <p className="small font-medium truncate">{contact.name}</p>
                      <p className="tiny muted">{contact.relation || "Contact"} · {contact.phone}</p>
                    </div>
                    <a href={`tel:${contact.phone}`} className="icon-button" style={{ width: 34, height: 34 }} aria-label={`Call ${contact.name}`}>
                      <Phone size={14} aria-hidden />
                    </a>
                    <button type="button" className="icon-button" style={{ width: 34, height: 34 }} aria-label={`Remove ${contact.name}`} onClick={() => removeContact(contact.id)}>
                      <Trash2 size={14} aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={<Phone size={17} aria-hidden />}
                title="No trusted contacts"
                description="Add someone you would want alerted. LIMITLESS will never message them automatically."
                action={<button type="button" className="ghost-button" onClick={() => setOpenContact(true)}>Add a contact</button>}
              />
            )}
          </Glass>
        </div>

        <div className="flex flex-col gap-4">
          <Glass className="card-pad">
            <h2 className="section-title mb-2">Emergency medical card</h2>
            <p className="tiny muted mb-3">
              Taken from your profile. Keep it accurate; medical staff need facts, not guesses.
            </p>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="tiny muted">Name</dt><dd style={{ margin: 0 }}>{profile.name || "Not entered"}</dd></div>
              <div><dt className="tiny muted">Blood group</dt><dd style={{ margin: 0 }}>{profile.bloodGroup || "Not entered"}</dd></div>
              <div className="col-span-2"><dt className="tiny muted">Allergies</dt><dd style={{ margin: 0 }}>{profile.allergies || "Not entered"}</dd></div>
              <div className="col-span-2"><dt className="tiny muted">Conditions</dt><dd style={{ margin: 0 }}>{profile.conditions || "Not entered"}</dd></div>
              <div className="col-span-2"><dt className="tiny muted">Current medicines</dt><dd style={{ margin: 0 }}>{profile.medications || "Not entered"}</dd></div>
            </dl>
            <Link href="/profile" className="ghost-button mt-3 w-full justify-center">Edit in profile</Link>
            <p className="tiny muted mt-2">Last updated: {profile.name ? "see profile" : "no data saved"}.</p>
          </Glass>

          <Glass className="card-pad">
            <h2 className="section-title mb-2">Nearby hospitals</h2>
            <p className="small muted" style={{ lineHeight: 1.55 }}>
              Search live OpenStreetMap data for hospitals, clinics and pharmacies with distance and directions.
            </p>
            <Link href="/hospitals" className="ghost-button mt-3 w-full justify-center">
              <MapPin size={15} aria-hidden /> Open hospital locator
            </Link>
          </Glass>

          <Callout tone="danger" title="What LIMITLESS cannot do">
            It does not call emergency services, alert your contacts, dispatch an ambulance, or guarantee that a number or first-aid step is correct for
            your location. Use your phone&apos;s emergency dialler.
          </Callout>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="section-title mb-2">First aid guidance</h2>
        <p className="small muted mb-3">Summaries from authoritative guidance. Training is required to perform CPR and choking response safely.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {FIRST_AID.map((guide) => (
            <Glass key={guide.slug} className="card-pad">
              <button type="button" className="w-full text-left" onClick={() => setOpenFirstAid(guide.slug)} aria-expanded={openFirstAid === guide.slug}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="brand-serif text-lg">{guide.title}</h3>
                    <p className="small muted mt-0.5">{guide.summary}</p>
                  </div>
                  <Cross size={16} style={{ color: "var(--gold)", flex: "none" }} aria-hidden />
                </div>
              </button>
              {openFirstAid === guide.slug && (
                <div className="mt-3">
                  <ol className="med-prose small list-decimal pl-5">
                    {guide.steps.map((step) => <li key={step} className="my-1">{step}</li>)}
                  </ol>
                  <p className="eyebrow mt-3 mb-1">Do not</p>
                  <ul className="med-prose small list-disc pl-5">
                    {guide.avoid.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <a href={guide.source.url} target="_blank" rel="noopener noreferrer nofollow" className="tiny mt-2 inline-block underline" style={{ color: "var(--gold)" }}>
                    Source: {guide.source.label}
                  </a>
                </div>
              )}
            </Glass>
          ))}
        </div>
      </section>

      <p className="tiny muted mt-5" style={{ maxWidth: "80ch" }}>{EMERGENCY_DISCLAIMER}</p>

      <Modal
        open={openSos}
        onClose={() => setOpenSos(false)}
        title="Emergency actions"
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setOpenSos(false)}>Cancel</button>
            <a href={`tel:${country.emergency}`} className="gold-button" style={{ background: "linear-gradient(135deg,#ff9a9b,#e5484d)", color: "#fff", borderColor: "#f2a3a5" }} onClick={() => setOpenSos(false)}>
              <Phone size={15} aria-hidden /> Call {country.emergency}
            </a>
          </>
        }
      >
        <p className="small" style={{ lineHeight: 1.6 }}>
          This opens your phone&apos;s dialler with <strong>{country.emergency}</strong> ({country.country} emergency services). You still need to press call.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <button type="button" className="ghost-button w-full justify-center" onClick={() => { setOpenSos(false); void shareLocation(); }}>
            <Share2 size={15} aria-hidden /> Share my location with a contact
          </button>
          <a href="/hospitals" className="ghost-button w-full justify-center" onClick={() => setOpenSos(false)}>
            <MapPin size={15} aria-hidden /> Find the nearest hospital
          </a>
        </div>
        <p className="tiny muted mt-3">
          If you are with someone who is unconscious and not breathing normally, start CPR if trained and follow the dispatcher.
        </p>
      </Modal>

      <Modal
        open={openContact}
        onClose={() => setOpenContact(false)}
        title="Add a trusted contact"
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setOpenContact(false)}>Cancel</button>
            <button type="button" className="gold-button" onClick={addContact}>Save contact</button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <Field label="Name" htmlFor="contact-name">
            <input id="contact-name" className="field" value={contactForm.name} maxLength={60} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
          </Field>
          <Field label="Relationship" htmlFor="contact-relation">
            <input id="contact-relation" className="field" value={contactForm.relation} maxLength={40} onChange={(e) => setContactForm({ ...contactForm, relation: e.target.value })} placeholder="e.g. Sister" />
          </Field>
          <Field label="Phone" htmlFor="contact-phone" error={contactError ?? undefined}>
            <input id="contact-phone" className="field" type="tel" value={contactForm.phone} maxLength={20} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} placeholder="+91 90000 00000" />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
