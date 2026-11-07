/*
 * Italian food words and the words the CIQUAL table (English edition) uses
 * for them. Only for search: an Italian query finds the English entry, and the
 * entry is shown with the Italian word. Values are never translated here, they
 * come from the table.
 */
export const PAROLE = {
  /* vegetables */
  spinaci: ["spinach"], spinacio: ["spinach"], zucchine: ["courgette"], zucchina: ["courgette"], zucchino: ["courgette"],
  broccoli: ["broccoli"], broccolo: ["broccoli"], pomodori: ["tomato"], pomodoro: ["tomato"], pomodorini: ["cherry tomato", "tomato"],
  peperoni: ["sweet pepper"], peperone: ["sweet pepper"], finocchio: ["fennel"], finocchi: ["fennel"],
  melanzane: ["eggplant"], melanzana: ["eggplant"], carote: ["carrot"], carota: ["carrot"], lattuga: ["lettuce"], insalata: ["lettuce"],
  rucola: ["rocket"], cavolfiore: ["cauliflower"], fagiolini: ["french bean"], asparagi: ["asparagus"], asparago: ["asparagus"],
  carciofi: ["artichoke"], carciofo: ["artichoke"], funghi: ["mushroom"], fungo: ["mushroom"], champignon: ["button mushroom"],
  cetrioli: ["cucumber"], cetriolo: ["cucumber"], sedano: ["celery"], porri: ["leek"], porro: ["leek"], cipolla: ["onion"], cipolle: ["onion"],
  zucca: ["pumpkin", "squash"], bietole: ["swiss chard"], bieta: ["swiss chard"], cicoria: ["chicory"], radicchio: ["red endive"],
  indivia: ["endive"], scarola: ["endive"], valeriana: ["lamb's lettuce"], songino: ["lamb's lettuce"], "cavoletti di bruxelles": ["brussels sprout"],
  "cavolo nero": ["curly kale"], "cavolo riccio": ["curly kale"], cavolo: ["cabbage"], verza: ["cabbage"], "cavolo rosso": ["red cabbage"],
  barbabietola: ["beetroot"], rape: ["turnip"], rapa: ["turnip"], ravanelli: ["radish"], ravanello: ["radish"], piselli: ["garden peas"],
  aglio: ["garlic"], scalogno: ["shallot"], germogli: ["sprouted"], "germogli di soia": ["mung bean, sprouted", "soy spouts"], "germogli di fagioli mung": ["mung bean, sprouted"], "germogli di lenticchie": ["lentils, sprouted"], "germogli di erba medica": ["alfalfa seeds, sprouted", "alfalfa"], "erba medica": ["alfalfa"], alfalfa: ["alfalfa"],
  avocado: ["avocado"], olive: ["olive"], oliva: ["olive"], mais: ["corn", "maize"], polenta: ["polenta"], okra: ["okra"],
  /* potatoes */
  patate: ["potato"], patata: ["potato"], "patate dolci": ["sweet potato"], "patata dolce": ["sweet potato"], "patata americana": ["sweet potato"], manioca: ["cassava"],
  /* legumes */
  lenticchie: ["lentil"], ceci: ["chick pea", "chickpea"], fagioli: ["haricot bean", "bean, dried", "kidney bean", "bean"], "fagioli secchi": ["bean, dried"], cannellini: ["white bean", "haricot bean", "bean, dried"], borlotti: ["bean, dried", "bean"],
  fave: ["broad bean"], "piselli secchi": ["split pea"], soia: ["soy", "soybean"], lupini: ["lupin"], edamame: ["soybean", "edamame"],
  /* fruit */
  mela: ["apple"], mele: ["apple"], pera: ["pear"], pere: ["pear"], banana: ["banana"], banane: ["banana"], arancia: ["orange"], arance: ["orange"],
  mandarino: ["mandarin", "clementine"], mandarini: ["mandarin"], clementine: ["clementine"], kiwi: ["kiwi"], fragole: ["strawberry"], fragola: ["strawberry"],
  mirtilli: ["blueberry"], mirtillo: ["blueberry"], lamponi: ["raspberry"], lampone: ["raspberry"], more: ["blackberry"], mora: ["blackberry"],
  uva: ["grape"], pesca: ["peach"], pesche: ["peach"], nettarina: ["nectarine"], albicocca: ["apricot"], albicocche: ["apricot"],
  prugna: ["plum"], prugne: ["plum"], susina: ["plum"], susine: ["plum"], ciliegie: ["cherry"], ciliegia: ["cherry"], melone: ["melon"],
  anguria: ["watermelon"], cocomero: ["watermelon"], ananas: ["pineapple"], fichi: ["fig"], fico: ["fig"], melograno: ["pomegranate"],
  cachi: ["persimmon"], caco: ["persimmon"], limone: ["lemon"], limoni: ["lemon"], pompelmo: ["grapefruit"], mango: ["mango"], papaya: ["papaya"],
  datteri: ["date"], dattero: ["date"], "prugne secche": ["prune"], uvetta: ["raisin"], "uva passa": ["raisin"], "albicocche secche": ["apricot, dried"],
  /* nuts and seeds */
  noci: ["walnut"], noce: ["walnut"], mandorle: ["almond"], mandorla: ["almond"], nocciole: ["hazelnut"], nocciola: ["hazelnut"],
  pistacchi: ["pistachio"], pistacchio: ["pistachio"], anacardi: ["cashew"], arachidi: ["peanut"], noccioline: ["peanut"], pinoli: ["pine nut"],
  "noci brasiliane": ["brazil nut"], "noci pecan": ["pecan"], "semi di chia": ["chia"], chia: ["chia"], "semi di lino": ["linseed", "flax"],
  lino: ["linseed", "flax"], "semi di zucca": ["pumpkin seed", "cucurbitacea, seed"], "semi di girasole": ["sunflower seed"], sesamo: ["sesame"], "semi di sesamo": ["sesame"],
  cocco: ["coconut"], "burro di arachidi": ["peanut butter"],
  /* grains */
  riso: ["rice"], "riso integrale": ["rice, brown", "brown rice"], "riso basmati": ["basmati"], "riso venere": ["black rice", "rice"], quinoa: ["quinoa"],
  "grano saraceno": ["buckwheat"], saraceno: ["buckwheat"], miglio: ["millet"], sorgo: ["sorghum"], amaranto: ["amaranth"], teff: ["teff"],
  avena: ["oat"], "fiocchi di avena": ["oat flakes", "oatmeal"], orzo: ["barley"], farro: ["spelt"], frumento: ["wheat"], grano: ["wheat"],
  "cous cous": ["couscous"], couscous: ["couscous"], cuscus: ["couscous"], bulgur: ["bulgur"], semola: ["semolina"], semolino: ["semolina"],
  segale: ["rye"], kamut: ["kamut", "khorasan"], pasta: ["pasta"], "pasta di riso": ["rice pasta", "rice-maize", "pasta, gluten-free"],
  "pasta di legumi": ["lens based pasta", "legume", "lentil pasta"], "pasta di lenticchie": ["lens based pasta", "lentil"], "pasta senza glutine": ["pasta, gluten-free", "gluten-free"],
  pane: ["bread"], "pane senza glutine": ["bread, gluten-free", "gluten-free bread", "gluten-free"], gallette: ["rice cake", "puffed"], galletta: ["rice cake", "puffed"],
  cracker: ["cracker"], grissini: ["breadstick"], fette: ["rusk"], "fette biscottate": ["rusk"], cereali: ["breakfast cereal", "cereal"],
  "corn flakes": ["corn flakes"], muesli: ["muesli"], farina: ["flour"], pangrattato: ["breadcrumb"], piadina: ["flatbread", "piadina"], tortilla: ["tortilla"],
  /* fish */
  salmone: ["salmon"], tonno: ["tuna"], merluzzo: ["cod"], nasello: ["hake"], orata: ["gilthead seabream", "seabream", "sea bream"], branzino: ["sea bass", "seabass"], spigola: ["sea bass", "seabass"],
  sogliola: ["sole"], platessa: ["plaice"], trota: ["trout"], sgombro: ["mackerel"], sardine: ["sardine"], sarde: ["sardine"], alici: ["anchovy"],
  acciughe: ["anchovy"], "pesce spada": ["swordfish"], gamberi: ["shrimp", "prawn"], gamberetti: ["shrimp"], calamari: ["squid"], calamaro: ["squid"],
  seppia: ["cuttlefish"], seppie: ["cuttlefish"], polpo: ["octopus"], cozze: ["mussel"], vongole: ["clam"], baccala: ["salt cod", "cod, salted"],
  stoccafisso: ["dried cod", "stockfish"], surimi: ["surimi"], "bastoncini di pesce": ["fish fingers", "breaded"], pesce: ["fish"],
  /* meat */
  pollo: ["chicken"], "petto di pollo": ["chicken, breast", "chicken breast"], tacchino: ["turkey"], "petto di tacchino": ["turkey, breast"], coniglio: ["rabbit"],
  vitello: ["veal"], manzo: ["beef"], "macinato di manzo": ["beef, minced", "minced beef", "minced steak"], macinato: ["minced"], maiale: ["pork"], "lonza di maiale": ["pork loin"],
  agnello: ["lamb"], cavallo: ["horse"], anatra: ["duck"],
  /* cured meat */
  "prosciutto cotto": ["ham, cooked", "cooked ham"], "prosciutto crudo": ["cured ham", "dry-cured ham"], prosciutto: ["ham"],
  bresaola: ["bresaola", "dried beef"], speck: ["speck", "smoked ham"], salame: ["salami"], mortadella: ["mortadella"], wurstel: ["frankfurter", "sausage"],
  salsiccia: ["sausage"], pancetta: ["bacon"], "affettato di pollo": ["chicken", "cooked"], "affettato di tacchino": ["turkey", "cooked"],
  /* eggs */
  uovo: ["egg"], uova: ["egg"], albume: ["egg white"], albumi: ["egg white"], tuorlo: ["egg yolk"],
  /* milk and dairy */
  latte: ["milk"], "latte scremato": ["milk, skimmed"], "latte parzialmente scremato": ["milk, semi-skimmed"], "latte intero": ["milk, whole"],
  yogurt: ["yogurt"], "yogurt greco": ["yogurt, greek-style"], kefir: ["kefir"], panna: ["cream"],
  mozzarella: ["mozzarella"], ricotta: ["ricotta"], "fiocchi di latte": ["cottage cheese"], philadelphia: ["cream cheese"], "formaggio spalmabile": ["cream cheese", "spreadable"],
  parmigiano: ["parmesan"], grana: ["grana", "parmesan"], pecorino: ["pecorino"], feta: ["feta"], scamorza: ["scamorza"], provola: ["provolone"],
  stracchino: ["stracchino", "soft cheese"], gorgonzola: ["gorgonzola", "blue cheese"], emmental: ["emmental"], brie: ["brie"], camembert: ["camembert"],
  caprino: ["goat cheese", "goat's milk cheese"], formaggio: ["cheese"], "bevanda di soia": ["soy drink", "soya drink"], "latte di soia": ["soy drink", "soya drink"],
  "bevanda di avena": ["oat drink", "oat-based"], "latte di avena": ["oat drink", "oat-based"], "bevanda di riso": ["rice drink", "rice-based"], "latte di mandorla": ["almond drink", "almond-based"],
  /* fats */
  "olio extravergine": ["olive oil, extra virgin"], "olio di oliva": ["olive oil"], olio: ["olive oil, extra virgin", "olive oil", "oil"], "olio di semi": ["sunflower oil", "oil"], "olio di girasole": ["sunflower oil"],
  "olio di mais": ["corn oil", "maize oil"], "olio di arachidi": ["peanut oil"], "olio di colza": ["rapeseed oil"], "olio di cocco": ["coconut oil"], burro: ["butter"], margarina: ["margarine", "spread"],
  /* sweet */
  zucchero: ["sugar"], miele: ["honey"], marmellata: ["jam"], confettura: ["jam"], cioccolato: ["chocolate"], "cioccolato fondente": ["dark chocolate"],
  cacao: ["cocoa"], biscotti: ["biscuit"], torta: ["cake"], gelato: ["ice cream"], "crema spalmabile": ["spread", "hazelnut"], "sciroppo d'acero": ["maple syrup"],
  merendine: ["cake", "pastry"], croissant: ["croissant"], cornetto: ["croissant"],
  /* drinks */
  acqua: ["water"], caffe: ["coffee"], "caffe espresso": ["espresso"], te: ["tea"], "te verde": ["green tea"], tisana: ["infusion", "herbal"], tisane: ["infusion", "herbal"],
  "succo d'arancia": ["orange juice"], succo: ["juice"], cola: ["cola"], bibita: ["soda", "soft drink"], birra: ["beer"], vino: ["wine"],
  /* spices, herbs, condiments */
  zenzero: ["ginger"], curcuma: ["turmeric"], cannella: ["cinnamon"], origano: ["oregano"], prezzemolo: ["parsley"], basilico: ["basil"], rosmarino: ["rosemary"],
  salvia: ["sage"], timo: ["thyme"], pepe: ["pepper"], peperoncino: ["chilli"], sale: ["salt"], aceto: ["vinegar"], "aceto balsamico": ["balsamic"],
  "salsa di soia": ["soy sauce"], tamari: ["tamari", "soy sauce"], senape: ["mustard"], ketchup: ["ketchup"], maionese: ["mayonnaise"], pesto: ["pesto"],
  passata: ["tomato, puree", "tomato puree", "passata"], "dado da brodo": ["stock cube", "bouillon"], brodo: ["broth", "stock"],
  /* plant proteins and dishes */
  tofu: ["tofu"], tempeh: ["tempeh"], seitan: ["seitan"], pizza: ["pizza"], lasagne: ["lasagne"], minestrone: ["minestrone", "vegetable soup"], zuppa: ["soup"],
  hummus: ["hummus"], falafel: ["falafel"], sushi: ["sushi"],
};

/* Italian word for the start of an English CIQUAL name, to label generic results. */
export const NOME_IT = (() => {
  const out = {};
  for (const [it, en] of Object.entries(PAROLE)) for (const e of en) { const k = e.toLowerCase(); if (!out[k]) out[k] = it.replace(/_$/, ""); }
  return out;
})();

export const normalizza = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
