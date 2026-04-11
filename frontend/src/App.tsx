import { Routes, Route } from "react-router-dom";
import NavBar from "./components/layout/Navbar";
import Homepage from "./pages/Homepage";
import NotFound from "./pages/NotFound";
import Catalogue from "./pages/Catalogue";

function App() {
  return (
    <Routes>
      <Route element={<NavBar />}>
        <Route index element={<Homepage />} />

        <Route path="/classes" element={<Catalogue kind="classes" />} />
        <Route path="/classes/:slug" element={<Catalogue kind="classes" />} />

        <Route path="/races" element={<Catalogue kind="races" />} />
        <Route path="/races/:slug" element={<Catalogue kind="races" />} />

        <Route path="/feats" element={<Catalogue kind="feats" />} />
        <Route path="/feats/:slug" element={<Catalogue kind="feats" />} />

        <Route path="/spells" element={<Catalogue kind="spells" />} />
        <Route path="/spells/:slug" element={<Catalogue kind="spells" />} />

        <Route path="/rules" element={<Catalogue kind="rules" />} />
        <Route path="/rules/:slug" element={<Catalogue kind="rules" />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
