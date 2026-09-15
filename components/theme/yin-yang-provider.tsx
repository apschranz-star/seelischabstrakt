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

  const [mounted, setMounted] = useState(false);

  // Read the persisted state once, on the client, after the first paint.
  useEffect(() => {
    let cancelled = false;
    void useJingStore.persist.rehydrate()?.then?.(() => {
      if (!cancelled) setHydrated(true);
    });
    if (!useJingStore.persist.hasHydrated()) {
      // Older storage engines resolve synchronously and return undefined above.
      setHydrated(true);
    }
    setMounted(true);
    return () => {
      cancelled = true;
    };
  }, [setHydrated]);

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
