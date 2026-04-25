import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TallyPayProvider, useTallyPay } from "./provider.js";

function Consumer() {
  const ctx = useTallyPay();
  return (
    <span data-testid="network">{ctx.network}</span>
  );
}

describe("TallyPayProvider", () => {
  it("provides context to children", () => {
    render(
      <TallyPayProvider network="eip155:8453" walletClient={{ client: true }}>
        <Consumer />
      </TallyPayProvider>,
    );
    expect(screen.getByTestId("network").textContent).toBe("eip155:8453");
  });

  it("throws when useTallyPay is used outside the provider", () => {
    expect(() => render(<Consumer />)).toThrow(
      /useTallyPay must be used within a <TallyPayProvider>/,
    );
  });
});
