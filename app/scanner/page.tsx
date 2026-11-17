"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Camera, ImagePlus, ScanLine, ShieldAlert, Sparkles, X } from "lucide-react";
import { Glass, PageHeader, Callout, Skeleton } from "@/components/ui";
import { usePrefs } from "@/components/providers";

type ScanResult = {
  identified: boolean;
  commonName: string;
  scientificName: string;
  family: string;
  confidence: "high" | "medium" | "low";
  description: string;
  traditionalUses: string[];
  toxicity: string;
  safety: string[];
  similarPlants: { name: string; risk: string; note: string }[];
  alternatives: string[];
  limitations: string;
  provider: string;
  model: string;
  latencyMs: number;
};

async function shrinkImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("That file is not a readable image."));
    img.src = dataUrl;
  });

  const max = 1280;
  const scale = Math.min(1, max / Math.max(image.width, image.height));
  if (scale === 1 && dataUrl.length < 1_600_000) return dataUrl;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.86);
}

export default function ScannerPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const { t } = usePrefs();

  const handleFile = async (file: File | undefined) => {
    setFileError(null);
    setResult(null);
    setError(null);
    if (!file) return;
    if (!/^image\/(jpeg|jpg|png|webp)$/.test(file.type)) {
      setFileError("Choose a JPEG, PNG or WebP photo.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setFileError("That photo is over 12 MB. Choose a smaller image.");
      return;
    }
    try {
      const shrunk = await shrinkImage(file);
      setPreview(shrunk);
    } catch (err) {
      setFileError(err instanceof Error ? err.message : "Could not read that image.");
    }
  };

  const analyse = async () => {
    if (!preview) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: preview, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "The scan failed.");
      setResult(data as ScanResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The scan failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="AI medicinal plant scanner"
        title="Photograph a plant, then verify it"
        description="A vision model suggests a possible identification with safety warnings. It cannot confirm a species, and its answer is never permission to use a plant."
        actions={
          <Link href="/plants" className="ghost-button">
            Browse the plant database
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <Glass className="card-pad flex flex-col">
          <div
            className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl"
            style={{
              border: "1px dashed var(--line-strong)",
              background: preview
                ? "#000000"
                : "radial-gradient(circle at 50% 40%, rgba(113,59,145,0.2), transparent 65%)",
            }}
          >
            {preview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Plant photograph selected for identification" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button
                  type="button"
                  className="icon-button absolute right-2 top-2"
                  aria-label="Remove photo"
                  onClick={() => {
                    setPreview(null);
                    setResult(null);
                    setError(null);
                  }}
                  style={{ background: "rgba(0,0,0,0.68)" }}
                >
                  <X size={16} aria-hidden />
                </button>
                {loading && (
                  <div className="absolute inset-0 overflow-hidden" aria-hidden>
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        height: 2,
                        background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
                        animation: "scan-sweep 1.6s ease-in-out infinite",
                        boxShadow: "0 0 18px rgba(201,166,232,0.55)",
                      }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 px-6 text-center">
                <ScanLine size={38} strokeWidth={1.3} style={{ color: "var(--gold)" }} aria-hidden />
                <p className="small">Add a clear photo of the whole plant</p>
                <p className="tiny muted">Leaf surfaces, stem attachment, flower and fruit all help. Blurry close-ups mislead models.</p>
              </div>
            )}
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              id="plant-upload"
              onChange={(e) => void handleFile(e.target.files?.[0])}
            />
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              id="plant-camera"
              onChange={(e) => void handleFile(e.target.files?.[0])}
            />
            <button type="button" className="ghost-button" onClick={() => cameraRef.current?.click()}>
              <Camera size={15} aria-hidden /> Take photo
            </button>
            <button type="button" className="ghost-button" onClick={() => fileRef.current?.click()}>
              <ImagePlus size={15} aria-hidden /> Upload image
            </button>
          </div>

          {fileError && <p className="field-error" role="alert">{fileError}</p>}

          <div className="mt-3">
            <label className="field-label" htmlFor="scan-note">Optional note</label>
            <input
              id="scan-note"
              className="field"
              value={note}
              maxLength={300}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Where was it growing? Any scent or milky sap?"
            />
          </div>

          <button type="button" className="gold-button mt-3 w-full" disabled={!preview || loading} onClick={() => void analyse()}>
            {loading ? <><span className="spinner" aria-hidden /> Analysing photo…</> : <><ScanLine size={16} aria-hidden /> Identify plant</>}
          </button>
          <p className="tiny muted mt-2">
            The photo is sent to the configured vision provider to generate this result. Cropped images are processed in memory and not stored by LIMITLESS.
          </p>
        </Glass>

        <div className="flex flex-col gap-4">
          {loading && (
            <Glass className="card-pad">
              <p className="small mb-3">Checking leaf shape, arrangement and visible structures…</p>
              <Skeleton className="mb-2 h-5 w-2/3" />
              <Skeleton className="mb-2 h-4 w-1/2" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </Glass>
          )}

          {error && (
            <Callout tone="danger" title="Scan failed">
              {error}
              {error.includes("vision") && (
                <p className="mt-1">
                  The configured providers can be checked in <Link href="/settings" className="underline">Settings</Link>.
                </p>
              )}
            </Callout>
          )}

          {!loading && !result && !error && (
            <Glass className="card-pad">
              <h2 className="section-title mb-2">Escalation, not identification</h2>
              <p className="small muted" style={{ lineHeight: 1.65 }}>
                {t("disclaimer.short")} A vision model can confuse closely related species, including poisonous ones. Use this tool to collect
                candidate names, then confirm with a botanist, a recognised herbarium, or an agricultural extension officer.
              </p>
              <div className="mt-4 rounded-xl border p-3" style={{ borderColor: "rgba(229,72,77,0.4)", background: "rgba(229,72,77,0.05)" }}>
                <p className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--danger)" }}>
                  <ShieldAlert size={15} aria-hidden /> If someone has eaten a plant
                </p>
                <p className="tiny muted mt-1">
                  Call emergency services immediately — India 112, US 911, UK 999 — and keep the plant or a photo for identification.
                </p>
                <Link href="/emergency" className="small mt-2 inline-block underline" style={{ color: "var(--gold)" }}>
                  Open emergency guidance
                </Link>
              </div>
            </Glass>
          )}

          {result && !loading && (
            <>
              <Glass className="card-pad">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={`badge ${result.confidence === "low" ? "badge-danger" : "badge-green"}`}>
                    {result.confidence} confidence
                  </span>
                  <span className="badge">{result.provider}</span>
                  <span className="tiny muted">{Math.round(result.latencyMs / 100) / 10}s</span>
                </div>
                {result.identified ? (
                  <>
                    <h2 className="brand-serif text-2xl">{result.commonName}</h2>
                    <p className="small italic muted">{result.scientificName}{result.family ? ` · ${result.family}` : ""}</p>
                    <p className="small mt-3" style={{ lineHeight: 1.65 }}>{result.description}</p>
                  </>
                ) : (
                  <Callout tone="warning" title="Not enough detail to identify">
                    The model could not make even a tentative identification. Try a sharper photo showing the whole plant in daylight.
                  </Callout>
                )}
              </Glass>

              <Glass className="card-pad">
                <h3 className="section-title mb-2">Toxicity and safety</h3>
                <p className="small" style={{ lineHeight: 1.6 }}>{result.toxicity}</p>
                {result.safety.length > 0 && (
                  <ul className="med-prose small mt-2 list-disc pl-5">
                    {result.safety.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                )}
                {result.traditionalUses.length > 0 && (
                  <>
                    <h3 className="section-title mb-1 mt-4">Traditional applications</h3>
                    <ul className="med-prose small list-disc pl-5">
                      {result.traditionalUses.map((u) => <li key={u}>{u}</li>)}
                    </ul>
                    <p className="tiny muted mt-2">Documented tradition, not evidence of effectiveness. Do not act on this without expert confirmation.</p>
                  </>
                )}
              </Glass>

              {result.similarPlants.length > 0 && (
                <Glass className="card-pad">
                  <h3 className="section-title mb-2">Similar-looking plants</h3>
                  <ul className="flex flex-col gap-2">
                    {result.similarPlants.map((p) => (
                      <li key={p.name} className="rounded-xl border p-3" style={{ borderColor: p.risk === "high" ? "rgba(229,72,77,0.4)" : "var(--line)" }}>
                        <div className="flex items-center justify-between gap-2">
                          <p className="small font-medium">{p.name}</p>
                          <span className={`badge ${p.risk === "high" ? "badge-danger" : p.risk === "moderate" ? "badge-gold" : ""}`}>{p.risk} risk</span>
                        </div>
                        <p className="tiny muted mt-1" style={{ lineHeight: 1.5 }}>{p.note}</p>
                      </li>
                    ))}
                  </ul>
                </Glass>
              )}

              <Callout tone="warning" title="How to use this result">
                {result.limitations}
              </Callout>

              <div className="flex flex-wrap gap-2">
                <Link href={`/ai?q=${encodeURIComponent(`What should I know about ${result.commonName} (${result.scientificName})?`)}`} className="gold-button">
                  <Sparkles size={15} aria-hidden /> Ask LIMITLESS AI about it
                </Link>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => {
                    setPreview(null);
                    setResult(null);
                    setNote("");
                  }}
                >
                  Scan another plant
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan-sweep {
          0% { top: 0; opacity: 0; }
          12% { opacity: 1; }
          88% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
