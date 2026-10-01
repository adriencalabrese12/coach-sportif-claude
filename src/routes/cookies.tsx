import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { COOKIES } from "@/content/legal";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/cookies")({
  head: () =>
    pageHead({
      title: "Gestion des cookies | Coach.Pro",
      description: "Cookies et traceurs utilisés par Coach.Pro, et comment les gérer.",
      path: "/cookies",
    }),
  component: () => <LegalPage title="Gestion des cookies" sections={COOKIES} />,
});
