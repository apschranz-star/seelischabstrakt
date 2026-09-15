import type { Metadata, Viewport } from "next";
import { Archivo, Bodoni_Moda, JetBrains_Mono } from "next/font/google";

import "./globals.css";

import { YinYangProvider } from "@/components/theme/yin-yang-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SiteHeader } from "@/components/ui/site-header";
import { SiteFooter } from "@/components/ui/site-footer";
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
  robots: { index: true, follow: true },
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" data-mode="yang" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MODE_BOOTSTRAP }} />
      </head>
      <body className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
        <YinYangProvider>
          <a
            href="#inhalt"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-surface"
          >
            Zum Inhalt springen
          </a>
          <SiteHeader />
          <main id="inhalt">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </YinYangProvider>
      </body>
    </html>
  );
}
