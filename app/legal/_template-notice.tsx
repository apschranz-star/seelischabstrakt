import { AlertTriangle } from "lucide-react";

/**
 * Every legal page carries this. The texts in this repository are drafting aids,
 * not legal advice, and the company details are placeholders.
 */
export function TemplateNotice() {
  return (
    <aside
      role="note"
      className="mb-12 flex gap-3 border border-line-2 bg-surface-2 p-5 text-sm leading-relaxed text-ink-2"
    >
      <AlertTriangle size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-seal" />
      <p>
        <strong className="font-semibold text-ink">Vorlage, noch nicht rechtsverbindlich.</strong>{" "}
        Dieser Text ist ein Entwurf für den Aufbau des Shops. Alle Angaben in eckigen Klammern sind
        Platzhalter und stehen in <code className="font-mono text-[13px]">config/site.ts</code>. Vor
        dem Livegang müssen die Platzhalter ersetzt und der gesamte Text von einer Anwältin oder
        einem Anwalt für IT- und Wettbewerbsrecht geprüft werden. JING übernimmt für diesen Entwurf
        keine Haftung.
      </p>
    </aside>
  );
}

export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-[72ch] px-4 py-16 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">Rechtliches</p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">{title}</h1>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
        Stand {updated}
      </p>
      <div className="mt-12">
        <TemplateNotice />
        <div className="flex flex-col gap-8 text-[15px] leading-relaxed text-ink-2">{children}</div>
      </div>
    </article>
  );
}

export function Section({ no, title, children }: { no: string; title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-2xl leading-snug text-ink">
        <span className="mr-3 font-mono text-[13px] tracking-[0.14em] text-ink-3">{no}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
