"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { COMPARISONS } from "@/lib/content/compare";
import { Glass, PageHeader, Tabs, Callout } from "@/components/ui";

export default function ComparePage() {
  const [slug, setSlug] = useState(COMPARISONS[0].slug);
  const comparison = COMPARISONS.find((c) => c.slug === slug) ?? COMPARISONS[0];

  return (
    <div>
      <PageHeader
        eyebrow="Traditional and modern healthcare"
        title="Two systems, compared honestly"
        description="Neither system is universally superior. This comparison separates what each does well from what it cannot do."
      />

      <div className="mb-5">
        <Tabs
          label="Comparison"
          value={slug}
          onChange={setSlug}
          options={COMPARISONS.map((c) => ({ value: c.slug, label: c.title }))}
        />
      </div>

      <Glass className="card-pad mb-4">
        <p className="small" style={{ lineHeight: 1.7 }}>{comparison.intro}</p>
      </Glass>

      <div className="overflow-x-auto">
        <Glass className="min-w-[720px]">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "18%" }}>Dimension</th>
                <th style={{ width: "41%" }}>{comparison.traditionalLabel}</th>
                <th style={{ width: "41%" }}>{comparison.modernLabel}</th>
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row) => (
                <tr key={row.dimension}>
                  <th scope="row" style={{ fontSize: "0.78rem" }}>{row.dimension}</th>
                  <td style={{ lineHeight: 1.55 }}>{row.traditional}</td>
                  <td style={{ lineHeight: 1.55 }}>{row.modern}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Glass>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <Callout tone="warning" title="Bottom line">{comparison.bottomLine}</Callout>
        <Glass className="card-pad">
          <h2 className="section-title mb-2">Sources</h2>
          <ul className="flex flex-col gap-2">
            {comparison.references.map((ref) => (
              <li key={ref.url}>
                <a href={ref.url} target="_blank" rel="noopener noreferrer nofollow" className="small flex items-start gap-1.5 hover:underline" style={{ color: "var(--gold)" }}>
                  {ref.title} <ExternalLink size={12} aria-hidden className="mt-1 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </Glass>
      </div>
    </div>
  );
}
