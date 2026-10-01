import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { Check, Repeat, Timer } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ReviewDialog } from "@/components/review-dialog";
import { SubscriptionGate } from "@/components/subscription-gate";
import { useSubscription } from "@/hooks/use-subscription";
import { supabase } from "@/integrations/supabase/client";
import { createPortalSession } from "@/lib/billing.functions";
import { getBibliotheque, getSemaine } from "@/lib/contenu.functions";
import { PLANS } from "@/lib/plans";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/programme")({
  validateSearch: z.object({
    abonnement: z.literal("ok").optional().catch(undefined),
    objectif: z.enum(["perte", "masse", "forme", "endurance"]).catch("forme"),
    niveau: z.enum(["debutant", "intermediaire", "avance"]).catch("debutant"),
    jours: z.coerce.number().int().min(2).max(6).catch(3),
  }),
  head: () =>
    pageHead({
      title: "Mon programme — Coach.Pro",
      description: "Espace abonné : tes séances de la semaine et la bibliothèque d'exercices.",
      path: "/programme",
      noindex: true,
    }),
  component: ProgrammePage,
});

const OBJ = { perte: "Perte de poids", masse: "Prise de masse", forme: "Remise en forme", endurance: "Endurance" };
const NIV = { debutant: "Débutant", intermediaire: "Intermédiaire", avance: "Avancé" };

const sel = "min-h-11 rounded-lg border border-input bg-background px-3 py-2";

function ProgrammePage() {
  const { abonnement } = Route.useSearch();
  return (
    <SubscriptionGate min="decouverte" activating={abonnement === "ok"}>
      <Contenu />
    </SubscriptionGate>
  );
}

function Contenu() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const sub = useSubscription();
  const [avis, setAvis] = useState(false);
  const [fait, setFait] = useState<Set<string>>(new Set());
  const [msg, setMsg] = useState<string | null>(null);

  const semaine = useQuery({
    queryKey: ["semaine", search.objectif, search.niveau, search.jours],
    queryFn: () => getSemaine({ data: { objectif: search.objectif, niveau: search.niveau, jours: search.jours } }),
  });
  const biblio = useQuery({ queryKey: ["bibliotheque"], queryFn: () => getBibliotheque() });

  const maj = (patch: Partial<typeof search>) =>
    void navigate({ search: (s) => ({ ...s, abonnement: undefined, ...patch }), replace: true });

  async function terminer(titre: string) {
    setMsg(null);
    const { error } = await supabase.from("session_logs").insert({ seance_titre: titre });
    if (error) return setMsg("Séance non enregistrée. Réessaie dans un instant.");
    setFait((f) => new Set(f).add(titre));
    const { count } = await supabase.from("reviews").select("id", { count: "exact", head: true });
    if (!count) setAvis(true);
  }

  async function portail() {
    setMsg(null);
    try {
      window.location.assign((await createPortalSession()).url);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Portail indisponible.");
    }
  }

  const offre = PLANS.find((p) => p.id === sub.plan);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl">Mon programme</h1>
            {offre && <p className="mt-1 text-sm text-muted-foreground">Offre {offre.name}</p>}
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {sub.has("essentiel") ? (
              <Link to="/questionnaire" className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 hover:border-primary/50">
                Questionnaire détaillé
              </Link>
            ) : (
              <a href="/#tarifs" className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 hover:border-primary/50">
                Passer à Essentiel
              </a>
            )}
            <button onClick={() => void portail()} className="min-h-11 rounded-lg border border-border px-4 hover:border-primary/50">
              Gérer mon abonnement
            </button>
            <button
              onClick={() => void supabase.auth.signOut().then(() => window.location.replace("/"))}
              className="min-h-11 rounded-lg px-4 text-muted-foreground hover:text-primary"
            >
              Se déconnecter
            </button>
          </div>
        </div>
        {msg && <p role="alert" className="mt-4 text-sm text-destructive">{msg}</p>}

        <section aria-labelledby="h-semaine" className="mt-10">
          <h2 id="h-semaine" className="font-display text-4xl">Ta semaine type</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <label className="text-sm">
              <span className="sr-only">Objectif</span>
              <select className={sel} value={search.objectif} onChange={(e) => maj({ objectif: e.target.value as typeof search.objectif })}>
                {Object.entries(OBJ).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <label className="text-sm">
              <span className="sr-only">Niveau</span>
              <select className={sel} value={search.niveau} onChange={(e) => maj({ niveau: e.target.value as typeof search.niveau })}>
                {Object.entries(NIV).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <label className="text-sm">
              <span className="sr-only">Jours par semaine</span>
              <select className={sel} value={search.jours} onChange={(e) => maj({ jours: Number(e.target.value) })}>
                {[2, 3, 4, 5, 6].map((j) => <option key={j} value={j}>{j} jours / semaine</option>)}
              </select>
            </label>
          </div>

          {semaine.isPending && <p role="status" aria-busy="true" className="mt-6 text-muted-foreground">Chargement de tes séances…</p>}
          {semaine.isError && <p role="alert" className="mt-6 text-destructive">Impossible de charger tes séances. Réessaie dans un instant.</p>}
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {semaine.data?.map((s) => (
              <article key={s.jour} className="flex flex-col rounded-2xl border border-border bg-card p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">{s.jour}</p>
                    <h3 className="mt-1 font-display text-2xl leading-tight">{s.titre}</h3>
                    <p className="text-sm text-muted-foreground">{s.focus}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium">
                    <Timer aria-hidden="true" className="size-3.5" />
                    {s.duree}
                  </span>
                </div>
                <ul className="flex-1 space-y-2.5">
                  {s.exercices.map((ex) => (
                    <li key={ex.nom} className="flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-2.5 text-sm">
                      <span className="font-medium">{ex.nom}</span>
                      <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-semibold text-primary">
                          <Repeat aria-hidden="true" className="size-3" />
                          {ex.series}
                        </span>
                        {ex.repos !== "—" && <span>repos {ex.repos}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  disabled={fait.has(s.titre)}
                  onClick={() => void terminer(s.titre)}
                  className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary/50 px-4 text-sm font-semibold text-primary disabled:opacity-60"
                >
                  {fait.has(s.titre) ? <><Check aria-hidden="true" className="size-4" /> Séance enregistrée</> : "Séance terminée"}
                </button>
              </article>
            ))}
          </div>
          <p className="mt-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            Conseil : augmente progressivement les charges ou les répétitions chaque semaine et garde au moins
            un jour de repos complet entre deux séances intenses. En cas de douleur, arrête et consulte un professionnel de santé.
          </p>
        </section>

        <section aria-labelledby="h-biblio" className="mt-16">
          <h2 id="h-biblio" className="font-display text-4xl">Bibliothèque d'exercices</h2>
          {biblio.isPending && <p role="status" className="mt-4 text-muted-foreground">Chargement…</p>}
          {biblio.isError && <p role="alert" className="mt-4 text-destructive">Bibliothèque indisponible pour le moment.</p>}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {biblio.data?.map((ex) => (
              <div key={ex.nom} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-2xl">{ex.nom}</h3>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium">{ex.niveau}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{ex.cible}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
      <ReviewDialog open={avis} onOpenChange={setAvis} />
    </div>
  );
}
