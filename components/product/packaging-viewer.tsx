"use client";

import {
  useCallback,
  useId,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";

import type { Product } from "@/config/products";
import { useReduceRef } from "@/lib/motion";
import { useT, type Text } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The packaging viewer draws every product from its `vessel` data alone, with SVG
 * and CSS. There are no product photographs in this project, so the silhouette, the
 * finish and the debossed type have to carry the whole object.
 *
 * One studio, ten objects. Every vessel is lit by the same key light from the upper
 * left, stands on the same floor line and casts the same kind of contact shadow.
 * The finish decides how the surface answers the light, and the amplitude of the
 * shading follows the luminance of the body: a white pack falls off gently toward
 * its edges and reads as pearl, a black pack is edged with rim light so it
 * separates from the night. Everything is gradients, there is no filter and no
 * blur anywhere in here, so ten cards on a grid stay cheap.
 *
 * The literal colours in here all come from `product.vessel`. They are product data,
 * not theme, which is why they may appear next to the design tokens. Everything that
 * belongs to the surface around the object, the stage and the shadow included, goes
 * through the tokens instead, so the Yin Yang inversion keeps working.
 */

type VesselShape = Product["vessel"]["shape"];
type VesselFinish = Product["vessel"]["finish"];

export type ViewerVariant = "page" | "card" | "thumb";

/** The key light, as a fraction of the object's bounding box. */
const LIGHT = { x: 0.32, y: 0.18 };

const KEY_STEP = 3.25;

/**
 * Per variant: the outer clamp of the tilt in degrees, how far the sheen travels
 * in user units, where the floor line sits as a fraction of the stage height and
 * the aspect ratio of the stage the viewBox describes.
 */
const TUNING: Record<
  ViewerVariant,
  { tilt: number; sheen: number; floor: number; aspect: number }
> = {
  page: { tilt: 13, sheen: 14, floor: 0.78, aspect: 0.8 },
  card: { tilt: 7, sheen: 8, floor: 0.62, aspect: 1 },
  thumb: { tilt: 0, sheen: 0, floor: 0.78, aspect: 0.8 },
};

/** Spoken names of the silhouettes and finishes, for the image label only. */
const SHAPE_LABEL: Record<VesselShape, Text> = {
  bottle: { de: "Flakon", en: "Bottle" },
  compact: { de: "Dose", en: "Compact" },
  jar: { de: "Tiegel", en: "Jar" },
  tube: { de: "Tube", en: "Tube" },
  column: { de: "Säule", en: "Column" },
};

const FINISH_LABEL: Record<VesselFinish, Text> = {
  matte: { de: "matt", en: "matte" },
  "soft-touch": { de: "soft touch", en: "soft touch" },
  ceramic: { de: "Keramik", en: "ceramic" },
  glass: { de: "Glas", en: "glass" },
};

type Stops = [number, number, number, number, number];

/**
 * How the body of revolution falls off toward its edges, per finish, for a light
 * body. The core sits under the key light and the far edge turns away from it.
 */
const LIGHT_BODY_STOPS: Record<VesselFinish, Stops> = {
  matte: [-0.16, -0.05, 0.02, -0.08, -0.2],
  "soft-touch": [-0.12, -0.04, 0, -0.06, -0.15],
  ceramic: [-0.14, -0.03, 0.05, -0.07, -0.18],
  glass: [-0.3, -0.06, 0.1, -0.12, -0.34],
};

/** For a dark body the outer stops go positive: rim light instead of shadow. */
const DARK_BODY_STOPS: Record<VesselFinish, Stops> = {
  matte: [0.16, 0.04, 0, 0.02, 0.1],
  "soft-touch": [0.1, 0.02, 0, 0.01, 0.06],
  ceramic: [0.22, 0.06, 0.03, 0.04, 0.14],
  glass: [0.3, 0.08, 0.06, 0.05, 0.2],
};

/** Stop offsets across the body, with the core under the key light. */
const STOP_OFFSETS = [0, 0.12, 0.42, 0.8, 1] as const;

/** How much of the body the floor gives back, per finish. */
const REFLECTION: Record<VesselFinish, number> = {
  matte: 0.14,
  "soft-touch": 0.06,
  ceramic: 0.22,
  glass: 0.22,
};

/* ------------------------------------------------------------------- colours */

function parseHex(hex: string): [number, number, number] {
  const clean = hex.trim().replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;
  const value = Number.parseInt(full.slice(0, 6), 16);
  if (Number.isNaN(value)) return [128, 128, 128];
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

/**
 * Mix a product colour towards white for a positive amount and towards black for a
 * negative one. Shading is derived from the pack colour so a black vessel never gets
 * a grey wash that does not belong to it.
 */
function shade(hex: string, amount: number): string {
  const [r, g, b] = parseHex(hex);
  const target = amount >= 0 ? 255 : 0;
  const ratio = Math.min(1, Math.abs(amount));
  const mix = (channel: number) => Math.round(channel + (target - channel) * ratio);
  return `rgb(${mix(r)} ${mix(g)} ${mix(b)})`;
}

/** Relative luminance of a colour, 0 for black and 1 for white. */
function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map((channel) => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** The five shading stops for a finish, scaled by the amplitude of the body's tone. */
function bodyStops(finish: VesselFinish, lum: number, amplitude = 1): Stops {
  const table = lum > 0.5 ? LIGHT_BODY_STOPS : DARK_BODY_STOPS;
  return table[finish].map((stop) => stop * amplitude) as Stops;
}

/* ------------------------------------------------------------------ geometry */

interface Geometry {
  body: string;
  cap: string;
  /** Hairline where the cap meets the body. */
  seam: { x1: number; x2: number; y: number };
  /** Bounding box of the whole object, drives the finish layers. */
  box: { x: number; y: number; width: number; height: number };
  /** First baseline of the debossed block plus the type metrics for this silhouette. */
  label: { x: number; y: number; width: number; size: number; line: number };
  stamp: { x: number; y: number };
  /** Contact ellipse on the ground. Its cy is the floor line of this silhouette. */
  foot: { cx: number; cy: number; rx: number };
  /** Crimped seal, tubes only. */
  crimp?: { x: number; y: number; width: number; height: number };
}

const GEOMETRY: Record<VesselShape, Geometry> = {
  bottle: {
    body:
      "M126 132 L126 108 L194 108 L194 132 C232 146 248 168 248 198 L248 384 " +
      "C248 400 238 410 222 410 L98 410 C82 410 72 400 72 384 L72 198 C72 168 88 146 126 132 Z",
    cap: "M125 48 L195 48 C201 48 204 52 204 58 L204 112 L116 112 L116 58 C116 52 119 48 125 48 Z",
    seam: { x1: 116, x2: 204, y: 112 },
    box: { x: 72, y: 48, width: 176, height: 362 },
    label: { x: 160, y: 224, width: 132, size: 13, line: 17 },
    stamp: { x: 160, y: 388 },
    foot: { cx: 160, cy: 410, rx: 88 },
  },
  compact: {
    body: "M50 228 L270 228 L270 262 C270 282 256 294 236 294 L84 294 C64 294 50 282 50 262 Z",
    cap: "M84 144 L236 144 C256 144 270 156 270 176 L270 228 L50 228 L50 176 C50 156 64 144 84 144 Z",
    seam: { x1: 50, x2: 270, y: 228 },
    box: { x: 50, y: 144, width: 220, height: 150 },
    label: { x: 160, y: 168, width: 150, size: 12, line: 15 },
    stamp: { x: 160, y: 276 },
    foot: { cx: 160, cy: 294, rx: 112 },
  },
  jar: {
    body: "M78 162 L242 162 L242 356 C242 380 226 394 202 394 L118 394 C94 394 78 380 78 356 Z",
    cap: "M88 96 L232 96 C240 96 246 100 246 108 L246 162 L74 162 L74 108 C74 100 80 96 88 96 Z",
    seam: { x1: 74, x2: 246, y: 162 },
    box: { x: 74, y: 96, width: 172, height: 298 },
    label: { x: 160, y: 248, width: 132, size: 13, line: 17 },
    stamp: { x: 160, y: 372 },
    foot: { cx: 160, cy: 394, rx: 82 },
  },
  tube: {
    body: "M126 116 L194 116 C214 128 224 144 224 168 L224 402 L96 402 L96 168 C96 144 106 128 126 116 Z",
    cap: "M126 56 L194 56 C199 56 202 59 202 64 L202 114 L118 114 L118 64 C118 59 121 56 126 56 Z",
    seam: { x1: 118, x2: 202, y: 114 },
    box: { x: 96, y: 56, width: 128, height: 346 },
    label: { x: 160, y: 242, width: 102, size: 11, line: 15 },
    stamp: { x: 160, y: 366 },
    foot: { cx: 160, cy: 402, rx: 66 },
    crimp: { x: 96, y: 384, width: 128, height: 18 },
  },
  column: {
    body:
      "M120 92 L200 92 C209 92 216 96 216 104 L216 388 C216 402 208 410 196 410 " +
      "L124 410 C112 410 104 402 104 388 L104 104 C104 96 111 92 120 92 Z",
    cap: "M117 62 L203 62 C209 62 212 66 212 72 L212 94 L108 94 L108 72 C108 66 111 62 117 62 Z",
    seam: { x1: 108, x2: 212, y: 94 },
    box: { x: 104, y: 62, width: 112, height: 348 },
    label: { x: 160, y: 248, width: 94, size: 11, line: 14 },
    stamp: { x: 160, y: 380 },
    foot: { cx: 160, cy: 410, rx: 58 },
  },
};

/**
 * The envelope all ten objects share. The silhouettes are drawn to one scale, a
 * compact really is smaller than a flacon, and the stage keeps that scale: its
 * height is what the tallest object needs with 8 percent of air above it and 22
 * percent of floor below for shadow and reflection, its width what the widest
 * object needs with 10 percent on either side. Every object is then framed so its
 * own foot sits on the floor line of the variant.
 */
const TALLEST = Math.max(...Object.values(GEOMETRY).map((geo) => geo.box.height));
const WIDEST = Math.max(...Object.values(GEOMETRY).map((geo) => geo.box.width));

interface Stage {
  x: number;
  y: number;
  width: number;
  height: number;
  /** The floor line in user units, where every foot stands. */
  floorY: number;
}

function stageFor(variant: ViewerVariant, geo: Geometry): Stage {
  const { floor, aspect } = TUNING[variant];
  const height = Math.max(
    (TALLEST * 1.08) / floor,
    (TALLEST * 0.22) / (1 - floor),
    (WIDEST * 1.2) / aspect,
  );
  const width = height * aspect;
  const floorY = geo.foot.cy;
  return {
    x: geo.foot.cx - width / 2,
    y: floorY - floor * height,
    width,
    height,
    floorY,
  };
}

/**
 * Speckle field for the ceramic glaze. Generated once at module scope from a fixed
 * seed, so server and client draw exactly the same dots.
 */
const SPECKLES = (() => {
  let seed = 20240117;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: 32 }, (_unused, index) => ({
    key: `speckle-${index}`,
    x: next(),
    y: next(),
    r: 0.55 + next() * 1.5,
    opacity: 0.06 + next() * 0.16,
    light: next() > 0.42,
  }));
})();

/* ---------------------------------------------------------------------- type */

/** Greedy wrap, so a long product name stays inside the printable area. */
function wrapLabel(value: string, maxChars: number, maxLines: number): string[] {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];

  for (const word of words) {
    const current = lines[lines.length - 1];
    if (current !== undefined && `${current} ${word}`.length <= maxChars) {
      lines[lines.length - 1] = `${current} ${word}`;
    } else if (lines.length < maxLines) {
      lines.push(word);
    } else {
      const last = lines[maxLines - 1];
      lines[maxLines - 1] = last === undefined ? word : `${last} ${word}`;
    }
  }

  return lines;
}

interface DebossedLineProps {
  label: string;
  x: number;
  y: number;
  maxWidth: number;
  fontSize: number;
  family: string;
  spacing?: number;
  print: string;
  light: string;
  dark: string;
  /** On a light body the dark copy sits above, which is where the pressed edge shades. */
  lightBody: boolean;
  opacity?: number;
}

/**
 * Three passes of the same word. A light copy and a dark copy, each 0.6 units off
 * the baseline on opposite sides, the print colour on top. That is what reads as
 * pressed into the surface. textLength keeps every line inside the vessel without
 * measuring the font.
 */
function DebossedLine({
  label,
  x,
  y,
  maxWidth,
  fontSize,
  family,
  spacing = 0,
  print,
  light,
  dark,
  lightBody,
  opacity = 0.92,
}: DebossedLineProps) {
  if (label.length === 0) return null;

  const estimated = label.length * (fontSize * 0.6 + spacing);
  const length = Math.min(maxWidth, estimated);

  const shared = {
    x,
    textAnchor: "middle" as const,
    fontSize,
    textLength: length,
    lengthAdjust: "spacingAndGlyphs" as const,
    className: family,
  };

  const above = lightBody ? { fill: dark, opacity: 0.4 } : { fill: light, opacity: 0.32 };
  const below = lightBody ? { fill: light, opacity: 0.32 } : { fill: dark, opacity: 0.4 };

  return (
    <g>
      <text {...shared} y={y - 0.6} fill={above.fill} opacity={above.opacity}>
        {label}
      </text>
      <text {...shared} y={y + 0.6} fill={below.fill} opacity={below.opacity}>
        {label}
      </text>
      <text {...shared} y={y} fill={print} opacity={opacity}>
        {label}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ the view */

/** Sum of two motion values, for the pointer tilt and the scroll tilt. */
function useSum(a: MotionValue<number>, b: MotionValue<number>): MotionValue<number> {
  return useTransform([a, b], ([first, second]: number[]) => first + second);
}

export function PackagingViewer({
  product,
  className,
  variant: variantProp,
  compact = false,
  lifted = false,
}: {
  product: Product;
  className?: string;
  /**
   * page: the product page, tilt to 13 degrees, the hint below, a tab stop.
   * card: the square stage in a product card, tilt to 7 degrees, scroll drive.
   * thumb: 64 px in the cart drawer, silhouette, finish and shadow only.
   */
  variant?: ViewerVariant;
  /** @deprecated Use variant="card". Kept for the cart and checkout rows. */
  compact?: boolean;
  /**
   * Lifts the object 6 px off the floor and narrows its shadow. The card passes
   * its own hover state; it starts false on server and client alike and changes
   * only through pointer events after mount.
   */
  lifted?: boolean;
}) {
  const variant: ViewerVariant = variantProp ?? (compact ? "card" : "page");
  const tuning = TUNING[variant];
  const t = useT();
  const MAX_TILT = tuning.tilt;
  // useTransform maps over a range. A thumb never tilts, so its range would be
  // empty; a range of one degree keeps the maths finite while the value stays 0.
  const tiltRange = Math.max(MAX_TILT, 1);

  const reduceMotion = useReducedMotion() ?? false;
  const reduce = useReduceRef();
  const frameRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, "");

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateXPointer = useSpring(tiltX, { stiffness: 150, damping: 17, mass: 0.7 });
  const rotateY = useSpring(tiltY, { stiffness: 150, damping: 17, mass: 0.7 });

  // Scroll response, so a visitor on touch gets the depth the pointer gives the
  // desktop. In a card the object leans with its progress through the viewport,
  // 3 degrees toward the visitor as it enters, 3 away as it leaves, and the
  // sheen travels 10 units with it. On the page the object leans back while
  // scrolling down, by up to 4 degrees on the smoothed scroll velocity, and
  // settles at rest. Both read the preference through the ref, so the server,
  // the first client render and a reduced-motion visitor all get identity.
  const { scrollYProgress, scrollY } = useScroll(
    variant === "card"
      ? { target: frameRef, offset: ["start end", "end start"] }
      : undefined,
  );
  const progressTilt = useTransform(scrollYProgress, (v) =>
    variant === "card" && !reduce.current ? 3 - 6 * v : 0,
  );
  const progressSheen = useTransform(scrollYProgress, (v) =>
    variant === "card" && !reduce.current ? -10 + 20 * v : 0,
  );
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { stiffness: 110, damping: 20, mass: 0.8 });
  const lean = useTransform(smoothVelocity, (v) =>
    variant === "page" && !reduce.current ? Math.max(-4, Math.min(4, -v / 300)) : 0,
  );
  const scrollTiltX = variant === "page" ? lean : progressTilt;

  // The combined tilt feeds the object and, from the same value, the shadow and
  // the sheen, so light and ground keep following whatever moves the object.
  const rotateXSum = useSum(rotateXPointer, scrollTiltX);
  const rotateX = useTransform(rotateXSum, (v) => Math.max(-tiltRange, Math.min(tiltRange, v)));

  // The shadow lags behind the object and travels the other way, which is what makes
  // the tilt read as a real object standing on a surface. Values in user units.
  const shadowX = useTransform(rotateY, [-tiltRange, tiltRange], [24, -24]);
  const shadowY = useTransform(rotateX, [-tiltRange, tiltRange], [-8, 8]);
  const shadowOpacity = useTransform(rotateX, [-tiltRange, 0, tiltRange], [0.6, 1, 0.8]);
  const sheenX = useTransform(rotateY, [-tiltRange, tiltRange], [tuning.sheen, -tuning.sheen]);
  const sheenTilt = useTransform(
    rotateX,
    [-tiltRange, tiltRange],
    [-tuning.sheen / 2, tuning.sheen / 2],
  );
  const sheenY = useSum(sheenTilt, progressSheen);

  const setTilt = useCallback(
    (nextX: number, nextY: number) => {
      const clamp = (value: number) => Math.max(-MAX_TILT, Math.min(MAX_TILT, value));
      tiltX.set(clamp(nextX));
      tiltY.set(clamp(nextY));
    },
    [MAX_TILT, tiltX, tiltY],
  );

  const rest = useCallback(() => {
    tiltX.set(0);
    tiltY.set(0);
  }, [tiltX, tiltY]);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (reduceMotion || MAX_TILT === 0) return;
      const frame = frameRef.current;
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
      // Pointing pushes the surface away at that point.
      setTilt(-offsetY * 2 * MAX_TILT, offsetX * 2 * MAX_TILT);
    },
    [MAX_TILT, reduceMotion, setTilt],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (reduceMotion || MAX_TILT === 0) return;
      const current = { x: tiltX.get(), y: tiltY.get() };

      switch (event.key) {
        case "ArrowUp":
          setTilt(current.x + KEY_STEP, current.y);
          break;
        case "ArrowDown":
          setTilt(current.x - KEY_STEP, current.y);
          break;
        case "ArrowRight":
          setTilt(current.x, current.y + KEY_STEP);
          break;
        case "ArrowLeft":
          setTilt(current.x, current.y - KEY_STEP);
          break;
        case "Home":
          rest();
          break;
        default:
          return;
      }

      event.preventDefault();
    },
    [MAX_TILT, reduceMotion, rest, setTilt, tiltX, tiltY],
  );

  const { vessel } = product;
  const geo = GEOMETRY[vessel.shape];
  const { box, label, foot } = geo;
  const crimp = geo.crimp;
  const stage = stageFor(variant, geo);
  const viewBox = `${stage.x} ${stage.y} ${stage.width} ${stage.height}`;

  const lum = luminance(vessel.body);
  const lightBody = lum > 0.5;
  const shading = bodyStops(vessel.finish, lum);
  const capShading = bodyStops(vessel.finish, luminance(vessel.cap), 0.8);
  const bodyLight = shade(vessel.body, 0.55);
  const bodyDark = shade(vessel.body, -0.55);
  const nameLines = wrapLabel(product.name, vessel.shape === "compact" ? 20 : 16, 3);

  const isThumb = variant === "thumb";
  const isPage = variant === "page";

  const bodyClip = `${uid}-clip`;
  const bodyFill = `${uid}-body`;
  const capFill = `${uid}-cap`;
  const softLight = `${uid}-soft`;
  const specular = `${uid}-spec`;
  const glassLight = `${uid}-glass`;
  const shadowFill = `${uid}-shadow`;
  const reflectionFade = `${uid}-fade`;
  const reflectionMask = `${uid}-mask`;
  const reflectionClip = `${uid}-rclip`;

  const reflectionDepth = box.height * 0.18;
  const reflectionAmount = REFLECTION[vessel.finish];

  // Duration is the only thing the preference changes. The tree, the variants and
  // the resting values are the same on the server, on the client and under it.
  const liftTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 24, mass: 0.8 };
  const liftState = lifted ? "lift" : "rest";

  const svgProps = {
    viewBox,
    preserveAspectRatio: "xMidYMid meet",
    "aria-hidden": true as const,
    focusable: "false" as const,
  };

  return (
    <div
      className={cn(isPage ? "flex h-full w-full flex-col" : "relative w-full", className)}
      style={isPage ? undefined : { aspectRatio: `${stage.width} / ${stage.height}` }}
    >
      <div
        ref={frameRef}
        role="img"
        // A tab stop only where the tilt can actually be used. In a card the
        // whole tile is already a link, and in the cart drawer this sits inside
        // a focus trap, so an extra stop there is noise with nothing behind it.
        tabIndex={isPage ? 0 : -1}
        aria-label={
          isPage
            ? t({
                de: `${product.code}, ${product.name}. ${SHAPE_LABEL[vessel.shape].de} mit Oberfläche ${FINISH_LABEL[vessel.finish].de}. Mit den Pfeiltasten neigen.`,
                en: `${product.code}, ${product.name}. ${SHAPE_LABEL[vessel.shape].en} with a ${FINISH_LABEL[vessel.finish].en} finish. Tilt with the arrow keys.`,
              })
            : t({
                de: `${product.code}, ${product.name}. ${SHAPE_LABEL[vessel.shape].de} mit Oberfläche ${FINISH_LABEL[vessel.finish].de}.`,
                en: `${product.code}, ${product.name}. ${SHAPE_LABEL[vessel.shape].en} with a ${FINISH_LABEL[vessel.finish].en} finish.`,
              })
        }
        onPointerMove={handlePointerMove}
        onPointerLeave={rest}
        onPointerCancel={rest}
        onBlur={rest}
        onKeyDown={handleKeyDown}
        className={cn(
          "rounded-[2px] outline-none",
          isPage ? "relative min-h-0 w-full flex-1" : "absolute inset-0",
        )}
        style={{ perspective: 1200, touchAction: "pan-y" }}
      >
        {/* The ground. Shadow and reflection stay flat on the floor while the
            object above tilts; the same viewBox keeps the two drawings aligned. */}
        <svg {...svgProps} className="pointer-events-none absolute inset-0 block h-full w-full">
          <defs>
            {/* Cylindrical shading. Every silhouette is a body of revolution. */}
            <linearGradient id={bodyFill} x1="0" y1="0" x2="1" y2="0">
              {STOP_OFFSETS.map((offset, index) => (
                <stop
                  key={offset}
                  offset={offset}
                  stopColor={shade(vessel.body, shading[index])}
                />
              ))}
            </linearGradient>

            {/* The contact shadow, in the shadow token so it deepens on the night. */}
            <radialGradient id={shadowFill} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" style={{ stopColor: "var(--jing-shadow)" }} stopOpacity="1" />
              <stop
                offset="0.55"
                style={{ stopColor: "var(--jing-shadow)" }}
                stopOpacity="0.45"
              />
              <stop offset="1" style={{ stopColor: "var(--jing-shadow)" }} stopOpacity="0" />
            </radialGradient>

            {isThumb ? null : (
              <>
                <linearGradient id={reflectionFade} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity={reflectionAmount} />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <mask id={reflectionMask} maskUnits="userSpaceOnUse">
                  <rect
                    x={stage.x}
                    y={stage.floorY}
                    width={stage.width}
                    height={reflectionDepth}
                    fill={`url(#${reflectionFade})`}
                  />
                </mask>
                <clipPath id={reflectionClip}>
                  <rect
                    x={stage.x}
                    y={stage.floorY}
                    width={stage.width}
                    height={reflectionDepth}
                  />
                </clipPath>
              </>
            )}
          </defs>

          <motion.g
            variants={{
              rest: { scaleX: 1, opacity: 1 },
              lift: { scaleX: 0.94, opacity: 0.78 },
            }}
            initial="rest"
            animate={liftState}
            transition={liftTransition}
          >
            <motion.g style={{ x: shadowX, y: shadowY, opacity: shadowOpacity }}>
              <ellipse
                cx={foot.cx}
                cy={foot.cy + 2}
                rx={foot.rx * 1.15}
                ry={14}
                fill={`url(#${shadowFill})`}
                opacity="0.45"
              />
              <ellipse
                cx={foot.cx}
                cy={foot.cy + 2}
                rx={foot.rx * 0.62}
                ry={6}
                fill={`url(#${shadowFill})`}
              />
            </motion.g>

            {/* The floor gives a little of the body back, mirrored and pressed
                flat, fading out within the first fifth of the object's height. */}
            {isThumb ? null : (
              <g clipPath={`url(#${reflectionClip})`} mask={`url(#${reflectionMask})`}>
                <g transform={`matrix(1 0 0 -0.32 0 ${2 * foot.cy})`}>
                  <path d={geo.body} fill={`url(#${bodyFill})`} />
                </g>
              </g>
            )}
          </motion.g>
        </svg>

        {/* The object. Lifted six pixels when the pointer arrives, tilted by the
            pointer and by the scroll, with the light staying where the light is. */}
        <motion.div
          data-vessel=""
          className="absolute inset-0"
          variants={{ rest: { y: 0 }, lift: { y: -6 } }}
          initial="rest"
          animate={liftState}
          transition={liftTransition}
        >
          <motion.div
            className="absolute inset-0"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            <svg {...svgProps} className="block h-full w-full">
              <defs>
                <clipPath id={bodyClip}>
                  <path d={geo.body} />
                  <path d={geo.cap} />
                </clipPath>

                <linearGradient id={capFill} x1="0" y1="0" x2="1" y2="0">
                  {STOP_OFFSETS.map((offset, index) => (
                    <stop
                      key={offset}
                      offset={offset}
                      stopColor={shade(vessel.cap, capShading[index])}
                    />
                  ))}
                </linearGradient>

                {/* The key light as it lands on a diffuse surface. */}
                <radialGradient id={softLight} cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0" stopColor={shade(vessel.body, 0.62)} stopOpacity="0.9" />
                  <stop offset="0.5" stopColor={shade(vessel.body, 0.4)} stopOpacity="0.4" />
                  <stop offset="1" stopColor={shade(vessel.body, 0.3)} stopOpacity="0" />
                </radialGradient>

                {/* The key light as a hard reflection in a glaze. */}
                <radialGradient id={specular} cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0" stopColor={shade(vessel.body, 0.9)} stopOpacity="0.85" />
                  <stop offset="0.55" stopColor={shade(vessel.body, 0.9)} stopOpacity="0.35" />
                  <stop offset="1" stopColor={shade(vessel.body, 0.9)} stopOpacity="0" />
                </radialGradient>

                <linearGradient id={glassLight} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={shade(vessel.body, 0.85)} stopOpacity="0" />
                  <stop offset="0.14" stopColor={shade(vessel.body, 0.85)} stopOpacity="0.95" />
                  <stop offset="0.72" stopColor={shade(vessel.body, 0.7)} stopOpacity="0.75" />
                  <stop offset="1" stopColor={shade(vessel.body, 0.7)} stopOpacity="0" />
                </linearGradient>
              </defs>

              <path d={geo.body} fill={`url(#${bodyFill})`} />
              <path d={geo.cap} fill={`url(#${capFill})`} />

              {crimp ? (
                <g>
                  <rect
                    x={crimp.x}
                    y={crimp.y}
                    width={crimp.width}
                    height={crimp.height}
                    fill={shade(vessel.body, -0.3)}
                  />
                  {[0.3, 0.5, 0.7].map((step) => (
                    <line
                      key={`crimp-${step}`}
                      x1={crimp.x + 6}
                      x2={crimp.x + crimp.width - 6}
                      y1={crimp.y + crimp.height * step}
                      y2={crimp.y + crimp.height * step}
                      stroke={shade(vessel.body, -0.55)}
                      strokeWidth="1"
                      opacity="0.6"
                    />
                  ))}
                </g>
              ) : null}

              {/* Finish. The light a surface returns is the only thing that separates a
                  matte pack from a glass one. The clip stays on the still parent, because
                  a transform on the clipped element drags its clipping path along and
                  would let the light slide over the edge of the vessel. */}
              <g clipPath={`url(#${bodyClip})`}>
                <motion.g style={{ x: sheenX, y: sheenY }}>
                  {vessel.finish === "matte" ? (
                    <ellipse
                      cx={box.x + box.width * LIGHT.x}
                      cy={box.y + box.height * (LIGHT.y + 0.14)}
                      rx={box.width * 0.62}
                      ry={box.height * 0.4}
                      fill={`url(#${softLight})`}
                      opacity="0.22"
                    />
                  ) : null}

                  {vessel.finish === "soft-touch" ? (
                    <g fill="none" stroke={bodyLight}>
                      <path d={geo.body} strokeWidth="6" opacity="0.08" />
                      <path d={geo.body} strokeWidth="2" opacity="0.12" />
                    </g>
                  ) : null}

                  {vessel.finish === "ceramic" ? (
                    <>
                      <ellipse
                        cx={box.x + box.width * LIGHT.x}
                        cy={box.y + box.height * LIGHT.y}
                        rx={box.width * 0.09}
                        ry={box.height * 0.06}
                        fill={`url(#${specular})`}
                      />
                      <line
                        x1={geo.seam.x1 + 3}
                        x2={geo.seam.x2 - 3}
                        y1={geo.seam.y + 3}
                        y2={geo.seam.y + 3}
                        stroke={bodyLight}
                        strokeWidth="1.4"
                        opacity="0.35"
                      />
                      {isThumb ? null : (
                        <g>
                          {SPECKLES.map((speckle) => (
                            <circle
                              key={speckle.key}
                              cx={box.x + speckle.x * box.width}
                              cy={box.y + speckle.y * box.height}
                              r={speckle.r}
                              fill={
                                speckle.light
                                  ? shade(vessel.body, 0.7)
                                  : shade(vessel.body, -0.6)
                              }
                              opacity={speckle.opacity}
                            />
                          ))}
                        </g>
                      )}
                    </>
                  ) : null}

                  {vessel.finish === "glass" ? (
                    <>
                      {/* The back wall, seen through the front. */}
                      <rect
                        x={box.x + box.width * 0.22}
                        y={box.y}
                        width={box.width * 0.56}
                        height={box.height}
                        fill={shade(vessel.body, lightBody ? 0.06 : 0.12)}
                        opacity="0.5"
                      />
                      {/* The fill level, with its meniscus. */}
                      <rect
                        x={box.x}
                        y={box.y + box.height * 0.72}
                        width={box.width}
                        height={box.height * 0.28}
                        fill={shade(vessel.body, -0.1)}
                        opacity="0.35"
                      />
                      <line
                        x1={box.x}
                        x2={box.x + box.width}
                        y1={box.y + box.height * 0.72}
                        y2={box.y + box.height * 0.72}
                        stroke={bodyLight}
                        strokeWidth="1"
                        opacity="0.7"
                      />
                      {/* One specular streak and its dark companion. The companion is
                          what makes glass legible on a white pack, where a bright stripe
                          alone vanishes. */}
                      <rect
                        x={box.x + box.width * 0.15}
                        y={box.y + box.height * 0.1}
                        width={Math.max(1.5, box.width * 0.014)}
                        height={box.height * 0.78}
                        rx={1}
                        fill={shade(vessel.body, -0.5)}
                        opacity="0.5"
                      />
                      <rect
                        x={box.x + box.width * 0.19}
                        y={box.y + box.height * 0.08}
                        width={Math.max(3, box.width * 0.045)}
                        height={box.height * 0.82}
                        rx={2}
                        fill={`url(#${glassLight})`}
                        opacity="0.92"
                      />
                    </>
                  ) : null}
                </motion.g>

                {/* The wall of the glass, an inner stroke that stays put. */}
                {vessel.finish === "glass" ? (
                  <path
                    d={geo.body}
                    fill="none"
                    stroke={bodyDark}
                    strokeWidth="1.6"
                    opacity="0.6"
                  />
                ) : null}
              </g>

              {/* Seam between cap and body, and the rim light along the shoulder. */}
              <line
                x1={geo.seam.x1}
                x2={geo.seam.x2}
                y1={geo.seam.y}
                y2={geo.seam.y}
                stroke={bodyDark}
                strokeWidth="1.2"
                opacity="0.55"
              />
              <line
                x1={geo.seam.x1}
                x2={geo.seam.x2}
                y1={geo.seam.y + 1.4}
                y2={geo.seam.y + 1.4}
                stroke={bodyLight}
                strokeWidth="0.8"
                opacity="0.22"
              />

              {isThumb ? null : (
                <g clipPath={`url(#${bodyClip})`}>
                  <DebossedLine
                    label={product.code}
                    x={label.x}
                    y={label.y}
                    maxWidth={label.width * 0.8}
                    fontSize={label.size - 2}
                    family="font-mono"
                    spacing={2.4}
                    print={vessel.print}
                    light={bodyLight}
                    dark={bodyDark}
                    lightBody={lightBody}
                    opacity={0.7}
                  />

                  {nameLines.map((line, index) => (
                    <DebossedLine
                      key={`${product.id}-name-${index}`}
                      label={line}
                      x={label.x}
                      y={label.y + 22 + index * label.line}
                      maxWidth={label.width}
                      fontSize={label.size}
                      family="font-display"
                      print={vessel.print}
                      light={bodyLight}
                      dark={bodyDark}
                      lightBody={lightBody}
                    />
                  ))}

                  <DebossedLine
                    label="LOT JG-2401"
                    x={geo.stamp.x}
                    y={geo.stamp.y}
                    maxWidth={label.width * 0.78}
                    fontSize={7.5}
                    family="font-mono"
                    spacing={1.4}
                    print={vessel.print}
                    light={bodyLight}
                    dark={bodyDark}
                    lightBody={lightBody}
                    opacity={0.36}
                  />
                </g>
              )}

              {/* Outline last. Both rims are drawn: the dark one carries a pale pack on
                  the light surface, the light one keeps a black pack off the dark one. */}
              <g fill="none" strokeWidth="0.9">
                <path d={geo.body} stroke={bodyDark} opacity="0.45" />
                <path d={geo.cap} stroke={shade(vessel.cap, -0.5)} opacity="0.45" />
                <path d={geo.body} stroke={bodyLight} opacity={lightBody ? 0.26 : 0.4} />
                <path d={geo.cap} stroke={shade(vessel.cap, 0.55)} opacity={lightBody ? 0.26 : 0.4} />
              </g>
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {isPage ? (
        <p className="mt-3 shrink-0 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 motion-reduce:hidden">
          {t({
            de: "Mit dem Zeiger oder den Pfeiltasten neigen",
            en: "Tilt with the pointer or the arrow keys",
          })}
        </p>
      ) : null}
    </div>
  );
}
