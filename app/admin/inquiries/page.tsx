"use client";

import { useEffect, useState } from "react";
import { Eye, Loader2, Search, Trash2, X } from "lucide-react";

type Inquiry = {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  inquiryType: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt?: string;
};

const inputCls =
  "w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#d4af37] transition-colors";
const statuses = ["all", "new", "read", "replied", "archived"];

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (search.trim()) params.set("search", search.trim());
    const response = await fetch(`/api/admin/inquiries?${params.toString()}`);
    const result = await response.json();
    setItems(result.success ? result.data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [status]);

  const updateStatus = async (item: Inquiry, nextStatus: Inquiry["status"]) => {
    const id = item.id || item._id;
    const response = await fetch(`/api/admin/inquiries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const result = await response.json();
    if (result.success) {
      setSelected(selected ? { ...selected, status: nextStatus } : selected);
      load();
    }
  };

  const deleteInquiry = async (item: Inquiry) => {
    if (!confirm("Delete this inquiry?")) return;
    const id = item.id || item._id;
    await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    setSelected(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Contact Inquiries</h1>
        <p className="mt-1 text-gray-400">Messages submitted from the public contact form.</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#111] p-5">
        <div className="mb-5 grid gap-3 md:grid-cols-[1fr,180px,auto]">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className={`${inputCls} pl-10`} placeholder="Search inquiries" />
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className={inputCls}>
            {statuses.map((item) => <option key={item} value={item}>{item === "all" ? "All statuses" : item}</option>)}
          </select>
          <button onClick={load} className="rounded-lg bg-[#d4af37] px-4 py-2.5 font-semibold text-black">Search</button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#d4af37]" /></div>
        ) : items.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead><tr className="border-b border-white/10 text-gray-400">
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Inquiry type</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id || item._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-white">{item.fullName}</td>
                    <td className="px-4 py-3 text-gray-400">{item.email}</td>
                    <td className="px-4 py-3 text-gray-300">{item.inquiryType}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-white/10 px-2 py-1 text-xs text-gray-300">{item.status}</span></td>
                    <td className="px-4 py-3 text-gray-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelected(item)} className="mr-3 text-gray-400 hover:text-[#d4af37]"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => deleteInquiry(item)} className="text-gray-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-white/10 text-gray-500">No contact inquiries yet.</div>
        )}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/80" onClick={() => setSelected(null)} aria-label="Close inquiry" />
          <div className="relative w-full max-w-2xl rounded-3xl border border-[#d4af37]/20 bg-[#111] p-6">
            <button onClick={() => setSelected(null)} className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
            <h2 className="text-xl font-semibold text-white">{selected.fullName}</h2>
            <p className="text-sm text-gray-500">{selected.email}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs text-gray-500">Phone</p><p className="text-white">{selected.phone || "Not provided"}</p></div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs text-gray-500">Organization</p><p className="text-white">{selected.organization || "Not provided"}</p></div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs text-gray-500">Inquiry type</p><p className="text-white">{selected.inquiryType}</p></div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs text-gray-500">Date</p><p className="text-white">{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "-"}</p></div>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-gray-500">Message</p>
              <p className="mt-2 whitespace-pre-wrap text-gray-300">{selected.message}</p>
            </div>
            <div className="mt-5 flex flex-wrap justify-between gap-3">
              <button onClick={() => deleteInquiry(selected)} className="rounded-lg border border-red-400/20 px-4 py-2 text-sm text-red-300">Delete</button>
              <div className="flex flex-wrap gap-3">
                {statuses.filter((item) => item !== "all").map((item) => (
                  <button key={item} onClick={() => updateStatus(selected, item as Inquiry["status"])} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:border-[#d4af37]/40">
                    Mark {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
