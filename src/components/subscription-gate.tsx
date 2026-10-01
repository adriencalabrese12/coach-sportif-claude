import { Link } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { PLANS, type PlanId } from "@/lib/plans";

/**
 * Garde de route (côté interface) : redirige vers /connexion ou affiche l'invitation à s'abonner.
 * Les données protégées restent de toute façon refusées par les server functions et la RLS.
 */
export function SubscriptionGate({ min, activating, children }: { min: PlanId; activating?: boolean; children: ReactNode }) {
  const sub = useSubscription({ poll: activating });

  useEffect(() => {
    if (sub.session === null) window.location.replace("/connexion");
  }, [sub.session]);

  if (sub.loading || sub.session === null) {
    return (
      <main className="grid min-h-screen place-items-center p-12 text-muted-foreground" aria-busy="true">
        Chargement…
      </main>
    );
  }
  if (sub.error) {
    return (
      <main role="alert" className="grid min-h-screen place-items-center p-12 text-center text-destructive">
        Impossible de vérifier ton abonnement. Recharge la page.
      </main>
    );
  }
  if (activating && !sub.active) {
    return (
      <main role="status" aria-busy="true" className="grid min-h-screen place-items-center p-12 text-center text-muted-foreground">
        Paiement reçu : activation de ton abonnement en cours…
      </main>
    );
  }
  if (!sub.has(min)) {
    const needed = PLANS.find((p) => p.id === min)!;
    return (
      <main className="mx-auto grid min-h-screen max-w-md place-items-center px-4 text-center">
        <div className="rounded-2xl border border-primary/40 bg-card p-8">
          <Lock aria-hidden="true" className="mx-auto size-8 text-primary" />
          <h1 className="mt-4 font-display text-4xl">Réservé aux abonnés</h1>
          <p className="mt-3 text-muted-foreground">
            {sub.active
              ? `Cette fonctionnalité demande l'offre ${needed.name} ou supérieure.`
              : "Abonne-toi pour accéder aux séances, aux exercices et au suivi."}
          </p>
          <a
            href="/#tarifs"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Voir les abonnements
          </a>
          <Link to="/" className="mt-3 block min-h-11 py-3 text-sm text-muted-foreground hover:text-primary">
            ← Accueil
          </Link>
        </div>
      </main>
    );
  }
  return <>{children}</>;
}
