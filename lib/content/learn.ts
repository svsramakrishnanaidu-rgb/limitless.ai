export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  source?: string;
};

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  content: string[];
  keyPoints: string[];
};

export type LearnModule = {
  id: string;
  title: string;
  level: "Foundation" | "Practical" | "Safety";
  summary: string;
  lessons: Lesson[];
  quiz: QuizQuestion[];
  certificateTitle: string;
};

export const LEARN_MODULES: LearnModule[] = [
  {
    id: "foundations",
    title: "Foundations of traditional healthcare",
    level: "Foundation",
    summary:
      "Where Ayurveda, Siddha, Unani and yoga come from, how they are regulated, and how to read claims about them.",
    lessons: [
      {
        id: "foundations-1",
        title: "Four systems, one region",
        minutes: 6,
        content: [
          "Ayurveda, Siddha, Unani and yoga all developed in or passed through the Indian subcontinent, but they are not versions of one another. Ayurveda organised practice around three functional patterns; Siddha developed a distinct Tamil literature with extensive mineral preparations; Unani built on Greco-Arabic humoural theory; yoga is a practice tradition rather than a full medical system.",
          "The Ministry of AYUSH was created in 2014 to oversee Ayurveda, Yoga and Naturopathy, Unani, Siddha and Homoeopathy. Regulation matters because it sets training requirements, but it does not by itself prove that a treatment works.",
          "When you read about a traditional remedy, separate three questions: what is the tradition, what is the evidence, and what is the risk? A long history answers only the first.",
        ],
        keyPoints: [
          "Traditional systems differ in theory, training and regulation.",
          "Regulation is not the same as proof of effectiveness.",
          "Always ask about evidence and risk separately from tradition.",
        ],
      },
      {
        id: "foundations-2",
        title: "What 'evidence-based' actually means",
        minutes: 7,
        content: [
          "Evidence-based practice combines the best available research with clinical judgement and the patient's values. It does not mean 'only randomised trials count', but it does mean that claims should be proportional to the quality of the evidence behind them.",
          "A single small trial is a signal, not a conclusion. Systematic reviews pool trials and can reveal that early enthusiasm does not hold up. For most traditional herbs, the honest summary is 'promising but unproven' rather than 'proven' or 'worthless'.",
          "Case reports matter for safety. Rare harms, such as liver injury from a herbal supplement, are often first detected through case reports rather than trials.",
        ],
        keyPoints: [
          "Evidence quality varies enormously between interventions.",
          "Small trials can be misleading without replication.",
          "Safety signals often come from case reports and pharmacovigilance.",
        ],
      },
      {
        id: "foundations-3",
        title: "How traditional medicine is regulated in India",
        minutes: 5,
        content: [
          "AYUSH practitioners are trained in recognised institutions and licensed by state boards. The Central Council of Indian Medicine and the Central Council of Homoeopathy were the earlier regulators; reforms have moved toward a National Commission for Indian System of Medicine.",
          "Medicinal products are regulated under the Drugs and Cosmetics Act and Rules, with separate provisions for AYUSH drugs. Quality control remains a challenge: independent analyses have repeatedly found heavy metal contamination in some products.",
          "If you choose to see an AYUSH practitioner, ask about their registration, the composition of any product, and whether they will coordinate with your other clinicians.",
        ],
        keyPoints: [
          "Practitioners should be registered with a state board.",
          "Product quality varies; contamination is documented.",
          "Coordination between practitioners reduces interaction risk.",
        ],
      },
    ],
    quiz: [
      {
        id: "f1",
        question: "What does regulation of a traditional medical system establish?",
        options: [
          "That its treatments are proven effective",
          "That practitioners meet defined training and licensing standards",
          "That its products are free of contamination",
          "That it can replace emergency care",
        ],
        answer: 1,
        explanation:
          "Regulation sets training and licensing standards. It does not establish effectiveness, guarantee product quality, or make a system suitable for emergencies.",
        source: "Ministry of AYUSH; WHO traditional medicine",
      },
      {
        id: "f2",
        question: "Why are case reports important in herbal medicine?",
        options: [
          "They prove a treatment works",
          "They are the strongest form of clinical evidence",
          "They can reveal rare harms that trials are too small to detect",
          "They replace systematic reviews",
        ],
        answer: 2,
        explanation:
          "Case reports are weak evidence of benefit but valuable for detecting rare adverse events such as liver injury.",
      },
      {
        id: "f3",
        question: "A 2008 analysis of Ayurvedic products sold online found detectable heavy metals in roughly what proportion of samples?",
        options: ["Almost none", "About one in five", "About half", "All samples"],
        answer: 1,
        explanation:
          "The widely cited analysis found detectable lead, mercury or arsenic in approximately 20% of sampled products, which is why product quality is a real safety concern.",
        source: "Saper et al., JAMA 2008",
      },
    ],
    certificateTitle: "Foundations of traditional healthcare",
  },
  {
    id: "safety",
    title: "Using herbs safely",
    level: "Safety",
    summary:
      "Interactions, pregnancy, liver risk and how to read a supplement label without being misled.",
    lessons: [
      {
        id: "safety-1",
        title: "Herbs are medicines too",
        minutes: 6,
        content: [
          "Plants contain pharmacologically active compounds. That is why some become prescription drugs and why others cause harm. 'Natural' describes origin, not safety.",
          "The highest-risk interactions involve blood thinners, immunosuppressants, diabetes medicines, thyroid medicines and medicines with a narrow therapeutic index. If you take any of these, do not start a herbal supplement without checking.",
          "Dose matters. Culinary turmeric in a curry and a concentrated curcumin capsule with an absorption enhancer are not equivalent exposures.",
        ],
        keyPoints: [
          "Natural does not mean safe.",
          "Blood thinners and immunosuppressants carry the highest interaction risk.",
          "Concentrated extracts are not the same as culinary amounts.",
        ],
      },
      {
        id: "safety-2",
        title: "Pregnancy, breastfeeding and children",
        minutes: 5,
        content: [
          "Very few herbal products have been tested in pregnancy, and traditional use is not evidence of safety. Some herbs have known uterine or hormonal effects; others have unknown effects on a developing fetus.",
          "Breastfeeding infants are exposed to what the parent takes. Neonates and young children metabolise compounds differently and are more vulnerable to poisoning, particularly from concentrated oils such as neem and eucalyptus.",
          "The safe default is to avoid herbal supplements in pregnancy and early childhood unless a clinician with relevant expertise recommends a specific product.",
        ],
        keyPoints: [
          "Absence of evidence is not evidence of safety in pregnancy.",
          "Concentrated essential oils are dangerous for young children.",
          "Ask a clinician before using any supplement while breastfeeding.",
        ],
      },
      {
        id: "safety-3",
        title: "Reading a supplement label",
        minutes: 6,
        content: [
          "A trustworthy label lists the scientific name, the plant part used, the amount per serving, the extraction method and a batch number. Vague entries such as 'herbal blend' or 'proprietary formula' make dose assessment impossible.",
          "Check for third-party testing marks where available, and look up the product on a regulator's site if you are in a jurisdiction that maintains one. In India, AYUSH manufacturing licences are issued by state authorities.",
          "Stop and seek medical advice if you develop jaundice, dark urine, severe abdominal pain, rash, or unusual bleeding after starting any supplement.",
        ],
        keyPoints: [
          "Demand the scientific name, plant part and quantity.",
          "Record batch numbers in case of a reaction.",
          "Jaundice or unusual bleeding after a supplement needs urgent assessment.",
        ],
      },
    ],
    quiz: [
      {
        id: "s1",
        question: "Which group carries the highest risk from herbal interactions?",
        options: [
          "People taking blood thinners and immunosuppressants",
          "People who exercise regularly",
          "People who eat a vegetarian diet",
          "People taking only vitamin C",
        ],
        answer: 0,
        explanation:
          "Anticoagulants, antiplatelets and immunosuppressants have narrow margins, and several herbs alter bleeding or drug metabolism.",
      },
      {
        id: "s2",
        question: "What is the safest approach to herbal supplements during pregnancy?",
        options: [
          "Use them freely because they are natural",
          "Avoid unless a clinician with relevant expertise recommends a specific product",
          "Double the dose to compensate for absorption",
          "Use essential oils instead",
        ],
        answer: 1,
        explanation:
          "Safety data in pregnancy are sparse, and some herbs have known uterine or hormonal effects.",
      },
      {
        id: "s3",
        question: "Which label detail is essential for judging dose?",
        options: [
          "A picture of the plant",
          "The plant part used and the amount per serving",
          "A 'detox' claim",
          "The country of packaging only",
        ],
        answer: 1,
        explanation:
          "Without the plant part and a quantified amount, the dose cannot be assessed.",
      },
    ],
    certificateTitle: "Safe use of herbal medicine",
  },
  {
    id: "prevention",
    title: "Everyday prevention that works",
    level: "Practical",
    summary:
      "The unglamorous measures with the strongest evidence: hand hygiene, vaccination, blood pressure checks, and sleep.",
    lessons: [
      {
        id: "prevention-1",
        title: "Hand hygiene and safe water",
        minutes: 5,
        content: [
          "Washing hands with soap at key moments reduces diarrhoeal disease substantially and respiratory infections moderately. Soap and water is preferred when hands are visibly dirty; alcohol-based sanitiser with at least 60% alcohol works when they are not.",
          "Safe drinking water means a protected source plus treatment where needed: boiling, chlorination, filtration or safe storage. Boiling is effective but uses fuel; chlorination is cheap but less effective against some parasites.",
          "These measures are unglamorous and highly effective. They deserve more attention than most supplement marketing.",
        ],
        keyPoints: [
          "Soap and water at key moments is a high-impact intervention.",
          "Sanitiser does not remove visible dirt or kill all pathogens.",
          "Safe storage prevents recontamination after treatment.",
        ],
      },
      {
        id: "prevention-2",
        title: "Blood pressure and blood sugar screening",
        minutes: 6,
        content: [
          "High blood pressure usually has no symptoms until damage is done. Adults should have it measured periodically; the exact interval depends on age, risk factors and local guidance.",
          "Type 2 diabetes can also develop silently. Screening is recommended for adults with risk factors such as family history, higher body weight, or South Asian ancestry at a lower BMI threshold than European populations.",
          "Home devices can help tracking but are not diagnostic. A single high reading should be confirmed with a validated device and clinical assessment.",
        ],
        keyPoints: [
          "Hypertension is usually asymptomatic.",
          "South Asian adults may develop type 2 diabetes at lower BMI.",
          "Home readings support, but do not replace, clinical diagnosis.",
        ],
      },
      {
        id: "prevention-3",
        title: "Sleep, movement and alcohol",
        minutes: 6,
        content: [
          "Most adults need seven to nine hours of sleep. Consistent timing matters as much as total duration for many people. Short sleep is associated with impaired glucose control, weight gain and worse mood.",
          "WHO recommends 150 to 300 minutes of moderate activity per week for adults, plus muscle-strengthening on two days. Walking counts. The best activity is one you will keep doing.",
          "There is no safe level of alcohol consumption that can be recommended on health grounds; if you drink, less is better.",
        ],
        keyPoints: [
          "Seven to nine hours of sleep is the usual adult range.",
          "150 minutes of moderate activity per week is the WHO baseline.",
          "No level of alcohol is recommended for health.",
        ],
      },
    ],
    quiz: [
      {
        id: "p1",
        question: "When should alcohol-based hand sanitiser be used?",
        options: [
          "When hands are visibly soiled",
          "When hands are not visibly soiled and soap is unavailable",
          "Instead of washing after using the toilet",
          "Only on children under two",
        ],
        answer: 1,
        explanation:
          "Sanitiser is for hands that are not visibly dirty. Soap and water is required after toilet use and when hands are soiled.",
      },
      {
        id: "p2",
        question: "How much moderate activity does WHO recommend for adults per week?",
        options: ["30 minutes", "75 minutes", "150–300 minutes", "600 minutes"],
        answer: 2,
        explanation: "WHO recommends 150–300 minutes of moderate-intensity activity weekly for adults.",
        source: "WHO physical activity guidelines",
      },
      {
        id: "p3",
        question: "Why is hypertension often missed?",
        options: [
          "It always causes headaches",
          "It is usually asymptomatic until organ damage occurs",
          "It only affects older adults",
          "It cannot be measured at home",
        ],
        answer: 1,
        explanation:
          "Most people with high blood pressure feel fine, which is why periodic measurement matters.",
      },
    ],
    certificateTitle: "Everyday prevention",
  },
  {
    id: "plants",
    title: "Plant identification and poisoning risk",
    level: "Safety",
    summary:
      "Why photo identification is uncertain, which ornamentals are dangerous, and what to do if someone swallows a plant.",
    lessons: [
      {
        id: "plants-1",
        title: "Why one photo is not identification",
        minutes: 6,
        content: [
          "Botanical identification often depends on details a phone photo misses: leaf arrangement, stipules, scent, latex, flower structure and habitat. Closely related species can look nearly identical while differing in toxicity.",
          "Automated image tools can produce confident-sounding answers that are wrong. Treat any app identification as a hypothesis for an expert to confirm, never as permission to eat or prepare a plant.",
          "If you need a reliable identification, photograph the whole plant, both leaf surfaces, the stem attachment, flowers and fruit, and send the images to a botanist, agricultural extension officer or recognised herbarium.",
        ],
        keyPoints: [
          "Photographs miss diagnostic features.",
          "Confidence scores are not calibrated guarantees.",
          "Never consume a plant based on an app identification.",
        ],
      },
      {
        id: "plants-2",
        title: "Dangerous lookalikes",
        minutes: 6,
        content: [
          "Datura and Brugmansia contain tropane alkaloids and can cause delirium, seizures and death. Their trumpet flowers and spiny fruit make them attractive to children.",
          "Oleander contains cardiac glycosides; all parts are toxic, including smoke from burning. Chinaberry has been mistaken for neem, and its berries are toxic.",
          "Castor seeds contain ricin; chewing even a few raw seeds can be lethal. Castor oil is a different preparation but is not a safe laxative for everyone.",
        ],
        keyPoints: [
          "Datura, oleander, castor and chinaberry are high-risk plants.",
          "Never use twigs as toothbrushes unless you can identify the plant.",
          "Children are at particular risk from attractive flowers and fruit.",
        ],
      },
      {
        id: "plants-3",
        title: "If someone swallows a toxic plant",
        minutes: 5,
        content: [
          "Call your local emergency number or poison control centre immediately. Do not wait for symptoms. In India, call 112 for emergency services; in the US, call 911 and the Poison Help line at 1-800-222-1222.",
          "Do not induce vomiting unless a clinician instructs you to. Keep the plant or a photo of it, and note how much was eaten and when.",
          "If the person is unconscious or not breathing normally, start CPR if trained and follow the emergency dispatcher's instructions.",
        ],
        keyPoints: [
          "Call emergency services first; do not wait for symptoms.",
          "Do not induce vomiting on your own.",
          "Bring the plant or a photo and timing information.",
        ],
      },
    ],
    quiz: [
      {
        id: "pl1",
        question: "What should you do after an app identifies a wild plant as edible?",
        options: [
          "Eat a small amount to test it",
          "Treat it as a hypothesis and get expert confirmation",
          "Use it medicinally if the confidence score is high",
          "Share it in a community group as confirmed",
        ],
        answer: 1,
        explanation:
          "Image identification is uncertain and confidence scores are not guarantees. Expert confirmation is required before any use.",
      },
      {
        id: "pl2",
        question: "Which plant is highly toxic in all parts, including smoke from burning?",
        options: ["Tulasi", "Oleander", "Amla", "Turmeric"],
        answer: 1,
        explanation: "Oleander contains cardiac glycosides and is toxic in all parts; burning it produces toxic smoke.",
      },
      {
        id: "pl3",
        question: "What is the first action if a child swallows a toxic plant?",
        options: [
          "Induce vomiting",
          "Wait for symptoms",
          "Call emergency services or poison control immediately",
          "Give milk and observe at home",
        ],
        answer: 2,
        explanation:
          "Emergency guidance should come immediately from professionals. Do not induce vomiting unless instructed.",
      },
    ],
    certificateTitle: "Plant safety and identification",
  },
];

export function getModule(id: string) {
  return LEARN_MODULES.find((m) => m.id === id);
}
