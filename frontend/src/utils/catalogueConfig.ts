export type CatalogueKind =
  | "classes"
  | "subclasses"
  | "races"
  | "feats"
  | "spells"
  | "rules";

export type CatalogueMetric = {
  label: string;
  value: string;
};

export type CatalogueItem = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  summary?: string;
  badges?: string[];
  metrics?: CatalogueMetric[];
  prerequisite?: string | null;
  level?: string;
  levelLabel?: string;
  sectionCount?: number;
  tableRowCount?: number;
  subclassCount?: number;
  parent?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  table?: {
    columns?: { key: string; label: string }[];
    rows?: { cells?: { key: string; value: string }[] }[];
  };
  sections?: {
    title: string;
    content: string;
  }[];
  subclasses?: {
    id: string;
    slug: string;
    name: string;
  }[];
};

type CatalogueConfig = {
  label: string;
  singular: string;
  intro: string;
  accent: string;
  endpoint?: string;
  emptyTitle: string;
  emptyText: string;
};

export const catalogueConfig: Record<CatalogueKind, CatalogueConfig> = {
  classes: {
    label: "Classes",
    singular: "classe",
    intro:
      "Les classes definissent la progression, les paliers et l'identite de jeu de chaque archetype.",
    accent: "from-[#2a1612] via-[#6e2f21] to-[#d17745]",
    endpoint: "/classes",
    emptyTitle: "Aucune classe pour l'instant",
    emptyText: "Ajoute une classe pour alimenter le catalogue.",
  },
  subclasses: {
    label: "Sous-classes",
    singular: "sous-classe",
    intro:
      "Les sous-classes specialisent une classe de base avec un style de jeu, des pouvoirs et une identite plus marques.",
    accent: "from-[#161b2a] via-[#30508f] to-[#77a6ff]",
    endpoint: "/subclasses",
    emptyTitle: "Aucune sous-classe pour l'instant",
    emptyText: "Ajoute une sous-classe ou rattache-en a une classe existante.",
  },
  races: {
    label: "Races",
    singular: "race",
    intro:
      "Les races regroupent les origines, traits distinctifs et morceaux de lore utiles a la creation de personnage.",
    accent: "from-[#102018] via-[#28553c] to-[#86bf88]",
    endpoint: "/races",
    emptyTitle: "Aucune race pour l'instant",
    emptyText: "Ajoute une race pour enrichir l'univers.",
  },
  feats: {
    label: "Dons",
    singular: "don",
    intro:
      "Les dons apportent des avantages specialises, des prerequis et des options de personnalisation supplementaires.",
    accent: "from-[#2a2010] via-[#7c5b1d] to-[#e8bc54]",
    endpoint: "/feats",
    emptyTitle: "Aucun don pour l'instant",
    emptyText: "Ajoute un don pour completer les options de progression.",
  },
  spells: {
    label: "Sorts",
    singular: "sort",
    intro:
      "Les sorts sont organises par niveau d'eveil pour faciliter la lecture, le filtrage et l'equilibrage du grimoire.",
    accent: "from-[#1f1638] via-[#50369a] to-[#8fa9ff]",
    endpoint: "/spells",
    emptyTitle: "Aucun sort pour l'instant",
    emptyText: "Ajoute un sort pour commencer le grimoire.",
  },
  rules: {
    label: "Regles",
    singular: "regle",
    intro:
      "Cet espace pourra accueillir les regles generales, procedures et references transverses du systeme.",
    accent: "from-[#1f1f1f] via-[#4b4b4b] to-[#bcbcbc]",
    emptyTitle: "Catalogue en preparation",
    emptyText: "La section Regles n'a pas encore de source backend dediee.",
  },
};

export function isCatalogueKind(value?: string): value is CatalogueKind {
  return Boolean(value && value in catalogueConfig);
}

export function getMetricValue(
  metrics: CatalogueMetric[] | undefined,
  label: string,
) {
  return metrics?.find((metric) => metric.label === label)?.value;
}
