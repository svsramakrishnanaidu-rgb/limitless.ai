"use client";

import { useStored, dateKey, shiftDate } from "./store";
import type { TrackerData } from "./types";

export const EMPTY_TRACKER: TrackerData = {
  water: {},
  sleep: [],
  steps: {},
  exercise: {},
  weight: [],
  bp: [],
  glucose: [],
  mood: [],
  habits: {},
};

export const GOALS = {
  waterMl: 2000,
  sleepMin: 7,
  sleepMax: 9,
  steps: 8000,
  exerciseMinutes: 30,
};

export function useTracker() {
  const [data, setData] = useStored<TrackerData>("tracker", EMPTY_TRACKER);

  return {
    data,
    setData,
    addWater(ml: number) {
      const key = dateKey();
      setData((prev) => ({
        ...prev,
        water: { ...prev.water, [key]: Math.max(0, (prev.water[key] ?? 0) + ml) },
      }));
    },
    setWater(ml: number) {
      const key = dateKey();
      setData((prev) => ({ ...prev, water: { ...prev.water, [key]: Math.max(0, ml) } }));
    },
    setSteps(steps: number) {
      const key = dateKey();
      setData((prev) => ({ ...prev, steps: { ...prev.steps, [key]: Math.max(0, Math.round(steps)) } }));
    },
    addExercise(minutes: number) {
      const key = dateKey();
      setData((prev) => ({
        ...prev,
        exercise: { ...prev.exercise, [key]: Math.max(0, (prev.exercise[key] ?? 0) + minutes) },
      }));
    },
    logSleep(hours: number) {
      const key = dateKey();
      setData((prev) => ({
        ...prev,
        sleep: [...prev.sleep.filter((s) => s.date !== key), { date: key, hours }].sort((a, b) =>
          a.date < b.date ? 1 : -1
        ),
      }));
    },
    logWeight(kg: number) {
      const key = dateKey();
      setData((prev) => ({
        ...prev,
        weight: [...prev.weight.filter((w) => w.date !== key), { date: key, kg }].sort((a, b) =>
          a.date < b.date ? 1 : -1
        ),
      }));
    },
    logBp(systolic: number, diastolic: number, pulse?: number) {
      const key = dateKey();
      setData((prev) => ({
        ...prev,
        bp: [{ date: key, systolic, diastolic, pulse }, ...prev.bp].slice(0, 200),
      }));
    },
    logGlucose(mgdl: number, context: "fasting" | "post-meal" | "random") {
      const key = dateKey();
      setData((prev) => ({
        ...prev,
        glucose: [{ date: key, mgdl, context }, ...prev.glucose].slice(0, 200),
      }));
    },
    logMood(mood: 1 | 2 | 3 | 4 | 5, note: string) {
      const key = dateKey();
      setData((prev) => ({
        ...prev,
        mood: [...prev.mood.filter((m) => m.date !== key), { date: key, mood, note }].sort((a, b) =>
          a.date < b.date ? 1 : -1
        ),
      }));
    },
    toggleHabit(habitId: string) {
      const key = dateKey();
      setData((prev) => {
        const done = prev.habits[habitId] ?? [];
        const next = done.includes(key) ? done.filter((d) => d !== key) : [...done, key];
        return { ...prev, habits: { ...prev.habits, [habitId]: next } };
      });
    },
  };
}

export type WellnessPart = {
  id: string;
  label: string;
  value: string;
  logged: boolean;
  ratio: number;
  weight: number;
};

export function wellnessSummary(data: TrackerData) {
  const key = dateKey();
  const water = data.water[key] ?? 0;
  const steps = data.steps[key] ?? 0;
  const exercise = data.exercise[key] ?? 0;
  const sleepEntry = data.sleep.find((s) => s.date === key);
  const moodEntry = data.mood.find((m) => m.date === key);

  const sleepHours = sleepEntry?.hours ?? 0;
  const sleepRatio = !sleepEntry
    ? 0
    : sleepHours < GOALS.sleepMin
      ? Math.max(0, sleepHours / GOALS.sleepMin)
      : sleepHours > GOALS.sleepMax
        ? Math.max(0.6, 1 - (sleepHours - GOALS.sleepMax) / 6)
        : 1;

  const parts: WellnessPart[] = [
    {
      id: "water",
      label: "Water",
      value: water ? `${(water / 1000).toFixed(1)} L` : "Not logged",
      logged: water > 0,
      ratio: Math.min(1, water / GOALS.waterMl),
      weight: 25,
    },
    {
      id: "sleep",
      label: "Sleep",
      value: sleepEntry ? `${sleepHours} h` : "Not logged",
      logged: Boolean(sleepEntry),
      ratio: sleepRatio,
      weight: 25,
    },
    {
      id: "steps",
      label: "Activity",
      value: steps ? `${steps.toLocaleString()} steps` : "Not logged",
      logged: steps > 0,
      ratio: Math.min(1, steps / GOALS.steps),
      weight: 25,
    },
    {
      id: "exercise",
      label: "Exercise",
      value: exercise ? `${exercise} min` : "Not logged",
      logged: exercise > 0,
      ratio: Math.min(1, exercise / GOALS.exerciseMinutes),
      weight: 10,
    },
    {
      id: "mood",
      label: "Mood",
      value: moodEntry ? `Level ${moodEntry.mood}/5` : "Not logged",
      logged: Boolean(moodEntry),
      ratio: moodEntry ? moodEntry.mood / 5 : 0,
      weight: 15,
    },
  ];

  const logged = parts.filter((p) => p.logged);
  const hasData = logged.length > 0;
  const earned = parts.reduce((sum, p) => sum + (p.logged ? p.ratio * p.weight : 0), 0);
  const possible = parts.reduce((sum, p) => sum + (p.logged ? p.weight : 0), 0);
  const score = possible > 0 ? Math.round((earned / possible) * 100) : 0;

  return { score, hasData, parts, loggedCount: logged.length, water, steps, sleepHours, exercise };
}

export function weeklySeries(data: TrackerData, days = 7) {
  const out: { date: string; label: string; water: number; sleep: number; steps: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = shiftDate(-i);
    const key = dateKey(date);
    out.push({
      date: key,
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      water: data.water[key] ?? 0,
      sleep: data.sleep.find((s) => s.date === key)?.hours ?? 0,
      steps: data.steps[key] ?? 0,
    });
  }
  return out;
}

export function bmi(kg: number, heightCm: number) {
  if (!kg || !heightCm) return null;
  const m = heightCm / 100;
  const value = kg / (m * m);
  let band = "Healthy range";
  if (value < 18.5) band = "Below the healthy range";
  else if (value >= 25 && value < 30) band = "Above the healthy range";
  else if (value >= 30) band = "Well above the healthy range";
  return { value: Number(value.toFixed(1)), band };
}

export function useSaved() {
  const [items, setItems] = useStored<import("./types").SavedItem[]>("saved", []);

  const toggle = (item: Omit<import("./types").SavedItem, "id" | "savedAt">) => {
    setItems((prev) => {
      const existing = prev.find((s) => s.type === item.type && s.slug === item.slug);
      if (existing) return prev.filter((s) => s.id !== existing.id);
      return [
        { ...item, id: `${item.type}-${item.slug}`, savedAt: new Date().toISOString() },
        ...prev,
      ];
    });
  };

  const has = (type: string, slug: string) => items.some((s) => s.type === type && s.slug === slug);
  const remove = (id: string) => setItems((prev) => prev.filter((s) => s.id !== id));

  return { items, toggle, has, remove, organized: Boolean(items) };
}
