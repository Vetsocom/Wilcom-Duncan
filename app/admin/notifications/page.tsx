"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, CheckCircle, Loader2, Trash2 } from "lucide-react";

type NotificationItem = {
  id: string;
  _id?: string;
  title: string;
  message: string;
  type: string;
  status: "unread" | "read";
  priority: string;
  link?: string;
  createdAt?: string;
};

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);
    const response = await fetch(`/api/admin/notifications?${params.toString()}`);
    const result = await response.json();
    setItems(result.success ? result.data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filter]);

  const markAllRead = async () => {
    await fetch("/api/admin/notifications/mark-all-read", { method: "POST" });
    load();
  };

  const deleteItem = async (item: NotificationItem) => {
    await fetch(`/api/admin/notifications/${item.id || item._id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Notifications</h1>
          <p className="mt-1 text-gray-400">Recent admin activity and new website submissions.</p>
        </div>
        <button onClick={markAllRead} className="flex items-center gap-2 rounded-lg bg-[#d4af37] px-4 py-2.5 text-sm font-semibold text-black">
          <CheckCircle className="h-4 w-4" />
          Mark all as read
        </button>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#111] p-5">
        <div className="mb-5 flex gap-2">
          {["all", "unread", "read"].map((item) => (
            <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 text-sm capitalize ${filter === item ? "bg-[#d4af37] text-black" : "bg-white/5 text-gray-300"}`}>
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#d4af37]" /></div>
        ) : items.length ? (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id || item._id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/10">
                  <Bell className="h-5 w-5 text-[#d4af37]" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-white">{item.title}</h2>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-300">{item.type}</span>
                    {item.status === "unread" ? <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">unread</span> : null}
                  </div>
                  <p className="mt-1 text-sm text-gray-400">{item.message}</p>
                  <p className="mt-1 text-xs text-gray-600">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</p>
                </div>
                <div className="flex gap-3">
                  {item.link ? <Link href={item.link} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:border-[#d4af37]/40">Open</Link> : null}
                  <button onClick={() => deleteItem(item)} className="rounded-lg border border-red-400/20 px-3 py-2 text-red-300"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-white/10 text-gray-500">No notifications yet.</div>
        )}
      </div>
    </div>
  );
}
