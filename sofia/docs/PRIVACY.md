# Privacy

**Where Sofia's data lives.** Profile, weight, lab results, check-ins, the
food log, her own foods and recipes, the foods she does not eat, unit weights,
medicines and settings are stored in the browser on her phone (localStorage,
key `sofia-v1`). There is no account, no database and no server copy. The
access code stays on the phone too: `sofia-accesso` holds its hash,
`sofia-codice` the code itself, which opens the plan text.

**What goes over the network.** The page's security policy allows connections
only to its own address. Two requests carry anything beyond static files:

- `GET /api/ricette`: the public list of recipes chosen by the council.
- `GET /api/alimento?q=<food name>`: only when Sofia presses the online search
  for a food. The app's own Netlify function sends that name, and nothing
  else, to Open Food Facts (search.openfoodfacts.org) and returns the packages
  found. Open Food Facts sees Netlify's server, not her phone. The name and the
  results are kept in the project's Netlify Blobs store `sofia-alimenti` for
  7 days, so the same search does not go out twice; the daily run deletes
  older answers. Nothing that identifies her is stored with them.

Fonts, the 3D library, the PDF reader and the food composition table are
served from the same address. No analytics, no external fonts, no tracking.
Netlify, the host, logs each request: IP address and the address requested,
which for a food search includes the food name.

**Lab reports.** A PDF is read inside the browser with pdf.js. The file is not
uploaded and not stored; only the values Sofia confirms are saved.

**Backup.** An encrypted file made on the phone: PBKDF2-SHA256 with 600,000
iterations, then AES-GCM 256. The file's header is bound to the encryption, so
a changed header is detected. Without the passphrase it is unreadable.

**The plan's text.** The nutritionist's text (Italian original and English
translation) is published only encrypted (`data/piano-testo.cifrato.json`,
same method, the key is the access code). The plain text is kept outside the
repository.

**This repository.** It is public. It contains the plan's foods and amounts,
the evidence files and the code, but no surname, no contact details, no health
data of Sofia and no plain text of the nutritionist's letter (tests enforce
this). The nutritionist's name appears only in the encrypted plan text.

**Access.** The site asks search engines not to index it and shows a gate that
holds only a hash of the access code. The gate keeps casual visitors out; it
is not access control: the static files, the encrypted plan text included,
load without it, and the plan text stays unreadable without the code. Who can
open the site at all is decided by the project's visitor access setting in
Netlify (password protection), managed by ALX. The data that matters never
reaches the site anyway.

**Delete.** Settings, Backup, "Cancella tutto" removes everything Sofia
entered from the phone. The access code stays, so the app still opens;
clearing the browser's data for the site removes it too.
