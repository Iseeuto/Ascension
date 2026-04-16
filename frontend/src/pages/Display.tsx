import { useLocation } from "react-router-dom";

function Display() {
  const location = useLocation().pathname.split("/").filter(Boolean);

  const kind = location.length > 0 ? location[0] : undefined;
  const slug = location.length > 1 ? location[1] : undefined;
  const subSlug = location.length > 2 ? location[2] : undefined;

  return <h1>Display</h1>;
}

export default Display;
