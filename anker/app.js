/*
 * Anker, die Mechanik.
 *
 * Eine Datei, kein Rahmenwerk, kein Bauschritt. Das ist Absicht: die App muss
 * Jahre spaeter noch laufen und von Hand aenderbar sein, auch von jemandem, der
 * kein Werkzeug installiert hat.
 *
 * WO DIE DATEN LIEGEN
 * Alles steht unter einem Schluessel im localStorage dieses Geraetes. Es gibt
 * keinen Server, keinen Zugang, kein Konto. Die Sicherheitsregel im Kopf der
 * Seite setzt connect-src auf 'none': diese Seite kann gar keine Verbindung
 * aufbauen, auch nicht, wenn spaeter jemand Code einfuegt.
 *
 * WAS DAS KOSTET
 * Was nur hier liegt, ist auch nur hier. Wird der Verlauf des Browsers
 * geloescht, das Geraet zurueckgesetzt oder die App vom Home-Bildschirm
 * entfernt, sind die Eintraege weg. Deshalb die Sicherung unter Mehr, und
 * deshalb erinnert die App nach vierzehn Tagen ohne Sicherung daran.
 */

(() => {
  "use strict";

  /* ------------------------------------------------------------- Speicher */

  const SCHLUESSEL = "anker-v1";
  const SICHERUNG_TAGE = 14;

  /* Die Erkrankungen kommen aus module.js, die Rezepte aus rezepte.js, die
     Forschungsuebersicht aus aktuell.js. Fehlt eine Datei, laeuft die App
     trotzdem, nur ohne diesen Teil. */
  const MODUL_LISTE = window.ANKER_MODULE || [];
  const GRUND = window.ANKER_GRUND || { befinden: null, skalen: [] };
  const REZEPTE = window.ANKER_REZEPTE || { bestand: [], neu: [] };
  const NETZ = window.ANKER_NETZREZEPTE || { stand: null, rezepte: [] };

  const LEER = {
    version: 1,
    profil: { name: "", geboren: "", diagnosen: [], notfall: "", module: [] },
    tage: {},
    medikamente: [],
    werte: [],
    termine: [],
    stellen: [],
    schuebe: [],
    gemerkt: { rezepte: [], studien: [], netz: [] },
    einstellungen: { thema: "auto", letzteSicherung: null, start: heuteISO() },
  };

  let migriert = false;
  let D = ordnen(laden());

  /*
   * Bringt einen geladenen Stand in die heutige Form. Wer Anker schon vor den
   * Erkrankungs-Bausteinen benutzt hat, hatte Lupus und Zoeliakie, denn fuer
   * genau diese beiden war die App gebaut. Diese Nutzerin bekommt beide
   * gesetzt und sieht alles wie bisher, nur mehr davon. Wer ganz neu ist,
   * waehlt beim ersten Start selbst.
   */
  function ordnen(d) {
    /* Zuerst nachsehen, ob die Liste fehlt, dann erst mit den Vorgaben
       auffuellen: die Vorgabe ist eine leere Liste, und mit ihr saehe jede
       alte Sicherung aus wie ein neuer Anfang. */
    const ohneListe = !d.profil || !Array.isArray(d.profil.module);
    d.profil = Object.assign({}, LEER.profil, d.profil || {});
    if (ohneListe) {
      migriert = true;
      const schonDa = Object.keys(d.tage || {}).length || (d.medikamente || []).length || (d.werte || []).length;
      d.profil.module = schonDa ? ["sle", "zoeliakie"] : [];
    }
    const bekannt = MODUL_LISTE.map((m) => m.id);
    d.profil.module = d.profil.module.filter((m) => bekannt.includes(m));
    d.gemerkt = Object.assign({ rezepte: [], studien: [], netz: [] }, d.gemerkt || {});
    d.einstellungen = Object.assign({}, LEER.einstellungen, d.einstellungen || {});
    return d;
  }

  function laden() {
    try {
      const roh = localStorage.getItem(SCHLUESSEL);
      if (!roh) return strukturKopie(LEER);
      const geparst = JSON.parse(roh);
      return Object.assign(strukturKopie(LEER), geparst);
    } catch (e) {
      return strukturKopie(LEER);
    }
  }

  function strukturKopie(o) {
    return JSON.parse(JSON.stringify(o));
  }

  let speicherFehlt = false;
  function sichern() {
    try {
      localStorage.setItem(SCHLUESSEL, JSON.stringify(D));
      speicherFehlt = false;
    } catch (e) {
      speicherFehlt = true;
      melden(T("Konnte nicht speichern. Ist der Speicher voll oder gesperrt?"));
    }
  }

  /* -------------------------------------------------------------- Sprache */

  /*
   * Englisch ist die Leitsprache. Jede weitere steht in einer eigenen Datei
   * unter INHALT.<code>, samt ihrer Oberflaechentexte unter ui. Eine Sprache
   * dazunehmen heisst: eine Datei schreiben, eine Zeile in index.html, eine
   * Zeile in sw.js. Sonst nichts.
   *
   * Faellt eine Uebersetzung aus, greift Englisch. Faellt auch die aus, steht
   * der Schluessel da. Leer bleibt nie etwas.
   */
  const SPRACHEN = [
    { code: "en", name: "English", locale: "en-GB" },
    { code: "de", name: "Deutsch", locale: "de-AT" },
    { code: "it", name: "Italiano", locale: "it-IT" },
    { code: "fr", name: "Français", locale: "fr-FR" },
    { code: "es", name: "Español", locale: "es-ES" },
  ];

  const ABSCHNITTE = ["symptome", "essen", "rezepte", "laborwerte", "warnzeichen",
                      "fragen", "wissen", "ueberwachung", "suche"];

  /* Alle Sprachdateien haengen sich an window.INHALT. */
  const INHALT = window.INHALT || {};

  /*
   * Welche Sprachen die App wirklich anbietet.
   *
   * Eine Sprache zaehlt erst, wenn beides uebersetzt ist: der Inhalt in
   * inhalt-<code>.js und die Oberflaeche in deren ui-Tabelle. Steht eine
   * Sprache hier, muss werkzeug/pruefe-texte.js fuer sie sauber durchlaufen,
   * sonst stehen deutsche Knoepfe ueber uebersetztem Text.
   *
   * Seit Oktober 2026 haben alle fuenf eine ui-Tabelle. Die italienische,
   * franzoesische und spanische sind nicht von Muttersprachlerinnen geprueft;
   * Mappe, Sprache sagt das in der App.
   */
  const OBERFLAECHE_FERTIG = ["en", "de", "it", "fr", "es"];

  function sprachenDa() {
    return SPRACHEN.filter(
      (s) => INHALT[s.code] && INHALT[s.code].wissen && OBERFLAECHE_FERTIG.includes(s.code),
    );
  }

  function spracheWaehlen() {
    const moeglich = sprachenDa().map((s) => s.code);
    /* Die eigene Wahl zuerst, dann die Sprache des Geraets, dann Englisch.
       Englisch ist die Leitsprache: wer ein Telefon auf Schwedisch hat,
       bekommt Englisch und nicht Deutsch. */
    const gewaehlt = D.einstellungen && D.einstellungen.sprache;
    if (gewaehlt && moeglich.includes(gewaehlt)) return gewaehlt;
    const vomGeraet = String(navigator.language || "en").slice(0, 2).toLowerCase();
    if (moeglich.includes(vomGeraet)) return vomGeraet;
    return moeglich.includes("en") ? "en" : (moeglich[0] || "de");
  }

  let L = "en";
  let I = {};

  function spracheSetzen(code) {
    const moeglich = sprachenDa().map((s) => s.code);
    L = moeglich.includes(code) ? code : (moeglich[0] || "de");
    I = INHALT[L] || {};
    document.documentElement.lang = L;
    huelleUebersetzen();
  }

  /*
   * Die feste Huelle. Sprungmarke, Leiste und Beschreibung stehen in
   * index.html, damit die Seite in der Sekunde vor dem ersten Skript schon
   * etwas zeigt. Dort stehen sie auf Deutsch, wie jeder Schluessel in dieser
   * App; hier werden sie ueberschrieben. Ohne das bliebe die Leiste deutsch,
   * waehrend darueber alles englisch ist, und das faellt auf jeder Seite auf.
   */
  const LEISTE = [
    ["heute", () => T("Heute")],
    ["verlauf", () => T("Verlauf")],
    ["essen", () => T("Essen")],
    ["wissen", () => T("Wissen")],
    ["mehr", () => T("Mappe")],
  ];

  function huelleUebersetzen() {
    const sprung = document.querySelector("a.skip");
    if (sprung) sprung.textContent = T("Zum Inhalt springen");
    const leiste = document.querySelector("nav.leiste");
    if (leiste) leiste.setAttribute("aria-label", T("Hauptbereiche"));
    LEISTE.forEach(([k, text]) => {
      const feld = document.querySelector(`[data-tab="${k}"] span`);
      if (feld) feld.textContent = text();
    });
    const beschreibung = document.querySelector('meta[name="description"]');
    if (beschreibung) {
      beschreibung.setAttribute(
        "content",
        T("Persoenliches Begleitbuch bei chronischen Erkrankungen. Alle Eintraege bleiben auf diesem Geraet."),
      );
    }
  }

  /**
   * Ein Oberflaechentext. Schluessel rein, Satz raus.
   *
   * Der Schluessel ist der deutsche Satz. Hat die laufende Sprache gar keine
   * ui-Tabelle, ist sie die Schluesselsprache, und dann IST der Schluessel die
   * Antwort. Vorher stand hier ein Rueckfall auf Englisch ohne diese
   * Unterscheidung, und Deutsch bekam englische Knoepfe zu deutschen Texten.
   * Nur wenn eine Sprache eine Tabelle hat und darin ein Eintrag fehlt, ist
   * Englisch die bessere Notloesung als ein deutscher Brocken.
   */
  function T(schluessel) {
    if (!I.ui) return schluessel;
    const eigen = I.ui[schluessel];
    if (eigen != null) return eigen;
    const ersatz = INHALT.en && INHALT.en.ui && INHALT.en.ui[schluessel];
    return ersatz != null ? ersatz : schluessel;
  }

  /** Das Gebietsschema fuer Datum und Zahlen. */
  /*
 * Wie T, nur mit Platzhaltern. Der Schluessel traegt sie in geschweiften
 * Klammern, die Uebersetzung darf sie umstellen: im Englischen steht die Zahl
 * vor dem Namen, im Deutschen dahinter. Waeren die Teile einzeln uebersetzt,
 * liesse sich das nicht mehr drehen.
 */
function TV(schluessel, werte) {
  return String(T(schluessel)).replace(/\{(\w+)\}/g, (ganz, name) =>
    Object.prototype.hasOwnProperty.call(werte, name) ? String(werte[name]) : ganz,
  );
}

/*
 * Einzahl und Mehrzahl. Beide Formen sind eigene Schluessel, weil keine Regel,
 * die hier stuende, fuer die naechste Sprache noch stimmen wuerde.
 */
function TP(einer, mehrere, n, werte) {
  return TV(n === 1 ? einer : mehrere, Object.assign({ n: n }, werte || {}));
}

function LOKAL() {
    const s = SPRACHEN.find((x) => x.code === L);
    return s ? s.locale : "en-GB";
  }

  /* ---------------------------------------------------------------- Datum */

  function heuteISO(d) {
    const x = d ? new Date(d) : new Date();
    return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
  }
  function verschoben(iso, tage) {
    const d = new Date(iso + "T12:00:00");
    d.setDate(d.getDate() + tage);
    return heuteISO(d);
  }
  function langesDatum(iso) {
    return new Date(iso + "T12:00:00").toLocaleDateString(LOKAL(), {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  }
  function kurzesDatum(iso) {
    return new Date(iso + "T12:00:00").toLocaleDateString(LOKAL(), { day: "2-digit", month: "2-digit" });
  }
  function tageZwischen(a, b) {
    return Math.round((new Date(b + "T12:00:00") - new Date(a + "T12:00:00")) / 86400000);
  }

  /* ------------------------------------------------------------- Werkzeug */

  const $ = (s, w = document) => w.querySelector(s);
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]),
    );
  const id = () => "k" + Math.random().toString(36).slice(2, 10);

  let toastZeit = null;
  function melden(text) {
    const t = $("#toast");
    t.textContent = text;
    t.hidden = false;
    clearTimeout(toastZeit);
    toastZeit = setTimeout(() => { t.hidden = true; }, 2600);
  }

  function tag(iso) {
    if (!D.tage[iso]) D.tage[iso] = {};
    return D.tage[iso];
  }
  /*
   * Angekreuzte Zeichen. In der Datei steht der deutsche Eintrag, auf dem
   * Knopf der uebersetzte. Die Listen sind in jeder Sprache gleich lang und
   * gleich sortiert, pruefe-sprache.js besteht darauf. Stuende das Angezeigte
   * in der Datei, verlore ein Sprachwechsel jedes Kreuz, das schon gesetzt
   * ist, und der Arztbericht zaehlte dasselbe Zeichen zweimal.
   */
  function zeichenListe() {
    return (INHALT.de && INHALT.de.symptome) || I.symptome || [];
  }
  function zeichenText(schluessel) {
    const i = zeichenListe().indexOf(schluessel);
    const eigen = I.symptome || [];
    if (i >= 0 && eigen[i] != null) return eigen[i];
    /* Zeichen, die erst eine Erkrankung mitbringt, stehen in module.js. */
    for (const m of MODUL_LISTE) {
      const z = (m.eigeneZeichen || []).find((x) => x.schluessel === schluessel);
      if (z) return MT(z);
    }
    return schluessel;
  }

  /* ---------------------------------------------------------- Erkrankungen */

  /* Ein Text aus module.js oder rezepte.js: { de, en }. Fehlt die laufende
     Sprache, greift Englisch, dann Deutsch. Leer bleibt nie etwas. */
  /* Italienisch, Franzoesisch und Spanisch stehen nicht in den Bausteinen
     selbst, sondern in uebersetzung.js, mit dem deutschen Text als
     Schluessel. Fehlt dort etwas, greift Englisch. */
  const UEBERSETZUNG = window.ANKER_UEBERSETZUNG || {};
  function MT(o) {
    if (o == null) return "";
    if (typeof o === "string" || Array.isArray(o)) return o;
    if (o[L] != null) return o[L];
    const tafel = UEBERSETZUNG[L];
    if (tafel && o.de != null) {
      if (Array.isArray(o.de)) {
        if (o.de.every((x) => tafel[x] != null)) return o.de.map((x) => tafel[x]);
      } else if (tafel[o.de] != null) return tafel[o.de];
    }
    return o.en != null ? o.en : o.de;
  }
  function modulVon(mid) { return MODUL_LISTE.find((m) => m.id === mid); }
  function aktiveModule() { return (D.profil.module || []).map(modulVon).filter(Boolean); }
  function hat(mid) { return (D.profil.module || []).includes(mid); }
  /* "sle|zoeliakie" heisst eine von beiden, "sle+zoeliakie" heisst beide. */
  function gilt(regel) {
    if (!regel) return true;
    if (regel.includes("+")) return regel.split("+").every(hat);
    return regel.split("|").some(hat);
  }

  function akzentSetzen() {
    const m = aktiveModule();
    const wurzel = document.documentElement;
    wurzel.style.setProperty("--modul", m.length ? m[0].farbe : "#6b7cff");
    wurzel.style.setProperty("--modul-2", m.length > 1 ? m[1].farbe : (m.length ? m[0].farbe : "#6b7cff"));
  }

  /* Regler, Fragen und Zeichen aller gewaehlten Erkrankungen. Was zwei
     Erkrankungen teilen, etwa die Gelenke, steht nur einmal da. */
  function skalenAktiv() {
    const liste = (GRUND.skalen || []).map((s) => Object.assign({ farbe: null }, s));
    aktiveModule().forEach((m) => (m.skalen || []).forEach((s) => {
      if (!liste.some((x) => x.schluessel === s.schluessel)) liste.push(Object.assign({ farbe: m.farbe, modul: m.id }, s));
    }));
    return liste;
  }
  function checksAktiv() {
    const liste = [];
    aktiveModule().forEach((m) => (m.checks || []).forEach((c) => {
      if (!liste.some((x) => x.schluessel === c.schluessel)) liste.push(Object.assign({ farbe: m.farbe, modul: m }, c));
    }));
    return liste;
  }
  function zeichenAktiv(schonGewaehlt) {
    const liste = [];
    aktiveModule().forEach((m) => (m.zeichen || []).forEach((z) => {
      if (!liste.some((x) => x.wert === z)) liste.push({ wert: z, farbe: m.farbe });
    }));
    /* Ein Zeichen, das an diesem Tag schon angekreuzt ist, bleibt sichtbar,
       auch wenn seine Erkrankung inzwischen abgewaehlt wurde. */
    (schonGewaehlt || []).forEach((z) => { if (!liste.some((x) => x.wert === z)) liste.push({ wert: z, farbe: null }); });
    return liste;
  }

  /* Alle Laborwerte: die uebersetzten aus inhalt-*.js und die, die eine
     Erkrankung zusaetzlich mitbringt. */
  function laborListe() {
    const liste = (I.laborwerte || []).map((w) => ({
      schluessel: w.schluessel, name: w.name, einheit: w.einheit, gruppe: w.gruppe, bedeutung: w.bedeutung,
    }));
    MODUL_LISTE.forEach((m) => (m.eigeneLabor || []).forEach((w) => {
      if (liste.some((x) => x.schluessel === w.schluessel)) return;
      liste.push({ schluessel: w.schluessel, name: MT(w.name), einheit: w.einheit, gruppe: MT(w.gruppe), bedeutung: MT(w.bedeutung) });
    }));
    return liste;
  }
  function laborAktiv() {
    const gewollt = new Set();
    aktiveModule().forEach((m) => (m.labor || []).forEach((k) => gewollt.add(k)));
    D.werte.forEach((w) => gewollt.add(w.schluessel));
    const alle = laborListe();
    const liste = alle.filter((w) => gewollt.has(w.schluessel));
    return liste.length ? liste : alle;
  }

  function modulChips(wirt, mods, href) {
    const box = document.createElement("div");
    box.className = "modul-chips";
    mods.forEach((m) => {
      const a = document.createElement(href ? "a" : "span");
      if (href) a.href = href;
      a.className = "modul-chip";
      a.style.setProperty("--punkt", m.farbe);
      a.textContent = MT(m.kurz);
      box.appendChild(a);
    });
    wirt.appendChild(box);
    return box;
  }

  function monatJahr(iso) {
    return new Date((iso || heuteISO()).slice(0, 10) + "T12:00:00").toLocaleDateString(LOKAL(), { month: "long", year: "numeric" });
  }

  function tagLeer(e) {
    if (!e) return true;
    return !Object.keys(e).some((k) => {
      const v = e[k];
      if (v == null || v === "") return false;
      if (Array.isArray(v)) return v.length > 0;
      return true;
    });
  }

  /* --------------------------------------------------------------- Router */

  /*
   * Die Titel sind Funktionen, keine Zeichenketten. Diese Tabelle entsteht,
   * bevor die Sprache feststeht; ein hier schon nachgeschlagener Titel bliebe
   * fuer immer der deutsche Schluessel, und beim Sprachwechsel wuerde er nicht
   * mitgehen.
   */
  const SEITEN = {
    heute: { titel: () => T("Heute"), bauen: seiteHeute },
    verlauf: { titel: () => T("Verlauf"), bauen: seiteVerlauf },
    essen: { titel: () => T("Essen"), bauen: seiteEssen },
    wissen: { titel: () => T("Wissen"), bauen: seiteWissen },
    mehr: { titel: () => T("Mappe"), bauen: seiteMehr },
    profil: { titel: () => T("Meine Erkrankungen"), bauen: seiteProfil, eltern: "mehr" },
    gemerkt: { titel: () => T("Gemerkt"), bauen: seiteGemerkt, eltern: "mehr" },
    medikamente: { titel: () => T("Medikamente"), bauen: seiteMedikamente, eltern: "mehr" },
    werte: { titel: () => T("Laborwerte"), bauen: seiteWerte, eltern: "mehr" },
    termine: { titel: () => T("Termine"), bauen: seiteTermine, eltern: "mehr" },
    stellen: { titel: () => T("Anlaufstellen"), bauen: seiteStellen, eltern: "mehr" },
    suchen: { titel: () => T("Eine Stelle finden"), bauen: seiteSuchen, eltern: "stellen" },
    erstgespraech: { titel: () => T("Beim ersten Mal"), bauen: seiteErstgespraech, eltern: "stellen" },
    bericht: { titel: () => T("Arztbericht"), bauen: seiteBericht, eltern: "mehr" },
    sicherung: { titel: () => T("Sicherung"), bauen: seiteSicherung, eltern: "mehr" },
    notfall: { titel: () => T("Warnzeichen"), bauen: seiteNotfall, eltern: "wissen" },
  };

  function route() {
    const h = location.hash.replace(/^#\/?/, "") || "heute";
    return SEITEN[h] ? h : "heute";
  }

  function zeichnen() {
    /* Beim ersten Start, oder nach "Alles loeschen", gibt es noch keine
       Erkrankung. Dann ist die Wahl die einzige Seite, die Sinn ergibt. */
    let name = route();
    if (!aktiveModule().length && MODUL_LISTE.length && name !== "profil" && name !== "sicherung") name = "profil";
    if (name !== "heute") nachtragTag = null;
    const seite = SEITEN[name];
    const ziel = $("#inhalt");
    ziel.innerHTML = "";
    akzentSetzen();
    $("#kopf-titel").textContent = seite.titel();
    $("#kopf-datum").textContent =
      name === "heute" ? langesDatum(heuteISO()) : (seite.eltern ? T("Mappe") : "Anker");
    seite.bauen(ziel);
    const aktiv = seite.eltern || name;
    document.querySelectorAll(".leiste a").forEach((a) => {
      if (a.dataset.tab === aktiv) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", zeichnen);

  /* ------------------------------------------------------------- Bausteine */

  function karte(html) {
    const d = document.createElement("div");
    d.className = "karte";
    d.innerHTML = html;
    return d;
  }

  /*
   * Der Schieberegler, 0 bis 10, von links nach rechts.
   *
   * Ein Regler hat keinen leeren Zustand, ein Tagebuch braucht aber einen:
   * nicht eingetragen ist etwas anderes als 5. Also steht der Regler zuerst
   * gedimmt in der Mitte und zeigt einen Strich statt einer Zahl. Erst die
   * erste Beruehrung setzt einen Wert, und "leeren" nimmt ihn wieder weg.
   *
   * Die Farbe folgt dem Wert: gruen heisst gut, rot heisst schlecht. Bei den
   * Beschwerden ist 10 schlecht, beim Befinden ist 10 gut (gutHoch). Die
   * Farbe sagt es nie allein, die Zahl und die Endbeschriftung stehen dabei.
   */
  function regler(wirt, { name, schluessel, iso, links, rechts, gutHoch = false, farbe = null, gross = false }) {
    const box = document.createElement("div");
    box.className = "regler" + (gross ? " gross" : "");
    if (farbe) box.style.setProperty("--punkt", farbe);
    box.innerHTML =
      `<div class="regler-kopf"><span class="regler-name">${farbe ? '<i class="modul-punkt"></i>' : ""}${esc(name)}</span>` +
      `<span class="regler-zahl" data-zahl></span></div>` +
      `<input type="range" min="0" max="10" step="1" aria-label="${esc(name)}">` +
      `<div class="regler-enden"><span>${esc(links)}</span>` +
      `<button type="button" class="regler-weg" hidden>${esc(T("leeren"))}</button><span>${esc(rechts)}</span></div>`;
    const ein = box.querySelector("input");
    const zahl = box.querySelector("[data-zahl]");
    const weg = box.querySelector(".regler-weg");
    function zeigen(v) {
      const gesetzt = v != null;
      box.classList.toggle("ungesetzt", !gesetzt);
      ein.value = String(gesetzt ? v : 5);
      box.style.setProperty("--p", `${(gesetzt ? v : 5) * 10}%`);
      const gut = gesetzt ? (gutHoch ? v : 10 - v) / 10 : 0.5;
      box.style.setProperty("--ton", String(Math.round(6 + gut * 136)));
      zahl.textContent = gesetzt ? String(v) : "\u2013";
      ein.setAttribute("aria-valuetext", gesetzt ? TV("{n} von 10", { n: v }) : T("nicht gesetzt"));
      weg.hidden = !gesetzt;
    }
    zeigen(tag(iso)[schluessel] == null ? null : tag(iso)[schluessel]);
    ein.addEventListener("input", () => {
      const v = Number(ein.value);
      const t = tag(iso);
      if (t[schluessel] !== v && navigator.vibrate) navigator.vibrate(4);
      t[schluessel] = v;
      zeigen(v);
    });
    ein.addEventListener("change", sichern);
    /* Ein Tippen genau auf die Mitte loest kein input aus. Ohne das hier
       liesse sich eine 5 nie eintragen. */
    ein.addEventListener("pointerup", () => {
      const t = tag(iso);
      if (t[schluessel] == null) { t[schluessel] = Number(ein.value); zeigen(t[schluessel]); sichern(); }
    });
    weg.addEventListener("click", () => { tag(iso)[schluessel] = null; zeigen(null); sichern(); });
    wirt.appendChild(box);
    return box;
  }

  function schalterListe(wirt, { optionen, gewaehlt, beiWahl, einzeln = false }) {
    const box = document.createElement("div");
    box.className = "schalter-liste";
    optionen.forEach((o) => {
      const wert = typeof o === "string" ? o : o.wert;
      const text = typeof o === "string" ? o : o.text;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "schalter";
      b.textContent = text;
      const an = einzeln ? gewaehlt === wert : (gewaehlt || []).includes(wert);
      b.setAttribute("aria-pressed", String(an));
      b.addEventListener("click", () => {
        const neu = beiWahl(wert, b.getAttribute("aria-pressed") === "true");
        if (einzeln) {
          box.querySelectorAll("button").forEach((x, i) => {
            const w = typeof optionen[i] === "string" ? optionen[i] : optionen[i].wert;
            x.setAttribute("aria-pressed", String(neu === w));
          });
        } else {
          b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"));
        }
      });
      box.appendChild(b);
    });
    wirt.appendChild(box);
    return box;
  }

  function feld(wirt, { label, typ = "text", wert, platzhalter = "", schritt, beiAenderung, mehrzeilig }) {
    const l = document.createElement("label");
    l.className = "feld";
    const s = document.createElement("span");
    s.textContent = label;
    const i = document.createElement(mehrzeilig ? "textarea" : "input");
    if (!mehrzeilig) i.type = typ;
    if (schritt) i.step = schritt;
    if (typ === "number") i.inputMode = "decimal";
    i.placeholder = platzhalter;
    i.value = wert == null ? "" : wert;
    i.addEventListener("change", () => beiAenderung(i.value.trim()));
    l.append(s, i);
    wirt.appendChild(l);
    return i;
  }

  /* ---------------------------------------------------------------- Heute */

  /* Ein anderer Tag als heute, zum Nachtragen. Gilt nur, solange die
     Heute-Seite offen ist; jeder andere Bereich setzt ihn zurueck. */
  let nachtragTag = null;

  function seiteHeute(ziel) {
    const iso = nachtragTag || heuteISO();
    const e = tag(iso);
    const mods = aktiveModule();

    if (nachtragTag) {
      $("#kopf-titel").textContent = T("Nachtragen");
      $("#kopf-datum").textContent = langesDatum(iso);
      const kn = karte(`<div class="hinweis"><b>${esc(TV("Du traegst fuer {datum} nach.", { datum: langesDatum(iso) }))}</b></div>`);
      const r = document.createElement("div");
      r.className = "knopf-reihe";
      const b = document.createElement("button");
      b.type = "button";
      b.className = "knopf leer";
      b.textContent = T("Zurueck zu heute");
      b.addEventListener("click", () => { nachtragTag = null; zeichnen(); });
      r.appendChild(b);
      kn.appendChild(r);
      ziel.appendChild(kn);
    }

    if (speicherFehlt) {
      ziel.appendChild(
        karte(`<div class="hinweis rot"><b>${esc(T("Der Speicher dieses Browsers nimmt nichts an."))}</b>${esc(T("Im privaten Modus von Safari ist das normal. Eintraege gehen dann beim Schliessen verloren."))}</div>`),
      );
    }

    erinnerungSicherung(ziel);

    /* Das Wichtigste zuerst, gross und mit dem Daumen erreichbar: eine Zahl
       fuer den ganzen Tag. Sie laeuft nach rechts, wenn es besser geht. */
    if (GRUND.befinden) {
      const kb = karte(`<p class="kicker">${esc(T("Ein Wert fuer den ganzen Tag"))}</p><h2 class="h2 gross">${esc(MT(GRUND.befinden.name))}</h2>`);
      kb.classList.add("held");
      regler(kb, {
        name: T("Gesamt"), schluessel: "befinden", iso,
        links: MT(GRUND.befinden.links), rechts: MT(GRUND.befinden.rechts), gutHoch: true, gross: true,
      });
      modulChips(kb, mods, "#/profil");
      ziel.appendChild(kb);
    }

    /* Die Regler aller gewaehlten Erkrankungen, ohne Doppelte. */
    const k1 = karte(`<p class="kicker">${esc(T("Wie geht es dir"))}</p><h2 class="h2">${esc(T("Dein Koerper heute"))}</h2>
      <p class="lead">${esc(T("Schieben, wo es passt. Was du nicht beruehrst, bleibt leer, und leer ist auch eine Antwort."))}</p>`);
    skalenAktiv().forEach((s) => regler(k1, {
      name: MT(s.name), schluessel: s.schluessel, iso, links: MT(s.links), rechts: MT(s.rechts), farbe: s.farbe,
    }));
    ziel.appendChild(k1);

    /* Die eine Frage je Erkrankung: Gluten, Sonne, Tablette, Stuhlgang. */
    checksAktiv().forEach((c) => {
      const k = karte(`<p class="kicker"><i class="modul-punkt"></i>${esc(MT(c.modul.kurz))}</p><h2 class="h2">${esc(MT(c.frage))}</h2>`);
      k.style.setProperty("--punkt", c.farbe);
      const box = schalterListe(k, {
        einzeln: true,
        optionen: c.optionen.map((o) => ({ wert: o.wert, text: MT(o.text) })),
        gewaehlt: e[c.schluessel],
        beiWahl: (w) => {
          const t = tag(iso);
          t[c.schluessel] = t[c.schluessel] === w ? null : w;
          sichern();
          return t[c.schluessel];
        },
      });
      box.classList.add("segment");
      box.querySelectorAll("button").forEach((b, i) => { b.dataset.ton = c.optionen[i].ton; });
      ziel.appendChild(k);
    });

    /* Schlaf */
    const k2 = karte(`<p class="kicker">${esc(T("Nacht"))}</p><h2 class="h2">${esc(T("Schlaf"))}</h2>`);
    const zwei = document.createElement("div");
    zwei.className = "zwei";
    feld(zwei, {
      label: T("Stunden"), typ: "number", schritt: "0.5", wert: e.schlafStunden, platzhalter: "7.5",
      beiAenderung: (v) => { tag(iso).schlafStunden = v === "" ? null : Number(v); sichern(); },
    });
    feld(zwei, {
      label: T("Aufgewacht um"), typ: "time", wert: e.aufgewacht,
      beiAenderung: (v) => { tag(iso).aufgewacht = v || null; sichern(); },
    });
    k2.appendChild(zwei);
    regler(k2, { name: T("Schlafqualitaet"), schluessel: "schlafQualitaet", iso, links: T("schlecht"), rechts: T("erholsam"), gutHoch: true });
    ziel.appendChild(k2);

    /* Zeichen aller gewaehlten Erkrankungen, jedes mit dem Punkt seiner
       Erkrankung. */
    const k3 = karte(`<p class="kicker">${esc(T("Heute bemerkt"))}</p><h2 class="h2">${esc(T("Zeichen"))}</h2>
      <p class="lead">${esc(T("Mehrfach moeglich. Was hier steht, sind die Dinge, die beim naechsten Termin zaehlen, weil man sie zwei Monate spaeter nicht mehr erinnert."))}</p>`);
    const zeichen = zeichenAktiv(e.symptome);
    const zl = schalterListe(k3, {
      optionen: zeichen.map((z) => ({ wert: z.wert, text: zeichenText(z.wert) })),
      gewaehlt: e.symptome || [],
      beiWahl: (w) => {
        const t = tag(iso);
        t.symptome = t.symptome || [];
        const i = t.symptome.indexOf(w);
        if (i < 0) t.symptome.push(w); else t.symptome.splice(i, 1);
        sichern();
        return t.symptome;
      },
    });
    zl.querySelectorAll("button").forEach((b, i) => {
      if (!zeichen[i].farbe || aktiveModule().length < 2) return;
      b.classList.add("mit-punkt");
      b.style.setProperty("--punkt", zeichen[i].farbe);
    });
    ziel.appendChild(k3);

    /* Bewegung */
    const k5 = karte(`<p class="kicker">${esc(T("Bewegung"))}</p><h2 class="h2">${esc(T("Was ging heute"))}</h2>`);
    const zwei2 = document.createElement("div");
    zwei2.className = "zwei";
    feld(zwei2, {
      label: T("Minuten"), typ: "number", wert: e.bewegungMin, platzhalter: "20",
      beiAenderung: (v) => { tag(iso).bewegungMin = v === "" ? null : Number(v); sichern(); },
    });
    feld(zwei2, {
      label: T("Was"), wert: e.bewegungArt, platzhalter: T("Spaziergang"),
      beiAenderung: (v) => { tag(iso).bewegungArt = v || null; sichern(); },
    });
    k5.appendChild(zwei2);
    const hinweis = document.createElement("p");
    hinweis.className = "klein klein-abstand";
    hinweis.textContent =
      T("Auch null Minuten sind ein Eintrag. Der Verlauf wird erst dann ehrlich, wenn die schlechten Tage genauso darin stehen wie die guten.");
    k5.appendChild(hinweis);
    ziel.appendChild(k5);

    /* Medikamente abhaken */
    if (D.medikamente.length) {
      const k6 = karte(`<p class="kicker">${esc(T("Genommen"))}</p><h2 class="h2">${esc(T("Medikamente"))}</h2>`);
      schalterListe(k6, {
        optionen: D.medikamente.map((m) => ({ wert: m.id, text: m.name })),
        gewaehlt: e.medsGenommen || [],
        beiWahl: (w) => {
          const t = tag(iso);
          t.medsGenommen = t.medsGenommen || [];
          const i = t.medsGenommen.indexOf(w);
          if (i < 0) t.medsGenommen.push(w); else t.medsGenommen.splice(i, 1);
          sichern();
          return t.medsGenommen;
        },
      });
      ziel.appendChild(k6);
    }

    /* Notiz */
    const k7 = karte(`<p class="kicker">${esc(T("In eigenen Worten"))}</p><h2 class="h2">${esc(T("Notiz"))}</h2>`);
    feld(k7, {
      label: T("Was sonst noch war"), mehrzeilig: true, wert: e.notiz,
      platzhalter: T("Ein Satz reicht."),
      beiAenderung: (v) => { tag(iso).notiz = v || null; sichern(); },
    });
    ziel.appendChild(k7);

    /* Ein Rezept aus der Auswahl des Monats, jeden Tag ein anderes. */
    const auswahl = rezepteDesMonats();
    if (auswahl.length) {
      const r = auswahl[new Date().getDate() % auswahl.length];
      const kr = karte(`<p class="kicker">${esc(T("Fuer heute vorgeschlagen"))}</p><h2 class="h2">${esc(r.name)}</h2>
        <p class="lead">${esc(r.warum)}</p>`);
      kr.classList.add("vorschlag");
      rezeptMarken(kr, r);
      const reihe = document.createElement("div");
      reihe.className = "knopf-reihe";
      const a = document.createElement("a");
      a.className = "knopf leer";
      a.href = "#/essen";
      a.textContent = T("Rezepte des Monats");
      reihe.appendChild(a);
      kr.appendChild(reihe);
      ziel.appendChild(kr);
    }

    /* Gestern nachtragen */
    const gestern = verschoben(iso, -1);
    if (!nachtragTag && tagLeer(D.tage[gestern])) {
      const k8 = karte(
        `<p class="kicker">${esc(T("Nachtragen"))}</p><h2 class="h2">${esc(T("Gestern ist leer"))}</h2>
         <p class="lead">${esc(TV("{datum}. Wenn du magst, kurz nachtragen.", { datum: langesDatum(gestern) }))}</p>`,
      );
      const b = document.createElement("button");
      b.type = "button";
      b.className = "knopf leer";
      b.textContent = T("Gestern nachtragen");
      b.addEventListener("click", () => { nachtragTag = gestern; zeichnen(); });
      const reihe = document.createElement("div");
      reihe.className = "knopf-reihe";
      reihe.appendChild(b);
      k8.appendChild(reihe);
      ziel.appendChild(k8);
    }
  }

  function erinnerungSicherung(ziel) {
    const letzte = D.einstellungen.letzteSicherung;
    const anzahl = Object.keys(D.tage).length;
    if (anzahl < 3) return;
    if (letzte && tageZwischen(letzte, heuteISO()) < SICHERUNG_TAGE) return;
    const k = karte(
      `<div class="hinweis"><b>${esc(T("Zeit fuer eine Sicherung."))}</b> ${esc(
         TP("{n} Tag steht in dieser App, und er steht nur hier. Eine Sicherung dauert zehn Sekunden.",
            "{n} Tage stehen in dieser App, und sie stehen nur hier. Eine Sicherung dauert zehn Sekunden.", anzahl),
       )}</div>`,
    );
    const r = document.createElement("div");
    r.className = "knopf-reihe";
    const a = document.createElement("a");
    a.className = "knopf";
    a.href = "#/sicherung";
    a.textContent = T("Jetzt sichern");
    r.appendChild(a);
    k.appendChild(r);
    ziel.appendChild(k);
  }

  /* -------------------------------------------------------------- Verlauf */

  function seiteVerlauf(ziel) {
    const tage = Object.keys(D.tage).filter((d) => !tagLeer(D.tage[d])).sort();
    if (!tage.length) {
      ziel.appendChild(
        karte(`<div class="leer">${esc(T("Noch nichts eingetragen."))}<br>${esc(T("Der Verlauf entsteht von selbst, sobald es ein paar Tage gibt."))}</div>`),
      );
      return;
    }

    const spanne = D.einstellungen.spanne || 30;
    const bis = heuteISO();
    const von = verschoben(bis, -(spanne - 1));
    const reihe = [];
    for (let d = von; tageZwischen(d, bis) >= 0; d = verschoben(d, 1)) reihe.push(d);

    /* Spanne waehlen */
    const kw = karte(`<p class="kicker">${esc(T("Zeitraum"))}</p><h2 class="h2">${esc(TV("Letzte {n} Tage", { n: spanne }))}</h2>`);
    schalterListe(kw, {
      einzeln: true,
      optionen: [{ wert: 14, text: T("14 Tage") }, { wert: 30, text: T("30 Tage") }, { wert: 90, text: T("90 Tage") }],
      gewaehlt: spanne,
      beiWahl: (w) => {
        D.einstellungen.spanne = w;
        sichern();
        zeichnen();
        return w;
      },
    });
    ziel.appendChild(kw);

    /* Diagramm 1: bis zu drei Regler, eine Achse, gleiche Einheit. Welche,
       waehlt sie selbst; jede gewaehlte Erkrankung bringt ihre mit. Drei,
       weil die drei Linienfarben gegen Farbsinnschwaechen geprueft sind und
       eine vierte das nicht mehr waere. */
    const moeglich = [];
    if (GRUND.befinden) moeglich.push({ schluessel: "befinden", name: MT(GRUND.befinden.name) });
    skalenAktiv().forEach((s) => moeglich.push({ schluessel: s.schluessel, name: MT(s.name) }));
    const vorhanden = moeglich.filter((m) => reihe.some((d) => D.tage[d] && D.tage[d][m.schluessel] != null));
    let gewaehlt = (D.einstellungen.verlaufSerien || []).filter((k) => vorhanden.some((m) => m.schluessel === k));
    if (!gewaehlt.length) gewaehlt = vorhanden.slice(0, 3).map((m) => m.schluessel);
    const farben = ["var(--serie-1)", "var(--serie-2)", "var(--serie-3)"];
    const serien = gewaehlt.map((k, i) => {
      const m = vorhanden.find((x) => x.schluessel === k);
      return { name: m.name, kurz: m.name.length > 8 ? m.name.slice(0, 7) + "." : m.name, schluessel: k, farbe: farben[i] };
    });

    if (vorhanden.length) {
      const k = karte(
        `<p class="kicker">${esc(T("Alle auf derselben Skala, 0 bis 10"))}</p>
         <h2 class="h2">${esc(T("Deine Regler im Verlauf"))}</h2>`,
      );
      if (vorhanden.length > 1) {
        const wahl = schalterListe(k, {
          optionen: vorhanden.map((m) => ({ wert: m.schluessel, text: m.name })),
          gewaehlt: gewaehlt,
          beiWahl: (w) => {
            let neu = gewaehlt.includes(w) ? gewaehlt.filter((x) => x !== w) : gewaehlt.concat([w]);
            if (neu.length > 3) { melden(T("Hoechstens drei Linien zugleich.")); neu = gewaehlt; }
            D.einstellungen.verlaufSerien = neu;
            sichern();
            zeichnen();
            return neu;
          },
        });
        wahl.classList.add("klein-wahl");
      }
      if (serien.length) {
        k.appendChild(linienDiagramm(reihe, serien, 0, 10));
        k.appendChild(tabelleZu(reihe, serien));
      }
      ziel.appendChild(k);
    }

    /* Diagramm 2: Schlafstunden, eigene Einheit, eigenes Bild */
    if (reihe.some((d) => D.tage[d] && D.tage[d].schlafStunden != null)) {
      const werte = reihe.map((d) => (D.tage[d] ? D.tage[d].schlafStunden : null)).filter((v) => v != null);
      const max = Math.max(10, Math.ceil(Math.max(...werte)));
      const k = karte(`<p class="kicker">${esc(T("Stunden je Nacht"))}</p><h2 class="h2">${esc(T("Schlaf"))}</h2>`);
      k.appendChild(
        linienDiagramm(reihe, [{ name: T("Schlaf"), schluessel: "schlafStunden", farbe: "var(--serie-1)" }], 0, max),
      );
      ziel.appendChild(k);
    }

    /* Kalender */
    const mitBefinden = reihe.some((d) => D.tage[d] && D.tage[d].befinden != null);
    const kk = karte(
      mitBefinden
        ? `<p class="kicker">${esc(T("Ein Feld je Tag, dunkler heisst schlechter"))}</p><h2 class="h2">${esc(T("Befinden im Ueberblick"))}</h2>`
        : `<p class="kicker">${esc(T("Ein Feld je Tag, dunkler heisst muerber"))}</p><h2 class="h2">${esc(T("Muedigkeit im Ueberblick"))}</h2>`,
    );
    kk.appendChild(kalender(reihe, mitBefinden));
    ziel.appendChild(kk);

    /* Einen Tag nachtragen */
    const kn = karte(`<p class="kicker">${esc(T("Nachtragen"))}</p><h2 class="h2">${esc(T("Einen anderen Tag"))}</h2>`);
    const wahl = feld(kn, {
      label: T("Datum"), typ: "date", wert: "",
      beiAenderung: (v) => {
        if (!v || v > heuteISO()) return;
        nachtragTag = v === heuteISO() ? null : v;
        location.hash = "#/heute";
      },
    });
    wahl.max = heuteISO();
    const liste = document.createElement("ul");
    liste.className = "liste";
    tage.slice(-10).reverse().forEach((d) => {
      const e = D.tage[d];
      const li = document.createElement("li");
      li.innerHTML =
        `<div class="txt"><b>${esc(kurzesDatum(d))} &middot; ${esc(new Date(d + "T12:00:00").toLocaleDateString(LOKAL(), { weekday: "short" }))}</b>` +
        `<small>${esc(zusammenfassung(e))}</small></div>`;
      liste.appendChild(li);
    });
    kn.appendChild(liste);
    ziel.appendChild(kn);
  }

  function zusammenfassung(e) {
    const teile = [];
    if (e.befinden != null) teile.push(TV("Befinden {n}", { n: e.befinden }));
    if (e.muedigkeit != null) teile.push(TV("Muedigkeit {n}", { n: e.muedigkeit }));
    if (e.schmerz != null) teile.push(TV("Schmerz {n}", { n: e.schmerz }));
    if (e.schlafStunden != null) teile.push(TV("{n} h Schlaf", { n: e.schlafStunden }));
    if (e.symptome && e.symptome.length) teile.push(e.symptome.map(zeichenText).join(", "));
    if (e.gluten === "exposition") teile.push(T("Gluten bekommen"));
    if (e.notiz) teile.push(e.notiz);
    return teile.join(" · ") || T("nichts eingetragen");
  }

  /* ----------------------------------------------------------- Diagramme */

  function linienDiagramm(tage, serien, min, max) {
    /*
     * Das viewBox-Raster ist absichtlich ungefaehr so breit wie die Karte auf
     * einem Telefon. Vorher stand hier 640, und der Browser hat das Bild auf
     * die halbe Groesse geschrumpft, samt Schrift: die Achsenzahlen kamen bei
     * fuenf Pixeln an. Steht das Raster in der Naehe der echten Breite, ist
     * eine 11 in der CSS-Datei auch am Bildschirm eine 11.
     */
    const B = 330, H = 208, L = 26, R = 58, O = 12, U = 24;
    const bx = B - L - R, by = H - O - U;
    const x = (i) => L + (tage.length < 2 ? bx / 2 : (i / (tage.length - 1)) * bx);
    const y = (v) => O + by - ((v - min) / (max - min)) * by;

    const huelle = document.createElement("div");
    huelle.className = "viz";

    let s = `<svg viewBox="0 0 ${B} ${H}" role="img" aria-label="${esc(TV("Verlauf ueber {n} Tage. Die Zahlen stehen in der Tabelle darunter.", { n: tage.length }))}">`;

    const schritte = 5;
    for (let i = 0; i <= schritte; i++) {
      const v = min + ((max - min) * i) / schritte;
      const yy = y(v);
      s += `<line class="raster" x1="${L}" y1="${yy.toFixed(1)}" x2="${L + bx}" y2="${yy.toFixed(1)}"/>`;
      s += `<text class="achse" x="${L - 8}" y="${(yy + 3.6).toFixed(1)}" text-anchor="end">${Math.round(v)}</text>`;
    }

    /* Datumsmarken. Der letzte Tag steht immer da. Steht eine Marke davor zu
       eng daneben, faellt die weg, nicht der letzte Tag: sonst liest sich das
       Ende der Achse als ein einziges Zahlengemenge. */
    const schritt = Math.max(1, Math.floor(tage.length / 4));
    const marken = [];
    tage.forEach((d, i) => {
      if (i % schritt === 0) marken.push({ d, x: x(i) });
    });
    const letzter = { d: tage[tage.length - 1], x: x(tage.length - 1) };
    while (marken.length && letzter.x - marken[marken.length - 1].x < 46) marken.pop();
    if (!marken.length || marken[marken.length - 1].x !== letzter.x) marken.push(letzter);
    marken.forEach((m) => {
      s += `<text class="achse" x="${m.x.toFixed(1)}" y="${H - 8}" text-anchor="middle">${esc(kurzesDatum(m.d))}</text>`;
    });

    const enden = [];
    serien.forEach((serie) => {
      const punkte = [];
      tage.forEach((d, i) => {
        const e = D.tage[d];
        const v = e ? e[serie.schluessel] : null;
        if (v != null) punkte.push({ i, v });
      });
      if (!punkte.length) return;

      /* Jede zusammenhaengende Strecke als eigener Pfad: eine Luecke im
         Tagebuch ist eine Luecke und wird nicht ueberbrueckt. */
      let stueck = [];
      const stuecke = [];
      punkte.forEach((p, n) => {
        if (n > 0 && p.i !== punkte[n - 1].i + 1) { stuecke.push(stueck); stueck = []; }
        stueck.push(p);
      });
      stuecke.push(stueck);

      stuecke.forEach((st) => {
        if (st.length < 2) return;
        const d = st.map((p, n) => `${n ? "L" : "M"}${x(p.i).toFixed(1)} ${y(p.v).toFixed(1)}`).join(" ");
        s += `<path class="pfad" d="${d}" stroke="${serie.farbe}"/>`;
      });
      /* Punkte nur, wo sie etwas sagen. Bei dreissig Tagen stehen sie so eng,
         dass die Linie zur Punktreihe zerfaellt und aussieht wie gestrichelt.
         Also: bei wenigen Tagen jeder Punkt, sonst nur die, die allein stehen,
         denn ein einzelner Tag zwischen zwei Luecken hat keine Linie und waere
         ohne Punkt gar nicht da. */
      const dicht = punkte.length > 16;
      stuecke.forEach((st) => {
        if (dicht && st.length > 1) return;
        st.forEach((p) => {
          s += `<circle class="punkt-mark" cx="${x(p.i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="3" fill="${serie.farbe}"/>`;
        });
      });

      /* Beschriftung am letzten Punkt. Sie ist hier nicht Schmuck: das Gruen
         liegt auf hellem Grund unter 3:1, also darf die Farbe die Linien nicht
         allein auseinanderhalten. */
      const letzter = punkte[punkte.length - 1];
      enden.push({ x: x(letzter.i) + 8, y: y(letzter.v) + 4, farbe: serie.farbe, text: serie.kurz || serie.name });
    });

    /* Enden zwei Linien beim selben Wert, liegen die Beschriftungen sonst
       uebereinander und keine ist lesbar. Also auseinanderschieben, mit
       mindestens 12 Einheiten Abstand. */
    enden.sort((a, b) => a.y - b.y);
    for (let i = 1; i < enden.length; i++) {
      if (enden[i].y - enden[i - 1].y < 12) enden[i].y = enden[i - 1].y + 12;
    }
    const ueber = enden.length ? enden[enden.length - 1].y - (H - 2) : 0;
    if (ueber > 0) enden.forEach((e) => { e.y -= ueber; });
    enden.forEach((e) => {
      s += `<text class="endlabel" x="${e.x.toFixed(1)}" y="${e.y.toFixed(1)}" fill="${e.farbe}">${esc(e.text)}</text>`;
    });

    s += "</svg>";
    huelle.innerHTML = s;

    if (serien.length > 1) {
      const leg = document.createElement("div");
      leg.className = "viz-legende";
      serien.forEach((serie) => {
        const sp = document.createElement("span");
        const i = document.createElement("i");
        i.style.background = serie.farbe;
        sp.append(i, document.createTextNode(serie.name));
        leg.appendChild(sp);
      });
      huelle.appendChild(leg);
    }
    return huelle;
  }

  function tabelleZu(tage, serien) {
    const mit = tage.filter((d) => D.tage[d] && serien.some((s) => D.tage[d][s.schluessel] != null));
    const det = document.createElement("details");
    det.innerHTML =
      `<summary>${esc(T("Die Zahlen als Tabelle"))}</summary>` +
      `<div class="details-inhalt tabelle-huelle"><table class="tabelle"><thead><tr><th>${esc(T("Tag"))}</th>` +
      serien.map((s) => `<th>${esc(s.name)}</th>`).join("") +
      `</tr></thead><tbody>` +
      mit.slice(-30).reverse().map((d) =>
        `<tr><td>${esc(kurzesDatum(d))}</td>` +
        serien.map((s) => `<td>${D.tage[d][s.schluessel] == null ? "&ndash;" : D.tage[d][s.schluessel]}</td>`).join("") +
        `</tr>`,
      ).join("") +
      `</tbody></table></div>`;
    const w = document.createElement("div");
    w.style.marginTop = "6px";
    w.appendChild(det);
    return w;
  }

  function kalender(tage, mitBefinden) {
    const huelle = document.createElement("div");
    const wt = document.createElement("div");
    wt.className = "kalender-tage";
    /*
     * Die Kuerzel kommen vom Browser, damit sie in jeder Sprache stimmen. Der
     * 5. Januar 2026 ist ein Montag. Zwei Buchstaben, weil sieben Spalten auf
     * ein Telefon muessen; in den fuenf Sprachen hier bleiben sie dabei
     * unterscheidbar, und das Datum steht ohnehin in der Tabelle darunter.
     */
    const montag = new Date("2026-01-05T12:00:00");
    for (let i = 0; i < 7; i++) {
      const d = new Date(montag);
      d.setDate(d.getDate() + i);
      const s = document.createElement("span");
      s.textContent = d.toLocaleDateString(LOKAL(), { weekday: "short" }).slice(0, 2);
      wt.appendChild(s);
    }
    const gitter = document.createElement("div");
    gitter.className = "kalender";

    const ramp = ["--ramp-100", "--ramp-250", "--ramp-400", "--ramp-550", "--ramp-700"];
    const ersterWochentag = (new Date(tage[0] + "T12:00:00").getDay() + 6) % 7;
    for (let i = 0; i < ersterWochentag; i++) {
      const l = document.createElement("i");
      l.style.visibility = "hidden";
      gitter.appendChild(l);
    }
    tage.forEach((d) => {
      const e = D.tage[d];
      const roh = e ? (mitBefinden ? e.befinden : e.muedigkeit) : null;
      /* Beim Befinden ist 10 gut, also dreht sich die Stufe um: dunkel heisst
         auf beiden Karten dasselbe, naemlich ein schlechter Tag. */
      const v = roh == null ? null : (mitBefinden ? 10 - roh : roh);
      const z = document.createElement("i");
      if (v != null) {
        const stufe = Math.min(4, Math.floor(v / 2.2));
        z.style.background = `var(${ramp[stufe]})`;
        z.style.borderColor = "transparent";
      }
      z.title = `${kurzesDatum(d)}: ${roh == null ? T("kein Eintrag") : (mitBefinden ? T("Befinden") : T("Muedigkeit")) + " " + roh}`;
      gitter.appendChild(z);
    });
    huelle.append(wt, gitter);

    const leg = document.createElement("p");
    leg.className = "klein";
    leg.style.marginTop = "10px";
    leg.textContent = mitBefinden
      ? T("Hell heisst ein guter Tag, dunkel ein schlechter. Ein leeres Feld ist ein Tag ohne Eintrag.")
      : T("Hell heisst wach, dunkel heisst erschoepft. Ein leeres Feld ist ein Tag ohne Eintrag.");
    huelle.appendChild(leg);
    return huelle;
  }

  /* ---------------------------------------------------------------- Essen */

  /* Welche der Essensgruppen aus inhalt-*.js zu welcher Erkrankung gehoeren,
     in derselben Reihenfolge wie dort. */
  const ESSEN_FUER = ["zoeliakie", "zoeliakie", "sle", "sle", "sle|zoeliakie", "zoeliakie"];

  function tagName(t) {
    switch (t) {
      case "mediterran": return T("mediterran");
      case "omega3": return T("Omega-3");
      case "eisen": return T("Eisen");
      case "kalzium": return T("Kalzium");
      case "eiweiss": return T("Eiweiss");
      case "ballaststoffe": return T("Ballaststoffe");
      case "schonend": return T("schonend");
      case "vegetarisch": return T("vegetarisch");
      case "ohneMilch": return T("ohne Milch");
      case "vorrat": return T("auf Vorrat");
      default: return t;
    }
  }

  /* Alle Rezepte in einer Form: die acht uebersetzten aus inhalt-*.js und die
     neuen aus rezepte.js. Die id ist der Schluessel fuer "Gemerkt" und
     aendert sich nie. */
  function rezepteAlle() {
    const liste = [];
    (REZEPTE.bestand || []).forEach((b) => {
      const r = (I.rezepte || [])[b.index];
      if (!r) return;
      liste.push({
        id: "bestand-" + b.index, name: r.name, minuten: b.minuten, kraft: b.kraft, tags: b.tags,
        aufwand: r.aufwand, warum: r.warum, zutaten: r.zutaten, schritte: r.schritte, hinweis: r.achtung || "",
      });
    });
    (REZEPTE.neu || []).forEach((r) => liste.push({
      id: r.id, name: MT(r.name), minuten: r.minuten, kraft: r.kraft, tags: r.tags,
      aufwand: TP("{n} Minute", "{n} Minuten", r.minuten), warum: MT(r.warum),
      zutaten: MT(r.zutaten) || [], schritte: MT(r.schritte) || [], hinweis: MT(r.hinweis),
    }));
    return liste;
  }

  function bevorzugteTags() {
    const t = new Set();
    aktiveModule().forEach((m) => ((m.rezepte && m.rezepte.bevorzugt) || []).forEach((x) => t.add(x)));
    return t;
  }

  /*
   * Die Auswahl des Monats. Sechs Rezepte, vier davon mit Merkmalen, die zu
   * den gewaehlten Erkrankungen passen, zwei zur Abwechslung. Die Reihenfolge
   * ist fest gemischt, und jeder Monat schneidet ein anderes Stueck heraus:
   * so kommt jedes Rezept der Reihe nach dran, statt dass immer dieselben
   * oben stehen. Kein Zufall beim Oeffnen: wer dreimal am Tag hineinschaut,
   * sieht dreimal dasselbe.
   */
  function rezepteDesMonats() {
    const alle = rezepteAlle();
    if (!alle.length) return [];
    const gut = bevorzugteTags();
    const meiden = new Set();
    aktiveModule().forEach((m) => ((m.rezepte && m.rezepte.meiden) || []).forEach((x) => meiden.add(x)));
    const erlaubt = alle.filter((r) => !r.tags.some((t) => meiden.has(t)));
    const samen = (D.profil.module || []).join("+");
    const mischen = (liste) => liste
      .map((r) => ({ r, k: streuwert(samen + ":" + r.id) }))
      .sort((x, y) => x.k - y.k)
      .map((x) => x.r);
    const passend = mischen(erlaubt.filter((r) => r.tags.some((t) => gut.has(t))));
    const andere = mischen(erlaubt.filter((r) => !r.tags.some((t) => gut.has(t))));
    const jetzt = new Date();
    const monat = jetzt.getFullYear() * 12 + jetzt.getMonth();
    const stueck = (liste, n) => {
      if (!liste.length) return [];
      const aus = [];
      for (let i = 0; i < Math.min(n, liste.length); i++) aus.push(liste[(monat * n + i) % liste.length]);
      return aus;
    };
    let auswahl = stueck(passend, 4).concat(stueck(andere, 2));
    if (auswahl.length < 6) {
      erlaubt.forEach((r) => { if (auswahl.length < 6 && !auswahl.includes(r)) auswahl.push(r); });
    }
    return auswahl;
  }

  /* Ein fester Wert aus einem Text, damit dieselbe Eingabe dieselbe
     Mischung ergibt. FNV-1a, mehr braucht es hier nicht. */
  function streuwert(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function rezeptMarken(wirt, r) {
    const gut = bevorzugteTags();
    const box = document.createElement("div");
    box.className = "marken";
    const zeit = document.createElement("span");
    zeit.className = "marke";
    zeit.textContent = r.aufwand;
    box.appendChild(zeit);
    if (r.kraft === "wenig") {
      const k = document.createElement("span");
      k.className = "marke";
      k.textContent = T("wenig Kraft");
      box.appendChild(k);
    }
    r.tags.forEach((t) => {
      const m = document.createElement("span");
      m.className = "marke" + (gut.has(t) ? " passt" : "");
      m.textContent = tagName(t);
      box.appendChild(m);
    });
    wirt.appendChild(box);
  }

  function gemerktRezept(rid) { return D.gemerkt.rezepte.includes(rid); }

  function rezeptKarte(r) {
    const det = document.createElement("details");
    det.className = "rezept";
    const sum = document.createElement("summary");
    sum.innerHTML = `<span class="stelle-kopf"><b>${esc(r.name)}</b><small>${esc(r.aufwand)}</small></span>`;
    const herz = document.createElement("button");
    herz.type = "button";
    herz.className = "herz";
    const setzen = () => {
      const an = gemerktRezept(r.id);
      herz.setAttribute("aria-pressed", String(an));
      herz.setAttribute("aria-label", an ? T("Nicht mehr merken") : T("Merken"));
    };
    setzen();
    herz.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>';
    herz.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const g = D.gemerkt.rezepte;
      D.gemerkt.rezepte = g.includes(r.id) ? g.filter((x) => x !== r.id) : g.concat([r.id]);
      sichern();
      setzen();
      melden(gemerktRezept(r.id) ? T("In der Mappe gemerkt.") : T("Nicht mehr gemerkt."));
    });
    sum.appendChild(herz);
    det.appendChild(sum);
    const box = document.createElement("div");
    box.className = "details-inhalt";
    rezeptMarken(box, r);
    box.insertAdjacentHTML(
      "beforeend",
      `<p>${esc(r.warum)}</p>` +
      `<h4>${esc(T("Zutaten"))}</h4><ul>${r.zutaten.map((z) => `<li>${esc(z)}</li>`).join("")}</ul>` +
      `<h4>${esc(T("So geht es"))}</h4><ul>${r.schritte.map((z) => `<li>${esc(z)}</li>`).join("")}</ul>` +
      (r.hinweis ? `<h4>${esc(T("Aufpassen"))}</h4><p>${esc(r.hinweis)}</p>` : ""),
    );
    det.appendChild(box);
    return det;
  }

  /* ----------------------------------------------------- Rezepte aus dem Netz
   *
   * Gesammelt einmal im Monat von werkzeug/rezepte-holen.js, aus Seiten, die
   * glutenfrei kochen. In der Datei stehen Name, Zutaten, Zeiten und die
   * Adresse; die Zubereitung bleibt beim Original und wird verlinkt. Gemerkt
   * wird eine Kopie, damit ein Rezept nicht verschwindet, wenn im naechsten
   * Monat andere in der Datei stehen.
   */
  function netzRezepte() {
    const gut = bevorzugteTags();
    return (NETZ.rezepte || [])
      .map((r) => ({
        r,
        wert: r.tags.filter((t) => gut.has(t)).length * 2 + (r.sprache === L ? 3 : 0) + (r.pruefen.length ? -1 : 0),
      }))
      .sort((a, b) => b.wert - a.wert || streuwert(a.r.id) - streuwert(b.r.id))
      .map((x) => x.r);
  }

  function gemerktNetz(rid) { return D.gemerkt.netz.some((x) => x.id === rid); }

  const DECKEL = {
    omega3: ["#2a78d6", "#5fc4e8"], eisen: ["#b4462f", "#f08a5d"], kalzium: ["#7b6cff", "#c6b8ff"],
    eiweiss: ["#d9822b", "#f6c177"], ballaststoffe: ["#2f9e5b", "#9be3a8"], mediterran: ["#1f8a8a", "#f2c14e"],
  };

  function netzKarte(r) {
    const det = document.createElement("details");
    det.className = "netz";
    const [f1, f2] = DECKEL[r.tags.find((t) => DECKEL[t])] || ["#4b5563", "#9ca3af"];
    const sum = document.createElement("summary");
    const deckel = document.createElement("span");
    deckel.className = "deckel";
    deckel.style.setProperty("--d1", f1);
    deckel.style.setProperty("--d2", f2);
    deckel.innerHTML =
      `<span class="deckel-quelle">${esc(r.quelle)}${r.sprache !== L ? ` · ${esc(r.sprache.toUpperCase())}` : ""}</span>` +
      `<b class="deckel-name" lang="${esc(r.sprache)}">${esc(r.name)}</b>` +
      `<span class="deckel-fuss">${r.minuten ? esc(TP("{n} Minute", "{n} Minuten", r.minuten)) : ""}${r.zutaten.length ? (r.minuten ? " · " : "") + esc(TP("{n} Zutat", "{n} Zutaten", r.zutaten.length)) : ""}</span>`;
    sum.appendChild(deckel);
    const herz = document.createElement("button");
    herz.type = "button";
    herz.className = "herz auf-deckel";
    const setzen = () => {
      const an = gemerktNetz(r.id);
      herz.setAttribute("aria-pressed", String(an));
      herz.setAttribute("aria-label", an ? T("Nicht mehr merken") : T("Merken"));
    };
    setzen();
    herz.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>';
    herz.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      D.gemerkt.netz = gemerktNetz(r.id)
        ? D.gemerkt.netz.filter((x) => x.id !== r.id)
        : D.gemerkt.netz.concat([Object.assign({ gemerkt: heuteISO() }, r)]);
      sichern();
      setzen();
      melden(gemerktNetz(r.id) ? T("In der Mappe gemerkt.") : T("Nicht mehr gemerkt."));
    });
    sum.appendChild(herz);
    det.appendChild(sum);

    const box = document.createElement("div");
    box.className = "details-inhalt";
    const marken = { aufwand: r.minuten ? TP("{n} Minute", "{n} Minuten", r.minuten) : T("Zeit beim Original"), tags: r.tags, kraft: r.minuten && r.minuten <= 20 ? "wenig" : "mittel" };
    rezeptMarken(box, marken);
    const info = [];
    if (r.portionen) info.push(TV("Portionen: {n}", { n: r.portionen }));
    if (r.autor) info.push(TV("von {autor}", { autor: r.autor }));
    if (info.length) box.insertAdjacentHTML("beforeend", `<p class="klein">${esc(info.join(" · "))}</p>`);
    if (r.pruefen.length) {
      box.insertAdjacentHTML("beforeend",
        `<div class="hinweis pruefen"><b>${esc(T("Bitte pruefen, ob glutenfrei:"))}</b><ul>${r.pruefen.map((z) => `<li lang="${esc(r.sprache)}">${esc(z)}</li>`).join("")}</ul></div>`);
    }
    box.insertAdjacentHTML("beforeend",
      `<h4>${esc(T("Zutaten"))}</h4><ul class="zutaten" lang="${esc(r.sprache)}">${r.zutaten.map((z) => `<li>${esc(z)}</li>`).join("")}</ul>`);
    const reihe = document.createElement("div");
    reihe.className = "knopf-reihe";
    const a = document.createElement("a");
    a.className = "knopf";
    a.textContent = TV("Zur Zubereitung bei {quelle}", { quelle: r.quelle });
    if (zielSetzen(a, r.url, ["https:"])) reihe.appendChild(a);
    box.appendChild(reihe);
    box.insertAdjacentHTML("beforeend",
      `<p class="quelle">${esc(r.schritte ? TP("{n} Schritt beim Original.", "{n} Schritte beim Original.", r.schritte) + " " : "")}${esc(T("Glutenfrei laut Quelle und nach Pruefung der Zutatenliste. Beim Einkauf jede Packung trotzdem selbst pruefen."))}</p>`);
    det.appendChild(box);
    return det;
  }

  let essenAnsicht = "monat";

  function seiteEssen(ziel) {
    const mods = aktiveModule();
    const kopf = karte(
      `<p class="kicker">${esc(T("Fuer deine Erkrankungen"))}</p><h2 class="h2">${esc(T("Essen, das passt"))}</h2>
       <p class="lead">${esc(T("Nur glutenfreie Rezepte, aus dem Netz und aus der eigenen Sammlung. Die Auswahl wechselt jeden Monat und richtet sich nach dem, was deine Erkrankungen brauchen. Eine Merkhilfe, keine Verordnung."))}</p>`,
    );
    modulChips(kopf, mods, "#/profil");
    const tabs = schalterListe(kopf, {
      einzeln: true,
      optionen: [
        { wert: "monat", text: T("Diesen Monat") },
        { wert: "gemerkt", text: TV("Gemerkt ({n})", { n: D.gemerkt.rezepte.length + D.gemerkt.netz.length }) },
        { wert: "regeln", text: T("Regeln") },
      ],
      gewaehlt: essenAnsicht,
      beiWahl: (w) => { essenAnsicht = w; zeichnen(); return w; },
    });
    tabs.classList.add("segment", "reiter");
    ziel.appendChild(kopf);

    if (essenAnsicht === "monat") {
      const netz = netzRezepte();
      if (netz.length) {
        const kn = karte(`<p class="kicker">${esc(TV("Stand {monat}", { monat: monatJahr(NETZ.stand) }))}</p><h2 class="h2">${esc(T("Aus dem Netz, glutenfrei"))}</h2>
          <p class="lead">${esc(T("Jeden Monat neu gesammelt von Seiten, die glutenfrei kochen, sortiert nach deinen Erkrankungen. Hier stehen die Zutaten, die Zubereitung steht beim Original."))}</p>`);
        kn.classList.add("netz-karte");
        const gitter = document.createElement("div");
        gitter.className = "netz-gitter";
        netz.forEach((r) => gitter.appendChild(netzKarte(r)));
        kn.appendChild(gitter);
        ziel.appendChild(kn);
      }
      const auswahl = rezepteDesMonats();
      const km = karte(`<p class="kicker">${esc(T("Aus der Anker-Sammlung"))}</p><h2 class="h2">${esc(T("Rezepte des Monats"))}</h2>
        <p class="lead">${esc(T("Was zu deinen Erkrankungen passt, ist hervorgehoben. Mit dem Herz landet ein Rezept in der Mappe und bleibt dort, auch wenn der Monat wechselt."))}</p>`);
      auswahl.forEach((r) => km.appendChild(rezeptKarte(r)));
      ziel.appendChild(km);

      const ka = karte(`<p class="kicker">${esc(TP("{n} Rezept", "{n} Rezepte", rezepteAlle().length))}</p><h2 class="h2">${esc(T("Alle Rezepte"))}</h2>`);
      rezepteAlle().slice().sort((x, y) => x.minuten - y.minuten).forEach((r) => ka.appendChild(rezeptKarte(r)));
      ziel.appendChild(ka);
      return;
    }

    if (essenAnsicht === "gemerkt") {
      ziel.appendChild(gemerkteRezepteKarte());
      return;
    }

    /* Regeln: zuerst die der gewaehlten Erkrankungen, dann die ausfuehrlichen
       Gruppen aus dem Bericht, soweit sie dazugehoeren. */
    const art = { weg: "nein", vorsicht: "vielleicht", gut: "ja" };
    mods.forEach((m) => {
      if (!(m.essen || []).length) return;
      const k = karte(`<p class="kicker"><i class="modul-punkt"></i>${esc(MT(m.kurz))}</p><h2 class="h2">${esc(T("Was beim Essen zaehlt"))}</h2>`);
      k.style.setProperty("--punkt", m.farbe);
      const ul = document.createElement("ul");
      ul.className = "liste";
      m.essen.forEach((p) => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="punkt ${art[p.art] || "vielleicht"}"></span><div class="txt"><b>${esc(MT(p.was))}</b><small>${esc(MT(p.warum))}</small></div>`;
        ul.appendChild(li);
      });
      k.appendChild(ul);
      ziel.appendChild(k);
    });

    (I.essen || []).forEach((gruppe, i) => {
      if (!gilt(ESSEN_FUER[i])) return;
      const k = karte(`<p class="kicker">${esc(gruppe.kicker)}</p><h2 class="h2">${esc(gruppe.titel)}</h2>` +
        (gruppe.lead ? `<p class="lead">${esc(gruppe.lead)}</p>` : ""));
      const ul = document.createElement("ul");
      ul.className = "liste";
      gruppe.punkte.forEach((p) => {
        const li = document.createElement("li");
        li.innerHTML =
          `<span class="punkt ${esc(p.art)}"></span>` +
          `<div class="txt"><b>${esc(p.was)}</b><small>${esc(p.warum)}</small></div>`;
        ul.appendChild(li);
      });
      k.appendChild(ul);
      if (gruppe.quelle) {
        const q = document.createElement("p");
        q.className = "quelle";
        q.textContent = gruppe.quelle;
        k.appendChild(q);
      }
      ziel.appendChild(k);
    });
  }

  /* --------------------------------------------------------------- Wissen */

  /* Welche Kapitel aus inhalt-*.js zu welcher Erkrankung gehoeren. Sie
     stammen aus dem Bericht zu Lupus und Zoeliakie und reden auch so. */
  const WISSEN_FUER = ["sle|zoeliakie", "sle", "sle", "sle", "zoeliakie", "sle+zoeliakie", "sle", "sle"];

  function artName(a) {
    switch (a) {
      case "leitlinie": return T("Leitlinie");
      case "metaanalyse": return T("Meta-Analyse");
      case "uebersicht": return T("Uebersicht");
      case "studie": return T("Studie");
      default: return T("Artikel");
    }
  }

  function gemerktStudie(pmid) { return D.gemerkt.studien.some((s) => s.pmid === pmid); }

  /* Eine Arbeit aus der Uebersicht. Der Titel bleibt im Original, wie er in
     PubMed steht: eine Uebersetzung hier waere ungeprueft. */
  function studieZeile(st, modulId) {
    const li = document.createElement("li");
    li.className = "studie";
    const txt = document.createElement("div");
    txt.className = "txt";
    txt.innerHTML =
      `<span class="marke art-${esc(st.art)}">${esc(artName(st.art))}</span>` +
      `<b lang="en">${esc(st.titel)}</b>` +
      `<small>${esc(st.zeitschrift)}${st.datum ? " · " + esc(kurzesMonat(st.datum)) : ""}</small>`;
    const reihe = document.createElement("div");
    reihe.className = "studie-knoepfe";
    const link = document.createElement("a");
    link.className = "schalter";
    link.textContent = T("In PubMed lesen");
    const sicher = /^\d+$/.test(st.pmid) && zielSetzen(link, `https://pubmed.ncbi.nlm.nih.gov/${st.pmid}/`, ["https:"]);
    if (sicher) reihe.appendChild(link);
    const merk = document.createElement("button");
    merk.type = "button";
    merk.className = "schalter";
    const setzen = () => {
      const an = gemerktStudie(st.pmid);
      merk.setAttribute("aria-pressed", String(an));
      merk.textContent = an ? T("Gemerkt") : T("Fuer den Termin merken");
    };
    setzen();
    merk.addEventListener("click", () => {
      D.gemerkt.studien = gemerktStudie(st.pmid)
        ? D.gemerkt.studien.filter((x) => x.pmid !== st.pmid)
        : D.gemerkt.studien.concat([Object.assign({ modul: modulId, gemerkt: heuteISO() }, st)]);
      sichern();
      setzen();
    });
    reihe.appendChild(merk);
    txt.appendChild(reihe);
    li.appendChild(txt);
    return li;
  }

  function kurzesMonat(iso) {
    const d = new Date(String(iso).slice(0, 10) + "T12:00:00");
    if (isNaN(d)) return String(iso);
    return d.toLocaleDateString(LOKAL(), { month: "short", year: "numeric" });
  }

  let forschungWahl = null;

  function forschung(ziel) {
    const A = window.ANKER_AKTUELL;
    const mods = aktiveModule();
    if (!A || !A.forschung || !mods.length) return;

    const k = karte(
      `<p class="kicker">${esc(TV("Stand {monat}", { monat: monatJahr(A.stand) }))}</p>
       <h2 class="h2">${esc(T("Aktuelle Forschung"))}</h2>
       <p class="lead">${esc(T("Jeden Monat neu aus PubMed: Leitlinien, Uebersichten und Studien des letzten Jahres zu deinen Erkrankungen. Die Titel stehen im Original und sind nicht bewertet. Was davon fuer dich gilt, klaert die Sprechstunde."))}</p>`,
    );
    k.classList.add("forschung");

    /* Die Wahl: je Erkrankung eine Liste, und bei zwei oder mehr dazu die
       Arbeiten, die zwei davon zugleich betreffen. */
    const optionen = mods.map((m) => ({ wert: m.id, text: MT(m.kurz) }));
    const paare = [];
    for (let i = 0; i < mods.length; i++) {
      for (let j = i + 1; j < mods.length; j++) {
        const sch = [mods[i].id, mods[j].id].sort().join("+");
        if (A.paare && A.paare[sch] && A.paare[sch].length) paare.push({ sch, a: mods[i], b: mods[j] });
      }
    }
    if (paare.length) optionen.push({ wert: "paare", text: T("Zusammen") });
    if (!optionen.some((o) => o.wert === forschungWahl)) forschungWahl = optionen[0].wert;
    const wahl = schalterListe(k, {
      einzeln: true, optionen, gewaehlt: forschungWahl,
      beiWahl: (w) => { forschungWahl = w; zeichnen(); return w; },
    });
    wahl.classList.add("segment");

    const ul = document.createElement("ul");
    ul.className = "liste";
    if (forschungWahl === "paare") {
      paare.forEach((p) => {
        const kopf = document.createElement("li");
        kopf.className = "zwischen";
        kopf.textContent = `${MT(p.a.kurz)} + ${MT(p.b.kurz)}`;
        ul.appendChild(kopf);
        A.paare[p.sch].forEach((st) => ul.appendChild(studieZeile(st, p.sch)));
      });
    } else {
      const f = A.forschung[forschungWahl] || { neu: [], alltag: [] };
      (f.neu || []).forEach((st) => ul.appendChild(studieZeile(st, forschungWahl)));
      if ((f.alltag || []).length) {
        const kopf = document.createElement("li");
        kopf.className = "zwischen";
        kopf.textContent = T("Ernaehrung, Muedigkeit, Bewegung");
        ul.appendChild(kopf);
        f.alltag.forEach((st) => ul.appendChild(studieZeile(st, forschungWahl)));
      }
    }
    k.appendChild(ul);
    const q = document.createElement("p");
    q.className = "quelle";
    q.textContent = TV("Quelle: {quelle}. Gesucht nach Leitlinien, Meta-Analysen, systematischen Uebersichten und randomisierten Studien.", { quelle: A.quelle || "PubMed" });
    k.appendChild(q);
    ziel.appendChild(k);
  }

  function seiteWissen(ziel) {
    const kn = karte(
      `<div class="hinweis rot"><b>${esc(T("Wenn eines davon auftritt, ist das kein Fall fuer eine App."))}</b> ${esc(T("Dann sofort aerztliche Hilfe."))}</div>`,
    );
    const r = document.createElement("div");
    r.className = "knopf-reihe";
    const a = document.createElement("a");
    a.className = "knopf warn";
    a.href = "#/notfall";
    a.textContent = T("Warnzeichen ansehen");
    r.appendChild(a);
    kn.appendChild(r);
    ziel.appendChild(kn);

    forschung(ziel);

    I.wissen.forEach((kapitel, i) => {
      if (!gilt(WISSEN_FUER[i])) return;
      const k = karte(`<p class="kicker">${esc(kapitel.kicker)}</p><h2 class="h2">${esc(kapitel.titel)}</h2>`);
      kapitel.abschnitte.forEach((ab) => {
        const det = document.createElement("details");
        det.innerHTML =
          `<summary>${esc(ab.frage)}</summary><div class="details-inhalt">` +
          ab.antwort.map((t) => `<p>${t}</p>`).join("") +
          (ab.liste ? `<ul>${ab.liste.map((l) => `<li>${l}</li>`).join("")}</ul>` : "") +
          (ab.staerke ? `<p class="quelle"><b>${esc(T("Wie gut belegt:"))}</b> ${esc(ab.staerke)}</p>` : "") +
          (ab.quellen ? `<p class="quelle">${ab.quellen.map((q) => esc(q)).join("<br>")}</p>` : "") +
          `</div>`;
        k.appendChild(det);
      });
      ziel.appendChild(k);
    });

    const kf = karte(
      `<p class="kicker">${esc(T("Fuer den naechsten Termin"))}</p><h2 class="h2">${esc(T("Fragen, die sich lohnen"))}</h2>
       <p class="lead">${esc(T("Ausgedruckt oder abfotografiert mitnehmen. In der Sprechstunde faellt einem die Haelfte nicht ein."))}</p>`,
    );
    const ul = document.createElement("ul");
    ul.className = "liste";
    fragenAktiv().forEach((f) => {
      const li = document.createElement("li");
      li.innerHTML = `<div class="txt"><b>${esc(f.frage)}</b>${f.warum ? `<small>${esc(f.warum)}</small>` : ""}</div>`;
      ul.appendChild(li);
    });
    kf.appendChild(ul);
    ziel.appendChild(kf);
  }

  /* Die Fragen der gewaehlten Erkrankungen, dann die ausfuehrlichen aus dem
     Bericht, wenn Lupus oder Zoeliakie dabei ist. Doppelte fallen weg. */
  function fragenAktiv(nurModul) {
    const liste = [];
    const ausBericht = !nurModul ? gilt("sle|zoeliakie") : (nurModul === "sle" || nurModul === "zoeliakie");
    aktiveModule()
      .filter((m) => (!nurModul || m.id === nurModul) && !(ausBericht && m.id === "sle"))
      .forEach((m) => (m.fragen || []).forEach((f) => liste.push({ frage: MT(f), warum: MT(m.kurz) })));
    if (ausBericht) {
      (I.fragen || []).forEach((f) => { if (!liste.some((x) => x.frage === f.frage)) liste.push(f); });
    }
    return liste;
  }

  function seiteNotfall(ziel) {
    ziel.appendChild(
      karte(
        `<div class="hinweis rot"><b>${esc(T("Diese Liste ersetzt kein Urteil."))}</b> ${esc(T("Im Zweifel anrufen. Bei Atemnot, starken Brustschmerzen, ploetzlicher Schwaeche oder Sprachstoerung, Krampfanfall oder hohem Fieber unter immunsuppressiver Behandlung: Notruf."))}</div>`,
      ),
    );

    /* Die eigenen Nummern stehen ganz oben. Diese Seite wird im schlechtesten
       Moment geoeffnet, und dann ist Suchen das Letzte, was noch geht. */
    const notfall = (D.stellen || []).filter((st) => st.notfall && st.telefon);
    if (notfall.length) {
      const kn = karte(`<p class="kicker">${esc(T("Deine Nummern"))}</p><h2 class="h2">${esc(T("Wen du anrufst"))}</h2>`);
      const ul = document.createElement("ul");
      ul.className = "liste";
      notfall.forEach((st) => {
        const li = document.createElement("li");
        const txt = document.createElement("div");
        txt.className = "txt";
        const b = document.createElement("b");
        b.textContent = st.name;
        const small = document.createElement("small");
        small.textContent = T(st.rolle) + (st.haus ? " · " + st.haus : "");
        txt.append(b, small);
        li.appendChild(txt);
        const a = document.createElement("a");
        a.className = "knopf";
        a.textContent = st.telefon;
        if (zielSetzen(a, "tel:" + st.telefon.replace(/[^\d+]/g, ""), ["tel:"])) li.appendChild(a);
        ul.appendChild(li);
      });
      kn.appendChild(ul);
      ziel.appendChild(kn);
    }

    I.warnzeichen.forEach((g) => {
      const k = karte(`<p class="kicker">${esc(g.kicker)}</p><h2 class="h2">${esc(g.titel)}</h2>`);
      const ul = document.createElement("ul");
      ul.className = "liste";
      g.punkte.forEach((p) => {
        const li = document.createElement("li");
        li.innerHTML =
          `<span class="punkt ${esc(p.dringend)}"></span>` +
          `<div class="txt"><b>${esc(p.zeichen)}</b><small>${esc(p.warum)}</small></div>`;
        ul.appendChild(li);
      });
      k.appendChild(ul);
      ziel.appendChild(k);
    });
    zurueck(ziel, "#/wissen", T("Zurueck zu Wissen"));
  }

  function zurueck(ziel, href, text) {
    const r = document.createElement("div");
    r.className = "knopf-reihe";
    const a = document.createElement("a");
    a.className = "knopf leer";
    a.href = href;
    a.textContent = text;
    r.appendChild(a);
    ziel.appendChild(r);
  }

  /* ----------------------------------------------------------------- Mehr */

  function seiteMehr(ziel) {
    const mods = aktiveModule();

    /* Das Profil zuerst: es entscheidet, wie der Rest der App aussieht. */
    const kp = karte(`<p class="kicker">${esc(T("Deine App richtet sich danach"))}</p><h2 class="h2">${esc(T("Meine Erkrankungen"))}</h2>`);
    kp.classList.add("profil-karte");
    modulChips(kp, mods, null);
    const rp = document.createElement("div");
    rp.className = "knopf-reihe";
    const ap = document.createElement("a");
    ap.className = "knopf leer";
    ap.href = "#/profil";
    ap.textContent = T("Erkrankungen aendern");
    rp.appendChild(ap);
    kp.appendChild(rp);
    ziel.appendChild(kp);

    /* Fuer den Termin: eine Mappe je Erkrankung, und eine fuer alles. */
    const kt = karte(`<p class="kicker">${esc(T("Fuer den Arzttermin"))}</p><h2 class="h2">${esc(T("Arztmappe"))}</h2>
      <p class="lead">${esc(T("Zwoelf Wochen zusammengefasst, je Erkrankung oder alles zusammen. Zum Zeigen am Telefon, zum Drucken oder als PDF."))}</p>`);
    const rt = document.createElement("div");
    rt.className = "mappen";
    [{ id: "alle", name: T("Alles"), farbe: null }].concat(mods.map((m) => ({ id: m.id, name: MT(m.kurz), farbe: m.farbe }))).forEach((x) => {
      const a = document.createElement("a");
      a.className = "mappe";
      a.href = "#/bericht";
      if (x.farbe) a.style.setProperty("--punkt", x.farbe);
      a.innerHTML = `<i class="modul-punkt"></i><b>${esc(x.name)}</b>`;
      a.addEventListener("click", () => { berichtModul = x.id; });
      rt.appendChild(a);
    });
    kt.appendChild(rt);
    ziel.appendChild(kt);

    const eintraege = [
      { href: "#/gemerkt", name: T("Gemerkt"), was: TP("{n} Rezept", "{n} Rezepte", D.gemerkt.rezepte.length + D.gemerkt.netz.length) + ", " + TP("{n} Arbeit", "{n} Arbeiten", D.gemerkt.studien.length) },
      { href: "#/medikamente", name: T("Medikamente"), was: TV("{n} eingetragen", { n: D.medikamente.length }) },
      { href: "#/werte", name: T("Laborwerte"), was: TP("{n} Messung", "{n} Messungen", D.werte.length) },
      { href: "#/termine", name: T("Termine"), was: naechsterTermin() },
      { href: "#/stellen", name: T("Anlaufstellen"), was: stellenText() },
      { href: "#/sicherung", name: T("Sicherung"), was: sicherungsText() },
    ];
    const k = karte("");
    const ul = document.createElement("ul");
    ul.className = "liste nav-liste";
    eintraege.forEach((e) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = e.href;
      a.innerHTML = `<div class="txt"><b>${esc(e.name)}</b><small>${esc(e.was)}</small></div>`;
      li.appendChild(a);
      ul.appendChild(li);
    });
    k.appendChild(ul);
    ziel.appendChild(k);

    /* Sprache. Der Schalter erscheint erst, wenn es etwas zu waehlen gibt:
       eine Sprache ist keine Wahl, und ein Schalter mit einem Knopf ist Zierde.
       Sobald eine Sprache ihre Oberflaechentexte bekommt und in
       OBERFLAECHE_FERTIG steht, ist er von selbst da. */
    const moeglich = sprachenDa();
    if (moeglich.length > 1) {
      const ks = karte(`<p class="kicker">${esc(T("Sprache"))}</p><h2 class="h2">${esc(T("In welcher Sprache"))}</h2>`);
      schalterListe(ks, {
        einzeln: true,
        optionen: moeglich.map((x) => ({ wert: x.code, text: x.name })),
        gewaehlt: L,
        beiWahl: (w) => {
          D.einstellungen.sprache = w;
          sichern();
          spracheSetzen(w);
          zeichnen();
          return w;
        },
      });
      /* Ehrlich bleiben: Deutsch ist das Original, Englisch ist geprueft, die
         drei anderen sind es noch nicht. */
      if (!["de", "en"].includes(L)) {
        ks.insertAdjacentHTML("beforeend", `<p class="klein klein-abstand">${esc(T("Diese Uebersetzung ist sorgfaeltig gemacht, aber noch nicht von Muttersprachlerinnen oder medizinischem Fachpersonal geprueft. Im Zweifel gilt die deutsche Fassung."))}</p>`);
      }
      ziel.appendChild(ks);
    }

    /* Darstellung */
    const kd = karte(`<p class="kicker">${esc(T("Darstellung"))}</p><h2 class="h2">${esc(T("Hell oder dunkel"))}</h2>`);
    schalterListe(kd, {
      einzeln: true,
      optionen: [
        { wert: "auto", text: T("Wie das Geraet") },
        { wert: "light", text: T("Hell") },
        { wert: "dark", text: T("Dunkel") },
      ],
      gewaehlt: D.einstellungen.thema || "auto",
      beiWahl: (w) => {
        D.einstellungen.thema = w;
        themaSetzen();
        sichern();
        return w;
      },
    });
    ziel.appendChild(kd);

    ziel.appendChild(
      karte(
        `<p class="kicker">${esc(T("Was diese App ist"))}</p><h2 class="h2">${esc(T("Und was sie nicht ist"))}</h2>
         <p class="lead">${esc(T("Anker ist ein Tagebuch und eine Merkhilfe. Es stellt keine Diagnose, es rechnet nichts aus, was eine Aerztin ausrechnen muesste, und es gibt keine Empfehlung zu Medikamenten. Es hilft dabei, beim Termin die richtigen Dinge zu erzaehlen, und es macht sichtbar, was ueber Wochen passiert."))}</p>
         <p class="lead">${esc(T("Alles, was du eintraegst, bleibt auf diesem Geraet. Es gibt keinen Server und kein Konto. Die Seite darf gar keine Verbindung nach draussen aufbauen, das ist im Kopf des Dokuments festgelegt. Der Preis dafuer: gesichert wird nur, was du selbst sicherst."))}</p>
         <p class="lead">${esc(T("Die Forschungsuebersicht kommt nicht aus dem Netz in die App. Sie wird einmal im Monat auf GitHub aus PubMed zusammengestellt und als Datei mit der App ausgeliefert. Vom Telefon geht dabei nichts hinaus, auch nicht, welche Erkrankungen du gewaehlt hast."))}</p>`,
      ),
    );
  }

  /* -------------------------------------------------------------- Profil */

  function seiteProfil(ziel) {
    const erstes = !aktiveModule().length;
    ziel.appendChild(karte(
      erstes
        ? `<p class="kicker">${esc(T("Willkommen bei Anker"))}</p><h2 class="h2 gross">${esc(T("Wofuer brauchst du Anker?"))}</h2>
           <p class="lead">${esc(T("Waehle eine oder mehrere Erkrankungen. Jede bringt ihre eigenen Regler, Fragen, Laborwerte, Rezepte und Forschung mit, und die App setzt sich daraus zusammen. Aendern geht jederzeit unter Mappe."))}</p>`
        : `<p class="kicker">${esc(T("Deine App richtet sich danach"))}</p><h2 class="h2">${esc(T("Meine Erkrankungen"))}</h2>
           <p class="lead">${esc(T("Was du hier abwaehlst, verschwindet aus der Ansicht, nicht aus den Daten. Waehlst du es wieder, ist alles noch da."))}</p>`,
    ));

    const k = karte("");
    const liste = document.createElement("div");
    liste.className = "modul-wahl";
    MODUL_LISTE.forEach((m) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "modul-option";
      b.style.setProperty("--punkt", m.farbe);
      b.setAttribute("aria-pressed", String(hat(m.id)));
      b.innerHTML = `<span class="modul-haken" aria-hidden="true"></span><span class="modul-text"><b>${esc(MT(m.name))}</b><small>${esc(MT(m.beschreibung))}</small></span>`;
      b.addEventListener("click", () => {
        const jetzt = D.profil.module || [];
        D.profil.module = jetzt.includes(m.id) ? jetzt.filter((x) => x !== m.id) : jetzt.concat([m.id]);
        sichern();
        b.setAttribute("aria-pressed", String(hat(m.id)));
        akzentSetzen();
        weiter.disabled = !aktiveModule().length;
      });
      liste.appendChild(b);
    });
    k.appendChild(liste);
    const r = document.createElement("div");
    r.className = "knopf-reihe";
    const weiter = document.createElement("button");
    weiter.type = "button";
    weiter.className = "knopf voll";
    weiter.textContent = erstes ? T("Los geht es") : T("Fertig");
    weiter.disabled = !aktiveModule().length;
    weiter.addEventListener("click", () => {
      if (!aktiveModule().length) { melden(T("Bitte mindestens eine Erkrankung waehlen.")); return; }
      location.hash = erstes ? "#/heute" : "#/mehr";
      zeichnen();
    });
    r.appendChild(weiter);
    k.appendChild(r);
    ziel.appendChild(k);

    ziel.appendChild(karte(`<p class="klein">${esc(T("Fehlt eine Erkrankung? Neue Bausteine kommen in die Datei module.js, mit eigenen Reglern, Zeichen, Laborwerten und Regeln. Die App setzt sich daraus von selbst zusammen."))}</p>`));
    if (!erstes) zurueck(ziel, "#/mehr", T("Zurueck"));
  }

  /* ------------------------------------------------------------- Gemerkt */

  /* Gemerkte Rezepte aus beiden Quellen. Die aus dem Netz sind Kopien und
     bleiben, auch wenn sie im naechsten Monat nicht mehr gesammelt werden. */
  function gemerkteRezepteKarte() {
    const rez = rezepteAlle().filter((r) => gemerktRezept(r.id));
    const netz = D.gemerkt.netz.slice().reverse();
    const n = rez.length + netz.length;
    const kr = karte(`<p class="kicker">${esc(TP("{n} Rezept", "{n} Rezepte", n))}</p><h2 class="h2">${esc(T("Gemerkte Rezepte"))}</h2>`);
    if (!n) kr.insertAdjacentHTML("beforeend", `<div class="leer">${esc(T("Noch nichts gemerkt. Tippe bei einem Rezept auf das Herz."))}</div>`);
    if (netz.length) {
      const g = document.createElement("div");
      g.className = "netz-gitter";
      netz.forEach((r) => g.appendChild(netzKarte(r)));
      kr.appendChild(g);
    }
    rez.forEach((r) => kr.appendChild(rezeptKarte(r)));
    return kr;
  }

  function seiteGemerkt(ziel) {
    ziel.appendChild(gemerkteRezepteKarte());

    const st = D.gemerkt.studien.slice().reverse();
    const ks = karte(`<p class="kicker">${esc(TP("{n} Arbeit", "{n} Arbeiten", st.length))}</p><h2 class="h2">${esc(T("Fuer den Termin gemerkt"))}</h2>
      <p class="lead">${esc(T("Diese Arbeiten stehen auch in der Arztmappe. Am besten mit der Frage mitnehmen, ob sie fuer dich etwas aendern."))}</p>`);
    if (!st.length) {
      ks.insertAdjacentHTML("beforeend", `<div class="leer">${esc(T("Noch nichts gemerkt. Unter Wissen, Aktuelle Forschung, laesst sich jede Arbeit merken."))}</div>`);
    } else {
      const ul = document.createElement("ul");
      ul.className = "liste";
      st.forEach((s) => ul.appendChild(studieZeile(s, s.modul)));
      ks.appendChild(ul);
    }
    ziel.appendChild(ks);
    zurueck(ziel, "#/mehr", T("Zurueck"));
  }

  function stellenText() {
    const n = (D.stellen || []).length;
    if (!n) return T("Aerztinnen und Ambulanzen finden und behalten");
    const notfall = D.stellen.filter((s) => s.notfall).length;
    return (
      TP("{n} Stelle", "{n} Stellen", n) +
      (notfall ? ", " + TV("{n} im Notfall", { n: notfall }) : "")
    );
  }

  function naechsterTermin() {
    const kommend = D.termine.filter((t) => t.datum >= heuteISO()).sort((a, b) => a.datum.localeCompare(b.datum));
    if (!kommend.length) return T("keiner eingetragen");
    return TV("naechster am {datum}", { datum: kurzesDatum(kommend[0].datum) });
  }
  function sicherungsText() {
    const l = D.einstellungen.letzteSicherung;
    if (!l) return T("noch nie gesichert");
    const t = tageZwischen(l, heuteISO());
    return t === 0 ? T("heute gesichert") : TP("vor {n} Tag gesichert", "vor {n} Tagen gesichert", t);
  }

  /* ---------------------------------------------------------- Medikamente */

  function seiteMedikamente(ziel) {
    const k = karte(
      `<p class="kicker">${esc(T("Was du nimmst"))}</p><h2 class="h2">${esc(T("Liste"))}</h2>
       <p class="lead">${esc(T("Diese Liste ist fuer die Notaufnahme, die Apotheke und den naechsten Termin. Sie aendert nichts an der Behandlung, sie schreibt sie nur auf."))}</p>`,
    );
    if (!D.medikamente.length) {
      k.insertAdjacentHTML("beforeend", `<div class="leer">${esc(T("Noch nichts eingetragen."))}</div>`);
    } else {
      const ul = document.createElement("ul");
      ul.className = "liste";
      D.medikamente.forEach((m) => {
        const li = document.createElement("li");
        li.innerHTML =
          `<div class="txt"><b>${esc(m.name)}</b><small>${esc([m.dosis, m.zeit, m.seit ? T("seit") + " " + m.seit : ""].filter(Boolean).join(" · "))}${m.notiz ? "<br>" + esc(m.notiz) : ""}</small></div>`;
        const b = document.createElement("button");
        b.className = "schalter";
        b.textContent = T("Loeschen");
        b.addEventListener("click", () => {
          if (!confirm(TV("{name} aus der Liste nehmen?", { name: m.name }))) return;
          D.medikamente = D.medikamente.filter((x) => x.id !== m.id);
          sichern();
          zeichnen();
        });
        li.appendChild(b);
        ul.appendChild(li);
      });
      k.appendChild(ul);
    }
    ziel.appendChild(k);

    const kn = karte(`<p class="kicker">${esc(T("Hinzufuegen"))}</p><h2 class="h2">${esc(T("Neues Medikament"))}</h2>`);
    const neu = { name: "", dosis: "", zeit: "", seit: "", notiz: "" };
    feld(kn, { label: T("Name"), wert: "", platzhalter: "Hydroxychloroquin", beiAenderung: (v) => (neu.name = v) });
    const z = document.createElement("div");
    z.className = "zwei";
    feld(z, { label: T("Dosis"), wert: "", platzhalter: T("200 mg"), beiAenderung: (v) => (neu.dosis = v) });
    feld(z, { label: T("Wann"), wert: "", platzhalter: T("morgens"), beiAenderung: (v) => (neu.zeit = v) });
    kn.appendChild(z);
    feld(kn, { label: T("Seit"), typ: "date", wert: "", beiAenderung: (v) => (neu.seit = v) });
    feld(kn, { label: T("Notiz"), mehrzeilig: true, wert: "", platzhalter: T("verschrieben von ..."), beiAenderung: (v) => (neu.notiz = v) });
    const r = document.createElement("div");
    r.className = "knopf-reihe";
    const b = document.createElement("button");
    b.className = "knopf voll";
    b.textContent = T("In die Liste");
    b.addEventListener("click", () => {
      if (!neu.name) { melden(T("Ein Name fehlt.")); return; }
      D.medikamente.push(Object.assign({ id: id() }, neu));
      sichern();
      melden(T("Eingetragen."));
      zeichnen();
    });
    r.appendChild(b);
    kn.appendChild(r);
    ziel.appendChild(kn);

    ziel.appendChild(
      karte(
        `<p class="kicker">${esc(T("Zum Nachlesen"))}</p><h2 class="h2">${esc(T("Was ueberwacht gehoert"))}</h2>
         <p class="lead">${esc(T("Kein Zeitplan aus dieser App, sondern der aus der Sprechstunde. Die Liste hier ist nur die Erinnerung daran, dass es einen gibt und dass er eingehalten wird."))}</p>`,
      ),
    );
    const ku = karte("");
    /* Augen unter Hydroxychloroquin gehoeren zu Lupus, der tTG-Verlauf zur
       Zoeliakie. Gleiche Reihenfolge wie in inhalt-*.js. */
    const UEBERWACHUNG_FUER = ["sle", "sle", null, "zoeliakie", "sle|zoeliakie"];
    I.ueberwachung.forEach((u, i) => {
      if (!gilt(UEBERWACHUNG_FUER[i])) return;
      const det = document.createElement("details");
      det.innerHTML =
        `<summary>${esc(u.titel)}</summary><div class="details-inhalt">` +
        u.text.map((t) => `<p>${t}</p>`).join("") +
        (u.quellen ? `<p class="quelle">${u.quellen.map((q) => esc(q)).join("<br>")}</p>` : "") +
        `</div>`;
      ku.appendChild(det);
    });
    ziel.appendChild(ku);
    zurueck(ziel, "#/mehr", T("Zurueck"));
  }

  /* ---------------------------------------------------------------- Werte */

  function seiteWerte(ziel) {
    const liste = laborAktiv();
    const k = karte(
      `<p class="kicker">${esc(T("Aus dem Labor"))}</p><h2 class="h2">${esc(T("Werte eintragen"))}</h2>
       <p class="lead">${esc(T("Nur abschreiben, was auf dem Befund steht. Die Bedeutung steht beim jeweiligen Wert, die Beurteilung macht die Aerztin."))}</p>`,
    );
    const neu = { datum: heuteISO(), schluessel: liste[0].schluessel, wert: "" };
    feld(k, { label: T("Datum"), typ: "date", wert: neu.datum, beiAenderung: (v) => (neu.datum = v) });
    const sel = document.createElement("label");
    sel.className = "feld";
    sel.innerHTML = `<span>${esc(T("Wert"))}</span><select>${liste.map((w) => `<option value="${esc(w.schluessel)}">${esc(w.name)}${w.einheit ? " (" + esc(w.einheit) + ")" : ""}</option>`).join("")}</select>`;
    sel.querySelector("select").addEventListener("change", (ev) => (neu.schluessel = ev.target.value));
    k.appendChild(sel);
    feld(k, { label: T("Zahl"), typ: "number", schritt: "any", wert: "", beiAenderung: (v) => (neu.wert = v) });
    const r = document.createElement("div");
    r.className = "knopf-reihe";
    const b = document.createElement("button");
    b.className = "knopf voll";
    b.textContent = T("Eintragen");
    b.addEventListener("click", () => {
      if (neu.wert === "") { melden(T("Die Zahl fehlt.")); return; }
      D.werte.push({ id: id(), datum: neu.datum, schluessel: neu.schluessel, wert: Number(neu.wert) });
      sichern();
      melden(T("Eingetragen."));
      zeichnen();
    });
    r.appendChild(b);
    k.appendChild(r);
    ziel.appendChild(k);

    liste.forEach((w) => {
      const meine = D.werte.filter((x) => x.schluessel === w.schluessel).sort((a, b2) => a.datum.localeCompare(b2.datum));
      const kk = karte(
        `<p class="kicker">${esc(w.gruppe)}</p><h2 class="h2">${esc(w.name)}</h2>` +
        `<p class="lead">${esc(w.bedeutung)}</p>`,
      );
      if (meine.length) {
        if (meine.length > 1) kk.appendChild(minilinie(meine.map((m) => m.wert)));
        const ul = document.createElement("ul");
        ul.className = "liste";
        meine.slice().reverse().forEach((m) => {
          const li = document.createElement("li");
          li.innerHTML = `<div class="txt"><b>${esc(String(m.wert))} ${esc(w.einheit || "")}</b><small>${esc(kurzesDatum(m.datum))}</small></div>`;
          const del = document.createElement("button");
          del.className = "schalter";
          del.textContent = T("Weg");
          del.addEventListener("click", () => {
            D.werte = D.werte.filter((x) => x.id !== m.id);
            sichern();
            zeichnen();
          });
          li.appendChild(del);
          ul.appendChild(li);
        });
        kk.appendChild(ul);
      } else {
        kk.insertAdjacentHTML("beforeend", `<p class="klein klein-abstand">${esc(T("Noch nichts eingetragen."))}</p>`);
      }
      ziel.appendChild(kk);
    });
    zurueck(ziel, "#/mehr", T("Zurueck"));
  }

  /* Eine kleine Linie ohne Achsen, nur die Richtung. Die Zahlen stehen
     darunter, die Linie sagt nur: steigt, faellt, schwankt. */
  function minilinie(werte) {
    const B = 300, H = 46;
    const min = Math.min(...werte), max = Math.max(...werte);
    const y = (v) => (max === min ? H / 2 : H - 6 - ((v - min) / (max - min)) * (H - 12));
    const x = (i) => 6 + (i / (werte.length - 1)) * (B - 12);
    const d = werte.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
    const h = document.createElement("div");
    h.className = "minilinie";
    h.innerHTML = `<svg viewBox="0 0 ${B} ${H}" aria-hidden="true"><path d="${d}"/><circle cx="${x(werte.length - 1).toFixed(1)}" cy="${y(werte[werte.length - 1]).toFixed(1)}" r="3.5"/></svg>`;
    return h;
  }

  /* ---------------------------------------------------------- Anlaufstellen
   *
   * Die Funktion heisst Anlaufstellen und nicht Expertensuche. Der Unterschied
   * ist keine Wortklauberei: suchen kann diese App nicht. Sie hat kein Netz und
   * kein Verzeichnis, und beim Bauen war keine einzige medizinische Seite
   * erreichbar, also waere jede Adresse hier ungeprueft. Eine falsche Nummer,
   * die jemand im Schub waehlt, ist ein echter Schaden.
   *
   * Was die App stattdessen kann, und was in der Praxis die groessere Huerde
   * ist: sagen, mit welchen Woertern und ueber welche Stellen gesucht wird, und
   * danach behalten, was gefunden wurde. Das eigene Verzeichnis ist das einzige,
   * das diese App haben darf, weil darin nichts steht, was sie erfunden hat.
   *
   * Keine Ortung. Das war der naheliegende Zusatz und er ist bewusst nicht da:
   * eine Luftlinie sagt in einer Stadt wenig, sie braeuchte als einzige Stelle
   * der App eine Standortfreigabe, und der Satz, den sie selbst ins Feld Weg
   * schreibt, also welche Linie, wie viele Minuten, wo die Tuer ist, hilft an
   * einem schlechten Tag mehr als jede Zahl.
   */

  /*
   * Gespeichert wird immer der deutsche Schluessel, uebersetzt wird nur, was
   * dasteht. Andersherum wuerde ein Sprachwechsel jeder schon eingetragenen
   * Stelle ihre Rolle nehmen: in der Datei stuende dann "Rheumatology" und in
   * der Liste "Rheumatologie", und die beiden faenden nicht mehr zueinander.
   */
  const ROLLEN = [
    ["Rheumatologie", () => T("Rheumatologie")],
    ["Gastroenterologie", () => T("Gastroenterologie")],
    ["Hausarztpraxis", () => T("Hausarztpraxis")],
    ["Diaetologie", () => T("Diaetologie")],
    ["Augenheilkunde", () => T("Augenheilkunde")],
    ["Andere", () => T("Andere")],
  ];

  /* Ein Ziel wird nie aus gespeichertem Text zusammengebaut, sondern geprueft
     gesetzt. Sonst waere eine fremde Sicherungsdatei mit javascript: darin ein
     Einfallstor, und die Datei kommt ausdruecklich von aussen. */
  function zielSetzen(a, roh, erlaubt) {
    const wert = String(roh || "").trim();
    let u;
    try { u = new URL(wert); } catch (e) { return false; }
    if (!erlaubt.includes(u.protocol)) return false;
    a.href = u.href;
    if (u.protocol === "https:") {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.referrerPolicy = "no-referrer";
    }
    return true;
  }

  function kopieren(text, was) {
    const fertig = () => melden(TV("{was} kopiert.", { was: was }));
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(fertig, () => melden(T("Kopieren ging nicht. Bitte von Hand markieren.")));
      return;
    }
    melden(T("Kopieren ging nicht. Bitte von Hand markieren."));
  }

  function seiteStellen(ziel) {
    const stellen = D.stellen || (D.stellen = []);

    ziel.appendChild(
      karte(
        `<p class="kicker">${esc(T("Wie das gemeint ist"))}</p>
         <h2 class="h2">${esc(T("Keine Adresse, die niemand geprueft hat"))}</h2>
         <p class="lead">${esc(T("Anker nennt keine Ambulanz und keine Aerztin. Beim Bauen dieser App war kein einziges medizinisches Verzeichnis erreichbar, also waere jede Adresse hier ungeprueft, und eine ungepruefte Nummer ist schlechter als keine."))}</p>
         <p class="lead">${esc(T("Was die App kann: sagen, wonach genau zu suchen ist und ueber welche Stellen, und dann behalten, was du gefunden hast. Der zweite Teil ist der, der in fuenf Jahren noch etwas wert ist."))}</p>`,
      ),
    );

    /* Eigenes Verzeichnis */
    const kl = karte(
      `<p class="kicker">${stellen.length === 0 ? T("Noch leer") : stellen.length + " " + (stellen.length === 1 ? T("Eintrag") : T("Eintraege"))}</p>
       <h2 class="h2">${esc(T("Meine Stellen"))}</h2>`,
    );
    if (!stellen.length) {
      kl.insertAdjacentHTML(
        "beforeend",
        `<div class="leer">${esc(T("Noch nichts eingetragen. Das ist am Anfang der Normalfall."))}</div>`,
      );
    } else {
      stellen.forEach((st) => kl.appendChild(stelleZeile(st)));
    }
    ziel.appendChild(kl);

    /* Eintragen */
    const kn = karte(`<p class="kicker">${esc(T("Hinzufuegen"))}</p><h2 class="h2">${esc(T("Neue Stelle"))}</h2>`);
    const neu = { name: "", rolle: "Rheumatologie", haus: "", telefon: "", adresse: "", weg: "", notiz: "" };
    feld(kn, { label: T("Name"), wert: "", platzhalter: T("Wie du sie nennst"), beiAenderung: (v) => (neu.name = v) });
    const rollenTitel = document.createElement("p");
    rollenTitel.className = "kicker klein-abstand";
    rollenTitel.textContent = T("Wofuer");
    kn.appendChild(rollenTitel);
    schalterListe(kn, {
      einzeln: true,
      optionen: ROLLEN.map(([wert, text]) => ({ wert: wert, text: text() })),
      gewaehlt: neu.rolle,
      beiWahl: (w) => (neu.rolle = w),
    });
    feld(kn, { label: T("Haus oder Ordination"), wert: "", beiAenderung: (v) => (neu.haus = v) });
    feld(kn, { label: T("Telefon"), typ: "tel", wert: "", beiAenderung: (v) => (neu.telefon = v) });
    feld(kn, { label: T("Adresse"), wert: "", beiAenderung: (v) => (neu.adresse = v) });
    feld(kn, {
      label: T("Weg dorthin, in deinen Worten"),
      mehrzeilig: true,
      wert: "",
      platzhalter: T("Welche Linie, wie viele Minuten, wo die Tuer ist"),
      beiAenderung: (v) => (neu.weg = v),
    });
    feld(kn, { label: T("Notiz"), mehrzeilig: true, wert: "", beiAenderung: (v) => (neu.notiz = v) });
    const r = document.createElement("div");
    r.className = "knopf-reihe";
    const b = document.createElement("button");
    b.className = "knopf voll";
    b.textContent = T("Eintragen");
    b.addEventListener("click", () => {
      if (!neu.name) { melden(T("Der Name fehlt.")); return; }
      D.stellen.push(Object.assign({ id: id(), notfall: false, haken: [], kontakte: [], angelegt: heuteISO() }, neu));
      sichern();
      melden(T("Eingetragen."));
      zeichnen();
    });
    r.appendChild(b);
    kn.appendChild(r);
    ziel.appendChild(kn);

    /* Weiter */
    const kw = karte(`<p class="kicker">${esc(T("Weiter"))}</p><h2 class="h2">${esc(T("Wenn du noch keine hast"))}</h2>`);
    const rw = document.createElement("div");
    rw.className = "knopf-reihe";
    [["#/suchen", T("Eine Stelle finden")], ["#/erstgespraech", T("Beim ersten Mal")]].forEach(([h, t]) => {
      const a = document.createElement("a");
      a.className = "knopf leer";
      a.href = h;
      a.textContent = t;
      rw.appendChild(a);
    });
    kw.appendChild(rw);
    ziel.appendChild(kw);

    zurueck(ziel, "#/mehr", T("Zurueck"));
  }

  function stelleZeile(st) {
    const det = document.createElement("details");
    det.className = "stelle";
    const sum = document.createElement("summary");
    sum.innerHTML =
      `<span class="stelle-kopf"><b>${esc(st.name)}</b>` +
      `<small>${esc(T(st.rolle))}${st.haus ? " · " + esc(st.haus) : ""}${st.notfall ? " · " + esc(T("Notfallkontakt")) : ""}</small></span>`;
    det.appendChild(sum);

    const box = document.createElement("div");
    box.className = "details-inhalt";

    if (st.telefon) {
      const p = document.createElement("p");
      p.className = "stelle-zeile";
      const a = document.createElement("a");
      a.textContent = st.telefon;
      if (!zielSetzen(a, "tel:" + st.telefon.replace(/[^\d+]/g, ""), ["tel:"])) {
        p.textContent = TV("Telefon {nummer}", { nummer: st.telefon });
      } else {
        p.append(T("Telefon") + " ", a);
      }
      box.appendChild(p);
    }
    [[T("Adresse"), st.adresse], [T("Weg"), st.weg], [T("Notiz"), st.notiz]].forEach(([l, v]) => {
      if (!v) return;
      const p = document.createElement("p");
      p.className = "stelle-zeile";
      p.innerHTML = `<b>${esc(l)}</b><br>${esc(v)}`;
      box.appendChild(p);
    });

    /* Merkliste je Stelle: nach dem Termin steht da, was diese Stelle kann.
       Bei zwei Ambulanzen ist das der Vergleich, den sonst niemand fuehrt. */
    const mt = document.createElement("p");
    mt.className = "kicker klein-abstand";
    mt.textContent = T("Was diese Stelle kann");
    box.appendChild(mt);
    const ml = document.createElement("div");
    ml.className = "hakenliste";
    I.suche.merkmale.forEach((m) => {
      const l = document.createElement("label");
      l.className = "haken";
      const c = document.createElement("input");
      c.type = "checkbox";
      c.checked = (st.haken || []).includes(m.id);
      c.addEventListener("change", () => {
        st.haken = st.haken || [];
        st.haken = c.checked ? st.haken.concat([m.id]) : st.haken.filter((x) => x !== m.id);
        sichern();
      });
      const t = document.createElement("span");
      t.textContent = m.punkt;
      l.append(c, t);
      ml.appendChild(l);
    });
    box.appendChild(ml);

    /* Kontaktlog: Warteliste ist der Normalfall, Vergessen der Feind. */
    const kt = document.createElement("p");
    kt.className = "kicker klein-abstand";
    kt.textContent = T("Kontakt");
    box.appendChild(kt);
    if ((st.kontakte || []).length) {
      const ul = document.createElement("ul");
      ul.className = "liste";
      st.kontakte.slice(-5).reverse().forEach((k) => {
        const li = document.createElement("li");
        li.innerHTML = `<div class="txt"><b>${esc(kurzesDatum(k.datum))}</b><small>${esc(k.was)}</small></div>`;
        ul.appendChild(li);
      });
      box.appendChild(ul);
    }
    let notizWert = "";
    const nf = feld(box, {
      label: T("Was war"),
      wert: "",
      platzhalter: T("Angerufen, Rueckruf zugesagt"),
      beiAenderung: (v) => (notizWert = v),
    });
    const rz = document.createElement("div");
    rz.className = "knopf-reihe";
    const bz = document.createElement("button");
    bz.className = "knopf";
    bz.textContent = T("Notiert");
    bz.addEventListener("click", () => {
      const wert = nf.value.trim() || notizWert;
      if (!wert) { melden(T("Da steht nichts.")); return; }
      st.kontakte = (st.kontakte || []).concat([{ datum: heuteISO(), was: wert }]);
      sichern();
      melden(T("Notiert."));
      zeichnen();
    });
    rz.appendChild(bz);

    const bn = document.createElement("button");
    bn.className = "knopf";
    bn.textContent = st.notfall ? T("Kein Notfallkontakt") : T("Als Notfallkontakt");
    bn.addEventListener("click", () => {
      st.notfall = !st.notfall;
      sichern();
      melden(st.notfall ? T("Steht jetzt bei den Warnzeichen.") : T("Nicht mehr bei den Warnzeichen."));
      zeichnen();
    });
    rz.appendChild(bn);

    const bw = document.createElement("button");
    bw.className = "knopf warn";
    bw.textContent = T("Weg");
    bw.addEventListener("click", () => {
      if (!confirm(T("Diese Stelle entfernen?"))) return;
      D.stellen = D.stellen.filter((x) => x.id !== st.id);
      sichern();
      zeichnen();
    });
    rz.appendChild(bw);
    box.appendChild(rz);

    det.appendChild(box);
    return det;
  }

  /* -------------------------------------------------------- Eine Stelle finden */

  function seiteSuchen(ziel) {
    const e = D.einstellungen;
    const land = e.suchLand || "at";
    const thema = e.suchThema || "beides";

    /* Die Seite faengt mit dem Werkzeug an, nicht mit dem Vorbehalt. Der
       Vorbehalt gehoert dazu und steht zwei Zeilen darunter; als ganze
       Bildschirmseite gelesen haette ihn niemand. */
    const kf = karte(
      `<p class="kicker">${esc(T("Wo suchst du"))}</p><h2 class="h2">${esc(T("Der Weg, nicht die Adresse"))}</h2>
       <p class="lead">${esc(T("Anker nennt keine Ambulanz. Es kann keine pruefen. Was hier steht, sind Wege und die Woerter, mit denen man sie findet."))}</p>`,
    );
    schalterListe(kf, {
      einzeln: true,
      optionen: I.suche.laender,
      gewaehlt: land,
      beiWahl: (w) => { e.suchLand = w; sichern(); zeichnen(); return w; },
    });
    const kt = document.createElement("p");
    kt.className = "kicker klein-abstand";
    kt.textContent = T("Wofuer");
    kf.appendChild(kt);
    schalterListe(kf, {
      einzeln: true,
      optionen: [
        { wert: "beides", text: T("Beides") },
        { wert: "lupus", text: T("Lupus") },
        { wert: "zoeliakie", text: T("Zoeliakie") },
      ],
      gewaehlt: thema,
      beiWahl: (w) => { e.suchThema = w; sichern(); zeichnen(); return w; },
    });
    ziel.appendChild(kf);

    const passend = I.suche.wege.filter(
      (w) => w.land === land && (thema === "beides" || w.thema === thema || w.thema === "beides"),
    );

    const ks = karte(
      `<p class="kicker">${passend.length} ${passend.length === 1 ? T("Weg") : T("Wege")}</p>
       <h2 class="h2">Wo du fragst</h2>
       <p class="lead">${esc(T("Die sichersten Wege stehen oben, und es sind die, die nicht im Netz liegen. Der Suchbegriff daneben ist zum Kopieren gedacht: einmal tippen, dann Safari, dann einfuegen."))}</p>`,
    );
    const rang = { hoch: 0, mittel: 1, niedrig: 2 };
    passend
      .slice()
      .sort((a, b) => rang[a.sicherheit] - rang[b.sicherheit])
      .forEach((w) => {
        const d = document.createElement("details");
        d.className = "weg";
        const sum = document.createElement("summary");
        sum.innerHTML =
          `<span class="stelle-kopf"><b>${esc(w.name)}</b><small>${esc(w.was)}</small></span>` +
          `<span class="marke marke-${esc(w.sicherheit)}">${esc(w.sicherheit === "hoch" ? T("sicher") : w.sicherheit === "mittel" ? T("wohl") : T("unsicher"))}</span>`;
        d.appendChild(sum);
        const box = document.createElement("div");
        box.className = "details-inhalt";
        const p = document.createElement("p");
        p.textContent = w.weg;
        box.appendChild(p);

        const z = document.createElement("div");
        z.className = "suchzeile";
        const code = document.createElement("span");
        code.className = "suchwort";
        code.textContent = w.suchbegriff;
        const bk = document.createElement("button");
        /* Der leichtere Schalter, nicht der gefuellte Knopf: sonst stehen elf
           dunkle Flecken untereinander und die Seite wird laut. */
        bk.className = "schalter";
        bk.type = "button";
        bk.textContent = T("Kopieren");
        bk.addEventListener("click", () => kopieren(w.suchbegriff, T("Suchbegriff")));
        z.append(code, bk);
        box.appendChild(z);
        d.appendChild(box);
        ks.appendChild(d);
      });
    ziel.appendChild(ks);

    /* Das Lange steht zugeklappt. Wer es wissen will, macht es auf. */
    const kg = karte(`<p class="kicker">${esc(T("Zum Nachlesen"))}</p><h2 class="h2">${esc(T("Wie verlaesslich das hier ist"))}</h2>`);
    const dg = document.createElement("details");
    const sg = document.createElement("summary");
    sg.textContent = T("Warum kein einziger Link dasteht");
    const bg = document.createElement("div");
    bg.className = "details-inhalt";
    const pg1 = document.createElement("p");
    pg1.textContent =
      T("Anker koennte eine Adresse hinschreiben, aber nicht pruefen, ob sie stimmt und ob dort heute noch dasselbe steht. Ein Suchbegriff ueberlebt einen Seitenumbau, eine gespeicherte Adresse nicht. Und es geht keine Anfrage von dieser App aus, auch keine, die verraet, wonach du suchst.");
    const pg2 = document.createElement("p");
    pg2.textContent = I.suche.warnung;
    bg.append(pg1, pg2);
    dg.append(sg, bg);
    kg.appendChild(dg);
    ziel.appendChild(kg);

    const kw = karte(`<p class="kicker">${esc(T("Wenn du eine gefunden hast"))}</p><h2 class="h2">${esc(T("Eintragen"))}</h2>`);
    const rw = document.createElement("div");
    rw.className = "knopf-reihe";
    [["#/stellen", T("Zu meinen Stellen")], ["#/erstgespraech", T("Beim ersten Mal")]].forEach(([h, t]) => {
      const a = document.createElement("a");
      a.className = "knopf leer";
      a.href = h;
      a.textContent = t;
      rw.appendChild(a);
    });
    kw.appendChild(rw);
    ziel.appendChild(kw);

    zurueck(ziel, "#/stellen", T("Zurueck"));
  }

  /* --------------------------------------------------------- Beim ersten Mal */

  function seiteErstgespraech(ziel) {
    ziel.appendChild(
      karte(
        `<p class="kicker">${esc(T("Zum Mitnehmen"))}</p>
         <h2 class="h2">${esc(T("Beim ersten Mal"))}</h2>
         <p class="lead">${esc(T("Diese Seite beurteilt nicht die Krankheit, sondern die Stelle. Das ist etwas anderes als die Fragen unter Wissen, die in die Sprechstunde gehoeren. Zum Ausdrucken ueber den Teilen-Knopf des Browsers."))}</p>`,
      ),
    );

    const km = karte(`<p class="kicker">${esc(T("Woran du sie erkennst"))}</p><h2 class="h2">${esc(T("Merkmale einer guten Stelle"))}</h2>`);
    const ul = document.createElement("ul");
    ul.className = "liste";
    I.suche.merkmale.forEach((m) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="punkt gut"></span><div class="txt"><b>${esc(m.punkt)}</b></div>`;
      ul.appendChild(li);
    });
    km.appendChild(ul);
    ziel.appendChild(km);

    const ke = karte(`<p class="kicker">${esc(T("Mitnehmen und fragen"))}</p><h2 class="h2">${esc(T("Der erste Termin"))}</h2>`);
    const ue = document.createElement("ul");
    ue.className = "liste";
    I.suche.erstgespraech.forEach((t) => {
      const li = document.createElement("li");
      li.innerHTML = `<div class="txt"><b>${esc(t)}</b></div>`;
      ue.appendChild(li);
    });
    ke.appendChild(ue);
    ziel.appendChild(ke);

    const r = document.createElement("div");
    r.className = "knopf-reihe";
    const b = document.createElement("button");
    b.className = "knopf";
    b.textContent = T("Drucken oder als PDF");
    b.addEventListener("click", () => window.print());
    r.appendChild(b);
    ziel.appendChild(r);

    zurueck(ziel, "#/stellen", T("Zurueck"));
  }

  /* --------------------------------------------------------------- Termine */

  function seiteTermine(ziel) {
    const k = karte(`<p class="kicker">${esc(T("Was ansteht"))}</p><h2 class="h2">${esc(T("Termine"))}</h2>`);
    const kommend = D.termine.slice().sort((a, b) => a.datum.localeCompare(b.datum));
    if (!kommend.length) {
      k.insertAdjacentHTML("beforeend", `<div class="leer">${esc(T("Noch nichts eingetragen."))}</div>`);
    } else {
      const ul = document.createElement("ul");
      ul.className = "liste";
      kommend.forEach((t) => {
        const vorbei = t.datum < heuteISO();
        const li = document.createElement("li");
        li.innerHTML =
          `<div class="txt"><b>${esc(t.was)}${vorbei ? " " : ""}</b><small>${esc(langesDatum(t.datum))}${t.wer ? " · " + esc(t.wer) : ""}${t.notiz ? "<br>" + esc(t.notiz) : ""}</small></div>`;
        if (vorbei) li.style.opacity = "0.5";
        const del = document.createElement("button");
        del.className = "schalter";
        del.textContent = T("Weg");
        del.addEventListener("click", () => {
          D.termine = D.termine.filter((x) => x.id !== t.id);
          sichern();
          zeichnen();
        });
        li.appendChild(del);
        ul.appendChild(li);
      });
      k.appendChild(ul);
    }
    ziel.appendChild(k);

    const kn = karte(`<p class="kicker">${esc(T("Hinzufuegen"))}</p><h2 class="h2">${esc(T("Neuer Termin"))}</h2>`);
    const neu = { datum: heuteISO(), was: "", wer: "", notiz: "" };
    feld(kn, { label: T("Datum"), typ: "date", wert: neu.datum, beiAenderung: (v) => (neu.datum = v) });
    feld(kn, { label: T("Was"), wert: "", platzhalter: T("Rheumatologie, Kontrolle"), beiAenderung: (v) => (neu.was = v) });
    feld(kn, { label: T("Bei wem"), wert: "", platzhalter: "", beiAenderung: (v) => (neu.wer = v) });
    feld(kn, { label: T("Mitnehmen, fragen"), mehrzeilig: true, wert: "", beiAenderung: (v) => (neu.notiz = v) });
    const r = document.createElement("div");
    r.className = "knopf-reihe";
    const b = document.createElement("button");
    b.className = "knopf voll";
    b.textContent = T("Eintragen");
    b.addEventListener("click", () => {
      if (!neu.was) { melden(T("Der Anlass fehlt.")); return; }
      D.termine.push(Object.assign({ id: id() }, neu));
      sichern();
      melden(T("Eingetragen."));
      zeichnen();
    });
    r.appendChild(b);
    kn.appendChild(r);
    ziel.appendChild(kn);

    ziel.appendChild(
      karte(
        `<div class="hinweis"><b>${esc(T("Anker kann nicht erinnern."))}</b> ${esc(T("Eine Webseite darf auf dem iPhone keine Benachrichtigung schicken, solange sie keinen Server dahinter hat, und einen Server hat diese hier absichtlich nicht. Trag den Termin zusaetzlich in den Kalender des Telefons ein."))}</div>`,
      ),
    );
    zurueck(ziel, "#/mehr", T("Zurueck"));
  }

  /* -------------------------------------------------------------- Bericht */

  let berichtModul = "alle";

  /*
   * Die Arztmappe. Zwoelf Wochen, je Erkrankung oder alles zusammen. Je
   * Erkrankung heisst: ihre Regler, ihre Frage des Tages, ihre Zeichen, ihre
   * Laborwerte im Verlauf, ihre Fragen und die gemerkten Arbeiten dazu. Das
   * Befinden, Schlaf, Medikamente und Notizen gehoeren zu jeder Mappe, weil
   * sie in jede Sprechstunde gehoeren.
   */
  function seiteBericht(ziel) {
    const bis = heuteISO();
    const von = verschoben(bis, -83);
    const tage = Object.keys(D.tage).filter((d) => d >= von && d <= bis && !tagLeer(D.tage[d])).sort();
    const mods = aktiveModule();
    if (berichtModul !== "alle" && !hat(berichtModul)) berichtModul = "alle";
    const nur = berichtModul === "alle" ? null : modulVon(berichtModul);
    const auswahl = nur ? [nur] : mods;

    const k = karte(
      `<p class="kicker">${esc(T("Zwoelf Wochen"))}</p><h2 class="h2">${esc(nur ? TV("Arztmappe {name}", { name: MT(nur.kurz) }) : T("Zusammenfassung fuer den Termin"))}</h2>
       <p class="lead">${esc(
         TV("{von} bis {bis}, {n} Tage mit Eintrag. Ueber den Teilen-Knopf des Browsers drucken oder als PDF sichern.",
            { von: kurzesDatum(von), bis: kurzesDatum(bis), n: tage.length }),
       )}</p>`,
    );
    if (mods.length > 1) {
      const wahl = schalterListe(k, {
        einzeln: true,
        optionen: [{ wert: "alle", text: T("Alles") }].concat(mods.map((m) => ({ wert: m.id, text: MT(m.kurz) }))),
        gewaehlt: berichtModul,
        beiWahl: (w) => { berichtModul = w; zeichnen(); return w; },
      });
      wahl.classList.add("segment", "nicht-drucken");
    }
    ziel.appendChild(k);

    if (!tage.length) {
      ziel.appendChild(karte(`<div class="leer">${esc(T("Fuer diesen Zeitraum gibt es noch keine Eintraege."))}</div>`));
    }

    const zahl = (s2) => {
      const v = tage.map((d) => D.tage[d][s2]).filter((x) => x != null);
      if (!v.length) return null;
      return {
        schnitt: (v.reduce((a2, b2) => a2 + b2, 0) / v.length).toFixed(1),
        max: Math.max(...v), min: Math.min(...v), n: v.length,
      };
    };

    if (tage.length) {
      const regler = [];
      if (GRUND.befinden) regler.push([TV("{name} (10 ist gut)", { name: MT(GRUND.befinden.name) }), "befinden"]);
      (GRUND.skalen || []).forEach((s2) => regler.push([MT(s2.name), s2.schluessel]));
      auswahl.forEach((m) => (m.skalen || []).forEach((s2) => {
        if (!regler.some((x) => x[1] === s2.schluessel)) regler.push([MT(s2.name), s2.schluessel]);
      }));
      regler.push([T("Schlafqualitaet"), "schlafQualitaet"], [T("Schlaf, Stunden"), "schlafStunden"]);
      const zeilen = regler.map(([n, s2]) => [n, zahl(s2)]).filter((z) => z[1]);
      if (zeilen.length) {
        const kt = karte(`<p class="kicker">${esc(T("Zahlen"))}</p><h2 class="h2">${esc(T("Mittel, hoechster und tiefster Wert"))}</h2>`);
        kt.insertAdjacentHTML(
          "beforeend",
          `<div class="tabelle-huelle"><table class="tabelle"><thead><tr><th>${esc(T("Was"))}</th><th>${esc(T("Mittel"))}</th><th>${esc(T("Min"))}</th><th>${esc(T("Max"))}</th><th>${esc(T("Tage"))}</th></tr></thead><tbody>` +
          zeilen.map((z) => `<tr><td>${esc(z[0])}</td><td>${z[1].schnitt}</td><td>${z[1].min}</td><td>${z[1].max}</td><td>${z[1].n}</td></tr>`).join("") +
          `</tbody></table></div>`,
        );
        ziel.appendChild(kt);
      }

      /* Die Frage des Tages je Erkrankung: wie oft welche Antwort, und die
         schlechten Tage mit Datum, denn nach genau denen wird gefragt. */
      auswahl.forEach((m) => (m.checks || []).forEach((c) => {
        const mit = tage.filter((d) => D.tage[d][c.schluessel] != null);
        if (!mit.length) return;
        const kc = karte(`<p class="kicker"><i class="modul-punkt"></i>${esc(MT(m.kurz))}</p><h2 class="h2">${esc(MT(c.frage))}</h2>`);
        kc.style.setProperty("--punkt", m.farbe);
        const ul = document.createElement("ul");
        ul.className = "liste";
        c.optionen.forEach((o) => {
          const n = mit.filter((d) => D.tage[d][c.schluessel] === o.wert).length;
          const li = document.createElement("li");
          li.innerHTML = `<span class="punkt ${o.ton === "gut" ? "ja" : o.ton === "mittel" ? "vielleicht" : "nein"}"></span><div class="txt"><b>${esc(MT(o.text))}</b><small>${esc(TV("an {n} von {gesamt} Tagen", { n: n, gesamt: mit.length }))}</small></div>`;
          ul.appendChild(li);
        });
        const schlecht = mit.filter((d) => {
          const o = c.optionen.find((x) => x.wert === D.tage[d][c.schluessel]);
          return o && o.ton !== "gut";
        });
        if (schlecht.length) {
          const li = document.createElement("li");
          li.innerHTML = `<div class="txt"><b>${esc(T("Wann"))}</b><small>${esc(schlecht.map(kurzesDatum).join(", "))}</small></div>`;
          ul.appendChild(li);
        }
        kc.appendChild(ul);
        ziel.appendChild(kc);
      }));

      /* Zeichen zaehlen. In einer Mappe je Erkrankung nur deren Zeichen. */
      const erlaubt = nur ? new Set(nur.zeichen || []) : null;
      const zaehler = {};
      tage.forEach((d) => (D.tage[d].symptome || []).forEach((s2) => {
        if (erlaubt && !erlaubt.has(s2)) return;
        zaehler[s2] = (zaehler[s2] || 0) + 1;
      }));
      const sortiert = Object.keys(zaehler).sort((x, y) => zaehler[y] - zaehler[x]);
      if (sortiert.length) {
        const ks = karte(`<p class="kicker">${esc(T("Wie oft"))}</p><h2 class="h2">${esc(T("Zeichen im Zeitraum"))}</h2>`);
        const ul = document.createElement("ul");
        ul.className = "liste";
        sortiert.forEach((s2) => {
          const li = document.createElement("li");
          li.innerHTML =
            `<div class="txt"><b>${esc(zeichenText(s2))}</b><small>${esc(
              TV("an {n} von {gesamt} Tagen", { n: zaehler[s2], gesamt: tage.length }),
            )}</small></div>`;
          ul.appendChild(li);
        });
        ks.appendChild(ul);
        ziel.appendChild(ks);
      }
    }

    /* Laborwerte der Erkrankung: der letzte Wert, der davor, und wann. */
    const gewollt = new Set();
    auswahl.forEach((m) => (m.labor || []).forEach((x) => gewollt.add(x)));
    const labor = laborListe().filter((w) => gewollt.has(w.schluessel) && D.werte.some((x) => x.schluessel === w.schluessel));
    if (labor.length) {
      const kl = karte(`<p class="kicker">${esc(T("Aus dem Labor"))}</p><h2 class="h2">${esc(T("Letzte Werte"))}</h2>`);
      kl.insertAdjacentHTML(
        "beforeend",
        `<div class="tabelle-huelle"><table class="tabelle"><thead><tr><th>${esc(T("Wert"))}</th><th>${esc(T("Zuletzt"))}</th><th>${esc(T("Davor"))}</th><th>${esc(T("Datum"))}</th></tr></thead><tbody>` +
        labor.map((w) => {
          const m = D.werte.filter((x) => x.schluessel === w.schluessel).sort((x, y) => x.datum.localeCompare(y.datum));
          const l = m[m.length - 1], v = m[m.length - 2];
          return `<tr><td>${esc(w.name)}${w.einheit ? " <small>" + esc(w.einheit) + "</small>" : ""}</td><td>${esc(String(l.wert))}</td><td>${v ? esc(String(v.wert)) : "&ndash;"}</td><td>${esc(kurzesDatum(l.datum))}</td></tr>`;
        }).join("") +
        `</tbody></table></div>`,
      );
      ziel.appendChild(kl);
    }

    if (D.medikamente.length) {
      const km = karte(`<p class="kicker">${esc(T("Aktuell"))}</p><h2 class="h2">${esc(T("Medikamente"))}</h2>`);
      const ul = document.createElement("ul");
      ul.className = "liste";
      D.medikamente.forEach((m) => {
        const li = document.createElement("li");
        li.innerHTML = `<div class="txt"><b>${esc(m.name)}</b><small>${esc([m.dosis, m.zeit].filter(Boolean).join(" · "))}</small></div>`;
        ul.appendChild(li);
      });
      km.appendChild(ul);
      ziel.appendChild(km);
    }

    const notizen = tage.filter((d) => D.tage[d].notiz);
    if (notizen.length) {
      const kn = karte(`<p class="kicker">${esc(T("In eigenen Worten"))}</p><h2 class="h2">${esc(T("Notizen"))}</h2>`);
      const ul = document.createElement("ul");
      ul.className = "liste";
      notizen.slice(-20).reverse().forEach((d) => {
        const li = document.createElement("li");
        li.innerHTML = `<div class="txt"><b>${esc(kurzesDatum(d))}</b><small>${esc(D.tage[d].notiz)}</small></div>`;
        ul.appendChild(li);
      });
      kn.appendChild(ul);
      ziel.appendChild(kn);
    }

    const fragen = fragenAktiv(nur ? nur.id : null);
    if (fragen.length) {
      const kf = karte(`<p class="kicker">${esc(T("Fuer den naechsten Termin"))}</p><h2 class="h2">${esc(T("Fragen, die sich lohnen"))}</h2>`);
      const ul = document.createElement("ul");
      ul.className = "liste";
      fragen.forEach((f) => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="kaestchen" aria-hidden="true"></span><div class="txt"><b>${esc(f.frage)}</b></div>`;
        ul.appendChild(li);
      });
      kf.appendChild(ul);
      ziel.appendChild(kf);
    }

    const studien = D.gemerkt.studien.filter((s2) => !nur || String(s2.modul || "").split("+").includes(nur.id));
    if (studien.length) {
      const kw = karte(`<p class="kicker">${esc(T("Zum Nachfragen"))}</p><h2 class="h2">${esc(T("Gemerkte Forschung"))}</h2>
        <p class="lead">${esc(T("Die Frage dazu: Aendert das etwas fuer mich?"))}</p>`);
      const ul = document.createElement("ul");
      ul.className = "liste";
      studien.forEach((s2) => {
        const li = document.createElement("li");
        li.innerHTML = `<div class="txt"><b lang="en">${esc(s2.titel)}</b><small>${esc(s2.zeitschrift)} · ${esc(kurzesMonat(s2.datum))} · PMID ${esc(s2.pmid)}</small></div>`;
        ul.appendChild(li);
      });
      kw.appendChild(ul);
      ziel.appendChild(kw);
    }

    const r = document.createElement("div");
    r.className = "knopf-reihe";
    const b = document.createElement("button");
    b.className = "knopf";
    b.textContent = T("Drucken oder als PDF");
    b.addEventListener("click", () => window.print());
    r.appendChild(b);
    ziel.appendChild(r);
    zurueck(ziel, "#/mehr", T("Zurueck"));
  }

  /* ------------------------------------------------------------ Sicherung */

  function seiteSicherung(ziel) {
    const anzahl = Object.keys(D.tage).filter((d) => !tagLeer(D.tage[d])).length;
    ziel.appendChild(
      karte(
        `<p class="kicker">${esc(sicherungsText())}</p><h2 class="h2">${esc(T("Sicherung"))}</h2>
         <p class="lead">${esc(
           TV("{tage} Tage, {werte} Laborwerte, {medikamente} Medikamente. Die Sicherung ist eine einzige Datei. Leg sie in iCloud Drive, in einen Ordner in der Dateien-App oder schick sie dir selbst. Ohne sie ist alles weg, wenn dem Telefon etwas passiert.",
              { tage: anzahl, werte: D.werte.length, medikamente: D.medikamente.length }),
         )}</p>`,
      ),
    );

    const k = karte(`<p class="kicker">${esc(T("Herausschreiben"))}</p><h2 class="h2">${esc(T("Sicherung erstellen"))}</h2>`);
    const r = document.createElement("div");
    r.className = "knopf-reihe";

    const bTeilen = document.createElement("button");
    bTeilen.className = "knopf voll";
    bTeilen.textContent = T("Sicherung teilen oder speichern");
    bTeilen.addEventListener("click", exportieren);
    r.appendChild(bTeilen);
    k.appendChild(r);
    ziel.appendChild(k);

    const ki = karte(
      `<p class="kicker">${esc(T("Zurueckholen"))}</p><h2 class="h2">${esc(T("Sicherung einlesen"))}</h2>
       <p class="lead">${esc(T("Achtung: das ersetzt alles, was jetzt in der App steht."))}</p>`,
    );
    const dateiHuelle = document.createElement("label");
    dateiHuelle.className = "feld";
    const dateiName = document.createElement("span");
    dateiName.textContent = T("Sicherungsdatei auswaehlen");
    const datei = document.createElement("input");
    datei.type = "file";
    datei.accept = "application/json,.json";
    datei.addEventListener("change", () => {
      const f = datei.files && datei.files[0];
      if (!f) return;
      const leser = new FileReader();
      leser.onload = () => {
        try {
          const neu = JSON.parse(String(leser.result));
          if (!neu || typeof neu !== "object" || !neu.tage) throw new Error(T("Form passt nicht"));
          if (!confirm(T("Alles Aktuelle durch die Sicherung ersetzen?"))) return;
          D = ordnen(Object.assign(strukturKopie(LEER), neu));
          sichern();
          melden(T("Sicherung eingelesen."));
          zeichnen();
        } catch (e) {
          melden(T("Das ist keine Anker-Sicherung."));
        }
      };
      leser.readAsText(f);
    });
    dateiHuelle.append(dateiName, datei);
    ki.appendChild(dateiHuelle);
    ziel.appendChild(ki);

    const kl = karte(
      `<p class="kicker">${esc(T("Alles entfernen"))}</p><h2 class="h2">${esc(T("Daten loeschen"))}</h2>
       <p class="lead">${esc(T("Nimmt jeden Eintrag von diesem Geraet. Das laesst sich nicht rueckgaengig machen."))}</p>`,
    );
    const rl = document.createElement("div");
    rl.className = "knopf-reihe";
    const bl = document.createElement("button");
    bl.className = "knopf warn voll";
    bl.textContent = T("Alles loeschen");
    bl.addEventListener("click", () => {
      if (!confirm(T("Wirklich alles loeschen? Vorher gesichert?"))) return;
      if (!confirm(T("Letzte Frage. Alles weg?"))) return;
      localStorage.removeItem(SCHLUESSEL);
      D = strukturKopie(LEER);
      melden(T("Geloescht."));
      location.hash = "#/heute";
      zeichnen();
    });
    rl.appendChild(bl);
    kl.appendChild(rl);
    ziel.appendChild(kl);
    zurueck(ziel, "#/mehr", T("Zurueck"));
  }

  function exportieren() {
    const text = JSON.stringify(D, null, 2);
    const name = `anker-sicherung-${heuteISO()}.json`;
    const blob = new Blob([text], { type: "application/json" });
    const fertig = () => {
      D.einstellungen.letzteSicherung = heuteISO();
      sichern();
    };

    try {
      const datei = new File([blob], name, { type: "application/json" });
      if (navigator.canShare && navigator.canShare({ files: [datei] })) {
        navigator.share({ files: [datei], title: T("Anker Sicherung") }).then(fertig, () => {});
        return;
      }
    } catch (e) { /* weiter zum Herunterladen */ }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    fertig();
    melden(T("Sicherung erstellt."));
  }

  /* ---------------------------------------------------------------- Thema */

  function themaSetzen() {
    const t = D.einstellungen.thema || "auto";
    if (t === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
  }

  /* ----------------------------------------------------------------- Lauf */

  /*
   * frame-ancestors laesst sich nur ueber einen HTTP-Header setzen, und die
   * Seite liegt auf GitHub Pages, das keine Header setzt. Also von Hand: steckt
   * die App in einem fremden Rahmen, wird nichts gezeichnet. Ein fremder Rahmen
   * kann den Inhalt zwar ohnehin nicht lesen, aber er koennte Tippen auf
   * Knoepfe umlenken, die hier Daten loeschen.
   */
  if (window.top !== window.self) {
    $("#inhalt").textContent =
      T("Anker laeuft nur als eigene Seite, nicht in einem fremden Rahmen.");
    return;
  }

  spracheSetzen(spracheWaehlen());
  themaSetzen();
  /* Eine Umstellung beim Laden einmal festschreiben, damit sie nicht bei
     jedem Start neu geschieht. */
  if (migriert && aktiveModule().length) sichern();
  zeichnen();

  window.addEventListener("scroll", () => {
    const k = $("#kopf");
    if (window.scrollY > 6) k.setAttribute("data-gescrollt", "");
    else k.removeAttribute("data-gescrollt");
  }, { passive: true });

  /* Der Browser darf den Speicher dieser App nicht einfach wegraeumen. */
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persisted().then((schon) => { if (!schon) navigator.storage.persist(); }).catch(() => {});
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
})();
