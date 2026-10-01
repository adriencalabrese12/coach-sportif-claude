import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

/** Gabarit des pages de contenu : en-tête, <main> texte lisible, pied de page. */
export function PageShell({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className={`mx-auto px-4 pb-20 pt-28 sm:px-6 ${wide ? "max-w-6xl" : "max-w-3xl"}`}>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function CtaAbonnement() {
  return (
    <aside className="mt-12 rounded-2xl border border-primary/40 bg-card p-6 text-center">
      <p className="font-display text-3xl">Prêt à t'entraîner avec un programme adapté ?</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Séances détaillées, exercices et suivi, sans engagement.
      </p>
      <a
        href="/#tarifs"
        className="mt-4 inline-flex min-h-12 items-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground"
      >
        Voir les abonnements
      </a>
    </aside>
  );
}
