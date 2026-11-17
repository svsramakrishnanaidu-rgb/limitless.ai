"use client";

import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { SIDEBAR_NAV } from "@/lib/site";
import { Glass, PageHeader } from "@/components/ui";
import { NavIcon } from "@/components/icons";
import { useState } from "react";

const DESCRIPTIONS: Record<string, string> = {
  "/": "Your daily overview, reminders and logged measures.",
  "/ai": "Ask a specific health question and get a grounded answer.",
  "/scanner": "Photograph a plant and review an AI identification with safety warnings.",
  "/yoga": "Asana steps, breathing practices, guided meditation and a session timer.",
  "/tracker": "Water, sleep, activity, weight, blood pressure, glucose and mood.",
  "/reminders": "Medicine, appointment and refill reminders stored on this device.",
  "/journal": "Private notes, symptoms, questions for your clinician and export.",
  "/library": "Ayurveda, Siddha, Unani, yoga, TCM and herbal knowledge with references.",
  "/plants": "Common and poisonous plants, regional names and lookalike risks.",
  "/nutrition": "Recipes, seasonal produce, nutrition estimates and food safety.",
  "/compare": "Side-by-side comparison of traditional systems and modern medicine.",
  "/learn": "Short lessons with quizzes and progress saved on this device.",
  "/schemes": "Indian government health programmes with official links.",
  "/community": "Community health education and guidance on reporting misinformation.",
  "/hospitals": "Live OpenStreetMap search for hospitals, clinics and pharmacies near you.",
  "/emergency": "Verified emergency numbers, first aid and your emergency medical card.",
  "/offline": "Downloaded reading, storage use and sync status.",
  "/saved": "Everything you have bookmarked.",
  "/profile": "Name, blood group, allergies, conditions and emergency contacts.",
  "/settings": "Themes, language, accessibility, AI provider status and data controls.",
  "/help": "Answers about the app, privacy and what LIMITLESS cannot do.",
};

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  return (
    <div>
      <PageHeader
        eyebrow="Explore"
        title="Every part of LIMITLESS"
        description="Knowledge, daily care, AI and emergency tools in one place. Nothing here requires a subscription."
      />

      <div className="relative mb-6 max-w-xl">
        <Search size={16} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
        <input
          type="search"
          className="field"
          style={{ paddingLeft: "2.4rem" }}
          placeholder="Filter modules"
          aria-label="Filter modules"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-7">
        {SIDEBAR_NAV.map((section) => {
          const items = section.items.filter(
            (item) => !q || item.label.toLowerCase().includes(q) || DESCRIPTIONS[item.href]?.toLowerCase().includes(q)
          );
          if (!items.length) return null;
          return (
            <section key={section.group}>
              <h2 className="eyebrow mb-3">{section.group}</h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Glass interactive className="card-pad h-full">
                      <div className="flex items-start gap-3">
                        <span className="nav-medallion" aria-hidden>
                          <NavIcon name={item.icon} size={15} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1 font-medium">
                            {item.label}
                            <ArrowUpRight size={13} aria-hidden style={{ color: "var(--muted)" }} />
                          </p>
                          <p className="tiny muted mt-1" style={{ lineHeight: 1.5 }}>
                            {DESCRIPTIONS[item.href]}
                          </p>
                        </div>
                      </div>
                    </Glass>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
