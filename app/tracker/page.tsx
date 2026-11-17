"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Droplets,
  Footprints,
  HeartPulse,
  Moon,
  Plus,
  Ruler,
  Sparkles,
  Trash2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Glass, PageHeader, Tabs, EmptyState, Callout } from "@/components/ui";
import { useStored, dateKey, prettyDate } from "@/lib/store";
import type { Profile, TrackerData } from "@/lib/types";
import { GOALS, bmi, useTracker, weeklySeries, wellnessSummary } from "@/lib/health";
import { ProgressRing } from "@/components/ProgressRing";
import { usePrefs, useToast } from "@/components/providers";

const TrackerCharts = dynamic(() => import("@/components/TrackerCharts"), {
  ssr: false,
  loading: () => (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="skeleton" style={{ height: 268 }} />
      <div className="skeleton" style={{ height: 268 }} />
    </div>
  ),
});

type Tab = "overview" | "log" | "history";

const EMPTY: TrackerData = {
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

const HABITS = [
  { id: "walk", label: "Walked for 20 minutes" },
  { id: "stretch", label: "Stretched or practised yoga" },
  { id: "sleep-time", label: "Went to bed on time" },
  { id: "no-screens", label: "No screens before bed" },
  { id: "veg", label: "Ate vegetables with two meals" },
];

function NumberField({
  id,
  label,
  suffix,
  value,
  onChange,
  min,
  max,
  step = 1,
  hint,
}: {
  id: string;
  label: string;
  suffix?: string;
  value: string;
  onChange: (v: string) => void;
  min: number;
  max: number;
  step?: number;
  hint?: string;
}) {
  const numeric = value === "" ? null : Number(value);
  const invalid = numeric !== null && (Number.isNaN(numeric) || numeric < min || numeric > max);
  return (
    <div>
      <label className="field-label" htmlFor={id}>{label}{suffix ? ` (${suffix})` : ""}</label>
      <input
        id={id}
        className="field"
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-invalid={invalid || undefined}
        aria-describedby={`${id}-hint`}
        onChange={(e) => onChange(e.target.value)}
      />
      <p id={`${id}-hint`} className={invalid ? "field-error" : "field-hint"}>
        {invalid ? `Enter a value between ${min} and ${max}.` : hint ?? `Range ${min}–${max}`}
      </p>
    </div>
  );
}

export default function TrackerPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const { data, addWater, logSleep, logWeight, logBp, logGlucose, logMood, setSteps, addExercise, toggleHabit } = useTracker();
  const summary = wellnessSummary(data);
  const series = weeklySeries(data, 7);

  const [profile] = useStored<Profile>("profile", {
    name: "", bloodGroup: "", allergies: "", conditions: "", medications: "", heightCm: null, emergencyContacts: [],
  });
  const [showData, setShowData] = useState(true);
  const toast = useToast();
  const { prefs } = usePrefs();

  const [waterInput, setWaterInput] = useState("250");
  const [sleepInput, setSleepInput] = useState("");
  const [stepsInput, setStepsInput] = useState("");
  const [exerciseInput, setExerciseInput] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [sysInput, setSysInput] = useState("");
  const [diaInput, setDiaInput] = useState("");
  const [pulseInput, setPulseInput] = useState("");
  const [glucoseInput, setGlucoseInput] = useState("");
  const [glucoseContext, setGlucoseContext] = useState<"fasting" | "post-meal" | "random">("fasting");
  const [mood, setMood] = useState(3);
  const [moodNote, setMoodNote] = useState("");

  const latestWeight = data.weight[0];
  const bmiValue = latestWeight && profile.heightCm ? bmi(latestWeight.kg, profile.heightCm) : null;

  const valid = (value: string, min: number, max: number) => {
    const n = Number(value);
    return value !== "" && Number.isFinite(n) && n >= min && n <= max;
  };

  const clearHistory = () => {
    if (!window.confirm("Delete all manually entered tracker data on this device? This cannot be undone.")) return;
    localStorage.removeItem("limitless.v1.tracker");
    window.dispatchEvent(new CustomEvent("limitless:store", { detail: "tracker" }));
    toast.push("Tracker data cleared.", "success");
  };

  return (
    <div>
      <PageHeader
        eyebrow="Smart health tracker"
        title="Your own measurements"
        description="Everything here is entered or confirmed by you. LIMITLESS does not estimate medical values from a phone camera and never invents readings."
        actions={
          <button type="button" className="ghost-button" onClick={() => setShowData((v) => !v)} aria-pressed={showData}>
            {showData ? "Hide numbers" : "Show numbers"}
          </button>
        }
      />

      <div className="mb-5">
        <Tabs
          label="Tracker sections"
          value={tab}
          onChange={setTab}
          options={[
            { value: "overview", label: "Overview" },
            { value: "log", label: "Log a measure" },
            { value: "history", label: "History" },
          ]}
        />
      </div>

      {tab === "overview" && (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
            <Glass className="card-pad flex flex-col items-center justify-center">
              {summary.hasData ? (
                <>
                  <ProgressRing value={summary.score} label="today" size={150} />
                  <p className="small muted mt-2 text-center">
                    Based on {summary.loggedCount} of 5 measures logged today.
                  </p>
                </>
              ) : (
                <EmptyState
                  icon={<Activity size={20} aria-hidden />}
                  title="No measurements yet"
                  description="Log water, sleep or activity to see your day summarised. Nothing is estimated for you."
                  action={<button type="button" className="gold-button" onClick={() => setTab("log")}>Log a measure</button>}
                />
              )}
            </Glass>

            <div className="grid gap-3 sm:grid-cols-2">
              <Glass className="card-pad">
                <div className="flex items-center justify-between">
                  <span className="small muted flex items-center gap-1.5"><Droplets size={14} style={{ color: "var(--accent)" }} aria-hidden /> Water</span>
                  <span className="tiny muted">Goal {(GOALS.waterMl / 1000).toFixed(1)} L</span>
                </div>
                <p className="mt-2" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.7rem" }}>
                  {showData ? `${((data.water[dateKey()] ?? 0) / 1000).toFixed(2)} L` : "•••"}
                </p>
                <div className="meter mt-1"><span style={{ width: `${Math.min(100, ((data.water[dateKey()] ?? 0) / GOALS.waterMl) * 100)}%` }} /></div>
                <div className="mt-3 flex gap-2">
                  <button type="button" className="chip flex-1 justify-center" onClick={() => addWater(250)}><Plus size={13} aria-hidden /> 250 ml</button>
                  <button type="button" className="chip flex-1 justify-center" onClick={() => addWater(500)}><Plus size={13} aria-hidden /> 500 ml</button>
                </div>
              </Glass>

              <Glass className="card-pad">
                <span className="small muted flex items-center gap-1.5"><Moon size={14} style={{ color: "var(--gold)" }} aria-hidden /> Sleep</span>
                <p className="mt-2" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.7rem" }}>
                  {showData && summary.sleepHours ? `${summary.sleepHours} h` : showData ? "Not logged" : "•••"}
                </p>
                <p className="tiny muted">Typical adult range: 7–9 hours</p>
                <button type="button" className="ghost-button mt-3 w-full" onClick={() => setTab("log")}>Log sleep</button>
              </Glass>

              <Glass className="card-pad">
                <span className="small muted flex items-center gap-1.5"><Footprints size={14} style={{ color: "var(--accent)" }} aria-hidden /> Activity</span>
                <p className="mt-2" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.7rem" }}>
                  {showData && summary.steps ? summary.steps.toLocaleString() : showData ? "Not logged" : "•••"}
                </p>
                <p className="tiny muted">{summary.steps ? "steps entered today" : "No step source connected"}</p>
                <button type="button" className="ghost-button mt-3 w-full" onClick={() => setTab("log")}>Log steps</button>
              </Glass>

              <Glass className="card-pad">
                <span className="small muted flex items-center gap-1.5"><HeartPulse size={14} style={{ color: "var(--danger)" }} aria-hidden /> Latest blood pressure</span>
                {data.bp[0] ? (
                  <>
                    <p className="mt-2" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.7rem" }}>
                      {showData ? `${data.bp[0].systolic}/${data.bp[0].diastolic}` : "•••/••"}
                      <span className="tiny muted"> mmHg</span>
                    </p>
                    <p className="tiny muted">{prettyDate(data.bp[0].date)} · manually entered</p>
                  </>
                ) : (
                  <p className="mt-2 small muted">Not recorded.</p>
                )}
                <button type="button" className="ghost-button mt-3 w-full" onClick={() => setTab("log")}>Record reading</button>
              </Glass>
            </div>
          </div>

          {/* Charts load as a separate chunk, client-side only. */}
          <TrackerCharts series={series} />

          <div className="grid gap-4 md:grid-cols-2">
            <Glass className="card-pad">
              <h2 className="section-title mb-2 flex items-center gap-2"><Ruler size={16} aria-hidden /> Body mass index</h2>
              {bmiValue ? (
                <>
                  <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.8rem" }}>{bmiValue.value}</p>
                  <p className="small muted">{bmiValue.band} for an adult BMI reference range.</p>
                  <p className="tiny muted mt-2">
                    BMI is a crude screening tool. It does not distinguish muscle from fat and is not diagnostic. South Asian adults may carry
                    metabolic risk at lower BMI values, so discuss waist measurement and other factors with a clinician.
                  </p>
                </>
              ) : (
                <p className="small muted">
                  Add your height in <a href="/profile" className="underline" style={{ color: "var(--gold)" }}>Profile</a> and a weight measurement to calculate BMI.
                </p>
              )}
            </Glass>

            <Glass className="card-pad">
              <h2 className="section-title mb-2">Wellness habits</h2>
              <ul className="flex flex-col gap-1.5">
                {HABITS.map((habit) => {
                  const done = (data.habits[habit.id] ?? []).includes(dateKey());
                  return (
                    <li key={habit.id}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left"
                        style={{ borderColor: done ? "rgba(0,167,139,0.45)" : "var(--line)", background: done ? "rgba(0,167,139,0.07)" : "transparent" }}
                        onClick={() => toggleHabit(habit.id)}
                        aria-pressed={done}
                      >
                        <span
                          className="grid h-5 w-5 shrink-0 place-items-center rounded-md"
                          style={{ border: "1px solid var(--line-strong)", color: done ? "var(--accent)" : "transparent" }}
                          aria-hidden
                        >
                          ✓
                        </span>
                        <span className="small">{habit.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Glass>
          </div>

          <Callout tone="info" title="How these numbers work">
            ALL health data in LIMITLESS is typed in by you or imported in a future device build. The wellness ring summarises only what you logged
            today and is not a clinical score. Charts show exactly the values you entered.
          </Callout>
        </div>
      )}

      {tab === "log" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Glass className="card-pad">
            <h2 className="section-title mb-2">Water</h2>
            <NumberField id="water" label="Amount to add" suffix="ml" value={waterInput} onChange={setWaterInput} min={50} max={2000} step={50} />
            <button
              type="button"
              className="gold-button mt-3 w-full"
              onClick={() => {
                if (!valid(waterInput, 50, 2000)) return;
                addWater(Number(waterInput));
                toast.push(`${waterInput} ml added.`, "success");
              }}
            >
              <Plus size={15} aria-hidden /> Add water
            </button>
            <p className="tiny muted mt-2">Also quick-add from the overview tab.</p>
          </Glass>

          <Glass className="card-pad">
            <h2 className="section-title mb-2">Sleep and activity</h2>
            <NumberField id="sleep" label="Hours slept last night" suffix="hours" value={sleepInput} onChange={setSleepInput} min={0} max={24} step={0.5} />
            <button
              type="button"
              className="gold-button mt-3 w-full"
              onClick={() => {
                if (!valid(sleepInput, 0, 24)) return;
                logSleep(Number(sleepInput));
                setSleepInput("");
                toast.push("Sleep logged.", "success");
              }}
            >
              Log sleep
            </button>
            <div className="my-3 hairline" />
            <NumberField id="steps" label="Steps today" value={stepsInput} onChange={setStepsInput} min={0} max={100000} step={100} />
            <button
              type="button"
              className="ghost-button mt-2 w-full"
              onClick={() => {
                if (!valid(stepsInput, 0, 100000)) return;
                setSteps(Number(stepsInput));
                setStepsInput("");
                toast.push("Steps logged.", "success");
              }}
            >
              Save steps
            </button>
            <div className="my-3 hairline" />
            <NumberField id="exercise" label="Exercise minutes to add" suffix="min" value={exerciseInput} onChange={setExerciseInput} min={1} max={300} />
            <button
              type="button"
              className="ghost-button mt-2 w-full"
              onClick={() => {
                if (!valid(exerciseInput, 1, 300)) return;
                addExercise(Number(exerciseInput));
                setExerciseInput("");
                toast.push("Exercise logged.", "success");
              }}
            >
              Add exercise
            </button>
          </Glass>

          <Glass className="card-pad">
            <h2 className="section-title mb-2">Weight</h2>
            <NumberField id="weight" label="Weight" suffix="kg" value={weightInput} onChange={setWeightInput} min={20} max={400} step={0.1} />
            <button
              type="button"
              className="gold-button mt-3 w-full"
              onClick={() => {
                if (!valid(weightInput, 20, 400)) return;
                logWeight(Number(weightInput));
                setWeightInput("");
                toast.push("Weight logged.", "success");
              }}
            >
              Save weight
            </button>
            <p className="tiny muted mt-2">One entry per day; saving again replaces today&apos;s value.</p>
          </Glass>

          <Glass className="card-pad">
            <h2 className="section-title mb-2">Blood pressure</h2>
            <div className="grid grid-cols-2 gap-2">
              <NumberField id="sys" label="Systolic" suffix="mmHg" value={sysInput} onChange={setSysInput} min={60} max={260} />
              <NumberField id="dia" label="Diastolic" suffix="mmHg" value={diaInput} onChange={setDiaInput} min={40} max={160} />
            </div>
            <NumberField id="pulse" label="Pulse (optional)" suffix="bpm" value={pulseInput} onChange={setPulseInput} min={30} max={220} />
            <button
              type="button"
              className="gold-button mt-3 w-full"
              onClick={() => {
                if (!valid(sysInput, 60, 260) || !valid(diaInput, 40, 160)) return;
                if (Number(sysInput) <= Number(diaInput)) {
                  toast.push("Systolic must be higher than diastolic.", "error");
                  return;
                }
                logBp(Number(sysInput), Number(diaInput), pulseInput && valid(pulseInput, 30, 220) ? Number(pulseInput) : undefined);
                setSysInput(""); setDiaInput(""); setPulseInput("");
                toast.push("Blood pressure logged.", "success");
              }}
            >
              Save reading
            </button>
            <p className="tiny muted mt-2">
              Use a validated home monitor and a correctly sized cuff. One high reading is not a diagnosis — seek care for very high readings or symptoms.
            </p>
          </Glass>

          <Glass className="card-pad">
            <h2 className="section-title mb-2">Blood glucose</h2>
            <NumberField id="glucose" label="Reading" suffix="mg/dL" value={glucoseInput} onChange={setGlucoseInput} min={20} max={600} />
            <div className="mt-2">
              <label className="field-label" htmlFor="glucose-context">When was it taken?</label>
              <select id="glucose-context" className="field" value={glucoseContext} onChange={(e) => setGlucoseContext(e.target.value as typeof glucoseContext)}>
                <option value="fasting">Fasting</option>
                <option value="post-meal">After a meal</option>
                <option value="random">Random</option>
              </select>
            </div>
            <button
              type="button"
              className="gold-button mt-3 w-full"
              onClick={() => {
                if (!valid(glucoseInput, 20, 600)) return;
                logGlucose(Number(glucoseInput), glucoseContext);
                setGlucoseInput("");
                toast.push("Glucose reading logged.", "success");
              }}
            >
              Save reading
            </button>
            <p className="tiny muted mt-2">Never adjust insulin or diabetes medicines based on this app. Follow your clinician&apos;s plan.</p>
          </Glass>

          <Glass className="card-pad">
            <h2 className="section-title mb-2">Mood journal</h2>
            <div className="flex gap-1.5" role="group" aria-label="Mood level from 1 to 5">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  className="chip flex-1 justify-center"
                  data-active={mood === level}
                  aria-pressed={mood === level}
                  onClick={() => setMood(level)}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="tiny muted mt-1">1 = very low, 5 = very good. This is your own description, not a clinical scale.</p>
            <label className="field-label mt-3" htmlFor="mood-note">Note (optional)</label>
            <textarea id="mood-note" className="field" value={moodNote} maxLength={280} onChange={(e) => setMoodNote(e.target.value)} placeholder="What influenced your day?" />
            <button
              type="button"
              className="gold-button mt-3 w-full"
              onClick={() => {
                logMood(mood as 1 | 2 | 3 | 4 | 5, moodNote);
                setMoodNote("");
                toast.push("Mood saved.", "success");
              }}
            >
              Save mood
            </button>
          </Glass>
        </div>
      )}

      {tab === "history" && (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Glass className="card-pad">
              <h2 className="section-title mb-2">Blood pressure</h2>
              {data.bp.length ? (
                <table className="data-table">
                  <thead><tr><th>Date</th><th>Reading</th><th>Pulse</th></tr></thead>
                  <tbody>
                    {data.bp.slice(0, 8).map((entry, i) => (
                      <tr key={`${entry.date}-${i}`}>
                        <td>{prettyDate(entry.date)}</td>
                        <td>{entry.systolic}/{entry.diastolic}</td>
                        <td>{entry.pulse ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState title="No readings" description="Blood pressure entries you save will appear here." />
              )}
            </Glass>

            <Glass className="card-pad">
              <h2 className="section-title mb-2">Blood glucose</h2>
              {data.glucose.length ? (
                <table className="data-table">
                  <thead><tr><th>Date</th><th>Reading</th><th>Context</th></tr></thead>
                  <tbody>
                    {data.glucose.slice(0, 8).map((entry, i) => (
                      <tr key={`${entry.date}-${i}`}>
                        <td>{prettyDate(entry.date)}</td>
                        <td>{entry.mgdl} mg/dL</td>
                        <td className="capitalize">{entry.context.replace("-", " ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState title="No readings" description="Glucose entries you save will appear here." />
              )}
            </Glass>

            <Glass className="card-pad">
              <h2 className="section-title mb-2">Weight</h2>
              {data.weight.length ? (
                <table className="data-table">
                  <thead><tr><th>Date</th><th>Weight</th></tr></thead>
                  <tbody>
                    {data.weight.slice(0, 8).map((entry) => (
                      <tr key={entry.date}><td>{prettyDate(entry.date)}</td><td>{entry.kg} kg</td></tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState title="No weight entries" />
              )}
            </Glass>

            <Glass className="card-pad">
              <h2 className="section-title mb-2">Sleep</h2>
              {data.sleep.length ? (
                <table className="data-table">
                  <thead><tr><th>Date</th><th>Hours</th></tr></thead>
                  <tbody>
                    {data.sleep.slice(0, 8).map((entry) => (
                      <tr key={entry.date}><td>{prettyDate(entry.date)}</td><td>{entry.hours} h</td></tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState title="No sleep entries" />
              )}
            </Glass>
          </div>

          <Glass className="card-pad">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="section-title">Your data</h2>
                <p className="tiny muted">Stored only in this browser. Export a copy from Settings before clearing.</p>
              </div>
              <div className="flex gap-2">
                <a href="/settings#data" className="ghost-button">Export data</a>
                <button type="button" className="ghost-button danger-button" onClick={clearHistory}>
                  <Trash2 size={15} aria-hidden /> Clear tracker data
                </button>
              </div>
            </div>
          </Glass>
        </div>
      )}

      {!showData && <p className="tiny muted mt-4 flex items-center gap-1.5"><Sparkles size={12} aria-hidden /> Numbers are hidden on screen. Switch to &ldquo;Show numbers&rdquo; to view them.</p>}
      {prefs.simpleMode && <p className="tiny muted mt-2">Simple interface mode is on: charts are still available but animations are reduced.</p>}
    </div>
  );
}
