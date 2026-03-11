import { LogOut } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/", label: "Overview" },
  { to: "/about-content", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/skills", label: "Skills" },
  { to: "/site-content", label: "Site Content" },
  { to: "/theme", label: "Theme" },
  { to: "/media", label: "Media" }
];

export const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid w-full max-w-7xl gap-6 p-4 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-white/10 bg-slate-900 p-4">
          <p className="mb-6 text-lg font-bold text-primary">FolioMind Admin</p>
          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm ${
                    isActive ? "bg-primary/20 text-primary" : "text-slate-300 hover:bg-white/5"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="space-y-4">
          <header className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900 p-4">
            <div>
              <p className="text-sm text-slate-400">Logged in as</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          </header>
          <main className="rounded-2xl border border-white/10 bg-slate-900 p-4 md:p-6">
            <Outlet />
          </main>
        </section>
      </div>
    </div>
  );
};
