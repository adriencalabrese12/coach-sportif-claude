import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { z } from "zod";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/connexion")({
  validateSearch: z.object({ plan: z.enum(["decouverte", "essentiel", "premium"]).optional().catch(undefined) }),
  head: () =>
    pageHead({
      title: "Connexion — Coach.Pro",
      description: "Connecte-toi ou crée ton compte Coach.Pro.",
      path: "/connexion",
      noindex: true,
    }),
  component: Connexion,
});

const field = "min-h-11 w-full rounded-lg border border-input bg-background px-3 py-2";

function Connexion() {
  const { plan } = Route.useSearch();
  const apres = plan ? `/abonnement?plan=${plan}` : "/programme";
  const session = useSession();
  const [mode, setMode] = useState<"connexion" | "inscription">("connexion");
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; texte: string } | null>(null);
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    if (session) window.location.replace(apres);
  }, [session, apres]);

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setEnvoi(true);
    if (mode === "inscription") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: mdp,
        options: { emailRedirectTo: `${window.location.origin}${apres}` },
      });
      if (error) setMsg({ ok: false, texte: error.message });
      else if (data.session) window.location.replace(apres);
      else setMsg({ ok: true, texte: "Compte créé. Clique sur le lien reçu par email pour vérifier ton adresse, puis connecte-toi." });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: mdp });
      if (error) {
        setMsg({
          ok: false,
          texte: /confirm/i.test(error.message)
            ? "Adresse email non vérifiée : clique sur le lien reçu par email."
            : "Email ou mot de passe incorrect.",
        });
      }
    }
    setEnvoi(false);
  }

  async function reinitialiser() {
    if (!email) return setMsg({ ok: false, texte: "Saisis ton email d'abord." });
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/connexion`,
    });
    setMsg(error ? { ok: false, texte: error.message } : { ok: true, texte: "Email de réinitialisation envoyé." });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <a href="/" className="mb-6 text-sm text-muted-foreground hover:text-primary">← Accueil</a>
      <h1 className="font-display text-5xl">{mode === "connexion" ? "Connexion" : "Créer un compte"}</h1>
      <form onSubmit={soumettre} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
        <label className="block text-sm">
          Email
          <input type="email" required autoComplete="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block text-sm">
          Mot de passe
          <input
            type="password"
            required
            minLength={8}
            autoComplete={mode === "connexion" ? "current-password" : "new-password"}
            className={field}
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
          />
        </label>
        {msg && <p className={`text-sm ${msg.ok ? "text-primary" : "text-destructive"}`}>{msg.texte}</p>}
        <button disabled={envoi} className="w-full rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground disabled:opacity-60">
          {envoi ? "…" : mode === "connexion" ? "Se connecter" : "S'inscrire"}
        </button>
        <div className="flex justify-between text-sm text-muted-foreground">
          <button type="button" className="hover:text-primary" onClick={() => { setMode(mode === "connexion" ? "inscription" : "connexion"); setMsg(null); }}>
            {mode === "connexion" ? "Pas de compte ? S'inscrire" : "J'ai déjà un compte"}
          </button>
          {mode === "connexion" && <button type="button" className="hover:text-primary" onClick={reinitialiser}>Mot de passe oublié</button>}
        </div>
      </form>
    </main>
  );
}
