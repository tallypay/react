import { useCallback } from "react";
import { wrapFetch, type PaymentRequired } from "@tallypay/core";
import { useTallyPay } from "../provider/provider.js";
import { sendBeacon } from "../beacon/beacon.js";

/**
 * Returns a `fetch` function that automatically handles x402 402 responses.
 * When a 402 is received, it calls the wallet to sign a payment,
 * then retries the request with the PAYMENT-SIGNATURE header.
 *
 * Emits client-side beacons to the TallyPay trace collector when `apiKey` is set.
 */
export function usePaymentFetch(): typeof fetch {
  const { apiKey, walletClient, collectorUrl } = useTallyPay();

  return useCallback(() => {
    const beaconConfig = apiKey ? { apiKey, collectorUrl } : null;

    return wrapFetch(fetch, {
      onPaymentRequired: async (
        _paymentRequired: PaymentRequired,
        _url: string,
      ): Promise<string> => {
        // TODO: integrate with walletClient to sign the payment
        // This is where viem/wagmi wallet signing will happen
        throw new Error(
          "Payment signing not yet implemented. Provide a walletClient to the TallyPayProvider.",
        );
      },
      onLifecycleEvent: (eventType, metadata) => {
        const traceId = (metadata as Record<string, unknown>)?.traceId as
          | string
          | undefined;
        if (beaconConfig && traceId) {
          sendBeacon(beaconConfig, traceId, eventType as never, metadata);
        }
      },
    });
  }, [apiKey, walletClient, collectorUrl])();
}
