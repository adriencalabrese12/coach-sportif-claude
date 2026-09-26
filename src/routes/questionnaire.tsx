import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { adapterSeance as adapterSeanceIA } from "@/lib/adapter-seance.functions";
import {
  adapterSeance,
  analyser,
  fmtQ,
  genererNutrition,
  genererProgramme,
  LABEL_REPAS,
  noteMorpho,
  type CheckIn,
  type Equipement,
  type Morphologie,
  type Niveau,
  type Objectif,
  type Profil,
  type Zone,
} from "@/lib/coach";

export const Route = createFileRoute("/questionnaire")({
  head: () => ({
    meta: [
      { title: "Mon espace — Coach Sportif Personnalisé" },
      { name: "description", content: "Ton profil, ton programme, ton plan nutritionnel et ton check-in du jour." },
    ],
  }),
  component: Questionnaire,
});

type Opt<T> = [T, string, string?];
const OBJECTIFS: Opt<Objectif>[] = [
  ["perte", "Perte de poids"], ["muscle", "Prise de muscle"], ["performance", "Performance"],
  ["reprise", "Reprise"], ["explosivite", "Explosivité"], ["maintien", "Maintien en forme"],
];
const NIVEAUX: Opt<Niveau>[] = [["debutant", "Débutant"], ["intermediaire", "Intermédiaire"], ["avance", "Avancé"]];
const EQUIP: Opt<Equipement>[] = [
  ["aucun", "Aucun matériel"], ["halteres", "Haltères"], ["elastiques", "Élastiques"], ["barre", "Barre + banc"],
  ["kettlebell", "Kettlebell"], ["corde", "Corde à sauter"], ["ballon", "Ballon"], ["salle", "Salle complète"], ["cardio", "Cardio (rameur…)"],
];
const ZONES: Opt<Zone>[] = [["epaule", "Épaule"], ["genou", "Genou"], ["dos", "Dos"], ["poignet", "Poignet"], ["cheville", "Cheville"]];
const PATHO = ["Cardiaque", "Diabète", "Hypertension", "Asthme", "Grossesse / post-partum"];
const ACTIVITE: Opt<Profil["activite"]>[] = [[1.2, "Sédentaire"], [1.375, "Légèrement actif"], [1.55, "Modérément actif"], [1.725, "Très actif"]];
const MORPHO: Opt<Morphologie>[] = [
  ["ectomorphe", "Ectomorphe", "Mince, prend peu de poids, épaules et hanches étroites"],
  ["mesomorphe", "Mésomorphe", "Athlétique, prend du muscle facilement"],
  ["endomorphe", "Endomorphe", "Corpulence forte, prend du poids facilement"],
];
const REGIMES: Opt<Profil["regime"]>[] = [
  ["omnivore", "Omnivore"], ["flexitarien", "Flexitarien"], ["halal", "Halal (sans porc)"], ["pescetarien", "Pescétarien"],
  ["vegetarien", "Végétarien"], ["vegan", "Vegan"],
];
const ALLERGIES: Opt<Profil["allergies"][number]>[] = [
  ["gluten", "Gluten"], ["lactose", "Lactose"], ["oeufs", "Œufs"], ["arachides", "Arachides"], ["poisson", "Poisson"], ["soja", "Soja"],
];
const PETITDEJ: Opt<Profil["petitDej"]>[] = [["sucre", "Sucré"], ["sale", "Salé"], ["indifferent", "Peu importe"]];
const REPAS: Opt<Profil["repasParJour"]>[] = [[3, "3 repas"], [4, "4 repas"], [5, "5 repas"]];
const ZONE_LABEL: Record<Zone, string> = { epaule: "épaule", genou: "genou", dos: "dos", poignet: "poignet", cheville: "cheville" };

const INIT: Profil = {
  prenom: "", sexe: "H", age: 30, taille: 175, poids: 75, morphologies: ["mesomorphe"], objectifs: ["maintien"],
  niveau: "debutant", jours: 3, duree: 45, equipement: [], blessures: [], pathologies: [], activite: 1.375,
  regime: "omnivore", allergies: [], petitDej: "indifferent", repasParJour: 4,
};
type Extras = Pick<Profil, "morphologies" | "objectifs" | "regime" | "allergies" | "petitDej" | "repasParJour">;

const chip = (on: boolean) =>
  `rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
    on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40"
  }`;
const field = "w-full rounded-lg border border-input bg-background px-3 py-2";
const label = "text-sm text-muted-foreground";

function Choix<T extends string | number>({ opts, val, onPick }: { opts: Opt<T>[]; val: T; onPick: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {opts.map(([v, l]) => (
        <button key={String(v)} className={chip(val === v)} onClick={() => onPick(v)}>{l}</button>
      ))}
    </div>
  );
}

/** Choix multiple. `aucun` ajoute « Aucun(e) » (liste vide) ; `max` limite le nombre ; `min1` interdit la liste vide. */
function Multi<T extends string>({
  opts, val, onChange, aucun, max, min1, colonnes,
}: { opts: Opt<T>[]; val: T[]; onChange: (v: T[]) => void; aucun?: string; max?: number; min1?: boolean; colonnes?: boolean }) {
  const clic = (v: T) => {
    if (val.includes(v)) {
      const n = val.filter((x) => x !== v);
      if (!(min1 && n.length === 0)) onChange(n);
    } else {
      const n = [...val, v];
      onChange(max && n.length > max ? n.slice(n.length - max) : n);
    }
  };
  return (
    <div className={colonnes ? "grid gap-2 sm:grid-cols-3" : "flex flex-wrap gap-2"}>
      {aucun && <button className={chip(val.length === 0)} onClick={() => onChange([])}>{aucun}</button>}
      {opts.map(([v, l, d]) => (
        <button key={v} className={`${chip(val.includes(v))} ${d ? "text-left" : ""}`} onClick={() => clic(v)}>
          <span className="block">{l}</span>
          {d && <span className="block text-xs font-normal opacity-80">{d}</span>}
        </button>
      ))}
    </div>
  );
}

function Questionnaire() {
  const [p, setP] = useState<Profil>(INIT);
  const [etape, setEtape] = useState(0);
  const [ci, setCi] = useState<CheckIn>({ fatigue: 2, sommeil: 7, temps: 45 });
  const [envie, setEnvie] = useState<string | null>(null);
  const [ia, setIa] = useState<{ seance: unknown; justification: string } | null>(null);
  const [iaEnCours, setIaEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [fin, setFin] = useState({ idx: 0, rpe: 6, ressenti: "ok" });
  const [info, setInfo] = useState<string | null>(null);
  const session = useSession();
  const set = <K extends keyof Profil>(k: K, v: Profil[K]) => setP((x) => ({ ...x, [k]: v }));
  const num = (k: "age" | "taille" | "poids" | "jours" | "duree") => (e: React.ChangeEvent<HTMLInputElement>) => set(k, Number(e.target.value));

  useEffect(() => {
    if (session === null) window.location.replace("/connexion");
  }, [session]);

  // Champs sans colonne en base : mémorisés localement.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("extras");
      if (raw) setP((x) => ({ ...x, ...(JSON.parse(raw) as Partial<Extras>) }));
    } catch { /* stockage indisponible */ }
  }, []);
  useEffect(() => {
    const e: Extras = { morphologies: p.morphologies, objectifs: p.objectifs, regime: p.regime, allergies: p.allergies, petitDej: p.petitDej, repasParJour: p.repasParJour };
    try { localStorage.setItem("extras", JSON.stringify(e)); } catch { /* ignore */ }
  }, [p.morphologies, p.objectifs, p.regime, p.allergies, p.petitDej, p.repasParJour]);

  // Reprend le profil enregistré : un profil existant ouvre directement « Mon plan ».
  useEffect(() => {
    if (!session) return;
    void supabase.from("profiles").select("*").eq("user_id", session.user.id).maybeSingle().then(({ data: d }) => {
      if (!d) return;
      let extras: Partial<Extras> = {};
      try { extras = JSON.parse(localStorage.getItem("extras") ?? "{}") as Partial<Extras>; } catch { /* ignore */ }
      setP((x) => ({
        ...x,
        prenom: d.prenom ?? x.prenom,
        sexe: (d.sexe as Profil["sexe"]) ?? x.sexe,
        age: d.age ?? x.age,
        taille: Number(d.taille ?? x.taille),
        poids: Number(d.poids ?? x.poids),
        objectifs: [(d.objectif as Objectif) ?? x.objectifs[0]!],
        niveau: (d.niveau as Niveau) ?? x.niveau,
        jours: d.jours ?? x.jours,
        duree: d.duree ?? x.duree,
        equipement: d.equipement as Equipement[],
        blessures: d.blessures as Zone[],
        pathologies: d.pathologies,
        activite: (Number(d.activite) || x.activite) as Profil["activite"],
        ...extras,
      }));
      setCi((c) => ({ ...c, temps: d.duree ?? c.temps }));
      setEtape((e) => (e === 0 ? 5 : e));
    });
  }, [session]);

  async function terminer() {
    setEtape(5);
    if (!session) return;
    setErreur(null);
    const { error } = await supabase.from("profiles").upsert({
      user_id: session.user.id, prenom: p.prenom, sexe: p.sexe, age: p.age, taille: p.taille, poids: p.poids,
      objectif: p.objectifs[0] ?? "maintien", niveau: p.niveau, jours: p.jours, duree: p.duree,
      equipement: p.equipement, blessures: p.blessures, pathologies: p.pathologies,
      activite: String(p.activite), updated_at: new Date().toISOString(),
    });
    if (error) return setErreur("Profil non enregistré : " + error.message);
    const { error: e2 } = await supabase.from("programs").insert({ user_id: session.user.id, seances: JSON.parse(JSON.stringify(genererProgramme(p))) });
    if (e2) setErreur("Programme non enregistré : " + e2.message);
    else setInfo("Profil et programme enregistrés.");
  }

  const fini = etape === 5;
  const analyse = useMemo(() => (fini ? analyser(p) : null), [fini, p]);
  const programme = useMemo(() => (fini ? genererProgramme(p) : []), [fini, p]);
  const nutrition = useMemo(() => (analyse ? genererNutrition(p, analyse) : null), [analyse, p]);
  const adapte = useMemo(() => (fini && programme[0] ? adapterSeance(programme[0], ci, p) : null), [fini, programme, ci, p]);

  async function demanderIA() {
    if (!programme[0] || !session) return;
    setIaEnCours(true);
    setErreur(null);
    setIa(null);
    try {
      const checkin = { fatigue: ci.fatigue, sommeil: ci.sommeil, temps: ci.temps, douleur: ci.douleur ?? null, envie };
      const res = await adapterSeanceIA({ data: { seance: programme[0], checkin: checkin as never } });
      setIa({ seance: res.seance, justification: res.justification });
    } catch {
      // IA indisponible : adaptation par règles.
      if (adapte) setIa({ seance: adapte.seance, justification: `IA indisponible, règles automatiques appliquées. ${adapte.notes.join(" ")}` });
    }
    await supabase.from("checkins").insert({
      user_id: session.user.id, fatigue: ci.fatigue, sommeil: ci.sommeil, temps: ci.temps, douleur: ci.douleur ?? null, envie,
    });
    setIaEnCours(false);
  }

  async function enregistrerSeance() {
    const s = programme[fin.idx];
    if (!s || !session) return;
    const { error } = await supabase.from("session_logs").insert({
      user_id: session.user.id, seance_titre: `${s.jour} — ${s.titre} (${fin.ressenti})`, kcal: s.kcal, rpe: fin.rpe,
    });
    setInfo(error ? "Séance non enregistrée : " + error.message : "Séance enregistrée, bravo !");
  }

  function exporter(section: "programme" | "menu" | "courses") {
    document.body.dataset["print"] = section;
    const nettoyer = () => { delete document.body.dataset["print"]; window.removeEventListener("afterprint", nettoyer); };
    window.addEventListener("afterprint", nettoyer);
    window.print();
  }
  const texteCourses = () =>
    (nutrition?.courses ?? []).map((c) => `${c.rayon}\n${c.items.map((i) => `- ${i.n} : ${fmtQ(i)}`).join("\n")}`).join("\n\n");
  async function copierCourses() {
    try { await navigator.clipboard.writeText(texteCourses()); setInfo("Liste de courses copiée : colle-la dans tes Notes."); }
    catch { setInfo("Copie impossible : utilise le téléchargement."); }
  }
  function telechargerCourses() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([texteCourses()], { type: "text/plain;charset=utf-8" }));
    a.download = "liste-de-courses.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (!session) return <main className="p-12 text-center text-muted-foreground">Chargement…</main>;
  const titres = ["Profil", "Objectifs", "Matériel & santé", "Alimentation", "Disponibilité"];
  const Btn = "rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:border-primary/50 no-print";

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12 sm:px-6">
      <div className="no-print flex items-center justify-between text-sm text-muted-foreground">
        <a href="/" className="hover:text-primary">← Accueil</a>
        <button className="hover:text-primary" onClick={() => void supabase.auth.signOut().then(() => window.location.replace("/connexion"))}>
          Se déconnecter
        </button>
      </div>
      <h1 className="mt-4 font-display text-5xl">{fini ? `Ton plan${p.prenom ? `, ${p.prenom}` : ""}` : "Questionnaire"}</h1>
      {info && <p className="no-print mt-2 text-sm text-primary">{info}</p>}

      {!fini && (
        <>
          <p className="mt-2 text-sm text-muted-foreground">Étape {etape + 1}/5 — {titres[etape]}</p>
          <div className="mt-6 space-y-6 rounded-2xl border border-border bg-card p-6">
            {etape === 0 && (
              <>
                <input className={field} placeholder="Prénom" value={p.prenom} onChange={(e) => set("prenom", e.target.value)} />
                <Choix opts={[["H", "Homme"], ["F", "Femme"]]} val={p.sexe} onPick={(v) => set("sexe", v)} />
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <label>Âge<input type="number" className={field} value={p.age} onChange={num("age")} /></label>
                  <label>Taille (cm)<input type="number" className={field} value={p.taille} onChange={num("taille")} /></label>
                  <label>Poids (kg)<input type="number" className={field} value={p.poids} onChange={num("poids")} /></label>
                </div>
                <p className={label}>Ta morphologie (1 ou 2 choix)</p>
                <Multi opts={MORPHO} val={p.morphologies} onChange={(v) => set("morphologies", v)} max={2} min1 colonnes />
                <p className={label}>Activité au quotidien</p>
                <Choix opts={ACTIVITE} val={p.activite} onPick={(v) => set("activite", v)} />
              </>
            )}
            {etape === 1 && (
              <>
                <p className={label}>Objectifs (1 à 3, le premier choisi est le principal)</p>
                <Multi opts={OBJECTIFS} val={p.objectifs} onChange={(v) => set("objectifs", v)} max={3} min1 />
                <p className={label}>Niveau d'entraînement</p>
                <Choix opts={NIVEAUX} val={p.niveau} onPick={(v) => set("niveau", v)} />
              </>
            )}
            {etape === 2 && (
              <>
                <p className={label}>Équipement disponible</p>
                <Multi opts={EQUIP} val={p.equipement} onChange={(v) => set("equipement", v)} aucun="Aucun" />
                <p className={label}>Blessures / douleurs</p>
                <Multi opts={ZONES} val={p.blessures} onChange={(v) => set("blessures", v)} aucun="Aucune" />
                <p className={label}>Pathologies</p>
                <Multi opts={PATHO.map((v): Opt<string> => [v, v])} val={p.pathologies} onChange={(v) => set("pathologies", v)} aucun="Aucune" />
              </>
            )}
            {etape === 3 && (
              <>
                <p className={label}>Régime alimentaire</p>
                <Choix opts={REGIMES} val={p.regime} onPick={(v) => set("regime", v)} />
                <p className={label}>Allergies / intolérances</p>
                <Multi opts={ALLERGIES} val={p.allergies} onChange={(v) => set("allergies", v)} aucun="Aucune" />
                <p className={label}>Petit-déjeuner</p>
                <Choix opts={PETITDEJ} val={p.petitDej} onPick={(v) => set("petitDej", v)} />
                <p className={label}>Nombre de repas par jour</p>
                <Choix opts={REPAS} val={p.repasParJour} onPick={(v) => set("repasParJour", v)} />
              </>
            )}
            {etape === 4 && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <label>Jours / semaine (2-6)<input type="number" min={2} max={6} className={field} value={p.jours} onChange={num("jours")} /></label>
                <label>Durée / séance (min)<input type="number" min={20} max={90} step={5} className={field} value={p.duree} onChange={num("duree")} /></label>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-between">
            <button className={chip(false)} disabled={etape === 0} onClick={() => setEtape(etape - 1)}>Retour</button>
            <button className="rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground" onClick={() => (etape === 4 ? void terminer() : setEtape(etape + 1))}>
              {etape === 4 ? "Voir mon plan" : "Suivant"}
            </button>
          </div>
        </>
      )}

      {fini && analyse && nutrition && (
        <div className="mt-6 space-y-8">
          {analyse.avisMedical && (
            <p className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm">
              Un avis médical est recommandé avant de commencer. Intensité limitée (RPE ≤ {analyse.rpeMax}).
            </p>
          )}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[["IMC", String(analyse.imc)], ["Métabolisme", `${analyse.bmr} kcal`], ["Dépense/jour", `${analyse.tdee} kcal`], ["Cible", `${analyse.kcal} kcal`]].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">{k}</p>
                <p className="font-display text-2xl text-primary">{v}</p>
              </div>
            ))}
          </section>
          <p className="text-sm text-muted-foreground">
            Macros : {analyse.macros.proteines} g protéines · {analyse.macros.lipides} g lipides · {analyse.macros.glucides} g glucides — Split : {analyse.split}
          </p>

          <section data-section="programme" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl">Programme</h2>
              <button className={Btn} onClick={() => exporter("programme")}>Exporter en PDF</button>
            </div>
            <p className="text-sm text-muted-foreground">{noteMorpho(p)}</p>
            {programme.map((s, i) => (
              <article key={i} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl">{s.jour} — {s.titre}</h3>
                  <span className="text-xs text-muted-foreground">{s.duree} min · ~{s.kcal} kcal</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {s.exercices.map((e, j) => (
                    <li key={j} className="flex justify-between gap-3 rounded-lg bg-background px-3 py-2">
                      <span>
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${e.nom} exercice technique`)}`}
                          target="_blank" rel="noreferrer"
                          className="font-bold underline decoration-primary/40 hover:text-primary"
                        >{e.nom}</a>{" "}
                        <span className="text-muted-foreground">{e.muscles}</span>
                      </span>
                      <span className="shrink-0 text-right text-primary">
                        {e.series > 1 ? `${e.series} × ${e.reps}` : e.reps}
                        {e.charge && <span className="block text-xs text-muted-foreground">{e.charge}</span>}
                        {e.repos > 0 && <span className="block text-xs text-muted-foreground">repos {e.repos} s</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
            <p className="text-xs text-muted-foreground">Charges = estimation de départ selon ton poids et ton niveau : choisis un poids qui te laisse 2 répétitions en réserve.</p>
          </section>

          <section data-section="menu" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl">Plan nutritionnel</h2>
              <button className={Btn} onClick={() => exporter("menu")}>Exporter en PDF</button>
            </div>
            <p className="text-sm text-muted-foreground">
              Cible {analyse.kcal} kcal/jour · {p.repasParJour} repas · eau {nutrition.eau} L/jour. Quantités indiquées à l'état cru ou tel qu'acheté.
            </p>
            {nutrition.manque.map((m) => <p key={m} className="text-sm text-destructive">{m}</p>)}
            <div className="grid gap-4 md:grid-cols-2">
              {nutrition.jours.map((j) => (
                <article key={j.jour} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-2xl">{j.jour}</h3>
                    <span className="text-xs text-muted-foreground">{j.kcal} kcal</span>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm">
                    {j.repas.map((r, k) => (
                      <li key={k} className="rounded-lg bg-background px-3 py-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{LABEL_REPAS[r.repas]} · {r.kcal} kcal</p>
                        <p>{r.nom}</p>
                        <p className="text-xs text-muted-foreground">{r.ingredients.map((i) => `${i.n} ${fmtQ(i)}`).join(" · ")}</p>
                        <p className="text-xs text-muted-foreground">P {r.p} g · G {r.g} g · L {r.l} g</p>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section data-section="courses" className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-3xl">Liste de courses (7 jours)</h2>
              <div className="flex gap-2">
                <button className={Btn} onClick={() => void copierCourses()}>Copier (Notes)</button>
                <button className={Btn} onClick={telechargerCourses}>Télécharger .txt</button>
                <button className={Btn} onClick={() => exporter("courses")}>PDF</button>
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {nutrition.courses.map((c) => (
                <div key={c.rayon}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">{c.rayon}</h3>
                  <ul className="mt-1 space-y-0.5 text-sm">
                    {c.items.map((i) => <li key={i.n}>☐ {i.n} — {fmtQ(i)}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="no-print rounded-2xl border border-primary/40 bg-card p-5">
            <h2 className="font-display text-3xl">Check-in du jour</h2>
            <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
              <label>Fatigue (1-5)<input type="number" min={1} max={5} className={field} value={ci.fatigue} onChange={(e) => setCi({ ...ci, fatigue: Number(e.target.value) })} /></label>
              <label>Sommeil (h)<input type="number" min={3} max={10} className={field} value={ci.sommeil} onChange={(e) => setCi({ ...ci, sommeil: Number(e.target.value) })} /></label>
              <label>Temps dispo pour la séance (min)<input type="number" min={15} max={90} className={field} value={ci.temps} onChange={(e) => setCi({ ...ci, temps: Number(e.target.value) })} /></label>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {ZONES.map(([v]) => (
                <button key={v} className={chip(ci.douleur === v)} onClick={() => setCi({ ...ci, douleur: ci.douleur === v ? undefined : v })}>
                  Douleur {ZONE_LABEL[v]}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["full body", "haut", "jambes", "cardio"].map((v) => (
                <button key={v} className={chip(envie === v)} onClick={() => setEnvie(envie === v ? null : v)}>Envie : {v}</button>
              ))}
            </div>
            <button disabled={iaEnCours} onClick={() => void demanderIA()} className="mt-4 rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground disabled:opacity-60">
              {iaEnCours ? "Adaptation en cours…" : "Adapter ma séance"}
            </button>
            {erreur && <p className="mt-3 text-sm text-destructive">{erreur}</p>}
            {ia ? (
              <div className="mt-4 rounded-xl border border-primary/40 p-4 text-sm">
                <p className="font-semibold text-primary">{ia.justification}</p>
                <ul className="mt-2 space-y-1">
                  {((ia.seance as { exercices?: { nom: string; series?: number; reps?: string }[] })?.exercices ?? []).map((e, i) => (
                    <li key={i}>{e.nom} — {e.series && e.series > 1 ? `${e.series} × ${e.reps ?? ""}` : (e.reps ?? "")}</li>
                  ))}
                </ul>
              </div>
            ) : (
              adapte && (
                <div className="mt-4 text-sm">
                  <p className="text-muted-foreground">{adapte.notes.join(" ") || "Séance inchangée."}</p>
                </div>
              )
            )}
          </section>

          <section className="no-print rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-3xl">Fin de séance</h2>
            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
              <label>Séance
                <select className={field} value={fin.idx} onChange={(e) => setFin({ ...fin, idx: Number(e.target.value) })}>
                  {programme.map((s, i) => <option key={i} value={i}>{s.jour} — {s.titre}</option>)}
                </select>
              </label>
              <label>Difficulté ressentie (1-10)
                <input type="number" min={1} max={10} className={field} value={fin.rpe} onChange={(e) => setFin({ ...fin, rpe: Number(e.target.value) })} />
              </label>
              <label>Ressenti
                <select className={field} value={fin.ressenti} onChange={(e) => setFin({ ...fin, ressenti: e.target.value })}>
                  <option value="facile">Facile</option><option value="ok">Bien</option><option value="difficile">Difficile</option>
                </select>
              </label>
            </div>
            <button className="mt-4 rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground" onClick={() => void enregistrerSeance()}>
              Enregistrer ma séance
            </button>
          </section>
          <button className={`${chip(false)} no-print`} onClick={() => setEtape(0)}>Modifier mes réponses</button>
        </div>
      )}
    </main>
  );
}
