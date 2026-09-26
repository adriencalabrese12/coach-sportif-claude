# Coach Sportif — Spécification

## 1. Questionnaire
**Identité** : prénom, sexe, âge, taille (cm), poids (kg), % masse grasse (optionnel), tour de taille.
**Morphologie** : ectomorphe / mésomorphe / endomorphe ; répartition graisse (haut/bas/abdo).
**Objectif** : Perte de poids / Prise de muscle / Performance / Reprise / Explosivité / Maintien. Objectif chiffré (kg, délai).
**Niveau** : débutant / intermédiaire / avancé ; ancienneté (mois) ; sports pratiqués.
**Disponibilité** : jours/semaine (2-6), durée/séance (20-90 min), horaire.
**Équipement** : aucun / haltères / élastiques / barre + banc / salle complète / cardio (tapis, vélo, rameur).
**Lieu** : maison / salle / extérieur.
**Santé** : pathologies (cardio, diabète, hypertension, asthme, autre) ; blessures (épaule, genou, dos, poignet, cheville…) ; douleurs actuelles ; grossesse/post-partum ; traitement.
**Mode de vie** : métier (sédentaire/actif), pas/jour, sommeil (h), stress (1-5).
**Nutrition** : régime (omnivore/végé/vegan/sans gluten/halal), allergies, aliments exclus, repas/jour, budget, temps de cuisine.
**Préférences** : exercices aimés/détestés, cardio vs muscu, vidéos oui/non.
**Consentement** : avertissement médical + RGPD.

## 2. Analyse du profil
- IMC = poids / taille². Métabolisme de base (Mifflin-St Jeor) : H = 10P + 6,25T − 5A + 5 ; F = … − 161.
- TDEE = BMR × facteur (1,2 sédentaire · 1,375 léger · 1,55 modéré · 1,725 intense).
- Cible kcal : perte = TDEE −15/20 % ; masse = +10 % ; maintien/perf = TDEE.
- Score niveau (0-100) : ancienneté + fréquence + tests (pompes, squats, gainage) → débutant <35 / interm. <70 / avancé.
- Drapeaux sécurité : pathologie cardio/hypertension/grossesse → avis médical obligatoire, intensité plafonnée (RPE ≤ 6) ; blessure → exclusion des exercices contre-indiqués (table `exercices.contre_indications`).
- Règles split : 2j = full body ; 3j = full body ; 4j = haut/bas ; 5-6j = push/pull/legs.
- Filtre exercices : équipement ∩ niveau ∩ ¬contre-indication ∩ préférences.

## 3. Programme sportif
Structure : `Programme → Semaines (4, progressif) → Séances → Blocs → Exercices`.
Bloc : échauffement (8 min) → principal → finisseur → retour au calme.
Exercice : nom, muscles, séries, reps, charge/RPE, tempo, repos, durée, kcal, photo/vidéo, variante facile/difficile.
| Objectif | Séries × reps | Repos | Cardio |
|---|---|---|---|
| Perte de poids | 3-4 × 12-15 + circuits | 30-45 s | HIIT 2×/sem |
| Muscle | 4 × 6-12 | 60-120 s | léger |
| Performance | 5 × 3-6 + pliométrie | 120-180 s | spécifique |
| Reprise | 2-3 × 10-12 | 60-90 s | marche 30 min |
Progression : +1 rep/sem puis +charge ; deload semaine 4 (−30 % volume).
kcal séance = MET × poids × durée(h) (muscu 5, HIIT 8-10, marche 3,5, course 9-11).
Exemple débutant 3j full body : squat 3×12 · pompes 3×10 · rowing élastique 3×12 · fentes 3×10 · gainage 3×30 s · repos 60 s · ~250 kcal.

## 4. Plan nutritionnel
- Kcal = cible du §2. Protéines 1,6-2,2 g/kg · lipides 0,8-1 g/kg · glucides = reste. Fibres 25-30 g. Eau 30-35 ml/kg.
- Répartition : 3-5 repas ; pré-séance (glucides) ; post-séance (protéines 25-40 g).
- Génération : recettes filtrées (régime, allergies, budget, temps) → combinaison optimisée sur kcal/macros ±5 %.
- Sortie : menu 7 jours, macros par repas, liste de courses, substitutions.
Exemple 2 200 kcal (muscle) : PDJ œufs + flocons + fruit (550) · Déj riz, poulet, légumes (700) · Collation skyr + amandes (300) · Dîner saumon, patate douce, brocoli (650).
Garde-fou : jamais < 1 200 kcal (F) / 1 500 (H) ; pathologie → renvoi médecin/diététicien.

## 5. IA adaptative
**Entrée quotidienne (check-in 10 s)** : fatigue (1-5), sommeil, courbatures, motivation, temps dispo, envie (full body / haut / jambes / cardio), douleur.
**Sortie** : séance du jour modifiée + justification courte.
Règles + LLM :
- Fatigue ≥4 ou sommeil <6 h → volume −30 %, RPE −2, ou mobilité/marche.
- Douleur zone X → remplacer exercices sollicitant X.
- Temps <30 min → circuit condensé (supersets).
- « Envie de full body » → réorganise la semaine sans perdre le volume hebdo par muscle.
- Séance manquée → replanification.
- Fin de semaine : bilan (RPE, charges, poids) → ajuste la semaine suivante.
Implémentation : LLM (Claude) via Edge Function ; sortie JSON validée par schéma ; les règles de sécurité du §2 s'appliquent après l'IA (jamais l'inverse).

## 6. Architecture
**Front** : React + TanStack Start + Tailwind/shadcn (Lovable). Mobile-first, PWA.
Pages : Accueil · Questionnaire (multi-étapes) · Résultat profil · Dashboard · Programme (semaine) · Séance (lecteur guidé : vidéo, timer repos) · Nutrition (menu, courses) · Check-in IA · Progression (poids, charges, graphiques) · Profil/réglages · Admin coach.
**Backend** : Lovable Cloud (Supabase) : Auth, Postgres (RLS), Storage (photos/vidéos), Edge Functions (`analyse-profil`, `generer-programme`, `generer-nutrition`, `adapter-seance`).
**Base de données** :
- `profiles`(user_id, âge, taille, poids, sexe, morpho, objectif, niveau, équipement[], lieu, régime, allergies[])
- `health_flags`(user_id, type, zone, gravité)
- `exercises`(id, nom, muscles[], équipement[], niveau, contre_indications[], met, media_url)
- `programs`(id, user_id, objectif, semaines) · `sessions`(id, program_id, jour, blocs jsonb) · `session_logs`(session_id, reps, charge, rpe, kcal, date)
- `recipes`(id, nom, kcal, p, g, l, tags[], allergènes[]) · `meal_plans`(id, user_id, semaine, menus jsonb)
- `checkins`(user_id, date, fatigue, sommeil, douleur, envie, temps) · `measurements`(user_id, date, poids, tour_taille)
**Workflow** : Inscription → Questionnaire → Analyse (règles) → Programme + Nutrition générés → Check-in quotidien → Adaptation IA → Séance → Log → Bilan hebdo → Ajustement.
**Priorités MVP** : (1) questionnaire + analyse, (2) programme, (3) séance guidée + logs, (4) nutrition, (5) IA adaptative.
