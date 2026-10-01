import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PLAN_RANK } from "@/lib/plans";
import { requirePlan } from "@/lib/stripe.server";
import { adapterSeance, analyser, genererNutrition, genererProgramme } from "@/lib/coach.server";
import { bibliotheque, construireProgramme } from "@/lib/seances.server";
import type { Profil } from "@/lib/coach";

/**
 * Tout le contenu payant passe par ici : l'abonnement est vérifié côté serveur
 * (service role) avant de renvoyer séances, exercices, analyse ou nutrition.
 */

const semaineSchema = z.object({
  objectif: z.enum(["perte", "masse", "forme", "endurance"]),
  niveau: z.enum(["debutant", "intermediaire", "avance"]),
  jours: z.number().int().min(2).max(6),
});

export const getSemaine = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => semaineSchema.parse(d))
  .handler(async ({ data, context }) => {
    await requirePlan(context.userId, "decouverte");
    return construireProgramme(data.objectif, data.niveau, data.jours);
  });

export const getBibliotheque = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requirePlan(context.userId, "decouverte");
    return bibliotheque();
  });

const profilSchema = z.object({
  regime: z.enum(["omnivore", "vegetarien", "vegan"]),
  allergies: z.array(z.enum(["gluten", "lactose", "oeufs", "arachides", "poisson"])).max(5),
  morphologie: z.enum(["ectomorphe", "mesomorphe", "endomorphe"]),
  prenom: z.string().max(60),
  sexe: z.enum(["H", "F"]),
  age: z.number().int().min(14).max(100),
  taille: z.number().min(120).max(230),
  poids: z.number().min(30).max(250),
  objectif: z.enum(["perte", "muscle", "performance", "reprise", "explosivite", "maintien"]),
  niveau: z.enum(["debutant", "intermediaire", "avance"]),
  jours: z.number().int().min(2).max(6),
  duree: z.number().int().min(15).max(120),
  equipement: z.array(z.enum(["aucun", "halteres", "elastiques", "barre", "salle", "cardio"])).max(6),
  blessures: z.array(z.enum(["epaule", "genou", "dos", "poignet", "cheville"])).max(5),
  pathologies: z.array(z.string().max(60)).max(10),
  activite: z.union([z.literal(1.2), z.literal(1.375), z.literal(1.55), z.literal(1.725)]),
});

/** Questionnaire détaillé (Essentiel+) ; la nutrition est réservée au Premium. */
export const calculerPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => profilSchema.parse(d))
  .handler(async ({ data, context }) => {
    const plan = await requirePlan(context.userId, "essentiel");
    const p: Profil = data;
    const analyse = analyser(p);
    return {
      analyse,
      programme: genererProgramme(p),
      nutrition: PLAN_RANK[plan] >= PLAN_RANK.premium ? genererNutrition(p, analyse) : null,
    };
  });

const checkinSchema = z.object({
  profil: profilSchema,
  checkin: z.object({
    fatigue: z.number().min(1).max(5),
    sommeil: z.number().min(0).max(24),
    temps: z.number().min(0).max(300),
    douleur: z.enum(["epaule", "genou", "dos", "poignet", "cheville"]).optional(),
  }),
});

/** Adaptation de la séance du jour par règles de sécurité (Premium). */
export const appliquerCheckin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => checkinSchema.parse(d))
  .handler(async ({ data, context }) => {
    await requirePlan(context.userId, "premium");
    const [premiere] = genererProgramme(data.profil);
    if (!premiere) throw new Error("Aucune séance à adapter.");
    return adapterSeance(premiere, data.checkin, data.profil);
  });
