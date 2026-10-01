import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { BLOG } from "@/content/blog";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/blog/")({
  head: () =>
    pageHead({
      title: "Blog coaching sportif : programmes, conseils et récupération | Coach.Pro",
      description:
        "Guides pratiques pour s'entraîner : programme prise de masse, perte de poids pour débutant, nombre de séances par semaine, musculation à la maison.",
      path: "/blog",
    }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <PageShell>
      <h1 className="font-display text-[clamp(44px,7vw,64px)] leading-none">Le blog Coach.Pro</h1>
      <p className="mt-3 text-muted-foreground">Des réponses claires pour t'entraîner intelligemment.</p>
      <ul className="mt-10 space-y-4">
        {BLOG.map((a) => (
          <li key={a.slug}>
            <Link
              to="/blog/$slug"
              params={{ slug: a.slug }}
              className="block rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <h2 className="font-display text-2xl">{a.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{a.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
