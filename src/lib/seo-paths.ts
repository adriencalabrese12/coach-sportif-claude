import { BLOG } from "@/content/blog";

/** Routes qui ne doivent pas être indexées (espace abonné, auth, API, flux techniques). */
const EXCLUS = ["__root", "connexion", "abonnement", "programme", "questionnaire", "api/"];

const fichiers = Object.keys(import.meta.glob("/src/routes/**/*.{ts,tsx}"));

/** Chemins publics du site, déduits des fichiers de routes ; les routes dynamiques sont développées. */
export function publicPaths(): { path: string; priority: number }[] {
  const out: { path: string; priority: number }[] = [];
  for (const f of fichiers) {
    const rel = f.replace("/src/routes/", "").replace(/\.(tsx|ts)$/, "");
    if (rel.includes("[") || EXCLUS.some((x) => rel.startsWith(x))) continue;
    const route = "/" + rel.replace(/\/?index$/, "");
    if (route.includes("$")) continue;
    out.push({ path: route === "/" ? "/" : route.replace(/\/$/, ""), priority: route === "/" ? 1 : 0.7 });
  }
  for (const a of BLOG) out.push({ path: `/blog/${a.slug}`, priority: 0.6 });
  return out.sort((a, b) => b.priority - a.priority || a.path.localeCompare(b.path));
}
