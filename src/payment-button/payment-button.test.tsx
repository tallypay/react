import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TallyPayProvider } from "../provider/provider.js";
import { PaymentButton } from "./payment-button.js";

describe("PaymentButton + usePayment", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 200 })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("completes when the URL returns non-402", async () => {
    const user = userEvent.setup();
    render(
      <TallyPayProvider network="eip155:8453" walletClient={{}}>
        <PaymentButton url="https://api.example.com/free" />
      </TallyPayProvider>,
    );

    await user.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByRole("button").textContent).toBe("Paid");
    });
  });

  it("enters error state when the server returns 402 (signing not implemented)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 402,
          headers: { "x-trace-id": "trace-test-1" },
        }),
      ),
    );

    const user = userEvent.setup();
    render(
      <TallyPayProvider network="eip155:8453" walletClient={{}}>
        <PaymentButton url="https://api.example.com/paid" />
      </TallyPayProvider>,
    );

    await user.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByRole("button").textContent).toMatch(/Failed|Retry/i);
    });
  });
});
