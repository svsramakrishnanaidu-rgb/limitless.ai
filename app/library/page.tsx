"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Bookmark, Search } from "lucide-react";
import { ARTICLES, ARTICLE_CATEGORIES } from "@/lib/content/articles";
import { Glass, PageHeader, EmptyState } from "@/components/ui";
import { useSaved } from "@/lib/health";

export default function LibraryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const { toggle, has } = useSaved();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES.filter((a) => {
      const matchesCategory = category === "All" || a.category === category;
      const matchesQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.traditionalUses.some((u) => u.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div>
      <PageHeader
        eyebrow="Traditional healthcare library"
        title="Knowledge with its context intact"
        description="Each entry separates historical and cultural practice from current evidence, and lists risks, contraindications and sources."
      />

      <div className="mb-5 flex flex-col gap-3">
        <div className="relative max-w-xl">
          <Search size={16} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
          <input
            type="search"
            className="field"
            style={{ paddingLeft: "2.4rem" }}
            placeholder="Search Ayurveda, herbs, yoga, hygiene…"
            aria-label="Search the traditional healthcare library"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button type="button" className="chip" data-active={category === "All"} onClick={() => setCategory("All")}>
            All ({ARTICLES.length})
          </button>
          {ARTICLE_CATEGORIES.map((c) => {
            const count = ARTICLES.filter((a) => a.category === c).length;
            if (!count) return null;
            return (
              <button key={c} type="button" className="chip" data-active={category === c} onClick={() => setCategory(c)}>
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Glass className="card-pad">
          <EmptyState
            icon={<Search size={18} aria-hidden />}
            title="No entries match that search"
            description="Try a broader term, or search the medicinal plants section."
          />
        </Glass>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((article) => (
            <Glass key={article.slug} interactive className="card-pad flex h-full flex-col">
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className="badge badge-gold">{article.category}</span>
                <button
                  type="button"
                  className="icon-button"
                  style={{ width: 32, height: 32 }}
                  aria-label={has("article", article.slug) ? `Remove ${article.title} from saved` : `Save ${article.title}`}
                  aria-pressed={has("article", article.slug)}
                  onClick={() => toggle({ type: "article", slug: article.slug, title: article.title })}
                >
                  <Bookmark
                    size={14}
                    aria-hidden
                    fill={has("article", article.slug) ? "var(--gold)" : "none"}
                    color={has("article", article.slug) ? "var(--gold)" : "currentColor"}
                  />
                </button>
              </div>
              <Link href={`/library/${article.slug}`} className="flex flex-1 flex-col">
                <h2 className="brand-serif text-[1.2rem] leading-snug">{article.title}</h2>
                <p className="small muted mt-1.5 flex-1" style={{ lineHeight: 1.5 }}>{article.summary}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="tiny muted">{article.evidenceLevel} · {article.readingMinutes} min</span>
                  <ArrowUpRight size={15} aria-hidden style={{ color: "var(--gold)" }} />
                </div>
              </Link>
            </Glass>
          ))}
        </div>
      )}

      <p className="tiny muted mt-6" style={{ maxWidth: "80ch" }}>
        Library content is educational. Evidence levels reflect published research as of the review date and can change. Nothing here is a prescription,
        and no entry recommends replacing proven treatment with a traditional remedy.
      </p>
    </div>
  );
}
