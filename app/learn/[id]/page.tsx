"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Award, Check, Printer } from "lucide-react";
import { getModule } from "@/lib/content/learn";
import { Glass, PageHeader, Callout, Modal } from "@/components/ui";
import { useStored, prettyDate } from "@/lib/store";
import type { LearnProgress, Profile } from "@/lib/types";
import { useToast } from "@/components/providers";

export default function ModulePage() {
  const params = useParams<{ id: string }>();
  const module = getModule(params.id);
  const [progress, setProgress] = useStored<LearnProgress>("learn-progress", { lessons: [], quiz: {}, bookmarks: [] });
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [certificate, setCertificate] = useState(false);
  const [profile] = useStored<Profile>("profile", {
    name: "", bloodGroup: "", allergies: "", conditions: "", medications: "", heightCm: null, emergencyContacts: [],
  });
  const toast = useToast();

  if (!module) {
    return (
      <Glass className="card-pad">
        <PageHeader title="Module not found" description="The learning module you asked for does not exist." />
        <Link href="/learn" className="gold-button">Back to the learning centre</Link>
      </Glass>
    );
  }

  const isDone = (lessonId: string) => progress.lessons.includes(`${module.id}:${lessonId}`);
  const completedCount = module.lessons.filter((l) => isDone(l.id)).length;
  const allLessons = completedCount === module.lessons.length;
  const quizPassed = (progress.quiz[module.id] ?? 0) >= 70;

  const markLesson = (lessonId: string) => {
    const key = `${module.id}:${lessonId}`;
    setProgress((prev) => ({
      ...prev,
      lessons: prev.lessons.includes(key) ? prev.lessons.filter((l) => l !== key) : [...prev.lessons, key],
    }));
  };

  const submitQuiz = () => {
    if (Object.keys(answers).length !== module.quiz.length) {
      toast.push("Answer every question before submitting.", "error");
      return;
    }
    const correct = module.quiz.filter((q) => answers[q.id] === q.answer).length;
    const pct = Math.round((correct / module.quiz.length) * 100);
    setScore(pct);
    setSubmitted(true);
    setProgress((prev) => ({ ...prev, quiz: { ...prev.quiz, [module.id]: Math.max(prev.quiz[module.id] ?? 0, pct) } }));
    toast.push(`Quiz scored ${pct}%.`, pct >= 70 ? "success" : "info");
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <Link href="/learn" className="small muted flex items-center gap-1.5 hover:underline">
        <ArrowLeft size={14} aria-hidden /> Learning centre
      </Link>

      <header>
        <p className="eyebrow mb-1">{module.level} · {module.lessons.length} lessons</p>
        <h1 className="page-title">{module.title}</h1>
        <p className="lead mt-2">{module.summary}</p>
        <div className="meter mt-4" style={{ maxWidth: 420 }}>
          <span style={{ width: `${(completedCount / module.lessons.length) * 100}%` }} />
        </div>
        <p className="tiny muted mt-1">{completedCount} of {module.lessons.length} lessons marked complete</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-3">
          {module.lessons.map((lesson, index) => (
            <Glass key={lesson.id} className="card-pad">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="eyebrow">Lesson {index + 1} · {lesson.minutes} min</p>
                  <h2 className="brand-serif text-xl mt-1">{lesson.title}</h2>
                </div>
                <button
                  type="button"
                  className="chip shrink-0"
                  aria-pressed={isDone(lesson.id)}
                  onClick={() => markLesson(lesson.id)}
                >
                  <Check size={13} aria-hidden /> {isDone(lesson.id) ? "Complete" : "Mark done"}
                </button>
              </div>

              <div className="med-prose mt-3">
                {lesson.content.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="small" style={{ lineHeight: 1.7 }}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-3 rounded-xl border p-3" style={{ borderColor: "var(--line)" }}>
                <p className="eyebrow mb-1">Key points</p>
                <ul className="med-prose small list-disc pl-5">
                  {lesson.keyPoints.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </div>
            </Glass>
          ))}
        </div>

        <aside className="flex flex-col gap-4">
          <Glass className="card-pad">
            <h2 className="section-title mb-2">Knowledge check</h2>
            {!submitted ? (
              <ol className="flex flex-col gap-4">
                {module.quiz.map((question, qi) => (
                  <li key={question.id}>
                    <p className="small font-medium" style={{ lineHeight: 1.5 }}>{qi + 1}. {question.question}</p>
                    <div className="mt-2 flex flex-col gap-1.5">
                      {question.options.map((option, oi) => (
                        <label
                          key={option}
                          className="flex cursor-pointer items-start gap-2 rounded-lg border px-2.5 py-1.5 text-sm"
                          style={{
                            borderColor: answers[question.id] === oi ? "var(--line-strong)" : "var(--line)",
                            background: answers[question.id] === oi ? "rgba(185,144,218,0.14)" : "transparent",
                          }}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            checked={answers[question.id] === oi}
                            onChange={() => setAnswers({ ...answers, [question.id]: oi })}
                            className="mt-1"
                          />
                          <span style={{ lineHeight: 1.45 }}>{option}</span>
                        </label>
                      ))}
                    </div>
                  </li>
                ))}
                <button type="button" className="gold-button" onClick={submitQuiz}>Submit answers</button>
              </ol>
            ) : (
              <div>
                <p className="brand-serif" style={{ fontSize: "2rem" }}>{score}%</p>
                <p className="small muted mb-3">
                  {score !== null && score >= 70 ? "Passed. Review the explanations below." : "Below the 70% pass mark. Review and try again."}
                </p>
                <ol className="flex flex-col gap-3">
                  {module.quiz.map((question) => {
                    const chosen = answers[question.id];
                    const correct = chosen === question.answer;
                    return (
                      <li key={question.id}>
                        <p className="small font-medium">{question.question}</p>
                        <p className="tiny mt-1" style={{ color: correct ? "var(--success)" : "var(--danger)" }}>
                          {correct ? "Correct" : `Your answer: ${question.options[chosen] ?? "none"}`}
                        </p>
                        {!correct && <p className="tiny muted">Correct answer: {question.options[question.answer]}</p>}
                        <p className="tiny muted mt-1" style={{ lineHeight: 1.5 }}>{question.explanation}</p>
                        {question.source && <p className="tiny muted mt-1">Source: {question.source}</p>}
                      </li>
                    );
                  })}
                </ol>
                <div className="mt-3 flex gap-2">
                  <button type="button" className="ghost-button" onClick={resetQuiz}>Try again</button>
                  <button
                    type="button"
                    className="gold-button"
                    disabled={!allLessons || !quizPassed}
                    onClick={() => setCertificate(true)}
                  >
                    <Award size={15} aria-hidden /> Certificate
                  </button>
                </div>
                {!allLessons && <p className="tiny muted mt-2">Mark every lesson complete to unlock the learning record.</p>}
              </div>
            )}
          </Glass>

          <Callout tone="warning" title="Scope">
            This module is a learning aid. It does not certify clinical competence and does not replace a registered practitioner&apos;s assessment.
          </Callout>
        </aside>
      </div>

      <Modal
        open={certificate}
        onClose={() => setCertificate(false)}
        title="Learning record"
        footer={
          <>
            <button type="button" className="ghost-button" onClick={() => window.print()}>
              <Printer size={15} aria-hidden /> Print
            </button>
            <button type="button" className="gold-button" onClick={() => setCertificate(false)}>Close</button>
          </>
        }
      >
        <div className="rounded-2xl border p-5 text-center" style={{ borderColor: "var(--line-strong)" }}>
          <p className="eyebrow">LIMITLESS learning centre</p>
          <p className="brand-serif mt-2" style={{ fontSize: "1.6rem" }}>{module.certificateTitle}</p>
          <p className="small muted mt-1">Completed by</p>
          <p className="brand-serif" style={{ fontSize: "1.3rem" }}>{profile.name || "LIMITLESS learner"}</p>
          <p className="tiny muted mt-3">
            {prettyDate(new Date().toISOString().slice(0, 10))} · Quiz score {progress.quiz[module.id] ?? 0}%
          </p>
          <p className="tiny muted mt-4" style={{ lineHeight: 1.5 }}>
            This is an in-app record of completed educational content. It is not a professional medical qualification, licence or accreditation.
          </p>
        </div>
      </Modal>
    </div>
  );
}
