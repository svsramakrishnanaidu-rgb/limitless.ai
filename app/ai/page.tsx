"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowUp,
  Copy,
  Mic,
  RotateCcw,
  Square,
  Trash2,
  Volume2,
  VolumeX,
  WifiOff,
} from "lucide-react";
import AIOrb, { type AIState } from "@/components/AIOrb";
import { Glass, Callout } from "@/components/ui";
import { usePrefs, useToast } from "@/components/providers";
import { useStored } from "@/lib/store";
import type { ActionLog, StoredMessage } from "@/lib/types";
import { languageByCode } from "@/lib/i18n";

type ProposedAction = { type: string; path?: string; label?: string; value?: string | number };

const ALLOWED_PATHS = new Set([
  "/",
  "/ai",
  "/explore",
  "/tracker",
  "/library",
  "/plants",
  "/scanner",
  "/yoga",
  "/nutrition",
  "/hospitals",
  "/emergency",
  "/reminders",
  "/journal",
  "/saved",
  "/settings",
  "/profile",
  "/learn",
  "/schemes",
  "/compare",
  "/offline",
  "/community",
  "/help",
  "/privacy",
  "/terms",
]);

const SUGGESTIONS = [
  "How can I improve my sleep quality?",
  "What does the evidence say about ashwagandha?",
  "Which plants near me are poisonous to children?",
  "Show my weekly sleep summary",
  "Switch to light theme",
];

function parseAssistantResponse(raw: string): { text: string; actions: ProposedAction[] } {
  const actionBlock = /```actions\s*([\s\S]*?)```/i.exec(raw);
  let actions: ProposedAction[] = [];
  if (actionBlock) {
    try {
      const parsed = JSON.parse(actionBlock[1].trim());
      if (Array.isArray(parsed)) {
        actions = parsed.filter((a): a is ProposedAction => Boolean(a) && typeof a === "object" && typeof a.type === "string");
      }
    } catch {
      actions = [];
    }
  }
  const text = raw.replace(/```actions[\s\S]*?```/gi, "").trim();
  return { text, actions };
}

function renderMessage(text: string) {
  const blocks = text.split(/\n{2,}/);
  return blocks.map((block, i) => {
    const lines = block.split("\n");
    const isList = lines.every((l) => /^\s*[-*]\s+/.test(l)) && lines.length > 1;
    if (isList) {
      return (
        <ul key={i} className="my-2 list-disc pl-5">
          {lines.map((line, j) => (
            <li key={j} className="my-0.5">
              {line.replace(/^\s*[-*]\s+/, "")}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="my-1.5 whitespace-pre-wrap">
        {block}
      </p>
    );
  });
}

function AIChat() {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const { prefs, setPref } = usePrefs();

  const [messages, setMessages] = useStored<StoredMessage[]>("chat-thread", []);
  const [actionLog, setActionLog] = useStored<ActionLog[]>("action-log", []);
  const [input, setInput] = useState("");
  const [state, setState] = useState<AIState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<{ label: string; model: string } | null>(null);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [online, setOnline] = useState(true);
  const recognitionRef = useRef<{ stop: () => void; abort: () => void } | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const autoSent = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    fetch("/api/ai/status")
      .then((r) => r.json())
      .then((data: { providers: { connected: boolean; label: string; model: string }[] }) => {
        const first = data.providers?.find((p) => p.connected);
        if (first) setProvider({ label: first.label, model: first.model });
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: prefs.reduceMotion ? "auto" : "smooth", block: "end" });
  }, [messages, state, prefs.reduceMotion]);

  const speak = useCallback(
    (text: string) => {
      if (!("speechSynthesis" in window)) {
        toast.push("This browser does not support speech output.", "error");
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 600));
      const lang = languageByCode(prefs.locale);
      utterance.lang = lang.code === "en" ? "en-IN" : lang.code;
      utterance.rate = 0.98;
      utterance.onstart = () => {
        setSpeaking(true);
        setState("speaking");
      };
      utterance.onend = () => {
        setSpeaking(false);
        setState("idle");
      };
      utterance.onerror = () => {
        setSpeaking(false);
        setState("idle");
      };
      window.speechSynthesis.speak(utterance);
    },
    [prefs.locale, toast]
  );

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setState("idle");
  };

  const runActions = useCallback(
    (actions: ProposedAction[]) => {
      actions.slice(0, 2).forEach((action) => {
        let result = "Not executed";
        if (action.type === "navigate" && action.path && ALLOWED_PATHS.has(action.path)) {
          router.push(action.path);
          result = `Opened ${action.path}`;
        } else if (action.type === "theme" && (action.value === "classic" || action.value === "light" || action.value === "dark")) {
          setPref("theme", action.value);
          result = `Theme set to ${action.value}`;
        } else if (action.type === "language" && typeof action.value === "string" && languageByCode(action.value).code === action.value) {
          setPref("locale", action.value);
          result = `Interface language set to ${action.value}`;
        } else if (action.type === "set-font-scale" && typeof action.value === "number") {
          const scale = Math.min(1.4, Math.max(0.9, action.value));
          setPref("fontScale", Number(scale.toFixed(2)));
          result = `Text size set to ${Math.round(scale * 100)}%`;
        }
        setActionLog((prev) =>
          [
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              action: action.type,
              params: JSON.stringify(action.value ?? action.path ?? ""),
              at: Date.now(),
              result,
            },
            ...prev,
          ].slice(0, 40)
        );
        if (result !== "Not executed") toast.push(result, "success");
      });
    },
    [router, setActionLog, setPref, toast]
  );

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busyRef.current) return;
      if (!navigator.onLine) {
        setError("You are offline. LIMITLESS AI needs an internet connection; downloaded library content still works.");
        return;
      }
      setError(null);
      setInput("");
      const nextMessages: StoredMessage[] = [...messages, { role: "user", content: text, at: Date.now() }];
      setMessages(nextMessages);
      setState("thinking");
      busyRef.current = true;
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
            locale: prefs.locale,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(data.error || "The assistant could not answer. Please try again.");
        }

        const providerHeader = res.headers.get("x-ai-provider");
        const modelHeader = res.headers.get("x-ai-model");
        if (providerHeader) setProvider({ label: providerHeader, model: modelHeader ?? "" });

        // Append an empty assistant turn and fill it as tokens arrive, so the
        // answer appears progressively instead of after the full completion.
        setMessages((prev) => [...prev, { role: "assistant", content: "", at: Date.now() }]);

        let accumulated = "";
        if (res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            accumulated += decoder.decode(value, { stream: true });
            const snapshot = accumulated;
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy.length - 1;
              if (copy[last]?.role === "assistant") copy[last] = { ...copy[last], content: snapshot };
              return copy;
            });
          }
        }

        if (!accumulated.trim()) throw new Error("The assistant returned an empty response. Please try again.");

        const { text: answer, actions } = parseAssistantResponse(accumulated);
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy.length - 1;
          if (copy[last]?.role === "assistant") copy[last] = { ...copy[last], content: answer };
          return copy;
        });
        setState("idle");
        if (actions.length) runActions(actions);
        if (prefs.spokenReplies) speak(answer);
      } catch (err) {
        setState("idle");
        if (err instanceof Error && err.name === "AbortError") {
          toast.push("Response stopped.", "info");
          setMessages((prev) => prev.filter((m) => m.content.trim().length > 0));
        } else {
          setError(err instanceof Error ? err.message : "Something went wrong.");
          setMessages((prev) => prev.filter((m) => m.content.trim().length > 0));
          setInput(text);
        }
      } finally {
        busyRef.current = false;
        abortRef.current = null;
      }
    },
    [messages, prefs.locale, prefs.spokenReplies, runActions, setMessages, speak, toast]
  );

  const stopResponse = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  // Ask LIMITLESS arrives from the global search with ?q=
  useEffect(() => {
    const q = params.get("q");
    if (!q || autoSent.current) return;
    autoSent.current = true;
    router.replace("/ai");
    void send(q);
  }, [params, router, send]);

  const startListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      setState("idle");
      return;
    }
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      toast.push("Voice input is not supported in this browser. Chrome or Edge on desktop and Android support it.", "error");
      return;
    }
    const recognition = new Ctor();
    recognition.lang = languageByCode(prefs.locale).code === "en" ? "en-IN" : languageByCode(prefs.locale).code;
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
      setState("listening");
      setError(null);
    };
    recognition.onerror = (event: { error?: string }) => {
      setListening(false);
      setState("idle");
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("Microphone access was blocked. Allow microphone permission in your browser settings and try again.");
      } else if (event.error === "no-speech") {
        setError("No speech detected. Try again closer to the microphone.");
      } else {
        setError("Voice input stopped unexpectedly. You can type instead.");
      }
    };
    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const transcript = Array.from({ length: event.results.length })
        .map((_, i) => event.results[i][0].transcript)
        .join(" ")
        .trim();
      setInput(transcript);
      if (event.results[event.results.length - 1].isFinal) {
        setListening(false);
        setState("idle");
      }
    };
    recognition.onend = () => {
      setListening(false);
      setState((prev) => (prev === "listening" ? "idle" : prev));
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow mb-1">LIMITLESS AI CORE</p>
          <h1 className="page-title">Ask a health question</h1>
          <p className="lead mt-1">
            Answers are grounded in the reviewed library where possible. Not a diagnosis, prescription or emergency service.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="ghost-button"
            onClick={() => setPref("spokenReplies", !prefs.spokenReplies)}
            aria-pressed={prefs.spokenReplies}
          >
            {prefs.spokenReplies ? <Volume2 size={15} aria-hidden /> : <VolumeX size={15} aria-hidden />}
            Spoken replies {prefs.spokenReplies ? "on" : "off"}
          </button>
          <Link href="/settings" className="ghost-button">Providers</Link>
        </div>
      </header>

      {!online && (
        <Callout tone="warning" title="Offline">
          <span className="flex items-center gap-2">
            <WifiOff size={14} aria-hidden /> LIMITLESS AI needs a connection. Downloaded articles remain available in the offline library.
          </span>
        </Callout>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <Glass className="flex min-h-[58vh] flex-col" style={{ padding: 0 }}>
          <div className="flex items-center justify-between gap-2 border-b px-4 py-3" style={{ borderColor: "var(--line)" }}>
            <div className="flex items-center gap-2">
              <span className="badge badge-green">{provider ? `${provider.label}` : "AI CORE"}</span>
              {provider?.model && <span className="tiny muted truncate max-w-[220px]">{provider.model}</span>}
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                className="icon-button"
                aria-label="Start a new conversation"
                onClick={() => {
                  setMessages([]);
                  setError(null);
                  toast.push("New conversation started.", "success");
                }}
                style={{ width: 36, height: 36 }}
              >
                <RotateCcw size={15} aria-hidden />
              </button>
              <button
                type="button"
                className="icon-button"
                aria-label="Delete conversation history"
                onClick={() => {
                  setMessages([]);
                  setActionLog([]);
                  toast.push("Conversation deleted from this device.", "success");
                }}
                style={{ width: 36, height: 36 }}
              >
                <Trash2 size={15} aria-hidden />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center gap-5 py-8 text-center">
                <AIOrb state={state} size={126} />
                <div>
                  <p className="brand-serif text-xl">What would you like to understand?</p>
                  <p className="small muted mx-auto mt-1 max-w-sm">
                    Ask about symptoms, evidence, herbs, or how to use this app. For example: &ldquo;What does the evidence say about tulasi?&rdquo;
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} type="button" className="chip" onClick={() => void send(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <ol className="flex flex-col gap-4">
                {messages.map((m, i) => (
                  <li key={`${m.at}-${i}`} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div
                      className="max-w-[92%] rounded-2xl px-4 py-2.5 text-sm"
                      style={{
                        background: m.role === "user" ? "rgba(152,30,66,0.2)" : "rgba(185,144,218,0.07)",
                        border: `1px solid ${m.role === "user" ? "rgba(216,90,128,0.4)" : "var(--line)"}`,
                      }}
                    >
                      {m.role === "assistant" && (
                        <p className="eyebrow mb-1" style={{ fontSize: "0.56rem" }}>LIMITLESS AI</p>
                      )}
                      <div className="med-prose" style={{ lineHeight: 1.62 }}>{renderMessage(m.content)}</div>
                      {m.role === "assistant" && (
                        <div className="mt-2 flex gap-1.5">
                          <button
                            type="button"
                            className="chip"
                            style={{ minHeight: 30, fontSize: "0.72rem" }}
                            onClick={() => {
                              void navigator.clipboard.writeText(m.content);
                              toast.push("Answer copied.", "success");
                            }}
                          >
                            <Copy size={12} aria-hidden /> Copy
                          </button>
                          <button
                            type="button"
                            className="chip"
                            style={{ minHeight: 30, fontSize: "0.72rem" }}
                            onClick={() => speak(m.content)}
                          >
                            <Volume2 size={12} aria-hidden /> Read aloud
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
                {state === "thinking" && (
                  <li className="flex items-center gap-3 text-sm muted">
                    <span className="spinner" aria-hidden /> Checking the library and composing an answer…
                  </li>
                )}
              </ol>
            )}
            <div ref={endRef} />
          </div>

          {error && (
            <div className="px-4 pb-2">
              <p className="field-error" role="alert">{error}</p>
            </div>
          )}

          <div className="border-t px-4 py-3" style={{ borderColor: "var(--line)" }}>
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
            >
              <button
                type="button"
                className="icon-button"
                onClick={startListening}
                aria-label={listening ? "Stop voice input" : "Start voice input"}
                aria-pressed={listening}
                style={{
                  borderColor: listening ? "rgba(229,72,77,0.6)" : "var(--line)",
                  color: listening ? "var(--danger)" : "var(--text)",
                  flex: "none",
                }}
              >
                <Mic size={17} aria-hidden />
              </button>
              <label className="sr-only" htmlFor="ai-input">Message LIMITLESS AI</label>
              <textarea
                id="ai-input"
                className="field"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                placeholder={listening ? "Listening…" : "Ask about a symptom, herb, or the evidence…"}
                style={{ minHeight: 46, maxHeight: 120, resize: "none", paddingTop: "0.7rem" }}
                aria-describedby="ai-input-hint"
              />
              {state === "thinking" ? (
                <button type="button" className="ghost-button" onClick={stopResponse} aria-label="Stop generating" style={{ flex: "none" }}>
                  <Square size={15} aria-hidden />
                </button>
              ) : speaking ? (
                <button type="button" className="ghost-button" onClick={stopSpeaking} aria-label="Stop speaking" style={{ flex: "none" }}>
                  <Square size={15} aria-hidden />
                </button>
              ) : (
                <button
                  type="submit"
                  className="gold-button"
                  disabled={!input.trim()}
                  aria-label="Send message"
                  style={{ flex: "none", minWidth: 48, paddingInline: 14 }}
                >
                  <ArrowUp size={17} aria-hidden />
                </button>
              )}
            </form>
            <p id="ai-input-hint" className="tiny muted mt-2">
              {listening ? "Listening — speak now. Audio is transcribed by your browser." : "Your message is sent to the configured AI provider to generate an answer."}
            </p>
          </div>
        </Glass>

        <aside className="flex flex-col gap-4">
          <Glass className="card-pad flex flex-col items-center">
            <AIOrb state={state} size={136} />
            <p className="tiny muted mt-3 text-center">
              {state === "listening"
                ? "Microphone active"
                : state === "thinking"
                  ? "Waiting for the provider"
                  : state === "speaking"
                    ? "Reading the answer aloud"
                    : "Idle until you ask or speak"}
            </p>
          </Glass>

          {lastAssistant && (
            <Glass className="card-pad">
              <p className="eyebrow mb-1">Last answer</p>
              <p className="tiny muted" style={{ lineHeight: 1.5 }}>
                Review it again, copy it into your journal, or ask a follow-up. LIMITLESS AI does not keep answers on a server.
              </p>
            </Glass>
          )}

          <Glass className="card-pad">
            <p className="eyebrow mb-2">App actions</p>
            {actionLog.length ? (
              <ul className="flex flex-col gap-2">
                {actionLog.slice(0, 4).map((log) => (
                  <li key={log.id} className="tiny" style={{ color: "var(--text)" }}>
                    <span className="badge badge-green mr-1.5">{log.action}</span>
                    {log.result}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="tiny muted" style={{ lineHeight: 1.5 }}>
                Ask the assistant to open a section or change the theme and the real action is performed — with a log kept on this device.
              </p>
            )}
          </Glass>

          <Callout tone="warning" title="If this is an emergency">
            Call your local emergency number now. In India dial 112, in the US 911, in the UK 999.{" "}
            <Link href="/emergency" className="underline" style={{ color: "var(--gold)" }}>
              Open emergency help
            </Link>
            .
          </Callout>
        </aside>
      </div>
    </div>
  );
}

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
};

type SpeechRecognitionEventLike = {
  results: { length: number; [index: number]: { [index: number]: { transcript: string }; isFinal: boolean } };
};

export default function AIPage() {
  return (
    <Suspense fallback={<div className="skeleton h-64 w-full" />}>
      <AIChat />
    </Suspense>
  );
}
