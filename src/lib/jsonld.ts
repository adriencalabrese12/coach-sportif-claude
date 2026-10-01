import { FAQ } from "@/content/faq";
import { abs, SITE_NAME } from "@/lib/site";

export interface ReviewStats {
  count: number;
  average: number;
}

/** JSON-LD de la page d'accueil. aggregateRating uniquement à partir d'avis réels publiés. */
export function landingJsonLd(stats?: ReviewStats | null) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": abs("/#org"), name: SITE_NAME, url: abs("/"), logo: abs("/og-image.jpg") },
      {
        "@type": "WebSite",
        "@id": abs("/#site"),
        url: abs("/"),
        name: SITE_NAME,
        inLanguage: "fr-FR",
        publisher: { "@id": abs("/#org") },
      },
      {
        "@type": "WebApplication",
        name: "Générateur de programme sportif Coach.Pro",
        applicationCategory: "HealthApplication",
        operatingSystem: "Web",
        inLanguage: "fr-FR",
        url: abs("/#programme"),
        ...(stats && stats.count > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: stats.average,
                reviewCount: stats.count,
                bestRating: 5,
                worstRating: 1,
              },
            }
          : {}),
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}
