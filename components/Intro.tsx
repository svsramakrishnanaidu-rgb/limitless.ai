"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LogoMark } from "./Logo";
import { BRAND } from "@/lib/site";

gsap.registerPlugin(useGSAP);

/**
 * Cinematic intro: restrained lavender particles, a glass reflection sweep and
 * the wordmark rising into place. Runs once per browser session, lasts about
 * 2.4s, is always skippable and is skipped entirely for reduced motion.
 */
export function Intro({ onComplete }: { onComplete: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) onComplete();
  }, [onComplete]);

  useGSAP(
    () => {
      if (!container.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        onComplete();
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          setClosing(true);
          window.setTimeout(onComplete, 280);
        },
      });

      tl.fromTo(
        ".intro-particle",
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.7, stagger: 0.05, ease: "power2.out" }
      )
        .fromTo(
          ".intro-mark",
          { opacity: 0, scale: 0.72, rotateY: -28 },
          { opacity: 1, scale: 1, rotateY: 0, duration: 0.85, ease: "power3.out" }
        )
        .fromTo(
          ".intro-sheen",
          { xPercent: -120, opacity: 0 },
          { xPercent: 120, opacity: 0.7, duration: 0.9, ease: "power2.inOut" },
          "-=0.55"
        )
        .fromTo(
          ".intro-title",
          { opacity: 0, y: 18, letterSpacing: "0.42em" },
          { opacity: 1, y: 0, letterSpacing: "0.2em", duration: 0.6, ease: "power3.out" },
          "-=0.45"
        )
        .fromTo(".intro-tagline", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.2")
        .to({}, { duration: 0.35 });

      return () => {
        tl.kill();
      };
    },
    { scope: container }
  );

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 32%, #2a1234 0%, #08070b 62%, #000000 100%)",
        opacity: closing ? 0 : 1,
        transition: "opacity 280ms ease",
      }}
      role="dialog"
      aria-label="LIMITLESS introduction"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {[
          { left: "18%", top: "30%", size: 5, delay: "0s" },
          { left: "76%", top: "24%", size: 4, delay: "0.4s" },
          { left: "66%", top: "68%", size: 3, delay: "0.9s" },
          { left: "27%", top: "72%", size: 4, delay: "1.2s" },
          { left: "50%", top: "16%", size: 3, delay: "0.6s" },
          { left: "86%", top: "52%", size: 3, delay: "1.5s" },
          { left: "12%", top: "52%", size: 3, delay: "1s" },
        ].map((p, i) => (
          <span
            key={i}
            className="intro-particle absolute rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: "#C9A6E8",
              boxShadow: "0 0 10px rgba(201,166,232,0.7)",
              animation: `intro-drift 4.5s ${p.delay} ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="intro-mark relative" style={{ perspective: 800 }}>
        <div
          className="absolute inset-0 overflow-hidden rounded-full"
          style={{ width: 128, height: 128 }}
          aria-hidden
        >
          <div
            className="intro-sheen absolute inset-y-0"
            style={{
              width: "55%",
              background: "linear-gradient(90deg, transparent, rgba(231,212,240,0.4), transparent)",
              filter: "blur(4px)",
            }}
          />
        </div>
        <div style={{ width: 128, height: 128, display: "grid", placeItems: "center" }}>
          <LogoMark size={128} />
        </div>
      </div>

      <h1
        className="intro-title display mt-6"
        style={{ fontSize: "clamp(1.6rem, 5vw, 2.6rem)", color: "#FFFFFF" }}
      >
        {BRAND.name}
      </h1>
      <p className="intro-tagline mt-3 px-6 text-center" style={{ color: "#B8B2BF", fontSize: "0.8rem", letterSpacing: "0.16em", textTransform: "uppercase" }}>
        {BRAND.tagline}
      </p>

      <button
        type="button"
        onClick={onComplete}
        className="ghost-button absolute right-5 top-5"
        style={{ borderColor: "rgba(231,212,240,0.3)", color: "#FFFFFF", minHeight: 40 }}
      >
        Skip
      </button>

      <style>{`
        @keyframes intro-drift {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(8px, -14px, 0); }
        }
      `}</style>
    </div>
  );
}
