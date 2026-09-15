import type { Metadata } from "next";

import { LegalShell, Section } from "@/app/legal/_template-notice";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Wie JING mit personenbezogenen Daten umgeht.",
  robots: { index: false, follow: true },
};

const L = SITE.legalEntity;

export default function DatenschutzPage() {
  return (
    <LegalShell title="Datenschutzerklärung" updated="September 2026">
      <Section no="1" title="Verantwortliche Stelle">
        <p>
          {L.company}, {L.street}, {L.zipCity}, {L.country}. E-Mail {SITE.email}.
        </p>
        <p className="text-ink-3">
          Ein Datenschutzbeauftragter ist zu benennen, sobald in der Regel mindestens zwanzig
          Personen ständig mit automatisierter Verarbeitung beschäftigt sind, § 38 BDSG. Diese Stelle
          ist hier noch nicht besetzt und muss bei Bedarf ergänzt werden.
        </p>
      </Section>

      <Section no="2" title="Was dieser Shop technisch speichert">
        <p>
          Beim Aufruf der Seiten verarbeitet der Hoster Server-Logdaten, darunter IP-Adresse,
          Zeitpunkt, angefragte Adresse und übertragene Datenmenge. Rechtsgrundlage ist Art. 6 Abs. 1
          lit. f DSGVO, das berechtigte Interesse am sicheren Betrieb.
        </p>
        <p>
          Warenkorb, Lieferland und die gewählte Ansicht Yin oder Yang liegen ausschließlich im
          lokalen Speicher deines Browsers. Sie werden nicht an uns übertragen, solange du nichts
          bestellst, und du kannst sie über die Einstellungen deines Browsers jederzeit löschen. Ein
          Einwilligungsbanner ist dafür nicht erforderlich, weil diese Speicherung für den von dir
          gewünschten Dienst unbedingt erforderlich ist, § 25 Abs. 2 Nr. 2 TDDDG.
        </p>
      </Section>

      <Section no="3" title="Bestellung">
        <p>
          Für eine Bestellung verarbeiten wir Name, Lieferadresse, E-Mail-Adresse und die Angaben zur
          Zahlung. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, die Erfüllung des Vertrags.
          Handels- und steuerrechtliche Aufbewahrungsfristen von sechs beziehungsweise zehn Jahren
          gehen einer Löschung vor.
        </p>
      </Section>

      <Section no="4" title="Empfänger">
        <p>
          Wir geben Daten an die Stellen weiter, die zur Abwicklung nötig sind: Zahlungsdienstleister,
          Logistikpartner und den Hoster. Mit Auftragsverarbeitern bestehen Verträge nach Art. 28
          DSGVO. Für Lieferungen in die Schweiz wird die Adresse zusätzlich an die Zollabfertigung
          übermittelt.
        </p>
        <p className="text-ink-3">
          Die konkreten Anbieter stehen noch nicht fest. Sobald sie feststehen, gehören sie
          namentlich in diese Erklärung, ebenso die Frage, ob eine Übermittlung in ein Drittland
          stattfindet und auf welcher Grundlage.
        </p>
      </Section>

      <Section no="5" title="Kein Tracking">
        <p>
          Dieser Shop setzt derzeit keine Analyse-, Marketing- oder Profilbildungs-Dienste ein und
          bindet keine externen Skripte zu diesem Zweck ein. Sobald das geschieht, braucht es eine
          Einwilligungslösung vor dem ersten Setzen solcher Dienste und eine Ergänzung dieser
          Erklärung.
        </p>
      </Section>

      <Section no="6" title="Deine Rechte">
        <p>
          Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
          Datenübertragbarkeit und Widerspruch, Art. 15 bis 21 DSGVO. Eine erteilte Einwilligung
          kannst du jederzeit mit Wirkung für die Zukunft widerrufen. Außerdem steht dir ein
          Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu.
        </p>
        <p>Für alle Anliegen genügt eine Nachricht an {SITE.email}.</p>
      </Section>
    </LegalShell>
  );
}
