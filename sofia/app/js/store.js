/*
 * Everything Sofia enters lives in this browser only, under one key.
 * Nothing is sent anywhere: the page's security rule allows connections to
 * its own address only, and only the public recipe list is fetched from there.
 *
 * Backup: one file, encrypted on the phone with a passphrase she chooses
 * (PBKDF2-SHA256 with 600,000 iterations, then AES-GCM 256). Without the
 * passphrase the file is unreadable, including for whoever stores it.
 */
const CHIAVE = "sofia-v1";
const VERSIONE = 1;

export function vuoto() {
  return {
    v: VERSIONE,
    profilo: { nome: "Sofia", nascita: null, sesso: "F", altezza_cm: null, pesoObiettivo: null, farmaci: "" },
    impostazioni: { lingua: "it", tema: "auto" },
    pref: { spuntino: true, dopocena: true, combinato: "auto", escludi: [] },
    settimane: [],
    pesi: [],
    esami: [],
    pressione: [],
    diario: {},
    preferite: [],
    bozze: {},
    webCache: null,
    ultimoBackup: null,
    creato: new Date().toISOString(),
  };
}

function migra(s) {
  const base = vuoto();
  const out = { ...base, ...s };
  out.profilo = { ...base.profilo, ...(s.profilo || {}) };
  out.impostazioni = { ...base.impostazioni, ...(s.impostazioni || {}) };
  out.pref = { ...base.pref, ...(s.pref || {}) };
  for (const k of ["settimane", "pesi", "esami", "pressione", "preferite"]) if (!Array.isArray(out[k])) out[k] = [];
  if (!out.diario || typeof out.diario !== "object") out.diario = {};
  if (!out.bozze || typeof out.bozze !== "object") out.bozze = {};
  out.v = VERSIONE;
  return out;
}

let stato = null;
const ascoltatori = new Set();

export function carica() {
  try {
    const raw = localStorage.getItem(CHIAVE);
    stato = raw ? migra(JSON.parse(raw)) : vuoto();
  } catch (e) {
    stato = vuoto();
  }
  return stato;
}
export const S = () => stato;

let salvataggioFallito = false;
export function salva() {
  try {
    localStorage.setItem(CHIAVE, JSON.stringify(stato));
    salvataggioFallito = false;
  } catch (e) {
    salvataggioFallito = true;
  }
}
export const memoriaNonDisponibile = () => salvataggioFallito;

/* Change state, save, redraw. */
export function cambia(fn) {
  fn(stato);
  salva();
  ascoltatori.forEach((f) => f(stato));
}
/* Change and save without redrawing: for sliders, which must not be
   replaced while the finger is still on them. */
export function cambiaSilenzioso(fn) {
  fn(stato);
  salva();
}
export function ascolta(f) {
  ascoltatori.add(f);
  return () => ascoltatori.delete(f);
}

export async function chiediMemoriaPersistente() {
  try {
    if (navigator.storage && navigator.storage.persist) {
      if (await navigator.storage.persisted()) return true;
      return await navigator.storage.persist();
    }
  } catch (e) { /* not available */ }
  return false;
}

/* ------------------------------------------------------- encryption */
const ITER = 600000;
const b64 = (u8) => btoa(String.fromCharCode(...u8));
const deb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function chiave(passphrase, sale, uso) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt: sale, iterations: ITER, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, [uso]);
}

export async function cifra(dati, passphrase) {
  const sale = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const k = await chiave(passphrase, sale, "encrypt");
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, k, new TextEncoder().encode(JSON.stringify(dati))));
  return { app: "sofia", formato: 1, kdf: "PBKDF2-SHA256", iterazioni: ITER, cifrario: "AES-GCM-256", sale: b64(sale), iv: b64(iv), dati: b64(ct), creato: new Date().toISOString() };
}

export async function decifra(file, passphrase) {
  if (!file || file.app !== "sofia" || !file.dati) throw new Error("formato");
  const k = await chiave(passphrase, deb64(file.sale), "decrypt");
  const chiaro = await crypto.subtle.decrypt({ name: "AES-GCM", iv: deb64(file.iv) }, k, deb64(file.dati));
  return JSON.parse(new TextDecoder().decode(chiaro));
}

export async function esportaBackup(passphrase) {
  const pacchetto = await cifra(stato, passphrase);
  const testo = JSON.stringify(pacchetto);
  const nome = `sofia-backup-${new Date().toISOString().slice(0, 10)}.json`;
  const file = new File([testo], nome, { type: "application/json" });
  let condiviso = false;
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: nome });
      condiviso = true;
    }
  } catch (e) { /* the user closed the share sheet: fall back to a download */ }
  if (!condiviso) {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url; a.download = nome;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }
  cambia((s) => { s.ultimoBackup = new Date().toISOString(); });
}

export async function importaBackup(testo, passphrase) {
  const dati = await decifra(JSON.parse(testo), passphrase);
  cambia((s) => { Object.keys(s).forEach((k) => delete s[k]); Object.assign(s, migra(dati)); });
}

export function cancellaTutto() {
  try { localStorage.removeItem(CHIAVE); } catch (e) { /* ignore */ }
  cambia((s) => { Object.keys(s).forEach((k) => delete s[k]); Object.assign(s, vuoto()); });
}
