import { LogOut, Shield } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/meetings": "Meetings",
  "/recordings": "Recordings",
  "/notes": "Notes",
  "/summaries": "AI Meeting Summaries",
  "/settings": "Settings",
};

function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const title = pageTitles[location.pathname] || "NukleusVerse Admin";

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Admin Console
        </p>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 sm:flex">
          <Shield size={16} />
          <span>{user?.role || "Protected area"}</span>
        </div>
        <button
          onClick={handleLogout}
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;
