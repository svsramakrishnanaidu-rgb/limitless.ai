"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PREFIX = "limitless.v1.";

/** Local calendar date key, e.g. 2026-11-16. */
export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function shiftDate(days: number, from: Date = new Date()): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Content dates use a fixed locale so server-rendered and hydrated markup always
 * agree. Editorial dates are shown in one stable format across regions.
 */
const DATE_LOCALE = "en-GB";

export function prettyDate(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(DATE_LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function shortDate(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(DATE_LOCALE, { day: "numeric", month: "short" });
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("limitless:store", { detail: key }));
  } catch {
    // Storage can be full or blocked (private mode). The UI surfaces this via the
    // offline/storage panel rather than failing silently in a confusing way.
  }
}

/**
 * Device-local persistence hook. Reads after mount so server and client markup
 * match, then keeps every mounted consumer in sync through a custom event.
 */
export function useStored<T>(key: string, initial: T): [T, (next: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  const initialRef = useRef(initial);

  useEffect(() => {
    setValue(read(key, initialRef.current));
    setHydrated(true);
    const sync = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === key) setValue(read(key, initialRef.current));
    };
    window.addEventListener("limitless:store", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("limitless:store", sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        write(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, set, hydrated];
}

export function exportAllData(): string {
  const out: Record<string, unknown> = {};
  if (typeof window === "undefined") return "{}";
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (!k || !k.startsWith(PREFIX)) continue;
    try {
      out[k.slice(PREFIX.length)] = JSON.parse(window.localStorage.getItem(k) ?? "null");
    } catch {
      out[k.slice(PREFIX.length)] = window.localStorage.getItem(k);
    }
  }
  return JSON.stringify(
    {
      app: "LIMITLESS",
      exportedAt: new Date().toISOString(),
      storage: "device-local",
      data: out,
    },
    null,
    2
  );
}

export function clearAllData() {
  if (typeof window === "undefined") return;
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k?.startsWith(PREFIX)) keys.push(k);
  }
  keys.forEach((k) => window.localStorage.removeItem(k));
  window.dispatchEvent(new CustomEvent("limitless:store", { detail: "*" }));
}

export function downloadText(filename: string, text: string, type = "application/json") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
