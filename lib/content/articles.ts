import type { Article, Reference } from "./types";

const REF = {
  nccihAyurveda: {
    title: "Ayurvedic Medicine: In Depth",
    publisher: "National Center for Complementary and Integrative Health (NIH)",
    url: "https://www.nccih.nih.gov/health/ayurvedic-medicine-in-depth",
  },
  nccihTurmeric: {
    title: "Turmeric",
    publisher: "National Center for Complementary and Integrative Health (NIH)",
    url: "https://www.nccih.nih.gov/health/turmeric",
  },
  nccihAshwagandha: {
    title: "Ashwagandha: What the Science Says",
    publisher: "National Center for Complementary and Integrative Health (NIH)",
    url: "https://www.nccih.nih.gov/health/ashwagandha",
  },
  nccihYoga: {
    title: "Yoga: Effectiveness and Safety",
    publisher: "National Center for Complementary and Integrative Health (NIH)",
    url: "https://www.nccih.nih.gov/health/yoga",
  },
  nccihAcupuncture: {
    title: "Acupuncture: In Depth",
    publisher: "National Center for Complementary and Integrative Health (NIH)",
    url: "https://www.nccih.nih.gov/health/acupuncture-in-depth",
  },
  whoTm: {
    title: "Traditional, Complementary and Integrative Medicine",
    publisher: "World Health Organization",
    url: "https://www.who.int/health-topics/traditional-complementary-and-integrative-medicine",
  },
  ayush: {
    title: "Ministry of AYUSH — official portal",
    publisher: "Government of India",
    url: "https://ayush.gov.in/",
  },
  emaHerbal: {
    title: "Herbal medicinal products — monographs and assessment reports",
    publisher: "European Medicines Agency",
    url: "https://www.ema.europa.eu/en/medicines/herbal",
  },
  mskHolyBasil: {
    title: "Holy Basil (Tulsi) — About Herbs",
    publisher: "Memorial Sloan Kettering Cancer Center",
    url: "https://www.mskcc.org/cancer-care/integrative-medicine/herbs/holy-basil",
  },
  liverTox: {
    title: "LiverTox: clinical and research information on drug-induced liver injury",
    publisher: "US National Institute of Diabetes and Digestive and Kidney Diseases",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK547852/",
  },
  ods: {
    title: "Dietary Supplement Fact Sheets",
    publisher: "NIH Office of Dietary Supplements",
    url: "https://ods.od.nih.gov/factsheets/list-all/",
  },
  heavyMetals: {
    title: "Heavy metals in Ayurvedic medicines — published research",
    publisher: "PubMed (US National Library of Medicine)",
    url: "https://pubmed.ncbi.nlm.nih.gov/?term=heavy+metals+ayurvedic+medicines",
  },
  tcmReviews: {
    title: "Traditional Chinese medicine — published systematic reviews",
    publisher: "PubMed (US National Library of Medicine)",
    url: "https://pubmed.ncbi.nlm.nih.gov/?term=traditional+chinese+medicine+systematic+review",
  },
} satisfies Record<string, Reference>;

export const ARTICLES: Article[] = [
  {
    slug: "ayurveda",
    title: "Ayurveda: an overview",
    category: "Ayurveda",
    summary:
      "A South Asian system of health that pairs diet, daily routine, herbal preparations and seasonal practice with an individual constitution framework.",
    overview:
      "Ayurveda is a traditional medical system that developed in the Indian subcontinent over many centuries. It describes health as a balance between the body, mind and environment, and organises assessment around three functional patterns known as vata, pitta and kapha. Modern practice ranges from general lifestyle and dietary guidance to compound herbal medicines dispensed by trained practitioners.",
    history:
      "Classical texts such as the Charaka Samhita and Sushruta Samhita were compiled in the early centuries CE and remain the reference works for the system. Ayurveda spread across South and Southeast Asia, absorbed regional materia medica, and was formalised in India through the Indian Medicine Central Council Act in 1970. Today it is regulated as a recognised medical system in India with degree-level training and licensed practice.",
    traditionalUses: [
      "Diet and daily-routine counselling aligned to season and digestive capacity.",
      "Herbal formulations for digestive complaints, sleep, joint discomfort and respiratory symptoms.",
      "Oil massage, steam therapy and other external treatments in supervised settings.",
      "Preventive guidance around sleep, food timing, hygiene and exercise.",
    ],
    evidence:
      "Some individual Ayurvedic herbs and multi-herb formulations have been studied in small randomised trials, most often for joint pain, metabolic markers and stress. Systematic reviews generally rate this evidence as low to moderate quality because trials are small, products vary widely in composition and dosing, and controls differ. The constitutional framework itself has not been validated as a diagnostic system in large trials. Complex Ayurvedic preparations are not interchangeable with the single herbs studied in trials.",
    evidenceLevel: "Early or limited",
    benefits: [
      "Structured diet and lifestyle counselling that overlaps with established preventive advice.",
      "A whole-person consultation model that some patients find supportive.",
      "Several traditional herbs are being studied for specific conditions, though not yet proven as treatments.",
    ],
    risks: [
      "Some Ayurvedic preparations have been found to contain lead, mercury or arsenic. A 2008 analysis of products purchased online found detectable heavy metals in roughly one fifth of samples.",
      "Delaying effective treatment for a serious condition is the most consequential risk.",
      "Unregulated products may substitute herbs, contain undisclosed ingredients or exceed stated doses.",
      "Certain preparations are not appropriate in pregnancy, breastfeeding or children.",
    ],
    contraindications: [
      "Do not use herbal or metal-containing preparations in pregnancy or breastfeeding without a qualified clinician's approval.",
      "Avoid self-prescribing compound medicines in liver or kidney disease.",
      "Not a substitute for emergency care, vaccination, antibiotics for bacterial infection, or treatment of cancer, diabetes or heart disease.",
    ],
    interactions: [
      "Herbal preparations can interact with blood thinners, thyroid medicines, diabetes medicines, blood pressure medicines, immunosuppressants and sedatives.",
      "Some products may affect laboratory tests, including liver enzymes and blood glucose readings.",
      "Always tell every clinician and pharmacist what you are taking, including traditional preparations.",
    ],
    references: [REF.nccihAyurveda, REF.whoTm, REF.ayush, REF.heavyMetals],
    lastReviewed: "2026-11-10",
    readingMinutes: 7,
  },
  {
    slug: "siddha",
    title: "Siddha medicine",
    category: "Siddha",
    summary:
      "A Tamil tradition of medicine built around mineral, metal and herbal preparations, with a strong emphasis on diet, daily routine and the physical body.",
    overview:
      "Siddha is one of India's officially recognised traditional medical systems, practised mainly in Tamil Nadu and among Tamil-speaking communities. It shares some philosophical ground with Ayurveda but is distinguished by its extensive use of mineral and metallic preparations (called parpam, chendooram and chunnam) alongside herbal and animal-derived ingredients. Diagnosis and treatment are usually individualised by a practitioner.",
    history:
      "The tradition is attributed to the Siddhars, a group of poet-saints and physicians whose writings span several centuries. Its literature is largely in Tamil, and the practice was formalised in the twentieth century through Tamil Nadu state institutions and central regulation. The National Institute of Siddha in Chennai is the principal teaching and research institution.",
    traditionalUses: [
      "Herbal and mineral formulations for skin, respiratory, digestive and joint conditions.",
      "External therapies including oil application and specialised massage.",
      "Seasonal dietary regimens and daily routine guidance.",
      "Convalescent care after illness.",
    ],
    evidence:
      "Clinical evidence for Siddha interventions is limited. A small number of trials exist for specific formulations, mostly with methodological limitations, and there is very little independent replication. Some mineral-based preparations raise the same heavy-metal concerns documented for other traditional systems. Claims that Siddha medicine can cure diabetes, cancer or chronic kidney disease are not supported by reliable clinical evidence.",
    evidenceLevel: "Traditional use only",
    benefits: [
      "Culturally grounded, patient-centred care that can improve adherence to lifestyle advice.",
      "Some herbal ingredients are shared with systems that have been studied more extensively.",
    ],
    risks: [
      "Mineral and metallic preparations can contain lead, mercury, arsenic or gold compounds and have caused documented poisoning.",
      "Substandard or unlicensed products are a serious concern.",
      "Conditions such as diabetes and kidney disease can worsen if conventional monitoring is abandoned.",
    ],
    contraindications: [
      "Avoid metallic or mineral preparations during pregnancy, breastfeeding and childhood.",
      "Avoid in known liver or kidney impairment unless a qualified practitioner and physician agree.",
      "Do not use to replace insulin, dialysis, cancer treatment or emergency care.",
    ],
    interactions: [
      "Metallic preparations can interact unpredictably with prescription medicines.",
      "Herbal components may alter blood glucose, blood pressure and clotting.",
    ],
    references: [REF.ayush, REF.whoTm, REF.heavyMetals],
    lastReviewed: "2026-11-10",
    readingMinutes: 5,
  },
  {
    slug: "unani",
    title: "Unani medicine",
    category: "Unani",
    summary:
      "A Greco-Arabic medical tradition practised widely in South Asia, using temperament assessment, diet, regimental therapy and herbal formulations.",
    overview:
      "Unani medicine (also called Unani-Tibb) derives from Greco-Arabic medical thought and was developed further in Persia and the Indian subcontinent. It describes the body through four humours and assesses individual temperament before recommending diet, lifestyle measures, regimental therapies such as cupping, and compound herbal medicines.",
    history:
      "The tradition draws on Hippocratic and Galenic writings preserved and expanded by physicians such as Ibn Sina (Avicenna). It entered India through Persian and Central Asian influence and became established under the Mughals. India now regulates Unani practice and education, and several universities offer degree programmes.",
    traditionalUses: [
      "Dietary plans adjusted to temperament and season.",
      "Herbal formulations for digestive, respiratory, skin and joint complaints.",
      "Regimental therapies including cupping and leech therapy in trained hands.",
      "Convalescence and chronic-condition support.",
    ],
    evidence:
      "Evidence is limited and uneven. A few Unani formulations have been examined in small trials, but most practice is supported by tradition rather than controlled studies. Regimental therapies such as cupping have a modest evidence base from other traditions for some pain conditions, with wide variation in technique.",
    evidenceLevel: "Traditional use only",
    benefits: [
      "Emphasis on diet, sleep and routine aligns with established lifestyle medicine.",
      "Individualised consultation may support self-management of chronic conditions.",
    ],
    risks: [
      "Compound formulations may contain heavy metals or undisclosed ingredients.",
      "Cupping and leech therapy carry infection and injury risk if performed without training and sterile equipment.",
      "Some preparations are contraindicated in pregnancy and in children.",
    ],
    contraindications: [
      "Avoid bloodletting, cupping and leech therapy in bleeding disorders, on anticoagulants, in pregnancy, or over infected skin.",
      "Avoid unknown compound preparations in liver or kidney disease.",
    ],
    interactions: [
      "Herbal components may interact with anticoagulants, antihypertensives and diabetes medicines.",
      "Cupping can cause significant blood loss in people on blood thinners.",
    ],
    references: [REF.ayush, REF.whoTm],
    lastReviewed: "2026-11-10",
    readingMinutes: 5,
  },
  {
    slug: "yoga-and-naturopathy",
    title: "Yoga and naturopathy",
    category: "Yoga & Naturopathy",
    summary:
      "Movement, breathing and meditation practices alongside nature-based therapies, with the strongest evidence for yoga in low back pain and anxiety.",
    overview:
      "Yoga is a family of Indian practices combining physical postures, breath regulation, ethical observances and meditation. Naturopathy is a separate system that emphasises diet, water, heat, fasting and lifestyle measures, and in India is regulated alongside yoga under the AYUSH ministry. In this app, yoga content focuses on safe movement and breathing practice, not on treatment claims.",
    history:
      "Classical yoga philosophy is recorded in Patanjali's Yoga Sutras, compiled in the early centuries CE. Physical posture practice was popularised globally in the nineteenth and twentieth centuries. Naturopathy developed in nineteenth-century Europe and was later combined with yoga education in India.",
    traditionalUses: [
      "Physical postures for strength, mobility and balance.",
      "Breathing practices for relaxation and attention.",
      "Meditation and ethical reflection.",
      "Naturopathic diet and hydrotherapy regimens under supervision.",
    ],
    evidence:
      "Yoga has the strongest evidence base of the practices in this library. Systematic reviews support yoga for chronic low back pain, and there is moderate evidence for improvements in anxiety, stress and sleep quality. Evidence in asthma, arthritis and blood pressure is mixed and generally low quality. Fasting and extreme naturopathic regimens have caused serious harm and are not supported for treating disease.",
    evidenceLevel: "Moderate, limited trials",
    benefits: [
      "Improved flexibility, balance and modest strength with regular practice.",
      "Reduced perceived stress and improved sleep quality in several trials.",
      "Low-cost, scalable movement that needs no equipment.",
    ],
    risks: [
      "Muscle and joint strain, especially in inversions, deep twists and unsupervised advanced postures.",
      "Rare but serious events from extreme fasting, enemas and 'detox' regimens.",
      "Hot yoga can cause dehydration and heat illness.",
    ],
    contraindications: [
      "Avoid inversions with uncontrolled high blood pressure, glaucoma, or recent eye or spinal surgery.",
      "Modify or avoid deep twists in pregnancy and after abdominal surgery.",
      "Stop and seek medical advice for chest pain, dizziness, or new neurological symptoms during practice.",
    ],
    interactions: [
      "Intensive fasting can alter the effect of diabetes and blood pressure medicines.",
      "Tell your clinician about any fasting regimen if you take prescription medicines.",
    ],
    references: [REF.nccihYoga, REF.whoTm],
    lastReviewed: "2026-11-10",
    readingMinutes: 6,
  },
  {
    slug: "traditional-chinese-medicine",
    title: "Traditional Chinese medicine",
    category: "Traditional Chinese Medicine",
    summary:
      "A system including herbal formulas, acupuncture, moxibustion and dietary therapy, with acupuncture studied most extensively in modern trials.",
    overview:
      "Traditional Chinese medicine (TCM) is an umbrella term for practices codified in China over more than two millennia. It includes herbal medicine, acupuncture, moxibustion, cupping, dietary therapy and movement practices such as tai chi and qigong. Diagnosis uses pattern differentiation rather than biomedical disease categories.",
    history:
      "The Huangdi Neijing and Shanghan Lun are foundational texts. Acupuncture spread internationally from the twentieth century, and the World Health Organization published clinical practice guidelines for acupuncture in 2003. TCM is now practised and regulated in many countries, with wide differences in training standards.",
    traditionalUses: [
      "Herbal formulas for respiratory, digestive and gynaecological complaints.",
      "Acupuncture for pain, nausea and headache.",
      "Dietary therapy and lifestyle guidance based on pattern diagnosis.",
      "Tai chi and qigong for balance and mobility.",
    ],
    evidence:
      "Acupuncture has been studied in thousands of trials. Sham-controlled results are mixed; systematic reviews find consistent small benefits for chronic pain and chemotherapy-induced nausea, with effects often persisting for weeks to months. Herbal formula evidence is weaker because products are complex and variable. Tai chi has reasonable evidence for fall prevention and balance in older adults.",
    evidenceLevel: "Moderate, limited trials",
    benefits: [
      "Acupuncture appears to provide modest short-term relief in some chronic pain conditions.",
      "Tai chi improves balance and reduces falls in older adults.",
      "Structured movement and breathing practices support relaxation.",
    ],
    risks: [
      "Serious adverse events from acupuncture are uncommon but include pneumothorax and infection when performed by untrained practitioners.",
      "Some imported herbal products have been found to contain heavy metals, pesticides or prescription drugs.",
      "Rare liver injury has been reported with certain herbal formulas.",
    ],
    contraindications: [
      "Avoid needling over infected skin, in severe bleeding disorders, or on anticoagulants without clinician agreement.",
      "Avoid TCM herbal formulas in pregnancy without specialist review.",
      "Do not stop cancer treatment, antibiotics or cardiac medicines for traditional therapy.",
    ],
    interactions: [
      "Herbal formulas can interact with warfarin, immunosuppressants, antiretrovirals and chemotherapy.",
      "Some formulas affect blood pressure and blood glucose.",
    ],
    references: [REF.nccihAcupuncture, REF.tcmReviews, REF.whoTm],
    lastReviewed: "2026-11-10",
    readingMinutes: 6,
  },
  {
    slug: "tulasi",
    title: "Tulasi (holy basil)",
    category: "Herbal knowledge",
    summary:
      "A culinary and devotional herb used in South Asian households, with preliminary research on stress and blood sugar but no established treatment role.",
    overview:
      "Tulasi, Ocimum tenuiflorum (also recorded as Ocimum sanctum), is a small aromatic shrub in the mint family. The leaves are used as a culinary herb, in herbal teas, and in traditional preparations for coughs, colds and stress. It is also central to household devotional practice in many South Asian homes.",
    history:
      "Tulasi appears in Ayurvedic texts and in devotional traditions across India. It was traditionally planted near homes and used in home remedies for respiratory symptoms. Modern interest comes from laboratory studies of its essential oils and polyphenols.",
    traditionalUses: [
      "Leaf tea for cough and cold symptoms.",
      "Chewing leaves for mouth freshness and minor digestive complaints.",
      "Applied topically in some traditional preparations for skin irritation.",
      "Used as a culinary flavouring in teas and foods.",
    ],
    evidence:
      "Small randomised trials suggest tulasi may reduce some stress measures and modestly affect blood glucose, but samples are small, products and doses differ, and results have not been independently replicated at scale. There is no reliable evidence that tulasi treats infections, cancer or diabetes. Culinary use is generally considered safe.",
    evidenceLevel: "Early or limited",
    benefits: [
      "Pleasant culinary herb with no calories of concern in normal use.",
      "Preliminary findings on perceived stress and metabolic markers.",
      "Traditionally used for throat comfort; symptom relief is not evidence of treating infection.",
    ],
    risks: [
      "May lower blood sugar; monitor if you have diabetes and take glucose-lowering medicines.",
      "Theoretical risk of slowed blood clotting at high supplemental doses.",
      "Essential oil is concentrated and should not be taken internally.",
      "May reduce fertility in some animal studies; significance in humans is unknown.",
    ],
    contraindications: [
      "Avoid concentrated supplements in pregnancy and breastfeeding; culinary amounts are generally considered acceptable.",
      "Stop before planned surgery because of theoretical bleeding risk.",
      "Avoid in children as a supplement without paediatric advice.",
    ],
    interactions: [
      "Theoretical interaction with anticoagulants such as warfarin.",
      "Theoretical additive effect with diabetes medicines and with sedatives.",
      "May affect pentobarbital and some other drug metabolism in laboratory studies.",
    ],
    references: [REF.mskHolyBasil, REF.nccihAyurveda],
    lastReviewed: "2026-11-10",
    readingMinutes: 4,
  },
  {
    slug: "ashwagandha",
    title: "Ashwagandha",
    category: "Herbal knowledge",
    summary:
      "An adaptogen-style root with small trials in stress and sleep, and important cautions for pregnancy, thyroid disease and liver health.",
    overview:
      "Ashwagandha is the root of Withania somnifera, a shrub native to dry regions of India, the Middle East and parts of Africa. It is used in Ayurveda as a tonic and is one of the most widely sold herbal supplements worldwide, usually as a root extract in capsules or powder.",
    history:
      "The root has been used in Ayurvedic practice for centuries, often in milk decoctions and compound formulas. Global sales grew sharply in the 2010s after small trials reported reductions in perceived stress and cortisol.",
    traditionalUses: [
      "Tonic for convalescence and fatigue.",
      "Support for sleep and 'nervous exhaustion'.",
      "Ingredient in joint and vitality formulations.",
      "Used with milk and ghee in traditional preparations.",
    ],
    evidence:
      "Several small randomised trials report reduced perceived stress and improved sleep quality with standardised root extracts over 6 to 12 weeks. Trials are generally small, often industry-funded, and use different extracts. Evidence for athletic performance and cognition is weaker. Ashwagandha is not a treatment for anxiety disorders, insomnia or thyroid disease.",
    evidenceLevel: "Early or limited",
    benefits: [
      "Modest reductions in perceived stress in some short-term trials.",
      "Possible small improvement in sleep quality.",
      "Generally well tolerated in short trials at studied doses.",
    ],
    risks: [
      "Case reports describe liver injury, including rare liver failure, in people taking ashwagandha supplements.",
      "May increase thyroid hormone levels; caution in hyperthyroidism.",
      "Can cause digestive upset and drowsiness.",
      "Rare reports of increased hair loss and, in isolated cases, gynecomastia.",
    ],
    contraindications: [
      "Avoid in pregnancy: traditional use includes uterine effects and safety is not established.",
      "Avoid in breastfeeding without clinician advice.",
      "Avoid with thyroid disorders, autoimmune disease, or a history of liver disease unless a clinician approves.",
      "Stop before surgery because of potential sedative effects.",
    ],
    interactions: [
      "Additive drowsiness with benzodiazepines, sedating antihistamines and alcohol.",
      "May alter thyroid hormone medicine requirements.",
      "Theoretical interaction with immunosuppressants and with blood pressure medicines.",
    ],
    references: [REF.nccihAshwagandha, REF.liverTox, REF.emaHerbal],
    lastReviewed: "2026-11-10",
    readingMinutes: 5,
  },
  {
    slug: "turmeric",
    title: "Turmeric and curcumin",
    category: "Herbal knowledge",
    summary:
      "A culinary spice whose extracts are studied for osteoarthritis and inflammation, with modest evidence and real cautions for gallstones and blood thinners.",
    overview:
      "Turmeric is the rhizome of Curcuma longa, used across South Asia as a spice, colouring and traditional medicine. Curcumin is the best-studied compound in turmeric. Culinary turmeric contains only a small amount of curcumin, and most supplements use concentrated extracts, often with piperine or lipid formulations to improve absorption.",
    history:
      "Turmeric has been used in South Asian cooking and medicine for centuries, including in wound care and digestive complaints. Modern research interest began in the late twentieth century with laboratory studies of curcumin's anti-inflammatory activity.",
    traditionalUses: [
      "Culinary spice and natural food colouring.",
      "Warm milk with turmeric for throat and cold comfort.",
      "Paste applied to minor skin irritation in some traditions.",
      "Ingredient in joint and digestive formulations.",
    ],
    evidence:
      "Randomised trials of curcumin extracts in knee osteoarthritis report small to moderate improvements in pain and function, but trials are short, often industry-funded and use widely different formulations. Evidence for depression, metabolic syndrome and inflammatory bowel disease is preliminary. Turmeric itself, at culinary doses, has not been shown to treat disease.",
    evidenceLevel: "Moderate, limited trials",
    benefits: [
      "Culinary spice that adds flavour without salt or sugar.",
      "Small short-term improvements in osteoarthritis symptoms in some trials.",
      "Generally safe at culinary amounts.",
    ],
    risks: [
      "High-dose curcumin extracts have been linked to liver injury in a number of case reports.",
      "Can cause digestive upset and, at high doses, diarrhoea.",
      "May increase bleeding risk, particularly with anticoagulants.",
      "Piperine-enhanced products increase absorption of other medicines as well as curcumin.",
    ],
    contraindications: [
      "Avoid concentrated extracts with gallstones or bile duct obstruction.",
      "Avoid high-dose supplements in pregnancy.",
      "Stop supplemental use 2 weeks before surgery.",
      "Avoid with iron-deficiency anaemia risk: curcumin may reduce iron absorption.",
    ],
    interactions: [
      "Anticoagulants and antiplatelet medicines: increased bleeding risk.",
      "Piperine can raise blood levels of many prescription drugs.",
      "May reduce absorption of iron supplements.",
      "Possible interaction with some chemotherapy agents; discuss with your oncology team.",
    ],
    references: [REF.nccihTurmeric, REF.liverTox, REF.emaHerbal],
    lastReviewed: "2026-11-10",
    readingMinutes: 5,
  },
  {
    slug: "triphala",
    title: "Triphala",
    category: "Ayurveda",
    summary:
      "A three-fruit Ayurvedic formula traditionally used for digestion, with limited clinical evidence and important cautions during pregnancy.",
    overview:
      "Triphala is a powdered formula of three fruits: amalaki (Emblica officinalis), bibhitaki (Terminalia bellirica) and haritaki (Terminalia chebula). It is one of the most widely used Ayurvedic preparations, taken as powder, tablet or decoction, usually for digestive regularity.",
    history:
      "The formula appears in classical Ayurvedic literature and has been used for centuries as a gentle bowel regulator and general tonic. Modern products vary considerably in the ratio of the three fruits and in extraction method.",
    traditionalUses: [
      "Relief of occasional constipation.",
      "Digestive tonic in small daily doses.",
      "Mouth rinse in some traditions.",
      "Ingredient in eye and skin preparations in classical texts.",
    ],
    evidence:
      "A small number of trials have examined triphala for constipation, dental plaque and metabolic markers, with mixed and generally low-quality results. There is no reliable evidence that triphala detoxifies the body, treats cancer or prevents ageing. Its laxative effect is plausible from the tannins and fibre content.",
    evidenceLevel: "Early or limited",
    benefits: [
      "May help with occasional constipation in some users.",
      "Contains vitamin C-rich amla and plant polyphenols.",
      "Long history of food-like use at low doses.",
    ],
    risks: [
      "Can cause loose stools, cramps and bloating.",
      "Tannins may reduce iron absorption with long-term use.",
      "Products may be contaminated or include unlisted ingredients.",
      "Traditional texts caution against use in pregnancy and in severe wasting.",
    ],
    contraindications: [
      "Avoid in pregnancy and breastfeeding without clinician approval.",
      "Avoid in bowel obstruction, severe diarrhoea, or acute abdominal pain.",
      "Use caution with iron-deficiency anaemia.",
    ],
    interactions: [
      "May reduce absorption of iron and some medicines if taken at the same time.",
      "Additive effect with other laxatives.",
      "Theoretical interaction with diabetes medicines.",
    ],
    references: [REF.nccihAyurveda, REF.emaHerbal],
    lastReviewed: "2026-11-10",
    readingMinutes: 4,
  },
  {
    slug: "neem",
    title: "Neem",
    category: "Herbal knowledge",
    summary:
      "A widely used medicinal tree with antimicrobial laboratory activity; internal use carries real toxicity concerns, especially for children.",
    overview:
      "Neem (Azadirachta indica) is a fast-growing tree native to the Indian subcontinent. Leaves, bark, seed oil and twigs are used in traditional medicine, agriculture and personal care. Neem oil is a concentrated product and is not the same as leaf preparations.",
    history:
      "Neem appears throughout South Asian medical and agricultural traditions. It is used in dental care, skin preparations and pest control. Modern research has focused on its insecticidal and antimicrobial compounds, including azadirachtin.",
    traditionalUses: [
      "Twig used as a traditional toothbrush in some communities.",
      "Leaf paste or oil applied to skin for minor irritation.",
      "Leaf preparations taken for digestive and fever symptoms.",
      "Neem oil used as an insect repellent and agricultural pesticide.",
    ],
    evidence:
      "Laboratory studies show antimicrobial and anti-inflammatory activity, but clinical trials in humans are few and small. Neem has been studied for plaque control with modest results. There is no reliable evidence that neem treats diabetes, malaria or cancer in humans, and it must not replace prescribed treatment.",
    evidenceLevel: "Early or limited",
    benefits: [
      "Neem-based mouthwash has shown plaque reduction in small trials.",
      "Topical neem oil may help with some skin and scalp complaints.",
      "Traditional dental use has plausible mechanical cleaning effect.",
    ],
    risks: [
      "Neem oil ingestion can cause serious poisoning, especially in children, including vomiting, seizures and metabolic acidosis.",
      "Neem leaf extracts may affect blood sugar and fertility in animal studies.",
      "Can cause contact dermatitis.",
      "Products are often unstandardised.",
    ],
    contraindications: [
      "Never give neem oil or leaf extracts to infants and young children.",
      "Avoid internal use in pregnancy and while trying to conceive.",
      "Avoid in liver disease and with diabetes medicines unless supervised.",
      "Do not use neem oil on broken skin.",
    ],
    interactions: [
      "Possible additive glucose-lowering effect with diabetes medicines.",
      "Theoretical interaction with sedatives and with immunosuppressants.",
      "Neem may reduce fertility; discuss if you are planning pregnancy.",
    ],
    references: [REF.nccihAyurveda, REF.emaHerbal],
    lastReviewed: "2026-11-10",
    readingMinutes: 4,
  },
  {
    slug: "brahmi",
    title: "Brahmi (Bacopa monnieri)",
    category: "Herbal knowledge",
    summary:
      "A traditional memory herb studied in small trials for cognition, with slow onset and frequent digestive side effects.",
    overview:
      "Brahmi usually refers to Bacopa monnieri, a creeping wetland herb used in Ayurveda as a medhya (mind) tonic. The name is sometimes applied to Centella asiatica (gotu kola), a different plant, so product labels need care. Standardised extracts are the most studied form.",
    history:
      "Bacopa appears in classical Ayurvedic texts and was traditionally taken with ghee or milk. Australian and Indian research groups began testing standardised extracts for memory in the late twentieth century.",
    traditionalUses: [
      "Memory and concentration support.",
      "Calming preparation for restlessness.",
      "Ayurvedic formulations for the nervous system.",
      "External application of the juice in some traditions.",
    ],
    evidence:
      "Several small randomised trials report modest improvements in memory recall after 8 to 12 weeks of standardised extract, but trials are small and results are inconsistent. Evidence for attention, anxiety and epilepsy is insufficient. Effects, if any, are not immediate.",
    evidenceLevel: "Early or limited",
    benefits: [
      "Some trials show small improvements in verbal memory after several weeks.",
      "Traditional calming use in Ayurveda.",
      "Generally well tolerated aside from digestive effects.",
    ],
    risks: [
      "Frequent gastrointestinal side effects including nausea, cramps and loose stools.",
      "May cause fatigue or drowsiness in some users.",
      "Rare reports of liver enzyme elevation.",
      "Product confusion between Bacopa and Centella is common.",
    ],
    contraindications: [
      "Avoid in pregnancy and breastfeeding; safety is not established.",
      "Avoid in thyroid disorders and with sedatives unless supervised.",
      "Stop before surgery because of possible sedation.",
    ],
    interactions: [
      "Additive sedation with sedating medicines and alcohol.",
      "Possible interaction with thyroid medicines and with calcium channel blockers.",
      "May affect liver enzymes; caution with other hepatotoxic medicines.",
    ],
    references: [REF.nccihAshwagandha, REF.liverTox, REF.emaHerbal],
    lastReviewed: "2026-11-10",
    readingMinutes: 4,
  },
  {
    slug: "ghee-and-traditional-fats",
    title: "Ghee and traditional fats",
    category: "Traditional nutrition",
    summary:
      "Clarified butter central to South Asian cooking, high in saturated fat and best used in moderation within an overall balanced diet.",
    overview:
      "Ghee is clarified butter made by simmering butter and separating milk solids. It has a high smoke point and a distinctive flavour, and is used in cooking, sweets and traditional preparations. Nutritionally it is almost entirely fat, with roughly 60% saturated fat per tablespoon.",
    history:
      "Ghee has been produced in South Asia for millennia and is used in religious ritual, cooking and Ayurvedic preparations. Traditional texts describe it as nourishing and digestive; modern nutrition emphasises quantity and overall dietary pattern rather than single foods.",
    traditionalUses: [
      "Cooking and tempering spices.",
      "Base for traditional sweets and celebratory foods.",
      "Carrier for herbal preparations in Ayurveda.",
      "Skin application in some home remedies.",
    ],
    evidence:
      "There is no reliable evidence that ghee improves immunity or cures disease. Diets high in saturated fat raise LDL cholesterol in many people. Small studies of ghee from grass-fed animals show a different fatty acid profile but do not establish health benefits. Traditional fats can fit in a balanced diet when portions are modest.",
    evidenceLevel: "Traditional use only",
    benefits: [
      "High smoke point makes it suitable for frying and tempering.",
      "Contains fat-soluble vitamins A, D, E and K in small amounts.",
      "Lactose and casein are largely removed, so many people with lactose intolerance tolerate it.",
    ],
    risks: [
      "High in saturated fat and calories; excess intake raises LDL cholesterol.",
      "Not suitable for people instructed to restrict saturated fat.",
      "Very high intakes can contribute to weight gain.",
    ],
    contraindications: [
      "Limit with familial hypercholesterolaemia, pancreatitis or gallbladder disease as advised by your clinician.",
      "Avoid rancid or improperly stored ghee.",
    ],
    interactions: [
      "No direct medicine interactions; overall fat intake can affect absorption of some fat-soluble medicines.",
    ],
    references: [REF.ods, REF.whoTm],
    lastReviewed: "2026-11-10",
    readingMinutes: 3,
  },
  {
    slug: "handwashing-and-hygiene",
    title: "Hand hygiene that actually prevents illness",
    category: "Personal hygiene",
    summary:
      "Handwashing with soap at key moments remains one of the most effective public health measures available, with clear evidence for diarrhoeal and respiratory disease reduction.",
    overview:
      "Hand hygiene is the practice of cleaning hands with soap and water or an alcohol-based sanitiser at moments when pathogens are likely to be transmitted. It is a foundational preventive measure and is included in this library because it is cheap, evidence-based and effective across settings.",
    history:
      "Ignaz Semmelweis documented the effect of hand disinfection on maternal mortality in 1847. Systematic promotion of handwashing became a central public health strategy in the twentieth century, and the WHO published global hand hygiene guidance in 2009.",
    traditionalUses: [
      "Washing hands before eating and after using the toilet.",
      "Washing hands after handling animals or waste.",
      "Washing hands before preparing food.",
      "Covering coughs and sneezes and washing afterwards.",
    ],
    evidence:
      "This is one of the best-supported interventions in public health. Systematic reviews of handwashing promotion find substantial reductions in diarrhoeal disease, and moderate reductions in respiratory infections. Soap and water is preferred when hands are visibly dirty; alcohol-based sanitiser with at least 60% alcohol is effective when hands are not visibly soiled.",
    evidenceLevel: "Established",
    benefits: [
      "Reduces diarrhoeal illness, a leading cause of child mortality globally.",
      "Reduces respiratory infections in households and communities.",
      "Reduces healthcare-associated infection when used by health workers.",
    ],
    risks: [
      "Frequent washing can cause skin irritation; moisturise and avoid very hot water.",
      "Alcohol-based sanitisers are flammable and toxic if swallowed; keep away from children.",
      "Sanitiser does not remove visible dirt or kill all pathogens such as norovirus and C. difficile spores.",
    ],
    contraindications: [
      "Do not use alcohol-based sanitiser as a substitute for soap when hands are visibly soiled.",
      "Use soap and water after using the toilet and before eating.",
    ],
    interactions: [],
    references: [REF.whoTm, REF.ods],
    lastReviewed: "2026-11-10",
    readingMinutes: 3,
  },
  {
    slug: "history-of-indian-medicine",
    title: "A short history of Indian medicine",
    category: "Cultural history",
    summary:
      "How Ayurveda, Siddha, Unani and yoga developed, interacted and were institutionalised in modern India.",
    overview:
      "The medical traditions of the Indian subcontinent developed through centuries of exchange between local practice, religious scholarship, Persian and Greek medicine, and later European influence. Understanding this history helps distinguish long-standing cultural practice from claims of proven effectiveness.",
    history:
      "The Indus Valley archaeological record includes evidence of dentistry and surgical instruments. Classical Ayurvedic compendia were compiled in the early centuries CE, with hospitals documented in Sri Lanka and India by the first millennium. Unani medicine entered with Persian and Central Asian influence and expanded under the Delhi Sultanate and Mughals. Yoga philosophy was codified in the Yoga Sutras, while physical posture practice was popularised in the nineteenth and twentieth centuries. In 1947 the newly independent Indian state began integrating traditional systems into public health, and the Ministry of AYUSH was created in 2014 to oversee Ayurveda, Yoga and Naturopathy, Unani, Siddha and Homoeopathy.",
    traditionalUses: [
      "Transmission of medical knowledge through family lineages and monastic institutions.",
      "Regional materia medica shaped by local plants and trade routes.",
      "Integration of hospitals and dispensaries into state health systems.",
      "Mass yoga and naturopathy programmes for public health promotion.",
    ],
    evidence:
      "Historical scholarship documents the development of these systems and their institutions. History does not establish clinical effectiveness: each intervention still requires its own evidence. Claims that ancient texts describe modern diseases or treatments should be treated with caution.",
    evidenceLevel: "Traditional use only",
    benefits: [
      "Context for why traditional practices persist and how they are regulated.",
      "Understanding of cultural preferences that affect care decisions.",
      "Awareness of how medical pluralism works in South Asia.",
    ],
    risks: [
      "Romanticised history can be used to promote unproven or harmful treatments.",
      "Nationalist and commercial narratives sometimes overstate antiquity or efficacy.",
    ],
    contraindications: [],
    interactions: [],
    references: [REF.whoTm, REF.ayush],
    lastReviewed: "2026-11-10",
    readingMinutes: 6,
  },
];

export const ARTICLE_CATEGORIES: Article["category"][] = [
  "Ayurveda",
  "Siddha",
  "Unani",
  "Yoga & Naturopathy",
  "Traditional Chinese Medicine",
  "Herbal knowledge",
  "Preventive care",
  "Traditional nutrition",
  "Cultural history",
  "Personal hygiene",
];

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}
