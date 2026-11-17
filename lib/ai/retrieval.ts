import { ARTICLES } from "../content/articles";
import { PLANTS } from "../content/plants";

/**
 * Lightweight lexical retrieval. It is deliberately not an embedding model:
 * the corpus is small, the content is curated, and lexical scoring keeps the
 * prompt short without adding a vector database that this deployment does not
 * have. Swapping in pgvector later only requires replacing `score`.
 */

const STOPWORDS = new Set([
  "the", "and", "for", "with", "what", "does", "how", "can", "should", "is", "are", "of", "to", "a",
  "an", "in", "on", "it", "this", "that", "my", "me", "i", "you", "about", "tell", "please", "there",
  "any", "do", "be", "is", "was", "were", "have", "has", "had", "will", "would", "could", "from",
]);

function terms(query: string): string[] {
  return Array.from(
    new Set(
      query
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, " ")
        .split(/\s+/)
        .filter((t) => t.length > 2 && !STOPWORDS.has(t))
    )
  ).slice(0, 24);
}

function score(haystack: string, needles: string[], weight: number): number {
  const text = haystack.toLowerCase();
  return needles.reduce((sum, needle) => (text.includes(needle) ? sum + weight : sum), 0);
}

export function retrieveContext(query: string): string {
  const needles = terms(query);
  if (needles.length === 0) return "";

  const rankedArticles = ARTICLES.map((article) => ({
    article,
    score:
      score(article.title, needles, 6) +
      score(article.summary, needles, 3) +
      score(article.category, needles, 2) +
      score(article.traditionalUses.join(" "), needles, 1),
  }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const rankedPlants = PLANTS.map((plant) => ({
    plant,
    score:
      score(plant.commonName, needles, 6) +
      score(plant.scientificName, needles, 5) +
      score(`${plant.summary} ${plant.toxicity}`, needles, 2) +
      score(plant.regionalNames.map((r) => r.name).join(" "), needles, 3),
  }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (rankedArticles.length === 0 && rankedPlants.length === 0) {
    return "No specific entry in the reviewed library matched this question. Answer from established general medical knowledge and state clearly when something is uncertain.";
  }

  const articleBlock = rankedArticles
    .map(
      ({ article }) =>
        `- ${article.title} (${article.category}). Evidence: ${article.evidenceLevel}; reviewed ${article.lastReviewed}. ${article.summary} Key risks: ${article.risks[0] ?? "none listed"}.`
    )
    .join("\n");

  const plantBlock = rankedPlants
    .map(
      ({ plant }) =>
        `- ${plant.commonName} / ${plant.scientificName}. Toxicity: ${plant.toxicity.slice(0, 220)} Safety: ${plant.safety[0] ?? "not listed"}`
    )
    .join("\n");

  return [articleBlock && `LIBRARY\n${articleBlock}`, plantBlock && `PLANTS\n${plantBlock}`]
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Simple, explainable triage: short everyday questions can use a fast model;
 * longer or safety-sensitive questions get the stronger default provider.
 */
export function classifyComplexity(query: string): "simple" | "complex" {
  const q = query.toLowerCase();
  if (q.length > 260) return "complex";
  const complexSignals = [
    "interact", "interaction", "dose", "dosage", "pregnan", "breastfeed", "child", "infant",
    "kidney", "liver", "cancer", "diabet", "blood pressure", "warfarin", "anticoagul",
    "mechanism", "evidence", "study", "trial", "compare", "differential", "toxicity",
    "side effect", "adverse", "contraindicat", "emergency", "overdose", "poison",
  ];
  if (complexSignals.some((signal) => q.includes(signal))) return "complex";
  return "simple";
}
