import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, Check, Star, ChevronRight, Dumbbell, Flame, HeartPulse, Lock, Target, Zap } from "lucide-react";
import heroImage from "@/assets/hero-coach.webp";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { FAQ } from "@/content/faq";
import { landingJsonLd } from "@/lib/jsonld";
import { PLANS } from "@/lib/plans";
import { useSubscription } from "@/hooks/use-subscription";
import { getAvisPublies } from "@/lib/reviews.functions";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/")({
  loader: () => getAvisPublies(),
  head: ({ loaderData }) =>
    pageHead({
      title: "Coach sportif personnalisé en ligne — Programme d'entraînement sur mesure | Coach.Pro",
      description:
        "Coach sportif en ligne : génère un programme d'entraînement personnalisé (perte de poids, prise de masse, remise en forme, endurance) selon ton niveau et tes jours disponibles.",
      path: "/",
      jsonLd: [landingJsonLd(loaderData?.stats)],
    }),
  component: Index,
});

type Objectif = "perte" | "masse" | "forme" | "endurance";
type Niveau = "debutant" | "intermediaire" | "avance";

const OBJECTIFS: { id: Objectif; label: string; icon: typeof Flame; desc: string }[] = [
  { id: "perte", label: "Perte de poids", icon: Flame, desc: "Brûler un maximum de calories" },
  { id: "masse", label: "Prise de masse", icon: Dumbbell, desc: "Développer ta musculature" },
  { id: "forme", label: "Remise en forme", icon: HeartPulse, desc: "Retrouver énergie et tonus" },
  { id: "endurance", label: "Endurance", icon: Zap, desc: "Améliorer ton cardio" },
];

const NIVEAUX: { id: Niveau; label: string }[] = [
  { id: "debutant", label: "Débutant" },
  { id: "intermediaire", label: "Intermédiaire" },
  { id: "avance", label: "Avancé" },
];

const ETAPES = [
  {
    n: "01",
    t: "Choisis ton objectif",
    d: "Perte de poids, prise de masse, remise en forme ou endurance : ton programme part de ce que tu veux atteindre.",
  },
  {
    n: "02",
    t: "Indique ton niveau et ta disponibilité",
    d: "Débutant, intermédiaire ou avancé, de 2 à 6 jours par semaine. Le volume et les repos s'ajustent.",
  },
  {
    n: "03",
    t: "Reçois ta semaine type",
    d: "Séances détaillées avec exercices, séries, répétitions et temps de repos, prêtes à suivre.",
  },
];

const eyebrow = "mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-primary";
const h2 = "font-display text-[clamp(40px,6vw,60px)] leading-none";
const label = "mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground first:mt-0";

function Index() {
  const { avis, stats } = Route.useLoaderData();
  const sub = useSubscription();
  const [objectif, setObjectif] = useState<Objectif>("forme");
  const [niveau, setNiveau] = useState<Niveau>("debutant");
  const [jours, setJours] = useState(3);
  const [genere, setGenere] = useState(false);

  const resume = `${OBJECTIFS.find((o) => o.id === objectif)!.label} · ${NIVEAUX.find((n) => n.id === niveau)!.label} · ${jours} jours`;
  const reset = () => setGenere(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative flex min-h-[90vh] items-center overflow-hidden pt-20">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Athlète s'entraînant avec un programme de coach sportif personnalisé"
              className="size-full object-cover object-center opacity-50"
              width={1600}
              height={1024}
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
          </div>
          <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <Activity aria-hidden="true" className="size-3.5" />
              Ton entraînement, tes règles
            </p>
            <h1 className="font-display text-[clamp(56px,9vw,96px)] leading-[0.95]">
              Coach sportif en ligne
              <br />
              <span className="text-primary">100% personnalisé</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Choisis ton objectif, ton niveau et tes jours dispo : obtiens un programme d'entraînement
              hebdomadaire complet avec exercices, séries et temps de repos.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/questionnaire"
                className="glow-primary inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105"
              >
                Générer mon programme
                <ChevronRight aria-hidden="true" className="size-4" />
              </a>
              <a
                href="#tarifs"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-semibold transition-colors hover:border-primary/50"
              >
                Voir les tarifs
              </a>
            </div>
            <dl className="mt-12 flex flex-wrap gap-8 text-sm">
              {[
                ["4", "Objectifs ciblés"],
                ["24", "Séances types"],
                ["2 à 6", "Jours par semaine"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dd className="font-display text-3xl text-primary">{v}</dd>
                  <dt className="text-muted-foreground">{l}</dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Générateur */}
        <section id="programme" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
          <div className="mb-10">
            <p className={eyebrow}>
              <Target aria-hidden="true" className="size-4" /> Générateur
            </p>
            <h2 className={h2}>Construis ton programme de musculation et de cardio</h2>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <p className={label} id="lbl-objectif">1. Ton objectif</p>
            <div role="group" aria-labelledby="lbl-objectif" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {OBJECTIFS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={objectif === o.id}
                  onClick={() => { setObjectif(o.id); reset(); }}
                  className={`min-h-11 rounded-xl border p-4 text-left transition-all ${
                    objectif === o.id ? "glow-primary border-primary bg-primary/10" : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  <o.icon aria-hidden="true" className={`mb-2 size-6 ${objectif === o.id ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="font-semibold">{o.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{o.desc}</p>
                </button>
              ))}
            </div>

            <p className={label} id="lbl-niveau">2. Ton niveau</p>
            <div role="group" aria-labelledby="lbl-niveau" className="flex flex-wrap gap-3">
              {NIVEAUX.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  aria-pressed={niveau === n.id}
                  onClick={() => { setNiveau(n.id); reset(); }}
                  className={`min-h-11 rounded-lg border px-5 py-2.5 font-medium transition-all ${
                    niveau === n.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </div>

            <p className={label} id="lbl-jours">3. Jours d'entraînement par semaine</p>
            <div role="group" aria-labelledby="lbl-jours" className="flex flex-wrap items-center gap-3">
              {[2, 3, 4, 5, 6].map((j) => (
                <button
                  key={j}
                  type="button"
                  aria-pressed={jours === j}
                  aria-label={`${j} jours par semaine`}
                  onClick={() => { setJours(j); reset(); }}
                  className={`flex size-12 items-center justify-center rounded-lg border font-display text-xl transition-all ${
                    jours === j ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  {j}
                </button>
              ))}
              <span className="text-sm text-muted-foreground">jours / semaine</span>
            </div>

            <button
              type="button"
              onClick={() => setGenere(true)}
              className="glow-primary mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-display text-2xl tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] sm:w-auto"
            >
              <Zap aria-hidden="true" className="size-5" />
              Générer mon programme
            </button>
          </div>

          {genere && (
            <div role="status" className="glow-primary mt-10 rounded-2xl border border-primary/40 bg-card p-6 text-center sm:p-10">
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-primary">
                <Lock aria-hidden="true" className="size-4" /> Réservé aux abonnés
              </p>
              <h3 className="mt-3 font-display text-4xl">Ton programme est prêt à débloquer</h3>
              <p className="mt-2 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">{resume}</p>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                Les séances détaillées, les exercices, les séries et les temps de repos sont accessibles avec un abonnement.
              </p>
              <a
                href={sub.active ? `/programme?objectif=${objectif}&niveau=${niveau}&jours=${jours}` : "#tarifs"}
                className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105"
              >
                {sub.active ? "Voir ma semaine" : "Voir les abonnements"} <ChevronRight aria-hidden="true" className="size-4" />
              </a>
            </div>
          )}
        </section>

        {/* Méthode */}
        <section id="methode" className="scroll-mt-24 border-t border-border bg-card/50">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className={eyebrow}>Méthode</p>
            <h2 className={h2}>Comment fonctionne ton coach sportif en ligne ?</h2>
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {ETAPES.map((e) => (
                <li key={e.n} className="rounded-2xl border border-border bg-card p-6">
                  <p className="font-display text-4xl text-primary">{e.n}</p>
                  <h3 className="mt-2 text-lg font-semibold">{e.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{e.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Tarifs */}
        <section id="tarifs" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
          <p className={eyebrow}>Tarifs</p>
          <h2 className={h2}>Abonnement coach sportif en ligne</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Séances, exercices et suivi sont réservés aux abonnés. Sans engagement, résiliable à tout moment.
          </p>
          <div className="mt-10 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
            {PLANS.map((p) => (
              <div
                key={p.id}
                className={`flex flex-col rounded-2xl border bg-card p-6 ${p.recommended ? "glow-primary border-primary" : "border-border"}`}
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {p.recommended ? "Recommandé" : p.tag}
                </p>
                <h3 className="mt-1 font-display text-3xl">{p.name}</h3>
                <p className="mt-2">
                  <span className="font-display text-5xl">{p.price}€</span>
                  <span className="text-muted-foreground"> / mois</span>
                </p>
                <ul className="mt-5 flex-1 space-y-3 text-sm">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`/abonnement?plan=${p.id}`}
                  className={`mt-6 inline-flex min-h-12 items-center justify-center rounded-lg px-5 py-3 font-semibold transition-transform hover:scale-105 ${
                    p.recommended ? "bg-primary text-primary-foreground" : "border border-border bg-background"
                  }`}
                >
                  S'abonner<span className="sr-only"> à l'offre {p.name}</span>
                </a>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Paiement sécurisé par Stripe : tes coordonnées bancaires ne transitent jamais par ce site.
          </p>
        </section>

        {/* Avis d'abonnés vérifiés : affichés uniquement s'il en existe de publiés */}
        {stats && avis.length > 0 && (
          <section id="avis" aria-labelledby="h-avis" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className={eyebrow}>Avis</p>
            <h2 id="h-avis" className={h2}>Ce que disent nos abonnés</h2>
            <p className="mt-3 text-muted-foreground">
              Note moyenne : {stats.average}/5 sur {stats.count} avis d'abonnés vérifiés.
            </p>
            <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {avis.map((a) => (
                <li key={a.id} className="rounded-2xl border border-border bg-card p-6">
                  <p className="flex gap-0.5" role="img" aria-label={`Note : ${a.note} sur 5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        aria-hidden="true"
                        className={`size-4 ${n <= a.note ? "fill-primary text-primary" : "text-muted-foreground"}`}
                      />
                    ))}
                  </p>
                  {a.commentaire && <p className="mt-3 text-sm">{a.commentaire}</p>}
                  <p className="mt-3 text-xs text-muted-foreground">
                    {a.auteur ? `${a.auteur} · ` : ""}Avis d'abonné vérifié
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 border-t border-border bg-card/50">
          <div className="mx-auto max-w-[820px] px-4 py-20 sm:px-6">
            <p className={eyebrow}>FAQ</p>
            <h2 className={h2}>Questions fréquentes sur le coaching sportif en ligne</h2>
            <div className="mt-8 space-y-3">
              {FAQ.map((f) => (
                <details key={f.q} className="rounded-xl border border-border bg-card px-5 py-4">
                  <summary className="min-h-6 cursor-pointer text-[17px] font-semibold">{f.q}</summary>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
