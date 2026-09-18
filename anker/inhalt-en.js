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

/* ----------------------------------------------------------------- Recipes */

window.INHALT.en.rezepte = [
  {
    name: "A plate with no cooking",
    aufwand: "0 minutes",
    warum:
      "For the days when the hob is too far away. Still protein, fat and " +
      "something green, and so better than nothing and better than a biscuit.",
    zutaten: [
      "1 tin of sardines or mackerel in olive oil",
      "A handful of cherry tomatoes or cucumber",
      "Rice cakes or gluten free bread",
      "Olive oil, lemon, salt",
    ],
    schritte: [
      "Open the tin, tip it onto the plate.",
      "Vegetables alongside, unchopped if chopping is too much.",
      "Lemon over it, oil over it, done.",
    ],
    achtung: "Rice cakes as a side only, not as the daily base. Sardines bring omega-3, calcium and vitamin D with them.",
  },
  {
    name: "Overnight oats, gluten free",
    aufwand: "3 minutes the night before",
    warum: "In the morning breakfast is already standing there. Fibre and iron from the seeds.",
    zutaten: [
      "50 g gluten free oats",
      "150 ml milk or plant drink",
      "1 tbsp ground linseed or chia seeds",
      "1 tsp nut butter",
      "Fruit",
    ],
    schritte: [
      "Everything into a jar, stir, put the lid on.",
      "Into the fridge overnight.",
      "Fruit on top in the morning.",
    ],
    achtung: "Only oats labelled gluten free. A small minority with coeliac disease cannot tolerate even pure oats; watch for symptoms after introducing them and talk it over with your doctor.",
  },
  {
    name: "Lentil soup",
    aufwand: "25 minutes, one pot",
    warum:
      "Iron, fibre and protein from a cheap ingredient. It keeps three days in the fridge " +
      "and freezes in portions, which on bad days is worth more than any recipe.",
    zutaten: [
      "200 g red lentils",
      "1 onion, 2 cloves of garlic, 2 carrots",
      "1 tbsp tomato puree",
      "1 tsp cumin, 1 tsp paprika",
      "1 l gluten free vegetable stock",
      "Lemon, olive oil",
    ],
    schritte: [
      "Chop the onion, garlic and carrot small and soften them in oil.",
      "Add the tomato puree and spices and fry briefly.",
      "Add the lentils and stock, simmer for 20 minutes.",
      "Season with lemon. The lemon is not a garnish here: vitamin C markedly improves iron absorption from plants.",
    ],
    achtung: "Check the stock, many cubes contain wheat.",
  },
  {
    name: "Salmon from the oven, vegetables alongside",
    aufwand: "25 minutes, one tray",
    warum: "Omega-3 and vitamin D in one course, and the tray is the whole washing up.",
    zutaten: [
      "2 salmon fillets",
      "Broccoli, peppers, courgette, whatever is there",
      "Olive oil, salt, lemon",
      "Potatoes in wedges",
    ],
    schritte: [
      "Oven to 200C.",
      "Potatoes and vegetables with oil and salt onto the tray, 15 minutes.",
      "Lay the salmon alongside, another 10 to 12 minutes.",
      "Lemon over it.",
    ],
  },
  {
    name: "Buckwheat bowl",
    aufwand: "20 minutes",
    warum: "Buckwheat instead of rice, so that rice is not on the plate every day.",
    zutaten: [
      "150 g buckwheat",
      "1 tin of chickpeas",
      "Cucumber, tomato, red onion",
      "Yoghurt or tahini, lemon, olive oil",
      "Parsley",
    ],
    schritte: [
      "Boil the buckwheat in salted water for 12 to 15 minutes, drain, let it cool.",
      "Chop the vegetables, rinse the chickpeas.",
      "Mix it all, spoon over a dressing of yoghurt or tahini with lemon.",
    ],
    achtung: "Buckwheat is not wheat, but on the shelf it often sits next to flour. Check the label.",
  },
  {
    name: "Chickpea curry",
    aufwand: "20 minutes, one pot",
    warum: "Iron and fibre, and it tastes better on the second day.",
    zutaten: [
      "2 tins of chickpeas",
      "1 tin of tomatoes, 1 tin of coconut milk",
      "Onion, garlic, ginger",
      "Curry powder or garam masala",
      "Spinach, fresh or frozen",
    ],
    schritte: [
      "Fry the onion, garlic and ginger, add the spices briefly.",
      "Add the tomatoes and coconut milk, simmer for 10 minutes.",
      "Stir in the chickpeas and spinach and let it finish.",
    ],
    achtung: "Ready made curry pastes and spice mixes can contain wheat as a carrier.",
  },
  {
    name: "A tray of roast vegetables to keep",
    aufwand: "40 minutes, 5 of them work",
    warum:
      "The real answer to fatigue is not a quick recipe but a fridge with something " +
      "already made in it. One tray once, three days of a side dish.",
    zutaten: [
      "Whatever vegetables are there, in rough pieces",
      "Olive oil, salt, herbs",
      "A tray of potatoes or sweet potatoes alongside",
    ],
    schritte: [
      "Everything onto two trays, oil over it, 200C, 35 to 40 minutes.",
      "Cold into boxes in the fridge.",
      "Later turn it into a meal with eggs, chickpeas, fish or yoghurt.",
    ],
  },
  {
    name: "Green wake-up",
    aufwand: "4 minutes",
    warum: "For when chewing is too much. No substitute for meals, but better than a skipped one.",
    zutaten: [
      "A handful of spinach",
      "1 banana, a handful of berries",
      "1 tbsp nut butter or linseed",
      "Yoghurt or plant drink",
      "The juice of half an orange",
    ],
    schritte: ["Everything into the blender.", "Do not leave out the orange, the vitamin C gets the iron out of the spinach."],
  },
];

/* ------------------------------------------------------------ Blood tests */

window.INHALT.en.laborwerte = [
  { schluessel: "dsdna", gruppe: "Lupus", name: "Anti-dsDNA", einheit: "IU/ml", bedeutung: "An antibody that in lupus often rises and falls with disease activity. Rising values are a signal, not a diagnosis." },
  { schluessel: "c3", gruppe: "Lupus", name: "Complement C3", einheit: "g/l", bedeutung: "Typically falls when lupus is active, because complement is used up in the inflammatory process." },
  { schluessel: "c4", gruppe: "Lupus", name: "Complement C4", einheit: "g/l", bedeutung: "Like C3. The two are read together as a trend, not as a single reading." },
  { schluessel: "bsg", gruppe: "Inflammation", name: "ESR", einheit: "mm/h", bedeutung: "Raised non-specifically in inflammation. In lupus often high while the CRP stays normal." },
  { schluessel: "crp", gruppe: "Inflammation", name: "CRP", einheit: "mg/l", bedeutung: "Often normal in lupus. A clearly raised CRP points more towards an infection, which matters on immunosuppression." },
  { schluessel: "kreatinin", gruppe: "Kidney", name: "Creatinine", einheit: "mg/dl", bedeutung: "A measure of kidney function." },
  { schluessel: "upcr", gruppe: "Kidney", name: "Urine protein-creatinine ratio", einheit: "mg/g", bedeutung: "The most important early sign of kidney involvement. Protein in the urine does not hurt and is only noticed if you look for it." },
  { schluessel: "hb", gruppe: "Blood count", name: "Haemoglobin", einheit: "g/dl", bedeutung: "Anaemia is one of the most common physical causes of fatigue and is common in both lupus and coeliac disease." },
  { schluessel: "leuko", gruppe: "Blood count", name: "White cells", einheit: "/nl", bedeutung: "Often low in lupus, and on some drugs the trend is a safety measure." },
  { schluessel: "thrombo", gruppe: "Blood count", name: "Platelets", einheit: "/nl", bedeutung: "Can be low in lupus." },
  { schluessel: "ttg", gruppe: "Coeliac disease", name: "tTG-IgA", einheit: "U/ml", bedeutung: "The follow up test for coeliac disease. On a consistently gluten free diet it falls over months. A value that rises again points to gluten getting in." },
  { schluessel: "iga", gruppe: "Coeliac disease", name: "Total IgA", einheit: "g/l", bedeutung: "Measured once: with IgA deficiency the tTG-IgA would be falsely low and the test worthless." },
  { schluessel: "ferritin", gruppe: "Nutrients", name: "Ferritin", einheit: "ng/ml", bedeutung: "Iron stores. Careful: ferritin also rises with inflammation, so in lupus it is read together with the CRP." },
  { schluessel: "vitd", gruppe: "Nutrients", name: "Vitamin D, 25-OH", einheit: "ng/ml", bedeutung: "Often low in lupus, because the sun is avoided and steroids increase the losses." },
  { schluessel: "b12", gruppe: "Nutrients", name: "Vitamin B12", einheit: "pg/ml", bedeutung: "Absorbed in the small bowel, exactly where coeliac disease does its work." },
  { schluessel: "folat", gruppe: "Nutrients", name: "Folate", einheit: "ng/ml", bedeutung: "Like B12. Particularly important if you are planning a pregnancy and on some drugs." },
  { schluessel: "tsh", gruppe: "Thyroid", name: "TSH", einheit: "mU/l", bedeutung: "An underactive thyroid produces exactly the fatigue that gets put down to the lupus. Autoimmune thyroid disease is more common in both underlying conditions." },
];

/* -------------------------------------------------------------- Warning signs */

window.INHALT.en.warnzeichen = [
  {
    kicker: "Now",
    titel: "Emergency number or A and E",
    punkte: [
      { dringend: "nein", zeichen: "Breathlessness or severe chest pain", warum: "Can mean a pulmonary embolism, inflammation of the lining of the heart or of the lung. In lupus the risk of clots is raised, especially with antiphospholipid antibodies." },
      { dringend: "nein", zeichen: "Sudden weakness, trouble speaking or seeing", warum: "Signs of a stroke. To be taken seriously in lupus at any age." },
      { dringend: "nein", zeichen: "A seizure or severe confusion", warum: "Can be involvement of the nervous system." },
      { dringend: "nein", zeichen: "High fever on immunosuppression", warum: "On immunosuppression an infection can turn severe quickly, and the usual immune response is missing. Do not wait." },
      { dringend: "nein", zeichen: "Severe headache with a stiff neck", warum: "Suspected meningitis." },
    ],
  },
  {
    kicker: "This week",
    titel: "An appointment soon",
    punkte: [
      { dringend: "vielleicht", zeichen: "Frothy urine, swollen legs or eyelids", warum: "A sign of protein in the urine and so of kidney involvement. Lupus nephritis causes no symptoms for a long time and is found only by testing the urine." },
      { dringend: "vielleicht", zeichen: "A new rash with fever and joint pain", warum: "The typical picture of a flare." },
      { dringend: "vielleicht", zeichen: "Passing much less urine than usual", warum: "Needs looking into, from the kidney side." },
      { dringend: "vielleicht", zeichen: "Bleeding or bruises for no reason", warum: "Can point to low platelets." },
      { dringend: "vielleicht", zeichen: "Persistent diarrhoea or weight loss despite a gluten free diet", warum: "In coeliac disease the most common cause is hidden gluten, but it still needs looking into." },
      { dringend: "vielleicht", zeichen: "New trouble with your sight on hydroxychloroquine", warum: "Retinal screening runs to a fixed rhythm, a new problem does not wait for it." },
    ],
  },
  {
    kicker: "Raise at the next appointment",
    titel: "Important, but not urgent",
    punkte: [
      { dringend: "ja", zeichen: "Fatigue that gets worse over weeks", warum: "Needs looking into: blood count, thyroid, iron, vitamin D, sleep, mood. Not all of it is lupus, and that is good news, because a lot of it is treatable." },
      { dringend: "ja", zeichen: "New hair loss, mouth ulcers, light sensitivity", warum: "These belong in the description of disease activity and should be written down." },
      { dringend: "ja", zeichen: "Mood, anxiety, drive", warum: "Common in lupus and closely bound up with the fatigue. Raised far too rarely." },
      { dringend: "ja", zeichen: "Wanting children, even if that is still far off", warum: "Some drugs have to be changed long in advance, and a pregnancy in lupus is best planned for a quiet phase." },
    ],
  },
];

/* ------------------------------------------------------------------ Questions */

window.INHALT.en.fragen = [
  { frage: "How active is my lupus right now, in numbers?", warum: "There are scoring tools for this. Knowing your own number makes the course over years readable." },
  { frage: "When was my urine last tested for protein?", warum: "The kidney does not announce itself." },
  { frage: "Which tests should be repeated how often, and who arranges them?", warum: "So that nothing falls between the GP practice and the outpatient clinic." },
  { frage: "When is my next retinal screening due?", warum: "On hydroxychloroquine there is a fixed rhythm for it." },
  { frage: "How high is my steroid dose, and what is the plan for reducing it?", warum: "The guidelines aim for the lowest possible maintenance dose." },
  { frage: "Have iron, vitamin D, B12, folate and calcium been measured recently?", warum: "With coeliac disease and on steroids these are the most important supplies, and a common cause of fatigue." },
  { frage: "When was my last bone density scan, and do I need one?", warum: "Coeliac disease and steroids both act on bone." },
  { frage: "What has my tTG done over time?", warum: "It shows whether the gluten free diet really has no gaps in it." },
  { frage: "Which vaccinations am I missing, and which must I not have on this treatment?", warum: "Live vaccines are an issue on immunosuppression." },
  { frage: "What do I do if I get a fever or an infection, and who do I call?", warum: "This is a plan you want before you need it." },
  { frage: "Which contraception suits my situation?", warum: "With antiphospholipid antibodies there are particular considerations for oestrogen containing contraception." },
  { frage: "Can I exercise, and how much, even when I am unwell?", warum: "The answer is almost always yes, but the amount should be discussed, particularly with heart, lung or kidney involvement." },
];

/* ----------------------------------------------------------------- Knowledge */

window.INHALT.en.wissen = [
  {
    kicker: "First",
    titel: "How this text came about",
    abschnitte: [
      {
        frage: "Where does this come from, and what is it worth?",
        antwort: [
          "This text is a way of getting your bearings, not a review article and not a second opinion. It is written " +
            "so that you can take it into an appointment and ask better questions.",
          "While it was put together, the original papers <b>could not be opened</b>: the network this text was " +
            "written on does not let medical journal sites through. Searching was possible, reading was not. " +
            "That has one clear consequence, and it belongs here rather than in the small print: <b>individual " +
            "numbers from studies, meaning percentages, effect sizes and sample sizes, appear almost nowhere in " +
            "this text, and that is deliberate.</b> What you get instead is the direction of the findings and the " +
            "strength of the evidence.",
          "In return, each chapter names the original documents with their reference numbers. A PMID will find a " +
            "paper in seconds, and every doctor has access. So this text is built as a signpost to the sources, " +
            "not as a replacement for them.",
        ],
        staerke: "Context, not evidence.",
      },
      {
        frage: "What this text certainly cannot do",
        antwort: [
          "It does not know your results, which organs are involved, or your history. In lupus, almost every " +
            "decision hangs on exactly those things.",
          "It says nothing about any dose. Not because doses are secret, but because a dose without the person " +
            "in front of you makes no sense and can do harm.",
          "And it is a snapshot, not a subscription. A great deal has moved in lupus in recent years. As this " +
            "text ages it does not become wrong, but it does become incomplete.",
        ],
      },
    ],
  },

  {
    kicker: "The main theme",
    titel: "Fatigue",
    abschnitte: [
      {
        frage: "Why am I so tired when my blood tests look fine?",
        antwort: [
          "Because in lupus that is the rule, not the exception. Fatigue is the most common symptom and for many " +
            "people the hardest to carry, and it does <b>not</b> follow measured disease activity.",
          "This is one of the most reliably repeated findings in the field: the usual activity scores explain " +
            "only a small part of how exhausted someone is. Quiet results therefore do not rule out severe " +
            "fatigue. Knowing that, you do not have to justify yourself, and you go on looking in the right place.",
          "What lines up most strongly with fatigue in studies is <b>disturbed sleep, pain, fibromyalgia " +
            "alongside the lupus, mood and anxiety</b>. That is not a way of saying \"so it is all in your head\". " +
            "It is the opposite: it names things that can be acted on.",
        ],
        staerke: "Strong for the disconnect from measured activity. Strong for sleep, pain, mood and fibromyalgia as companions.",
        quellen: [
          "Arnaud L et al., LEAF-Studie, RMD Open 2023. PMID 38056917",
          "Monahan RC et al., Lupus 2021. PMID 33779389",
          "Ahn GE, Ramsey-Goldman R, Int J Clin Rheumatol 2012. PMC3380630",
          "Cornet A et al., Lupus Sci Med 2021;8:e000469",
        ],
      },
      {
        frage: "What should be checked before fatigue is put down to the lupus?",
        antwort: [
          "Some of it is very treatable, which is exactly why looking is worth it. With coeliac disease on top " +
            "that goes double, because absorption in the gut can be impaired.",
        ],
        liste: [
          "<b>Full blood count</b>, for anaemia. Common in lupus as in coeliac disease, and one of the most common physical causes of exhaustion.",
          "<b>Iron and ferritin</b>. The most common deficiency of all in coeliac disease. Careful: ferritin rises with inflammation, so it is read together with the CRP.",
          "<b>Thyroid</b>. An underactive thyroid produces exactly this picture, and autoimmune thyroid disease is more common in both underlying conditions.",
          "<b>Vitamin D, B12, folate</b>.",
          "<b>Kidney function and urine</b>, because kidney involvement stays silent for a long time.",
          "<b>Sleep</b>. Poor sleep is very common in lupus and, in studies, the single strongest companion of fatigue.",
          "<b>Mood and anxiety</b>. Depression and anxiety are considerably more common in lupus than in the general population.",
          "<b>Medication</b>, as something to raise at an appointment.",
        ],
        staerke: "This list is clinical practice and guideline logic, not a single study.",
      },
      {
        frage: "What actually helps against the fatigue?",
        antwort: [
          "The honest answer has two parts. First: the best evidenced single measure is <b>physical " +
            "activity</b>, adapted to you and built up over weeks. Second: the evidence for it is smaller and " +
            "more contradictory than you will read in the self help books.",
          "In detail: a Cochrane review from 2023 rates the certainty of the evidence as low and finds no " +
            "statistically reliable benefit for fatigue. A later summary of the same small body of trials finds " +
            "a moderate benefit for fatigue, stamina, mood and function. Both read almost the same studies and " +
            "reach different conclusions, because they pool the numbers differently.",
          "What you can take from that without overstating it: exercise is <b>safe when the disease is stable</b>, " +
            "it improves stamina reliably, and it probably helps the fatigue somewhat. That is more than has been " +
            "shown for any other non drug measure in lupus.",
          "The European specialist society explicitly recommends that in inflammatory rheumatic diseases fatigue " +
            "be measured and adapted exercise be offered.",
        ],
        staerke: "Low to moderate. Contradictory reviews, small and mostly unblinded trials. Clearer for stamina than for fatigue.",
        quellen: [
          "Frade S et al., Cochrane Database Syst Rev 2023. DOI 10.1002/14651858.CD014816.pub2",
          "O'Dwyer T, Durcan L, Wilson F, Semin Arthritis Rheum 2017;47:204-215. PMID 28477898",
          "Tench CM et al., Rheumatology (Oxford) 2003;42:1050-1054. PMID 12730519",
          "Dures E et al., EULAR-Empfehlungen zu Fatigue, Ann Rheum Dis 2024;83:1260-1267. DOI 10.1136/ard-2023-224514",
        ],
      },
    ],
  },

  {
    kicker: "The most common question",
    titel: "Exercise, even in a flare?",
    abschnitte: [
      {
        frage: "Can I exercise during an active flare?",
        antwort: [
          "Accuracy matters more here than a neat answer, so the state of the evidence first: <b>there is no " +
            "study on this.</b> Practically every exercise trial in lupus enrolled people with quiet or low " +
            "disease activity and specifically excluded active disease. The reassuring line \"exercise does not " +
            "make lupus worse\" is a statement about stable phases. It cannot be carried over to an acute flare.",
          "What does exist is an international consensus statement from 2024. In essence it says: during a flare, " +
            "<b>caution</b> applies, and it should be checked again whether anything currently speaks against " +
            "exercise. In a flare with inflamed joints, those joints in particular should not be loaded. Anyone " +
            "whose disease is quiet or mild should follow the general physical activity recommendations.",
          "Put into everyday terms, that does not mean \"bed\", and it does not mean \"push through\". It means " +
            "getting smaller in a flare rather than stopping. Walking instead of intervals, stretching and gentle " +
            "movement instead of weights, leaving inflamed joints out. And: a new flare should be reported before " +
            "you adjust your training, not afterwards.",
          "One limit from the same statement that is easily forgotten: with heart, lung or kidney involvement, on " +
            "blood thinning treatment, or with bone necrosis, exercise should be checked with a doctor before it " +
            "is increased.",
        ],
        staerke: "For the flare: expert consensus only, no trials. For stable phases: moderate.",
        quellen: [
          "Blaess J et al., RMD Open 2024;10:e004171. DOI 10.1136/rmdopen-2024-004171",
          "Parodis I et al., EULAR, nicht medikamentoese Behandlung, Ann Rheum Dis 2024;83:720-729. PMID 37433575",
        ],
      },
      {
        frage: "How do you start when even the stairs are hard?",
        antwort: [
          "With an amount that feels too small, one you can still get through on a bad day. That is not modesty, " +
            "it is the method: the most common reason exercise fails in exhaustion is a good day with too much " +
            "done on it, followed by three days in bed.",
          "In the trials that showed anything, the programmes mostly ran <b>eight to twelve weeks</b>, at moderate " +
            "intensity, and were supervised. Supervised here means somebody keeps an eye on it. In the analyses " +
            "that was one of the differences between programmes that worked and ones that did not.",
          "A workable start: a fixed, small amount every day, the same on good days and on bad ones, and only " +
            "after one or two weeks with no payback a little bit more. The trends in this app will show after a " +
            "few weeks whether the fatigue goes up on the day after a session.",
        ],
        staerke: "Moderate for the length and intensity of the programmes. The approach itself is practice, not a trial result.",
      },
      {
        frage: "What about pacing, meaning spreading your energy out?",
        antwort: [
          "Pacing means dividing your energy across the day and resting on purpose <b>before</b> you run out, " +
            "rather than carrying on until you crash.",
          "Honestly: there is hardly any research on this in lupus, only small education programmes and one pilot " +
            "study under way. The better evidence on pacing comes from other conditions, above all ME/CFS and " +
            "long Covid, and even there it is mixed. Whether lupus fatigue behaves like the fatigue in those " +
            "conditions has not been settled.",
          "It is here anyway, because it is cheap, harmless and reversible. Trying it for two weeks and looking " +
            "at the trends to see whether the bad days become fewer costs nothing.",
        ],
        staerke: "Weak in lupus. Carried over from other conditions, where the results are mixed.",
      },
    ],
  },

  {
    kicker: "Diet",
    titel: "What is actually shown in lupus",
    abschnitte: [
      {
        frage: "Is there a lupus diet?",
        antwort: [
          "No. There is no way of eating that has been shown to treat lupus or to replace medication. Anyone who " +
            "claims otherwise is selling something.",
          "What does exist are patterns. The most studied is the <b>Mediterranean</b> one: plenty of vegetables, " +
            "fruit, pulses, olive oil, fish and nuts, little red and processed meat. In cross sectional studies " +
            "in lupus it goes together with lower disease activity and better heart numbers.",
          "The words cross sectional matter: they mean looking at one point in time at who eats how and how they " +
            "are doing. Whether the food makes the difference, or whether people with quieter disease find it " +
            "easier to eat that way, is something such a study cannot separate. There is no completed " +
            "intervention trial in lupus with disease activity as its endpoint.",
          "There is still a good reason to go in exactly that direction: <b>cardiovascular risk</b> is clearly " +
            "raised in young women with lupus, and for that target the Mediterranean pattern is about as well " +
            "evidenced as anything in nutrition.",
        ],
        staerke: "For lupus activity: weak, observational only. For heart and blood vessels: good, but from the general population.",
      },
      {
        frage: "Omega-3, vitamin D, turmeric and the rest",
        antwort: [
          "<b>Omega-3</b> from fish or oil has been tested in lupus in several small controlled trials, with " +
            "signs of slightly lower disease activity and better blood vessel function. The trials are small and " +
            "not consistent. Oily fish twice a week is a sensible way to act on that, and it cannot break anything.",
          "<b>Vitamin D</b> is often low in lupus, because the sun is avoided and steroids increase the losses; " +
            "with coeliac disease, poorer absorption comes on top. That a deficiency should be corrected is not " +
            "disputed. That correcting it improves fatigue is: the treatment trials pooled on this question come " +
            "to only a few dozen participants between them. So: measure it, correct a deficiency, do not hang " +
            "great hopes on it.",
          "<b>Turmeric, resveratrol, NAC, DHEA</b> have been studied in lupus, in small trials with inconsistent " +
            "results. None of them is established.",
          "More important than any single supplement: everything you swallow belongs on the medication list and " +
            "in the clinic. Supplements are not a free zone, they interact.",
        ],
        staerke: "Omega-3: weak to moderate, small trials. Vitamin D for fatigue: very weak. Other supplements: weak.",
      },
      {
        frage: "And what about the alfalfa sprouts?",
        antwort: [
          "Alfalfa, also called lucerne, contains L-canavanine. There are older case reports of lupus like " +
            "pictures and experiments in monkeys. It is the one item that has been on every lupus list for decades.",
          "Placed honestly: that is a thin, old chain of evidence, not proof. Going without alfalfa sprouts costs " +
            "nothing, which is why it is here too. With everything else, scepticism pays: many of the lists of " +
            "banned foods online did not come from asking this question, they came from copying.",
          "One point with better reasoning: <b>supplements meant specifically to stimulate the immune system</b>, " +
            "echinacea for example. In a disease where the immune system turns against the body's own tissue, " +
            "that is the wrong direction. Here too the chain of evidence is thin, but the reasoning holds together.",
        ],
        staerke: "Weak. Case reports and animal experiments. Defensible as a precaution, not as a fact.",
      },
    ],
  },
