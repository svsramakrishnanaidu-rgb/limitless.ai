import { NextResponse } from "next/server";
import { completeChat, rateLimit } from "@/lib/ai/core";
import { recordRejected, recordRequest } from "@/lib/ai/metrics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const SCAN_PROMPT = `You are a botanical identification assistant used for health education. Analyse the supplied plant photograph.

Return ONLY a JSON object with this exact shape and no markdown fences:
{
  "identified": true | false,
  "commonName": string,
  "scientificName": string,
  "family": string,
  "confidence": "high" | "medium" | "low",
  "description": string,
  "traditionalUses": string[],
  "toxicity": string,
  "safety": string[],
  "similarPlants": [{"name": string, "risk": "low" | "moderate" | "high", "note": string}],
  "alternatives": string[],
  "limitations": string
}

Rules:
- If the image is not a plant, or is too unclear to identify, set identified to false and explain in limitations.
- Never give dosage, never recommend eating or preparing the plant, and never claim medical benefit.
- confidence must reflect genuine uncertainty; use "low" when key features are not visible.
- Include at least two similar-looking plants, flagging any that are poisonous.
- limitations must state that photo identification cannot confirm identity and that a botanist or qualified practitioner must verify before any use.
- Write in the language of the user's note, if one is supplied; otherwise English.`;

function extractJson(text: string): unknown | null {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

function stringArray(value: unknown, max = 6): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, max);
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  const limit = rateLimit(`scan:${ip}`, 10, 5 * 60 * 1000);
  if (!limit.allowed) {
    recordRejected();
    return NextResponse.json(
      { error: "Too many scans. Please wait a few minutes before trying again." },
      { status: 429, headers: { "Cache-Control": "no-store" } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { image, note } = body as { image?: unknown; note?: unknown };
  if (typeof image !== "string" || !image.startsWith("data:image/")) {
    return NextResponse.json({ error: "Upload a JPEG, PNG or WebP image." }, { status: 400 });
  }
  const match = /^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/.exec(image);
  if (!match) {
    return NextResponse.json({ error: "Only JPEG, PNG or WebP images are supported." }, { status: 400 });
  }
  const bytes = Math.floor((match[2].length * 3) / 4);
  if (bytes > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Image is larger than 5 MB. Please use a smaller photo." }, { status: 413 });
  }

  const userNote =
    typeof note === "string" && note.trim()
      ? `The user adds: "${note.trim().slice(0, 400)}"`
      : "No additional note was supplied.";

  recordRequest("scan");
  const result = await completeChat({
    system: SCAN_PROMPT,
    messages: [{ role: "user", content: `Identify the plant in this photo. ${userNote}` }],
    requireVision: true,
    imageDataUrl: image,
    complexity: "complex",
  });

  if (!result) {
    return NextResponse.json(
      { error: "The plant scanner could not reach a vision-capable AI provider. Try again shortly." },
      { status: 503 }
    );
  }

  const parsed = extractJson(result.text);
  if (!parsed || typeof parsed !== "object") {
    return NextResponse.json(
      {
        error:
          "The vision model returned an unreadable result. Please try a clearer photo with the leaf, stem and flower visible.",
        raw: result.text.slice(0, 400),
      },
      { status: 502 }
    );
  }

  const data = parsed as Record<string, unknown>;
  const similar = Array.isArray(data.similarPlants)
    ? data.similarPlants
        .filter((s): s is Record<string, unknown> => Boolean(s) && typeof s === "object")
        .map((s) => ({
          name: typeof s.name === "string" ? s.name : "Unnamed plant",
          risk: s.risk === "high" || s.risk === "moderate" ? s.risk : "low",
          note: typeof s.note === "string" ? s.note : "",
        }))
        .slice(0, 4)
    : [];

  return NextResponse.json({
    identified: data.identified === true,
    commonName: typeof data.commonName === "string" ? data.commonName : "Not determined",
    scientificName: typeof data.scientificName === "string" ? data.scientificName : "Not determined",
    family: typeof data.family === "string" ? data.family : "",
    confidence:
      data.confidence === "high" || data.confidence === "medium" ? data.confidence : "low",
    description: typeof data.description === "string" ? data.description : "",
    traditionalUses: stringArray(data.traditionalUses),
    toxicity: typeof data.toxicity === "string" ? data.toxicity : "Not assessed.",
    safety: stringArray(data.safety),
    similarPlants: similar,
    alternatives: stringArray(data.alternatives, 4),
    limitations:
      typeof data.limitations === "string" && data.limitations
        ? data.limitations
        : "Photo identification cannot confirm a plant's identity. Never eat or prepare a plant based on an automated result.",
    provider: result.providerLabel,
    model: result.model,
    latencyMs: result.latencyMs,
  }, { headers: { "Cache-Control": "no-store" } });
}
