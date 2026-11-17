"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Apple,
  ArrowRight,
  BellRing,
  Bookmark,
  BookOpen,
  Building2,
  Droplets,
  Flower2,
  Footprints,
  Infinity as InfinityIcon,
  Moon,
  Plus,
  ScanLine,
  Siren,
  Sparkles,
} from "lucide-react";
import { ARTICLES } from "@/lib/content/articles";
import { LEARN_MODULES } from "@/lib/content/learn";
import { usePrefs } from "@/components/providers";
import { useStored, dateKey, shortDate } from "@/lib/store";
import type { Profile, Reminder, LearnProgress } from "@/lib/types";
import { useSaved, useTracker, wellnessSummary } from "@/lib/health";
import { ProgressRing } from "@/components/ProgressRing";
import { Glass, EmptyState, Callout } from "@/components/ui";
import { WaveLines } from "@/components/WaveLines";

const QUICK_LINKS = [
  { href: "/ai", label: "AI Assistant", note: "Ask a health question", icon: Sparkles, motif: "ai" },
  { href: "/scanner", label: "Plant Scan", note: "Identify a plant", icon: ScanLine, motif: "leaf" },
  { href: "/yoga", label: "Yoga", note: "Move and breathe", icon: Flower2, motif: "mountain" },
  { href: "/library", label: "Traditional Care", note: "Evidence and context", icon: BookOpen, motif: "mortar" },
  { href: "/nutrition", label: "Nutrition", note: "Meals and guidance", icon: Apple, motif: "apple" },
  { href: "/tracker", label: "Health Tracker", note: "Water, sleep, activity", icon: Activity, motif: "pulse" },
  { href: "/hospitals", label: "Hospitals", note: "Nearby care", icon: Building2, motif: "hospital" },
  { href: "/emergency", label: "SOS", note: "Emergency help", icon: Siren, motif: "ripple", tone: "emergency" },
] as const;

function CardMotif({ kind }: { kind: string }) {
  const stroke = "#d9c2ec";
  const soft = "rgba(185,144,218,0.55)";
  return (
    <svg className="module-motif" viewBox="0 0 120 120" aria-hidden focusable="false">
      {kind === "ai" && (
        <g fill="none" stroke={stroke} strokeWidth="1.1">
          <path d="M22 74c14-22 26-30 38-30s24 8 38 30" opacity="0.55" />
          <path d="M22 84c14-22 26-30 38-30s24 8 38 30" opacity="0.35" />
          <path d="M22 94c14-22 26-30 38-30s24 8 38 30" opacity="0.2" />
          <circle cx="96" cy="28" r="2" fill={stroke} stroke="none" />
        </g>
      )}
      {kind === "leaf" && (
        <g fill={soft} stroke={stroke} strokeWidth="1">
          <path d="M96 18c-26 2-44 18-46 44 24 2 42-14 46-44Z" opacity="0.55" />
          <path d="M50 62C66 50 82 40 96 30" fill="none" opacity="0.8" />
          <path d="M78 40c-8 4-14 10-18 18" fill="none" opacity="0.5" />
        </g>
      )}
      {kind === "mountain" && (
        <g fill="none" stroke={stroke} strokeWidth="1.1">
          <path d="M14 96l34-44 20 26 16-20 24 38Z" opacity="0.6" />
          <path d="M30 96l22-30 14 18" opacity="0.35" />
          <circle cx="94" cy="30" r="7" opacity="0.4" />
        </g>
      )}
      {kind === "mortar" && (
        <g fill="none" stroke={stroke} strokeWidth="1.1">
          <path d="M66 70h40c0 16-9 26-20 26s-20-10-20-26Z" opacity="0.7" />
          <path d="M62 70h48" opacity="0.5" />
          <path d="M88 70c-2-16 2-30 12-40" opacity="0.45" />
          <path d="M88 44c10-4 16-2 20 4-8 6-14 6-20-4Z" fill={soft} stroke="none" opacity="0.7" />
        </g>
      )}
      {kind === "apple" && (
        <g fill="none" stroke={stroke} strokeWidth="1.1">
          <path d="M86 58c10 0 16 8 16 18s-9 20-18 20-8-3-14-3-6 3-14 3-18-10-18-20 6-18 16-18 10 3 16 3 6-3 16-3Z" opacity="0.55" />
          <path d="M74 58c0-8 4-14 12-18" opacity="0.5" />
          <path d="M86 40c10-6 18-4 22 2-8 8-16 8-22-2Z" fill={soft} stroke="none" opacity="0.6" />
        </g>
      )}
      {kind === "pulse" && (
        <g fill="none" stroke={stroke} strokeWidth="1.1">
          <path d="M12 78h24l8-20 12 40 10-28 8 8h34" opacity="0.7" />
          <path d="M12 92h24l8-12 12 24 10-16 8 4h34" opacity="0.25" />
        </g>
      )}
      {kind === "hospital" && (
        <g fill="none" stroke={stroke} strokeWidth="1.1">
          <path d="M52 102V52h40v50" opacity="0.55" />
          <path d="M44 102V62H30v40" opacity="0.35" />
          <path d="M68 62v14M61 69h14" opacity="0.8" />
          <path d="M60 86h24" opacity="0.35" />
        </g>
      )}
      {kind === "ripple" && (
        <g fill="none" stroke="#ffb3c1" strokeWidth="1">
          <ellipse cx="82" cy="82" rx="30" ry="12" opacity="0.6" />
          <ellipse cx="82" cy="82" rx="44" ry="18" opacity="0.35" />
          <ellipse cx="82" cy="82" rx="58" ry="24" opacity="0.18" />
        </g>
      )}
    </svg>
  );
}

function LibraryMotif() {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 120 120"
      style={{ position: "absolute", right: -14, bottom: -18, width: 118, height: 118, opacity: 0.55, pointerEvents: "none" }}
    >
      <g fill="none" stroke="#d9c2ec" strokeWidth="1">
        <path d="M88 22c-26 6-40 26-38 52 22 4 42-16 38-52Z" fill="rgba(185,144,218,0.18)" />
        <path d="M50 74c10-18 24-32 38-44" opacity="0.7" />
        <path d="M66 54c-2 8-2 12 0 18" opacity="0.4" />
        <circle cx="88" cy="82" r="3" fill="#d9c2ec" opacity="0.6" />
      </g>
    </svg>
  );
}

export default function HomePage() {
  const { prefs, t } = usePrefs();
  const [profile] = useStored<Profile>("profile", {
    name: "",
    bloodGroup: "",
    allergies: "",
    conditions: "",
    medications: "",
    heightCm: null,
    emergencyContacts: [],
  });
  const [reminders] = useStored<Reminder[]>("reminders", []);
  const [progress] = useStored<LearnProgress>("learn-progress", { lessons: [], quiz: {}, bookmarks: [] });
  const { data, addWater } = useTracker();
  const { items: saved } = useSaved();
  const summary = wellnessSummary(data);

  // Rendered after mount so server and client formatting cannot disagree.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const greeting = useMemo(() => {
    if (!now) return "Welcome";
    const hour = now.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, [now]);

  const todayLabel = now
    ? now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
    : null;

  const dailyArticle = useMemo(() => {
    const dayIndex = Math.floor(Date.now() / 86_400_000);
    return ARTICLES[dayIndex % ARTICLES.length];
  }, []);

  const todaysReminders = useMemo(() => {
    const day = new Date().getDay();
    return reminders
      .filter((r) => r.enabled && r.days.includes(day))
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(0, 3);
  }, [reminders]);

  const nextLesson = useMemo(() => {
    for (const module of LEARN_MODULES) {
      const lesson = module.lessons.find((l) => !progress.lessons.includes(`${module.id}:${l.id}`));
      if (lesson) return { module, lesson };
    }
    return null;
  }, [progress.lessons]);

  return (
    <div className="flex flex-col gap-5">
      {/* Greeting */}
      <section className="relative flex flex-col gap-5 pb-1 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div aria-hidden className="pointer-events-none absolute -right-8 -top-20 h-64 w-[68%] overflow-hidden">
          <WaveLines opacity={0.55} />
        </div>
        <div className="relative flex min-w-0 items-center gap-4">
          <span className="infinity-badge" aria-hidden>
            ∞
          </span>
          <div className="min-w-0">
            <h1 className="brand-serif truncate" style={{ fontSize: "clamp(1.85rem, 3.4vw, 2.6rem)", lineHeight: 1.1 }}>
              {greeting}
              {profile.name ? `, ${profile.name.split(" ")[0]}` : ""}
            </h1>
            <p className="eyebrow mt-2" style={{ fontSize: "0.62rem", letterSpacing: "0.2em" }}>
              {t("home.subtitle")}
              {todayLabel ? ` · ${todayLabel}` : ""}
            </p>
          </div>
        </div>
        <div className="relative flex shrink-0 flex-wrap gap-2.5">
          <Link href="/ai" className="ai-button">
            <Sparkles size={17} aria-hidden /> Ask LIMITLESS AI
          </Link>
          <Link
            href="/emergency"
            className="ghost-button"
            style={{ borderColor: "rgba(152,30,66,0.65)", color: "var(--text-accent)", minHeight: 50 }}
          >
            <Siren size={16} aria-hidden /> SOS
          </Link>
        </div>
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          {/* Quick access */}
          <Glass className="card-pad">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="section-title">{t("home.quick")}</h2>
              <Link href="/explore" className="small muted flex items-center gap-1 hover:underline">
                All modules <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {QUICK_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="module-card"
                  data-tone={"tone" in item ? item.tone : undefined}
                >
                  <span className="module-icon">
                    <item.icon size={22} strokeWidth={1.6} aria-hidden />
                  </span>
                  <span className="brand-serif mt-3 text-[1.06rem] leading-tight">{item.label}</span>
                  <span className="tiny muted mt-1 leading-snug">{item.note}</span>
                  <CardMotif kind={item.motif} />
                </Link>
              ))}
            </div>
          </Glass>

          {/* Library */}
          <Glass className="card-pad">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="section-title">From the library</h2>
              <Link href="/library" className="small muted flex items-center gap-1 hover:underline">
                Browse <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {ARTICLES.slice(0, 3).map((article) => (
                <Link key={article.slug} href={`/library/${article.slug}`} className="library-card">
                  <span className="badge badge-gold w-fit">{article.category}</span>
                  <span className="brand-serif text-[1.18rem] leading-snug">{article.title}</span>
                  <span className="tiny muted" style={{ lineHeight: 1.5, maxWidth: "24ch" }}>
                    {article.summary.slice(0, 78)}…
                  </span>
                  <LibraryMotif />
                </Link>
              ))}
            </div>
          </Glass>
        </div>

        {/* Wellness + emergency */}
        <div className="flex min-w-0 flex-col gap-5">
          <Glass className="card-pad">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="section-title">{t("home.wellness")}</h2>
              <Link href="/tracker" className="small muted flex items-center gap-1 hover:underline">
                Log <ArrowRight size={14} aria-hidden />
              </Link>
            </div>

            {summary.hasData ? (
              <div className="mt-4">
                <div className="flex items-center gap-4">
                  <ProgressRing value={summary.score} label="logged" sublabel="%" />
                  <div className="min-w-0 flex-1">
                    <p className="small" style={{ lineHeight: 1.5 }}>
                      Based on {summary.loggedCount} of 5 measures you logged today.
                    </p>
                    <p className="tiny muted mt-1">Not a medical assessment.</p>
                  </div>
                </div>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {summary.parts.slice(0, 3).map((part) => (
                    <li key={part.id} className="flex items-center gap-2 text-sm">
                      <span aria-hidden style={{ color: "var(--accent)" }}>
                        {part.id === "water" ? <Droplets size={14} /> : part.id === "sleep" ? <Moon size={14} /> : <Footprints size={14} />}
                      </span>
                      <span className="muted" style={{ minWidth: 62 }}>{part.label}</span>
                      <span className="ml-auto font-medium">{part.value}</span>
                    </li>
                  ))}
                </ul>
                <button type="button" className="gold-button mt-4 w-full" onClick={() => addWater(250)}>
                  <Plus size={15} aria-hidden /> Add 250 ml
                </button>
              </div>
            ) : (
              <div className="pb-1 text-center">
                <div className="wellness-orb" aria-hidden>
                  <Droplets size={26} strokeWidth={1.4} />
                  <span className="water-ripple" />
                  <span className="water-ripple" />
                  <span className="water-ripple" />
                </div>
                <h3 className="brand-serif text-[1.28rem]">Nothing logged yet today</h3>
                <p className="small muted mx-auto mt-2" style={{ maxWidth: "36ch", lineHeight: 1.55 }}>
                  LIMITLESS never invents health measurements. Add your first glass of water or log last night&apos;s sleep to see your own numbers.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button type="button" className="gold-button" onClick={() => addWater(250)}>
                    <Plus size={15} aria-hidden /> Add 250 ml
                  </button>
                  <Link href="/tracker" className="ghost-button">
                    Open tracker
                  </Link>
                </div>
              </div>
            )}
          </Glass>

          <div className="emergency-panel card-pad relative">
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]">
              <WaveLines tone="burgundy" opacity={0.4} />
            </div>
            <div className="relative flex items-start gap-3.5">
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
                style={{ border: "1px solid rgba(217,45,69,0.5)", background: "rgba(109,0,26,0.35)", color: "#ffb3c1" }}
                aria-hidden
              >
                <Siren size={19} />
              </span>
              <div className="min-w-0">
                <h2 className="brand-serif text-[1.22rem]">Emergency help</h2>
                <p className="small muted mt-1.5" style={{ lineHeight: 1.55 }}>
                  Emergency numbers, your medical card and first-aid guidance are available without signing in.
                </p>
                <Link href="/emergency" className="ghost-button mt-3 w-full justify-between" style={{ borderColor: "rgba(217,45,69,0.45)" }}>
                  View emergency resources <ArrowRight size={15} aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reminders, saved, learning */}
      <div className="grid gap-4 md:grid-cols-3">
        <Glass className="card-pad">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="brand-serif text-[1.12rem]">Today&apos;s reminders</h2>
            <Link href="/reminders" className="icon-button" aria-label="Manage reminders" style={{ width: 34, height: 34 }}>
              <Plus size={15} aria-hidden />
            </Link>
          </div>
          {todaysReminders.length ? (
            <ul className="flex flex-col gap-2">
              {todaysReminders.map((r) => (
                <li key={r.id} className="flex items-center gap-2.5 rounded-xl border px-3 py-2" style={{ borderColor: "var(--line)" }}>
                  <BellRing size={14} style={{ color: "var(--accent)" }} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{r.title}</p>
                    <p className="tiny muted capitalize">{r.kind} · {r.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<BellRing size={17} aria-hidden />}
              title="No reminders today"
              description="Add medicine, appointment or refill reminders — stored on this device."
              action={<Link href="/reminders" className="ghost-button">Add reminder</Link>}
            />
          )}
        </Glass>

        <Glass className="card-pad">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="brand-serif text-[1.12rem]">Saved</h2>
            <Link href="/saved" className="small muted hover:underline">View all</Link>
          </div>
          {saved.length ? (
            <ul className="flex flex-col gap-2">
              {saved.slice(0, 3).map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.type === "plant" ? "/plants" : item.type === "recipe" ? "/nutrition" : `/library/${item.slug}`}
                    className="flex items-center gap-2 rounded-xl border px-3 py-2"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <Bookmark size={13} style={{ color: "var(--accent)" }} aria-hidden />
                    <span className="text-sm truncate">{item.title}</span>
                    <span className="tiny muted ml-auto shrink-0">{shortDate(dateKey(new Date(item.savedAt)))}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<Bookmark size={17} aria-hidden />}
              title="Nothing saved yet"
              description="Save an article, plant or recipe to find it here and in your offline library."
              action={<Link href="/library" className="ghost-button">Browse library</Link>}
            />
          )}
        </Glass>

        <Glass className="card-pad">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="brand-serif text-[1.12rem]">Continue learning</h2>
            <Link href="/learn" className="small muted hover:underline">Centre</Link>
          </div>
          {nextLesson ? (
            <div className="flex flex-col gap-2">
              <span className="badge w-fit">{nextLesson.module.level}</span>
              <p className="text-sm font-medium leading-snug">{nextLesson.lesson.title}</p>
              <p className="tiny muted">{nextLesson.module.title} · {nextLesson.lesson.minutes} min</p>
              <Link href={`/learn/${nextLesson.module.id}`} className="gold-button mt-1 w-full" style={{ minHeight: 42 }}>
                Continue <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          ) : (
            <EmptyState
              icon={<InfinityIcon size={17} aria-hidden />}
              title="All lessons complete"
              description="You have finished every lesson in the Learning Centre."
              action={<Link href="/learn" className="ghost-button">Review</Link>}
            />
          )}
        </Glass>
      </div>

      {/* Daily education */}
      <Glass className="card-pad aurora">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="eyebrow mb-1">Daily healthcare education</p>
            <h2 className="brand-serif" style={{ fontSize: "1.3rem" }}>{dailyArticle.title}</h2>
            <p className="small muted mt-1" style={{ maxWidth: "62ch" }}>{dailyArticle.summary}</p>
            <p className="tiny muted mt-2">
              Evidence level: {dailyArticle.evidenceLevel} · Reviewed {shortDate(dailyArticle.lastReviewed)}
            </p>
          </div>
          <Link href={`/library/${dailyArticle.slug}`} className="ghost-button shrink-0">
            Read <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
      </Glass>

      <Callout tone="warning" title="Health information, not medical advice">
        LIMITLESS explains health topics and helps you organise your own records. It does not diagnose conditions or prescribe treatment.
        {prefs.locale !== "en" && " Your interface language is saved; library articles are currently written in English."}
      </Callout>
    </div>
  );
}
