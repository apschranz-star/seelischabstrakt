"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { useYinYang } from "@/components/theme/yin-yang-provider";
import { Taiji } from "@/components/ui/celestial";
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

/** Eineinhalb Umdrehungen je Wechsel, in Grad. */
const SPIN = 540;

/** Drei Sterne, die mit der Nacht aufgehen. Feste Plätze, kein Zufall im Rendern. */
const STARS = [
  { x: 11, y: 9, r: 1.05, delay: 0 },
  { x: 19, y: 19, r: 0.8, delay: 0.08 },
  { x: 26, y: 11, r: 0.65, delay: 0.16 },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { mode, toggleMode, hydrated } = useYinYang();
  const t = useT();
  const reduceMotion = useReducedMotion() === true;
  const isYin = mode === "yin";
  /*
   * Die Drehung zählt Drücke, nicht Zustände.
   *
   * Hinge sie am Modus, begänne sie erst, wenn der Modus im Speicher steht, und
   * das ist eine knappe halbe Sekunde nach dem Druck: die Eklipse hält die Seite
   * so lange an, während sie ihr Bild aufnimmt. Gemessen waren es rund 270 ms
   * tote Zeit zwischen Finger und Drehung. So wird der Zähler im Druck selbst
   * erhöht, die Drehung läuft sofort los und die neue Palette öffnet sich
   * daneben.
   *
   * Welche Hälfte am Ende oben steht, ist Schmuck und kein Zustand. Den Zustand
   * trägt die Seite der Scheibe, der Himmel dahinter, die Sterne und das Wort.
   * Deshalb darf der Zähler nach einem Neuladen bei null anfangen.
   */
  const [drehung, setDrehung] = useState(0);
  /*
   * Das Wort erscheint erst, wenn der gespeicherte Modus gelesen ist.
   *
   * Vorher stand im ausgelieferten HTML immer "Yang", weil der Server nichts
   * anderes wissen kann. Auf der Seite eines Stueckes der Nacht trug dieselbe
   * Datei damit beide Rituale: im Kopf das Wort des Tages, im Inhalt das der
   * Nacht. Wer den Quelltext liest, eine Vorschau erzeugt oder ohne Skripte
   * unterwegs ist, bekam beide zu sehen. Also nennt der Schalter vor der
   * Rehydrierung gar keines und heisst nur nach dem, was er tut.
   *
   * Der Elementbaum bleibt dabei derselbe: Server und erster Client-Render
   * zeigen beide den leeren Zustand, das Wort kommt als gewoehnliche
   * Aktualisierung nach.
   */
  const word = hydrated ? (isYin ? "Yin" : "Yang") : "";

  const travel = reduceMotion
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 260, damping: 26, mass: 0.9 } as const);
  const fade = { duration: reduceMotion ? 0 : DURATION.swap, ease: EASE_RITUAL };

  return (
    <button
      type="button"
      data-switch-mark=""
      onClick={(event) => {
        setDrehung((d) => d + SPIN);
        toggleMode({ origin: originFromEvent(event) });
      }}
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
        {word
          ? t({ de: `Tageszeit, gerade ${word}`, en: `Time of day, currently ${word}` })
          : t({ de: "Tageszeit umschalten", en: "Switch the time of day" })}
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

        {/* Das Taiji wandert und dreht sich dabei.
            Eineinhalb Umdrehungen: genug, dass man die Drehung als Drehung sieht,
            und am Ende steht die dunkle Hälfte dort, wo vorher die helle war. Die
            Bahn läuft auf einer Feder, die Drehung auf einer eigenen Kurve; eine
            Feder auf 540 Grad überschwingt und sieht aus wie ein Wackler.
            Der Ring darunter blüht beim Wechsel einmal auf, am gedrückten Punkt,
            von dem aus die Seite dahinter ihre neue Palette öffnet. */}
        <motion.span
          className="absolute rounded-full"
          style={{ width: DISC, height: DISC, left: PAD, top: PAD }}
          animate={{ x: isYin ? TRAVEL : 0, rotate: reduceMotion ? 0 : drehung }}
          transition={{
            x: travel,
            rotate: reduceMotion
              ? { duration: 0 }
              : { duration: DURATION.ritual, ease: EASE_RITUAL },
          }}
        >
          <motion.span
            key={word}
            aria-hidden="true"
            className="jing-bloom absolute inset-0 rounded-full"
            initial={reduceMotion ? false : { opacity: 0.55, scale: 1 }}
            animate={{ opacity: 0, scale: reduceMotion ? 1 : 2.6 }}
            transition={{ duration: reduceMotion ? 0 : DURATION.ritual, ease: EASE_RITUAL }}
          />
          {/* Die Scheibe gibt unter dem Finger nach. Das macht CSS, nicht die
              Bewegungsbibliothek: deren whileTap hängt dem Element ein tabindex
              an, damit es auch mit der Tastatur zu drücken wäre, und damit stünde
              ein Tabstopp in einem Bereich, der aria-hidden ist. Gedrückt wird
              der Knopf, nicht die Scheibe darin. */}
          <span className="jing-disc absolute inset-0 flex items-center justify-center">
            <Taiji size={DISC} />
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
          {word ? (
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
          ) : null}
        </AnimatePresence>
      </span>
    </button>
  );
}
