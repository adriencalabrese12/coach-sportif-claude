import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { isPlanId, PLAN_RANK, type PlanId } from "@/lib/plans";

const API = "https://api.stripe.com/v1";

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Configuration paiement manquante (${name})`);
  return v;
}

const PRICE_ENV: Record<PlanId, string> = {
  decouverte: "STRIPE_PRICE_DECOUVERTE",
  essentiel: "STRIPE_PRICE_ESSENTIEL",
  premium: "STRIPE_PRICE_PREMIUM",
};

export const priceIdFor = (plan: PlanId) => env(PRICE_ENV[plan]);

export function planFromPrice(priceId: string | undefined): PlanId | null {
  if (!priceId) return null;
  for (const p of Object.keys(PRICE_ENV) as PlanId[]) {
    if (process.env[PRICE_ENV[p]] === priceId) return p;
  }
  return null;
}

/** Encode un objet imbriqué au format form-urlencoded de Stripe (a[b][0]=c). */
function encode(obj: Record<string, unknown>, prefix = ""): [string, string][] {
  return Object.entries(obj).flatMap(([k, v]): [string, string][] => {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v === undefined || v === null) return [];
    if (Array.isArray(v)) return v.flatMap((x, i) => encode({ [i]: x }, key));
    if (typeof v === "object") return encode(v as Record<string, unknown>, key);
    return [[key, String(v)]];
  });
}

export async function stripe<T = Record<string, unknown>>(
  method: "GET" | "POST",
  path: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const body = new URLSearchParams(encode(params));
  const query = method === "GET" && body.toString() ? `?${body}` : "";
  const res = await fetch(`${API}${path}${query}`, {
    method,
    headers: {
      Authorization: `Bearer ${env("STRIPE_SECRET_KEY")}`,
      ...(method === "POST" ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: method === "POST" ? body : undefined,
  });
  const json = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) {
    console.error("[stripe]", path, res.status, json.error?.message);
    throw new Error("Le service de paiement est indisponible, réessaie dans un instant.");
  }
  return json;
}

const hex = (buf: ArrayBuffer) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

/** Vérifie l'en-tête Stripe-Signature (HMAC-SHA256, tolérance 5 min). */
export async function verifyStripeSignature(payload: string, header: string | null): Promise<boolean> {
  if (!header) return false;
  const items = header.split(",").map((p) => p.trim());
  const t = items.find((p) => p.startsWith("t="))?.slice(2);
  const sigs = items.filter((p) => p.startsWith("v1=")).map((p) => p.slice(3));
  if (!t || sigs.length === 0 || Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(env("STRIPE_WEBHOOK_SECRET")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expected = hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${t}.${payload}`)));
  // Comparaison à temps constant.
  return sigs.some((s) => {
    if (s.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < s.length; i++) diff |= s.charCodeAt(i) ^ expected.charCodeAt(i);
    return diff === 0;
  });
}

export interface StripeSub {
  id: string;
  customer: string;
  status: string;
  metadata?: Record<string, string>;
  current_period_end?: number;
  items?: { data?: { price?: { id?: string }; current_period_end?: number }[] };
}

/** Écrit l'état de l'abonnement (service role : seul écrivain de la table). */
export async function syncSubscription(sub: StripeSub, userIdHint?: string | null) {
  let userId = userIdHint ?? sub.metadata?.["user_id"] ?? null;
  if (!userId) {
    const { data } = await supabaseAdmin
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", sub.id)
      .maybeSingle();
    userId = data?.user_id ?? null;
  }
  if (!userId) throw new Error(`Abonnement ${sub.id} sans user_id`);
  const item = sub.items?.data?.[0];
  const metaPlan = sub.metadata?.["plan"];
  const plan = planFromPrice(item?.price?.id) ?? (isPlanId(metaPlan) ? metaPlan : null);
  if (!plan) throw new Error(`Offre inconnue pour ${sub.id}`);
  const end = sub.current_period_end ?? item?.current_period_end;
  const { error } = await supabaseAdmin.from("subscriptions").upsert({
    user_id: userId,
    plan,
    status: sub.status,
    stripe_customer_id: sub.customer,
    stripe_subscription_id: sub.id,
    current_period_end: end ? new Date(end * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

/** Abonnement de l'utilisateur lu avec le service role (contrôle serveur). */
export async function activeSubscription(userId: string) {
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("plan,status,stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();
  const active = !!data && (data.status === "active" || data.status === "trialing") && isPlanId(data.plan);
  return {
    active,
    plan: active && isPlanId(data.plan) ? data.plan : null,
    customerId: data?.stripe_customer_id ?? null,
  };
}

/** Lève une erreur si l'utilisateur n'a pas l'offre minimale requise. */
export async function requirePlan(userId: string, min: PlanId): Promise<PlanId> {
  const s = await activeSubscription(userId);
  if (!s.plan || PLAN_RANK[s.plan] < PLAN_RANK[min]) {
    throw new Error(min === "decouverte" ? "Abonnement requis." : `Offre ${min} requise.`);
  }
  return s.plan;
}
