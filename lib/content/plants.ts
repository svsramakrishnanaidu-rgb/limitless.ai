import type { Reference } from "./types";

export type Plant = {
  slug: string;
  commonName: string;
  scientificName: string;
  family: string;
  regionalNames: { language: string; name: string }[];
  summary: string;
  description: string;
  traditionalUses: string[];
  evidence: string;
  toxicity: string;
  safety: string[];
  lookalikes: { name: string; risk: string; note: string }[];
  partsUsed: string[];
  reference: Reference[];
  danger?: boolean;
};

const refs = {
  msk: {
    title: "About Herbs, Botanicals and Other Products",
    publisher: "Memorial Sloan Kettering Cancer Center",
    url: "https://www.mskcc.org/cancer-care/integrative-medicine/herbs",
  },
  nccih: {
    title: "Herbs at a Glance",
    publisher: "National Center for Complementary and Integrative Health (NIH)",
    url: "https://www.nccih.nih.gov/health/herbsataglance",
  },
  plantsOfTheWorld: {
    title: "Plants of the World Online",
    publisher: "Royal Botanic Gardens, Kew",
    url: "https://powo.science.kew.org/",
  },
  poison: {
    title: "Poisonous plants — clinical resources",
    publisher: "US National Library of Medicine (PubMed)",
    url: "https://pubmed.ncbi.nlm.nih.gov/?term=poisonous+plants+review",
  },
} satisfies Record<string, Reference>;

export const PLANTS: Plant[] = [
  {
    slug: "tulasi",
    commonName: "Tulasi / holy basil",
    scientificName: "Ocimum tenuiflorum",
    family: "Lamiaceae (mint family)",
    regionalNames: [
      { language: "Telugu", name: "తులసి" },
      { language: "Hindi", name: "तुलसी" },
      { language: "Tamil", name: "துளசி" },
      { language: "Kannada", name: "ತುಳಸಿ" },
    ],
    summary: "Aromatic shrub with purple-green leaves and small flower spikes; a household culinary and devotional herb.",
    description:
      "A branched shrub growing 30 to 60 cm, with opposite, softly hairy, oval leaves and small purple flowers in elongated spikes. Leaves are strongly aromatic when crushed. Commonly grown in courtyards and pots across South Asia.",
    traditionalUses: [
      "Leaf tea for cough and cold comfort.",
      "Culinary use in teas and drinks.",
      "Traditional household remedy for throat irritation.",
    ],
    evidence:
      "Small trials report possible reductions in perceived stress and modest effects on glucose. Not established as a treatment for any disease.",
    toxicity:
      "Generally low at culinary amounts. Essential oil is concentrated and must not be swallowed. Theoretical blood-sugar and bleeding effects at supplemental doses.",
    safety: [
      "Culinary amounts are generally considered safe for most adults.",
      "Avoid concentrated supplements in pregnancy and breastfeeding.",
      "Monitor blood sugar if you take diabetes medicines.",
      "Stop supplements 2 weeks before surgery.",
    ],
    lookalikes: [
      { name: "Sweet basil (Ocimum basilicum)", risk: "Low", note: "Culinary basil; different aroma, no significant toxicity." },
      { name: "Perilla (Perilla frutescens)", risk: "Low", note: "Similar leaf shape, different family; used as a culinary herb." },
    ],
    partsUsed: ["Leaves", "Flowering tops"],
    reference: [refs.msk, refs.plantsOfTheWorld],
  },
  {
    slug: "ashwagandha",
    commonName: "Ashwagandha",
    scientificName: "Withania somnifera",
    family: "Solanaceae (nightshade family)",
    regionalNames: [
      { language: "Telugu", name: "అశ్వగంధ" },
      { language: "Hindi", name: "अश्वगंधा" },
      { language: "Tamil", name: "அமுக்கரா" },
      { language: "Sanskrit", name: "अश्वगन्धा" },
    ],
    summary: "Small grey-green shrub with dull red berries; the root is the part used in traditional preparations.",
    description:
      "An erect, branching shrub 30 to 150 cm tall with ovate, grey-green leaves and small bell-shaped greenish flowers followed by orange-red berries enclosed in a papery calyx. The root is thick and fleshy. Native to dry regions of India, the Middle East and parts of Africa.",
    traditionalUses: [
      "Root decoction as a restorative tonic.",
      "Support for sleep and recovery in Ayurveda.",
      "Ingredient in joint and vitality formulations.",
    ],
    evidence:
      "Small trials suggest modest improvements in perceived stress and sleep. Liver injury case reports exist. Not a treatment for thyroid disease or anxiety disorders.",
    toxicity:
      "Low to moderate. Documented rare hepatotoxicity. May increase thyroid hormone levels. Not for use in pregnancy.",
    safety: [
      "Avoid in pregnancy and breastfeeding.",
      "Avoid with liver disease or a history of drug-induced liver injury.",
      "Use caution with thyroid disorders and autoimmune disease.",
      "Stop before surgery.",
    ],
    lookalikes: [
      {
        name: "Physalis species (ground cherry)",
        risk: "Moderate",
        note: "Same family with papery calyces and orange fruit; some species are unripe and toxic. Do not harvest roots from the wild for medicine.",
      },
    ],
    partsUsed: ["Root", "Leaves (less commonly)"],
    reference: [refs.nccih, refs.plantsOfTheWorld],
  },
  {
    slug: "turmeric",
    commonName: "Turmeric",
    scientificName: "Curcuma longa",
    family: "Zingiberaceae (ginger family)",
    regionalNames: [
      { language: "Telugu", name: "పసుపు" },
      { language: "Hindi", name: "हल्दी" },
      { language: "Tamil", name: "மஞ்சள்" },
      { language: "Kannada", name: "ಅರಿಶಿನ" },
    ],
    summary: "Rhizome with bright orange flesh, large leaves and pale flower spikes; a staple culinary spice.",
    description:
      "A herbaceous perennial with large, oblong leaves and a thick, branched, orange-yellow rhizome. Flowers are pale yellow with pink-tipped bracts. Grown widely across tropical Asia; the rhizome is harvested, boiled and dried.",
    traditionalUses: [
      "Culinary spice and food colouring.",
      "Warm milk preparation for throat comfort.",
      "Paste for minor skin irritation.",
    ],
    evidence:
      "Curcumin extracts show small short-term benefit in knee osteoarthritis trials. High-dose extracts have been linked to liver injury. Culinary use is not a treatment.",
    toxicity:
      "Low culinary toxicity. High-dose extracts can cause GI upset, bleeding risk and rare liver injury.",
    safety: [
      "Avoid concentrated extracts with gallstones or bile duct obstruction.",
      "Use caution with anticoagulants.",
      "Avoid high-dose supplements in pregnancy.",
      "Piperine-boosted products increase absorption of other medicines too.",
    ],
    lookalikes: [
      { name: "Zedoary (Curcuma zedoaria)", risk: "Low", note: "Related rhizome with pale flesh; used in some regional cooking." },
      { name: "Mango ginger (Curcuma amada)", risk: "Low", note: "Related rhizome with a raw-mango aroma." },
    ],
    partsUsed: ["Rhizome"],
    reference: [refs.nccih, refs.plantsOfTheWorld],
  },
  {
    slug: "neem",
    commonName: "Neem",
    scientificName: "Azadirachta indica",
    family: "Meliaceae (mahogany family)",
    regionalNames: [
      { language: "Telugu", name: "వేప" },
      { language: "Hindi", name: "नीम" },
      { language: "Tamil", name: "வேம்பு" },
      { language: "Kannada", name: "ಬೇವು" },
    ],
    summary: "Fast-growing evergreen tree with toothed leaflets and small white flowers; the seed oil is highly concentrated.",
    description:
      "A large evergreen tree up to 20 m with pinnate leaves of serrated leaflets, small white fragrant flowers and yellow-green oval fruit. Bark is thick and dark. Native to the Indian subcontinent and widely planted in dry tropics.",
    traditionalUses: [
      "Twig used for dental cleaning.",
      "Leaf paste applied to skin.",
      "Oil used as an insect repellent.",
      "Leaf preparations for fever and digestive symptoms in traditional practice.",
    ],
    evidence:
      "Laboratory antimicrobial activity is documented. Human trials are limited, with modest results for plaque control. No reliable evidence for treating diabetes, malaria or cancer.",
    toxicity:
      "Neem oil and seed preparations are toxic if swallowed, especially to children. Leaf extracts may lower blood sugar and affect fertility in animal studies.",
    safety: [
      "Never give neem oil or leaf extract to infants or young children.",
      "Avoid internal use in pregnancy or when trying to conceive.",
      "Do not apply oil to broken skin.",
      "Keep neem oil away from children and pets.",
    ],
    lookalikes: [
      {
        name: "Chinaberry (Melia azedarach)",
        risk: "High",
        note: "Same family, similar pinnate leaves and yellow fruit. Chinaberry berries are toxic and have caused poisoning in children. Do not harvest neem leaves or fruit without expert identification.",
      },
    ],
    partsUsed: ["Leaves", "Bark", "Seed oil"],
    reference: [refs.nccih, refs.poison],
  },
  {
    slug: "aloe-vera",
    commonName: "Aloe vera",
    scientificName: "Aloe vera",
    family: "Asphodelaceae",
    regionalNames: [
      { language: "Telugu", name: "కలబంద" },
      { language: "Hindi", name: "घृतकुमारी" },
      { language: "Tamil", name: "கற்றாழை" },
      { language: "Kannada", name: "ಲೋಳೆಸರ" },
    ],
    summary: "Succulent with thick, toothed leaves containing clear gel and a yellow latex; the latex is a strong laxative.",
    description:
      "A stemless or short-stemmed succulent with fleshy, lance-shaped leaves 30 to 60 cm long, edged with pale teeth. The clear inner gel is used topically; the yellow latex just under the skin contains anthraquinones and is a potent laxative.",
    traditionalUses: [
      "Gel applied to minor burns and sunburn.",
      "Gel used on dry skin.",
      "Latex taken as a laxative in traditional practice.",
    ],
    evidence:
      "Topical aloe gel has modest evidence for burn healing and skin hydration. Oral aloe latex is a stimulant laxative but is no longer recommended for routine use because of safety concerns. Evidence for oral aloe in diabetes or digestive disease is insufficient.",
    toxicity:
      "Topical gel is low risk. Oral latex can cause severe cramping, diarrhoea, electrolyte loss and kidney effects with chronic use.",
    safety: [
      "Do not take aloe latex orally; it is not a safe routine laxative.",
      "Avoid oral aloe in pregnancy and breastfeeding.",
      "Stop topical use if irritation develops.",
      "Check labels: 'whole leaf' products may contain latex.",
    ],
    lookalikes: [
      { name: "Agave species", risk: "Low", note: "Similar rosette form but different leaf structure; sap can irritate skin." },
      { name: "Aloe arborescens", risk: "Low", note: "Related species used similarly; not interchangeable with certified Aloe vera." },
    ],
    partsUsed: ["Inner leaf gel", "Latex (not for oral use)"],
    reference: [refs.nccih, refs.plantsOfTheWorld],
  },
  {
    slug: "brahmi",
    commonName: "Brahmi",
    scientificName: "Bacopa monnieri",
    family: "Plantaginaceae",
    regionalNames: [
      { language: "Telugu", name: "బ్రాహ్మి" },
      { language: "Hindi", name: "ब्राह्मी" },
      { language: "Tamil", name: "நீர்ப்பிரம்மி" },
      { language: "Sanskrit", name: "ब्राह्मी" },
    ],
    summary: "Low creeping wetland herb with small succulent leaves and pale blue-white flowers.",
    description:
      "A perennial creeper with opposite, spoon-shaped, fleshy leaves and small white to pale purple flowers. Roots at nodes in damp soil. Commonly found near water and in wet fields; also sold as an aquarium plant.",
    traditionalUses: [
      "Memory and concentration support in Ayurveda.",
      "Calming preparation for restlessness.",
      "Taken with ghee or milk in classical preparations.",
    ],
    evidence:
      "Small trials report modest memory improvements after 8 to 12 weeks of standardised extract. Evidence remains limited and inconsistent.",
    toxicity:
      "Low. Common side effects are digestive upset and fatigue. Rare liver enzyme elevations reported.",
    safety: [
      "Avoid in pregnancy and breastfeeding.",
      "Use caution with thyroid medicines and sedatives.",
      "Note that 'brahmi' labels sometimes contain Centella asiatica instead.",
    ],
    lookalikes: [
      {
        name: "Centella asiatica (gotu kola)",
        risk: "Low",
        note: "Also called brahmi in some regions. Different plant with different safety profile; labels are frequently confused.",
      },
      {
        name: "Water hyssop lookalikes in wet areas",
        risk: "Moderate",
        note: "Several wetland plants resemble Bacopa. Do not harvest wild plants for consumption without expert confirmation.",
      },
    ],
    partsUsed: ["Whole herb"],
    reference: [refs.nccih, refs.plantsOfTheWorld],
  },
  {
    slug: "amla",
    commonName: "Amla / Indian gooseberry",
    scientificName: "Phyllanthus emblica",
    family: "Phyllanthaceae",
    regionalNames: [
      { language: "Telugu", name: "ఉసిరి" },
      { language: "Hindi", name: "आँवला" },
      { language: "Tamil", name: "நெல்லிக்காய்" },
      { language: "Kannada", name: "ನೆಲ್ಲಿ" },
    ],
    summary: "Deciduous tree with small feathery leaves and sour, vitamin C-rich green fruit.",
    description:
      "A medium tree with light green pinnate leaves and round, ribbed, pale green to yellow fruit. The fruit is very sour and astringent, and is used fresh, dried, pickled and candied across South Asia.",
    traditionalUses: [
      "Fruit eaten fresh or as pickle and candy.",
      "Ingredient in triphala and other formulas.",
      "Hair oil preparations in some traditions.",
    ],
    evidence:
      "Amla is a genuine source of vitamin C and polyphenols. Clinical evidence for hair growth, immunity or disease prevention is limited. Vitamin C from food supports normal immune function but does not prevent all infections.",
    toxicity:
      "Low. High intakes may cause digestive upset. Dried powder is concentrated.",
    safety: [
      "Moderate amounts as food are generally safe.",
      "Use caution with anticoagulants at high supplemental doses.",
      "Avoid large supplemental doses in pregnancy without advice.",
    ],
    lookalikes: [
      { name: "Star gooseberry (Phyllanthus acidus)", risk: "Low", note: "Related sour fruit; edible but different species." },
    ],
    partsUsed: ["Fruit", "Seed", "Leaves"],
    reference: [refs.nccih, refs.plantsOfTheWorld],
  },
  {
    slug: "castor",
    commonName: "Castor",
    scientificName: "Ricinus communis",
    family: "Euphorbiaceae",
    regionalNames: [
      { language: "Telugu", name: "ఆముదం" },
      { language: "Hindi", name: "अरंडी" },
      { language: "Tamil", name: "ஆமணக்கு" },
      { language: "Kannada", name: "ಹರಳು" },
    ],
    summary: "Tall shrub with large star-shaped leaves and spiny seed capsules; the seeds contain ricin and are dangerous.",
    description:
      "A fast-growing shrub or small tree with large, deeply lobed leaves and clustered seed capsules covered in soft spines. Seeds are mottled brown and bean-like. Castor oil is pressed from the seeds and is used industrially and medicinally, but the raw seeds are toxic.",
    traditionalUses: [
      "Castor oil as a traditional laxative.",
      "Oil applied to skin and hair.",
      "Oil used in industrial lubricants and lamp fuel.",
    ],
    evidence:
      "Castor oil is an established stimulant laxative for short-term use. Ricin from castor seeds is a well-documented toxin. Castor oil packs for 'detox' have no supporting evidence.",
    toxicity:
      "High. Chewing 1 to 3 raw seeds can cause serious toxicity; ricin is among the most toxic naturally occurring substances. Castor oil itself is generally safe when taken orally in recommended doses.",
    safety: [
      "Keep seeds away from children and pets.",
      "Do not chew or eat raw castor seeds.",
      "Do not use castor oil as a routine laxative in pregnancy or with bowel obstruction.",
      "Seek emergency care immediately if seeds are swallowed.",
    ],
    lookalikes: [
      {
        name: "Jatropha (Jatropha curcas)",
        risk: "High",
        note: "Similar growth habit and seed capsules; seeds are also toxic. Both are used as biofuel crops and are not food.",
      },
    ],
    partsUsed: ["Oil from seeds"],
    reference: [refs.poison, refs.plantsOfTheWorld],
    danger: true,
  },
  {
    slug: "datura",
    commonName: "Datura / thorn apple",
    scientificName: "Datura stramonium",
    family: "Solanaceae",
    regionalNames: [
      { language: "Telugu", name: "ఉమ్మెత్త" },
      { language: "Hindi", name: "धतूरा" },
      { language: "Tamil", name: "ஊமத்தை" },
      { language: "Kannada", name: "ಉಮ್ಮತ್ತಿ" },
    ],
    summary: "Poisonous plant with large trumpet flowers and spiny fruit; contains tropane alkaloids that can cause delirium and death.",
    description:
      "An annual herb 60 to 120 cm tall with large, jagged leaves, white or purple trumpet-shaped flowers and egg-shaped fruit covered in sharp spines. All parts contain tropane alkaloids. It grows in disturbed ground and is sometimes found near villages.",
    traditionalUses: [
      "Historically used in some traditional preparations in strictly controlled doses.",
      "Smoked in some cultural practices.",
      "Applied externally in limited traditional use.",
    ],
    evidence:
      "No therapeutic role in modern medicine. Anticholinergic toxicity is well documented and can be fatal. There is no safe home use.",
    toxicity:
      "Very high. Symptoms include dry mouth, dilated pupils, agitation, hallucinations, seizures, arrhythmia and coma. Children are especially at risk from the sweet-smelling flowers and seed pods.",
    safety: [
      "Do not handle, taste or prepare any part of this plant.",
      "Seek emergency care for any suspected ingestion.",
      "Remove plants from areas where children play.",
      "Do not use 'traditional' datura preparations.",
    ],
    lookalikes: [
      { name: "Brugmansia (angel's trumpet)", risk: "High", note: "Related ornamental with hanging trumpet flowers; equally toxic." },
      { name: "Edible Solanaceae such as tomato and brinjal", risk: "High", note: "Same family; never identify by family resemblance alone." },
    ],
    partsUsed: ["None — toxic"],
    reference: [refs.poison, refs.plantsOfTheWorld],
    danger: true,
  },
  {
    slug: "oleander",
    commonName: "Oleander",
    scientificName: "Nerium oleander",
    family: "Apocynaceae",
    regionalNames: [
      { language: "Telugu", name: "గన్నేరు" },
      { language: "Hindi", name: "कनेर" },
      { language: "Tamil", name: "அரளி" },
      { language: "Kannada", name: "ಕಣಗಿಲೆ" },
    ],
    summary: "Common ornamental shrub with pink or white flowers; all parts contain cardiac glycosides and are highly toxic.",
    description:
      "An evergreen shrub 2 to 5 m tall with narrow, leathery leaves and clusters of five-petalled flowers in pink, white or red. All parts, including smoke from burning, contain oleandrin and related cardiac glycosides.",
    traditionalUses: [
      "Ornamental planting only.",
      "Historically used externally in some traditions; internal use has caused deaths.",
    ],
    evidence:
      "No established therapeutic use. Cardiac glycoside poisoning from oleander is well documented, including fatal cases and poisoning from honey made from oleander nectar.",
    toxicity:
      "Very high. Causes nausea, vomiting, abdominal pain, slow or irregular heartbeat, and can be fatal. Even a small amount of leaf can poison a child.",
    safety: [
      "Do not eat any part; do not use twigs as skewers or toothbrushes.",
      "Do not burn: smoke is irritating and toxic.",
      "Keep children and pets away; do not plant where livestock graze.",
      "Seek emergency care for any suspected ingestion.",
    ],
    lookalikes: [
      { name: "Plumeria (frangipani)", risk: "Low", note: "Similar flowers, different leaves; not a substitute but not highly toxic." },
      { name: "Edible greens with narrow leaves", risk: "High", note: "Never forage leafy greens near ornamental oleander." },
    ],
    partsUsed: ["None — toxic"],
    reference: [refs.poison, refs.plantsOfTheWorld],
    danger: true,
  },
];

export function getPlant(slug: string) {
  return PLANTS.find((p) => p.slug === slug);
}
