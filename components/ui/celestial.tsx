/*
 * Sonne und Mond, einmal gezeichnet.
 *
 * Der Schalter, der Hero und die Überschrift der Kollektion benutzen dieselben
 * zwei Zeichen. Wer den Schalter einmal verstanden hat, erkennt an jeder
 * anderen Stelle sofort, in welcher Tageszeit der Shop gerade steht. Zwei
 * Zeichen an drei Stellen sind verständlicher als drei Erfindungen.
 *
 * Beide nehmen ihre Farbe von currentColor und ihre Größe vom Aufrufer. Die
 * Sonne kann ihre Strahlen einziehen, der Mond seine Sichel schließen: beides
 * ist ein Wert zwischen 0 und 1, damit der Schalter die Bewegung treiben kann,
 * ohne dass hier etwas über Bewegung weiß.
 */

export function Sun({
  size = 14,
  rays = 1,
  className,
}: {
  size?: number;
  /** 0 zieht die Strahlen ganz ein, 1 stellt sie voll aus. */
  rays?: number;
  className?: string;
}) {
  const r = Math.max(0, Math.min(1, rays));
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" className={className}>
      <circle cx="12" cy="12" r={4.3} fill="currentColor" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="12"
          y1={8.2 - 2.4 * r}
          x2="12"
          y2={6.4 - 2.4 * r}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity={r}
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
    </svg>
  );
}

export function Moon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" className={className}>
      {/* Eine Scheibe mit einem Biss heraus. Eine Form, keine Maske, damit die
          Sichel bei jeder Größe ihre Kante behält. */}
      <path d="M20.2 14.6A9 9 0 0 1 9.4 3.8a9 9 0 1 0 10.8 10.8z" fill="currentColor" />
    </svg>
  );
}

/**
 * Das Zeichen der Tageszeit, wie es neben einer Überschrift steht.
 * Kein aria-label: daneben steht immer das Wort.
 */
export function RitualMark({
  mode,
  size = 16,
  className,
}: {
  mode: "yang" | "yin";
  size?: number;
  className?: string;
}) {
  return mode === "yang" ? (
    <Sun size={size} className={className} />
  ) : (
    <Moon size={size} className={className} />
  );
}
