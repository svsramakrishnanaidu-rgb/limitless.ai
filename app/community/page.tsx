"use client";

import Link from "next/link";
import { AlertTriangle, Droplets, ExternalLink, HandHeart, ShieldCheck, Users } from "lucide-react";
import { Glass, PageHeader, Callout } from "@/components/ui";

const TOPICS = [
  {
    title: "Hand hygiene in shared spaces",
    icon: HandHeart,
    body: "Soap and water at key moments — before eating, after the toilet, after handling waste or animals — reduces diarrhoeal illness substantially. Alcohol sanitiser is for hands that are not visibly dirty.",
    action: { label: "Read the evidence", href: "/library/handwashing-and-hygiene" },
  },
  {
    title: "Safe drinking water",
    icon: Droplets,
    body: "Protect the source, treat water where needed and store it covered. Boiling is effective but costs fuel; chlorination is cheap but less effective against some parasites. Household tap connections are being expanded under the Jal Jeevan Mission.",
    action: { label: "Water programme details", href: "/schemes" },
  },
  {
    title: "Preventing antibiotic resistance",
    icon: ShieldCheck,
    body: "Antibiotics only help bacterial infections. They do nothing for viral colds and can cause harm. Complete a prescribed course exactly as directed and never share leftover antibiotics.",
    action: { label: "Read about prevention", href: "/learn/prevention" },
  },
  {
    title: "Heat and dehydration",
    icon: AlertTriangle,
    body: "Move to shade, drink water and check on older neighbours during heatwaves. Confusion or collapse in heat is an emergency — cool the person and call for help.",
    action: { label: "Heat-stroke first aid", href: "/emergency" },
  },
];

export default function CommunityPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Community healthcare"
        title="Shared knowledge, verified sources"
        description="Community health education without an unmoderated feed. LIMITLESS does not host public posts in this release, so there is nothing to report or moderate here."
        actions={<Link href="/schemes" className="ghost-button">Government programmes</Link>}
      />

      <div className="grid gap-3 md:grid-cols-2">
        {TOPICS.map((topic) => (
          <Glass key={topic.title} className="card-pad flex h-full flex-col">
            <span className="nav-medallion" aria-hidden><topic.icon size={16} /></span>
            <h2 className="brand-serif mt-2 text-[1.2rem]">{topic.title}</h2>
            <p className="small muted mt-1 flex-1" style={{ lineHeight: 1.6 }}>{topic.body}</p>
            <Link href={topic.action.href} className="ghost-button mt-3 w-fit">{topic.action.label}</Link>
          </Glass>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Glass className="card-pad">
          <h2 className="section-title mb-2 flex items-center gap-2"><Users size={16} aria-hidden /> Why there is no public feed</h2>
          <p className="small muted" style={{ lineHeight: 1.7 }}>
            Health misinformation spreads fastest in unmoderated comment sections. A community feed needs authentication, moderation, reporting
            workflows, takedown procedures and a data protection basis — none of which can be safely improvised. Rather than ship a pretend feed,
            this release offers reviewed education and official links, with real reporting channels listed below.
          </p>
          <h3 className="eyebrow mt-4 mb-1">Reporting health misinformation</h3>
          <ul className="med-prose small list-disc pl-5">
            <li>Report harmful medical claims to the platform where they were posted, using its report tool.</li>
            <li>For misleading medicine advertising in India, contact the state drug controller or the Central Drugs Standard Control Organisation.</li>
            <li>For unregistered practitioners, contact the relevant state medical or AYUSH council.</li>
            <li>For a product that harmed someone, report it to your clinician and the national pharmacovigilance programme.</li>
          </ul>
        </Glass>

        <Glass className="card-pad">
          <h2 className="section-title mb-2">Official sources</h2>
          <ul className="flex flex-col gap-2.5">
            {[
              { label: "Ministry of Health and Family Welfare", url: "https://mohfw.gov.in/" },
              { label: "Ministry of AYUSH", url: "https://ayush.gov.in/" },
              { label: "National Health Mission", url: "https://nhm.gov.in/" },
              { label: "Indian Council of Medical Research", url: "https://www.icmr.gov.in/" },
              { label: "World Health Organization", url: "https://www.who.int/" },
            ].map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer nofollow" className="small flex items-center gap-1.5 hover:underline" style={{ color: "var(--gold)" }}>
                  {source.label} <ExternalLink size={12} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
          <Callout tone="info" title="Local health workers">
            Accredited Social Health Activists (ASHA), Anganwadi workers and primary health centre staff are the right first contact for many
            community health questions. Ask at your nearest Ayushman Arogya Mandir.
          </Callout>
        </Glass>
      </div>
    </div>
  );
}
