/* Italian first (the plan is in Italian), English second. */
let LINGUA = "it";
export const lingua = () => LINGUA;
export function impostaLingua(l) {
  LINGUA = l === "en" ? "en" : "it";
  document.documentElement.lang = LINGUA;
}
/* An object with it/en keys, or a plain string. */
export function L(o) {
  if (o == null) return "";
  if (typeof o === "string") return o;
  return o[LINGUA] != null ? o[LINGUA] : o.it;
}

const T = {
  oggi: ["Oggi", "Today"],
  settimana: ["Settimana", "Week"],
  cibo: ["Cibo", "Food"],
  salute: ["Salute", "Health"],
  corpo: ["Corpo 5D", "Body 5D"],
  consiglio: ["Il consiglio", "The council"],
  impostazioni: ["Impostazioni", "Settings"],
  ciao: ["Ciao", "Hi"],
  pianoDiOggi: ["Il piano di oggi", "Today's plan"],
  nessunaSettimana: ["Ancora nessuna settimana", "No week yet"],
  creaSettimana: ["Crea la mia settimana", "Create my week"],
  rimescolaSettimana: ["Rimescola la settimana", "Shuffle the week"],
  rimescolaPasto: ["Rimescola questo pasto", "Shuffle this meal"],
  inverti: ["Inverti pranzo e cena", "Swap lunch and dinner"],
  invertito: ["Pranzo e cena invertiti", "Lunch and dinner swapped"],
  facoltativo: ["facoltativo", "optional"],
  ricetta: ["Ricetta", "Recipe"],
  ricette: ["Ricette", "Recipes"],
  scambi: ["Scambi", "Swaps"],
  dalWeb: ["Dal web", "From the web"],
  regole: ["Regole", "Rules"],
  acqua: ["Acqua", "Water"],
  caffe: ["Caffè", "Coffee"],
  camminata: ["Camminata veloce", "Brisk walk"],
  comeStai: ["Come stai oggi", "How are you today"],
  energia: ["Energia", "Energy"],
  umore: ["Umore", "Mood"],
  sonno: ["Sonno", "Sleep"],
  dolori: ["Dolori articolari", "Joint pain"],
  intestino: ["Disturbi intestinali", "Gut symptoms"],
  pelle: ["Pelle", "Skin"],
  nebbia: ["Testa annebbiata", "Brain fog"],
  glutineSospetto: ["Possibile contatto con glutine", "Possible gluten exposure"],
  salva: ["Salva", "Save"],
  annulla: ["Annulla", "Cancel"],
  chiudi: ["Chiudi", "Close"],
  aggiungi: ["Aggiungi", "Add"],
  elimina: ["Elimina", "Delete"],
  peso: ["Peso", "Weight"],
  esami: ["Esami", "Lab results"],
  diario: ["Diario", "Diary"],
  panoramica: ["Panoramica", "Overview"],
  backup: ["Backup", "Backup"],
  listaSpesa: ["Lista della spesa", "Shopping list"],
  approvata: ["Approvata", "Approved"],
  adattata: ["Adattata", "Adapted"],
  respinta: ["Respinta", "Rejected"],
  fonte: ["Fonte", "Source"],
  minuti: ["min", "min"],
  ingredienti: ["Ingredienti", "Ingredients"],
  procedimento: ["Procedimento", "Method"],
  aPiacere: ["A piacere", "As you like"],
  verdetti: ["Verdetti del consiglio", "Council verdicts"],
  infoMancante: ["Informazione mancante", "Information missing"],
  privacy: ["I tuoi dati restano su questo telefono.", "Your data stays on this phone."],
};

export function t(k) {
  const v = T[k];
  if (!v) return k;
  return LINGUA === "en" ? v[1] : v[0];
}
