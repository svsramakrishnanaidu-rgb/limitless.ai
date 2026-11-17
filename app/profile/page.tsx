"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Plus, Save, UserRound } from "lucide-react";
import { Glass, PageHeader, Callout, Field } from "@/components/ui";
import { useStored } from "@/lib/store";
import type { Profile } from "@/lib/types";
import { useToast } from "@/components/providers";
import { bmi } from "@/lib/health";

const EMPTY: Profile = {
  name: "",
  bloodGroup: "",
  allergies: "",
  conditions: "",
  medications: "",
  heightCm: null,
  emergencyContacts: [],
};

const BLOOD_GROUPS = ["", "A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−", "Unknown"];

export default function ProfilePage() {
  const [profile, setProfile] = useStored<Profile>("profile", EMPTY);
  const [form, setForm] = useState<Profile>(profile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const toast = useToast();

  const save = () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length > 80) next.name = "Keep the name under 80 characters.";
    if (form.heightCm !== null && (form.heightCm < 50 || form.heightCm > 250)) next.heightCm = "Enter a height between 50 and 250 cm.";
    if (form.allergies.length > 500) next.allergies = "Keep allergies under 500 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setProfile({ ...form, name: form.name.trim() });
    setSaved(true);
    toast.push("Profile saved on this device.", "success");
    window.setTimeout(() => setSaved(false), 2500);
  };

  const latestWeightNote = form.heightCm
    ? "Height is used to calculate BMI from the weight you log in the tracker."
    : "Add your height to enable BMI calculation in the tracker.";

  return (
    <div>
      <PageHeader
        eyebrow="Profile"
        title="Your details, on your device"
        description="This information powers your emergency medical card and BMI calculation. It is stored in this browser only."
        actions={<Link href="/emergency" className="ghost-button">Emergency card</Link>}
      />

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Glass className="card-pad">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="grid h-12 w-12 place-items-center rounded-full"
              style={{ border: "1px solid var(--line-strong)", color: "var(--gold)", fontFamily: "var(--font-cormorant), serif", fontSize: "1.3rem" }}
              aria-hidden
            >
              {form.name ? form.name.charAt(0).toUpperCase() : <UserRound size={20} />}
            </div>
            <div>
              <p className="small font-medium">{form.name || "No name saved"}</p>
              <p className="tiny muted">Device-local profile · no cloud account</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name" htmlFor="profile-name" error={errors.name}>
              <input
                id="profile-name"
                className="field"
                value={form.name}
                maxLength={80}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoComplete="name"
                placeholder="How should we address you?"
              />
            </Field>

            <Field label="Blood group" htmlFor="profile-blood" hint="Only if you know it — do not guess.">
              <select
                id="profile-blood"
                className="field"
                value={form.bloodGroup}
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
              >
                {BLOOD_GROUPS.map((g) => <option key={g || "none"} value={g}>{g || "Not set"}</option>)}
              </select>
            </Field>

            <Field label="Height" htmlFor="profile-height" error={errors.heightCm} hint={latestWeightNote}>
              <input
                id="profile-height"
                type="number"
                inputMode="numeric"
                className="field"
                min={50}
                max={250}
                value={form.heightCm ?? ""}
                onChange={(e) => setForm({ ...form, heightCm: e.target.value === "" ? null : Number(e.target.value) })}
                placeholder="cm"
              />
            </Field>

            <Field label="Current weight (reference only)" htmlFor="profile-weight">
              <input id="profile-weight" className="field" value="Use the tracker to log weight" readOnly aria-readonly style={{ opacity: 0.7 }} />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Allergies" htmlFor="profile-allergies" error={errors.allergies} hint="Medicines, foods, latex, insect stings.">
                <textarea
                  id="profile-allergies"
                  className="field"
                  value={form.allergies}
                  maxLength={500}
                  onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                  placeholder="e.g. Penicillin — rash"
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Medical conditions" htmlFor="profile-conditions" hint="Long-term conditions a clinician would want to know.">
                <textarea
                  id="profile-conditions"
                  className="field"
                  value={form.conditions}
                  maxLength={500}
                  onChange={(e) => setForm({ ...form, conditions: e.target.value })}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Current medicines" htmlFor="profile-medications" hint="Include doses if you know them. This is not a prescription record.">
                <textarea
                  id="profile-medications"
                  className="field"
                  value={form.medications}
                  maxLength={800}
                  onChange={(e) => setForm({ ...form, medications: e.target.value })}
                />
              </Field>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="gold-button" onClick={save}>
              {saved ? <><Check size={15} aria-hidden /> Saved</> : <><Save size={15} aria-hidden /> Save profile</>}
            </button>
            <Link href="/emergency" className="ghost-button">Manage emergency contacts</Link>
          </div>
        </Glass>

        <div className="flex flex-col gap-4">
          <Glass className="card-pad">
            <h2 className="section-title mb-2">Emergency card preview</h2>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div><dt className="tiny muted">Blood group</dt><dd style={{ margin: 0 }}>{profile.bloodGroup || "Not set"}</dd></div>
              <div><dt className="tiny muted">Height</dt><dd style={{ margin: 0 }}>{profile.heightCm ? `${profile.heightCm} cm` : "Not set"}</dd></div>
              <div className="col-span-2"><dt className="tiny muted">Allergies</dt><dd style={{ margin: 0 }}>{profile.allergies || "None recorded"}</dd></div>
              <div className="col-span-2"><dt className="tiny muted">Conditions</dt><dd style={{ margin: 0 }}>{profile.conditions || "None recorded"}</dd></div>
              <div className="col-span-2"><dt className="tiny muted">Medicines</dt><dd style={{ margin: 0 }}>{profile.medications || "None recorded"}</dd></div>
            </dl>
          </Glass>

          <Glass className="card-pad">
            <h2 className="section-title mb-2">BMI</h2>
            {form.heightCm ? (
              <p className="small muted">
                Add a weight in the tracker and your BMI appears there automatically. BMI is a screening tool only and does not account for muscle mass,
                pregnancy or body composition.
              </p>
            ) : (
              <p className="small muted">
                Add your height, then log a weight in the tracker. {bmi(70, 170) ? "" : ""}The tracker calculates BMI from your own entries only.
              </p>
            )}
          </Glass>

          <Callout tone="info" title="No account, no cloud">
            This release does not create an account. Your profile is not uploaded anywhere. Export a copy from Settings before clearing browser data or
            changing devices.
          </Callout>

          <Glass className="card-pad">
            <h2 className="section-title mb-2">Emergency contacts</h2>
            {profile.emergencyContacts.length ? (
              <ul className="flex flex-col gap-1.5">
                {profile.emergencyContacts.map((c) => (
                  <li key={c.id} className="flex items-center justify-between text-sm">
                    <span>{c.name}{c.relation ? ` · ${c.relation}` : ""}</span>
                    <span className="tiny muted">{c.phone}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="small muted">No contacts saved yet.</p>
            )}
            <Link href="/emergency" className="ghost-button mt-3 w-full justify-center">
              <Plus size={14} aria-hidden /> Add in Emergency SOS
            </Link>
          </Glass>
        </div>
      </div>
    </div>
  );
}
