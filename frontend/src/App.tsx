import { Routes, Route } from "react-router-dom";
import NavBar from "./components/layout/Navbar";
import Homepage from "./pages/Homepage";
import NotFound from "./pages/NotFound";
import Catalogue from "./pages/Catalogue";
import Display from "./pages/Display";

const pages = ["classes", "races", "feats", "spells", "rules"];

function App() {
  return (
    <Routes>
      <Route element={<NavBar />}>
        <Route index element={<Homepage />} />

        {pages.map((page) => (
          <>
            <Route path={`/${page}`} element={<Catalogue />} />
            <Route path={`/${page}/:slug`} element={<Display />} />
            <Route path={`/${page}/:slug/:subslug`} element={<Display />} />
          </>
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
