import { recordAttempt, recordStreamed } from "./metrics";

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type Complexity = "simple" | "complex";

export type ProviderId = "openrouter" | "groq" | "gemini" | "openai";

export type ProviderConfig = {
  id: ProviderId;
  label: string;
  model: string;
  envKey: string;
  supportsVision: boolean;
  priority: number;
  /** Rough relative cost per 1k output tokens, used for routing notes only. */
  costTier: "low" | "medium" | "high";
};

export type CompletionResult = {
  text: string;
  provider: ProviderId;
  providerLabel: string;
  model: string;
  latencyMs: number;
  attempts: { provider: ProviderId; ok: boolean; status?: number; reason?: string }[];
};

const PROVIDERS: ProviderConfig[] = [
  {
    id: "openrouter",
    label: "OpenRouter",
    model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct",
    envKey: "OPENROUTER_API_KEY",
    supportsVision: true,
    priority: 1,
    costTier: "low",
  },
  {
    id: "groq",
    label: "Groq",
    model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    envKey: "GROQ_API_KEY",
    supportsVision: false,
    priority: 2,
    costTier: "low",
  },
  {
    id: "gemini",
    label: "Google Gemini",
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    envKey: "GEMINI_API_KEY",
    supportsVision: true,
    priority: 3,
    costTier: "low",
  },
  {
    id: "openai",
    label: "OpenAI",
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    envKey: "OPENAI_API_KEY",
    supportsVision: true,
    priority: 4,
    costTier: "medium",
  },
];

export const VISION_MODEL = process.env.OPENROUTER_VISION_MODEL || "google/gemini-2.5-flash";

const MAX_ATTEMPTS = Math.max(1, Math.min(4, Number(process.env.AI_MAX_ATTEMPTS ?? 3)));
const REQUEST_TIMEOUT_MS = 45_000;
const BREAKER_COOLDOWN_MS = 60_000;

type Breaker = { failures: number; openedAt: number };
const breakers = new Map<ProviderId, Breaker>();

function breakerOpen(id: ProviderId): boolean {
  const b = breakers.get(id);
  if (!b) return false;
  if (Date.now() - b.openedAt > BREAKER_COOLDOWN_MS) {
    breakers.delete(id);
    return false;
  }
  return b.failures >= 2;
}

function noteFailure(id: ProviderId) {
  const b = breakers.get(id) ?? { failures: 0, openedAt: Date.now() };
  b.failures += 1;
  b.openedAt = Date.now();
  breakers.set(id, b);
}

function noteSuccess(id: ProviderId) {
  breakers.delete(id);
}

export function configuredProviders(): {
  id: ProviderId;
  label: string;
  model: string;
  vision: boolean;
  connected: boolean;
  costTier: string;
}[] {
  return PROVIDERS.map((p) => ({
    id: p.id,
    label: p.label,
    model: p.id === "openrouter" ? `${p.model} · vision: ${VISION_MODEL}` : p.model,
    vision: p.supportsVision,
    connected: Boolean(process.env[p.envKey]),
    costTier: p.costTier,
  }));
}

function availableProviders(requireVision: boolean): ProviderConfig[] {
  return PROVIDERS.filter((p) => Boolean(process.env[p.envKey]))
    .filter((p) => !requireVision || p.supportsVision)
    .filter((p) => !breakerOpen(p.id))
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Simple questions go to the fastest configured text model; complex or
 * safety-sensitive questions start with the strongest default. Vision always
 * starts with OpenRouter, whose model was verified for image input.
 */
function orderProviders(requireVision: boolean, complexity: Complexity = "complex"): ProviderConfig[] {
  const available = availableProviders(requireVision);
  if (requireVision) return available;
  if (complexity === "simple") {
    return [...available].sort((a, b) => {
      const rank = (p: ProviderConfig) => (p.id === "groq" ? 0 : p.id === "openrouter" ? 1 : p.priority + 1);
      return rank(a) - rank(b);
    });
  }
  return available;
}

type CallResult = { ok: true; text: string } | { ok: false; status: number; reason: string; retryable: boolean };

async function callOpenAiCompatible(
  endpoint: string,
  apiKey: string,
  model: string,
  messages: Record<string, unknown>[],
  extraHeaders: Record<string, string> = {}
): Promise<CallResult> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...extraHeaders,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
        max_tokens: 900,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) {
      const body = await res.text();
      const retryable = res.status === 429 || res.status >= 500;
      return { ok: false, status: res.status, reason: body.slice(0, 240), retryable };
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) return { ok: false, status: 502, reason: "Empty completion", retryable: true };
    return { ok: true, text };
  } catch (err) {
    const message = err instanceof Error ? err.message : "network error";
    return { ok: false, status: 0, reason: message, retryable: true };
  }
}

async function callGemini(
  apiKey: string,
  model: string,
  systemPrompt: string,
  messages: ChatMessage[],
  imageDataUrl?: string
): Promise<CallResult> {
  try {
    const contents: { role: string; parts: Record<string, unknown>[] }[] = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    if (imageDataUrl && contents.length) {
      const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(imageDataUrl);
      if (match) {
        contents[contents.length - 1].parts.push({
          inline_data: { mime_type: match[1], data: match[2] },
        });
      }
    }
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { temperature: 0.3, maxOutputTokens: 900 },
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }
    );
    if (!res.ok) {
      const body = await res.text();
      return {
        ok: false,
        status: res.status,
        reason: body.slice(0, 240),
        retryable: res.status === 429 || res.status >= 500,
      };
    }
    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("")
      .trim();
    if (!text) return { ok: false, status: 502, reason: "Empty completion", retryable: true };
    return { ok: true, text };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      reason: err instanceof Error ? err.message : "network error",
      retryable: true,
    };
  }
}

/**
 * Routes a chat request to the first healthy provider that fits the request.
 * Failover preserves the full conversation for the fallback provider.
 */
export async function completeChat(opts: {
  system: string;
  messages: ChatMessage[];
  requireVision?: boolean;
  imageDataUrl?: string;
  complexity?: Complexity;
}): Promise<CompletionResult | null> {
  const requireVision = Boolean(opts.requireVision || opts.imageDataUrl);
  const candidates = orderProviders(requireVision, opts.complexity).slice(0, MAX_ATTEMPTS);
  const attempts: CompletionResult["attempts"] = [];

  for (const provider of candidates) {
    const started = Date.now();
    const apiKey = process.env[provider.envKey];
    if (!apiKey) continue;

    let payloadMessages: Record<string, unknown>[] = [
      { role: "system", content: opts.system },
      ...opts.messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    if (opts.imageDataUrl && provider.supportsVision && provider.id !== "gemini") {
      payloadMessages = [
        { role: "system", content: opts.system },
        ...opts.messages.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
        {
          role: "user",
          content: [
            { type: "text", text: opts.messages[opts.messages.length - 1]?.content ?? "Identify this image." },
            { type: "image_url", image_url: { url: opts.imageDataUrl } },
          ],
        },
      ];
    }

    let result: CallResult;
    if (provider.id === "gemini") {
      result = await callGemini(apiKey, provider.model, opts.system, opts.messages, opts.imageDataUrl);
    } else if (provider.id === "openrouter") {
      result = await callOpenAiCompatible(
        "https://openrouter.ai/api/v1/chat/completions",
        apiKey,
        requireVision ? VISION_MODEL : provider.model,
        payloadMessages,
        {
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": "LIMITLESS",
        }
      );
    } else if (provider.id === "groq") {
      result = await callOpenAiCompatible(
        "https://api.groq.com/openai/v1/chat/completions",
        apiKey,
        provider.model,
        payloadMessages
      );
    } else {
      result = await callOpenAiCompatible(
        "https://api.openai.com/v1/chat/completions",
        apiKey,
        provider.model,
        payloadMessages
      );
    }

    const latencyMs = Date.now() - started;

    if (result.ok) {
      noteSuccess(provider.id);
      recordAttempt(provider.id, true, latencyMs);
      attempts.push({ provider: provider.id, ok: true });
      return {
        text: result.text,
        provider: provider.id,
        providerLabel: provider.label,
        model: provider.id === "openrouter" && requireVision ? VISION_MODEL : provider.model,
        latencyMs,
        attempts,
      };
    }

    recordAttempt(provider.id, false, latencyMs, result.reason);
    attempts.push({ provider: provider.id, ok: false, status: result.status, reason: result.reason });
    if (result.retryable) noteFailure(provider.id);
  }

  return null;
}

/* ------------------------------------------------------------------ streaming */

function sseToText(source: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return source.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const event of events) {
          for (const line of event.split("\n")) {
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const json = JSON.parse(data) as {
                choices?: { delta?: { content?: string } }[];
              };
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // Ignore keep-alive comments and malformed fragments.
            }
          }
        }
      },
    })
  );
}

function textToStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
}

export type StreamHandle = {
  body: ReadableStream<Uint8Array>;
  provider: ProviderId;
  providerLabel: string;
  model: string;
  latencyMs: number;
};

/**
 * Streams token deltas from the first healthy OpenAI-compatible provider.
 * Gemini's streaming API differs, so it is handled through the buffered
 * fallback rather than adding a second parser for an emergency path.
 */
export async function streamChat(opts: {
  system: string;
  messages: ChatMessage[];
  complexity?: Complexity;
}): Promise<StreamHandle | null> {
  const candidates = orderProviders(false, opts.complexity).slice(0, MAX_ATTEMPTS);

  for (const provider of candidates) {
    if (provider.id === "gemini") continue;
    const apiKey = process.env[provider.envKey];
    if (!apiKey) continue;

    const endpoint =
      provider.id === "openrouter"
        ? "https://openrouter.ai/api/v1/chat/completions"
        : provider.id === "groq"
          ? "https://api.groq.com/openai/v1/chat/completions"
          : "https://api.openai.com/v1/chat/completions";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    };
    if (provider.id === "openrouter") {
      headers["HTTP-Referer"] = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3100";
      headers["X-Title"] = "LIMITLESS";
    }

    const started = Date.now();
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: provider.model,
          messages: [{ role: "system", content: opts.system }, ...opts.messages],
          temperature: 0.3,
          max_tokens: 900,
          stream: true,
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!res.ok || !res.body) {
        const reason = res.body ? `status ${res.status}` : "no response body";
        recordAttempt(provider.id, false, Date.now() - started, reason);
        if (res.status === 429 || res.status >= 500) noteFailure(provider.id);
        continue;
      }

      noteSuccess(provider.id);
      recordAttempt(provider.id, true, Date.now() - started);
      recordStreamed();
      return {
        body: sseToText(res.body),
        provider: provider.id,
        providerLabel: provider.label,
        model: provider.model,
        latencyMs: Date.now() - started,
      };
    } catch (err) {
      recordAttempt(provider.id, false, Date.now() - started, err instanceof Error ? err.message : "network error");
    }
  }

  const buffered = await completeChat({ system: opts.system, messages: opts.messages, complexity: opts.complexity });
  if (!buffered) return null;
  return {
    body: textToStream(buffered.text),
    provider: buffered.provider,
    providerLabel: buffered.providerLabel,
    model: buffered.model,
    latencyMs: buffered.latencyMs,
  };
}

export function providerSummaryForClient() {
  return configuredProviders().map(({ id, label, model, connected, vision, costTier }) => ({
    id,
    label,
    model,
    connected,
    vision,
    costTier,
  }));
}

/** In-memory rate limiting. Per instance only, which is adequate for this deployment shape. */
const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || now > current.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (current.count >= limit) return { allowed: false, remaining: 0 };
  current.count += 1;
  return { allowed: true, remaining: limit - current.count };
}
