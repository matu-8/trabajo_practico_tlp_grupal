import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-600",
  secondary:
    "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 focus-visible:outline-indigo-600",
};

export const Button = ({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => (
  <button
    {...props}
    className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_CLASSES[variant]} ${className}`}
  />
);