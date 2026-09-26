import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const inputSchema = z.object({
  seance: z.unknown(),
  checkin: z.object({
    fatigue: z.number().min(1).max(5),
    sommeil: z.number().min(0).max(24),
    temps: z.number().min(0).max(300),
    douleur: z.string().max(200).nullable().optional(),
    envie: z.enum(["full body", "haut", "jambes", "cardio"]).nullable().optional(),
  }),
});

const SYSTEM = `Tu es un coach sportif expert. Tu adaptes la séance du jour au check-in de l'utilisateur.
Règles obligatoires :
- Si fatigue >= 4 OU sommeil < 6 h : réduire le volume de 30 % (séries et/ou répétitions).
- Si une douleur est signalée sur une zone : retirer tous les exercices qui sollicitent cette zone (les remplacer si possible par des exercices qui ne la sollicitent pas).
- Si le temps disponible est inférieur à la durée prévue : condenser la séance (moins d'exercices, superséries, repos réduits) pour tenir dans le temps.
- Tenir compte de l'envie (full body / haut / jambes / cardio) quand c'est compatible avec les règles.
Conserve exactement la même structure JSON que la séance reçue.
Réponds UNIQUEMENT avec un objet JSON : {"seance": <séance adaptée>, "justification": "<2-3 phrases courtes en français>"}`;

export const adapterSeance = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Configuration IA manquante");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        store: false,
        reasoning: { effort: "low" },
        text: { format: { type: "json_object" } },
        instructions: SYSTEM,
        input: `Séance du jour :\n${JSON.stringify(data.seance)}\n\nCheck-in :\n${JSON.stringify(data.checkin)}`,
      }),
    });

    if (!res.ok || !res.body) {
      if (res.status === 429) throw new Error("Trop de requêtes, réessaie dans un instant.");
      if (res.status === 402) throw new Error("Crédits IA insuffisants.");
      throw new Error(`Erreur IA (${res.status})`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const evt = JSON.parse(payload) as { type?: string; delta?: string };
          if (evt.type === "response.output_text.delta" && evt.delta) text += evt.delta;
        } catch {
          /* ignore */
        }
      }
    }

    let parsed: { seance?: unknown; justification?: string };
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("Réponse IA invalide");
    }
    return {
      seance: parsed.seance ?? data.seance,
      justification: String(parsed.justification ?? ""),
    };
  });
