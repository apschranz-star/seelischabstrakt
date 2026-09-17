"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { DURATION, EASE_RITUAL } from "@/lib/motion";
import { cn } from "@/lib/utils";

/*
 * One empty state for the drawer, the cart page and the checkout. The mark is
 * the Yin Yang of the toggle drawn as strokes only: the circle and the seam,
 * no fill, no dots. framer draws it once on mount, pathLength 0 to 1, in the
 * slow duration; under reduced motion the paths are simply there.
 *
 * The element tree never depends on the preference. useReducedMotion is null
 * on the server and a boolean on the client, and only the duration reads it,
 * so the server markup and the first client render carry the same nodes.
 */
export function EmptyState({
  kicker = "Leer",
  title,
  text,
  actions,
  compact = false,
  className,
}: {
  kicker?: string;
  title: string;
  text: string;
  actions: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion() === true;
  const draw = {
    duration: reduce ? 0 : DURATION.slow,
    ease: EASE_RITUAL,
  };

  return (
    <div className={cn("flex flex-col items-start", className)}>
      <motion.svg
        viewBox="0 0 40 40"
        width="48"
        height="48"
        aria-hidden="true"
        focusable="false"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        className="text-ink-3"
        initial="hidden"
        animate="drawn"
      >
        <motion.circle
          cx="20"
          cy="20"
          r="19"
          variants={{ hidden: { pathLength: 0 }, drawn: { pathLength: 1 } }}
          transition={draw}
        />
        <motion.path
          d="M20 1a19 19 0 0 1 0 38 9.5 9.5 0 0 1 0-19 9.5 9.5 0 0 0 0-19z"
          variants={{ hidden: { pathLength: 0 }, drawn: { pathLength: 1 } }}
          transition={{ ...draw, delay: reduce ? 0 : DURATION.state }}
        />
      </motion.svg>

      <p className={cn("type-kicker text-ink-3", compact ? "mt-5" : "mt-7")}>{kicker}</p>
      <h2
        className={cn(
          "mt-3 font-display leading-tight text-ink",
          compact ? "text-xl" : "text-2xl",
        )}
      >
        {title}
      </h2>
      <p className="type-body mt-3 max-w-[42ch] text-ink-2">{text}</p>
      <div className={cn("flex flex-wrap gap-3", compact ? "mt-6" : "mt-8")}>{actions}</div>
    </div>
  );
}
