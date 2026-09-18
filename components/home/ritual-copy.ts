import { SITE } from "@/config/site";
import type { Mode } from "@/lib/store";

/**
 * The words of the two rituals. The hero and the collection sections read the
 * same object, so a change in the kicker or the lead reaches both at once.
 */
export interface RitualCopy {
  kicker: string;
  title: string;
  daypart: string;
  /** Hours of the day this collection belongs to, straight from the site config. */
  hours: string;
  lead: string;
  invite: string;
  cta: string;
  /** The ritual as a story: read first, the five pieces follow beneath it. */
  story: RitualStory;
}

export interface RitualStoryStep {
  /** The product this step belongs to. The card in the grid carries the same id. */
  productId: string;
  /** When in the ritual this step happens. */
  cue: string;
}

export interface RitualStory {
  kicker: string;
  title: string;
  lead: string;
  /** The five steps in the order of the ritual, not in the order of the catalogue. */
  steps: RitualStoryStep[];
  close: string;
  /** The line that points down to the grid. */
  toProducts: string;
}

export const RITUAL: Record<Mode, RitualCopy> = {
  yang: {
    kicker: "Kollektion 01",
    title: "YANG",
    daypart: "der Tag",
    hours: SITE.ritualWindow.yang,
    lead:
      "Fünf Stücke für das Licht. Texturen, die einen Arbeitstag überstehen, eine Essenz, " +
      "die darunter weiterarbeitet, und ein Atemzug für den Kopf.",
    invite: "Yang liegt gerade im Hintergrund. Ein Klick, und der Shop dreht sich auf den Tag.",
    cta: "Zu Yang wechseln",
    story: {
      kicker: "Das Ritual am Morgen",
      title: "Der Tag beginnt mit Struktur",
      lead:
        "Yang gehört zu den Stunden von " +
        SITE.ritualWindow.yang +
        " Uhr. Es baut auf, hält bis zum letzten Termin und lässt den Kopf frei. " +
        "Fünf Schritte, in der Reihenfolge des Morgens, jeder mit einem Stück aus der Kollektion.",
      steps: [
        { productId: "yang-04", cue: "Nach der Reinigung" },
        { productId: "yang-03", cue: "Die Basis" },
        { productId: "yang-02", cue: "Das Lid" },
        { productId: "yang-01", cue: "Der Mund" },
        { productId: "yang-05", cue: "Vor dem ersten Termin" },
      ],
      close:
        "Mehr braucht der Tag nicht. Was aufgetragen ist, bleibt bis zum Abend, und der Atemzug " +
        "am Ende ist der Punkt, an dem der Tag anfängt.",
      toProducts: "Die fünf Stücke",
    },
  },
  yin: {
    kicker: "Kollektion 02",
    title: "YIN",
    daypart: "die Nacht",
    hours: SITE.ritualWindow.yin,
    lead:
      "Fünf Stücke für das Halbdunkel. Öl, Stein und Duft, ein Gerät, das den Raum vorbereitet, und ein Atemzug zum Schluss.",
    invite: "Yin liegt gerade im Hintergrund. Ein Klick, und der Shop dreht sich auf die Nacht.",
    cta: "Zu Yin wechseln",
    story: {
      kicker: "Das Ritual am Abend",
      title: "Die Nacht nimmt zurück",
      lead:
        "Yin gehört zu den Stunden von " +
        SITE.ritualWindow.yin +
        " Uhr. Es bereitet den Raum vor, löst, was der Tag hinterlassen hat, und überlässt der Haut " +
        "die Arbeit. Fünf Schritte, in der Reihenfolge des Abends, jeder mit einem Stück aus der Kollektion.",
      steps: [
        { productId: "yin-01", cue: "Eine halbe Stunde vor dem Schlafen" },
        { productId: "yin-04", cue: "Der Raum" },
        { productId: "yin-02", cue: "Die Haut" },
        { productId: "yin-03", cue: "Nach dem Öl" },
        { productId: "yin-05", cue: "Zum Schluss" },
      ],
      close:
        "Dann ist Ruhe. Die Kerze geht aus, der Diffuser schaltet sich ab, und was das Öl " +
        "angefangen hat, macht die Haut bis zum Morgen allein fertig.",
      toProducts: "Die fünf Stücke",
    },
  },
};
