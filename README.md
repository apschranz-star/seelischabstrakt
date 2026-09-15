# JING

JING ist ein Shop für zwei Sortimente, die sich gegenseitig bedingen: YANG für den Tag, sichtbare
Kosmetik, und YIN für die Nacht, Duft und Körperritual. Die Oberfläche macht dieses Prinzip
bedienbar, sie kippt auf Knopfdruck von hell auf dunkel und zeigt dabei die jeweils andere
Kollektion. Der Shop richtet sich an Kundinnen und Kunden in Deutschland, Österreich und der
Schweiz und rechnet Währung, Steuer, Versand und Zoll je Lieferland.

## Schnellstart

    node -v          # 20 oder neuer, entwickelt mit 22
    npm install
    npm run dev      # http://localhost:3000
    npm run build    # Produktionsbuild, prüft Typen und ESLint mit
    npm run lint
    npm run typecheck

## Aufbau

    app/layout.tsx                  Wurzel-Layout, Schriften, Kopf und Fuß, Provider, Bootstrap-Skript
    app/page.tsx                    Startseite, geteilter Hero, Kollektion der aktiven Ansicht
    app/products/[slug]/page.tsx    Produktseite, statisch vorgerendert, PAngV-Block, INCI-Schublade
    app/cart/page.tsx               Warenkorb mit Lieferland-Umschalter und voller Kostenrechnung
    app/checkout/page.tsx           Checkout-Oberfläche, Adresse, Zahlungsart, Bestellabschluss
    app/legal/                      Impressum, AGB, Widerruf, alle drei als geprüfte Vorlage
    app/api/products/route.ts       Katalog als JSON, optional nach Kollektion gefiltert
    app/api/checkout/route.ts       Mock-Zahlungssitzung, validiert streng, bucht nichts ab
    components/theme/               YinYangProvider und der animierte Umschalter
    components/product/             Packaging-Renderer, Produktkarte, Add-to-Cart, INCI-Schublade
    components/cart/                Warenkorb-Schublade und Zahlungs-Badges
    components/ui/                  Button, Modal, Kopf- und Fußzeile
    config/site.ts                  Regionen, Steuersätze, Versand, Zoll, Zahlungsarten, Firmendaten
    config/products.ts              Katalog, acht Produkte, mit regulatorischem Block je Produkt
    lib/utils.ts                    Währung, PAngV-Rechner, Steuer, Bestellsumme
    lib/store.ts                    Zustand-Store für Warenkorb, Lieferland und Ansicht

## Die Yin-Yang-Engine

Die Farbpalette liegt zweimal in `app/globals.css`, einmal unter `:root[data-mode="yang"]`, einmal
unter `:root[data-mode="yin"]`. Kein Bauteil schreibt eine Farbe direkt, alle gehen über Token wie
`bg-surface` oder `text-ink`. Deshalb genügt ein Attribut am Wurzelelement, um die gesamte
Oberfläche zu drehen.

Gesetzt wird das Attribut an drei Stellen:

1. Ein kleines Skript im `<head>` liest den gespeicherten Wert, bevor der erste Pixel gemalt wird.
   Ohne diesen Schritt blitzt beim Laden die falsche Ansicht auf.
2. Der `YinYangProvider` schreibt es bei jeder Änderung neu.
3. Der Zustand selbst liegt im Zustand-Store und wird im `localStorage` gehalten.

Wichtig für alle, die hier weiterbauen: Der Store wird mit `skipHydration` erzeugt und erst in einem
Effekt nachgeladen. Bis dahin steht `hydrated` auf `false`. Ein Bauteil, das gespeicherte Werte
anzeigt, bevor dieses Flag gesetzt ist, erzeugt einen Hydration-Mismatch, weil der Server diese Werte
nicht kennt. Deshalb rendert die Produktkarte vor der Hydration den Euro-Preis für Deutschland.

## Geld

Preise stehen in `config/products.ts` als **Brutto-Cent in Euro**. Ganzzahlen, keine Fließkommazahlen,
damit sich nichts aufaddiert. Das Lieferland entscheidet über alles Weitere:

| Land | Währung | Steuersatz | Versand | Frei ab | Zoll |
|---|---|---|---|---|---|
| Deutschland | EUR | 19 % | 4,90 | 75,00 | entfällt |
| Österreich | EUR | 20 % | 7,90 | 90,00 | entfällt |
| Schweiz | CHF | 8,1 % | 14,90 | 150,00 | 11,00 Abfertigung, DDP |

`CHF_PER_EUR` in `config/site.ts` ist ein Anzeigekurs. Ein echter Shop holt den Kurs am Bestelltag
vom Zahlungsdienstleister und schreibt die Quelle in die AGB.

## Der Grundpreis nach PAngV

`computeBasePrice` in `lib/utils.ts` bildet die Regel ab: Der Grundpreis bezieht sich auf einen Liter
oder ein Kilogramm, bei Packungen unter 250 ml oder 250 g darf auf 100 ml oder 100 g gerechnet werden.
Alle acht Katalogprodukte liegen darunter, deshalb steht überall eine Angabe je 100.

Ein neues Produkt bekommt deshalb immer eine ehrliche `netQuantity`. Fehlt sie, zeigt der Shop keinen
Grundpreis, und das ist bei nach Gewicht verkaufter Ware ein Abmahnrisiko.

## Was der Code an Pflichtangaben zeigt

Jedes Produkt trägt einen `regulatory`-Block, und die Produktseite entscheidet danach, welche Tafel
sie zeigt:

- `cosmetic`: INCI-Liste in gedruckter Reihenfolge, deklarationspflichtige Duftstoffallergene,
  Haltbarkeit nach dem Öffnen, CPNP-Referenz, Warnhinweise.
- `electrical`: WEEE-Nummer, Spannung, Leistung, Hinweis zur getrennten Entsorgung.
- `candle`: CLP-Sätze, Brenndauer, Sicherheitshinweise.
- `accessory`: Material, Pflege, Hinweise.

Dazu auf jeder Preisangabe: Grundpreis und „inkl. MwSt., zzgl. Versandkosten“.

## Vor dem Livegang zu erledigen

| Was | Wo | Was passieren muss |
|---|---|---|
| Firmendaten | `config/site.ts`, `legalEntity` | Alle Platzhalter in eckigen Klammern durch echte Angaben ersetzen |
| Impressum, AGB, Widerruf | `app/legal/` | Vom Anwalt prüfen lassen, Hinweisbox entfernen, erst dann indexieren |
| CPNP-Referenzen | `config/products.ts` | Die Werte `CPNP-DEMO-…` durch echte Notifizierungsreferenzen ersetzen |
| WEEE-Nummer | `config/products.ts`, `yin-01` | Registrierung bei der Stiftung EAR, Nummer eintragen |
| Zahlungen | `app/api/checkout/route.ts` | Durch einen echten Anbieter ersetzen, Betrag immer serverseitig neu rechnen |
| Wechselkurs | `config/site.ts`, `CHF_PER_EUR` | Durch einen Kurs vom Zahlungsdienstleister ersetzen |
| Steuer | `config/site.ts` | Sätze und Schwellen mit der Steuerberatung bestätigen, OSS klären |
| Datenschutz | fehlt noch | Datenschutzerklärung und Cookie-Konzept ergänzen, sobald Tracking dazukommt |

## Zum Katalog

Die acht Produkte sind Startdaten für eine Eigenmarke. Namen, Texte, Rezepturlisten und Referenzen
sind für den Aufbau des Shops geschrieben und beschreiben keine tatsächlich erhältliche Ware. Bevor
etwas davon verkauft wird, ersetzt die echte Produktdokumentation diese Angaben vollständig.
