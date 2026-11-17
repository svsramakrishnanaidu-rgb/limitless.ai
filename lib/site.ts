export const BRAND = {
  name: "LIMITLESS",
  ai: "LIMITLESS AI",
  core: "LIMITLESS AI CORE",
  tagline: "Beyond Boundaries. Towards Better Health.",
} as const;

export type NavItem = {
  href: string;
  label: string;
  icon: string;
  group: "core" | "care" | "learn" | "account";
  description?: string;
};

export const PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "Home", icon: "Home", group: "core" },
  { href: "/ai", label: "LIMITLESS AI", icon: "Sparkles", group: "core" },
  { href: "/tracker", label: "Health Tracker", icon: "Activity", group: "core" },
  { href: "/explore", label: "Explore", icon: "Compass", group: "core" },
];

export const SIDEBAR_NAV: { group: string; items: { href: string; label: string; icon: string }[] }[] = [
  {
    group: "Care",
    items: [
      { href: "/", label: "Dashboard", icon: "LayoutDashboard" },
      { href: "/ai", label: "LIMITLESS AI", icon: "Sparkles" },
      { href: "/scanner", label: "Plant Scanner", icon: "ScanLine" },
      { href: "/yoga", label: "Yoga & Meditation", icon: "Flower2" },
      { href: "/tracker", label: "Health Tracker", icon: "Activity" },
      { href: "/reminders", label: "Reminders", icon: "BellRing" },
      { href: "/journal", label: "Health Journal", icon: "NotebookPen" },
    ],
  },
  {
    group: "Knowledge",
    items: [
      { href: "/library", label: "Traditional Healthcare", icon: "Library" },
      { href: "/plants", label: "Medicinal Plants", icon: "Leaf" },
      { href: "/nutrition", label: "Nutrition", icon: "UtensilsCrossed" },
      { href: "/compare", label: "Traditional vs Modern", icon: "Scale" },
      { href: "/learn", label: "Learning Centre", icon: "GraduationCap" },
      { href: "/schemes", label: "Government Schemes", icon: "Landmark" },
      { href: "/community", label: "Community Health", icon: "Users" },
    ],
  },
  {
    group: "Access",
    items: [
      { href: "/hospitals", label: "Hospitals & Clinics", icon: "MapPin" },
      { href: "/emergency", label: "Emergency SOS", icon: "Siren" },
      { href: "/offline", label: "Offline Library", icon: "Download" },
      { href: "/saved", label: "Saved Content", icon: "Bookmark" },
    ],
  },
  {
    group: "Account",
    items: [
      { href: "/profile", label: "Profile", icon: "UserRound" },
      { href: "/settings", label: "Settings", icon: "Settings" },
      { href: "/help", label: "Help & Support", icon: "LifeBuoy" },
    ],
  },
];

export const FOOTER_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/help", label: "Help & Support" },
  { href: "/settings", label: "Settings" },
];
