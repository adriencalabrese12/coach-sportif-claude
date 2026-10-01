import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { CGV } from "@/content/legal";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/cgv")({
  head: () =>
    pageHead({
      title: "Conditions générales de vente | Coach.Pro",
      description: "Conditions générales de vente des abonnements Coach.Pro : prix, paiement, résiliation et rétractation.",
      path: "/cgv",
    }),
  component: () => <LegalPage title="Conditions générales de vente" sections={CGV} />,
});
