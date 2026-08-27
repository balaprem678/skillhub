import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users, Settings, LogOut, Menu, X, ShieldCheck, GraduationCap, ExternalLink,
} from "lucide-react";
import { getAdminSessionFn } from "@/lib/api";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Skip auth check if on /admin/login
  const isLoginPage = location.pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("skillhub_admin_token");
    if (!token) {
      setAuthenticated(false);
      setLoading(false);
      navigate({ to: "/admin/login" });
      return;
    }

    getAdminSessionFn({ data: token })
      .then((res) => {
        if (res.authenticated) {
          setAuthenticated(true);
          setUsername(res.username || "Admin");
        } else {
          localStorage.removeItem("skillhub_admin_token");
          setAuthenticated(false);
          navigate({ to: "/admin/login" });
        }
      })
      .catch(() => {
        localStorage.removeItem("skillhub_admin_token");
        setAuthenticated(false);
        navigate({ to: "/admin/login" });
      })
      .finally(() => setLoading(false));
  }, [location.pathname, isLoginPage, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("skillhub_admin_token");
    setAuthenticated(false);
    navigate({ to: "/admin/login" });
  };

  if (isLoginPage) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-400">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Enquiries", href: "/admin/enquiries", icon: Users },
    { label: "Settings & SMTP", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900 lg:flex">
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
          <Link to="/admin" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-lg shadow-teal-500/20">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <span className="font-display font-bold text-base tracking-tight text-white">SkillHub</span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-teal-400">Admin Control</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1.5 p-4">
          {navItems.map((item) => {
            const active = location.pathname === item.href || (item.href !== "/admin" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-teal-500/15 font-semibold text-teal-400 border border-teal-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <item.icon className={`h-5 w-5 ${active ? "text-teal-400" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <span>Visit Live Website</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex bg-slate-950/80 backdrop-blur-sm lg:hidden">
          <div className="w-72 border-r border-slate-800 bg-slate-900 p-4 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-teal-400" />
                  <span className="font-bold text-white">SkillHub Admin</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800"
                  >
                    <item.icon className="h-5 w-5 text-teal-400" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-400"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* HEADER */}
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 backdrop-blur-md sm:px-6">
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden">
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden lg:block text-xs font-medium text-slate-400">
            Welcome back, <span className="font-semibold text-teal-400">{username}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Authenticated Admin
            </span>
          </div>
        </header>

        {/* CONTENT BODY */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
