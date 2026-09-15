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
  useSpring,
  useTransform,
} from "framer-motion";

import type { Product } from "@/config/products";
import { cn } from "@/lib/utils";

/**
 * The packaging viewer draws every product from its `vessel` data alone, with SVG
 * and CSS. There are no product photographs in this project, so the silhouette, the
 * finish and the debossed type have to carry the whole object.
 *
 * The literal colours in here all come from `product.vessel`. They are product data,
 * not theme, which is why they may appear next to the design tokens. Everything that
 * belongs to the surface around the object goes through the tokens instead, so the
 * Yin Yang inversion keeps working.
 */

type VesselShape = Product["vessel"]["shape"];
type VesselFinish = Product["vessel"]["finish"];

const VIEW_WIDTH = 320;
const VIEW_HEIGHT = 460;

/** Maximum tilt in degrees. Beyond this the flat silhouette starts to look wrong. */
const MAX_TILT = 13;
const KEY_STEP = 3.25;

const SHAPE_LABEL: Record<VesselShape, string> = {
  bottle: "Flakon",
  compact: "Dose",
  jar: "Tiegel",
  tube: "Tube",
  column: "Säule",
};

const FINISH_LABEL: Record<VesselFinish, string> = {
  matte: "matt",
  "soft-touch": "soft touch",
  ceramic: "Keramik",
  glass: "Glas",
};

/**
 * How far the body of revolution falls off towards its edges, per finish. Glass needs
 * dark edges and a lifted core, otherwise a white flacon on a white surface has no
 * body at all. Soft touch swallows the light and stays flat on purpose.
 */
const BODY_SHADING: Record<VesselFinish, [number, number, number, number, number]> = {
  matte: [-0.42, -0.12, 0, -0.2, -0.48],
  "soft-touch": [-0.5, -0.18, -0.02, -0.26, -0.56],
  ceramic: [-0.4, -0.1, 0.05, -0.18, -0.46],
  glass: [-0.62, -0.2, 0.16, -0.32, -0.68],
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
  /** Contact ellipse on the ground. */
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
 * Speckle field for the ceramic glaze. Generated once at module scope from a fixed
 * seed, so server and client draw exactly the same dots.
 */
const SPECKLES = (() => {
  let seed = 20240117;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: 48 }, (_unused, index) => ({
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
  opacity?: number;
}

/**
 * Three passes of the same word. A light copy one pixel up, a dark copy one pixel
 * down, the print colour on top. That is what reads as pressed into the surface.
 * textLength keeps every line inside the vessel without measuring the font.
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

  return (
    <g>
      <text {...shared} y={y - 1} fill={light} opacity={0.5}>
        {label}
      </text>
      <text {...shared} y={y + 1} fill={dark} opacity={0.58}>
        {label}
      </text>
      <text {...shared} y={y} fill={print} opacity={opacity}>
        {label}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ the view */

export function PackagingViewer({
  product,
  className,
  compact = false,
}: {
  product: Product;
  className?: string;
  /** Inside a card the object has to fit a fixed box and the tilt hint has no room. */
  compact?: boolean;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const frameRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, "");

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 150, damping: 17, mass: 0.7 });
  const rotateY = useSpring(tiltY, { stiffness: 150, damping: 17, mass: 0.7 });

  // The shadow lags behind the object and travels the other way, which is what makes
  // the tilt read as a real object standing on a surface.
  const shadowX = useTransform(rotateY, [-MAX_TILT, MAX_TILT], [26, -26]);
  const shadowY = useTransform(rotateX, [-MAX_TILT, MAX_TILT], [-8, 12]);
  const shadowOpacity = useTransform(rotateX, [-MAX_TILT, 0, MAX_TILT], [0.55, 1, 0.75]);
  const sheenX = useTransform(rotateY, [-MAX_TILT, MAX_TILT], [14, -14]);
  const sheenY = useTransform(rotateX, [-MAX_TILT, MAX_TILT], [-7, 7]);

  const setTilt = useCallback(
    (nextX: number, nextY: number) => {
      const clamp = (value: number) => Math.max(-MAX_TILT, Math.min(MAX_TILT, value));
      tiltX.set(clamp(nextX));
      tiltY.set(clamp(nextY));
    },
    [tiltX, tiltY],
  );

  const rest = useCallback(() => {
    tiltX.set(0);
    tiltY.set(0);
  }, [tiltX, tiltY]);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (reduceMotion) return;
      const frame = frameRef.current;
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
      // Pointing pushes the surface away at that point.
      setTilt(-offsetY * 2 * MAX_TILT, offsetX * 2 * MAX_TILT);
    },
    [reduceMotion, setTilt],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (reduceMotion) return;
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
    [reduceMotion, rest, setTilt, tiltX, tiltY],
  );

  const { vessel } = product;
  const geo = GEOMETRY[vessel.shape];
  const { box, label } = geo;
  const crimp = geo.crimp;

  const shading = BODY_SHADING[vessel.finish];
  const bodyLight = shade(vessel.body, 0.55);
  const bodyDark = shade(vessel.body, -0.55);
  const nameLines = wrapLabel(product.name, vessel.shape === "compact" ? 20 : 16, 3);

  const bodyClip = `${uid}-clip`;
  const bodyFill = `${uid}-body`;
  const capFill = `${uid}-cap`;
  const softLight = `${uid}-soft`;
  const glassLight = `${uid}-glass`;

  const shadowLeft = ((geo.foot.cx - geo.foot.rx) / VIEW_WIDTH) * 100;
  const shadowWidth = ((geo.foot.rx * 2) / VIEW_WIDTH) * 100;
  const shadowTop = ((geo.foot.cy - 12) / VIEW_HEIGHT) * 100;

  return (
    <div className={cn("flex w-full flex-col", compact && "h-full min-h-0", className)}>
      <div
        ref={frameRef}
        role="img"
        tabIndex={0}
        aria-label={`${product.code}, ${product.name}. ${SHAPE_LABEL[vessel.shape]} mit Oberfläche ${FINISH_LABEL[vessel.finish]}. Mit den Pfeiltasten neigen.`}
        onPointerMove={handlePointerMove}
        onPointerLeave={rest}
        onPointerCancel={rest}
        onBlur={rest}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative mx-auto w-full max-w-[26rem] rounded-[2rem] outline-none",
          compact && "h-full min-h-0",
          "focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-4",
        )}
        style={{ perspective: 1200, touchAction: "pan-y" }}
      >
        <div
          className={cn("relative mx-auto w-full", compact && "h-full max-h-full")}
          style={{ aspectRatio: `${VIEW_WIDTH} / ${VIEW_HEIGHT}`, maxWidth: compact ? "100%" : undefined }}
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ x: shadowX, y: shadowY, opacity: shadowOpacity }}
          >
            <div
              className="absolute rounded-[50%] bg-ink opacity-[0.13] blur-2xl"
              style={{
                left: `${shadowLeft - 6}%`,
                width: `${shadowWidth + 12}%`,
                top: `${shadowTop}%`,
                height: 38,
              }}
            />
            <div
              className="absolute rounded-[50%] blur-[6px]"
              style={{
                left: `${shadowLeft + 4}%`,
                width: `${shadowWidth - 8}%`,
                top: `${shadowTop + 1.6}%`,
                height: 16,
                background: bodyDark,
                opacity: 0.38,
              }}
            />
          </motion.div>

          <motion.div
            className="absolute inset-0"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            <svg
              viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
              className="block h-full w-full"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <clipPath id={bodyClip}>
                  <path d={geo.body} />
                  <path d={geo.cap} />
                </clipPath>

                {/* Cylindrical shading. Every silhouette is a body of revolution. */}
                <linearGradient id={bodyFill} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor={shade(vessel.body, shading[0])} />
                  <stop offset="0.16" stopColor={shade(vessel.body, shading[1])} />
                  <stop offset="0.46" stopColor={shade(vessel.body, shading[2])} />
                  <stop offset="0.82" stopColor={shade(vessel.body, shading[3])} />
                  <stop offset="1" stopColor={shade(vessel.body, shading[4])} />
                </linearGradient>

                <linearGradient id={capFill} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor={shade(vessel.cap, -0.4)} />
                  <stop offset="0.18" stopColor={shade(vessel.cap, -0.08)} />
                  <stop offset="0.5" stopColor={vessel.cap} />
                  <stop offset="0.84" stopColor={shade(vessel.cap, -0.18)} />
                  <stop offset="1" stopColor={shade(vessel.cap, -0.46)} />
                </linearGradient>

                <radialGradient id={softLight} cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0" stopColor={shade(vessel.body, 0.62)} stopOpacity="0.9" />
                  <stop offset="0.5" stopColor={shade(vessel.body, 0.4)} stopOpacity="0.4" />
                  <stop offset="1" stopColor={shade(vessel.body, 0.3)} stopOpacity="0" />
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
                    <>
                      <ellipse
                        cx={box.x + box.width * 0.4}
                        cy={box.y + box.height * 0.36}
                        rx={box.width * 0.66}
                        ry={box.height * 0.46}
                        fill={`url(#${softLight})`}
                        opacity="0.42"
                      />
                      <ellipse
                        cx={box.x + box.width * 0.58}
                        cy={box.y + box.height * 0.92}
                        rx={box.width * 0.5}
                        ry={box.height * 0.14}
                        fill={`url(#${softLight})`}
                        opacity="0.16"
                      />
                    </>
                  ) : null}

                  {vessel.finish === "soft-touch" ? (
                    <ellipse
                      cx={box.x + box.width * 0.44}
                      cy={box.y + box.height * 0.42}
                      rx={box.width * 0.78}
                      ry={box.height * 0.52}
                      fill={`url(#${softLight})`}
                      opacity="0.1"
                    />
                  ) : null}

                  {vessel.finish === "ceramic" ? (
                    <>
                      <ellipse
                        cx={box.x + box.width * 0.36}
                        cy={box.y + box.height * 0.3}
                        rx={box.width * 0.32}
                        ry={box.height * 0.3}
                        fill={`url(#${softLight})`}
                        opacity="0.55"
                      />
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
                    </>
                  ) : null}

                  {vessel.finish === "glass" ? (
                    <>
                      {/* The dark companion next to the highlight is what makes glass
                          legible on a white pack, where a bright stripe alone vanishes. */}
                      <rect
                        x={box.x + box.width * 0.145}
                        y={box.y + box.height * 0.1}
                        width={Math.max(1.5, box.width * 0.016)}
                        height={box.height * 0.78}
                        rx={1}
                        fill={shade(vessel.body, -0.5)}
                        opacity="0.45"
                      />
                      <rect
                        x={box.x + box.width * 0.19}
                        y={box.y + box.height * 0.08}
                        width={Math.max(3, box.width * 0.055)}
                        height={box.height * 0.82}
                        rx={Math.max(1.5, box.width * 0.028)}
                        fill={`url(#${glassLight})`}
                        opacity="0.9"
                      />
                      <rect
                        x={box.x + box.width * 0.29}
                        y={box.y + box.height * 0.14}
                        width={Math.max(1.5, box.width * 0.02)}
                        height={box.height * 0.66}
                        rx={1}
                        fill={`url(#${glassLight})`}
                        opacity="0.5"
                      />
                      <rect
                        x={box.x + box.width * 0.9}
                        y={box.y + box.height * 0.1}
                        width={Math.max(1.5, box.width * 0.022)}
                        height={box.height * 0.78}
                        rx={1}
                        fill={`url(#${glassLight})`}
                        opacity="0.42"
                      />
                    </>
                  ) : null}
                </motion.g>
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
                  opacity={0.42}
                />
              </g>

              {/* Outline last. Both rims are drawn: the dark one carries a pale pack on
                  the light surface, the light one keeps a black pack off the dark one. */}
              <g fill="none" strokeWidth="0.9">
                <path d={geo.body} stroke={bodyDark} opacity="0.45" />
                <path d={geo.cap} stroke={shade(vessel.cap, -0.5)} opacity="0.45" />
                <path d={geo.body} stroke={bodyLight} opacity="0.26" />
                <path d={geo.cap} stroke={shade(vessel.cap, 0.55)} opacity="0.26" />
              </g>
            </svg>
          </motion.div>
        </div>
      </div>

      {compact ? null : (
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3 motion-reduce:hidden">
          Mit dem Zeiger oder den Pfeiltasten neigen
        </p>
      )}
    </div>
  );
}
