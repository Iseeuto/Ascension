import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios.ts";
import {
  catalogueConfig,
  isCatalogueKind,
  type CatalogueItem,
} from "../utils/catalogueConfig.ts";

function DisplayView({
  kind,
  slug,
  subSlug,
}: {
  kind: keyof typeof catalogueConfig;
  slug: string;
  subSlug?: string;
}) {
  const [data, setData] = useState<CatalogueItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint =
      subSlug && kind === "classes"
        ? `/subclasses/slug/${subSlug}`
        : `/` + kind + `/slug/` + slug;

    api
      .get(endpoint)
      .then((response) => setData(response.data))
      .catch((error) => {
        console.error(error);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [kind, slug, subSlug]);

  if (!isCatalogueKind(kind) || !slug) {
    return null;
  }

  if (loading) {
    return <div className="px-2 py-10 text-stone-500">Chargement...</div>;
  }

  if (!data) {
    return (
      <div className="px-2 py-10 text-stone-500">Element introuvable.</div>
    );
  }

  const config =
    catalogueConfig[subSlug && kind === "classes" ? "subclasses" : kind];

  return (
    <section className="space-y-8 px-2 py-4">
      <div className="rounded-4xl border border-stone-200 bg-white/90 p-7 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.45)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
          {config.label}
        </p>
        <h1 className="mt-3 font-[Vecna] text-5xl tracking-[0.08em] text-stone-950">
          {data.name}
        </h1>
        {data.parent?.name && (
          <p className="mt-3 text-sm uppercase tracking-[0.2em] text-stone-500">
            Lie a {data.parent.name}
          </p>
        )}
        {(data.description || data.summary) && (
          <p className="mt-5 max-w-4xl text-base leading-8 text-stone-700">
            {data.description || data.summary}
          </p>
        )}

        {data.table?.columns?.length && data.table?.rows?.length ? (
          <div className="mt-8 overflow-hidden rounded-3xl border border-stone-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-stone-200 text-left">
                <thead className="bg-stone-950 text-stone-100">
                  <tr>
                    {data.table.columns.map((column) => (
                      <th
                        key={column.key}
                        className="px-4 py-3 text-xs uppercase tracking-[0.18em]"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {data.table.rows.map((row, rowIndex) => (
                    <tr key={`${data.id}-${rowIndex}`}>
                      {data.table?.columns?.map((column) => (
                        <td
                          key={`${rowIndex}-${column.key}`}
                          className="px-4 py-3 text-sm text-stone-700"
                        >
                          {row.cells?.find((cell) => cell.key === column.key)
                            ?.value || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>

      {data.sections?.length ? (
        <div className="grid gap-5">
          {data.sections.map((section) => (
            <article
              key={section.title}
              className="rounded-3xl border border-stone-200 bg-white/85 p-6 shadow-[0_16px_50px_-40px_rgba(15,23,42,0.4)]"
            >
              <h2 className="font-serif text-2xl text-stone-900">
                {section.title}
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">
                {section.content}
              </p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function Display() {
  const location = useLocation().pathname.split("/").filter(Boolean);

  const kind = location.length > 0 ? location[0] : undefined;
  const slug = location.length > 1 ? location[1] : undefined;
  const subSlug = location.length > 2 ? location[2] : undefined;

  if (!isCatalogueKind(kind) || !slug) {
    return null;
  }

  return <DisplayView key={`${kind}-${slug}-${subSlug ?? ""}`} kind={kind} slug={slug} subSlug={subSlug} />;
}

export default Display;
