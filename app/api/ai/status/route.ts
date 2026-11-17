import { NextResponse } from "next/server";
import { providerSummaryForClient, completeChat } from "@/lib/ai/core";
import { metricsSnapshot } from "@/lib/ai/metrics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const probe = url.searchParams.get("probe") === "1";

  const providers = providerSummaryForClient();

  if (!probe) {
    return NextResponse.json(
      {
        providers,
        configured: providers.filter((p) => p.connected).length,
        probe: null,
        metrics: metricsSnapshot(),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const started = Date.now();
  const result = await completeChat({
    system: "You are a health check. Reply with exactly: ok",
    messages: [{ role: "user", content: "Health check. Reply with exactly: ok" }],
  });

  return NextResponse.json(
    {
      providers,
      configured: providers.filter((p) => p.connected).length,
      probe: result
        ? {
            ok: true,
            provider: result.providerLabel,
            model: result.model,
            latencyMs: Date.now() - started,
            failovers: result.attempts.filter((a) => !a.ok).length,
          }
        : { ok: false, message: "No configured provider answered the probe." },
      metrics: metricsSnapshot(),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
