import { Navigate, useLocation } from "react-router-dom";

import Card, { CardGrid } from "../components/Card";
import { useEffect, useMemo, useState } from "react";

import api from "../api/axios.ts";
import AccentColors from "../utils/accentColors.ts";
import {
  catalogueConfig,
  isCatalogueKind,
  type CatalogueItem,
} from "../utils/catalogueConfig.ts";

function Catalogue() {
  const location = useLocation().pathname.split("/").filter(Boolean);

  const kind = location.length > 0 ? location[0] : undefined;

  const [data, setData] = useState<CatalogueItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isCatalogueKind(kind)) {
      return;
    }

    const config = catalogueConfig[kind];

    setSearch("");
    setActiveFilter("all");

    if (!config.endpoint) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    api
      .get(config.endpoint)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [kind]);

  if (!isCatalogueKind(kind)) {
    return <Navigate to="/*" />;
  }

  const config = catalogueConfig[kind];

  const availableFilters = useMemo(() => {
    const values = new Set<string>();

    data.forEach((item) => {
      if (kind === "spells" && item.levelLabel) {
        values.add(item.levelLabel);
      }

      if (kind === "subclasses" && item.parent?.name) {
        values.add(item.parent.name);
      }

      if (kind === "feats" && item.prerequisite) {
        values.add("Avec prerequis");
      }
    });

    return ["all", ...Array.from(values)];
  }, [data, kind]);

  const filteredData = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return data.filter((item) => {
      const matchesSearch =
        normalized.length === 0 ||
        item.name.toLowerCase().includes(normalized) ||
        item.summary?.toLowerCase().includes(normalized) ||
        item.parent?.name.toLowerCase().includes(normalized);

      if (!matchesSearch) {
        return false;
      }

      if (activeFilter === "all") {
        return true;
      }

      if (kind === "spells") {
        return item.levelLabel === activeFilter;
      }

      if (kind === "subclasses") {
        return item.parent?.name === activeFilter;
      }

      if (kind === "feats") {
        return activeFilter === "Avec prerequis"
          ? Boolean(item.prerequisite)
          : true;
      }

      return true;
    });
  }, [activeFilter, data, kind, search]);

  if (loading) {
    return (
      <div className="px-2 py-10 text-stone-500">
        Chargement du catalogue...
      </div>
    );
  }

  return (
    <section className="space-y-8 px-2 py-3">
      <div
        className={`overflow-hidden rounded-4xl bg-linear-to-br ${config.accent} px-6 py-8 text-white shadow-[0_28px_90px_-45px_rgba(0,0,0,0.65)] sm:px-8`}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="font-[Vecna] text-5xl tracking-[0.12em] sm:text-6xl">
              {config.label}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82 sm:text-base">
              {config.intro}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-stone-200 bg-white/85 p-5 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.5)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="w-full max-w-xl">
            <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-stone-500">
              Recherche
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Chercher une ${config.singular}...`}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-stone-400 focus:bg-white"
            />
          </label>

          {availableFilters.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {availableFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={[
                    "rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition",
                    activeFilter === filter
                      ? "bg-stone-900 text-white"
                      : "border border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300 hover:bg-white",
                  ].join(" ")}
                >
                  {filter === "all" ? "Tout" : filter}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-white/60 px-6 py-12 text-center">
          <h2 className="font-serif text-2xl text-stone-900">
            {config.emptyTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-stone-600">
            {data.length === 0
              ? config.emptyText
              : "Aucune entree ne correspond a la recherche actuelle."}
          </p>
        </div>
      ) : (
        <CardGrid>
          {filteredData.map((elt) => {
            const subtitle =
              kind === "subclasses"
                ? elt.parent?.name
                : kind === "spells"
                  ? elt.levelLabel
                  : kind === "feats"
                    ? elt.prerequisite || "Sans prerequis"
                    : undefined;

            return (
              <Card
                key={elt.id}
                eyebrow={config.singular}
                title={elt.name}
                subtitle={subtitle}
                description={elt.summary || elt.description}
                badges={elt.badges}
                accentFrom={AccentColors?.[kind]?.[elt.slug]?.from ?? "#241914"}
                accentTo={AccentColors?.[kind]?.[elt.slug]?.to ?? "#d1b37c"}
                redirect={`/${kind}/${elt.slug}`}
              />
            );
          })}
        </CardGrid>
      )}
    </section>
  );
}

export default Catalogue;
