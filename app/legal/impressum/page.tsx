import type { Metadata } from "next";

import { LegalShell, Section } from "@/app/legal/_template-notice";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Anbieterkennzeichnung nach deutschem und österreichischem Recht.",
  robots: { index: false, follow: true },
};

const L = SITE.legalEntity;

export default function ImpressumPage() {
  return (
    <LegalShell title="Impressum" updated="September 2026">
      <p>
        Angaben nach § 5 Digitale-Dienste-Gesetz (DDG), das in Deutschland den früheren § 5 TMG
        abgelöst hat, sowie nach § 5 E-Commerce-Gesetz und § 25 Mediengesetz für Österreich.
      </p>

      <Section no="1" title="Anbieter">
        <p>
          {L.company}
          <br />
          {L.street}
          <br />
          {L.zipCity}
          <br />
          {L.country}
        </p>
        <p>
          Vertreten durch: {L.representative}
          <br />
          Handelsregister: {L.register}
          <br />
          Umsatzsteuer-Identifikationsnummer: {L.vatId}
        </p>
      </Section>

      <Section no="2" title="Kontakt">
        <p>
          E-Mail: {SITE.email}
          <br />
          Telefon: {L.phone}
        </p>
        <p>
          Eine Telefonnummer ist Pflicht, sobald sie im Unternehmen vorhanden ist. Eine reine
          Kontaktformular-Lösung genügt nicht.
        </p>
      </Section>

      <Section no="3" title="Unternehmensgegenstand und Aufsicht">
        <p>
          Gegenstand des Unternehmens ist der Handel mit kosmetischen Mitteln, Duftobjekten und
          Zubehör. Zuständige Aufsichtsbehörde: {L.supervisoryAuthority}.
        </p>
        <p>
          Für den Vertrieb kosmetischer Mittel gilt die Verordnung (EG) Nr. 1223/2009. Die
          verantwortliche Person im Sinne von Artikel 4 dieser Verordnung ist auf jeder
          Produktverpackung genannt.
        </p>
      </Section>

      <Section no="4" title="Streitbeilegung">
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            className="text-ink underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            ec.europa.eu/consumers/odr
          </a>
          .
        </p>
        <p>
          Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </Section>

      <Section no="5" title="Haftung für Inhalte und Links">
        <p>
          Für eigene Inhalte auf diesen Seiten sind wir nach den allgemeinen Gesetzen verantwortlich.
          Für Inhalte externer Links ist der jeweilige Anbieter verantwortlich. Zum Zeitpunkt der
          Verlinkung waren keine Rechtsverstöße erkennbar.
        </p>
      </Section>

      <Section no="6" title="Urheberrecht">
        <p>
          Texte, Gestaltung und Bildsprache dieses Shops unterliegen dem Urheberrecht. Jede
          Verwertung außerhalb der gesetzlich zugelassenen Fälle bedarf unserer Zustimmung.
        </p>
      </Section>
    </LegalShell>
  );
}
