import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { isPlanId, PLAN_RANK, type PlanId } from "@/lib/plans";

/**
 * Statut d'abonnement pour l'interface (lecture RLS de sa propre ligne).
 * Ce n'est qu'un confort d'affichage : l'accès réel est contrôlé côté serveur.
 */
export function useSubscription() {
  const session = useSession();
  const userId = session?.user.id;
  const q = useQuery({
    enabled: !!userId,
    queryKey: ["subscription", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("plan,status")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const active = q.data?.status === "active" || q.data?.status === "trialing";
  const plan: PlanId | null = active && isPlanId(q.data?.plan) ? q.data.plan : null;
  return {
    session,
    loading: session === undefined || (!!userId && q.isPending),
    error: q.isError,
    plan,
    active: plan !== null,
    has: (min: PlanId) => plan !== null && PLAN_RANK[plan] >= PLAN_RANK[min],
  };
}
