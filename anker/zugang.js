/* Aus gate/gate.snippet.html erzeugt von gate/split.py. Nicht von Hand
   aendern: die naechste Veroeffentlichung ueberschreibt die Datei. */
(function(){
  var KEY="5rdoHGJM3mlN";
  if(!KEY||KEY.indexOf("__")===0)return;
  var STORE="sa-access",PARAM="zugang",q=null;
  try{q=new URLSearchParams(location.search).get(PARAM);}catch(e){}
  var ok=false;
  try{if(q===KEY){localStorage.setItem(STORE,KEY);}ok=localStorage.getItem(STORE)===KEY;}catch(e){ok=q===KEY;}
  /* Der Code wird aus der Adresszeile genommen, sobald er geprueft ist: was der
     Besucher danach kopiert oder weitergibt, traegt ihn nicht mehr, und er steht
     in keinem Verlauf und in keinem Referrer der naechsten Seite. Im Protokoll
     des Hosters steht er trotzdem, denn die erste Anfrage ging mit ihm hinaus.
     Nur der Parameter zugang wird entfernt; alle anderen bleiben stehen, sonst
     reisst das Tor jeden Deep Link der Seite mit. */
  if(q!==null){try{var u=new URL(location.href);u.searchParams.delete(PARAM);history.replaceState(null,"",u.pathname+u.search+u.hash);}catch(e){}}
  if(ok)return;
  /* Kein noindex von hier: die Anweisung steht schon fest in der Datei, gesetzt
     beim Veroeffentlichen von gate/inject.sh und von schranz-ai/build.mjs. Das
     ist der einzige Weg, der auch bei einem Crawler ohne JavaScript haelt, und
     zweimal dasselbe im Kopf ist eine Zeile, die auseinanderlaufen kann. */
  document.documentElement.setAttribute("data-gated","");
  var open=function(){
    /* Erst schreiben, dann nachsehen, ob es angekommen ist. Ein Browser im
       privaten Fenster oder mit gesperrtem Speicher nimmt nichts an; ein Neuladen
       faende dann wieder nichts und stellte dieselbe Maske hin, also oeffnet sich
       die Seite in diesem Fall hier, fuer diesen Besuch. */
    var kept=false;
    try{localStorage.setItem(STORE,KEY);kept=localStorage.getItem(STORE)===KEY;}catch(e){}
    if(kept){location.reload();return;}
    var f=document.getElementById("sa-gate");
    if(f&&f.parentNode)f.parentNode.removeChild(f);
    document.documentElement.removeAttribute("data-gated");
  };
  document.addEventListener("DOMContentLoaded",function(){
    var f=document.createElement("form");f.id="sa-gate";f.setAttribute("lang","de");
    f.innerHTML='<p class="k">Zugang &middot; Access</p><h1>Anker</h1>'
      +'<p>Diese Seite ist nicht &ouml;ffentlich. Bitte den Zugangscode eingeben.<br><span lang="en">This page is not public. Please enter the access code.</span></p>'
      +'<label for="sa-gate-code">Zugangscode &middot; <span lang="en">Access code</span></label>'
      +'<input id="sa-gate-code" name="'+PARAM+'" type="password" autocomplete="off" required autofocus>'
      +'<button type="submit">&Ouml;ffnen &middot; <span lang="en">Open</span></button>'
      +'<p class="e" role="alert" hidden>Der Code stimmt nicht. <span lang="en">The code is not correct.</span></p>'
      /* Wer eine Seite betreibt und was sie speichert, steht vor dem Zugang, nicht dahinter.
         Art. 13 DSGVO gilt auch fuer diese Ansicht. */
      +'<details class="n"><summary>Wer diese Seite betreibt und was gespeichert wird &middot; <span lang="en">Who runs this page and what is stored</span></summary>'
      +'<p>Nicht &ouml;ffentliche Vorschau von Alexander Schranz. Diese Ansicht legt nur den Zugang im lokalen Speicher deines Browsers ab, damit du den Code nicht jedes Mal eingeben musst. Das ist f&uuml;r den gew&uuml;nschten Dienst unbedingt erforderlich und braucht keine Einwilligung. Die Seite liegt bei GitHub Inc., USA, deren Server beim Aufruf die IP-Adresse protokollieren, Art. 6 Abs. 1 lit. f DSGVO. Kein Tracking, keine Cookies von Dritten, keine Schriften von fremden Servern. Impressum und Datenschutzerkl&auml;rung stehen auf der Seite selbst.</p>'
      +'<p lang="en">Private preview by Alexander Schranz. This screen only keeps your access in your browser storage so you do not have to type the code again. That storage is strictly necessary for the service you asked for and needs no consent. The page is hosted by GitHub Inc., USA, whose servers log your IP address on each request, Art. 6 (1) (f) GDPR. No tracking, no third party cookies, no fonts from other servers. The imprint and the privacy policy are on the page itself.</p>'
      +'</details>';
    if(q!==null){var e=f.querySelector(".e");if(e)e.hidden=false;}
    /* Geprueft wird hier im Feld, deshalb hat der Knopf kein Ziel: das Formular
       wird nie abgeschickt. Ohne JavaScript gibt es weder diese Maske noch die
       Sperre darunter, die Seite liegt dann offen. Das Tor haelt Suchmaschinen
       und Zufallsbesucher fern, es ist kein Schutz. Siehe gate/README.md. */
    f.addEventListener("submit",function(ev){
      var v=(f.querySelector("#sa-gate-code")||{}).value;
      if(v===KEY){ev.preventDefault();open();return;}
      ev.preventDefault();
      var e=f.querySelector(".e");if(e)e.hidden=false;
      var i=f.querySelector("#sa-gate-code");if(i){i.value="";i.focus();}
    });
    document.body.appendChild(f);
  });
})();
