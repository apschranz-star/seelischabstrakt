import type { Metadata } from "next";

import { LegalShell, Section } from "@/app/legal/_template-notice";
import { REGIONS, SITE, WITHDRAWAL_DAYS } from "@/config/site";

export const metadata: Metadata = {
  title: "AGB",
  description: "Allgemeine Geschäftsbedingungen für Bestellungen bei JING.",
  robots: { index: false, follow: true },
};

const L = SITE.legalEntity;

export default function AgbPage() {
  return (
    <LegalShell title="Allgemeine Geschäftsbedingungen" updated="September 2026">
      <Section no="1" title="Geltungsbereich und Vertragspartner">
        <p>
          Diese Bedingungen gelten für alle Bestellungen über {SITE.url} zwischen {L.company},{" "}
          {L.street}, {L.zipCity}, und dir als Kundin oder Kunde. Verbraucher ist, wer das Geschäft
          zu Zwecken abschließt, die überwiegend weder der gewerblichen noch der selbständigen
          beruflichen Tätigkeit zugerechnet werden können.
        </p>
      </Section>

      <Section no="2" title="Vertragsschluss">
        <p>
          Die Darstellung der Produkte im Shop ist kein bindendes Angebot, sondern eine Aufforderung
          zur Bestellung. Mit dem Klick auf „Zahlungspflichtig bestellen“ gibst du ein verbindliches
          Angebot ab. Der Vertrag kommt zustande, wenn wir die Annahme in Textform bestätigen oder
          die Ware versenden. Eine automatische Eingangsbestätigung ist noch keine Annahme.
        </p>
      </Section>

      <Section no="3" title="Preise und Versandkosten">
        <p>
          Alle Preise sind Endpreise und enthalten die gesetzliche Umsatzsteuer. Für Lieferungen nach
          Deutschland gelten {Math.round(REGIONS.DE.vatRate * 100)} Prozent, nach Österreich{" "}
          {Math.round(REGIONS.AT.vatRate * 100)} Prozent. Für die Schweiz weisen wir die Preise in
          CHF aus, verzollt und versteuert, mit {REGIONS.CH.vatLabel}.
        </p>
        <p>
          Versandkosten werden im Warenkorb vor dem Absenden der Bestellung ausgewiesen. Ab{" "}
          {(REGIONS.DE.freeShippingCents / 100).toFixed(2).replace(".", ",")} EUR liefern wir
          innerhalb Deutschlands versandkostenfrei. Bei Produkten, die nach Gewicht oder Volumen
          verkauft werden, steht der Grundpreis nach der Preisangabenverordnung unter dem
          Verkaufspreis.
        </p>
      </Section>

      <Section no="4" title="Lieferung">
        <p>
          Wir liefern aus unserem Lager in {SITE.warehouse.city}, {SITE.warehouse.country}, nach
          Deutschland, Österreich und in die Schweiz. Die im Shop genannten Lieferzeiten sind
          voraussichtliche Zeiten ab Zahlungseingang. Die Schweiz liegt außerhalb der EU-Zollunion,
          wir versenden dorthin verzollt und versteuert, es entstehen an der Haustür keine weiteren
          Kosten.
        </p>
      </Section>

      <Section no="5" title="Zahlung">
        <p>
          Welche Zahlungsarten zur Verfügung stehen, hängt vom Lieferland ab und wird im Checkout
          angezeigt. Bei Zahlungsarten mit Zahlungsaufschub gelten zusätzlich die Bedingungen des
          jeweiligen Anbieters.
        </p>
      </Section>

      <Section no="6" title="Eigentumsvorbehalt">
        <p>Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.</p>
      </Section>

      <Section no="7" title="Widerrufsrecht">
        <p>
          Verbraucherinnen und Verbrauchern steht ein Widerrufsrecht von {WITHDRAWAL_DAYS} Tagen zu.
          Die vollständige Belehrung und das Muster-Widerrufsformular stehen auf der Seite
          Widerrufsrecht.
        </p>
        <p>
          Ausgenommen sind versiegelte Waren, die aus Gründen des Gesundheitsschutzes oder der
          Hygiene nicht zur Rückgabe geeignet sind, wenn ihre Versiegelung nach der Lieferung
          entfernt wurde. Das betrifft geöffnete kosmetische Mittel.
        </p>
      </Section>

      <Section no="8" title="Gewährleistung">
        <p>
          Es gilt das gesetzliche Mängelhaftungsrecht. Farbabweichungen zwischen Bildschirm und
          Produkt sind kein Mangel. Bei Transportschäden melde dich bitte innerhalb von sieben Tagen
          mit Fotos, dann ersetzen wir oder erstatten.
        </p>
      </Section>

      <Section no="9" title="Haftung">
        <p>
          Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie nach dem
          Produkthaftungsgesetz. Bei einfacher Fahrlässigkeit haften wir nur bei Verletzung einer
          wesentlichen Vertragspflicht und begrenzt auf den vorhersehbaren, vertragstypischen
          Schaden.
        </p>
      </Section>

      <Section no="10" title="Rechtswahl">
        <p>
          Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Zwingende
          Verbraucherschutzvorschriften des Staates, in dem du deinen gewöhnlichen Aufenthalt hast,
          bleiben unberührt. Das gilt insbesondere für Bestellungen aus Österreich und der Schweiz.
        </p>
        <p className="text-ink-3">
          Hinweis für die Umsetzung: Rechtswahl, Gerichtsstand und die Formulierung der
          Haftungsklausel gehören zu den Punkten, die anwaltlich geprüft werden müssen, bevor dieser
          Text verwendet wird.
        </p>
      </Section>
    </LegalShell>
  );
}
