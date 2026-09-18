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
