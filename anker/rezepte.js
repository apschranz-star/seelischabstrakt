/*
 * Die Rezeptsammlung fuer die monatliche Auswahl.
 *
 * Jedes Rezept hier ist glutenfrei, auch wenn keine Zoeliakie gewaehlt ist:
 * so kann keine Kombination von Erkrankungen ein unsicheres Rezept zeigen.
 * Woher die Auswahl kommt, steht in app.js unter rezepteDesMonats: aus dem
 * Monat und den gewaehlten Erkrankungen wird gemischt, Rezepte mit passenden
 * Merkmalen kommen zuerst. Jeden Monat stehen andere oben.
 *
 * WARUM NICHTS AUS DEM NETZ GEHOLT WIRD
 * Ein Rezept von einer fremden Seite laesst sich nicht pruefen: ob die Bruehe
 * glutenfrei ist, ob Hafer gemeint ist oder Haferflocken mit Weizenspuren,
 * steht dort nicht oder falsch. Fuer jemanden mit Zoeliakie ist das kein
 * Schoenheitsfehler. Neue Rezepte kommen deshalb von Hand hierher, mit
 * denselben Merkmalen, und werkzeug/pruefe-module.js prueft die Form.
 *
 * Merkmale (tags): mediterran, omega3, eisen, kalzium, eiweiss, ballaststoffe,
 * schonend, vegetarisch, ohneMilch, vorrat. kraft: wenig, mittel.
 *
 * bestand ordnet den acht Rezepten aus inhalt-*.js dieselben Merkmale zu, in
 * derselben Reihenfolge wie dort.
 */

window.ANKER_REZEPTE = {

bestand: [
  { index: 0, minuten: 0, kraft: "wenig", tags: ["omega3", "kalzium", "eiweiss", "mediterran", "ohneMilch"] },
  { index: 1, minuten: 3, kraft: "wenig", tags: ["ballaststoffe", "vegetarisch", "vorrat"] },
  { index: 2, minuten: 25, kraft: "mittel", tags: ["eisen", "ballaststoffe", "vegetarisch", "ohneMilch", "vorrat", "mediterran"] },
  { index: 3, minuten: 25, kraft: "mittel", tags: ["omega3", "eiweiss", "mediterran", "ohneMilch"] },
  { index: 4, minuten: 20, kraft: "mittel", tags: ["eisen", "ballaststoffe", "vegetarisch", "mediterran"] },
  { index: 5, minuten: 20, kraft: "mittel", tags: ["eisen", "ballaststoffe", "vegetarisch", "ohneMilch", "vorrat"] },
  { index: 6, minuten: 40, kraft: "wenig", tags: ["mediterran", "ballaststoffe", "vegetarisch", "ohneMilch", "vorrat"] },
  { index: 7, minuten: 4, kraft: "wenig", tags: ["vegetarisch", "kalzium"] },
],

neu: [
  {
    id: "polenta-ei",
    minuten: 15, kraft: "wenig",
    tags: ["eiweiss", "schonend", "vegetarisch"],
    name: { de: "Weiche Polenta mit Ei und Spinat", en: "Soft polenta with egg and spinach" },
    warum: { de: "Warm, weich, in einem Topf. Gut an Tagen, an denen der Bauch empfindlich ist.", en: "Warm, soft, one pot. Good on days when the gut is sensitive." },
    zutaten: {
      de: ["60 g Instant-Polenta (Maisgriess, glutenfrei gekennzeichnet)", "250 ml Wasser oder glutenfreie Bruehe", "1 Ei", "1 Handvoll Babyspinat", "1 EL Parmesan, etwas Olivenoel"],
      en: ["60 g instant polenta (cornmeal, labelled gluten free)", "250 ml water or gluten free stock", "1 egg", "1 handful baby spinach", "1 tbsp parmesan, a little olive oil"],
    },
    schritte: {
      de: ["Wasser aufkochen, Polenta einruehren, 5 Minuten leise ruehren.", "Mulde druecken, Ei hineinschlagen, Deckel drauf, 4 Minuten.", "Spinat und Parmesan darueber, Oel dazu."],
      en: ["Bring water to the boil, stir in polenta, stir gently for 5 minutes.", "Make a hollow, crack in the egg, lid on, 4 minutes.", "Spinach and parmesan on top, add oil."],
    },
    hinweis: { de: "Maisgriess ist von Natur aus glutenfrei, wird aber oft in Muehlen mit Weizen verarbeitet. Auf das Zeichen achten.", en: "Cornmeal is naturally gluten free but is often milled alongside wheat. Look for the label." },
  },
  {
    id: "sardinen-reis",
    minuten: 10, kraft: "wenig",
    tags: ["omega3", "kalzium", "eiweiss", "mediterran", "ohneMilch"],
    name: { de: "Reis mit Sardinen, Zitrone und Petersilie", en: "Rice with sardines, lemon and parsley" },
    warum: { de: "Aus dem Vorrat, mit Kalzium aus den Graeten und Omega-3. Fertigreis macht es zu zehn Minuten.", en: "From the cupboard, with calcium from the bones and omega-3. Ready rice makes it ten minutes." },
    zutaten: {
      de: ["1 Beutel vorgegarter Reis (Zutaten pruefen)", "1 Dose Sardinen in Olivenoel", "1/2 Zitrone", "Petersilie, Pfeffer"],
      en: ["1 pouch pre-cooked rice (check ingredients)", "1 tin sardines in olive oil", "1/2 lemon", "Parsley, pepper"],
    },
    schritte: {
      de: ["Reis erwaermen.", "Sardinen mit dem Oel darueber, grob zerdruecken.", "Zitrone, Petersilie, Pfeffer."],
      en: ["Warm the rice.", "Sardines with their oil on top, break up roughly.", "Lemon, parsley, pepper."],
    },
    hinweis: { de: "Gewuerzter Fertigreis kann Gluten enthalten, natur ist sicher.", en: "Seasoned ready rice can contain gluten, plain is safe." },
  },
  {
    id: "linsen-salat",
    minuten: 10, kraft: "wenig",
    tags: ["eisen", "ballaststoffe", "vegetarisch", "mediterran", "ohneMilch"],
    name: { de: "Linsensalat mit Paprika und Zitrone", en: "Lentil salad with pepper and lemon" },
    warum: { de: "Eisen aus den Linsen, Vitamin C aus Paprika und Zitrone hilft bei der Aufnahme.", en: "Iron from lentils, and vitamin C from pepper and lemon helps it absorb." },
    zutaten: {
      de: ["1 Glas oder Dose gekochte Linsen", "1 rote Paprika", "1/2 rote Zwiebel", "Saft einer Zitrone, 2 EL Olivenoel", "Petersilie, Salz"],
      en: ["1 jar or tin cooked lentils", "1 red pepper", "1/2 red onion", "Juice of one lemon, 2 tbsp olive oil", "Parsley, salt"],
    },
    schritte: {
      de: ["Linsen abspuelen.", "Paprika und Zwiebel klein schneiden.", "Alles mischen, haelt zwei Tage im Kuehlschrank."],
      en: ["Rinse the lentils.", "Chop pepper and onion small.", "Mix everything, keeps two days in the fridge."],
    },
    hinweis: { de: "Kaffee und schwarzer Tee zum Essen mindern die Eisenaufnahme, lieber eine Stunde Abstand.", en: "Coffee and black tea with the meal reduce iron absorption, better an hour apart." },
  },
  {
    id: "lachs-quinoa",
    minuten: 20, kraft: "mittel",
    tags: ["omega3", "eiweiss", "mediterran", "ohneMilch"],
    name: { de: "Lachs mit Quinoa und Brokkoli", en: "Salmon with quinoa and broccoli" },
    warum: { de: "Ein Topf, eine Pfanne, zwanzig Minuten. Omega-3 und Eiweiss fuer zwei Mahlzeiten.", en: "One pot, one pan, twenty minutes. Omega-3 and protein for two meals." },
    zutaten: {
      de: ["120 g Quinoa", "2 Lachsfilets", "1 Brokkoli", "Olivenoel, Zitrone, Salz"],
      en: ["120 g quinoa", "2 salmon fillets", "1 head of broccoli", "Olive oil, lemon, salt"],
    },
    schritte: {
      de: ["Quinoa gut spuelen, mit doppelter Menge Wasser 15 Minuten koecheln.", "Brokkoli die letzten 5 Minuten oben drauf daempfen.", "Lachs in der Pfanne je Seite 3 bis 4 Minuten, Zitrone darueber."],
      en: ["Rinse quinoa well, simmer in double the water for 15 minutes.", "Steam broccoli on top for the last 5 minutes.", "Salmon in the pan 3 to 4 minutes per side, lemon over it."],
    },
    hinweis: { de: "Quinoa ist glutenfrei, Spuelen nimmt die bitteren Saponine.", en: "Quinoa is gluten free, rinsing removes the bitter saponins." },
  },
  {
    id: "joghurt-schale",
    minuten: 3, kraft: "wenig",
    tags: ["kalzium", "eiweiss", "vegetarisch"],
    name: { de: "Joghurtschale mit Nuessen und Beeren", en: "Yoghurt bowl with nuts and berries" },
    warum: { de: "Kalzium und Eiweiss ohne Herd. Fuer den Morgen nach einer schlechten Nacht.", en: "Calcium and protein without a stove. For the morning after a bad night." },
    zutaten: {
      de: ["200 g Naturjoghurt oder Skyr", "1 Handvoll Beeren, auch tiefgekuehlt", "1 EL Walnuesse oder Mandeln", "1 TL Leinsamen geschrotet"],
      en: ["200 g plain yoghurt or skyr", "1 handful berries, frozen is fine", "1 tbsp walnuts or almonds", "1 tsp ground flaxseed"],
    },
    schritte: {
      de: ["Alles in eine Schale, fertig."],
      en: ["Everything into a bowl, done."],
    },
    hinweis: { de: "Fruchtjoghurt und Muesli-Mischungen koennen Gluten enthalten, natur ist sicher.", en: "Fruit yoghurts and muesli mixes can contain gluten, plain is safe." },
  },
  {
    id: "kartoffel-ei",
    minuten: 25, kraft: "mittel",
    tags: ["schonend", "eiweiss", "vegetarisch", "vorrat"],
    name: { de: "Kartoffeln mit Ei und Kraeuterjoghurt", en: "Potatoes with egg and herb yoghurt" },
    warum: { de: "Mild und satt. Schale weglassen macht es noch schonender fuer den Bauch.", en: "Mild and filling. Peeling them makes it gentler still on the gut." },
    zutaten: {
      de: ["500 g Kartoffeln", "2 Eier", "150 g Joghurt", "Schnittlauch oder Dill, Salz"],
      en: ["500 g potatoes", "2 eggs", "150 g yoghurt", "Chives or dill, salt"],
    },
    schritte: {
      de: ["Kartoffeln 20 Minuten kochen, Eier die letzten 9 Minuten mitkochen.", "Joghurt mit Kraeutern und Salz verruehren.", "Alles zusammen auf den Teller."],
      en: ["Boil potatoes 20 minutes, add the eggs for the last 9.", "Stir yoghurt with herbs and salt.", "Everything together on the plate."],
    },
    hinweis: { de: "Kocht man die doppelte Menge Kartoffeln, ist morgen schon etwas da.", en: "Boil double the potatoes and there is something ready tomorrow." },
  },
  {
    id: "huehner-reis-suppe",
    minuten: 30, kraft: "mittel",
    tags: ["schonend", "eiweiss", "ohneMilch", "vorrat"],
    name: { de: "Huehnersuppe mit Reis und Karotte", en: "Chicken soup with rice and carrot" },
    warum: { de: "Die Suppe fuer Infekte und schlechte Bauchtage. Friert gut ein.", en: "The soup for infections and bad gut days. Freezes well." },
    zutaten: {
      de: ["2 Huehnerbrustfilets oder -keulen", "2 Karotten, 1 Stueck Sellerie", "80 g Reis", "1,2 l Wasser, Salz, Lorbeer"],
      en: ["2 chicken breasts or thighs", "2 carrots, 1 piece of celeriac", "80 g rice", "1.2 l water, salt, bay leaf"],
    },
    schritte: {
      de: ["Huhn mit Gemuese und Lorbeer im Wasser 20 Minuten leise koecheln.", "Huhn herausnehmen, zerzupfen, Reis in die Bruehe, 12 Minuten.", "Huhn zurueck, salzen."],
      en: ["Simmer chicken with vegetables and bay leaf in the water for 20 minutes.", "Take chicken out, pull apart, rice into the broth, 12 minutes.", "Chicken back in, season."],
    },
    hinweis: { de: "Selbst gekocht ist die Bruehe sicher glutenfrei, Wuerfel und Pulver oft nicht.", en: "Home-made broth is reliably gluten free, cubes and powders often are not." },
  },
  {
    id: "kichererbsen-ofen",
    minuten: 30, kraft: "wenig",
    tags: ["eisen", "ballaststoffe", "vegetarisch", "ohneMilch", "mediterran", "vorrat"],
    name: { de: "Kichererbsen und Suesskartoffel vom Blech", en: "Tray-baked chickpeas and sweet potato" },
    warum: { de: "Fuenf Minuten Arbeit, der Ofen macht den Rest. Reicht fuer drei Tage.", en: "Five minutes of work, the oven does the rest. Lasts three days." },
    zutaten: {
      de: ["1 Dose Kichererbsen", "2 Suesskartoffeln", "1 rote Zwiebel", "Olivenoel, Paprikapulver, Kreuzkuemmel, Salz", "Tahin oder Joghurt zum Darueber"],
      en: ["1 tin chickpeas", "2 sweet potatoes", "1 red onion", "Olive oil, paprika, cumin, salt", "Tahini or yoghurt to drizzle"],
    },
    schritte: {
      de: ["Ofen auf 210 Grad.", "Alles grob schneiden, mit Oel und Gewuerzen aufs Blech.", "25 Minuten, einmal wenden."],
      en: ["Oven to 210 °C.", "Cut everything roughly, onto the tray with oil and spices.", "25 minutes, turn once."],
    },
    hinweis: { de: "Gewuerzmischungen koennen Weizenmehl als Rieselhilfe enthalten, Einzelgewuerze sind sicherer.", en: "Spice blends can contain wheat flour as an anti-caking agent, single spices are safer." },
  },
  {
    id: "forelle-kartoffel",
    minuten: 20, kraft: "wenig",
    tags: ["omega3", "eiweiss", "schonend", "ohneMilch"],
    name: { de: "Raeucherforelle mit Kartoffeln und Gurke", en: "Smoked trout with potatoes and cucumber" },
    warum: { de: "Regional, fertig geraeuchert, mild. Omega-3 ohne Pfanne.", en: "Regional, ready smoked, mild. Omega-3 without a pan." },
    zutaten: {
      de: ["1 Raeucherforellenfilet", "400 g Kartoffeln", "1/2 Gurke", "Zitrone, Dill, Olivenoel"],
      en: ["1 smoked trout fillet", "400 g potatoes", "1/2 cucumber", "Lemon, dill, olive oil"],
    },
    schritte: {
      de: ["Kartoffeln kochen.", "Gurke in Scheiben, mit Zitrone und Dill.", "Forelle zerpfluecken und dazu."],
      en: ["Boil the potatoes.", "Slice cucumber, add lemon and dill.", "Flake the trout alongside."],
    },
    hinweis: { de: "Kren aus dem Glas kann Weizen enthalten, frisch gerieben ist sicher.", en: "Jarred horseradish can contain wheat, freshly grated is safe." },
  },
  {
    id: "buchweizen-porridge",
    minuten: 10, kraft: "wenig",
    tags: ["ballaststoffe", "eisen", "vegetarisch"],
    name: { de: "Buchweizenbrei mit Apfel und Zimt", en: "Buckwheat porridge with apple and cinnamon" },
    warum: { de: "Buchweizen ist trotz des Namens kein Weizen. Warm, nussig, mit Eisen und Ballaststoffen.", en: "Despite the name, buckwheat is not wheat. Warm, nutty, with iron and fibre." },
    zutaten: {
      de: ["50 g Buchweizenflocken (glutenfrei gekennzeichnet)", "200 ml Milch oder Pflanzendrink", "1 Apfel gerieben", "Zimt, 1 TL Nussmus"],
      en: ["50 g buckwheat flakes (labelled gluten free)", "200 ml milk or plant drink", "1 grated apple", "Cinnamon, 1 tsp nut butter"],
    },
    schritte: {
      de: ["Flocken mit Milch 5 Minuten koecheln.", "Apfel und Zimt einruehren.", "Nussmus darauf."],
      en: ["Simmer flakes in milk for 5 minutes.", "Stir in apple and cinnamon.", "Nut butter on top."],
    },
    hinweis: { de: "Auch bei Buchweizen auf das Glutenfrei-Zeichen achten, wegen Verunreinigung in der Muehle.", en: "Look for the gluten free label on buckwheat too, because of contamination at the mill." },
  },
  {
    id: "gemuese-omelett",
    minuten: 10, kraft: "wenig",
    tags: ["eiweiss", "vegetarisch", "kalzium"],
    name: { de: "Omelett mit Zucchini und Feta", en: "Omelette with courgette and feta" },
    warum: { de: "Zehn Minuten, eine Pfanne, viel Eiweiss. Geht auch zum Abendessen.", en: "Ten minutes, one pan, plenty of protein. Works for dinner too." },
    zutaten: {
      de: ["3 Eier", "1/2 Zucchini, fein gerieben", "30 g Feta", "Olivenoel, Pfeffer"],
      en: ["3 eggs", "1/2 courgette, finely grated", "30 g feta", "Olive oil, pepper"],
    },
    schritte: {
      de: ["Zucchini in Oel 2 Minuten anbraten.", "Verquirlte Eier darueber, bei kleiner Hitze stocken lassen.", "Feta darueber, zuklappen."],
      en: ["Fry courgette in oil for 2 minutes.", "Pour beaten eggs over, let set on low heat.", "Feta on top, fold over."],
    },
    hinweis: { de: "Mit Reiswaffeln oder Kartoffeln vom Vortag ist es eine ganze Mahlzeit.", en: "With rice cakes or yesterday's potatoes it is a full meal." },
  },
  {
    id: "bohnen-tomaten",
    minuten: 15, kraft: "wenig",
    tags: ["eisen", "ballaststoffe", "vegetarisch", "ohneMilch", "mediterran", "vorrat"],
    name: { de: "Weisse Bohnen in Tomate mit Rosmarin", en: "White beans in tomato with rosemary" },
    warum: { de: "Zwei Dosen und ein Zweig Rosmarin. Mediterran, eisenreich und billig.", en: "Two tins and a sprig of rosemary. Mediterranean, rich in iron and cheap." },
    zutaten: {
      de: ["1 Dose weisse Bohnen", "1 Dose gehackte Tomaten", "1 Knoblauchzehe, 1 Zweig Rosmarin", "Olivenoel, Salz, Pfeffer"],
      en: ["1 tin white beans", "1 tin chopped tomatoes", "1 garlic clove, 1 sprig rosemary", "Olive oil, salt, pepper"],
    },
    schritte: {
      de: ["Knoblauch und Rosmarin in Oel kurz anschwitzen.", "Tomaten und abgespuelte Bohnen dazu, 10 Minuten koecheln.", "Mit Oel und Pfeffer fertig."],
      en: ["Soften garlic and rosemary in oil briefly.", "Add tomatoes and rinsed beans, simmer 10 minutes.", "Finish with oil and pepper."],
    },
    hinweis: { de: "Dazu glutenfreies Brot oder Polenta. Bei empfindlichem Bauch die Menge klein halten.", en: "Serve with gluten free bread or polenta. With a sensitive gut keep the portion small." },
  },
],

};
