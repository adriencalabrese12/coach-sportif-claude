import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Dumbbell,
  Flame,
  HeartPulse,
  Zap,
  ChevronRight,
  Timer,
  Repeat,
  Activity,
  Target,
  TrendingUp,
} from "lucide-react";
import heroImage from "@/assets/hero-coach.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Coach Sportif Personnalisé — Programme sur mesure" },
      {
        name: "description",
        content:
          "Génère ton programme d'entraînement personnalisé : perte de poids, prise de masse, remise en forme ou endurance. Séances détaillées, exercices, séries et répétitions.",
      },
      {
        property: "og:title",
        content: "Coach Sportif Personnalisé — Programme sur mesure",
      },
      {
        property: "og:description",
        content:
          "Génère ton programme d'entraînement personnalisé selon ton objectif, ton niveau et ta disponibilité.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
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

interface Exercice {
  nom: string;
  series: string;
  repos: string;
}

interface Seance {
  titre: string;
  focus: string;
  duree: string;
  exercices: Exercice[];
}

const REPOS: Record<Niveau, string> = {
  debutant: "90 s",
  intermediaire: "75 s",
  avance: "60 s",
};

function reps(niveau: Niveau, base: string): string {
  if (niveau === "debutant") return `3 x ${base}`;
  if (niveau === "intermediaire") return `4 x ${base}`;
  return `5 x ${base}`;
}

const SEANCES: Record<Objectif, Seance[]> = {
  perte: [
    {
      titre: "Circuit Brûle-Graisses",
      focus: "Full body HIIT",
      duree: "40 min",
      exercices: [
        { nom: "Burpees", series: "4 x 12", repos: "45 s" },
        { nom: "Squats sautés", series: "4 x 15", repos: "45 s" },
        { nom: "Mountain climbers", series: "4 x 30 s", repos: "30 s" },
        { nom: "Fentes alternées", series: "4 x 12 / jambe", repos: "45 s" },
        { nom: "Planche dynamique", series: "3 x 40 s", repos: "30 s" },
      ],
    },
    {
      titre: "Cardio Intensif",
      focus: "Interval training",
      duree: "35 min",
      exercices: [
        { nom: "Corde à sauter", series: "5 x 2 min", repos: "60 s" },
        { nom: "Sprints sur place", series: "6 x 30 s", repos: "30 s" },
        { nom: "Jumping jacks", series: "4 x 45 s", repos: "30 s" },
        { nom: "Gainage latéral", series: "3 x 30 s / côté", repos: "30 s" },
      ],
    },
    {
      titre: "Renforcement Métabolique",
      focus: "Haut du corps + core",
      duree: "45 min",
      exercices: [
        { nom: "Pompes", series: "4 x 12", repos: "60 s" },
        { nom: "Rowing haltères", series: "4 x 12", repos: "60 s" },
        { nom: "Développé épaules", series: "3 x 12", repos: "60 s" },
        { nom: "Crunchs inversés", series: "4 x 15", repos: "45 s" },
        { nom: "Russian twists", series: "3 x 20", repos: "45 s" },
      ],
    },
    {
      titre: "Bas du Corps Tonique",
      focus: "Jambes + fessiers",
      duree: "45 min",
      exercices: [
        { nom: "Squats goblet", series: "4 x 15", repos: "60 s" },
        { nom: "Soulevé de terre jambes tendues", series: "4 x 12", repos: "60 s" },
        { nom: "Hip thrust", series: "4 x 15", repos: "60 s" },
        { nom: "Montées sur banc", series: "3 x 12 / jambe", repos: "45 s" },
        { nom: "Mollets debout", series: "4 x 20", repos: "30 s" },
      ],
    },
    {
      titre: "HIIT Tabata",
      focus: "Brûlure maximale",
      duree: "30 min",
      exercices: [
        { nom: "Squats rapides", series: "8 x 20 s", repos: "10 s" },
        { nom: "Pompes explosives", series: "8 x 20 s", repos: "10 s" },
        { nom: "Fentes sautées", series: "8 x 20 s", repos: "10 s" },
        { nom: "Planche à touchés d'épaules", series: "8 x 20 s", repos: "10 s" },
      ],
    },
    {
      titre: "Cardio Endurance Active",
      focus: "Récupération active",
      duree: "40 min",
      exercices: [
        { nom: "Marche rapide inclinée", series: "1 x 20 min", repos: "—" },
        { nom: "Vélo elliptique", series: "1 x 15 min", repos: "—" },
        { nom: "Étirements dynamiques", series: "1 x 5 min", repos: "—" },
      ],
    },
  ],
  masse: [
    {
      titre: "Pectoraux & Triceps",
      focus: "Push — haut du corps",
      duree: "60 min",
      exercices: [
        { nom: "Développé couché barre", series: "4 x 8", repos: "90 s" },
        { nom: "Développé incliné haltères", series: "4 x 10", repos: "90 s" },
        { nom: "Écartés poulie", series: "3 x 12", repos: "60 s" },
        { nom: "Dips lestés", series: "3 x 10", repos: "90 s" },
        { nom: "Extensions triceps poulie", series: "4 x 12", repos: "60 s" },
      ],
    },
    {
      titre: "Dos & Biceps",
      focus: "Pull — haut du corps",
      duree: "60 min",
      exercices: [
        { nom: "Tractions", series: "4 x 8", repos: "90 s" },
        { nom: "Rowing barre", series: "4 x 10", repos: "90 s" },
        { nom: "Tirage vertical", series: "3 x 12", repos: "75 s" },
        { nom: "Curl barre EZ", series: "4 x 10", repos: "60 s" },
        { nom: "Curl marteau", series: "3 x 12", repos: "60 s" },
      ],
    },
    {
      titre: "Jambes Complètes",
      focus: "Quadriceps + ischios",
      duree: "65 min",
      exercices: [
        { nom: "Squat barre", series: "4 x 8", repos: "120 s" },
        { nom: "Presse à cuisses", series: "4 x 12", repos: "90 s" },
        { nom: "Soulevé de terre roumain", series: "4 x 10", repos: "90 s" },
        { nom: "Leg curl", series: "3 x 12", repos: "60 s" },
        { nom: "Mollets assis", series: "4 x 15", repos: "45 s" },
      ],
    },
    {
      titre: "Épaules & Abdos",
      focus: "Deltoïdes + sangle abdominale",
      duree: "55 min",
      exercices: [
        { nom: "Développé militaire", series: "4 x 8", repos: "90 s" },
        { nom: "Élévations latérales", series: "4 x 12", repos: "60 s" },
        { nom: "Oiseau haltères", series: "3 x 12", repos: "60 s" },
        { nom: "Shrugs barre", series: "4 x 12", repos: "60 s" },
        { nom: "Relevés de jambes suspendu", series: "4 x 12", repos: "60 s" },
      ],
    },
    {
      titre: "Full Body Force",
      focus: "Mouvements composés",
      duree: "60 min",
      exercices: [
        { nom: "Soulevé de terre", series: "5 x 5", repos: "150 s" },
        { nom: "Développé couché", series: "4 x 6", repos: "120 s" },
        { nom: "Squat", series: "4 x 6", repos: "120 s" },
        { nom: "Tractions lestées", series: "3 x 6", repos: "90 s" },
      ],
    },
    {
      titre: "Bras & Finition",
      focus: "Volume bras",
      duree: "45 min",
      exercices: [
        { nom: "Curl incliné", series: "4 x 10", repos: "60 s" },
        { nom: "Barre au front", series: "4 x 10", repos: "60 s" },
        { nom: "Curl concentration", series: "3 x 12", repos: "45 s" },
        { nom: "Extensions nuque", series: "3 x 12", repos: "45 s" },
        { nom: "Pompes serrées", series: "3 x max", repos: "60 s" },
      ],
    },
  ],
  forme: [
    {
      titre: "Réveil Musculaire",
      focus: "Full body doux",
      duree: "35 min",
      exercices: [
        { nom: "Squats poids du corps", series: "3 x 12", repos: "60 s" },
        { nom: "Pompes sur genoux", series: "3 x 10", repos: "60 s" },
        { nom: "Rowing élastique", series: "3 x 12", repos: "60 s" },
        { nom: "Planche", series: "3 x 30 s", repos: "45 s" },
      ],
    },
    {
      titre: "Cardio Doux",
      focus: "Endurance fondamentale",
      duree: "30 min",
      exercices: [
        { nom: "Marche rapide ou vélo", series: "1 x 20 min", repos: "—" },
        { nom: "Step bas", series: "3 x 2 min", repos: "60 s" },
        { nom: "Respiration & étirements", series: "1 x 5 min", repos: "—" },
      ],
    },
    {
      titre: "Renfo & Mobilité",
      focus: "Posture + gainage",
      duree: "40 min",
      exercices: [
        { nom: "Fentes arrière", series: "3 x 10 / jambe", repos: "60 s" },
        { nom: "Pont fessier", series: "3 x 15", repos: "45 s" },
        { nom: "Gainage latéral", series: "3 x 20 s / côté", repos: "45 s" },
        { nom: "Oiseau-chien", series: "3 x 10 / côté", repos: "45 s" },
        { nom: "Étirements actifs", series: "1 x 8 min", repos: "—" },
      ],
    },
    {
      titre: "Circuit Tonicité",
      focus: "Tonification générale",
      duree: "40 min",
      exercices: [
        { nom: "Squat + press épaules", series: "3 x 12", repos: "60 s" },
        { nom: "Soulevé de terre léger", series: "3 x 12", repos: "60 s" },
        { nom: "Pompes inclinées", series: "3 x 12", repos: "60 s" },
        { nom: "Mountain climbers lents", series: "3 x 30 s", repos: "45 s" },
      ],
    },
    {
      titre: "Cardio Ludique",
      focus: "Intervalles modérés",
      duree: "35 min",
      exercices: [
        { nom: "Corde à sauter", series: "4 x 1 min", repos: "60 s" },
        { nom: "Jumping jacks", series: "4 x 40 s", repos: "40 s" },
        { nom: "Montées de genoux", series: "4 x 30 s", repos: "40 s" },
        { nom: "Marche récupération", series: "1 x 5 min", repos: "—" },
      ],
    },
    {
      titre: "Stretching & Core",
      focus: "Récupération",
      duree: "30 min",
      exercices: [
        { nom: "Planche", series: "3 x 40 s", repos: "45 s" },
        { nom: "Crunchs", series: "3 x 15", repos: "45 s" },
        { nom: "Yoga flow doux", series: "1 x 15 min", repos: "—" },
      ],
    },
  ],
  endurance: [
    {
      titre: "Endurance Fondamentale",
      focus: "Zone 2 cardio",
      duree: "45 min",
      exercices: [
        { nom: "Course ou vélo zone 2", series: "1 x 35 min", repos: "—" },
        { nom: "Gainage", series: "3 x 45 s", repos: "45 s" },
        { nom: "Étirements", series: "1 x 10 min", repos: "—" },
      ],
    },
    {
      titre: "Intervalles Courts",
      focus: "VMA — 30/30",
      duree: "40 min",
      exercices: [
        { nom: "Échauffement footing", series: "1 x 10 min", repos: "—" },
        { nom: "30 s vite / 30 s lent", series: "2 x 8 répétitions", repos: "3 min entre séries" },
        { nom: "Retour au calme", series: "1 x 10 min", repos: "—" },
      ],
    },
    {
      titre: "Renfo Spécifique",
      focus: "Muscler pour durer",
      duree: "45 min",
      exercices: [
        { nom: "Squats bulgares", series: "4 x 10 / jambe", repos: "60 s" },
        { nom: "Fentes marchées", series: "3 x 20 pas", repos: "60 s" },
        { nom: "Montées de genoux lestées", series: "4 x 30 s", repos: "45 s" },
        { nom: "Gainage dynamique", series: "3 x 40 s", repos: "45 s" },
      ],
    },
    {
      titre: "Sortie Longue",
      focus: "Volume endurance",
      duree: "60 min",
      exercices: [
        { nom: "Course / vélo long", series: "1 x 50 min", repos: "—" },
        { nom: "Gainage latéral", series: "3 x 30 s / côté", repos: "30 s" },
        { nom: "Étirements complets", series: "1 x 10 min", repos: "—" },
      ],
    },
    {
      titre: "Seuil & Tempo",
      focus: "Allure soutenue",
      duree: "45 min",
      exercices: [
        { nom: "Échauffement", series: "1 x 10 min", repos: "—" },
        { nom: "Tempo run", series: "3 x 8 min", repos: "2 min trot" },
        { nom: "Retour au calme", series: "1 x 10 min", repos: "—" },
      ],
    },
    {
      titre: "Cross Training Cardio",
      focus: "Variété + explosivité",
      duree: "40 min",
      exercices: [
        { nom: "Rameur ou elliptique", series: "4 x 5 min", repos: "90 s" },
        { nom: "Burpees", series: "3 x 10", repos: "60 s" },
        { nom: "Corde à sauter", series: "4 x 1 min", repos: "45 s" },
      ],
    },
  ],
};

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const BIBLIOTHEQUE = [
  { nom: "Squat", cible: "Quadriceps, fessiers", niveau: "Tous niveaux" },
  { nom: "Soulevé de terre", cible: "Dos, ischios, fessiers", niveau: "Intermédiaire+" },
  { nom: "Développé couché", cible: "Pectoraux, triceps", niveau: "Tous niveaux" },
  { nom: "Tractions", cible: "Dos, biceps", niveau: "Intermédiaire+" },
  { nom: "Burpees", cible: "Full body, cardio", niveau: "Tous niveaux" },
  { nom: "Fentes", cible: "Jambes, équilibre", niveau: "Tous niveaux" },
  { nom: "Planche", cible: "Abdominaux, gainage", niveau: "Tous niveaux" },
  { nom: "Développé militaire", cible: "Épaules, triceps", niveau: "Intermédiaire+" },
  { nom: "Hip thrust", cible: "Fessiers", niveau: "Tous niveaux" },
  { nom: "Rowing barre", cible: "Dos, biceps", niveau: "Tous niveaux" },
  { nom: "Mountain climbers", cible: "Core, cardio", niveau: "Tous niveaux" },
  { nom: "Dips", cible: "Triceps, pectoraux", niveau: "Intermédiaire+" },
];

function Index() {
  const [objectif, setObjectif] = useState<Objectif>("forme");
  const [niveau, setNiveau] = useState<Niveau>("debutant");
  const [jours, setJours] = useState(3);
  const [genere, setGenere] = useState(false);

  const programme = useMemo(() => {
    const seances = SEANCES[objectif];
    const repos = REPOS[niveau];
    return Array.from({ length: jours }, (_, i) => {
      const seance = seances[i % seances.length]!;
      return {
        jour: JOURS[i],
        ...seance,
        exercices: seance.exercices.map((ex) => ({
          ...ex,
          series: ex.series.includes("x") && !ex.series.includes("min") && !ex.series.includes("s")
            ? reps(niveau, ex.series.split("x")[1].trim())
            : ex.series,
          repos: ex.repos === "—" ? ex.repos : ex.repos.includes("entre séries") ? ex.repos : repos,
        })),
      };
    });
  }, [objectif, niveau, jours]);

  const objectifLabel = OBJECTIFS.find((o) => o.id === objectif)!;
  const niveauLabel = NIVEAUX.find((n) => n.id === niveau)!;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="#" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary">
              <Dumbbell className="size-5 text-primary-foreground" />
            </span>
            <span className="font-display text-2xl tracking-wide">
              COACH<span className="text-primary">.</span>PRO
            </span>
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#programme" className="transition-colors hover:text-primary">Programme</a>
            <a href="#exercices" className="transition-colors hover:text-primary">Exercices</a>
          </div>
          <a
            href="#programme"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            Créer mon programme
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Athlète en plein entraînement"
            className="size-full object-cover object-center opacity-50"
            width={1600}
            height={1024}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <Activity className="size-3.5" />
            Ton entraînement, tes règles
          </p>
          <h1 className="font-display text-6xl leading-[0.95] sm:text-7xl lg:text-8xl">
            Ton coach sportif
            <br />
            <span className="text-primary">100% personnalisé</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Choisis ton objectif, ton niveau et tes jours dispo — obtiens
            instantanément un programme hebdomadaire complet avec exercices,
            séries et temps de repos.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#programme"
              className="glow-primary inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Générer mon programme
              <ChevronRight className="size-4" />
            </a>
            <a
              href="#exercices"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-semibold transition-colors hover:border-primary/50"
            >
              Voir les exercices
            </a>
          </div>
          <div className="mt-12 flex flex-wrap gap-8 text-sm">
            <div>
              <p className="font-display text-3xl text-primary">4</p>
              <p className="text-muted-foreground">Objectifs ciblés</p>
            </div>
            <div>
              <p className="font-display text-3xl text-primary">24+</p>
              <p className="text-muted-foreground">Séances types</p>
            </div>
            <div>
              <p className="font-display text-3xl text-primary">100%</p>
              <p className="text-muted-foreground">Sur mesure</p>
            </div>
          </div>
        </div>
      </section>

      {/* Générateur */}
      <section id="programme" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
        <div className="mb-10">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
            <Target className="size-4" /> Générateur
          </p>
          <h2 className="font-display text-5xl sm:text-6xl">Construis ton programme</h2>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          {/* Objectif */}
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            1. Ton objectif
          </p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {OBJECTIFS.map((o) => (
              <button
                key={o.id}
                onClick={() => { setObjectif(o.id); setGenere(false); }}
                className={`rounded-xl border p-4 text-left transition-all ${
                  objectif === o.id
                    ? "border-primary bg-primary/10 glow-primary"
                    : "border-border bg-background hover:border-primary/40"
                }`}
              >
                <o.icon className={`mb-2 size-6 ${objectif === o.id ? "text-primary" : "text-muted-foreground"}`} />
                <p className="font-semibold">{o.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{o.desc}</p>
              </button>
            ))}
          </div>

          {/* Niveau */}
          <p className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            2. Ton niveau
          </p>
          <div className="flex flex-wrap gap-3">
            {NIVEAUX.map((n) => (
              <button
                key={n.id}
                onClick={() => { setNiveau(n.id); setGenere(false); }}
                className={`rounded-lg border px-5 py-2.5 font-medium transition-all ${
                  niveau === n.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary/40"
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>

          {/* Jours */}
          <p className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            3. Jours d'entraînement par semaine
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {[2, 3, 4, 5, 6].map((j) => (
              <button
                key={j}
                onClick={() => { setJours(j); setGenere(false); }}
                className={`flex size-12 items-center justify-center rounded-lg border font-display text-xl transition-all ${
                  jours === j
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary/40"
                }`}
              >
                {j}
              </button>
            ))}
            <span className="text-sm text-muted-foreground">jours / semaine</span>
          </div>

          <button
            onClick={() => setGenere(true)}
            className="glow-primary mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-display text-2xl tracking-wide text-primary-foreground transition-transform hover:scale-[1.02] sm:w-auto"
          >
            <Zap className="size-5" />
            Générer mon programme
          </button>
        </div>

        {/* Résultat */}
        {genere && (
          <div className="mt-10">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <h3 className="font-display text-4xl">Ta semaine type</h3>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {objectifLabel.label} · {niveauLabel.label} · {jours} jours
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {programme.map((seance, i) => (
                <article
                  key={i}
                  className="flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                        {seance.jour}
                      </p>
                      <h4 className="mt-1 font-display text-2xl leading-tight">{seance.titre}</h4>
                      <p className="text-sm text-muted-foreground">{seance.focus}</p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                      <Timer className="size-3.5" />
                      {seance.duree}
                    </span>
                  </div>
                  <ul className="flex-1 space-y-2.5">
                    {seance.exercices.map((ex, j) => (
                      <li
                        key={j}
                        className="flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-2.5 text-sm"
                      >
                        <span className="font-medium">{ex.nom}</span>
                        <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 font-semibold text-primary">
                            <Repeat className="size-3" />
                            {ex.series}
                          </span>
                          {ex.repos !== "—" && <span>repos {ex.repos}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <p className="mt-6 flex items-start gap-2 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
              <TrendingUp className="mt-0.5 size-4 shrink-0 text-primary" />
              Conseil du coach : augmente progressivement les charges ou les répétitions
              chaque semaine, et garde au moins un jour de repos complet entre deux
              séances intenses.
            </p>
          </div>
        )}
      </section>

      {/* Bibliothèque d'exercices */}
      <section id="exercices" className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
          <div className="mb-10">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
              <Dumbbell className="size-4" /> Bibliothèque
            </p>
            <h2 className="font-display text-5xl sm:text-6xl">Les exercices essentiels</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Les mouvements de base qui composent tes programmes. Maîtrise-les
              avant d'augmenter les charges.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BIBLIOTHEQUE.map((ex) => (
              <div
                key={ex.nom}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:glow-primary"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl">{ex.nom}</h3>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
                    {ex.niveau}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{ex.cible}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Dumbbell className="size-4 text-primary-foreground" />
            </span>
            <span className="font-display text-xl tracking-wide">
              COACH<span className="text-primary">.</span>PRO
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Coach Sportif Personnalisé — Entraîne-toi intelligemment. Consulte un
            professionnel de santé avant de débuter.
          </p>
        </div>
      </footer>
    </div>
  );
}
