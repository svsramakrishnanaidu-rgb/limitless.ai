export type EmergencyContact = {
  id: string;
  name: string;
  relation: string;
  phone: string;
};

export type Profile = {
  name: string;
  bloodGroup: string;
  allergies: string;
  conditions: string;
  medications: string;
  heightCm: number | null;
  emergencyContacts: EmergencyContact[];
};

export type ReminderKind = "medicine" | "appointment" | "refill" | "water" | "exercise" | "sleep";

export type Reminder = {
  id: string;
  kind: ReminderKind;
  title: string;
  time: string;
  days: number[];
  enabled: boolean;
  notes: string;
  createdAt: string;
};

export type SleepEntry = { date: string; hours: number };
export type WeightEntry = { date: string; kg: number };
export type BpEntry = { date: string; systolic: number; diastolic: number; pulse?: number };
export type GlucoseEntry = { date: string; mgdl: number; context: "fasting" | "post-meal" | "random" };
export type MoodEntry = { date: string; mood: 1 | 2 | 3 | 4 | 5; note: string };

export type TrackerData = {
  water: Record<string, number>;
  sleep: SleepEntry[];
  steps: Record<string, number>;
  exercise: Record<string, number>;
  weight: WeightEntry[];
  bp: BpEntry[];
  glucose: GlucoseEntry[];
  mood: MoodEntry[];
  habits: Record<string, string[]>;
};

export type JournalEntry = {
  id: string;
  date: string;
  mood: string;
  symptoms: string;
  food: string;
  sleep: string;
  notes: string;
  questions: string;
  createdAt: string;
};

export type SavedItem = {
  id: string;
  type: "article" | "plant" | "lesson" | "recipe";
  slug: string;
  title: string;
  savedAt: string;
};

export type DownloadItem = {
  id: string;
  slug: string;
  type: "article" | "practice" | "recipe" | "first-aid";
  title: string;
  savedAt: string;
};

export type StoredMessage = { role: "user" | "assistant"; content: string; at: number };

export type ChatThread = {
  id: string;
  title: string;
  messages: StoredMessage[];
  updatedAt: number;
};

export type LearnProgress = {
  lessons: string[];
  quiz: Record<string, number>;
  bookmarks: string[];
};

export type ActionLog = {
  id: string;
  action: string;
  params: string;
  at: number;
  result: string;
};
