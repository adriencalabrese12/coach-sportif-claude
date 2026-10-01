-- Abonnements Stripe, avis vérifiés, gating par RLS.
-- À relire avant application : remplace les policies "own programs" et "own checkins".

CREATE TABLE public.subscriptions (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL CHECK (plan IN ('decouverte','essentiel','premium')),
  status text NOT NULL,
  stripe_customer_id text,
  stripe_subscription_id text UNIQUE,
  current_period_end timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
-- Lecture de sa propre ligne uniquement ; aucune policy d'écriture : seul le service role écrit.
CREATE POLICY "own subscription read" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Idempotence du webhook Stripe.
CREATE TABLE public.stripe_events (
  id text PRIMARY KEY,
  type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.stripe_events TO service_role;
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;

-- Vrai si l'utilisateur a un abonnement actif/essai d'un niveau >= _min.
CREATE OR REPLACE FUNCTION public.has_plan(_user uuid, _min text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.user_id = _user
      AND s.status IN ('active','trialing')
      AND array_position(ARRAY['decouverte','essentiel','premium'], s.plan)
          >= array_position(ARRAY['decouverte','essentiel','premium'], _min)
  );
$$;
REVOKE ALL ON FUNCTION public.has_plan(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_plan(uuid, text) TO authenticated, service_role;

-- Gating RLS : programmes (Découverte+) et check-ins (Premium).
DROP POLICY "own programs" ON public.programs;
CREATE POLICY "programs read" ON public.programs FOR SELECT TO authenticated
  USING (auth.uid() = user_id AND public.has_plan(auth.uid(), 'decouverte'));
CREATE POLICY "programs write" ON public.programs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.has_plan(auth.uid(), 'decouverte'));
CREATE POLICY "programs update" ON public.programs FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND public.has_plan(auth.uid(), 'decouverte'))
  WITH CHECK (auth.uid() = user_id AND public.has_plan(auth.uid(), 'decouverte'));
CREATE POLICY "programs delete" ON public.programs FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY "own checkins" ON public.checkins;
CREATE POLICY "checkins read" ON public.checkins FOR SELECT TO authenticated
  USING (auth.uid() = user_id AND public.has_plan(auth.uid(), 'premium'));
CREATE POLICY "checkins write" ON public.checkins FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.has_plan(auth.uid(), 'premium'));
CREATE POLICY "checkins delete" ON public.checkins FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Avis d'abonnés vérifiés : un par utilisateur, modération avant publication.
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  note int NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire text CHECK (char_length(commentaire) <= 1000),
  auteur text CHECK (char_length(auteur) <= 40),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published','rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT INSERT, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews read" ON public.reviews FOR SELECT TO anon, authenticated
  USING (status = 'published' OR auth.uid() = user_id);
CREATE POLICY "reviews insert" ON public.reviews FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND status = 'pending'
    AND public.has_plan(auth.uid(), 'decouverte')
    AND EXISTS (SELECT 1 FROM public.session_logs l WHERE l.user_id = auth.uid())
  );
CREATE POLICY "reviews delete own" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);
-- Modération : passer status à 'published' via le tableau de bord Supabase (service role).
