"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translate } from "@/lib/i18n";
import { useStored } from "@/lib/store";

export type ThemeName = "classic" | "light" | "dark";

export type PerformanceMode = "auto" | "ultra" | "balanced" | "performance" | "saver";

/** Rough capability detection only — nothing device-identifying is stored. */
function detectPerformanceMode(): Exclude<PerformanceMode, "auto"> {
  if (typeof navigator === "undefined") return "balanced";
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (nav.connection?.saveData) return "saver";
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory;
  const type = nav.connection?.effectiveType ?? "";
  if (cores <= 4 || (memory !== undefined && memory <= 4) || type === "2g" || type === "slow-2g" || type === "3g") {
    return "performance";
  }
  return "balanced";
}

export type Preferences = {
  theme: ThemeName;
  performanceMode: PerformanceMode;
  syncSystemTheme: boolean;
  locale: string;
  fontScale: number;
  highContrast: boolean;
  reduceMotion: boolean;
  simpleMode: boolean;
  lowBandwidth: boolean;
  country: string;
  spokenReplies: boolean;
  onboardingSeen: boolean;
};

export const DEFAULT_PREFERENCES: Preferences = {
  theme: "classic",
  performanceMode: "auto",
  syncSystemTheme: false,
  locale: "en",
  fontScale: 1,
  highContrast: false,
  reduceMotion: false,
  simpleMode: false,
  lowBandwidth: false,
  country: "IN",
  spokenReplies: false,
  onboardingSeen: false,
};

type PrefsContextValue = {
  prefs: Preferences;
  setPref: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  hydrated: boolean;
  t: (key: string) => string;
  effectivePerformance: Exclude<PerformanceMode, "auto">;
};

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function usePrefs(): PrefsContextValue {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside <Providers>");
  return ctx;
}

export function useT() {
  return usePrefs().t;
}

/* ------------------------------------------------------------------ toasts */

type Toast = { id: number; message: string; tone: "success" | "error" | "info" };
type ToastContextValue = { push: (message: string, tone?: Toast["tone"]) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <Providers>");
  return ctx;
}

export function Providers({ children }: { children: ReactNode }) {
  const [stored, setStored, hydrated] = useStored<Preferences>("preferences", DEFAULT_PREFERENCES);
  const prefs = useMemo(() => ({ ...DEFAULT_PREFERENCES, ...stored }), [stored]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [effectivePerformance, setEffectivePerformance] = useState<Exclude<PerformanceMode, "auto">>("balanced");

  const setPref = useCallback(
    <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
      setStored((prev) => ({ ...DEFAULT_PREFERENCES, ...prev, [key]: value }));
    },
    [setStored]
  );

  const push = useCallback((message: string, tone: Toast["tone"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const t = useCallback((key: string) => translate(prefs.locale, key), [prefs.locale]);

  /* Theme and accessibility attributes live on <html>. */
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = prefs.theme;
    root.dataset.contrast = prefs.highContrast ? "high" : "normal";
    root.dataset.motion = prefs.reduceMotion ? "reduce" : "full";
    root.dataset.simple = String(prefs.simpleMode);
    root.lang = prefs.locale;
    root.dir = prefs.locale === "ar" || prefs.locale === "ur" ? "rtl" : "ltr";
    root.style.setProperty("--font-scale", String(prefs.fontScale));
  }, [prefs.theme, prefs.highContrast, prefs.reduceMotion, prefs.simpleMode, prefs.locale, prefs.fontScale]);

  /* Adaptive performance mode: manual choice, or a capability-based default. */
  useEffect(() => {
    const resolve = () => {
      const next = prefs.performanceMode === "auto" ? detectPerformanceMode() : prefs.performanceMode;
      setEffectivePerformance(next);
      document.documentElement.dataset.perf = next;
    };
    resolve();
    if (prefs.performanceMode === "auto") {
      window.addEventListener("online", resolve);
      return () => window.removeEventListener("online", resolve);
    }
  }, [prefs.performanceMode]);

  /* Pause decorative CSS animations while the tab is in the background. */
  useEffect(() => {
    const update = () => {
      document.documentElement.dataset.paused = document.hidden ? "true" : "false";
    };
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  /* Optional system-theme synchronisation. */
  useEffect(() => {
    if (!prefs.syncSystemTheme) return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const apply = () => setPref("theme", mq.matches ? "light" : "dark");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [prefs.syncSystemTheme, setPref]);

  /* Register the service worker for offline reading. */
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* Offline caching is best-effort; the app still works online. */
      });
    };
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  const toastValue = useMemo(() => ({ push }), [push]);

  return (
    <PrefsContext.Provider value={{ prefs, setPref, hydrated, t, effectivePerformance }}>
      <ToastContext.Provider value={toastValue}>
        {children}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="fixed left-1/2 z-[90] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-2"
          style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom, 0px))" }}
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="liquid-glass px-4 py-3 text-sm"
              style={{
                borderColor:
                  toast.tone === "error"
                    ? "rgba(229,72,77,0.6)"
                    : toast.tone === "success"
                      ? "rgba(0,167,139,0.6)"
                      : "var(--line-strong)",
              }}
            >
              {toast.message}
            </div>
          ))}
        </div>
      </ToastContext.Provider>
    </PrefsContext.Provider>
  );
}
