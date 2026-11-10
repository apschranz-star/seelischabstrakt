/*
 * Everything Sofia enters lives in this browser only, under one key.
 * Nothing is sent anywhere: the page's security rule allows connections to
 * its own address only, and only the public recipe list is fetched from there.
 *
 * Backup: one file, encrypted on the phone with a passphrase she chooses
 * (PBKDF2-SHA256 with 600,000 iterations, then AES-GCM 256). Without the
 * passphrase the file is unreadable, including for whoever stores it.
 */
import { cifraConPassphrase, decifraConPassphrase } from "./cripto.js";

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
    /* foods she added through the food brain, with the verdict they got */
    alimentiExtra: {},
    /* her own recipes */
    ricetteMie: [],
    /* her weights for pieces, pots and teaspoons (defaults in engine/nutrizione.js) */
    pesiUnita: {},
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
  if (!out.alimentiExtra || typeof out.alimentiExtra !== "object" || Array.isArray(out.alimentiExtra)) out.alimentiExtra = {};
  if (!Array.isArray(out.ricetteMie)) out.ricetteMie = [];
  if (!out.pesiUnita || typeof out.pesiUnita !== "object") out.pesiUnita = {};
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
/* The backup leaves out what the app rebuilds by itself: the public recipe
   cache and unfinished imports. */
export const cifra = (dati, passphrase) => cifraConPassphrase(dati, passphrase, "sofia");
export const decifra = (file, passphrase) => decifraConPassphrase(file, passphrase, "sofia");
export function datiDaSalvare(s) {
  const { webCache, bozze, ...resto } = s;
  void webCache; void bozze;
  return resto;
}

export async function esportaBackup(passphrase) {
  const pacchetto = await cifra(datiDaSalvare(stato), passphrase);
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
