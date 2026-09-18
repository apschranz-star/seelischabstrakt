"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";

import { useJingStore, type Mode } from "@/lib/store";
import type { RegionCode } from "@/config/site";
import type { SwitchOptions } from "@/lib/switch-origin";

interface YinYangContextValue {
  mode: Mode;
  setMode: (mode: Mode, options?: SwitchOptions) => void;
  toggleMode: (options?: SwitchOptions) => void;
  region: RegionCode;
  setRegion: (region: RegionCode) => void;
  /** False until the persisted state has been read, so nothing renders stored values too early. */
  hydrated: boolean;
}

const YinYangContext = createContext<YinYangContextValue | null>(null);

/** The inline custom properties the eclipse keyframes in globals.css read. */
const SWITCH_VARIABLES = ["--jing-switch-x", "--jing-switch-y", "--jing-switch-r"] as const;

export function YinYangProvider({ children }: { children: ReactNode }) {
  const mode = useJingStore((state) => state.mode);
  const region = useJingStore((state) => state.region);
  const hydrated = useJingStore((state) => state.hydrated);
  const setModeInStore = useJingStore((state) => state.setMode);
  const setRegionInStore = useJingStore((state) => state.setRegion);
  const setHydrated = useJingStore((state) => state.setHydrated);
  const pruneCart = useJingStore((state) => state.pruneCart);

  // The eclipse in flight, if any. A second press skips it and starts the
  // reverse instead of queueing behind it.
  const activeTransition = useRef<ViewTransition | null>(null);
  // The mode an eclipse is about to write. The browser runs the update
  // callback a frame after startViewTransition, and a press inside that frame
  // must reason about where the page is going, not where it still is.
  const pendingMode = useRef<Mode | null>(null);

  // Read the persisted state once, on the client, after the first paint.
  // Corrupt or unreadable storage must never take the shop down with it: a
  // private window, a quota error or a half written entry would otherwise throw
  // out of this effect and leave the visitor on a blank page. A failed rehydrate
  // simply means an empty cart and the default mode.
  useEffect(() => {
    let cancelled = false;
    // Tells the fallback timer in the root layout that React is running, so the
    // reveal animation is allowed to keep its opacity:0 starting state.
    document.documentElement.setAttribute("data-hydrated", "");
    try {
      void useJingStore.persist.rehydrate()?.then?.(
        () => {
          if (cancelled) return;
          pruneCart();
          setHydrated(true);
        },
        () => {
          if (!cancelled) setHydrated(true);
        },
      );
      if (!useJingStore.persist.hasHydrated()) {
        // Older storage engines resolve synchronously and return undefined above.
        pruneCart();
        setHydrated(true);
      }
    } catch {
      setHydrated(true);
    }
    return () => {
      cancelled = true;
    };
  }, [setHydrated, pruneCart]);

  // The document element carries the mode so CSS can invert the whole surface.
  // The bootstrap script in the root layout has already stamped the persisted
  // value before the first paint, so this effect only ever reconciles. It
  // waits for hydrated, otherwise it would write the store default, yang, over
  // a persisted yin for the moment between mount and rehydration.
  //
  // The browser chrome follows the surface: the theme-color metas get the live
  // token, read back from the computed style, so no colour literal lives here.
  // The document language follows the visitor's choice, for screen readers,
  // hyphenation and the browser's translate prompt.
  const lang = useJingStore((state) => state.lang);
  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = lang;
  }, [lang, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.dataset.mode = mode;
    // The stylesheet keeps the ritual that does not match the stamped mode out
    // of sight until this line runs, so the night palette is never shown with
    // the pieces of the day. See "One ritual at a time" in globals.css.
    root.dataset.store = "ready";
    const surface = getComputedStyle(root).getPropertyValue("--jing-surface").trim();
    if (!surface) return;
    document
      .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute("content", surface));
  }, [mode, hydrated]);

  /*
   * The eclipse.
   *
   * Pressing the mark does not fade the shop. The new palette arrives as a
   * hard-edged disc that grows from the pressed point until it covers the far
   * corner, drawn by the View Transitions API and two keyframes in globals.css
   * (see "Mode switch: the eclipse" there). The store is updated inside the
   * transition's update callback, synchronously through flushSync, so the new
   * snapshot already carries the complete palette. data-switching on the root
   * tells the stylesheet which way the disc travels and switches every colour
   * transition off for the duration, so nothing lags behind the limb.
   *
   * Everything here happens in the event path, never in render. A browser
   * without the API, a visitor who prefers reduced motion, a hidden tab and a
   * switch that is not a moment (a deep link, a history step) all take the
   * plain path: the same store update, the 620 ms token crossfade on body.
   */
  const runSwitch = useCallback(
    (next: Mode, options?: SwitchOptions) => {
      const current = pendingMode.current ?? useJingStore.getState().mode;
      if (next === current) return;

      const root = document.documentElement;
      const plain =
        options?.instant === true ||
        typeof document.startViewTransition !== "function" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.visibilityState !== "visible";

      if (plain) {
        pendingMode.current = null;
        setModeInStore(next);
        return;
      }

      const x = options?.origin?.x ?? window.innerWidth / 2;
      const y = options?.origin?.y ?? window.innerHeight / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );
      root.style.setProperty("--jing-switch-x", `${x}px`);
      root.style.setProperty("--jing-switch-y", `${y}px`);
      root.style.setProperty("--jing-switch-r", `${radius}px`);
      root.dataset.switching = next === "yin" ? "to-yin" : "to-yang";

      // A second press reverses. Skipping the running transition resolves its
      // finished promise, whose cleanup below checks that it is still the
      // active one before touching the root, so it cannot undo this switch.
      activeTransition.current?.skipTransition();

      pendingMode.current = next;
      const transition = document.startViewTransition(() => {
        flushSync(() => setModeInStore(next));
        root.dataset.mode = next;
        pendingMode.current = null;
      });
      activeTransition.current = transition;

      transition.finished
        .finally(() => {
          if (activeTransition.current !== transition) return;
          delete root.dataset.switching;
          SWITCH_VARIABLES.forEach((name) => root.style.removeProperty(name));
          activeTransition.current = null;
        })
        .catch(() => {
          // A transition whose update callback threw rejects here. The root
          // has been cleaned up above, there is nothing else to do.
        });
    },
    [setModeInStore],
  );

  const setMode = useCallback(
    (next: Mode, options?: SwitchOptions) => {
      runSwitch(next, options);
    },
    [runSwitch],
  );

  const toggleMode = useCallback(
    (options?: SwitchOptions) => {
      const current = pendingMode.current ?? useJingStore.getState().mode;
      runSwitch(current === "yin" ? "yang" : "yin", options);
    },
    [runSwitch],
  );

  const setRegion = useCallback(
    (next: RegionCode) => {
      setRegionInStore(next);
    },
    [setRegionInStore],
  );

  const value = useMemo<YinYangContextValue>(
    () => ({ mode, setMode, toggleMode, region, setRegion, hydrated }),
    [mode, setMode, toggleMode, region, setRegion, hydrated],
  );

  return <YinYangContext.Provider value={value}>{children}</YinYangContext.Provider>;
}

export function useYinYang(): YinYangContextValue {
  const context = useContext(YinYangContext);
  if (!context) {
    throw new Error("useYinYang muss innerhalb von YinYangProvider verwendet werden.");
  }
  return context;
}
