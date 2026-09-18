/**
 * Where a mode switch starts.
 *
 * The eclipse in components/theme/yin-yang-provider.tsx grows the new palette
 * from the point the visitor touched. Every switch point in the tree, the
 * header toggle, the two hero halves and the #yin and #yang links, hands that
 * point along through these options. A switch that is not
 * a moment, a deep link on load or a history step, passes instant instead
 * and gets the plain token crossfade.
 */
export type SwitchOptions = {
  /** Viewport coordinates in px the eclipse grows from. Default: the centre. */
  origin?: { x: number; y: number };
  /** Skip the eclipse and switch with the token crossfade only. */
  instant?: boolean;
};

/**
 * The pointer position of an activation, or the centre of the activated
 * element when the activation came from the keyboard. A keyboard click
 * reports clientX and clientY as 0, which would grow the eclipse from the
 * top left corner instead of from the control the visitor pressed.
 */
export function originFromEvent(event: {
  clientX: number;
  clientY: number;
  currentTarget: EventTarget | null;
}): { x: number; y: number } {
  if (event.clientX !== 0 || event.clientY !== 0) {
    return { x: event.clientX, y: event.clientY };
  }
  const target = event.currentTarget;
  if (typeof Element !== "undefined" && target instanceof Element) {
    const rect = target.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}
