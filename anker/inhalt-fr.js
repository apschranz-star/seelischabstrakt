/*
 * Le contenu d'Anker en français, tenu à l'écart du code.
 *
 * Ce fichier est fait pour être modifié. Qui veut formuler un point
 * autrement, ajouter une recette ou prendre en compte une analyse de plus
 * change ici et nulle part ailleurs. L'application ne fait que lire.
 *
 * CE QUI SE TROUVE ICI ET CE QUI NE S'Y TROUVE PAS
 * Tout ce qui est ici est de l'information générale, telle qu'elle figure
 * dans les recommandations et dans les études publiées. Rien n'est adapté à
 * une personne en particulier, rien ne remplace une consultation, et rien ici
 * ne dit quelle dose est la bonne. Là où les preuves sont minces, cela est
 * indiqué. Ce ne sont pas des petits caractères, c'est le sujet même : il
 * circule beaucoup de choses sur le lupus qui n'ont jamais été testées, et la
 * différence entre « mesuré dans une étude » et « écrit sur internet » vaut
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
      "c'est le traitement. Il vaut à vie, y compris quand une petite quantité ne provoque " +
      "rien de perceptible : la lésion de la muqueuse intestinale se produit aussi sans symptômes.",
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
      { art: "nein", was: "Le grille-pain partagé", warum: "Des miettes suffisent. Un grille-pain à toi ou un sachet spécial grille-pain règle la question." },
      { art: "nein", was: "Les liants dans les sauces et les soupes", warum: "Roux, cubes de bouillon, liants pour sauce, marinades toutes prêtes." },
      { art: "vielleicht", was: "Médicaments et compléments alimentaires", warum: "Rare, mais de l'amidon peut servir d'excipient. Faire vérifier à la pharmacie." },
      { art: "vielleicht", was: "« Peut contenir des traces »", warum: "Une indication volontaire du fabricant, pas une mesure. Ce qui porte le symbole de l'épi barré ou la mention sans gluten relève en revanche de la limite légale de 20 mg de gluten par kilogramme." },
      { art: "vielleicht", was: "Baisers, beurre partagé, planche à pain", warum: "À la maison, un beurrier à toi, une planche à toi et des pots de pâte à tartiner dans lesquels ne plonge qu'un seul couteau résolvent cela." },
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
      { art: "ja", was: "Le modèle méditerranéen", warum: "Légumes, fruits, légumineuses, huile d'olive, poisson, fruits à coque ; peu de viande rouge et transformée. Dans des études observationnelles chez des personnes atteintes de lupus, il va de pair avec une activité de la maladie plus faible." },
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
      { art: "nein", was: "Les germes de luzerne et les préparations à base de luzerne", warum: "Ils contiennent de la L-canavanine. Il existe là-dessus des rapports de cas décrivant des tableaux ressemblant au lupus, et des essais chez le singe. Les preuves sont anciennes et minces, mais s'en passer ne coûte rien, et c'est pourquoi ce point figure dans presque toutes les recommandations aux patientes." },
      { art: "nein", was: "Les préparations stimulant l'immunité", warum: "L'échinacée et les produits semblables censés stimuler expressément le système immunitaire. Dans une maladie où le système immunitaire en fait déjà trop, c'est la mauvaise direction." },
      { art: "vielleicht", was: "Les préparations à haute dose prises de son propre chef", warum: "Surtout tout ce qui touche au fer : le fer ne se remplace que lorsqu'une carence a été mesurée." },
      { art: "vielleicht", was: "Le pamplemousse", warum: "Il influence la dégradation de certains médicaments. Savoir si cela concerne les tiens, la pharmacie le dit en une minute." },
      { art: "nein", was: "Le tabac", warum: "Il augmente l'activité de la maladie, il diminue l'efficacité de l'hydroxychloroquine et il aggrave le risque cardiaque, déjà élevé par ailleurs." },
    ],
  },
  {
    kicker: "Les deux ensemble",
    titel: "Les nutriments qui manquent ici pour deux raisons",
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
  { schluessel: "ttg", gruppe: "Maladie cœliaque", name: "IgA anti-transglutaminase", einheit: "U/ml", bedeutung: "La valeur de suivi de la maladie cœliaque. Sous un régime sans gluten suivi sans faille, elle baisse au fil des mois. Une valeur qui remonte évoque des apports de gluten." },
  { schluessel: "iga", gruppe: "Maladie cœliaque", name: "IgA totales", einheit: "g/l", bedeutung: "Dosées une fois : en cas de déficit en IgA, les IgA anti-transglutaminase seraient faussement basses et le test sans valeur." },
  { schluessel: "ferritin", gruppe: "Nutriments", name: "Ferritine", einheit: "ng/ml", bedeutung: "Les réserves de fer. Attention : la ferritine monte aussi avec l'inflammation, c'est pourquoi dans le lupus elle se lit avec la CRP." },
  { schluessel: "vitd", gruppe: "Nutriments", name: "Vitamine D, 25-OH", einheit: "ng/ml", bedeutung: "Souvent basse dans le lupus, parce que le soleil est évité et que les corticoïdes augmentent les pertes." },
  { schluessel: "b12", gruppe: "Nutriments", name: "Vitamine B12", einheit: "pg/ml", bedeutung: "Absorbée dans l'intestin grêle, donc exactement là où agit la maladie cœliaque." },
  { schluessel: "folat", gruppe: "Nutriments", name: "Folates", einheit: "ng/ml", bedeutung: "Comme la B12. Particulièrement importants en cas de désir d'enfant et sous certains médicaments." },
  { schluessel: "tsh", gruppe: "Thyroïde", name: "TSH", einheit: "mU/l", bedeutung: "Une thyroïde qui fonctionne au ralenti donne exactement la fatigue que l'on attribue au lupus. Les maladies thyroïdiennes auto-immunes sont plus fréquentes dans ces deux maladies." },
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
      { dringend: "nein", zeichen: "Fièvre élevée sous immunosuppression", warum: "Sous immunosuppression, une infection peut s'aggraver rapidement, et la réaction de défense habituelle manque. Ne pas attendre." },
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
      { dringend: "ja", zeichen: "Humeur, anxiété, motivation", warum: "Fréquents dans le lupus et étroitement mêlés à la fatigue. Ils sont trop rarement abordés." },
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
  { frage: "Le fer, la vitamine D, la B12, les folates et le calcium ont-ils été dosés récemment ?", warum: "Dans la maladie cœliaque et sous corticoïdes, ce sont les apports les plus importants à surveiller, et une cause fréquente de fatigue." },
  { frage: "À quand remonte la dernière ostéodensitométrie, et en faut-il une ?", warum: "La maladie cœliaque et les corticoïdes agissent tous les deux sur l'os." },
  { frage: "Comment évoluent mes IgA anti-transglutaminase ?", warum: "Elles montrent si le régime sans gluten est vraiment sans faille." },
  { frage: "Quels vaccins me manquent, et lesquels ne puis-je pas recevoir sous ce traitement ?", warum: "Les vaccins vivants posent question sous immunosuppression." },
  { frage: "Que fais-je en cas de fièvre ou d'infection, qui est-ce que j'appelle ?", warum: "Ce plan, on veut l'avoir avant d'en avoir besoin." },
  { frage: "Quelle contraception convient à ma situation ?", warum: "En présence d'anticorps antiphospholipides, la contraception contenant des œstrogènes demande des considérations particulières." },
  { frage: "Ai-je le droit de faire du sport, et combien, même quand je vais mal ?", warum: "La réponse est presque toujours oui, mais la dose se discute, surtout en cas d'atteinte cardiaque, pulmonaire ou rénale." },
];

/* ------------------------------------------------------------------ Savoir */

window.INHALT.fr.wissen = [
  {
    kicker: "D'abord",
    titel: "Comment ce texte a vu le jour",
    abschnitte: [
      {
        frage: "D'où vient tout ceci, et qu'est-ce que cela vaut ?",
        antwort: [
          "Ce texte est un repère, pas un article scientifique et pas un deuxième avis. Il est écrit " +
            "de façon à pouvoir aller en consultation avec et à poser de meilleures questions.",
          "Lors de sa rédaction, les travaux originaux <b>n'ont pas pu être ouverts</b> : le réseau dans " +
            "lequel ce texte est né ne laisse pas passer les sites médicaux spécialisés. Chercher était " +
            "possible, lire non. Cela a une conséquence claire, et elle est écrite ici plutôt qu'en petits " +
            "caractères : <b>les chiffres isolés tirés des études, c'est-à-dire les pourcentages, les tailles " +
            "d'effet et les effectifs, ne figurent volontairement presque nulle part dans ce texte.</b> " +
            "Ce qui y figure, c'est la direction des résultats et la force des preuves.",
          "En revanche, chaque chapitre indique les documents originaux avec leur numéro. Avec un PMID, on " +
            "retrouve un travail en quelques secondes, et toute médecin y a accès. Ce texte est donc construit " +
            "comme un panneau indicateur vers les sources, pas comme leur remplacement.",
        ],
        staerke: "Mise en perspective, pas une preuve.",
      },
      {
        frage: "Ce que ce texte ne peut certainement pas faire",
        antwort: [
          "Il ne connaît pas tes résultats, pas tes atteintes d'organes et pas tes antécédents. C'est " +
            "précisément de cela que dépend, dans le lupus, presque chaque décision.",
          "Il ne dit rien sur aucune dose. Non parce que ce serait un secret, mais parce qu'une dose " +
            "indiquée sans la personne en face n'a pas de sens et peut faire des dégâts.",
          "Et c'est un état des lieux, pas un abonnement. Dans le lupus, beaucoup de choses ont bougé ces " +
            "dernières années. Quand ce texte vieillira, il ne deviendra pas faux, mais incomplet.",
        ],
      },
    ],
  },

  {
    kicker: "Le sujet principal",
    titel: "La fatigue",
    abschnitte: [
      {
        frage: "Pourquoi suis-je si fatiguée, alors que les analyses sont bonnes ?",
        antwort: [
          "Parce que dans le lupus c'est le cas normal et non l'exception. La fatigue est le symptôme le " +
            "plus fréquent et, pour beaucoup, le plus lourd, et elle ne suit <b>pas</b> l'activité mesurée de la maladie.",
          "C'est l'un des résultats les mieux répliqués de ce domaine : les scores d'activité habituels " +
            "n'expliquent qu'une petite part de l'épuisement ressenti. Un bilan calme n'exclut donc pas une " +
            "fatigue lourde. Qui le sait n'a pas à se justifier et continue à chercher au bon endroit.",
          "Ce qui, dans les études, est le plus fortement lié à la fatigue, ce sont <b>les troubles du " +
            "sommeil, la douleur, une fibromyalgie associée, l'humeur et l'anxiété</b>. Ce n'est pas une " +
            "dévalorisation du genre « alors c'est psychologique ». C'est le contraire : cela nomme des " +
            "choses contre lesquelles on peut agir.",
        ],
        staerke: "Solide pour le découplage d'avec l'activité mesurée. Solide pour le sommeil, la douleur, l'humeur et la fibromyalgie comme facteurs associés.",
        quellen: [
          "Arnaud L et al., LEAF-Studie, RMD Open 2023. PMID 38056917",
          "Monahan RC et al., Lupus 2021. PMID 33779389",
          "Ahn GE, Ramsey-Goldman R, Int J Clin Rheumatol 2012. PMC3380630",
          "Cornet A et al., Lupus Sci Med 2021;8:e000469",
        ],
      },
      {
        frage: "Que faut-il explorer avant d'attribuer la fatigue au lupus ?",
        antwort: [
          "Une partie de tout cela se traite bien, et c'est justement pour cela que la recherche en vaut " +
            "la peine. Avec une maladie cœliaque en plus, cela vaut doublement, parce que l'absorption dans " +
            "l'intestin peut être perturbée.",
        ],
        liste: [
          "<b>Hémogramme</b>, à cause de l'anémie. Fréquente dans le lupus comme dans la maladie cœliaque, et l'une des causes physiques les plus fréquentes d'épuisement.",
          "<b>Fer et ferritine</b>. Dans la maladie cœliaque, la carence la plus fréquente de toutes. Attention : la ferritine monte en cas d'inflammation, elle se lit avec la CRP.",
          "<b>Thyroïde</b>. Une hypothyroïdie donne exactement ce tableau, et les maladies thyroïdiennes auto-immunes sont plus fréquentes dans ces deux maladies.",
          "<b>Vitamine D, B12, folates</b>.",
          "<b>Fonction rénale et urines</b>, parce qu'une atteinte rénale reste longtemps muette.",
          "<b>Sommeil</b>. Un mauvais sommeil est très fréquent dans le lupus et, dans les études, le facteur associé le plus fort de la fatigue.",
          "<b>Humeur et anxiété</b>. La dépression et l'anxiété sont nettement plus fréquentes dans le lupus que dans la population générale.",
          "<b>Les médicaments</b>, comme sujet pour la consultation.",
        ],
        staerke: "Cette liste relève de la pratique clinique et de la logique des recommandations, pas d'une étude isolée.",
      },
      {
        frage: "Qu'est-ce qui aide vraiment contre la fatigue ?",
        antwort: [
          "La réponse honnête a deux parties. Premièrement : la mesure isolée la mieux étayée est " +
            "<b>l'activité physique</b>, adaptée et construite sur des semaines. Deuxièmement : les preuves " +
            "à ce sujet sont plus minces et plus contradictoires que ce qu'on lit dans les guides.",
          "Concrètement : une revue Cochrane de 2023 conclut à une faible certitude des résultats et ne " +
            "trouve pas de bénéfice statistiquement établi sur la fatigue. Une synthèse antérieure, de 2017, trouve en revanche un bénéfice moyen sur la fatigue, l'endurance, " +
            "l'humeur et la fonction. Les deux lisent presque les mêmes études et arrivent à des conclusions " +
            "différentes, parce qu'elles agrègent différemment. Des deux, la plus récente est la plus prudente, et " +
            "cela mérite d'être dit.",
          "Ce qu'on peut en retenir sans exagérer : l'activité physique est <b>sûre quand la maladie est " +
            "stable</b>, elle améliore l'endurance de façon fiable, et elle aide probablement un peu la " +
            "fatigue. C'est plus que ce qui est démontré pour toute autre mesure non médicamenteuse dans le lupus.",
          "La société savante européenne recommande expressément, dans les maladies rhumatismales " +
            "inflammatoires, de mesurer la fatigue et de proposer des activités physiques adaptées.",
        ],
        staerke: "Faible à moyenne. Synthèses contradictoires, études petites et le plus souvent menées en ouvert. Plus nette pour l'endurance que pour la fatigue.",
        quellen: [
          "Frade S et al., Cochrane Database Syst Rev 2023. DOI 10.1002/14651858.CD014816.pub2",
          "O'Dwyer T, Durcan L, Wilson F, Semin Arthritis Rheum 2017;47:204-215. PMID 28477898",
          "Tench CM et al., Rheumatology (Oxford) 2003;42:1050-1054. PMID 12730519",
          "Dures E et al., EULAR-Empfehlungen zu Fatigue, Ann Rheum Dis 2024;83:1260-1267. DOI 10.1136/ard-2023-224514",
        ],
      },
    ],
  },

  {
    kicker: "La question la plus fréquente",
    titel: "Le sport, même en poussée ?",
    abschnitte: [
      {
        frage: "Ai-je le droit de faire du sport pendant une poussée active ?",
        antwort: [
          "Ici, la précision compte plus qu'une réponse bien tournée, donc d'abord les faits : <b>il " +
            "n'existe aucune étude là-dessus.</b> Pratiquement toutes les études sur l'activité physique dans " +
            "le lupus ont inclus des personnes dont la maladie était calme ou peu active et ont expressément " +
            "exclu la maladie active. L'affirmation rassurante « l'activité physique n'aggrave pas le lupus » " +
            "est une affirmation sur les phases stables. Elle ne se transpose pas à une poussée aiguë.",
          "Ce qui existe, c'est une recommandation de consensus international de 2024. Elle dit en " +
            "substance : pendant une poussée, la <b>prudence</b> est de mise et il faut réexaminer si quelque " +
            "chose s'y oppose en ce moment. En cas de poussée avec des articulations enflammées, ce sont " +
            "précisément ces articulations qu'il ne faut pas solliciter. Celles dont la maladie est calme ou " +
            "légère devraient s'en tenir aux recommandations générales d'activité physique.",
          "Traduit dans la vie de tous les jours, cela ne veut pas dire « au lit », et cela ne veut pas dire " +
            "« tenir bon quand même ». Cela veut dire : en poussée, faire plus petit plutôt qu'arrêter. " +
            "Marcher plutôt que faire du fractionné, s'étirer et bouger doucement plutôt que faire de la " +
            "musculation, laisser de côté les articulations enflammées. Et : une nouvelle poussée se signale " +
            "avant d'adapter le programme d'entraînement, pas après.",
          "Une restriction qui figure dans la même recommandation et qu'on oublie facilement : en cas " +
            "d'atteinte cardiaque, pulmonaire ou rénale, sous anticoagulant ou en cas d'ostéonécrose, l'effort " +
            "doit être évalué médicalement avant d'être augmenté.",
        ],
        staerke: "Pour la poussée : seulement un consensus d'experts, pas d'études. Pour les phases stables : moyenne.",
        quellen: [
          "Blaess J et al., RMD Open 2024;10:e004171. DOI 10.1136/rmdopen-2024-004171",
          "Parodis I et al., EULAR, traitement non médicamenteux, Ann Rheum Dis 2024;83:720-729. PMID 37433575",
        ],
      },
      {
        frage: "Comment commencer quand monter un escalier fatigue déjà ?",
        antwort: [
          "Avec une quantité qui paraît trop petite, et avec laquelle on tient aussi le mauvais jour. " +
            "Ce n'est pas de la modestie, c'est la méthode : la raison la plus fréquente pour laquelle " +
            "l'activité physique échoue en cas d'épuisement, c'est un bon jour où l'on en fait trop, suivi de " +
            "trois jours au lit.",
          "Dans les études qui ont montré quelque chose, les programmes duraient le plus souvent <b>huit à " +
            "douze semaines</b>, à intensité moyenne et encadrés. Encadrés veut dire ici : quelqu'un suit. " +
            "Dans les analyses, c'était l'une des différences entre les programmes qui agissaient et ceux qui " +
            "n'agissaient pas.",
          "Un début utilisable : une petite quantité fixe chaque jour, la même les bons et les mauvais jours, " +
            "et un tout petit peu plus seulement après une à deux semaines sans contrecoup. Dans le suivi de " +
            "cette application, on voit après quelques semaines si la fatigue monte le lendemain d'une séance.",
        ],
        staerke: "Moyenne pour la durée et l'intensité des programmes. La démarche elle-même relève de la pratique, pas d'un résultat d'étude.",
      },
      {
        frage: "Et le pacing, c'est-à-dire la gestion des forces ?",
        antwort: [
          "Le pacing consiste à répartir ses forces sur la journée et à faire des pauses prévues " +
            "<b>avant</b> que plus rien ne soit possible, au lieu de continuer jusqu'à l'effondrement.",
          "Honnêtement : pour le lupus, il n'existe presque pas d'études là-dessus, seulement de petits " +
            "programmes d'éducation et une étude pilote en cours. Les données solides sur le pacing viennent " +
            "d'autres maladies, surtout l'EM/SFC et le Covid long, et là aussi elles sont mitigées. Savoir si " +
            "la fatigue du lupus se comporte comme celle-là n'est pas tranché.",
          "C'est quand même écrit ici, parce que ce n'est pas cher, que ce n'est pas dangereux et que c'est " +
            "réversible. Essayer pendant deux semaines et regarder dans le suivi si les mauvais jours " +
            "deviennent moins nombreux ne coûte rien.",
        ],
        staerke: "Faible dans le lupus. Transposition depuis d'autres maladies, où les résultats sont mitigés.",
      },
    ],
  },

  {
    kicker: "Alimentation",
    titel: "Ce qui est vraiment démontré dans le lupus",
    abschnitte: [
      {
        frage: "Existe-t-il un régime du lupus ?",
        antwort: [
          "Non. Il n'existe aucune forme d'alimentation dont il soit démontré qu'elle traite le lupus ou " +
            "qu'elle remplace les médicaments. Qui l'affirme a quelque chose à vendre.",
          "Ce qui existe, ce sont des profils. Le plus étudié est le <b>méditerranéen</b> : beaucoup de " +
            "légumes, des fruits, des légumineuses, de l'huile d'olive, du poisson, des fruits à coque, peu de " +
            "viande rouge et transformée. Dans des études transversales chez des personnes atteintes de lupus, " +
            "il va de pair avec une activité de la maladie plus faible et de meilleurs paramètres cardiaques.",
          "Le mot transversal est important : on regarde à un instant donné qui mange comment et comment il " +
            "va. Savoir si c'est l'alimentation qui fait la différence, ou s'il est plus facile de manger ainsi " +
            "quand la maladie est plus calme, une telle étude ne peut pas le démêler. Il n'existe pas dans le " +
            "lupus d'étude d'intervention achevée ayant l'activité de la maladie comme critère.",
          "Il y a malgré tout une bonne raison d'aller exactement dans cette direction : le <b>risque " +
            "cardiovasculaire</b> est nettement augmenté chez les jeunes femmes atteintes de lupus, et pour " +
            "cet objectif le modèle méditerranéen est mieux étayé que presque tout le reste en nutrition.",
        ],
        staerke: "Pour l'activité du lupus : faible, seulement observationnelle. Pour le cœur et les vaisseaux : bonne, mais venue de la population générale.",
      },
      {
        frage: "Oméga-3, vitamine D, curcuma et le reste",
        antwort: [
          "Les <b>oméga-3</b>, venus du poisson ou d'une huile, ont été étudiés dans le lupus dans " +
            "plusieurs petites études contrôlées, avec des signes d'une activité de la maladie un peu plus " +
            "faible et d'une meilleure fonction vasculaire. Les études sont petites et pas homogènes. Du " +
            "poisson gras deux fois par semaine est une mise en pratique raisonnable, qui ne peut rien casser.",
          "La <b>vitamine D</b> est souvent basse dans le lupus, parce que le soleil est évité et que les " +
            "corticoïdes augmentent les pertes ; dans la maladie cœliaque s'ajoute la moins bonne absorption. " +
            "Qu'une carence doive être corrigée ne fait pas débat. Qu'une correction améliore la fatigue, cela " +
            "reste discuté : les études de traitement réunies à ce sujet ne totalisent ensemble que quelques " +
            "dizaines de participantes. " +
            "Donc : mesurer, corriger en cas de carence, ne pas y accrocher de grands espoirs.",
          "Le <b>curcuma, le resvératrol, la NAC, la DHEA</b> ont été étudiés dans le lupus, dans de petites " +
            "études aux résultats hétérogènes. Rien de tout cela n'est établi.",
          "Plus important que chaque produit pris isolément : tout ce qui est avalé a sa place sur la liste " +
            "des médicaments et en consultation. Les compléments alimentaires ne sont pas une zone de " +
            "non-droit, ils ont des interactions.",
        ],
        staerke: "Oméga-3 : faible à moyenne, petites études. Vitamine D contre la fatigue : très faible. Autres produits : faible.",
      },
      {
        frage: "Et cette histoire de germes de luzerne ?",
        antwort: [
          "La luzerne, aussi appelée alfalfa, contient de la L-canavanine. Il existe là-dessus d'anciens " +
            "rapports de cas décrivant des tableaux ressemblant au lupus, et des essais chez le singe. C'est le point qui, depuis " +
            "des décennies, figure sur toutes les listes du lupus.",
          "Pour situer honnêtement les choses : c'est une chaîne de preuves mince et ancienne, pas une " +
            "démonstration. Mais se " +
            "passer des germes de luzerne ne coûte rien, c'est pourquoi ce point figure aussi ici. Pour tout le " +
            "reste, le scepticisme est utile : beaucoup de listes d'interdits sur internet ne sont pas nées de " +
            "cette question, mais de la recopie.",
          "Un point mieux fondé : <b>les produits censés stimuler expressément le système immunitaire</b>, " +
            "comme l'échinacée. Dans une maladie où le système immunitaire se retourne contre le corps " +
            "lui-même, c'est la mauvaise direction. Ici aussi la chaîne de preuves est mince, mais le " +
            "raisonnement tient.",
        ],
        staerke: "Faible. Rapports de cas et essais chez l'animal. Défendable comme mesure de prudence, pas comme un fait.",
      },
    ],
  },

  {
    kicker: "Maladie cœliaque",
    titel: "Ce qui doit être strict et ce qui ne l'est pas",
    abschnitte: [
      {
        frage: "Strict, à quel point ?",
        antwort: [
          "Dans la maladie cœliaque, le régime sans gluten est le traitement, à vie, et le but n'est pas " +
            "seulement l'absence de symptômes, mais la guérison de la muqueuse intestinale. Les symptômes sont " +
            "une mauvaise mesure : une partie des personnes n'en a aucun malgré les lésions.",
          "La limite de 20 milligrammes de gluten par kilogramme pour la mention sans gluten repose sur le " +
            "fait que, jusqu'à environ 10 milligrammes de gluten par jour, il ne devrait pas y avoir de dommage " +
            "pour la grande majorité. Les données qui la fondent sont, de l'aveu même des comités d'experts, " +
            "limitées, et le bon seuil continue d'être discuté.",
          "Remarquable et peu connu : chez des personnes qui pensent manger strictement sans gluten, les " +
            "mesures trouvent régulièrement nettement plus d'apports involontaires de gluten que ce seuil ne le " +
            "prévoit. Ce n'est un reproche à personne, c'est une indication sur l'endroit où chercher quand " +
            "cela ne s'améliore pas.",
        ],
        staerke: "Élevée pour le traitement lui-même. Faible à moyenne pour le seuil exact.",
        quellen: [
          "Recommandation ACG, Am J Gastroenterol 2023. PMID 36602836",
          "Ludvigsson JF et al., BSG, Gut 2014;63:1210-1228. PMID 24917550",
          "ESsCD 2025, United European Gastroenterol J. PMID 40999951 et PMID 41831197",
        ],
      },
      {
        frage: "Qu'est-ce qui compte vraiment dans la cuisine, et qu'est-ce qui est surestimé ?",
        antwort: [
          "Ici, la recherche a donné quelque chose de surprenant, et cela allège le quotidien. Ce qui a été " +
            "mesuré, c'est la quantité de gluten qui passe réellement lors des gestes de cuisine habituels.",
          "<b>Plus important qu'on ne le pensait :</b> l'huile de friture partagée et l'eau de cuisson " +
            "partagée. Pour des frites sorties d'une friteuse où l'on cuit aussi des produits panés, une partie " +
            "des échantillons dépassait nettement la limite. L'eau de cuisson dans laquelle des pâtes " +
            "contenant du gluten avaient été cuites auparavant, également ; un rinçage rapide des pâtes cuites " +
            "a ramené les valeurs en dessous.",
          "<b>Moins grave qu'on ne le craignait :</b> le grille-pain partagé et les couverts partagés. Dans " +
            "les mesures, du pain sans gluten sorti d'un grille-pain déjà utilisé est resté sous la limite, " +
            "même avec des miettes visibles dans le compartiment, et un couteau qui avait touché auparavant une " +
            "pâtisserie contenant du gluten n'a rien transmis de mesurable.",
          "Ces études sont petites et menées en ouvert, donc pas un blanc-seing. Mais la direction est " +
            "utilisable : l'énergie doit aller à la friteuse, à l'eau de cuisson, à la poussière de farine " +
            "quand on fait de la pâtisserie et aux listes d'ingrédients, et moins à la peur de chaque cuillère partagée. " +
            "Dans une maladie auto-immune, c'est aussi un argument : les forces qui ne partent pas dans une " +
            "inquiétude inutile restent disponibles ailleurs.",
        ],
        staerke: "Faible à moyenne. Petites études de mesure menées en ouvert, mais les seuls chiffres qui existent là-dessus.",
        quellen: [
          "Weisbrod VM et al., Gastroenterology 2020",
          "Gluten-Free Foods Cooked in Shared Fryers With Wheat, Front Nutr 2021. DOI 10.3389/fnut.2021.652039",
          "Syage JA et al., Am J Clin Nutr 2018",
        ],
      },
      {
        frage: "Les IgA anti-transglutaminase suffisent-elles à savoir si tout va bien ?",
        antwort: [
          "Non, et c'est l'un des détails les plus importants de tout ce texte. Ce dosage a été mis au point " +
            "comme <b>test de dépistage</b>, pas comme test de suivi de la guérison de la muqueuse.",
          "Dans une synthèse de plusieurs études, sous régime sans gluten, une valeur normale ne repérait " +
            "qu'environ la moitié des cas où la muqueuse était encore abîmée. Une valeur sans particularité est " +
            "donc une bonne nouvelle, mais pas une preuve.",
          "En pratique : si des symptômes persistent ou si des valeurs comme le fer et la vitamine D ne " +
            "remontent pas, « les anti-transglutaminase sont normales » n'est pas une raison d'arrêter la " +
            "recherche. Il faut alors une enquête alimentaire précise auprès d'une diététicienne expérimentée, " +
            "et selon la situation d'autres examens.",
          "La cause la plus fréquente, quand cela ne va pas mieux sous régime sans gluten, n'est d'ailleurs " +
            "pas une complication rare, mais du gluten apporté sans qu'on le sache.",
        ],
        staerke: "Moyenne à élevée pour la portée limitée de la sérologie. Issue d'une synthèse de plusieurs études.",
        quellen: [
          "Méta-analyse sur les anticorps anti-tTG et anti-endomysium en cas d'atrophie villositaire persistante, Gastroenterology 2017",
          "Recommandations sur le suivi, Nat Rev Gastroenterol Hepatol 2023. PMID 38110546",
        ],
      },
      {
        frage: "L'avoine, oui ou non ?",
        antwort: [
          "Une synthèse des études n'a trouvé aucun signe que l'avoine expressément sans gluten aggrave les " +
            "symptômes, les tissus, la réaction immunitaire ou la sérologie. La certitude des résultats était " +
            "faible.",
          "Le problème principal n'est pas l'avoine, mais la transformation : l'avoine ordinaire est souvent " +
            "fortement contaminée par du blé, l'avoine pure pratiquement pas. D'où la règle : seulement de " +
            "l'avoine étiquetée sans gluten.",
          "S'y ajoute une petite minorité qui réagit à la protéine de l'avoine elle-même. La taille de ce " +
            "groupe n'est pas établie proprement ; le chiffre souvent cité vient d'une étude dans laquelle se " +
            "sont justement inscrites des personnes soupçonnant une intolérance à l'avoine, et il est donc trop " +
            "élevé pour l'ensemble des personnes concernées.",
          "Une démarche raisonnable : introduire l'avoine sans gluten dans une période calme, pas en même " +
            "temps que d'autres changements, et regarder dans le journal ce qui se passe.",
        ],
        staerke: "Moyenne pour la sécurité de l'avoine pure ; la certitude des résultats de la synthèse était faible.",
        quellen: ["Pinto-Sanchez MI et al., Gastroenterology 2017;153:395-409. PMID 28431885"],
      },
      {
        frage: "Le sans gluten apporte-t-il quelque chose contre le lupus, si l'on n'avait pas de maladie cœliaque ?",
        antwort: [
          "Il n'existe aucune preuve solide pour cela. Ce n'est mentionné ici que par souci d'exhaustivité, " +
            "parce que la question revient sans cesse dans les forums.",
          "Dans ce cas précis, elle est de toute façon sans objet : avec une maladie cœliaque confirmée, on " +
            "mange sans gluten, indépendamment de ce que cela fait pour le lupus.",
        ],
        staerke: "Aucune preuve solide.",
      },
    ],
  },

  {
    kicker: "Les deux ensemble",
    titel: "Là où le lupus et la maladie cœliaque se gênent",
    abschnitte: [
      {
        frage: "Y a-t-il seulement un lien entre les deux ?",
        antwort: [
          "Les maladies auto-immunes surviennent souvent ensemble, et la maladie cœliaque est trouvée plus " +
            "souvent dans le lupus que dans la population générale. De combien plus souvent, les estimations " +
            "publiées divergent largement, et c'est pourquoi aucun chiffre ne figure ici, volontairement.",
          "Pour le quotidien, le chiffre n'a de toute façon pas d'importance. Ce qui compte, c'est que les " +
            "deux maladies attaquent les mêmes choses : l'absorption des nutriments, l'os et les forces.",
        ],
        staerke: "Les estimations se contredisent nettement. Le lien lui-même est établi.",
      },
      {
        frage: "L'os, à 26 ans",
        antwort: [
          "C'est le point qui passe le plus facilement à la trappe à cet âge et qui fait mal le plus tard. " +
            "Deux choses se rencontrent : la maladie cœliaque perturbe pendant des années l'absorption du " +
            "calcium et de la vitamine D, et les corticoïdes agissent directement contre l'os.",
          "La recommandation américaine sur l'ostéoporose due aux corticoïdes dit quelque chose qui compte " +
            "justement pour les jeunes femmes : avant 40 ans, le risque de fracture ne peut <b>pas</b> être " +
            "estimé avec le calculateur habituel, parce que celui-ci n'est pas fait pour cela. À la place d'un " +
            "calcul, il faut donc une mesure.",
          "Ce qui en fait partie dans tous les cas : assez de calcium et de vitamine D, de l'activité " +
            "physique qui met du poids sur les jambes, ne pas fumer. Et la question de savoir si et quand une " +
            "ostéodensitométrie est utile doit être posée, pas remise à plus tard.",
        ],
        staerke: "Fondé sur les recommandations de bonne pratique.",
        quellen: ["Humphrey MB et al., recommandation ACR sur l'ostéoporose cortico-induite 2022. DOI 10.1002/art.42646"],
      },
      {
        frage: "Et si la fatigue reste malgré un régime sans gluten strict ?",
        antwort: [
          "Cela arrive et c'est bien décrit. L'ordre dans lequel on cherche est le plus souvent celui-ci :",
        ],
        liste: [
          "Du gluten apporté sans qu'on le sache. De loin l'explication la plus fréquente, et on la trouve mieux avec une diététicienne expérimentée que par soi-même.",
          "Les nutriments : fer, B12, folates, vitamine D, zinc.",
          "La thyroïde.",
          "La deuxième maladie, donc le lupus lui-même, avec les reins et l'hémogramme.",
          "Le sommeil, l'humeur, la douleur, la fibromyalgie.",
          "Les choses rares seulement après.",
        ],
        staerke: "Pratique clinique et logique des recommandations.",
      },
    ],
  },

  {
    kicker: "Traitement",
    titel: "Ce qui est standard aujourd'hui",
    abschnitte: [
      {
        frage: "Sur quoi le traitement s'oriente-t-il aujourd'hui ?",
        antwort: [
          "Sur deux principes qui figurent dans les recommandations européennes actuelles. Premièrement : " +
            "<b>l'hydroxychloroquine pour toutes</b>, sauf si quelque chose s'y oppose. Deuxièmement : <b>les " +
            "corticoïdes aussi bas que possible</b>, pensés comme un relais et non comme une solution durable, " +
            "avec pour but de les tenir très bas en entretien ou de les arrêter tout à fait.",
          "C'est la raison pour laquelle d'autres médicaments s'ajoutent aujourd'hui plus tôt : non parce que " +
            "la maladie serait plus grave, mais pour que les corticoïdes puissent descendre. Il y a désormais " +
            "pour cela plus de possibilités qu'il y a quelques années, dont des médicaments nouvellement autorisés.",
          "L'objectif de traitement affiché est la rémission ou un état de faible activité. Les deux sont " +
            "définis et mesurables. Poser la question en vaut la peine : cela transforme le « comment " +
            "allez-vous » en une grandeur qui reste comparable sur des années.",
          "<b>Aucune dose ne sort de cette application.</b> Ce qui est écrit ici, c'est le cadre dans lequel " +
            "la consultation décide.",
        ],
        staerke: "Recommandations de bonne pratique, le plus haut niveau disponible.",
        quellen: [
          "Fanouriakis A et al., EULAR 2023, Ann Rheum Dis 2024;83:15-29. PMID 37827694",
          "Recommandation ACR sur le traitement du LES 2025. PMID 41182321",
          "EULAR 2025, lupus avec atteinte rénale. PMID 41107121",
        ],
      },
      {
        frage: "Pourquoi le contrôle des yeux sous hydroxychloroquine ?",
        antwort: [
          "Parce que le médicament peut, dans de rares cas, abîmer la rétine, et parce que cette atteinte ne " +
            "donne longtemps aucun symptôme. C'est pourquoi on la cherche au lieu de l'attendre.",
          "Le risque tient surtout à la dose rapportée au poids du corps et à la durée du traitement ; une " +
            "fonction rénale diminuée et certains autres médicaments l'augmentent. C'est pourquoi il existe une " +
            "limite supérieure rapportée au poids <b>réel</b> du corps.",
          "Sur le déroulement : un examen au début, puis des contrôles réguliers avec des techniques qui " +
            "donnent une image de la rétine. Les intervalles exacts diffèrent d'un pays à l'autre et ont été " +
            "revus récemment. La question pratique à poser en consultation n'est donc pas « quelle est la " +
            "fréquence habituelle », mais « quand mon prochain contrôle est-il prévu ».",
          "Bon à savoir : si une atteinte débutante est trouvée tôt et que le médicament est arrêté, elle ne " +
            "progresse le plus souvent pas davantage. C'est exactement pour cela que le contrôle n'est pas un " +
            "rituel, mais tout l'enjeu.",
        ],
        staerke: "Recommandations d'ophtalmologie. Les intervalles exacts diffèrent selon le pays et la version.",
        quellen: [
          "AAO, recommandations sur le dépistage de la rétinopathie à l'hydroxychloroquine, Ophthalmology. PMID 41232611",
          "Royal College of Ophthalmologists, Monitoring-Empfehlungen 2020. PMID 33423043",
        ],
      },
      {
        frage: "Pourquoi les urines encore et encore ?",
        antwort: [
          "Parce que dans le lupus, l'atteinte rénale est le dommage d'organe qui coûte le plus et qui reste " +
            "muet le plus longtemps. Elle ne fait pas mal. Elle se montre sous forme de protéines dans les " +
            "urines, bien avant qu'on ne remarque quoi que ce soit.",
          "La recommandation américaine sur la néphrite lupique formule donc une recommandation forte : " +
            "rechercher régulièrement des protéines dans les urines, y compris chez les personnes <b>sans</b> " +
            "atteinte rénale connue.",
          "Si l'on ne retient qu'une seule chose de tout ce chapitre, que ce soit celle-ci : le test urinaire " +
            "est le test le moins cher et le plus efficace de tout le suivi. Il ne faut pas l'oublier quand on " +
            "va bien.",
        ],
        staerke: "Recommandation forte dans les recommandations de bonne pratique.",
        quellen: ["Recommandation ACR sur la néphrite lupique 2024. DOI 10.1002/art.43212"],
      },
    ],
  },

  {
    kicker: "À 26 ans",
    titel: "Ce qui fait partie du tableau à cet âge",
    abschnitte: [
      {
        frage: "Le désir d'enfant, même s'il n'est pas d'actualité",
        antwort: [
          "Ce sujet doit être abordé tôt, justement quand il n'est pas encore d'actualité. La raison est " +
            "simple : certains médicaments courants dans le lupus ne doivent pas être pris pendant une " +
            "grossesse et doivent être changés <b>des mois à l'avance</b>. Une grossesse non prévue sous un tel " +
            "médicament est le scénario que tout le monde veut éviter.",
          "La deuxième raison : dans le lupus, une grossesse se déroule nettement mieux quand elle commence " +
            "dans une phase calme. C'est l'une des rares choses qui se planifient vraiment.",
          "Deux résultats sanguins sont décisifs pour cela et devraient être connus, indépendamment de tout " +
            "projet : les <b>anti-Ro/SSA</b> et les <b>anticorps antiphospholipides</b>, y compris " +
            "l'anticoagulant circulant lupique. Ils changent le suivi et le choix de la contraception. Qui ne " +
            "connaît pas son statut devrait le demander.",
          "L'hydroxychloroquine est en règle générale poursuivie pendant la grossesse, pas arrêtée. Cela en " +
            "surprend beaucoup.",
        ],
        staerke: "Recommandations de bonne pratique.",
        quellen: [
          "Sammaritano LR et al., recommandation ACR sur la santé reproductive 2020, Arthritis Rheumatol 2020;72:529-556. PMID 32090466",
          "Andreoli L et al., EULAR, santé des femmes dans le LES et le SAPL, Ann Rheum Dis 2017;76:476-485",
        ],
      },
      {
        frage: "La contraception",
        antwort: [
          "Le point décisif : en cas d'<b>anticorps antiphospholipides</b> mis en évidence, la contraception " +
            "contenant des œstrogènes est déconseillée, parce que les œstrogènes augmentent le risque de " +
            "thrombose et que ce risque est ici déjà augmenté de toute façon. Ce qui est recommandé à la place, " +
            "c'est un stérilet ou des produits contenant uniquement un progestatif.",
          "Comme il est en même temps important d'avoir une contraception fiable tant que sont en jeu des " +
            "médicaments qui nuiraient pendant une grossesse, ce n'est pas une question secondaire.",
        ],
        staerke: "Recommandation forte dans les recommandations de bonne pratique.",
        quellen: ["Sammaritano LR et al., ACR 2020. PMID 32090466"],
      },
      {
        frage: "Vaccins et infections",
        antwort: [
          "Sous immunosuppression, la règle est : les <b>vaccins inactivés</b> sont possibles et sont " +
            "expressément recommandés, les <b>vaccins vivants</b> doivent être évités autant que possible. Le " +
            "mieux est de vérifier et de compléter le statut vaccinal avant qu'un traitement immunosuppresseur " +
            "ne commence, et dans une phase calme.",
          "La deuxième partie est plus pratique : <b>la fièvre sous immunosuppression n'est pas un sujet où " +
            "l'on attend.</b> La réaction de défense habituelle peut manquer, et à partir du seul hémogramme on " +
            "ne peut pas toujours distinguer une infection d'une poussée. C'est exactement la situation pour " +
            "laquelle on veut avoir à l'avance un plan et un numéro de téléphone.",
        ],
        staerke: "Recommandations de bonne pratique.",
        quellen: [
          "Furer V et al., EULAR-Impfempfehlungen 2019, Ann Rheum Dis 2020;79:39-52. PMID 31413005",
          "Bass AR et al., ACR-Impfleitlinie 2022. PMID 36597813",
        ],
      },
      {
        frage: "Le soleil et le tabac",
        antwort: [
          "Sur le <b>soleil</b>, il existe quelque chose de solide : dans une étude contrôlée où la peau a " +
            "été exposée volontairement aux UV, des lésions cutanées typiques du lupus sont apparues sur les " +
            "zones non traitées, et sur les zones protégées par un écran à large spectre et à indice élevé, chez " +
            "aucune participante. Pour cette question, c'est une étude d'une clarté inhabituelle.",
          "Important : ce qui a été montré, c'est la prévention des <b>lésions cutanées</b> dues aux UV, pas " +
            "la prévention des poussées en général. Et la protection doit couvrir les UVA et les UVB.",
          "Sur le <b>tabac</b> : fumer est associé à un risque plus élevé de développer la maladie, et cela " +
            "diminue de façon mesurable l'efficacité de l'hydroxychloroquine sur la peau. Un détail qui donne " +
            "du courage : dans l'analyse, les <b>anciennes</b> fumeuses n'avaient plus de risque augmenté. " +
            "Arrêter a donc un effet.",
        ],
        staerke: "Pour la protection solaire : bonne, étude contrôlée chez l'être humain. Pour le tabac : synthèse de plusieurs études.",
        quellen: [
          "Kuhn A et al., J Am Acad Dermatol 2011;64:37-48. PMID 21167404",
          "Revue systématique et méta-analyse sur le tabac dans le LES, Autoimmun Rev 2019. PMID 31520802",
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------ Surveillance */

window.INHALT.fr.ueberwachung = [
  {
    titel: "Les yeux, sous hydroxychloroquine",
    text: [
      "Un examen au début du traitement, puis des contrôles réguliers avec des techniques d'imagerie de la " +
        "rétine. Les intervalles diffèrent selon le pays et le profil de risque ; la dose rapportée au poids " +
        "réel du corps, la durée du traitement et la fonction rénale y jouent le rôle principal.",
      "Trouvée tôt, une atteinte ne progresse le plus souvent plus après l'arrêt. C'est la raison de ces contrôles.",
    ],
    quellen: ["AAO, Ophthalmology. PMID 41232611", "Royal College of Ophthalmologists 2020. PMID 33423043"],
  },
  {
    titel: "Le sang et les urines",
    text: [
      "Hémogramme, fonction rénale, bilan hépatique et, selon le médicament, d'autres analyses, à des " +
        "intervalles qui dépendent de l'activité et du médicament : rapprochés au début et après chaque " +
        "changement de dose, plus espacés dans les phases calmes.",
      "Avec cela les analyses propres au lupus, les anti-ADN natif et le complément C3 et C4, et dans tous les cas la recherche de protéines dans les urines.",
      "Les intervalles se décident en consultation, pas dans une application. Ce qui aide ici : la question " +
        "de savoir qui les prescrit, pour que rien ne reste en suspens entre le médecin traitant et la consultation hospitalière.",
    ],
  },
  {
    titel: "Avant de commencer certains médicaments",
    text: [
      "Avant l'azathioprine, on dose une enzyme qui commande la dégradation du médicament. Si elle manque ou " +
        "si elle est diminuée, on risque de graves anomalies de l'hémogramme. Poser la question est légitime.",
      "Avant un traitement immunosuppresseur, le statut vaccinal doit être vérifié, parce que certaines choses ne sont plus possibles ensuite.",
    ],
  },
  {
    titel: "La maladie cœliaque dans la durée",
    text: [
      "Les IgA anti-transglutaminase au fil du temps, avec les nutriments, et un accompagnement par une " +
        "diététicienne ayant de l'expérience de la maladie cœliaque. Ce dernier n'est pas un extra : dans les recommandations, " +
        "le contact avec une professionnelle fait partie intégrante du traitement.",
      "Une valeur normale des anti-transglutaminase n'exclut pas une muqueuse qui n'a pas encore guéri. Si " +
        "des symptômes ou des carences persistent, on continue à chercher.",
    ],
  },
  {
    titel: "L'os",
    text: [
      "Sous un traitement corticoïde prolongé et dans la maladie cœliaque, l'os doit rester sous " +
        "surveillance. Avant 40 ans, le risque ne peut pas être estimé avec le calculateur habituel, c'est " +
        "pourquoi on mesure au lieu de calculer.",
      "Assez de calcium et de vitamine D, de l'activité physique qui met du poids sur les jambes, ne pas fumer.",
    ],
    quellen: ["Recommandation ACR sur l'ostéoporose cortico-induite 2022. DOI 10.1002/art.42646"],
  },
];

/* ---------------------------------------------------------------- Recherche
 *
 * Trouver un endroit, sans réseau et sans annuaire.
 *
 * Ce qui ne figure PAS ici est l'essentiel : aucune clinique, aucune adresse,
 * aucun numéro de téléphone, aucun nom de médecin. Pendant la construction de
 * cette application, pas un seul annuaire médical et pas une seule association
 * de patients n'était joignable, cela a été vérifié et confirmé. Rien de tout
 * cela n'aurait donc pu être contrôlé, et un mauvais numéro composé par
 * quelqu'un en pleine poussée fait de vrais dégâts.
 *
 * Ce qui figure ici, ce sont des chemins : le type de lieu, son nom, ce qu'on
 * cherche et ce qu'on y demande. Un chemin passant par un terme de recherche
 * survit à la refonte d'un site, une adresse enregistrée non.
 */
window.INHALT.fr.suche = {
  warnung:
    "Cette compilation a été faite de mémoire. Depuis l'environnement dans lequel elle a été construite, pas un seul site spécialisé et pas une seule association de patients n'était joignable, cela a été vérifié et c'est exact. Rien n'a donc pu être contrôlé. C'est pourquoi il n'y a ici volontairement aucune adresse, aucun numéro de téléphone et aucun nom de clinique ou de médecin : à ce niveau, une erreur serait dangereuse, et un mauvais numéro composé par quelqu'un en pleine poussée fait de vrais dégâts. Ce qui figure ici, ce sont des types de lieux, leurs noms et des termes de recherche. Des noms peuvent avoir changé, des organisations peuvent avoir fusionné ou avoir été rebaptisées, un annuaire peut avoir disparu. Chaque entrée porte donc un degré de fiabilité. L'application n'en vérifie rien, elle ne le peut pas, elle n'a aucune liaison vers l'extérieur. Avant de se fier à un endroit, il faut le faire confirmer une fois : par le médecin traitant, par la consultation hospitalière ou par un groupe d'entraide.",

  laender: [
    { wert: "at", text: "Autriche" },
    { wert: "de", text: "Allemagne" },
    { wert: "ch", text: "Suisse" },
    { wert: "it", text: "Italie" },
    { wert: "eu", text: "Europe" },
  ],

  wege: [
    {
      land: "at",
      thema: "beides",
      name: "L'adressage par le cabinet du médecin traitant",
      was: "L'accès à la consultation hospitalière, et une idée de l'établissement du secteur qui est vraiment accessible.",
      weg: "En Autriche, la plupart des consultations hospitalières exigent un adressage par une médecin conventionnée, et le plus souvent un rendez-vous fixé à l'avance. Au cabinet, dire que l'on cherche une consultation ayant de l'expérience du lupus érythémateux systémique, pas seulement une consultation de rhumatologie. Nommer tout de suite le deuxième diagnostic, il change le choix.",
      suchbegriff: "Zuweisung rheumatologische Ambulanz",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "La consultation où tu vas déjà",
      was: "Le chemin le plus court, et le nom de quelqu'un qui se renseigne lui-même sur place.",
      weg: "Au prochain rendez-vous, demander qui s'y connaît en lupus et en maladie cœliaque à la fois, et si une présentation dans un centre spécialisé serait utile. Demander un deuxième avis est permis et courant, ce n'est pas une motion de défiance. Qui trouve cela délicat le formule comme une question de suivi partagé.",
      suchbegriff: "Zweitmeinung Mitbetreuung erbitten",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "La recherche de médecins de l'Ordre des médecins autrichien",
      was: "Le registre officiel de toutes les médecins avec leur spécialité, filtrable par lieu.",
      weg: "Passer par un moteur de recherche avec Ärztekammer et Arztsuche ; il en existe une au niveau fédéral et une par chambre régionale. Important dans le lupus : en Autriche, la rhumatologie a longtemps été un complément à la médecine interne et n'est devenue un titre de spécialité à part entière que plus tard. Les consœurs plus âgées portent le complément, les plus jeunes le titre. Chercher les deux.",
      suchbegriff: "Ärztekammer Arztsuche Innere Medizin Rheumatologie",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "La recherche de partenaires conventionnés de la caisse d'assurance maladie",
      was: "Qui a une convention avec la caisse, et qui n'en a pas.",
      weg: "Sur le site de l'Österreichische Gesundheitskasse, chercher la recherche de médecins ou de partenaires conventionnés. La différence est financière : chez une médecin non conventionnée, on paie d'abord soi-même et on récupère une partie plus tard. Quand les délais sont longs, c'est parfois la voie la plus rapide, mais il faut se renseigner sur le remboursement à l'avance.",
      suchbegriff: "Österreichische Gesundheitskasse Arztsuche",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "lupus",
      name: "La Société autrichienne de rhumatologie et de réadaptation",
      was: "La société savante, avec une liste de membres et un aperçu des structures de rhumatologie.",
      weg: "Chercher la société, puis regarder du côté des membres, des centres ou des consultations. Qui est actif dans une société savante travaille le plus souvent dans un endroit qui voit assez de cas.",
      suchbegriff: "Österreichische Gesellschaft für Rheumatologie",
      sicherheit: "mittel",
    },
    {
      land: "at",
      thema: "lupus",
      name: "La Rheumaliga autrichienne",
      was: "L'entraide avec des groupes régionaux, et le savoir sur les endroits où l'on est bien prise en charge en tant que personne.",
      weg: "Chercher la Rheumaliga et son propre Land. Y demander quelle consultation suit des personnes atteintes de lupus, où le délai d'attente est supportable et où l'on écoute. Cette information, aucun annuaire ne la donne.",
      suchbegriff: "Rheumaliga Österreich Wien",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "zoeliakie",
      name: "L'association autrichienne de la maladie cœliaque",
      was: "Des conseils, des listes de produits, des groupes, et souvent aussi des indications sur des consultations et sur des diététiciennes expérimentées.",
      weg: "Chercher Zöliakie et Österreich. Si le nom ne correspond pas, passer par la fédération européenne des associations de la maladie cœliaque, qui répertorie ses membres pays par pays. La deuxième voie fonctionne aussi quand l'organisation porte un autre nom que celui dont on se souvient.",
      suchbegriff: "Zöliakie Österreich Arbeitsgemeinschaft",
      sicherheit: "mittel",
    },
    {
      land: "at",
      thema: "zoeliakie",
      name: "La Société autrichienne de gastroentérologie et d'hépatologie",
      was: "La société savante de l'intestin, avec ses membres et ses manifestations.",
      weg: "Chercher la société. Pour la maladie cœliaque, c'est la gastroentérologie qui est compétente, pas la rhumatologie. Qui cherche une consultation y cherche des membres dans sa propre ville.",
      suchbegriff: "Österreichische Gesellschaft für Gastroenterologie",
      sicherheit: "mittel",
    },
    {
      land: "at",
      thema: "beides",
      name: "Le bureau de soutien à l'entraide du Land",
      was: "L'orientation vers des groupes, y compris pour deux diagnostics à la fois.",
      weg: "Dans chaque Land, il existe un bureau subventionné qui recense les groupes d'entraide et y oriente. Chercher Selbsthilfe et le Land, leur écrire et nommer les deux diagnostics. S'il n'y a pas de groupe qui convient, ces bureaux connaissent le plus souvent quand même quelqu'un.",
      suchbegriff: "Selbsthilfe Unterstützungsstelle Wien",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "Le portail public de santé de l'État fédéral",
      was: "Des explications officielles sur les démarches, les droits et les chemins dans le système.",
      weg: "Chercher le portail public de santé de l'Autriche. Utile surtout pour les questions administratives : adressage, remboursement des frais, médecin non conventionnée, droits des patientes, voies de réclamation.",
      suchbegriff: "öffentliches Gesundheitsportal Österreich",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "zoeliakie",
      name: "Une diététicienne ayant l'expérience de la maladie cœliaque",
      was: "L'accompagnement diététique qui, dans la maladie cœliaque, fait partie du traitement et non des options.",
      weg: "En Autriche, le titre protégé est Diätologin, pas Ernährungsberaterin. Chercher par l'association professionnelle ou demander un adressage à la consultation. La question qui compte est : combien de personnes atteintes de maladie cœliaque suivez-vous par an.",
      suchbegriff: "Diätologin finden Österreich Berufsverband",
      sicherheit: "mittel",
    },
    {
      land: "de",
      thema: "lupus",
      name: "La Société allemande de rhumatologie et d'immunologie clinique",
      was: "La société savante et le réseau des centres régionaux de rhumatologie.",
      weg: "Chercher la société savante et les centres régionaux coopératifs de rhumatologie. Ces centres sont des regroupements de cliniques et de cabinets d'une région, leurs listes sont un bon point de départ.",
      suchbegriff: "Deutsche Gesellschaft für Rheumatologie Rheumazentren",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "lupus",
      name: "La Deutsche Rheuma-Liga",
      was: "La grande association de patients, avec des fédérations régionales et des listes d'adresses.",
      weg: "Chercher la Rheuma-Liga et le Land. Elle tient des adresses de rhumatologues et de cliniques, oriente vers des groupes et publie des fiches bien lisibles. Les fiches sont utilisables aussi depuis l'Autriche, les adresses non.",
      suchbegriff: "Deutsche Rheuma-Liga Landesverband",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "lupus",
      name: "L'entraide lupus dans l'espace germanophone",
      was: "Une communauté à part, rien que pour le lupus, avec des groupes régionaux et un savoir d'expérience sur les consultations.",
      weg: "Demander à la Rheuma-Liga où se trouve la communauté d'entraide lupus, ou chercher directement Lupus et Selbsthilfe. Utilisable aussi depuis Vienne : les expériences sur le traitement, la fatigue et les administrations se transposent, les adresses non.",
      suchbegriff: "Lupus Erythematodes Selbsthilfegemeinschaft",
      sicherheit: "mittel",
    },
    {
      land: "de",
      thema: "zoeliakie",
      name: "La Deutsche Zöliakie-Gesellschaft",
      was: "Des conseils, un savoir vérifié sur les produits, des groupes, des indications sur des consultations expérimentées.",
      weg: "Chercher la Deutsche Zöliakie-Gesellschaft. Le savoir sur les produits est utilisable aussi depuis l'Autriche, parce que beaucoup de fabricants sont les mêmes. Pour la recherche d'une consultation : les listes sont allemandes.",
      suchbegriff: "Deutsche Zöliakie-Gesellschaft",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "beides",
      name: "La recherche de médecins des unions de médecins conventionnés",
      was: "Qui est installé où, et avec quel titre de spécialiste.",
      weg: "Chercher Arztsuche et Kassenärztliche Vereinigung, au niveau fédéral ou pour un Land. Le service aux patients de ces unions attribue aussi des rendez-vous quand c'est urgent.",
      suchbegriff: "Arztsuche Kassenärztliche Vereinigung",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "beides",
      name: "L'organisme national pour l'entraide",
      was: "Des groupes et des points de contact régionaux, y compris pour des combinaisons rares.",
      weg: "Chercher le point national de contact et d'information sur l'entraide. Qui a deux diagnostics y demande les deux et se fait orienter pour les deux.",
      suchbegriff: "NAKOS Selbsthilfe Datenbank",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "lupus",
      name: "Les centres pour maladies rares des hôpitaux universitaires",
      was: "Un point d'aiguillage pour les tableaux flous ou composés.",
      weg: "Chercher Zentrum für Seltene Erkrankungen et une ville universitaire, ou un atlas de l'offre de soins pour les maladies rares. De tels centres n'acceptent le plus souvent qu'avec un adressage et un dossier complet, et il y a des délais d'attente.",
      suchbegriff: "Zentrum für Seltene Erkrankungen Versorgungsatlas",
      sicherheit: "mittel",
    },
    {
      land: "de",
      thema: "beides",
      name: "Le registre des recommandations des sociétés savantes médicales",
      was: "Les recommandations sur le lupus et sur la maladie cœliaque, donc l'étalon auquel une consultation peut se mesurer.",
      weg: "Chercher le registre des recommandations de l'Arbeitsgemeinschaft der Wissenschaftlichen Medizinischen Fachgesellschaften, puis la maladie. C'est un registre, pas un guide, les textes sont écrits pour des professionnels. Le résumé et les recommandations du début restent malgré tout lisibles, et pour certaines recommandations il existe une version destinée aux patientes.",
      suchbegriff: "AWMF Leitlinienregister Zöliakie",
      sicherheit: "hoch",
    },
    {
      land: "ch",
      thema: "lupus",
      name: "La Ligue suisse contre le rhumatisme et les ligues cantonales",
      was: "Des conseils, des cours et des adresses en Suisse.",
      weg: "Chercher la Rheumaliga ou la Ligue contre le rhumatisme et le canton. Les ligues cantonales sont les vrais points d'accueil.",
      suchbegriff: "Rheumaliga Schweiz",
      sicherheit: "hoch",
    },
    {
      land: "ch",
      thema: "lupus",
      name: "La Société suisse de rhumatologie",
      was: "La société savante avec son répertoire des membres.",
      weg: "Chercher la société et filtrer par lieu dans l'espace des membres. Avec cela le répertoire des médecins de l'organisation professionnelle FMH, qui tient officiellement les titres de spécialiste.",
      suchbegriff: "Schweizerische Gesellschaft für Rheumatologie Mitglieder",
      sicherheit: "mittel",
    },
    {
      land: "ch",
      thema: "zoeliakie",
      name: "L'association suisse de la maladie cœliaque",
      was: "Des conseils et un savoir sur les produits pour la Suisse.",
      weg: "Chercher Zöliakie et Schweiz, ou passer par la fédération européenne, qui répertorie l'association membre pays par pays.",
      suchbegriff: "Zöliakie Schweiz Interessengemeinschaft",
      sicherheit: "mittel",
    },
    {
      land: "it",
      thema: "zoeliakie",
      name: "Associazione Italiana Celiachia",
      was: "L'organisation italienne de la maladie cœliaque, avec des antennes régionales et un label pour les établissements contrôlés sans gluten.",
      weg: "Chercher l'organisation. Pour un voyage en Italie, la liste des établissements contrôlés est ce qu'il y a de plus utile là-bas. Dans le Haut-Adige, il existe un groupe régional germanophone.",
      suchbegriff: "Associazione Italiana Celiachia",
      sicherheit: "hoch",
    },
    {
      land: "it",
      thema: "beides",
      name: "Le réseau italien des maladies rares",
      was: "Des centres désignés officiellement par région, où se font le diagnostic et le suivi.",
      weg: "L'Italie tient un réseau national pour les maladies rares. Les régions désignent les centres, et l'exonération des participations aux frais dépend de cette reconnaissance. Le lupus érythémateux systémique figure sur la liste nationale. Chercher en italien le réseau national et la région.",
      suchbegriff: "rete nazionale malattie rare presidi",
      sicherheit: "mittel",
    },
    {
      land: "it",
      thema: "beides",
      name: "Le service de santé du Haut-Adige",
      was: "La seule voie italienne sans barrière de langue.",
      weg: "Le service public de santé du Haut-Adige travaille en allemand. Pour un deuxième avis ou pour des questions sur la maladie cœliaque en Italie, c'est l'entrée la plus commode. Avant un rendez-vous à l'étranger, toujours régler d'abord la question des frais, voir le point de contact national.",
      suchbegriff: "Südtiroler Sanitätsbetrieb Ambulanz",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "Le réseau européen de référence pour les maladies rares du tissu conjonctif",
      was: "Une liste officielle de centres experts, pays par pays, désignés par les États membres.",
      weg: "L'Union européenne entretient des réseaux de référence pour les maladies rares. Pour le lupus érythémateux systémique, c'est le réseau des maladies rares du tissu conjonctif et de l'appareil locomoteur qui est compétent. Chercher European Reference Network et connective tissue, puis filtrer la liste des membres sur l'Autriche. Qui y figure a été vérifié par une autorité, pas par une rédaction.",
      suchbegriff: "European Reference Network connective tissue ReCONNET",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "Le réseau européen de référence pour les maladies immunitaires",
      was: "Un deuxième réseau, qui couvre les maladies auto-immunes et auto-inflammatoires.",
      weg: "Même chemin que pour l'entrée précédente, chercher European Reference Network et immunodeficiency ou autoimmune. Certains établissements figurent dans les deux réseaux, c'est bon signe.",
      suchbegriff: "European Reference Network autoimmune RITA",
      sicherheit: "mittel",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "Orphanet, le répertoire européen des maladies rares",
      was: "Des centres experts, des associations de patients, des registres et des études, filtrables par pays et disponibles en français.",
      weg: "Chercher Orphanet, puis la maladie, puis faire attention au choix du pays. Pour la maladie cœliaque, le répertoire ne couvre que la forme rare résistante au traitement, la maladie cœliaque ordinaire étant trop fréquente pour lui.",
      suchbegriff: "Orphanet centres experts lupus érythémateux",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "La fédération européenne des associations de lupus",
      was: "Le chemin vers l'organisation de son propre pays, même quand on n'en connaît pas le nom.",
      weg: "Chercher la fédération européenne et y regarder les organisations membres pays par pays. C'est la voie la plus fiable vers un groupe lupus autrichien, parce qu'une fédération tient à jour sa liste de membres.",
      suchbegriff: "Lupus Europe member organisations",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "zoeliakie",
      name: "La fédération européenne des associations de la maladie cœliaque",
      was: "L'association membre de chaque pays, et le symbole de l'épi barré pour les produits contrôlés sans gluten.",
      weg: "Chercher la fédération européenne des associations de la maladie cœliaque. Par elle, on trouve l'organisation autrichienne et celles des pays voisins, ce qui compte en voyage.",
      suchbegriff: "Association of European Coeliac Societies",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "beides",
      name: "Le point de contact national pour les soins de santé transfrontaliers",
      was: "Des renseignements sur ce que coûte un traitement dans un autre pays de l'Union, sur ce que paie la caisse et sur ce qui doit être autorisé à l'avance.",
      weg: "Chaque État membre doit tenir un tel point de contact. Chercher point de contact national et soins de santé transfrontaliers, avec son propre pays. Avant tout rendez-vous prévu à l'étranger, y poser la question, sinon on reste avec la facture.",
      suchbegriff: "point de contact national soins de santé transfrontaliers",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "Le registre européen des essais cliniques",
      was: "Quelles cliniques à portée travaillent sur des essais dans le lupus.",
      weg: "Chercher le système européen d'information sur les essais cliniques, puis filtrer par maladie et par pays. Les sites participants y figurent. Cela ne dit rien sur la gentillesse d'un établissement, mais beaucoup sur les endroits où assez de cas se rassemblent. La participation est volontaire et n'est jamais une condition du suivi.",
      suchbegriff: "Clinical Trials Information System lupus Austria",
      sicherheit: "mittel",
    },
  ],

  merkmale: [
    { id: "ambulanz-sagen-viele", punkt: "La consultation peut dire combien de personnes atteintes de lupus érythémateux systémique elle suit par an, sans avoir à réfléchir longtemps." },
    { id: "feste-ansprechperson-wenigstens", punkt: "Il y a une personne référente fixe, ou au moins une petite équipe, au lieu d'un nouveau visage à chaque rendez-vous." },
    { id: "krankheitsaktivitaet-messinstrument-erfasst", punkt: "L'activité de la maladie est mesurée avec un instrument, et le chiffre figure dans le compte rendu, pas seulement dans une tête." },
    { id: "benannten-schub-zwischen", punkt: "Il existe une voie nommée pour la poussée entre deux rendez-vous : une consultation d'urgence, une adresse mail ou un numéro où quelqu'un décroche." },
    { id: "nephrologie-dermatologie-augenheilkunde", punkt: "La néphrologie, la dermatologie, l'ophtalmologie et l'obstétrique sont dans l'établissement ou sont des partenaires fixes, et la consultation peut expliquer comment se fait le passage de relais." },
    { id: "kinderwunsch-schwangerschaft-selbst", punkt: "Le désir d'enfant et la grossesse y sont abordés d'eux-mêmes, pas seulement quand on le demande." },
    { id: "zoeliakie-mitgedacht-entweder", punkt: "La maladie cœliaque est prise en compte : soit il y a une gastroentérologie dans l'établissement, soit la consultation sait exactement qui la suit et lui écrit." },
    { id: "ernaehrungsfachkraft-zoeliakieerfahrung-erreichbar", punkt: "Une diététicienne ayant l'expérience de la maladie cœliaque est joignable, et l'adressage vers elle est un geste simple, pas une négociation." },
    { id: "jedem-termin-geht", punkt: "Après chaque rendez-vous, un courrier part vers le cabinet du médecin traitant, et on en reçoit soi-même une copie, sans avoir à se battre pour l'obtenir." },
    { id: "klar-geregelt-welche", punkt: "Il est clairement réglé qui prescrit quel contrôle, pour que rien ne reste en suspens entre la consultation hospitalière et le médecin traitant." },
    { id: "muedigkeit-lichtempfindlichkeit-teil", punkt: "La fatigue et la photosensibilité sont traitées comme une partie de la maladie et non comme une note en marge." },
    { id: "haus-nimmt-register", punkt: "L'établissement participe à un registre, à un réseau de référence ou à des essais, un indice que les cas y sont recensés de façon systématique." },
    { id: "termin-dauert-lang", punkt: "Le rendez-vous dure assez longtemps pour parler de deux maladies, et le suivant est fixé à la fin." },
    { id: "kommt-schlechten-ausgezeichnete", punkt: "On arrive à s'y rendre, même un mauvais jour : une excellente consultation à trois heures de route devient mauvaise en poussée." },
  ],

  erstgespraech: [
    "La sauvegarde de cette application, avec le compte rendu pour la médecin sur douze semaines, imprimé. Des chiffres sur des semaines en disent plus que le souvenir d'un mauvais jour.",
    "Tous les résultats en copie, classés par date : les analyses de laboratoire, les comptes rendus de sortie, le résultat de la biopsie intestinale, les anciens dosages d'anticorps. Les originaux, on les garde.",
    "Une liste de tous les médicaments avec la dose, avec les compléments alimentaires et la contraception. Y compris ce qui a été arrêté, et pourquoi cela a été arrêté.",
    "La première question : prenez-vous en charge le suivi au long cours, ou s'agit-il d'un avis unique. Tout le reste en dépend.",
    "La question de savoir qui écrit à qui : le cabinet du médecin traitant reçoit-il un courrier, et est-ce que j'en reçois un moi-même.",
    "La question de savoir ce qu'il faut observer et noter d'ici la fois suivante. Cela rend le journal ciblé au lieu d'être seulement consciencieux.",
    "La question de savoir comment joindre la consultation si cela va plus mal entre-temps, et ce qui vaut le week-end.",
    "Noter à l'avance trois choses qui te sont les plus importantes, et les dire en premier. Le temps est court, et il passe sinon dans autre chose.",
    "Emmener quelqu'un avec toi quand la tête est dans le brouillard. Deux oreilles entendent plus, et on n'a pas à écouter et à prendre des notes en même temps.",
    "Prendre des notes ou enregistrer. Demander avant d'enregistrer, la plupart disent oui.",
    "Parler de la maladie cœliaque de toi-même, même dans une consultation de rhumatologie. Sinon elle tombe entre les spécialités.",
    "L'E-Card, la carte d'assurée, et l'adressage. Chez une médecin non conventionnée, garder la note d'honoraires et savoir à l'avance combien sera remboursé.",
    "Placer le rendez-vous dans la meilleure moitié de la journée et ne rien prévoir d'autre après. Un rendez-vous coûte plus de forces que ce qui est inscrit dans l'agenda.",
    "Si quelque chose reste flou, dire la phrase : je n'ai pas compris, pouvez-vous le dire autrement. Ce n'est pas une faiblesse, c'est le sens même du rendez-vous.",
    "Juste après le rendez-vous, une note courte, tant que c'est frais. Dans le brouillard, le souvenir de l'entretien est plus mauvais qu'on ne le pense.",
  ],
};
