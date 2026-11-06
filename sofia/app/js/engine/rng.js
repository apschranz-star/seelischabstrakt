/* Small seeded random generator (mulberry32). Same seed, same week: a shuffle
   can be shown again, shared with the nutritionist, or tested. */
export function rng(seed) {
  let a = (typeof seed === "number" ? seed : hash(String(seed))) >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (n) => Math.floor(next() * n),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    shuffle: (arr) => {
      const b = arr.slice();
      for (let i = b.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [b[i], b[j]] = [b[j], b[i]];
      }
      return b;
    },
    weighted: (items, weightOf) => {
      const w = items.map((x) => Math.max(0, weightOf(x)));
      const tot = w.reduce((s, x) => s + x, 0);
      if (tot <= 0) return items[Math.floor(next() * items.length)];
      let r = next() * tot;
      for (let i = 0; i < items.length; i++) {
        r -= w[i];
        if (r <= 0) return items[i];
      }
      return items[items.length - 1];
    },
  };
}

export function hash(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function nuovoSeme() {
  try {
    const b = new Uint32Array(1);
    crypto.getRandomValues(b);
    return b[0];
  } catch (e) {
    return (Date.now() ^ (Math.random() * 4294967296)) >>> 0;
  }
}
