"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Bell, Globe2, Menu, Moon, Palette, Search, Settings, Siren, Sun, X } from "lucide-react";
import { BRAND, FOOTER_LINKS, SIDEBAR_NAV } from "@/lib/site";
import { LANGUAGES } from "@/lib/i18n";
import { LogoMark, Wordmark } from "./Logo";
import dynamic from "next/dynamic";
import { usePrefs, type ThemeName } from "./providers";
import { useStored } from "@/lib/store";
import type { Reminder } from "@/lib/types";
import { NavIcon } from "./icons";
import { WaveLines } from "./WaveLines";

// GSAP and the intro timeline stay out of the initial bundle; they load only
// when the intro actually has to play.
const Intro = dynamic(() => import("./Intro").then((m) => m.Intro), { ssr: false });

const THEME_LABELS: Record<ThemeName, string> = {
  classic: "Midnight",
  light: "Ivory",
  dark: "Obsidian",
};

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { prefs, setPref } = usePrefs();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [reminders] = useStored<Reminder[]>("reminders", []);

  useEffect(() => {
    if (sessionStorage.getItem("limitless.introSeen")) return;
    if (prefs.reduceMotion) {
      sessionStorage.setItem("limitless.introSeen", "1");
      return;
    }
    if (pathname !== "/") {
      sessionStorage.setItem("limitless.introSeen", "1");
      return;
    }
    setShowIntro(true);
  }, [pathname, prefs.reduceMotion]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const dueToday = useMemo(() => {
    const day = new Date().getDay();
    return reminders.filter((r) => r.enabled && r.days.includes(day)).length;
  }, [reminders]);

  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const finishIntro = () => {
    sessionStorage.setItem("limitless.introSeen", "1");
    setShowIntro(false);
  };

  const cycleTheme = () => {
    const order: ThemeName[] = ["classic", "light", "dark"];
    setPref("theme", order[(order.indexOf(prefs.theme) + 1) % order.length]);
  };

  const themeIcon =
    prefs.theme === "light" ? <Sun size={17} aria-hidden /> : prefs.theme === "dark" ? <Moon size={17} aria-hidden /> : <Palette size={17} aria-hidden />;

  return (
    <div className="app-frame">
      {showIntro && <Intro onComplete={finishIntro} />}

      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      {/* Desktop sidebar */}
      <aside className="sidebar" aria-label="Main navigation">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-44 overflow-hidden">
          <WaveLines opacity={0.45} />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-28 h-40 overflow-hidden">
          <WaveLines opacity={0.32} />
        </div>

        <Link href="/" className="relative mb-7 flex items-center gap-3 px-1.5">
          <LogoMark size={44} />
          <Wordmark />
        </Link>

        <nav className="relative flex flex-1 flex-col gap-6 pb-6">
          {SIDEBAR_NAV.map((section) => (
            <div key={section.group}>
              <p className="nav-group-label">{section.group}</p>
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="nav-link" aria-current={active(item.href) ? "page" : undefined}>
                      <span className="nav-medallion">
                        <NavIcon name={item.icon} size={19} />
                      </span>
                      <span className="truncate">{item.label}</span>
                      {item.href === "/reminders" && dueToday > 0 && (
                        <span className="badge badge-gold ml-auto">{dueToday}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="relative mt-auto border-t pt-4" style={{ borderColor: "var(--line)" }}>
          <p className="eyebrow mb-2 px-1.5" style={{ fontSize: "0.58rem" }}>
            Appearance
          </p>
          <div className="mb-4 flex gap-1.5">
            {(["classic", "light", "dark"] as ThemeName[]).map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => setPref("theme", theme)}
                aria-pressed={prefs.theme === theme}
                className="chip flex-1 justify-center px-0"
                style={{ fontSize: "0.68rem" }}
              >
                {THEME_LABELS[theme]}
              </button>
            ))}
          </div>
          <Link
            href="/emergency"
            className="emergency-button flex w-full justify-start gap-2"
            style={{ minHeight: 42 }}
          >
            <Siren size={16} aria-hidden /> Emergency SOS
          </Link>
          <p className="tiny muted mt-4 px-1" style={{ lineHeight: 1.5 }}>
            Health education only. Not a diagnosis, prescription or emergency service.
          </p>
        </div>
      </aside>

      <div className="app-main">
        {/* Mobile header */}
        <div className="mobile-topbar">
          <button
            type="button"
            className="icon-button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
          <Link href="/" className="flex items-center gap-2">
            <LogoMark size={30} />
            <span className="display" style={{ fontSize: "0.9rem", letterSpacing: "0.16em" }}>
              {BRAND.name}
            </span>
          </Link>
          <div className="flex items-center gap-1.5">
            <Link href="/ai" className="icon-button" aria-label="Ask LIMITLESS AI">
              <Search size={17} aria-hidden />
            </Link>
            <button type="button" className="icon-button" onClick={cycleTheme} aria-label={`Theme: ${THEME_LABELS[prefs.theme]}. Change theme`}>
              {themeIcon}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            id="mobile-menu"
            className="liquid-glass absolute left-2 right-2 top-[62px] z-40 max-h-[75dvh] overflow-y-auto p-3 lg:hidden"
            style={{ background: "var(--panel-strong)" }}
          >
            {SIDEBAR_NAV.map((section) => (
              <div key={section.group} className="mb-3">
                <p className="nav-group-label" style={{ fontSize: "0.58rem" }}>{section.group}</p>
                <ul>
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="nav-link" aria-current={active(item.href) ? "page" : undefined}>
                        <span className="nav-medallion">
                          <NavIcon name={item.icon} size={18} />
                        </span>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link href="/emergency" className="emergency-button w-full justify-center">
              <Siren size={16} aria-hidden /> Emergency SOS
            </Link>
          </div>
        )}

        {/* Desktop utility bar */}
        <div className="app-header">
          <form action="/ai" method="get" className="relative min-w-0 flex-1" role="search">
            <Search
              size={18}
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--muted)" }}
            />
            <input
              type="search"
              name="q"
              placeholder="Ask LIMITLESS AI or search the library"
              aria-label="Ask LIMITLESS AI or search the library"
              className="field"
              style={{ minHeight: 50, paddingLeft: "2.8rem" }}
            />
          </form>

          <div className="flex shrink-0 items-center gap-2">
            <label className="sr-only" htmlFor="shell-language">
              Interface language
            </label>
            <div className="relative">
              <Globe2
                size={16}
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--muted)" }}
              />
              <select
                id="shell-language"
                className="field"
                style={{ minHeight: 50, paddingLeft: "2.2rem", width: 150, fontSize: "0.84rem" }}
                value={prefs.locale}
                onChange={(e) => setPref("locale", e.target.value)}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native}
                  </option>
                ))}
              </select>
            </div>

            <Link href="/settings" className="icon-button" style={{ width: 50, height: 50 }} aria-label="Settings">
              <Settings size={18} aria-hidden />
            </Link>

            <Link
              href="/reminders"
              className="icon-button relative"
              style={{ width: 50, height: 50 }}
              aria-label={`Notifications${dueToday ? `, ${dueToday} scheduled today` : ""}`}
            >
              <Bell size={18} aria-hidden />
              {dueToday > 0 && (
                <span
                  className="absolute right-2 top-2 h-2 w-2 rounded-full"
                  style={{ background: "#e7a1b6", boxShadow: "0 0 0 2px rgba(8,7,11,0.9)" }}
                  aria-hidden
                />
              )}
            </Link>

            <Link href="/emergency" className="emergency-button" style={{ minHeight: 50, paddingInline: "1.15rem" }}>
              <Siren size={16} aria-hidden /> Emergency
            </Link>
          </div>
        </div>

        <main id="main" className="page-wrap flex-1">
          {children}
        </main>

        <footer className="border-t px-6 py-6 no-print" style={{ borderColor: "var(--line)" }}>
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="tiny muted">
              © {new Date().getFullYear()} {BRAND.name}. {BRAND.tagline}
            </p>
            <nav aria-label="Legal and support" className="flex flex-wrap gap-x-4 gap-y-1">
              {FOOTER_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="tiny muted hover:underline">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <p className="tiny muted mx-auto mt-3 max-w-[1440px]" style={{ opacity: 0.8 }}>
            LIMITLESS provides health education. It does not diagnose, prescribe or replace professional care. In an emergency, call your local emergency number.
          </p>
        </footer>

        {/* Mobile floating navigation */}
        <nav className="bottom-nav no-print" aria-label="Primary">
          {[
            { href: "/", label: "Home", icon: "Home" as const },
            { href: "/explore", label: "Explore", icon: "Compass" as const },
            { href: "/ai", label: "AI", icon: "Sparkles" as const, orb: true },
            { href: "/tracker", label: "Tracker", icon: "Activity" as const },
            { href: "/profile", label: "Profile", icon: "UserRound" as const },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bottom-nav-item"
              aria-current={active(item.href) ? "page" : undefined}
            >
              {item.orb ? (
                <span
                  className="grid h-8 w-8 place-items-center rounded-full"
                  style={{
                    background: "radial-gradient(circle at 35% 30%, #8a54a9, #211526 78%)",
                    border: "1px solid rgba(185,144,218,0.7)",
                    color: "#f1e4fa",
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "1.05rem",
                    lineHeight: 1,
                  }}
                  aria-hidden
                >
                  ∞
                </span>
              ) : (
                <NavIcon name={item.icon} size={19} />
              )}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
