/** Domaine public du site : à définir via VITE_SITE_URL (voir .env.example). */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://VOTRE-DOMAINE.fr"
).replace(/\/$/, "");

export const SITE_NAME = "Coach.Pro";
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const abs = (path: string) => `${SITE_URL}${path}`;

interface HeadOpts {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  type?: "website" | "article";
  jsonLd?: unknown[];
}

/** Meta, canonical et JSON-LD d'une page (title/description uniques par route). */
export function pageHead({ title, description, path, noindex, type = "website", jsonLd }: HeadOpts) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "robots",
        content: noindex
          ? "noindex, nofollow"
          : "index, follow, max-snippet:-1, max-image-preview:large",
      },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: abs(path) },
    ],
    links: [{ rel: "canonical", href: abs(path) }],
    scripts: (jsonLd ?? []).map((j) => ({ type: "application/ld+json", children: JSON.stringify(j) })),
  };
}
