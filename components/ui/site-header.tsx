"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useYinYang } from "@/components/theme/yin-yang-provider";
import { buttonClasses } from "@/components/ui/button";
import { useLang, useT } from "@/lib/i18n";
import { DURATION, EASE_RITUAL, useHysteresis } from "@/lib/motion";
import { useJingStore, selectItemCount } from "@/lib/store";
import { REGIONS, REGION_ORDER } from "@/config/site";
import { cn } from "@/lib/utils";

/*
 * The region pill. appearance-none takes the OS chevron away and the one from
 * lucide sits in its place, drawn in currentColor, so the pill looks the same
 * in every browser and in both modes. pr-8 keeps the text clear of it.
 */
const REGION_SELECT = cn(
  "min-h-11 appearance-none rounded-full border border-control bg-transparent py-1.5 pl-3 pr-8",
  "font-mono uppercase tracking-[0.14em] text-ink-2",
  "transition-colors duration-[var(--duration-state)] ease-ritual hover:border-ink",
);

const NAV = [
  { href: "/#yang", label: { de: "Yang", en: "Yang" }, mode: "yang" },
  { href: "/#yin", label: { de: "Yin", en: "Yin" }, mode: "yin" },
  { href: "/cart", label: { de: "Warenkorb", en: "Cart" }, mode: null },
] as const;

/** The link's hairline: drawn on hover and focus, kept while the ritual is live. */
const NAV_LINK = "type-nav jing-underline pb-0.5 text-ink-2 transition-colors hover:text-ink";

export function SiteHeader() {
  const { mode, region, setRegion, hydrated } = useYinYang();
  const lang = useLang();
  const setLang = useJingStore((state) => state.setLang);
  const t = useT();
  const count = useJingStore(selectItemCount);
  const openCart = useJingStore((state) => state.openCart);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion() === true;

  // The count shown is the hydrated one. Before rehydration it is the zero the
  // server rendered, so the first client render matches the markup.
  const shown = hydrated ? count : 0;

  // The header answers scroll only by firming up: its surface goes from 85 to
  // 96 percent and its rule from line to line-2, see header[data-scrolled] in
  // globals.css. The attribute is written straight to the element, so a scroll
  // causes no render, and the server markup carries no trace of the position.
  // Two thresholds, on above 24 px and off below 8 px, keep it from flickering
  // when the page rests near the top.
  const { scrollY } = useScroll();
  useHysteresis(scrollY, 24, 8, (active) => {
    headerRef.current?.toggleAttribute("data-scrolled", active);
  });

  // The menu covers the page on a phone, so it has to close the way every other
  // overlay does: Escape, and a tap anywhere outside it. Focus goes back to the
  // button that opened it, otherwise the next Tab starts from the top again.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (menuButtonRef.current?.contains(target)) return;
      setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  /**
   * aria-current marks the page the visitor is on. The two ritual links carry
   * data-active instead once the live ritual is known: before rehydration the
   * attribute is absent, exactly as the server rendered it, so the first client
   * render never disagrees with the markup.
   */
  const linkState = (item: (typeof NAV)[number]) => ({
    "aria-current": item.mode === null && pathname === item.href ? ("page" as const) : undefined,
    "data-active": hydrated && item.mode !== null && item.mode === mode ? "" : undefined,
  });

  return (
    <header
      ref={headerRef}
      className="jing-header sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-[1240px] items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-display text-2xl leading-none tracking-[0.18em] text-ink"
          aria-label={t({ de: "JING, zur Startseite", en: "JING, to the start page" })}
        >
          JING
        </Link>

        <nav aria-label={t({ de: "Hauptmenü", en: "Main menu" })} className="ml-8 hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={NAV_LINK} {...linkState(item)}>
              {t(item.label)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* The language switch names the language it switches to, in that
              language, so an English reader who landed in German finds it. */}
          <button
            type="button"
            lang={lang === "de" ? "en" : "de"}
            onClick={() => setLang(lang === "de" ? "en" : "de")}
            aria-label={lang === "de" ? "Switch to English" : "Auf Deutsch wechseln"}
            className={cn(buttonClasses("control", "icon"), "px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em]")}
          >
            {lang === "de" ? "EN" : "DE"}
          </button>

          <label className="sr-only" htmlFor="region-select">
            {t({ de: "Lieferland", en: "Delivery country" })}
          </label>
          <span className="relative hidden sm:block">
            <select
              id="region-select"
              data-slot="region"
              value={region}
              onChange={(event) => setRegion(event.target.value as typeof region)}
              className={cn(REGION_SELECT, "text-[11px]")}
            >
              {REGION_ORDER.map((code) => (
                <option key={code} value={code}>
                  {code} · {REGIONS[code].currency}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-2"
            />
          </span>

          <ThemeToggle />

          <button
            type="button"
            onClick={openCart}
            // The icon size carries no padding of its own, so the pill's own
            // px-3 py-1.5 is the only padding and the height stays at 44.
            className={cn(buttonClasses("control", "icon"), "relative px-3 py-1.5")}
            aria-label={t({ de: `Warenkorb öffnen, ${shown} Artikel`, en: `Open cart, ${shown} items` })}
          >
            <ShoppingBag size={16} aria-hidden="true" />
            {/* The count ticks behind a fixed window: the old digit leaves
                upward, the new one arrives from below. The window is one em
                tall and clips both, so the pill never changes size and the
                button itself is never remounted. */}
            <span
              aria-hidden="true"
              className="relative inline-grid h-[1em] overflow-hidden font-mono text-[11px] leading-none tabular-nums"
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={shown}
                  className="col-start-1 row-start-1"
                  initial={{ y: "0.8em", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-0.8em", opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : DURATION.swap, ease: EASE_RITUAL }}
                >
                  {shown}
                </motion.span>
              </AnimatePresence>
            </span>
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(buttonClasses("control", "icon"), "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={t({ de: "Menü", en: "Menu" })}
          >
            {menuOpen ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        ref={menuRef}
        data-open={menuOpen ? "" : undefined}
        className={cn("border-t border-line md:hidden", menuOpen ? "block" : "hidden")}
      >
        <nav aria-label={t({ de: "Menü", en: "Menu" })} className="mx-auto flex w-full max-w-[1240px] flex-col px-4 py-2">
          <div className="flex items-center justify-between border-b border-line py-3 sm:hidden">
            <label htmlFor="region-select-mobile" className="type-nav text-ink-3">
              {t({ de: "Lieferland", en: "Delivery country" })}
            </label>
            <span className="relative">
              <select
                id="region-select-mobile"
                value={region}
                onChange={(event) => setRegion(event.target.value as typeof region)}
                className={cn(REGION_SELECT, "text-[12px]")}
              >
                {REGION_ORDER.map((code) => (
                  <option key={code} value={code}>
                    {code} · {REGIONS[code].currency}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-2"
              />
            </span>
          </div>
          {NAV.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{ "--i": index } as CSSProperties}
              className="type-nav border-b border-line py-3 text-ink-2 last:border-b-0"
              {...linkState(item)}
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
