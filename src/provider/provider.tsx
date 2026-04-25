import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

export interface TallyPayContext {
  apiKey?: string;
  network: string;
  walletClient: unknown;
  collectorUrl?: string;
}

export interface TallyPayProviderProps {
  apiKey?: string;
  network: string;
  walletClient: unknown;
  collectorUrl?: string;
  children: ReactNode;
}

const TallyPayCtx = createContext<TallyPayContext | null>(null);

export function TallyPayProvider({
  apiKey,
  network,
  walletClient,
  collectorUrl,
  children,
}: TallyPayProviderProps) {
  const value = useMemo<TallyPayContext>(
    () => ({ apiKey, network, walletClient, collectorUrl }),
    [apiKey, network, walletClient, collectorUrl],
  );

  return <TallyPayCtx.Provider value={value}>{children}</TallyPayCtx.Provider>;
}

export function useTallyPay(): TallyPayContext {
  const ctx = useContext(TallyPayCtx);
  if (!ctx) {
    throw new Error("useTallyPay must be used within a <TallyPayProvider>");
  }
  return ctx;
}
