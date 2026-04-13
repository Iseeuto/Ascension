import { NavLink, useLocation } from "react-router-dom";

import Card from "../components/Card";

interface CatalogueProps {
  kind: String;
}

function Catalogue({ kind }: CatalogueProps) {
  const location = useLocation().pathname.split("/").filter(Boolean);
  const hasSlug = location.length > 1;

  return (
    <NavLink to={"/classes/guerrier"}>
      <Card />
    </NavLink>
  );
}

export default Catalogue;
