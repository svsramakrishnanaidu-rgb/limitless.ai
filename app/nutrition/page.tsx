"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Bookmark, Download, Leaf, UtensilsCrossed } from "lucide-react";
import { COOKING_PRACTICES, NUTRITION_DISCLAIMER, RECIPES, SEASONAL_FOODS, type Recipe } from "@/lib/content/nutrition";
import { Glass, Modal, PageHeader, Tabs, Callout, Disclaimer } from "@/components/ui";
import { useSaved } from "@/lib/health";
import { useStored } from "@/lib/store";
import { useToast } from "@/components/providers";
import type { DownloadItem } from "@/lib/types";

type DietFilter = "All" | "Vegetarian" | "Non-vegetarian" | "Vegan";

export default function NutritionPage() {
  const [diet, setDiet] = useState<DietFilter>("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Recipe | null>(null);
  const { toggle, has } = useSaved();
  const [downloads, setDownloads] = useStored<DownloadItem[]>("downloads", []);
  const toast = useToast();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RECIPES.filter((r) => {
      if (diet !== "All" && r.diet !== diet) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.toLowerCase().includes(q))
      );
    });
  }, [diet, query]);

  const download = (recipe: Recipe) => {
    if (downloads.some((d) => d.type === "recipe" && d.slug === recipe.slug)) {
      toast.push("This recipe is already offline.", "info");
      return;
    }
    setDownloads((prev) => [
      { id: `recipe-${recipe.slug}`, slug: recipe.slug, type: "recipe", title: recipe.name, savedAt: new Date().toISOString() },
      ...prev,
    ]);
    toast.push(`${recipe.name} added to your offline library.`, "success");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Traditional nutrition"
        title="Everyday food, plainly explained"
        description="Home recipes with approximate nutrition, seasonal produce guidance and food-safety practices. No detox or immunity-cure claims."
        actions={
          <Link href="/tracker" className="ghost-button">
            <UtensilsCrossed size={15} aria-hidden /> Log water intake
          </Link>
        }
      />

      <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Tabs
            label="Diet filter"
            value={diet}
            onChange={setDiet}
            options={[
              { value: "All", label: "All recipes" },
              { value: "Vegetarian", label: "Vegetarian" },
              { value: "Vegan", label: "Vegan" },
              { value: "Non-vegetarian", label: "Non-vegetarian" },
            ]}
          />
        </div>
        <input
          className="field max-w-md"
          type="search"
          placeholder="Search recipes or ingredients"
          aria-label="Search recipes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((recipe) => (
          <Glass key={recipe.slug} interactive className="card-pad flex h-full flex-col">
            <div
              className="mb-3 flex h-20 items-end justify-between rounded-xl p-3"
              style={{
                border: "1px solid var(--line)",
                background: "radial-gradient(circle at 75% 25%, rgba(185,144,218,0.18), transparent 65%), rgba(109,0,26,0.1)",
              }}
            >
              <span className="badge badge-green">{recipe.diet}</span>
              <span className="tiny muted">{recipe.minutes} min</span>
            </div>
            <h2 className="brand-serif text-[1.15rem] leading-snug">{recipe.name}</h2>
            <p className="tiny muted mt-0.5">{recipe.region} · {recipe.season}</p>
            <p className="small muted mt-2 flex-1" style={{ lineHeight: 1.5 }}>{recipe.summary}</p>
            <p className="tiny muted mt-2">
              ≈ {recipe.nutrition.kcal} kcal · {recipe.nutrition.protein} g protein per serving
            </p>
            <div className="mt-3 flex gap-1.5">
              <button type="button" className="gold-button flex-1" onClick={() => setOpen(recipe)}>View recipe</button>
              <button
                type="button"
                className="icon-button"
                aria-label={has("recipe", recipe.slug) ? `Remove ${recipe.name} from saved` : `Save ${recipe.name}`}
                aria-pressed={has("recipe", recipe.slug)}
                onClick={() => toggle({ type: "recipe", slug: recipe.slug, title: recipe.name })}
              >
                <Bookmark size={15} aria-hidden fill={has("recipe", recipe.slug) ? "var(--gold)" : "none"} color={has("recipe", recipe.slug) ? "var(--gold)" : "currentColor"} />
              </button>
            </div>
          </Glass>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Glass className="card-pad">
          <h2 className="section-title mb-2 flex items-center gap-2"><Leaf size={16} aria-hidden /> Seasonal guidance</h2>
          <div className="flex flex-col gap-3">
            {SEASONAL_FOODS.map((season) => (
              <div key={season.season}>
                <p className="font-medium text-sm">{season.season}</p>
                <p className="small muted" style={{ lineHeight: 1.55 }}>{season.guidance}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {season.foods.map((food) => <span key={food} className="badge">{food}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Glass>

        <Glass className="card-pad">
          <h2 className="section-title mb-2">Healthy cooking practices</h2>
          <ul className="med-prose small list-disc pl-5">
            {COOKING_PRACTICES.map((practice) => <li key={practice}>{practice}</li>)}
          </ul>
          <Callout tone="info" title="Water and meals">
            Water needs vary with climate, activity and health. Use the tracker to log what you actually drink, and follow clinician advice if you have
            heart or kidney disease where fluid intake may be restricted.
          </Callout>
        </Glass>
      </div>

      <Disclaimer>{NUTRITION_DISCLAIMER}</Disclaimer>

      <Modal open={Boolean(open)} onClose={() => setOpen(null)} title={open ? open.name : ""} wide footer={
        open ? (
          <>
            <button type="button" className="ghost-button" onClick={() => download(open)}>
              <Download size={15} aria-hidden /> {downloads.some((d) => d.type === "recipe" && d.slug === open.slug) ? "Offline" : "Save offline"}
            </button>
            <button type="button" className="gold-button" onClick={() => setOpen(null)}>Close</button>
          </>
        ) : null
      }>
        {open && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-green">{open.diet}</span>
              <span className="badge">{open.region}</span>
              <span className="badge">{open.minutes} min</span>
              <span className="badge">Serves {open.servings}</span>
            </div>

            <div>
              <p className="eyebrow mb-1">Ingredients</p>
              <ul className="med-prose small list-disc pl-5">
                {open.ingredients.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>

            <div>
              <p className="eyebrow mb-1">Method</p>
              <ol className="med-prose small list-decimal pl-5">
                {open.steps.map((s) => <li key={s} className="my-1">{s}</li>)}
              </ol>
            </div>

            <div>
              <p className="eyebrow mb-2">Approximate nutrition per serving</p>
              <table className="data-table">
                <tbody>
                  <tr><th>Energy</th><td>{open.nutrition.kcal} kcal</td></tr>
                  <tr><th>Protein</th><td>{open.nutrition.protein} g</td></tr>
                  <tr><th>Carbohydrate</th><td>{open.nutrition.carbs} g</td></tr>
                  <tr><th>Fat</th><td>{open.nutrition.fat} g</td></tr>
                  <tr><th>Fibre</th><td>{open.nutrition.fibre} g</td></tr>
                </tbody>
              </table>
              <p className="tiny muted mt-2">Calculated from standard composition tables for the listed quantities. Values vary with brands, portion size and cooking method.</p>
            </div>

            {open.allergens.length > 0 && (
              <Callout tone="warning" title="Allergens">
                {open.allergens.join(" · ")}
              </Callout>
            )}

            <div>
              <p className="eyebrow mb-1">Note</p>
              <p className="small" style={{ lineHeight: 1.6 }}>{open.notes}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
