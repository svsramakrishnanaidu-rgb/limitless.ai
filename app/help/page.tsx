"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Glass, PageHeader, Callout } from "@/components/ui";

const FAQ = [
  {
    q: "Is LIMITLESS a medical service?",
    a: "No. LIMITLESS is health education and a personal organiser. It does not diagnose, prescribe, or act as your clinician, and no doctor-patient relationship is created by using it. For diagnosis or treatment, see a qualified professional.",
  },
  {
    q: "Does my data leave my device?",
    a: "Your profile, tracker entries, reminders, journal and saved items stay in this browser. Two things are sent out when you use them: messages you type to LIMITLESS AI (to the configured AI provider), and plant photos you submit for identification. Location is used only for the hospital search you start. See the privacy policy for detail.",
  },
  {
    q: "Where do the plant photos go?",
    a: "The photo is resized in your browser, then sent through the LIMITLESS server to a vision-capable AI provider for identification. LIMITLESS does not store the image. The provider's own terms apply to processing.",
  },
  {
    q: "Why does the assistant sometimes refuse to answer?",
    a: "LIMITLESS AI answers health-education questions but will not diagnose or prescribe. If a request crosses that line, it explains why and points to appropriate care. It also says plainly when evidence is uncertain.",
  },
  {
    q: "Why do reminders not fire when the app is closed?",
    a: "The web build can only show notifications while a LIMITLESS tab is open. Reliable background alerts need an installed mobile build with platform notification permissions, which is not part of this release.",
  },
  {
    q: "Can I use LIMITLESS offline?",
    a: "Yes, for content you have opened or marked for offline reading. AI, plant scanning and hospital search require an internet connection. Downloaded items and your tracker history work without one.",
  },
  {
    q: "How do I delete my data?",
    a: "Open Settings → Privacy and data, export a copy if you want one, then use Delete everything. You can also clear site data in your browser, which removes the service worker cache.",
  },
  {
    q: "Is the information translated?",
    a: "The interface is translated for English, Telugu and Hindi. All 22 interface languages can be selected, but the remaining languages currently fall back to English. Library content is in English. Machine translation of medical text is not used because it can change clinical meaning.",
  },
  {
    q: "How current is the medical content?",
    a: "Every library entry shows a review date. Sources are linked. Medicine changes, so treat older dates cautiously and confirm with a clinician or pharmacist.",
  },
  {
    q: "Why are there no reviews, ratings or user counts?",
    a: "LIMITLESS has no verified source for them, and inventing social proof would be dishonest. Hospital results come from OpenStreetMap without ratings, and the app shows no fabricated statistics.",
  },
  {
    q: "Can I get a certificate?",
    a: "Finishing a Learning Centre module produces an in-app learning record. It is not a qualification, licence or accreditation and cannot be presented as one.",
  },
];

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <PageHeader
        eyebrow="Help and support"
        title="Honest answers about what this does"
        description="If something is unclear or broken, this page should say so plainly rather than hide it."
      />

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-2">
          {FAQ.map((item, index) => (
            <Glass key={item.q} className="card-pad" style={{ padding: 0 }}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                aria-expanded={open === index}
                onClick={() => setOpen(open === index ? null : index)}
              >
                <span className="text-sm font-medium">{item.q}</span>
                <ChevronDown
                  size={16}
                  aria-hidden
                  style={{ transform: open === index ? "rotate(180deg)" : "none", transition: "transform 180ms ease", flex: "none" }}
                />
              </button>
              {open === index && <p className="small muted px-4 pb-4" style={{ lineHeight: 1.65 }}>{item.a}</p>}
            </Glass>
          ))}
        </div>

        <aside className="flex flex-col gap-4">
          <Glass className="card-pad">
            <h2 className="section-title mb-2">Urgent help</h2>
            <p className="small muted">For a medical emergency, call your local emergency number immediately.</p>
            <Link href="/emergency" className="gold-button mt-3 w-full justify-center">Emergency SOS</Link>
          </Glass>

          <Glass className="card-pad">
            <h2 className="section-title mb-2">Report a problem</h2>
            <p className="small muted" style={{ lineHeight: 1.6 }}>
              This build has no support desk connected. Before launch, a monitored contact channel must be published with the custom domain. Until then,
              record the issue with the date, the page and what you expected, and keep your exported data.
            </p>
            <p className="tiny muted mt-2">Do not send medical information through an unverified channel.</p>
          </Glass>

          <Callout tone="warning" title="Content corrections">
            If you believe a health claim on this site is wrong or unsafe, stop relying on it and consult a clinician. Corrections should be tracked
            against the review date shown on each article.
          </Callout>

          <Glass className="card-pad">
            <h2 className="section-title mb-2">Legal</h2>
            <div className="flex flex-col gap-1.5">
              <Link href="/privacy" className="small hover:underline" style={{ color: "var(--gold)" }}>Privacy policy</Link>
              <Link href="/terms" className="small hover:underline" style={{ color: "var(--gold)" }}>Terms and conditions</Link>
            </div>
          </Glass>
        </aside>
      </div>
    </div>
  );
}
