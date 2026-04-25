# @tallypay/react

React provider, hooks, and UI helpers for x402 **HTTP 402** flows, plus optional [TallyPay](https://tallypay.dev) **client beacons** (`navigator.sendBeacon` / fetch `keepalive`) so you can measure conversion (402 seen → signed → completed) in the dashboard.

## Install

```bash
npm install @tallypay/react
```

Peer dependencies: **`react`** and **`react-dom`** ≥ 18.

Also install **`@tallypay/core`** (listed as a dependency of this package).

## Provider

Wrap your app (or subtree) so hooks can read config and optionally send beacons when `apiKey` is set.

```tsx
import { TallyPayProvider } from "@tallypay/react";

export function App() {
  return (
    <TallyPayProvider
      apiKey="tp_live_..." // optional — enables beacons to the collector
      network="eip155:8453"
      walletClient={walletClient} // viem / wagmi client — used when signing is wired up
      collectorUrl="https://collector.tallypay.dev" // optional
    >
      <YourRoutes />
    </TallyPayProvider>
  );
}
```

## Hooks

### `useTallyPay()`

Returns `{ apiKey?, network, walletClient, collectorUrl? }`. Must be used under `TallyPayProvider`.

### `usePaymentFetch()`

Returns a **`fetch`-compatible** function that uses `@tallypay/core`’s `wrapFetch` to handle 402 responses. When `apiKey` is set, lifecycle callbacks can align with server `x-trace-id` for beacons.

**Note:** End-to-end signing is still being integrated with `walletClient`; until then, the internal signer may throw—follow releases for wallet + facilitator wiring.

### `usePayment(url, requestInit?)`

Imperative single-shot payment: `{ pay, status, receipt, error, traceId }` with `status` in `idle` | `pending` | `signing` | `settling` | `complete` | `error`.

## Components

### `<PaymentButton />`

Status-aware button that calls `usePayment` for a given URL.

```tsx
import { PaymentButton } from "@tallypay/react";

<PaymentButton
  url="/api/premium"
  label="Unlock"
  onComplete={(receipt) => console.log(receipt)}
/>
```

## Beacons

With `apiKey`, the package sends lightweight events to the TallyPay collector (e.g. after a 402 or on errors) so you can build funnels in the product—**facilitators do not see this client-side signal**.

## Testing

From the monorepo root:

```bash
pnpm --filter @tallypay/react test
```

Uses Vitest with **jsdom**, **@testing-library/react**, and **@testing-library/user-event**.

## License

MIT. Source code will be published on GitHub at launch; until then see [tallypay.dev](https://tallypay.dev).

## Links

- [TallyPay](https://tallypay.dev)
- [@tallypay/core](https://www.npmjs.com/package/@tallypay/core)
