/*
 * Le contenu d'Anker en francais, tenu a l'ecart du code.
 *
 * Ce fichier est fait pour etre modifie. Qui veut formuler un point
 * autrement, ajouter une recette ou prendre en compte une analyse de plus
 * change ici et nulle part ailleurs. L'application ne fait que lire.
 *
 * CE QUI SE TROUVE ICI ET CE QUI NE S'Y TROUVE PAS
 * Tout ce qui est ici est de l'information generale, telle qu'elle figure
 * dans les recommandations et dans les etudes publiees. Rien n'est adapte a
 * une personne en particulier, rien ne remplace une consultation, et rien ici
 * ne dit quelle dose est la bonne. La ou les preuves sont minces, cela est
 * indique. Ce ne sont pas des petits caracteres, c'est le sujet meme : il
 * circule beaucoup de choses sur le lupus qui n'ont jamais ete testees, et la
 * difference entre « mesure dans une etude » et « ecrit sur internet » vaut
 * tout le reste.
 */

window.INHALT = window.INHALT || {};
window.INHALT.fr = {};

/* ------------------------------------------------------------------ Signes */

window.INHALT.fr.symptome = [
  "Douleurs articulaires",
  "Raideur matinale",
  "Éruption en ailes de papillon",
  "Autre éruption",
  "Photosensibilité",
  "Aphtes buccaux",
  "Chute de cheveux",
  "Fièvre",
  "Ganglions gonflés",
  "Raynaud",
  "Yeux secs",
  "Bouche sèche",
  "Maux de tête",
  "Douleur thoracique en respirant",
  "Palpitations",
  "Essoufflement",
  "Douleurs abdominales",
  "Ballonnements",
  "Diarrhée",
  "Constipation",
  "Nausées",
  "Jambes gonflées",
  "Urines mousseuses",
  "Douleurs musculaires",
];

/* ---------------------------------------------------------------- Manger */

window.INHALT.fr.essen = [
  {
    kicker: "Maladie cœliaque",
    titel: "La règle sans exception",
    lead:
      "Dans la maladie cœliaque, le régime sans gluten n'est pas un régime parmi d'autres, " +
      "c'est le traitement. Il vaut à vie, y compris quand une petite quantité ne se fait " +
      "sentir en rien : la lésion de la muqueuse intestinale se produit aussi sans symptômes.",
    punkte: [
      { art: "nein", was: "Le blé sous toutes ses formes", warum: "L'épeautre, l'amidonnier, l'engrain, le kamut, l'épeautre vert et l'amidon de blé sans étiquetage en font partie. Les céréales anciennes sont du blé elles aussi." },
      { art: "nein", was: "L'orge et le seigle", warum: "Le malt, l'extrait de malt, l'arôme de malt et la bière d'orge sont les pièges les plus fréquents." },
      { art: "vielleicht", was: "L'avoine", warum: "L'avoine elle-même ne contient pas de gluten, mais elle est presque toujours transformée avec du blé. Seulement sous forme d'avoine expressément sans gluten, et même là une petite minorité ne la tolère pas." },
      { art: "ja", was: "Riz, maïs, sarrasin, millet, quinoa, amarante, teff", warum: "Sans gluten par nature. Le sarrasin, appelé aussi blé noir, n'est pas du blé." },
      { art: "ja", was: "Pomme de terre, légumineuses, fruits à coque, graines", warum: "Ce qui porte le repas quand le pain disparaît, avec en plus des protéines et des fibres." },
      { art: "ja", was: "Viande, poisson, œuf, produits laitiers, fruits, légumes non transformés", warum: "Tout ce qui n'a pas de liste d'ingrédients est la partie sûre des courses." },
    ],
  },
  {
    kicker: "Là où ça dérape",
    titel: "Caché et négligé",
    lead:
      "La plupart des expositions au gluten au quotidien ne viennent pas d'un pain, mais " +
      "d'un détail auquel personne ne pense.",
    punkte: [
      { art: "nein", was: "La sauce soja", warum: "La sauce soja classique est brassée avec du blé. Le tamari est le plus souvent sans gluten, mais seulement avec la mention." },
      { art: "nein", was: "Les friteuses où l'on cuit de la panure", warum: "Des frites sorties de la même friteuse que des produits panés ne sont pas sans gluten. Au restaurant, poser la question." },
      { art: "nein", was: "Le grille-pain partagé", warum: "Des miettes suffisent. Un grille-pain à toi ou un sachet de grillage règle la question." },
      { art: "nein", was: "Les liants dans les sauces et les soupes", warum: "Roux, cubes de bouillon, liants pour sauce, marinades toutes prêtes." },
      { art: "vielleicht", was: "Médicaments et compléments alimentaires", warum: "Rare, mais de l'amidon peut servir d'excipient. Faire vérifier à la pharmacie." },
      { art: "vielleicht", was: "« Peut contenir des traces »", warum: "Une indication volontaire du fabricant, pas une mesure. Ce qui porte le symbole de l'épi barré ou la mention sans gluten relève en revanche de la limite légale de 20 mg de gluten par kilogramme." },
      { art: "vielleicht", was: "Baisers, beurre partagé, planche à pain", warum: "À la maison, un beurrier à toi, une planche à toi et des pots à tartiner dans lesquels ne plonge qu'un seul couteau résolvent cela." },
    ],
  },
  {
    kicker: "Dans le lupus",
    titel: "Ce que la recherche suggère",
    lead:
      "Aucune alimentation ne guérit le lupus, et aucune étude ne montre qu'un changement " +
      "d'alimentation remplace les médicaments. Ce qui existe, ce sont des profils qui, dans " +
      "des études, vont de pair avec une activité de la maladie plus faible, de meilleurs " +
      "lipides sanguins et moins de fatigue. La force de ces preuves est indiquée au chapitre " +
      "Savoir, à chaque point.",
    punkte: [
      { art: "ja", was: "Le modèle méditerranéen", warum: "Légumes, fruits, légumineuses, huile d'olive, poisson, fruits à coque ; peu de viande rouge et transformée. Dans des études d'observation chez des personnes atteintes de lupus, il va de pair avec une activité de la maladie plus faible." },
      { art: "ja", was: "Du poisson gras deux fois par semaine", warum: "Saumon, maquereau, hareng, sardine. Les oméga-3 ont été étudiés dans le lupus dans plusieurs petites études contrôlées." },
      { art: "ja", was: "Assez de protéines réparties sur la journée", warum: "Cela tient les muscles, et les muscles sont ce qui part en premier avec la fatigue et sous corticoïdes." },
      { art: "ja", was: "Chercher les fibres exprès", warum: "La cuisine sans gluten en est pauvre d'elle-même. Légumineuses, graines de lin, légumes, fruits avec la peau." },
      { art: "vielleicht", was: "Le sel avec parcimonie", warum: "Chez l'animal, beaucoup de sel favorise des lymphocytes T inflammatoires. Chez l'être humain, cela n'est pas démontré dans le lupus. Pour la tension et les reins, cela reste malgré tout raisonnable." },
      { art: "vielleicht", was: "L'alcool", warum: "Avec le méthotrexate et au vu du foie, c'est un sujet pour la consultation, pas pour une application." },
    ],
  },
  {
    kicker: "Prudence",
    titel: "Ce qu'il vaut mieux écarter dans le lupus",
    lead:
      "Liste courte, et chaque point a une raison concrète. Tout le reste de ce qui circule " +
      "sur internet comme interdit du lupus ne résiste le plus souvent pas à un examen.",
    punkte: [
      { art: "nein", was: "Les germes de luzerne et les préparations à base de luzerne", warum: "Ils contiennent de la L-canavanine. Il existe là-dessus des cas rapportés de tableaux ressemblant au lupus et des essais chez le singe. Les preuves sont anciennes et minces, mais s'en passer ne coûte rien, et c'est pourquoi ce point figure dans presque toutes les recommandations aux patientes." },
      { art: "nein", was: "Les préparations stimulant l'immunité", warum: "L'échinacée et les produits semblables censés stimuler expressément le système immunitaire. Dans une maladie où le système immunitaire en fait déjà trop, c'est la mauvaise direction." },
      { art: "vielleicht", was: "Les préparations à haute dose prises de son propre chef", warum: "Surtout tout ce qui touche au fer : le fer ne se remplace que lorsqu'une carence a été mesurée." },
      { art: "vielleicht", was: "Le pamplemousse", warum: "Il influence la dégradation de certains médicaments. Savoir si cela concerne les tiens, la pharmacie le dit en une minute." },
      { art: "nein", was: "Le tabac", warum: "Il augmente l'activité de la maladie, il diminue l'efficacité de l'hydroxychloroquine et il aggrave le risque cardiaque, déjà élevé par ailleurs." },
    ],
  },
  {
    kicker: "Les deux ensemble",
    titel: "Les nutriments qui basculent doublement ici",
    lead:
      "La maladie cœliaque abîme l'absorption, le lupus et son traitement augmentent les " +
      "besoins ou les pertes. Ces valeurs se mesurent, elles ne se devinent pas, et on ne " +
      "remplace que ce qui manque.",
    punkte: [
      { art: "vielleicht", was: "Fer et ferritine", warum: "La carence la plus fréquente dans la maladie cœliaque, et une cause très fréquente de fatigue qui n'a rien à voir avec le lupus." },
      { art: "vielleicht", was: "Vitamine D", warum: "Doublement menacée dans le lupus : le soleil est évité, les corticoïdes augmentent les pertes, et dans la maladie cœliaque l'intestin absorbe moins bien." },
      { art: "vielleicht", was: "Vitamine B12 et folates", warum: "Les deux sont absorbés dans l'intestin grêle, précisément là où agit la maladie cœliaque. En plus, les farines sans gluten sont rarement enrichies." },
      { art: "vielleicht", was: "Calcium", warum: "Important pour l'os, et l'os est doublement sous pression dans la maladie cœliaque et sous corticoïdes." },
      { art: "vielleicht", was: "Zinc et magnésium", warum: "Ils sont mesurés avec le reste dans la maladie cœliaque quand les symptômes persistent." },
    ],
  },
  {
    kicker: "Rester honnête",
    titel: "Les pièges de la cuisine sans gluten",
    lead:
      "Sans gluten ne veut pas dire sain. Les produits sans gluten tout prêts sont souvent " +
      "faits d'amidon pur, pauvres en fibres et plus chers. C'est un problème connu, pas un " +
      "échec personnel.",
    punkte: [
      { art: "vielleicht", was: "Peu de fibres", warum: "L'amidon de riz, l'amidon de maïs et le tapioca n'en apportent presque pas. Les légumineuses, les graines de lin, les téguments de psyllium et les légumes compensent." },
      { art: "vielleicht", was: "Beaucoup d'amidon rapide", warum: "Le pain blanc sans gluten fait monter la glycémie plus brutalement que l'original. À combiner avec des protéines et des graisses." },
      { art: "vielleicht", was: "Le riz comme base principale", warum: "Le riz capte l'arsenic du sol. Pas de quoi paniquer, mais une raison d'alterner entre sarrasin, millet, quinoa, pomme de terre et maïs plutôt que du riz tous les jours." },
      { art: "vielleicht", was: "Peu de vitamines B", warum: "La farine de blé est enrichie dans beaucoup de pays, les farines sans gluten le sont rarement." },
    ],
  },
];

/* --------------------------------------------------------------- Recettes */

window.INHALT.fr.rezepte = [
  {
    name: "Assiette sans cuisson",
    aufwand: "0 minute",
    warum:
      "Pour les jours où la cuisinière est trop loin. Malgré tout des protéines, des graisses " +
      "et un peu de vert, donc mieux que rien et mieux qu'un biscuit.",
    zutaten: [
      "1 boîte de sardines ou de maquereau à l'huile d'olive",
      "1 poignée de tomates cerises ou du concombre",
      "Galettes de riz ou pain sans gluten",
      "Huile d'olive, citron, sel",
    ],
    schritte: [
      "Ouvrir la boîte, mettre dans l'assiette.",
      "Ajouter les légumes, sans les couper si ce n'est pas nécessaire.",
      "Du citron dessus, de l'huile dessus, c'est prêt.",
    ],
    achtung: "Les galettes de riz en accompagnement seulement, pas comme base tous les jours. Les sardines apportent des oméga-3, du calcium et de la vitamine D.",
  },
  {
    name: "Flocons d'avoine de la veille, sans gluten",
    aufwand: "3 minutes le soir",
    warum: "Le matin, le petit déjeuner est déjà prêt. Des fibres et du fer venus des graines.",
    zutaten: [
      "50 g de flocons d'avoine sans gluten",
      "150 ml de lait ou de boisson végétale",
      "1 cuillère à soupe de graines de lin moulues ou de graines de chia",
      "1 cuillère à café de purée d'oléagineux",
      "Des fruits",
    ],
    schritte: [
      "Tout mettre dans un bocal, mélanger, fermer.",
      "Une nuit au réfrigérateur.",
      "Le matin, les fruits par-dessus.",
    ],
    achtung: "Uniquement de l'avoine expressément sans gluten. Une petite minorité de personnes cœliaques ne tolère pas non plus l'avoine pure ; après l'avoir introduite, surveiller les symptômes et en parler avec ta médecin.",
  },
  {
    name: "Soupe de lentilles",
    aufwand: "25 minutes, une casserole",
    warum:
      "Du fer, des fibres et des protéines à partir d'un ingrédient bon marché. Elle tient trois " +
      "jours au réfrigérateur et se congèle en portions, ce qui vaut plus, les mauvais jours, que " +
      "n'importe quelle recette.",
    zutaten: [
      "200 g de lentilles corail",
      "1 oignon, 2 gousses d'ail, 2 carottes",
      "1 cuillère à soupe de concentré de tomate",
      "1 cuillère à café de cumin, 1 cuillère à café de paprika",
      "1 l de bouillon de légumes sans gluten",
      "Citron, huile d'olive",
    ],
    schritte: [
      "Couper finement l'oignon, l'ail et la carotte et les faire suer dans l'huile.",
      "Faire revenir brièvement le concentré de tomate et les épices avec.",
      "Ajouter les lentilles et le bouillon, laisser mijoter 20 minutes.",
      "Relever avec du citron. Le citron n'est pas un accessoire ici : la vitamine C améliore nettement l'absorption du fer d'origine végétale.",
    ],
    achtung: "Vérifier le bouillon, beaucoup de cubes contiennent du blé.",
  },
  {
    name: "Saumon au four, légumes à côté",
    aufwand: "25 minutes, une plaque",
    warum: "Des oméga-3 et de la vitamine D en un seul plat, et la plaque est toute la vaisselle.",
    zutaten: [
      "2 filets de saumon",
      "Brocoli, poivron, courgette, ce qu'il y a",
      "Huile d'olive, sel, citron",
      "Pommes de terre en quartiers",
    ],
    schritte: [
      "Four à 200 degrés.",
      "Pommes de terre et légumes avec de l'huile et du sel sur la plaque, 15 minutes.",
      "Ajouter le saumon, encore 10 à 12 minutes.",
      "Du citron dessus.",
    ],
  },
  {
    name: "Bol de sarrasin",
    aufwand: "20 minutes",
    warum: "Du sarrasin à la place du riz, pour ne pas avoir du riz dans l'assiette tous les jours.",
    zutaten: [
      "150 g de sarrasin",
      "1 boîte de pois chiches",
      "Concombre, tomate, oignon rouge",
      "Yaourt ou tahini, citron, huile d'olive",
      "Persil",
    ],
    schritte: [
      "Cuire le sarrasin 12 à 15 minutes dans de l'eau salée, égoutter, laisser refroidir.",
      "Couper les légumes, rincer les pois chiches.",
      "Tout mélanger, verser par-dessus une sauce au yaourt ou au tahini avec du citron.",
    ],
    achtung: "Le sarrasin n'est pas du blé, mais en rayon il est souvent posé à côté des farines. Faire attention à l'étiquetage.",
  },
  {
    name: "Curry de pois chiches",
    aufwand: "20 minutes, une casserole",
    warum: "Du fer et des fibres, et c'est meilleur le deuxième jour.",
    zutaten: [
      "2 boîtes de pois chiches",
      "1 boîte de tomates, 1 boîte de lait de coco",
      "Oignon, ail, gingembre",
      "Poudre de curry ou garam masala",
      "Épinards, frais ou surgelés",
    ],
    schritte: [
      "Faire revenir l'oignon, l'ail et le gingembre, faire griller brièvement les épices avec.",
      "Ajouter les tomates et le lait de coco, laisser mijoter 10 minutes.",
      "Incorporer les pois chiches et les épinards, laisser finir hors du feu.",
    ],
    achtung: "Les pâtes de curry toutes prêtes et les mélanges d'épices peuvent contenir du blé comme support.",
  },
  {
    name: "Légumes au four, en réserve",
    aufwand: "40 minutes, dont 5 de travail",
    warum:
      "La vraie réponse à la fatigue n'est pas une recette rapide, mais un réfrigérateur dans " +
      "lequel quelque chose de prêt attend déjà. Une plaque une fois, un accompagnement pour trois jours.",
    zutaten: [
      "Les légumes qu'il y a, en gros morceaux",
      "Huile d'olive, sel, herbes",
      "Avec cela une plaque de pommes de terre ou de patates douces",
    ],
    schritte: [
      "Tout sur deux plaques, de l'huile dessus, 200 degrés, 35 à 40 minutes.",
      "Une fois froid, en boîtes au réfrigérateur.",
      "Plus tard, en faire un repas avec un œuf, des pois chiches, du poisson ou du yaourt.",
    ],
  },
  {
    name: "Réveil vert",
    aufwand: "4 minutes",
    warum: "Quand mâcher est déjà trop. Pas un remplacement des repas, mais mieux qu'un repas sauté.",
    zutaten: [
      "1 poignée d'épinards",
      "1 banane, 1 poignée de baies",
      "1 cuillère à soupe de purée d'oléagineux ou de graines de lin",
      "Yaourt ou boisson végétale",
      "Le jus d'une demi-orange",
    ],
    schritte: ["Tout au mixeur.", "Ne pas laisser l'orange de côté, la vitamine C va chercher le fer dans les épinards."],
  },
];

/* ------------------------------------------------------- Analyses de sang */

window.INHALT.fr.laborwerte = [
  { schluessel: "dsdna", gruppe: "Lupus", name: "Anti-ADN natif", einheit: "IU/ml", bedeutung: "Un anticorps qui, dans le lupus, monte et descend souvent avec l'activité de la maladie. Des valeurs qui montent sont un signal, pas un diagnostic." },
  { schluessel: "c3", gruppe: "Lupus", name: "Complément C3", einheit: "g/l", bedeutung: "Baisse typiquement quand le lupus est actif, parce que le complément est consommé dans le processus inflammatoire." },
  { schluessel: "c4", gruppe: "Lupus", name: "Complément C4", einheit: "g/l", bedeutung: "Comme le C3. Les deux se lisent ensemble comme une évolution, pas comme une valeur isolée." },
  { schluessel: "bsg", gruppe: "Inflammation", name: "Vitesse de sédimentation", einheit: "mm/h", bedeutung: "Élevée de façon non spécifique en cas d'inflammation. Dans le lupus, souvent haute alors que la CRP reste normale." },
  { schluessel: "crp", gruppe: "Inflammation", name: "CRP", einheit: "mg/l", bedeutung: "Souvent normale dans le lupus. Une CRP nettement élevée oriente plutôt le soupçon vers une infection, ce qui compte sous immunosuppression." },
  { schluessel: "kreatinin", gruppe: "Rein", name: "Créatinine", einheit: "mg/dl", bedeutung: "Mesure de la fonction rénale." },
  { schluessel: "upcr", gruppe: "Rein", name: "Rapport protéinurie sur créatininurie", einheit: "mg/g", bedeutung: "Le signe précoce le plus important d'une atteinte rénale. Les protéines dans les urines ne font pas mal et ne se remarquent que si on les cherche." },
  { schluessel: "hb", gruppe: "Hémogramme", name: "Hémoglobine", einheit: "g/dl", bedeutung: "L'anémie est l'une des causes physiques les plus fréquentes de fatigue, et elle est fréquente aussi bien dans le lupus que dans la maladie cœliaque." },
  { schluessel: "leuko", gruppe: "Hémogramme", name: "Leucocytes", einheit: "/nl", bedeutung: "Souvent bas dans le lupus, et sous certains médicaments leur évolution est une valeur de sécurité." },
  { schluessel: "thrombo", gruppe: "Hémogramme", name: "Plaquettes", einheit: "/nl", bedeutung: "Peuvent être basses dans le lupus." },
  { schluessel: "ttg", gruppe: "Maladie cœliaque", name: "IgA anti-transglutaminase", einheit: "U/ml", bedeutung: "La valeur de suivi de la maladie cœliaque. Sous un régime sans gluten suivi sans faille, elle baisse au fil des mois. Une valeur qui remonte évoque une arrivée de gluten." },
  { schluessel: "iga", gruppe: "Maladie cœliaque", name: "IgA totales", einheit: "g/l", bedeutung: "Dosées une fois : en cas de déficit en IgA, les IgA anti-transglutaminase seraient faussement basses et le test sans valeur." },
  { schluessel: "ferritin", gruppe: "Nutriments", name: "Ferritine", einheit: "ng/ml", bedeutung: "Les réserves de fer. Attention : la ferritine monte aussi avec l'inflammation, c'est pourquoi dans le lupus elle se lit avec la CRP." },
  { schluessel: "vitd", gruppe: "Nutriments", name: "Vitamine D, 25-OH", einheit: "ng/ml", bedeutung: "Souvent basse dans le lupus, parce que le soleil est évité et que les corticoïdes augmentent les pertes." },
  { schluessel: "b12", gruppe: "Nutriments", name: "Vitamine B12", einheit: "pg/ml", bedeutung: "Absorbée dans l'intestin grêle, donc exactement là où agit la maladie cœliaque." },
  { schluessel: "folat", gruppe: "Nutriments", name: "Folates", einheit: "ng/ml", bedeutung: "Comme la B12. Particulièrement importants en cas de désir d'enfant et sous certains médicaments." },
  { schluessel: "tsh", gruppe: "Thyroïde", name: "TSH", einheit: "mU/l", bedeutung: "Une thyroïde qui fonctionne au ralenti donne exactement la fatigue que l'on attribue au lupus. Les maladies thyroïdiennes auto-immunes sont plus fréquentes dans les deux maladies de fond." },
];

/* ------------------------------------------------------ Signaux d'alarme */

window.INHALT.fr.warnzeichen = [
  {
    kicker: "Tout de suite",
    titel: "Appel d'urgence ou service d'urgences",
    punkte: [
      { dringend: "nein", zeichen: "Difficulté à respirer ou forte douleur thoracique", warum: "Cela peut être une embolie pulmonaire, une péricardite ou une pleurésie. Dans le lupus, le risque de caillots est augmenté, surtout avec des anticorps antiphospholipides." },
      { dringend: "nein", zeichen: "Faiblesse soudaine, trouble de la parole ou de la vue", warum: "Signes d'accident vasculaire cérébral. Dans le lupus, à prendre au sérieux à tout âge." },
      { dringend: "nein", zeichen: "Crise convulsive ou confusion importante", warum: "Cela peut être une atteinte du système nerveux." },
      { dringend: "nein", zeichen: "Fièvre élevée sous immunosuppression", warum: "Sous immunosuppression, une infection peut devenir grave vite, et la réaction de défense habituelle manque. Ne pas attendre." },
      { dringend: "nein", zeichen: "Maux de tête intenses avec raideur de la nuque", warum: "Suspicion de méningite." },
    ],
  },
  {
    kicker: "Cette semaine",
    titel: "En consultation sans tarder",
    punkte: [
      { dringend: "vielleicht", zeichen: "Urines mousseuses, jambes ou paupières gonflées", warum: "Signe de protéines dans les urines, et donc d'une atteinte rénale. La néphrite lupique ne donne longtemps aucun symptôme et ne se trouve que par le contrôle des urines." },
      { dringend: "vielleicht", zeichen: "Nouvelle éruption avec fièvre et douleurs articulaires", warum: "Tableau typique d'une poussée." },
      { dringend: "vielleicht", zeichen: "Nettement moins d'urine que d'habitude", warum: "Cela doit être exploré du côté du rein." },
      { dringend: "vielleicht", zeichen: "Saignements ou bleus sans raison", warum: "Cela peut indiquer des plaquettes basses." },
      { dringend: "vielleicht", zeichen: "Diarrhée persistante, perte de poids malgré le régime sans gluten", warum: "Dans la maladie cœliaque, la cause la plus fréquente est du gluten caché, mais cela doit être examiné." },
      { dringend: "vielleicht", zeichen: "Nouveau trouble de la vue sous hydroxychloroquine", warum: "Le dépistage rétinien suit un rythme fixe, un trouble nouveau n'attend pas ce rythme." },
    ],
  },
  {
    kicker: "À aborder au prochain rendez-vous",
    titel: "Important, mais pas urgent",
    punkte: [
      { dringend: "ja", zeichen: "Une fatigue qui s'aggrave sur des semaines", warum: "Cela doit être exploré : hémogramme, thyroïde, fer, vitamine D, sommeil, humeur. Tout cela n'est pas le lupus, et c'est une bonne nouvelle, car beaucoup de ces choses se traitent." },
      { dringend: "ja", zeichen: "Nouvelles chutes de cheveux, aphtes buccaux, photosensibilité", warum: "Ils font partie de la description de l'activité et devraient être notés." },
      { dringend: "ja", zeichen: "Humeur, anxiété, élan", warum: "Fréquents dans le lupus et étroitement mêlés à la fatigue. Ils sont trop rarement abordés." },
      { dringend: "ja", zeichen: "Le désir d'enfant, même s'il est encore loin", warum: "Certains médicaments doivent être changés longtemps à l'avance, et dans le lupus une grossesse se planifie au mieux dans une phase calme." },
    ],
  },
];

/* ---------------------------------------------------------------- Questions */

window.INHALT.fr.fragen = [
  { frage: "À quel point mon lupus est-il actif en ce moment, en chiffres ?", warum: "Il existe des instruments de mesure pour cela. Connaître son propre chiffre rend l'évolution lisible sur des années." },
  { frage: "Quand les urines ont-elles été contrôlées pour la dernière fois à la recherche de protéines ?", warum: "Le rein ne se manifeste pas de lui-même." },
  { frage: "Quelles analyses faut-il contrôler et à quelle fréquence, et qui les prescrit ?", warum: "Pour que rien ne reste en suspens entre le médecin traitant et la consultation hospitalière." },
  { frage: "Quand mon prochain dépistage rétinien est-il prévu ?", warum: "Avec l'hydroxychloroquine, il y a pour cela un rythme fixe." },
  { frage: "À combien est ma dose de corticoïdes, et quel est le plan pour la baisser ?", warum: "Les recommandations visent la dose d'entretien la plus basse possible." },
  { frage: "Le fer, la vitamine D, la B12, les folates et le calcium ont-ils été dosés récemment ?", warum: "Dans la maladie cœliaque et sous corticoïdes, c'est le ravitaillement le plus important, et une cause fréquente de fatigue." },
  { frage: "À quand remonte la dernière ostéodensitométrie, et en faut-il une ?", warum: "La maladie cœliaque et les corticoïdes agissent tous les deux sur l'os." },
  { frage: "Comment évoluent mes IgA anti-transglutaminase ?", warum: "Elles montrent si le régime sans gluten est vraiment sans faille." },
  { frage: "Quels vaccins me manquent, et lesquels ne puis-je pas recevoir sous ce traitement ?", warum: "Les vaccins vivants sont un sujet à part sous immunosuppression." },
  { frage: "Que fais-je en cas de fièvre ou d'infection, qui est-ce que j'appelle ?", warum: "Ce plan, on veut l'avoir avant d'en avoir besoin." },
  { frage: "Quelle contraception convient à ma situation ?", warum: "En présence d'anticorps antiphospholipides, la contraception contenant des œstrogènes demande des considérations particulières." },
  { frage: "Ai-je le droit de faire du sport, et combien, même quand je vais mal ?", warum: "La réponse est presque toujours oui, mais la dose se discute, surtout en cas d'atteinte cardiaque, pulmonaire ou rénale." },
];
