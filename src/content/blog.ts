export interface Article {
  slug: string;
  title: string;
  description: string;
  /** Résumé factuel affiché en tête (réponse courte, utile aux moteurs de réponse). */
  resume: string;
  date: string;
  sections: { h2: string; p: string[] }[];
}

const AVERTISSEMENT =
  "Ces informations sont générales et ne remplacent pas l'avis d'un médecin ou d'un professionnel de santé. En cas de pathologie, de blessure, de grossesse ou de doute, demande un avis médical avant de reprendre le sport.";

export const AVERTISSEMENT_SANTE = AVERTISSEMENT;

export const BLOG: Article[] = [
  {
    slug: "programme-prise-de-masse-4-jours",
    title: "Programme prise de masse en 4 jours : structure et conseils",
    description:
      "Comment organiser une semaine de musculation sur 4 jours pour progresser : répartition haut/bas, volume, repos et progression, expliqués simplement.",
    resume:
      "Un split haut du corps / bas du corps sur 4 jours permet de travailler chaque groupe musculaire deux fois par semaine, avec des séances de 45 à 60 minutes et au moins un jour de repos entre deux séances sollicitant les mêmes muscles.",
    date: "2026-10-01",
    sections: [
      {
        h2: "Pourquoi choisir 4 jours par semaine pour prendre du muscle ?",
        p: [
          "Quatre séances offrent un bon compromis entre fréquence et récupération. Chaque groupe musculaire est sollicité deux fois par semaine, ce qui est une fréquence couramment recommandée pour progresser en musculation, tout en laissant des jours de repos.",
          "C'est aussi un rythme tenable sur la durée pour la plupart des personnes qui ont un travail ou des obligations familiales.",
        ],
      },
      {
        h2: "Comment répartir les séances sur la semaine ?",
        p: [
          "Une organisation classique est un split haut / bas : lundi haut du corps, mardi bas du corps, jeudi haut du corps, vendredi bas du corps. Le mercredi et le week-end servent de jours de repos ou de marche légère.",
          "Chaque séance combine quelques mouvements polyarticulaires (squat, développé, tirage, soulevé de terre roumain) puis un ou deux exercices d'isolation.",
        ],
      },
      {
        h2: "Combien de séries et de répétitions faut-il faire ?",
        p: [
          "Pour un débutant ou un intermédiaire, 3 à 4 séries de 6 à 12 répétitions par exercice sont une base courante, avec un repos de 60 à 120 secondes. Termine chaque série en gardant une ou deux répétitions « en réserve » plutôt que de chercher l'échec systématique.",
          "Le volume total dépend de ton niveau et de ta récupération : commence modestement et ajuste.",
        ],
      },
      {
        h2: "Comment progresser semaine après semaine ?",
        p: [
          "Le principe est la surcharge progressive : ajouter une répétition, puis un peu de charge, quand la technique reste propre. Note tes séances pour garder une trace.",
          "Prévoir une semaine plus légère toutes les 4 à 8 semaines aide souvent à mieux récupérer.",
        ],
      },
      {
        h2: "Et l'alimentation et le sommeil ?",
        p: [
          "Prendre du muscle demande généralement un léger surplus calorique et un apport suffisant en protéines, réparti sur la journée, ainsi qu'un sommeil régulier. Les besoins varient d'une personne à l'autre : un professionnel de santé ou un diététicien peut t'aider à les préciser.",
          "Les résultats dépendent de nombreux facteurs individuels et ne peuvent pas être garantis.",
        ],
      },
    ],
  },
  {
    slug: "perte-de-poids-debutant",
    title: "Perte de poids pour débutant : par où commencer ?",
    description:
      "Les bases pour débuter une perte de poids progressive : activité physique régulière, renforcement musculaire, marche, alimentation et récupération.",
    resume:
      "Pour un débutant, une démarche progressive combine une activité régulière (marche, cardio doux), 2 à 3 séances de renforcement musculaire par semaine et une alimentation équilibrée, sans restriction extrême. Un avis médical est conseillé avant de commencer.",
    date: "2026-10-01",
    sections: [
      {
        h2: "Quelle activité physique pour débuter une perte de poids ?",
        p: [
          "Les recommandations de l'Organisation mondiale de la santé pour les adultes vont de 150 à 300 minutes d'activité d'intensité modérée par semaine, complétées par des exercices de renforcement musculaire au moins deux jours par semaine.",
          "Si tu pars de loin, commence plus bas : quelques marches de 20 à 30 minutes et deux courtes séances de renforcement, puis augmente peu à peu.",
        ],
      },
      {
        h2: "Pourquoi associer renforcement musculaire et cardio ?",
        p: [
          "Le cardio augmente la dépense énergétique, tandis que le renforcement musculaire contribue à maintenir la masse musculaire pendant une perte de poids. Les deux se complètent.",
          "Des exercices au poids du corps (squats, pompes inclinées, pont fessier, gainage) suffisent pour commencer, sans matériel.",
        ],
      },
      {
        h2: "Quel rythme de perte de poids est raisonnable ?",
        p: [
          "Une perte lente et régulière est généralement préférée à un régime drastique. Un déficit calorique modéré est plus facile à tenir qu'une restriction sévère, et limite la fatigue et la reprise de poids.",
          "Le rythme réel dépend de chaque personne ; un médecin ou un diététicien peut fixer un objectif adapté à ta situation.",
        ],
      },
      {
        h2: "Comment rester régulier quand on débute ?",
        p: [
          "Planifie tes séances comme des rendez-vous, choisis des activités que tu aimes et garde une marge de manœuvre : manquer une séance n'annule pas le reste de la semaine.",
          "Suivre ses séances et ses sensations est souvent plus parlant que la seule balance.",
        ],
      },
      {
        h2: "Quand demander un avis médical ?",
        p: [AVERTISSEMENT],
      },
    ],
  },
  {
    slug: "combien-de-seances-par-semaine",
    title: "Combien de séances de sport par semaine faut-il faire ?",
    description:
      "De 2 à 6 séances par semaine : comment choisir selon ton objectif, ton niveau et ta récupération, avec des repères simples pour débutants.",
    resume:
      "Entre 2 et 6 séances par semaine selon ta disponibilité : 3 séances conviennent bien à un débutant, avec au moins un jour de repos complet entre deux séances intenses. La régularité compte plus que le nombre de séances.",
    date: "2026-10-01",
    sections: [
      {
        h2: "Combien de séances par semaine quand on débute ?",
        p: [
          "Deux à trois séances par semaine suffisent pour bien démarrer. Trois séances « full body » espacées d'un jour de repos permettent de travailler tout le corps tout en récupérant.",
        ],
      },
      {
        h2: "Combien de séances selon l'objectif ?",
        p: [
          "Pour la remise en forme, 2 à 3 séances. Pour la prise de muscle, 3 à 5 séances selon le split choisi (full body, haut/bas, push/pull/legs). Pour l'endurance, plusieurs sorties de durées et d'intensités variées, dont une plus longue.",
          "Plus de séances n'est pas toujours mieux : la progression vient de l'association entre effort et récupération.",
        ],
      },
      {
        h2: "Faut-il des jours de repos ?",
        p: [
          "Oui. Garde au moins un jour de repos complet par semaine et évite d'enchaîner deux séances intenses sur les mêmes muscles. Une marche ou de la mobilité peuvent remplacer une séance quand tu es fatigué.",
        ],
      },
      {
        h2: "Comment savoir si je m'entraîne trop ?",
        p: [
          "Une fatigue persistante, un sommeil dégradé, des douleurs qui ne passent pas ou une baisse inhabituelle de performance sont des signaux pour alléger. En cas de doute ou de douleur, consulte un professionnel de santé.",
        ],
      },
      {
        h2: "Comment adapter le nombre de séances à mon emploi du temps ?",
        p: [
          "Choisis le nombre de jours que tu peux tenir de façon réaliste pendant plusieurs semaines. Coach.Pro génère une semaine type de 2 à 6 jours avec des séances adaptées à ton niveau.",
        ],
      },
    ],
  },
  {
    slug: "musculation-sans-materiel-debutant",
    title: "Musculation sans matériel : un programme débutant à la maison",
    description:
      "Les exercices au poids du corps pour débuter la musculation chez soi : squats, pompes, gainage, et comment organiser trois séances par semaine.",
    resume:
      "On peut commencer la musculation sans matériel avec des exercices au poids du corps (squat, pompes, fentes, pont fessier, gainage), en 2 à 3 séances par semaine de 30 à 45 minutes, en augmentant progressivement les répétitions ou la difficulté.",
    date: "2026-10-01",
    sections: [
      {
        h2: "Peut-on vraiment se muscler sans matériel ?",
        p: [
          "Oui, surtout au début. Le poids du corps représente déjà une charge suffisante pour un débutant. Avec le temps, il faudra augmenter la difficulté (variantes plus dures, tempo lent, séries plus longues) ou ajouter un peu de matériel.",
        ],
      },
      {
        h2: "Quels exercices au poids du corps pour commencer ?",
        p: [
          "Squats, pompes (sur les genoux ou inclinées au besoin), fentes arrière, pont fessier, rowing avec une serviette ou un élastique, et gainage ventral et latéral couvrent l'essentiel du corps.",
          "Concentre-toi sur la technique avant la vitesse ou le nombre de répétitions.",
        ],
      },
      {
        h2: "Comment organiser une séance de 40 minutes ?",
        p: [
          "Après un échauffement de 5 à 8 minutes (mobilité, marche, squats légers), enchaîne 4 à 5 exercices en 3 séries de 10 à 15 répétitions, avec 45 à 60 secondes de repos, puis termine par quelques étirements doux.",
        ],
      },
      {
        h2: "Comment progresser sans ajouter de charge ?",
        p: [
          "Ajoute des répétitions, ralentis la descente, réduis les temps de repos ou passe à une variante plus difficile (pompes standard, fentes bulgares). Garde une trace de tes séances pour constater ta progression.",
        ],
      },
      {
        h2: "Quelles précautions prendre ?",
        p: [AVERTISSEMENT],
      },
    ],
  },
  {
    slug: "bien-recuperer-entre-les-seances",
    title: "Bien récupérer entre les séances : sommeil, repos et alimentation",
    description:
      "Les bases de la récupération sportive : sommeil, jours de repos, hydratation, alimentation et signes de surmenage à surveiller.",
    resume:
      "La récupération repose sur un sommeil suffisant et régulier, des jours de repos planifiés, une alimentation et une hydratation adaptées, et l'écoute de la fatigue. Réduire le volume d'entraînement quand la fatigue s'accumule fait partie de la progression.",
    date: "2026-10-01",
    sections: [
      {
        h2: "Pourquoi la récupération est-elle importante ?",
        p: [
          "C'est pendant les périodes de repos que l'organisme s'adapte à l'effort. Sans récupération suffisante, la fatigue s'accumule et le risque de blessure augmente.",
        ],
      },
      {
        h2: "Combien d'heures de sommeil pour bien récupérer ?",
        p: [
          "Les recommandations générales pour un adulte sont d'environ 7 à 9 heures par nuit. Un horaire de coucher régulier et une chambre calme et fraîche aident à mieux dormir.",
        ],
      },
      {
        h2: "Quels jours de repos prévoir dans la semaine ?",
        p: [
          "Au moins un jour de repos complet par semaine, et un jour de récupération active (marche, mobilité, étirements doux) si tu t'entraînes souvent. Alterne les groupes musculaires sollicités d'une séance à l'autre.",
        ],
      },
      {
        h2: "Que manger et boire pour mieux récupérer ?",
        p: [
          "Une alimentation variée, avec des protéines à chaque repas, des glucides pour l'énergie et suffisamment d'eau, soutient la récupération. Les besoins précis dépendent de chaque personne : un diététicien peut te conseiller.",
        ],
      },
      {
        h2: "Quels signes montrent qu'il faut lever le pied ?",
        p: [
          "Fatigue persistante, sommeil perturbé, irritabilité, douleurs durables ou baisse de performance sont des signaux d'alerte. Allège alors les séances et, si cela dure, consulte un professionnel de santé.",
        ],
      },
    ],
  },
];

export const getArticle = (slug: string) => BLOG.find((a) => a.slug === slug);
