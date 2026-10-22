import {
  CalendarDays,
  FileText,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
  Video,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import nukleusLogo from "../../assets/nukleus-logo.png";
import useAuth from "../../hooks/useAuth";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Users", path: "/users", icon: Users },
  { name: "Meetings", path: "/meetings", icon: CalendarDays },
  { name: "Recordings", path: "/recordings", icon: Video },
  { name: "Notes", path: "/notes", icon: FileText },
  { name: "AI Summaries", path: "/summaries", icon: Sparkles },
  { name: "Settings", path: "/settings", icon: Settings },
];

function Sidebar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 px-4 py-5 text-white">
      <div className="mb-8 flex items-center gap-3 px-2">
        <img
          src={nukleusLogo}
          alt="Nukleus logo"
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 object-contain"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-200">
            NukleusVerse
          </p>
          <h1 className="text-base font-semibold leading-5">Admin Panel</h1>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-violet-600 text-white shadow-sm shadow-violet-950/30"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white",
                ].join(" ")
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-3">
        <div>
          <p className="text-xs text-slate-500">Signed in as</p>
          <p className="truncate text-sm font-medium text-slate-200">
            {user?.email || "Admin"}
          </p>
        </div>
        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          onClick={handleLogout}
          type="button"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
