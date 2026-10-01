/**
 * Séances et exercices : ne jamais importer côté client.
 * Servis uniquement par server function après contrôle d'abonnement.
 */
export type ObjectifSimple = "perte" | "masse" | "forme" | "endurance";
export type NiveauSimple = "debutant" | "intermediaire" | "avance";

interface Exercice {
  nom: string;
  series: string;
  repos: string;
}

interface Seance {
  titre: string;
  focus: string;
  duree: string;
  exercices: Exercice[];
}

const REPOS: Record<NiveauSimple, string> = {
  debutant: "90 s",
  intermediaire: "75 s",
  avance: "60 s",
};

function reps(niveau: NiveauSimple, base: string): string {
  if (niveau === "debutant") return `3 x ${base}`;
  if (niveau === "intermediaire") return `4 x ${base}`;
  return `5 x ${base}`;
}

const SEANCES: Record<ObjectifSimple, Seance[]> = {
  perte: [
    {
      titre: "Circuit Brûle-Graisses",
      focus: "Full body HIIT",
      duree: "40 min",
      exercices: [
        { nom: "Burpees", series: "4 x 12", repos: "45 s" },
        { nom: "Squats sautés", series: "4 x 15", repos: "45 s" },
        { nom: "Mountain climbers", series: "4 x 30 s", repos: "30 s" },
        { nom: "Fentes alternées", series: "4 x 12 / jambe", repos: "45 s" },
        { nom: "Planche dynamique", series: "3 x 40 s", repos: "30 s" },
      ],
    },
    {
      titre: "Cardio Intensif",
      focus: "Interval training",
      duree: "35 min",
      exercices: [
        { nom: "Corde à sauter", series: "5 x 2 min", repos: "60 s" },
        { nom: "Sprints sur place", series: "6 x 30 s", repos: "30 s" },
        { nom: "Jumping jacks", series: "4 x 45 s", repos: "30 s" },
        { nom: "Gainage latéral", series: "3 x 30 s / côté", repos: "30 s" },
      ],
    },
    {
      titre: "Renforcement Métabolique",
      focus: "Haut du corps + core",
      duree: "45 min",
      exercices: [
        { nom: "Pompes", series: "4 x 12", repos: "60 s" },
        { nom: "Rowing haltères", series: "4 x 12", repos: "60 s" },
        { nom: "Développé épaules", series: "3 x 12", repos: "60 s" },
        { nom: "Crunchs inversés", series: "4 x 15", repos: "45 s" },
        { nom: "Russian twists", series: "3 x 20", repos: "45 s" },
      ],
    },
    {
      titre: "Bas du Corps Tonique",
      focus: "Jambes + fessiers",
      duree: "45 min",
      exercices: [
        { nom: "Squats goblet", series: "4 x 15", repos: "60 s" },
        { nom: "Soulevé de terre jambes tendues", series: "4 x 12", repos: "60 s" },
        { nom: "Hip thrust", series: "4 x 15", repos: "60 s" },
        { nom: "Montées sur banc", series: "3 x 12 / jambe", repos: "45 s" },
        { nom: "Mollets debout", series: "4 x 20", repos: "30 s" },
      ],
    },
    {
      titre: "HIIT Tabata",
      focus: "Brûlure maximale",
      duree: "30 min",
      exercices: [
        { nom: "Squats rapides", series: "8 x 20 s", repos: "10 s" },
        { nom: "Pompes explosives", series: "8 x 20 s", repos: "10 s" },
        { nom: "Fentes sautées", series: "8 x 20 s", repos: "10 s" },
        { nom: "Planche à touchés d'épaules", series: "8 x 20 s", repos: "10 s" },
      ],
    },
    {
      titre: "Cardio Endurance Active",
      focus: "Récupération active",
      duree: "40 min",
      exercices: [
        { nom: "Marche rapide inclinée", series: "1 x 20 min", repos: "—" },
        { nom: "Vélo elliptique", series: "1 x 15 min", repos: "—" },
        { nom: "Étirements dynamiques", series: "1 x 5 min", repos: "—" },
      ],
    },
  ],
  masse: [
    {
      titre: "Pectoraux & Triceps",
      focus: "Push — haut du corps",
      duree: "60 min",
      exercices: [
        { nom: "Développé couché barre", series: "4 x 8", repos: "90 s" },
        { nom: "Développé incliné haltères", series: "4 x 10", repos: "90 s" },
        { nom: "Écartés poulie", series: "3 x 12", repos: "60 s" },
        { nom: "Dips lestés", series: "3 x 10", repos: "90 s" },
        { nom: "Extensions triceps poulie", series: "4 x 12", repos: "60 s" },
      ],
    },
    {
      titre: "Dos & Biceps",
      focus: "Pull — haut du corps",
      duree: "60 min",
      exercices: [
        { nom: "Tractions", series: "4 x 8", repos: "90 s" },
        { nom: "Rowing barre", series: "4 x 10", repos: "90 s" },
        { nom: "Tirage vertical", series: "3 x 12", repos: "75 s" },
        { nom: "Curl barre EZ", series: "4 x 10", repos: "60 s" },
        { nom: "Curl marteau", series: "3 x 12", repos: "60 s" },
      ],
    },
    {
      titre: "Jambes Complètes",
      focus: "Quadriceps + ischios",
      duree: "65 min",
      exercices: [
        { nom: "Squat barre", series: "4 x 8", repos: "120 s" },
        { nom: "Presse à cuisses", series: "4 x 12", repos: "90 s" },
        { nom: "Soulevé de terre roumain", series: "4 x 10", repos: "90 s" },
        { nom: "Leg curl", series: "3 x 12", repos: "60 s" },
        { nom: "Mollets assis", series: "4 x 15", repos: "45 s" },
      ],
    },
    {
      titre: "Épaules & Abdos",
      focus: "Deltoïdes + sangle abdominale",
      duree: "55 min",
      exercices: [
        { nom: "Développé militaire", series: "4 x 8", repos: "90 s" },
        { nom: "Élévations latérales", series: "4 x 12", repos: "60 s" },
        { nom: "Oiseau haltères", series: "3 x 12", repos: "60 s" },
        { nom: "Shrugs barre", series: "4 x 12", repos: "60 s" },
        { nom: "Relevés de jambes suspendu", series: "4 x 12", repos: "60 s" },
      ],
    },
    {
      titre: "Full Body Force",
      focus: "Mouvements composés",
      duree: "60 min",
      exercices: [
        { nom: "Soulevé de terre", series: "5 x 5", repos: "150 s" },
        { nom: "Développé couché", series: "4 x 6", repos: "120 s" },
        { nom: "Squat", series: "4 x 6", repos: "120 s" },
        { nom: "Tractions lestées", series: "3 x 6", repos: "90 s" },
      ],
    },
    {
      titre: "Bras & Finition",
      focus: "Volume bras",
      duree: "45 min",
      exercices: [
        { nom: "Curl incliné", series: "4 x 10", repos: "60 s" },
        { nom: "Barre au front", series: "4 x 10", repos: "60 s" },
        { nom: "Curl concentration", series: "3 x 12", repos: "45 s" },
        { nom: "Extensions nuque", series: "3 x 12", repos: "45 s" },
        { nom: "Pompes serrées", series: "3 x max", repos: "60 s" },
      ],
    },
  ],
  forme: [
    {
      titre: "Réveil Musculaire",
      focus: "Full body doux",
      duree: "35 min",
      exercices: [
        { nom: "Squats poids du corps", series: "3 x 12", repos: "60 s" },
        { nom: "Pompes sur genoux", series: "3 x 10", repos: "60 s" },
        { nom: "Rowing élastique", series: "3 x 12", repos: "60 s" },
        { nom: "Planche", series: "3 x 30 s", repos: "45 s" },
      ],
    },
    {
      titre: "Cardio Doux",
      focus: "Endurance fondamentale",
      duree: "30 min",
      exercices: [
        { nom: "Marche rapide ou vélo", series: "1 x 20 min", repos: "—" },
        { nom: "Step bas", series: "3 x 2 min", repos: "60 s" },
        { nom: "Respiration & étirements", series: "1 x 5 min", repos: "—" },
      ],
    },
    {
      titre: "Renfo & Mobilité",
      focus: "Posture + gainage",
      duree: "40 min",
      exercices: [
        { nom: "Fentes arrière", series: "3 x 10 / jambe", repos: "60 s" },
        { nom: "Pont fessier", series: "3 x 15", repos: "45 s" },
        { nom: "Gainage latéral", series: "3 x 20 s / côté", repos: "45 s" },
        { nom: "Oiseau-chien", series: "3 x 10 / côté", repos: "45 s" },
        { nom: "Étirements actifs", series: "1 x 8 min", repos: "—" },
      ],
    },
    {
      titre: "Circuit Tonicité",
      focus: "Tonification générale",
      duree: "40 min",
      exercices: [
        { nom: "Squat + press épaules", series: "3 x 12", repos: "60 s" },
        { nom: "Soulevé de terre léger", series: "3 x 12", repos: "60 s" },
        { nom: "Pompes inclinées", series: "3 x 12", repos: "60 s" },
        { nom: "Mountain climbers lents", series: "3 x 30 s", repos: "45 s" },
      ],
    },
    {
      titre: "Cardio Ludique",
      focus: "Intervalles modérés",
      duree: "35 min",
      exercices: [
        { nom: "Corde à sauter", series: "4 x 1 min", repos: "60 s" },
        { nom: "Jumping jacks", series: "4 x 40 s", repos: "40 s" },
        { nom: "Montées de genoux", series: "4 x 30 s", repos: "40 s" },
        { nom: "Marche récupération", series: "1 x 5 min", repos: "—" },
      ],
    },
    {
      titre: "Stretching & Core",
      focus: "Récupération",
      duree: "30 min",
      exercices: [
        { nom: "Planche", series: "3 x 40 s", repos: "45 s" },
        { nom: "Crunchs", series: "3 x 15", repos: "45 s" },
        { nom: "Yoga flow doux", series: "1 x 15 min", repos: "—" },
      ],
    },
  ],
  endurance: [
    {
      titre: "Endurance Fondamentale",
      focus: "Zone 2 cardio",
      duree: "45 min",
      exercices: [
        { nom: "Course ou vélo zone 2", series: "1 x 35 min", repos: "—" },
        { nom: "Gainage", series: "3 x 45 s", repos: "45 s" },
        { nom: "Étirements", series: "1 x 10 min", repos: "—" },
      ],
    },
    {
      titre: "Intervalles Courts",
      focus: "VMA — 30/30",
      duree: "40 min",
      exercices: [
        { nom: "Échauffement footing", series: "1 x 10 min", repos: "—" },
        { nom: "30 s vite / 30 s lent", series: "2 x 8 répétitions", repos: "3 min entre séries" },
        { nom: "Retour au calme", series: "1 x 10 min", repos: "—" },
      ],
    },
    {
      titre: "Renfo Spécifique",
      focus: "Muscler pour durer",
      duree: "45 min",
      exercices: [
        { nom: "Squats bulgares", series: "4 x 10 / jambe", repos: "60 s" },
        { nom: "Fentes marchées", series: "3 x 20 pas", repos: "60 s" },
        { nom: "Montées de genoux lestées", series: "4 x 30 s", repos: "45 s" },
        { nom: "Gainage dynamique", series: "3 x 40 s", repos: "45 s" },
      ],
    },
    {
      titre: "Sortie Longue",
      focus: "Volume endurance",
      duree: "60 min",
      exercices: [
        { nom: "Course / vélo long", series: "1 x 50 min", repos: "—" },
        { nom: "Gainage latéral", series: "3 x 30 s / côté", repos: "30 s" },
        { nom: "Étirements complets", series: "1 x 10 min", repos: "—" },
      ],
    },
    {
      titre: "Seuil & Tempo",
      focus: "Allure soutenue",
      duree: "45 min",
      exercices: [
        { nom: "Échauffement", series: "1 x 10 min", repos: "—" },
        { nom: "Tempo run", series: "3 x 8 min", repos: "2 min trot" },
        { nom: "Retour au calme", series: "1 x 10 min", repos: "—" },
      ],
    },
    {
      titre: "Cross Training Cardio",
      focus: "Variété + explosivité",
      duree: "40 min",
      exercices: [
        { nom: "Rameur ou elliptique", series: "4 x 5 min", repos: "90 s" },
        { nom: "Burpees", series: "3 x 10", repos: "60 s" },
        { nom: "Corde à sauter", series: "4 x 1 min", repos: "45 s" },
      ],
    },
  ],
};

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const BIBLIOTHEQUE = [
  { nom: "Squat", cible: "Quadriceps, fessiers", niveau: "Tous niveaux" },
  { nom: "Soulevé de terre", cible: "Dos, ischios, fessiers", niveau: "Intermédiaire+" },
  { nom: "Développé couché", cible: "Pectoraux, triceps", niveau: "Tous niveaux" },
  { nom: "Tractions", cible: "Dos, biceps", niveau: "Intermédiaire+" },
  { nom: "Burpees", cible: "Full body, cardio", niveau: "Tous niveaux" },
  { nom: "Fentes", cible: "Jambes, équilibre", niveau: "Tous niveaux" },
  { nom: "Planche", cible: "Abdominaux, gainage", niveau: "Tous niveaux" },
  { nom: "Développé militaire", cible: "Épaules, triceps", niveau: "Intermédiaire+" },
  { nom: "Hip thrust", cible: "Fessiers", niveau: "Tous niveaux" },
  { nom: "Rowing barre", cible: "Dos, biceps", niveau: "Tous niveaux" },
  { nom: "Mountain climbers", cible: "Core, cardio", niveau: "Tous niveaux" },
  { nom: "Dips", cible: "Triceps, pectoraux", niveau: "Intermédiaire+" },
];

export function construireProgramme(objectif: ObjectifSimple, niveau: NiveauSimple, jours: number) {
  const seances = SEANCES[objectif];
  const repos = REPOS[niveau];
  return Array.from({ length: jours }, (_, i) => {
    const seance = seances[i % seances.length]!;
    return {
      jour: JOURS[i]!,
      ...seance,
      exercices: seance.exercices.map((ex) => ({
        ...ex,
        series:
          ex.series.includes("x") && !ex.series.includes("min") && !ex.series.includes("s")
            ? reps(niveau, ex.series.split("x")[1]!.trim())
            : ex.series,
        repos: ex.repos === "—" ? ex.repos : ex.repos.includes("entre séries") ? ex.repos : repos,
      })),
    };
  });
}

export const bibliotheque = () => BIBLIOTHEQUE;
