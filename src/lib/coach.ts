export type Sexe = "H" | "F";
export type Objectif = "perte" | "muscle" | "performance" | "reprise" | "explosivite" | "maintien";
export type Niveau = "debutant" | "intermediaire" | "avance";
export type Equipement = "aucun" | "halteres" | "elastiques" | "barre" | "salle" | "cardio";
export type Zone = "epaule" | "genou" | "dos" | "poignet" | "cheville";

export interface Profil {
  prenom: string;
  sexe: Sexe;
  age: number;
  taille: number;
  poids: number;
  objectif: Objectif;
  niveau: Niveau;
  jours: number;
  duree: number;
  equipement: Equipement[];
  blessures: Zone[];
  pathologies: string[];
  activite: 1.2 | 1.375 | 1.55 | 1.725;
}

export interface Analyse {
  imc: number;
  bmr: number;
  tdee: number;
  kcal: number;
  macros: { proteines: number; lipides: number; glucides: number };
  split: string;
  rpeMax: number;
  avisMedical: boolean;
}

export interface ExerciceProg {
  nom: string;
  muscles: string;
  series: number;
  reps: string;
  repos: number;
  kcal: number;
}
export interface SeanceProg {
  jour: string;
  titre: string;
  duree: number;
  kcal: number;
  exercices: ExerciceProg[];
}

interface Exo {
  nom: string;
  muscles: string;
  groupe: "haut-push" | "haut-pull" | "bas" | "core" | "cardio";
  equip: Equipement;
  niveau: number;
  contre: Zone[];
  met: number;
}

const CATALOGUE: Exo[] = [
  { nom: "Pompes", muscles: "Pectoraux, triceps", groupe: "haut-push", equip: "aucun", niveau: 0, contre: ["epaule", "poignet"], met: 5 },
  { nom: "Développé couché haltères", muscles: "Pectoraux", groupe: "haut-push", equip: "halteres", niveau: 0, contre: ["epaule"], met: 5 },
  { nom: "Développé couché barre", muscles: "Pectoraux, triceps", groupe: "haut-push", equip: "barre", niveau: 1, contre: ["epaule", "poignet"], met: 6 },
  { nom: "Développé militaire", muscles: "Épaules", groupe: "haut-push", equip: "halteres", niveau: 1, contre: ["epaule"], met: 5 },
  { nom: "Rowing élastique", muscles: "Dos, biceps", groupe: "haut-pull", equip: "elastiques", niveau: 0, contre: [], met: 4 },
  { nom: "Rowing haltère", muscles: "Dos, biceps", groupe: "haut-pull", equip: "halteres", niveau: 0, contre: ["dos"], met: 5 },
  { nom: "Tractions", muscles: "Dos, biceps", groupe: "haut-pull", equip: "barre", niveau: 2, contre: ["epaule"], met: 6 },
  { nom: "Tirage vertical", muscles: "Dos", groupe: "haut-pull", equip: "salle", niveau: 0, contre: [], met: 5 },
  { nom: "Squat poids du corps", muscles: "Quadriceps, fessiers", groupe: "bas", equip: "aucun", niveau: 0, contre: ["genou"], met: 5 },
  { nom: "Squat goblet", muscles: "Quadriceps, fessiers", groupe: "bas", equip: "halteres", niveau: 0, contre: ["genou"], met: 5.5 },
  { nom: "Squat barre", muscles: "Jambes", groupe: "bas", equip: "barre", niveau: 1, contre: ["genou", "dos"], met: 6 },
  { nom: "Pont fessier", muscles: "Fessiers, ischios", groupe: "bas", equip: "aucun", niveau: 0, contre: [], met: 4 },
  { nom: "Fentes", muscles: "Jambes, équilibre", groupe: "bas", equip: "aucun", niveau: 0, contre: ["genou", "cheville"], met: 5 },
  { nom: "Presse à cuisses", muscles: "Jambes", groupe: "bas", equip: "salle", niveau: 0, contre: ["genou"], met: 5 },
  { nom: "Soulevé de terre roumain", muscles: "Ischios, dos", groupe: "bas", equip: "barre", niveau: 2, contre: ["dos"], met: 6 },
  { nom: "Gainage", muscles: "Abdominaux", groupe: "core", equip: "aucun", niveau: 0, contre: ["epaule", "poignet"], met: 3.5 },
  { nom: "Crunch inversé", muscles: "Abdominaux", groupe: "core", equip: "aucun", niveau: 0, contre: [], met: 3.5 },
  { nom: "Marche rapide / vélo", muscles: "Cardio", groupe: "cardio", equip: "aucun", niveau: 0, contre: [], met: 3.5 },
  { nom: "Burpees", muscles: "Full body", groupe: "cardio", equip: "aucun", niveau: 1, contre: ["genou", "epaule", "poignet"], met: 9 },
  { nom: "Corde à sauter", muscles: "Cardio, mollets", groupe: "cardio", equip: "aucun", niveau: 1, contre: ["cheville", "genou"], met: 10 },
  { nom: "Rameur", muscles: "Cardio, dos", groupe: "cardio", equip: "cardio", niveau: 0, contre: ["dos"], met: 7 },
];

const NIVEAU_IDX: Record<Niveau, number> = { debutant: 0, intermediaire: 1, avance: 2 };
const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export function analyser(p: Profil): Analyse {
  const m = p.taille / 100;
  const imc = p.poids / (m * m);
  const bmr = 10 * p.poids + 6.25 * p.taille - 5 * p.age + (p.sexe === "H" ? 5 : -161);
  const tdee = bmr * p.activite;
  const facteur: Record<Objectif, number> = {
    perte: 0.82, muscle: 1.1, performance: 1, reprise: 0.95, explosivite: 1.05, maintien: 1,
  };
  const plancher = p.sexe === "H" ? 1500 : 1200;
  const kcal = Math.round(Math.max(plancher, tdee * facteur[p.objectif]));
  const proteines = Math.round(p.poids * (p.objectif === "muscle" || p.objectif === "perte" ? 2 : 1.6));
  const lipides = Math.round(p.poids * 0.9);
  const glucides = Math.max(0, Math.round((kcal - proteines * 4 - lipides * 9) / 4));
  const split = p.jours <= 3 ? "Full body" : p.jours === 4 ? "Haut / Bas" : "Push / Pull / Legs";
  const avisMedical =
    p.pathologies.length > 0 || imc >= 35 || imc < 17 || p.age >= 60;
  return {
    imc: Math.round(imc * 10) / 10,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    kcal,
    macros: { proteines, lipides, glucides },
    split,
    rpeMax: avisMedical ? 6 : 9,
    avisMedical,
  };
}

function scheme(p: Profil): { series: number; reps: string; repos: number } {
  const s = p.niveau === "debutant" ? 3 : 4;
  switch (p.objectif) {
    case "perte": return { series: s, reps: "12-15", repos: 40 };
    case "muscle": return { series: s, reps: "8-12", repos: 90 };
    case "performance": return { series: s + 1, reps: "4-6", repos: 150 };
    case "explosivite": return { series: s, reps: "5 explosives", repos: 120 };
    case "reprise": return { series: 2, reps: "10-12", repos: 75 };
    default: return { series: 3, reps: "10-12", repos: 60 };
  }
}

/** Exercices utilisables : équipement, niveau, blessures. */
export function filtrerExercices(p: Profil): Exo[] {
  const lvl = NIVEAU_IDX[p.niveau];
  const dispo = new Set<Equipement>(["aucun", ...p.equipement]);
  return CATALOGUE.filter(
    (e) => dispo.has(e.equip) && e.niveau <= lvl && !e.contre.some((z) => p.blessures.includes(z)),
  );
}

export function genererProgramme(p: Profil): SeanceProg[] {
  const dispos = filtrerExercices(p);
  const sc = scheme(p);
  const pick = (groupes: Exo["groupe"][], n: number, decalage: number): Exo[] => {
    const pool = dispos.filter((e) => groupes.includes(e.groupe));
    return Array.from({ length: Math.min(n, pool.length) }, (_, i) => pool[(i + decalage) % pool.length]!);
  };
  const plans: { titre: string; groupes: Exo["groupe"][][] }[] =
    p.jours <= 3
      ? [{ titre: "Full body", groupes: [["bas"], ["haut-push"], ["haut-pull"], ["core"]] }]
      : p.jours === 4
        ? [
            { titre: "Haut du corps", groupes: [["haut-push"], ["haut-pull"], ["core"]] },
            { titre: "Bas du corps", groupes: [["bas"], ["bas"], ["core"]] },
          ]
        : [
            { titre: "Push", groupes: [["haut-push"], ["haut-push"], ["core"]] },
            { titre: "Pull", groupes: [["haut-pull"], ["haut-pull"], ["core"]] },
            { titre: "Legs", groupes: [["bas"], ["bas"], ["core"]] },
          ];

  const par = Math.max(3, Math.min(6, Math.floor(p.duree / 10)));
  const espace = p.jours <= 3 ? [0, 2, 4] : p.jours === 4 ? [0, 1, 3, 4] : [0, 1, 2, 3, 4, 5].slice(0, p.jours);

  return Array.from({ length: p.jours }, (_, i) => {
    const plan = plans[i % plans.length]!;
    const tour = Math.floor(i / plans.length);
    const choisis: Exo[] = [];
    plan.groupes.forEach((g, gi) => {
      for (const e of pick(g, 1 + Math.floor(par / 4), gi + tour)) {
        if (!choisis.includes(e)) choisis.push(e);
      }
    });
    if (["perte", "performance", "explosivite"].includes(p.objectif)) {
      const c = dispos.find((e) => e.groupe === "cardio" && (p.objectif !== "perte" || e.met >= 7)) ?? dispos.find((e) => e.groupe === "cardio");
      if (c && !choisis.includes(c)) choisis.push(c);
    }
    const exercices = choisis.slice(0, par + 1).map<ExerciceProg>((e) => {
      const cardio = e.groupe === "cardio";
      const minutes = cardio ? 10 : (sc.series * (40 + sc.repos)) / 60;
      return {
        nom: e.nom,
        muscles: e.muscles,
        series: cardio ? 1 : sc.series,
        reps: cardio ? "10 min" : e.nom === "Gainage" ? "30-45 s" : sc.reps,
        repos: cardio ? 0 : sc.repos,
        kcal: Math.round((e.met * p.poids * minutes) / 60),
      };
    });
    return {
      jour: JOURS[espace[i] ?? i]!,
      titre: `${plan.titre}${plans.length > 1 && tour > 0 ? " B" : ""}`,
      duree: p.duree,
      kcal: exercices.reduce((a, x) => a + x.kcal, 0),
      exercices,
    };
  });
}

/** Adaptation quotidienne par règles (le LLM se greffe par-dessus côté serveur). */
export interface CheckIn {
  fatigue: number;
  sommeil: number;
  temps: number;
  douleur?: Zone | undefined;
}
export function adapterSeance(s: SeanceProg, c: CheckIn, p: Profil): { seance: SeanceProg; notes: string[] } {
  const notes: string[] = [];
  let exos = s.exercices.map((e) => ({ ...e }));
  if (c.douleur) {
    const bannis = new Set(CATALOGUE.filter((e) => e.contre.includes(c.douleur!)).map((e) => e.nom));
    const avant = exos.length;
    exos = exos.filter((e) => !bannis.has(e.nom));
    if (exos.length < avant) notes.push(`Exercices sollicitant ${c.douleur} retirés.`);
  }
  if (c.fatigue >= 4 || c.sommeil < 6) {
    exos = exos.map((e) => ({ ...e, series: Math.max(1, Math.round(e.series * 0.7)), kcal: Math.round(e.kcal * 0.7) }));
    notes.push("Fatigue : volume -30 %, intensité RPE -2.");
  }
  if (c.temps < p.duree) {
    exos = exos.slice(0, Math.max(3, Math.floor(c.temps / 10)));
    notes.push("Temps court : séance condensée.");
  }
  return {
    seance: { ...s, duree: Math.min(s.duree, c.temps), exercices: exos, kcal: exos.reduce((a, e) => a + e.kcal, 0) },
    notes,
  };
}
