import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "solid" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/*
 * The button is monochrome by construction. Every surface and every line comes from
 * a token, so the Yin Yang inversion repaints it without a single rule of its own.
 */
const BASE = [
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full",
  "border font-mono uppercase leading-none tracking-[0.16em]",
  "transition-[background-color,border-color,color,opacity,transform] duration-300 ease-ritual",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
  "active:translate-y-px",
  "disabled:pointer-events-none disabled:opacity-40",
].join(" ");

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  solid: "border-transparent bg-inverse-surface text-inverse-ink hover:opacity-90",
  outline: "border-line-2 bg-transparent text-ink hover:border-ink hover:bg-surface-2",
  ghost: "border-transparent bg-transparent text-ink-2 hover:bg-surface-2 hover:text-ink",
};

// md and lg stay at or above the 44 pixel touch target, sm is for dense toolbars only.
const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "min-h-9 px-4 py-2 text-[10px]",
  md: "min-h-11 px-6 py-3 text-[11px]",
  lg: "min-h-13 px-8 py-4 text-[12px]",
};

/** Shared styling for elements that are not buttons, such as a next/link call to action. */
export function buttonClasses(
  variant: ButtonVariant = "solid",
  size: ButtonSize = "md",
  fullWidth = false,
): string {
  return cn(BASE, VARIANT_CLASSES[variant], SIZE_CLASSES[size], fullWidth && "w-full");
}

export function Button({
  variant = "solid",
  size = "md",
  fullWidth = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonClasses(variant, size, fullWidth), className)}
      {...props}
    />
  );
}
