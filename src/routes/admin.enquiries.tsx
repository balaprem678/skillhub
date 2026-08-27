import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  Search, Filter, Download, Trash2, Edit3, X, Check, Phone, Calendar, BookOpen, Clock, MessageSquare, AlertCircle
} from "lucide-react";
import { getEnquiriesFn, updateEnquiryStatusFn, deleteEnquiryFn } from "@/lib/server/api";

export const Route = createFileRoute("/admin/enquiries")({
  component: AdminEnquiriesModule,
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

function AdminEnquiriesModule() {
  const [loading, setLoading] = useState(true);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [editStatus, setEditStatus] = useState<"New" | "Contacted" | "Enrolled" | "Closed">("New");
  const [editNotes, setEditNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("skillhub_admin_token") || "";
      const res = await getEnquiriesFn({
        data: { token, search: search.trim(), status: statusFilter },
      });
      if (res.enquiries) {
        setEnquiries(res.enquiries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [search, statusFilter]);

  const handleOpenEdit = (e: EnquiryItem) => {
    setSelectedEnquiry(e);
    setEditStatus(e.status);
    setEditNotes(e.notes || "");
  };

  const handleUpdateStatus = async (evt: FormEvent) => {
    evt.preventDefault();
    if (!selectedEnquiry) return;
    setUpdating(true);
    setActionSuccess(null);

    try {
      const token = localStorage.getItem("skillhub_admin_token") || "";
      await updateEnquiryStatusFn({
        data: {
          token,
          id: selectedEnquiry.id,
          status: editStatus,
          notes: editNotes,
        },
      });

      setActionSuccess("Enquiry updated successfully!");
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete enquiry for "${name}"?`)) return;
    try {
      const token = localStorage.getItem("skillhub_admin_token") || "";
      await deleteEnquiryFn({ data: { token, id } });
      fetchEnquiries();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleExportCSV = () => {
    if (enquiries.length === 0) return;
    const headers = ["ID", "Full Name", "Phone", "Course", "Mode", "Status", "Notes", "Created At"];
    const rows = enquiries.map((e) => [
      e.id,
      `"${e.fullName.replace(/"/g, '""')}"`,
      `"${e.phone}"`,
      `"${e.course.replace(/"/g, '""')}"`,
      `"${e.mode.replace(/"/g, '""')}"`,
      e.status,
      `"${(e.notes || "").replace(/"/g, '""')}"`,
      new Date(e.createdAt).toISOString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `skillhub_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <div className="space-y-6 font-sans">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Admission Enquiries
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Manage callback requests, update lead statuses, and record follow-up notes
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={enquiries.length === 0}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-50"
        >
          <Download className="h-4 w-4 text-teal-400" /> Export CSV
        </button>
      </div>

      {actionSuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-xs font-semibold text-emerald-400">
          {actionSuccess}
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, phone number, or course..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-xs font-medium text-white outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-400">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-teal-400 outline-none focus:border-teal-500"
          >
            <option value="All">All Statuses</option>
            <option value="New">New Leads</option>
            <option value="Contacted">Contacted</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* DATATABLE */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-slate-600" />
            <p className="mt-2 text-xs font-semibold text-slate-400">No matching enquiries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Course</th>
                  <th className="py-3.5 px-4">Mode</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Follow-up Notes</th>
                  <th className="py-3.5 px-4">Submitted Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/40">
                    <td className="py-4 px-4 font-semibold text-white">{e.fullName}</td>
                    <td className="py-4 px-4">
                      <a href={`tel:${e.phone}`} className="inline-flex items-center gap-1 text-teal-400 font-semibold hover:underline">
                        <Phone className="h-3 w-3" /> {e.phone}
                      </a>
                    </td>
                    <td className="py-4 px-4 font-medium">{e.course}</td>
                    <td className="py-4 px-4 text-slate-400">{e.mode}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getStatusBadge(e.status)}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400 max-w-xs truncate">
                      {e.notes || <span className="text-slate-600 italic">No notes</span>}
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {new Date(e.createdAt).toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(e)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-teal-400 hover:bg-slate-700"
                      >
                        <Edit3 className="h-3.5 w-3.5" /> Edit Status
                      </button>
                      <button
                        onClick={() => handleDelete(e.id, e.fullName)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-display text-lg font-bold text-white">Update Lead Status & Notes</h3>
              <button onClick={() => setSelectedEnquiry(null)} className="rounded-lg p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Student Name:</span>
                <span className="text-white font-bold">{selectedEnquiry.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Phone:</span>
                <span className="text-teal-400 font-bold">{selectedEnquiry.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Course:</span>
                <span className="text-white">{selectedEnquiry.course}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Mode:</span>
                <span className="text-slate-300">{selectedEnquiry.mode}</span>
              </div>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Enquiry Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm font-semibold text-white outline-none focus:border-teal-500"
                >
                  <option value="New">🟡 New Lead (Unprocessed)</option>
                  <option value="Contacted">🔵 Contacted / Called Student</option>
                  <option value="Enrolled">🟢 Enrolled / Joined Batch</option>
                  <option value="Closed">⚪ Closed / Not Interested</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Follow-up Notes / Comments
                </label>
                <textarea
                  rows={4}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add notes (e.g. Called on 28th Aug, requested weekend batch info...)"
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-medium text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-teal-400 transition-colors disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
