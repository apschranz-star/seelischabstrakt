"use client";

import Link from "next/link";
import { useScroll } from "framer-motion";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useYinYang } from "@/components/theme/yin-yang-provider";
import { buttonClasses } from "@/components/ui/button";
import { useHysteresis } from "@/lib/motion";
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
  { href: "/#yang", label: "Yang" },
  { href: "/#yin", label: "Yin" },
  { href: "/cart", label: "Warenkorb" },
];

export function SiteHeader() {
  const { region, setRegion, hydrated } = useYinYang();
  const count = useJingStore(selectItemCount);
  const openCart = useJingStore((state) => state.openCart);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

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

  return (
    <header
      ref={headerRef}
      className="jing-header sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-[1240px] items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-display text-2xl leading-none tracking-[0.2em] text-ink"
          aria-label="JING, zur Startseite"
        >
          JING
        </Link>

        <nav aria-label="Hauptmenü" className="ml-8 hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2 transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <label className="sr-only" htmlFor="region-select">
            Lieferland
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
            aria-label={`Warenkorb öffnen, ${hydrated ? count : 0} Artikel`}
          >
            <ShoppingBag size={16} aria-hidden="true" />
            <span className="font-mono text-[11px] tabular-nums">
              {hydrated ? count : 0}
            </span>
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(buttonClasses("control", "icon"), "md:hidden")}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label="Menü"
          >
            {menuOpen ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        ref={menuRef}
        className={cn("border-t border-line md:hidden", menuOpen ? "block" : "hidden")}
      >
        <nav aria-label="Menü" className="mx-auto flex w-full max-w-[1240px] flex-col px-4 py-2">
          <div className="flex items-center justify-between border-b border-line py-3 sm:hidden">
            <label
              htmlFor="region-select-mobile"
              className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink-3"
            >
              Lieferland
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
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-line py-3 font-mono text-[12px] uppercase tracking-[0.18em] text-ink-2 last:border-b-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
