import type { PaymentLifecycleEventType } from "@tallypay/core";

const DEFAULT_COLLECTOR_URL = "https://collector.tallypay.dev";

interface BeaconConfig {
  apiKey: string;
  collectorUrl?: string;
}

/**
 * Sends a lightweight beacon to the TallyPay trace collector.
 * Uses navigator.sendBeacon when available (non-blocking, survives page unload),
 * falls back to fetch with keepalive.
 */
export function sendBeacon(
  config: BeaconConfig,
  traceId: string,
  eventType: PaymentLifecycleEventType,
  metadata?: Record<string, unknown>,
): void {
  const { apiKey, collectorUrl = DEFAULT_COLLECTOR_URL } = config;

  const payload = JSON.stringify({
    events: [
      {
        traceId,
        apiKey,
        eventType,
        source: "client" as const,
        timestamp: Date.now(),
        metadata,
      },
    ],
  });

  const url = `${collectorUrl}/beacon`;

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(url, blob);
    } else {
      void fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Silently drop — observability never breaks payments
  }
}
