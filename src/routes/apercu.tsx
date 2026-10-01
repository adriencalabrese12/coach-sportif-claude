import { createFileRoute } from "@tanstack/react-router";
import { CtaAbonnement, PageShell } from "@/components/page-shell";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/apercu")({
  head: () =>
    pageHead({
      title: "Séance d'exemple full body débutant en accès libre | Coach.Pro",
      description:
        "Un aperçu gratuit d'une séance Coach.Pro : full body au poids du corps pour débutant, avec exercices, séries, répétitions et temps de repos.",
      path: "/apercu",
    }),
  component: Apercu,
});

const EXOS = [
  { nom: "Squats poids du corps", series: "3 × 12", repos: "60 s", note: "Pieds largeur d'épaules, dos droit, descends jusqu'où tu gardes le contrôle." },
  { nom: "Pompes sur genoux ou inclinées", series: "3 × 10", repos: "60 s", note: "Corps aligné, coudes à environ 45° du buste." },
  { nom: "Rowing élastique", series: "3 × 12", repos: "60 s", note: "Omoplates serrées en fin de mouvement, sans hausser les épaules." },
  { nom: "Fentes arrière", series: "3 × 10 par jambe", repos: "60 s", note: "Genou avant dans l'axe du pied." },
  { nom: "Planche", series: "3 × 30 s", repos: "45 s", note: "Bassin aligné, respiration continue." },
];

function Apercu() {
  return (
    <PageShell>
      <h1 className="font-display text-[clamp(40px,6vw,60px)] leading-none">Séance d'exemple : full body débutant</h1>
      <p className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 leading-relaxed">
        <strong>En bref : </strong>
        séance d'environ 35 minutes au poids du corps (plus un élastique), à faire 2 à 3 fois par semaine avec au moins un jour de repos entre deux séances.
      </p>

      <h2 className="mt-10 font-display text-3xl">Comment se déroule cette séance ?</h2>
      <p className="mt-3 text-muted-foreground">
        Commence par 5 à 8 minutes d'échauffement (marche, rotations d'épaules et de hanches, quelques squats légers), puis enchaîne les exercices ci-dessous.
      </p>
      <ol className="mt-6 space-y-3">
        {EXOS.map((e, i) => (
          <li key={e.nom} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-2xl">{i + 1}. {e.nom}</h3>
              <p className="text-sm font-semibold text-primary">{e.series} · repos {e.repos}</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{e.note}</p>
          </li>
        ))}
      </ol>

      <h2 className="mt-10 font-display text-3xl">Comment progresser d'une semaine à l'autre ?</h2>
      <p className="mt-3 text-muted-foreground">
        Quand toutes les séries sont réalisées proprement, ajoute une ou deux répétitions, puis passe à une variante plus difficile. Arrête-toi en cas de douleur et consulte un professionnel de santé si elle persiste.
      </p>
      <CtaAbonnement />
    </PageShell>
  );
}
