import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { adapterSeance as adapterSeanceIA } from "@/lib/adapter-seance.functions";
import {
  adapterSeance,
  analyser,
  genererProgramme,
  type CheckIn,
  type Equipement,
  type Objectif,
  type Niveau,
  type Profil,
  type Zone,
} from "@/lib/coach";

export const Route = createFileRoute("/questionnaire")({
  head: () => ({
    meta: [
      { title: "Questionnaire — Coach Sportif Personnalisé" },
      { name: "description", content: "Réponds au questionnaire et obtiens ton programme et tes calories cibles." },
    ],
  }),
  component: Questionnaire,
});

const OBJECTIFS: [Objectif, string][] = [
  ["perte", "Perte de poids"], ["muscle", "Prise de muscle"], ["performance", "Performance"],
  ["reprise", "Reprise"], ["explosivite", "Explosivité"], ["maintien", "Maintien en forme"],
];
const NIVEAUX: [Niveau, string][] = [["debutant", "Débutant"], ["intermediaire", "Intermédiaire"], ["avance", "Avancé"]];
const EQUIP: [Equipement, string][] = [
  ["aucun", "Aucun"], ["halteres", "Haltères"], ["elastiques", "Élastiques"],
  ["barre", "Barre + banc"], ["salle", "Salle complète"], ["cardio", "Cardio (rameur…)"],
];
const ZONES: [Zone, string][] = [
  ["epaule", "Épaule"], ["genou", "Genou"], ["dos", "Dos"], ["poignet", "Poignet"], ["cheville", "Cheville"],
];
const PATHO = ["Cardiaque", "Diabète", "Hypertension", "Asthme", "Grossesse / post-partum"];
const ACTIVITE: [Profil["activite"], string][] = [
  [1.2, "Sédentaire"], [1.375, "Légèrement actif"], [1.55, "Modérément actif"], [1.725, "Très actif"],
];

const MORPHO: [Profil["morphologie"], string, string][] = [
  ["ectomorphe", "Ectomorphe", "Mince, prend peu de poids, épaules et hanches étroites"],
  ["mesomorphe", "Mésomorphe", "Athlétique, prend du muscle facilement"],
  ["endomorphe", "Endomorphe", "Corpulence forte, prend du poids facilement"],
];

const INIT: Profil = {
  morphologie: "mesomorphe",
  prenom: "", sexe: "H", age: 30, taille: 175, poids: 75, objectif: "maintien", niveau: "debutant",
  jours: 3, duree: 45, equipement: [], blessures: [], pathologies: [], activite: 1.375,
};

const chip = (on: boolean) =>
  `rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
    on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40"
  }`;
const field = "w-full rounded-lg border border-input bg-background px-3 py-2";

function toggle<T>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

function Questionnaire() {
  const [p, setP] = useState<Profil>(INIT);
  const [etape, setEtape] = useState(0);
  const [ci, setCi] = useState<CheckIn>({ fatigue: 2, sommeil: 7, temps: 45 });
  const [envie, setEnvie] = useState<string | null>(null);
  const [ia, setIa] = useState<{ seance: unknown; justification: string } | null>(null);
  const [iaEnCours, setIaEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const session = useSession();

  useEffect(() => {
    if (session === null) window.location.replace("/connexion");
  }, [session]);

  // Reprend le profil déjà enregistré.
  // La morphologie n'a pas encore de colonne en base : mémorisée localement.
  useEffect(() => {
    try {
      const m = localStorage.getItem("morphologie") as Profil["morphologie"] | null;
      if (m) setP((x) => ({ ...x, morphologie: m }));
    } catch { /* stockage indisponible */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem("morphologie", p.morphologie); } catch { /* ignore */ }
  }, [p.morphologie]);

  useEffect(() => {
    if (!session) return;
    void supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data: d }) => {
        if (!d) return;
        setP((x) => ({
          ...x,
          prenom: d.prenom ?? x.prenom,
          sexe: (d.sexe as Profil["sexe"]) ?? x.sexe,
          age: d.age ?? x.age,
          taille: Number(d.taille ?? x.taille),
          poids: Number(d.poids ?? x.poids),
          objectif: (d.objectif as Objectif) ?? x.objectif,
          niveau: (d.niveau as Niveau) ?? x.niveau,
          jours: d.jours ?? x.jours,
          duree: d.duree ?? x.duree,
          equipement: d.equipement as Equipement[],
          blessures: d.blessures as Zone[],
          pathologies: d.pathologies,
          activite: (Number(d.activite) || x.activite) as Profil["activite"],
        }));
      });
  }, [session]);

  async function terminer() {
    setEtape(4);
    if (!session) return;
    setErreur(null);
    const { error } = await supabase.from("profiles").upsert({
      user_id: session.user.id,
      prenom: p.prenom,
      sexe: p.sexe,
      age: p.age,
      taille: p.taille,
      poids: p.poids,
      objectif: p.objectif,
      niveau: p.niveau,
      jours: p.jours,
      duree: p.duree,
      equipement: p.equipement,
      blessures: p.blessures,
      pathologies: p.pathologies,
      activite: String(p.activite),
      updated_at: new Date().toISOString(),
    });
    if (error) return setErreur("Profil non enregistré : " + error.message);
    const { error: e2 } = await supabase
      .from("programs")
      .insert({ user_id: session.user.id, seances: JSON.parse(JSON.stringify(genererProgramme(p))) });
    if (e2) setErreur("Programme non enregistré : " + e2.message);
  }

  async function demanderIA() {
    if (!programme[0] || !session) return;
    setIaEnCours(true);
    setErreur(null);
    setIa(null);
    try {
      const checkin = { fatigue: ci.fatigue, sommeil: ci.sommeil, temps: ci.temps, douleur: ci.douleur ?? null, envie };
      const res = await adapterSeanceIA({ data: { seance: programme[0], checkin: checkin as never } });
      setIa({ seance: res.seance, justification: res.justification });
      await supabase.from("checkins").insert({
        user_id: session.user.id,
        fatigue: ci.fatigue,
        sommeil: ci.sommeil,
        temps: ci.temps,
        douleur: ci.douleur ?? null,
        envie,
      });
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Erreur IA");
    }
    setIaEnCours(false);
  }
  const set = <K extends keyof Profil>(k: K, v: Profil[K]) => setP((x) => ({ ...x, [k]: v }));
  const num = (k: "age" | "taille" | "poids" | "jours" | "duree") => (e: React.ChangeEvent<HTMLInputElement>) =>
    set(k, Number(e.target.value));

  const fini = etape === 4;
  const analyse = useMemo(() => (fini ? analyser(p) : null), [fini, p]);
  const programme = useMemo(() => (fini ? genererProgramme(p) : []), [fini, p]);
  const adapte = useMemo(
    () => (fini && programme[0] ? adapterSeance(programme[0], ci, p) : null),
    [fini, programme, ci, p],
  );

  const titres = ["Profil", "Objectif", "Matériel & santé", "Disponibilité"];

  if (!session) return <main className="p-12 text-center text-muted-foreground">Chargement…</main>;

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12 sm:px-6">
      <a href="/" className="text-sm text-muted-foreground hover:text-primary">← Accueil</a>
      <h1 className="mt-4 font-display text-5xl">{fini ? `Ton plan${p.prenom ? `, ${p.prenom}` : ""}` : "Questionnaire"}</h1>

      {!fini && (
        <>
          <p className="mt-2 text-sm text-muted-foreground">
            Étape {etape + 1}/4 — {titres[etape]}
          </p>
          <div className="mt-6 space-y-6 rounded-2xl border border-border bg-card p-6">
            {etape === 0 && (
              <>
                <input className={field} placeholder="Prénom" value={p.prenom} onChange={(e) => set("prenom", e.target.value)} />
                <div className="flex gap-3">
                  {(["H", "F"] as const).map((s) => (
                    <button key={s} className={chip(p.sexe === s)} onClick={() => set("sexe", s)}>
                      {s === "H" ? "Homme" : "Femme"}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <label>Âge<input type="number" className={field} value={p.age} onChange={num("age")} /></label>
                  <label>Taille (cm)<input type="number" className={field} value={p.taille} onChange={num("taille")} /></label>
                  <label>Poids (kg)<input type="number" className={field} value={p.poids} onChange={num("poids")} /></label>
                </div>
                <p className="text-sm text-muted-foreground">Ta morphologie</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {MORPHO.map(([v, l, d]) => (
                    <button key={v} className={`${chip(p.morphologie === v)} text-left`} onClick={() => set("morphologie", v)}>
                      <span className="block">{l}</span>
                      <span className="block text-xs font-normal opacity-80">{d}</span>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Activité au quotidien</p>
                <div className="flex flex-wrap gap-2">
                  {ACTIVITE.map(([v, l]) => (
                    <button key={v} className={chip(p.activite === v)} onClick={() => set("activite", v)}>{l}</button>
                  ))}
                </div>
              </>
            )}
            {etape === 1 && (
              <>
                <p className="text-sm text-muted-foreground">Objectif principal</p>
                <div className="flex flex-wrap gap-2">
                  {OBJECTIFS.map(([v, l]) => <button key={v} className={chip(p.objectif === v)} onClick={() => set("objectif", v)}>{l}</button>)}
                </div>
                <p className="text-sm text-muted-foreground">Niveau d'entraînement</p>
                <div className="flex flex-wrap gap-2">
                  {NIVEAUX.map(([v, l]) => <button key={v} className={chip(p.niveau === v)} onClick={() => set("niveau", v)}>{l}</button>)}
                </div>
              </>
            )}
            {etape === 2 && (
              <>
                <p className="text-sm text-muted-foreground">Équipement disponible</p>
                <div className="flex flex-wrap gap-2">
                  {EQUIP.map(([v, l]) => <button key={v} className={chip(p.equipement.includes(v))} onClick={() => set("equipement", toggle(p.equipement, v))}>{l}</button>)}
                </div>
                <p className="text-sm text-muted-foreground">Blessures / douleurs</p>
                <div className="flex flex-wrap gap-2">
                  {ZONES.map(([v, l]) => <button key={v} className={chip(p.blessures.includes(v))} onClick={() => set("blessures", toggle(p.blessures, v))}>{l}</button>)}
                </div>
                <p className="text-sm text-muted-foreground">Pathologies</p>
                <div className="flex flex-wrap gap-2">
                  {PATHO.map((v) => <button key={v} className={chip(p.pathologies.includes(v))} onClick={() => set("pathologies", toggle(p.pathologies, v))}>{v}</button>)}
                </div>
              </>
            )}
            {etape === 3 && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <label>Jours / semaine (2-6)<input type="number" min={2} max={6} className={field} value={p.jours} onChange={num("jours")} /></label>
                <label>Durée / séance (min)<input type="number" min={20} max={90} step={5} className={field} value={p.duree} onChange={num("duree")} /></label>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-between">
            <button className={chip(false)} disabled={etape === 0} onClick={() => setEtape(etape - 1)}>Retour</button>
            <button
              className="rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground"
              onClick={() => (etape === 3 ? void terminer() : setEtape(etape + 1))}
            >
              {etape === 3 ? "Voir mon plan" : "Suivant"}
            </button>
          </div>
        </>
      )}

      {fini && analyse && (
        <div className="mt-6 space-y-8">
          {analyse.avisMedical && (
            <p className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm">
              Un avis médical est recommandé avant de commencer. Intensité limitée (RPE ≤ {analyse.rpeMax}).
            </p>
          )}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["IMC", String(analyse.imc)],
              ["Métabolisme", `${analyse.bmr} kcal`],
              ["Dépense/jour", `${analyse.tdee} kcal`],
              ["Cible", `${analyse.kcal} kcal`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">{k}</p>
                <p className="font-display text-2xl text-primary">{v}</p>
              </div>
            ))}
          </section>
          <p className="text-sm text-muted-foreground">
            Macros : {analyse.macros.proteines} g protéines · {analyse.macros.lipides} g lipides · {analyse.macros.glucides} g glucides — Split : {analyse.split}
          </p>

          <section className="space-y-4">
            <h2 className="font-display text-3xl">Programme</h2>
            {programme.map((s, i) => (
              <article key={i} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl">{s.jour} — {s.titre}</h3>
                  <span className="text-xs text-muted-foreground">{s.duree} min · ~{s.kcal} kcal</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {s.exercices.map((e, j) => (
                    <li key={j} className="flex justify-between gap-3 rounded-lg bg-background px-3 py-2">
                      <span><b>{e.nom}</b> <span className="text-muted-foreground">{e.muscles}</span></span>
                      <span className="shrink-0 text-primary">
                        {e.series > 1 ? `${e.series} × ${e.reps}` : e.reps}
                        {e.repos > 0 && <span className="text-muted-foreground"> · repos {e.repos}s</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </section>

          <section className="rounded-2xl border border-primary/40 bg-card p-5">
            <h2 className="font-display text-3xl">Check-in du jour</h2>
            <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
              <label>Fatigue (1-5)<input type="number" min={1} max={5} className={field} value={ci.fatigue} onChange={(e) => setCi({ ...ci, fatigue: Number(e.target.value) })} /></label>
              <label>Sommeil (h)<input type="number" min={3} max={10} className={field} value={ci.sommeil} onChange={(e) => setCi({ ...ci, sommeil: Number(e.target.value) })} /></label>
              <label>Temps (min)<input type="number" min={15} max={90} className={field} value={ci.temps} onChange={(e) => setCi({ ...ci, temps: Number(e.target.value) })} /></label>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {ZONES.map(([v, l]) => (
                <button key={v} className={chip(ci.douleur === v)} onClick={() => setCi({ ...ci, douleur: ci.douleur === v ? undefined : v })}>
                  Douleur {l.toLowerCase()}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["full body", "haut", "jambes", "cardio"].map((v) => (
                <button key={v} className={chip(envie === v)} onClick={() => setEnvie(envie === v ? null : v)}>
                  Envie : {v}
                </button>
              ))}
            </div>
            <button
              disabled={iaEnCours}
              onClick={() => void demanderIA()}
              className="mt-4 rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground disabled:opacity-60"
            >
              {iaEnCours ? "L'IA adapte ta séance…" : "Adapter ma séance avec l'IA"}
            </button>
            {erreur && <p className="mt-3 text-sm text-destructive">{erreur}</p>}
            {ia && (
              <div className="mt-4 rounded-xl border border-primary/40 p-4 text-sm">
                <p className="font-semibold text-primary">{ia.justification}</p>
                <ul className="mt-2 space-y-1">
                  {((ia.seance as { exercices?: { nom: string; series?: number; reps?: string }[] })?.exercices ?? []).map((e, i) => (
                    <li key={i}>{e.nom} — {e.series && e.series > 1 ? `${e.series} × ${e.reps ?? ""}` : (e.reps ?? "")}</li>
                  ))}
                </ul>
              </div>
            )}
            {adapte && !ia && (
              <div className="mt-4 text-sm">
                <p className="text-muted-foreground">{adapte.notes.join(" ") || "Séance inchangée."}</p>
                <ul className="mt-2 space-y-1">
                  {adapte.seance.exercices.map((e, i) => (
                    <li key={i}>{e.nom} — {e.series > 1 ? `${e.series} × ${e.reps}` : e.reps}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
          <button className={chip(false)} onClick={() => { setEtape(0); }}>Modifier mes réponses</button>
        </div>
      )}
    </main>
  );
}
