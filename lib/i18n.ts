"use client";

/*
 * Two languages, one shop.
 *
 * German is the source language and what the server renders. The visitor's
 * choice is persisted next to the mode and the region, and it becomes visible
 * only after rehydration, so the server markup and the first client render
 * carry the same words. Every string is written where it is used, as a pair
 * { de, en }, and t() picks the live one. Product texts live in
 * config/products.ts and are localized with localizeProduct().
 *
 * What stays German on purpose: the five legal pages (the German text is the
 * binding one for a DACH shop, they carry an English notice instead), the
 * static metadata, and the server's own validation messages, which the client
 * validation makes rare.
 */

import { useCallback } from "react";

import { useJingStore } from "@/lib/store";

export type Lang = "de" | "en";
export type Text = Readonly<Record<Lang, string>>;

export const LANGS: readonly Lang[] = ["de", "en"] as const;
export const DEFAULT_LANG: Lang = "de";

/** Pick the live language from a pair. */
export function pick(text: Text, lang: Lang): string {
  return text[lang] ?? text.de;
}

/**
 * The live language, German until the store has rehydrated. Components that
 * render server side read this and never branch their element tree on it,
 * only their words.
 */
export function useLang(): Lang {
  const lang = useJingStore((state) => state.lang);
  const hydrated = useJingStore((state) => state.hydrated);
  return hydrated ? lang : DEFAULT_LANG;
}

/** t({ de, en }) in the live language. */
export function useT(): (text: Text) => string {
  const lang = useLang();
  return useCallback((text: Text) => pick(text, lang), [lang]);
}

/** Intl locale for numbers and dates in the live language and currency. */
export function intlLocale(lang: Lang, currency: "EUR" | "CHF"): string {
  if (lang === "en") return currency === "CHF" ? "en-CH" : "en-IE";
  return currency === "CHF" ? "de-CH" : "de-DE";
}
