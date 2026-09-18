import type { Metadata, Viewport } from "next";
import { Archivo, Bodoni_Moda, JetBrains_Mono } from "next/font/google";

import "./globals.css";

import { YinYangProvider } from "@/components/theme/yin-yang-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SiteHeader } from "@/components/ui/site-header";
import { SiteFooter } from "@/components/ui/site-footer";
import { AccessGate } from "@/components/ui/access-gate";
import { SITE } from "@/config/site";
import { CSP_META } from "@/config/security";

const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--jing-font-display",
  display: "swap",
  weight: ["400", "500"],
});

const sans = Archivo({
  subsets: ["latin"],
  variable: "--jing-font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--jing-font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.claim}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "de_DE",
    title: `${SITE.name} — ${SITE.claim}`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
  },
  // Behind an access link nothing may be indexed. The prerendered HTML is the
  // gate itself, but the access code and the whole catalogue travel in the
  // JavaScript bundle beside it, where anyone who fetches the files can read
  // them. That is what the gate is and is not: it keeps search engines and
  // passers by out, it is not a lock. See components/ui/access-gate.tsx and
  // DATENSCHUTZ.md in the seelischabstrakt repository.
  robots: process.env.NEXT_PUBLIC_JING_ACCESS_KEY
    ? { index: false, follow: false }
    : { index: true, follow: true },
};

/*
 * The browser chrome before the first script runs. These two are the surface of
 * the day and the surface of the night, --jing-surface in app/globals.css, and
 * they have to be written out here because a meta tag takes no custom property.
 * They are the only colour literals in the app; the provider replaces them with
 * the live token as soon as it runs, so a changed palette only ever shows here
 * for the first frame. Change a surface there, change it here.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0c10" },
  ],
};

/**
 * Sets the stored mode before the first paint, so the page never flashes the
 * wrong ritual. It reads the same key that the Zustand persist middleware writes.
 */
const MODE_BOOTSTRAP = `(function(){try{var s=localStorage.getItem("jing-store");var m=s?JSON.parse(s).state.mode:"yang";document.documentElement.dataset.mode=m==="yin"?"yin":"yang";}catch(e){document.documentElement.dataset.mode="yang";}})();`;

/**
 * The reveal animation ships opacity:0 in the server markup. If the client
 * bundle never hydrates, a chunk that 404s or a script blocked by an extension,
 * that content would stay invisible with no way back. The provider stamps
 * data-hydrated on the document as soon as React is running; if that has not
 * happened after four seconds, everything is shown unconditionally. The same
 * timer releases the collection that globals.css holds back until the store has
 * been read, so a stored Yin cannot leave the page without any pieces at all.
 */
const REVEAL_FALLBACK = `(function(){setTimeout(function(){if(document.documentElement.hasAttribute("data-hydrated"))return;document.documentElement.setAttribute("data-store","ready");var s=document.createElement("style");s.textContent="[data-reveal]{opacity:1!important;transform:none!important}";document.head.appendChild(s);},4000);})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" data-mode="yang" suppressHydrationWarning>
      <head>
        {/*
          The static demo has no server, so nothing sends the headers that
          next.config.ts declares. The policy travels in the document instead.
          On a real deployment the header is already there and this would only
          repeat it, so it is written for the export alone. See config/security.ts.
        */}
        {process.env.NEXT_PUBLIC_JING_STATIC_DEMO === "1" ? (
          <>
            <meta httpEquiv="Content-Security-Policy" content={CSP_META} />
            <meta name="referrer" content="strict-origin-when-cross-origin" />
          </>
        ) : null}
        <script dangerouslySetInnerHTML={{ __html: MODE_BOOTSTRAP }} />
        <script dangerouslySetInnerHTML={{ __html: REVEAL_FALLBACK }} />
        {/* Without scripting the reveal animation must not hide anything. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
        <YinYangProvider>
          {process.env.NEXT_PUBLIC_JING_STATIC_DEMO === "1" ? (
            <p
              role="note"
              className="border-b border-line bg-surface-2 px-4 py-2 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2"
            >
              Demonstration. Kein Verkauf, keine Zahlung. Produkte, Preise und Firmendaten sind
              Beispieldaten · Demonstration. No sale, no payment. Products, prices and company
              details are sample data.
            </p>
          ) : null}
          <a
            href="#inhalt"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-surface"
          >
            Zum Inhalt springen
          </a>
          <AccessGate>
            <SiteHeader />
            <main id="inhalt">{children}</main>
            <SiteFooter />
            <CartDrawer />
          </AccessGate>
        </YinYangProvider>
      </body>
    </html>
  );
}
