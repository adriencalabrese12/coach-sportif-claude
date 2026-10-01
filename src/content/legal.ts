/** Informations légales à compléter par l'éditeur avant la mise en production. */
const TODO = (s: string) => `[À COMPLÉTER : ${s}]`;

export const LEGAL = {
  editeur: TODO("raison sociale ou nom de l'éditeur"),
  forme: TODO("forme juridique, capital"),
  adresse: TODO("adresse postale"),
  siret: TODO("SIRET / RCS"),
  tva: TODO("numéro de TVA intracommunautaire, si applicable"),
  email: TODO("e-mail de contact"),
  directeur: TODO("directeur de la publication"),
  hebergeur: TODO("nom et adresse de l'hébergeur"),
  mediateur: TODO("coordonnées du médiateur de la consommation"),
  dpo: TODO("contact RGPD / DPO"),
  maj: "1er octobre 2026",
};

export interface LegalSection {
  h2: string;
  p: string[];
}

export const MENTIONS: LegalSection[] = [
  {
    h2: "Éditeur du site",
    p: [
      `Le site Coach.Pro est édité par ${LEGAL.editeur} (${LEGAL.forme}), ${LEGAL.adresse}. ${LEGAL.siret}. ${LEGAL.tva}.`,
      `Contact : ${LEGAL.email}. Directeur de la publication : ${LEGAL.directeur}.`,
    ],
  },
  { h2: "Hébergement", p: [`Le site est hébergé par ${LEGAL.hebergeur}.`] },
  {
    h2: "Propriété intellectuelle",
    p: [
      "Les textes, programmes, images et éléments graphiques du site sont protégés. Toute reproduction sans autorisation écrite préalable est interdite.",
    ],
  },
  {
    h2: "Avertissement santé",
    p: [
      "Coach.Pro fournit des programmes d'entraînement à titre informatif. Ils ne remplacent pas l'avis d'un médecin. Consulte un professionnel de santé avant de débuter, en particulier en cas de pathologie, de blessure ou de grossesse. Aucun résultat n'est garanti.",
    ],
  },
];

export const CGV: LegalSection[] = [
  {
    h2: "1. Objet",
    p: ["Les présentes conditions régissent l'abonnement aux services en ligne Coach.Pro (programmes, séances, exercices, suivi)."],
  },
  {
    h2: "2. Offres et prix",
    p: [
      "Trois offres mensuelles sont proposées : Découverte, Essentiel et Premium. Les prix affichés sur la page Tarifs, en euros toutes taxes comprises, sont ceux en vigueur au moment de la commande ; le prix facturé est celui de l'offre Stripe sélectionnée.",
    ],
  },
  {
    h2: "3. Paiement",
    p: [
      "Le paiement est traité par Stripe, prestataire de paiement sécurisé. Coach.Pro n'a jamais accès à tes numéros de carte. L'abonnement est reconduit tacitement chaque mois jusqu'à résiliation.",
    ],
  },
  {
    h2: "4. Résiliation et changement d'offre",
    p: [
      "L'abonnement est sans engagement. Tu peux changer d'offre ou résilier à tout moment depuis le portail client (bouton « Gérer mon abonnement »). La résiliation prend effet à la fin de la période déjà payée.",
    ],
  },
  {
    h2: "5. Droit de rétractation",
    p: [
      "Conformément au Code de la consommation, tu disposes de 14 jours pour te rétracter. Si tu demandes l'accès immédiat au contenu numérique, tu reconnais perdre ce droit une fois le service pleinement exécuté, ou, pour une exécution partielle, être redevable de la part consommée.",
    ],
  },
  {
    h2: "6. Responsabilité",
    p: [
      "Les programmes sont des recommandations générales. Tu t'entraînes sous ta responsabilité et t'engages à fournir des informations exactes. Coach.Pro ne garantit aucun résultat physique ou de santé.",
    ],
  },
  {
    h2: "7. Médiation et droit applicable",
    p: [
      `En cas de litige, tu peux recourir gratuitement au médiateur de la consommation : ${LEGAL.mediateur}. Les présentes conditions sont soumises au droit français.`,
    ],
  },
];

export const CONFIDENTIALITE: LegalSection[] = [
  {
    h2: "Responsable du traitement",
    p: [`${LEGAL.editeur}, ${LEGAL.adresse}. Contact : ${LEGAL.dpo}.`],
  },
  {
    h2: "Quelles données sont collectées ?",
    p: [
      "Compte : adresse e-mail et mot de passe (chiffré). Profil sportif : prénom, sexe, âge, taille, poids, objectif, niveau, disponibilité, matériel. Informations de santé que tu déclares (blessures, pathologies) : elles sont traitées uniquement avec ton consentement explicite, pour adapter tes séances. Abonnement : offre, statut, identifiants Stripe (pas de numéro de carte). Avis : note et commentaire.",
    ],
  },
  {
    h2: "Pourquoi et sur quelle base légale ?",
    p: [
      "Fournir le service et ton programme (exécution du contrat) ; gérer le paiement et la facturation (obligation légale et contrat) ; adapter les séances à ta santé (consentement explicite) ; sécuriser le service (intérêt légitime).",
    ],
  },
  {
    h2: "Avec qui les données sont-elles partagées ?",
    p: [
      "Avec nos prestataires : Supabase (base de données et authentification), Stripe (paiement) et un prestataire d'IA pour adapter ta séance du jour (les données envoyées se limitent à la séance et à ton check-in). Elles ne sont pas vendues.",
    ],
  },
  {
    h2: "Combien de temps sont-elles conservées ?",
    p: [
      "Tant que ton compte est actif, puis supprimées ou anonymisées dans un délai raisonnable après sa clôture, sauf obligations légales (factures : 10 ans).",
    ],
  },
  {
    h2: "Quels sont tes droits ?",
    p: [
      `Tu peux accéder à tes données, les rectifier, les effacer, t'opposer à leur traitement, demander leur portabilité et retirer ton consentement à tout moment en écrivant à ${LEGAL.dpo}. Tu peux aussi introduire une réclamation auprès de la CNIL (cnil.fr).`,
    ],
  },
];

export const COOKIES: LegalSection[] = [
  {
    h2: "Quels cookies et traceurs utilisons-nous ?",
    p: [
      "Ce site n'utilise ni cookie publicitaire ni outil de mesure d'audience. Il utilise uniquement le stockage local de ton navigateur, strictement nécessaire : maintien de ta session de connexion et mémorisation de quelques préférences du questionnaire.",
      "Ces traceurs essentiels ne nécessitent pas de consentement. Les polices de caractères sont servies depuis ce site, sans appel à un service tiers.",
    ],
  },
  {
    h2: "Et sur la page de paiement ?",
    p: [
      "Le paiement a lieu sur le site sécurisé de Stripe, qui peut déposer ses propres cookies nécessaires à la prévention de la fraude. Consulte la politique de Stripe pour plus d'informations.",
    ],
  },
  {
    h2: "Comment gérer ou supprimer ces données ?",
    p: [
      "Tu peux effacer le stockage local depuis les réglages de ton navigateur ou en te déconnectant. Si nous ajoutons un jour des outils de mesure d'audience ou de publicité, un bandeau te demandera ton accord avant tout dépôt, et tu pourras le modifier à tout moment.",
    ],
  },
];
