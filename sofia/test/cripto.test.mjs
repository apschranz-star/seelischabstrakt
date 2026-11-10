import { test } from "node:test";
import assert from "node:assert/strict";
import { b64, deb64, cifraConPassphrase, decifraConPassphrase } from "../app/js/cripto.js";

test("base64 round trip of 1 MB (no argument-limit overflow)", () => {
  const u8 = new Uint8Array(1024 * 1024);
  for (let i = 0; i < u8.length; i++) u8[i] = (i * 31 + 7) & 255;
  const back = deb64(b64(u8));
  assert.equal(back.length, u8.length);
  assert.ok(back.every((x, i) => x === u8[i]));
});

test("backup of a large state round-trips through cifra and decifra", async () => {
  const stato = { diario: {}, esami: [] };
  for (let i = 0; i < 4000; i++) stato.diario["2026-" + i] = { nota: "x".repeat(200), energia: i % 5 };
  const file = await cifraConPassphrase(stato, "una frase lunga di prova");
  assert.ok(file.dati.length > 1000000);
  assert.equal(file.formato, 2);
  const back = await decifraConPassphrase(file, "una frase lunga di prova");
  assert.deepEqual(back, stato);
});

test("wrong passphrase and edited header both fail", async () => {
  const file = await cifraConPassphrase({ a: 1 }, "frase giusta 123");
  await assert.rejects(decifraConPassphrase(file, "frase sbagliata 123"));
  await assert.rejects(decifraConPassphrase({ ...file, creato: "2020-01-01T00:00:00.000Z" }, "frase giusta 123"));
  await assert.rejects(decifraConPassphrase({ ...file, formato: 9 }, "frase giusta 123"));
});
