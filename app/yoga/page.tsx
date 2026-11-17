"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { PRACTICES, PRACTICE_TYPES, type Practice, type PracticeType } from "@/lib/content/yoga";
import { Glass, PageHeader, Modal, Callout, Tabs } from "@/components/ui";
import { useStored } from "@/lib/store";
import { useToast } from "@/components/providers";

type Session = { id: string; slug: string; name: string; minutes: number; at: number };

function SessionTimer({ practice, onFinish }: { practice: Practice; onFinish: (minutes: number) => void }) {
  const total = practice.minutes * 60;
  const [remaining, setRemaining] = useState(total);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setRemaining(total);
    setRunning(false);
  }, [total, practice.slug]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setRunning(false);
          onFinish(1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, onFinish]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = 1 - remaining / total;

  return (
    <div className="rounded-2xl border p-4 text-center" style={{ borderColor: "var(--line)" }}>
      <div className="relative mx-auto grid h-40 w-40 place-items-center">
        <svg width="160" height="160" className="absolute inset-0" aria-hidden>
          <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
          <circle
            cx="80"
            cy="80"
            r="72"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 72}
            strokeDashoffset={2 * Math.PI * 72 * (1 - progress)}
            transform="rotate(-90 80 80)"
            style={{ transition: "stroke-dashoffset 900ms linear" }}
          />
        </svg>
        <div
          className="grid h-28 w-28 place-items-center rounded-full"
          style={{
            border: "1px solid var(--line-strong)",
            background: "radial-gradient(circle at 40% 30%, rgba(0,167,139,0.24), transparent 70%)",
            animation: running ? "breathe 6s ease-in-out infinite" : undefined,
          }}
        >
          <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.9rem" }} aria-live="polite">
            {minutes}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className="mt-3 flex justify-center gap-2">
        <button type="button" className="gold-button" onClick={() => setRunning((v) => !v)} style={{ minWidth: 120 }}>
          {running ? <><Pause size={15} aria-hidden /> Pause</> : <><Play size={15} aria-hidden /> {remaining === total ? "Start" : "Resume"}</>}
        </button>
        <button
          type="button"
          className="ghost-button"
          onClick={() => {
            setRunning(false);
            setRemaining(total);
          }}
        >
          <RotateCcw size={15} aria-hidden /> Reset
        </button>
      </div>
      <p className="tiny muted mt-3">A session you finish is recorded in this device&apos;s practice log. There are no scores or streaks.</p>
      <style>{`@keyframes breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.045); } }`}</style>
    </div>
  );
}

export default function YogaPage() {
  const [tab, setTab] = useState<PracticeType>("Yoga");
  const [open, setOpen] = useState<Practice | null>(null);
  const [sessions, setSessions] = useStored<Session[]>("practice-sessions", []);
  const toast = useToast();

  const list = useMemo(() => PRACTICES.filter((p) => p.type === tab), [tab]);
  const recent = sessions.slice(0, 4);

  const record = (practice: Practice, minutes: number) => {
    setSessions((prev) =>
      [
        { id: `${Date.now()}`, slug: practice.slug, name: practice.name, minutes, at: Date.now() },
        ...prev,
      ].slice(0, 100)
    );
    toast.push(`${practice.name} recorded for ${minutes} minute${minutes === 1 ? "" : "s"}.`, "success");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Yoga & meditation"
        title="Move and breathe, safely"
        description="Step-by-step positions, breathing practices and guided meditation. Modify or skip anything that hurts."
        actions={<span className="badge">{sessions.length} sessions logged</span>}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Tabs
          label="Practice type"
          value={tab}
          onChange={setTab}
          options={PRACTICE_TYPES.map((type) => ({ value: type, label: type }))}
        />
        <p className="tiny muted">Choose a practice to see every step and start a timer.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((practice) => (
          <Glass key={practice.slug} interactive className="card-pad flex h-full flex-col">
            <div
              className="mb-3 flex h-24 items-end justify-between rounded-xl p-3"
              style={{
                background:
                  "radial-gradient(circle at 70% 20%, rgba(113,59,145,0.28), transparent 60%), linear-gradient(140deg, rgba(109,0,26,0.16), transparent 60%)",
                border: "1px solid var(--line)",
              }}
            >
              <div>
                <p className="eyebrow" style={{ fontSize: "0.56rem" }}>{practice.level}</p>
                <p className="brand-serif text-lg">{practice.sanskrit}</p>
              </div>
              <Timer size={20} style={{ color: "var(--gold)" }} aria-hidden />
            </div>
            <h2 className="brand-serif text-[1.15rem]">{practice.name}</h2>
            <p className="small muted mt-1 flex-1" style={{ lineHeight: 1.5 }}>{practice.summary}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="tiny muted">{practice.focus} · {practice.minutes} min</span>
              {sessions.some((s) => s.slug === practice.slug) && (
                <span className="tiny flex items-center gap-1" style={{ color: "var(--accent)" }}>
                  <Check size={12} aria-hidden /> practised
                </span>
              )}
            </div>
            <button type="button" className="gold-button mt-3 w-full" onClick={() => setOpen(practice)}>
              View steps and start
            </button>
          </Glass>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Glass className="card-pad">
          <h2 className="section-title mb-2">Posture safety</h2>
          <ul className="med-prose small list-disc pl-5">
            <li>Warm up for a few minutes and move within a comfortable range. Sharp pain means stop.</li>
            <li>Use a wall, chair or cushion to make balance and floor poses accessible.</li>
            <li>Skip inversions with uncontrolled blood pressure, glaucoma or recent eye or spinal surgery.</li>
            <li>Modify deep twists and lying poses in pregnancy and after abdominal surgery.</li>
            <li>Hot yoga and breath retention are not appropriate for everyone; stay hydrated and never force your breath.</li>
            <li>Yoga supports wellbeing but does not replace treatment for a medical condition.</li>
          </ul>
        </Glass>

        <Glass className="card-pad">
          <h2 className="section-title mb-2">Recent practice</h2>
          {recent.length ? (
            <ul className="flex flex-col gap-2">
              {recent.map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-xl border px-3 py-2" style={{ borderColor: "var(--line)" }}>
                  <span className="small">{s.name}</span>
                  <span className="tiny muted">
                    {s.minutes} min · {new Date(s.at).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="small muted">No sessions recorded yet. Finish a timer to add your first entry.</p>
          )}
          <Callout tone="info" title="What the evidence supports">
            Systematic reviews support yoga for chronic low back pain, with moderate evidence for reduced anxiety and better sleep quality. Evidence for treating specific diseases is mixed.
          </Callout>
        </Glass>
      </div>

      <Modal open={Boolean(open)} onClose={() => setOpen(null)} title={open ? `${open.name} · ${open.sanskrit}` : ""} wide>
        {open && (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="eyebrow mb-1">Steps</p>
              <ol className="flex flex-col gap-2">
                {open.steps.map((step, i) => (
                  <li key={step} className="flex gap-2.5 text-sm">
                    <span
                      className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.68rem]"
                      style={{ border: "1px solid var(--line-strong)", color: "var(--gold)" }}
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    <span style={{ lineHeight: 1.55 }}>{step}</span>
                  </li>
                ))}
              </ol>
              {open.breathing && (
                <p className="small mt-3"><strong>Breathing:</strong> {open.breathing}</p>
              )}
              {open.hold && <p className="small"><strong>Hold:</strong> {open.hold}</p>}
            </div>
            <div>
              <p className="eyebrow mb-1">Benefits</p>
              <ul className="med-prose small list-disc pl-5">
                {open.benefits.map((b) => <li key={b}>{b}</li>)}
              </ul>
              <p className="eyebrow mb-1 mt-3">Cautions</p>
              <ul className="med-prose small list-disc pl-5">
                {open.cautions.map((c) => <li key={c}>{c}</li>)}
              </ul>
              <div className="mt-4">
                <SessionTimer practice={open} onFinish={(m) => record(open, m)} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
