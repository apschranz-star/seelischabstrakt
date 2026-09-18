/*
 * The content of Anker in English, kept apart from the code.
 *
 * This file is meant to be edited. Anyone who wants to word a point
 * differently, add a recipe or take in another blood test changes it here and
 * nowhere else. The app only reads.
 *
 * WHAT IS IN HERE AND WHAT IS NOT
 * Everything here is general information, of the kind that stands in
 * guidelines and in published studies. None of it is tailored to one person,
 * none of it replaces an appointment, and nothing here says which dose is
 * right. Where the evidence is thin, it says so. That is not small print,
 * that is the point: a great deal circulates about lupus that was never
 * tested, and the difference between "measured in a study" and "written on
 * the internet" is worth the whole thing.
 */

window.INHALT = window.INHALT || {};
window.INHALT.en = {};

/* ------------------------------------------------------------------- Signs */

window.INHALT.en.symptome = [
  "Joint pain",
  "Morning stiffness",
  "Butterfly rash",
  "Other rash",
  "Light sensitivity",
  "Mouth ulcers",
  "Hair loss",
  "Fever",
  "Swollen glands",
  "Raynaud's",
  "Dry eyes",
  "Dry mouth",
  "Headache",
  "Chest pain on breathing",
  "Racing heart",
  "Breathless",
  "Stomach pain",
  "Bloating",
  "Diarrhoea",
  "Constipation",
  "Nausea",
  "Swollen legs",
  "Frothy urine",
  "Muscle pain",
];

/* -------------------------------------------------------------------- Food */

window.INHALT.en.essen = [
  {
    kicker: "Coeliac disease",
    titel: "The rule with no exception",
    lead:
      "In coeliac disease the gluten free diet is not one diet among several, " +
      "it is the treatment. It applies for life, and it applies even when a small " +
      "amount causes nothing you can feel: the damage to the gut lining happens without symptoms too.",
    punkte: [
      { art: "nein", was: "Wheat in any form", warum: "Spelt, emmer, einkorn, kamut, green spelt and unlabelled wheat starch all belong here. Ancient grains are wheat too." },
      { art: "nein", was: "Barley and rye", warum: "Malt, malt extract, malt flavouring and beer brewed from barley are the most common places to trip up." },
      { art: "vielleicht", was: "Oats", warum: "Oats themselves contain no gluten, but they are almost always processed alongside wheat. Only oats labelled gluten free, and even then a small minority cannot tolerate them." },
      { art: "ja", was: "Rice, maize, buckwheat, millet, quinoa, amaranth, teff", warum: "Naturally gluten free. Buckwheat is not wheat, despite the name." },
      { art: "ja", was: "Potatoes, pulses, nuts, seeds", warum: "What carries the meal once bread is gone, and protein and fibre with it." },
      { art: "ja", was: "Meat, fish, eggs, dairy, fruit and vegetables unprocessed", warum: "Anything without an ingredient list is the safe part of the shop." },
    ],
  },
  {
    kicker: "Where it goes wrong",
    titel: "Hidden and overlooked",
    lead:
      "Most everyday exposures to gluten do not come from a slice of bread but from " +
      "some small thing nobody thinks about.",
    punkte: [
      { art: "nein", was: "Soy sauce", warum: "Classic soy sauce is brewed with wheat. Tamari is usually gluten free, but only with a label saying so." },
      { art: "nein", was: "Fryers used for breaded food", warum: "Chips from the same fryer as breaded food are not gluten free. Ask about it when eating out." },
      { art: "nein", was: "A shared toaster", warum: "Crumbs are enough. Your own toaster or a toaster bag solves it." },
      { art: "nein", was: "Thickeners in sauces and soups", warum: "Roux, stock cubes, gravy granules, ready made marinades." },
      { art: "vielleicht", was: "Medicines and supplements", warum: "Rare, but starch can be in there as an excipient. Have the pharmacy check." },
      { art: "vielleicht", was: "May contain traces", warum: "A voluntary statement by the manufacturer, not a measurement. Anything carrying the crossed grain symbol or labelled gluten free, by contrast, falls under the legal limit of 20 mg of gluten per kilogram." },
      { art: "vielleicht", was: "Kisses, shared butter, the bread board", warum: "At home it helps to have your own butter dish, your own board and spreads that only one knife ever goes into." },
    ],
  },
  {
    kicker: "In lupus",
    titel: "What the research suggests",
    lead:
      "No diet cures lupus, and no study shows that changing how you eat replaces medication. " +
      "What does exist are patterns that go together, in studies, with less disease activity, " +
      "better blood fats and less fatigue. The strength of that evidence is given for each point " +
      "in the Knowledge chapter.",
    punkte: [
      { art: "ja", was: "A Mediterranean pattern", warum: "Vegetables, fruit, pulses, olive oil, fish, nuts; little red and processed meat. In observational studies in lupus it goes together with lower disease activity." },
      { art: "ja", was: "Oily fish twice a week", warum: "Salmon, mackerel, herring, sardines. Omega-3 has been tested in lupus in several small controlled trials." },
      { art: "ja", was: "Enough protein across the day", warum: "It holds on to muscle, and muscle is the first thing lost with fatigue and on steroids." },
      { art: "ja", was: "Go looking for fibre on purpose", warum: "Gluten free cooking is low in it by nature. Pulses, linseed, vegetables, fruit with the skin on." },
      { art: "vielleicht", was: "Go easy on salt", warum: "In animal experiments a lot of salt drives inflammatory T cells. In humans this is not shown for lupus. Sensible anyway, for blood pressure and kidneys." },
      { art: "vielleicht", was: "Alcohol", warum: "With methotrexate, and with the liver in mind, a subject for the clinic, not for an app." },
    ],
  },
  {
    kicker: "Caution",
    titel: "What is better left out in lupus",
    lead:
      "A short list, and each point has a concrete reason. Everything else that circulates online " +
      "as a lupus ban mostly does not hold up when checked.",
    punkte: [
      { art: "nein", was: "Alfalfa sprouts and alfalfa supplements", warum: "They contain L-canavanine. There are case reports of lupus like pictures and experiments in monkeys. The evidence is old and thin, but going without costs nothing, which is why the point appears in almost every patient leaflet." },
      { art: "nein", was: "Supplements that stimulate the immune system", warum: "Echinacea and similar products sold specifically to rouse the immune system. In a disease where the immune system is already doing too much, that is the wrong direction." },
      { art: "vielleicht", was: "High dose single supplements taken on your own", warum: "Above all anything involving iron: iron should only be replaced when a deficiency has been measured." },
      { art: "vielleicht", was: "Grapefruit", warum: "It affects how some drugs are broken down. Whether that applies to yours is something the pharmacy can tell you in a minute." },
      { art: "nein", was: "Smoking", warum: "It raises disease activity, makes hydroxychloroquine work less well, and increases an already raised heart risk." },
    ],
  },
  {
    kicker: "Both together",
    titel: "Nutrients that come under pressure twice over",
    lead:
      "Coeliac disease damages absorption, while lupus and its treatment raise either the need or " +
      "the losses. These should be measured, not guessed at, and only what is missing gets replaced.",
    punkte: [
      { art: "vielleicht", was: "Iron and ferritin", warum: "The most common deficiency in coeliac disease, and a very common cause of fatigue that has nothing to do with lupus." },
      { art: "vielleicht", was: "Vitamin D", warum: "At double risk in lupus: the sun is avoided, steroids increase the losses, and in coeliac disease the gut absorbs less well." },
      { art: "vielleicht", was: "Vitamin B12 and folate", warum: "Both are absorbed in the small bowel, exactly where coeliac disease does its work. Gluten free flour is also rarely fortified." },
      { art: "vielleicht", was: "Calcium", warum: "Important for bone, and bone is under pressure from two sides here, from coeliac disease and from steroids." },
      { art: "vielleicht", was: "Zinc and magnesium", warum: "Measured alongside the rest in coeliac disease when symptoms persist." },
    ],
  },
  {
    kicker: "Staying honest",
    titel: "The traps of gluten free cooking",
    lead:
      "Gluten free does not mean healthy. Ready made gluten free products are often pure starch, " +
      "low in fibre and dearer. That is a known problem, not a personal failing.",
    punkte: [
      { art: "vielleicht", was: "Little fibre", warum: "Rice starch, maize starch and tapioca bring hardly any with them. Pulses, linseed, psyllium husk and vegetables make up for it." },
      { art: "vielleicht", was: "A lot of fast starch", warum: "Gluten free white bread raises blood sugar more steeply than the original. Combine it with protein and fat." },
      { art: "vielleicht", was: "Rice as the main staple", warum: "Rice takes up arsenic from the soil. No reason to panic, but a reason to rotate between buckwheat, millet, quinoa, potato and maize instead of rice every day." },
      { art: "vielleicht", was: "Few B vitamins", warum: "Wheat flour is fortified in many countries, gluten free flour usually is not." },
    ],
  },
];
