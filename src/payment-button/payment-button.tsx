import { usePayment, type PaymentStatus } from "../use-payment/use-payment.js";

export interface PaymentButtonProps {
  url: string;
  label?: string;
  className?: string;
  requestInit?: RequestInit;
  onComplete?: (receipt: { txHash?: string; traceId?: string }) => void;
  onError?: (error: Error) => void;
}

const STATUS_LABELS: Record<PaymentStatus, string> = {
  idle: "Pay",
  pending: "Processing...",
  signing: "Sign payment...",
  settling: "Settling...",
  complete: "Paid",
  error: "Failed — Retry",
};

/**
 * Pre-built payment button with status feedback.
 * Renders a <button> that triggers a payment flow and shows current status.
 */
export function PaymentButton({
  url,
  label,
  className,
  requestInit,
  onComplete,
  onError,
}: PaymentButtonProps) {
  const { pay, status, receipt, error } = usePayment(url, requestInit);

  const handleClick = async () => {
    await pay();
    if (receipt && onComplete) onComplete(receipt);
    if (error && onError) onError(error);
  };

  const disabled = status === "pending" || status === "signing" || status === "settling";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={className}
      data-tallypay-status={status}
    >
      {label ?? STATUS_LABELS[status]}
    </button>
  );
}
