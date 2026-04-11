interface CatalogueProps {
  kind: String;
}

function Catalogue({ kind }: CatalogueProps) {
  return <>{kind}</>;
}

export default Catalogue;
