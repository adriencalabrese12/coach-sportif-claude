export type Sexe = "H" | "F";
export type Objectif = "perte" | "muscle" | "performance" | "reprise" | "explosivite" | "maintien";
export type Niveau = "debutant" | "intermediaire" | "avance";
export type Equipement = "aucun" | "halteres" | "elastiques" | "barre" | "salle" | "cardio";
export type Zone = "epaule" | "genou" | "dos" | "poignet" | "cheville";

export type Morphologie = "ectomorphe" | "mesomorphe" | "endomorphe";

export interface Profil {
  regime: Regime;
  allergies: Allergie[];
  morphologie: Morphologie;
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
  // Ectomorphe : métabolisme rapide (+5 %) ; endomorphe : stockage facile (-5 %).
  const ajustMorpho: Record<Morphologie, number> = { ectomorphe: 1.05, mesomorphe: 1, endomorphe: 0.95 };
  const kcal = Math.round(Math.max(plancher, tdee * facteur[p.objectif] * ajustMorpho[p.morphologie]));
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

export const NOTE_MORPHO: Record<Morphologie, string> = {
  ectomorphe: "Ectomorphe : volume réduit, charges lourdes sur mouvements composés, repos longs, cardio limité pour économiser les calories.",
  mesomorphe: "Mésomorphe : volume et intensité standards, bonne récupération, progression rapide.",
  endomorphe: "Endomorphe : répétitions plus hautes, repos courts, séances en circuit et finisseur cardio pour augmenter la dépense.",
};

function scheme(p: Profil): { series: number; reps: string; repos: number } {
  const base = p.niveau === "debutant" ? 3 : 4;
  const s = base - (p.morphologie === "ectomorphe" && p.niveau !== "debutant" ? 1 : 0);
  let r: { series: number; reps: string; repos: number };
  switch (p.objectif) {
    case "perte": r = { series: s, reps: "12-15", repos: 40 }; break;
    case "muscle": r = { series: s, reps: "8-12", repos: 90 }; break;
    case "performance": r = { series: s + 1, reps: "4-6", repos: 150 }; break;
    case "explosivite": r = { series: s, reps: "5 explosives", repos: 120 }; break;
    case "reprise": r = { series: 2, reps: "10-12", repos: 75 }; break;
    default: r = { series: 3, reps: "10-12", repos: 60 };
  }
  const force = p.objectif === "muscle" || p.objectif === "maintien";
  if (p.morphologie === "ectomorphe") {
    // Charges lourdes, peu de reps, repos longs.
    r = { ...r, repos: r.repos + 30, reps: force ? "6-10" : r.reps };
  } else if (p.morphologie === "endomorphe") {
    // Reps plus hautes, repos courts.
    r = { ...r, repos: Math.max(30, r.repos - 20), reps: force ? "12-15" : r.reps };
  }
  return r;
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
    // Endomorphe : un finisseur cardio est ajouté quel que soit l'objectif (sauf reprise).
    const cardio =
      p.morphologie === "endomorphe"
        ? p.objectif !== "reprise"
        : p.morphologie === "ectomorphe"
          ? p.objectif === "perte"
          : ["perte", "performance", "explosivite"].includes(p.objectif);
    if (cardio) {
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

// ---------- Nutrition ----------
export type Regime = "omnivore" | "vegetarien" | "vegan";
export type Allergie = "gluten" | "lactose" | "oeufs" | "arachides" | "poisson";

interface Recette {
  nom: string;
  repas: "petit-dej" | "dejeuner" | "collation" | "diner";
  kcal: number;
  p: number;
  g: number;
  l: number;
  ingredients: string[];
  regime: Regime; // le plus restrictif compatible : vegan ⊂ vegetarien ⊂ omnivore
  allergenes: Allergie[];
}

const RECETTES: Recette[] = [
  { nom: "Flocons d'avoine, banane et beurre d'amande", repas: "petit-dej", kcal: 450, p: 15, g: 62, l: 14, ingredients: ["Flocons d'avoine", "Banane", "Purée d'amande", "Boisson végétale"], regime: "vegan", allergenes: ["gluten"] },
  { nom: "Omelette 3 œufs, pain complet et fruit", repas: "petit-dej", kcal: 480, p: 28, g: 40, l: 22, ingredients: ["Œufs", "Pain complet", "Fruit de saison"], regime: "vegetarien", allergenes: ["gluten", "oeufs"] },
  { nom: "Skyr, fruits rouges et granola", repas: "petit-dej", kcal: 400, p: 30, g: 48, l: 9, ingredients: ["Skyr", "Fruits rouges", "Granola"], regime: "vegetarien", allergenes: ["lactose", "gluten"] },
  { nom: "Porridge protéiné soja et fruits", repas: "petit-dej", kcal: 430, p: 25, g: 55, l: 12, ingredients: ["Flocons d'avoine", "Lait de soja", "Protéine végétale", "Fruits"], regime: "vegan", allergenes: ["gluten"] },
  { nom: "Tofu brouillé, avocat et patate douce", repas: "petit-dej", kcal: 460, p: 26, g: 42, l: 22, ingredients: ["Tofu", "Avocat", "Patate douce", "Curcuma"], regime: "vegan", allergenes: [] },
  { nom: "Smoothie bowl banane, protéine de pois et graines", repas: "petit-dej", kcal: 420, p: 28, g: 50, l: 12, ingredients: ["Banane", "Protéine de pois", "Graines de chia", "Boisson végétale"], regime: "vegan", allergenes: [] },
  { nom: "Poulet, riz basmati et brocoli", repas: "dejeuner", kcal: 650, p: 50, g: 70, l: 15, ingredients: ["Blanc de poulet", "Riz basmati", "Brocoli", "Huile d'olive"], regime: "omnivore", allergenes: [] },
  { nom: "Bowl thon, quinoa et avocat", repas: "dejeuner", kcal: 620, p: 42, g: 55, l: 22, ingredients: ["Thon", "Quinoa", "Avocat", "Tomates"], regime: "omnivore", allergenes: ["poisson"] },
  { nom: "Curry de pois chiches, riz et épinards", repas: "dejeuner", kcal: 600, p: 24, g: 88, l: 16, ingredients: ["Pois chiches", "Riz", "Épinards", "Lait de coco", "Curry"], regime: "vegan", allergenes: [] },
  { nom: "Pâtes complètes, tofu sauté et légumes", repas: "dejeuner", kcal: 620, p: 35, g: 78, l: 17, ingredients: ["Pâtes complètes", "Tofu", "Poivrons", "Courgettes"], regime: "vegan", allergenes: ["gluten"] },
  { nom: "Salade de lentilles, feta et légumes", repas: "dejeuner", kcal: 580, p: 30, g: 65, l: 20, ingredients: ["Lentilles", "Feta", "Concombre", "Tomates"], regime: "vegetarien", allergenes: ["lactose"] },
  { nom: "Fromage blanc et amandes", repas: "collation", kcal: 220, p: 22, g: 12, l: 9, ingredients: ["Fromage blanc", "Amandes"], regime: "vegetarien", allergenes: ["lactose"] },
  { nom: "Banane et poignée de noix", repas: "collation", kcal: 240, p: 5, g: 30, l: 12, ingredients: ["Banane", "Noix"], regime: "vegan", allergenes: [] },
  { nom: "Houmous et bâtonnets de légumes", repas: "collation", kcal: 200, p: 8, g: 20, l: 10, ingredients: ["Houmous", "Carottes", "Concombre"], regime: "vegan", allergenes: [] },
  { nom: "Saumon, patate douce et haricots verts", repas: "diner", kcal: 620, p: 40, g: 55, l: 24, ingredients: ["Saumon", "Patate douce", "Haricots verts"], regime: "omnivore", allergenes: ["poisson"] },
  { nom: "Dinde, quinoa et légumes rôtis", repas: "diner", kcal: 560, p: 46, g: 52, l: 14, ingredients: ["Escalope de dinde", "Quinoa", "Légumes rôtis"], regime: "omnivore", allergenes: [] },
  { nom: "Chili sin carne et riz", repas: "diner", kcal: 580, p: 26, g: 90, l: 12, ingredients: ["Haricots rouges", "Tomates", "Maïs", "Riz"], regime: "vegan", allergenes: [] },
  { nom: "Gratin d'œufs, épinards et pommes de terre", repas: "diner", kcal: 540, p: 28, g: 50, l: 24, ingredients: ["Œufs", "Épinards", "Pommes de terre", "Fromage"], regime: "vegetarien", allergenes: ["oeufs", "lactose"] },
];

const RANG: Record<Regime, number> = { vegan: 0, vegetarien: 1, omnivore: 2 };
const PART: Record<Recette["repas"], number> = { "petit-dej": 0.25, dejeuner: 0.35, collation: 0.1, diner: 0.3 };
export const LABEL_REPAS: Record<Recette["repas"], string> = {
  "petit-dej": "Petit-déjeuner", dejeuner: "Déjeuner", collation: "Collation", diner: "Dîner",
};

export interface RepasPlan {
  repas: Recette["repas"];
  nom: string;
  portion: number;
  kcal: number;
  p: number;
  g: number;
  l: number;
}
export interface JourNutrition {
  jour: string;
  repas: RepasPlan[];
  kcal: number;
}
export interface PlanNutrition {
  jours: JourNutrition[];
  courses: string[];
  eau: number;
  manque: string[];
}

export function genererNutrition(p: Profil, a: Analyse): PlanNutrition {
  const manque: string[] = [];
  const types = Object.keys(PART) as Recette["repas"][];
  const pools = Object.fromEntries(
    types.map((t) => {
      const pool = RECETTES.filter(
        (r) => r.repas === t && RANG[r.regime] <= RANG[p.regime] && !r.allergenes.some((x) => p.allergies.includes(x)),
      );
      if (pool.length === 0) manque.push(LABEL_REPAS[t]);
      return [t, pool];
    }),
  ) as Record<Recette["repas"], Recette[]>;

  const ingredients = new Set<string>();
  const jours = JOURS.map<JourNutrition>((jour, i) => {
    const repas: RepasPlan[] = [];
    for (const t of types) {
      const pool = pools[t];
      const r = pool[i % Math.max(1, pool.length)];
      if (!r) continue;
      const portion = Math.min(1.8, Math.max(0.6, Math.round(((a.kcal * PART[t]) / r.kcal) * 10) / 10));
      r.ingredients.forEach((x) => ingredients.add(x));
      repas.push({
        repas: t, nom: r.nom, portion,
        kcal: Math.round(r.kcal * portion), p: Math.round(r.p * portion),
        g: Math.round(r.g * portion), l: Math.round(r.l * portion),
      });
    }
    return { jour, repas, kcal: repas.reduce((s, x) => s + x.kcal, 0) };
  });
  return { jours, courses: [...ingredients].sort((x, y) => x.localeCompare(y, "fr")), eau: Math.round(p.poids * 0.033 * 10) / 10, manque };
}
