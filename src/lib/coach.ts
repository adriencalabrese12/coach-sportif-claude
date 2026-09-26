export type Sexe = "H" | "F";
export type Objectif = "perte" | "muscle" | "performance" | "reprise" | "explosivite" | "maintien";
export type Niveau = "debutant" | "intermediaire" | "avance";
export type Equipement = "aucun" | "halteres" | "elastiques" | "barre" | "salle" | "cardio" | "corde" | "ballon" | "kettlebell";
export type Zone = "epaule" | "genou" | "dos" | "poignet" | "cheville";
export type Morphologie = "ectomorphe" | "mesomorphe" | "endomorphe";
export type Regime = "omnivore" | "flexitarien" | "halal" | "pescetarien" | "vegetarien" | "vegan";
export type Allergie = "gluten" | "lactose" | "oeufs" | "arachides" | "poisson" | "soja";
export type StylePetitDej = "sucre" | "sale" | "indifferent";

export interface Profil {
  prenom: string;
  sexe: Sexe;
  age: number;
  taille: number;
  poids: number;
  morphologies: Morphologie[]; // 1 ou 2
  objectifs: Objectif[]; // le premier est l'objectif principal
  niveau: Niveau;
  jours: number;
  duree: number;
  equipement: Equipement[];
  blessures: Zone[];
  pathologies: string[];
  activite: 1.2 | 1.375 | 1.55 | 1.725;
  regime: Regime;
  allergies: Allergie[];
  petitDej: StylePetitDej;
  repasParJour: 3 | 4 | 5;
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
  charge?: string;
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
  /** Charge estimée en fraction du poids de corps (par haltère si `haltere`). */
  charge?: number;
  haltere?: boolean;
}

const CATALOGUE: Exo[] = [
  { nom: "Pompes", muscles: "Pectoraux, triceps", groupe: "haut-push", equip: "aucun", niveau: 0, contre: ["epaule", "poignet"], met: 5 },
  { nom: "Développé couché haltères", muscles: "Pectoraux", groupe: "haut-push", equip: "halteres", niveau: 0, contre: ["epaule"], met: 5, charge: 0.2, haltere: true },
  { nom: "Développé couché barre", muscles: "Pectoraux, triceps", groupe: "haut-push", equip: "barre", niveau: 1, contre: ["epaule", "poignet"], met: 6, charge: 0.55 },
  { nom: "Développé militaire", muscles: "Épaules", groupe: "haut-push", equip: "halteres", niveau: 1, contre: ["epaule"], met: 5, charge: 0.15, haltere: true },
  { nom: "Développé épaule kettlebell", muscles: "Épaules", groupe: "haut-push", equip: "kettlebell", niveau: 1, contre: ["epaule"], met: 5, charge: 0.15 },
  { nom: "Rowing élastique", muscles: "Dos, biceps", groupe: "haut-pull", equip: "elastiques", niveau: 0, contre: [], met: 4 },
  { nom: "Rowing haltère", muscles: "Dos, biceps", groupe: "haut-pull", equip: "halteres", niveau: 0, contre: ["dos"], met: 5, charge: 0.2, haltere: true },
  { nom: "Rowing kettlebell", muscles: "Dos, biceps", groupe: "haut-pull", equip: "kettlebell", niveau: 0, contre: ["dos"], met: 5, charge: 0.2 },
  { nom: "Tractions", muscles: "Dos, biceps", groupe: "haut-pull", equip: "barre", niveau: 2, contre: ["epaule"], met: 6 },
  { nom: "Tirage vertical", muscles: "Dos", groupe: "haut-pull", equip: "salle", niveau: 0, contre: [], met: 5, charge: 0.5 },
  { nom: "Squat poids du corps", muscles: "Quadriceps, fessiers", groupe: "bas", equip: "aucun", niveau: 0, contre: ["genou"], met: 5 },
  { nom: "Squat goblet", muscles: "Quadriceps, fessiers", groupe: "bas", equip: "halteres", niveau: 0, contre: ["genou"], met: 5.5, charge: 0.25 },
  { nom: "Goblet squat kettlebell", muscles: "Quadriceps, fessiers", groupe: "bas", equip: "kettlebell", niveau: 0, contre: ["genou"], met: 5.5, charge: 0.25 },
  { nom: "Swing kettlebell", muscles: "Fessiers, ischios, dos", groupe: "bas", equip: "kettlebell", niveau: 1, contre: ["dos"], met: 8, charge: 0.2 },
  { nom: "Squat barre", muscles: "Jambes", groupe: "bas", equip: "barre", niveau: 1, contre: ["genou", "dos"], met: 6, charge: 0.6 },
  { nom: "Pont fessier", muscles: "Fessiers, ischios", groupe: "bas", equip: "aucun", niveau: 0, contre: [], met: 4 },
  { nom: "Pont fessier sur ballon", muscles: "Fessiers, ischios", groupe: "bas", equip: "ballon", niveau: 1, contre: [], met: 4 },
  { nom: "Fentes", muscles: "Jambes, équilibre", groupe: "bas", equip: "aucun", niveau: 0, contre: ["genou", "cheville"], met: 5 },
  { nom: "Presse à cuisses", muscles: "Jambes", groupe: "bas", equip: "salle", niveau: 0, contre: ["genou"], met: 5, charge: 1.2 },
  { nom: "Soulevé de terre roumain", muscles: "Ischios, dos", groupe: "bas", equip: "barre", niveau: 2, contre: ["dos"], met: 6, charge: 0.7 },
  { nom: "Gainage", muscles: "Abdominaux", groupe: "core", equip: "aucun", niveau: 0, contre: ["epaule", "poignet"], met: 3.5 },
  { nom: "Crunch inversé", muscles: "Abdominaux", groupe: "core", equip: "aucun", niveau: 0, contre: [], met: 3.5 },
  { nom: "Crunch sur ballon", muscles: "Abdominaux", groupe: "core", equip: "ballon", niveau: 0, contre: [], met: 3.5 },
  { nom: "Marche rapide / vélo", muscles: "Cardio", groupe: "cardio", equip: "aucun", niveau: 0, contre: [], met: 3.5 },
  { nom: "Burpees", muscles: "Full body", groupe: "cardio", equip: "aucun", niveau: 1, contre: ["genou", "epaule", "poignet"], met: 9 },
  { nom: "Corde à sauter", muscles: "Cardio, mollets", groupe: "cardio", equip: "corde", niveau: 0, contre: ["cheville", "genou"], met: 10 },
  { nom: "Wall ball (ballon lesté)", muscles: "Full body, cardio", groupe: "cardio", equip: "ballon", niveau: 1, contre: ["genou", "epaule"], met: 8 },
  { nom: "Rameur", muscles: "Cardio, dos", groupe: "cardio", equip: "cardio", niveau: 0, contre: ["dos"], met: 7 },
];

const NIVEAU_IDX: Record<Niveau, number> = { debutant: 0, intermediaire: 1, avance: 2 };
const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const ORDRE_MORPHO: Morphologie[] = ["ectomorphe", "mesomorphe", "endomorphe"];
/** Morphologie dominante : deux profils opposés se compensent (standard). */
function dominante(m: Morphologie[]): Morphologie {
  const e = m.includes("ectomorphe");
  const d = m.includes("endomorphe");
  return e && !d ? "ectomorphe" : d && !e ? "endomorphe" : "mesomorphe";
}

export const NOTE_MORPHO: Record<Morphologie, string> = {
  ectomorphe: "Ectomorphe : volume réduit, charges lourdes sur mouvements composés, repos longs, cardio limité pour économiser les calories.",
  mesomorphe: "Mésomorphe : volume et intensité standards, bonne récupération, progression rapide.",
  endomorphe: "Endomorphe : répétitions plus hautes, repos courts, séances en circuit et finisseur cardio pour augmenter la dépense.",
};
export function noteMorpho(p: Profil): string {
  return ORDRE_MORPHO.filter((m) => p.morphologies.includes(m)).map((m) => NOTE_MORPHO[m]).join(" ");
}

const moy = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);

export function analyser(p: Profil): Analyse {
  const m = p.taille / 100;
  const imc = p.poids / (m * m);
  const bmr = 10 * p.poids + 6.25 * p.taille - 5 * p.age + (p.sexe === "H" ? 5 : -161);
  const tdee = bmr * p.activite;
  const facteur: Record<Objectif, number> = { perte: 0.82, muscle: 1.1, performance: 1, reprise: 0.95, explosivite: 1.05, maintien: 1 };
  const ajust: Record<Morphologie, number> = { ectomorphe: 1.05, mesomorphe: 1, endomorphe: 0.95 };
  const plancher = p.sexe === "H" ? 1500 : 1200;
  const kcal = Math.round(
    Math.max(plancher, tdee * moy(p.objectifs.map((o) => facteur[o])) * moy(p.morphologies.map((x) => ajust[x]))),
  );
  const proteines = Math.round(p.poids * (p.objectifs.some((o) => o === "muscle" || o === "perte") ? 2 : 1.6));
  const lipides = Math.round(p.poids * 0.9);
  const glucides = Math.max(0, Math.round((kcal - proteines * 4 - lipides * 9) / 4));
  const split = p.jours <= 3 ? "Full body" : p.jours === 4 ? "Haut / Bas" : "Push / Pull / Legs";
  const avisMedical = p.pathologies.length > 0 || imc >= 35 || imc < 17 || p.age >= 60;
  return {
    imc: Math.round(imc * 10) / 10, bmr: Math.round(bmr), tdee: Math.round(tdee), kcal,
    macros: { proteines, lipides, glucides }, split, rpeMax: avisMedical ? 6 : 9, avisMedical,
  };
}

function scheme(p: Profil): { series: number; reps: string; repos: number } {
  const obj = p.objectifs[0] ?? "maintien";
  const dom = dominante(p.morphologies);
  const base = p.niveau === "debutant" ? 3 : 4;
  const s = base - (dom === "ectomorphe" && p.niveau !== "debutant" ? 1 : 0);
  let r: { series: number; reps: string; repos: number };
  switch (obj) {
    case "perte": r = { series: s, reps: "12-15", repos: 40 }; break;
    case "muscle": r = { series: s, reps: "8-12", repos: 90 }; break;
    case "performance": r = { series: s + 1, reps: "4-6", repos: 150 }; break;
    case "explosivite": r = { series: s, reps: "5 explosives", repos: 120 }; break;
    case "reprise": r = { series: 2, reps: "10-12", repos: 75 }; break;
    default: r = { series: 3, reps: "10-12", repos: 60 };
  }
  const force = obj === "muscle" || obj === "maintien";
  if (dom === "ectomorphe") r = { ...r, repos: r.repos + 30, reps: force ? "6-10" : r.reps };
  else if (dom === "endomorphe") r = { ...r, repos: Math.max(30, r.repos - 20), reps: force ? "12-15" : r.reps };
  return r;
}

/** Exercices utilisables : équipement, niveau, blessures. */
export function filtrerExercices(p: Profil): Exo[] {
  const lvl = NIVEAU_IDX[p.niveau];
  const dispo = new Set<Equipement>(["aucun", ...p.equipement]);
  return CATALOGUE.filter((e) => dispo.has(e.equip) && e.niveau <= lvl && !e.contre.some((z) => p.blessures.includes(z)));
}

function estimerCharge(e: Exo, p: Profil): string | undefined {
  if (!e.charge) return undefined;
  const lvl = { debutant: 0.6, intermediaire: 0.8, avance: 1 }[p.niveau];
  const pas = e.haltere ? 1 : 2.5;
  const kg = Math.max(pas, Math.round((e.charge * p.poids * lvl * (p.sexe === "F" ? 0.65 : 1)) / pas) * pas);
  return `≈ ${kg} kg${e.haltere ? " / haltère" : ""}`;
}

export function genererProgramme(p: Profil): SeanceProg[] {
  const dispos = filtrerExercices(p);
  const sc = scheme(p);
  const dom = dominante(p.morphologies);
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
  const cardio =
    dom === "endomorphe"
      ? !p.objectifs.every((o) => o === "reprise")
      : dom === "ectomorphe"
        ? p.objectifs.includes("perte")
        : p.objectifs.some((o) => ["perte", "performance", "explosivite"].includes(o));

  return Array.from({ length: p.jours }, (_, i) => {
    const plan = plans[i % plans.length]!;
    const tour = Math.floor(i / plans.length);
    const choisis: Exo[] = [];
    plan.groupes.forEach((g, gi) => {
      for (const e of pick(g, 1 + Math.floor(par / 4), gi + tour)) if (!choisis.includes(e)) choisis.push(e);
    });
    const liste = choisis.slice(0, par);
    if (cardio) {
      const cs = dispos.filter((e) => e.groupe === "cardio");
      const forts = cs.filter((e) => e.met >= 7);
      const pool = p.objectifs[0] === "perte" && forts.length ? forts : cs;
      const c = pool[(i + tour) % Math.max(1, pool.length)];
      if (c) liste.push(c);
    }
    const exercices = liste.map<ExerciceProg>((e) => {
      const isCardio = e.groupe === "cardio";
      const minutes = isCardio ? 10 : (sc.series * (40 + sc.repos)) / 60;
      const charge = estimerCharge(e, p);
      return {
        nom: e.nom,
        muscles: e.muscles,
        series: isCardio ? 1 : sc.series,
        reps: isCardio ? "10 min" : e.nom === "Gainage" ? "30-45 s" : sc.reps,
        repos: isCardio ? 0 : sc.repos,
        kcal: Math.round((e.met * p.poids * minutes) / 60),
        ...(charge ? { charge } : {}),
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

/** Adaptation quotidienne par règles (utilisée aussi si l'IA est indisponible). */
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
type TypeRepas = "petit-dej" | "dejeuner" | "collation" | "diner";
type Rayon = "Fruits & légumes" | "Viandes & poissons" | "Produits laitiers & œufs" | "Épicerie" | "Boulangerie";
type Unite = "g" | "ml" | "pcs";
interface Ing { n: string; q: number; u: Unite; r: Rayon }

const F: Rayon = "Fruits & légumes", V: Rayon = "Viandes & poissons", L: Rayon = "Produits laitiers & œufs", E: Rayon = "Épicerie", B: Rayon = "Boulangerie";
const I = (n: string, q: number, u: Unite, r: Rayon): Ing => ({ n, q, u, r });

interface Recette {
  nom: string;
  repas: TypeRepas;
  style?: "sucre" | "sale";
  kcal: number;
  p: number;
  g: number;
  l: number;
  ing: Ing[];
  regime: "vegan" | "vegetarien" | "pescetarien" | "omnivore";
  allergenes: Allergie[];
}

const RECETTES: Recette[] = [
  { nom: "Flocons d'avoine, banane et purée d'amande", repas: "petit-dej", style: "sucre", kcal: 450, p: 15, g: 62, l: 14, regime: "vegan", allergenes: ["gluten"],
    ing: [I("Flocons d'avoine", 70, "g", E), I("Banane", 1, "pcs", F), I("Purée d'amande", 15, "g", E), I("Boisson végétale", 200, "ml", E)] },
  { nom: "Omelette 3 œufs, pain complet et fruit", repas: "petit-dej", style: "sale", kcal: 480, p: 28, g: 40, l: 22, regime: "vegetarien", allergenes: ["gluten", "oeufs"],
    ing: [I("Œufs", 3, "pcs", L), I("Pain complet", 80, "g", B), I("Fruit de saison", 1, "pcs", F)] },
  { nom: "Skyr, fruits rouges et granola", repas: "petit-dej", style: "sucre", kcal: 400, p: 30, g: 48, l: 9, regime: "vegetarien", allergenes: ["lactose", "gluten"],
    ing: [I("Skyr", 250, "g", L), I("Fruits rouges", 100, "g", F), I("Granola", 40, "g", E)] },
  { nom: "Porridge protéiné soja et fruits", repas: "petit-dej", style: "sucre", kcal: 430, p: 25, g: 55, l: 12, regime: "vegan", allergenes: ["gluten", "soja"],
    ing: [I("Flocons d'avoine", 60, "g", E), I("Lait de soja", 250, "ml", E), I("Protéine végétale", 25, "g", E), I("Fruits", 100, "g", F)] },
  { nom: "Tofu brouillé, avocat et patate douce", repas: "petit-dej", style: "sale", kcal: 460, p: 26, g: 42, l: 22, regime: "vegan", allergenes: ["soja"],
    ing: [I("Tofu", 150, "g", L), I("Avocat", 0.5, "pcs", F), I("Patate douce", 150, "g", F), I("Curcuma", 2, "g", E)] },
  { nom: "Smoothie bowl banane, protéine de pois et graines", repas: "petit-dej", style: "sucre", kcal: 420, p: 28, g: 50, l: 12, regime: "vegan", allergenes: [],
    ing: [I("Banane", 1, "pcs", F), I("Protéine de pois", 30, "g", E), I("Graines de chia", 15, "g", E), I("Boisson végétale", 250, "ml", E)] },
  { nom: "Tartines avocat et œuf", repas: "petit-dej", style: "sale", kcal: 470, p: 20, g: 42, l: 24, regime: "vegetarien", allergenes: ["gluten", "oeufs"],
    ing: [I("Pain complet", 90, "g", B), I("Avocat", 0.5, "pcs", F), I("Œufs", 2, "pcs", L)] },
  { nom: "Tartines saumon fumé et fromage frais", repas: "petit-dej", style: "sale", kcal: 440, p: 27, g: 38, l: 20, regime: "pescetarien", allergenes: ["gluten", "lactose", "poisson"],
    ing: [I("Pain complet", 90, "g", B), I("Saumon fumé", 70, "g", V), I("Fromage frais", 40, "g", L)] },
  { nom: "Poulet, riz basmati et brocoli", repas: "dejeuner", kcal: 650, p: 50, g: 70, l: 15, regime: "omnivore", allergenes: [],
    ing: [I("Blanc de poulet", 150, "g", V), I("Riz basmati (cru)", 80, "g", E), I("Brocoli", 200, "g", F), I("Huile d'olive", 10, "ml", E)] },
  { nom: "Bowl thon, quinoa et avocat", repas: "dejeuner", kcal: 620, p: 42, g: 55, l: 22, regime: "pescetarien", allergenes: ["poisson"],
    ing: [I("Thon (boîte)", 120, "g", E), I("Quinoa (cru)", 70, "g", E), I("Avocat", 0.5, "pcs", F), I("Tomates", 150, "g", F)] },
  { nom: "Curry de pois chiches, riz et épinards", repas: "dejeuner", kcal: 600, p: 24, g: 88, l: 16, regime: "vegan", allergenes: [],
    ing: [I("Pois chiches (cuits)", 200, "g", E), I("Riz (cru)", 80, "g", E), I("Épinards", 150, "g", F), I("Lait de coco", 100, "ml", E), I("Curry", 3, "g", E)] },
  { nom: "Pâtes complètes, tofu sauté et légumes", repas: "dejeuner", kcal: 620, p: 35, g: 78, l: 17, regime: "vegan", allergenes: ["gluten", "soja"],
    ing: [I("Pâtes complètes (crues)", 90, "g", E), I("Tofu", 150, "g", L), I("Poivrons", 150, "g", F), I("Courgettes", 150, "g", F)] },
  { nom: "Salade de lentilles, feta et légumes", repas: "dejeuner", kcal: 580, p: 30, g: 65, l: 20, regime: "vegetarien", allergenes: ["lactose"],
    ing: [I("Lentilles (cuites)", 200, "g", E), I("Feta", 60, "g", L), I("Concombre", 100, "g", F), I("Tomates", 100, "g", F)] },
  { nom: "Fromage blanc et amandes", repas: "collation", kcal: 220, p: 22, g: 12, l: 9, regime: "vegetarien", allergenes: ["lactose"],
    ing: [I("Fromage blanc", 200, "g", L), I("Amandes", 20, "g", E)] },
  { nom: "Banane et poignée de noix", repas: "collation", kcal: 240, p: 5, g: 30, l: 12, regime: "vegan", allergenes: [],
    ing: [I("Banane", 1, "pcs", F), I("Noix", 25, "g", E)] },
  { nom: "Houmous et bâtonnets de légumes", repas: "collation", kcal: 200, p: 8, g: 20, l: 10, regime: "vegan", allergenes: [],
    ing: [I("Houmous", 60, "g", F), I("Carottes", 100, "g", F), I("Concombre", 100, "g", F)] },
  { nom: "Saumon, patate douce et haricots verts", repas: "diner", kcal: 620, p: 40, g: 55, l: 24, regime: "pescetarien", allergenes: ["poisson"],
    ing: [I("Pavé de saumon", 140, "g", V), I("Patate douce", 200, "g", F), I("Haricots verts", 150, "g", F)] },
  { nom: "Dinde, quinoa et légumes rôtis", repas: "diner", kcal: 560, p: 46, g: 52, l: 14, regime: "omnivore", allergenes: [],
    ing: [I("Escalope de dinde", 150, "g", V), I("Quinoa (cru)", 70, "g", E), I("Légumes à rôtir", 250, "g", F)] },
  { nom: "Chili sin carne et riz", repas: "diner", kcal: 580, p: 26, g: 90, l: 12, regime: "vegan", allergenes: [],
    ing: [I("Haricots rouges (cuits)", 200, "g", E), I("Tomates concassées", 200, "g", E), I("Maïs", 80, "g", E), I("Riz (cru)", 80, "g", E)] },
  { nom: "Gratin d'œufs, épinards et pommes de terre", repas: "diner", kcal: 540, p: 28, g: 50, l: 24, regime: "vegetarien", allergenes: ["oeufs", "lactose"],
    ing: [I("Œufs", 3, "pcs", L), I("Épinards", 150, "g", F), I("Pommes de terre", 250, "g", F), I("Fromage râpé", 30, "g", L)] },
];

const RANG = { vegan: 0, vegetarien: 1, pescetarien: 2, omnivore: 3 } as const;
const RANG_REGIME: Record<Regime, number> = { vegan: 0, vegetarien: 1, pescetarien: 2, omnivore: 3, flexitarien: 3, halal: 3 };
const STRUCTURE: Record<3 | 4 | 5, [TypeRepas, number][]> = {
  3: [["petit-dej", 0.3], ["dejeuner", 0.4], ["diner", 0.3]],
  4: [["petit-dej", 0.25], ["dejeuner", 0.35], ["collation", 0.1], ["diner", 0.3]],
  5: [["petit-dej", 0.25], ["dejeuner", 0.3], ["collation", 0.1], ["collation", 0.1], ["diner", 0.25]],
};
export const LABEL_REPAS: Record<TypeRepas, string> = { "petit-dej": "Petit-déjeuner", dejeuner: "Déjeuner", collation: "Collation", diner: "Dîner" };
export const RAYONS: Rayon[] = [F, V, L, B, E];

export interface RepasPlan {
  repas: TypeRepas;
  nom: string;
  portion: number;
  kcal: number;
  p: number;
  g: number;
  l: number;
  ingredients: { n: string; q: number; u: Unite }[];
}
export interface JourNutrition { jour: string; repas: RepasPlan[]; kcal: number }
export interface PlanNutrition {
  jours: JourNutrition[];
  courses: { rayon: Rayon; items: { n: string; q: number; u: Unite }[] }[];
  eau: number;
  manque: string[];
}

export const fmtQ = (x: { q: number; u: Unite }) =>
  x.u === "pcs" ? `${Math.round(x.q * 2) / 2 || 0.5}` : `${x.q} ${x.u}`;

export function genererNutrition(p: Profil, a: Analyse): PlanNutrition {
  const manque: string[] = [];
  const base = RECETTES.filter(
    (r) => RANG[r.regime] <= RANG_REGIME[p.regime] && !r.allergenes.some((x) => p.allergies.includes(x)),
  );
  const pool = (t: TypeRepas): Recette[] => {
    let l = base.filter((r) => r.repas === t);
    if (t === "petit-dej" && p.petitDej !== "indifferent") {
      const f = l.filter((r) => r.style === p.petitDej);
      if (f.length) l = f;
      else if (l.length) manque.push(`Aucun petit-déjeuner ${p.petitDej === "sale" ? "salé" : "sucré"} compatible : recettes de l'autre style proposées.`);
    }
    if (l.length === 0) manque.push(`Aucune recette compatible pour : ${LABEL_REPAS[t]}.`);
    return l;
  };
  const pools = { "petit-dej": pool("petit-dej"), dejeuner: pool("dejeuner"), collation: pool("collation"), diner: pool("diner") };
  const struct = STRUCTURE[p.repasParJour];
  const achats = new Map<Rayon, Map<string, { q: number; u: Unite }>>();

  const jours = JOURS.map<JourNutrition>((jour, i) => {
    const seen: Partial<Record<TypeRepas, number>> = {};
    const repas: RepasPlan[] = [];
    for (const [t, part] of struct) {
      const l = pools[t];
      const k = seen[t] ?? 0;
      seen[t] = k + 1;
      const r = l[(i + k) % Math.max(1, l.length)];
      if (!r) continue;
      const portion = Math.min(1.8, Math.max(0.6, Math.round(((a.kcal * part) / r.kcal) * 10) / 10));
      const ingredients = r.ing.map((x) => ({ n: x.n, u: x.u, q: x.u === "pcs" ? Math.round(x.q * portion * 2) / 2 : Math.round((x.q * portion) / 5) * 5 }));
      r.ing.forEach((x, j) => {
        const m = achats.get(x.r) ?? new Map<string, { q: number; u: Unite }>();
        const cur = m.get(x.n) ?? { q: 0, u: x.u };
        cur.q += ingredients[j]!.q;
        m.set(x.n, cur);
        achats.set(x.r, m);
      });
      repas.push({
        repas: t, nom: r.nom, portion, ingredients,
        kcal: Math.round(r.kcal * portion), p: Math.round(r.p * portion), g: Math.round(r.g * portion), l: Math.round(r.l * portion),
      });
    }
    return { jour, repas, kcal: repas.reduce((s, x) => s + x.kcal, 0) };
  });

  const courses = RAYONS.filter((r) => achats.has(r)).map((rayon) => ({
    rayon,
    items: [...achats.get(rayon)!.entries()]
      .map(([n, v]) => ({ n, q: v.u === "pcs" ? Math.ceil(v.q) : v.q, u: v.u }))
      .sort((x, y) => x.n.localeCompare(y.n, "fr")),
  }));
  return { jours, courses, eau: Math.round(p.poids * 0.033 * 10) / 10, manque };
}
