import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export interface AvisPublic {
  id: string;
  note: number;
  commentaire: string | null;
  auteur: string | null;
  date: string;
}

/**
 * Avis réels publiés (après modération) et note moyenne.
 * Aucune donnée fictive : sans avis publié, `stats` vaut null et rien n'est affiché.
 */
export const getAvisPublies = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("id,note,commentaire,auteur,created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error || !data || data.length === 0) return { avis: [] as AvisPublic[], stats: null };
    const avg = data.reduce((a, r) => a + r.note, 0) / data.length;
    return {
      avis: data.slice(0, 6).map<AvisPublic>((r) => ({
        id: r.id,
        note: r.note,
        commentaire: r.commentaire,
        auteur: r.auteur,
        date: r.created_at,
      })),
      stats: { count: data.length, average: Math.round(avg * 10) / 10 },
    };
  } catch (e) {
    console.error("[avis]", e);
    return { avis: [] as AvisPublic[], stats: null };
  }
});
