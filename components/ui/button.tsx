import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "solid" | "outline" | "ghost" | "control";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/*
 * The button is monochrome by construction. Every surface and every line comes from
 * a token, so the Yin Yang inversion repaints it without a single rule of its own.
 * Focus is the global outline from globals.css, nothing is added here.
 *
 * The tracking stays at 0.16em. The wider 0.18em of the nav pushes
 * "Zahlungspflichtig bestellen" at size lg past a 26rem box on a 320px screen.
 */
const BASE = [
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full",
  "border font-mono uppercase leading-none tracking-[0.16em]",
  "transition-[background-color,border-color,color,opacity,transform]",
  "duration-[var(--duration-state)] ease-ritual",
  "active:translate-y-px",
  "disabled:pointer-events-none disabled:opacity-40",
].join(" ");

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // ink-2 is #3d3d40 under #f9f9fb text on yang and #c9c9c9 under #0d0d0d on yin,
  // both above 7:1. The text follows the surface token because that is the one
  // that inverts with the fill.
  solid: "border-transparent bg-inverse-surface text-inverse-ink hover:border-ink-2 hover:bg-ink-2 hover:text-surface",
  outline:
    "border-line-2 bg-transparent text-ink hover:border-ink hover:bg-surface-2 active:bg-surface-2",
  ghost: "border-transparent bg-transparent text-ink-2 hover:bg-surface-2 hover:text-ink",
  // The pill of the header and the close buttons of the drawers. Its border is
  // the control token, which clears 3:1 against both surfaces.
  control: "border-control bg-transparent text-ink-2 hover:border-ink hover:text-ink",
};

// md and lg stay at or above the 44 pixel touch target, sm is for dense toolbars
// only. icon is the square 44 pixel pill for a single glyph and carries no padding.
const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "min-h-9 px-4 py-2 text-[10px]",
  md: "min-h-11 px-6 py-3 text-[11px]",
  lg: "min-h-13 px-8 py-4 text-[12px]",
  icon: "min-h-11 min-w-11 p-0 text-[11px]",
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
