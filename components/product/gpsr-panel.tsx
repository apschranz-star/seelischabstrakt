import { RESPONSIBLE_PERSON } from "@/config/site";
import { hasCosmeticPart, type Product } from "@/config/products";

/**
 * The block the General Product Safety Regulation asks for on the offer itself:
 * who made it, how to reach them, what the product is, and the warnings that
 * belong to it. It is not hidden behind a drawer, because the regulation wants
 * this visible with the offer.
 */
/**
 * Everything that must by law sit on the product itself, in the order a label
 * carries it. CLP hazard statements come first because they are label elements
 * under Regulation EC 1272/2008, not house copy.
 */
function mandatoryLabelText(regulatory: Product["regulatory"]): string[] {
  const clp = regulatory.kind === "candle" ? regulatory.clpStatements : [];
  const enclosed = regulatory.kind === "accessory" ? (regulatory.cosmetic?.warnings ?? []) : [];
  return [...clp, ...regulatory.warnings, ...enclosed];
}

export function GpsrPanel({ product }: { product: Product }) {
  const warnings = mandatoryLabelText(product.regulatory);

  return (
    <section
      aria-labelledby={`gpsr-${product.id}`}
      className="mt-12 border-t border-line pt-8 text-sm leading-relaxed text-ink-2"
    >
      <h2
        id={`gpsr-${product.id}`}
        className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3"
      >
        Sicherheits- und Herstellerangaben
      </h2>

      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
            Verantwortliche Person
          </p>
          <address className="mt-2 not-italic">
            {RESPONSIBLE_PERSON.company}
            <br />
            {RESPONSIBLE_PERSON.street}
            <br />
            {RESPONSIBLE_PERSON.zipCity}, {RESPONSIBLE_PERSON.country}
            <br />
            <a
              href={`mailto:${RESPONSIBLE_PERSON.email}`}
              className="text-ink underline underline-offset-4"
            >
              {RESPONSIBLE_PERSON.email}
            </a>
          </address>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
            Produktkennzeichnung
          </p>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt className="text-ink-3">Artikel</dt>
            <dd>{product.code}</dd>
            <dt className="text-ink-3">Bezeichnung</dt>
            <dd>{product.name}</dd>
            <dt className="text-ink-3">Inhalt</dt>
            <dd>{product.unitsLabel}</dd>
            <dt className="text-ink-3">Herkunft</dt>
            <dd>{product.origin}</dd>
          </dl>
        </div>
      </div>

      {warnings.length > 0 ? (
        <div className="mt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
            Warnhinweise
          </p>
          <ul role="list" className="mt-2 flex flex-col gap-1">
            {warnings.map((warning) => (
              <li key={warning} className="flex gap-2">
                <span aria-hidden="true" className="text-seal">
                  ·
                </span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-6 text-xs leading-relaxed text-ink-3">
        {hasCosmeticPart(product) ? RESPONSIBLE_PERSON.note : RESPONSIBLE_PERSON.role}
      </p>
    </section>
  );
}
