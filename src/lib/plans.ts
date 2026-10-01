/** Offres : prix indicatifs d'affichage (le prix réel est celui du Price Stripe). */
export type PlanId = "decouverte" | "essentiel" | "premium";

export const PLAN_RANK: Record<PlanId, number> = { decouverte: 1, essentiel: 2, premium: 3 };

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  tag: string;
  recommended?: boolean;
  items: string[];
}

export const PLANS: Plan[] = [
  {
    id: "decouverte",
    name: "Découverte",
    price: 9,
    tag: "Pour démarrer",
    items: [
      "Programme hebdomadaire selon ton objectif et ton niveau",
      "Séances détaillées : exercices, séries, répétitions, repos",
      "Bibliothèque d'exercices",
      "Sans engagement",
    ],
  },
  {
    id: "essentiel",
    name: "Essentiel",
    price: 19,
    tag: "Pour progresser",
    items: [
      "Tout Découverte",
      "Questionnaire détaillé et analyse de ton profil",
      "Exercices adaptés à ton équipement et à tes blessures",
      "Suivi de progression",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 39,
    tag: "Accompagnement complet",
    recommended: true,
    items: [
      "Tout Essentiel",
      "Plan nutritionnel",
      "Check-in quotidien et séance adaptée",
      "Bilan hebdomadaire et ajustement",
    ],
  },
];

export const isPlanId = (v: unknown): v is PlanId =>
  v === "decouverte" || v === "essentiel" || v === "premium";
