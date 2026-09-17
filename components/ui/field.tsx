import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

/*
 * One field for the checkout and the access gate. The label answers focus by
 * turning to ink, the input draws a 2 px thread of ink from the left while it
 * has focus, and a rejected field draws the same thread in seal and keeps it
 * (see .jing-field in globals.css).
 *
 * The component owns nothing about behaviour. id, name, aria-describedby and
 * aria-invalid come from the caller exactly as before, so the ids the error
 * paragraphs carry and the ids the inputs describe stay what they were.
 */

export const FIELD_INPUT = cn(
  "jing-field mt-1.5 w-full rounded-[2px] border border-control bg-surface px-3 py-2.5",
  "font-sans text-[14px] text-ink placeholder:text-ink-3",
  "hover:border-ink-2 focus-visible:border-ink",
);

export const FIELD_LABEL = cn(
  "type-label text-ink-3 transition-colors duration-[var(--duration-state)] ease-ritual",
  "group-focus-within:text-ink",
);

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  /** The visible label. Pass the required marker inside it. */
  label: ReactNode;
  /** A hint under the input. Carries hintId so the input can describe itself with it. */
  hint?: ReactNode;
  hintId?: string;
  /** The error under the hint. Carries errorId, which the input already describes. */
  error?: ReactNode;
  errorId?: string;
  /** Wraps the input in a row, for a button beside it. */
  trailing?: ReactNode;
  className?: string;
  inputClassName?: string;
}

export function Field({
  id,
  label,
  hint,
  hintId,
  error,
  errorId,
  trailing,
  className,
  inputClassName,
  ...input
}: FieldProps) {
  return (
    <div className={cn("group scroll-mt-28", className)}>
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </label>
      {trailing ? (
        <div className="flex gap-2">
          <input id={id} className={cn(FIELD_INPUT, inputClassName)} {...input} />
          {trailing}
        </div>
      ) : (
        <input id={id} className={cn(FIELD_INPUT, inputClassName)} {...input} />
      )}
      {hint ? (
        <p id={hintId} className="mt-1 text-[11px] leading-snug text-ink-3">
          {hint}
        </p>
      ) : null}
      {error ? (
        // Keyed on the message, so a changed message rises again.
        <p
          key={typeof error === "string" ? error : undefined}
          id={errorId}
          className="jing-rise mt-1 text-[11px] leading-snug text-seal"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
