"use client";

import { ExternalLink } from "lucide-react";
import { SCHEMES, SCHEMES_UPDATED } from "@/lib/content/schemes";
import { Glass, PageHeader, Callout } from "@/components/ui";
import { prettyDate } from "@/lib/store";

export default function SchemesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Government healthcare information"
        title="Programmes and how to use them"
        description="Indian central government health schemes with official links. Eligibility and processes change, so verify before you travel or pay anyone."
      />

      <Callout tone="warning" title="Verify before acting">
        These summaries were reviewed on {prettyDate(SCHEMES_UPDATED)}. LIMITLESS is not affiliated with any government body and cannot approve,
        reject or expedite an application. Never pay an agent to check eligibility.
      </Callout>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {SCHEMES.map((scheme) => (
          <Glass key={scheme.slug} className="card-pad flex h-full flex-col">
            <span className="badge badge-green w-fit">{scheme.official}</span>
            <h2 className="brand-serif mt-2 text-[1.25rem] leading-snug">{scheme.name}</h2>
            <p className="tiny muted mt-1">{scheme.provider}</p>
            <p className="small mt-2" style={{ lineHeight: 1.6 }}>{scheme.summary}</p>

            <h3 className="eyebrow mt-3 mb-1">Who it is for</h3>
            <p className="small muted" style={{ lineHeight: 1.55 }}>{scheme.eligibility}</p>

            <h3 className="eyebrow mt-3 mb-1">How to apply</h3>
            <ol className="med-prose small list-decimal pl-5">
              {scheme.howToApply.map((step) => <li key={step} className="my-0.5">{step}</li>)}
            </ol>

            {scheme.note && <p className="tiny muted mt-2">{scheme.note}</p>}

            <a
              href={scheme.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="gold-button mt-4 w-full justify-center"
            >
              Official website <ExternalLink size={14} aria-hidden />
            </a>
          </Glass>
        ))}
      </div>

      <p className="tiny muted mt-5" style={{ maxWidth: "80ch" }}>
        Only central government programmes with an official portal are listed. State-specific schemes, private insurance and hospital charity programmes
        are outside this list. Confirm details at the nearest public health facility or on the official portal.
      </p>
    </div>
  );
}
