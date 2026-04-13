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
            hasSlug ? "rounded-t-3xl lg:rounded-r-3xl" : "rounded-3xl",
          ].join(" ")}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <NavLink className="max-w-2xl flex items-center gap-3" to={"/"}>
              <img
                src={logo}
                alt="Logo"
                style={{ width: "32px", height: "32px" }}
              />
              <h1 className="text-3xl font-semibold tracking-widest text-white md:text-3xl font-[Vecna]">
                Ascension
              </h1>
            </NavLink>

            <nav className="flex flex-wrap gap-3 right-0">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "rounded-full border px-4 py-2 text-base tracking-wider transition",
                      isActive
                        ? "border-neutral-600 bg-white/5 text-stone-200"
                        : "border-neutral-100/15 bg-neutral-900/25 text-stone-200 hover:border-neutral-200/40 hover:bg-white/10",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
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
              hasSlug ? "md:basis-4/6 w-full" : "w-full md:basis-4/6 mx-auto",
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
