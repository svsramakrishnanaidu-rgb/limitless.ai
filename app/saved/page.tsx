"use client";

import Link from "next/link";
import { Bookmark, Download, Trash2 } from "lucide-react";
import { Glass, PageHeader, EmptyState } from "@/components/ui";
import { useSaved } from "@/lib/health";
import { getArticle } from "@/lib/content/articles";
import { getPlant } from "@/lib/content/plants";
import { RECIPES } from "@/lib/content/nutrition";
import { prettyDate } from "@/lib/store";

const TYPE_LABEL: Record<string, string> = {
  article: "Library article",
  plant: "Plant",
  recipe: "Recipe",
  lesson: "Lesson",
};

function hrefFor(type: string, slug: string) {
  if (type === "plant") return "/plants";
  if (type === "recipe") return "/nutrition";
  return `/library/${slug}`;
}

export default function SavedPage() {
  const { items, remove } = useSaved();

  return (
    <div>
      <PageHeader
        eyebrow="Saved content"
        title="Everything you kept"
        description="Saved articles, plants and recipes are stored on this device. Downloading adds them to the offline library."
      />

      {items.length === 0 ? (
        <Glass className="card-pad">
          <EmptyState
            icon={<Bookmark size={18} aria-hidden />}
            title="Nothing saved yet"
            description="Use the bookmark icon on any article, plant or recipe."
            action={<Link href="/library" className="gold-button">Browse the library</Link>}
          />
        </Glass>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const article = item.type === "article" ? getArticle(item.slug) : undefined;
            const plant = item.type === "plant" ? getPlant(item.slug) : undefined;
            const recipe = item.type === "recipe" ? RECIPES.find((r) => r.slug === item.slug) : undefined;
            const subtitle = article?.summary ?? plant?.scientificName ?? recipe?.region ?? "";
            return (
              <Glass key={item.id} className="card-pad flex flex-wrap items-center gap-3">
                <span className="nav-medallion shrink-0" aria-hidden><Bookmark size={14} /></span>
                <div className="min-w-0 flex-1">
                  <p className="tiny uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    {TYPE_LABEL[item.type] ?? item.type} · saved {prettyDate(item.savedAt.slice(0, 10))}
                  </p>
                  <Link href={hrefFor(item.type, item.slug)} className="brand-serif text-lg hover:underline">
                    {item.title}
                  </Link>
                  {subtitle && <p className="tiny muted" style={{ lineHeight: 1.5 }}>{subtitle}</p>}
                </div>
                <div className="flex gap-1.5">
                  <Link href={hrefFor(item.type, item.slug)} className="ghost-button" style={{ minHeight: 36, paddingInline: 12 }}>
                    <Download size={13} aria-hidden /> Open
                  </Link>
                  <button
                    type="button"
                    className="icon-button"
                    style={{ width: 36, height: 36 }}
                    aria-label={`Remove ${item.title} from saved`}
                    onClick={() => remove(item.id)}
                  >
                    <Trash2 size={14} aria-hidden />
                  </button>
                </div>
              </Glass>
            );
          })}
        </div>
      )}
    </div>
  );
}
