"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Check,
  Download,
  Eye,
  EyeOff,
  Globe2,
  Keyboard,
  Languages,
  Moon,
  Palette,
  RefreshCw,
  ShieldCheck,
  Sun,
  Trash2,
  Wifi,
} from "lucide-react";
import { Glass, PageHeader, Callout } from "@/components/ui";
import { DEFAULT_PREFERENCES, usePrefs, useToast, type PerformanceMode, type ThemeName } from "@/components/providers";
import { LANGUAGES, isTranslated } from "@/lib/i18n";
import { EMERGENCY_NUMBERS } from "@/lib/content/emergency";
import { clearAllData, downloadText, exportAllData, useStored } from "@/lib/store";
import type { DownloadItem } from "@/lib/types";

type ProviderStatus = {
  providers: { id: string; label: string; model: string; connected: boolean; vision: boolean; costTier: string }[];
  configured: number;
  probe: null | { ok: boolean; provider?: string; model?: string; latencyMs?: number; failovers?: number; message?: string };
  metrics?: {
    uptimeSeconds: number;
    chatRequests: number;
    scanRequests: number;
    streamedResponses: number;
    failovers: number;
    rejectedRequests: number;
    providers: { id: string; requests: number; failures: number; averageLatencyMs: number | null; lastError: string | null }[];
  };
};

const PERFORMANCE_OPTIONS: { value: PerformanceMode; label: string; description: string }[] = [
  { value: "auto", label: "Automatic", description: "Detects device memory, CPU cores, connection type and data-saver mode." },
  { value: "ultra", label: "Ultra", description: "Full glass blur, reflections and ambient motion." },
  { value: "balanced", label: "Balanced", description: "Recommended default: glass surfaces with restrained motion." },
  { value: "performance", label: "Performance", description: "Lighter blur, no hover lift, static background glow." },
  { value: "saver", label: "Data saver", description: "Solid surfaces, no decorative animation, lowest rendering cost." },
];

const THEMES: { value: ThemeName; label: string; description: string; icon: typeof Sun }[] = [
  { value: "classic", label: "Royal Midnight", description: "Night black, deep violet and burgundy. The default.", icon: Palette },
  { value: "light", label: "Royal Ivory", description: "Warm ivory surfaces with burgundy and violet actions.", icon: Sun },
  { value: "dark", label: "Obsidian Night", description: "Pure black surfaces with muted violet accents.", icon: Moon },
];

export default function SettingsPage() {
  const { prefs, setPref, t, effectivePerformance } = usePrefs();
  const toast = useToast();
  const [status, setStatus] = useState<ProviderStatus | null>(null);
  const [probing, setProbing] = useState(false);
  const [downloads] = useStored<DownloadItem[]>("downloads", []);
  const [confirmClear, setConfirmClear] = useState("");

  const loadStatus = (probe = false) => {
    setProbing(probe);
    fetch(`/api/ai/status${probe ? "?probe=1" : ""}`)
      .then((r) => r.json())
      .then((data: ProviderStatus) => setStatus(data))
      .catch(() => toast.push("Could not read AI provider status.", "error"))
      .finally(() => setProbing(false));
  };

  useEffect(() => {
    loadStatus(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exportData = () => {
    downloadText(`limitless-data-${new Date().toISOString().slice(0, 10)}.json`, exportAllData());
    toast.push("Download started. The file contains everything stored on this device.", "success");
  };

  const deleteEverything = () => {
    if (confirmClear !== "DELETE") {
      toast.push("Type DELETE to confirm.", "error");
      return;
    }
    clearAllData();
    setPref("theme", DEFAULT_PREFERENCES.theme);
    setConfirmClear("");
    toast.push("All device data was cleared.", "success");
  };

  const language = LANGUAGES.find((l) => l.code === prefs.locale);

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Preferences and controls"
        description="Everything here is stored on this device. Health data stays in your browser unless you send a message or photo to a provider yourself."
      />

      <div className="flex flex-col gap-4">
        <Glass className="card-pad">
          <h2 className="section-title mb-1 flex items-center gap-2"><Palette size={17} aria-hidden /> {t("settings.theme")}</h2>
          <p className="tiny muted mb-3">Choose how LIMITLESS looks. Every page, chart, dialog and form uses the same tokens in all three themes.</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {THEMES.map((theme) => (
              <button
                key={theme.value}
                type="button"
                onClick={() => setPref("theme", theme.value)}
                aria-pressed={prefs.theme === theme.value}
                className="rounded-2xl border p-3 text-left transition-colors"
                style={{
                  borderColor: prefs.theme === theme.value ? "var(--line-strong)" : "var(--line)",
                  background: prefs.theme === theme.value ? "rgba(152,30,66,0.18)" : "transparent",
                }}
              >
                <div className="flex items-center justify-between">
                  <theme.icon size={16} aria-hidden style={{ color: "var(--gold)" }} />
                  {prefs.theme === theme.value && <Check size={15} aria-hidden style={{ color: "var(--accent)" }} />}
                </div>
                <p className="mt-2 text-sm font-medium">{theme.label}</p>
                <p className="tiny muted mt-0.5" style={{ lineHeight: 1.45 }}>{theme.description}</p>
              </button>
            ))}
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={prefs.syncSystemTheme} onChange={(e) => setPref("syncSystemTheme", e.target.checked)} />
            Follow the device&apos;s light or dark setting
          </label>
          {prefs.syncSystemTheme && <p className="tiny muted ml-6">The device setting overrides the theme chosen above.</p>}
        </Glass>

        <Glass className="card-pad" id="performance">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="section-title mb-1">Performance mode</h2>
              <p className="tiny muted">Controls glass blur, ambient animation and decorative effects. Emergency pages are never affected.</p>
            </div>
            <span className="badge badge-green">Active: {effectivePerformance}</span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {PERFORMANCE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPref("performanceMode", option.value)}
                aria-pressed={prefs.performanceMode === option.value}
                className="rounded-2xl border p-3 text-left transition-colors"
                style={{
                  borderColor: prefs.performanceMode === option.value ? "var(--line-strong)" : "var(--line)",
                  background: prefs.performanceMode === option.value ? "rgba(152,30,66,0.18)" : "transparent",
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{option.label}</p>
                  {prefs.performanceMode === option.value && <Check size={14} aria-hidden style={{ color: "var(--accent)" }} />}
                </div>
                <p className="tiny muted mt-0.5" style={{ lineHeight: 1.45 }}>{option.description}</p>
              </button>
            ))}
          </div>
        </Glass>

        <div className="grid gap-4 lg:grid-cols-2">
          <Glass className="card-pad">
            <h2 className="section-title mb-1 flex items-center gap-2"><Languages size={17} aria-hidden /> {t("settings.language")}</h2>
            <p className="tiny muted mb-3">Interface language. Library content remains in English for now.</p>
            <label className="sr-only" htmlFor="settings-language">Interface language</label>
            <select id="settings-language" className="field" value={prefs.locale} onChange={(e) => setPref("locale", e.target.value)}>
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native} — {lang.english}{isTranslated(lang.code) ? "" : " (fallback)"}
                </option>
              ))}
            </select>
            <p className="tiny muted mt-2">
              {language?.native} selected{language?.dir === "rtl" ? " · right-to-left layout active" : ""}. Interface strings are translated for English,
              Telugu and Hindi. Other languages are saved and fall back to English until reviewed translations are added.
            </p>
          </Glass>

          <Glass className="card-pad">
            <h2 className="section-title mb-1 flex items-center gap-2"><Globe2 size={17} aria-hidden /> Region</h2>
            <p className="tiny muted mb-3">Used for emergency numbers and hospital search.</p>
            <label className="sr-only" htmlFor="settings-country">Country</label>
            <select id="settings-country" className="field" value={prefs.country} onChange={(e) => setPref("country", e.target.value)}>
              {EMERGENCY_NUMBERS.map((c) => (
                <option key={c.code} value={c.code}>{c.country}</option>
              ))}
            </select>
            <p className="tiny muted mt-2">Emergency numbers for the selected country appear on the SOS page. Confirm locally before relying on them.</p>
          </Glass>
        </div>

        <Glass className="card-pad" id="accessibility">
          <h2 className="section-title mb-1">{t("settings.accessibility")}</h2>
          <p className="tiny muted mb-3">Targets WCAG 2.2 AA where feasible. Keyboard focus is always visible.</p>

          <div className="flex flex-col gap-3">
            <div>
              <label className="field-label" htmlFor="font-scale">Text size · {Math.round(prefs.fontScale * 100)}%</label>
              <input
                id="font-scale"
                type="range"
                min={0.9}
                max={1.4}
                step={0.05}
                value={prefs.fontScale}
                onChange={(e) => setPref("fontScale", Number(e.target.value))}
                className="w-full"
                style={{ accentColor: "var(--gold)" }}
                aria-valuemin={90}
                aria-valuemax={140}
                aria-valuenow={Math.round(prefs.fontScale * 100)}
              />
              <p className="tiny muted">Scales the whole interface, including this page.</p>
            </div>

            {[
              { key: "highContrast" as const, label: "High contrast mode", hint: "Stronger borders, brighter text and clearer focus rings." },
              { key: "reduceMotion" as const, label: "Reduce motion", hint: "Disables the intro and non-essential animation." },
              { key: "simpleMode" as const, label: "Simplified interface", hint: "Larger targets and fewer decorative effects." },
              { key: "lowBandwidth" as const, label: "Low-bandwidth mode", hint: "Skips remote map embeds for slow connections." },
            ].map((option) => (
              <label key={option.key} className="flex items-start gap-2.5 text-sm" style={{ lineHeight: 1.45 }}>
                <input type="checkbox" className="mt-1" checked={prefs[option.key]} onChange={(e) => setPref(option.key, e.target.checked)} />
                <span>
                  {option.label}
                  <span className="tiny muted block">{option.hint}</span>
                </span>
              </label>
            ))}

            <div className="flex items-start gap-2 text-sm">
              <Keyboard size={16} aria-hidden className="mt-0.5" style={{ color: "var(--muted)" }} />
              <p className="tiny muted">Keyboard: Tab to move, Enter to activate, Escape to close dialogs. The skip link jumps to main content.</p>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Eye size={16} aria-hidden className="mt-0.5" style={{ color: "var(--muted)" }} />
              <p className="tiny muted">Screen readers: controls are labelled and status messages are announced politely.</p>
            </div>
          </div>
        </Glass>

        <Glass className="card-pad">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="section-title mb-1">{t("settings.privacy")}</h2>
              <p className="tiny muted" style={{ maxWidth: "60ch" }}>
                Health records, reminders, journal entries and chat history live in this browser&apos;s local storage. This release has no account server,
                so there is no cloud backup. Export regularly.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="gold-button" onClick={exportData}>
                <Download size={15} aria-hidden /> Export all data
              </button>
              <Link href="/privacy" className="ghost-button">Privacy policy</Link>
            </div>
          </div>

          <div className="mt-4 rounded-xl border p-3" style={{ borderColor: "rgba(229,72,77,0.4)" }}>
            <p className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--danger)" }}>
              <AlertTriangle size={15} aria-hidden /> Delete all data
            </p>
            <p className="tiny muted mt-1">
              Removes saved content, tracker data, journal entries, reminders, preferences and chats from this browser. {downloads.length} offline item(s)
              and the cached app shell may remain until you clear site data in browser settings.
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                className="field"
                placeholder="Type DELETE to confirm"
                aria-label="Type DELETE to confirm data removal"
                value={confirmClear}
                onChange={(e) => setConfirmClear(e.target.value)}
              />
              <button type="button" className="danger-button ghost-button shrink-0" onClick={deleteEverything}>
                <Trash2 size={15} aria-hidden /> Delete everything
              </button>
            </div>
          </div>
        </Glass>

        <Glass className="card-pad" id="ai">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="section-title mb-1">AI provider status</h2>
              <p className="tiny muted">
                Keys are configured server-side in <code style={{ fontFamily: "monospace" }}>.env.local</code> and are never sent to the browser.
              </p>
            </div>
            <button type="button" className="ghost-button" onClick={() => loadStatus(true)} disabled={probing}>
              <RefreshCw size={15} aria-hidden /> {probing ? "Testing…" : "Test providers"}
            </button>
          </div>

          {!status ? (
            <div className="skeleton mt-3 h-24 w-full" />
          ) : (
            <>
              <div className="mt-3 flex flex-col gap-2">
                {status.providers.map((provider) => (
                  <div key={provider.id} className="flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2" style={{ borderColor: "var(--line)" }}>
                    <span className={`badge ${provider.connected ? "badge-green" : ""}`}>
                      {provider.connected ? <Check size={11} aria-hidden /> : <EyeOff size={11} aria-hidden />}
                      {provider.connected ? "Configured" : "No key"}
                    </span>
                    <span className="small font-medium">{provider.label}</span>
                    <span className="tiny muted truncate">{provider.model}</span>
                    {provider.vision && <span className="badge ml-auto">Vision</span>}
                  </div>
                ))}
              </div>

              {status.probe && (
                <div className="mt-3">
                  <Callout tone={status.probe.ok ? "success" : "danger"} title={status.probe.ok ? "Provider responded" : "No provider responded"}>
                    {status.probe.ok
                      ? `${status.probe.provider} answered in ${status.probe.latencyMs} ms${status.probe.failovers ? ` after ${status.probe.failovers} failover(s)` : ""}.`
                      : status.probe.message}
                  </Callout>
                </div>
              )}

              <p className="tiny muted mt-2">
                {status.configured > 0
                  ? `${status.configured} provider(s) configured. Requests route to the healthiest configured provider with automatic failover and rate limits.`
                  : "No providers are configured. AI features return a clear service-unavailable message until a key is added."}
              </p>

              {status.metrics && (
                <div className="mt-3 rounded-xl border p-3" style={{ borderColor: "var(--line)" }}>
                  <p className="eyebrow mb-2">This server instance · measured</p>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-3">
                    <div><dt className="tiny muted">Uptime</dt><dd style={{ margin: 0 }}>{Math.floor(status.metrics.uptimeSeconds / 60)} min</dd></div>
                    <div><dt className="tiny muted">Chat requests</dt><dd style={{ margin: 0 }}>{status.metrics.chatRequests}</dd></div>
                    <div><dt className="tiny muted">Scans</dt><dd style={{ margin: 0 }}>{status.metrics.scanRequests}</dd></div>
                    <div><dt className="tiny muted">Streamed</dt><dd style={{ margin: 0 }}>{status.metrics.streamedResponses}</dd></div>
                    <div><dt className="tiny muted">Failovers</dt><dd style={{ margin: 0 }}>{status.metrics.failovers}</dd></div>
                    <div><dt className="tiny muted">Rate-limited</dt><dd style={{ margin: 0 }}>{status.metrics.rejectedRequests}</dd></div>
                  </dl>
                  {status.metrics.providers.length > 0 && (
                    <ul className="mt-2 flex flex-col gap-1">
                      {status.metrics.providers.map((p) => (
                        <li key={p.id} className="tiny muted">
                          {p.id}: {p.requests} attempts, {p.failures} failed, average {p.averageLatencyMs ?? "—"} ms
                          {p.lastError ? ` · last error: ${p.lastError}` : ""}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="tiny muted mt-2">Counters are per server instance, not global analytics. No user data is recorded.</p>
                </div>
              )}
            </>
          )}

          <label className="mt-3 flex items-start gap-2.5 text-sm">
            <input type="checkbox" className="mt-1" checked={prefs.spokenReplies} onChange={(e) => setPref("spokenReplies", e.target.checked)} />
            <span>
              Speak assistant replies aloud
              <span className="tiny muted block">Uses your device&apos;s speech synthesis. No audio leaves the device.</span>
            </span>
          </label>
        </Glass>

        <Glass className="card-pad">
          <h2 className="section-title mb-2">About this release</h2>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div><dt className="tiny muted">Version</dt><dd style={{ margin: 0 }}>1.0.0 · web release</dd></div>
            <div><dt className="tiny muted">Data storage</dt><dd style={{ margin: 0 }}>Device-local (browser)</dd></div>
            <div><dt className="tiny muted">Accounts</dt><dd style={{ margin: 0 }}>Not enabled in this build</dd></div>
            <div><dt className="tiny muted">Deployment</dt><dd style={{ margin: 0 }}>Awaiting a custom domain</dd></div>
          </dl>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/privacy" className="ghost-button">Privacy policy</Link>
            <Link href="/terms" className="ghost-button">Terms & conditions</Link>
            <Link href="/help" className="ghost-button">Help & support</Link>
            <button
              type="button"
              className="ghost-button"
              onClick={() => {
                sessionStorage.removeItem("limitless.introSeen");
                toast.push("The intro will play the next time you open the dashboard.", "success");
              }}
            >
              Replay intro
            </button>
          </div>
          <p className="tiny muted mt-3 flex items-center gap-1.5">
            <ShieldCheck size={13} aria-hidden /> No analytics, advertising or tracking scripts are loaded.
          </p>
          <p className="tiny muted mt-1 flex items-center gap-1.5">
            <Wifi size={13} aria-hidden /> Offline reading requires a browser with service worker support.
          </p>
        </Glass>
      </div>
    </div>
  );
}
