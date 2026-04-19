import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios.ts";
import type { CatalogueItem } from "../../utils/catalogueConfig.ts";

function Sidebar() {
  const segments = useLocation().pathname.split("/").filter(Boolean);
  const kind = segments[0];
  const slug = segments[1];
  const subSlug = segments[2];

  const [items, setItems] = useState<CatalogueItem[]>([]);

  useEffect(() => {
    if (kind !== "classes" || !slug) {
      setItems([]);
      return;
    }

    api
      .get(`/classes/slug/${slug}/subclasses`)
      .then((response) => setItems(response.data))
      .catch(() => setItems([]));
  }, [kind, slug]);

  return (
    <aside
      className="
        h-full
        w-full
        bg-neutral-900
        p-4 text-white
        md:sticky md:top-0
      "
    >
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-stone-400">
        Navigation
      </p>

      {kind === "classes" && items.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-white/80">Sous-classes</p>
          {items.map((item) => (
            <NavLink
              key={item.id}
              to={`/classes/${slug}/${item.slug}`}
              className={({ isActive }) =>
                [
                  "block rounded-xl px-3 py-2 text-sm transition",
                  isActive || subSlug === item.slug
                    ? "bg-white text-stone-950"
                    : "bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white",
                ].join(" ")
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-6 text-stone-400">
          Les elements lies apparaitront ici pour faciliter la navigation detaillee.
        </p>
      )}
    </aside>
  );
}

export default Sidebar;
