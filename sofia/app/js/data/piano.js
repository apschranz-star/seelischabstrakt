/*
 * Sofia's plan, transcribed from "Schema dietetico generale per dieta
 * ipocalorica di circa 1400 kcal con circa 1 g proteine/kg peso corporeo"
 * by Dott.ssa Isabella Giunta, Biologa Nutrizionista (4 pages).
 *
 * Only the plan's own numbers are here. Nothing is added, rounded or
 * "improved". Where the plan gives no number the field says so with
 * MANCANTE, and the app shows "Informazione mancante" instead of a guess.
 *
 * Voce (one line of a meal):
 *   { a: food id from alimenti.js, q: amount, u: unit, o: [alternatives] }
 *   u: "g" | "ml" | "pz" (pieces) | "vasetto" | "cucchiaino" | "q.b." (amount free)
 *   o: alternatives the plan writes on the same line ("o due gallette ...")
 *   con: other foods that share the same amount ("10 gr tra fiocchi di avena
 *        e cioccolato": q is the total of a and con together)
 *
 * The audit test (test/piano.test.mjs) checks every number in this file
 * against a second, independent transcription.
 */

export const MANCANTE = "MANCANTE";

export const FONTE = {
  autrice: "Dott.ssa Isabella Giunta",
  ruolo: { it: "Biologa Nutrizionista", en: "Biologist Nutritionist" },
  titolo: {
    it: "Schema dietetico generale per dieta ipocalorica di circa 1400 kcal con circa 1 g proteine/kg peso corporeo",
    en: "General diet plan for a hypocaloric diet of about 1400 kcal with about 1 g protein per kg body weight",
  },
  pagine: 4,
};

export const OBIETTIVI = { kcal: 1400, proteine_g_kg: 1 };

/* ------------------------------------------------------------- COLAZIONE */
export const COLAZIONE = {
  id: "colazione",
  nome: { it: "Colazione", en: "Breakfast" },
  facoltativo: false,
  kcal: [200, 200], circa: true,
  macro: { proteine: [8, 10], carboidrati: [25, 34], grassi: [2, 6] },
  opzioni: [
    { id: "c1", voci: [{ a: "yogurt_magro", q: 150, u: "g" }, { a: "avena", q: 25, u: "g" }, { a: "frutta", q: 80, u: "g" }] },
    { id: "c2", voci: [{ a: "yogurt_magro", q: 150, u: "g" }, { a: "frutta", q: 150, u: "g" }, { a: "cioccolato", q: 10, u: "g" }] },
    { id: "c3", voci: [{ a: "yogurt_magro", q: 150, u: "g" }, { a: "frutta", q: 150, u: "g" }, { a: "frutta_secca", q: 10, u: "g" }] },
    { id: "c4", voci: [{ a: "latte_ps", q: 150, u: "ml" }, { a: "avena", q: 20, u: "g" }, { a: "frutta", q: 100, u: "g" }] },
    { id: "c5", voci: [{ a: "latte_ps", q: 150, u: "ml" }, { a: "avena", q: 30, u: "g" }, { a: "marmellata", q: 10, u: "g", o: [{ a: "miele", q: 10, u: "g" }] }] },
    { id: "c6", voci: [{ a: "pane_gf", q: 30, u: "g", o: [{ a: "gallette_saraceno", q: 2, u: "pz" }, { a: "gallette_riso", q: 2, u: "pz" }] }, { a: "ricotta_light", q: 90, u: "g" }, { a: "marmellata", q: 10, u: "g" }] },
  ],
  note: [
    { it: "150 g/ml di latte sostituibile con 150 g/ml di kefir bianco da bere oppure (ogni tanto) con 120 g di yogurt greco bianco 0%.", en: "150 g/ml milk can be replaced with 150 g/ml plain drinking kefir or (now and then) with 120 g plain Greek yogurt 0%." },
    { it: "150 g di yogurt bianco magro 0% sostituibile con 140 g/ml di kefir bianco da bere oppure (ogni tanto) con 110 g di yogurt greco bianco 0%.", en: "150 g plain fat-free yogurt 0% can be replaced with 140 g/ml plain drinking kefir or (now and then) with 110 g plain Greek yogurt 0%." },
    { it: "Per la marmellata prediligi una a ridotto contenuto di zuccheri, puoi anche aggiungere la cannella.", en: "For jam prefer a reduced-sugar one, you can also add cinnamon." },
    { it: "I fiocchi di avena sono i migliori. Per alternare: fiocchi di grano saraceno, riso soffiato integrale, miglio soffiato, quinoa soffiata, sempre con lo stesso peso.", en: "Oat flakes are the best. To vary: buckwheat flakes, puffed brown rice, puffed millet, puffed quinoa, always at the same weight." },
  ],
};

/* -------------------------------------------------------------- SPUNTINO */
export const SPUNTINO = {
  id: "spuntino",
  nome: { it: "Spuntino", en: "Snack" },
  facoltativo: true,
  kcal: [100, 120], circa: true,
  macro: { proteine: [5, 7], carboidrati: [10, 20], grassi: [1, 6] },
  opzioni: [
    { id: "s1", voci: [{ a: "frutta", q: 150, u: "g", testo: { it: "frutta a scelta o macedonia", en: "fruit of choice or fruit salad" } }] },
    { id: "s2", voci: [{ a: "yogurt_magro", q: 1, u: "vasetto" }, { a: "frutta_secca", q: 10, u: "g" }] },
    { id: "s3", voci: [{ a: "yogurt_magro", q: 1, u: "vasetto" }, { a: "cioccolato", q: 10, u: "g" }] },
    { id: "s4", voci: [{ a: "yogurt_magro", q: 1, u: "vasetto" }, { a: "frutta", q: 100, u: "g", o: [{ a: "prugne_secche", q: 25, u: "g" }] }] },
    { id: "s5", voci: [{ a: "gallette_riso", q: 1, u: "pz", o: [{ a: "gallette_saraceno", q: 1, u: "pz" }] }, { a: "fiocchi_latte", q: 70, u: "g" }] },
    { id: "s6", voci: [{ a: "gallette_riso", q: 1, u: "pz", o: [{ a: "gallette_saraceno", q: 1, u: "pz" }] }, { a: "philadelphia_light", q: 30, u: "g" }] },
    { id: "s7", voci: [{ a: "gallette_riso", q: 1, u: "pz", o: [{ a: "gallette_saraceno", q: 1, u: "pz" }] }, { a: "hummus", q: 40, u: "g" }] },
    { id: "s8", voci: [{ a: "gallette_riso", q: 1, u: "pz", o: [{ a: "gallette_saraceno", q: 1, u: "pz" }] }, { a: "ricotta_light", q: 40, u: "g", o: [{ a: "ricotta_protein", q: 40, u: "g" }] }, { a: "cannella", q: null, u: "q.b." }] },
  ],
  note: [
    { it: "Lo spuntino puoi farlo la mattina o in un altro momento della giornata.", en: "You can have the snack in the morning or at another time of day." },
    { it: "Il piano scrive \"1 vasetto\" di yogurt senza grammi: Informazione mancante.", en: "The plan says \"1 pot\" of yogurt without grams: information missing." },
  ],
};

/* ---------------------------------------------------------------- PRANZO */
export const PRANZO = {
  id: "pranzo",
  nome: { it: "Pranzo", en: "Lunch" },
  facoltativo: false,
  kcal: [490, 500], circa: true,
  macro: { proteine: [20, 30], carboidrati: [59, 75], grassi: [11, 19] },
  regola: { it: "Combinare una fonte di carboidrati con una fonte di proteine a scelta, + 300 g di verdure a piacere (peso crudo) + 10 g di olio evo (1 cucchiaio). Sulla pasta puoi usare passata di pomodoro.", en: "Combine one carbohydrate source with one protein source of your choice, + 300 g vegetables of your choice (raw weight) + 10 g extra virgin olive oil (1 tablespoon). On pasta you can use tomato passata." },
  carboidrati: [
    { id: "pc1", voci: [{ a: "pasta_saraceno", q: 80, u: "g" }] },
    { id: "pc2", voci: [{ a: "pasta_avena", q: 80, u: "g" }] },
    { id: "pc3", voci: [{ a: "pasta_riso_integrale", q: 80, u: "g" }] },
    { id: "pc4", voci: [{ a: "riso_basmati", q: 80, u: "g" }] },
    { id: "pc5", voci: [{ a: "riso_venere", q: 80, u: "g" }] },
    { id: "pc6", voci: [{ a: "riso_integrale", q: 80, u: "g" }] },
    { id: "pc7", voci: [{ a: "quinoa", q: 80, u: "g" }] },
    { id: "pc8", voci: [{ a: "grano_saraceno", q: 80, u: "g" }] },
    { id: "pc9", voci: [{ a: "sorgo", q: 80, u: "g" }] },
    { id: "pc10", voci: [{ a: "miglio", q: 80, u: "g" }] },
    { id: "pc11", cat: "legumi", voci: [{ a: "legumi_secchi", q: 70, u: "g", o: [{ a: "legumi_scolati", q: 180, u: "g" }] }], esattamente: 2 },
  ],
  proteine: [
    { id: "pp1", voci: [{ a: "tonno", q: 60, u: "g" }], max: 2 },
    { id: "pp2", voci: [{ a: "salmone_affumicato", q: 40, u: "g" }], max: 1 },
    { id: "pp3", voci: [{ a: "gamberi", q: 70, u: "g" }] },
    { id: "pp4", voci: [{ a: "calamari", q: 70, u: "g" }] },
    { id: "pp5", voci: [{ a: "polpo_cotto", q: 50, u: "g" }] },
    { id: "pp6", voci: [{ a: "pollo", q: 60, u: "g" }], cat: "carne" },
    { id: "pp7", voci: [{ a: "mozzarella_light", q: 50, u: "g", o: [{ a: "mozzarella_protein", q: 50, u: "g" }] }] },
    { id: "pp8", voci: [{ a: "fiocchi_latte", q: 70, u: "g" }] },
    { id: "pp9", voci: [{ a: "ricotta_light", q: 50, u: "g" }] },
    { id: "pp10", voci: [{ a: "philadelphia_light", q: 40, u: "g" }] },
    { id: "pp11", voci: [{ a: "uovo", q: 1, u: "pz" }] },
    { id: "pp12", voci: [{ a: "ragu", q: 90, u: "g" }], max: 1, cat: "carne" },
  ],
  contorno: [{ a: "verdure", q: 300, u: "g" }, { a: "olio_evo", q: 10, u: "g" }],
  extra: [{ a: "passata", q: null, u: "q.b.", testo: { it: "passata sulla pasta, se vuoi (quantità non indicata)", en: "passata on pasta if you like (amount not given)" } }],
  /* "Altre alternative già combinate per pranzo per comodità (max 1 a sett)":
     the limit is written once for the whole group. */
  combinati: {
    max: 1,
    opzioni: [
      { id: "pa1", cat: null, voci: [{ a: "cereali_sg", q: 80, u: "g", testo: { it: "pasta o riso (o varianti del pranzo)", en: "pasta or rice (or lunch variants)" } }, { a: "pesto", q: 30, u: "g" }, { a: "verdure", q: 300, u: "g" }] },
      { id: "pa2", cat: "pesce", voci: [{ a: "cereali_sg", q: 80, u: "g", testo: { it: "pasta o riso (o varianti del pranzo)", en: "pasta or rice (or lunch variants)" } }, { a: "tonno", q: 30, u: "g" }, { a: "mozzarella_light", q: 30, u: "g" }, { a: "olive", q: 10, u: "pz" }, { a: "verdure", q: 300, u: "g" }, { a: "olio_evo", q: 5, u: "g" }] },
      { id: "pa3", cat: "uova", voci: [{ a: "cereali_sg", q: 80, u: "g", testo: { it: "pasta o riso (o varianti del pranzo)", en: "pasta or rice (or lunch variants)" } }, { a: "uovo", q: 1, u: "pz", testo: { it: "uovo sodo", en: "hard-boiled egg" } }, { a: "tonno", q: 30, u: "g" }, { a: "verdure", q: 300, u: "g" }, { a: "olio_evo", q: 5, u: "g" }] },
    ],
  },
};

/* ------------------------------------------------------------------ CENA */
export const CENA = {
  id: "cena",
  nome: { it: "Cena", en: "Dinner" },
  facoltativo: false,
  kcal: [460, 460], circa: true,
  macro: { proteine: [15, 45], carboidrati: [35, 43], grassi: [11, 22] },
  proteine: [
    { id: "cp1", voci: [{ a: "pollo", q: 150, u: "g", o: [{ a: "tacchino", q: 150, u: "g" }, { a: "coniglio", q: 150, u: "g" }] }] },
    { id: "cp2", voci: [{ a: "vitello", q: 130, u: "g", o: [{ a: "maiale", q: 130, u: "g" }] }], max: 1, cat: "carne" },
    { id: "cp3", voci: [{ a: "uovo", q: 2, u: "pz" }, { a: "albume", q: 50, u: "g" }] },
    { id: "cp4", voci: [{ a: "polpo_crudo", q: 270, u: "g", o: [{ a: "polpo_cotto", q: 160, u: "g" }] }] },
    { id: "cp5", voci: [{ a: "calamari", q: 200, u: "g" }] },
    { id: "cp6", voci: [{ a: "merluzzo", q: 210, u: "g" }] },
    { id: "cp7", voci: [{ a: "gamberi", q: 180, u: "g", testo: { it: "gamberi o gamberetti sgusciati crudi", en: "raw peeled prawns or shrimp" } }] },
    { id: "cp8", voci: [{ a: "pesce_bianco", q: 180, u: "g" }] },
    { id: "cp9", voci: [{ a: "alici", q: 160, u: "g" }] },
    { id: "cp10", voci: [{ a: "pesce_spada", q: 130, u: "g" }], max: 1 },
    { id: "cp11", voci: [{ a: "salmone", q: 90, u: "g" }] },
    { id: "cp12", voci: [{ a: "mozzarella_light", q: 100, u: "g", o: [{ a: "mozzarella_protein", q: 100, u: "g" }] }] },
    { id: "cp13", voci: [{ a: "fiocchi_latte", q: 160, u: "g" }] },
    { id: "cp14", voci: [{ a: "legumi_secchi", q: 40, u: "g", o: [{ a: "legumi_scolati", q: 130, u: "g" }] }], esattamente: 1, gruppoLegumi: true },
  ],
  contorno: [
    { a: "verdure", q: 300, u: "g", o: [{ a: "minestrone", q: 300, u: "g" }] },
    { a: "olio_evo", q: 10, u: "g" },
    { a: "pane_gf", q: 60, u: "g", o: [{ a: "gallette_saraceno", q: 5, u: "pz" }, { a: "gallette_riso", q: 5, u: "pz" }, { a: "patate", q: 200, u: "g" }] },
  ],
  conversioni: [
    { it: "Per panare: 10 g di pane = 10 g di pangrattato.", en: "For breading: 10 g bread = 10 g breadcrumbs." },
    { it: "Per infarinare: 10 g di pane = 7 g di farina.", en: "For flouring: 10 g bread = 7 g flour." },
  ],
  idee: [
    { id: "ci1", cat: "formaggio", max: 1, voci: [{ a: "piadina_gf", q: 1, u: "pz", testo: { it: "1 piadina integrale senza glutine da 100 g come base pizza", en: "1 gluten-free wholegrain piadina of 100 g as pizza base" } }, { a: "passata", q: null, u: "q.b." }, { a: "mozzarella_protein", q: 100, u: "g" }, { a: "verdure", q: 100, u: "g" }] },
    { id: "ci2", cat: "uova", ogniDueSettimane: 1, voci: [{ a: "pane_gf", q: 60, u: "g" }, { a: "uovo", q: 2, u: "pz", testo: { it: "rotolo di frittata con 2 uova", en: "omelette roll with 2 eggs" } }, { a: "philadelphia_light", q: 30, u: "g" }, { a: "prosciutto_cotto", q: 20, u: "g" }, { a: "verdure", q: 300, u: "g" }, { a: "olio_evo", q: 10, u: "g" }] },
    { id: "ci3", cat: "legumi", gruppoLegumi: true, voci: [{ a: "legumi_secchi", q: 30, u: "g", o: [{ a: "legumi_scolati", q: 100, u: "g" }] }, { a: "cereali_sg", q: 50, u: "g" }, { a: "parmigiano", q: 1, u: "cucchiaino" }, { a: "verdure", q: [200, 300], u: "g" }, { a: "olio_evo", q: 10, u: "g" }], testo: { it: "Minestra di cereali e legumi", en: "Grain and legume soup" } },
  ],
  note: [
    { it: "I legumi a cena una sera a settimana: come opzione 14 oppure come minestra di cereali e legumi.", en: "Legumes at dinner one evening a week: as option 14 or as the grain and legume soup." },
  ],
};

/* ------------------------------------------------------------- DOPOCENA */
export const DOPOCENA = {
  id: "dopocena",
  nome: { it: "Dopocena", en: "After dinner" },
  facoltativo: true,
  kcal: [100, 100], circa: true,
  macro: { proteine: [1, 6], carboidrati: [1, 19], grassi: [1, 9] },
  opzioni: [
    { id: "d1", voci: [{ a: "frutta", q: 150, u: "g" }] },
    { id: "d2", voci: [{ a: "cioccolato", q: 15, u: "g" }] },
    { id: "d3", voci: [{ a: "frutta_secca", q: 15, u: "g" }] },
    { id: "d4", voci: [{ a: "frutta", q: 100, u: "g" }, { a: "frutta_secca", q: 10, u: "g" }] },
    { id: "d5", voci: [{ a: "yogurt_magro", q: 1, u: "vasetto" }, { a: "avena", q: 10, u: "g", con: ["cioccolato"], testo: { it: "Fiocchi di avena e cioccolato, peso totale", en: "Oat flakes and chocolate, combined weight" } }] },
  ],
};

export const PASTI = [COLAZIONE, SPUNTINO, PRANZO, CENA, DOPOCENA];

/* "Sarebbe perfetto" (page 2): ideal weekly frequency of protein categories. */
export const FREQUENZE_IDEALI = {
  pranzo: { legumi: [2, 2], carne: [1, 2], pesce: [1, 2], uova: [1, 1], formaggio: [2, 2] },
  cena: { legumi: [1, 1], carne_bianca: [1, 2], pesce: [2, 3], uova: [1, 1], formaggio: [1, 1] },
};

/* Every hard limit the plan states, in one list, so the council can check them. */
export const LIMITI = [
  { id: "tonno", pasto: "pranzo", alimenti: ["tonno"], max: 2, periodoGiorni: 7, it: "Tonno al naturale: massimo 2 volte a settimana", en: "Tuna in water: at most twice a week" },
  { id: "salmone_affumicato", pasto: "pranzo", alimenti: ["salmone_affumicato"], max: 1, periodoGiorni: 7, it: "Salmone affumicato: massimo 1 volta a settimana", en: "Smoked salmon: at most once a week" },
  { id: "ragu", pasto: "pranzo", alimenti: ["ragu"], max: 1, periodoGiorni: 7, it: "Ragù: massimo 1 volta a settimana", en: "Ragù: at most once a week" },
  { id: "legumi_pranzo", pasto: "pranzo", cat: "legumi", esattamente: 2, periodoGiorni: 7, it: "Legumi a pranzo: 2 volte a settimana", en: "Legumes at lunch: twice a week" },
  { id: "pranzi_combinati", pasto: "pranzo", combinato: true, max: 1, periodoGiorni: 7, it: "Pranzi già combinati: massimo 1 a settimana", en: "Ready-combined lunches: at most one a week" },
  { id: "vitello_maiale", pasto: "cena", alimenti: ["vitello", "maiale"], max: 1, periodoGiorni: 7, it: "Vitello o maiale magro: massimo 1 volta a settimana", en: "Lean veal or pork: at most once a week" },
  { id: "pesce_spada", pasto: "cena", alimenti: ["pesce_spada"], max: 1, periodoGiorni: 7, it: "Pesce spada: massimo 1 volta a settimana", en: "Swordfish: at most once a week" },
  { id: "legumi_cena", pasto: "cena", cat: "legumi", esattamente: 1, periodoGiorni: 7, it: "Legumi a cena: 1 volta a settimana", en: "Legumes at dinner: once a week" },
  { id: "piadina_pizza", pasto: "cena", opzione: "ci1", max: 1, periodoGiorni: 7, it: "Pizza su piadina: massimo 1 volta a settimana", en: "Piadina pizza: at most once a week" },
  { id: "rotolo_frittata", pasto: "cena", opzione: "ci2", max: 1, periodoGiorni: 14, it: "Rotolo di frittata con prosciutto cotto: massimo 1 volta ogni 2 settimane", en: "Omelette roll with cooked ham: at most once every 2 weeks" },
];

/* Daily rules from "Ti lascio ora qualche informazione generale sulla dieta" (page 4). */
export const REGOLE = [
  { id: "acqua", icona: "goccia", it: "Bevi almeno 2-3 litri di acqua al giorno. Ferrarelle o Lete per il calcio, altrimenti un'acqua con buon contenuto di calcio.", en: "Drink at least 2-3 litres of water a day. Ferrarelle or Lete for calcium, otherwise a water with a good calcium content.", valori: { min_l: 2, max_l: 3 } },
  { id: "piano", icona: "lumaca", it: "Mangia piano: ti sazi prima e meglio.", en: "Eat slowly: you feel full sooner and better." },
  { id: "verdure", icona: "foglia", it: "Verdure: 300 g a pranzo e 300 g a cena (peso crudo), anche di più se non sei sazia. Attenta al gonfiore; l'olio non cambia. Varia, e ricorda che le patate non sono verdure.", en: "Vegetables: 300 g at lunch and 300 g at dinner (raw weight), more if still hungry. Watch for bloating; the oil stays the same. Vary, and remember potatoes are not vegetables.", valori: { g_pasto: 300 } },
  { id: "limone", icona: "limone", it: "Condisci con limone (aumenta l'assorbimento del ferro dalle verdure) o spezie a piacere.", en: "Season with lemon (it increases iron absorption from vegetables) or spices of your choice." },
  { id: "sale_caffe", icona: "tazza", it: "Sale con moderazione. Caffè: non più di 3 al giorno, senza zucchero.", en: "Salt in moderation. Coffee: no more than 3 a day, without sugar.", valori: { caffe_max: 3 } },
  { id: "camminata", icona: "passi", it: "Se puoi, almeno 30 minuti di camminata veloce 5 volte a settimana, tenendo conto di come ti senti con il lupus.", en: "If you can, at least 30 minutes of brisk walking 5 times a week, depending on how you feel with lupus.", valori: { minuti: 30, volte_settimana: 5 } },
  { id: "inversione", icona: "frecce", it: "In caso di necessità puoi invertire il pranzo con la cena.", en: "If needed you can swap lunch and dinner." },
  { id: "dosi", icona: "bilancia", it: "Come cucini è libero (frittata, uova sode, ricetta che vuoi): l'importante è rispettare le dosi.", en: "How you cook is up to you (omelette, boiled eggs, any recipe): what matters is keeping the amounts." },
  { id: "omega3", icona: "goccia", it: "Omega 3: la nutrizionista li consiglia perché \"contribuiscono a ridurre l'infiammazione generale\", da far approvare dal medico. Le prove nel lupus sono di certezza bassa e gli omega 3 possono interagire con anticoagulanti e antinfiammatori (FANS): decide il medico.", en: "Omega-3: the nutritionist suggests them because they \"help reduce general inflammation\", to be approved by the doctor. Evidence in lupus is low certainty and omega-3 can interact with anticoagulants and anti-inflammatories (NSAIDs): the doctor decides.", fonte: "lupus_omega3" },
  { id: "fuori", icona: "porta", it: "Fuori casa resta in linea con il piano (la sera: secondo, contorno e pane). Evita l'alcol, preferisci sempre l'acqua.", en: "When eating out stay in line with the plan (evening: main, side and bread). Avoid alcohol, always prefer water." },
];

/* What the plan says about kidneys (page 4), kept word for word in meaning. */
export const RENI = {
  it: "Il lupus ha interessato i reni. Per ora filtrato e creatinina sono a posto e i medici non hanno chiesto di ridurre le proteine, quindi il piano resta normale. Se ripetendo gli esami qualcosa cambia e i medici dicono di mangiarne meno, il piano si adegua.",
  en: "Lupus has involved the kidneys. For now filtration and creatinine are fine and the doctors have not asked to reduce protein, so the plan stays as it is. If repeat tests change and the doctors say to eat less protein, the plan will be adjusted.",
};

/* Points from the personal notes (page 3) the app uses for "same or better" choices. */
export const PREFERENZE_DELLA_NUTRIZIONISTA = [
  { id: "avena_top", alimenti: ["avena"], it: "I fiocchi di avena sono i migliori: poco lavorati, migliorano profilo glicemico e lipidico.", en: "Oat flakes are the best: little processed, they improve the blood sugar and lipid profile." },
  { id: "chicco_top", alimenti: ["grano_saraceno", "quinoa", "miglio", "sorgo"], it: "A pranzo prediligi cereali a chicco: grano saraceno (il top), quinoa, miglio, sorgo.", en: "At lunch prefer whole-kernel grains: buckwheat (the top), quinoa, millet, sorghum." },
  { id: "pasta_singola", alimenti: ["pasta_saraceno", "pasta_avena", "pasta_riso_integrale"], it: "Pasta fatta da un solo ingrediente, oppure pasta di legumi 100%.", en: "Pasta made from a single ingredient, or 100% legume pasta." },
  { id: "gallette", alimenti: ["gallette_riso", "gallette_saraceno"], it: "Le gallette sono lavorate, ma meglio delle farine: un solo ingrediente.", en: "Rice cakes are processed, but better than flours: a single ingredient." },
  { id: "farine_panatura", alimenti: ["farina_avena", "farina_saraceno"], it: "Per impanare: meglio farina di avena o di grano saraceno.", en: "For breading: best oat or buckwheat flour." },
  { id: "frutti_antiossidanti", alimenti: ["frutta"], it: "Frutta fresca, soprattutto mirtilli, more e lamponi, ricchi di antiossidanti.", en: "Fresh fruit, especially blueberries, blackberries and raspberries, rich in antioxidants." },
  { id: "pochi_ingredienti", alimenti: [], it: "Un buon prodotto ha 1 o pochi ingredienti.", en: "A good product has 1 or few ingredients." },
];

/* Things the plan mentions without an amount: shown, never filled in. */
export const SENZA_DOSE = [
  { id: "pasta_legumi", it: "Pasta di legumi 100% (citata come buona scelta a pranzo)", en: "100% legume pasta (named as a good lunch choice)", manca: { it: "grammi, e se conta come legumi", en: "grams, and whether it counts as legumes" } },
  { id: "polenta", it: "Stick di polenta come alternativa al pane", en: "Polenta sticks as an alternative to bread", manca: { it: "grammi", en: "grams" } },
  { id: "semi_oleosi", it: "Semi oleosi (chia, lino) e avocado", en: "Oil seeds (chia, flax) and avocado", manca: { it: "grammi e in quale pasto", en: "grams and at which meal" } },
  { id: "vasetto", it: "1 vasetto di yogurt (spuntino e dopocena)", en: "1 pot of yogurt (snack and after dinner)", manca: { it: "grammi", en: "grams" } },
  { id: "parmigiano", it: "1 cucchiaino di parmigiano (minestra)", en: "1 teaspoon parmesan (soup)", manca: { it: "grammi", en: "grams" } },
];

/* Open questions for the nutritionist, written by the council (see docs/COUNCIL.md). */
export const DOMANDE_APERTE = [
  { id: "legumi_pranzo_proteina", it: "Nei 2 pranzi con legumi va aggiunta anche una fonte di proteine dalla lista, oppure i legumi bastano come proteina? L'app per ora segue la regola scritta: carboidrato + proteina.", en: "On the 2 legume lunches, should a protein from the list be added too, or are the legumes enough as protein? For now the app follows the written rule: carbohydrate + protein." },
  { id: "vasetto_grammi", it: "Quanti grammi intende per \"1 vasetto\" di yogurt?", en: "How many grams is \"1 pot\" of yogurt?" },
  { id: "pasta_legumi", it: "La pasta di legumi 100% va pesata 80 g come la pasta e conta come uno dei 2 pranzi con legumi?", en: "Is 100% legume pasta weighed at 80 g like pasta, and does it count as one of the 2 legume lunches?" },
  { id: "polenta_dose", it: "Quanti grammi di stick di polenta al posto di 60 g di pane?", en: "How many grams of polenta sticks replace 60 g of bread?" },
  { id: "vitello_maiale_cena", it: "Vitello o maiale magro contano come \"carne bianca\" nelle frequenze ideali della cena?", en: "Do lean veal or pork count as \"white meat\" in the ideal dinner frequencies?" },
  { id: "omega3", it: "Omega 3: il medico ha approvato? Quale prodotto e quale dose?", en: "Omega-3: has the doctor approved? Which product and which dose?" },
  { id: "panatura", it: "Panatura: il piano dice 10 g di pane = 10 g di pangrattato e propone 20 g di pangrattato con 30 g di pane (50 g in tutto), ma a cena il pane è 60 g. L'app usa 20 g di pangrattato e 40 g di pane: va bene così?", en: "Breading: the plan says 10 g bread = 10 g breadcrumbs and suggests 20 g breadcrumbs with 30 g bread (50 g in all), but the dinner bread is 60 g. The app uses 20 g breadcrumbs and 40 g bread: is that right?" },
  { id: "ragu", it: "Ragù (pranzo 12, 90 g): con quale carne? L'app suggerisce macinato magro di manzo o vitello.", en: "Ragù (lunch 12, 90 g): with which meat? The app suggests lean beef or veal mince." },
];
