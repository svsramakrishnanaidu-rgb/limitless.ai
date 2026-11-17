export type Scheme = {
  slug: string;
  name: string;
  provider: string;
  summary: string;
  eligibility: string;
  howToApply: string[];
  url: string;
  official: string;
  note?: string;
};

/**
 * Indian central government health programmes. Details can change and state
 * implementation varies; each entry links to the official portal. Always
 * confirm current eligibility and documents on the official website or at
 * your nearest health facility before travelling or paying any fee.
 */
export const SCHEMES: Scheme[] = [
  {
    slug: "pmjay",
    name: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
    provider: "National Health Authority, Government of India",
    summary:
      "A health assurance scheme providing cashless secondary and tertiary hospital care for eligible families, with an annual cover limit per family.",
    eligibility:
      "Eligibility is based on specified deprivation and occupational categories from the Socio-Economic Caste Census, with additional categories added over time. Check your eligibility on the official portal or at a Common Service Centre; do not rely on agents who ask for payment.",
    howToApply: [
      "Check eligibility on the official PM-JAY portal or the Ayushman app.",
      "Visit a Common Service Centre or empanelled hospital with identity documents.",
      "Complete e-KYC and obtain your Ayushman Card.",
      "At admission, show the card at an empanelled hospital for cashless authorisation.",
    ],
    url: "https://pmjay.gov.in/",
    official: "pmjay.gov.in",
    note: "Cover limits, empanelled hospitals and eligibility categories are updated periodically. Confirm on the portal before treatment.",
  },
  {
    slug: "ayushman-arogya-mandir",
    name: "Ayushman Arogya Mandir (Health and Wellness Centres)",
    provider: "National Health Mission, Ministry of Health and Family Welfare",
    summary:
      "Upgraded primary health facilities offering comprehensive primary care, screening for non-communicable diseases, maternal and child services and some medicines free of charge.",
    eligibility:
      "Open to the local population; services are generally free at public facilities. Specific packages vary by state.",
    howToApply: [
      "Find your nearest Ayushman Arogya Mandir through your state health department or the AB-HWC portal.",
      "Walk in during working hours for screening and primary care.",
      "Bring any existing prescriptions and records.",
    ],
    url: "https://ab-hwc.nhp.gov.in/",
    official: "ab-hwc.nhp.gov.in",
  },
  {
    slug: "national-health-mission",
    name: "National Health Mission (NHM)",
    provider: "Ministry of Health and Family Welfare",
    summary:
      "The umbrella programme for public health delivery in rural and urban areas, covering maternal health, immunisation, disease control, and free drugs and diagnostics at public facilities.",
    eligibility:
      "Services are available through public health facilities. Some schemes are targeted at specific groups such as pregnant women, children and people with tuberculosis.",
    howToApply: [
      "Visit a government sub-centre, PHC, CHC or district hospital.",
      "Ask the facility about free diagnostics, medicines and national programme benefits.",
      "For maternal health, register early with an ASHA worker or at the facility.",
    ],
    url: "https://nhm.gov.in/",
    official: "nhm.gov.in",
  },
  {
    slug: "national-ayush-mission",
    name: "National AYUSH Mission",
    provider: "Ministry of AYUSH",
    summary:
      "Supports AYUSH healthcare infrastructure, co-location of AYUSH services in public facilities, medicinal plant cultivation and quality control of AYUSH drugs.",
    eligibility:
      "Patients can access AYUSH services at participating public facilities; cultivation and industry components are for institutions and farmers.",
    howToApply: [
      "Look for AYUSH wings or co-located services at district hospitals and PHCs.",
      "State AYUSH directorates publish facility lists and outpatient timings.",
      "Check the Ministry of AYUSH portal for state-specific programmes.",
    ],
    url: "https://ayush.gov.in/",
    official: "ayush.gov.in",
  },
  {
    slug: "janaushadhi",
    name: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)",
    provider: "Pharmaceuticals and Medical Devices Bureau of India",
    summary:
      "A network of Janaushadhi Kendras selling quality-assured generic medicines at reduced prices compared with branded equivalents.",
    eligibility: "Open to everyone. No enrolment or card required.",
    howToApply: [
      "Find a Janaushadhi Kendra using the official locator.",
      "Take your prescription to the counter.",
      "Ask the pharmacist to confirm the generic equivalent and dose with your prescriber if unsure.",
    ],
    url: "https://janaushadhi.gov.in/",
    official: "janaushadhi.gov.in",
    note: "Generic medicines contain the same active ingredient as the branded version but may look different. Never change a medicine without checking with your prescriber.",
  },
  {
    slug: "poshan-abhiyaan",
    name: "Poshan Abhiyaan (National Nutrition Mission)",
    provider: "Ministry of Women and Child Development",
    summary:
      "A national programme to reduce malnutrition in children, adolescent girls, pregnant women and lactating mothers through Anganwadi services, growth monitoring and nutrition education.",
    eligibility:
      "Services are delivered through Anganwadi centres to pregnant and lactating women, children under six, and adolescent girls. Specific benefits vary by state.",
    howToApply: [
      "Visit your local Anganwadi centre to register.",
      "Ask about supplementary nutrition, growth monitoring and counselling.",
      "Bring identity and any maternal health records you have.",
    ],
    url: "https://poshanabhiyaan.gov.in/",
    official: "poshanabhiyaan.gov.in",
  },
  {
    slug: "jal-jeevan-mission",
    name: "Jal Jeevan Mission",
    provider: "Ministry of Jal Shakti",
    summary:
      "Aims to provide functional household tap water connections in rural areas, with water quality monitoring and community involvement.",
    eligibility: "Rural households; implementation is through states and gram panchayats.",
    howToApply: [
      "Contact your gram panchayat or village water and sanitation committee.",
      "Ask about the village water safety and security plan and testing arrangements.",
      "Report non-functional connections through the state mission office.",
    ],
    url: "https://jaljeevanmission.gov.in/",
    official: "jaljeevanmission.gov.in",
  },
  {
    slug: "pmjay-senior-citizens",
    name: "PM-JAY for senior citizens aged 70 and above",
    provider: "National Health Authority",
    summary:
      "An expansion of PM-JAY announced in 2024 to cover all citizens aged 70 and above, regardless of income, under the Ayushman Bharat scheme.",
    eligibility:
      "Citizens aged 70 or above, with enrolment based on identity and age verification. Implementation details and card issuance are being rolled out; confirm the current process on the official portal.",
    howToApply: [
      "Check the official PM-JAY portal for the senior citizen enrolment process.",
      "Use the Ayushman app or visit a Common Service Centre for e-KYC.",
      "Confirm empanelment of your preferred hospital before admission.",
    ],
    url: "https://pmjay.gov.in/",
    official: "pmjay.gov.in",
    note: "This is a recent expansion. Verify current coverage and process on the portal before relying on it for treatment.",
  },
];

export const SCHEMES_UPDATED = "2026-11-10";
