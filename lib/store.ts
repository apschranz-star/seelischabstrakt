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

  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  setRegion: (region: RegionCode) => void;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
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

      setMode: (mode) => set({ mode }),
      toggleMode: () => set((state) => ({ mode: state.mode === "yin" ? "yang" : "yin" })),
      setRegion: (region) => set({ region }),

      addItem: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === productId);
          if (!existing) {
            return {
              items: [...state.items, { productId, quantity: Math.min(quantity, MAX_PER_LINE) }],
              isCartOpen: true,
            };
          }
          return {
            items: state.items.map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.min(item.quantity + quantity, MAX_PER_LINE) }
                : item,
            ),
            isCartOpen: true,
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

/* --------------------------------------------------------------- derivations */

const productById = new Map<string, Product>(PRODUCTS.map((product) => [product.id, product]));

export function resolveLines(items: CartItem[]): OrderLine[] {
  return items
    .map((item) => {
      const product = productById.get(item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((line): line is OrderLine => line !== null);
}

/** Total number of units in the cart. */
export function selectItemCount(state: { items: CartItem[] }): number {
  return state.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function selectEstimate(state: { items: CartItem[]; region: RegionCode }): OrderEstimate {
  return estimateOrder(resolveLines(state.items), state.region);
}

export function selectRegion(state: { region: RegionCode }) {
  return REGIONS[state.region];
}
