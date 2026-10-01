import { Link } from "@tanstack/react-router";
import { Dumbbell } from "lucide-react";
import { useSession } from "@/hooks/use-session";

export function Logo({ small }: { small?: boolean }) {
  return (
    <>
      <span className={`flex items-center justify-center rounded-lg bg-primary ${small ? "size-8" : "size-9"}`}>
        <Dumbbell aria-hidden="true" className={`${small ? "size-4" : "size-5"} text-primary-foreground`} />
      </span>
      <span className={`font-display tracking-wide ${small ? "text-xl" : "text-2xl"}`}>
        COACH<span className="text-primary">.</span>PRO
      </span>
    </>
  );
}

const nav = "inline-flex min-h-11 items-center transition-colors hover:text-primary";

export function SiteHeader() {
  const session = useSession();
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav aria-label="Navigation principale" className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-h-11 items-center gap-2" aria-label="Coach.Pro — accueil">
          <Logo />
        </Link>
        <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <a href="/#programme" className={nav}>Programme</a>
          <a href="/#methode" className={nav}>Méthode</a>
          <a href="/#tarifs" className={nav}>Tarifs</a>
          <Link to="/blog" className={nav}>Blog</Link>
          <a href="/#faq" className={nav}>FAQ</a>
        </div>
        <div className="flex items-center gap-2">
          <a href="/#tarifs" className={`${nav} px-2 text-sm font-medium text-muted-foreground md:hidden`}>Tarifs</a>
          <Link
            to={session ? "/programme" : "/connexion"}
            className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            {session ? "Mon espace" : "Connexion"}
          </Link>
        </div>
      </nav>
    </header>
  );
}

const flink = "inline-flex min-h-11 items-center hover:text-primary";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Link to="/" className="flex items-center gap-2" aria-label="Coach.Pro — accueil">
            <Logo small />
          </Link>
          <p className="max-w-md text-sm text-muted-foreground">
            Coach.Pro ne remplace pas un avis médical. Consulte un professionnel de santé avant de débuter.
          </p>
        </div>
        <nav aria-label="Informations légales" className="mt-6 flex flex-wrap gap-x-6 text-sm text-muted-foreground">
          <Link to="/apercu" className={flink}>Aperçu d'une séance</Link>
          <Link to="/blog" className={flink}>Blog</Link>
          <Link to="/mentions-legales" className={flink}>Mentions légales</Link>
          <Link to="/cgv" className={flink}>CGV</Link>
          <Link to="/confidentialite" className={flink}>Confidentialité</Link>
          <Link to="/cookies" className={flink}>Cookies</Link>
        </nav>
      </div>
    </footer>
  );
}
