import type { Metadata, Viewport } from "next";
import { Archivo, Bodoni_Moda, JetBrains_Mono } from "next/font/google";

import "./globals.css";

import { YinYangProvider } from "@/components/theme/yin-yang-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SiteHeader } from "@/components/ui/site-header";
import { SiteFooter } from "@/components/ui/site-footer";
import { AccessGate } from "@/components/ui/access-gate";
import { SITE } from "@/config/site";

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
  // Behind an access link nothing may be indexed, the pre-rendered HTML is the
  // gate anyway (see components/ui/access-gate.tsx).
  robots: process.env.NEXT_PUBLIC_JING_ACCESS_KEY
    ? { index: false, follow: false }
    : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f9fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
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
 * happened after four seconds, everything is shown unconditionally.
 */
const REVEAL_FALLBACK = `(function(){setTimeout(function(){if(document.documentElement.hasAttribute("data-hydrated"))return;var s=document.createElement("style");s.textContent="[data-reveal]{opacity:1!important;transform:none!important}";document.head.appendChild(s);},4000);})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" data-mode="yang" suppressHydrationWarning>
      <head>
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
              Beispieldaten.
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
