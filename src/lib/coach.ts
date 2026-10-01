// Types et libellés partagés. La logique (catalogue, programmes, nutrition) est dans coach.server.ts.
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

export const NOTE_MORPHO: Record<Morphologie, string> = {
  ectomorphe: "Ectomorphe : volume réduit, charges lourdes sur mouvements composés, repos longs, cardio limité pour économiser les calories.",
  mesomorphe: "Mésomorphe : volume et intensité standards, bonne récupération, progression rapide.",
  endomorphe: "Endomorphe : répétitions plus hautes, repos courts, séances en circuit et finisseur cardio pour augmenter la dépense.",
};

/** Adaptation quotidienne par règles (le LLM se greffe par-dessus côté serveur). */
export interface CheckIn {
  fatigue: number;
  sommeil: number;
  temps: number;
  douleur?: Zone | undefined;
}
// ---------- Nutrition ----------
export type Repas = "petit-dej" | "dejeuner" | "collation" | "diner";
export type Regime = "omnivore" | "vegetarien" | "vegan";
export type Allergie = "gluten" | "lactose" | "oeufs" | "arachides" | "poisson";

export const LABEL_REPAS: Record<Repas, string> = {
  "petit-dej": "Petit-déjeuner", dejeuner: "Déjeuner", collation: "Collation", diner: "Dîner",
};

export interface RepasPlan {
  repas: Repas;
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

