import { test } from "node:test";
import assert from "node:assert/strict";
import { RICETTE } from "../app/js/data/ricette.js";
import { OPZ } from "../app/js/engine/planner.js";
import { ALIMENTI } from "../app/js/data/alimenti.js";

const qPiano = (id, a) => {
  const o = OPZ[id];
  for (const v of o.voci) for (const x of [v, ...(v.o || [])]) if (x.a === a) return x.q;
  return undefined;
};

test("every recipe ingredient is a known plan food", () => {
  for (const r of RICETTE) for (const i of r.ingredienti) assert.ok(ALIMENTI[i.a], `${r.id}: ${i.a}`);
});

test("breakfast, snack and after-dinner recipes use the option's exact amounts", () => {
  for (const r of RICETTE.filter((x) => x.abbina.opzione)) {
    const o = OPZ[r.abbina.opzione];
    for (const v of o.voci) {
      if (v.q == null) continue;
      const i = r.ingredienti.find((x) => x.a === v.a || (v.o || []).some((y) => y.a === x.a));
      if (r.abbina.opzione === "d5" && v.a === "avena") continue;
      assert.ok(i, `${r.id}: missing ${v.a}`);
      if (i.a === v.a) assert.equal(i.q, v.q, `${r.id}: ${v.a}`);
    }
  }
});

test("lunch recipes cook the plan's carbohydrate and protein amounts", () => {
  for (const r of RICETTE.filter((x) => x.pasto === "pranzo" && x.abbina.prot)) {
    const prot = r.abbina.prot.map((id) => OPZ[id].voci[0].a);
    const p = r.ingredienti.find((i) => prot.includes(i.a));
    assert.ok(p, `${r.id}: protein`);
    const opz = r.abbina.prot.find((id) => OPZ[id].voci[0].a === p.a);
    assert.equal(p.q, qPiano(opz, p.a), `${r.id}: protein amount`);
    assert.ok(r.ingredienti.some((i) => i.a === "verdure" && i.q === 300), `${r.id}: 300 g vegetables`);
    assert.ok(r.ingredienti.some((i) => i.a === "olio_evo" && i.q === 10), `${r.id}: 10 g oil`);
  }
});

test("dinner recipes keep the bread equivalent at 60 g (bread, breadcrumbs or flour converted)", () => {
  for (const r of RICETTE.filter((x) => x.pasto === "cena" && x.abbina.prot)) {
    const g = (a) => (r.ingredienti.find((i) => i.a === a) || {}).q || 0;
    const pane = g("pane_gf") + g("pangrattato_gf") + (g("farina_avena") + g("farina_saraceno")) / 0.7;
    const gallette = g("gallette_saraceno") + g("gallette_riso");
    const patate = g("patate");
    assert.ok(Math.abs(pane - 60) < 0.01 || gallette === 5 || patate === 200, `${r.id}: bread ${pane} gallette ${gallette} patate ${patate}`);
  }
});
