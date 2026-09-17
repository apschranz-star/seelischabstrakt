import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False while the server renders and while React hydrates, true once it is
 * running in the browser. This is what the setMounted-in-an-effect pattern
 * expressed before; useSyncExternalStore says the same thing without a second
 * render pass and without a synchronous setState inside an effect.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
