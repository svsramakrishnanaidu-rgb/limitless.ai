export type ComparisonRow = { dimension: string; traditional: string; modern: string };

export type Comparison = {
  slug: string;
  title: string;
  traditionalLabel: string;
  modernLabel: string;
  intro: string;
  rows: ComparisonRow[];
  bottomLine: string;
  references: { title: string; url: string }[];
};

export const COMPARISONS: Comparison[] = [
  {
    slug: "ayurveda-vs-modern",
    title: "Ayurveda and modern medicine",
    traditionalLabel: "Ayurveda",
    modernLabel: "Modern medicine",
    intro:
      "These are different knowledge systems with different goals and standards of proof. Ayurveda offers a lifestyle framework and herbal materia medica; modern medicine is built on controlled trials, regulatory approval and physiological mechanisms.",
    rows: [
      {
        dimension: "Historical background",
        traditional: "Compiled in classical Sanskrit texts from roughly the early centuries CE; transmitted through lineages and formalised in India after 1947.",
        modern: "Developed in Europe and North America from the eighteenth century onward, building on anatomy, pathology and controlled experimentation.",
      },
      {
        dimension: "Treatment philosophy",
        traditional: "Balance of vata, pitta and kapha; individual constitution and digestive capacity guide diet, routine and herbs.",
        modern: "Diagnosis of specific disease processes, then intervention targeted at mechanisms, pathogens or symptoms.",
      },
      {
        dimension: "Diagnostic approach",
        traditional: "Pulse, tongue, history, observation and constitution assessment; not standardised across practitioners.",
        modern: "History, examination, laboratory tests, imaging, and pathology where indicated.",
      },
      {
        dimension: "Scientific evidence",
        traditional: "Limited and mostly small trials of individual herbs; compound formulations rarely validated.",
        modern: "Tiered evidence from randomised trials, systematic reviews and regulatory review, though many treatments remain uncertain.",
      },
      {
        dimension: "Common uses",
        traditional: "Lifestyle and dietary advice, digestive complaints, sleep, stress, joint comfort, convalescence.",
        modern: "Acute infections, surgery, trauma, cancer, chronic disease management, vaccination, emergency care.",
      },
      {
        dimension: "Safety profile",
        traditional: "Variable. Some preparations contain heavy metals; herb-drug interactions and contamination are documented.",
        modern: "Adverse effects are documented and monitored through pharmacovigilance, with dosing and interactions characterised.",
      },
      {
        dimension: "Regulation",
        traditional: "Regulated in India through AYUSH councils and state boards; product quality varies widely.",
        modern: "Licensed practitioners, approved medicines, marketing authorisation and post-market surveillance.",
      },
      {
        dimension: "Where it can complement care",
        traditional: "Diet quality, sleep routines, stress reduction, and supportive care alongside conventional treatment, with clinician knowledge.",
        modern: "Acute and emergency care, prevention through vaccination and screening, and disease-specific treatment.",
      },
      {
        dimension: "When to seek professional care",
        traditional: "Any persistent, severe or worsening symptom; pregnancy; children; people on prescription medicines.",
        modern: "Always for red-flag symptoms; modern care is the default for emergencies.",
      },
    ],
    bottomLine:
      "Neither system is universally superior. Ayurveda is not a substitute for emergency care, vaccination, antibiotics for bacterial infection, or treatment of cancer, diabetes and heart disease. If you use Ayurvedic preparations alongside prescribed medicines, tell both practitioners.",
    references: [
      { title: "NCCIH — Ayurvedic Medicine: In Depth", url: "https://www.nccih.nih.gov/health/ayurvedic-medicine-in-depth" },
      { title: "WHO — Traditional, Complementary and Integrative Medicine", url: "https://www.who.int/health-topics/traditional-complementary-and-integrative-medicine" },
    ],
  },
  {
    slug: "tcm-vs-modern",
    title: "Traditional Chinese medicine and modern medicine",
    traditionalLabel: "Traditional Chinese medicine",
    modernLabel: "Modern medicine",
    intro:
      "TCM includes acupuncture, herbal formulas and movement practices. Acupuncture has been studied far more than most traditional interventions, while herbal formulas remain difficult to evaluate because of variable composition.",
    rows: [
      {
        dimension: "Historical background",
        traditional: "Codified in Chinese texts over more than two millennia, including the Huangdi Neijing and Shanghan Lun.",
        modern: "Emerged from nineteenth- and twentieth-century biomedical science and evidence-based practice.",
      },
      {
        dimension: "Treatment philosophy",
        traditional: "Pattern differentiation, balance of qi, yin and yang; treatment individualised to the pattern rather than a disease label.",
        modern: "Disease-specific diagnosis and mechanism-targeted treatment.",
      },
      {
        dimension: "Diagnostic approach",
        traditional: "Tongue, pulse, observation and symptom patterns.",
        modern: "Clinical examination, laboratory testing and imaging.",
      },
      {
        dimension: "Scientific evidence",
        traditional: "Acupuncture has a substantial trial literature with small, inconsistent effects against sham; herbal formula evidence is weaker.",
        modern: "Evidence graded by study design and consistency, with ongoing uncertainty acknowledged.",
      },
      {
        dimension: "Common uses",
        traditional: "Acupuncture for pain and nausea, herbal formulas for digestive and respiratory complaints, tai chi for balance.",
        modern: "Pharmacotherapy, surgery, rehabilitation, vaccination and emergency care.",
      },
      {
        dimension: "Safety profile",
        traditional: "Needling risks include infection and pneumothorax in untrained hands; herbal products can be contaminated or adulterated.",
        modern: "Adverse effects characterised and monitored; iatrogenic harm is also well documented.",
      },
      {
        dimension: "Regulation",
        traditional: "Varies widely by country; practitioner licensing and product quality are inconsistent.",
        modern: "Licensed practitioners and approved medicines with regulatory oversight.",
      },
      {
        dimension: "Where it can complement care",
        traditional: "Acupuncture for chemotherapy-induced nausea and some chronic pain; tai chi for falls prevention, within conventional care.",
        modern: "Diagnosis, acute care, disease-modifying treatment and prevention.",
      },
      {
        dimension: "When to seek professional care",
        traditional: "Any needling should be done by a trained practitioner with sterile equipment; avoid self-treating with herbs.",
        modern: "Emergency symptoms always require urgent medical assessment.",
      },
    ],
    bottomLine:
      "Acupuncture and tai chi have plausible roles alongside conventional care for specific problems. Herbal TCM formulas should be treated as medicines, with interaction and contamination risks, not as harmless supplements.",
    references: [
      { title: "NCCIH — Acupuncture: In Depth", url: "https://www.nccih.nih.gov/health/acupuncture-in-depth" },
      { title: "WHO — Traditional, Complementary and Integrative Medicine", url: "https://www.who.int/health-topics/traditional-complementary-and-integrative-medicine" },
    ],
  },
];
