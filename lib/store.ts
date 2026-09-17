/**
 * Client state: cart, region, currency and the Yin Yang mode.
 *
 * Persistence is deliberately deferred. The store is created with skipHydration,
 * the provider rehydrates it inside an effect and flips `hydrated`. Components read
 * `hydrated` before showing anything that depends on stored values, which is what
 * keeps the server rendered markup and the first client render identical.
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { DEFAULT_REGION, REGIONS, type RegionCode } from "@/config/site";
import { PRODUCTS, type Collection, type Product } from "@/config/products";
import { estimateOrder, type OrderEstimate, type OrderLine } from "@/lib/utils";

export type Mode = Collection;

export interface CartItem {
  productId: string;
  quantity: number;
}

interface JingState {
  mode: Mode;
  region: RegionCode;
  items: CartItem[];
  isCartOpen: boolean;
  hydrated: boolean;
  /** True once the visitor changed the mode in this visit. Not persisted. */
  modeSwitched: boolean;
  /**
   * The line the last addItem touched, with a stamp that grows by one per add.
   * The cart drawer keys the freshly added row on it so the row's rule turns
   * ink and settles back on every add, not only on the first. A counter, never
   * Date.now, so nothing in render depends on the clock. Not persisted.
   */
  lastAdded: { productId: string; stamp: number } | null;
  addStamp: number;

  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  setRegion: (region: RegionCode) => void;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  /** Drops cart entries whose product left the catalogue. */
  pruneCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setHydrated: (value: boolean) => void;
}

const MAX_PER_LINE = 10;

const memoryStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useJingStore = create<JingState>()(
  persist(
    (set) => ({
      mode: "yang",
      region: DEFAULT_REGION,
      items: [],
      isCartOpen: false,
      hydrated: false,
      modeSwitched: false,
      lastAdded: null,
      addStamp: 0,

      // A mode change made in this visit is remembered, because the grid that
      // appears afterwards must not play the scroll-in choreography: the
      // visitor is looking straight at it and wants the products, not a wait.
      setMode: (mode) =>
        set((state) => (state.mode === mode ? {} : { mode, modeSwitched: true })),
      toggleMode: () =>
        set((state) => ({ mode: state.mode === "yin" ? "yang" : "yin", modeSwitched: true })),
      setRegion: (region) => set({ region }),

      addItem: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === productId);
          const stamp = state.addStamp + 1;
          const mark = { lastAdded: { productId, stamp }, addStamp: stamp, isCartOpen: true };
          if (!existing) {
            return {
              items: [...state.items, { productId, quantity: Math.min(quantity, MAX_PER_LINE) }],
              ...mark,
            };
          }
          return {
            items: state.items.map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.min(item.quantity + quantity, MAX_PER_LINE) }
                : item,
            ),
            ...mark,
          };
        }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((item) => item.productId !== productId) })),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.productId !== productId)
              : state.items.map((item) =>
                  item.productId === productId
                    ? { ...item, quantity: Math.min(quantity, MAX_PER_LINE) }
                    : item,
                ),
        })),

      clearCart: () => set({ items: [] }),

      // A basket persisted before a catalogue change can hold an id that no
      // longer resolves. Those entries are invisible in every list and every
      // total, but they still travel to the checkout route, which rejects the
      // whole order over an item the buyer cannot see. They are removed once,
      // right after the persisted state is read back.
      pruneCart: () =>
        set((state) => {
          const kept = state.items.filter((item) => productById.has(item.productId));
          return kept.length === state.items.length ? {} : { items: kept };
        }),

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: "jing-store",
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? memoryStorage : window.localStorage,
      ),
      partialize: (state) => ({ mode: state.mode, region: state.region, items: state.items }),
    },
  ),
);

const productById = new Map<string, Product>(PRODUCTS.map((product) => [product.id, product]));

/* --------------------------------------------------------------- derivations */

export function resolveLines(items: CartItem[]): OrderLine[] {
  return items
    .map((item) => {
      const product = productById.get(item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((line): line is OrderLine => line !== null);
}

/**
 * Total number of units in the cart, counted over resolvable lines only, so the
 * header badge can never disagree with what the cart actually lists.
 */
export function selectItemCount(state: { items: CartItem[] }): number {
  return resolveLines(state.items).reduce((sum, line) => sum + line.quantity, 0);
}

export function selectEstimate(state: { items: CartItem[]; region: RegionCode }): OrderEstimate {
  return estimateOrder(resolveLines(state.items), state.region);
}

export function selectRegion(state: { region: RegionCode }) {
  return REGIONS[state.region];
}
