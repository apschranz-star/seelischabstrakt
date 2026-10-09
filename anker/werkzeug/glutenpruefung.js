/*
 * Die Glutenpruefung fuer Rezepte aus dem Netz.
 *
 * Benutzt von rezepte-holen.js beim Sammeln und von pruefe-module.js, das
 * jedes Rezept in rezepte-netz.js noch einmal durch dieselbe Pruefung schickt.
 * Was hier nicht durchkommt, kommt nicht in die App.
 *
 * DER MASSSTAB: JEDE ZUTAT IST BESTAETIGT
 * Frueher reichte es, dass keine verbotene Zutat dastand. Das ist eine
 * Sperrliste, und eine Sperrliste laesst durch, was sie nicht kennt. Jetzt
 * muss jede Zutatenzeile einzeln bestaetigt werden, sonst faellt das ganze
 * Rezept heraus:
 *
 *   1. Gesperrt (Weizen, Dinkel, Gerste, Roggen, Malz, Couscous, Bier ...):
 *      nur mit ausdruecklichem "glutenfrei" erlaubt, sonst Rezept verworfen.
 *   2. Nur mit Zusatz sicher (Mehl, Brot, Nudeln, Hafer, Sojasauce, Kekse ...):
 *      nur mit "glutenfrei" oder als bekannte glutenfreie Sorte (Reismehl,
 *      Mandelmehl, Tamari ...), sonst verworfen. Ein schwacher Zusatz wie
 *      "glutenfrei moeglich" zaehlt nicht. "oder normales Mehl" verwirft.
 *   3. Packungsware (Backpulver, Bruehe, Schokolade, Gewuerzmischungen,
 *      glutenfreie Mehle ...): erlaubt, aber im Rezept als Einkaufspflicht
 *      gelistet: nur mit Aufschrift glutenfrei kaufen. In der EU heisst das
 *      hoechstens 20 mg Gluten je kg (Durchfuehrungsverordnung (EU) Nr.
 *      828/2014). Auch von Natur aus glutenfreie Mehle stehen hier, weil sie
 *      in Muehlen oft mit Weizen in Beruehrung kommen.
 *   4. Alles andere muss auf der Positivliste stehen: von Natur aus
 *      glutenfreie Einzelzutaten (Gemuese, Obst, Fleisch, Fisch, Eier, Milch,
 *      Reis, Huelsenfruechte, Nuesse, einzelne Gewuerze ...). Bleibt nach
 *      Mengen, Einheiten und Beschreibungen ("fein gehackt", "room
 *      temperature") ein Wort uebrig, das die Liste nicht kennt, faellt das
 *      Rezept heraus. Lieber ein gutes Rezept zu wenig als ein falsches.
 *
 * WAS DAS NICHT IST
 * Keine Laboranalyse. Die Pruefung liest die Zutatenliste der Autorin; ob die
 * gekaufte Packung glutenfrei ist, steht nur auf der Packung. Deshalb die
 * Einkaufsliste unter 3.
 *
 * Wer die Listen erweitert: in POSITIV nur, was von Natur aus und ohne
 * Verarbeitung glutenfrei ist. Alles Verarbeitete gehoert in PACKUNG oder
 * NUR_MIT_ZUSATZ. In BESCHREIBUNG nur Woerter, die kein Lebensmittel sind.
 */

const GESPERRT = [
  /\b(wheat|barley|rye|spelt|farro|kamut|bulgur|couscous|semolina|seitan|triticale|einkorn|emmer|freekeh|durum)\b/i,
  /\bmalt(ed)?\b/i, /\bbrewer'?s yeast\b/i, /\b(beer|ale|lager|stout)\b/i,
  /\b(surimi|imitation crab)\b/i,
  /* Deutsch setzt Woerter zusammen: Hartweizengriess, Vollkorndinkel,
     Gerstenmalz. Deshalb ohne Wortgrenze vorne. */
  /(weizen|dinkel|roggen|gerste|gerstenmalz|malzextrakt|gr(ü|ue)nkern|bulgur|couscous|seitan|einkorn|\bemmer\b|\bbier\b|\bmalz\b|krabbensticks|surimi)/i,
];

const NUR_MIT_ZUSATZ = [
  /\b(flours?|bread|breadcrumbs?|crumbs|breaded|panko|pasta|noodles?|spaghetti|macaroni|penne|fusilli|rigatoni|pappardelle|lasagna|tortillas?|wraps?|crackers?|croutons?|oats?|oatmeal|granola|muesli|soy sauce|shoyu|teriyaki|hoisin|oyster sauce|bbq sauce|barbecue sauce|gravy|cookies?|biscuits?|pretzels?|cereal|krispies|cornflakes|corn flakes|graham|pie crust|pastry|puff pastry|phyllo|filo|dough|cake mix|brownie mix|pancake mix|dumplings?|gnocchi|licorice|liquorice|starch)\b/i,
  /(mehl|brot|br(ö|oe)sel|semmel|paniert|nudeln|spaghetti|pasta|lasagne|tortilla|wrap|hafer|m(ü|ue)sli|sojaso(ss|ß)e|sojasauce|teriyaki|hoisin|austernso(ss|ß)e|keks|zwieback|cracker|bl(ä|ae)tterteig|m(ü|ue)rbeteig|teig\b|gnocchi|schupfnudel|kn(ö|oe)del|kn(ö|oe)del|panier|lakritz|st(ä|ae)rke)/i,
];

/* Glutenfreie Sorten der Zutaten unter NUR_MIT_ZUSATZ. Sie bestehen die
   Pruefung, landen aber in der Einkaufsliste. */
const GF_SORTE = /gluten[\s-]?free|glutenfrei|\bgf\b|certified|zertifiziert|tamari|coconut aminos|rice (flour|noodles|paper|pasta)|reis(mehl|nudeln|papier)|almond (flour|meal)|mandelmehl|gemahlene mandeln|coconut flour|kokosmehl|buckwheat|buchweizen|cassava|maniok|tapioca|tapioka|chickpea (flour|pasta)|kichererbsenmehl|corn ?(flour|starch|meal|tortillas?)|maismehl|maisst(ä|ae)rke|maistortilla|potato (starch|flour)|kartoffel(st(ä|ae)rke|mehl)|arrowroot|sorghum|millet|hirse|teff|quinoa|amaranth|oat[\s-]?free|nut flour|cashew flour|hazelnut flour|haselnussmehl|lupin|lupine|guarkern|johannisbrotkern|flohsamen|psyllium|speisest(ä|ae)rke|rice crackers?|reiswaffel/i;

/* "glutenfrei moeglich", "gluten-free if needed": ein Zusatz, der keiner ist. */
const WEICH = /(gluten[\s-]?free|glutenfrei)\w*\s*(m(ö|oe)glich|as needed|if needed|if necessary|if desired|if preferred|optional|bei bedarf|nach wahl|wenn n(ö|oe)tig)|(as needed|if needed|if necessary|optional|bei bedarf|nach wahl)\W+(\w+\W+){0,3}(gluten[\s-]?free|glutenfrei)/i;

/* "or regular flour", "oder normales Mehl": die Autorin bietet Gluten an. */
const ALTERNATIVE = /\b(or|oder)\s+(regular|normal(e|es|en)?|all[\s-]purpose|wheat|weizen|dinkel|spelt|standard)\b/i;

const PACKUNG = /baking powder|backpulver|stock|broth|bouillon|br(ü|ue)he|\bfond\b|suppenw(ü|ue)rfel|worcester|miso|chocolate|choc chips|cocoa|cacao|vanilla|schokolade|kuvert(ü|ue)re|kakao|vanille|powder|pulver|seasoning|spice blend|gew(ü|ue)rzmischung|garam masala|taco|italian herbs|herbes de provence|mustard|senf|ketchup|mayo|hot sauce|sriracha|salsa|pesto|marinara|tomato (paste|sauce)|tomatenmark|passata|passierte tomaten|canned|crushed tomatoes|diced tomatoes|dosentomaten|aus der dose|\bdose\b|fish sauce|coconut aminos|sausage|bacon|\bham\b|prosciutto|chorizo|salami|wurst|speck|schinken|polenta|cornmeal|grits|maisgrie(ß|ss)|marshmallow|sprinkles|streusel|ice cream|jam|preserves|marmelade|konfit(ü|ue)re|nutella|protein|collagen|xanthan|yeast|hefe|gelatin|gelatine|flakes|flocken|of choice|deiner wahl|pflanzendrink|plant milk|non-dairy milk|nondairy milk|dairy-free milk|vegan butter|margarine|chips|tamari|maple syrup|ahornsirup|agave|date syrup|dattelsirup|yogurt|yoghurt|joghurt|cream cheese|frischk(ä|ae)se|shredded cheese|vegan cheese|cottage cheese|sour cream|cr(e|è)me fra(i|î)che|evaporated|condensed|kondensmilch|instant|mix\b|mischung|food colou?ring|lebensmittelfarbe|extract|extrakt|aroma|liqueur|lik(ö|oe)r/i;

const POSITIV = new RegExp([
  // Gemuese
  "onions?", "shallots?", "garlic", "leeks?", "scallions?", "green onions?", "chives?", "carrots?", "celery", "celeriac", "potato(es)?", "sweet potato(es)?", "yams?", "beets?", "beetroot", "radish(es)?", "turnips?", "parsnips?", "pumpkins?", "squash", "butternut", "zucchinis?", "courgettes?", "cucumbers?", "tomato(es)?", "cherry tomato(es)?", "bell peppers?", "peppers?", "chil(e|i|ies|es)", "jalape(n|ñ)os?", "poblanos?", "eggplants?", "aubergines?", "broccoli", "cauliflower", "cabbage", "kale", "spinach", "chard", "lettuce", "romaine", "arugula", "rocket", "greens", "asparagus", "green beans", "snap peas", "peas", "corn", "sweetcorn", "mushrooms?", "artichokes?", "fennel", "okra", "avocados?", "olives?", "capers", "ginger", "horseradish", "brussels sprouts", "bok choy", "sprouts", "watercress", "endive", "radicchio",
  "zwiebeln?", "schalotten?", "knoblauch", "lauch", "porree", "fr(ü|ue)hlingszwiebeln?", "schnittlauch", "karotten?", "m(ö|oe)hren?", "sellerie", "kartoffeln?", "erd(ä|ae)pfel", "s(ü|ue)(ß|ss)kartoffeln?", "rote beten?", "rote r(ü|ue)ben?", "radieschen", "rettich", "pastinaken?", "k(ü|ue)rbis", "zucchini", "gurken?", "tomaten?", "kirschtomaten?", "paprika(schoten)?", "chilis?", "auberginen?", "brokkoli", "blumenkohl", "karfiol", "\\w*kohl", "spinat", "blattspinat", "mangold", "\\w*salat", "rucola", "spargel", "\\w*bohnen", "erbsen", "mais", "pilze?", "champignons?", "artischocken?", "fenchel", "avocados?", "oliven?", "kapern", "ingwer", "meerrettich", "kren", "sprossen", "rhabarber",
  // Obst
  "apples?", "pears?", "bananas?", "berr(y|ies)", "strawberr(y|ies)", "raspberr(y|ies)", "blueberr(y|ies)", "blackberr(y|ies)", "cherr(y|ies)", "grapes?", "lemons?", "limes?", "oranges?", "grapefruits?", "mangos?", "mangoes", "pineapples?", "peach(es)?", "nectarines?", "apricots?", "plums?", "figs?", "dates?", "raisins?", "cranberr(y|ies)", "pomegranates?", "kiwis?", "melons?", "watermelon", "coconut", "quinces?", "rhubarb", "passion fruit", "fruits?", "applesauce",
  "(ä|ae)pfel", "apfel", "apfelmus", "birnen?", "bananen?", "\\w*beeren", "erdbeeren?", "himbeeren?", "heidelbeeren?", "blaubeeren?", "brombeeren?", "kirschen?", "trauben?", "zitronen?", "limetten?", "orangen?", "mandarinen?", "mangos?", "ananas", "pfirsiche?", "aprikosen?", "marillen?", "pflaumen?", "zwetsch(g|k)en?", "feigen?", "datteln?", "rosinen?", "granat(ä|ae)pfel", "granatapfel", "kiwis?", "melonen?", "kokos(nuss|raspeln|flocken)?", "quitten?", "fr(ü|ue)chte", "obst",
  // Fleisch, Fisch, Ei, unverarbeitet
  "chicken", "beef", "pork", "lamb", "turkey", "veal", "steaks?", "ground meat", "mince", "fish", "salmon", "tuna", "cod", "halibut", "trout", "shrimps?", "prawns?", "scallops?", "mussels?", "clams?", "crab", "lobster", "anchov(y|ies)", "sardines?", "mackerel", "eggs?", "egg whites?", "egg yolks?",
  "h(ü|ue)hner\\w*", "h(ü|ue)hnchen\\w*", "h(ä|ae)hnchen\\w*", "rind\\w*", "schwein\\w*", "lamm\\w*", "puten\\w*", "pute", "kalb\\w*", "hackfleisch", "faschiertes", "fisch\\w*", "lachs\\w*", "thunfisch", "kabeljau", "forellen?", "garnelen?", "muscheln?", "sardellen?", "sardinen?", "makrelen?", "eier?", "eiwei(ß|ss)", "eigelbe?", "dotter",
  // Milch
  "milk", "whole milk", "buttermilk", "cream", "heavy cream", "whipping cream", "half and half", "butter", "ghee", "cheese", "parmesan", "parmigiano", "cheddar", "mozzarella", "feta", "ricotta", "mascarpone", "burrata", "gouda", "goat cheese", "pecorino", "gruy(e|è)re", "kefir", "quark", "skyr", "almond milk", "coconut milk", "coconut cream", "cashew milk", "rice milk",
  "milch", "vollmilch", "buttermilch", "sahne", "schlagsahne", "schlagobers", "obers", "rahm", "schmand", "butter", "butterschmalz", "k(ä|ae)se", "bergk(ä|ae)se", "parmesan", "mozzarella", "feta", "ricotta", "mascarpone", "topfen", "quark", "skyr", "mandelmilch", "kokosmilch", "reismilch",
  // Oele, Fette
  "oil", "olive oil", "coconut oil", "avocado oil", "sesame oil", "vegetable oil", "canola oil", "sunflower oil", "lard",
  "(ö|oe)l", "oliven(ö|oe)l", "kokos(ö|oe)l", "raps(ö|oe)l", "sonnenblumen(ö|oe)l", "sesam(ö|oe)l", "schmalz",
  // Reis, Huelsenfruechte, Nuesse, Samen
  "rice", "arborio", "basmati", "jasmine", "wild rice", "quinoa",
  "reis", "risottoreis", "basmatireis", "quinoa",
  "lentils?", "chickpeas?", "garbanzo", "black beans", "kidney beans", "white beans", "beans", "cannellini", "pinto", "navy beans", "edamame", "tofu", "tempeh",
  "linsen?", "kichererbsen?", "tofu",
  "almonds?", "walnuts?", "pecans?", "cashews?", "hazelnuts?", "pistachios?", "peanuts?", "macadamias?", "pine nuts", "brazil nuts", "nuts", "seeds", "sesame", "tahini", "chia", "flax(seed)?", "hemp", "pepitas", "pumpkin seeds", "sunflower seeds", "poppy seeds", "peanut butter", "almond butter", "cashew butter", "nut butter",
  "mandeln?", "mandelmus", "walnuss\\w*", "walnüsse", "pekann(ü|ue)sse", "cashew\\w*", "haselnuss\\w*", "haseln(ü|ue)sse", "pistazien?", "erdn(ü|ue)sse", "erdnuss\\w*", "macadamia\\w*", "pinienkerne", "n(ü|ue)sse", "samen", "sesam", "tahin", "chiasamen", "leinsamen", "hanfsamen", "k(ü|ue)rbiskerne", "sonnenblumenkerne", "mohn", "nussmus",
  // Suessen
  "sugar", "granulated sugar", "brown sugar", "powdered sugar", "icing sugar", "coconut sugar", "cane sugar", "honey", "molasses", "stevia", "erythritol", "monk fruit",
  "zucker", "puderzucker", "rohrzucker", "kokosbl(ü|ue)tenzucker", "honig", "erythrit", "birkenzucker", "xylit",
  // Gewuerze und Kraeuter, einzeln
  "salt", "pepper", "black pepper", "peppercorns?", "paprika", "smoked paprika", "cumin", "coriander", "cilantro", "parsley", "basil", "oregano", "thyme", "rosemary", "sage", "dill", "mint", "bay lea(f|ves)", "cinnamon", "nutmeg", "cloves?", "cardamom", "turmeric", "allspice", "cayenne", "red pepper flakes", "saffron", "vanilla beans?", "star anise", "fennel seeds?", "mustard seeds?", "herbs", "zest", "juice", "lemon juice", "lime juice",
  "salz", "meersalz", "pfeffer", "kreuzk(ü|ue)mmel", "kumin", "koriander", "petersilie", "basilikum", "oregano", "thymian", "rosmarin", "salbei", "dill", "minze", "lorbeer(bl(ä|ae)tter)?", "zimt", "muskat(nuss)?", "nelken?", "kardamom", "kurkuma", "piment", "cayennepfeffer", "safran", "vanilleschoten?", "sternanis", "senfsaat", "kr(ä|ae)uter", "abrieb", "\\w*saft", "schale", "zitronenschale",
  // Saeure, Triebmittel ohne Mischung, Wasser, Getraenke
  "vinegar", "apple cider vinegar", "cider vinegar", "wine vinegar", "rice vinegar", "balsamic", "baking soda", "bicarbonate of soda", "cream of tartar", "agar", "psyllium", "water", "ice", "coffee", "espresso", "tea", "wine", "red wine", "white wine",
  "essig", "apfelessig", "weinessig", "reisessig", "balsamico", "natron", "weinstein", "agar", "flohsamenschalen", "wasser", "eisw(ü|ue)rfel", "kaffee", "espresso", "tee", "wein", "rotwein", "wei(ß|ss)wein",
  // Staerken ohne Getreide
  "cornstarch", "corn starch", "potato starch", "tapioca", "arrowroot", "maisst(ä|ae)rke", "kartoffelst(ä|ae)rke", "tapioka",
].map((w) => "\\b" + w + "\\b").join("|"), "giu");

/* Mengen, Einheiten, Beschreibungen, Fuellwoerter. Keine Lebensmittel. */
const BESCHREIBUNG = new RegExp("\\b(" + [
  "cups?", "c", "tbsps?", "tablespoons?", "tbs", "tsps?", "teaspoons?", "grams?", "g", "kg", "mg", "ml", "l", "liters?", "litres?", "oz", "ounces?", "lbs?", "pounds?", "pinch(es)?", "dash(es)?", "cans?", "tins?", "packages?", "pkg", "jars?", "bottles?", "bunch(es)?", "handfuls?", "sprigs?", "stalks?", "heads?", "slices?", "pieces?", "sticks?", "inch(es)?", "cm", "mm", "quarts?", "pints?", "florets?", "fillets?", "filets?", "thighs?", "breasts?", "drumsticks?", "wings?", "tenderloins?", "loins?", "shoulders?", "chops?", "cutlets?", "yolks?", "whites?", "leaves", "leaf", "segments?", "wedges?", "rounds?", "strips?", "chunks?", "cubes?", "rings?", "halves", "half", "thirds?", "quarters?", "puree", "purée", "pulp", "flesh", "meat", "zested", "juiced",
  "chopped", "diced", "minced", "fresh", "freshly", "large", "small", "medium", "finely", "roughly", "coarsely", "thinly", "sliced", "grated", "shredded", "ground", "melted", "softened", "room", "temperature", "divided", "taste", "peeled", "seeded", "pitted", "cored", "trimmed", "halved", "quartered", "cubed", "crushed", "organic", "raw", "cooked", "uncooked", "frozen", "thawed", "dried", "whole", "unsweetened", "sweetened", "plain", "packed", "heaped", "heaping", "level", "about", "approx", "approximately", "plus", "more", "serving", "servings", "garnish", "needed", "desired", "extra", "virgin", "light", "dark", "pure", "natural", "full", "fat", "low", "reduced", "sodium", "range", "boneless", "skinless", "skin", "bone", "even", "bite", "sized", "size", "blanched", "superfine", "fine", "coarse", "kosher", "sea", "flaky", "table", "granulated", "toasted", "roasted", "unroasted", "salted", "unsalted", "smoked", "sweet", "hot", "mild", "spicy", "ripe", "firm", "soft", "hard", "thick", "thin", "cold", "warm", "lukewarm", "boiling", "cool", "cooled", "chilled", "beaten", "whisked", "lightly", "well", "good", "quality", "rinsed", "drained", "washed", "squeezed", "cut", "torn", "baby", "young", "mini", "jumbo", "lean", "red", "white", "green", "yellow", "black", "brown", "golden", "purple", "heavy", "double", "single", "store", "bought", "homemade", "leftover", "regular", "mixed", "assorted", "brand", "favorite", "favourite", "loosely", "tightly", "firmly", "generous", "scant", "small", "big", "inches", "pounds", "ounces", "zest", "zested", "juice",
  "and", "or", "of", "to", "a", "an", "the", "for", "into", "in", "on", "with", "at", "as", "if", "each", "per", "few", "some", "any", "other", "such", "your", "we", "like", "use", "used", "recommend", "is", "are", "be", "can", "will", "also", "works", "work", "great", "swap", "substitute", "sub", "alternatively", "instead", "plus", "more", "less", "than", "from", "about", "roughly", "around", "up", "out", "off", "over", "then", "this", "that", "these", "those", "it", "its", "you", "i", "my", "our", "note", "notes", "see", "below", "above", "recipe", "optional", "approx", "e", "g", "eg", "ie", "x", "by", "weight", "volume", "total", "time", "day", "days", "hours?", "minutes?", "overnight", "ahead",
  "el", "tl", "prisen?", "bund", "dosen?", "packungen?", "pck", "pkg", "st(ü|ue)ck", "stk", "zehen?", "scheiben?", "becher", "gl(a|ä)s(er)?", "handvoll", "msp", "messerspitze", "zweige?", "stangen?", "k(ö|oe)pfe?", "r(ö|oe)schen", "bl(ä|ae)tter", "filets?", "schenkel", "brust", "brustfilets?", "w(ü|ue)rfel", "streifen", "spalten", "ringe", "h(ä|ae)lften?", "fruchtfleisch",
  "gehackt", "gehackte", "gehackter", "gew(ü|ue)rfelt", "gew(ü|ue)rfelte", "frisch", "frische", "frischer", "frischen", "frisches", "gro(ß|ss)e?", "gro(ß|ss)er", "gro(ß|ss)es", "klein", "kleine", "kleiner", "kleines", "mittelgro(ß|ss)e?", "fein", "feine", "feiner", "grob", "gerieben", "geriebener", "geriebene", "gemahlen", "gemahlene", "gemahlener", "geschmolzen", "geschmolzene", "weich", "weiche", "zimmerwarm", "zimmerwarme", "gesch(ä|ae)lt", "gesch(ä|ae)lte", "entkernt", "entsteint", "halbiert", "geviertelt", "getrocknet", "getrocknete", "tk", "tiefgek(ü|ue)hlt", "gefroren", "gefrorene", "natur", "bio", "reif", "reife", "eingelegt", "eingelegte", "ger(ö|oe)stet", "ger(ö|oe)stete", "gesalzen", "ungesalzen", "ungesalzene", "geräuchert", "ger(ä|ae)ucherte", "s(ü|ue)(ß|ss)e?", "scharf", "scharfe", "mild", "kalt", "kalte", "kaltes", "warm", "warme", "lauwarm", "lauwarme", "hei(ß|ss)", "gekocht", "gekochte", "roh", "rohe", "gegart", "abgetropft", "abgezogen", "ausgepresst", "geputzt", "gewaschen", "verquirlt", "zerlassen", "rot", "rote", "roter", "rotes", "gelb", "gelbe", "gr(ü|ue)n", "gr(ü|ue)ne", "wei(ß|ss)", "wei(ß|ss)e", "wei(ß|ss)er", "schwarz", "schwarze", "schwarzer", "braun", "braune", "brauner", "dunkel", "dunkle", "hell", "helle", "ganz", "ganze", "ganzer", "halb", "halbe", "halber",
  "von", "und", "oder", "zum", "zur", "f(ü|ue)r", "mit", "ohne", "ca", "etwa", "nach", "belieben", "geschmack", "bedarf", "evtl", "eventuell", "optional", "bestreuen", "garnieren", "servieren", "braten", "kochen", "backen", "anbraten", "der", "die", "das", "den", "dem", "des", "ein", "eine", "einer", "einem", "einen", "als", "wie", "auch", "je", "pro", "plus", "bzw", "z", "b", "zb", "nehme", "nehmen", "ich", "du", "man", "viel", "wenig", "etwas", "reichlich", "in", "auf", "aus", "vom", "bei", "(ü|ue)ber", "unter", "am", "im", "mehr", "weniger", "oben", "unten", "siehe", "rezept", "tipp", "hinweis", "alternativ", "statt", "anstatt", "gut", "sehr", "schön", "deiner", "deine", "meiner", "meine", "wahl", "sorte", "sorten", "beliebig", "beliebige", "beliebiger", "verwendet", "verwende", "geht", "gehen", "funktioniert", "auch", "noch", "nur", "zu", "zum", "zur",
].join("|") + ")\\b", "giu");

function zeileBekannt(z) {
  /* Zuerst die Nahrungsmittel, dann alles, was kein Nahrungsmittel ist. Was
     danach uebrig bleibt, kennt die Pruefung nicht. */
  let rest = z.toLowerCase()
    .replace(/gluten[\s-]?free|glutenfrei/g, " ")
    .replace(POSITIV, " ")
    .replace(/[\d½¼¾⅓⅔⅛⅜⅝⅞°]+/g, " ")
    .replace(/[^\p{L}\s]+/gu, " ")
    .replace(BESCHREIBUNG, " ")
    .replace(/\s+/g, " ").trim();
  const uebrig = rest.split(" ").filter((w) => w.length >= 2);
  return { bekannt: !uebrig.length && POSITIV.test(z.toLowerCase()), uebrig };
}

/* Ueberschriften ("For the sauce:") und Ausstattung sind keine Zutaten. */
const KEINE_ZUTAT = /^[^\d]{0,40}:\s*$|^(for the|f(ü|ue)r (den|die|das))\b|piping bag|spritzbeutel|parchment|backpapier|cooking spray|non-?stick spray|zahnstocher|toothpicks?|skewers?|spie(ß|ss)e\b/i;

function glutenPruefen(zutaten) {
  const packung = [];
  for (const roh of zutaten) {
    const z = String(roh || "").trim();
    POSITIV.lastIndex = 0;
    if (!z || KEINE_ZUTAT.test(z)) continue;
    const gf = /gluten[\s-]?free|glutenfrei|certified|zertifiziert/i.test(z) && !WEICH.test(z);
    if (ALTERNATIVE.test(z)) return { ok: false, grund: "glutenhaltige Alternative", zeile: z };
    if (WEICH.test(z)) return { ok: false, grund: "glutenfrei nur auf Wunsch", zeile: z };
    if (GESPERRT.some((re) => re.test(z))) {
      if (gf) { packung.push(z); continue; }
      return { ok: false, grund: "gesperrte Zutat", zeile: z };
    }
    if (NUR_MIT_ZUSATZ.some((re) => re.test(z))) {
      if (gf || GF_SORTE.test(z)) { packung.push(z); continue; }
      return { ok: false, grund: "ohne Zusatz glutenfrei", zeile: z };
    }
    if (PACKUNG.test(z)) { packung.push(z); continue; }
    const k = zeileBekannt(z);
    if (!k.bekannt) return { ok: false, grund: "nicht bestaetigt: " + (k.uebrig.join(" ") || "keine bekannte Zutat"), zeile: z };
  }
  return { ok: true, packung };
}

module.exports = { glutenPruefen, GESPERRT, NUR_MIT_ZUSATZ, PACKUNG, POSITIV };
