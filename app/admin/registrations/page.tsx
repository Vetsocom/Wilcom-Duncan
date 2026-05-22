"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Download, Eye, Loader2, Search, Trash2, X } from "lucide-react";

type Registration = {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  organization?: string;
  role?: string;
  bootcampTitle?: string;
  bootcampSlug?: string;
  activityTitle?: string;
  activityId?: string;
  source: "bootcamp" | "calendar" | "project-event" | "general";
  reason?: string;
  status: "new" | "reviewed" | "accepted" | "rejected" | "waitlisted";
  notes?: string;
  createdAt?: string;
};

const statuses = ["all", "new", "reviewed", "accepted", "rejected", "waitlisted"];
const sources = ["all", "bootcamp", "calendar", "project-event", "general"];
const inputCls =
  "w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#d4af37] transition-colors";

function statusClass(status: string) {
  if (status === "new") return "bg-[#d4af37]/15 text-[#d4af37]";
  if (status === "accepted") return "bg-emerald-500/15 text-emerald-300";
  if (status === "rejected") return "bg-red-500/15 text-red-300";
  if (status === "waitlisted") return "bg-blue-500/15 text-blue-300";
  return "bg-white/10 text-gray-300";
}

export default function AdminRegistrationsPage() {
  const [items, setItems] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [source, setSource] = useState("all");
  const [bootcampSlug, setBootcampSlug] = useState("");
  const [selected, setSelected] = useState<Registration | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (status !== "all") params.set("status", status);
      if (source !== "all") params.set("source", source);
      if (search.trim()) params.set("search", search.trim());
      if (bootcampSlug.trim()) params.set("bootcampSlug", bootcampSlug.trim());
      const response = await fetch(`/api/admin/registrations?${params.toString()}`);
      const result = await response.json();
      setItems(result.success ? result.data : []);
    } catch {
      setError("Failed to load registrations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [status, source]);

  const bootcampOptions = useMemo(
    () => Array.from(new Set(items.map((item) => item.bootcampSlug).filter(Boolean))) as string[],
    [items]
  );

  const updateSelected = async (updates: Partial<Registration>) => {
    if (!selected) return;
    const id = selected.id || selected._id;
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Failed to update registration.");
      setSelected({ ...selected, ...result.data, id });
      setMessage("Registration status updated.");
      await load();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update registration.");
    } finally {
      setSaving(false);
    }
  };

  const deleteRegistration = async (registration: Registration) => {
    if (!confirm("Delete this registration?")) return;
    const id = registration.id || registration._id;
    await fetch(`/api/admin/registrations/${id}`, { method: "DELETE" });
    setSelected(null);
    load();
  };

  const exportCsv = () => {
    const headers = ["Name", "Email", "Phone", "Bootcamp / Activity", "Source", "Status", "Date"];
    const rows = items.map((item) => [
      item.fullName,
      item.email,
      item.phone || item.whatsapp || "",
      item.bootcampTitle || item.activityTitle || "",
      item.source,
      item.status,
      item.createdAt ? new Date(item.createdAt).toLocaleString() : "",
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "registrations.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Registrations / Applications</h1>
          <p className="mt-1 text-gray-400">Review everyone who registered for bootcamps, events, and activities.</p>
        </div>
        <button onClick={exportCsv} className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white hover:border-[#d4af37]/40">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#111] p-5">
        <div className="mb-5 grid gap-3 lg:grid-cols-[1fr,180px,180px,180px,auto]">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className={`${inputCls} pl-10`} placeholder="Search by name, email, organization" />
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className={inputCls}>
            {statuses.map((item) => <option key={item} value={item}>{item === "all" ? "All statuses" : item}</option>)}
          </select>
          <select value={source} onChange={(event) => setSource(event.target.value)} className={inputCls}>
            {sources.map((item) => <option key={item} value={item}>{item === "all" ? "All sources" : item}</option>)}
          </select>
          <select value={bootcampSlug} onChange={(event) => setBootcampSlug(event.target.value)} className={inputCls}>
            <option value="">All bootcamps</option>
            {bootcampOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button onClick={load} className="rounded-lg bg-[#d4af37] px-4 py-2.5 font-semibold text-black">Search</button>
        </div>

        {message ? (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            <CheckCircle className="h-4 w-4" />
            {message}
          </div>
        ) : null}
        {error ? <div className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#d4af37]" />
          </div>
        ) : items.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Phone</th>
                  <th className="px-4 py-3 text-left font-medium">Bootcamp / Activity</th>
                  <th className="px-4 py-3 text-left font-medium">Source</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id || item._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-white">{item.fullName}</td>
                    <td className="px-4 py-3 text-gray-400">{item.email}</td>
                    <td className="px-4 py-3 text-gray-400">{item.phone || item.whatsapp || "-"}</td>
                    <td className="px-4 py-3 text-gray-300">{item.bootcampTitle || item.activityTitle || "-"}</td>
                    <td className="px-4 py-3 text-gray-400">{item.source}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs ${statusClass(item.status)}`}>{item.status}</span></td>
                    <td className="px-4 py-3 text-gray-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelected(item)} className="mr-3 text-gray-400 hover:text-[#d4af37]"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => deleteRegistration(item)} className="text-gray-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-white/10 text-gray-500">
            No registrations yet.
          </div>
        )}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/80" onClick={() => setSelected(null)} aria-label="Close details" />
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#d4af37]/20 bg-[#111] p-6">
            <button onClick={() => setSelected(null)} className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold text-white">{selected.fullName}</h2>
            <p className="mt-1 text-sm text-gray-500">Submitted {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ""}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["WhatsApp", selected.whatsapp],
                ["Organization", selected.organization],
                ["Role", selected.role],
                ["Bootcamp title", selected.bootcampTitle],
                ["Bootcamp slug", selected.bootcampSlug],
                ["Activity title", selected.activityTitle],
                ["Source", selected.source],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
                  <p className="mt-1 text-sm text-white">{value || "Not provided"}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">Reason</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-300">{selected.reason || "Not provided"}</p>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[220px,1fr]">
              <div>
                <label className="mb-2 block text-sm text-gray-300">Status</label>
                <select value={selected.status} onChange={(event) => updateSelected({ status: event.target.value as Registration["status"] })} className={inputCls} disabled={saving}>
                  {statuses.filter((item) => item !== "all").map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-300">Internal notes</label>
                <textarea value={selected.notes || ""} onChange={(event) => setSelected({ ...selected, notes: event.target.value })} className={`${inputCls} resize-y`} rows={4} />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <button onClick={() => deleteRegistration(selected)} className="rounded-lg border border-red-400/20 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10">
                Delete
              </button>
              <div className="flex flex-wrap gap-3">
                {["reviewed", "accepted", "rejected", "waitlisted"].map((nextStatus) => (
                  <button key={nextStatus} onClick={() => updateSelected({ status: nextStatus as Registration["status"] })} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:border-[#d4af37]/40">
                    Mark as {nextStatus}
                  </button>
                ))}
                <button onClick={() => updateSelected({ notes: selected.notes || "" })} className="rounded-lg bg-[#d4af37] px-4 py-2 text-sm font-semibold text-black" disabled={saving}>
                  Save notes
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
