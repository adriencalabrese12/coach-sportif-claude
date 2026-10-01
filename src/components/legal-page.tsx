import { PageShell } from "@/components/page-shell";
import { LEGAL, type LegalSection } from "@/content/legal";

export function LegalPage({ title, sections }: { title: string; sections: LegalSection[] }) {
  return (
    <PageShell>
      <h1 className="font-display text-[clamp(40px,6vw,60px)] leading-none">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : {LEGAL.maj}</p>
      {sections.map((s) => (
        <section key={s.h2} className="mt-8">
          <h2 className="font-display text-3xl">{s.h2}</h2>
          {s.p.map((t) => (
            <p key={t} className="mt-3 leading-relaxed text-muted-foreground">{t}</p>
          ))}
        </section>
      ))}
    </PageShell>
  );
}
