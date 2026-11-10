/*
 * Encryption used by the app: the backup file and the text of the plan.
 * PBKDF2-SHA256 with 600,000 iterations, AES-GCM-256, random salt and IV per
 * file. Pure functions on WebCrypto, so the same code runs in the browser and
 * in the Node tests.
 */
export const ITER = 600000;

/* Base64 in chunks: one argument per byte overflows the engine's argument
   limit (65,536 in JavaScriptCore, the engine of every iOS browser). */
export function b64(u8) {
  let s = "";
  for (let i = 0; i < u8.length; i += 32768) s += String.fromCharCode.apply(null, u8.subarray(i, i + 32768));
  return btoa(s);
}
export function deb64(s) {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function chiaveDa(passphrase, sale, usi, iterazioni = ITER) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt: sale, iterations: iterazioni, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, usi);
}

/* The header is bound to the ciphertext as additional data: changing any
   field of it makes decryption fail. */
const intestazione = (f) => JSON.stringify({ app: f.app, formato: f.formato, kdf: f.kdf, iterazioni: f.iterazioni, cifrario: f.cifrario, creato: f.creato });

export async function cifraConPassphrase(dati, passphrase, app = "sofia") {
  const sale = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const k = await chiaveDa(passphrase, sale, ["encrypt"]);
  const testa = { app, formato: 2, kdf: "PBKDF2-SHA256", iterazioni: ITER, cifrario: "AES-GCM-256", creato: new Date().toISOString() };
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: new TextEncoder().encode(intestazione(testa)) }, k, new TextEncoder().encode(JSON.stringify(dati))));
  return { ...testa, sale: b64(sale), iv: b64(iv), dati: b64(ct) };
}

export async function decifraConPassphrase(file, passphrase, app = "sofia") {
  if (!file || file.app !== app || !file.dati || !file.sale || !file.iv) throw new Error("formato");
  /* The iteration count is fixed here, never read from the file: a crafted
     file cannot lower it. */
  const k = await chiaveDa(passphrase, deb64(file.sale), ["decrypt"]);
  const opz = { name: "AES-GCM", iv: deb64(file.iv) };
  if (file.formato === 2) opz.additionalData = new TextEncoder().encode(intestazione(file));
  else if (file.formato !== 1) throw new Error("formato");
  const chiaro = await crypto.subtle.decrypt(opz, k, deb64(file.dati));
  return JSON.parse(new TextDecoder().decode(chiaro));
}
