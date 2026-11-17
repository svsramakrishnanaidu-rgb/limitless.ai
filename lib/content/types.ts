export type Reference = { title: string; publisher: string; url: string };

export type EvidenceLevel =
  | "Established"
  | "Moderate, limited trials"
  | "Early or limited"
  | "Traditional use only"
  | "Contested";

export type ArticleCategory =
  | "Ayurveda"
  | "Siddha"
  | "Unani"
  | "Yoga & Naturopathy"
  | "Traditional Chinese Medicine"
  | "Herbal knowledge"
  | "Preventive care"
  | "Traditional nutrition"
  | "Cultural history"
  | "Personal hygiene";

export type Article = {
  slug: string;
  title: string;
  category: ArticleCategory;
  summary: string;
  overview: string;
  history: string;
  traditionalUses: string[];
  evidence: string;
  evidenceLevel: EvidenceLevel;
  benefits: string[];
  risks: string[];
  contraindications: string[];
  interactions: string[];
  references: Reference[];
  lastReviewed: string;
  readingMinutes: number;
};
