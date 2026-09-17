"use client";

/*
 * The handoff. A hairline that draws itself down from the centre of the page
 * as a section arrives, one section handing over to the next along the spine.
 *
 * It lives inside the section's own top padding. py-14 is 3.5rem, the line is
 * 3.5rem tall, so it ends exactly where the section's content begins and can
 * never cross into the band above. The section renders it before its heading
 * row and carries position relative.
 *
 * The scroll progress runs from the moment the section's top edge enters at
 * the bottom of the viewport to the moment it reaches 55 percent of the
 * height. scaleY follows it from 0 to 1 with the origin at the top. Under
 * reduced motion the line is simply present, scaleY 1, which framer renders
 * as transform none.
 */

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, type RefObject } from "react";

import { useReduceRef } from "@/lib/motion";

export function SectionHandoff({ target }: { target: RefObject<HTMLElement | null> }) {
  const reduce = useReduceRef();
  const reduceNow = useReducedMotion() === true;
  const { scrollYProgress: progress } = useScroll({
    target,
    offset: ["start end", "start 0.55"],
  });
  const scaleY = useTransform(progress, (v) => (reduce.current ? 1 : v));

  // The preference arrives in an effect, after the first render. The derived
  // value only recomputes when progress moves, so a reduced-motion visitor who
  // has not scrolled yet would keep the drawn-to-zero line. Set it once here;
  // every later recomputation lands on 1 anyway.
  useEffect(() => {
    if (reduceNow) scaleY.set(1);
  }, [reduceNow, scaleY]);

  return (
    <motion.span
      aria-hidden="true"
      className="jing-handoff pointer-events-none absolute left-1/2 top-0 h-14 w-px"
      style={{ scaleY }}
    />
  );
}
