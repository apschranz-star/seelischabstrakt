/*
 * Curated recipes. Each one cooks exactly one meal of the plan with the plan's
 * own amounts. The nutritionist wrote "Puoi fare la ricetta che vuoi,
 * l'importante e che rispetti le dosi": these are ways to cook her doses,
 * nothing more. Herbs, spices and lemon are free ("q.b."); salt is always
 * moderate.
 *
 * abbina: which plan options the recipe cooks
 *   { opzione: "c1" }                  breakfast, snack, after-dinner option
 *   { carb: [...], prot: [...] }       lunch: any listed carb works the same way
 *   { combinato: "pa1" }               ready-combined lunch
 *   { prot: [...], pane: "patate" }    dinner protein, with its bread choice
 *   { idea: "ci1" }                    ready-combined dinner idea
 *
 * Every recipe passes the council (test/ricette.test.mjs).
 */
const Q = (it, en) => ({ it, en });
const CEREALI_CHICCO = ["pc7", "pc8", "pc9", "pc10", "pc6", "pc5"];
const PASTE = ["pc1", "pc2", "pc3"];

export const RICETTE = [
  /* ------------------------------------------------------------ COLAZIONE */
  {
    id: "r-c1", pasto: "colazione", abbina: { opzione: "c1" }, minuti: 5, tag: ["fibre", "meal_prep"],
    titolo: Q("Overnight oats ai frutti di bosco", "Berry overnight oats"),
    ingredienti: [{ a: "yogurt_magro", q: 150, u: "g" }, { a: "avena", q: 25, u: "g" }, { a: "frutta", q: 80, u: "g", testo: Q("mirtilli e lamponi", "blueberries and raspberries") }],
    extra: [Q("cannella", "cinnamon"), Q("scorza di limone", "lemon zest")],
    passi: {
      it: ["La sera mescola yogurt e fiocchi di avena in un barattolo con un pizzico di cannella.", "Chiudi e lascia in frigo tutta la notte: l'avena diventa cremosa.", "Al mattino aggiungi i frutti di bosco e un po' di scorza di limone."],
      en: ["In the evening stir yogurt and oat flakes in a jar with a pinch of cinnamon.", "Close and leave in the fridge overnight: the oats turn creamy.", "In the morning add the berries and a little lemon zest."],
    },
  },
  {
    id: "r-c2", pasto: "colazione", abbina: { opzione: "c2" }, minuti: 3, tag: ["veloce"],
    titolo: Q("Yogurt, lamponi e scaglie di fondente", "Yogurt, raspberries and dark chocolate shavings"),
    ingredienti: [{ a: "yogurt_magro", q: 150, u: "g" }, { a: "frutta", q: 150, u: "g", testo: Q("lamponi o fragole", "raspberries or strawberries") }, { a: "cioccolato", q: 10, u: "g" }],
    extra: [],
    passi: {
      it: ["Versa lo yogurt in una ciotola.", "Aggiungi la frutta.", "Grattugia sopra il cioccolato fondente con una grattugia a fori larghi."],
      en: ["Spoon the yogurt into a bowl.", "Add the fruit.", "Grate the dark chocolate on top with a coarse grater."],
    },
  },
  {
    id: "r-c3", pasto: "colazione", abbina: { opzione: "c3" }, minuti: 4, tag: ["omega3_ala", "veloce"],
    titolo: Q("Yogurt con pera, noci e cannella", "Yogurt with pear, walnuts and cinnamon"),
    ingredienti: [{ a: "yogurt_magro", q: 150, u: "g" }, { a: "frutta", q: 150, u: "g", testo: Q("pera a cubetti", "diced pear") }, { a: "frutta_secca", q: 10, u: "g", testo: Q("noci", "walnuts") }],
    extra: [Q("cannella", "cinnamon")],
    passi: {
      it: ["Taglia la pera a cubetti.", "Spezzetta le noci con le mani.", "Unisci tutto allo yogurt e finisci con la cannella."],
      en: ["Dice the pear.", "Break the walnuts with your hands.", "Add everything to the yogurt and finish with cinnamon."],
    },
  },
  {
    id: "r-c4", pasto: "colazione", abbina: { opzione: "c4" }, minuti: 8, tag: ["calcio"],
    titolo: Q("Porridge al latte con mela e cannella", "Milk porridge with apple and cinnamon"),
    ingredienti: [{ a: "latte_ps", q: 150, u: "ml" }, { a: "avena", q: 20, u: "g" }, { a: "frutta", q: 100, u: "g", testo: Q("mela", "apple") }],
    extra: [Q("cannella", "cinnamon")],
    passi: {
      it: ["Porta il latte quasi a bollore con l'avena e mescola 4-5 minuti a fuoco basso.", "Grattugia o taglia la mela e aggiungila negli ultimi 2 minuti.", "Spegni, spolvera di cannella e lascia riposare un minuto."],
      en: ["Bring the milk almost to a simmer with the oats and stir for 4-5 minutes on low heat.", "Grate or dice the apple and add it in the last 2 minutes.", "Turn off, dust with cinnamon and let it rest a minute."],
    },
  },
  {
    id: "r-c5", pasto: "colazione", abbina: { opzione: "c5" }, minuti: 7, tag: ["calcio"],
    titolo: Q("Porridge cremoso al miele", "Creamy honey porridge"),
    ingredienti: [{ a: "latte_ps", q: 150, u: "ml" }, { a: "avena", q: 30, u: "g" }, { a: "miele", q: 10, u: "g", testo: Q("miele o marmellata", "honey or jam") }],
    extra: [Q("cannella", "cinnamon")],
    passi: {
      it: ["Cuoci l'avena nel latte a fuoco basso per 5 minuti, mescolando.", "Togli dal fuoco e aggiungi il miele (o la marmellata) solo alla fine.", "Una spolverata di cannella, se ti va."],
      en: ["Cook the oats in the milk on low heat for 5 minutes, stirring.", "Take off the heat and add the honey (or jam) only at the end.", "A dusting of cinnamon, if you like."],
    },
  },
  {
    id: "r-c6", pasto: "colazione", abbina: { opzione: "c6" }, minuti: 4, tag: ["veloce"],
    titolo: Q("Tartine di ricotta e marmellata", "Ricotta and jam toast"),
    ingredienti: [{ a: "pane_gf", q: 30, u: "g", testo: Q("o 2 gallette di grano saraceno o riso integrale", "or 2 buckwheat or brown rice cakes") }, { a: "ricotta_light", q: 90, u: "g" }, { a: "marmellata", q: 10, u: "g" }],
    extra: [Q("cannella", "cinnamon")],
    passi: {
      it: ["Tosta il pane (o usa le gallette).", "Spalma la ricotta e sopra la marmellata.", "Un pizzico di cannella sulla marmellata."],
      en: ["Toast the bread (or use the rice cakes).", "Spread the ricotta and the jam on top.", "A pinch of cinnamon over the jam."],
    },
  },

  /* --------------------------------------------------------------- PRANZO */
  {
    id: "r-p1", pasto: "pranzo", abbina: { carb: CEREALI_CHICCO, prot: ["pp3"] }, minuti: 25, tag: ["ferro_vitc"],
    titolo: Q("Grano saraceno, gamberi, zucchine e limone", "Buckwheat, prawns, courgettes and lemon"),
    ingredienti: [{ a: "grano_saraceno", q: 80, u: "g" }, { a: "gamberi", q: 70, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("zucchine e pomodorini", "courgettes and cherry tomatoes") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("limone", "lemon"), Q("prezzemolo", "parsley"), Q("pepe", "pepper")],
    passi: {
      it: ["Sciacqua il grano saraceno e cuocilo in acqua poco salata per 15 minuti, poi scola.", "Salta zucchine a rondelle e pomodorini in padella con un goccio d'acqua per 6-7 minuti.", "Aggiungi i gamberi e cuoci 2-3 minuti finché diventano rosa.", "Unisci il grano saraceno, spegni e condisci a crudo con olio, limone e prezzemolo."],
      en: ["Rinse the buckwheat and cook it in lightly salted water for 15 minutes, then drain.", "Sauté sliced courgettes and cherry tomatoes with a splash of water for 6-7 minutes.", "Add the prawns and cook 2-3 minutes until pink.", "Stir in the buckwheat, turn off the heat and dress with raw oil, lemon and parsley."],
    },
  },
  {
    id: "r-p2", pasto: "pranzo", abbina: { carb: CEREALI_CHICCO, prot: ["pp6"] }, minuti: 25, tag: ["spezie"],
    titolo: Q("Quinoa con pollo alla curcuma e peperoni", "Quinoa with turmeric chicken and peppers"),
    ingredienti: [{ a: "quinoa", q: 80, u: "g" }, { a: "pollo", q: 60, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("peperoni e cipolla rossa", "peppers and red onion") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("curcuma", "turmeric"), Q("zenzero", "ginger"), Q("pepe nero", "black pepper"), Q("limone", "lemon")],
    passi: {
      it: ["Sciacqua bene la quinoa e cuocila 12-14 minuti in acqua (il doppio del suo volume).", "Taglia il pollo a straccetti e rosolalo in padella antiaderente con curcuma, zenzero e pepe nero.", "Aggiungi peperoni e cipolla a listarelle e cuoci 8 minuti con un goccio d'acqua.", "Unisci la quinoa e condisci con l'olio a crudo e qualche goccia di limone."],
      en: ["Rinse the quinoa well and cook it 12-14 minutes in twice its volume of water.", "Cut the chicken into strips and brown it in a non-stick pan with turmeric, ginger and black pepper.", "Add peppers and onion in strips and cook 8 minutes with a splash of water.", "Stir in the quinoa and dress with the raw oil and a few drops of lemon."],
    },
  },
  {
    id: "r-p3", pasto: "pranzo", abbina: { carb: CEREALI_CHICCO, prot: ["pp5"] }, minuti: 30, tag: ["ferro_vitc"],
    titolo: Q("Miglio con polpo, sedano e prezzemolo", "Millet with octopus, celery and parsley"),
    ingredienti: [{ a: "miglio", q: 80, u: "g" }, { a: "polpo_cotto", q: 50, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("sedano, carote e rucola", "celery, carrots and rocket") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("limone", "lemon"), Q("prezzemolo", "parsley")],
    passi: {
      it: ["Tosta il miglio a secco 1 minuto, poi cuocilo 15-18 minuti in acqua.", "Taglia il polpo cotto a pezzetti, sedano e carote a cubetti.", "Unisci miglio tiepido, polpo e verdure, poi la rucola.", "Condisci con olio, tanto limone e prezzemolo."],
      en: ["Toast the millet dry for 1 minute, then cook it 15-18 minutes in water.", "Cut the cooked octopus into pieces, celery and carrots into small cubes.", "Combine warm millet, octopus and vegetables, then the rocket.", "Dress with oil, plenty of lemon and parsley."],
    },
  },
  {
    id: "r-p4", pasto: "pranzo", abbina: { carb: CEREALI_CHICCO, prot: ["pp4"] }, minuti: 40, tag: [],
    titolo: Q("Riso venere con calamari, zucchine e menta", "Black rice with squid, courgettes and mint"),
    ingredienti: [{ a: "riso_venere", q: 80, u: "g" }, { a: "calamari", q: 70, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("zucchine", "courgettes") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("menta", "mint"), Q("limone", "lemon")],
    passi: {
      it: ["Cuoci il riso venere in acqua per circa 35 minuti (vedi confezione).", "Taglia i calamari ad anelli e le zucchine a cubetti.", "Salta le zucchine 5 minuti, poi i calamari 2-3 minuti: di più diventano gommosi.", "Unisci il riso, menta spezzettata, olio a crudo e limone."],
      en: ["Cook the black rice in water for about 35 minutes (see pack).", "Cut the squid into rings and the courgettes into cubes.", "Sauté the courgettes 5 minutes, then the squid 2-3 minutes: longer and it turns rubbery.", "Stir in the rice, torn mint, raw oil and lemon."],
    },
  },
  {
    id: "r-p5", pasto: "pranzo", abbina: { carb: PASTE, prot: ["pp1"] }, minuti: 20, tag: [],
    titolo: Q("Pasta di grano saraceno al pomodoro con tonno", "Buckwheat pasta with tomato and tuna"),
    ingredienti: [{ a: "pasta_saraceno", q: 80, u: "g" }, { a: "tonno", q: 60, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("melanzane e pomodorini", "aubergine and cherry tomatoes") }, { a: "olio_evo", q: 10, u: "g" }, { a: "passata", q: null, u: "q.b." }],
    extra: [Q("origano", "oregano"), Q("basilico", "basil")],
    passi: {
      it: ["Cuoci le melanzane a cubetti in padella con un goccio d'acqua per 8 minuti.", "Aggiungi passata e pomodorini e lascia sobbollire 5 minuti.", "Cuoci la pasta al dente, scolala e uniscila al sugo con il tonno sgocciolato.", "Fuori dal fuoco: olio a crudo, origano e basilico."],
      en: ["Cook diced aubergine in a pan with a splash of water for 8 minutes.", "Add passata and cherry tomatoes and simmer 5 minutes.", "Cook the pasta al dente, drain and add it to the sauce with the drained tuna.", "Off the heat: raw oil, oregano and basil."],
    },
  },
  {
    id: "r-p6", pasto: "pranzo", abbina: { carb: PASTE, prot: ["pp7"] }, minuti: 15, tag: ["calcio", "veloce"],
    titolo: Q("Pasta di riso integrale alla caprese tiepida", "Warm caprese brown rice pasta"),
    ingredienti: [{ a: "pasta_riso_integrale", q: 80, u: "g" }, { a: "mozzarella_light", q: 50, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("pomodorini e rucola", "cherry tomatoes and rocket") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("basilico", "basil"), Q("origano", "oregano")],
    passi: {
      it: ["Taglia pomodorini e mozzarella a cubetti.", "Cuoci la pasta e scolala al dente.", "Mescola subito con pomodorini, mozzarella e basilico: il calore la ammorbidisce.", "Servi su un letto di rucola con l'olio a crudo."],
      en: ["Dice the cherry tomatoes and mozzarella.", "Cook the pasta and drain it al dente.", "Toss at once with tomatoes, mozzarella and basil: the heat softens it.", "Serve on a bed of rocket with the raw oil."],
    },
  },
  {
    id: "r-p7", pasto: "pranzo", abbina: { carb: ["pc11"], prot: ["pp11"] }, minuti: 30, tag: ["ferro_vitc", "fibre"],
    titolo: Q("Lenticchie con uovo in camicia e spinaci al limone", "Lentils with poached egg and lemony spinach"),
    ingredienti: [{ a: "legumi_secchi", q: 70, u: "g", testo: Q("lenticchie secche (o 180 g già cotte)", "dried lentils (or 180 g cooked)") }, { a: "uovo", q: 1, u: "pz" }, { a: "verdure", q: 300, u: "g", testo: Q("spinaci e carote", "spinach and carrots") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("limone", "lemon"), Q("cumino", "cumin"), Q("alloro", "bay leaf")],
    passi: {
      it: ["Cuoci le lenticchie 20-25 minuti con una foglia di alloro e le carote a rondelle.", "Appassisci gli spinaci in padella 2 minuti.", "Porta l'acqua a un leggero bollore, crea un vortice e cuoci l'uovo 3 minuti.", "Componi: lenticchie, spinaci con molto limone (aiuta il ferro), uovo sopra, olio e cumino."],
      en: ["Cook the lentils 20-25 minutes with a bay leaf and sliced carrots.", "Wilt the spinach in a pan for 2 minutes.", "Bring water to a gentle simmer, swirl and poach the egg 3 minutes.", "Assemble: lentils, spinach with plenty of lemon (it helps iron), egg on top, oil and cumin."],
    },
  },
  {
    id: "r-p8", pasto: "pranzo", abbina: { carb: ["pc11"], prot: ["pp8", "pp9"] }, minuti: 10, tag: ["fibre", "veloce"],
    titolo: Q("Insalata di ceci, fiocchi di latte ed erbe", "Chickpea salad with cottage cheese and herbs"),
    ingredienti: [{ a: "legumi_scolati", q: 180, u: "g", testo: Q("ceci già cotti, sciacquati", "cooked chickpeas, rinsed") }, { a: "fiocchi_latte", q: 70, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("cetrioli, pomodori, cipolla rossa", "cucumber, tomatoes, red onion") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("limone", "lemon"), Q("menta", "mint"), Q("prezzemolo", "parsley")],
    passi: {
      it: ["Sciacqua i ceci sotto l'acqua corrente.", "Taglia le verdure a cubetti piccoli e la cipolla sottile.", "Mescola ceci e verdure con olio, limone ed erbe.", "Aggiungi i fiocchi di latte al momento di servire."],
      en: ["Rinse the chickpeas under running water.", "Cut the vegetables into small cubes and the onion thinly.", "Toss chickpeas and vegetables with oil, lemon and herbs.", "Add the cottage cheese just before serving."],
    },
  },
  {
    id: "r-p9", pasto: "pranzo", abbina: { carb: CEREALI_CHICCO, prot: ["pp11"] }, minuti: 25, tag: [],
    titolo: Q("Riso integrale con frittatina di zucchine", "Brown rice with a small courgette omelette"),
    ingredienti: [{ a: "riso_integrale", q: 80, u: "g" }, { a: "uovo", q: 1, u: "pz" }, { a: "verdure", q: 300, u: "g", testo: Q("zucchine e insalata", "courgettes and salad") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("erba cipollina", "chives"), Q("pepe", "pepper")],
    passi: {
      it: ["Cuoci il riso integrale (circa 30-40 minuti, vedi confezione).", "Grattugia una zucchina, sbattila con l'uovo e l'erba cipollina.", "Cuoci la frittatina in padella antiaderente 2 minuti per lato, poi tagliala a strisce.", "Servi con il riso, le altre verdure e l'olio a crudo."],
      en: ["Cook the brown rice (about 30-40 minutes, see pack).", "Grate a courgette and beat it with the egg and chives.", "Cook the omelette in a non-stick pan 2 minutes per side, then cut into strips.", "Serve with the rice, the remaining vegetables and the raw oil."],
    },
  },
  {
    id: "r-p10", pasto: "pranzo", abbina: { carb: PASTE, prot: ["pp9"] }, minuti: 15, tag: ["calcio", "veloce"],
    titolo: Q("Pasta di avena con ricotta, limone e spinaci", "Oat pasta with ricotta, lemon and spinach"),
    ingredienti: [{ a: "pasta_avena", q: 80, u: "g" }, { a: "ricotta_light", q: 50, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("spinaci e zucchine", "spinach and courgettes") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("scorza di limone", "lemon zest"), Q("noce moscata", "nutmeg"), Q("pepe", "pepper")],
    passi: {
      it: ["Cuoci le verdure in padella con un goccio d'acqua.", "Lavora la ricotta con scorza di limone, noce moscata e due cucchiai di acqua di cottura.", "Scola la pasta e mantecala fuori dal fuoco con la ricotta e le verdure.", "Olio a crudo e pepe."],
      en: ["Cook the vegetables in a pan with a splash of water.", "Mix the ricotta with lemon zest, nutmeg and two spoons of pasta water.", "Drain the pasta and stir it off the heat with the ricotta and vegetables.", "Raw oil and pepper."],
    },
  },
  {
    id: "r-p11", pasto: "pranzo", abbina: { carb: CEREALI_CHICCO, prot: ["pp2"] }, minuti: 20, tag: ["omega3"],
    titolo: Q("Quinoa, salmone affumicato e finocchio", "Quinoa, smoked salmon and fennel"),
    ingredienti: [{ a: "quinoa", q: 80, u: "g" }, { a: "salmone_affumicato", q: 40, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("finocchio e rucola", "fennel and rocket") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("scorza d'arancia", "orange zest"), Q("aneto", "dill"), Q("pepe", "pepper")],
    passi: {
      it: ["Cuoci la quinoa e lasciala intiepidire.", "Affetta il finocchio sottilissimo.", "Unisci quinoa, finocchio, rucola e il salmone a striscioline.", "Condisci con olio, scorza d'arancia e aneto. Niente sale: il salmone affumicato lo è già."],
      en: ["Cook the quinoa and let it cool a little.", "Slice the fennel very thinly.", "Combine quinoa, fennel, rocket and the salmon in strips.", "Dress with oil, orange zest and dill. No salt: smoked salmon is salty already."],
    },
  },
  {
    id: "r-p12", pasto: "pranzo", abbina: { carb: [...CEREALI_CHICCO, ...PASTE], prot: ["pp12"] }, minuti: 60, tag: ["meal_prep"],
    titolo: Q("Sorgo con ragù fatto in casa", "Sorghum with homemade ragù"),
    ingredienti: [{ a: "sorgo", q: 80, u: "g" }, { a: "ragu", q: 90, u: "g", testo: Q("ragù fatto in casa con carne magra e passata", "homemade ragù with lean meat and passata") }, { a: "verdure", q: 300, u: "g", testo: Q("contorno di verdure", "side of vegetables") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("sedano, carota, cipolla per il soffritto", "celery, carrot, onion for the base"), Q("alloro", "bay leaf")],
    passi: {
      it: ["Cuoci il sorgo (ammollo di qualche ora, poi 40-50 minuti) o usa un altro cereale del piano.", "Per il ragù: soffriggi sedano, carota e cipolla con un goccio d'acqua, aggiungi carne magra e passata, cuoci piano almeno 40 minuti. Fanne di più e congela a porzioni da 90 g.", "Condisci il sorgo con 90 g di ragù.", "Verdure a parte con l'olio a crudo."],
      en: ["Cook the sorghum (soak a few hours, then 40-50 minutes) or use another grain from the plan.", "For the ragù: soften celery, carrot and onion with a splash of water, add lean meat and passata, simmer at least 40 minutes. Make more and freeze in 90 g portions.", "Top the sorghum with 90 g ragù.", "Vegetables on the side with the raw oil."],
    },
  },
  {
    id: "r-p13", pasto: "pranzo", abbina: { carb: CEREALI_CHICCO, prot: ["pp10"] }, minuti: 20, tag: [],
    titolo: Q("Grano saraceno cremoso con zucchine, menta e formaggio spalmabile", "Creamy buckwheat with courgettes, mint and cream cheese"),
    ingredienti: [{ a: "grano_saraceno", q: 80, u: "g" }, { a: "philadelphia_light", q: 40, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("zucchine", "courgettes") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("menta", "mint"), Q("scorza di limone", "lemon zest")],
    passi: {
      it: ["Cuoci il grano saraceno 15 minuti e scolalo.", "Cuoci le zucchine a cubetti in padella 6-7 minuti.", "Fuori dal fuoco unisci grano saraceno, formaggio spalmabile, menta e scorza di limone.", "Olio a crudo."],
      en: ["Cook the buckwheat 15 minutes and drain.", "Cook diced courgettes in a pan 6-7 minutes.", "Off the heat combine buckwheat, cream cheese, mint and lemon zest.", "Raw oil."],
    },
  },
  {
    id: "r-p14", pasto: "pranzo", abbina: { carb: ["pc4", "pc6", "pc5"], prot: ["pp3", "pp4"] }, minuti: 20, tag: ["spezie"],
    titolo: Q("Riso basmati con gamberi allo zenzero e verdure saltate", "Basmati rice with ginger prawns and stir-fried vegetables"),
    ingredienti: [{ a: "riso_basmati", q: 80, u: "g" }, { a: "gamberi", q: 70, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("broccoli, carote, cipollotto", "broccoli, carrots, spring onion") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("zenzero fresco", "fresh ginger"), Q("lime o limone", "lime or lemon"), Q("coriandolo o prezzemolo", "coriander or parsley")],
    passi: {
      it: ["Cuoci il riso basmati (10-12 minuti).", "Salta le verdure tagliate piccole a fuoco alto con un goccio d'acqua e lo zenzero grattugiato.", "Aggiungi i gamberi per 2-3 minuti.", "Servi sul riso con l'olio a crudo, succo di lime ed erbe."],
      en: ["Cook the basmati rice (10-12 minutes).", "Stir-fry the finely cut vegetables on high heat with a splash of water and grated ginger.", "Add the prawns for 2-3 minutes.", "Serve over the rice with the raw oil, lime juice and herbs."],
    },
  },
  {
    id: "r-pa1", pasto: "pranzo", abbina: { combinato: "pa1" }, minuti: 15, tag: ["veloce"],
    titolo: Q("Pasta al pesto con fagiolini e zucchine", "Pesto pasta with green beans and courgettes"),
    ingredienti: [{ a: "pasta_saraceno", q: 80, u: "g", testo: Q("o un'altra pasta o riso del piano", "or another pasta or rice from the plan") }, { a: "pesto", q: 30, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("fagiolini e zucchine", "green beans and courgettes") }],
    extra: [Q("basilico", "basil")],
    passi: {
      it: ["Cuoci fagiolini e zucchine a pezzetti nella stessa acqua della pasta, qualche minuto prima di lei.", "Scola tutto insieme.", "Condisci con il pesto fuori dal fuoco. Qui niente olio in più: c'è già nel pesto."],
      en: ["Cook green beans and courgettes in the pasta water, a few minutes before the pasta.", "Drain everything together.", "Toss with the pesto off the heat. No extra oil here: the pesto has it."],
    },
  },
  {
    id: "r-pa2", pasto: "pranzo", abbina: { combinato: "pa2" }, minuti: 30, tag: ["meal_prep"],
    titolo: Q("Insalata di riso con tonno, mozzarella e olive", "Rice salad with tuna, mozzarella and olives"),
    ingredienti: [{ a: "riso_integrale", q: 80, u: "g", testo: Q("o un'altra pasta o riso del piano", "or another pasta or rice from the plan") }, { a: "tonno", q: 30, u: "g" }, { a: "mozzarella_light", q: 30, u: "g" }, { a: "olive", q: 10, u: "pz" }, { a: "verdure", q: 300, u: "g", testo: Q("pomodorini, peperoni, cetrioli", "cherry tomatoes, peppers, cucumber") }, { a: "olio_evo", q: 5, u: "g" }],
    extra: [Q("basilico", "basil"), Q("origano", "oregano")],
    passi: {
      it: ["Cuoci il riso, scolalo e allargalo su un piatto a raffreddare.", "Taglia verdure e mozzarella a cubetti, le olive a metà.", "Unisci tutto con il tonno sgocciolato, 5 g di olio ed erbe. Si conserva in frigo un giorno."],
      en: ["Cook the rice, drain and spread it on a plate to cool.", "Dice the vegetables and mozzarella, halve the olives.", "Combine everything with the drained tuna, 5 g oil and herbs. Keeps in the fridge for a day."],
    },
  },
  {
    id: "r-pa3", pasto: "pranzo", abbina: { combinato: "pa3" }, minuti: 20, tag: ["meal_prep"],
    titolo: Q("Insalata di pasta con uovo sodo e tonno", "Pasta salad with hard-boiled egg and tuna"),
    ingredienti: [{ a: "pasta_riso_integrale", q: 80, u: "g", testo: Q("o un'altra pasta o riso del piano", "or another pasta or rice from the plan") }, { a: "uovo", q: 1, u: "pz", testo: Q("uovo sodo", "hard-boiled egg") }, { a: "tonno", q: 30, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("pomodorini, rucola, carote", "cherry tomatoes, rocket, carrots") }, { a: "olio_evo", q: 5, u: "g" }],
    extra: [Q("capperi (pochi, sciacquati)", "capers (a few, rinsed)"), Q("prezzemolo", "parsley")],
    passi: {
      it: ["Cuoci l'uovo 9 minuti da quando l'acqua bolle, poi in acqua fredda.", "Cuoci la pasta, scolala e passala sotto l'acqua fredda.", "Unisci pasta, verdure, tonno e l'uovo a spicchi con 5 g di olio."],
      en: ["Boil the egg 9 minutes from when the water boils, then into cold water.", "Cook the pasta, drain and rinse under cold water.", "Combine pasta, vegetables, tuna and the egg in wedges with 5 g oil."],
    },
  },

  /* ----------------------------------------------------------------- CENA */
  {
    id: "r-n1", pasto: "cena", abbina: { prot: ["cp1"], variante: "pollo", pane: "patate" }, minuti: 45, tag: [],
    titolo: Q("Pollo al limone e rosmarino con verdure e patate al forno", "Lemon rosemary chicken with roasted vegetables and potatoes"),
    ingredienti: [{ a: "pollo", q: 150, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("peperoni, zucchine, cipolla", "peppers, courgettes, onion") }, { a: "olio_evo", q: 10, u: "g" }, { a: "patate", q: 200, u: "g" }],
    extra: [Q("limone", "lemon"), Q("rosmarino", "rosemary"), Q("pepe", "pepper")],
    passi: {
      it: ["Forno a 200 gradi. Taglia patate e verdure a pezzi simili.", "Metti in teglia con rosmarino e metà dell'olio, inforna 20 minuti.", "Aggiungi il petto di pollo con scorza e succo di limone, altri 15-18 minuti.", "Il resto dell'olio a crudo prima di servire."],
      en: ["Oven at 200 degrees C. Cut potatoes and vegetables into similar pieces.", "Put them in a tray with rosemary and half the oil, bake 20 minutes.", "Add the chicken breast with lemon zest and juice, another 15-18 minutes.", "The rest of the oil raw before serving."],
    },
  },
  {
    id: "r-n2", pasto: "cena", abbina: { prot: ["cp1"], variante: "tacchino", pane: "pane_gf" }, minuti: 25, tag: [],
    titolo: Q("Cotolette di tacchino al forno con farina di avena", "Oven-baked turkey cutlets in oat flour"),
    ingredienti: [{ a: "tacchino", q: 150, u: "g" }, { a: "farina_avena", q: 14, u: "g", testo: Q("14 g di farina = 20 g di pane", "14 g flour = 20 g bread") }, { a: "pane_gf", q: 40, u: "g", testo: Q("il resto dei 60 g di pane", "the rest of the 60 g bread") }, { a: "verdure", q: 300, u: "g", testo: Q("insalata mista e carote", "mixed salad and carrots") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("paprika", "paprika"), Q("erbe aromatiche", "herbs"), Q("limone", "lemon")],
    passi: {
      it: ["Il piano dice: per infarinare 10 g di pane = 7 g di farina. Quindi 14 g di farina di avena valgono 20 g di pane, e restano 40 g di pane.", "Passa le fettine di tacchino inumidite nella farina con paprika ed erbe.", "Cuoci in forno a 200 gradi su carta forno 12-15 minuti, girandole a metà.", "Servi con verdure, olio a crudo, limone e 40 g di pane."],
      en: ["The plan says: for flouring 10 g bread = 7 g flour. So 14 g oat flour count as 20 g bread, and 40 g bread are left.", "Coat the damp turkey slices in the flour with paprika and herbs.", "Bake at 200 degrees C on baking paper 12-15 minutes, turning halfway.", "Serve with vegetables, raw oil, lemon and 40 g bread."],
    },
  },
  {
    id: "r-n3", pasto: "cena", abbina: { prot: ["cp1"], variante: "coniglio", pane: "gallette" }, minuti: 60, tag: [],
    titolo: Q("Coniglio in umido al pomodoro e rosmarino", "Rabbit stewed with tomato and rosemary"),
    ingredienti: [{ a: "coniglio", q: 150, u: "g" }, { a: "passata", q: null, u: "q.b." }, { a: "verdure", q: 300, u: "g", testo: Q("cipolla, carote, sedano e bietole", "onion, carrots, celery and chard") }, { a: "olio_evo", q: 10, u: "g" }, { a: "gallette_saraceno", q: 5, u: "pz", testo: Q("5 gallette (o 60 g di pane)", "5 rice cakes (or 60 g bread)") }],
    extra: [Q("rosmarino", "rosemary"), Q("salvia", "sage"), Q("alloro", "bay leaf")],
    passi: {
      it: ["Rosola il coniglio a pezzi in casseruola con un goccio d'acqua e le erbe.", "Aggiungi cipolla, carote e sedano a cubetti, poi la passata.", "Copri e cuoci a fuoco basso 40-45 minuti, aggiungendo acqua se serve.", "Bietole saltate a parte, olio a crudo, gallette."],
      en: ["Brown the rabbit pieces in a casserole with a splash of water and the herbs.", "Add diced onion, carrots and celery, then the passata.", "Cover and cook on low heat 40-45 minutes, adding water if needed.", "Chard sautéed on the side, raw oil, rice cakes."],
    },
  },
  {
    id: "r-n4", pasto: "cena", abbina: { prot: ["cp2"], pane: "pane_gf" }, minuti: 15, tag: ["ferro_vitc"],
    titolo: Q("Scaloppine di vitello al limone con spinaci", "Veal escalopes with lemon and spinach"),
    ingredienti: [{ a: "vitello", q: 130, u: "g", testo: Q("o maiale magro", "or lean pork") }, { a: "farina_saraceno", q: 7, u: "g", testo: Q("7 g di farina = 10 g di pane", "7 g flour = 10 g bread") }, { a: "pane_gf", q: 50, u: "g", testo: Q("il resto dei 60 g di pane", "the rest of the 60 g bread") }, { a: "verdure", q: 300, u: "g", testo: Q("spinaci", "spinach") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("limone", "lemon"), Q("prezzemolo", "parsley")],
    passi: {
      it: ["Infarina le fettine con 7 g di farina di grano saraceno (valgono 10 g di pane: restano 50 g di pane).", "Cuocile in padella con metà dell'olio, 1-2 minuti per lato.", "Sfuma con il succo di un limone e un cucchiaio d'acqua, il sughetto si addensa.", "Spinaci saltati con il resto dell'olio e prezzemolo."],
      en: ["Coat the slices with 7 g buckwheat flour (counts as 10 g bread: 50 g bread left).", "Cook them in a pan with half the oil, 1-2 minutes per side.", "Add the juice of a lemon and a spoon of water, the sauce thickens.", "Spinach sautéed with the rest of the oil and parsley."],
    },
  },
  {
    id: "r-n5", pasto: "cena", abbina: { prot: ["cp3"], pane: "pane_gf" }, minuti: 25, tag: [],
    titolo: Q("Frittata al forno con zucchine e menta", "Baked frittata with courgettes and mint"),
    ingredienti: [{ a: "uovo", q: 2, u: "pz" }, { a: "albume", q: 50, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("zucchine e insalata", "courgettes and salad") }, { a: "olio_evo", q: 10, u: "g" }, { a: "pane_gf", q: 60, u: "g" }],
    extra: [Q("menta", "mint"), Q("pepe", "pepper")],
    passi: {
      it: ["Forno a 180 gradi. Cuoci le zucchine a rondelle in padella 5 minuti.", "Sbatti uova e albume con menta e pepe, unisci le zucchine.", "Versa in una pirofila piccola unta con un filo dell'olio, inforna 15-18 minuti.", "Servi con insalata, il resto dell'olio e il pane."],
      en: ["Oven at 180 degrees C. Cook sliced courgettes in a pan 5 minutes.", "Beat eggs and egg white with mint and pepper, add the courgettes.", "Pour into a small dish greased with a little of the oil, bake 15-18 minutes.", "Serve with salad, the rest of the oil and the bread."],
    },
  },
  {
    id: "r-n6", pasto: "cena", abbina: { prot: ["cp4"], pane: "patate" }, minuti: 20, tag: ["ferro_vitc"],
    titolo: Q("Polpo e patate al prezzemolo", "Octopus and potatoes with parsley"),
    ingredienti: [{ a: "polpo_cotto", q: 160, u: "g", testo: Q("o 270 g crudo", "or 270 g raw") }, { a: "patate", q: 200, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("fagiolini e sedano", "green beans and celery") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("limone", "lemon"), Q("prezzemolo", "parsley"), Q("pepe", "pepper")],
    passi: {
      it: ["Lessa le patate a cubetti e i fagiolini.", "Taglia il polpo cotto a pezzi (se crudo: 45-50 minuti in acqua che sobbolle).", "Unisci tutto ancora tiepido.", "Condisci con olio, limone, prezzemolo e pepe."],
      en: ["Boil the diced potatoes and the green beans.", "Cut the cooked octopus into pieces (if raw: 45-50 minutes in simmering water).", "Combine everything while still warm.", "Dress with oil, lemon, parsley and pepper."],
    },
  },
  {
    id: "r-n7", pasto: "cena", abbina: { prot: ["cp5"], pane: "gallette" }, minuti: 15, tag: [],
    titolo: Q("Calamari alla griglia con insalata di finocchi", "Grilled squid with fennel salad"),
    ingredienti: [{ a: "calamari", q: 200, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("finocchi, rucola e ravanelli", "fennel, rocket and radishes") }, { a: "olio_evo", q: 10, u: "g" }, { a: "gallette_saraceno", q: 5, u: "pz", testo: Q("5 gallette (o 60 g di pane)", "5 rice cakes (or 60 g bread)") }],
    extra: [Q("limone", "lemon"), Q("prezzemolo", "parsley")],
    passi: {
      it: ["Scalda bene una griglia o una padella di ghisa.", "Cuoci i calamari interi 2 minuti per lato, poi tagliali ad anelli.", "Affetta sottili finocchi e ravanelli, unisci la rucola.", "Olio, limone e prezzemolo su tutto."],
      en: ["Heat a grill or cast-iron pan well.", "Cook the whole squid 2 minutes per side, then cut into rings.", "Thinly slice fennel and radishes, add the rocket.", "Oil, lemon and parsley over everything."],
    },
  },
  {
    id: "r-n8", pasto: "cena", abbina: { prot: ["cp6"], pane: "pane_gf" }, minuti: 25, tag: [],
    titolo: Q("Merluzzo al cartoccio con pomodorini e capperi", "Cod in parchment with cherry tomatoes and capers"),
    ingredienti: [{ a: "merluzzo", q: 210, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("pomodorini e zucchine", "cherry tomatoes and courgettes") }, { a: "olio_evo", q: 10, u: "g" }, { a: "pane_gf", q: 60, u: "g" }],
    extra: [Q("capperi (pochi, sciacquati)", "capers (a few, rinsed)"), Q("origano", "oregano"), Q("limone", "lemon")],
    passi: {
      it: ["Forno a 200 gradi.", "Su carta forno: zucchine a rondelle, il filetto, pomodorini, capperi sciacquati, origano.", "Chiudi bene il cartoccio e inforna 15-18 minuti.", "Apri a tavola e condisci con l'olio a crudo e limone."],
      en: ["Oven at 200 degrees C.", "On baking paper: sliced courgettes, the fillet, cherry tomatoes, rinsed capers, oregano.", "Seal the parcel well and bake 15-18 minutes.", "Open at the table and dress with the raw oil and lemon."],
    },
  },
  {
    id: "r-n9", pasto: "cena", abbina: { prot: ["cp7"], pane: "gallette" }, minuti: 15, tag: ["spezie", "veloce"],
    titolo: Q("Gamberi in padella con zucchine e zenzero", "Pan-fried prawns with courgettes and ginger"),
    ingredienti: [{ a: "gamberi", q: 180, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("zucchine e cipollotto", "courgettes and spring onion") }, { a: "olio_evo", q: 10, u: "g" }, { a: "gallette_riso", q: 5, u: "pz", testo: Q("5 gallette (o 60 g di pane)", "5 rice cakes (or 60 g bread)") }],
    extra: [Q("zenzero", "ginger"), Q("lime o limone", "lime or lemon"), Q("prezzemolo", "parsley")],
    passi: {
      it: ["Taglia zucchine a bastoncini e cipollotto a rondelle.", "Saltali a fuoco alto 4-5 minuti con un goccio d'acqua e lo zenzero grattugiato.", "Aggiungi i gamberi per 2-3 minuti.", "Olio a crudo, lime e prezzemolo."],
      en: ["Cut courgettes into sticks and spring onion into rings.", "Stir-fry on high heat 4-5 minutes with a splash of water and grated ginger.", "Add the prawns for 2-3 minutes.", "Raw oil, lime and parsley."],
    },
  },
  {
    id: "r-n10", pasto: "cena", abbina: { prot: ["cp8"], pane: "patate" }, minuti: 35, tag: [],
    titolo: Q("Orata al forno con patate e pomodorini", "Baked sea bream with potatoes and cherry tomatoes"),
    ingredienti: [{ a: "pesce_bianco", q: 180, u: "g", testo: Q("filetto di orata o platessa", "sea bream or plaice fillet") }, { a: "patate", q: 200, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("pomodorini e insalata", "cherry tomatoes and salad") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("timo", "thyme"), Q("limone", "lemon")],
    passi: {
      it: ["Forno a 200 gradi. Patate a fette sottili in teglia con metà dell'olio, 20 minuti.", "Aggiungi i filetti, i pomodorini e il timo, altri 10-12 minuti.", "Servi con insalata, il resto dell'olio e limone."],
      en: ["Oven at 200 degrees C. Thinly sliced potatoes in a tray with half the oil, 20 minutes.", "Add the fillets, cherry tomatoes and thyme, another 10-12 minutes.", "Serve with salad, the rest of the oil and lemon."],
    },
  },
  {
    id: "r-n11", pasto: "cena", abbina: { prot: ["cp9"], pane: "pane_gf" }, minuti: 25, tag: ["omega3"],
    titolo: Q("Alici gratinate al limone", "Baked anchovies with lemon crumbs"),
    ingredienti: [{ a: "alici", q: 160, u: "g" }, { a: "pangrattato_gf", q: 20, u: "g", testo: Q("20 g di pangrattato = 20 g di pane", "20 g breadcrumbs = 20 g bread") }, { a: "pane_gf", q: 40, u: "g", testo: Q("il resto dei 60 g di pane", "the rest of the 60 g bread") }, { a: "verdure", q: 300, u: "g", testo: Q("insalata e pomodori", "salad and tomatoes") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("scorza di limone", "lemon zest"), Q("prezzemolo", "parsley"), Q("origano", "oregano")],
    passi: {
      it: ["Il piano dice: per panare 10 g di pane = 10 g di pangrattato. Quindi 20 g di pangrattato e 40 g di pane.", "Apri le alici a libro e disponile in teglia.", "Copri con pangrattato, scorza di limone, prezzemolo e un filo dell'olio.", "Forno a 200 gradi per 10-12 minuti. Servi con insalata, il resto dell'olio e il pane."],
      en: ["The plan says: for breading 10 g bread = 10 g breadcrumbs. So 20 g breadcrumbs and 40 g bread.", "Open the anchovies flat and lay them in a tray.", "Cover with breadcrumbs, lemon zest, parsley and a little of the oil.", "Bake at 200 degrees C for 10-12 minutes. Serve with salad, the rest of the oil and the bread."],
    },
  },
  {
    id: "r-n12", pasto: "cena", abbina: { prot: ["cp10"], pane: "pane_gf" }, minuti: 15, tag: [],
    titolo: Q("Pesce spada alla griglia con salmoriglio", "Grilled swordfish with salmoriglio"),
    ingredienti: [{ a: "pesce_spada", q: 130, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("verdure grigliate", "grilled vegetables") }, { a: "olio_evo", q: 10, u: "g", testo: Q("nel salmoriglio", "in the salmoriglio") }, { a: "pane_gf", q: 60, u: "g" }],
    extra: [Q("limone", "lemon"), Q("origano", "oregano"), Q("prezzemolo", "parsley")],
    passi: {
      it: ["Salmoriglio: sbatti l'olio con succo di limone, un cucchiaio d'acqua tiepida, origano e prezzemolo.", "Griglia la fetta di pesce spada 2-3 minuti per lato.", "Griglia anche le verdure a fette.", "Versa il salmoriglio sul pesce caldo."],
      en: ["Salmoriglio: whisk the oil with lemon juice, a spoon of warm water, oregano and parsley.", "Grill the swordfish steak 2-3 minutes per side.", "Grill the sliced vegetables too.", "Pour the salmoriglio over the hot fish."],
    },
  },
  {
    id: "r-n13", pasto: "cena", abbina: { prot: ["cp11"], pane: "patate" }, minuti: 30, tag: ["omega3"],
    titolo: Q("Salmone al forno con broccoli e limone", "Baked salmon with broccoli and lemon"),
    ingredienti: [{ a: "salmone", q: 90, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("broccoli", "broccoli") }, { a: "olio_evo", q: 10, u: "g" }, { a: "patate", q: 200, u: "g" }],
    extra: [Q("limone", "lemon"), Q("aneto o prezzemolo", "dill or parsley"), Q("pepe", "pepper")],
    passi: {
      it: ["Forno a 200 gradi. Patate a spicchi in teglia per 20 minuti.", "Aggiungi le cimette di broccoli e il salmone con fettine di limone, altri 12 minuti.", "Olio a crudo, aneto e pepe."],
      en: ["Oven at 200 degrees C. Potato wedges in a tray for 20 minutes.", "Add the broccoli florets and the salmon with lemon slices, another 12 minutes.", "Raw oil, dill and pepper."],
    },
  },
  {
    id: "r-n14", pasto: "cena", abbina: { prot: ["cp12"], pane: "pane_gf" }, minuti: 10, tag: ["calcio", "veloce"],
    titolo: Q("Caprese con mozzarella light e pane tostato", "Caprese with light mozzarella and toasted bread"),
    ingredienti: [{ a: "mozzarella_light", q: 100, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("pomodori e rucola", "tomatoes and rocket") }, { a: "olio_evo", q: 10, u: "g" }, { a: "pane_gf", q: 60, u: "g" }],
    extra: [Q("basilico", "basil"), Q("origano", "oregano")],
    passi: {
      it: ["Affetta pomodori e mozzarella.", "Alternali nel piatto su un letto di rucola.", "Basilico, origano, olio a crudo e il pane tostato."],
      en: ["Slice tomatoes and mozzarella.", "Alternate them on a bed of rocket.", "Basil, oregano, raw oil and the toasted bread."],
    },
  },
  {
    id: "r-n15", pasto: "cena", abbina: { prot: ["cp13"], pane: "gallette" }, minuti: 20, tag: [],
    titolo: Q("Fiocchi di latte con verdure grigliate ed erbe", "Cottage cheese with grilled vegetables and herbs"),
    ingredienti: [{ a: "fiocchi_latte", q: 160, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("melanzane, zucchine, peperoni", "aubergine, courgettes, peppers") }, { a: "olio_evo", q: 10, u: "g" }, { a: "gallette_riso", q: 5, u: "pz", testo: Q("5 gallette (o 60 g di pane)", "5 rice cakes (or 60 g bread)") }],
    extra: [Q("erba cipollina", "chives"), Q("menta", "mint"), Q("pepe", "pepper")],
    passi: {
      it: ["Griglia le verdure a fette.", "Mescola i fiocchi di latte con erba cipollina, menta e pepe.", "Servi le verdure con l'olio a crudo, i fiocchi di latte sopra e le gallette."],
      en: ["Grill the sliced vegetables.", "Mix the cottage cheese with chives, mint and pepper.", "Serve the vegetables with the raw oil, the cottage cheese on top and the rice cakes."],
    },
  },
  {
    id: "r-n16", pasto: "cena", abbina: { prot: ["cp14"], pane: "pane_gf" }, minuti: 40, tag: ["fibre", "ferro_vitc"],
    titolo: Q("Zuppa di lenticchie e verdure", "Lentil and vegetable soup"),
    ingredienti: [{ a: "legumi_secchi", q: 40, u: "g", testo: Q("lenticchie secche (o 130 g già cotte)", "dried lentils (or 130 g cooked)") }, { a: "verdure", q: 300, u: "g", testo: Q("carote, sedano, cipolla, cavolo nero", "carrots, celery, onion, cavolo nero") }, { a: "olio_evo", q: 10, u: "g" }, { a: "pane_gf", q: 60, u: "g", testo: Q("tostato", "toasted") }],
    extra: [Q("alloro", "bay leaf"), Q("rosmarino", "rosemary"), Q("limone", "lemon")],
    passi: {
      it: ["Metti in pentola lenticchie, verdure a cubetti, alloro e rosmarino con acqua a coprire abbondantemente.", "Cuoci 30-35 minuti a fuoco basso.", "Servi con l'olio a crudo, qualche goccia di limone e il pane tostato."],
      en: ["Put lentils, diced vegetables, bay leaf and rosemary in a pot with plenty of water.", "Simmer 30-35 minutes on low heat.", "Serve with the raw oil, a few drops of lemon and the toasted bread."],
    },
  },
  {
    id: "r-ci1", pasto: "cena", abbina: { idea: "ci1" }, minuti: 15, tag: ["calcio"],
    titolo: Q("Pizza su piadina senza glutine", "Gluten-free piadina pizza"),
    ingredienti: [{ a: "piadina_gf", q: 1, u: "pz", testo: Q("1 piadina integrale da 100 g", "1 wholegrain piadina of 100 g") }, { a: "passata", q: null, u: "q.b." }, { a: "mozzarella_light", q: 100, u: "g", testo: Q("mozzarella protein", "high-protein mozzarella") }, { a: "verdure", q: 100, u: "g", testo: Q("zucchine, funghi o peperoni", "courgettes, mushrooms or peppers") }],
    extra: [Q("origano", "oregano"), Q("basilico", "basil")],
    passi: {
      it: ["Forno a 220 gradi.", "Stendi la passata sulla piadina, poi la mozzarella a pezzetti e le verdure a fettine sottili.", "Inforna su teglia 8-10 minuti, finché i bordi sono croccanti.", "Origano e basilico. Massimo una volta a settimana."],
      en: ["Oven at 220 degrees C.", "Spread the passata on the piadina, then the mozzarella in pieces and the thinly sliced vegetables.", "Bake on a tray 8-10 minutes until the edges are crisp.", "Oregano and basil. At most once a week."],
    },
  },
  {
    id: "r-ci2", pasto: "cena", abbina: { idea: "ci2" }, minuti: 20, tag: [],
    titolo: Q("Rotolo di frittata con formaggio spalmabile e prosciutto cotto", "Omelette roll with cream cheese and cooked ham"),
    ingredienti: [{ a: "uovo", q: 2, u: "pz" }, { a: "philadelphia_light", q: 30, u: "g" }, { a: "prosciutto_cotto", q: 20, u: "g" }, { a: "verdure", q: 300, u: "g", testo: Q("insalata e verdure crude", "salad and raw vegetables") }, { a: "olio_evo", q: 10, u: "g" }, { a: "pane_gf", q: 60, u: "g" }],
    extra: [Q("erba cipollina", "chives")],
    passi: {
      it: ["Sbatti le uova e cuocile in una padella larga come una crespella sottile.", "Lasciala intiepidire, spalma il formaggio e appoggia il prosciutto cotto.", "Arrotola stretto e taglia a fette.", "Servi con verdure, olio a crudo e pane. Massimo una volta ogni due settimane."],
      en: ["Beat the eggs and cook them in a wide pan like a thin crêpe.", "Let it cool a little, spread the cheese and lay the ham on top.", "Roll it tightly and slice.", "Serve with vegetables, raw oil and bread. At most once every two weeks."],
    },
  },
  {
    id: "r-ci3", pasto: "cena", abbina: { idea: "ci3" }, minuti: 45, tag: ["fibre", "meal_prep"],
    titolo: Q("Minestra di cereali e legumi", "Grain and legume soup"),
    ingredienti: [{ a: "legumi_secchi", q: 30, u: "g", testo: Q("o 100 g già cotti", "or 100 g cooked") }, { a: "cereali_sg", q: 50, u: "g", testo: Q("es. grano saraceno o miglio", "e.g. buckwheat or millet") }, { a: "parmigiano", q: 1, u: "cucchiaino" }, { a: "verdure", q: 300, u: "g", testo: Q("200-300 g: zucca, carote, porro, spinaci", "200-300 g: pumpkin, carrots, leek, spinach") }, { a: "olio_evo", q: 10, u: "g" }],
    extra: [Q("rosmarino", "rosemary"), Q("alloro", "bay leaf")],
    passi: {
      it: ["Cuoci legumi e verdure a cubetti in acqua con le erbe per 20-30 minuti (legumi già cotti: 15 minuti).", "Aggiungi il cereale e cuoci secondo la confezione.", "Servi con il cucchiaino di parmigiano e l'olio a crudo."],
      en: ["Cook legumes and diced vegetables in water with the herbs for 20-30 minutes (cooked legumes: 15 minutes).", "Add the grain and cook as the pack says.", "Serve with the teaspoon of parmesan and the raw oil."],
    },
  },

  /* ------------------------------------------------- SPUNTINO, DOPOCENA */
  {
    id: "r-s8", pasto: "spuntino", abbina: { opzione: "s8" }, minuti: 2, tag: ["veloce"],
    titolo: Q("Galletta con ricotta e cannella", "Rice cake with ricotta and cinnamon"),
    ingredienti: [{ a: "gallette_riso", q: 1, u: "pz" }, { a: "ricotta_light", q: 40, u: "g" }, { a: "cannella", q: null, u: "q.b." }],
    extra: [],
    passi: { it: ["Spalma la ricotta sulla galletta e spolvera di cannella."], en: ["Spread the ricotta on the rice cake and dust with cinnamon."] },
  },
  {
    id: "r-d5", pasto: "dopocena", abbina: { opzione: "d5" }, minuti: 2, tag: ["veloce"],
    titolo: Q("Yogurt con avena e scaglie di cioccolato", "Yogurt with oats and chocolate shavings"),
    ingredienti: [{ a: "yogurt_magro", q: 1, u: "vasetto" }, { a: "avena", q: 5, u: "g" }, { a: "cioccolato", q: 5, u: "g" }],
    extra: [],
    passi: { it: ["Nel vasetto di yogurt: 10 g in tutto tra fiocchi di avena e cioccolato grattugiato."], en: ["Into the pot of yogurt: 10 g in total of oat flakes and grated chocolate."] },
  },
];
