import { useState, useCallback } from "react";
import { useTallyPay } from "../provider/provider.js";
import { sendBeacon } from "../beacon/beacon.js";

export type PaymentStatus =
  | "idle"
  | "pending"
  | "signing"
  | "settling"
  | "complete"
  | "error";

export interface UsePaymentResult {
  pay: () => Promise<void>;
  status: PaymentStatus;
  receipt: { txHash?: string; traceId?: string } | null;
  error: Error | null;
  traceId: string | null;
}

/**
 * Declarative hook for a single payment flow.
 * Manages the full lifecycle: idle -> pending -> signing -> settling -> complete/error.
 */
export function usePayment(
  url: string,
  options?: RequestInit,
): UsePaymentResult {
  const { apiKey, collectorUrl } = useTallyPay();
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [receipt, setReceipt] = useState<UsePaymentResult["receipt"]>(null);
  const [error, setError] = useState<Error | null>(null);
  const [traceId, setTraceId] = useState<string | null>(null);

  const beaconConfig = apiKey ? { apiKey, collectorUrl } : null;

  const pay = useCallback(async () => {
    setStatus("pending");
    setError(null);
    setReceipt(null);

    try {
      const initialResponse = await fetch(url, options);

      if (initialResponse.status !== 402) {
        setStatus("complete");
        return;
      }

      const responseTraceId = initialResponse.headers.get("x-trace-id");
      if (responseTraceId) setTraceId(responseTraceId);

      if (beaconConfig && responseTraceId) {
        sendBeacon(beaconConfig, responseTraceId, "402_RECEIVED", { url });
      }

      setStatus("signing");

      // TODO: integrate with walletClient to sign the payment
      // This is where viem/wagmi wallet signing will happen
      throw new Error(
        "Payment signing not yet implemented. Provide a walletClient to the TallyPayProvider.",
      );
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err : new Error(String(err)));

      if (beaconConfig && traceId) {
        sendBeacon(beaconConfig, traceId, "PAYMENT_ERROR", {
          url,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }, [url, options, beaconConfig, traceId]);

  return { pay, status, receipt, error, traceId };
}
