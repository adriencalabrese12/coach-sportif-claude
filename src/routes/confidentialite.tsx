import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { CONFIDENTIALITE } from "@/content/legal";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/confidentialite")({
  head: () =>
    pageHead({
      title: "Politique de confidentialité | Coach.Pro",
      description: "Données personnelles collectées par Coach.Pro, finalités, durées de conservation et droits RGPD.",
      path: "/confidentialite",
    }),
  component: () => <LegalPage title="Politique de confidentialité" sections={CONFIDENTIALITE} />,
});
