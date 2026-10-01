import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { SITE_URL } from "@/lib/site";
import { activeSubscription, priceIdFor, stripe } from "@/lib/stripe.server";

const checkoutInput = z.object({ plan: z.enum(["decouverte", "essentiel", "premium"]) });

async function portalUrl(customer: string): Promise<string> {
  const s = await stripe<{ url: string }>("POST", "/billing_portal/sessions", {
    customer,
    return_url: `${SITE_URL}/programme`,
  });
  return s.url;
}

/** Crée une session Stripe Checkout (redirection) ; renvoie l'URL de paiement. */
export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => checkoutInput.parse(d))
  .handler(async ({ data, context }) => {
    const sub = await activeSubscription(context.userId);
    // Déjà abonné : changement d'offre via le portail, pas de second abonnement.
    if (sub.active && sub.customerId) return { url: await portalUrl(sub.customerId) };
    const email = typeof context.claims.email === "string" ? context.claims.email : undefined;
    const meta = { user_id: context.userId, plan: data.plan };
    const s = await stripe<{ url: string }>("POST", "/checkout/sessions", {
      mode: "subscription",
      line_items: [{ price: priceIdFor(data.plan), quantity: 1 }],
      client_reference_id: context.userId,
      ...(sub.customerId ? { customer: sub.customerId } : { customer_email: email }),
      metadata: meta,
      subscription_data: { metadata: meta },
      locale: "fr",
      success_url: `${SITE_URL}/programme?abonnement=ok`,
      cancel_url: `${SITE_URL}/#tarifs`,
    });
    return { url: s.url };
  });

/** URL du portail client Stripe (résiliation, changement d'offre, factures). */
export const createPortalSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { customerId } = await activeSubscription(context.userId);
    if (!customerId) throw new Error("Aucun abonnement trouvé.");
    return { url: await portalUrl(customerId) };
  });
