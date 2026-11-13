import { test } from "node:test";
import assert from "node:assert/strict";
import { leggiFeed, stessoSito, giudica, raccogli } from "../lib/ricette-web.mjs";

const FEED = "https://www.esempio.test/gluten-free/feed/";
const item = (titolo, link, data = "Mon, 02 Nov 2026 10:00:00 +0000") =>
  `<item><title>${titolo}</title><link>${link}</link><pubDate>${data}</pubDate><category>Gluten Free</category></item>`;
const pagina = (ricetta) => `<html><script type="application/ld+json">${JSON.stringify(ricetta)}</script></html>`;
const ricetta = (extra = {}) => ({
  "@type": "Recipe",
  name: "Lemon herb salmon",
  recipeIngredient: ["2 salmon fillets", "1 lemon", "1 tablespoon olive oil", "salt"],
  recipeCategory: "Dinner",
  suitableForDiet: "https://schema.org/GlutenFreeDiet",
  ...extra,
});

test("same-site check ignores www. and rejects other hosts and junk", () => {
  assert.equal(stessoSito("https://esempio.test/a", FEED), true);
  assert.equal(stessoSito("https://www.esempio.test/a", FEED), true);
  assert.equal(stessoSito("https://altro.test/a", FEED), false);
  assert.equal(stessoSito("https://esempio.test.altro.test/a", FEED), false);
  assert.equal(stessoSito("not a url", FEED), false);
});

test("feed items that point to another site are dropped", () => {
  const xml = `<rss><channel>${item("Buona", "https://www.esempio.test/buona/")}${item("Fuori", "https://altro.test/fuori/")}${item("Http", "http://www.esempio.test/http/")}</channel></rss>`;
  assert.deepEqual(leggiFeed(xml, FEED).map((i) => i.titolo), ["Buona"]);
  /* Without a feed URL only the https rule applies (kept for callers that pass none). */
  assert.equal(leggiFeed(xml).length, 2);
});

test("a recipe URL on another site falls back to the post link", () => {
  const link = "https://www.esempio.test/salmone/";
  assert.equal(giudica(ricetta({ url: "https://altro.test/x/" }), { fonte: "Esempio", link }).url, link);
  assert.equal(giudica(ricetta({ url: "https://esempio.test/salmone/" }), { fonte: "Esempio", link }).url, "https://esempio.test/salmone/");
  assert.equal(giudica(ricetta({ url: ["https://altro.test/x/"] }), { fonte: "Esempio", link }).url, link);
});

test("an unparsable date is stored as null and the recipe is kept", async () => {
  const pagine = {
    [FEED]: `<rss><channel>${item("Salmone", "https://www.esempio.test/salmone/", "not a date")}${item("Altro", "https://www.esempio.test/altro/", "")}</channel></rss>`,
    "https://www.esempio.test/salmone/": pagina(ricetta({ datePublished: "yesterday-ish" })),
    "https://www.esempio.test/altro/": pagina(ricetta({ name: "Second salmon", datePublished: "2026-11-01T08:00:00Z" })),
  };
  const client = { permesso: async () => true, prendi: async (u) => { if (!(u in pagine)) throw new Error("not in fixture: " + u); return pagine[u]; } };
  const { risultati, rapporto } = await raccogli({ client, fonti: [{ name: "Esempio", feed: FEED, alles: true }] });
  assert.equal(rapporto[0].errore, null);
  assert.equal(risultati.length, 2);
  const perTitolo = Object.fromEntries(risultati.map((g) => [g.titolo, g.data]));
  assert.equal(perTitolo["Lemon herb salmon"], null);
  assert.equal(perTitolo["Second salmon"], "2026-11-01");
});
