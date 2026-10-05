import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = ({ label, className = "", ...props }: InputProps) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
    </span>
    <input
      {...props}
      className={`w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${className}`}
    />
  </label>
);