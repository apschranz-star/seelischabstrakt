/**
 * Seed catalogue. Eight private label products, four per collection.
 *
 * Prices are gross, in euro cents, as required for consumer facing prices in the EU.
 * Net quantities drive the Grundpreis under the German Preisangabenverordnung, see
 * lib/utils.ts. The regulatory block decides which compliance panel a product page
 * renders: cosmetics get the INCI drawer, electricals get the WEEE notice, candles
 * get the CLP hazard statement.
 *
 * The CPNP references are demonstration values. Replace them with the real
 * notification references before any of this is offered for sale.
 */

export type Collection = "yin" | "yang";
export type MeasureUnit = "ml" | "g";

export interface NetQuantity {
  value: number;
  unit: MeasureUnit;
}

/**
 * Note for anyone editing the ingredient lists: the cyclic siloxanes D4, D5 and
 * D6 (Cyclotetrasiloxane, Cyclopentasiloxane, Cyclohexasiloxane) may not be used
 * at or above 0,1 percent in leave-on cosmetics, entry 70 of Annex XVII REACH as
 * amended by Regulation (EU) 2024/1328. Do not reintroduce them.
 */
export interface CosmeticRegulatory {
  kind: "cosmetic";
  /** INCI list in descending order of weight, as printed on the pack. */
  inci: string[];
  /** Declarable fragrance allergens under Annex III of Regulation EC 1223/2009. */
  allergens: string[];
  /** Period after opening, for example "12M". */
  pao: string;
  cpnpReference: string;
  warnings: string[];
}

export interface ElectricalRegulatory {
  kind: "electrical";
  /** Registration number with Stiftung EAR under the German ElektroG. */
  weeeNumber: string;
  voltage: string;
  power: string;
  /** True when the unit contains a battery and falls under the Batteriegesetz. */
  hasBattery: boolean;
  warnings: string[];
}

export interface CandleRegulatory {
  kind: "candle";
  /** CLP signal word, empty when the product is not classified as hazardous. */
  clpSignalWord: string;
  clpStatements: string[];
  burnTimeHours: number;
  warnings: string[];
}

export interface AccessoryRegulatory {
  kind: "accessory";
  material: string;
  care: string;
  warnings: string[];
  /**
   * A set may ship a cosmetic alongside the tool. That part keeps the full
   * cosmetics duties of Regulation EC 1223/2009, so it carries its own block
   * rather than disappearing into the accessory branch.
   */
  cosmetic?: Omit<CosmeticRegulatory, "kind"> & { name: string; netQuantity: NetQuantity };
}

export type Regulatory =
  | CosmeticRegulatory
  | ElectricalRegulatory
  | CandleRegulatory
  | AccessoryRegulatory;

export interface Vessel {
  /** Body colour of the packaging, used by the packaging viewer. */
  body: string;
  /** Colour of the printed or debossed type on the vessel. */
  print: string;
  /** Cap or lid colour. */
  cap: string;
  /** Silhouette the viewer draws. */
  shape: "bottle" | "compact" | "jar" | "tube" | "column";
  finish: "matte" | "soft-touch" | "ceramic" | "glass";
}

export interface Product {
  id: string;
  slug: string;
  /** Catalogue code, for example "YIN 01". */
  code: string;
  name: string;
  collection: Collection;
  category: string;
  tagline: string;
  description: string;
  ritual: string;
  priceCents: number;
  netQuantity: NetQuantity | null;
  unitsLabel: string;
  origin: string;
  vessel: Vessel;
  regulatory: Regulatory;
  /** Sorting weight inside a collection, lower comes first. */
  order: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "yin-01",
    slug: "nocturne-ambient-diffuser",
    code: "YIN 01",
    name: "Nocturne Ambient Scent Diffuser",
    collection: "yin",
    category: "Duftarchitektur",
    tagline: "Ultraschall-Diffuser aus mattem Aluminium",
    description:
      "Ein Objekt, das den Abend einläutet. Der Nebel steigt gerade nach oben, ohne Geräusch, " +
      "ohne Licht. Das Gehäuse ist innen und aussen matt, damit es im Halbdunkel keine Reflexe wirft. " +
      "Zwei Stufen, acht Stunden Laufzeit, automatische Abschaltung bei leerem Tank.",
    ritual: "Abends eine halbe Stunde vor dem Zubettgehen einschalten.",
    priceCents: 8900,
    netQuantity: null,
    unitsLabel: "1 Gerät",
    origin: "Entwickelt in Berlin, gefertigt in Shenzhen",
    vessel: { body: "#121212", print: "#E8E8E8", cap: "#1C1C1C", shape: "column", finish: "soft-touch" },
    regulatory: {
      kind: "electrical",
      weeeNumber: "WEEE-Reg.-Nr. DE [wird nach Registrierung ergänzt]",
      voltage: "100 bis 240 V, 50/60 Hz",
      power: "12 W",
      hasBattery: false,
      warnings: [
        "Nur mit Wasser und dafür vorgesehenen Duftölen betreiben.",
        "Nicht in unmittelbarer Nähe von Kindern unter drei Jahren aufstellen.",
        "Altgeräte gehören nicht in den Hausmüll. Rücknahme über uns oder den kommunalen Wertstoffhof.",
      ],
    },
    order: 1,
  },
  {
    id: "yin-02",
    slug: "kuro-night-recovery-oil",
    code: "YIN 02",
    name: "Kuro Botanical Night Recovery Oil",
    collection: "yin",
    category: "Nachtpflege",
    tagline: "Regenerierendes Gesichtsöl mit schwarzem Sesam",
    description:
      "Sechs Pflanzenöle, kalt gepresst, dazu Squalan und Vitamin E, in einer Braunglasflasche " +
      "mit mattem Überzug. Die Textur zieht in etwa neunzig Sekunden ein und hinterlässt keinen " +
      "Film. Der Duft kommt aus den Ölen selbst, ein Parfümöl ist nicht zugesetzt. Die natürlich " +
      "enthaltenen Duftstoffe Linalool und Limonen sind deklariert.",
    ritual: "Drei bis vier Tropfen abends auf die feuchte Haut, von innen nach aussen.",
    priceCents: 5400,
    netQuantity: { value: 50, unit: "ml" },
    unitsLabel: "50 ml",
    origin: "Hergestellt in Frankreich",
    vessel: { body: "#0E0E0E", print: "#F2F2F2", cap: "#191919", shape: "bottle", finish: "matte" },
    regulatory: {
      kind: "cosmetic",
      inci: [
        "Sesamum Indicum Seed Oil",
        "Simmondsia Chinensis Seed Oil",
        "Camellia Japonica Seed Oil",
        "Squalane",
        "Rosa Canina Fruit Oil",
        "Oenothera Biennis Oil",
        "Tocopherol",
        "Helianthus Annuus Seed Oil",
        "Linalool",
        "Limonene",
      ],
      allergens: ["Linalool", "Limonene"],
      pao: "12M",
      cpnpReference: "CPNP-DEMO-YIN02",
      warnings: [
        "Nur zur äusseren Anwendung.",
        "Kontakt mit den Augen vermeiden.",
        "Bei gereizter oder verletzter Haut nicht anwenden.",
      ],
    },
    order: 2,
  },
  {
    id: "yin-03",
    slug: "obsidian-gua-sha-set",
    code: "YIN 03",
    name: "Obsidian Gua Sha und Ritualöl",
    collection: "yin",
    category: "Ritualwerkzeug",
    tagline: "Handgeschliffener Obsidian mit 30 ml Trägeröl",
    description:
      "Der Stein liegt schwer in der Hand und bleibt kühl. Jede Kante ist einzeln geschliffen, " +
      "deshalb gleicht kein Stück dem anderen. Das beiliegende Öl ist bewusst neutral gehalten, " +
      "damit es die Haut gleiten lässt, ohne zu duften.",
    ritual: "Nach dem Öl, in ruhigen Zügen vom Kiefer zur Schläfe.",
    priceCents: 6200,
    netQuantity: null,
    unitsLabel: "1 Stein, 1 Flasche 30 ml",
    origin: "Stein aus Mexiko, Öl aus Italien",
    vessel: { body: "#0B0B0B", print: "#DCDCDC", cap: "#161616", shape: "jar", finish: "matte" },
    regulatory: {
      kind: "accessory",
      material: "Vulkanglas, poliert, ohne Beschichtung",
      care: "Nach dem Gebrauch mit lauwarmem Wasser abspülen und trocken reiben.",
      warnings: [
        "Nicht auf entzündeter oder verletzter Haut anwenden.",
        "Der Stein ist bruchempfindlich, nicht auf harte Flächen fallen lassen.",
      ],
      cosmetic: {
        name: "Beiliegendes Trägeröl",
        netQuantity: { value: 30, unit: "ml" },
        inci: [
          "Helianthus Annuus Seed Oil",
          "Simmondsia Chinensis Seed Oil",
          "Caprylic/Capric Triglyceride",
          "Tocopherol",
        ],
        allergens: [],
        pao: "12M",
        cpnpReference: "CPNP-DEMO-YIN03-OEL",
        warnings: [
          "Nur zur äusseren Anwendung.",
          "Kontakt mit den Augen vermeiden.",
        ],
      },
    },
    order: 3,
  },
  {
    id: "yin-04",
    slug: "smoked-hinoki-candle",
    code: "YIN 04",
    name: "Smoked Hinoki Candle Ritual",
    collection: "yin",
    category: "Duftkerze",
    tagline: "Japanische Zypresse, Zedernholz, kalter Rauch",
    description:
      "Rapswachs in einem matten Steinzeuggefäss, das nach dem Abbrennen als Behälter bleibt. " +
      "Der Docht ist aus Holz und knackt leise. Brennt etwa fünfzig Stunden.",
    ritual: "Anzünden, bis der Wachsspiegel den Rand erreicht. Sonst brennt sie ungleich ab.",
    priceCents: 4200,
    netQuantity: { value: 220, unit: "g" },
    unitsLabel: "220 g",
    origin: "Gegossen in Portugal",
    vessel: { body: "#101010", print: "#EDEDED", cap: "#1A1A1A", shape: "jar", finish: "ceramic" },
    regulatory: {
      kind: "candle",
      clpSignalWord: "",
      clpStatements: [
        // EUH208 names the sensitising substance, the generic word Duftstoffe does not satisfy it.
        "Enthält Cedrol, Limonen, Linalool. Kann allergische Reaktionen hervorrufen.",
      ],
      burnTimeHours: 50,
      warnings: [
        "Brennende Kerze niemals unbeaufsichtigt lassen.",
        "Von Kindern und Haustieren fernhalten.",
        "Mindestens zehn Zentimeter Abstand zu anderen Kerzen halten.",
        "Docht vor jedem Anzünden auf fünf Millimeter kürzen.",
        "Nicht auf empfindlichen Oberflächen abstellen, das Gefäss wird heiss.",
      ],
    },
    order: 4,
  },
  {
    id: "yang-01",
    slug: "sculpted-matte-lip-clay",
    code: "YANG 01",
    name: "Sculpted Matte Lip Clay",
    collection: "yang",
    category: "Lippen",
    tagline: "Farbton Chalk Nude, samtmatt",
    description:
      "Eine Textur zwischen Stift und Creme. Sie legt sich in einer Schicht auf, ohne die Lippe " +
      "zu beschweren, und trocknet zu einem trockenen Matt, das kaum abfärbt. Die Hülse ist " +
      "kreideweiss und aussen unlackiert, damit sie Fingerabdrücke annimmt statt sie zu spiegeln.",
    ritual: "Von der Mitte nach aussen auftragen, danach einmal mit dem Finger verblenden.",
    priceCents: 2800,
    netQuantity: { value: 3.5, unit: "g" },
    unitsLabel: "3,5 g",
    origin: "Hergestellt in Südkorea",
    vessel: { body: "#F4F3F1", print: "#111111", cap: "#EDECEA", shape: "tube", finish: "soft-touch" },
    regulatory: {
      kind: "cosmetic",
      inci: [
        "Isododecane",
        "Trimethylsiloxysilicate",
        "Dimethicone",
        "Silica",
        "Synthetic Fluorphlogopite",
        "Polyglyceryl-2 Triisostearate",
        "Tocopheryl Acetate",
        "CI 77891",
        "CI 77491",
        "CI 15850",
      ],
      allergens: [],
      pao: "12M",
      cpnpReference: "CPNP-DEMO-YANG01",
      warnings: [
        "Bei Kontakt mit den Augen gründlich mit Wasser ausspülen.",
        "Nicht anwenden bei aufgesprungenen oder verletzten Lippen.",
      ],
    },
    order: 1,
  },
  {
    id: "yang-02",
    slug: "monochrome-glass-eye-glaze",
    code: "YANG 02",
    name: "Monochrome Glass Eye Glaze",
    collection: "yang",
    category: "Augen",
    tagline: "Transparenter Glanz mit Perlmuttkern",
    description:
      "Ein Lidschatten, der wie Glas liegt. Der Applikator ist flach geschnitten, damit die Schicht " +
      "dünn bleibt. Der Perlmuttkern wandert im Licht, die Farbe selbst bleibt farblos.",
    ritual: "Auf das bewegliche Lid tupfen, nicht ziehen. Einmal blinzeln, dann sitzt er.",
    priceCents: 2400,
    netQuantity: { value: 15, unit: "ml" },
    unitsLabel: "15 ml",
    origin: "Hergestellt in Japan",
    vessel: { body: "#FAFAFA", print: "#0F0F0F", cap: "#F0EFED", shape: "bottle", finish: "glass" },
    regulatory: {
      kind: "cosmetic",
      inci: [
        "Aqua",
        "Glycerin",
        "Butylene Glycol",
        "Synthetic Fluorphlogopite",
        "Acrylates Copolymer",
        "Hydroxyethylcellulose",
        "Phenoxyethanol",
        "Ethylhexylglycerin",
        "CI 77891",
        "CI 77163",
      ],
      allergens: [],
      pao: "6M",
      cpnpReference: "CPNP-DEMO-YANG02",
      warnings: [
        "Nicht im Bereich der Wasserlinie anwenden.",
        "Bei Kontaktlinsen vorsichtig auftragen, bei Reizung absetzen.",
      ],
    },
    order: 2,
  },
  {
    id: "yang-03",
    slug: "silk-cushion-foundation-compact",
    code: "YANG 03",
    name: "Silk Cushion Foundation Compact",
    collection: "yang",
    category: "Teint",
    tagline: "Kompakte Dose in Kreideweiss",
    description:
      "Die Dose ist aus mattem Kunststoff und lässt sich öffnen, ohne dass man hinsieht. " +
      "Das Kissen gibt die Emulsion langsam ab, deshalb lässt sich der Auftrag steuern. " +
      "Der Einsatz sitzt lose in der Dose und lässt sich zum Reinigen herausnehmen.",
    ritual: "In kurzen Tupfern arbeiten, an der Nase beginnen, nach aussen auslaufen lassen.",
    priceCents: 4600,
    netQuantity: { value: 15, unit: "g" },
    unitsLabel: "15 g",
    origin: "Hergestellt in Südkorea",
    vessel: { body: "#F7F6F4", print: "#101010", cap: "#FFFFFF", shape: "compact", finish: "matte" },
    regulatory: {
      kind: "cosmetic",
      inci: [
        "Aqua",
        "Dimethicone",
        "Glycerin",
        "Butylene Glycol",
        "PEG-10 Dimethicone",
        "Niacinamide",
        "Sodium Chloride",
        "Phenoxyethanol",
        "CI 77891",
        "CI 77492",
        "CI 77491",
        "CI 77499",
      ],
      allergens: [],
      pao: "12M",
      cpnpReference: "CPNP-DEMO-YANG03",
      warnings: [
        "Kissen nicht mit nassen Fingern berühren.",
      ],
    },
    order: 3,
  },
  {
    id: "yang-04",
    slug: "dual-phase-hydration-essence",
    code: "YANG 04",
    name: "Dual-Phase Hydration Essence",
    collection: "yang",
    category: "Pflege",
    tagline: "Zwei Phasen, vor dem Gebrauch schütteln",
    description:
      "Unten die wässrige Phase mit Hyaluron, oben eine leichte Ölphase. Beim Schütteln " +
      "verbinden sich beide für etwa zwanzig Sekunden, genau so lange, wie das Auftragen dauert. " +
      "Danach trennen sie sich wieder, das ist gewollt.",
    ritual: "Morgens nach der Reinigung, in die noch feuchte Haut drücken.",
    priceCents: 3800,
    netQuantity: { value: 100, unit: "ml" },
    unitsLabel: "100 ml",
    origin: "Hergestellt in Japan",
    vessel: { body: "#FBFBFC", print: "#131313", cap: "#E9E8E6", shape: "bottle", finish: "glass" },
    regulatory: {
      kind: "cosmetic",
      inci: [
        "Aqua",
        "Dipropylene Glycol",
        "Glycerin",
        "Caprylic/Capric Triglyceride",
        "Sodium Hyaluronate",
        "Panthenol",
        "Beta-Glucan",
        "Allantoin",
        "Sodium Citrate",
        "Phenoxyethanol",
        "Ethylhexylglycerin",
      ],
      allergens: [],
      pao: "6M",
      cpnpReference: "CPNP-DEMO-YANG04",
      warnings: [
        "Vor jedem Gebrauch kräftig schütteln.",
        "Kühl und vor direkter Sonne geschützt lagern.",
      ],
    },
    order: 4,
  },
];

export function getProductsByCollection(collection: Collection): Product[] {
  return PRODUCTS.filter((p) => p.collection === collection).sort((a, b) => a.order - b.order);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function isCosmetic(product: Product): product is Product & { regulatory: CosmeticRegulatory } {
  return product.regulatory.kind === "cosmetic";
}

/**
 * True for a cosmetic and for a set that encloses one. The hygiene exception of
 * section 312g Abs. 2 Nr. 3 BGB and the Article 4 responsible person statement
 * both follow this, not the narrower isCosmetic.
 */
export function hasCosmeticPart(product: Product): boolean {
  const r = product.regulatory;
  if (r.kind === "cosmetic") return true;
  return r.kind === "accessory" && r.cosmetic !== undefined;
}

/**
 * Every declared allergen has to appear in the ingredient list the drawer shows,
 * because the drawer tells the reader it does. Seed data is small enough to check
 * at module load; in production this stays silent.
 */
if (process.env.NODE_ENV !== "production") {
  for (const product of PRODUCTS) {
    const blocks = [
      product.regulatory.kind === "cosmetic" ? product.regulatory : null,
      product.regulatory.kind === "accessory" ? (product.regulatory.cosmetic ?? null) : null,
    ];
    for (const block of blocks) {
      if (!block) continue;
      for (const allergen of block.allergens) {
        if (!block.inci.includes(allergen)) {
          throw new Error(
            `${product.id}: declared allergen "${allergen}" is missing from the INCI list.`,
          );
        }
      }
    }
  }
}
