import { createFileRoute } from "@tanstack/react-router";
import { abs } from "@/lib/site";

const BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
];

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        const txt = [
          "User-agent: *",
          "Allow: /",
          "Disallow: /connexion",
          "Disallow: /abonnement",
          "Disallow: /programme",
          "Disallow: /questionnaire",
          "Disallow: /api/",
          "",
          "# Moteurs d'IA autorisés (GEO) : contenu public uniquement",
          ...BOTS.flatMap((b) => [`User-agent: ${b}`, "Allow: /", "Disallow: /connexion", "Disallow: /programme", "Disallow: /questionnaire", "Disallow: /api/", ""]),
          `Sitemap: ${abs("/sitemap.xml")}`,
          "",
        ].join("\n");
        return new Response(txt, {
          headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
        });
      },
    },
  },
});
