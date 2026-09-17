# JING starten

Ein Prompt, ein Deploy. Voraussetzung: ChatGPT mit GitHub und Netlify verbunden, das Repository apschranz-star/seelischabstrakt freigegeben.

## Der Prompt

Diesen Text in ChatGPT einsetzen:

    Lege auf Netlify eine neue Site aus dem GitHub-Repository apschranz-star/seelischabstrakt an.
    Production branch: jing. Base directory: leer lassen. Build command: npm run build.
    Publish directory: .next. Die Datei netlify.toml im Branch enthält diese Werte bereits,
    übernimm sie, falls Netlify sie anbietet. Environment-Variablen sind nicht nötig.
    Site name: jing-shop, wenn frei, sonst ein Name, der mit jing beginnt.
    Starte den ersten Deploy, warte, bis er fertig ist, und gib mir die Adresse der Site
    und den Status des Deploys. Ist der Deploy rot, gib mir die letzten zwanzig Zeilen
    des Build-Logs im Wortlaut.

Danach ist die Seite unter der genannten Adresse erreichbar, mit funktionierender Kasse im Mock-Betrieb. Jeder Push auf den Branch jing baut sie neu.

## Was Netlify dabei tut

netlify.toml im Code legt fest: Build mit `npm run build`, Ausgabe `.next`, Node 22, das Next.js-Runtime-Plugin von Netlify. Die Adresse der Site liest der Code aus Netlifys eigener Variable URL, deshalb stimmen Canonical- und Open-Graph-Tags ab dem ersten Deploy. Die Kasse bleibt eine Attrappe, bis PAYMENT_PROVIDER_KEY als Environment-Variable gesetzt ist, und das ist derzeit der einzige unterstützte Zustand.

## Wenn der GPT nicht an Netlify kommt

Netlify, Add new project, Import an existing project, GitHub, Repository seelischabstrakt wählen. Branch to deploy: jing. Base directory leer, Build command `npm run build`, Publish directory `.next`. Deploy. Fertig. Danach unter Project configuration, General, Change project name auf jing-shop.

Oder im Terminal, im Ordner des Codes:

    npx netlify-cli login
    npx netlify-cli sites:create --name jing-shop
    npx netlify-cli link
    npx netlify-cli deploy --build --prod

## Wenn der Deploy nicht baut

Steht im Netlify-Konto "operational credits" oder "builds paused", baut Netlify nichts, auch nicht für diese Seite. Das ist eine Abrechnungsfrage im Konto, kein Fehler im Code. Sobald das Konto wieder baut, unter Deploys, Trigger deploy.

Meldet das Build-Log einen Fehler im Code, denselben Fehler zuerst lokal reproduzieren: `npm ci`, `npm run build`. Was lokal durchläuft, läuft auch auf Netlify.

## Danach

Adresse in den Instructions des GPT eintragen, damit er weiss, was live ist. Die Demo auf GitHub Pages kann bleiben oder verschwinden, sie ist unabhängig. Bevor irgendetwas verkauft wird, gilt die Tabelle "Vor dem Livegang zu erledigen" in README.md.
