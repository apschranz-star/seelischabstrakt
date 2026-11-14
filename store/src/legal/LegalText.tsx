/* The legal texts of the shop, in German and English, filled from site.json
   (legal, commerce). German is the binding version for an Austrian seller;
   the English text says the same.

   Three things here are not free wording:
   - the withdrawal notice follows the model in Annex I Part A FAGG (the same
     text as Annex I(A) of Directive 2011/83/EU), including its form of
     address, so that the statutory model is used as it stands;
   - the model withdrawal form is Annex I Part B, word for word;
   - the notice on the legal guarantee is the EU's own graphic (lib/notice.ts).

   Nothing in this file is legal advice. What only the seller can supply
   (a postal address, a telephone number) is printed when it is on file and
   left out when it is not; it is never invented. */
import type {ReactNode} from 'react';
import {Heading} from '@astryxdesign/core/Heading';
import {Link} from '@astryxdesign/core/Link';
import {Text} from '@astryxdesign/core/Text';
import {noticeFiles} from '../lib/notice';
import {useShop} from '../lib/shop';
import {useUi} from '../lib/ui';
import type {LegalKind} from '../lib/types';

/** 2026-11-13 → 13.11.2026 / 13 November 2026 */
function stand(iso: string | undefined, lang: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return iso || '';
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.toLocaleDateString(lang === 'de' ? 'de-AT' : 'en-GB', {day: 'numeric', month: lang === 'de' ? '2-digit' : 'long', year: 'numeric', timeZone: 'UTC'});
}

export function LegalText({kind}: {kind: LegalKind}) {
  const {site, t, lang} = useShop();
  const body = {
    imprint: <Imprint />,
    privacy: <Privacy />,
    terms: <Terms />,
    withdrawal: <Withdrawal />,
    shipping: <Shipping />,
    guarantee: <Guarantee />,
    us: <UsBuyers />,
    access: <Access />,
  }[kind];
  return (
    <div className="legal">
      {body}
      <Text as="p" className="meta">
        {t('legal.updated')}: {stand(site.legal?.lastUpdated, lang)}
      </Text>
    </div>
  );
}

/** Name and contact of the seller, as far as they are on file. */
function useSeller() {
  const {site, lang, email} = useShop();
  const g = site.legal || {};
  const de = lang === 'de';
  const name = `${g.legalName || site.brand.artist || ''}${g.tradeName ? ` (${g.tradeName})` : ''}`;
  const country = !de && g.country === 'Österreich' ? 'Austria' : g.country;
  const place = [g.zipCity, country].filter(Boolean).join(', ');
  const oneLine = [name, g.street, place, `${de ? 'E-Mail' : 'email'}: ${email}`, g.phone ? `${de ? 'Tel.' : 'phone'}: ${g.phone}` : '']
    .filter(Boolean)
    .join(', ');
  const block = (
    <address>
      {name}
      {g.street && (
        <>
          <br />
          {g.street}
        </>
      )}
      <br />
      {place}
      <br />
      {de ? 'E-Mail' : 'Email'}: <Link color="inherit" type="inherit" href={`mailto:${email}`}>{email}</Link>
      {g.phone && (
        <>
          <br />
          {de ? 'Tel.' : 'Phone'}: {g.phone}
        </>
      )}
    </address>
  );
  return {g, de, name, place, oneLine, block, email};
}

function Go({to, children}: {to: LegalKind | 'withdraw' | 'contact'; children: ReactNode}) {
  const {open} = useUi();
  const href = to === 'withdraw' ? '#widerruf' : to === 'contact' ? '#message' : `#${to}`;
  return (
    <Link
      color="inherit"
      type="inherit"
      href={href}
      onClick={(e) => {
        e.preventDefault();
        if (to === 'withdraw') open({type: 'withdraw'});
        else if (to === 'contact') open({type: 'contact'});
        else open({type: 'legal', kind: to});
      }}>
      {children}
    </Link>
  );
}

function Imprint() {
  const {site} = useShop();
  const {g, de, block, email} = useSeller();
  const klein = site.commerce?.kleinunternehmer || g.kleinunternehmerNote;
  const adr = g.adrParticipates === true;
  return de ? (
    <>
      <Text as="p">
        {g.street
          ? 'Angaben nach § 5 E-Commerce-Gesetz und Offenlegung nach § 25 Mediengesetz.'
          : 'Offenlegung nach § 25 Mediengesetz.'}
      </Text>
      <Heading level={3}>Medieninhaber, Herausgeber und Verkäufer</Heading>
      {block}
      <Text as="p">
        Nachricht über das Formular: <Go to="contact">Schreib dem Atelier</Go>.
      </Text>
      <Text as="p">Unternehmensgegenstand: Bildende Kunst, Verkauf eigener Werke und Kunstdrucke.</Text>
      <Text as="p">Grundlegende Richtung: Darstellung und Verkauf der eigenen künstlerischen Arbeiten.</Text>
      {g.uid && <Text as="p">UID-Nummer: {g.uid}</Text>}
      {klein && <Text as="p">Kleinunternehmer gemäß § 6 Abs 1 Z 27 UStG, es wird keine Umsatzsteuer ausgewiesen.</Text>}
      {g.regulator && <Text as="p">Aufsichtsbehörde: {g.regulator}</Text>}
      {g.chamber && <Text as="p">Mitglied bei: {g.chamber}</Text>}
      <Heading level={3}>Wenn etwas nicht passt</Heading>
      <Text as="p">
        Schreib uns zuerst direkt: <Link color="inherit" type="inherit" href={`mailto:${email}`}>{email}</Link>. Eine staatlich anerkannte
        Schlichtungsstelle für online geschlossene Verträge ist die Internet Ombudsstelle,{' '}
        <Link color="inherit" type="inherit" isExternalLink href="https://www.ombudsstelle.at/">
          www.ombudsstelle.at
        </Link>
        .{' '}
        {adr
          ? 'Wir nehmen an Schlichtungsverfahren vor dieser Stelle teil.'
          : 'Zur Teilnahme an einem Schlichtungsverfahren sind wir nicht verpflichtet; ob wir teilnehmen, entscheiden wir im Einzelfall.'}
      </Text>
      <Heading level={3}>Urheberrecht</Heading>
      <Text as="p">
        Alle abgebildeten Werke sind urheberrechtlich geschützt. Der Kauf eines Originals oder eines Drucks
        überträgt kein Nutzungsrecht und kein Vervielfältigungsrecht.
      </Text>
    </>
  ) : (
    <>
      <Text as="p">
        {g.street
          ? 'Information under § 5 Austrian E-Commerce Act (ECG) and disclosure under § 25 Austrian Media Act.'
          : 'Disclosure under § 25 Austrian Media Act.'}
      </Text>
      <Heading level={3}>Media owner, publisher and seller</Heading>
      {block}
      <Text as="p">
        Message through the form: <Go to="contact">Write to the studio</Go>.
      </Text>
      <Text as="p">Business: visual art, sale of own works and art prints.</Text>
      <Text as="p">Editorial line: presentation and sale of the artist's own work.</Text>
      {g.uid && <Text as="p">VAT ID: {g.uid}</Text>}
      {klein && <Text as="p">Small business under § 6 (1) 27 Austrian VAT Act; no VAT is shown.</Text>}
      {g.regulator && <Text as="p">Supervisory authority: {g.regulator}</Text>}
      {g.chamber && <Text as="p">Member of: {g.chamber}</Text>}
      <Heading level={3}>If something is wrong</Heading>
      <Text as="p">
        Write to us first: <Link color="inherit" type="inherit" href={`mailto:${email}`}>{email}</Link>. A state-recognised dispute resolution body
        for contracts concluded online is the Internet Ombudsstelle,{' '}
        <Link color="inherit" type="inherit" isExternalLink href="https://www.ombudsstelle.at/">
          www.ombudsstelle.at
        </Link>
        .{' '}
        {adr
          ? 'We take part in proceedings before this body.'
          : 'We are not obliged to take part in such proceedings and decide case by case whether we do.'}
      </Text>
      <Heading level={3}>Copyright</Heading>
      <Text as="p">
        All works shown are protected by copyright. Buying an original or a print transfers no right of use and
        no right of reproduction.
      </Text>
    </>
  );
}

function Privacy() {
  const {site} = useShop();
  const {g, de, block, email} = useSeller();
  const c = site.commerce || {};
  const payment = g.payment || 'Revolut';
  const analytics = c.analytics?.enabled;
  return de ? (
    <>
      <Heading level={3}>Verantwortlich</Heading>
      {block}
      <Text as="p">Ein Datenschutzbeauftragter ist nicht bestellt. Fragen zum Datenschutz beantworten wir unter derselben Adresse.</Text>

      <Heading level={3}>Was wir verarbeiten und warum</Heading>
      <ul>
        <li>
          <b>Aufruf der Seite:</b> Der Shop liegt bei Netlify, eine Kopie des Katalogs ohne Bestellfunktion bei
          GitHub Pages. Beide Anbieter protokollieren beim Aufruf Serverdaten: IP-Adresse, Zeitpunkt, aufgerufene
          Datei und die Angaben deines Browsers. Das ist nötig, damit die Seite ausgeliefert wird und Störungen und
          Angriffe erkannt werden. Rechtsgrundlage: Art 6 Abs 1 lit f DSGVO, unser berechtigtes Interesse am
          sicheren Betrieb. Wir werten diese Protokolle nicht aus.
        </li>
        <li>
          <b>Schriften, Texte und Bilder:</b> Schriften, Programmcode, Inhalte und Fotos liegen auf derselben
          Adresse wie die Seite und werden von dort geladen. Von dieser Seite geht keine Anfrage an Google oder
          einen anderen fremden Server.
        </li>
        <li>
          <b>Sprachwahl:</b> Deine Sprache legen wir im lokalen Speicher deines Browsers ab (Schlüssel
          „sa-lang“), damit die Seite beim nächsten Besuch in derselben Sprache öffnet. Der Wert bleibt auf deinem
          Gerät. Das ist für die von dir gewählte Einstellung technisch nötig (§ 165 Abs 3 TKG 2021); eine
          Einwilligung braucht es dafür nicht.
        </li>
        <li>
          <b>Bestellung:</b> Das Bestellformular übermittelt Bestellnummer, Datum, Werk, Variante, Preis,
          Versandkosten, Gesamtbetrag, Name, E-Mail-Adresse, Lieferadresse, Land, deine Nachricht und die
          gewählte Sprache an den Formulardienst von Netlify. Er speichert die Angaben und meldet die Bestellung
          an unser Postfach. Zweck ist der Kaufvertrag und seine Abwicklung, Rechtsgrundlage Art 6 Abs 1 lit b
          DSGVO. Gelingt die Übermittlung nicht, kannst du die Bestellung per E-Mail senden.
        </li>
        <li>
          <b>Zahlung:</b> Die Zahlung läuft nicht über diese Seite. Nach der Bestellung zeigen wir dir einen
          Zahlungslink von {payment}. Der Link trägt Betrag und Währung; die Bestellnummer gibst du selbst als
          Verwendungszweck an. Erst dein Klick führt dich dorthin, dann gilt die Datenschutzerklärung dieses
          Anbieters.
        </li>
        <li>
          <b>Widerruf:</b> Über „Vertrag widerrufen“ übermittelst du Name, Bestellnummer, die E-Mail-Adresse für
          die Eingangsbestätigung, gegebenenfalls den betroffenen Teil der Bestellung und den Zeitpunkt, wieder
          über den Formulardienst. Wir brauchen das, um deinen Widerruf zu bearbeiten und seinen Eingang zu
          bestätigen. Rechtsgrundlage: Art 6 Abs 1 lit c DSGVO in Verbindung mit § 13a FAGG.
        </li>
        <li>
          <b>Nachricht an uns:</b> Das Kontaktformular übermittelt Name, E-Mail-Adresse, Betreff und Nachricht über
          denselben Formulardienst; eine E-Mail liegt im Postfach unseres E-Mail-Anbieters. Wir verwenden die
          Angaben, um zu antworten. Rechtsgrundlage: Art 6 Abs 1 lit b DSGVO bei Fragen zu einem Kauf, sonst Art 6
          Abs 1 lit f DSGVO.
        </li>
        <li>
          <b>Benachrichtigung über neue Werke:</b> Trägst du dich ein, speichern wir deine E-Mail-Adresse, die
          Sprache sowie Wortlaut und Zeitpunkt deiner Einwilligung. Zweck ist allein diese Benachrichtigung,
          Rechtsgrundlage deine Einwilligung (Art 6 Abs 1 lit a DSGVO). Eine formlose E-Mail genügt, um sie zu
          widerrufen.
        </li>
        <li>
          <b>Instagram:</b> Auf der Seite steht ein gewöhnlicher Link zu unserem Profil, kein eingebetteter Inhalt.
          Beim Laden der Seite geht nichts an Instagram.
        </li>
        <li>
          <b>Analyse und Werbung:</b>{' '}
          {analytics
            ? `Wir setzen ${c.analytics?.provider} nur nach deiner Einwilligung über das Banner ein (Art 6 Abs 1 lit a DSGVO, § 165 Abs 3 TKG 2021).`
            : 'Wir setzen keine Analyse, kein Tracking, keine Werbung und keine Cookies ein. Deshalb erscheint auch kein Einwilligungsbanner.'}
        </li>
      </ul>

      <Heading level={3}>Wer die Daten bekommt</Heading>
      <Text as="p">
        Netlify, Inc., 101 2nd Street, San Francisco, CA 94105, USA: Auslieferung der Seite und Formulardienst,
        als unser Auftragsverarbeiter. GitHub, Inc., San Francisco, USA, und GitHub B.V., Amsterdam: Auslieferung
        der Katalogkopie. {payment}: Zahlungsdienst, als eigener Verantwortlicher. Unser E-Mail-Anbieter, bei dem
        das Postfach liegt. Wird dein Werk versendet, bekommt das Transportunternehmen Name und Lieferadresse.
        Rechnungen legen wir der Finanzverwaltung vor, wenn sie das verlangt. Sonst geben wir nichts weiter, und
        wir verkaufen keine Daten.
      </Text>

      <Heading level={3}>Übermittlung in die USA</Heading>
      <Text as="p">
        Netlify und GitHub sitzen in den USA; schon der Aufruf der Seite ist damit eine Übermittlung in ein
        Drittland. Mit Netlify besteht ein Auftragsverarbeitungsvertrag, der Bestandteil der Nutzungsbedingungen
        ist. Netlify und GitHub erklären, nach dem EU-U.S. Data Privacy Framework zertifiziert zu sein
        (Angemessenheitsbeschluss der Europäischen Kommission vom 10. Juli 2023), und verwenden zusätzlich die
        Standardvertragsklauseln der Europäischen Kommission (Durchführungsbeschluss (EU) 2021/914). Eine Kopie
        dieser Garantien bekommst du bei den Anbietern oder auf Anfrage bei uns.
      </Text>

      <Heading level={3}>Wie lange wir speichern</Heading>
      <Text as="p">
        Die Server-Protokolle entstehen bei den Anbietern und werden nach deren Fristen gelöscht. Bestell- und
        Rechnungsdaten bewahren wir sieben Jahre auf (§ 132 BAO). Einträge beim Formulardienst löschen wir,
        sobald sie in unsere Unterlagen übernommen sind. Anfragen ohne Vertrag löschen wir, wenn sie erledigt
        sind. Deine Adresse für die Benachrichtigung bleibt gespeichert, bis du die Einwilligung widerrufst.
      </Text>

      <Heading level={3}>Musst du die Daten angeben</Heading>
      <Text as="p">
        Zum Ansehen der Seite musst du nichts angeben. Name, E-Mail-Adresse, Lieferadresse und Land brauchen wir
        für den Kauf; ohne sie können wir den Vertrag nicht erfüllen. Alles andere ist freiwillig.
      </Text>

      <Heading level={3}>Deine Rechte</Heading>
      <Text as="p">
        Du hast das Recht auf Auskunft (Art 15), Berichtigung (Art 16), Löschung (Art 17), Einschränkung (Art
        18), Datenübertragbarkeit (Art 20) und Widerspruch (Art 21 DSGVO). Eine Einwilligung kannst du jederzeit
        mit Wirkung für die Zukunft widerrufen. Anfragen an <Link color="inherit" type="inherit" href={`mailto:${email}`}>{email}</Link>.
      </Text>
      <Text as="p">
        Du kannst dich bei einer Aufsichtsbehörde beschweren. Für uns zuständig ist die Österreichische
        Datenschutzbehörde, Barichgasse 40-42, 1030 Wien, dsb@dsb.gv.at.
      </Text>
      <Text as="p">Es findet keine automatisierte Entscheidungsfindung und kein Profiling statt (Art 22 DSGVO).</Text>

      <Heading level={3}>Kinder</Heading>
      <Text as="p">Diese Seite richtet sich nicht an Kinder unter 16 Jahren. Wir erheben wissentlich keine Daten von ihnen.</Text>
    </>
  ) : (
    <>
      <Heading level={3}>Controller</Heading>
      {block}
      <Text as="p">No data protection officer is appointed. Questions about data protection reach us at the same address.</Text>

      <Heading level={3}>What we process and why</Heading>
      <ul>
        <li>
          <b>Visiting the site:</b> the shop is hosted by Netlify; a copy of the catalogue without the order
          function is hosted by GitHub Pages. Both record server data on each request: IP address, time, file
          requested and the details your browser sends. This is needed to deliver the site and to spot faults and
          attacks. Legal basis: Art 6 (1) f GDPR, our legitimate interest in secure operation. We do not analyse
          these logs.
        </li>
        <li>
          <b>Fonts, text and images:</b> fonts, program code, content and photos sit on the same address as the
          site and are loaded from there. From this page no request goes to Google or to any other outside server.
        </li>
        <li>
          <b>Language choice:</b> we store your language in your browser (key "sa-lang") so the site opens in the
          same language next time. The value stays on your device. It is technically necessary for the setting you
          chose (§ 165 (3) Austrian Telecommunications Act 2021); no consent is needed for it.
        </li>
        <li>
          <b>Order:</b> the order form sends order number, date, work, variant, price, shipping, total, name,
          email address, delivery address, country, your message and the chosen language to Netlify's form
          service. It stores the entries and notifies our mailbox. The purpose is the contract of sale and its
          handling, legal basis Art 6 (1) b GDPR. If the transfer fails, you can send the order by email.
        </li>
        <li>
          <b>Payment:</b> payment does not run through this site. After you order, we show you a payment link from{' '}
          {payment}. The link carries the amount and the currency; you enter the order number yourself as the
          reference. Only your click takes you there, and that provider's own privacy policy applies from then on.
        </li>
        <li>
          <b>Withdrawal:</b> through "Withdraw from contract" you send your name, the order number, the email
          address for the acknowledgement of receipt, the part of the order concerned if any, and the time, again
          through the form service. We need this to handle your withdrawal and to confirm its receipt. Legal basis:
          Art 6 (1) c GDPR together with § 13a FAGG.
        </li>
        <li>
          <b>Message to us:</b> the contact form sends name, email address, subject and message through the same
          form service; an email sits in the mailbox of our email provider. We use the details to reply. Legal
          basis: Art 6 (1) b GDPR for questions about a purchase, otherwise Art 6 (1) f GDPR.
        </li>
        <li>
          <b>Notification about new works:</b> if you sign up, we store your email address, the language, and the
          wording and time of your consent. The purpose is this notification only, the legal basis your consent
          (Art 6 (1) a GDPR). A plain email is enough to withdraw it.
        </li>
        <li>
          <b>Instagram:</b> the page holds a plain link to our profile, not embedded content. Nothing goes to
          Instagram while the page loads.
        </li>
        <li>
          <b>Analytics and advertising:</b>{' '}
          {analytics
            ? `we use ${c.analytics?.provider} only with your consent given through the banner (Art 6 (1) a GDPR).`
            : 'we use no analytics, no tracking, no advertising and no cookies. That is why no consent banner appears.'}
        </li>
      </ul>

      <Heading level={3}>Who receives the data</Heading>
      <Text as="p">
        Netlify, Inc., 101 2nd Street, San Francisco, CA 94105, USA: delivery of the site and the form service,
        as our processor. GitHub, Inc., San Francisco, USA, and GitHub B.V., Amsterdam: delivery of the catalogue
        copy. {payment}: payment service, as its own controller. Our email provider, which holds the mailbox. If
        your work is shipped, the carrier receives your name and delivery address. We present invoices to the tax
        authority if it asks. Nothing else is passed on, and we sell no data.
      </Text>

      <Heading level={3}>Transfers to the United States</Heading>
      <Text as="p">
        Netlify and GitHub are based in the United States, so even visiting the site is a transfer to a third
        country. A data processing agreement with Netlify is in place; it is part of its terms of service.
        Netlify and GitHub state that they are certified under the EU-U.S. Data Privacy Framework (adequacy
        decision of the European Commission of 10 July 2023) and additionally use the European Commission's
        standard contractual clauses (Implementing Decision (EU) 2021/914). You can get a copy of these
        safeguards from the providers or from us on request.
      </Text>

      <Heading level={3}>How long we keep data</Heading>
      <Text as="p">
        Server logs are created at the providers and deleted on their schedules. We keep order and invoice data
        for seven years (§ 132 Austrian Federal Fiscal Code). Entries at the form service are deleted once they
        are in our records. Enquiries without a contract are deleted once they are dealt with. Your address for
        the notification stays stored until you withdraw your consent.
      </Text>

      <Heading level={3}>Do you have to provide the data</Heading>
      <Text as="p">
        To look at the site you provide nothing. We need name, email address, delivery address and country for a
        purchase; without them we cannot perform the contract. Everything else is voluntary.
      </Text>

      <Heading level={3}>Your rights</Heading>
      <Text as="p">
        You have the right of access (Art 15), rectification (Art 16), erasure (Art 17), restriction (Art 18),
        data portability (Art 20) and objection (Art 21 GDPR). You may withdraw a consent at any time for the
        future. Requests to <Link color="inherit" type="inherit" href={`mailto:${email}`}>{email}</Link>.
      </Text>
      <Text as="p">
        You may complain to a supervisory authority. Ours is the Austrian Data Protection Authority
        (Datenschutzbehörde), Barichgasse 40-42, 1030 Vienna, dsb@dsb.gv.at.
      </Text>
      <Text as="p">There is no automated decision-making and no profiling (Art 22 GDPR).</Text>

      <Heading level={3}>Buyers in the United States</Heading>
      <Text as="p">
        We do not sell or share personal information and use no targeted advertising. To know, delete or correct
        your data, email {email}. We reply within 45 days and treat nobody differently for using these rights.
      </Text>

      <Heading level={3}>Children</Heading>
      <Text as="p">This site is not directed at children under 16. We do not knowingly collect data from them.</Text>
    </>
  );
}

function Terms() {
  const {site} = useShop();
  const {g, de, block} = useSeller();
  const c = site.commerce || {};
  const klein = c.kleinunternehmer || g.kleinunternehmerNote;
  const days = c.deliveryDays || {};
  const dOrig = days.original ?? 10;
  const dPrint = days.print ?? 10;
  const hours = c.payment?.confirmationHours || 48;
  const payment = g.payment || 'Revolut';
  const regions = (c.shipRegions || []).join(', ');
  return de ? (
    <>
      <Heading level={3}>1. Vertragspartner</Heading>
      {block}
      <Heading level={3}>2. So kommt der Vertrag zustande</Heading>
      <Text as="p">
        Die Darstellung der Werke ist kein bindendes Angebot. Du bestellst in drei Schritten: Angaben eintragen,
        Bestellung prüfen, bestellen. Bis zum letzten Schritt kannst du alles mit „Angaben ändern“ korrigieren.
        Mit dem Knopf „Zahlungspflichtig bestellen“ gibst du ein verbindliches Angebot ab. Den Eingang bestätigen
        wir sofort am Bildschirm.
      </Text>
      <Text as="p">
        Der Vertrag kommt zustande, wenn wir deine Bestellung per E-Mail annehmen, in der Regel binnen {hours}{' '}
        Stunden. Nehmen wir sie nicht an, etwa weil ein Original inzwischen vergeben ist, erstatten wir eine
        bereits geleistete Zahlung sofort. Bei Anfragen per E-Mail kommt der Vertrag mit unserer Annahme per
        E-Mail zustande.
      </Text>
      <Text as="p">
        Vertragssprachen sind Deutsch und Englisch. Den Vertragstext, also deine Bestellung und diese AGB,
        speichern wir und senden ihn dir mit der Bestätigung. Diese AGB kannst du hier jederzeit abrufen,
        drucken und speichern.
      </Text>
      <Heading level={3}>3. Preise und Zahlung</Heading>
      <Text as="p">
        {klein
          ? 'Alle Preise sind Endpreise in EUR; als Kleinunternehmer weisen wir keine Umsatzsteuer aus (§ 6 Abs 1 Z 27 UStG).'
          : `Alle Preise in EUR inklusive gesetzlicher Umsatzsteuer (${c.vatOriginals} % Originale, ${c.vatPrints} % Drucke).`}{' '}
        Die Versandkosten siehst du vor der Bestellung. Bezahlt wird per Überweisung über einen Zahlungslink von{' '}
        {payment}, mit der Bestellnummer als Verwendungszweck. Versandt wird nach Zahlungseingang. Bei
        Auftragsarbeiten sind 30 % als Anzahlung fällig, der Rest bei Freigabe.
      </Text>
      <Heading level={3}>4. Lieferung</Heading>
      <Text as="p">
        Originale verlassen das Atelier binnen {dOrig} Werktagen nach Zahlungseingang, Editionen binnen {dPrint}{' '}
        Werktagen, Auftragsarbeiten nach Vereinbarung. Wir liefern nach {regions}; andere Länder auf Anfrage. Bei
        Lieferungen außerhalb der EU können Zoll und Einfuhrabgaben anfallen, die du trägst. Abholung in Wien ist
        nach Vereinbarung möglich.
      </Text>
      <Heading level={3}>5. Widerrufsrecht</Heading>
      <Text as="p">
        Als Verbraucher kannst du den Kauf eines Originals oder einer Edition binnen 14 Tagen ab Erhalt
        widerrufen. Die Einzelheiten und das Formular stehen in der{' '}
        <Go to="withdrawal">Widerrufsbelehrung</Go>. Online geht es mit <Go to="withdraw">Vertrag widerrufen</Go>.
        Ausgenommen sind Auftragsarbeiten, die nach deinen Vorgaben angefertigt werden (§ 18 Abs 1 Z 3 FAGG).
      </Text>
      <Heading level={3}>6. Gewährleistung</Heading>
      <Text as="p">
        Es gilt das gesetzliche Gewährleistungsrecht, mindestens zwei Jahre ab Übergabe. Die Mitteilung der
        Europäischen Union dazu findest du unter <Go to="guarantee">Gesetzliche Gewährleistung</Go>. Eine
        zusätzliche Garantie geben wir nicht. Farbabweichungen zwischen Bildschirm und Original sind kein Mangel;
        Editionen sind handsigniert und können minimal voneinander abweichen.
      </Text>
      <Heading level={3}>7. Eigentum und Urheberrecht</Heading>
      <Text as="p">
        Das Werk bleibt bis zur vollständigen Zahlung unser Eigentum. Urheber- und Verwertungsrechte bleiben beim
        Künstler; der Kauf überträgt kein Recht, das Werk zu vervielfältigen. Der Künstler darf das Werk weiterhin
        abbilden.
      </Text>
      <Heading level={3}>8. Recht und Beschwerden</Heading>
      <Text as="p">
        Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts. Bist du Verbraucher, bleiben die
        zwingenden Bestimmungen des Staates, in dem du lebst, davon unberührt. Beschwerden richtest du an die
        Adresse oben; die Angaben zur Schlichtung stehen im <Go to="imprint">Impressum</Go>.
      </Text>
    </>
  ) : (
    <>
      <Heading level={3}>1. Seller</Heading>
      {block}
      <Heading level={3}>2. How the contract is formed</Heading>
      <Text as="p">
        The display of works is not a binding offer. You order in three steps: enter your details, check the
        order, place it. Until the last step you can correct everything with "Change details". With the button
        "Order with obligation to pay" you make a binding offer. We confirm its receipt on screen at once.
      </Text>
      <Text as="p">
        The contract is formed when we accept your order by email, usually within {hours} hours. If we do not
        accept it, for example because an original has been sold in the meantime, we refund any payment already
        made at once. For enquiries by email the contract is formed when we accept by email.
      </Text>
      <Text as="p">
        The contract can be concluded in German or English. We store the text of the contract, that is your order
        and these terms, and send it to you with the confirmation. You can read, print and save these terms here
        at any time.
      </Text>
      <Heading level={3}>3. Prices and payment</Heading>
      <Text as="p">
        {klein
          ? 'All prices are final prices in EUR; as a small business we show no VAT (§ 6 (1) 27 Austrian VAT Act).'
          : `All prices in EUR including Austrian VAT (${c.vatOriginals} % originals, ${c.vatPrints} % prints).`}{' '}
        You see the shipping cost before you order. Payment is by transfer through a payment link from {payment},
        with the order number as reference. The work ships once payment is received. Commissions: 30 % deposit,
        balance on approval.
      </Text>
      <Heading level={3}>4. Delivery</Heading>
      <Text as="p">
        Originals leave the studio within {dOrig} working days of payment, editions within {dPrint} working days,
        commissions as agreed. We deliver to {regions}; other countries on request. Deliveries outside the EU may
        attract customs duties and import taxes, which you bear. Collection in Vienna is possible by arrangement.
      </Text>
      <Heading level={3}>5. Right of withdrawal</Heading>
      <Text as="p">
        As a consumer you may withdraw from the purchase of an original or an edition within 14 days of receiving
        it. The details and the form are in the <Go to="withdrawal">withdrawal notice</Go>. Online it works with{' '}
        <Go to="withdraw">Withdraw from contract</Go>. Commissions made to your specification are excluded
        (§ 18 (1) 3 FAGG, Art 16 (c) of Directive 2011/83/EU).
      </Text>
      <Heading level={3}>6. Legal guarantee</Heading>
      <Text as="p">
        The statutory warranty applies, at least two years from delivery. The European Union's notice on it is
        under <Go to="guarantee">Legal guarantee</Go>. We give no additional commercial guarantee. Colour
        differences between screen and original are not a defect; editions are signed by hand and may vary
        minimally.
      </Text>
      <Heading level={3}>7. Ownership and copyright</Heading>
      <Text as="p">
        The work remains our property until it is paid in full. Copyright and reproduction rights remain with the
        artist; the purchase transfers no right to reproduce the work. The artist may continue to show images of
        it.
      </Text>
      <Heading level={3}>8. Law and complaints</Heading>
      <Text as="p">
        Austrian law applies, excluding the UN Sales Convention. If you are a consumer, the mandatory provisions
        of the country you live in remain unaffected. Send complaints to the address above; the information on
        dispute resolution is in the <Go to="imprint">imprint</Go>.
      </Text>
    </>
  );
}

function Withdrawal() {
  const {de, oneLine, name, email} = useSeller();
  const url = `${location.origin}${location.pathname}#widerruf`;
  return de ? (
    <>
      <Text as="p">
        Die folgende Belehrung gilt für Verbraucher. Sie folgt dem gesetzlichen Muster und verwendet deshalb
        dessen Anrede.
      </Text>
      <Heading level={3}>Widerrufsrecht</Heading>
      <Text as="p">
        Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die
        Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der
        nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.
      </Text>
      <Text as="p">
        Um Ihr Widerrufsrecht auszuüben, müssen Sie uns ({oneLine}) mittels einer eindeutigen Erklärung (z. B. ein
        mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen,
        informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht
        vorgeschrieben ist.
      </Text>
      <Text as="p">
        Sie können Ihr Widerrufsrecht auch online ausüben: mit der Funktion{' '}
        <Go to="withdraw">Vertrag widerrufen</Go>, die am Fuß jeder Seite dieses Shops steht ({url}). Machen Sie
        von dieser Möglichkeit Gebrauch, so werden wir Ihnen unverzüglich auf einem dauerhaften Datenträger (z. B.
        per E-Mail) eine Bestätigung über den Eingang eines solchen Widerrufs übermitteln.
      </Text>
      <Text as="p">
        Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des
        Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
      </Text>
      <Heading level={3}>Folgen des Widerrufs</Heading>
      <Text as="p">
        Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben,
        einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie
        eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben),
        unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über
        Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe
        Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde
        ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte
        berechnet. Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis
        Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere
        Zeitpunkt ist.
      </Text>
      <Text as="p">
        Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem
        Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu übergeben. Die
        Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden. Sie tragen die
        unmittelbaren Kosten der Rücksendung der Waren. Sie müssen für einen etwaigen Wertverlust der Waren nur
        aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und
        Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.
      </Text>
      <Heading level={3}>Wohin zurück</Heading>
      <Text as="p">
        Die Anschrift für die Rücksendung steht auf dem Paket, in dem das Werk gekommen ist, und in unserer
        Eingangsbestätigung zu Ihrem Widerruf. Bitte verpacken Sie das Werk so, wie es angekommen ist.
      </Text>
      <Heading level={3}>Kein Widerrufsrecht</Heading>
      <Text as="p">
        Das Widerrufsrecht besteht nicht bei Verträgen über Waren, die nach Kundenspezifikationen angefertigt
        werden oder eindeutig auf die persönlichen Bedürfnisse zugeschnitten sind (§ 18 Abs 1 Z 3 FAGG). Das
        betrifft Auftragsarbeiten. Bestehende Originale und Editionen fallen nicht darunter.
      </Text>
      <Heading level={3}>Muster-Widerrufsformular</Heading>
      <div className="model">
        <Text as="p">(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)</Text>
        <Text as="p">
          An {name}, {email}:
        </Text>
        <Text as="p">
          Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden
          Waren (*)/die Erbringung der folgenden Dienstleistung (*)
        </Text>
        <Text as="p">Bestellt am (*)/erhalten am (*)</Text>
        <Text as="p">Name des/der Verbraucher(s)</Text>
        <Text as="p">Anschrift des/der Verbraucher(s)</Text>
        <Text as="p">Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)</Text>
        <Text as="p">Datum</Text>
        <Text as="p">(*) Unzutreffendes streichen.</Text>
      </div>
    </>
  ) : (
    <>
      <Text as="p">This notice applies to consumers. It follows the model text of the law.</Text>
      <Heading level={3}>Right of withdrawal</Heading>
      <Text as="p">
        You have the right to withdraw from this contract within 14 days without giving any reason. The withdrawal
        period will expire after 14 days from the day on which you acquire, or a third party other than the carrier
        and indicated by you acquires, physical possession of the goods.
      </Text>
      <Text as="p">
        To exercise the right of withdrawal, you must inform us ({oneLine}) of your decision to withdraw from this
        contract by an unequivocal statement (e.g. a letter sent by post or e-mail). You may use the attached
        model withdrawal form, but it is not obligatory.
      </Text>
      <Text as="p">
        You can also exercise your right of withdrawal online: with the function{' '}
        <Go to="withdraw">Withdraw from contract</Go> at the foot of every page of this shop ({url}). If you use
        this option, we will communicate to you an acknowledgement of receipt of such a withdrawal on a durable
        medium (e.g. by e-mail) without delay.
      </Text>
      <Text as="p">
        To meet the withdrawal deadline, it is sufficient for you to send your communication concerning your
        exercise of the right of withdrawal before the withdrawal period has expired.
      </Text>
      <Heading level={3}>Effects of withdrawal</Heading>
      <Text as="p">
        If you withdraw from this contract, we shall reimburse to you all payments received from you, including
        the costs of delivery (with the exception of the supplementary costs resulting from your choice of a type
        of delivery other than the least expensive type of standard delivery offered by us), without undue delay
        and in any event not later than 14 days from the day on which we are informed about your decision to
        withdraw from this contract. We will carry out such reimbursement using the same means of payment as you
        used for the initial transaction, unless you have expressly agreed otherwise; in any event, you will not
        incur any fees as a result of such reimbursement. We may withhold reimbursement until we have received the
        goods back or you have supplied evidence of having sent back the goods, whichever is the earliest.
      </Text>
      <Text as="p">
        You shall send back the goods or hand them over to us, without undue delay and in any event not later than
        14 days from the day on which you communicate your withdrawal from this contract to us. The deadline is
        met if you send back the goods before the period of 14 days has expired. You will have to bear the direct
        cost of returning the goods. You are only liable for any diminished value of the goods resulting from the
        handling other than what is necessary to establish the nature, characteristics and functioning of the
        goods.
      </Text>
      <Heading level={3}>Where to send it</Heading>
      <Text as="p">
        The address for the return is on the parcel the work came in and in our acknowledgement of your
        withdrawal. Please pack the work the way it arrived.
      </Text>
      <Heading level={3}>No right of withdrawal</Heading>
      <Text as="p">
        There is no right of withdrawal for goods made to the consumer's specifications or clearly personalised
        (§ 18 (1) 3 FAGG, Art 16 (c) of Directive 2011/83/EU). This concerns commissions. Existing originals and
        editions are not affected.
      </Text>
      <Heading level={3}>Model withdrawal form</Heading>
      <div className="model">
        <Text as="p">(Complete and return this form only if you wish to withdraw from the contract.)</Text>
        <Text as="p">
          To {name}, {email}:
        </Text>
        <Text as="p">
          I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract of sale of the following
          goods (*)/for the provision of the following service (*),
        </Text>
        <Text as="p">Ordered on (*)/received on (*),</Text>
        <Text as="p">Name of consumer(s),</Text>
        <Text as="p">Address of consumer(s),</Text>
        <Text as="p">Signature of consumer(s) (only if this form is notified on paper),</Text>
        <Text as="p">Date</Text>
        <Text as="p">(*) Delete as appropriate.</Text>
      </div>
    </>
  );
}

function Shipping() {
  const {site, L} = useShop();
  const {g, de} = useSeller();
  const c = site.commerce || {};
  const klein = c.kleinunternehmer || g.kleinunternehmerNote;
  return (
    <>
      <Text as="p">{L(c.shippingNote)}</Text>
      <Text as="p">
        {de
          ? 'Originale werden gerahmt und versichert verschickt, Editionen flach mit Schutzkarton. Die Sendungsnummer kommt per E-Mail. Abholung in Wien nach Vereinbarung.'
          : 'Originals ship framed and insured; editions ship flat with protective board. The tracking number comes by email. Collection in Vienna by arrangement.'}
      </Text>
      <Heading level={3}>{de ? 'Steuern' : 'Taxes'}</Heading>
      <Text as="p">
        {de
          ? klein
            ? 'Preise sind Endpreise ohne gesondert ausgewiesene Umsatzsteuer (Kleinunternehmer, § 6 Abs 1 Z 27 UStG).'
            : `In Österreich gilt der ermäßigte Satz von ${c.vatOriginals} % für Originale und ${c.vatPrints} % für Drucke.`
          : klein
            ? 'Prices are final and carry no separately stated VAT (small business exemption, § 6 (1) 27 Austrian VAT Act).'
            : `Austria applies the reduced rate of ${c.vatOriginals} % to original artworks and ${c.vatPrints} % to prints.`}{' '}
        {de
          ? 'Außerhalb der EU erhebt das Transportunternehmen Zoll und Einfuhrabgaben bei der Zustellung; sie sind im Preis nicht enthalten.'
          : 'Outside the EU the carrier collects customs duties and import taxes on delivery; they are not included in the price.'}
      </Text>
    </>
  );
}

/** The EU notice itself. It is shown as the Commission publishes it; the
    same wording stands below it as text for screen readers and for anyone
    who cannot read the image. */
function Guarantee() {
  const {t, lang} = useShop();
  const notice = noticeFiles(lang);
  const de = lang === 'de';
  return (
    <>
      <Text as="p">{t('guarantee.lead')}</Text>
      <img className="notice-full" src={notice.full} alt={t('guarantee.alt')} width={794} height={1123} />
      <Text as="p">
        <Link color="inherit" type="inherit" isExternalLink href={notice.file}>
          {t('guarantee.download')}
        </Link>
        {' · '}
        <Link color="inherit" type="inherit" isExternalLink href={de ? 'https://europa.eu/youreurope/garantien' : 'https://europa.eu/youreurope/guarantees'}>
          {de ? 'europa.eu/youreurope/garantien' : 'europa.eu/youreurope/guarantees'}
        </Link>
      </Text>
      <Text as="p">
        {de
          ? 'Eine gewerbliche Haltbarkeitsgarantie des Herstellers gibt es für die Werke in diesem Shop nicht; es gilt die gesetzliche Gewährleistung.'
          : 'There is no commercial guarantee of durability for the works in this shop; the legal guarantee applies.'}
      </Text>
    </>
  );
}

function UsBuyers() {
  const {site, L} = useShop();
  const {email} = useSeller();
  return (
    <>
      <Text as="p">{L(site.commerce?.usNote)}</Text>
      <Heading level={3}>Sales tax</Heading>
      <Text as="p">
        We are a small Austrian seller without physical or economic nexus in any US state, so no US sales or use
        tax is collected. Depending on your state you may owe use tax on the purchase; we provide any invoice
        needed.
      </Text>
      <Heading level={3}>Customs</Heading>
      <Text as="p">
        Import duties, taxes and carrier fees on delivery are the buyer's responsibility. Which duties apply
        depends on the rules in force when the parcel arrives; please check with US Customs and Border Protection
        or your carrier before ordering.
      </Text>
      <Heading level={3}>Returns</Heading>
      <Text as="p">
        We extend the 14-day right of withdrawal described in the withdrawal notice to buyers in the United
        States as a voluntary policy. If a work arrives damaged, write to {email} within 7 days with photos and we
        replace or refund. Nothing here limits rights you have under your state's law.
      </Text>
      <Heading level={3}>Privacy</Heading>
      <Text as="p">
        We do not sell or share personal information and use no targeted advertising. To know, delete or correct
        your data, email {email}.
      </Text>
    </>
  );
}

function Access() {
  const {de, email} = useSeller();
  return de ? (
    <>
      <Text as="p">
        Diese Seite soll für alle benutzbar sein. Maßstab sind die WCAG 2.1, Stufe AA: Bedienung mit der Tastatur,
        sichtbarer Fokus, ausreichende Kontraste, Alternativtexte für alle Werke, gekennzeichnete Sprache, nichts,
        das von selbst abspielt, und Rücksicht auf die Einstellung „Bewegung reduzieren“.
      </Text>
      <Heading level={3}>Was noch nicht ganz stimmt</Heading>
      <ul>
        <li>
          Die Mitteilung der Europäischen Union zur gesetzlichen Gewährleistung ist eine Grafik, die wir nicht
          verändern dürfen. Ihr vollständiger Wortlaut steht als Alternativtext dabei.
        </li>
        <li>
          Das Farbspiel im Wort „abstrakt“ ist Schmuck. Der Schriftzug selbst bleibt als Text in der Seite; mit
          „Bewegung reduzieren“ steht das Bild still.
        </li>
      </ul>
      <Heading level={3}>Rechtlicher Rahmen</Heading>
      <Text as="p">
        Das österreichische Barrierefreiheitsgesetz gilt seit 28. Juni 2025 für Webshops. Kleinstunternehmen, die
        Dienstleistungen erbringen (weniger als zehn Beschäftigte und höchstens zwei Millionen Euro Jahresumsatz
        oder Bilanzsumme), sind davon ausgenommen. Wir halten uns trotzdem an den Maßstab oben.
      </Text>
      <Text as="p">
        Barriere gefunden? Schreib an <Link color="inherit" type="inherit" href={`mailto:${email}`}>{email}</Link>. Wir antworten binnen 14 Tagen.
      </Text>
    </>
  ) : (
    <>
      <Text as="p">
        This site should be usable by everyone. The measure is WCAG 2.1, level AA: keyboard operation, visible
        focus, sufficient contrast, alternative text for every work, marked language, nothing that plays by
        itself, and respect for the "reduce motion" setting.
      </Text>
      <Heading level={3}>What is not quite there yet</Heading>
      <ul>
        <li>
          The European Union's notice on the legal guarantee is a graphic we are not allowed to alter. Its full
          wording is attached as alternative text.
        </li>
        <li>
          The play of colour in the word "abstrakt" is decoration. The word itself stays in the page as text; with
          "reduce motion" the image stands still.
        </li>
      </ul>
      <Heading level={3}>Legal frame</Heading>
      <Text as="p">
        The Austrian Accessibility Act (Barrierefreiheitsgesetz) has applied to web shops since 28 June 2025.
        Microenterprises providing services (fewer than ten staff and at most two million euros in annual turnover
        or balance sheet total) are exempt. We keep to the measure above all the same.
      </Text>
      <Text as="p">
        Found a barrier? Write to <Link color="inherit" type="inherit" href={`mailto:${email}`}>{email}</Link>. We reply within 14 days.
      </Text>
    </>
  );
}
