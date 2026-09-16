"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useJingStore, type Mode } from "@/lib/store";
import type { RegionCode } from "@/config/site";

interface YinYangContextValue {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  region: RegionCode;
  setRegion: (region: RegionCode) => void;
  /** False until the persisted state has been read, so nothing renders stored values too early. */
  hydrated: boolean;
}

const YinYangContext = createContext<YinYangContextValue | null>(null);

export function YinYangProvider({ children }: { children: ReactNode }) {
  const mode = useJingStore((state) => state.mode);
  const region = useJingStore((state) => state.region);
  const hydrated = useJingStore((state) => state.hydrated);
  const setModeInStore = useJingStore((state) => state.setMode);
  const toggleInStore = useJingStore((state) => state.toggleMode);
  const setRegionInStore = useJingStore((state) => state.setRegion);
  const setHydrated = useJingStore((state) => state.setHydrated);
  const pruneCart = useJingStore((state) => state.pruneCart);

  const [mounted, setMounted] = useState(false);

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
    setMounted(true);
    return () => {
      cancelled = true;
    };
  }, [setHydrated, pruneCart]);

  // The document element carries the mode so CSS can invert the whole surface.
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dataset.mode = mode;
  }, [mode, mounted]);

  const setMode = useCallback(
    (next: Mode) => {
      setModeInStore(next);
    },
    [setModeInStore],
  );

  const setRegion = useCallback(
    (next: RegionCode) => {
      setRegionInStore(next);
    },
    [setRegionInStore],
  );

  const value = useMemo<YinYangContextValue>(
    () => ({ mode, setMode, toggleMode: toggleInStore, region, setRegion, hydrated }),
    [mode, setMode, toggleInStore, region, setRegion, hydrated],
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
