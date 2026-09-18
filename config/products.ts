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
  /**
   * Declared composition of a non cosmetic part, for example the herbal blend
   * of an inhaler stick, which is inhaled and therefore not a cosmetic.
   */
  ingredients?: string[];
  /** CLP label elements of a hazardous mixture, empty when not classified. */
  clpSignalWord?: string;
  clpStatements?: string[];
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

/**
 * The English words of one product. Names are brand names and stay as they are.
 * INCI lists, CPNP references and numbers are not language, so they are not here.
 * CLP statements use the official English wording of the H and P phrases.
 */
export interface ProductTranslation {
  /** Only for a name that carries German words. Brand names stay as they are. */
  name?: string;
  category?: string;
  tagline: string;
  description: string;
  ritual: string;
  unitsLabel?: string;
  origin?: string;
  /** Same order and length as the German warnings of the regulatory block. */
  warnings?: string[];
  clpStatements?: string[];
  /** For accessories: the material and care lines. */
  material?: string;
  care?: string;
  /** For a set with an enclosed cosmetic: its warnings. */
  cosmeticWarnings?: string[];
  cosmeticName?: string;
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
  /** English texts. Missing means the German words are shown in both languages. */
  translations?: { en: ProductTranslation };
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
    translations: {
      en: {
        category: "Scent Architecture",
        tagline: "Ultrasonic diffuser in matt aluminium",
        description:
          "An object that opens the evening. The mist rises straight up, without sound, without " +
          "light. The housing is matt inside and out, so it casts no reflections in the half dark. " +
          "Two settings, eight hours of running time, automatic shut-off when the tank is empty.",
        ritual: "Switch on in the evening, half an hour before going to bed.",
        unitsLabel: "1 device",
        origin: "Designed in Berlin, made in Shenzhen",
        warnings: [
          "Use only with water and fragrance oils intended for this purpose.",
          "Do not place within immediate reach of children under three years.",
          "Old appliances do not belong in household waste. Return them to us or to your municipal recycling centre.",
        ],
      },
    },
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
    translations: {
      en: {
        category: "Night Care",
        tagline: "Regenerating facial oil with black sesame",
        description:
          "Six plant oils, cold pressed, with squalane and vitamin E, in an amber glass bottle with " +
          "a matt coating. The texture absorbs in about ninety seconds and leaves no film. The " +
          "scent comes from the oils themselves, no perfume oil is added. The naturally occurring " +
          "fragrance substances linalool and limonene are declared.",
        ritual: "Three to four drops in the evening on damp skin, working from the centre outwards.",
        origin: "Made in France",
        warnings: [
          "For external use only.",
          "Avoid contact with the eyes.",
          "Do not use on irritated or damaged skin.",
        ],
      },
    },
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
    translations: {
      en: {
      name: "Obsidian Gua Sha and Ritual Oil",
        category: "Ritual Tools",
        tagline: "Hand-ground obsidian with 30 ml carrier oil",
        description:
          "The stone sits heavy in the hand and stays cool. Every edge is ground individually, so " +
          "no two pieces are alike. The enclosed oil is deliberately kept neutral, so that it lets " +
          "the skin glide without adding scent.",
        ritual: "After the oil, in calm strokes from the jaw to the temple.",
        unitsLabel: "1 stone, 1 bottle 30 ml",
        origin: "Stone from Mexico, oil from Italy",
        material: "Volcanic glass, polished, uncoated",
        care: "Rinse with lukewarm water after use and rub dry.",
        warnings: [
          "Do not use on inflamed or damaged skin.",
          "The stone is fragile, do not drop it on hard surfaces.",
        ],
        cosmeticName: "Enclosed carrier oil",
        cosmeticWarnings: [
          "For external use only.",
          "Avoid contact with the eyes.",
        ],
      },
    },
  },
  {
    id: "yin-05",
    slug: "daily-ritual-inhaler-night",
    code: "YIN 05",
    name: "Daily Ritual Inhaler, Night",
    collection: "yin",
    category: "Atem",
    tagline: "Der Nacht-Inhalator in Schwarz, Lavendel und Zeder, mit Balsam",
    description:
      "Derselbe Stick in Schwarz, für den Abend gestimmt. Oben der Inhalator mit wenig Menthol, " +
      "dafür Lavendel, Zeder und Vetiver, ein langsamer Zug, der den Tag zurücknimmt. Unten unter " +
      "der Kappe ein Balsam für Schläfen und Nacken. Das Gegenstück für den Morgen ist der weisse " +
      "Stick aus Yang.",
    ritual: "Vor dem Schlafen eine Hälfte ans Nasenloch, drei ruhige Züge je Seite. Den Balsam an Schläfen und Nacken tupfen.",
    priceCents: 1800,
    netQuantity: null,
    unitsLabel: "1 Stick, Inhalator 2 g, Balsam 4 g",
    origin: "Hergestellt in Thailand",
    vessel: { body: "#0E0E0E", print: "#F2F2F2", cap: "#1A1A1A", shape: "column", finish: "matte" },
    regulatory: {
      kind: "accessory",
      material: "Hülse aus Polypropylen mit Baumwolldocht, Kappe aus Polypropylen",
      care: "Verschlossen aufbewahren, nicht über 30 Grad, nicht in der Sonne liegen lassen.",
      // Same reasoning as the day stick: the inhaled part is not a cosmetic and
      // carries a composition list and CLP label elements. Classification to be
      // confirmed against the manufacturer's safety data sheet before sale.
      ingredients: [
        "Lavandula Angustifolia Oil",
        "Cedrus Atlantica Bark Oil",
        "Menthol",
        "Vetiveria Zizanoides Root Oil",
        "Chamaecyparis Obtusa Wood Oil",
        "Camphor",
        "Borneol",
      ],
      clpSignalWord: "Achtung",
      clpStatements: [
        "H315 Verursacht Hautreizungen.",
        "H319 Verursacht schwere Augenreizung.",
        "H317 Kann allergische Hautreaktionen verursachen.",
        "P102 Darf nicht in die Hände von Kindern gelangen.",
        "P305+P351+P338 Bei Kontakt mit den Augen: Einige Minuten lang behutsam mit Wasser spülen.",
      ],
      warnings: [
        "Nur zum Einatmen durch die Nase, nicht verschlucken.",
        "Nicht für Kinder unter zwölf Jahren.",
        "Nicht bei Asthma oder Atemwegserkrankungen ohne ärztlichen Rat anwenden.",
        "Kein Arzneimittel. Lindert oder heilt keine Krankheit, auch keine Schlafstörung.",
      ],
      cosmetic: {
        name: "Balsam unter der Kappe",
        netQuantity: { value: 4, unit: "g" },
        inci: [
          "Petrolatum",
          "Lavandula Angustifolia Oil",
          "Cedrus Atlantica Bark Oil",
          "Menthol",
          "Vetiveria Zizanoides Root Oil",
          "Chamaecyparis Obtusa Wood Oil",
          "Linalool",
          "Limonene",
          "Geraniol",
        ],
        allergens: ["Linalool", "Limonene", "Geraniol"],
        pao: "12M",
        cpnpReference: "CPNP-DEMO-YIN05-BALSAM",
        warnings: [
          "Nur äusserlich, dünn auf Schläfen oder Nacken.",
          "Nicht auf Schleimhäute, nicht in die Augen, nicht auf verletzte Haut.",
          "Nicht bei Kindern unter drei Jahren anwenden.",
        ],
      },
    },
    order: 5,
    translations: {
      en: {
        category: "Breath",
        tagline: "The night inhaler in black, lavender and cedar, with balm",
        description:
          "The same stick in black, tuned for the evening. At the top, the inhaler with little " +
          "menthol and instead lavender, cedar and vetiver, a slow breath that takes back the day. " +
          "At the bottom, under the cap, a balm for the temples and neck. Its counterpart for the " +
          "morning is the white stick from Yang.",
        ritual: "Before sleep, hold one half to the nostril, three calm breaths on each side. Dab the balm on the temples and neck.",
        unitsLabel: "1 stick, inhaler 2 g, balm 4 g",
        origin: "Made in Thailand",
        material: "Polypropylene tube with cotton wick, polypropylene cap",
        care: "Keep closed, do not store above 30 degrees, do not leave in the sun.",
        warnings: [
          "For inhalation through the nose only, do not swallow.",
          "Not for children under twelve years.",
          "Do not use in case of asthma or respiratory disease without medical advice.",
          "Not a medicinal product. It does not relieve or cure any illness, including sleep disorders.",
        ],
        clpStatements: [
          "H315 Causes skin irritation.",
          "H319 Causes serious eye irritation.",
          "H317 May cause an allergic skin reaction.",
          "P102 Keep out of reach of children.",
          "P305+P351+P338 IF IN EYES: Rinse cautiously with water for several minutes. Remove contact lenses, if present and easy to do. Continue rinsing.",
        ],
        cosmeticName: "Balm under the cap",
        cosmeticWarnings: [
          "External use only, apply thinly to the temples or neck.",
          "Not on mucous membranes, not in the eyes, not on damaged skin.",
          "Do not use on children under three years.",
        ],
      },
    },
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
    translations: {
      en: {
        category: "Scented Candle",
        tagline: "Japanese cypress, cedarwood, cold smoke",
        description:
          "Rapeseed wax in a matt stoneware vessel that remains as a container once the candle has " +
          "burnt down. The wick is made of wood and crackles quietly. Burns for about fifty hours.",
        ritual: "Light it and let it burn until the pool of wax reaches the rim. Otherwise it burns unevenly.",
        origin: "Poured in Portugal",
        warnings: [
          "Never leave a burning candle unattended.",
          "Keep away from children and pets.",
          "Keep at least ten centimetres away from other candles.",
          "Trim the wick to five millimetres before each lighting.",
          "Do not place on delicate surfaces, the vessel becomes hot.",
        ],
        clpStatements: [
          "Contains Cedrol, Limonene, Linalool. May produce an allergic reaction.",
        ],
      },
    },
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
    translations: {
      en: {
        category: "Lips",
        tagline: "Shade Chalk Nude, velvet matt",
        description:
          "A texture between a pencil and a cream. It goes on in a single layer without weighing " +
          "down the lip and dries to a dry matt finish that hardly transfers. The tube is chalk " +
          "white and unlacquered on the outside, so that it takes on fingerprints instead of " +
          "mirroring them.",
        ritual: "Apply from the centre outwards, then blend once with a finger.",
        unitsLabel: "3.5 g",
        origin: "Made in South Korea",
        warnings: [
          "In case of contact with the eyes, rinse thoroughly with water.",
          "Do not use on chapped or damaged lips.",
        ],
      },
    },
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
    translations: {
      en: {
        category: "Eyes",
        tagline: "Transparent gloss with a pearl core",
        description:
          "An eyeshadow that sits like glass. The applicator is cut flat, so the layer stays thin. " +
          "The pearl core shifts in the light, the colour itself remains colourless.",
        ritual: "Dab onto the mobile lid, do not drag. Blink once, then it sets.",
        origin: "Made in Japan",
        warnings: [
          "Do not use along the waterline.",
          "Apply carefully if you wear contact lenses, discontinue use in case of irritation.",
        ],
      },
    },
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
    translations: {
      en: {
        category: "Complexion",
        tagline: "Compact case in chalk white",
        description:
          "The case is made of matt plastic and can be opened without looking. The cushion releases " +
          "the emulsion slowly, so the application can be controlled. The insert sits loosely in " +
          "the case and can be taken out for cleaning.",
        ritual: "Work in short dabs, start at the nose and let it fade outwards.",
        origin: "Made in South Korea",
        warnings: [
          "Do not touch the cushion with wet fingers.",
        ],
      },
    },
  },
  {
    id: "yang-05",
    slug: "daily-ritual-inhaler-day",
    code: "YANG 05",
    name: "Daily Ritual Inhaler, Day",
    collection: "yang",
    category: "Atem",
    tagline: "Der Tag-Inhalator in Weiss, Menthol und Hinoki, mit Balsam",
    description:
      "Ein Stick in zwei Hälften, wie die Kräuterinhalatoren aus Thailand, in Weiss für den Tag. " +
      "Oben der Inhalator mit Menthol, Kampfer, Borneol und Hinoki, ein Zug durch die Nase, kalt " +
      "und klar. Unten unter der Kappe ein fester Balsam für Schläfen und Nacken. Das Gegenstück " +
      "für den Abend ist der schwarze Stick aus Yin.",
    ritual: "Eine Hälfte ans Nasenloch, ruhig einatmen, drei Züge je Seite. Den Balsam mit der Fingerspitze an die Schläfen tupfen.",
    priceCents: 1800,
    netQuantity: null,
    unitsLabel: "1 Stick, Inhalator 2 g, Balsam 4 g",
    origin: "Hergestellt in Thailand",
    vessel: { body: "#F2F1EE", print: "#111111", cap: "#101010", shape: "column", finish: "matte" },
    regulatory: {
      kind: "accessory",
      material: "Hülse aus Polypropylen mit Baumwolldocht, Kappe aus Polypropylen",
      care: "Verschlossen aufbewahren, nicht über 30 Grad, nicht in der Sonne liegen lassen.",
      // Declared blend of the inhaled part. Not a cosmetic, it is not applied to
      // the body, so it carries a composition list and CLP label elements
      // instead of an INCI list. The classification below is the usual one for
      // a menthol and camphor blend and must be confirmed against the
      // manufacturer's safety data sheet before sale, like the CPNP references.
      ingredients: [
        "Menthol",
        "Camphor",
        "Borneol",
        "Eucalyptus Globulus Leaf Oil",
        "Mentha Piperita Oil",
        "Chamaecyparis Obtusa Wood Oil",
        "Eugenia Caryophyllus Flower Oil",
      ],
      clpSignalWord: "Achtung",
      clpStatements: [
        "H315 Verursacht Hautreizungen.",
        "H319 Verursacht schwere Augenreizung.",
        "H317 Kann allergische Hautreaktionen verursachen.",
        "P102 Darf nicht in die Hände von Kindern gelangen.",
        "P305+P351+P338 Bei Kontakt mit den Augen: Einige Minuten lang behutsam mit Wasser spülen.",
      ],
      warnings: [
        "Nur zum Einatmen durch die Nase, nicht verschlucken.",
        "Nicht für Kinder unter zwölf Jahren.",
        "Nicht bei Asthma oder Atemwegserkrankungen ohne ärztlichen Rat anwenden.",
        "Kein Arzneimittel. Lindert oder heilt keine Krankheit.",
      ],
      cosmetic: {
        name: "Balsam unter der Kappe",
        netQuantity: { value: 4, unit: "g" },
        inci: [
          "Petrolatum",
          "Menthol",
          "Camphor",
          "Eucalyptus Globulus Leaf Oil",
          "Mentha Piperita Oil",
          "Chamaecyparis Obtusa Wood Oil",
          "Eugenia Caryophyllus Flower Oil",
          "Limonene",
          "Eugenol",
        ],
        allergens: ["Limonene", "Eugenol"],
        pao: "12M",
        cpnpReference: "CPNP-DEMO-YANG05-BALSAM",
        warnings: [
          "Nur äusserlich, dünn auf Schläfen oder Nacken.",
          "Nicht auf Schleimhäute, nicht in die Augen, nicht auf verletzte Haut.",
          "Nicht bei Kindern unter drei Jahren anwenden.",
        ],
      },
    },
    order: 5,
    translations: {
      en: {
        category: "Breath",
        tagline: "The day inhaler in white, menthol and hinoki, with balm",
        description:
          "A stick in two halves, like the herbal inhalers from Thailand, in white for the day. At " +
          "the top, the inhaler with menthol, camphor, borneol and hinoki, one breath through the " +
          "nose, cold and clear. At the bottom, under the cap, a solid balm for the temples and " +
          "neck. Its counterpart for the evening is the black stick from Yin.",
        ritual: "Hold one half to the nostril, breathe in calmly, three breaths on each side. Dab the balm onto the temples with a fingertip.",
        unitsLabel: "1 stick, inhaler 2 g, balm 4 g",
        origin: "Made in Thailand",
        material: "Polypropylene tube with cotton wick, polypropylene cap",
        care: "Keep closed, do not store above 30 degrees, do not leave in the sun.",
        warnings: [
          "For inhalation through the nose only, do not swallow.",
          "Not for children under twelve years.",
          "Do not use in case of asthma or respiratory disease without medical advice.",
          "Not a medicinal product. It does not relieve or cure any illness.",
        ],
        clpStatements: [
          "H315 Causes skin irritation.",
          "H319 Causes serious eye irritation.",
          "H317 May cause an allergic skin reaction.",
          "P102 Keep out of reach of children.",
          "P305+P351+P338 IF IN EYES: Rinse cautiously with water for several minutes. Remove contact lenses, if present and easy to do. Continue rinsing.",
        ],
        cosmeticName: "Balm under the cap",
        cosmeticWarnings: [
          "External use only, apply thinly to the temples or neck.",
          "Not on mucous membranes, not in the eyes, not on damaged skin.",
          "Do not use on children under three years.",
        ],
      },
    },
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
    translations: {
      en: {
        category: "Care",
        tagline: "Two phases, shake before use",
        description:
          "At the bottom, the aqueous phase with hyaluronic acid, on top a light oil phase. When " +
          "shaken, the two combine for about twenty seconds, exactly as long as the application " +
          "takes. Then they separate again, which is intended.",
        ritual: "In the morning after cleansing, press into skin that is still damp.",
        origin: "Made in Japan",
        warnings: [
          "Shake well before each use.",
          "Store in a cool place, protected from direct sunlight.",
        ],
      },
    },
  },
];

export function getProductsByCollection(collection: Collection): Product[] {
  return PRODUCTS.filter((p) => p.collection === collection).sort((a, b) => a.order - b.order);
}

/**
 * The product in the given language. German is the product itself; English
 * returns a copy with the translated words in place, so every component keeps
 * reading product.tagline, product.ritual and the regulatory block as before.
 */
export function localizeProduct(product: Product, lang: "de" | "en"): Product {
  const en = lang === "en" ? product.translations?.en : undefined;
  if (!en) return product;
  const reg = product.regulatory;
  let regulatory: Regulatory = reg;
  if (en.warnings && en.warnings.length === reg.warnings.length) {
    regulatory = { ...reg, warnings: en.warnings } as Regulatory;
  }
  if (regulatory.kind === "candle" && en.clpStatements) {
    regulatory = { ...regulatory, clpStatements: en.clpStatements };
  }
  if (regulatory.kind === "accessory") {
    regulatory = {
      ...regulatory,
      material: en.material ?? regulatory.material,
      care: en.care ?? regulatory.care,
      clpStatements: en.clpStatements ?? regulatory.clpStatements,
      cosmetic:
        regulatory.cosmetic && (en.cosmeticWarnings || en.cosmeticName)
          ? {
              ...regulatory.cosmetic,
              name: en.cosmeticName ?? regulatory.cosmetic.name,
              warnings:
                en.cosmeticWarnings && en.cosmeticWarnings.length === regulatory.cosmetic.warnings.length
                  ? en.cosmeticWarnings
                  : regulatory.cosmetic.warnings,
            }
          : regulatory.cosmetic,
    };
  }
  return {
    ...product,
    name: en.name ?? product.name,
    category: en.category ?? product.category,
    tagline: en.tagline,
    description: en.description,
    ritual: en.ritual,
    unitsLabel: en.unitsLabel ?? product.unitsLabel,
    origin: en.origin ?? product.origin,
    regulatory,
  };
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
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
