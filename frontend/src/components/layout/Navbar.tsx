import { NavLink, Outlet, useLocation } from "react-router-dom";

import logo from "../../assets/icons/d20.svg";
import Sidebar from "./Sidebar";

const navItems = [
  { to: "/classes", label: "Classes" },
  { to: "/races", label: "Races" },
  { to: "/feats", label: "Dons" },
  { to: "/spells", label: "Sorts" },
  { to: "/rules", label: "Règles" },
];

function NavBar() {
  const location = useLocation().pathname.split("/").filter(Boolean);
  const hasSlug = location.length > 1;

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-10xl flex-col px-4 py-6 sm:px-6 lg:px-8 ">
        <header
          className={[
            "bg-neutral-950 px-5 py-4 backdrop-blur md:px-7",
            hasSlug ? "rounded-t-2xl lg:rounded-r-2xl" : "rounded-2xl",
          ].join(" ")}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            <NavLink
              className="flex items-center gap-3 justify-center md:justify-start"
              to={"/"}
            >
              <img src={logo} alt="Logo" className="w-10 h-10" />
              <h1 className="text-3xl font-semibold tracking-widest text-white md:text-3xl font-[Vecna]">
                Ascension
              </h1>
            </NavLink>

            <nav className="flex flex-wrap justify-center gap-5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "px-2 py-1 text-base tracking-wider transition border-b-2 font-semibold",
                      isActive
                        ? "border-white text-white"
                        : "border-transparent text-stone-300 hover:text-white hover:border-white/40",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="hidden md:block" />
          </div>
        </header>

        <div className="relative flex flex-1 flex-col md:flex-row">
          {hasSlug && (
            <div className="md:basis-1/6 w-full">
              <Sidebar />
            </div>
          )}

          <main
            className={[
              "p-6",
              hasSlug ? "md:basis-4/6 w-full " : "w-full md:basis-4/6 mx-auto",
              location.length > 0 ? "bg-neutral-100" : "",
            ].join(" ")}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
