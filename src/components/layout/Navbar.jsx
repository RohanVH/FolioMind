import { Link, NavLink } from "react-router-dom";
import { Menu, MoonStar, SunMedium, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
  { to: "/certificates", label: "Certificates" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
  { to: "/assistant", label: "AI Assistant" }
];

export const Navbar = () => {
  const { mode, toggleMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto w-full max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-lg font-semibold tracking-wide text-primary transition hover:border-primary/50 hover:bg-primary/15 sm:text-xl"
          >
            FolioMind
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/login"
              className="hidden rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:border-primary/60 hover:bg-primary/15 hover:text-white md:inline-flex"
            >
              Login
            </Link>
            <button
              type="button"
              onClick={toggleMode}
              className="rounded-lg border border-white/20 p-2 text-slate-200 transition hover:border-white/40 hover:text-white"
              aria-label="Toggle theme"
            >
              {mode === "dark" ? <SunMedium size={18} /> : <MoonStar size={18} />}
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="rounded-lg border border-white/20 p-2 text-slate-200 transition hover:border-white/40 hover:text-white md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <div className="mt-3 hidden gap-3 overflow-x-auto pb-1 sm:gap-5 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1 text-sm transition ${
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {isMenuOpen && (
          <div className="mt-3 grid gap-2 md:hidden">
            <Link
              to="/admin/login"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition hover:border-primary/50 hover:text-white"
            >
              Login
            </Link>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm transition ${
                    isActive ? "bg-primary/15 text-primary" : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};
