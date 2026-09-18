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

  {
    kicker: "Coeliac disease",
    titel: "What has to be strict and what does not",
    abschnitte: [
      {
        frage: "How strict is strict?",
        antwort: [
          "In coeliac disease the gluten free diet is the treatment, for life, and the aim is not only freedom " +
            "from symptoms but healing of the gut lining. Symptoms are a poor measure: some people have none " +
            "despite the damage.",
          "The limit of 20 milligrams of gluten per kilogram for the gluten free label rests on the finding that " +
            "up to about 10 milligrams of gluten a day is likely to be harmless for the large majority. By the " +
            "expert bodies' own account the data behind this is limited, and the right threshold is still debated.",
          "Striking and not widely known: measurements in people who believe they are strictly gluten free " +
            "regularly find considerably more accidental gluten than that threshold allows. This is not a " +
            "reproach to anyone, it is a pointer to where to look when things do not improve.",
        ],
        staerke: "High for the treatment itself. Weak to moderate for the exact threshold.",
        quellen: [
          "ACG-Leitlinie, Am J Gastroenterol 2023. PMID 36602836",
          "Ludvigsson JF et al., BSG, Gut 2014;63:1210-1228. PMID 24917550",
          "ESsCD 2025, United European Gastroenterol J. PMID 40999951 und PMID 41831197",
        ],
      },
      {
        frage: "What really counts in the kitchen, and what is overrated?",
        antwort: [
          "Here the research turned up something surprising, and it makes everyday life easier. What was measured " +
            "is how much gluten actually transfers during ordinary kitchen handling.",
          "<b>More important than assumed:</b> shared frying oil and shared cooking water. With chips from a " +
            "fryer that also cooks breaded food, some of the samples were well over the limit. So was pasta " +
            "water in which wheat pasta had been cooked beforehand; rinsing the cooked pasta briefly brought the " +
            "readings back below it.",
          "<b>Less bad than feared:</b> the shared toaster and shared cutlery. In the measurements, gluten free " +
            "bread from a used toaster stayed under the limit, even with visible crumbs in the tray, and a knife " +
            "that had been in wheat based baking transferred nothing measurable.",
          "These studies are small and not blinded, so they are no licence. But the direction is usable: the " +
            "energy belongs with the fryer, the cooking water, flour dust when baking and ingredient lists, and " +
            "less with a fear of every shared spoon. With an autoimmune disease that is an argument in itself: " +
            "energy that does not go into needless worry is available elsewhere.",
        ],
        staerke: "Weak to moderate. Small, unblinded measurement studies, but the only numbers there are on this.",
        quellen: [
          "Weisbrod VM et al., Gastroenterology 2020",
          "Gluten-Free Foods Cooked in Shared Fryers With Wheat, Front Nutr 2021. DOI 10.3389/fnut.2021.652039",
          "Syage JA et al., Am J Clin Nutr 2018",
        ],
      },
      {
        frage: "Is the tTG result enough to know that all is well?",
        antwort: [
          "No, and that is one of the most important details in this whole text. The tTG was developed as a " +
            "<b>screening test</b>, not as a follow up test for the healing of the gut lining.",
          "In a summary of several studies, the tTG on a gluten free diet picked up only about half of the cases " +
            "in which the lining was still damaged. A normal result is good news, then, but not proof.",
          "In practice that means: if symptoms persist, or if results such as iron and vitamin D do not come up, " +
            "\"the tTG is normal\" is no reason to stop looking. What belongs there then is a careful dietary " +
            "history taken by an experienced dietitian, and further investigation depending on the situation.",
          "The most common reason things do not improve on a gluten free diet, incidentally, is not a rare " +
            "complication but gluten getting in unnoticed.",
        ],
        staerke: "Moderate to high for the limited meaning of the antibody tests. From a summary of several studies.",
        quellen: [
          "Meta-Analyse zu tTG und Endomysium-Antikoerpern bei persistierender Zottenatrophie, Gastroenterology 2017",
          "Leitlinien zur Verlaufskontrolle, Nat Rev Gastroenterol Hepatol 2023. PMID 38110546",
        ],
      },
      {
        frage: "Oats, yes or no?",
        antwort: [
          "A summary of the studies found no sign that oats explicitly labelled gluten free make symptoms, " +
            "tissue, the immune response or the antibody levels worse. The certainty of that evidence was low.",
          "The main problem is not the oats but the processing: ordinary oats are often heavily contaminated with " +
            "wheat, pure oats hardly at all. So the rule is: only oats labelled gluten free.",
          "On top of that there is a small minority who react to the oat protein itself. How large that group is " +
            "has not been cleanly established; the figure most often quoted comes from a study that people who " +
            "suspected they could not tolerate oats signed up for on purpose, which makes it too high for " +
            "everyone else.",
          "A sensible approach: bring in gluten free oats at a quiet time, not at the same time as other changes, " +
            "and use the diary to see what happens.",
        ],
        staerke: "Moderate for the safety of pure oats, and the certainty of the evidence in that summary was low.",
        quellen: ["Pinto-Sanchez MI et al., Gastroenterology 2017;153:395-409. PMID 28431885"],
      },
      {
        frage: "Does going gluten free do anything for the lupus in someone without coeliac disease?",
        antwort: [
          "There is no solid evidence for that. It is mentioned here only for completeness, because the question " +
            "comes up constantly in forums.",
          "In this case it is beside the point anyway: with confirmed coeliac disease you eat gluten free, " +
            "regardless of what it does for the lupus.",
        ],
        staerke: "No solid evidence.",
      },
    ],
  },

  {
    kicker: "Both together",
    titel: "Where lupus and coeliac disease get in each other's way",
    abschnitte: [
      {
        frage: "Are the two connected at all?",
        antwort: [
          "Autoimmune diseases cluster together, and coeliac disease is found more often in lupus than in the " +
            "general population. On how much more often, the published estimates differ widely, which is why no " +
            "figure is given here.",
          "For everyday life the figure does not matter either. What matters is that both conditions attack the " +
            "same things: the absorption of nutrients, the bones and your strength.",
        ],
        staerke: "The estimates contradict each other clearly. The link itself is established.",
      },
      {
        frage: "Bone, at 26",
        antwort: [
          "This is the point that is most easily missed at this age and the last one to hurt. Two things come " +
            "together: coeliac disease disturbs the absorption of calcium and vitamin D over years, and steroids " +
            "act directly against bone.",
          "The American guideline on steroid induced osteoporosis says something that counts particularly for " +
            "young women: under the age of 40 the fracture risk <b>cannot</b> be estimated with the usual " +
            "calculator, because it was not built for that. So instead of a calculation you need a measurement.",
          "What belongs there in any case: enough calcium and vitamin D, exercise with weight on your legs, no " +
            "smoking. And the question of whether and when a bone density scan makes sense should be asked, not " +
            "waited out.",
        ],
        staerke: "Guideline based.",
        quellen: ["Humphrey MB et al., ACR-Leitlinie zur glukokortikoid-induzierten Osteoporose 2022. DOI 10.1002/art.42646"],
      },
      {
        frage: "What if the fatigue stays despite a strict gluten free diet?",
        antwort: [
          "That happens and it is well described. The order in which people look is usually this:",
        ],
        liste: [
          "Gluten getting in unnoticed. By far the most common explanation, and it is best found with an experienced dietitian, not alone.",
          "Nutrients: iron, B12, folate, vitamin D, zinc.",
          "Thyroid.",
          "The second condition, meaning the lupus itself, including kidneys and blood count.",
          "Sleep, mood, pain, fibromyalgia.",
          "Only after that, the rare things.",
        ],
        staerke: "Clinical practice and guideline logic.",
      },
    ],
  },

  {
    kicker: "Treatment",
    titel: "What is standard today",
    abschnitte: [
      {
        frage: "What does treatment follow today?",
        antwort: [
          "Two principles, both set out in the current European recommendations. First: <b>hydroxychloroquine " +
            "for everyone</b>, unless something speaks against it. Second: <b>steroids as low as possible</b>, " +
            "meant as a bridge and not as a permanent solution, with the aim of holding them very low in " +
            "maintenance or stopping them altogether.",
          "That is why further drugs are added earlier now: not because the disease is worse, but so that the " +
            "steroids can come down. There are more options for that than there were a few years ago, including " +
            "newly approved ones.",
          "The stated treatment target is remission or a state of low disease activity. Both are defined and " +
            "measurable. Asking about it is worth it: it turns \"how are you\" into something that stays " +
            "comparable over years.",
          "<b>No doses from this app.</b> What is here is the frame within which the clinic decides.",
        ],
        staerke: "Guidelines, the highest level available.",
        quellen: [
          "Fanouriakis A et al., EULAR 2023, Ann Rheum Dis 2024;83:15-29. PMID 37827694",
          "ACR-Leitlinie zur Behandlung des SLE 2025. PMID 41182321",
          "EULAR 2025, Lupus mit Nierenbeteiligung. PMID 41107121",
        ],
      },
      {
        frage: "Why the eye checks on hydroxychloroquine?",
        antwort: [
          "Because in rare cases the drug can damage the retina, and because that damage causes no symptoms for " +
            "a long time. So it is looked for rather than waited for.",
          "The risk depends above all on the dose in relation to body weight and on how long the drug has been " +
            "taken; reduced kidney function and certain other drugs raise it. That is why there is an upper " +
            "limit based on <b>actual</b> body weight.",
          "How it runs: one examination at the start, then regular retinal screening with methods that image the " +
            "retina. The exact intervals differ between countries and were revised recently. So the practical " +
            "question for the clinic is not \"how often is usual\" but \"when is my next one due\".",
          "Worth knowing: if early damage is found in time and the drug is stopped, it usually does not progress " +
            "further. That is exactly why the screening is not a ritual but the whole point.",
        ],
        staerke: "Ophthalmology guidelines. The exact intervals differ by country and by version.",
        quellen: [
          "AAO, Empfehlungen zum Screening auf Hydroxychloroquin-Retinopathie, Ophthalmology. PMID 41232611",
          "Royal College of Ophthalmologists, Monitoring-Empfehlungen 2020. PMID 33423043",
        ],
      },
      {
        frage: "Why the urine test again and again?",
        antwort: [
          "Because kidney involvement is the organ damage in lupus that costs the most and stays silent the " +
            "longest. It does not hurt. It shows up as protein in the urine, long before you notice anything.",
          "The American guideline on lupus nephritis therefore makes a strong recommendation to test the urine " +
            "for protein regularly, even in people <b>without</b> known kidney involvement.",
          "If you take one single thing from this whole chapter, take this: the urine test is the cheapest and " +
            "most effective test in the whole of your care. It should not be forgotten when you are feeling well.",
        ],
        staerke: "Strong guideline recommendation.",
        quellen: ["ACR-Leitlinie zur Lupusnephritis 2024. DOI 10.1002/art.43212"],
      },
    ],
  },

  {
    kicker: "At 26",
    titel: "What belongs at this age",
    abschnitte: [
      {
        frage: "Wanting children, even when it is not on the cards",
        antwort: [
          "This subject should be raised early, precisely while it is not yet due. The reason is simple: some " +
            "drugs commonly used in lupus must not be taken in pregnancy and have to be changed <b>months " +
            "beforehand</b>. An unplanned pregnancy on such a drug is the scenario everybody wants to avoid.",
          "The second reason: a pregnancy runs considerably better in lupus if it starts in a quiet phase. That " +
            "is one of the few things that can genuinely be planned.",
          "Two blood tests are decisive for this and should be known, independently of any planning: " +
            "<b>anti-Ro/SSA</b> and the <b>antiphospholipid antibodies</b> including lupus anticoagulant. They " +
            "change your care and the choice of contraception. If you do not know your status, ask.",
          "Hydroxychloroquine is as a rule continued in pregnancy, not stopped. That surprises many people.",
        ],
        staerke: "Guidelines.",
        quellen: [
          "Sammaritano LR et al., ACR-Leitlinie zur reproduktiven Gesundheit 2020, Arthritis Rheumatol 2020;72:529-556. PMID 32090466",
          "Andreoli L et al., EULAR, Frauengesundheit bei SLE und APS, Ann Rheum Dis 2017;76:476-485",
        ],
      },
      {
        frage: "Contraception",
        antwort: [
          "The decisive point: with confirmed <b>antiphospholipid antibodies</b>, oestrogen containing " +
            "contraception is advised against, because oestrogen raises the risk of clots and that risk is " +
            "already raised here anyway. A coil or progestogen only methods are recommended instead.",
          "Because reliable contraception matters at the same time, as long as drugs are in play that would harm " +
            "a pregnancy, this is not a side question.",
        ],
        staerke: "Strong guideline recommendation.",
        quellen: ["Sammaritano LR et al., ACR 2020. PMID 32090466"],
      },
      {
        frage: "Vaccinations and infections",
        antwort: [
          "On immunosuppression the rule is: <b>inactivated vaccines</b> are possible and are explicitly " +
            "recommended, <b>live vaccines</b> should be avoided as far as possible. Best of all, vaccination " +
            "status is checked and topped up before immunosuppressive treatment begins, and in a quiet phase.",
          "The second part is more practical: <b>a fever on immunosuppression is not something to wait out.</b> " +
            "The usual immune response can be missing, and the blood count alone does not always tell an " +
            "infection from a flare. This is exactly the situation you want a plan and a phone number for in " +
            "advance.",
        ],
        staerke: "Guidelines.",
        quellen: [
          "Furer V et al., EULAR-Impfempfehlungen 2019, Ann Rheum Dis 2020;79:39-52. PMID 31413005",
          "Bass AR et al., ACR-Impfleitlinie 2022. PMID 36597813",
        ],
      },
      {
        frage: "Sun and smoking",
        antwort: [
          "On the <b>sun</b> there is something solid: in a controlled study in which skin was deliberately " +
            "exposed to UV, typical lupus skin changes appeared in the untreated areas, and in the areas treated " +
            "with a high broad spectrum sunscreen they appeared in not one single participant. For this question " +
            "that is an unusually clear study.",
          "One thing matters here: what was shown was the prevention of <b>skin changes</b> caused by UV, not " +
            "the prevention of flares in general. And the protection has to cover UVA as well as UVB.",
          "On <b>smoking</b>: smoking is linked to a higher risk of developing the disease, and it measurably " +
            "reduces how well hydroxychloroquine works on the skin. One detail that gives heart: in the analysis, " +
            "<b>former</b> smokers no longer had a raised risk. So stopping works.",
        ],
        staerke: "For sun protection: good, a controlled study in humans. For smoking: a summary of several studies.",
        quellen: [
          "Kuhn A et al., J Am Acad Dermatol 2011;64:37-48. PMID 21167404",
          "Systematische Uebersicht und Metaanalyse zum Rauchen bei SLE, Autoimmun Rev 2019. PMID 31520802",
        ],
      },
    ],
  },
];

/* -------------------------------------------------------------- Monitoring */

window.INHALT.en.ueberwachung = [
  {
    titel: "Eyes, on hydroxychloroquine",
    text: [
      "One examination at the start of treatment and then regular retinal screening with methods that image the " +
        "retina. The intervals differ by country and risk profile; the dose in relation to actual body weight, " +
        "the length of treatment and kidney function play the main part in that.",
      "Found early, damage usually does not progress further once the drug is stopped. That is the reason for the checks.",
    ],
    quellen: ["AAO, Ophthalmology. PMID 41232611", "Royal College of Ophthalmologists 2020. PMID 33423043"],
  },
  {
    titel: "Blood and urine",
    text: [
      "Full blood count, kidney function, liver function and, depending on the drug, further tests, at intervals " +
        "set by the disease activity and by the drug: closer together at the start and after every change of " +
        "dose, further apart in quiet phases.",
      "Alongside those, the lupus specific tests, anti-dsDNA and complement C3 and C4, and in every case the urine for protein.",
      "The intervals belong in the clinic, not in an app. What helps here is the question of who arranges them, " +
        "so that nothing falls between the GP practice and the outpatient clinic.",
    ],
  },
  {
    titel: "Before starting some drugs",
    text: [
      "Before azathioprine, an enzyme that controls how the drug is broken down is measured. If it is missing or " +
        "reduced, severe changes in the blood count can follow. Asking about it is fair.",
      "Before immunosuppressive treatment, vaccination status should be checked, because some things are no longer possible afterwards.",
    ],
  },
  {
    titel: "Coeliac disease over time",
    text: [
      "tTG-IgA over time, the nutrients alongside it, and dietary advice from someone with experience in coeliac " +
        "disease. The last is not an extra: in the guidelines, contact with a dietitian is a fixed part of the treatment.",
      "A normal tTG does not rule out a gut lining that has not yet healed. If symptoms or deficiencies persist, " +
        "the search goes on.",
    ],
  },
  {
    titel: "Bone",
    text: [
      "On longer term steroid treatment and with coeliac disease, bone needs watching. Under the age of 40 the " +
        "risk cannot be estimated with the usual calculator, so it is measured rather than calculated.",
      "Enough calcium and vitamin D, exercise with weight on your legs, no smoking.",
    ],
    quellen: ["ACR-Leitlinie zur glukokortikoid-induzierten Osteoporose 2022. DOI 10.1002/art.42646"],
  },
];


/* ------------------------------------------------------------- Finding help
 *
 * Finding a place to go, with no network and no directory.
 *
 * What is NOT here is the core of it: no clinic, no address, no telephone
 * number, no doctor's name. While this app was built, not one medical
 * directory and not one patient organisation could be reached, checked and
 * confirmed. None of it could be looked up, and a wrong number dialled by
 * someone in a flare does real harm.
 *
 * What is here are routes: the kind of place, what it is called, what to
 * search for and what to ask once you are there. A route through a search
 * term survives a website being rebuilt, a saved address does not.
 */
window.INHALT.en.suche = {
  warnung:
    "This list was put together from memory. From the environment it was built in, not one professional website and not one patient organisation could be reached; that was checked and it holds. So nothing could be looked up. That is why there is deliberately no address, no telephone number and no name of a clinic or a doctor here: at that level a mistake would be dangerous, and a wrong number dialled by someone in a flare does real harm. What is here are kinds of places, their names and search terms. Names may have changed, organisations may have merged or been renamed, a directory may no longer exist. Every entry therefore carries a confidence rating. The app checks none of it, it cannot, it has no connection to the outside. Before you rely on a place, have it confirmed once: by your GP practice, by your outpatient clinic or by a support group.",

  laender: [
    { wert: "at", text: "Austria" },
    { wert: "de", text: "Germany" },
    { wert: "ch", text: "Switzerland" },
    { wert: "it", text: "Italy" },
    { wert: "eu", text: "Europe" },
  ],

  wege: [
    {
      land: "at",
      thema: "beides",
      name: "A referral from your GP practice",
      was: "Access to a hospital outpatient clinic, and a view on which hospital in your district you can realistically get to.",
      weg: "In Austria most hospital outpatient clinics require a referral from a doctor with a public health insurance contract, and usually an appointment as well. At the practice, say that you are looking for an outpatient clinic with experience in systemic lupus, not just a rheumatology clinic. Mention the second diagnosis straight away, it changes the choice.",
      suchbegriff: "Zuweisung rheumatologische Ambulanz",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "The outpatient clinic you already attend",
      was: "The shortest route, and the name of someone who will ask around in the building themselves.",
      weg: "At your next appointment, ask who knows about lupus and coeliac disease together, and whether being seen at a specialist centre would make sense. Asking for a second opinion is allowed and usual, it is not a vote of no confidence. If that feels awkward, put it as a question about shared care.",
      suchbegriff: "Zweitmeinung Mitbetreuung erbitten",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "The Austrian Medical Chamber's doctor search",
      was: "The official register of all doctors with their specialty, filterable by place.",
      weg: "Use a search engine to find the Ärztekammer and its Arztsuche; there is a national one and one for each provincial chamber. Important in lupus: in Austria rheumatology was for a long time an add-on qualification to internal medicine and only later became a specialty in its own right. Older colleagues carry the add-on, younger ones the title. Search for both.",
      suchbegriff: "Ärztekammer Arztsuche Innere Medizin Rheumatologie",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "The health insurance fund's list of contracted providers",
      was: "Who holds a contract with the public insurer, and who does not.",
      weg: "Look on the site of the Österreichische Gesundheitskasse for the doctor or contracted provider search. The difference is money: with a private doctor you pay first and get part of it back later. When waiting times are long that is sometimes the quicker route, but ask about the refund beforehand.",
      suchbegriff: "Österreichische Gesundheitskasse Arztsuche",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "lupus",
      name: "The Austrian Society for Rheumatology and Rehabilitation",
      was: "The specialist society, with a member list and an overview of rheumatology services.",
      weg: "Search for the society, then look for members, centres or outpatient clinics. Anyone active in a specialist society usually works somewhere with enough cases.",
      suchbegriff: "Österreichische Gesellschaft für Rheumatologie",
      sicherheit: "mittel",
    },
    {
      land: "at",
      thema: "lupus",
      name: "The Austrian Rheumaliga",
      was: "Self-help with provincial groups, and the knowledge of where you will be treated well as a person.",
      weg: "Search for the Rheumaliga and your own province. Ask there which outpatient clinic looks after people with lupus, where the waiting time is bearable and where people listen. You will not get that from any directory.",
      suchbegriff: "Rheumaliga Österreich Wien",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "zoeliakie",
      name: "The Austrian coeliac society",
      was: "Advice, product lists, groups, and often pointers to outpatient clinics and to dietitians with experience.",
      weg: "Search for Zöliakie and Österreich. If the name has changed, go through the European umbrella body of coeliac societies, which lists its members country by country. The second route works even when the organisation is called something other than you remember.",
      suchbegriff: "Zöliakie Österreich Arbeitsgemeinschaft",
      sicherheit: "mittel",
    },
    {
      land: "at",
      thema: "zoeliakie",
      name: "The Austrian Society for Gastroenterology and Hepatology",
      was: "The specialist society for the gut, with members and events.",
      weg: "Search for the society. Coeliac disease belongs to gastroenterology, not to rheumatology. If you are looking for an outpatient clinic, look there for members in your own town.",
      suchbegriff: "Österreichische Gesellschaft für Gastroenterologie",
      sicherheit: "mittel",
    },
    {
      land: "at",
      thema: "beides",
      name: "The self-help support office in your province",
      was: "Referral on to groups, including for two diagnoses at once.",
      weg: "Every Austrian province has a funded office that collects and refers on to self-help groups. Search for Selbsthilfe and the province, write to them and name both diagnoses. If there is no group that fits, these offices usually still know somebody.",
      suchbegriff: "Selbsthilfe Unterstützungsstelle Wien",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "The federal public health portal",
      was: "Official explanations of procedures, rights and routes through the system.",
      weg: "Search for Austria's public health portal. Useful above all for the administrative questions: referral, reimbursement, private doctors, patient rights, how to complain.",
      suchbegriff: "öffentliches Gesundheitsportal Österreich",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "zoeliakie",
      name: "A dietitian with experience in coeliac disease",
      was: "The dietary support that in coeliac disease is part of the treatment, not an optional extra.",
      weg: "In Austria Diätologin is the protected title, not Ernährungsberaterin. Search through the professional association or ask at the outpatient clinic for a referral. The question that counts is: how many people with coeliac disease do you see in a year.",
      suchbegriff: "Diätologin finden Österreich Berufsverband",
      sicherheit: "mittel",
    },
    {
      land: "de",
      thema: "lupus",
      name: "The German Society for Rheumatology and Clinical Immunology",
      was: "The specialist society and the network of regional rheumatology centres.",
      weg: "Search for the specialist society and for regional cooperative rheumatology centres. These centres are groupings of hospitals and practices in one region, and their lists are a good starting point.",
      suchbegriff: "Deutsche Gesellschaft für Rheumatologie Rheumazentren",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "lupus",
      name: "The German Rheuma-Liga",
      was: "The large patient organisation, with regional branches and address lists.",
      weg: "Search for the Rheuma-Liga and the federal state. It keeps addresses of rheumatologists and hospitals, refers people to groups and publishes very readable information sheets. The sheets are useful from Austria too, the addresses are not.",
      suchbegriff: "Deutsche Rheuma-Liga Landesverband",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "lupus",
      name: "Lupus self-help in the German speaking countries",
      was: "A community just for lupus, with regional groups and shared experience of outpatient clinics.",
      weg: "Ask the Rheuma-Liga about the lupus self-help association, or search directly for Lupus and Selbsthilfe. Usable from Vienna as well: experience of treatment, fatigue and dealing with officialdom carries over, the addresses do not.",
      suchbegriff: "Lupus Erythematodes Selbsthilfegemeinschaft",
      sicherheit: "mittel",
    },
    {
      land: "de",
      thema: "zoeliakie",
      name: "The German coeliac society",
      was: "Advice, checked product knowledge, groups, pointers to experienced outpatient clinics.",
      weg: "Search for the Deutsche Zöliakie-Gesellschaft. The product knowledge is useful from Austria too, because many of the manufacturers are the same. For finding an outpatient clinic, note that the lists are German.",
      suchbegriff: "Deutsche Zöliakie-Gesellschaft",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "beides",
      name: "The doctor search of the regional physicians' associations",
      was: "Who practises where, and under which specialist title.",
      weg: "Search for Arztsuche and Kassenärztliche Vereinigung, nationally or for one federal state. The associations' patient service also arranges appointments when something is urgent.",
      suchbegriff: "Arztsuche Kassenärztliche Vereinigung",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "beides",
      name: "The national self-help clearing house",
      was: "Groups and regional contact points, including for rare combinations.",
      weg: "Search for the national contact and information point for self-help. If you have two diagnoses, ask there about both and get referred on for both.",
      suchbegriff: "NAKOS Selbsthilfe Datenbank",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "lupus",
      name: "Centres for rare diseases at university hospitals",
      was: "A guide point for unclear or combined pictures.",
      weg: "Search for Zentrum für Seltene Erkrankungen and a university city, or for a care atlas for rare diseases. Such centres mostly only take people with a referral and complete records, and there are waiting times.",
      suchbegriff: "Zentrum für Seltene Erkrankungen Versorgungsatlas",
      sicherheit: "mittel",
    },
    {
      land: "de",
      thema: "beides",
      name: "The guideline register of the medical specialist societies",
      was: "The guidelines on lupus and on coeliac disease, meaning the yardstick you can hold an outpatient clinic to.",
      weg: "Search for the guideline register of the Arbeitsgemeinschaft der Wissenschaftlichen Medizinischen Fachgesellschaften, then for the condition. It is a register, not a guide for patients, and the texts are written for professionals. The summary and the recommendations at the front are readable all the same, and some guidelines come with a version written for patients.",
      suchbegriff: "AWMF Leitlinienregister Zöliakie",
      sicherheit: "hoch",
    },
    {
      land: "ch",
      thema: "lupus",
      name: "Rheumaliga Schweiz and the cantonal leagues",
      was: "Advice, courses and addresses in Switzerland.",
      weg: "Search for the Rheumaliga and the canton. The cantonal leagues are the places you actually approach.",
      suchbegriff: "Rheumaliga Schweiz",
      sicherheit: "hoch",
    },
    {
      land: "ch",
      thema: "lupus",
      name: "The Swiss Society for Rheumatology",
      was: "The specialist society, with a member register.",
      weg: "Search for the society and filter the member section by place. Alongside it, the doctor register of the professional body FMH, which holds the specialist titles officially.",
      suchbegriff: "Schweizerische Gesellschaft für Rheumatologie Mitglieder",
      sicherheit: "mittel",
    },
    {
      land: "ch",
      thema: "zoeliakie",
      name: "The Swiss coeliac association",
      was: "Advice and product knowledge for Switzerland.",
      weg: "Search for Zöliakie and Schweiz, or go through the European umbrella body, which lists the member society for each country.",
      suchbegriff: "Zöliakie Schweiz Interessengemeinschaft",
      sicherheit: "mittel",
    },
    {
      land: "it",
      thema: "zoeliakie",
      name: "Associazione Italiana Celiachia",
      was: "The Italian coeliac organisation, with regional branches and a mark for restaurants checked as gluten free.",
      weg: "Search for the organisation. For travelling in Italy, the list of checked restaurants is the most useful thing it has. In South Tyrol there is a German speaking regional group.",
      suchbegriff: "Associazione Italiana Celiachia",
      sicherheit: "hoch",
    },
    {
      land: "it",
      thema: "beides",
      name: "The Italian network for rare diseases",
      was: "Officially designated centres in each region where diagnosis and care take place.",
      weg: "Italy runs a national network for rare diseases. The regions designate the centres, and recognition carries exemption from co-payments with it. Systemic lupus is on the national list. Search in Italian for the national network and the region.",
      suchbegriff: "rete nazionale malattie rare presidi",
      sicherheit: "mittel",
    },
    {
      land: "it",
      thema: "beides",
      name: "The South Tyrol health service",
      was: "The one Italian route that runs in German, so without a language barrier.",
      weg: "The public health service in South Tyrol works in German. For a second opinion, or for questions about coeliac disease in Italy, that is the easiest way in. Before any appointment abroad, always settle the cost question first, see the national contact point.",
      suchbegriff: "Südtiroler Sanitätsbetrieb Ambulanz",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "The European reference network for rare connective tissue diseases",
      was: "An official list of expert centres, country by country, designated by the member states.",
      weg: "The European Union runs reference networks for rare diseases. For systemic lupus the network for rare connective tissue and musculoskeletal diseases is the one. Search for European Reference Network and connective tissue, then filter the member list for Austria. Anyone on it was checked by an authority, not by an editorial team.",
      suchbegriff: "European Reference Network connective tissue ReCONNET",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "The European reference network for immune diseases",
      was: "A second network, covering autoimmune and autoinflammatory diseases.",
      weg: "The same route as the previous entry, searching for European Reference Network and immunodeficiency or autoimmune. Some hospitals appear in both networks, which is a good sign.",
      suchbegriff: "European Reference Network autoimmune RITA",
      sicherheit: "mittel",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "Orphanet, the European directory of rare diseases",
      was: "Expert centres, patient organisations, registries and studies, filterable by country and available in several languages.",
      weg: "Search for Orphanet, then for the condition, then watch the country selector. For coeliac disease the directory only covers the rare treatment resistant form, ordinary coeliac disease being too common for it.",
      suchbegriff: "Orphanet expert centres lupus erythematosus",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "The European umbrella body of lupus organisations",
      was: "The way to the organisation in your own country, even when you do not know its name.",
      weg: "Search for the European umbrella body and look at the member organisations by country. That is the most reliable route to an Austrian lupus group, because an umbrella body keeps its member list up to date.",
      suchbegriff: "Lupus Europe member organisations",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "zoeliakie",
      name: "The European umbrella body of coeliac societies",
      was: "The member society in each country, and the crossed grain symbol for products checked as gluten free.",
      weg: "Search for the European umbrella body of coeliac societies. Through it you will find the Austrian organisation and those of the neighbouring countries, which counts when travelling.",
      suchbegriff: "Association of European Coeliac Societies",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "beides",
      name: "The national contact point for cross-border healthcare",
      was: "Information on what treatment in another EU country costs, what your insurer pays and what has to be approved in advance.",
      weg: "Every member state has to run such a contact point. Search for national contact point and cross-border healthcare, plus your own country. Ask there before any planned appointment abroad, otherwise you are left with the bill.",
      suchbegriff: "national contact point cross-border healthcare",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "The European register of clinical trials",
      was: "Which hospitals within reach are working on lupus trials.",
      weg: "Search for the European clinical trials information system, then filter by condition and country. The participating sites are listed with it. That says nothing about how friendly a hospital is, but a lot about where enough cases come together. Taking part is voluntary and never a condition of being treated.",
      suchbegriff: "Clinical Trials Information System lupus Austria",
      sicherheit: "mittel",
    },
  ],

  merkmale: [
    { id: "ambulanz-sagen-viele", punkt: "The clinic can say how many people with systemic lupus it looks after in a year, without having to think about it for long." },
    { id: "feste-ansprechperson-wenigstens", punkt: "There is a named contact, or at least a small team, instead of a new face at every appointment." },
    { id: "krankheitsaktivitaet-messinstrument-erfasst", punkt: "Disease activity is recorded with a scoring tool, and the score is in the letter, not just in someone's head." },
    { id: "benannten-schub-zwischen", punkt: "There is a named route for a flare between appointments: an urgent clinic, an email address or a number where somebody picks up." },
    { id: "nephrologie-dermatologie-augenheilkunde", punkt: "Nephrology, dermatology, ophthalmology and obstetrics are in the same hospital or are fixed partners, and the clinic can explain how the handover works." },
    { id: "kinderwunsch-schwangerschaft-selbst", punkt: "Wanting children and pregnancy are raised there of their own accord, not only when you ask." },
    { id: "zoeliakie-mitgedacht-entweder", punkt: "The coeliac disease is kept in mind: either there is gastroenterology in the same hospital, or the clinic knows exactly who looks after it and writes to them." },
    { id: "ernaehrungsfachkraft-zoeliakieerfahrung-erreichbar", punkt: "A dietitian with experience in coeliac disease is within reach, and the referral there is one simple step, not a negotiation." },
    { id: "jedem-termin-geht", punkt: "After every appointment a letter goes to the GP practice, and you get a copy yourself without having to fight for it." },
    { id: "klar-geregelt-welche", punkt: "It is clearly settled who arranges which check, so that nothing falls between the outpatient clinic and the GP practice." },
    { id: "muedigkeit-lichtempfindlichkeit-teil", punkt: "Fatigue and light sensitivity are treated as part of the disease and not as a footnote." },
    { id: "haus-nimmt-register", punkt: "The hospital takes part in a registry, a reference network or in trials, a sign that cases there are recorded systematically." },
    { id: "termin-dauert-lang", punkt: "The appointment lasts long enough to discuss two conditions, and the next one is fixed by the end of it." },
    { id: "kommt-schlechten-ausgezeichnete", punkt: "You can get there, even on a bad day: an excellent outpatient clinic three hours away becomes a bad one in a flare." },
  ],

  erstgespraech: [
    "The backup from this app, plus the doctor's report covering twelve weeks, printed out. Numbers over weeks say more than the memory of one bad day.",
    "Copies of all your results, in date order: blood tests, discharge letters, the report of the gut biopsy, older antibody results. Keep the originals yourself.",
    "A list of all your medicines with doses, plus supplements and contraception. Including what was stopped, and why it was stopped.",
    "The first question: will you take over my ongoing care, or is this a one-off assessment. Everything that follows depends on it.",
    "The question of who writes to whom: does the GP practice get a letter, and do I get one myself.",
    "The question of what to watch and write down before the next time. That makes the diary purposeful instead of merely diligent.",
    "The question of how to reach the clinic if things get worse in between, and what applies at the weekend.",
    "Write down beforehand the three things that matter most to you, and say them first. The time is short and otherwise goes on other things.",
    "Take somebody with you if your head is in a fog. Two ears hear more, and you do not have to listen and take notes at the same time.",
    "Take notes or record it. Ask before recording, most people say yes.",
    "Raise the coeliac disease yourself, including in a rheumatology clinic. Otherwise it falls between the specialties.",
    "Your e-card and the referral. With a private doctor, keep the invoice and settle beforehand how much comes back.",
    "Put the appointment in the better half of the day and plan nothing else afterwards. An appointment costs more energy than the calendar shows.",
    "If something stays unclear, say the sentence: I did not understand that, could you put it another way. That is not weakness, that is what the appointment is for.",
    "A short note straight after the appointment, while it is fresh. In brain fog your memory of the conversation is worse than you think.",
  ],
};
