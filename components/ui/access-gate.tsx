"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";

import { useMounted } from "@/lib/use-mounted";
import { SITE } from "@/config/site";

/**
 * Preview mode behind a link.
 *
 * With NEXT_PUBLIC_JING_ACCESS_KEY set at build time the shop only renders for
 * a visitor who arrived through ?zugang=<key> once, or typed the key here. The
 * key is remembered in this browser. Without the variable the gate is not
 * there at all.
 *
 * This keeps the preview out of search engines and away from casual visitors.
 * It is not security: a static export carries the key and every page in its
 * files, and anyone determined can read them. For real protection the site
 * needs a host that checks credentials before it serves a byte.
 */
const KEY = process.env.NEXT_PUBLIC_JING_ACCESS_KEY ?? "";
const STORAGE = "jing-access";
const PARAM = "zugang";

// Whether this browser holds the code is external state, read from storage,
// so it is wired through useSyncExternalStore rather than an effect that sets
// state. A module flag covers a browser whose storage refuses to write.
let sessionGranted = false;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const emit = () => listeners.forEach((listener) => listener());

function readGranted(): boolean {
  if (sessionGranted) return true;
  try {
    return localStorage.getItem(STORAGE) === KEY;
  } catch {
    return false;
  }
}

function grant() {
  sessionGranted = true;
  try {
    localStorage.setItem(STORAGE, KEY);
  } catch {
    // Storage may be unavailable, the module flag carries the visit.
  }
  emit();
}

export function AccessGate({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  const granted = useSyncExternalStore(subscribe, readGranted, () => false);
  const [attempt, setAttempt] = useState("");
  const [rejected, setRejected] = useState(false);

  // The link form: ?zugang=<code>. Accepted once, then removed from the URL so
  // the address people copy on is the plain one.
  useEffect(() => {
    if (!KEY) return;
    const url = new URL(window.location.href);
    const fromLink = url.searchParams.get(PARAM);
    if (fromLink === null) return;
    url.searchParams.delete(PARAM);
    window.history.replaceState(null, "", url.toString());
    if (fromLink === KEY) grant();
  }, []);

  if (!KEY) return <>{children}</>;
  if (granted) return <>{children}</>;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (attempt.trim() === KEY) {
      grant();
      return;
    }
    setRejected(true);
  }

  return (
    <main
      id="inhalt"
      className="mx-auto flex min-h-[70vh] w-full max-w-[32rem] flex-col justify-center px-4 py-24 sm:px-6"
    >
      <p className="font-display text-3xl tracking-[0.3em] text-ink">{SITE.name}</p>
      <h1 className="mt-8 font-display text-2xl leading-tight text-ink">
        Diese Vorschau ist nicht öffentlich.
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-2">
        Wer den Link bekommen hat, ist bereits drin. Sonst hier den Zugangscode eingeben.
        {mounted ? "" : " Die Seite lädt noch, das Feld funktioniert trotzdem."}
      </p>
      {/* A plain GET form. With JavaScript the submit handler grants access in
          place; without it, or while the scripts have not arrived yet, the
          browser reloads the page with ?zugang=<code>, which the effect above
          accepts as soon as it runs. The gate is never a dead end. */}
      <form method="get" action="" onSubmit={submit} className="mt-8">
        <label
          htmlFor="zugangscode"
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3"
        >
          Zugangscode
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id="zugangscode"
            name={PARAM}
            type="password"
            autoComplete="off"
            value={attempt}
            onChange={(event) => {
              setAttempt(event.target.value);
              setRejected(false);
            }}
            aria-invalid={rejected || undefined}
            aria-describedby={rejected ? "zugangscode-fehler" : undefined}
            className="w-full rounded-[2px] border border-control bg-surface px-3 py-2.5 font-sans text-[14px] text-ink focus-visible:border-ink"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full border border-transparent bg-inverse-surface px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-inverse-ink hover:opacity-90"
          >
            Öffnen
          </button>
        </div>
        {rejected ? (
          <p id="zugangscode-fehler" className="mt-2 text-[12px] text-seal">
            Der Code stimmt nicht.
          </p>
        ) : null}
      </form>
    </main>
  );
}
