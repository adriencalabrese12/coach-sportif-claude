CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY,
  prenom text, sexe text, age int, taille numeric, poids numeric,
  objectif text, niveau text, jours int, duree int,
  equipement text[] NOT NULL DEFAULT '{}', blessures text[] NOT NULL DEFAULT '{}',
  pathologies text[] NOT NULL DEFAULT '{}', activite text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profiles" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  seances jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.programs TO authenticated;
GRANT ALL ON public.programs TO service_role;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own programs" ON public.programs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.session_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  seance_titre text NOT NULL, kcal int, rpe int,
  date date NOT NULL DEFAULT current_date
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.session_logs TO authenticated;
GRANT ALL ON public.session_logs TO service_role;
ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own session_logs" ON public.session_logs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  date date NOT NULL DEFAULT current_date,
  fatigue int, sommeil numeric, temps int, douleur text, envie text
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.checkins TO authenticated;
GRANT ALL ON public.checkins TO service_role;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own checkins" ON public.checkins FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.measurements (
  user_id uuid NOT NULL DEFAULT auth.uid(),
  date date NOT NULL DEFAULT current_date,
  poids numeric, tour_taille numeric,
  PRIMARY KEY (user_id, date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.measurements TO authenticated;
GRANT ALL ON public.measurements TO service_role;
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own measurements" ON public.measurements FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);