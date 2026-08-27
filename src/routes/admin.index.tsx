import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, UserCheck, UserPlus, Clock, ArrowRight, RefreshCw, Mail, CheckCircle2 } from "lucide-react";
import { getEnquiriesFn } from "@/lib/api";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardOverview,
});

interface EnquiryItem {
  id: string;
  fullName: string;
  phone: string;
  course: string;
  mode: string;
  status: "New" | "Contacted" | "Enrolled" | "Closed";
  notes?: string;
  createdAt: string | Date;
}

function AdminDashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, enrolled: 0 });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("skillhub_admin_token") || "";
      const res = await getEnquiriesFn({ data: { token } });
      if (res.enquiries) {
        setEnquiries(res.enquiries.slice(0, 5));
        setStats(res.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Contacted":
        return "bg-sky-500/10 text-sky-400 border-sky-500/30";
      case "Enrolled":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Closed":
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* TOP TITLE */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Admission Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time overview of student admission enquiries and lead status
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Data
        </button>
      </div>

      {/* METRIC CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Enquiries", count: stats.total, icon: Users, color: "from-blue-500 to-indigo-600" },
          { label: "New Leads", count: stats.new, icon: Clock, color: "from-amber-500 to-orange-600" },
          { label: "Contacted", count: stats.contacted, icon: UserCheck, color: "from-sky-500 to-cyan-600" },
          { label: "Enrolled Students", count: stats.enrolled, icon: UserPlus, color: "from-emerald-500 to-teal-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{s.label}</span>
              <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-md`}>
                <s.icon className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-3 font-display text-3xl font-bold text-white">{loading ? "..." : s.count}</div>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS & NOTIFICATION BANNER */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-900 p-6 shadow-xl lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-500/20 text-teal-400">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">Google SMTP Notifications Active</h3>
              <p className="mt-1 text-xs text-slate-300">
                Whenever a student submits an admission enquiry form on the website, instant email notifications are routed to all configured admin recipient emails.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/admin/settings"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-teal-400 transition-colors"
                >
                  Configure SMTP & Recipient Emails &rarr;
                </Link>
                <Link
                  to="/admin/enquiries"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  Manage Enquiries
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <h3 className="font-display text-base font-bold text-white">Quick Actions</h3>
          <div className="mt-4 space-y-3">
            <Link
              to="/admin/enquiries"
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs font-medium text-slate-300 hover:border-teal-500/50 hover:text-white transition-all"
            >
              <span>View & Filter All Enquiries</span>
              <ArrowRight className="h-4 w-4 text-teal-400" />
            </Link>
            <Link
              to="/admin/settings"
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs font-medium text-slate-300 hover:border-teal-500/50 hover:text-white transition-all"
            >
              <span>SMTP & Email Settings</span>
              <ArrowRight className="h-4 w-4 text-teal-400" />
            </Link>
            <Link
              to="/admin/settings"
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs font-medium text-slate-300 hover:border-teal-500/50 hover:text-white transition-all"
            >
              <span>Change Admin Password</span>
              <ArrowRight className="h-4 w-4 text-teal-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* RECENT ENQUIRIES TABLE */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white">Recent Admission Leads</h3>
            <p className="text-xs text-slate-400">Latest 5 enquiry submissions</p>
          </div>
          <Link to="/admin/enquiries" className="text-xs font-semibold text-teal-400 hover:underline">
            View All ({stats.total}) &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading recent leads...</div>
        ) : enquiries.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No enquiries received yet. Submit an enquiry on the homepage to test!
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-semibold text-white">{e.fullName}</td>
                    <td className="py-3.5 px-4">
                      <a href={`tel:${e.phone}`} className="text-teal-400 hover:underline">{e.phone}</a>
                    </td>
                    <td className="py-3.5 px-4">{e.course}</td>
                    <td className="py-3.5 px-4 text-slate-400">{e.mode}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getStatusBadge(e.status)}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(e.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
