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

      <Section no="2" title="Hosting und Server-Logdaten">
        <p>
          Die nicht öffentliche Vorschau dieses Shops liegt auf GitHub Pages, einem Dienst der
          GitHub, Inc., USA. Die Live-Adresse liegt auf Netlify, einem Dienst der Netlify, Inc., USA.
        </p>
        <p>
          Beim Aufruf der Seiten verarbeitet der jeweilige Hoster Server-Logdaten, darunter
          IP-Adresse, Zeitpunkt, angefragte Adresse und übertragene Datenmenge. Rechtsgrundlage ist
          Art. 6 Abs. 1 lit. f DSGVO, das berechtigte Interesse am sicheren Betrieb.
        </p>
        <p>
          Beide Anbieter sitzen in den Vereinigten Staaten. Der Aufruf der Seiten ist damit eine
          Übermittlung in ein Drittland nach Art. 44 ff. DSGVO.
        </p>
        <p className="text-ink-3">
          Auf welcher Grundlage diese Übermittlung erfolgt, muss vor dem Livegang je Anbieter geprüft
          und hier eingetragen werden: [Grundlage der Drittlandübermittlung, Angemessenheitsbeschluss
          oder Standardvertragsklauseln nach Art. 46 DSGVO].
        </p>
      </Section>

      <Section no="3" title="Was dieser Shop im Browser speichert">
        <p>
          Der Shop legt zwei Werte im lokalen Speicher deines Browsers ab (localStorage). Sie bleiben
          auf deinem Gerät, solange du nichts bestellst. Erst mit einer Bestellung wird der Inhalt des
          Warenkorbs zusammen mit deinen Angaben an uns übertragen, damit wir sie ausführen können.
        </p>
        <p>
          Unter dem Schlüssel <code className="font-mono text-[13px]">jing-store</code> stehen der
          Warenkorb, das gewählte Lieferland, die gewählte Ansicht Yin oder Yang und die gewählte
          Sprache Deutsch oder Englisch. Damit findest du deinen Warenkorb und deine Einstellungen
          beim nächsten Aufruf wieder.
        </p>
        <p>
          Unter dem Schlüssel <code className="font-mono text-[13px]">jing-access</code> steht der
          Zugangscode dieser nicht öffentlichen Vorschau. Er wird dort abgelegt, damit du den Code
          nicht bei jedem Aufruf neu eingeben musst.
        </p>
        <p>
          Beide Werte sind für den von dir gewünschten Dienst unbedingt erforderlich. Ein
          Einwilligungsbanner ist dafür nicht nötig, § 25 Abs. 2 Nr. 2 TDDDG für Deutschland und
          § 165 Abs. 3 TKG 2021 für Österreich. Soweit in diesen Werten personenbezogene Daten
          stecken, ist Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO, das berechtigte Interesse an einem
          Warenkorb, der erhalten bleibt, und an einer Vorschau, die den Code nur einmal abfragt.
        </p>
        <p>
          Du kannst beide Werte jederzeit über die Einstellungen deines Browsers löschen. Danach sind
          Warenkorb, Sprache, Ansicht und Lieferland zurückgesetzt und der Zugangscode wird erneut
          abgefragt.
        </p>
      </Section>

      <Section no="4" title="Schriften">
        <p>
          Die drei Schriften dieser Seite werden beim Bau der Seite mitgeliefert und von derselben
          Adresse ausgeliefert wie die Seite selbst. Es geht dabei keine Anfrage an Google oder einen
          anderen fremden Server, und es wird keine IP-Adresse an Dritte übertragen.
        </p>
      </Section>

      <Section no="5" title="Die öffentliche Demo">
        <p>
          Die öffentliche Demo ist ein statischer Export. Hinter der Seite steht kein Server, der
          Bestellungen entgegennimmt. Es entsteht dort keine Bestellung, und es werden keine
          Zahlungsdaten erhoben oder an einen Zahlungsdienstleister übertragen.
        </p>
        <p>
          Die Kasse der Demo rechnet ihr Ergebnis im Browser. Was du dort in die Felder schreibst,
          bleibt in der geöffneten Seite, solange sie geöffnet ist, und wird nirgendwohin gesendet.
          In der Live-Fassung ist das anders: dort gehen die Angaben beim Bestellen an den Server.
        </p>
      </Section>

      <Section no="6" title="Bestellung">
        <p>
          Sobald der Shop wirklich bestellbar ist, verarbeiten wir für eine Bestellung Name,
          Lieferadresse, E-Mail-Adresse und die Angaben zur Zahlung. Rechtsgrundlage ist Art. 6
          Abs. 1 lit. b DSGVO, die Erfüllung des Vertrags. Handels- und steuerrechtliche
          Aufbewahrungsfristen von sechs beziehungsweise zehn Jahren gehen einer Löschung vor.
        </p>
      </Section>

      <Section no="7" title="Empfänger">
        <p>
          Beim Aufruf der Seiten sind die beiden Hoster Empfänger, GitHub, Inc. für die Vorschau und
          Netlify, Inc. für die Live-Adresse. Für eine Bestellung kommen die Stellen hinzu, die zur
          Abwicklung nötig sind: Zahlungsdienstleister und Logistikpartner. Für Lieferungen in die
          Schweiz wird die Adresse zusätzlich an die Zollabfertigung übermittelt.
        </p>
        <p className="text-ink-3">
          Mit jedem dieser Empfänger ist vor dem Livegang ein Vertrag zur Auftragsverarbeitung nach
          Art. 28 DSGVO zu schließen. Geschlossen ist noch keiner.
          Zahlungsdienstleister und Logistikpartner stehen noch nicht fest. Sobald sie feststehen,
          gehören sie namentlich in diese Erklärung, ebenso die Frage, ob eine Übermittlung in ein
          Drittland stattfindet und auf welcher Grundlage.
        </p>
      </Section>

      <Section no="8" title="Speicherdauer">
        <p>
          Die Werte im lokalen Speicher deines Browsers bleiben, bis du sie löschst. Bestelldaten
          bleiben, solange die handels- und steuerrechtlichen Fristen aus Abschnitt 6 laufen, danach
          werden sie gelöscht.
        </p>
        <p className="text-ink-3">
          Wie lange die Hoster ihre Server-Logdaten aufbewahren, richtet sich nach deren eigenen
          Fristen: [Speicherdauer der Server-Logdaten bei GitHub und bei Netlify].
        </p>
      </Section>

      <Section no="9" title="Kein Tracking, kein Profiling">
        <p>
          Dieser Shop setzt keine Analyse-, Marketing- oder Profilbildungs-Dienste ein und bindet
          keine externen Skripte zu diesem Zweck ein. Es werden keine Cookies gesetzt, es sind keine
          Dienste Dritter eingebunden und es werden keine Inhalte von fremden Servern nachgeladen.
          Eine automatisierte Entscheidungsfindung einschließlich Profiling nach Art. 22 DSGVO findet
          nicht statt.
        </p>
        <p>
          Sobald sich daran etwas ändert, braucht es eine Einwilligungslösung vor dem ersten Setzen
          solcher Dienste und eine Ergänzung dieser Erklärung.
        </p>
      </Section>

      <Section no="10" title="Musst du diese Daten angeben">
        <p>
          Zum Ansehen des Shops musst du nichts angeben. Für eine Bestellung sind Name,
          Lieferadresse, E-Mail-Adresse und die Angaben zur Zahlung erforderlich. Ohne sie kommt kein
          Vertrag zustande und wir können nicht liefern. Eine gesetzliche Pflicht, uns diese Daten zu
          geben, besteht nicht.
        </p>
      </Section>

      <Section no="11" title="Deine Rechte">
        <p>
          Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
          Datenübertragbarkeit und Widerspruch, Art. 15 bis 21 DSGVO. Eine erteilte Einwilligung
          kannst du jederzeit mit Wirkung für die Zukunft widerrufen.
        </p>
        <p>
          Außerdem steht dir ein Beschwerderecht bei einer Datenschutz-Aufsichtsbehörde zu, Art. 77
          DSGVO. Du kannst dich an die Behörde an deinem Wohnsitz oder an die für uns zuständige
          Behörde wenden. Für uns zuständig ist die Datenschutz-Aufsichtsbehörde des Bundeslandes, in
          dem wir unseren Sitz haben: [Zuständige Datenschutz-Aufsichtsbehörde].
        </p>
        <p>Für alle Anliegen genügt eine Nachricht an {SITE.email}.</p>
      </Section>
    </LegalShell>
  );
}
