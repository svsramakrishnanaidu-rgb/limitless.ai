"use client";

import { motion, useReducedMotion } from "motion/react";

export type AIState = "idle" | "listening" | "thinking" | "speaking";

const LABELS: Record<AIState, string> = {
  idle: "Ready",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking",
};

/**
 * The LIMITLESS AI orb. Each animation state is driven by a real application
 * state: microphone capture, an in-flight request, or speech playback.
 */
export default function AIOrb({ state = "idle", size = 132 }: { state?: AIState; size?: number }) {
  const reduceMotion = useReducedMotion();
  const speed = { idle: 5.5, listening: 1.9, thinking: 1.15, speaking: 0.85 }[state];
  const ringOpacity = state === "idle" ? 0.5 : 0.9;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative grid place-items-center"
        style={{ width: size, height: size }}
        role="img"
        aria-label={`LIMITLESS AI is ${LABELS[state].toLowerCase()}`}
      >
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, rgba(0,167,139,0.32), rgba(6,17,12,0.9) 70%)",
            border: "1px solid rgba(231,212,240,0.4)",
            boxShadow: "0 0 42px rgba(113,59,145,0.34)",
          }}
          animate={
            reduceMotion
              ? undefined
              : { scale: state === "listening" ? [1, 1.045, 1] : [1, 1.015, 1] }
          }
          transition={{ duration: speed, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute rounded-full"
          style={{
            inset: -7,
            border: "1px solid rgba(201,166,232,0.55)",
            borderTopColor: "rgba(201,166,232,0.95)",
            opacity: ringOpacity,
          }}
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{
            duration: state === "thinking" ? 1.1 : 9,
            repeat: reduceMotion ? 0 : Infinity,
            ease: "linear",
          }}
        />
        {(state === "listening" || state === "speaking") && (
          <motion.span
            className="absolute rounded-full"
            style={{ inset: -16, border: "1px solid rgba(185,144,218,0.4)" }}
            animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.65, 0.15, 0.65] }}
            transition={{ duration: state === "speaking" ? 0.9 : 1.6, repeat: reduceMotion ? 0 : Infinity }}
          />
        )}
        <span
          aria-hidden
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: size * 0.46,
            lineHeight: 1,
            color: "#E7D4F0",
            textShadow: "0 0 24px rgba(201,166,232,0.4)",
          }}
        >
          ∞
        </span>
      </div>
      <span className="tiny uppercase tracking-[0.16em]" style={{ color: "var(--muted)" }} role="status">
        {LABELS[state]}
      </span>
    </div>
  );
}
