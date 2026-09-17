"use client";

/*
 * The one timing module.
 *
 * Every duration and easing in JING comes from here or from the matching custom
 * properties in app/globals.css (--duration-* and --ease-*). The two lists carry
 * the same numbers on purpose: CSS transitions read the properties, framer reads
 * this file, and the eye never has to reconcile two clocks.
 *
 * The anchor of the scale is ritual = 620 ms, the existing mode switch on body.
 * Everything faster is a fraction of it, chosen so that a state change (180 ms)
 * is felt but not watched, a panel (360 ms) opens in the time it takes the eye
 * to travel to it, and a slow reveal (900 ms) still ends before the visitor
 * starts to wonder.
 *
 *   state   180 ms  hover, pressed, checked, hairline colour
 *   swap    240 ms  content replacing content in place, exits
 *   swift   280 ms  a grid or hero changing after a switch
 *   panel   360 ms  drawers, dialogs, sheets entering
 *   ritual  620 ms  the mode switch, progress bars, the long crossfade
 *   slow    900 ms  scroll reveals that should feel weighty
 *
 * Reduced motion never changes what renders, only these numbers. Duration 0
 * and a transform that stays at its resting value keep every state reachable
 * with the same element tree on the server, in the first client render and
 * under the preference.
 */

import {
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, type RefObject } from "react";

/** The house easing. Fast out of the gate, long settle. */
export const EASE_RITUAL = [0.22, 1, 0.36, 1] as const;

/** Exits leave without a flourish. */
export const EASE_EXIT = [0.4, 0, 0.6, 1] as const;

/** Durations in seconds, for framer. The CSS twins are in milliseconds. */
export const DURATION = {
  state: 0.18,
  swap: 0.24,
  swift: 0.28,
  panel: 0.36,
  ritual: 0.62,
  slow: 0.9,
} as const;

/** The one stagger between siblings, in seconds. */
export const STAGGER = 0.06;

/** Travel distances in pixels. */
export const DISTANCE = {
  /** A card or section gliding in from its side. */
  glide: 32,
  /** A hover lift, a row settling. */
  lift: 16,
  /** The parallax lag of the giant words behind the hero. */
  depth: 56,
} as const;

/** A panel entering with the house easing, or exiting with the exit easing. */
export function panelTransition(reduce: boolean, exiting = false) {
  return {
    duration: reduce ? 0 : exiting ? DURATION.swap : DURATION.panel,
    ease: exiting ? EASE_EXIT : EASE_RITUAL,
  };
}

/**
 * The motion preference as a ref. Read it inside per-frame transform functions
 * that must not cause a re-render. The value is assigned in an effect, never
 * during render, so the server and the first client render agree on false.
 */
export function useReduceRef(): RefObject<boolean> {
  const reduce = useReducedMotion() === true;
  const ref = useRef(false);
  useEffect(() => {
    ref.current = reduce;
  }, [reduce]);
  return ref;
}

/**
 * Maps a scroll progress of 0..1 to a value from..to. Under reduced motion the
 * value stays at from. Always returns a MotionValue, so the element carrying it
 * renders the same style attribute on the server, in the first client render
 * and under the preference.
 */
export function useScrollDrive(
  progress: MotionValue<number>,
  from: number,
  to: number,
  reduce: RefObject<boolean>,
): MotionValue<number> {
  return useTransform(progress, (v) => (reduce.current ? from : from + (to - from) * v));
}

/**
 * Calls apply(true) once value rises above on and apply(false) once it falls
 * below off. The gap between the two keeps a header or a rule from flickering
 * around a single threshold. apply runs outside render, so the caller may set
 * state or write a data attribute in it.
 */
export function useHysteresis(
  value: MotionValue<number>,
  on: number,
  off: number,
  apply: (active: boolean) => void,
): void {
  const active = useRef(false);
  useMotionValueEvent(value, "change", (v) => {
    if (!active.current && v > on) {
      active.current = true;
      apply(true);
    } else if (active.current && v < off) {
      active.current = false;
      apply(false);
    }
  });
}
