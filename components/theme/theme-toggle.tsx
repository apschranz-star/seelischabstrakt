"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useYinYang } from "@/components/theme/yin-yang-provider";
import { Moon, Sun } from "@/components/ui/celestial";
import { useT } from "@/lib/i18n";
import { DURATION, EASE_RITUAL } from "@/lib/motion";
import { originFromEvent } from "@/lib/switch-origin";
import { cn } from "@/lib/utils";

/**
 * Der Schalter zwischen den beiden Ritualen, gebaut als kleiner Himmel.
 *
 * Die Bahn ist der Himmel: am Tag hell, in der Nacht tief, mit drei Sternen, die
 * mit der Nacht aufgehen. Darin wandert ein Gestirn von der einen Seite zur
 * anderen, und während es wandert, zieht die Sonne ihre Strahlen ein und die
 * Sichel des Mondes tritt hervor. Man liest den Schalter nicht, man sieht ihn.
 *
 * Beim Druck blüht ein Ring aus dem Gestirn auf. Das ist kein Schmuck: die Seite
 * dahinter öffnet im selben Moment die neue Palette als Scheibe vom gedrückten
 * Punkt aus, und der Ring ist der Anfang dieser Bewegung, an der Stelle, an der
 * der Finger liegt. Der Knopf trägt data-switch-mark und liegt dadurch während
 * des Wechsels auf einer eigenen Ebene über der Scheibe, also ist er dabei live
 * zu sehen.
 *
 * Hydration: Der Elementbaum hängt nie vom gespeicherten Modus ab, nur Zielwerte
 * von Bewegungen und zwei Farben. Vor der Rehydrierung ist der Modus yang, genau
 * das hat der Server gerendert.
 *
 * Wer wenig Bewegung wünscht, bekommt dieselben Bilder ohne Weg dazwischen.
 */

/** Maße der Bahn in px. Die Scheibe ist die Höhe abzüglich des Randes. */
const TRACK_W = 62;
const TRACK_H = 30;
const PAD = 3;
const DISC = TRACK_H - PAD * 2;
const TRAVEL = TRACK_W - DISC - PAD * 2;

/** Drei Sterne, die mit der Nacht aufgehen. Feste Plätze, kein Zufall im Rendern. */
const STARS = [
  { x: 11, y: 9, r: 1.05, delay: 0 },
  { x: 19, y: 19, r: 0.8, delay: 0.08 },
  { x: 26, y: 11, r: 0.65, delay: 0.16 },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { mode, toggleMode } = useYinYang();
  const t = useT();
  const reduceMotion = useReducedMotion() === true;
  const isYin = mode === "yin";
  const word = isYin ? "Yin" : "Yang";

  const travel = reduceMotion
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 260, damping: 26, mass: 0.9 } as const);
  const fade = { duration: reduceMotion ? 0 : DURATION.swap, ease: EASE_RITUAL };

  return (
    <button
      type="button"
      data-switch-mark=""
      onClick={(event) => toggleMode({ origin: originFromEvent(event) })}
      // Der Knopf nennt die Tageszeit, in der der Shop steht, und sonst nichts.
      //
      // Vorher stand hier ein aria-label mit dem einen Ritual und ein title, der
      // das andere beim Namen nannte: "Yang, der Tag. Klicken für Yin." Damit
      // standen beide zugleich auf dem Schirm, sobald jemand mit der Maus
      // stehenblieb, und genau das soll nirgends passieren.
      //
      // Den Namen trägt jetzt der Text im Knopf selbst. Das sichtbare Wort ist
      // dekorativ und wird nicht zweimal angesagt; daneben steht dasselbe Wort
      // für die Vorlesehilfe, mit der Sache davor. So enthält der Name den
      // sichtbaren Text, Erfolgskriterium 2.5.3, und nennt trotzdem nur die
      // Tageszeit, die gerade gilt.
      title={t({ de: "Tageszeit umschalten", en: "Switch the time of day" })}
      className={cn("group inline-flex min-h-11 items-center gap-2.5 px-1", className)}
    >
      <span className="sr-only">
        {t({ de: `Tageszeit, gerade ${word}`, en: `Time of day, currently ${word}` })}
      </span>
      <span
        aria-hidden="true"
        style={{ width: TRACK_W, height: TRACK_H }}
        className={cn(
          "jing-sky relative inline-block shrink-0 overflow-hidden rounded-full",
          "border border-control transition-colors duration-[var(--duration-state)] ease-ritual",
          "group-hover:border-ink",
        )}
        data-night={isYin ? "" : undefined}
      >
        {/* Die Sterne gehen mit der Nacht auf, einer nach dem anderen. */}
        <svg
          viewBox={`0 0 ${TRACK_W} ${TRACK_H}`}
          width={TRACK_W}
          height={TRACK_H}
          focusable="false"
          className="absolute inset-0 text-ink"
        >
          {STARS.map((s) => (
            <motion.circle
              key={`${s.x}-${s.y}`}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="currentColor"
              initial={false}
              animate={{ opacity: isYin ? 0.9 : 0, scale: isYin ? 1 : 0.4 }}
              style={{ originX: `${s.x}px`, originY: `${s.y}px` }}
              transition={{
                duration: reduceMotion ? 0 : DURATION.swift,
                delay: reduceMotion || !isYin ? 0 : 0.18 + s.delay,
                ease: EASE_RITUAL,
              }}
            />
          ))}
        </svg>

        {/* Das Gestirn wandert. Der Ring darunter blüht beim Wechsel einmal auf. */}
        <motion.span
          className="absolute rounded-full"
          style={{ width: DISC, height: DISC, left: PAD, top: PAD }}
          animate={{ x: isYin ? TRAVEL : 0 }}
          transition={travel}
        >
          {/* Das Gestirn gibt unter dem Finger nach. Das macht CSS, nicht die
              Bewegungsbibliothek: deren whileTap haengt dem Element ein
              tabindex an, damit es auch mit der Tastatur zu druecken waere, und
              damit stuende ein Tabstopp in einem Bereich, der aria-hidden ist.
              Gedrueckt wird der Knopf, nicht die Scheibe darin. */}
          <span className="jing-disc absolute inset-0 rounded-full bg-inverse-surface" />
          <motion.span
            key={word}
            aria-hidden="true"
            className="jing-bloom absolute inset-0 rounded-full"
            initial={reduceMotion ? false : { opacity: 0.55, scale: 1 }}
            animate={{ opacity: 0, scale: reduceMotion ? 1 : 2.6 }}
            transition={{ duration: reduceMotion ? 0 : DURATION.ritual, ease: EASE_RITUAL }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-inverse-ink">
            <AnimatePresence initial={false} mode="wait">
              {isYin ? (
                <motion.span
                  key="moon"
                  initial={{ opacity: 0, rotate: -35, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 35, scale: 0.7 }}
                  transition={fade}
                  className="flex"
                >
                  <Moon size={13} />
                </motion.span>
              ) : (
                <motion.span
                  key="sun"
                  initial={{ opacity: 0, rotate: 35, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -35, scale: 0.7 }}
                  transition={fade}
                  className="flex"
                >
                  <Sun size={13} />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </motion.span>
      </span>

      {/* Das Wort nennt das Ritual, in dem der Shop steht. Den Zustand trägt der
          Knopf schon in seinem Namen, deshalb wird er nicht zweimal angesagt.
          Die Hülle hält eine feste Breite und schneidet auf eine Zeile, damit der
          Kopf beim Wechsel nicht springt. Die Breite stand vorher als unsichtbares
          "Yang" im Baum, also stand das eine Wort im Dokument, während das andere
          zu lesen war. Vier Nullen sind in einer dicktengleichen Schrift genau so
          breit wie vier Buchstaben, samt Sperrung, und nennen kein Ritual. */}
      <span
        aria-hidden="true"
        className="relative hidden h-[1em] overflow-hidden font-mono text-[11px] uppercase leading-none tracking-[0.18em] text-ink-2 sm:inline-grid"
      >
        <span className="invisible col-start-1 row-start-1">0000</span>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={word}
            className="col-start-1 row-start-1"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={fade}
          >
            {word}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}
