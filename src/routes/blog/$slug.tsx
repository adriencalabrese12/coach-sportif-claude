import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CtaAbonnement, PageShell } from "@/components/page-shell";
import { AVERTISSEMENT_SANTE, getArticle } from "@/content/blog";
import { abs, pageHead, SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData: a }) => {
    if (!a) return {};
    const path = `/blog/${a.slug}`;
    return pageHead({
      title: `${a.title} | ${SITE_NAME}`,
      description: a.description,
      path,
      type: "article",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.description,
          datePublished: a.date,
          dateModified: a.date,
          inLanguage: "fr-FR",
          mainEntityOfPage: abs(path),
          image: abs("/og-image.jpg"),
          author: { "@type": "Organization", name: SITE_NAME, url: abs("/") },
          publisher: { "@type": "Organization", name: SITE_NAME, url: abs("/") },
        },
      ],
    });
  },
  component: ArticlePage,
});

function ArticlePage() {
  const a = Route.useLoaderData();
  return (
    <PageShell>
      <nav aria-label="Fil d'Ariane" className="text-sm text-muted-foreground">
        <Link to="/blog" className="inline-flex min-h-11 items-center hover:text-primary">← Blog</Link>
      </nav>
      <article>
        <h1 className="font-display text-[clamp(40px,6vw,60px)] leading-none">{a.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Par l'équipe {SITE_NAME} · <time dateTime={a.date}>{new Date(a.date).toLocaleDateString("fr-FR", { dateStyle: "long" })}</time>
        </p>
        <p className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4 leading-relaxed">
          <strong>En bref : </strong>
          {a.resume}
        </p>
        {a.sections.map((s) => (
          <section key={s.h2} className="mt-10">
            <h2 className="font-display text-3xl">{s.h2}</h2>
            {s.p.map((t) => (
              <p key={t} className="mt-3 leading-relaxed text-muted-foreground">{t}</p>
            ))}
          </section>
        ))}
        <p className="mt-10 border-t border-border pt-4 text-xs text-muted-foreground">{AVERTISSEMENT_SANTE}</p>
      </article>
      <CtaAbonnement />
    </PageShell>
  );
}
