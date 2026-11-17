"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Bookmark, Download, ExternalLink, Sparkles } from "lucide-react";
import { getArticle } from "@/lib/content/articles";
import { Glass, Callout, PageHeader, Disclaimer } from "@/components/ui";
import { useSaved } from "@/lib/health";
import { useStored, prettyDate } from "@/lib/store";
import { useToast } from "@/components/providers";
import type { DownloadItem } from "@/lib/types";

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const article = getArticle(params.slug);
  const { toggle, has } = useSaved();
  const toast = useToast();
  const [downloads, setDownloads] = useStored<DownloadItem[]>("downloads", []);

  if (!article) {
    return (
      <Glass className="card-pad">
        <PageHeader title="Article not found" description="This entry may have been renamed." />
        <Link href="/library" className="gold-button">Back to the library</Link>
      </Glass>
    );
  }

  const saved = has("article", article.slug);
  const downloaded = downloads.some((d) => d.type === "article" && d.slug === article.slug);

  const download = () => {
    if (downloaded) {
      toast.push("This article is already in your offline library.", "info");
      return;
    }
    setDownloads((prev) => [
      { id: `article-${article.slug}`, slug: article.slug, type: "article", title: article.title, savedAt: new Date().toISOString() },
      ...prev,
    ]);
    toast.push("Added to your offline library. The reading list is stored on this device.", "success");
  };

  return (
    <div className="flex flex-col gap-5">
      <Link href="/library" className="small muted flex items-center gap-1.5 hover:underline">
        <ArrowLeft size={14} aria-hidden /> Traditional healthcare library
      </Link>

      <header>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="badge badge-gold">{article.category}</span>
          <span className="badge">{article.evidenceLevel}</span>
          <span className="tiny muted">{article.readingMinutes} min read</span>
        </div>
        <h1 className="page-title">{article.title}</h1>
        <p className="lead mt-2">{article.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="ghost-button"
            onClick={() => toggle({ type: "article", slug: article.slug, title: article.title })}
            aria-pressed={saved}
          >
            <Bookmark size={15} aria-hidden fill={saved ? "var(--gold)" : "none"} color={saved ? "var(--gold)" : "currentColor"} />
            {saved ? "Saved" : "Save"}
          </button>
          <button type="button" className="ghost-button" onClick={download} aria-pressed={downloaded}>
            <Download size={15} aria-hidden /> {downloaded ? "In offline library" : "Download for offline"}
          </button>
          <Link href={`/ai?q=${encodeURIComponent(`Explain ${article.title} in simple terms`)}`} className="gold-button">
            <Sparkles size={15} aria-hidden /> Ask LIMITLESS AI
          </Link>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="flex flex-col gap-4">
          <Glass className="card-pad">
            <h2 className="section-title mb-2">Overview</h2>
            <p style={{ lineHeight: 1.7 }}>{article.overview}</p>
            <h2 className="section-title mb-2 mt-5">Historical background</h2>
            <p style={{ lineHeight: 1.7 }}>{article.history}</p>
          </Glass>

          <Glass className="card-pad">
            <h2 className="section-title mb-2">What the evidence says</h2>
            <p style={{ lineHeight: 1.7 }}>{article.evidence}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="badge badge-green">Evidence: {article.evidenceLevel}</span>
              <span className="badge">Reviewed {prettyDate(article.lastReviewed)}</span>
            </div>
          </Glass>

          <Glass className="card-pad">
            <h2 className="section-title mb-2">Traditional uses</h2>
            <ul className="med-prose list-disc pl-5">
              {article.traditionalUses.map((use) => (
                <li key={use}>{use}</li>
              ))}
            </ul>
            <p className="tiny muted mt-3">
              These are documented traditional applications. A traditional use is not evidence that the practice treats a condition.
            </p>
          </Glass>

          <Glass className="card-pad">
            <h2 className="section-title mb-2">Safety</h2>
            <h3 className="mt-3 font-semibold" style={{ fontSize: "0.95rem" }}>Known risks</h3>
            <ul className="med-prose list-disc pl-5">
              {article.risks.map((r) => <li key={r}>{r}</li>)}
            </ul>
            <h3 className="mt-4 font-semibold" style={{ fontSize: "0.95rem" }}>Contraindications</h3>
            <ul className="med-prose list-disc pl-5">
              {article.contraindications.map((c) => <li key={c}>{c}</li>)}
            </ul>
            <h3 className="mt-4 font-semibold" style={{ fontSize: "0.95rem" }}>Possible interactions</h3>
            {article.interactions.length ? (
              <ul className="med-prose list-disc pl-5">
                {article.interactions.map((i) => <li key={i}>{i}</li>)}
              </ul>
            ) : (
              <p className="small muted">No specific interactions are documented for this topic.</p>
            )}
          </Glass>
        </div>

        <aside className="flex flex-col gap-4">
          <Glass className="card-pad">
            <h2 className="section-title mb-2">Potential benefits</h2>
            <ul className="med-prose list-disc pl-5">
              {article.benefits.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </Glass>

          <Glass className="card-pad">
            <h2 className="section-title mb-2">References</h2>
            <ol className="flex flex-col gap-2.5">
              {article.references.map((ref) => (
                <li key={ref.url}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="small flex items-start gap-1.5 hover:underline"
                    style={{ color: "var(--gold)" }}
                  >
                    <span>{ref.title}</span>
                    <ExternalLink size={12} aria-hidden className="mt-1 shrink-0" />
                  </a>
                  <p className="tiny muted">{ref.publisher}</p>
                </li>
              ))}
            </ol>
          </Glass>

          <Callout tone="warning" title="Before you act on this">
            Talk to a qualified clinician or pharmacist before using any herb, supplement or traditional preparation, especially if you take prescription medicines, are pregnant or breastfeeding, or are caring for a child.
          </Callout>
        </aside>
      </div>

      <Disclaimer>
        Last reviewed {prettyDate(article.lastReviewed)}. LIMITLESS summarises published information and does not provide medical advice, diagnosis or treatment.
      </Disclaimer>
    </div>
  );
}
