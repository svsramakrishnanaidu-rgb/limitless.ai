"use client";

import { useMemo, useState } from "react";
import { Download, Pencil, Plus, Share2, Trash2 } from "lucide-react";
import { Glass, PageHeader, Modal, EmptyState, Field, Callout } from "@/components/ui";
import { useStored, dateKey, downloadText, prettyDate } from "@/lib/store";
import type { JournalEntry } from "@/lib/types";
import { useToast } from "@/components/providers";

type FormState = Omit<JournalEntry, "id" | "createdAt">;

const emptyForToday = (): FormState => ({
  date: dateKey(),
  mood: "",
  symptoms: "",
  food: "",
  sleep: "",
  notes: "",
  questions: "",
});

export default function JournalPage() {
  const [entries, setEntries] = useStored<JournalEntry[]>("journal", []);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForToday());
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const sorted = useMemo(() => [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)), [entries]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForToday());
    setError(null);
    setOpen(true);
  };

  const openEdit = (entry: JournalEntry) => {
    setEditing(entry.id);
    setForm({
      date: entry.date,
      mood: entry.mood,
      symptoms: entry.symptoms,
      food: entry.food,
      sleep: entry.sleep,
      notes: entry.notes,
      questions: entry.questions,
    });
    setError(null);
    setOpen(true);
  };

  const save = () => {
    if (!form.date) {
      setError("Choose a date.");
      return;
    }
    const hasContent = [form.mood, form.symptoms, form.food, form.sleep, form.notes, form.questions].some((v) => v.trim());
    if (!hasContent) {
      setError("Add at least one observation before saving.");
      return;
    }
    if (editing) {
      setEntries((prev) => prev.map((e) => (e.id === editing ? { ...e, ...form } : e)));
      toast.push("Journal entry updated.", "success");
    } else {
      setEntries((prev) => [{ ...form, id: `${Date.now()}`, createdAt: new Date().toISOString() }, ...prev]);
      toast.push("Journal entry saved on this device.", "success");
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    if (!window.confirm("Delete this journal entry? This cannot be undone.")) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast.push("Entry deleted.", "success");
  };

  const exportEntries = () => {
    if (!entries.length) {
      toast.push("There is nothing to export yet.", "error");
      return;
    }
    const text = entries
      .map(
        (e) =>
          `Date: ${e.date}\nMood: ${e.mood || "—"}\nSymptoms: ${e.symptoms || "—"}\nFood: ${e.food || "—"}\nSleep: ${e.sleep || "—"}\nNotes: ${e.notes || "—"}\nQuestions: ${e.questions || "—"}`
      )
      .join("\n\n---\n\n");
    downloadText("limitless-health-journal.txt", `LIMITLESS health journal\nExported ${new Date().toLocaleString()}\n\n${text}`, "text/plain");
    toast.push("Journal downloaded.", "success");
  };

  const shareLatest = async () => {
    const latest = sorted[0];
    if (!latest) {
      toast.push("Write an entry before sharing.", "error");
      return;
    }
    const text = `Health notes for ${latest.date}\nMood: ${latest.mood || "—"}\nSymptoms: ${latest.symptoms || "—"}\nNotes: ${latest.notes || "—"}\nQuestions for my clinician: ${latest.questions || "—"}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My health notes", text });
        toast.push("Shared with your chosen app.", "success");
      } catch {
        /* The user dismissed the share sheet. */
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.push("Share is unavailable here, so the entry was copied to your clipboard.", "info");
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Personal healthcare journal"
        title="Notes for yourself and your clinician"
        description="Record what you notice between appointments. Entries stay in this browser until you export or delete them."
        actions={
          <>
            <button type="button" className="ghost-button" onClick={() => void shareLatest()}>
              <Share2 size={15} aria-hidden /> Share latest
            </button>
            <button type="button" className="gold-button" onClick={openNew}>
              <Plus size={16} aria-hidden /> New entry
            </button>
          </>
        }
      />

      {sorted.length === 0 ? (
        <Glass className="card-pad">
          <EmptyState
            icon={<Pencil size={18} aria-hidden />}
            title="Your journal is empty"
            description="A short daily note helps you spot patterns and gives your clinician a clearer picture. Start with one line."
            action={<button type="button" className="gold-button" onClick={openNew}>Write the first entry</button>}
          />
        </Glass>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((entry) => (
            <Glass key={entry.id} className="card-pad">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="eyebrow">{prettyDate(entry.date)}</p>
                  {entry.mood && <p className="brand-serif text-lg mt-0.5">Mood: {entry.mood}</p>}
                </div>
                <div className="flex gap-1.5">
                  <button type="button" className="icon-button" style={{ width: 34, height: 34 }} aria-label={`Edit entry from ${prettyDate(entry.date)}`} onClick={() => openEdit(entry)}>
                    <Pencil size={14} aria-hidden />
                  </button>
                  <button type="button" className="icon-button" style={{ width: 34, height: 34 }} aria-label={`Delete entry from ${prettyDate(entry.date)}`} onClick={() => remove(entry.id)}>
                    <Trash2 size={14} aria-hidden />
                  </button>
                </div>
              </div>

              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                {entry.symptoms && (<><dt className="tiny muted">Symptoms</dt><dd className="small" style={{ margin: 0 }}>{entry.symptoms}</dd></>)}
                {entry.food && (<><dt className="tiny muted">Food</dt><dd className="small" style={{ margin: 0 }}>{entry.food}</dd></>)}
                {entry.sleep && (<><dt className="tiny muted">Sleep</dt><dd className="small" style={{ margin: 0 }}>{entry.sleep}</dd></>)}
                {entry.notes && (<><dt className="tiny muted">Notes</dt><dd className="small" style={{ margin: 0 }}>{entry.notes}</dd></>)}
                {entry.questions && (<><dt className="tiny muted">Questions for my clinician</dt><dd className="small" style={{ margin: 0 }}>{entry.questions}</dd></>)}
              </dl>
            </Glass>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="ghost-button" onClick={exportEntries} disabled={!entries.length}>
          <Download size={15} aria-hidden /> Export all as text
        </button>
      </div>

      <div className="mt-4">
        <Callout tone="info" title="Privacy">
          Journal entries are stored on this device only. They are not uploaded to a LIMITLESS server. If you share an entry, the receiving app&apos;s
          privacy terms apply.
        </Callout>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit journal entry" : "New journal entry"}
        wide
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => setOpen(false)}>Cancel</button>
            <button type="button" className="gold-button" onClick={save}>Save entry</button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Date" htmlFor="entry-date">
            <input id="entry-date" type="date" className="field" value={form.date} max={dateKey()} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Field>
          <Field label="Mood or energy" htmlFor="entry-mood" hint="Your own words, e.g. tired but calm">
            <input id="entry-mood" className="field" value={form.mood} maxLength={80} onChange={(e) => setForm({ ...form, mood: e.target.value })} />
          </Field>
          <Field label="Symptoms you noticed" htmlFor="entry-symptoms" hint="Do not use this to self-diagnose.">
            <textarea id="entry-symptoms" className="field" value={form.symptoms} maxLength={600} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} />
          </Field>
          <Field label="Food and drink" htmlFor="entry-food">
            <textarea id="entry-food" className="field" value={form.food} maxLength={600} onChange={(e) => setForm({ ...form, food: e.target.value })} />
          </Field>
          <Field label="Sleep" htmlFor="entry-sleep">
            <input id="entry-sleep" className="field" value={form.sleep} maxLength={120} onChange={(e) => setForm({ ...form, sleep: e.target.value })} placeholder="e.g. 6.5 hours, woke twice" />
          </Field>
          <Field label="Questions for your clinician" htmlFor="entry-questions">
            <textarea id="entry-questions" className="field" value={form.questions} maxLength={600} onChange={(e) => setForm({ ...form, questions: e.target.value })} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Any other notes" htmlFor="entry-notes">
              <textarea id="entry-notes" className="field" value={form.notes} maxLength={1500} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Field>
          </div>
          {error && <p className="field-error sm:col-span-2" role="alert">{error}</p>}
        </div>
      </Modal>
    </div>
  );
}
