import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { MENTIONS } from "@/content/legal";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/mentions-legales")({
  head: () =>
    pageHead({
      title: "Mentions légales | Coach.Pro",
      description: "Mentions légales du site Coach.Pro : éditeur, hébergement et avertissement santé.",
      path: "/mentions-legales",
    }),
  component: () => <LegalPage title="Mentions légales" sections={MENTIONS} />,
});
