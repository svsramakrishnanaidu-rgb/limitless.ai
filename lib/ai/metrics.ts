import type { ProviderId } from "./core";

type ProviderMetric = {
  requests: number;
  successes: number;
  failures: number;
  totalLatencyMs: number;
  lastLatencyMs: number | null;
  lastError: string | null;
  lastErrorAt: number | null;
};

type Store = {
  startedAt: number;
  providers: Map<ProviderId, ProviderMetric>;
  chatRequests: number;
  scanRequests: number;
  streamedResponses: number;
  failovers: number;
  rejectedRequests: number;
};

/**
 * Next bundles every route separately, so module-level counters would be
 * duplicated per route. Keeping the store on globalThis makes the numbers
 * consistent within one running server process. Serverless instances remain
 * independent; these counters are diagnostics, not global analytics.
 */
const globalKey = "__limitlessAiMetrics";
const globalStore = globalThis as typeof globalThis & { [globalKey]?: Store };

function store(): Store {
  if (!globalStore[globalKey]) {
    globalStore[globalKey] = {
      startedAt: Date.now(),
      providers: new Map<ProviderId, ProviderMetric>(),
      chatRequests: 0,
      scanRequests: 0,
      streamedResponses: 0,
      failovers: 0,
      rejectedRequests: 0,
    };
  }
  return globalStore[globalKey]!;
}

function metric(id: ProviderId): ProviderMetric {
  const s = store();
  const existing = s.providers.get(id);
  if (existing) return existing;
  const created: ProviderMetric = {
    requests: 0,
    successes: 0,
    failures: 0,
    totalLatencyMs: 0,
    lastLatencyMs: null,
    lastError: null,
    lastErrorAt: null,
  };
  s.providers.set(id, created);
  return created;
}

export function recordRequest(kind: "chat" | "scan") {
  const s = store();
  if (kind === "chat") s.chatRequests += 1;
  else s.scanRequests += 1;
}

export function recordRejected() {
  store().rejectedRequests += 1;
}

export function recordAttempt(id: ProviderId, ok: boolean, latencyMs: number, error?: string) {
  const s = store();
  const m = metric(id);
  m.requests += 1;
  m.totalLatencyMs += Math.max(0, latencyMs);
  m.lastLatencyMs = Math.round(latencyMs);
  if (ok) {
    m.successes += 1;
  } else {
    m.failures += 1;
    s.failovers += 1;
    m.lastError = error?.slice(0, 160) ?? "unknown error";
    m.lastErrorAt = Date.now();
  }
}

export function recordStreamed() {
  store().streamedResponses += 1;
}

export function metricsSnapshot() {
  const s = store();
  return {
    instanceStartedAt: new Date(s.startedAt).toISOString(),
    uptimeSeconds: Math.round((Date.now() - s.startedAt) / 1000),
    chatRequests: s.chatRequests,
    scanRequests: s.scanRequests,
    streamedResponses: s.streamedResponses,
    failovers: s.failovers,
    rejectedRequests: s.rejectedRequests,
    providers: Array.from(s.providers.entries()).map(([id, m]) => ({
      id,
      requests: m.requests,
      successes: m.successes,
      failures: m.failures,
      averageLatencyMs: m.requests ? Math.round(m.totalLatencyMs / m.requests) : null,
      lastLatencyMs: m.lastLatencyMs,
      lastError: m.lastError,
      lastErrorAt: m.lastErrorAt ? new Date(m.lastErrorAt).toISOString() : null,
    })),
  };
}
