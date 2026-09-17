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
  },
};
