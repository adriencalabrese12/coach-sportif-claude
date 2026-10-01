import { useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSession } from "@/hooks/use-session";

/** Avis d'abonné vérifié, proposé après une séance terminée. Publié seulement après modération. */
export function ReviewDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const session = useSession();
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [auteur, setAuteur] = useState("");
  const [etat, setEtat] = useState<"saisie" | "envoi" | "ok">("saisie");
  const [erreur, setErreur] = useState<string | null>(null);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    if (note < 1) return setErreur("Choisis une note de 1 à 5.");
    setErreur(null);
    setEtat("envoi");
    const { error } = await supabase.from("reviews").insert({
      user_id: session.user.id,
      note,
      commentaire: commentaire.trim() || null,
      auteur: auteur.trim() || null,
    });
    if (error) {
      setEtat("saisie");
      setErreur(
        error.code === "23505"
          ? "Tu as déjà laissé un avis, merci !"
          : "Ton avis n'a pas pu être envoyé. Réessaie dans un instant.",
      );
      return;
    }
    setEtat("ok");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Séance terminée, bravo !</DialogTitle>
          <DialogDescription>
            Un avis d'abonné vérifié nous aide à progresser. Il sera publié après modération.
          </DialogDescription>
        </DialogHeader>
        {etat === "ok" ? (
          <>
            <p role="status" className="text-sm">Merci ! Ton avis sera visible après modération.</p>
            <DialogFooter>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="min-h-11 rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground"
              >
                Fermer
              </button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={envoyer} className="space-y-4">
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Ta note</legend>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={note === n}
                    aria-label={`${n} sur 5`}
                    onClick={() => setNote(n)}
                    className="flex size-11 items-center justify-center rounded-lg hover:bg-secondary"
                  >
                    <Star aria-hidden="true" className={`size-6 ${n <= note ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="block text-sm">
              Commentaire (facultatif)
              <textarea
                maxLength={1000}
                rows={4}
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              Prénom affiché (facultatif)
              <input
                maxLength={40}
                value={auteur}
                onChange={(e) => setAuteur(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2"
              />
            </label>
            {erreur && <p role="alert" className="text-sm text-destructive">{erreur}</p>}
            <DialogFooter>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="min-h-11 rounded-lg border border-border px-5 py-2 text-sm"
              >
                Plus tard
              </button>
              <button
                disabled={etat === "envoi"}
                className="min-h-11 rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground disabled:opacity-60"
              >
                {etat === "envoi" ? "Envoi…" : "Envoyer mon avis"}
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
