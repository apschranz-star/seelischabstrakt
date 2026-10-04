/*
 * Die Erkrankungen, als Bausteine.
 *
 * Jede Erkrankung, die im Profil gewaehlt ist, bringt mit, was sie braucht:
 * eigene Schieberegler auf der Heute-Seite, eigene Zeichen, eine eigene Frage
 * des Tages, Laborwerte, Essensregeln, Vorlieben fuer die Rezepte, eine
 * Suchanfrage fuer die monatliche Forschungsuebersicht und Fragen fuer den
 * Termin. Zwei oder drei gewaehlte Erkrankungen ergeben eine App, die alle
 * zusammen abbildet; doppelte Regler (Gelenke bei Lupus und Arthritis) stehen
 * nur einmal da.
 *
 * WAS HIER STEHT UND WAS NICHT
 * Allgemeine Information aus Leitlinien und Uebersichtsarbeiten, vorsichtig
 * formuliert. Nichts davon ist eine Verordnung, nichts sagt, welche Dosis
 * richtig ist. Wo die Belege duenn sind, steht das dabei.
 *
 * TECHNIK, NICHT SPRACHE
 * id, schluessel, wert, art, ton, einheit und die Werte in zeichen und labor
 * sind Schluessel. Unter ihnen liegen die Eintraege einer echten Nutzerin.
 * Wer sie umbenennt, nimmt ihr die Eintraege weg. werkzeug/pruefe-module.js
 * prueft, dass jeder Text auf Deutsch und Englisch dasteht und dass jeder
 * Verweis auf ein Zeichen oder einen Laborwert aufgeht.
 */

/* Alkohol in Zutatenlisten, Deutsch und Englisch. Weinessig und Weinstein
   sind kein Alkohol, Mirin und Kochwein schon. */
const ALKOHOL = "\\b(red |white |dry |cooking )?wine\\b(?! vinegar)|\\b(rum|vodka|brandy|liqueur|bourbon|whiske?y|sherry|prosecco|champagne|marsala|amaretto|cognac|mirin|sake|beer)\\b|(rot|weiss|wei\u00df|koch|port)wein(?!essig)|\\bwein\\b(?!essig|stein)|wodka|lik(\u00f6|oe)r|\\bsekt\\b|\\bprosecco\\b|\\bcognac\\b|weinbrand|\\bbier\\b";

window.ANKER_MODULE = [

/* -------------------------------------------------------------- Zoeliakie */
{
  id: "zoeliakie",
  farbe: "#2fae7a",
  name: { de: "Zoeliakie", en: "Coeliac disease" },
  kurz: { de: "Zoeliakie", en: "Coeliac" },
  beschreibung: {
    de: "Glutenfreie Ernaehrung ist die Behandlung. Die App fragt jeden Tag nach dem Essen und behaelt die Werte im Blick, die bei Zoeliakie kippen.",
    en: "A gluten free diet is the treatment. The app asks about food every day and keeps an eye on the values that drift in coeliac disease.",
  },
  skalen: [
    { schluessel: "bauch", name: { de: "Bauch", en: "Gut" }, links: { de: "ruhig", en: "settled" }, rechts: { de: "starke Beschwerden", en: "severe discomfort" } },
  ],
  checks: [
    {
      schluessel: "gluten",
      frage: { de: "Der Tag beim Essen", en: "The day at the table" },
      optionen: [
        { wert: "sicher", ton: "gut", text: { de: "Alles sicher", en: "All safe" } },
        { wert: "unsicher", ton: "mittel", text: { de: "Etwas war unsicher", en: "Something was uncertain" } },
        { wert: "exposition", ton: "schlecht", text: { de: "Gluten bekommen", en: "Got gluten" } },
      ],
    },
  ],
  zeichen: ["Bauchschmerz", "Blaehungen", "Durchfall", "Verstopfung", "Uebelkeit", "Mundgeschwuere", "Kopfschmerz"],
  labor: ["ttg", "iga", "hb", "ferritin", "vitd", "b12", "folat"],
  essen: [
    { art: "weg", was: { de: "Weizen, Roggen, Gerste, Dinkel und alles daraus", en: "Wheat, rye, barley, spelt and everything made from them" }, warum: { de: "Schon kleine Mengen schaedigen die Duenndarmschleimhaut, auch ohne spuerbare Beschwerden.", en: "Even small amounts damage the small intestine lining, with or without symptoms." } },
    { art: "vorsicht", was: { de: "Hafer nur als glutenfrei gekennzeichnet", en: "Oats only when labelled gluten free" }, warum: { de: "Normaler Hafer ist fast immer verunreinigt. Ein kleiner Teil der Betroffenen vertraegt auch reinen Hafer nicht; das zeigt der Verlauf, nicht ein Gefuehl.", en: "Regular oats are almost always contaminated. A small share of people also react to pure oats; the course shows it, not a feeling." } },
    { art: "vorsicht", was: { de: "Sojasauce, Malz, Bruehen, Fertigsaucen", en: "Soy sauce, malt, stocks, ready sauces" }, warum: { de: "Die haeufigsten versteckten Quellen. Das Zutatenverzeichnis jedes Mal lesen, Rezepturen aendern sich.", en: "The most common hidden sources. Read the ingredient list every time, recipes change." } },
    { art: "gut", was: { de: "Eisen, Kalzium, Vitamin D, Folsaeure, B12 im Blick", en: "Iron, calcium, vitamin D, folate, B12 in view" }, warum: { de: "Bei Zoeliakie oft niedrig, besonders am Anfang. Messen lassen statt auf Verdacht ergaenzen.", en: "Often low in coeliac disease, especially at first. Have them measured rather than supplementing on a hunch." } },
  ],
  rezepte: { bevorzugt: ["eisen", "kalzium"], meiden: [] },
  signale: [
    { check: "gluten", werte: ["exposition"], ab: 2, text: { de: "Mehrmals Gluten in zwei Wochen. Versteckte Quellen suchen: Sojasauce, Bruehen, Hafer, gemeinsamer Toaster. Halten Beschwerden trotz Diaet an, gehoert das zum Termin.", en: "Gluten several times in two weeks. Look for hidden sources: soy sauce, stocks, oats, a shared toaster. If symptoms persist despite the diet, raise it at the appointment." } },
  ],
  forschung: {
    suche: '("celiac disease"[MeSH Terms] OR celiac[tiab] OR coeliac[tiab])',
  },
  fragen: [
    { de: "Brauche ich eine Ueberweisung zur Diaetologie?", en: "Do I need a referral to a dietitian?" },
  ],
},

/* ------------------------------------------------------------------- SLE */
{
  id: "sle",
  farbe: "#8a63ff",
  name: { de: "Systemischer Lupus (SLE)", en: "Systemic lupus (SLE)" },
  kurz: { de: "Lupus", en: "Lupus" },
  beschreibung: {
    de: "Lupus zeigt sich ueberall ein wenig. Die App sammelt Gelenke, Haut, Kopf und Muedigkeit an einer Stelle, damit beim Termin das Muster sichtbar wird.",
    en: "Lupus shows up a little everywhere. The app gathers joints, skin, head and fatigue in one place, so the pattern is visible at the appointment.",
  },
  skalen: [
    { schluessel: "gelenke", name: { de: "Gelenke", en: "Joints" }, links: { de: "frei", en: "free" }, rechts: { de: "steif, geschwollen", en: "stiff, swollen" } },
    { schluessel: "nebel", name: { de: "Kopf klar", en: "Clear head" }, links: { de: "klar", en: "clear" }, rechts: { de: "im Nebel", en: "foggy" } },
  ],
  checks: [
    {
      schluessel: "sonne",
      frage: { de: "Sonne und Licht", en: "Sun and light" },
      optionen: [
        { wert: "geschuetzt", ton: "gut", text: { de: "Geschuetzt", en: "Protected" } },
        { wert: "etwas", ton: "mittel", text: { de: "Etwas abbekommen", en: "Got a little" } },
        { wert: "viel", ton: "schlecht", text: { de: "Viel abbekommen", en: "Got a lot" } },
      ],
    },
  ],
  zeichen: ["Gelenkschmerz", "Morgensteifigkeit", "Schmetterlingsausschlag", "anderer Ausschlag", "Lichtempfindlich", "Mundgeschwuere", "Haarausfall", "Fieber", "Lymphknoten", "Raynaud", "trockene Augen", "trockener Mund", "Kopfschmerz", "Brustschmerz beim Atmen", "Herzrasen", "Kurzatmig", "geschwollene Beine", "schaeumender Urin", "Muskelschmerz"],
  labor: ["dsdna", "c3", "c4", "bsg", "crp", "kreatinin", "upcr", "hb", "leuko", "thrombo", "vitd", "alt"],
  essen: [
    { art: "gut", was: { de: "Mediterranes Muster", en: "A Mediterranean pattern" }, warum: { de: "Gemuese, Huelsenfruechte, Olivenoel, Fisch. Es gibt Hinweise auf weniger Krankheitsaktivitaet und ein besseres Herzrisiko, aber keine Diaet, die Lupus heilt.", en: "Vegetables, pulses, olive oil, fish. There are signals of lower disease activity and better heart risk, but no diet cures lupus." } },
    { art: "weg", was: { de: "Alfalfa-Sprossen", en: "Alfalfa sprouts" }, warum: { de: "Enthalten L-Canavanin, das in Berichten Lupus-aehnliche Schuebe ausgeloest hat. Die Belege sind alt und duenn, der Verzicht kostet nichts.", en: "Contain L-canavanine, reported to trigger lupus-like flares. The evidence is old and thin, giving them up costs nothing." } },
    { art: "vorsicht", was: { de: "Echinacea und andere Immun-Booster", en: "Echinacea and other immune boosters" }, warum: { de: "Sollen das Immunsystem anregen, genau das ist bei Lupus nicht das Ziel. Vorher in der Sprechstunde fragen.", en: "Meant to stimulate the immune system, which is not the goal in lupus. Ask at the clinic first." } },
    { art: "gut", was: { de: "Kalzium und Vitamin D bei Kortison", en: "Calcium and vitamin D with steroids" }, warum: { de: "Kortison kostet Knochen. Ob und wie viel ergaenzt wird, entscheidet die Aerztin nach Messung.", en: "Steroids cost bone. Whether and how much to supplement is decided by the doctor after measuring." } },
  ],
  rezepte: { bevorzugt: ["mediterran", "omega3", "kalzium"], meiden: [] },
  rezeptAchtung: [
    { muster: "alfalfa|luzerne", text: { de: "Alfalfa-Sprossen: bei Lupus besser weglassen.", en: "Alfalfa sprouts: better left out with lupus." } },
  ],
  warnzeichen: [
    { zeichen: "Brustschmerz beim Atmen", text: { de: "Kann eine Entzuendung von Rippenfell oder Herzbeutel sein. Zeitnah aerztlich abklaeren lassen, bei Atemnot sofort.", en: "May be inflammation of the lining of the lungs or heart. Have it checked soon, at once if you are short of breath." } },
    { zeichen: "schaeumender Urin", text: { de: "Kann Eiweiss im Urin bedeuten, ein fruehes Zeichen einer Nierenbeteiligung. Urin untersuchen lassen.", en: "May mean protein in the urine, an early sign of kidney involvement. Have the urine tested." } },
    { zeichen: "geschwollene Beine", text: { de: "Wassereinlagerungen koennen mit der Niere zusammenhaengen. Ansprechen und den Urin pruefen lassen.", en: "Fluid in the legs can be related to the kidneys. Mention it and have the urine checked." } },
    { zeichen: "Kurzatmig", text: { de: "Lunge, Herz oder Blutarmut koennen dahinterstecken. Zeitnah abklaeren, bei Atemnot in Ruhe sofort.", en: "Lungs, heart or anaemia may be behind it. Have it checked soon, at once if breathless at rest." } },
    { zeichen: "Fieber", text: { de: "Kann ein Schub oder ein Infekt sein, unter Immunsuppression zaehlt beides. Mit der Praxis klaeren.", en: "May be a flare or an infection, and on immunosuppression both matter. Check with the clinic." } },
  ],
  signale: [
    { check: "sonne", werte: ["viel"], ab: 3, text: { de: "Oft viel Sonne abbekommen. UV-Licht kann Haut- und Allgemeinschuebe ausloesen, Schutz lohnt sich jeden Tag.", en: "Often a lot of sun. UV light can trigger skin and general flares, protection pays off every day." } },
  ],
  forschung: {
    suche: '("lupus erythematosus, systemic"[MeSH Terms] OR "systemic lupus"[tiab])',
  },
  fragen: [
    { de: "Wie aktiv ist mein Lupus gerade, in Zahlen?", en: "How active is my lupus right now, in numbers?" },
    { de: "Wann wurde zuletzt der Urin auf Eiweiss geprueft?", en: "When was my urine last checked for protein?" },
    { de: "Wann ist die naechste Netzhautkontrolle faellig?", en: "When is the next retina check due?" },
  ],
},

/* -------------------------------------------------------------- Psoriasis */
{
  id: "psoriasis",
  farbe: "#ff8a3d",
  name: { de: "Psoriasis", en: "Psoriasis" },
  kurz: { de: "Psoriasis", en: "Psoriasis" },
  beschreibung: {
    de: "Haut, Juckreiz und Gelenke. Gelenkbeschwerden bei Psoriasis gehoeren frueh angesprochen, weil eine Psoriasis-Arthritis behandelbar ist, bevor sie Schaden macht.",
    en: "Skin, itch and joints. Joint complaints with psoriasis belong in the conversation early, because psoriatic arthritis can be treated before it does damage.",
  },
  skalen: [
    { schluessel: "haut", name: { de: "Haut", en: "Skin" }, links: { de: "ruhig", en: "calm" }, rechts: { de: "stark befallen", en: "widespread" } },
    { schluessel: "juckreiz", name: { de: "Juckreiz", en: "Itch" }, links: { de: "keiner", en: "none" }, rechts: { de: "quaelend", en: "unbearable" } },
  ],
  checks: [
    {
      schluessel: "hautpflege",
      frage: { de: "Haut gepflegt und behandelt", en: "Skin cared for and treated" },
      optionen: [
        { wert: "ja", ton: "gut", text: { de: "Wie geplant", en: "As planned" } },
        { wert: "teilweise", ton: "mittel", text: { de: "Teilweise", en: "Partly" } },
        { wert: "nein", ton: "schlecht", text: { de: "Heute nicht", en: "Not today" } },
      ],
    },
  ],
  zeichen: ["neue Plaques", "Kopfhaut", "Naegel", "Hautrisse", "Gelenkschmerz", "Morgensteifigkeit", "geschwollener Finger oder Zeh", "Infekt"],
  eigeneZeichen: [
    { schluessel: "neue Plaques", de: "neue Plaques", en: "new plaques" },
    { schluessel: "Kopfhaut", de: "Kopfhaut", en: "scalp" },
    { schluessel: "Naegel", de: "Naegel", en: "nails" },
    { schluessel: "Hautrisse", de: "Hautrisse", en: "cracked skin" },
    { schluessel: "geschwollener Finger oder Zeh", de: "geschwollener Finger oder Zeh", en: "swollen finger or toe" },
    { schluessel: "Infekt", de: "Infekt, Halsweh", en: "infection, sore throat" },
  ],
  labor: ["crp", "bsg", "alt"],
  essen: [
    { art: "gut", was: { de: "Gewicht und mediterranes Muster", en: "Weight and a Mediterranean pattern" }, warum: { de: "Bei Uebergewicht bessert Abnehmen die Haut in Studien messbar und laesst Medikamente besser wirken.", en: "With excess weight, losing some improves skin measurably in studies and helps treatment work better." } },
    { art: "vorsicht", was: { de: "Alkohol", en: "Alcohol" }, warum: { de: "Haengt mit schwereren Verlaeufen zusammen und vertraegt sich mit einigen Medikamenten schlecht, etwa Methotrexat.", en: "Linked with more severe courses and does not mix well with some drugs, such as methotrexate." } },
    { art: "vorsicht", was: { de: "Glutenfrei nur mit Grund", en: "Gluten free only with a reason" }, warum: { de: "Hilft in Studien nur, wenn Zoeliakie-Antikoerper nachweisbar sind. Dann aber deutlich. Testen lassen statt raten.", en: "In studies it only helps when coeliac antibodies are present. Then it helps clearly. Test, do not guess." } },
  ],
  rezepte: { bevorzugt: ["mediterran", "omega3"], meiden: [] },
  rezeptAchtung: [
    { muster: ALKOHOL, text: { de: "Enthaelt Alkohol. Bei Psoriasis und unter Methotrexat zurueckhaltend, beim Kochen verfliegt nicht alles.", en: "Contains alcohol. Go easy with psoriasis and on methotrexate, cooking does not remove all of it." } },
  ],
  warnzeichen: [
    { zeichen: "geschwollener Finger oder Zeh", text: { de: "Ein ganz geschwollener Finger oder Zeh ist typisch fuer eine Psoriasis-Arthritis. Frueh in der Dermatologie oder Rheumatologie ansprechen.", en: "A whole swollen finger or toe is typical of psoriatic arthritis. Raise it early with dermatology or rheumatology." } },
    { zeichen: "Infekt", text: { de: "Halsentzuendungen durch Streptokokken koennen einen Psoriasis-Schub ausloesen, unter systemischer Behandlung zaehlt jeder Infekt. Der Praxis sagen.", en: "Strep throat can trigger a psoriasis flare, and on systemic treatment every infection matters. Tell the clinic." } },
  ],
  forschung: {
    suche: '(psoriasis[MeSH Terms] OR psoria*[tiab])',
  },
  fragen: [
    { de: "Koennten meine Gelenkbeschwerden eine Psoriasis-Arthritis sein?", en: "Could my joint complaints be psoriatic arthritis?" },
    { de: "Wie gross ist der befallene Hautanteil, und ist eine systemische Behandlung sinnvoll?", en: "How much skin is affected, and would systemic treatment make sense?" },
    { de: "Sollen Blutdruck, Blutfette und Blutzucker kontrolliert werden?", en: "Should blood pressure, lipids and blood sugar be checked?" },
  ],
},

/* -------------------------------------------------------------- Hashimoto */
{
  id: "hashimoto",
  farbe: "#2aa7c9",
  name: { de: "Hashimoto-Thyreoiditis", en: "Hashimoto's thyroiditis" },
  kurz: { de: "Hashimoto", en: "Hashimoto" },
  beschreibung: {
    de: "Viel haengt an einer Tablette zur richtigen Zeit und an einem Wert. Die App fragt nach dem einen und behaelt den anderen im Verlauf.",
    en: "A lot depends on one tablet at the right time and on one value. The app asks about the first and keeps the second over time.",
  },
  skalen: [
    { schluessel: "kaelte", name: { de: "Kaelteempfinden", en: "Feeling cold" }, links: { de: "normal", en: "normal" }, rechts: { de: "staendig kalt", en: "always cold" } },
  ],
  checks: [
    {
      schluessel: "levo",
      frage: { de: "Schilddruesentablette", en: "Thyroid tablet" },
      optionen: [
        { wert: "nuechtern", ton: "gut", text: { de: "Nuechtern genommen", en: "Taken fasting" } },
        { wert: "mitessen", ton: "mittel", text: { de: "Mit Essen oder Kaffee", en: "With food or coffee" } },
        { wert: "vergessen", ton: "schlecht", text: { de: "Vergessen", en: "Forgot" } },
      ],
    },
  ],
  zeichen: ["Kaelteempfindlich", "Gewicht steigt", "trockene Haut", "Haarausfall", "Verstopfung", "Herzrasen", "Stimmung gedrueckt"],
  eigeneZeichen: [
    { schluessel: "Kaelteempfindlich", de: "kaelteempfindlich", en: "sensitive to cold" },
    { schluessel: "Gewicht steigt", de: "Gewicht steigt", en: "weight going up" },
    { schluessel: "trockene Haut", de: "trockene Haut", en: "dry skin" },
    { schluessel: "Stimmung gedrueckt", de: "Stimmung gedrueckt", en: "low mood" },
  ],
  labor: ["tsh", "ft4", "tpo"],
  eigeneLabor: [
    { schluessel: "ft4", einheit: "pmol/l", name: { de: "fT4", en: "fT4" }, gruppe: { de: "Schilddruese", en: "Thyroid" }, bedeutung: { de: "Das freie Schilddruesenhormon. Zusammen mit dem TSH sagt es, ob die Dosis passt. Blut am besten vor der Tabletteneinnahme abnehmen lassen.", en: "The free thyroid hormone. Together with TSH it shows whether the dose fits. Best to have blood taken before the tablet." } },
    { schluessel: "tpo", einheit: "IU/ml", name: { de: "TPO-Antikoerper", en: "TPO antibodies" }, gruppe: { de: "Schilddruese", en: "Thyroid" }, bedeutung: { de: "Bestaetigen die Autoimmunerkrankung. Ihre Hoehe steuert nicht die Behandlung und muss nicht laufend gemessen werden.", en: "Confirm the autoimmune disease. Their level does not steer treatment and does not need regular measuring." } },
  ],
  essen: [
    { art: "gut", was: { de: "Tablette nuechtern, mit Wasser", en: "Tablet fasting, with water" }, warum: { de: "30 bis 60 Minuten vor dem Fruehstueck, immer gleich. Kaffee, Soja und Ballaststoffe dazwischen verringern die Aufnahme.", en: "30 to 60 minutes before breakfast, always the same way. Coffee, soy and fibre in between reduce absorption." } },
    { art: "vorsicht", was: { de: "Kalzium, Eisen und Magnesium mit Abstand", en: "Calcium, iron and magnesium spaced apart" }, warum: { de: "Mindestens vier Stunden Abstand zur Tablette, sonst wird weniger Hormon aufgenommen.", en: "At least four hours away from the tablet, otherwise less hormone is absorbed." } },
    { art: "vorsicht", was: { de: "Jod und Selen nicht auf eigene Faust", en: "Iodine and selenium not on your own" }, warum: { de: "Normale Ernaehrung mit Jodsalz reicht. Hoch dosierte Praeparate koennen schaden, der Nutzen von Selen ist nicht gesichert.", en: "A normal diet with iodised salt is enough. High-dose products can harm, the benefit of selenium is not established." } },
  ],
  rezepte: { bevorzugt: ["eiweiss", "ballaststoffe"], meiden: [] },
  rezeptAchtung: [
    { muster: "tofu|edamame|tempeh|soy ?milk|soja(milch|drink|bohnen)|soybeans?", text: { de: "Soja: nicht kurz nach der Schilddruesentablette essen, sonst wird weniger Hormon aufgenommen.", en: "Soy: do not eat it soon after the thyroid tablet, or less hormone is absorbed." } },
  ],
  warnzeichen: [
    { zeichen: "Herzrasen", text: { de: "Kann bedeuten, dass die Dosis zu hoch ist. TSH kontrollieren lassen.", en: "May mean the dose is too high. Have the TSH checked." } },
  ],
  signale: [
    { check: "levo", werte: ["mitessen", "vergessen"], ab: 3, text: { de: "Die Tablette oefter vergessen oder mit Essen genommen. Das verschiebt den TSH-Wert; vor der naechsten Kontrolle ansprechen.", en: "The tablet was often forgotten or taken with food. That shifts the TSH; mention it before the next check." } },
  ],
  forschung: {
    suche: '("hashimoto disease"[MeSH Terms] OR hashimoto*[tiab] OR "autoimmune thyroiditis"[tiab])',
  },
  fragen: [
    { de: "Passt meine Dosis zum letzten TSH-Wert, und wann wird wieder kontrolliert?", en: "Does my dose fit the last TSH, and when is the next check?" },
    { de: "Muss ich den Abstand zu anderen Medikamenten oder Ergaenzungen aendern?", en: "Do I need to change the spacing to other medicines or supplements?" },
  ],
},

/* ------------------------------------------------- Rheumatoide Arthritis */
{
  id: "ra",
  farbe: "#3b82f6",
  name: { de: "Rheumatoide Arthritis", en: "Rheumatoid arthritis" },
  kurz: { de: "Arthritis", en: "Arthritis" },
  beschreibung: {
    de: "Welche Gelenke, wie lange steif am Morgen, wie geschwollen. Genau das fragt die Rheumatologie, und genau das vergisst man bis zum Termin.",
    en: "Which joints, how long stiff in the morning, how swollen. That is exactly what rheumatology asks, and exactly what you forget before the appointment.",
  },
  skalen: [
    { schluessel: "gelenke", name: { de: "Gelenke", en: "Joints" }, links: { de: "frei", en: "free" }, rechts: { de: "steif, geschwollen", en: "stiff, swollen" } },
  ],
  checks: [
    {
      schluessel: "steif",
      frage: { de: "Steif am Morgen", en: "Stiff in the morning" },
      optionen: [
        { wert: "kurz", ton: "gut", text: { de: "Unter 30 Minuten", en: "Under 30 minutes" } },
        { wert: "mittel", ton: "mittel", text: { de: "30 bis 60 Minuten", en: "30 to 60 minutes" } },
        { wert: "lang", ton: "schlecht", text: { de: "Ueber eine Stunde", en: "Over an hour" } },
      ],
    },
  ],
  zeichen: ["Gelenkschmerz", "Morgensteifigkeit", "geschwollene Gelenke", "Fieber", "trockene Augen", "Muskelschmerz"],
  eigeneZeichen: [
    { schluessel: "geschwollene Gelenke", de: "geschwollene Gelenke", en: "swollen joints" },
  ],
  labor: ["crp", "bsg", "rf", "ccp", "hb", "alt"],
  eigeneLabor: [
    { schluessel: "rf", einheit: "IU/ml", name: { de: "Rheumafaktor", en: "Rheumatoid factor" }, gruppe: { de: "Arthritis", en: "Arthritis" }, bedeutung: { de: "Hilft bei der Diagnose. Fuer den Verlauf sagen CRP, BSG und die Gelenke mehr.", en: "Helps with diagnosis. For the course, CRP, ESR and the joints say more." } },
    { schluessel: "ccp", einheit: "U/ml", name: { de: "Anti-CCP", en: "Anti-CCP" }, gruppe: { de: "Arthritis", en: "Arthritis" }, bedeutung: { de: "Sehr spezifisch fuer rheumatoide Arthritis. Wird meist einmal bestimmt, nicht laufend.", en: "Very specific for rheumatoid arthritis. Usually measured once, not repeatedly." } },
    { schluessel: "alt", einheit: "U/l", name: { de: "ALT (GPT)", en: "ALT (GPT)" }, gruppe: { de: "Leber", en: "Liver" }, bedeutung: { de: "Leberwert. Wird unter Methotrexat und einigen anderen Medikamenten regelmaessig kontrolliert.", en: "Liver value. Checked regularly on methotrexate and some other drugs." } },
  ],
  essen: [
    { art: "gut", was: { de: "Mediterran, mit Fisch", en: "Mediterranean, with fish" }, warum: { de: "Omega-3-Fettsaeuren lindern Gelenkbeschwerden in Studien leicht. Sie ersetzen keine Basistherapie.", en: "Omega-3 fatty acids ease joint symptoms slightly in studies. They do not replace disease-modifying treatment." } },
    { art: "vorsicht", was: { de: "Alkohol unter Methotrexat", en: "Alcohol on methotrexate" }, warum: { de: "Belastet zusammen die Leber. Wie viel vertretbar ist, in der Sprechstunde klaeren.", en: "Together they strain the liver. How much is acceptable is a question for the clinic." } },
    { art: "gut", was: { de: "Nicht rauchen", en: "Not smoking" }, warum: { de: "Rauchen verschlechtert den Verlauf und das Ansprechen auf Medikamente deutlich.", en: "Smoking clearly worsens the course and the response to medication." } },
  ],
  rezepte: { bevorzugt: ["mediterran", "omega3"], meiden: [] },
  rezeptAchtung: [
    { muster: ALKOHOL, text: { de: "Enthaelt Alkohol. Unter Methotrexat zurueckhaltend, beim Kochen verfliegt nicht alles.", en: "Contains alcohol. Go easy on methotrexate, cooking does not remove all of it." } },
  ],
  warnzeichen: [
    { zeichen: "Fieber", text: { de: "Unter Basistherapie und Biologika koennen Infekte schwerer verlaufen. Die Praxis fragen, ob an den Medikamenten etwas zu aendern ist.", en: "On disease-modifying drugs and biologics infections can be more serious. Ask the clinic whether anything about the medication should change." } },
  ],
  signale: [
    { check: "steif", werte: ["lang"], ab: 3, text: { de: "An mehreren Tagen ueber eine Stunde steif am Morgen. Das spricht fuer aktive Entzuendung und gehoert vor den naechsten Routinetermin.", en: "Stiff for over an hour on several mornings. That points to active inflammation and belongs before the next routine visit." } },
  ],
  forschung: {
    suche: '("arthritis, rheumatoid"[MeSH Terms] OR "rheumatoid arthritis"[tiab])',
  },
  fragen: [
    { de: "Ist das Ziel Remission erreicht, und wenn nicht, was ist der naechste Schritt?", en: "Has the target of remission been reached, and if not, what is the next step?" },
    { de: "Welche Kontrollen brauche ich unter meiner Basistherapie, und wie oft?", en: "Which checks do I need on my disease-modifying treatment, and how often?" },
  ],
},

/* ------------------------------------------------- Morbus Crohn / Colitis */
{
  id: "ced",
  farbe: "#e85d75",
  name: { de: "Morbus Crohn oder Colitis ulcerosa", en: "Crohn's disease or ulcerative colitis" },
  kurz: { de: "CED", en: "IBD" },
  beschreibung: {
    de: "Bauch, Stuhl und Blut darin. Unangenehm aufzuschreiben, und gerade deshalb wertvoll: genau diese Zahlen entscheiden ueber die Behandlung.",
    en: "Gut, stool and blood in it. Unpleasant to write down, and valuable for exactly that reason: these numbers decide on treatment.",
  },
  skalen: [
    { schluessel: "bauch", name: { de: "Bauch", en: "Gut" }, links: { de: "ruhig", en: "settled" }, rechts: { de: "starke Beschwerden", en: "severe discomfort" } },
  ],
  checks: [
    {
      schluessel: "stuhl",
      frage: { de: "Stuhlgaenge heute", en: "Bowel movements today" },
      optionen: [
        { wert: "wenig", ton: "gut", text: { de: "0 bis 3", en: "0 to 3" } },
        { wert: "mittel", ton: "mittel", text: { de: "4 bis 6", en: "4 to 6" } },
        { wert: "viel", ton: "schlecht", text: { de: "7 oder mehr", en: "7 or more" } },
      ],
    },
  ],
  zeichen: ["Bauchschmerz", "Durchfall", "Blut im Stuhl", "naechtlicher Stuhlgang", "Fieber", "Gelenkschmerz", "Uebelkeit"],
  eigeneZeichen: [
    { schluessel: "Blut im Stuhl", de: "Blut im Stuhl", en: "blood in stool" },
    { schluessel: "naechtlicher Stuhlgang", de: "naechtlicher Stuhlgang", en: "bowel movement at night" },
  ],
  labor: ["calpro", "crp", "hb", "ferritin", "b12", "vitd"],
  eigeneLabor: [
    { schluessel: "calpro", einheit: "µg/g", name: { de: "Calprotectin im Stuhl", en: "Faecal calprotectin" }, gruppe: { de: "Darm", en: "Gut" }, bedeutung: { de: "Zeigt Entzuendung im Darm, ohne Spiegelung. Steigt oft, bevor Beschwerden kommen.", en: "Shows inflammation in the gut without endoscopy. Often rises before symptoms do." } },
  ],
  essen: [
    { art: "gut", was: { de: "Persoenliche Vertraeglichkeit zaehlt", en: "Personal tolerance counts" }, warum: { de: "Es gibt keine Diaet fuer alle. Ein Ernaehrungstagebuch ist ehrlicher als jede Liste.", en: "There is no diet for everyone. A food diary is more honest than any list." } },
    { art: "vorsicht", was: { de: "Im Schub: schonend und ballaststoffarm nur nach Ruecksprache", en: "In a flare: gentle and low-fibre only after advice" }, warum: { de: "Bei Engstellen kann es noetig sein, sonst sind Ballaststoffe eher hilfreich. Das entscheidet die Gastroenterologie.", en: "With strictures it may be needed, otherwise fibre tends to help. Gastroenterology decides." } },
    { art: "gut", was: { de: "Eisen, B12, Vitamin D messen lassen", en: "Have iron, B12, vitamin D measured" }, warum: { de: "Blutverlust und Entzuendung zehren daran, besonders bei Befall des Duenndarms.", en: "Blood loss and inflammation wear them down, especially when the small intestine is involved." } },
  ],
  rezepte: { bevorzugt: ["schonend", "eisen"], meiden: [] },
  warnzeichen: [
    { zeichen: "Blut im Stuhl", text: { de: "Kann einen Schub anzeigen. Der Praxis melden, mit Fieber oder vielen Stuhlgaengen noch am selben Tag.", en: "May signal a flare. Tell the clinic, the same day if there is fever or many bowel movements." } },
    { zeichen: "Fieber", text: { de: "Bei CED kann Fieber Schub, Abszess oder Infekt bedeuten, unter Immunsuppression zaehlt alles davon. Mit der Praxis klaeren.", en: "In IBD fever can mean a flare, an abscess or an infection, and on immunosuppression all of them matter. Check with the clinic." } },
    { zeichen: "naechtlicher Stuhlgang", text: { de: "Stuhlgang in der Nacht spricht eher fuer Entzuendung als fuer einen gereizten Darm. Beim Termin ansprechen.", en: "Bowel movements at night point more to inflammation than to an irritable gut. Raise it at the appointment." } },
  ],
  signale: [
    { check: "stuhl", werte: ["viel"], ab: 2, text: { de: "An mehreren Tagen sieben oder mehr Stuhlgaenge. Das kann ein Schub sein; der Praxis melden.", en: "Seven or more bowel movements on several days. That may be a flare; tell the clinic." } },
  ],
  forschung: {
    suche: '("inflammatory bowel diseases"[MeSH Terms] OR crohn*[tiab] OR "ulcerative colitis"[tiab])',
  },
  fragen: [
    { de: "Wie ist mein Calprotectin im Verlauf, und wann wird wieder gespiegelt?", en: "How is my calprotectin over time, and when is the next endoscopy?" },
    { de: "Was tue ich bei Blut im Stuhl oder Fieber, und wen rufe ich an?", en: "What do I do with blood in the stool or fever, and whom do I call?" },
  ],
},

];

/*
 * Grundregler, die jede Nutzerin sieht, egal welche Erkrankung gewaehlt ist.
 * befinden laeuft andersherum als alle anderen: 0 ist schlecht, 10 ist gut.
 * So zeigt der Daumen nach rechts, wenn es besser geht.
 */
window.ANKER_GRUND = {
  befinden: {
    schluessel: "befinden",
    name: { de: "Wie geht es dir", en: "How are you" },
    links: { de: "sehr schlecht", en: "very bad" },
    rechts: { de: "sehr gut", en: "very good" },
    gut: "hoch",
  },
  skalen: [
    { schluessel: "muedigkeit", name: { de: "Muedigkeit", en: "Fatigue" }, links: { de: "wach", en: "awake" }, rechts: { de: "erschoepft", en: "exhausted" } },
    { schluessel: "schmerz", name: { de: "Schmerz", en: "Pain" }, links: { de: "keiner", en: "none" }, rechts: { de: "stark", en: "severe" } },
  ],
};
