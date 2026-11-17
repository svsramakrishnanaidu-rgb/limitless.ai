export type Language = {
  code: string;
  english: string;
  native: string;
  dir: "ltr" | "rtl";
  translated: boolean;
};

export const LANGUAGES: Language[] = [
  { code: "en", english: "English", native: "English", dir: "ltr", translated: true },
  { code: "te", english: "Telugu", native: "తెలుగు", dir: "ltr", translated: true },
  { code: "hi", english: "Hindi", native: "हिन्दी", dir: "ltr", translated: true },
  { code: "ta", english: "Tamil", native: "தமிழ்", dir: "ltr", translated: false },
  { code: "kn", english: "Kannada", native: "ಕನ್ನಡ", dir: "ltr", translated: false },
  { code: "ml", english: "Malayalam", native: "മലയാളം", dir: "ltr", translated: false },
  { code: "bn", english: "Bengali", native: "বাংলা", dir: "ltr", translated: false },
  { code: "mr", english: "Marathi", native: "मराठी", dir: "ltr", translated: false },
  { code: "gu", english: "Gujarati", native: "ગુજરાતી", dir: "ltr", translated: false },
  { code: "pa", english: "Punjabi", native: "ਪੰਜਾਬੀ", dir: "ltr", translated: false },
  { code: "ur", english: "Urdu", native: "اردو", dir: "rtl", translated: false },
  { code: "ar", english: "Arabic", native: "العربية", dir: "rtl", translated: false },
  { code: "ja", english: "Japanese", native: "日本語", dir: "ltr", translated: false },
  { code: "ko", english: "Korean", native: "한국어", dir: "ltr", translated: false },
  { code: "zh", english: "Chinese", native: "中文", dir: "ltr", translated: false },
  { code: "es", english: "Spanish", native: "Español", dir: "ltr", translated: false },
  { code: "fr", english: "French", native: "Français", dir: "ltr", translated: false },
  { code: "de", english: "German", native: "Deutsch", dir: "ltr", translated: false },
  { code: "pt", english: "Portuguese", native: "Português", dir: "ltr", translated: false },
  { code: "ru", english: "Russian", native: "Русский", dir: "ltr", translated: false },
  { code: "it", english: "Italian", native: "Italiano", dir: "ltr", translated: false },
  { code: "id", english: "Indonesian", native: "Bahasa Indonesia", dir: "ltr", translated: false },
];

export function languageByCode(code: string): Language {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

type Entry = Record<string, string>;

const en: Entry = {
  "nav.home": "Home",
  "nav.explore": "Explore",
  "nav.ai": "LIMITLESS AI",
  "nav.tracker": "Health Tracker",
  "nav.profile": "Profile",
  "nav.settings": "Settings",
  "nav.emergency": "Emergency SOS",
  "common.search": "Search",
  "common.save": "Save",
  "common.saved": "Saved",
  "common.cancel": "Cancel",
  "common.close": "Close",
  "common.add": "Add",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.back": "Back",
  "common.next": "Next",
  "common.loading": "Loading",
  "common.retry": "Try again",
  "common.today": "Today",
  "common.none": "Nothing here yet",
  "theme.classic": "Classic",
  "theme.light": "Light",
  "theme.dark": "Dark",
  "home.greeting": "Welcome to LIMITLESS",
  "home.subtitle": "Your wellness dashboard",
  "home.wellness": "Today's wellness",
  "home.quick": "Quick access",
  "tracker.water": "Water",
  "tracker.sleep": "Sleep",
  "tracker.steps": "Activity",
  "settings.language": "Language",
  "settings.theme": "Theme",
  "settings.appearance": "Appearance",
  "settings.accessibility": "Accessibility",
  "settings.privacy": "Privacy and data",
  "disclaimer.short": "Educational information only. Not a medical diagnosis or prescription.",
};

const te: Entry = {
  "nav.home": "హోమ్",
  "nav.explore": "అన్వేషించండి",
  "nav.ai": "లిమిట్‌లెస్ AI",
  "nav.tracker": "ఆరోగ్య ట్రాకర్",
  "nav.profile": "ప్రొఫైల్",
  "nav.settings": "సెట్టింగ్‌లు",
  "nav.emergency": "అత్యవసర SOS",
  "common.search": "వెతకండి",
  "common.save": "భద్రపరచండి",
  "common.saved": "భద్రపరచబడింది",
  "common.cancel": "రద్దు",
  "common.close": "మూసివేయండి",
  "common.add": "జోడించండి",
  "common.delete": "తొలగించండి",
  "common.edit": "మార్చండి",
  "common.back": "వెనుకకు",
  "common.next": "తదుపరి",
  "common.loading": "లోడ్ అవుతోంది",
  "common.retry": "మళ్లీ ప్రయత్నించండి",
  "common.today": "ఈరోజు",
  "common.none": "ఇంకా ఏమీ లేదు",
  "theme.classic": "క్లాసిక్",
  "theme.light": "లైట్",
  "theme.dark": "డార్క్",
  "home.greeting": "లిమిట్‌లెస్‌కు స్వాగతం",
  "home.subtitle": "మీ ఆరోగ్య డాష్‌బోర్డ్",
  "home.wellness": "ఈరోజు ఆరోగ్యం",
  "home.quick": "త్వరిత యాక్సెస్",
  "tracker.water": "నీరు",
  "tracker.sleep": "నిద్ర",
  "tracker.steps": "కదలిక",
  "settings.language": "భాష",
  "settings.theme": "థీమ్",
  "settings.appearance": "రూపం",
  "settings.accessibility": "అందుబాటు",
  "settings.privacy": "గోప్యత మరియు డేటా",
  "disclaimer.short": "ఇది కేవలం విద్యా సమాచారం. వైద్య నిర్ధారణ లేదా ప్రిస్క్రిప్షన్ కాదు.",
};

const hi: Entry = {
  "nav.home": "होम",
  "nav.explore": "खोजें",
  "nav.ai": "लिमिटलेस AI",
  "nav.tracker": "स्वास्थ्य ट्रैकर",
  "nav.profile": "प्रोफ़ाइल",
  "nav.settings": "सेटिंग्स",
  "nav.emergency": "आपातकालीन SOS",
  "common.search": "खोजें",
  "common.save": "सहेजें",
  "common.saved": "सहेजा गया",
  "common.cancel": "रद्द करें",
  "common.close": "बंद करें",
  "common.add": "जोड़ें",
  "common.delete": "हटाएँ",
  "common.edit": "संपादित करें",
  "common.back": "वापस",
  "common.next": "आगे",
  "common.loading": "लोड हो रहा है",
  "common.retry": "पुनः प्रयास करें",
  "common.today": "आज",
  "common.none": "अभी कुछ नहीं",
  "theme.classic": "क्लासिक",
  "theme.light": "लाइट",
  "theme.dark": "डार्क",
  "home.greeting": "लिमिटलेस में आपका स्वागत है",
  "home.subtitle": "आपका स्वास्थ्य डैशबोर्ड",
  "home.wellness": "आज का स्वास्थ्य",
  "home.quick": "त्वरित पहुँच",
  "tracker.water": "पानी",
  "tracker.sleep": "नींद",
  "tracker.steps": "गतिविधि",
  "settings.language": "भाषा",
  "settings.theme": "थीम",
  "settings.appearance": "रूप",
  "settings.accessibility": "सुगम्यता",
  "settings.privacy": "गोपनीयता और डेटा",
  "disclaimer.short": "केवल शैक्षिक जानकारी। यह चिकित्सीय निदान या नुस्खा नहीं है।",
};

const DICTIONARIES: Record<string, Entry> = { en, te, hi };

export function translate(locale: string, key: string): string {
  const dict = DICTIONARIES[locale];
  return dict?.[key] ?? en[key] ?? key;
}

export function isTranslated(locale: string): boolean {
  return Boolean(DICTIONARIES[locale]);
}
