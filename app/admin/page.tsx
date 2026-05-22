"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell, FileText, FolderKanban, GraduationCap,
  Images, Mail, Plus, Upload, Users
} from "lucide-react";

type DashboardState = {
  registrations: any[];
  newRegistrations: any[];
  inquiries: any[];
  newInquiries: any[];
  notifications: any[];
  unreadNotifications: number;
  media: any[];
  projects: any[];
  bootcamps: any[];
  blog: any[];
  calendar: any[];
};

const initialState: DashboardState = {
  registrations: [],
  newRegistrations: [],
  inquiries: [],
  newInquiries: [],
  notifications: [],
  unreadNotifications: 0,
  media: [],
  projects: [],
  bootcamps: [],
  blog: [],
  calendar: [],
};

const cardBase = "rounded-2xl border border-white/10 bg-[#111] p-5 transition hover:border-[#d4af37]/30";

export default function AdminDashboard() {
  const [state, setState] = useState<DashboardState>(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [
          registrations,
          newRegistrations,
          inquiries,
          newInquiries,
          notifications,
          media,
          projects,
          bootcamps,
          blog,
          calendar,
        ] = await Promise.all([
          fetch("/api/admin/registrations").then((r) => r.json()),
          fetch("/api/admin/registrations?status=new").then((r) => r.json()),
          fetch("/api/admin/inquiries").then((r) => r.json()),
          fetch("/api/admin/inquiries?status=new").then((r) => r.json()),
          fetch("/api/admin/notifications?limit=5").then((r) => r.json()),
          fetch("/api/admin/media").then((r) => r.json()),
          fetch("/api/admin/projects").then((r) => r.json()),
          fetch("/api/admin/bootcamps").then((r) => r.json()),
          fetch("/api/admin/blog").then((r) => r.json()),
          fetch("/api/admin/calendar").then((r) => r.json()),
        ]);

        setState({
          registrations: registrations.success ? registrations.data : [],
          newRegistrations: newRegistrations.success ? newRegistrations.data : [],
          inquiries: inquiries.success ? inquiries.data : [],
          newInquiries: newInquiries.success ? newInquiries.data : [],
          notifications: notifications.success ? notifications.data : [],
          unreadNotifications: notifications.unreadCount || 0,
          media: media.success ? media.data : [],
          projects: Array.isArray(projects) ? projects : [],
          bootcamps: Array.isArray(bootcamps) ? bootcamps : [],
          blog: Array.isArray(blog) ? blog : [],
          calendar: Array.isArray(calendar) ? calendar : [],
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const stats = [
    { label: "Total Registrations", value: state.registrations.length, icon: Users, href: "/admin/registrations", color: "#d4af37" },
    { label: "New Registrations", value: state.newRegistrations.length, icon: Users, href: "/admin/registrations?status=new", color: "#10b981" },
    { label: "Contact Inquiries", value: state.inquiries.length, icon: Mail, href: "/admin/inquiries", color: "#38bdf8" },
    { label: "Unread Notifications", value: state.unreadNotifications, icon: Bell, href: "/admin/notifications", color: "#f59e0b" },
    { label: "Uploaded Media", value: state.media.length, icon: Images, href: "/admin/media", color: "#a78bfa" },
    { label: "Blog Posts", value: state.blog.length, icon: FileText, href: "/admin/blog", color: "#fb7185" },
    { label: "Projects & Events", value: state.projects.length, icon: FolderKanban, href: "/admin/projects", color: "#22c55e" },
    { label: "Bootcamps", value: state.bootcamps.length, icon: GraduationCap, href: "/admin/bootcamps", color: "#d4af37" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-gray-400">A quick look at registrations, inquiries, media, and recent admin activity.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((card) => (
          <Link key={card.label} href={card.href} className={cardBase}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${card.color}18` }}>
                <card.icon className="h-5 w-5" style={{ color: card.color }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{loading ? "-" : card.value}</div>
            <div className="mt-1 text-sm text-gray-400">{card.label}</div>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { href: "/admin/media", label: "Upload Image", icon: Upload },
            { href: "/admin/bootcamps", label: "Add Bootcamp", icon: GraduationCap },
            { href: "/admin/blog", label: "Add Blog", icon: Plus },
            { href: "/admin/registrations", label: "View Registrations", icon: Users },
          ].map((action) => (
            <Link key={action.label} href={action.href} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111] p-4 text-white hover:border-[#d4af37]/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/10">
                <action.icon className="h-5 w-5 text-[#d4af37]" />
              </div>
              <span className="font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-3xl border border-white/10 bg-[#111] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-white">Latest registrations</h2>
            <Link href="/admin/registrations" className="text-sm text-[#d4af37]">View all</Link>
          </div>
          <div className="space-y-3">
            {state.registrations.slice(0, 5).map((item) => (
              <Link key={item.id || item._id} href={`/admin/registrations?id=${item.id || item._id}`} className="block rounded-2xl border border-white/10 bg-black/20 p-3 hover:border-[#d4af37]/30">
                <p className="font-medium text-white">{item.fullName}</p>
                <p className="text-sm text-gray-500">{item.bootcampTitle || item.activityTitle || item.email}</p>
              </Link>
            ))}
            {!state.registrations.length ? <p className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-gray-500">No registrations yet.</p> : null}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#111] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-white">Latest inquiries</h2>
            <Link href="/admin/inquiries" className="text-sm text-[#d4af37]">View all</Link>
          </div>
          <div className="space-y-3">
            {state.inquiries.slice(0, 5).map((item) => (
              <Link key={item.id || item._id} href={`/admin/inquiries?id=${item.id || item._id}`} className="block rounded-2xl border border-white/10 bg-black/20 p-3 hover:border-[#d4af37]/30">
                <p className="font-medium text-white">{item.fullName}</p>
                <p className="text-sm text-gray-500">{item.inquiryType}</p>
              </Link>
            ))}
            {!state.inquiries.length ? <p className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-gray-500">No contact inquiries yet.</p> : null}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#111] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-white">Latest notifications</h2>
            <Link href="/admin/notifications" className="text-sm text-[#d4af37]">View all</Link>
          </div>
          <div className="space-y-3">
            {state.notifications.slice(0, 5).map((item) => (
              <Link key={item.id || item._id} href={item.link || "/admin/notifications"} className="block rounded-2xl border border-white/10 bg-black/20 p-3 hover:border-[#d4af37]/30">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">{item.title}</p>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase text-gray-400">{item.type}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">{item.message}</p>
              </Link>
            ))}
            {!state.notifications.length ? <p className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-gray-500">No notifications yet.</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
