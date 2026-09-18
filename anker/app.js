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

  const LEER = {
    version: 1,
    profil: { name: "", geboren: "", diagnosen: [], notfall: "" },
    tage: {},
    medikamente: [],
    werte: [],
    termine: [],
    stellen: [],
    schuebe: [],
    einstellungen: { thema: "auto", letzteSicherung: null, start: heuteISO() },
  };

  let D = laden();

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
      melden("Konnte nicht speichern. Ist der Speicher voll oder gesperrt?");
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
    { code: "fr", name: "Francais", locale: "fr-FR" },
    { code: "es", name: "Espanol", locale: "es-ES" },
  ];

  /* Uebergangsform: solange der Inhalt noch flach als INHALT.wissen dasteht,
     wird er als Deutsch eingehaengt. Faellt weg, sobald alle Sprachdateien da
     sind, und haelt die App bis dahin am Laufen. */
  if (typeof INHALT === "object" && INHALT.wissen && !INHALT.de) {
    const flach = {};
    Object.keys(INHALT).forEach((k) => { flach[k] = INHALT[k]; });
    Object.keys(INHALT).forEach((k) => { delete INHALT[k]; });
    INHALT.de = flach;
  }

  function sprachenDa() {
    return SPRACHEN.filter((s) => INHALT[s.code] && INHALT[s.code].wissen);
  }

  function spracheWaehlen() {
    const gewaehlt = D.einstellungen && D.einstellungen.sprache;
    if (gewaehlt && INHALT[gewaehlt]) return gewaehlt;
    const vomGeraet = String(navigator.language || "en").slice(0, 2).toLowerCase();
    if (INHALT[vomGeraet]) return vomGeraet;
    if (INHALT.en) return "en";
    const erste = sprachenDa()[0];
    return erste ? erste.code : "en";
  }

  let L = "en";
  let I = {};

  function spracheSetzen(code) {
    L = INHALT[code] ? code : (INHALT.en ? "en" : L);
    I = INHALT[L] || {};
    document.documentElement.lang = L;
  }

  /** Ein Oberflaechentext. Schluessel rein, Satz raus. */
  function T(schluessel) {
    const eigen = I.ui && I.ui[schluessel];
    if (eigen != null) return eigen;
    const ersatz = INHALT.en && INHALT.en.ui && INHALT.en.ui[schluessel];
    return ersatz != null ? ersatz : schluessel;
  }

  /** Das Gebietsschema fuer Datum und Zahlen. */
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

  const SEITEN = {
    heute: { titel: "Heute", bauen: seiteHeute },
    verlauf: { titel: "Verlauf", bauen: seiteVerlauf },
    essen: { titel: "Essen", bauen: seiteEssen },
    wissen: { titel: "Wissen", bauen: seiteWissen },
    mehr: { titel: "Mehr", bauen: seiteMehr },
    medikamente: { titel: "Medikamente", bauen: seiteMedikamente, eltern: "mehr" },
    werte: { titel: "Laborwerte", bauen: seiteWerte, eltern: "mehr" },
    termine: { titel: "Termine", bauen: seiteTermine, eltern: "mehr" },
    stellen: { titel: "Anlaufstellen", bauen: seiteStellen, eltern: "mehr" },
    suchen: { titel: "Eine Stelle finden", bauen: seiteSuchen, eltern: "stellen" },
    erstgespraech: { titel: "Beim ersten Mal", bauen: seiteErstgespraech, eltern: "stellen" },
    bericht: { titel: "Arztbericht", bauen: seiteBericht, eltern: "mehr" },
    sicherung: { titel: "Sicherung", bauen: seiteSicherung, eltern: "mehr" },
    notfall: { titel: "Warnzeichen", bauen: seiteNotfall, eltern: "wissen" },
  };

  function route() {
    const h = location.hash.replace(/^#\/?/, "") || "heute";
    return SEITEN[h] ? h : "heute";
  }

  function zeichnen() {
    const name = route();
    const seite = SEITEN[name];
    const ziel = $("#inhalt");
    ziel.innerHTML = "";
    $("#kopf-titel").textContent = seite.titel;
    $("#kopf-datum").textContent =
      name === "heute" ? langesDatum(heuteISO()) : (seite.eltern ? "Mehr" : "Anker");
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

  function skala(wirt, { name, schluessel, iso, links, rechts, hoch = "schlecht" }) {
    const e = tag(iso);
    const box = document.createElement("div");
    box.className = "skala";
    const wert = e[schluessel];
    box.innerHTML =
      `<div class="skala-kopf"><span class="skala-name">${esc(name)}</span>` +
      `<span class="skala-wert" data-wert>${wert == null ? "nicht gesetzt" : wert + " von 10"}</span></div>` +
      `<div class="skala-reihe" role="group" aria-label="${esc(name)}, 0 bis 10"></div>` +
      `<div class="skala-enden"><span>${esc(links)}</span><span>${esc(rechts)}</span></div>`;
    const reihe = box.querySelector(".skala-reihe");
    for (let i = 0; i <= 10; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = String(i);
      b.setAttribute("aria-pressed", String(wert === i));
      b.setAttribute("aria-label", `${name} ${i} von 10`);
      b.addEventListener("click", () => {
        const jetzt = tag(iso);
        jetzt[schluessel] = jetzt[schluessel] === i ? null : i;
        sichern();
        reihe.querySelectorAll("button").forEach((x, j) =>
          x.setAttribute("aria-pressed", String(jetzt[schluessel] === j)),
        );
        box.querySelector("[data-wert]").textContent =
          jetzt[schluessel] == null ? "nicht gesetzt" : jetzt[schluessel] + " von 10";
      });
      reihe.appendChild(b);
    }
    wirt.appendChild(box);
    void hoch;
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

  function seiteHeute(ziel) {
    const iso = heuteISO();
    const e = tag(iso);

    if (speicherFehlt) {
      ziel.appendChild(
        karte(`<div class="hinweis rot"><b>Der Speicher dieses Browsers nimmt nichts an.</b>
        Im privaten Modus von Safari ist das normal. Eintraege gehen dann beim Schliessen verloren.</div>`),
      );
    }

    erinnerungSicherung(ziel);

    /* Das Wichtigste zuerst, mit dem Daumen erreichbar. */
    const k1 = karte(`<p class="kicker">Wie geht es dir</p><h2 class="h2">Die vier Zahlen</h2>
      <p class="lead">Nur antippen. Was du nicht antippst, bleibt leer, und leer ist auch eine Antwort.</p>`);
    skala(k1, { name: "Muedigkeit", schluessel: "muedigkeit", iso, links: "wach", rechts: "erschoepft" });
    skala(k1, { name: "Schmerz", schluessel: "schmerz", iso, links: "keiner", rechts: "stark" });
    skala(k1, { name: "Gelenke", schluessel: "gelenke", iso, links: "frei", rechts: "steif, geschwollen" });
    skala(k1, { name: "Kopf klar", schluessel: "nebel", iso, links: "klar", rechts: "im Nebel" });
    ziel.appendChild(k1);

    /* Schlaf */
    const k2 = karte(`<p class="kicker">Nacht</p><h2 class="h2">Schlaf</h2>`);
    const zwei = document.createElement("div");
    zwei.className = "zwei";
    feld(zwei, {
      label: "Stunden", typ: "number", schritt: "0.5", wert: e.schlafStunden, platzhalter: "7.5",
      beiAenderung: (v) => { tag(iso).schlafStunden = v === "" ? null : Number(v); sichern(); },
    });
    feld(zwei, {
      label: "Aufgewacht um", typ: "time", wert: e.aufgewacht,
      beiAenderung: (v) => { tag(iso).aufgewacht = v || null; sichern(); },
    });
    k2.appendChild(zwei);
    skala(k2, { name: "Schlafqualitaet", schluessel: "schlafQualitaet", iso, links: "schlecht", rechts: "erholsam" });
    ziel.appendChild(k2);

    /* Symptome */
    const k3 = karte(`<p class="kicker">Heute bemerkt</p><h2 class="h2">Zeichen</h2>
      <p class="lead">Mehrfach moeglich. Was hier steht, sind die Dinge, die beim naechsten Termin
      zaehlen, weil man sie zwei Monate spaeter nicht mehr erinnert.</p>`);
    schalterListe(k3, {
      optionen: I.symptome,
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
    ziel.appendChild(k3);

    /* Essen und Gluten */
    const k4 = karte(`<p class="kicker">Glutenfrei</p><h2 class="h2">Der Tag beim Essen</h2>
      <p class="lead">Eine Spur reicht. Wenn spaeter Beschwerden kommen, hilft es sehr,
      hier den Tag zu finden, an dem etwas unsicher war.</p>`);
    schalterListe(k4, {
      einzeln: true,
      optionen: [
        { wert: "sicher", text: "Alles sicher" },
        { wert: "unsicher", text: "Etwas war unsicher" },
        { wert: "exposition", text: "Gluten bekommen" },
      ],
      gewaehlt: e.gluten,
      beiWahl: (w) => {
        const t = tag(iso);
        t.gluten = t.gluten === w ? null : w;
        sichern();
        return t.gluten;
      },
    });
    ziel.appendChild(k4);

    /* Bewegung */
    const k5 = karte(`<p class="kicker">Bewegung</p><h2 class="h2">Was ging heute</h2>`);
    const zwei2 = document.createElement("div");
    zwei2.className = "zwei";
    feld(zwei2, {
      label: "Minuten", typ: "number", wert: e.bewegungMin, platzhalter: "20",
      beiAenderung: (v) => { tag(iso).bewegungMin = v === "" ? null : Number(v); sichern(); },
    });
    feld(zwei2, {
      label: "Was", wert: e.bewegungArt, platzhalter: "Spaziergang",
      beiAenderung: (v) => { tag(iso).bewegungArt = v || null; sichern(); },
    });
    k5.appendChild(zwei2);
    const hinweis = document.createElement("p");
    hinweis.className = "klein";
    hinweis.style.marginTop = "12px";
    hinweis.textContent =
      "Auch null Minuten sind ein Eintrag. Der Verlauf wird erst dann ehrlich, " +
      "wenn die schlechten Tage genauso darin stehen wie die guten.";
    k5.appendChild(hinweis);
    ziel.appendChild(k5);

    /* Medikamente abhaken */
    if (D.medikamente.length) {
      const k6 = karte(`<p class="kicker">Genommen</p><h2 class="h2">Medikamente</h2>`);
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
    const k7 = karte(`<p class="kicker">In eigenen Worten</p><h2 class="h2">Notiz</h2>`);
    feld(k7, {
      label: "Was sonst noch war", mehrzeilig: true, wert: e.notiz,
      platzhalter: "Ein Satz reicht.",
      beiAenderung: (v) => { tag(iso).notiz = v || null; sichern(); },
    });
    ziel.appendChild(k7);

    /* Gestern nachtragen */
    const gestern = verschoben(iso, -1);
    if (tagLeer(D.tage[gestern])) {
      const k8 = karte(
        `<p class="kicker">Nachtragen</p><h2 class="h2">Gestern ist leer</h2>
         <p class="lead">${esc(langesDatum(gestern))}. Wenn du magst, kurz nachtragen.</p>`,
      );
      const b = document.createElement("a");
      b.className = "knopf leer";
      b.href = "#/verlauf";
      b.textContent = "Im Verlauf nachtragen";
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
      `<div class="hinweis"><b>Zeit fuer eine Sicherung.</b> ${anzahl} Tage stehen in dieser App,
       und sie stehen nur hier. Eine Sicherung dauert zehn Sekunden.</div>`,
    );
    const r = document.createElement("div");
    r.className = "knopf-reihe";
    const a = document.createElement("a");
    a.className = "knopf";
    a.href = "#/sicherung";
    a.textContent = "Jetzt sichern";
    r.appendChild(a);
    k.appendChild(r);
    ziel.appendChild(k);
  }

  /* -------------------------------------------------------------- Verlauf */

  function seiteVerlauf(ziel) {
    const tage = Object.keys(D.tage).filter((d) => !tagLeer(D.tage[d])).sort();
    if (!tage.length) {
      ziel.appendChild(
        karte(`<div class="leer">Noch nichts eingetragen.<br>Der Verlauf entsteht von selbst,
        sobald es ein paar Tage gibt.</div>`),
      );
      return;
    }

    const spanne = D.einstellungen.spanne || 30;
    const bis = heuteISO();
    const von = verschoben(bis, -(spanne - 1));
    const reihe = [];
    for (let d = von; tageZwischen(d, bis) >= 0; d = verschoben(d, 1)) reihe.push(d);

    /* Spanne waehlen */
    const kw = karte(`<p class="kicker">Zeitraum</p><h2 class="h2">Letzte ${spanne} Tage</h2>`);
    schalterListe(kw, {
      einzeln: true,
      optionen: [{ wert: 14, text: "14 Tage" }, { wert: 30, text: "30 Tage" }, { wert: 90, text: "90 Tage" }],
      gewaehlt: spanne,
      beiWahl: (w) => {
        D.einstellungen.spanne = w;
        sichern();
        zeichnen();
        return w;
      },
    });
    ziel.appendChild(kw);

    /* Diagramm 1: die drei Skalen, eine Achse, gleiche Einheit */
    const serien = [
      { name: "Muedigkeit", kurz: "Mued.", schluessel: "muedigkeit", farbe: "var(--serie-1)" },
      { name: "Schmerz", kurz: "Schmerz", schluessel: "schmerz", farbe: "var(--serie-2)" },
      { name: "Kopf im Nebel", kurz: "Nebel", schluessel: "nebel", farbe: "var(--serie-3)" },
    ].filter((s) => reihe.some((d) => D.tage[d] && D.tage[d][s.schluessel] != null));

    if (serien.length) {
      const k = karte(
        `<p class="kicker">Alle auf derselben Skala, 0 bis 10</p>
         <h2 class="h2">Muedigkeit, Schmerz, Nebel</h2>`,
      );
      k.appendChild(linienDiagramm(reihe, serien, 0, 10));
      k.appendChild(tabelleZu(reihe, serien));
      ziel.appendChild(k);
    }

    /* Diagramm 2: Schlafstunden, eigene Einheit, eigenes Bild */
    if (reihe.some((d) => D.tage[d] && D.tage[d].schlafStunden != null)) {
      const werte = reihe.map((d) => (D.tage[d] ? D.tage[d].schlafStunden : null)).filter((v) => v != null);
      const max = Math.max(10, Math.ceil(Math.max(...werte)));
      const k = karte(`<p class="kicker">Stunden je Nacht</p><h2 class="h2">Schlaf</h2>`);
      k.appendChild(
        linienDiagramm(reihe, [{ name: "Schlaf", schluessel: "schlafStunden", farbe: "var(--serie-1)" }], 0, max),
      );
      ziel.appendChild(k);
    }

    /* Kalender */
    const kk = karte(
      `<p class="kicker">Ein Feld je Tag, dunkler heisst muerber</p><h2 class="h2">Muedigkeit im Ueberblick</h2>`,
    );
    kk.appendChild(kalender(reihe));
    ziel.appendChild(kk);

    /* Einen Tag nachtragen */
    const kn = karte(`<p class="kicker">Nachtragen</p><h2 class="h2">Einen anderen Tag</h2>`);
    const wahl = feld(kn, {
      label: "Datum", typ: "date", wert: "",
      beiAenderung: (v) => { if (v) location.hash = "#/heute"; },
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
    if (e.muedigkeit != null) teile.push("Muedigkeit " + e.muedigkeit);
    if (e.schmerz != null) teile.push("Schmerz " + e.schmerz);
    if (e.schlafStunden != null) teile.push(e.schlafStunden + " h Schlaf");
    if (e.symptome && e.symptome.length) teile.push(e.symptome.join(", "));
    if (e.gluten === "exposition") teile.push("Gluten bekommen");
    if (e.notiz) teile.push(e.notiz);
    return teile.join(" · ") || "nichts eingetragen";
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

    let s = `<svg viewBox="0 0 ${B} ${H}" role="img" aria-label="Verlauf ueber ${tage.length} Tage. Die Zahlen stehen in der Tabelle darunter.">`;

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
      s += `<text class="endlabel" x="${(x(letzter.i) + 8).toFixed(1)}" y="${(y(letzter.v) + 4).toFixed(1)}" fill="${serie.farbe}">${esc(serie.kurz || serie.name)}</text>`;
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
      `<summary>Die Zahlen als Tabelle</summary>` +
      `<div class="details-inhalt tabelle-huelle"><table class="tabelle"><thead><tr><th>Tag</th>` +
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

  function kalender(tage) {
    const huelle = document.createElement("div");
    const wt = document.createElement("div");
    wt.className = "kalender-tage";
    ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].forEach((t) => {
      const s = document.createElement("span");
      s.textContent = t;
      wt.appendChild(s);
    });
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
      const v = e ? e.muedigkeit : null;
      const z = document.createElement("i");
      if (v != null) {
        const stufe = Math.min(4, Math.floor(v / 2.2));
        z.style.background = `var(${ramp[stufe]})`;
        z.style.borderColor = "transparent";
      }
      z.title = `${kurzesDatum(d)}: ${v == null ? "kein Eintrag" : "Muedigkeit " + v}`;
      gitter.appendChild(z);
    });
    huelle.append(wt, gitter);

    const leg = document.createElement("p");
    leg.className = "klein";
    leg.style.marginTop = "10px";
    leg.textContent = "Hell heisst wach, dunkel heisst erschoepft. Ein leeres Feld ist ein Tag ohne Eintrag.";
    huelle.appendChild(leg);
    return huelle;
  }

  /* ---------------------------------------------------------------- Essen */

  function seiteEssen(ziel) {
    ziel.appendChild(
      karte(
        `<p class="kicker">Zwei Regeln zugleich</p><h2 class="h2">Glutenfrei, und dazu entzuendungsarm</h2>
         <p class="lead">Die erste Regel ist streng und nicht verhandelbar: bei Zoeliakie ist die
         glutenfreie Ernaehrung die Behandlung, nicht eine Option. Die zweite ist weicher: es gibt
         Hinweise, dass ein mediterranes Muster bei Lupus guttut, aber keine Diaet, die Lupus heilt.
         Was hier steht, ist eine Merkhilfe, keine Verordnung.</p>`,
      ),
    );

    I.essen.forEach((gruppe) => {
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

    /* Rezepte */
    const kr = karte(
      `<p class="kicker">Wenig Kraft, trotzdem Essen</p><h2 class="h2">Rezepte</h2>
       <p class="lead">Sortiert nach Aufwand. Die ersten brauchen keine Kraft und keinen Topf,
       den man hinterher schrubben muss.</p>`,
    );
    I.rezepte.forEach((r) => {
      const det = document.createElement("details");
      det.innerHTML =
        `<summary>${esc(r.name)} <span class="marke">${esc(r.aufwand)}</span></summary>` +
        `<div class="details-inhalt">` +
        `<p>${esc(r.warum)}</p>` +
        `<h4>Zutaten</h4><ul>${r.zutaten.map((z) => `<li>${esc(z)}</li>`).join("")}</ul>` +
        `<h4>So geht es</h4><ul>${r.schritte.map((z) => `<li>${esc(z)}</li>`).join("")}</ul>` +
        (r.achtung ? `<h4>Aufpassen</h4><p>${esc(r.achtung)}</p>` : "") +
        `</div>`;
      kr.appendChild(det);
    });
    ziel.appendChild(kr);
  }

  /* --------------------------------------------------------------- Wissen */

  function seiteWissen(ziel) {
    const kn = karte(
      `<div class="hinweis rot"><b>Wenn eines davon auftritt, ist das kein Fall fuer eine App.</b>
       Dann sofort aerztliche Hilfe.</div>`,
    );
    const r = document.createElement("div");
    r.className = "knopf-reihe";
    const a = document.createElement("a");
    a.className = "knopf warn";
    a.href = "#/notfall";
    a.textContent = "Warnzeichen ansehen";
    r.appendChild(a);
    kn.appendChild(r);
    ziel.appendChild(kn);

    I.wissen.forEach((kapitel) => {
      const k = karte(`<p class="kicker">${esc(kapitel.kicker)}</p><h2 class="h2">${esc(kapitel.titel)}</h2>`);
      kapitel.abschnitte.forEach((a) => {
        const det = document.createElement("details");
        det.innerHTML =
          `<summary>${esc(a.frage)}</summary><div class="details-inhalt">` +
          a.antwort.map((t) => `<p>${t}</p>`).join("") +
          (a.liste ? `<ul>${a.liste.map((l) => `<li>${l}</li>`).join("")}</ul>` : "") +
          (a.staerke ? `<p class="quelle"><b>Wie gut belegt:</b> ${esc(a.staerke)}</p>` : "") +
          (a.quellen ? `<p class="quelle">${a.quellen.map((q) => esc(q)).join("<br>")}</p>` : "") +
          `</div>`;
        k.appendChild(det);
      });
      ziel.appendChild(k);
    });

    const kf = karte(
      `<p class="kicker">Fuer den naechsten Termin</p><h2 class="h2">Fragen, die sich lohnen</h2>
       <p class="lead">Ausgedruckt oder abfotografiert mitnehmen. In der Sprechstunde faellt einem
       die Haelfte nicht ein.</p>`,
    );
    const ul = document.createElement("ul");
    ul.className = "liste";
    I.fragen.forEach((f) => {
      const li = document.createElement("li");
      li.innerHTML = `<div class="txt"><b>${esc(f.frage)}</b><small>${esc(f.warum)}</small></div>`;
      ul.appendChild(li);
    });
    kf.appendChild(ul);
    ziel.appendChild(kf);
  }

  function seiteNotfall(ziel) {
    ziel.appendChild(
      karte(
        `<div class="hinweis rot"><b>Diese Liste ersetzt kein Urteil.</b> Im Zweifel anrufen.
         Bei Atemnot, starken Brustschmerzen, ploetzlicher Schwaeche oder Sprachstoerung,
         Krampfanfall oder hohem Fieber unter immunsuppressiver Behandlung: Notruf.</div>`,
      ),
    );

    /* Die eigenen Nummern stehen ganz oben. Diese Seite wird im schlechtesten
       Moment geoeffnet, und dann ist Suchen das Letzte, was noch geht. */
    const notfall = (D.stellen || []).filter((st) => st.notfall && st.telefon);
    if (notfall.length) {
      const kn = karte(`<p class="kicker">Deine Nummern</p><h2 class="h2">Wen du anrufst</h2>`);
      const ul = document.createElement("ul");
      ul.className = "liste";
      notfall.forEach((st) => {
        const li = document.createElement("li");
        const txt = document.createElement("div");
        txt.className = "txt";
        const b = document.createElement("b");
        b.textContent = st.name;
        const small = document.createElement("small");
        small.textContent = st.rolle + (st.haus ? " · " + st.haus : "");
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
    zurueck(ziel, "#/wissen", "Zurueck zu Wissen");
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
    const eintraege = [
      { href: "#/medikamente", name: "Medikamente", was: `${D.medikamente.length} eingetragen` },
      { href: "#/werte", name: "Laborwerte", was: `${D.werte.length} Messungen` },
      { href: "#/termine", name: "Termine", was: naechsterTermin() },
      { href: "#/stellen", name: "Anlaufstellen", was: stellenText() },
      { href: "#/bericht", name: "Arztbericht", was: "Zusammenfassung zum Ausdrucken" },
      { href: "#/sicherung", name: "Sicherung", was: sicherungsText() },
    ];
    const k = karte("");
    const ul = document.createElement("ul");
    ul.className = "liste";
    eintraege.forEach((e) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = e.href;
      a.style.textDecoration = "none";
      a.style.color = "inherit";
      a.style.flex = "1";
      a.innerHTML = `<div class="txt"><b>${esc(e.name)}</b><small>${esc(e.was)}</small></div>`;
      li.appendChild(a);
      ul.appendChild(li);
    });
    k.appendChild(ul);
    ziel.appendChild(k);

    /* Darstellung */
    const kt = karte(`<p class="kicker">Darstellung</p><h2 class="h2">Hell oder dunkel</h2>`);
    schalterListe(kt, {
      einzeln: true,
      optionen: [
        { wert: "auto", text: "Wie das Geraet" },
        { wert: "light", text: "Hell" },
        { wert: "dark", text: "Dunkel" },
      ],
      gewaehlt: D.einstellungen.thema || "auto",
      beiWahl: (w) => {
        D.einstellungen.thema = w;
        themaSetzen();
        sichern();
        return w;
      },
    });
    ziel.appendChild(kt);

    ziel.appendChild(
      karte(
        `<p class="kicker">Was diese App ist</p><h2 class="h2">Und was sie nicht ist</h2>
         <p class="lead">Anker ist ein Tagebuch und eine Merkhilfe. Es stellt keine Diagnose,
         es rechnet nichts aus, was eine Aerztin ausrechnen muesste, und es gibt keine
         Empfehlung zu Medikamenten. Es hilft dabei, beim Termin die richtigen Dinge zu
         erzaehlen, und es macht sichtbar, was ueber Wochen passiert.</p>
         <p class="lead">Alles, was du eintraegst, bleibt auf diesem Geraet. Es gibt keinen
         Server und kein Konto. Die Seite darf gar keine Verbindung nach draussen aufbauen,
         das ist im Kopf des Dokuments festgelegt. Der Preis dafuer: gesichert wird nur, was
         du selbst sicherst.</p>`,
      ),
    );
  }

  function stellenText() {
    const n = (D.stellen || []).length;
    if (!n) return "Aerztinnen und Ambulanzen finden und behalten";
    const notfall = D.stellen.filter((s) => s.notfall).length;
    return n + (n === 1 ? " Stelle" : " Stellen") + (notfall ? ", " + notfall + " im Notfall" : "");
  }

  function naechsterTermin() {
    const kommend = D.termine.filter((t) => t.datum >= heuteISO()).sort((a, b) => a.datum.localeCompare(b.datum));
    if (!kommend.length) return "keiner eingetragen";
    return `naechster am ${kurzesDatum(kommend[0].datum)}`;
  }
  function sicherungsText() {
    const l = D.einstellungen.letzteSicherung;
    if (!l) return "noch nie gesichert";
    const t = tageZwischen(l, heuteISO());
    return t === 0 ? "heute gesichert" : `vor ${t} Tagen gesichert`;
  }

  /* ---------------------------------------------------------- Medikamente */

  function seiteMedikamente(ziel) {
    const k = karte(
      `<p class="kicker">Was du nimmst</p><h2 class="h2">Liste</h2>
       <p class="lead">Diese Liste ist fuer die Notaufnahme, die Apotheke und den naechsten Termin.
       Sie aendert nichts an der Behandlung, sie schreibt sie nur auf.</p>`,
    );
    if (!D.medikamente.length) {
      k.insertAdjacentHTML("beforeend", `<div class="leer">Noch nichts eingetragen.</div>`);
    } else {
      const ul = document.createElement("ul");
      ul.className = "liste";
      D.medikamente.forEach((m) => {
        const li = document.createElement("li");
        li.innerHTML =
          `<div class="txt"><b>${esc(m.name)}</b><small>${esc([m.dosis, m.zeit, m.seit ? "seit " + m.seit : ""].filter(Boolean).join(" · "))}${m.notiz ? "<br>" + esc(m.notiz) : ""}</small></div>`;
        const b = document.createElement("button");
        b.className = "schalter";
        b.textContent = "Loeschen";
        b.addEventListener("click", () => {
          if (!confirm(`${m.name} aus der Liste nehmen?`)) return;
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

    const kn = karte(`<p class="kicker">Hinzufuegen</p><h2 class="h2">Neues Medikament</h2>`);
    const neu = { name: "", dosis: "", zeit: "", seit: "", notiz: "" };
    feld(kn, { label: "Name", wert: "", platzhalter: "Hydroxychloroquin", beiAenderung: (v) => (neu.name = v) });
    const z = document.createElement("div");
    z.className = "zwei";
    feld(z, { label: "Dosis", wert: "", platzhalter: "200 mg", beiAenderung: (v) => (neu.dosis = v) });
    feld(z, { label: "Wann", wert: "", platzhalter: "morgens", beiAenderung: (v) => (neu.zeit = v) });
    kn.appendChild(z);
    feld(kn, { label: "Seit", typ: "date", wert: "", beiAenderung: (v) => (neu.seit = v) });
    feld(kn, { label: "Notiz", mehrzeilig: true, wert: "", platzhalter: "verschrieben von ...", beiAenderung: (v) => (neu.notiz = v) });
    const r = document.createElement("div");
    r.className = "knopf-reihe";
    const b = document.createElement("button");
    b.className = "knopf voll";
    b.textContent = "In die Liste";
    b.addEventListener("click", () => {
      if (!neu.name) { melden("Ein Name fehlt."); return; }
      D.medikamente.push(Object.assign({ id: id() }, neu));
      sichern();
      melden("Eingetragen.");
      zeichnen();
    });
    r.appendChild(b);
    kn.appendChild(r);
    ziel.appendChild(kn);

    ziel.appendChild(
      karte(
        `<p class="kicker">Zum Nachlesen</p><h2 class="h2">Was ueberwacht gehoert</h2>
         <p class="lead">Kein Zeitplan aus dieser App, sondern der aus der Sprechstunde. Die Liste
         hier ist nur die Erinnerung daran, dass es einen gibt und dass er eingehalten wird.</p>`,
      ),
    );
    const ku = karte("");
    I.ueberwachung.forEach((u) => {
      const det = document.createElement("details");
      det.innerHTML =
        `<summary>${esc(u.titel)}</summary><div class="details-inhalt">` +
        u.text.map((t) => `<p>${t}</p>`).join("") +
        (u.quellen ? `<p class="quelle">${u.quellen.map((q) => esc(q)).join("<br>")}</p>` : "") +
        `</div>`;
      ku.appendChild(det);
    });
    ziel.appendChild(ku);
    zurueck(ziel, "#/mehr", "Zurueck");
  }

  /* ---------------------------------------------------------------- Werte */

  function seiteWerte(ziel) {
    const k = karte(
      `<p class="kicker">Aus dem Labor</p><h2 class="h2">Werte eintragen</h2>
       <p class="lead">Nur abschreiben, was auf dem Befund steht. Die Bedeutung steht beim
       jeweiligen Wert, die Beurteilung macht die Aerztin.</p>`,
    );
    const neu = { datum: heuteISO(), schluessel: I.laborwerte[0].schluessel, wert: "" };
    feld(k, { label: "Datum", typ: "date", wert: neu.datum, beiAenderung: (v) => (neu.datum = v) });
    const sel = document.createElement("label");
    sel.className = "feld";
    sel.innerHTML = `<span>Wert</span><select>${I.laborwerte.map((w) => `<option value="${esc(w.schluessel)}">${esc(w.name)}${w.einheit ? " (" + esc(w.einheit) + ")" : ""}</option>`).join("")}</select>`;
    sel.querySelector("select").addEventListener("change", (ev) => (neu.schluessel = ev.target.value));
    k.appendChild(sel);
    feld(k, { label: "Zahl", typ: "number", schritt: "any", wert: "", beiAenderung: (v) => (neu.wert = v) });
    const r = document.createElement("div");
    r.className = "knopf-reihe";
    const b = document.createElement("button");
    b.className = "knopf voll";
    b.textContent = "Eintragen";
    b.addEventListener("click", () => {
      if (neu.wert === "") { melden("Die Zahl fehlt."); return; }
      D.werte.push({ id: id(), datum: neu.datum, schluessel: neu.schluessel, wert: Number(neu.wert) });
      sichern();
      melden("Eingetragen.");
      zeichnen();
    });
    r.appendChild(b);
    k.appendChild(r);
    ziel.appendChild(k);

    I.laborwerte.forEach((w) => {
      const meine = D.werte.filter((x) => x.schluessel === w.schluessel).sort((a, b2) => a.datum.localeCompare(b2.datum));
      const kk = karte(
        `<p class="kicker">${esc(w.gruppe)}</p><h2 class="h2">${esc(w.name)}</h2>` +
        `<p class="lead">${esc(w.bedeutung)}</p>`,
      );
      if (meine.length) {
        const ul = document.createElement("ul");
        ul.className = "liste";
        meine.slice().reverse().forEach((m) => {
          const li = document.createElement("li");
          li.innerHTML = `<div class="txt"><b>${esc(String(m.wert))} ${esc(w.einheit || "")}</b><small>${esc(kurzesDatum(m.datum))}</small></div>`;
          const del = document.createElement("button");
          del.className = "schalter";
          del.textContent = "Weg";
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
        kk.insertAdjacentHTML("beforeend", `<p class="klein klein-abstand">Noch nichts eingetragen.</p>`);
      }
      ziel.appendChild(kk);
    });
    zurueck(ziel, "#/mehr", "Zurueck");
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

  const ROLLEN = [
    "Rheumatologie",
    "Gastroenterologie",
    "Hausarztpraxis",
    "Diaetologie",
    "Augenheilkunde",
    "Andere",
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
    const fertig = () => melden(was + " kopiert.");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(fertig, () => melden("Kopieren ging nicht. Bitte von Hand markieren."));
      return;
    }
    melden("Kopieren ging nicht. Bitte von Hand markieren.");
  }

  function seiteStellen(ziel) {
    const stellen = D.stellen || (D.stellen = []);

    ziel.appendChild(
      karte(
        `<p class="kicker">Wie das gemeint ist</p>
         <h2 class="h2">Keine Adresse, die niemand geprueft hat</h2>
         <p class="lead">Anker nennt keine Ambulanz und keine Aerztin. Beim Bauen dieser App war
         kein einziges medizinisches Verzeichnis erreichbar, also waere jede Adresse hier
         ungeprueft, und eine ungepruefte Nummer ist schlechter als keine.</p>
         <p class="lead">Was die App kann: sagen, wonach genau zu suchen ist und ueber welche
         Stellen, und dann behalten, was du gefunden hast. Der zweite Teil ist der, der in fuenf
         Jahren noch etwas wert ist.</p>`,
      ),
    );

    /* Eigenes Verzeichnis */
    const kl = karte(
      `<p class="kicker">${stellen.length === 0 ? "Noch leer" : stellen.length + (stellen.length === 1 ? " Eintrag" : " Eintraege")}</p>
       <h2 class="h2">Meine Stellen</h2>`,
    );
    if (!stellen.length) {
      kl.insertAdjacentHTML(
        "beforeend",
        `<div class="leer">Noch nichts eingetragen. Das ist am Anfang der Normalfall.</div>`,
      );
    } else {
      stellen.forEach((st) => kl.appendChild(stelleZeile(st)));
    }
    ziel.appendChild(kl);

    /* Eintragen */
    const kn = karte(`<p class="kicker">Hinzufuegen</p><h2 class="h2">Neue Stelle</h2>`);
    const neu = { name: "", rolle: "Rheumatologie", haus: "", telefon: "", adresse: "", weg: "", notiz: "" };
    feld(kn, { label: "Name", wert: "", platzhalter: "Wie du sie nennst", beiAenderung: (v) => (neu.name = v) });
    const rollenTitel = document.createElement("p");
    rollenTitel.className = "kicker klein-abstand";
    rollenTitel.textContent = "Wofuer";
    kn.appendChild(rollenTitel);
    schalterListe(kn, {
      einzeln: true,
      optionen: ROLLEN.map((r) => ({ wert: r, text: r })),
      gewaehlt: neu.rolle,
      beiWahl: (w) => (neu.rolle = w),
    });
    feld(kn, { label: "Haus oder Ordination", wert: "", beiAenderung: (v) => (neu.haus = v) });
    feld(kn, { label: "Telefon", typ: "tel", wert: "", beiAenderung: (v) => (neu.telefon = v) });
    feld(kn, { label: "Adresse", wert: "", beiAenderung: (v) => (neu.adresse = v) });
    feld(kn, {
      label: "Weg dorthin, in deinen Worten",
      mehrzeilig: true,
      wert: "",
      platzhalter: "Welche Linie, wie viele Minuten, wo die Tuer ist",
      beiAenderung: (v) => (neu.weg = v),
    });
    feld(kn, { label: "Notiz", mehrzeilig: true, wert: "", beiAenderung: (v) => (neu.notiz = v) });
    const r = document.createElement("div");
    r.className = "knopf-reihe";
    const b = document.createElement("button");
    b.className = "knopf voll";
    b.textContent = "Eintragen";
    b.addEventListener("click", () => {
      if (!neu.name) { melden("Der Name fehlt."); return; }
      D.stellen.push(Object.assign({ id: id(), notfall: false, haken: [], kontakte: [], angelegt: heuteISO() }, neu));
      sichern();
      melden("Eingetragen.");
      zeichnen();
    });
    r.appendChild(b);
    kn.appendChild(r);
    ziel.appendChild(kn);

    /* Weiter */
    const kw = karte(`<p class="kicker">Weiter</p><h2 class="h2">Wenn du noch keine hast</h2>`);
    const rw = document.createElement("div");
    rw.className = "knopf-reihe";
    [["#/suchen", "Eine Stelle finden"], ["#/erstgespraech", "Beim ersten Mal"]].forEach(([h, t]) => {
      const a = document.createElement("a");
      a.className = "knopf leer";
      a.href = h;
      a.textContent = t;
      rw.appendChild(a);
    });
    kw.appendChild(rw);
    ziel.appendChild(kw);

    zurueck(ziel, "#/mehr", "Zurueck");
  }

  function stelleZeile(st) {
    const det = document.createElement("details");
    det.className = "stelle";
    const sum = document.createElement("summary");
    sum.innerHTML =
      `<span class="stelle-kopf"><b>${esc(st.name)}</b>` +
      `<small>${esc(st.rolle)}${st.haus ? " · " + esc(st.haus) : ""}${st.notfall ? " · Notfallkontakt" : ""}</small></span>`;
    det.appendChild(sum);

    const box = document.createElement("div");
    box.className = "details-inhalt";

    if (st.telefon) {
      const p = document.createElement("p");
      p.className = "stelle-zeile";
      const a = document.createElement("a");
      a.textContent = st.telefon;
      if (!zielSetzen(a, "tel:" + st.telefon.replace(/[^\d+]/g, ""), ["tel:"])) {
        p.textContent = "Telefon " + st.telefon;
      } else {
        p.append("Telefon ", a);
      }
      box.appendChild(p);
    }
    [["Adresse", st.adresse], ["Weg", st.weg], ["Notiz", st.notiz]].forEach(([l, v]) => {
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
    mt.textContent = "Was diese Stelle kann";
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
    kt.textContent = "Kontakt";
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
      label: "Was war",
      wert: "",
      platzhalter: "Angerufen, Rueckruf zugesagt",
      beiAenderung: (v) => (notizWert = v),
    });
    const rz = document.createElement("div");
    rz.className = "knopf-reihe";
    const bz = document.createElement("button");
    bz.className = "knopf";
    bz.textContent = "Notiert";
    bz.addEventListener("click", () => {
      const wert = nf.value.trim() || notizWert;
      if (!wert) { melden("Da steht nichts."); return; }
      st.kontakte = (st.kontakte || []).concat([{ datum: heuteISO(), was: wert }]);
      sichern();
      melden("Notiert.");
      zeichnen();
    });
    rz.appendChild(bz);

    const bn = document.createElement("button");
    bn.className = "knopf";
    bn.textContent = st.notfall ? "Kein Notfallkontakt" : "Als Notfallkontakt";
    bn.addEventListener("click", () => {
      st.notfall = !st.notfall;
      sichern();
      melden(st.notfall ? "Steht jetzt bei den Warnzeichen." : "Nicht mehr bei den Warnzeichen.");
      zeichnen();
    });
    rz.appendChild(bn);

    const bw = document.createElement("button");
    bw.className = "knopf warn";
    bw.textContent = "Weg";
    bw.addEventListener("click", () => {
      if (!confirm("Diese Stelle entfernen?")) return;
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
      `<p class="kicker">Wo suchst du</p><h2 class="h2">Der Weg, nicht die Adresse</h2>
       <p class="lead">Anker nennt keine Ambulanz. Es kann keine pruefen. Was hier steht, sind
       Wege und die Woerter, mit denen man sie findet.</p>`,
    );
    schalterListe(kf, {
      einzeln: true,
      optionen: I.suche.laender,
      gewaehlt: land,
      beiWahl: (w) => { e.suchLand = w; sichern(); zeichnen(); return w; },
    });
    const kt = document.createElement("p");
    kt.className = "kicker klein-abstand";
    kt.textContent = "Wofuer";
    kf.appendChild(kt);
    schalterListe(kf, {
      einzeln: true,
      optionen: [
        { wert: "beides", text: "Beides" },
        { wert: "lupus", text: "Lupus" },
        { wert: "zoeliakie", text: "Zoeliakie" },
      ],
      gewaehlt: thema,
      beiWahl: (w) => { e.suchThema = w; sichern(); zeichnen(); return w; },
    });
    ziel.appendChild(kf);

    const passend = I.suche.wege.filter(
      (w) => w.land === land && (thema === "beides" || w.thema === thema || w.thema === "beides"),
    );

    const ks = karte(
      `<p class="kicker">${passend.length} ${passend.length === 1 ? "Weg" : "Wege"}</p>
       <h2 class="h2">Wo du fragst</h2>
       <p class="lead">Die sichersten Wege stehen oben, und es sind die, die nicht im Netz liegen.
       Der Suchbegriff daneben ist zum Kopieren gedacht: einmal tippen, dann Safari, dann einfuegen.</p>`,
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
          `<span class="marke marke-${esc(w.sicherheit)}">${w.sicherheit === "hoch" ? "sicher" : w.sicherheit === "mittel" ? "wohl" : "unsicher"}</span>`;
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
        bk.textContent = "Kopieren";
        bk.addEventListener("click", () => kopieren(w.suchbegriff, "Suchbegriff"));
        z.append(code, bk);
        box.appendChild(z);
        d.appendChild(box);
        ks.appendChild(d);
      });
    ziel.appendChild(ks);

    /* Das Lange steht zugeklappt. Wer es wissen will, macht es auf. */
    const kg = karte(`<p class="kicker">Zum Nachlesen</p><h2 class="h2">Wie verlaesslich das hier ist</h2>`);
    const dg = document.createElement("details");
    const sg = document.createElement("summary");
    sg.textContent = "Warum kein einziger Link dasteht";
    const bg = document.createElement("div");
    bg.className = "details-inhalt";
    const pg1 = document.createElement("p");
    pg1.textContent =
      "Anker koennte eine Adresse hinschreiben, aber nicht pruefen, ob sie stimmt und ob dort " +
      "heute noch dasselbe steht. Ein Suchbegriff ueberlebt einen Seitenumbau, eine gespeicherte " +
      "Adresse nicht. Und es geht keine Anfrage von dieser App aus, auch keine, die verraet, " +
      "wonach du suchst.";
    const pg2 = document.createElement("p");
    pg2.textContent = I.suche.warnung;
    bg.append(pg1, pg2);
    dg.append(sg, bg);
    kg.appendChild(dg);
    ziel.appendChild(kg);

    const kw = karte(`<p class="kicker">Wenn du eine gefunden hast</p><h2 class="h2">Eintragen</h2>`);
    const rw = document.createElement("div");
    rw.className = "knopf-reihe";
    [["#/stellen", "Zu meinen Stellen"], ["#/erstgespraech", "Beim ersten Mal"]].forEach(([h, t]) => {
      const a = document.createElement("a");
      a.className = "knopf leer";
      a.href = h;
      a.textContent = t;
      rw.appendChild(a);
    });
    kw.appendChild(rw);
    ziel.appendChild(kw);

    zurueck(ziel, "#/stellen", "Zurueck");
  }

  /* --------------------------------------------------------- Beim ersten Mal */

  function seiteErstgespraech(ziel) {
    ziel.appendChild(
      karte(
        `<p class="kicker">Zum Mitnehmen</p>
         <h2 class="h2">Beim ersten Mal</h2>
         <p class="lead">Diese Seite beurteilt nicht die Krankheit, sondern die Stelle. Das ist etwas
         anderes als die Fragen unter Wissen, die in die Sprechstunde gehoeren. Zum Ausdrucken ueber
         den Teilen-Knopf des Browsers.</p>`,
      ),
    );

    const km = karte(`<p class="kicker">Woran du sie erkennst</p><h2 class="h2">Merkmale einer guten Stelle</h2>`);
    const ul = document.createElement("ul");
    ul.className = "liste";
    I.suche.merkmale.forEach((m) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="punkt gut"></span><div class="txt"><b>${esc(m.punkt)}</b></div>`;
      ul.appendChild(li);
    });
    km.appendChild(ul);
    ziel.appendChild(km);

    const ke = karte(`<p class="kicker">Mitnehmen und fragen</p><h2 class="h2">Der erste Termin</h2>`);
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
    b.textContent = "Drucken oder als PDF";
    b.addEventListener("click", () => window.print());
    r.appendChild(b);
    ziel.appendChild(r);

    zurueck(ziel, "#/stellen", "Zurueck");
  }

  /* --------------------------------------------------------------- Termine */

  function seiteTermine(ziel) {
    const k = karte(`<p class="kicker">Was ansteht</p><h2 class="h2">Termine</h2>`);
    const kommend = D.termine.slice().sort((a, b) => a.datum.localeCompare(b.datum));
    if (!kommend.length) {
      k.insertAdjacentHTML("beforeend", `<div class="leer">Noch nichts eingetragen.</div>`);
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
        del.textContent = "Weg";
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

    const kn = karte(`<p class="kicker">Hinzufuegen</p><h2 class="h2">Neuer Termin</h2>`);
    const neu = { datum: heuteISO(), was: "", wer: "", notiz: "" };
    feld(kn, { label: "Datum", typ: "date", wert: neu.datum, beiAenderung: (v) => (neu.datum = v) });
    feld(kn, { label: "Was", wert: "", platzhalter: "Rheumatologie, Kontrolle", beiAenderung: (v) => (neu.was = v) });
    feld(kn, { label: "Bei wem", wert: "", platzhalter: "", beiAenderung: (v) => (neu.wer = v) });
    feld(kn, { label: "Mitnehmen, fragen", mehrzeilig: true, wert: "", beiAenderung: (v) => (neu.notiz = v) });
    const r = document.createElement("div");
    r.className = "knopf-reihe";
    const b = document.createElement("button");
    b.className = "knopf voll";
    b.textContent = "Eintragen";
    b.addEventListener("click", () => {
      if (!neu.was) { melden("Der Anlass fehlt."); return; }
      D.termine.push(Object.assign({ id: id() }, neu));
      sichern();
      melden("Eingetragen.");
      zeichnen();
    });
    r.appendChild(b);
    kn.appendChild(r);
    ziel.appendChild(kn);

    ziel.appendChild(
      karte(
        `<div class="hinweis"><b>Anker kann nicht erinnern.</b> Eine Webseite darf auf dem iPhone
         keine Benachrichtigung schicken, solange sie keinen Server dahinter hat, und einen Server
         hat diese hier absichtlich nicht. Trag den Termin zusaetzlich in den Kalender des Telefons ein.</div>`,
      ),
    );
    zurueck(ziel, "#/mehr", "Zurueck");
  }

  /* -------------------------------------------------------------- Bericht */

  function seiteBericht(ziel) {
    const bis = heuteISO();
    const von = verschoben(bis, -83);
    const tage = Object.keys(D.tage).filter((d) => d >= von && d <= bis && !tagLeer(D.tage[d])).sort();

    const k = karte(
      `<p class="kicker">Zwoelf Wochen</p><h2 class="h2">Zusammenfassung fuer den Termin</h2>
       <p class="lead">${esc(kurzesDatum(von))} bis ${esc(kurzesDatum(bis))}, ${tage.length} Tage mit Eintrag.
       Ueber den Teilen-Knopf des Browsers drucken oder als PDF sichern.</p>`,
    );
    ziel.appendChild(k);

    if (!tage.length) {
      ziel.appendChild(karte(`<div class="leer">Fuer diesen Zeitraum gibt es noch keine Eintraege.</div>`));
      zurueck(ziel, "#/mehr", "Zurueck");
      return;
    }

    const zahl = (s) => {
      const v = tage.map((d) => D.tage[d][s]).filter((x) => x != null);
      if (!v.length) return null;
      return {
        schnitt: (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1),
        max: Math.max(...v), min: Math.min(...v), n: v.length,
      };
    };

    const zeilen = [
      ["Muedigkeit", zahl("muedigkeit")],
      ["Schmerz", zahl("schmerz")],
      ["Gelenke", zahl("gelenke")],
      ["Kopf im Nebel", zahl("nebel")],
      ["Schlaf, Stunden", zahl("schlafStunden")],
    ].filter((z) => z[1]);

    const kt = karte(`<p class="kicker">Zahlen</p><h2 class="h2">Mittel, hoechster und tiefster Wert</h2>`);
    kt.insertAdjacentHTML(
      "beforeend",
      `<div class="tabelle-huelle"><table class="tabelle"><thead><tr><th>Was</th><th>Mittel</th><th>Min</th><th>Max</th><th>Tage</th></tr></thead><tbody>` +
      zeilen.map((z) => `<tr><td>${esc(z[0])}</td><td>${z[1].schnitt}</td><td>${z[1].min}</td><td>${z[1].max}</td><td>${z[1].n}</td></tr>`).join("") +
      `</tbody></table></div>`,
    );
    ziel.appendChild(kt);

    /* Symptome zaehlen */
    const zaehler = {};
    tage.forEach((d) => (D.tage[d].symptome || []).forEach((s) => (zaehler[s] = (zaehler[s] || 0) + 1)));
    const sortiert = Object.keys(zaehler).sort((a, b) => zaehler[b] - zaehler[a]);
    if (sortiert.length) {
      const ks = karte(`<p class="kicker">Wie oft</p><h2 class="h2">Zeichen im Zeitraum</h2>`);
      const ul = document.createElement("ul");
      ul.className = "liste";
      sortiert.forEach((s) => {
        const li = document.createElement("li");
        li.innerHTML = `<div class="txt"><b>${esc(s)}</b><small>an ${zaehler[s]} von ${tage.length} Tagen</small></div>`;
        ul.appendChild(li);
      });
      ks.appendChild(ul);
      ziel.appendChild(ks);
    }

    const glutenTage = tage.filter((d) => D.tage[d].gluten === "exposition" || D.tage[d].gluten === "unsicher");
    if (glutenTage.length) {
      const kg = karte(`<p class="kicker">Zoeliakie</p><h2 class="h2">Tage mit Gluten oder Unsicherheit</h2>`);
      const ul = document.createElement("ul");
      ul.className = "liste";
      glutenTage.forEach((d) => {
        const li = document.createElement("li");
        li.innerHTML = `<div class="txt"><b>${esc(kurzesDatum(d))}</b><small>${D.tage[d].gluten === "exposition" ? "Gluten bekommen" : "etwas war unsicher"}${D.tage[d].notiz ? " · " + esc(D.tage[d].notiz) : ""}</small></div>`;
        ul.appendChild(li);
      });
      kg.appendChild(ul);
      ziel.appendChild(kg);
    }

    if (D.medikamente.length) {
      const km = karte(`<p class="kicker">Aktuell</p><h2 class="h2">Medikamente</h2>`);
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
      const kn = karte(`<p class="kicker">In eigenen Worten</p><h2 class="h2">Notizen</h2>`);
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

    const r = document.createElement("div");
    r.className = "knopf-reihe";
    const b = document.createElement("button");
    b.className = "knopf";
    b.textContent = "Drucken oder als PDF";
    b.addEventListener("click", () => window.print());
    r.appendChild(b);
    ziel.appendChild(r);
    zurueck(ziel, "#/mehr", "Zurueck");
  }

  /* ------------------------------------------------------------ Sicherung */

  function seiteSicherung(ziel) {
    const anzahl = Object.keys(D.tage).filter((d) => !tagLeer(D.tage[d])).length;
    ziel.appendChild(
      karte(
        `<p class="kicker">${esc(sicherungsText())}</p><h2 class="h2">Sicherung</h2>
         <p class="lead">${anzahl} Tage, ${D.werte.length} Laborwerte, ${D.medikamente.length} Medikamente.
         Die Sicherung ist eine einzige Datei. Leg sie in iCloud Drive, in einen Ordner in der
         Dateien-App oder schick sie dir selbst. Ohne sie ist alles weg, wenn dem Telefon etwas passiert.</p>`,
      ),
    );

    const k = karte(`<p class="kicker">Herausschreiben</p><h2 class="h2">Sicherung erstellen</h2>`);
    const r = document.createElement("div");
    r.className = "knopf-reihe";

    const bTeilen = document.createElement("button");
    bTeilen.className = "knopf voll";
    bTeilen.textContent = "Sicherung teilen oder speichern";
    bTeilen.addEventListener("click", exportieren);
    r.appendChild(bTeilen);
    k.appendChild(r);
    ziel.appendChild(k);

    const ki = karte(
      `<p class="kicker">Zurueckholen</p><h2 class="h2">Sicherung einlesen</h2>
       <p class="lead">Achtung: das ersetzt alles, was jetzt in der App steht.</p>`,
    );
    const dateiHuelle = document.createElement("label");
    dateiHuelle.className = "feld";
    const dateiName = document.createElement("span");
    dateiName.textContent = "Sicherungsdatei auswaehlen";
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
          if (!neu || typeof neu !== "object" || !neu.tage) throw new Error("Form passt nicht");
          if (!confirm("Alles Aktuelle durch die Sicherung ersetzen?")) return;
          D = Object.assign(strukturKopie(LEER), neu);
          sichern();
          melden("Sicherung eingelesen.");
          zeichnen();
        } catch (e) {
          melden("Das ist keine Anker-Sicherung.");
        }
      };
      leser.readAsText(f);
    });
    dateiHuelle.append(dateiName, datei);
    ki.appendChild(dateiHuelle);
    ziel.appendChild(ki);

    const kl = karte(
      `<p class="kicker">Alles entfernen</p><h2 class="h2">Daten loeschen</h2>
       <p class="lead">Nimmt jeden Eintrag von diesem Geraet. Das laesst sich nicht rueckgaengig machen.</p>`,
    );
    const rl = document.createElement("div");
    rl.className = "knopf-reihe";
    const bl = document.createElement("button");
    bl.className = "knopf warn voll";
    bl.textContent = "Alles loeschen";
    bl.addEventListener("click", () => {
      if (!confirm("Wirklich alles loeschen? Vorher gesichert?")) return;
      if (!confirm("Letzte Frage. Alles weg?")) return;
      localStorage.removeItem(SCHLUESSEL);
      D = strukturKopie(LEER);
      melden("Geloescht.");
      location.hash = "#/heute";
      zeichnen();
    });
    rl.appendChild(bl);
    kl.appendChild(rl);
    ziel.appendChild(kl);
    zurueck(ziel, "#/mehr", "Zurueck");
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
        navigator.share({ files: [datei], title: "Anker Sicherung" }).then(fertig, () => {});
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
    melden("Sicherung erstellt.");
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
      "Anker laeuft nur als eigene Seite, nicht in einem fremden Rahmen.";
    return;
  }

  spracheSetzen(spracheWaehlen());
  themaSetzen();
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
