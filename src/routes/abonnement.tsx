import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useSession } from "@/hooks/use-session";
import { createCheckoutSession } from "@/lib/billing.functions";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/abonnement")({
  validateSearch: z.object({ plan: z.enum(["decouverte", "essentiel", "premium"]).catch("essentiel") }),
  head: () =>
    pageHead({
      title: "Abonnement — Coach.Pro",
      description: "Redirection vers le paiement sécurisé Stripe.",
      path: "/abonnement",
      noindex: true,
    }),
  component: Abonnement,
});

/** Reprend le paiement après connexion : redirige vers Stripe Checkout. */
function Abonnement() {
  const { plan } = Route.useSearch();
  const session = useSession();
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (session === undefined) return;
    if (session === null) {
      window.location.replace(`/connexion?plan=${plan}`);
      return;
    }
    let annule = false;
    createCheckoutSession({ data: { plan } })
      .then((r) => {
        if (!annule) window.location.assign(r.url);
      })
      .catch((e: unknown) => {
        if (!annule) setErreur(e instanceof Error ? e.message : "Impossible de lancer le paiement.");
      });
    return () => {
      annule = true;
    };
  }, [session, plan]);

  return (
    <main className="grid min-h-screen place-items-center px-4 text-center" aria-live="polite">
      {erreur ? (
        <div role="alert">
          <p className="text-destructive">{erreur}</p>
          <a href="/#tarifs" className="mt-4 inline-flex min-h-11 items-center text-primary underline">
            Retour aux tarifs
          </a>
        </div>
      ) : (
        <p className="text-muted-foreground">Redirection vers le paiement sécurisé…</p>
      )}
    </main>
  );
}
