import { NavLink, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Navbar({ user }) {
  const nav = useNavigate();

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore errors, just continue logout UX
    }
    nav("/login");
  }

  const linkBase =
    "text-xs font-medium px-3 py-1.5 rounded-xl transition";
  const linkActive = "bg-slate-900 text-slate-100";
  const linkInactive = "text-slate-300 hover:bg-slate-900/60";

  return (
    <header className="fixed top-0 left-0 right-0 z-20 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-skyaqua/20 flex items-center justify-center border border-skyaqua/50">
            <span className="text-[11px] text-skyaqua font-semibold">
              RL
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">
              RoamLog
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">
              Plan trips. Capture memories.
            </p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Profile
          </NavLink>
        </nav>

        {/* User + logout */}
        <div className="flex items-center gap-2">
          {user && (
            <span className="hidden sm:inline text-[11px] text-slate-400">
              {user.username}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-[11px] px-3 py-1.5 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-900/70 transition"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}