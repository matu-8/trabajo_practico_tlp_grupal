import type { ReactNode } from "react";

type AlertVariant = "error" | "success";

interface AlertProps {
  variant: AlertVariant;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  error: "bg-red-50 text-red-700 border-red-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export const Alert = ({ variant, children }: AlertProps) => (
  <div
    role="alert"
    className={`rounded-lg border px-3.5 py-2.5 text-sm ${VARIANT_CLASSES[variant]}`}
  >
    {children}
  </div>
);