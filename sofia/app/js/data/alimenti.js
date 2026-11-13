/*
 * Food catalogue for Sofia's plan.
 *
 * Every food that appears in the nutritionist's plan (schema dietetico
 * generale, about 1400 kcal) has one entry here. The plan itself
 * (meals, grams, weekly limits) lives in piano.js and only refers to these ids.
 *
 * glutine
 *   "naturale"    naturally gluten free as a plain, single ingredient
 *   "etichetta"   buy only with the words "senza glutine" on the pack
 *                 (EU: at most 20 mg gluten per kg). Grains, flakes, flours,
 *                 bread, rice cakes and anything processed sit here because
 *                 they can be contaminated in mills and factories.
 *   "certificata" oats: only oats sold as gluten free (uncontaminated)
 * sale     true when the food is naturally salty or usually salted. The
 *          kidney sentinel uses it to remind about moderate salt.
 * cat      the frequency category the plan counts per week
 *          (legumi, carne, carne_bianca, pesce, uova, formaggio)
 */

export const ALIMENTI = {
  /* Latticini e bevande del mattino */
  yogurt_magro: { it: "Yogurt bianco magro 0%", en: "Plain fat-free yogurt 0%", gruppo: "latticini", glutine: "naturale", nota: { it: "Bianco e naturale, senza aromi.", en: "Plain, unflavoured." } },
  latte_ps: { it: "Latte parzialmente scremato", en: "Semi-skimmed milk", gruppo: "latticini", glutine: "naturale" },
  kefir: { it: "Kefir bianco da bere", en: "Plain drinking kefir", gruppo: "latticini", glutine: "naturale", nota: { it: "Bianco, senza aromi.", en: "Plain, unflavoured." } },
  yogurt_greco: { it: "Yogurt greco bianco 0%", en: "Plain Greek yogurt 0%", gruppo: "latticini", glutine: "naturale" },

  /* Formaggi */
  ricotta_light: { it: "Ricotta light", en: "Light ricotta", gruppo: "formaggi", cat: "formaggio", glutine: "etichetta" },
  ricotta_protein: { it: "Ricotta protein", en: "High-protein ricotta", gruppo: "formaggi", cat: "formaggio", glutine: "etichetta", nota: { it: "La versione protein spesso ha ingredienti aggiunti: controlla la dicitura senza glutine.", en: "Protein versions often have added ingredients: check the gluten-free wording." } },
  fiocchi_latte: { it: "Fiocchi di latte", en: "Cottage cheese", gruppo: "formaggi", cat: "formaggio", glutine: "etichetta" },
  philadelphia_light: { it: "Philadelphia light (formaggio spalmabile light)", en: "Light cream cheese (Philadelphia light)", gruppo: "formaggi", cat: "formaggio", glutine: "etichetta", sale: true },
  mozzarella_light: { it: "Mozzarella light", en: "Light mozzarella", gruppo: "formaggi", cat: "formaggio", glutine: "etichetta" },
  mozzarella_protein: { it: "Mozzarella protein", en: "High-protein mozzarella", gruppo: "formaggi", cat: "formaggio", glutine: "etichetta", nota: { it: "La versione protein spesso ha ingredienti aggiunti: controlla la dicitura senza glutine.", en: "Protein versions often have added ingredients: check the gluten-free wording." } },
  parmigiano: { it: "Parmigiano", en: "Parmesan (Parmigiano)", gruppo: "formaggi", glutine: "naturale", sale: true },

  /* Cereali da colazione: stessa grammatura, l'avena resta la prima scelta */
  avena: { it: "Fiocchi di avena senza glutine", en: "Gluten-free oat flakes", gruppo: "cereali", glutine: "certificata", nota: { it: "Solo avena certificata senza glutine.", en: "Only oats certified gluten free." } },
  fiocchi_saraceno: { it: "Fiocchi di grano saraceno", en: "Buckwheat flakes", gruppo: "cereali", glutine: "etichetta" },
  riso_soffiato: { it: "Riso soffiato integrale", en: "Puffed brown rice", gruppo: "cereali", glutine: "etichetta" },
  miglio_soffiato: { it: "Miglio soffiato", en: "Puffed millet", gruppo: "cereali", glutine: "etichetta" },
  quinoa_soffiata: { it: "Quinoa soffiata", en: "Puffed quinoa", gruppo: "cereali", glutine: "etichetta" },

  /* Pane e sostituti */
  pane_gf: { it: "Pane integrale senza glutine", en: "Gluten-free wholegrain bread", gruppo: "pane", glutine: "etichetta", sale: true, nota: { it: "Scegli quello con meno ingredienti.", en: "Pick the one with the fewest ingredients." } },
  gallette_riso: { it: "Gallette di riso integrale", en: "Brown rice cakes", gruppo: "pane", glutine: "etichetta" },
  gallette_saraceno: { it: "Gallette di grano saraceno", en: "Buckwheat cakes", gruppo: "pane", glutine: "etichetta" },
  piadina_gf: { it: "Piadina integrale senza glutine", en: "Gluten-free wholegrain flatbread (piadina)", gruppo: "pane", glutine: "etichetta", sale: true },
  pangrattato_gf: { it: "Pangrattato senza glutine", en: "Gluten-free breadcrumbs", gruppo: "pane", glutine: "etichetta" },
  farina_avena: { it: "Farina di avena senza glutine", en: "Gluten-free oat flour", gruppo: "pane", glutine: "certificata" },
  farina_saraceno: { it: "Farina di grano saraceno", en: "Buckwheat flour", gruppo: "pane", glutine: "etichetta" },
  patate: { it: "Patate", en: "Potatoes", gruppo: "pane", glutine: "naturale", nota: { it: "Le patate non sono verdure: sostituiscono il pane.", en: "Potatoes are not vegetables: they replace bread." } },

  /* Carboidrati del pranzo (peso a crudo) */
  pasta_saraceno: { it: "Pasta di grano saraceno", en: "Buckwheat pasta", gruppo: "cereali", glutine: "etichetta" },
  pasta_avena: { it: "Pasta di avena", en: "Oat pasta", gruppo: "cereali", glutine: "certificata" },
  pasta_riso_integrale: { it: "Pasta di riso integrale", en: "Brown rice pasta", gruppo: "cereali", glutine: "etichetta" },
  riso_basmati: { it: "Riso basmati", en: "Basmati rice", gruppo: "cereali", glutine: "naturale" },
  riso_venere: { it: "Riso venere", en: "Black rice (Venere)", gruppo: "cereali", glutine: "naturale" },
  riso_integrale: { it: "Riso integrale", en: "Brown rice", gruppo: "cereali", glutine: "naturale" },
  quinoa: { it: "Quinoa", en: "Quinoa", gruppo: "cereali", glutine: "etichetta" },
  grano_saraceno: { it: "Grano saraceno", en: "Buckwheat groats", gruppo: "cereali", glutine: "etichetta" },
  sorgo: { it: "Sorgo", en: "Sorghum", gruppo: "cereali", glutine: "etichetta" },
  miglio: { it: "Miglio", en: "Millet", gruppo: "cereali", glutine: "etichetta" },
  cereali_sg: { it: "Cereali senza glutine (a scelta tra quelli del pranzo)", en: "Gluten-free grains (any from the lunch list)", gruppo: "cereali", glutine: "etichetta" },

  /* Legumi */
  legumi_secchi: { it: "Legumi secchi", en: "Dried legumes", gruppo: "legumi", cat: "legumi", glutine: "naturale", nota: { it: "Lenticchie, ceci, fagioli, piselli secchi.", en: "Lentils, chickpeas, beans, dried peas." } },
  legumi_scolati: { it: "Legumi già scolati", en: "Cooked or canned legumes, drained", gruppo: "legumi", cat: "legumi", glutine: "etichetta", sale: true, nota: { it: "Se in scatola, scegli senza sale aggiunto.", en: "If canned, choose no added salt." } },
  hummus: { it: "Hummus di ceci", en: "Chickpea hummus", gruppo: "legumi", glutine: "etichetta", sale: true },

  /* Carne */
  pollo: { it: "Petto di pollo", en: "Chicken breast", gruppo: "carne", cat: "carne_bianca", glutine: "naturale" },
  tacchino: { it: "Petto di tacchino", en: "Turkey breast", gruppo: "carne", cat: "carne_bianca", glutine: "naturale" },
  coniglio: { it: "Coniglio", en: "Rabbit", gruppo: "carne", cat: "carne_bianca", glutine: "naturale" },
  vitello: { it: "Vitello magro", en: "Lean veal", gruppo: "carne", cat: "carne", glutine: "naturale" },
  maiale: { it: "Maiale magro", en: "Lean pork", gruppo: "carne", cat: "carne", glutine: "naturale" },
  ragu: { it: "Ragù", en: "Meat ragù", gruppo: "carne", cat: "carne", glutine: "etichetta", sale: true, nota: { it: "Meglio fatto in casa con carne magra e passata.", en: "Best homemade with lean meat and passata." } },
  prosciutto_cotto: { it: "Prosciutto cotto", en: "Cooked ham", gruppo: "carne", glutine: "etichetta", sale: true, nota: { it: "Carne lavorata: solo dentro il rotolo di frittata, al massimo una volta ogni due settimane.", en: "Processed meat: only inside the omelette roll, at most once every two weeks." } },

  /* Pesce */
  tonno: { it: "Tonno al naturale", en: "Tuna in water", gruppo: "pesce", cat: "pesce", glutine: "naturale", sale: true },
  salmone_affumicato: { it: "Salmone affumicato", en: "Smoked salmon", gruppo: "pesce", cat: "pesce", glutine: "naturale", sale: true },
  gamberi: { it: "Gamberi o gamberetti sgusciati", en: "Peeled prawns or shrimp", gruppo: "pesce", cat: "pesce", glutine: "naturale" },
  calamari: { it: "Calamaro, seppia o totano puliti", en: "Cleaned squid, cuttlefish or flying squid", gruppo: "pesce", cat: "pesce", glutine: "naturale" },
  polpo_cotto: { it: "Polpo cotto", en: "Cooked octopus", gruppo: "pesce", cat: "pesce", glutine: "naturale" },
  polpo_crudo: { it: "Polpo crudo", en: "Raw octopus", gruppo: "pesce", cat: "pesce", glutine: "naturale" },
  merluzzo: { it: "Filetto di merluzzo o nasello", en: "Cod or hake fillet", gruppo: "pesce", cat: "pesce", glutine: "naturale" },
  pesce_bianco: { it: "Filetto di platessa, orata o altro pesce bianco", en: "Plaice, sea bream or other white fish fillet", gruppo: "pesce", cat: "pesce", glutine: "naturale" },
  alici: { it: "Alici fresche", en: "Fresh anchovies", gruppo: "pesce", cat: "pesce", glutine: "naturale" },
  pesce_spada: { it: "Pesce spada fresco", en: "Fresh swordfish", gruppo: "pesce", cat: "pesce", glutine: "naturale" },
  salmone: { it: "Salmone fresco", en: "Fresh salmon", gruppo: "pesce", cat: "pesce", glutine: "naturale" },

  /* Uova */
  uovo: { it: "Uovo", en: "Egg", gruppo: "uova", cat: "uova", glutine: "naturale" },
  albume: { it: "Albume", en: "Egg white", gruppo: "uova", glutine: "naturale" },

  /* Frutta, frutta secca, dolci */
  frutta: { it: "Frutta fresca", en: "Fresh fruit", gruppo: "frutta", glutine: "naturale", nota: { it: "Meglio frutti ricchi di antiossidanti: more, lamponi, mirtilli, melograno, uva, agrumi.", en: "Best antioxidant-rich fruit: blackberries, raspberries, blueberries, pomegranate, grapes, citrus." } },
  prugne_secche: { it: "Prugne secche", en: "Prunes", gruppo: "frutta", glutine: "etichetta" },
  frutta_secca: { it: "Frutta secca (noci, mandorle, nocciole)", en: "Nuts (walnuts, almonds, hazelnuts)", gruppo: "frutta_secca", glutine: "naturale", nota: { it: "Al naturale: non salata, non tostata con aromi.", en: "Plain: unsalted, not flavoured." } },
  cioccolato: { it: "Cioccolato fondente 85-90%", en: "Dark chocolate 85-90%", gruppo: "dolci", glutine: "etichetta" },
  marmellata: { it: "Marmellata a ridotto contenuto di zuccheri", en: "Reduced-sugar jam", gruppo: "dolci", glutine: "etichetta", nota: { it: "Puoi aggiungere cannella.", en: "You can add cinnamon." } },
  miele: { it: "Miele", en: "Honey", gruppo: "dolci", glutine: "naturale" },

  /* Verdure e condimenti */
  verdure: { it: "Verdure a piacere (peso crudo)", en: "Vegetables of your choice (raw weight)", gruppo: "verdure", glutine: "naturale", nota: { it: "Di stagione e di colori diversi. Puoi mangiarne di più se non sei sazia, attenta al gonfiore.", en: "Seasonal and of different colours. You may eat more if still hungry, watch for bloating." } },
  minestrone: { it: "Minestrone di sole verdure", en: "Vegetable-only minestrone", gruppo: "verdure", glutine: "naturale", nota: { it: "Fatto in casa con sole verdure. Se confezionato, controlla glutine e ingredienti.", en: "Homemade with vegetables only. If packaged, check gluten and ingredients." } },
  olio_evo: { it: "Olio extravergine di oliva", en: "Extra virgin olive oil", gruppo: "grassi", glutine: "naturale", nota: { it: "10 g = 1 cucchiaio. La quantità non cambia anche se aumenti le verdure.", en: "10 g = 1 tablespoon. The amount stays the same even if you add vegetables." } },
  passata: { it: "Passata di pomodoro", en: "Tomato passata", gruppo: "condimenti", glutine: "etichetta" },
  pesto: { it: "Pesto", en: "Pesto", gruppo: "condimenti", glutine: "etichetta", sale: true, nota: { it: "Scegli un pesto con solo olio extravergine: niente olio di semi (girasole) negli ingredienti.", en: "Choose a pesto made with extra virgin olive oil only: no sunflower or other seed oil." } },
  olive: { it: "Olive piccole snocciolate", en: "Small pitted olives", gruppo: "condimenti", glutine: "naturale", sale: true },
  cannella: { it: "Cannella", en: "Cinnamon", gruppo: "spezie", glutine: "naturale" },
  limone: { it: "Limone", en: "Lemon", gruppo: "condimenti", glutine: "naturale", nota: { it: "Sulle verdure aumenta l'assorbimento del ferro.", en: "On vegetables it increases iron absorption." } },

  /* Bevande */
  acqua: { it: "Acqua ricca di calcio", en: "Calcium-rich water", gruppo: "bevande", glutine: "naturale" },
  caffe: { it: "Caffè senza zucchero", en: "Coffee without sugar", gruppo: "bevande", glutine: "naturale" },
  tisane: { it: "Tè verde o nero, tisane senza zucchero", en: "Green or black tea, herbal infusions without sugar", gruppo: "bevande", glutine: "etichetta", nota: { it: "Alcune miscele contengono orzo o malto: controlla.", en: "Some blends contain barley or malt: check." } },
};

/* Foods the plan explicitly says yes to, without grams (anti-inflammatory list, page 3). */
export const SI_ANTINFIAMMATORI = [
  { it: "Cereali integrali, meglio a chicco (il grano saraceno è il top)", en: "Whole grains, best as whole kernels (buckwheat is the top)" },
  { it: "Verdura di stagione, di colori diversi", en: "Seasonal vegetables of different colours" },
  { it: "Olio extravergine di oliva", en: "Extra virgin olive oil" },
  { it: "Pesce", en: "Fish" },
  { it: "Frutta secca", en: "Nuts" },
  { it: "Semi oleosi (chia, semi di lino)", en: "Oil seeds (chia, flax)" },
  { it: "Avocado", en: "Avocado" },
  { it: "Frutti ricchi di antiossidanti: more, lamponi, mirtilli, melograno, uva, agrumi", en: "Antioxidant-rich fruit: blackberries, raspberries, blueberries, pomegranate, grapes, citrus" },
  { it: "Cacao, come cioccolato al 90%", en: "Cocoa, such as 90% chocolate" },
  { it: "Spezie: zenzero, curcuma, cannella, origano, prezzemolo", en: "Spices: ginger, turmeric, cinnamon, oregano, parsley" },
  { it: "Tè verde o nero, tisane senza zucchero", en: "Green or black tea, unsweetened infusions" },
  { it: "Acqua", en: "Water" },
];

/* What the plan says to avoid (page 3 and 4). */
export const NO_ANTINFIAMMATORI = [
  { id: "raffinati", it: "Prodotti raffinati: prodotti da forno, confezionati e fortemente zuccherati", en: "Refined products: baked goods, packaged and very sugary foods" },
  { id: "carne_lavorata", it: "Carne lavorata: affettati, insaccati, wurstel, anche gli affettati di pollo", en: "Processed meat: cold cuts, cured sausages, frankfurters, chicken cold cuts too" },
  { id: "oli_raffinati", it: "Oli raffinati: mais, colza, girasole, arachide", en: "Refined oils: corn, rapeseed, sunflower, peanut" },
  { id: "fritti", it: "Fritti", en: "Fried food" },
  { id: "alcol", it: "Alcol", en: "Alcohol" },
  { id: "sale", it: "Sale in eccesso", en: "Excess salt" },
  { id: "additivi", it: "Prodotti senza glutine con liste ingredienti lunghe: mono e digliceridi degli acidi grassi, addensanti, emulsionanti, coloranti, stabilizzanti", en: "Gluten-free products with long ingredient lists: mono- and diglycerides of fatty acids, thickeners, emulsifiers, colourings, stabilisers" },
  { id: "pasta_mais", it: "A pranzo evitare pasta di mais o di riso semplice e paste con mono e digliceridi", en: "At lunch avoid corn pasta or plain rice pasta and pasta with mono- and diglycerides" },
];

export function nome(id, lang = "it") {
  const a = ALIMENTI[id];
  if (!a) return id;
  return lang === "en" ? a.en : a.it;
}
