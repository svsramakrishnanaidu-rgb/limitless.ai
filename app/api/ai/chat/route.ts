import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/ai/prompt";
import { classifyComplexity } from "@/lib/ai/retrieval";
import { streamChat, rateLimit, type ChatMessage } from "@/lib/ai/core";
import { recordRejected, recordRequest } from "@/lib/ai/metrics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_MESSAGES = 14;
const MAX_CHARS = 4000;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  const limit = rateLimit(`chat:${ip}`, 20, 5 * 60 * 1000);
  if (!limit.allowed) {
    recordRejected();
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes and try again." },
      { status: 429, headers: { "Cache-Control": "no-store" } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const payload = body as { messages?: unknown; locale?: unknown };
  if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
    return NextResponse.json({ error: "A message is required." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const messages: ChatMessage[] = [];
  for (const raw of payload.messages.slice(-MAX_MESSAGES)) {
    if (!raw || typeof raw !== "object") continue;
    const m = raw as { role?: unknown; content?: unknown };
    if (m.role !== "user" && m.role !== "assistant") continue;
    if (typeof m.content !== "string") continue;
    const content = m.content.trim().slice(0, MAX_CHARS);
    if (!content) continue;
    messages.push({ role: m.role, content });
  }

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json(
      { error: "The last message must come from the user." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const localeNote =
    typeof payload.locale === "string" && payload.locale !== "en"
      ? `\nThe user's interface language is set to "${payload.locale}". Reply in the language of the user's message; if the message is English, reply in English.`
      : "";

  const lastUserMessage = messages[messages.length - 1].content;
  const system = buildSystemPrompt(lastUserMessage) + localeNote;
  const complexity = classifyComplexity(lastUserMessage);

  recordRequest("chat");
  const handle = await streamChat({ system, messages, complexity });

  if (!handle) {
    return NextResponse.json(
      {
        error:
          "LIMITLESS AI could not reach any configured provider. Check the provider status in Settings, or try again shortly.",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  return new Response(handle.body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Content-Type-Options": "nosniff",
      "X-AI-Provider": handle.providerLabel,
      "X-AI-Model": handle.model,
      "X-AI-Latency": String(handle.latencyMs),
      "X-Accel-Buffering": "no",
    },
  });
}
