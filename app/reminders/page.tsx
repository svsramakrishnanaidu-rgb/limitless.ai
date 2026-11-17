"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BellOff, BellRing, Check, Plus, Trash2 } from "lucide-react";
import { Glass, PageHeader, Modal, EmptyState, Callout, Field } from "@/components/ui";
import { useStored } from "@/lib/store";
import type { Reminder, ReminderKind } from "@/lib/types";
import { useToast } from "@/components/providers";

const KINDS: { value: ReminderKind; label: string }[] = [
  { value: "medicine", label: "Medicine" },
  { value: "appointment", label: "Appointment" },
  { value: "refill", label: "Refill" },
  { value: "water", label: "Water" },
  { value: "exercise", label: "Exercise" },
  { value: "sleep", label: "Sleep" },
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type FormState = { kind: ReminderKind; title: string; time: string; days: number[]; notes: string; enabled: boolean };

const EMPTY_FORM: FormState = {
  kind: "medicine",
  title: "",
  time: "08:00",
  days: [0, 1, 2, 3, 4, 5, 6],
  notes: "",
  enabled: true,
};

export default function RemindersPage() {
  const [reminders, setReminders] = useStored<Reminder[]>("reminders", []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [today, setToday] = useState<number>(new Date().getDay());
  const firedRef = useRef<Set<string>>(new Set());
  const toast = useToast();

  useEffect(() => {
    if (typeof Notification === "undefined") {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
    const timer = window.setInterval(() => setToday(new Date().getDay()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const requestPermission = async () => {
    if (typeof Notification === "undefined") {
      toast.push("This browser does not support system notifications. Reminders still appear inside the app while it is open.", "error");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") toast.push("Notifications enabled for this device.", "success");
    else toast.push("Notifications were not enabled. Reminders still show inside the app while it is open.", "info");
  };

  /* In-app due check. Only fires while a LIMITLESS tab is open. */
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const keyDate = now.toISOString().slice(0, 10);
      reminders.forEach((reminder) => {
        if (!reminder.enabled || !reminder.days.includes(now.getDay()) || reminder.time !== hhmm) return;
        const key = `${reminder.id}:${keyDate}:${reminder.time}`;
        if (firedRef.current.has(key) || sessionStorage.getItem(`limitless.reminder.${key}`)) return;
        firedRef.current.add(key);
        sessionStorage.setItem(`limitless.reminder.${key}`, "1");
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification(`LIMITLESS · ${reminder.kind}`, {
            body: reminder.title,
            tag: key,
          });
        } else {
          toast.push(`Reminder: ${reminder.title}`, "info");
        }
      });
    };
    check();
    const interval = window.setInterval(check, 30_000);
    return () => window.clearInterval(interval);
  }, [reminders, toast]);

  const todays = useMemo(
    () => reminders.filter((r) => r.enabled && r.days.includes(today)).sort((a, b) => a.time.localeCompare(b.time)),
    [reminders, today]
  );
  const others = useMemo(() => reminders.filter((r) => !todays.includes(r)), [reminders, todays]);

  const save = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.title.trim()) nextErrors.title = "Give the reminder a name.";
    if (form.title.trim().length > 80) nextErrors.title = "Keep the name under 80 characters.";
    if (!/^\d{2}:\d{2}$/.test(form.time)) nextErrors.time = "Choose a valid time.";
    if (form.days.length === 0) nextErrors.days = "Choose at least one day.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    if (editingId) {
      setReminders((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...form, title: form.title.trim(), notes: form.notes.trim() } : r))
      );
      toast.push("Reminder updated.", "success");
    } else {
      setReminders((prev) => [
        ...prev,
        {
          ...form,
          id: `${Date.now()}`,
          title: form.title.trim(),
          notes: form.notes.trim(),
          createdAt: new Date().toISOString(),
        },
      ]);
      toast.push("Reminder added on this device.", "success");
    }
    setOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const edit = (reminder: Reminder) => {
    setEditingId(reminder.id);
    setForm({
      kind: reminder.kind,
      title: reminder.title,
      time: reminder.time,
      days: reminder.days,
      notes: reminder.notes,
      enabled: reminder.enabled,
    });
    setOpen(true);
  };

  const remove = (id: string) => {
    if (!window.confirm("Delete this reminder? This cannot be undone.")) return;
    setReminders((prev) => prev.filter((r) => r.id !== id));
    toast.push("Reminder deleted.", "success");
  };

  const toggle = (id: string) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const permissionText =
    permission === "granted"
      ? "System notifications are enabled."
      : permission === "denied"
        ? "Notifications are blocked in this browser. Reminders still appear inside the app while it is open."
        : permission === "unsupported"
          ? "This browser does not support system notifications."
          : "Notifications are not enabled yet.";

  return (
    <div>
      <PageHeader
        eyebrow="Medicine and appointment reminders"
        title="Reminders you control"
        description="Set times for medicines, appointments, refills and daily routines. LIMITLESS never changes or suggests a medicine dose."
        actions={
          <button type="button" className="gold-button" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setErrors({}); setOpen(true); }}>
            <Plus size={16} aria-hidden /> Add reminder
          </button>
        }
      />

      <div className="mb-4">
        <Glass className="card-pad flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="small flex items-center gap-2">
              {permission === "granted" ? <BellRing size={15} style={{ color: "var(--accent)" }} aria-hidden /> : <BellOff size={15} style={{ color: "var(--muted)" }} aria-hidden />}
              {permissionText}
            </p>
            <p className="tiny muted mt-1">
              Reminders fire only while LIMITLESS is open in a tab. Reliable background alerts require the Android/iOS build, which is not part of this web release.
            </p>
          </div>
          {permission !== "granted" && permission !== "unsupported" && (
            <button type="button" className="ghost-button shrink-0" onClick={() => void requestPermission()}>
              Enable notifications
            </button>
          )}
        </Glass>
      </div>

      <div className="flex flex-col gap-4">
        <section>
          <h2 className="eyebrow mb-2">Today · {DAY_LABELS[today]}</h2>
          {todays.length ? (
            <ul className="flex flex-col gap-2">
              {todays.map((reminder) => (
                <li key={reminder.id}>
                  <Glass className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                      style={{ border: "1px solid var(--line-strong)", color: "var(--gold)" }}
                      aria-hidden
                    >
                      <BellRing size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium leading-snug">{reminder.title}</p>
                      <p className="tiny muted capitalize">
                        {reminder.kind} · {reminder.time}
                        {reminder.notes ? ` · ${reminder.notes}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button type="button" className="chip" aria-pressed={reminder.enabled} onClick={() => toggle(reminder.id)}>
                        <Check size={13} aria-hidden /> {reminder.enabled ? "On" : "Off"}
                      </button>
                      <button type="button" className="ghost-button" style={{ minHeight: 36, paddingInline: 12 }} onClick={() => edit(reminder)}>
                        Edit
                      </button>
                      <button type="button" className="icon-button" style={{ width: 36, height: 36 }} aria-label={`Delete ${reminder.title}`} onClick={() => remove(reminder.id)}>
                        <Trash2 size={15} aria-hidden />
                      </button>
                    </div>
                  </Glass>
                </li>
              ))}
            </ul>
          ) : (
            <Glass className="card-pad">
              <EmptyState
                icon={<BellRing size={18} aria-hidden />}
                title="Nothing scheduled today"
                description="Add a reminder with a time and the days it should repeat."
                action={<button type="button" className="ghost-button" onClick={() => setOpen(true)}>Add reminder</button>}
              />
            </Glass>
          )}
        </section>

        {others.length > 0 && (
          <section>
            <h2 className="eyebrow mb-2">Other days</h2>
            <ul className="flex flex-col gap-2">
              {others.map((reminder) => (
                <li key={reminder.id}>
                  <Glass className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <span className="badge capitalize">{reminder.kind}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium leading-snug">{reminder.title}</p>
                      <p className="tiny muted">
                        {reminder.time} · {reminder.days.map((d) => DAY_LABELS[d]).join(", ")}
                        {!reminder.enabled ? " · paused" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button type="button" className="chip" aria-pressed={reminder.enabled} onClick={() => toggle(reminder.id)}>
                        {reminder.enabled ? "On" : "Off"}
                      </button>
                      <button type="button" className="ghost-button" style={{ minHeight: 36, paddingInline: 12 }} onClick={() => edit(reminder)}>
                        Edit
                      </button>
                      <button type="button" className="icon-button" style={{ width: 36, height: 36 }} aria-label={`Delete ${reminder.title}`} onClick={() => remove(reminder.id)}>
                        <Trash2 size={15} aria-hidden />
                      </button>
                    </div>
                  </Glass>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Callout tone="warning" title="Medication safety">
          Reminders are a memory aid only. Follow the dose and schedule your prescriber gave you, and check with a pharmacist about interactions.
          LIMITLESS does not prescribe, adjust or recommend medicines.
        </Callout>
      </div>

      <Modal
        open={open}
        onClose={() => { setOpen(false); setEditingId(null); setErrors({}); }}
        title={editingId ? "Edit reminder" : "Add reminder"}
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => { setOpen(false); setEditingId(null); }}>Cancel</button>
            <button type="button" className="gold-button" onClick={save}>{editingId ? "Save changes" : "Add reminder"}</button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <Field label="Type" htmlFor="reminder-kind">
            <select id="reminder-kind" className="field" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as ReminderKind })}>
              {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
            </select>
          </Field>

          <Field label="Name" htmlFor="reminder-title" error={errors.title}>
            <input
              id="reminder-title"
              className="field"
              value={form.title}
              maxLength={80}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Vitamin D after breakfast"
              aria-invalid={Boolean(errors.title)}
            />
          </Field>

          <Field label="Time" htmlFor="reminder-time" error={errors.time} hint="Uses this device's local time zone.">
            <input
              id="reminder-time"
              type="time"
              className="field"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              aria-invalid={Boolean(errors.time)}
            />
          </Field>

          <div>
            <p className="field-label">Repeat on</p>
            <div className="flex flex-wrap gap-1.5">
              {DAY_LABELS.map((label, index) => {
                const active = form.days.includes(index);
                return (
                  <button
                    key={label}
                    type="button"
                    className="chip"
                    data-active={active}
                    aria-pressed={active}
                    onClick={() =>
                      setForm({
                        ...form,
                        days: active ? form.days.filter((d) => d !== index) : [...form.days, index].sort(),
                      })
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {errors.days && <p className="field-error" role="alert">{errors.days}</p>}
          </div>

          <Field label="Notes (optional)" htmlFor="reminder-notes">
            <textarea
              id="reminder-notes"
              className="field"
              value={form.notes}
              maxLength={200}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any detail you want to see with the reminder"
            />
          </Field>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
            Reminder is active
          </label>
        </div>
      </Modal>
    </div>
  );
}
