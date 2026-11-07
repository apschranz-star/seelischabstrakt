# Privacy

**Where Sofia's data lives.** Profile, weight, lab results, diary, medicines
and settings are stored in the browser on her phone (localStorage, key
`sofia-v1`). There is no account, no database and no server copy.

**What goes over the network.** The page's security policy allows connections
only to its own address. The only request is `GET /api/ricette`, the public
list of recipes chosen by the council. Fonts, 3D and PDF libraries are served
from the same address. No analytics, no external fonts, no tracking.

**Lab reports.** A PDF is read inside the browser with pdf.js. The file is not
uploaded and not stored; only the values Sofia confirms are saved.

**Backup.** An encrypted file made on the phone: PBKDF2-SHA256 with 600,000
iterations, then AES-GCM 256. Without the passphrase it is unreadable.

**This repository.** It is public. It contains the plan's foods and amounts,
the evidence files and the code, but no surname, no contact details of the
nutritionist and no health data of Sofia (a test enforces this). The plan's
author is credited by name as the source of the amounts.

**Access.** The site sits behind an access code (the repository's gate) and
asks search engines not to index it. The code keeps casual visitors out; it
is not encryption. The data that matters never reaches the site anyway.

**Delete.** Settings, Backup, "Cancella tutto" removes everything from the phone.
