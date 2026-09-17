"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { DISTANCE, DURATION, EASE_RITUAL, STAGGER } from "@/lib/motion";

export type RevealFrom = "left" | "right" | "up" | "none";

/** Callers space their siblings in multiples of this. */
export { STAGGER };

/**
 * Scroll choreography. Sections and cards glide in from the side they belong to,
 * Yang from the left, Yin from the right.
 *
 * Three things this has to survive, and a plain whileInView does not:
 *
 * 1. An anchor jump. Clicking "Yin" in the header moves the viewport past whole
 *    sections. An IntersectionObserver never sees them, so they would stay at
 *    opacity zero for the rest of the visit. Anything already at or above the
 *    fold is therefore revealed on sight, and a scroll listener catches the rest.
 * 2. prefers-reduced-motion, where nothing moves and nothing fades. This must
 *    never change the element tree: useReducedMotion returns null on the server
 *    and true on a reduced-motion client, so branching on it here would make the
 *    first client render structurally different from the server markup. React
 *    hydrates the existing node and keeps the server's inline opacity:0, and a
 *    plain element has no motion component left to clear it, so the page would
 *    stay blank. The preference therefore only decides whether the element is
 *    shown at once and with what duration.
 * 3. No JavaScript, handled by the noscript rule in the root layout, and a
 *    hydration that never arrives, handled by the fallback timer there.
 */
function useRevealed(enabled: boolean, immediate: boolean) {
  const node = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  // A callback ref keeps the type simple: motion renders div, section, li or
  // article here, and every one of them is an HTMLElement.
  const setRef = useCallback((element: HTMLElement | null) => {
    node.current = element;
  }, []);

  useEffect(() => {
    // Both immediate paths resolve in the next frame. That keeps the state
    // change out of the effect body itself, and one frame at the hidden
    // starting value is what the animated path shows anyway.
    if (!enabled || immediate) {
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }
    const element = node.current;
    if (!element) return;

    const isWithinReach = () => element.getBoundingClientRect().top < window.innerHeight * 0.92;

    if (isWithinReach()) {
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    observer.observe(element);

    // A jump can skip the element entirely, so the next scroll settles it.
    const onScroll = () => {
      if (isWithinReach()) {
        setShown(true);
        observer.disconnect();
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled, immediate]);

  return { setRef, shown };
}

export function Reveal({
  children,
  from = "up",
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  from?: RevealFrom;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  // null on the server, boolean on the client. Read as false for the first
  // render so server and client agree, then as a request to skip the motion.
  const reduce = useReducedMotion() === true;
  const enabled = from !== "none";
  const { setRef, shown } = useRevealed(enabled, reduce);
  const MotionTag = motion[as];

  // One reveal system. A glide of DISTANCE.glide from the element's own side,
  // a lift of 24 px when it comes from below, DISTANCE.lift otherwise, and a
  // scale a hair under one so the element settles rather than slides.
  const hidden = {
    opacity: 0,
    x: from === "left" ? -DISTANCE.glide : from === "right" ? DISTANCE.glide : 0,
    y: from === "up" ? 24 : DISTANCE.lift,
    scale: 0.985,
  };

  const variants: Variants = {
    hidden,
    shown: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      // A reduced-motion visitor reaches the same end state without the travel.
      transition: reduce
        ? { duration: 0 }
        : { duration: DURATION.slow, delay, ease: EASE_RITUAL },
    },
  };

  if (!enabled) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <MotionTag
      ref={setRef}
      data-reveal=""
      className={className}
      variants={variants}
      initial="hidden"
      animate={shown ? "shown" : "hidden"}
    >
      {children}
    </MotionTag>
  );
}
