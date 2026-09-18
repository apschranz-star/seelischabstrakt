import { SITE } from "@/config/site";
import type { Text } from "@/lib/i18n";
import type { Mode } from "@/lib/store";

/**
 * The words of the two rituals. The hero and the collection sections read the
 * same object, so a change in the kicker or the lead reaches both at once.
 * Every field is a { de, en } pair; the consumer resolves it with t() or pick().
 */
export interface RitualCopy {
  kicker: Text;
  title: Text;
  daypart: Text;
  /**
   * Hours of the day this collection belongs to, straight from the site config.
   * A string in both languages, "06:00 bis 18:00" and "06:00 to 18:00".
   */
  hours: Text;
  lead: Text;
  /** The ritual as a story: read first, the five pieces follow beneath it. */
  story: RitualStory;
}

export interface RitualStoryStep {
  /** The product this step belongs to. The card in the grid carries the same id. */
  productId: string;
  /** When in the ritual this step happens. */
  cue: Text;
}

export interface RitualStory {
  kicker: Text;
  title: Text;
  lead: Text;
  /** The five steps in the order of the ritual, not in the order of the catalogue. */
  steps: RitualStoryStep[];
  close: Text;
  /** The line that points down to the grid. */
  toProducts: Text;
}

/** "06:00 bis 18:00" from the config, "06:00 to 18:00" for the English reader. */
function hoursText(window: string): Text {
  return { de: window, en: window.replace(" bis ", " to ") };
}

const HOURS: Record<Mode, Text> = {
  yang: hoursText(SITE.ritualWindow.yang),
  yin: hoursText(SITE.ritualWindow.yin),
};

export const RITUAL: Record<Mode, RitualCopy> = {
  yang: {
    kicker: { de: "Kollektion 01", en: "Collection 01" },
    title: { de: "YANG", en: "YANG" },
    daypart: { de: "der Tag", en: "the day" },
    hours: HOURS.yang,
    lead: {
      de:
        "Fünf Stücke für das Licht. Texturen, die einen Arbeitstag überstehen, eine Essenz, " +
        "die darunter weiterarbeitet, und ein Atemzug für den Kopf.",
      en:
        "Five pieces for the light. Textures that last a working day, an essence that keeps " +
        "working underneath, and a breath for the head.",
    },
    story: {
      kicker: { de: "Das Ritual am Morgen", en: "The ritual in the morning" },
      title: { de: "Der Tag beginnt mit Struktur", en: "The day begins with structure" },
      lead: {
        de:
          "Yang gehört zu den Stunden von " +
          HOURS.yang.de +
          " Uhr. Es baut auf, hält bis zum letzten Termin und lässt den Kopf frei. " +
          "Fünf Schritte, in der Reihenfolge des Morgens, jeder mit einem Stück aus der Kollektion.",
        en:
          "Yang belongs to the hours from " +
          HOURS.yang.en +
          ". It builds up, holds until the last appointment and leaves the head clear. " +
          "Five steps, in the order of the morning, each with one piece from the collection.",
      },
      steps: [
        { productId: "yang-04", cue: { de: "Nach der Reinigung", en: "After cleansing" } },
        { productId: "yang-03", cue: { de: "Die Basis", en: "The base" } },
        { productId: "yang-02", cue: { de: "Das Lid", en: "The lid" } },
        { productId: "yang-01", cue: { de: "Der Mund", en: "The mouth" } },
        {
          productId: "yang-05",
          cue: { de: "Vor dem ersten Termin", en: "Before the first appointment" },
        },
      ],
      close: {
        de:
          "Mehr braucht der Tag nicht. Was aufgetragen ist, bleibt bis zum Abend, und der Atemzug " +
          "am Ende ist der Punkt, an dem der Tag anfängt.",
        en:
          "The day needs no more. What is applied stays until the evening, and the breath at " +
          "the end is the point where the day begins.",
      },
      toProducts: { de: "Die fünf Stücke", en: "The five pieces" },
    },
  },
  yin: {
    kicker: { de: "Kollektion 02", en: "Collection 02" },
    title: { de: "YIN", en: "YIN" },
    daypart: { de: "die Nacht", en: "the night" },
    hours: HOURS.yin,
    lead: {
      de:
        "Fünf Stücke für das Halbdunkel. Öl, Stein und Duft, ein Gerät, das den Raum vorbereitet, und ein Atemzug zum Schluss.",
      en:
        "Five pieces for the half dark. Oil, stone and scent, a device that prepares the room, and a breath at the end.",
    },
    story: {
      kicker: { de: "Das Ritual am Abend", en: "The ritual in the evening" },
      title: { de: "Die Nacht nimmt zurück", en: "The night takes back" },
      lead: {
        de:
          "Yin gehört zu den Stunden von " +
          HOURS.yin.de +
          " Uhr. Es bereitet den Raum vor, löst, was der Tag hinterlassen hat, und überlässt der Haut " +
          "die Arbeit. Fünf Schritte, in der Reihenfolge des Abends, jeder mit einem Stück aus der Kollektion.",
        en:
          "Yin belongs to the hours from " +
          HOURS.yin.en +
          ". It prepares the room, loosens what the day has left behind and leaves the work to " +
          "the skin. Five steps, in the order of the evening, each with one piece from the collection.",
      },
      steps: [
        {
          productId: "yin-01",
          cue: { de: "Eine halbe Stunde vor dem Schlafen", en: "Half an hour before sleep" },
        },
        { productId: "yin-04", cue: { de: "Der Raum", en: "The room" } },
        { productId: "yin-02", cue: { de: "Die Haut", en: "The skin" } },
        { productId: "yin-03", cue: { de: "Nach dem Öl", en: "After the oil" } },
        { productId: "yin-05", cue: { de: "Zum Schluss", en: "At the end" } },
      ],
      close: {
        de:
          "Dann ist Ruhe. Die Kerze geht aus, der Diffuser schaltet sich ab, und was das Öl " +
          "angefangen hat, macht die Haut bis zum Morgen allein fertig.",
        en:
          "Then there is quiet. The candle goes out, the diffuser switches itself off, and what " +
          "the oil has started, the skin finishes on its own by morning.",
      },
      toProducts: { de: "Die fünf Stücke", en: "The five pieces" },
    },
  },
};
