/* A marker line under a heading, drawn by hand in two strokes, the way the
   title of "Suffering is Eternal" was written and struck through. It draws
   itself when its section comes into view (motion.css); with motion off it is
   simply there. Decoration only. */
const STROKES = [
  ['M3 11 C 42 5, 80 15, 120 9 S 198 5, 237 11', 'M226 13 C 190 16, 140 15, 104 13'],
  ['M4 9 C 52 15, 98 4, 142 10 C 172 14, 206 6, 236 9', 'M14 13 C 60 15, 110 12, 150 14'],
  ['M2 12 Q 62 3, 122 10 T 238 8', 'M232 11 C 196 14, 168 12, 128 14'],
];

export function Scribble({variant = 0}: {variant?: number}) {
  const [a, b] = STROKES[variant % STROKES.length];
  return (
    <svg className="scribble" viewBox="0 0 240 18" width="240" height="18" aria-hidden="true" focusable="false">
      <path d={a} pathLength={1} />
      <path d={b} pathLength={1} />
    </svg>
  );
}
