import { Navigate, useLocation } from "react-router-dom";

import Card, { CardGrid } from "../components/Card";
import { useEffect, useState } from "react";

import api from "../api/axios.ts";
import AccentColors from "../utils/accentColors.ts";

const acceptedRoutes = ["classes", "races", "feats", "spells", "rules"];

type CatalogueItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

function Catalogue() {
  const location = useLocation().pathname.split("/").filter(Boolean);

  const kind = location.length > 0 ? location[0] : undefined;

  const [data, setData] = useState<CatalogueItem[]>([]);

  useEffect(() => {
    if (kind && acceptedRoutes.includes(kind)) {
      api
        .get(`/${kind}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => console.error(error));
    }
  }, [kind]);

  if (!kind || !acceptedRoutes.includes(kind)) {
    return <Navigate to="/*" />;
  }

  if (data.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <CardGrid>
      {data.map((elt) => (
        <Card
          key={elt.id}
          title={elt.name}
          description={elt.description}
          accentFrom={AccentColors?.[kind]?.[elt.slug]?.from ?? undefined}
          accentTo={AccentColors?.[kind]?.[elt.slug]?.to ?? undefined}
          redirect={`/${kind}/${elt.slug}`}
        />
      ))}
    </CardGrid>
  );
}

export default Catalogue;
