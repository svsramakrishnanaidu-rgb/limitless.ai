"use client";

import Link from "next/link";
import { ArrowRight, Award, BookOpen } from "lucide-react";
import { LEARN_MODULES } from "@/lib/content/learn";
import { Glass, PageHeader, Callout } from "@/components/ui";
import { useStored } from "@/lib/store";
import type { LearnProgress } from "@/lib/types";

const GLOSSARY = [
  { term: "Adaptogen", definition: "A marketing and traditional term for substances claimed to help the body resist stress. It is not a regulatory or clinical category, and evidence varies by plant." },
  { term: "Contraindication", definition: "A situation in which a treatment should not be used because the risk of harm outweighs the benefit, such as a specific condition, pregnancy or age group." },
  { term: "Evidence level", definition: "A shorthand for how strong and consistent the research is. LIMITLESS uses broad bands, not a formal GRADE rating." },
  { term: "Heavy metals", definition: "Elements such as lead, mercury and arsenic. Some traditional preparations have been found to contain them at harmful levels." },
  { term: "Pharmacovigilance", definition: "The systematic monitoring of medicines for adverse effects after they reach the market." },
  { term: "Placebo effect", definition: "A real change in symptoms produced by expectation and context rather than by an active ingredient. It is why controlled comparisons matter." },
  { term: "Pranayama", definition: "Structured breathing practices within yoga. Some involve retention and should be learned with a teacher." },
  { term: "Randomised controlled trial", definition: "A study in which participants are assigned by chance to a treatment or comparison group. Randomisation reduces bias." },
  { term: "Systematic review", definition: "A structured summary of all eligible studies on a question, often with meta-analysis. It is stronger evidence than any single trial." },
  { term: "Titration", definition: "Adjusting a medicine dose gradually, usually under clinical supervision. LIMITLESS never suggests titration." },
];

export default function LearnPage() {
  const [progress] = useStored<LearnProgress>("learn-progress", { lessons: [], quiz: {}, bookmarks: [] });

  const moduleProgress = (moduleId: string, lessonIds: string[]) => {
    const done = lessonIds.filter((id) => progress.lessons.includes(`${moduleId}:${id}`)).length;
    return { done, total: lessonIds.length, pct: Math.round((done / lessonIds.length) * 100) };
  };

  const completedModules = LEARN_MODULES.filter((m) => {
    const p = moduleProgress(m.id, m.lessons.map((l) => l.id));
    return p.pct === 100 && (progress.quiz[m.id] ?? 0) >= 70;
  }).length;

  return (
    <div>
      <PageHeader
        eyebrow="Educational learning centre"
        title="Short lessons, checked understanding"
        description="Four modules on the foundations, safety and evidence of traditional healthcare. Progress stays on this device."
        actions={
          <span className="badge badge-gold">
            <Award size={13} aria-hidden /> {completedModules}/{LEARN_MODULES.length} modules complete
          </span>
        }
      />

      <div className="grid gap-3 md:grid-cols-2">
        {LEARN_MODULES.map((module) => {
          const p = moduleProgress(module.id, module.lessons.map((l) => l.id));
          const score = progress.quiz[module.id];
          return (
            <Glass key={module.id} interactive className="card-pad flex h-full flex-col">
              <div className="flex items-start justify-between gap-2">
                <span className="badge badge-gold">{module.level}</span>
                <span className="tiny muted">{module.lessons.length} lessons</span>
              </div>
              <h2 className="brand-serif mt-2 text-[1.25rem] leading-snug">{module.title}</h2>
              <p className="small muted mt-1 flex-1" style={{ lineHeight: 1.55 }}>{module.summary}</p>
              <div className="meter mt-3"><span style={{ width: `${p.pct}%` }} /></div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="tiny muted">{p.done}/{p.total} lessons{typeof score === "number" ? ` · quiz ${score}%` : ""}</span>
                <Link href={`/learn/${module.id}`} className="small flex items-center gap-1" style={{ color: "var(--gold)" }}>
                  {p.pct === 100 ? "Review" : "Start"} <ArrowRight size={13} aria-hidden />
                </Link>
              </div>
            </Glass>
          );
        })}
      </div>

      <Callout tone="info" title="About certificates">
        Finishing a module produces an in-app record of learning. It is not a professional qualification, a licence, or a substitute for accredited
        medical or AYUSH training, and it must not be presented as one.
      </Callout>

      <section className="mt-6">
        <h2 className="section-title mb-2 flex items-center gap-2"><BookOpen size={16} aria-hidden /> Glossary</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {GLOSSARY.map((entry) => (
            <Glass key={entry.term} className="card-pad">
              <p className="small font-semibold">{entry.term}</p>
              <p className="tiny muted mt-1" style={{ lineHeight: 1.55 }}>{entry.definition}</p>
            </Glass>
          ))}
        </div>
      </section>
    </div>
  );
}
