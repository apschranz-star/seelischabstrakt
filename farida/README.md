# faridabenslimane.netlify.app

Sito dello studio privato di Farida Benslimane. Cinque lingue: italiano, inglese, tedesco, francese,
arabo. L'italiano è la lingua di partenza, l'arabo si scrive da destra a sinistra e il sito si gira
da solo. Nessun framework, nessun build, nessun database.

    index.html    la pagina
    modulo.html   il modulo che Farida compila dal telefono, non è collegato al sito
    content.json  tutto il contenuto
    img/          le foto

## Come si aggiorna
Tutto sta in content.json. Si apre su GitHub, si tocca la matita, si scrive, si salva. Un minuto dopo
è online. Oppure lo fa ChatGPT con l'azione practice, vedi HANDOVER.md nella cartella principale.

- Ogni testo è {"it": "...", "en": "...", "de": "...", "fr": "...", "ar": "..."}. Se manca una
  traduzione viene mostrato l'italiano, quindi il sito non si rompe mai.
- "draft": true scrive un blocco ma non lo pubblica. Le sezioni approccio, prestazioni, pareri e
  studio partono così: appaiono solo quando i dati ci sono e draft diventa false.
- Un campo vuoto sparisce dalla pagina. Non si scrive mai un dato inventato per riempire.
- Foto in img/, lato lungo 1400 px, sotto i 450 kB, poi profile.photo = "img/nome.jpg".

## Le recensioni
Le recensioni verificate restano su MioDottore. Non si copiano qui: appartengono alla piattaforma e a
chi le ha scritte, e ripubblicarle tocca il diritto d'autore e il GDPR. Il sito rimanda al profilo con
un link.

Sul sito compaiono solo i pareri per cui esiste un permesso scritto del paziente:

    { "id": "m-1", "name": "M.", "date": "2026-09-14", "text": "parole sue", "consent": true }

Con consent false il parere resta salvato ma invisibile. Il testo non si corregge e non si traduce.

## Obblighi di legge
Il sito di un medico in Italia informa, non promuove. Niente promesse di risultato, niente
superlativi, niente confronti con altri medici. In content.json, sotto "legal", vanno il numero di
iscrizione all'Ordine con la provincia e la partita IVA: finché quei campi sono vuoti il blocco resta
nascosto, ma prima di diffondere il sito vanno compilati. In fondo a ogni pagina c'è la frase che il
sito non sostituisce una visita e il rimando al 112.

## Netlify (una volta sola)
1. Netlify, Add new project, Import from Git, stesso repository.
2. Base directory: farida. Publish directory: farida. Build command vuoto.
3. Deploy, poi Project configuration, General, Change project name: faridabenslimane.
4. Dominio proprio più tardi: Domain management, Add domain, poi cambiare l'indirizzo in index.html
   (canonical e og:url), sitemap.xml e robots.txt.

---

## Kurz für Alexander
Dritte Seite aus demselben Repository, Ordner `farida`. Inhalt liegt in `farida/content.json`, alles
fünfsprachig. Der Custom GPT pflegt sie über die Aktion `practice` (`/api/practice`), dieselben
Netlify-Variablen wie beim Shop, kein zusätzliches Setup. Alles, was noch keine Daten hat, steht auf
`draft: true` und ist unsichtbar, damit nichts Erfundenes online geht. Bewertungen von MioDottore
werden nicht kopiert, nur verlinkt; eigene Patientenstimmen erscheinen erst mit `consent: true`.
