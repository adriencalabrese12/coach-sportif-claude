import { createFileRoute } from "@tanstack/react-router";
import { BLOG } from "@/content/blog";
import { abs } from "@/lib/site";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () => {
        const txt = [
          "# Coach.Pro",
          "",
          "> Coach sportif en ligne : génère un programme d'entraînement personnalisé (perte de poids, prise de masse, remise en forme, endurance) avec exercices, séries, répétitions et repos, selon ton niveau et tes jours disponibles. Séances détaillées réservées aux abonnés.",
          "",
          "Langue : français. Ne remplace pas un avis médical.",
          "",
          "## Pages clés",
          `- [Accueil et générateur](${abs("/")}): générateur de semaine d'entraînement, méthode, tarifs`,
          `- [FAQ](${abs("/#faq")}): fonctionnement, niveaux, fréquence, matériel, précautions`,
          `- [Séance d'exemple](${abs("/apercu")}): séance full body débutant en accès libre`,
          `- [Blog](${abs("/blog")}): guides d'entraînement`,
          "",
          "## Articles",
          ...BLOG.map((a) => `- [${a.title}](${abs(`/blog/${a.slug}`)}): ${a.description}`),
          "",
        ].join("\n");
        return new Response(txt, {
          headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
        });
      },
    },
  },
});
