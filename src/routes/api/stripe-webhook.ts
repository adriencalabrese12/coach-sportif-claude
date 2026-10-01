import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { stripe, syncSubscription, verifyStripeSignature, type StripeSub } from "@/lib/stripe.server";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

interface StripeEvent {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
}

export const Route = createFileRoute("/api/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const payload = await request.text();
        if (!(await verifyStripeSignature(payload, request.headers.get("stripe-signature")))) {
          return json({ error: "Signature invalide" }, 400);
        }
        const event = JSON.parse(payload) as StripeEvent;

        // Idempotence : un événement déjà traité est ignoré.
        const { error: dup } = await supabaseAdmin
          .from("stripe_events")
          .insert({ id: event.id, type: event.type });
        if (dup) return dup.code === "23505" ? json({ received: true, duplicate: true }) : json({ error: "db" }, 500);

        try {
          const obj = event.data.object;
          if (event.type === "checkout.session.completed") {
            if (obj["mode"] === "subscription" && typeof obj["subscription"] === "string") {
              const sub = await stripe<StripeSub>("GET", `/subscriptions/${obj["subscription"]}`);
              const meta = obj["metadata"] as Record<string, string> | null;
              const hint = meta?.["user_id"] ?? (obj["client_reference_id"] as string | null);
              await syncSubscription(sub, hint);
            }
          } else if (
            event.type === "customer.subscription.updated" ||
            event.type === "customer.subscription.deleted"
          ) {
            await syncSubscription(obj as unknown as StripeSub);
          }
        } catch (e) {
          console.error("[stripe-webhook]", event.type, e);
          // Libère l'identifiant pour que Stripe puisse rejouer l'événement.
          await supabaseAdmin.from("stripe_events").delete().eq("id", event.id);
          return json({ error: "traitement" }, 500);
        }
        return json({ received: true });
      },
    },
  },
});
