const levelLabels = {
  ASPIRANT: "Aspirant",
  EVEILLE: "Eveille",
  ASCENDANT: "Ascendant",
  TRANSCENDANT: "Transcendant",
  SUPREME: "Supreme",
  SACRE: "Sacre",
  DIVIN: "Divin",
};

function trimText(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function toSummary(value, fallback) {
  const text = trimText(value || fallback || "");

  if (!text) {
    return "";
  }

  return text.length > 160 ? `${text.slice(0, 157).trimEnd()}...` : text;
}

export function mapClassCatalogueItem(cls) {
  const subclassCount = cls.subclasses?.length ?? 0;
  const tableRowCount = cls.table?.rows?.length ?? 0;
  const sectionCount = cls.sections?.length ?? 0;

  return {
    id: cls.id,
    slug: cls.slug,
    name: cls.name,
    description: cls.description,
    summary: toSummary(cls.description, `${cls.name} propose une progression sur ${tableRowCount} niveaux.`),
    badges: ["Classe"],
    metrics: [
      { label: "Sous-classes", value: String(subclassCount) },
      { label: "Progression", value: `${tableRowCount} niveaux` },
      { label: "Sections", value: String(sectionCount) },
    ],
    sectionCount,
    tableRowCount,
    subclassCount,
  };
}

export function mapSubclassCatalogueItem(subclass) {
  const tableRowCount = subclass.table?.rows?.length ?? 0;
  const sectionCount = subclass.sections?.length ?? 0;

  return {
    id: subclass.id,
    slug: subclass.slug,
    name: subclass.name,
    description: subclass.description,
    summary: toSummary(
      subclass.description,
      `${subclass.name} etend la classe ${subclass.class?.name ?? "parente"}.`,
    ),
    badges: ["Sous-classe", subclass.class?.name].filter(Boolean),
    metrics: [
      { label: "Classe", value: subclass.class?.name ?? "-" },
      { label: "Progression", value: `${tableRowCount} niveaux` },
      { label: "Sections", value: String(sectionCount) },
    ],
    parent: subclass.class
      ? {
          id: subclass.class.id,
          name: subclass.class.name,
          slug: subclass.class.slug,
        }
      : null,
    sectionCount,
    tableRowCount,
  };
}

export function mapRaceCatalogueItem(race) {
  const sectionCount = race.sections?.length ?? 0;

  return {
    id: race.id,
    slug: race.slug,
    name: race.name,
    description: race.description,
    summary: toSummary(race.description, `${race.name} contient ${sectionCount} sections de lore et de regles.`),
    badges: ["Race"],
    metrics: [
      { label: "Sections", value: String(sectionCount) },
      { label: "Type", value: "Race" },
    ],
    sectionCount,
  };
}

export function mapFeatCatalogueItem(feat) {
  const sectionCount = feat.sections?.length ?? 0;

  return {
    id: feat.id,
    slug: feat.slug,
    name: feat.name,
    description: feat.description,
    prerequisite: feat.prerequisite,
    summary: toSummary(
      feat.description,
      feat.prerequisite ? `Prerequis : ${feat.prerequisite}.` : `${feat.name} ajoute un avantage specialise.`,
    ),
    badges: ["Don", feat.prerequisite ? "Prerequis" : null].filter(Boolean),
    metrics: [
      { label: "Prerequis", value: feat.prerequisite || "Aucun" },
      { label: "Sections", value: String(sectionCount) },
    ],
    sectionCount,
  };
}

export function mapSpellCatalogueItem(spell) {
  const levelLabel = levelLabels[spell.level] ?? spell.level;

  return {
    id: spell.id,
    slug: spell.slug,
    name: spell.name,
    description: spell.description,
    level: spell.level,
    levelLabel,
    summary: toSummary(spell.description, `${spell.name} est un sort de niveau ${levelLabel}.`),
    badges: ["Sort", levelLabel],
    metrics: [
      { label: "Niveau", value: levelLabel },
      { label: "Type", value: "Sort" },
    ],
  };
}

export { levelLabels };
