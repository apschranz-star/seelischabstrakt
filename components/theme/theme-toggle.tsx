"use client";

import { motion, useReducedMotion } from "framer-motion";

import { useYinYang } from "@/components/theme/yin-yang-provider";
import { cn } from "@/lib/utils";

/**
 * The mode switch. The mark is a Yin Yang that rotates a half turn on every press,
 * which lands the opposite half on top. Nothing else moves, the surface behind it
 * does the rest through the token transition in globals.css.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { mode, toggleMode } = useYinYang();
  const reduceMotion = useReducedMotion();
  const isYin = mode === "yin";

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-pressed={isYin}
      aria-label={isYin ? "Zur Tagesansicht YANG wechseln" : "Zur Nachtansicht YIN wechseln"}
      title={isYin ? "YANG, der Tag" : "YIN, die Nacht"}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full border border-line px-2.5 py-1.5",
        "transition-colors duration-500 hover:border-ink",
        className,
      )}
    >
      <motion.svg
        viewBox="0 0 40 40"
        width="22"
        height="22"
        aria-hidden="true"
        animate={{ rotate: isYin ? 180 : 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 120, damping: 18, mass: 0.7 }
        }
      >
        <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M20 1a19 19 0 0 1 0 38 9.5 9.5 0 0 1 0-19 9.5 9.5 0 0 0 0-19z"
          fill="currentColor"
        />
        <circle cx="20" cy="10.5" r="2.6" fill="var(--jing-surface)" />
        <circle cx="20" cy="29.5" r="2.6" fill="var(--jing-ink)" />
      </motion.svg>
      <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2 sm:inline">
        {isYin ? "Yin" : "Yang"}
      </span>
    </button>
  );
}
