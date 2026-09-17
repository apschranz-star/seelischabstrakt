# JING

## Was JING ist

JING ist ein Shop für den DACH-Markt, gebaut mit Next.js 15 im App Router, React 19 und TypeScript im
strict-Modus. Der Katalog umfasst zehn Produkte einer Eigenmarke, fünf Objekte für den Abend und fünf
für den Tag, gepflegt als statische Daten in `config/products.ts`. Geliefert und abgerechnet wird in
drei Regionen, Deutschland, Österreich und die Schweiz, jeweils mit eigener Währung, eigenem
Steuersatz, eigenem Versand und, im Fall der Schweiz, mit Verzollung.

Das Interface folgt einem einzigen Prinzip, der Dualität. Es gibt zwei Rituale, YANG für den Tag,
sichtbare Kosmetik, und YIN für die Nacht, Duft und Körperritual. Der Umschalter im Kopf wechselt
nicht ein Detail, sondern invertiert die gesamte Oberfläche, und er entscheidet zugleich, welche
Kollektion im Kopf der Startseite steht. Deshalb steht in keiner Komponente eine Farbangabe, sondern
nur ein Token, das pro Ritual anders aufgelöst wird. Wer diese Regel bricht, bricht die Inversion.

## Schnellstart

Node 20.9 oder neuer, entwickelt und gebaut wurde das Projekt mit Node 22. Das Lockfile ist
eingecheckt, deshalb `npm install` und nicht `npm update`.

```bash
npm install        # Abhängigkeiten aus package-lock.json
npm run dev        # Entwicklungsserver auf http://localhost:3000
npm run build      # Produktionsbuild, ESLint und Typprüfung laufen mit
npm run lint       # eslint . mit next/core-web-vitals und next/typescript
npm run typecheck  # tsc --noEmit
npm start          # startet den fertigen Build
```

Für lokale Variablen `.env.example` nach `.env.local` kopieren. Darin stehen nur
`NEXT_PUBLIC_SITE_URL` und ein leerer Platzhalter für einen Zahlungsanbieter. Solange dieser Schlüssel
leer ist, bleibt die Kasse im Mock-Betrieb, und das ist derzeit der einzige unterstützte Zustand.

Eine Testsuite gibt es nicht. Die Prüfkette besteht aus `lint`, `typecheck` und `build`. Alle drei
müssen sauber durchlaufen, bevor etwas gemerged wird.

Betrieb auf Netlify: `netlify.toml` liegt bei, Environment-Variablen sind nicht nötig. Der Start als
ein Prompt für einen GPT mit GitHub- und Netlify-Anbindung steht in `LAUNCH.md`, die Pflege in
`HANDOVER.md`.

## Verzeichnisbaum

```
app/
  globals.css                Tailwind-Import, @theme-Tokens und beide Paletten, einzige Stelle mit Farbwerten
  layout.tsx                 Wurzel-Layout, Schriften, Metadaten, Bootstrap-Skript, Kopf, Fuß, Warenkorb
  page.tsx                   Startseite, Faktenband, die beiden Kollektionsabschnitte #yang und #yin, die These
  products/[slug]/page.tsx   Produktseite, Server Component, statisch vorgerendert, mit Pflichtangaben
  cart/page.tsx              Warenkorb als eigene Seite, Lieferland, Versandschwelle, Kostenrechnung
  checkout/page.tsx          Kasse, Zahlartwahl, Bestellübersicht, ruft den Mock-Endpunkt auf
  preview/page.tsx           interne Galerie aller Bauteile, kein Teil der Kundenstrecke
  legal/impressum/page.tsx   Impressum
  legal/agb/page.tsx         Allgemeine Geschäftsbedingungen
  legal/widerruf/page.tsx    Widerrufsbelehrung mit Muster-Widerrufsformular
  api/products/route.ts      Katalog als JSON, optional nach Kollektion gefiltert
  api/checkout/route.ts      Mock-Zahlungssitzung, validiert streng, rechnet serverseitig, bucht nichts ab

components/home/
  ritual-hero.tsx            der Hero in drei Ebenen, die großen Worte bleiben beim Scrollen zurück, der Claim geht voraus
  ritual-copy.ts             die Worte beider Rituale, Kicker, Titel, Tageszeit und Lead, gelesen von Hero und Abschnitten

components/theme/
  yin-yang-provider.tsx      Context über den Store, hält mode, region und das Flag hydrated. Der Wechsel ist eine Eklipse: eine View Transition lässt die neue Palette als harte Scheibe vom berührten Punkt wachsen, dazu schreibt der Provider data-switching="to-yin" oder "to-yang" und die Variablen --jing-switch-x, -y und -r an das html-Element, die das CSS ausliest; ohne die API, unter prefers-reduced-motion, in einem verdeckten Tab oder mit instant bleibt es beim Token-Crossfade von 620 Millisekunden.
  theme-toggle.tsx           der Umschalter zwischen den Ritualen, mit aria-pressed und echtem Label. Er ist das einzige Element mit data-switch-mark und liegt damit auf einer eigenen Ebene über der Eklipse, das Zeichen dreht sich live, das Wort daneben gleitet aus und ein.

components/product/
  packaging-viewer.tsx       zeichnet die Verpackung als CSS und SVG, es gibt keine Bilddateien im Projekt
  product-card.tsx           Kachel mit Preis, Grundpreis und Preistransparenzzeile
  add-to-cart.tsx            Mengenwahl und Schaltfläche, schreibt in den Store
  inci-drawer.tsx            Tafel mit den Pflichtangaben, Inhalt je nach Produktart

components/cart/
  cart-drawer.tsx            globaler Warenkorb als Dialog, liegt im Layout und ist auf jeder Seite da
  payment-badges.tsx         Zahlarten der gewählten Region, reine Anzeige

components/ui/
  button.tsx                 Button und buttonClasses, drei Varianten, drei Größen
  modal.tsx                  Dialog mit role="dialog", aria-modal, Escape und Fokusrückgabe
  site-header.tsx            Kopfzeile mit Navigation, Warenkorbzähler, Lieferland und Ritualumschalter, wird beim Scrollen fester
  section-handoff.tsx        die Haarlinie, die sich beim Erreichen eines Abschnitts von der Mitte nach unten zeichnet
  reveal.tsx                 das eine Einblendsystem, 32 Pixel Gleitweg von der eigenen Seite, 60 Millisekunden Versatz
  site-footer.tsx            Fußzeile mit den drei Rechtsseiten und der Preistransparenzzeile

config/
  site.ts                    Regionen, Steuersätze, Versand, Zoll, Zahlarten, Firmendaten, CHF-Kurs
  products.ts                Katalog und Produkttypen, inklusive des regulatorischen Blocks je Produkt

lib/
  motion.ts                  das eine Zeitmodul, sechs Dauern, zwei Kurven, ein Versatz, geteilt mit den CSS-Variablen
  switch-origin.ts           SwitchOptions für den Wechsel, Ursprungspunkt oder instant, und originFromEvent, das aus Zeiger oder Tastatur den Punkt liest
  utils.ts                   Formatierung, Umrechnung, Grundpreis, Steuer, Bestellsummen, Bestellreferenz
  store.ts                   Zustand-Store für Ritual, Lieferland und Warenkorb, plus Selektoren
```

Im Wurzelverzeichnis liegen außerdem `next.config.ts` mit den Sicherheitsheadern,
`eslint.config.mjs`, `postcss.config.mjs` und `tsconfig.json` mit dem Alias `@/*`. Tailwind 4 wird
vollständig in CSS konfiguriert, eine `tailwind.config`-Datei gibt es bewusst nicht. `public/` ist
leer und soll es bleiben, das Projekt kommt ohne Bilddateien aus.

## Die Yin-Yang-Engine

Die Umschaltung läuft über fünf Stationen. Wer eine davon umgeht, erzeugt entweder einen Farbfehler
oder einen Hydration-Mismatch.

**1. Das Tokenpaar in `app/globals.css`.** Der `@theme`-Block bildet die Tailwind-Utilities auf
CSS-Variablen ab, `--color-surface` zeigt auf `--jing-surface`, `--color-ink` auf `--jing-ink` und so
weiter. Die Werte selbst stehen zweimal darunter, einmal unter `:root, :root[data-mode="yang"]` mit
heller Fläche und dunkler Schrift, einmal unter `:root[data-mode="yin"]` mit vertauschten Rollen. Ein
Bauteil schreibt also `bg-surface text-ink`, und dieselbe Klasse ergibt im Tagesritual dunkle Schrift
auf hellem Grund und im Nachtritual das Gegenteil. Der Übergang liegt als Transition auf `body` und
wird im Block für `prefers-reduced-motion` abgeschaltet.

**2. `data-mode` am Dokumentelement.** Dieses Attribut ist der einzige Schalter. Der
`YinYangProvider` schreibt es in einem Effekt, `document.documentElement.dataset.mode = mode`, sobald
sich das Ritual ändert. Serverseitig rendert `app/layout.tsx` das `html`-Element fest mit
`data-mode="yang"` und `suppressHydrationWarning`, weil das Bootstrap-Skript diesen Wert vor React
bereits überschrieben haben kann.

**3. Das Bootstrap-Skript in `app/layout.tsx`.** Ein kurzes Inline-Skript im `head` liest denselben
localStorage-Schlüssel, den die Persistenz schreibt, `jing-store`, zieht daraus `state.mode` und
setzt `data-mode`, bevor der erste Pixel gemalt wird. Schlägt das fehl, etwa weil Storage blockiert
ist, fällt es auf `yang` zurück. Ohne dieses Skript blitzt bei einem Besucher im Nachtritual für
einen Frame die helle Fläche auf.

**4. Der Store mit `skipHydration`.** `lib/store.ts` legt den Zustand-Store mit dem
`persist`-Middleware an, Name `jing-store`, `version: 1`, `partialize` auf `mode`, `region` und
`items`. Entscheidend ist `skipHydration: true`, der Store liest den Speicher beim Import also nicht
von selbst. Das erledigt der `YinYangProvider` in einem Effekt über
`useJingStore.persist.rehydrate()` und setzt danach `hydrated` auf `true`. Auf dem Server greift
bewusst ein Memory-Storage, der nichts liefert und nichts schreibt.

**5. Das Flag `hydrated`.** Vor der Rehydrierung enthält der Store die Startwerte, Ritual `yang`,
Region `DE`, leerer Warenkorb. Genau diese Werte hat auch das Servermarkup. Rendert ein Bauteil den
gespeicherten Wert schon im ersten Client-Render, unterscheidet sich sein Baum vom ausgelieferten
HTML, und React meldet einen Hydration-Mismatch. Deshalb gilt ohne Ausnahme: alles, was aus der
Persistenz kommt, also Ritual, Lieferland und Warenkorb, wird erst gelesen, wenn `hydrated` wahr ist.
Das Muster steht in `app/page.tsx` und in `components/product/product-card.tsx`:

```tsx
const { mode, hydrated } = useYinYang();
const activeMode = hydrated ? mode : FALLBACK_MODE;
```

Bis dahin rendert das Bauteil einen neutralen Platzhalter: die Produktkachel den Euro-Preis für
Deutschland, der Warenkorbzähler im Kopf eine Null, der Cart-Drawer gar nichts, die Warenkorbseite
ein Skelett. Das Attribut am Dokumentelement ist davon ausgenommen, das setzt das Bootstrap-Skript,
und CSS löst Tokens ohne React auf. Sichtbar ist also sofort das richtige Ritual, die React-Seite
zieht einen Tick später nach.

Aus derselben Pflicht folgt die Regel gegen `Date.now()`, `Math.random()` und `new Date()` im Render.
Wo eine Bestellreferenz gebraucht wird, liefert `orderReference(seed)` aus `lib/utils.ts` einen
stabilen Wert, der Seed wird deterministisch aus dem Warenkorb abgeleitet.

## Das Preismodell

Alle Preise im Katalog sind Bruttopreise in Eurocent, `priceCents: 5400` sind 54,00 Euro inklusive
Steuer. Ganzzahlen, keine Fließkommazahlen. Verbraucherpreise in der EU sind Endpreise, die
Umsatzsteuer ist enthalten und wird nur ausgewiesen, niemals am Ende aufgeschlagen.
`vatIncludedInGross` rechnet den enthaltenen Anteil heraus, nicht hinzu.

Die Region entscheidet über alles Weitere. `config/site.ts` hält je Region Währung, Steuersatz und
Steuerlabel, die Versandpauschale, die Schwelle für kostenfreien Versand, den Zusteller, das
Lieferfenster und die angebotenen Zahlarten. Für die Schweiz kommt ein Zollblock dazu, eine
Abfertigungspauschale je Paket und der Incoterm DDP, also verzollt und versteuert bis zur Haustür.
`estimateOrder` in `lib/utils.ts` setzt daraus die Bestellung zusammen: Zwischensumme, Versand,
Abfertigung, Gesamtbetrag, enthaltene Steuer und der Rest bis zum kostenfreien Versand.

Umgerechnet wird mit `toRegionMinorUnits`, in den Euroregionen ein Durchreichen, in der Schweiz eine
Multiplikation mit `CHF_PER_EUR`. Gerundet wird dabei je Stück, bevor mit der Menge multipliziert
wird. `CHF_PER_EUR = 0.94` ist ein reiner Anzeigekurs. Ein produktiver Shop holt den Kurs am
Bestelltag beim Zahlungsanbieter, friert ihn für die Bestellung ein und nennt die Quelle in den
Bedingungen. Formatiert wird ausschließlich über `formatMoney`, `formatForRegion` und
`formatBasePrice`, nie von Hand, sonst stimmen Dezimaltrennzeichen und Währungszeichen zwischen
`de-DE` und `de-CH` nicht mehr.

## Der Grundpreis nach PAngV

Wird eine Ware nach Volumen oder Gewicht verkauft, muss neben dem Verkaufspreis der Grundpreis
stehen. Die Bezugsgröße ist ein Liter oder ein Kilogramm. Zulässige Ausnahme sind Packungen unter
250 ml oder 250 g, die dürfen auf 100 ml oder 100 g bezogen werden.

Genau das steht in `lib/utils.ts`. Die Konstante `SMALL_PACK_THRESHOLD = 250` zieht die Grenze,
`computeBasePrice(grossMinorUnits, netQuantity)` liefert Betrag, Bezugsmenge und Label,
`formatBasePrice(product, region)` setzt daraus die fertige Zeile, etwa `108,00 € / 100 ml`, und gibt
`null` zurück, wenn kein Grundpreis nötig ist. Ausgegeben wird die Zeile auf der Produktkachel, der
Produktseite, im Warenkorb, im Cart-Drawer und in der Kasse, immer mit dem Wort Grundpreis davor.

Ein neues Produkt ist richtig ausgezeichnet, wenn drei Angaben stimmen:

- `priceCents`, der Bruttopreis in Eurocent, als ganze Zahl.
- `netQuantity`, die Füllmenge als `{ value, unit }` mit `unit` gleich `"ml"` oder `"g"`. Immer in der
  kleinen Einheit angeben, auch bei großen Packungen, die Umstellung auf Liter oder Kilogramm macht
  die Funktion selbst. Bruchwerte sind erlaubt, die Lip Clay im Katalog hat 3,5 g.
- `netQuantity: null` für alles, was nicht nach Volumen oder Gewicht verkauft wird, also Geräte, Sets
  und Zubehör. Dann entfällt die Zeile, und das ist korrekt, nicht vergessen.

Zur Kontrolle am Katalog: 50 ml Öl, 15 ml Glaze, 15 g Cushion, 3,5 g Lip Clay und 100 ml Essence
liegen unter der Schwelle und werden je 100 ml oder je 100 g ausgezeichnet, die Kerze mit 220 g
ebenfalls. Eine Packung ab 250 g oder 250 ml stellt die Funktion automatisch auf ein Kilogramm oder
einen Liter um. Diffuser und Gua-Sha-Set haben `netQuantity: null` und tragen keinen Grundpreis. Das
Feld `unitsLabel` ist reine Anzeige, es beeinflusst die Rechnung nicht, sollte aber zur Füllmenge
passen.

## Pflichtangaben, die der Code rendert

Jedes Produkt trägt einen `regulatory`-Block, und `components/product/inci-drawer.tsx` schaltet über
dessen `kind` den Inhalt der Tafel um. Die Tafel ist ein Dialog mit Fokusfalle, Escape schließt, der
Fokus kehrt auf die auslösende Schaltfläche zurück.

- **Kosmetik.** INCI-Liste in absteigender Gewichtsreihenfolge wie auf der Packung,
  deklarationspflichtige Duftstoffallergene nach Anhang III der Verordnung EG 1223/2009, die
  Haltbarkeit nach dem Öffnen als PAO, die CPNP-Referenz und die Warnhinweise.
- **Diffuser.** Der elektrische Block zeigt die Registrierung nach ElektroG mit der WEEE-Nummer,
  Anschlusswerte und Leistung, dazu den Hinweis, dass Altgeräte nicht in den Hausmüll gehören, samt
  Rücknahmeangebot.
- **Kerze.** Die Einstufung nach CLP, das Signalwort falls eines gesetzt ist, die Sätze zu
  Duftstoffen und allergischen Reaktionen, die Brenndauer und die Hinweise zum sicheren Abbrennen.
- **Zubehör.** Material, Pflege und Hinweise.

Dazu kommt die Preistransparenz. Jeder Preisblock trägt die Zeile
`inkl. MwSt., zzgl. Versandkosten`, und wo eine Füllmenge existiert, zusätzlich den Grundpreis.
Versandkosten, Lieferfenster und, für die Schweiz, der Zollhinweis stehen im Warenkorb und in der
Kasse. Die Fußzeile wiederholt die Preistransparenz und verlinkt die drei Rechtsseiten.

## Vor dem Livegang zu erledigen

Alles in dieser Tabelle ist absichtlich Platzhalter oder Attrappe. Keiner dieser Punkte darf so in
den Publikumsbetrieb gehen.

| Punkt | Wo im Code | Was passieren muss |
| --- | --- | --- |
| Firmendaten | `config/site.ts`, `SITE.legalEntity` | Alle Werte in eckigen Klammern ersetzen: Geschäftsführung, Straße, PLZ und Ort, Registergericht und HRB-Nummer, USt-IdNr., Aufsichtsbehörde, Telefonnummer. Ebenso `SITE.url` und `SITE.email` auf die echte Domain umstellen. |
| Die fünf Rechtsseiten | `app/legal/impressum`, `agb`, `widerruf`, `datenschutz`, `versand` | Die Texte sind Entwürfe aus der Konfiguration und ersetzen keine Rechtsberatung. Alle fünf anwaltlich prüfen und freigeben lassen, das Muster-Widerrufsformular eingeschlossen. Die Datenschutzerklärung beschreibt den heutigen Stand ohne Tracking und ohne externe Skripte, sie muss mit jedem später eingebauten Dienst mitwachsen. |
| Produktfotos | `public/`, `components/product/packaging-viewer.tsx` | Es gibt keine Fotos. Jedes Angebot zeigt nur eine aus `product.vessel` erzeugte SVG-Silhouette. Artikel 19 der Verordnung (EU) 2023/988 verlangt im Fernabsatzangebot eine Abbildung des Produkts, eine abstrakte Vektorform ist keine. Vor dem Livegang je Produkt ein Foto aufnehmen, ein `image`-Feld am Produkt ergänzen und es in Karte und Produktseite ausspielen. Bis dahin darf das Angebot nicht öffentlich sein. |
| CPNP-Referenzen | `config/products.ts`, alle `cpnpReference` | Die Werte beginnen mit `CPNP-DEMO-` und sind erfunden. Jedes kosmetische Mittel muss vor dem Inverkehrbringen im CPNP notifiziert sein, die echte Referenz gehört an diese Stelle. Gleichzeitig INCI-Liste, Allergene, PAO und Warnhinweise gegen Rezeptur und gedrucktes Etikett abgleichen. |
| WEEE-Nummer | `config/products.ts`, Produkt `yin-01` | Dort steht `WEEE-Reg.-Nr. DE [wird nach Registrierung ergänzt]`. Vor dem ersten Angebot bei der Stiftung EAR registrieren, die zugeteilte Nummer eintragen und Rücknahme sowie Entsorgungsweg tatsächlich organisieren. |
| Kasse | `app/api/checkout/route.ts` | Der Endpunkt erzeugt eine lokale Pseudo-Sitzung, antwortet mit `live: false` und leitet nur in den Shop zurück. Ersetzen durch einen serverseitigen Aufruf beim Anbieter. Zwei Eigenschaften müssen den Umbau überleben: der Betrag wird serverseitig aus Katalog und Region neu gerechnet und nie vom Client übernommen, und der Client erfährt nur die Sitzung, nicht den Betrag. |
| CHF-Kurs | `config/site.ts`, `CHF_PER_EUR` | Fester Anzeigekurs von 0,94. Ersetzen durch einen Kurs, der am Bestelltag vom Zahlungsanbieter kommt, für die Bestellung eingefroren wird und dessen Quelle in den AGB steht. |
| Zahlungsanbieter | `.env.example`, `components/cart/payment-badges.tsx` | `PAYMENT_PROVIDER_KEY` ist leer, es ist kein Anbieter angebunden. Die Badges für Klarna, EPS, TWINT, Apple Pay, PayPal, SEPA und Karte sind reine Beschriftungen. Verträge schließen, Schlüssel serverseitig hinterlegen, je Zahlart den echten Ablauf mit Rückkanal, Storno und Fehlerfällen bauen. |
| Content Security Policy | `next.config.ts`, `CSP` | Alles ausser Skripten und Styles ist auf die eigene Herkunft begrenzt. `script-src` und `style-src` tragen noch `'unsafe-inline'`, weil der Mode-Bootstrap und der Reveal-Fallback vor dem ersten Paint laufen müssen und Next eigene Inline-Skripte einfügt. Auf Nonces umstellen heisst eine Middleware, die pro Anfrage eine Nonce setzt, und damit werden aus 19 statischen Seiten dynamisch gerenderte. Vor dem Livegang entscheiden. |
| Steuer- und Versandwerte | `config/site.ts`, `REGIONS` | Steuersätze, Versandpauschalen, Schwellen für kostenfreien Versand und die Schweizer Abfertigungspauschale sind Konfiguration, kein Gesetzestext. Vor dem Start mit Steuerberatung und Logistikpartner bestätigen, OSS-Anmeldung klären und danach regelmäßig prüfen. |

## Hinweis zum Katalog

Katalog, Produktnamen, Texte, Rituale, Herkunftsangaben und regulatorische Blöcke sind Startdaten für
eine gedachte Eigenmarke. Die Daten zeigen, welche Felder eine solche Range braucht und wie das
Interface damit umgeht. Eine Aussage über tatsächlich erhältliche Ware sind sie nicht, ebenso wenig
geprüfte Rezepturen oder eine Zusicherung von Eigenschaften. Wer echte Produkte einpflegt, ersetzt diese Daten
vollständig und lässt sie vor der Veröffentlichung fachlich prüfen.
