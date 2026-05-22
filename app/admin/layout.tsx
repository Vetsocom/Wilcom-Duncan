'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, User, FolderKanban, GraduationCap,
  FileText, CalendarDays, Settings, LogOut, Menu, X,
  Images, Users, Mail, Bell
} from 'lucide-react';
import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Profile', href: '/admin/profile', icon: User },
  { label: 'Media Library', href: '/admin/media', icon: Images, badgeKey: 'media' },
  { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { label: 'Bootcamps', href: '/admin/bootcamps', icon: GraduationCap },
  { label: 'Blog', href: '/admin/blog', icon: FileText },
  { label: 'Calendar', href: '/admin/calendar', icon: CalendarDays },
  { label: 'Registrations', href: '/admin/registrations', icon: Users, badgeKey: 'registrations' },
  { label: 'Inquiries', href: '/admin/inquiries', icon: Mail, badgeKey: 'inquiries' },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell, badgeKey: 'notifications' },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

type Counts = {
  registrations: number;
  inquiries: number;
  notifications: number;
  media: number;
};

type NotificationItem = {
  id: string;
  _id?: string;
  title: string;
  message: string;
  type: string;
  status: 'unread' | 'read';
  link?: string;
  createdAt?: string;
};

function AdminSidebar({ mobileOpen, onClose, counts }: { mobileOpen: boolean; onClose: () => void; counts: Counts }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0a0a0a] border-r border-[#d4af37]/10 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#a67a26] flex items-center justify-center">
              <span className="text-black font-bold text-sm">WD</span>
            </div>
            <span className="text-white font-semibold text-lg">Admin CMS</span>
          </Link>
          <button onClick={onClose} className="ml-auto lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badgeKey && counts[item.badgeKey as keyof Counts] > 0 ? (
                  <span className="min-w-5 rounded-full bg-[#d4af37] px-1.5 py-0.5 text-center text-[11px] font-bold text-black">
                    {counts[item.badgeKey as keyof Counts]}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
            Back to Website
          </Link>
        </div>
      </aside>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [counts, setCounts] = useState<Counts>({ registrations: 0, inquiries: 0, notifications: 0, media: 0 });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [bellOpen, setBellOpen] = useState(false);

  const loadAdminSignals = async () => {
    try {
      const [registrations, inquiries, media, notificationsResult] = await Promise.all([
        fetch('/api/admin/registrations?status=new').then((r) => r.json()),
        fetch('/api/admin/inquiries?status=new').then((r) => r.json()),
        fetch('/api/admin/media').then((r) => r.json()),
        fetch('/api/admin/notifications?limit=8').then((r) => r.json()),
      ]);

      setCounts({
        registrations: registrations.success ? registrations.data.length : 0,
        inquiries: inquiries.success ? inquiries.data.length : 0,
        media: media.success ? media.data.length : 0,
        notifications: notificationsResult.unreadCount || 0,
      });
      setNotifications(notificationsResult.success ? notificationsResult.data : []);
    } catch {
      // Keep the admin shell usable if a dashboard count endpoint is unavailable.
    }
  };

  useEffect(() => {
    loadAdminSignals();
  }, []);

  const openNotification = async (notification: NotificationItem) => {
    await fetch(`/api/admin/notifications/${notification.id || notification._id}`, { method: 'PUT' });
    await loadAdminSignals();
    setBellOpen(false);
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} counts={counts} />

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 flex items-center px-4 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white mr-4"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setBellOpen(!bellOpen)}
                className="relative rounded-full border border-white/10 p-2 text-gray-300 hover:border-[#d4af37]/40 hover:text-white"
                aria-label="Open notifications"
              >
                <Bell className="h-5 w-5" />
                {counts.notifications > 0 ? (
                  <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#d4af37] px-1 text-center text-[11px] font-bold text-black">
                    {counts.notifications}
                  </span>
                ) : null}
              </button>
              {bellOpen ? (
                <div className="absolute right-0 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-2xl shadow-black/40">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <span className="font-semibold text-white">Notifications</span>
                    <button
                      onClick={async () => {
                        await fetch('/api/admin/notifications/mark-all-read', { method: 'POST' });
                        await loadAdminSignals();
                      }}
                      className="text-xs text-[#d4af37] hover:text-[#e5c158]"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length ? notifications.map((notification) => (
                      <button
                        key={notification.id || notification._id}
                        onClick={() => openNotification(notification)}
                        className="block w-full border-b border-white/5 px-4 py-3 text-left hover:bg-white/[0.04]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{notification.title}</span>
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase text-gray-400">{notification.type}</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-400">{notification.message}</p>
                        <p className="mt-1 text-xs text-gray-600">{notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}</p>
                      </button>
                    )) : (
                      <div className="p-6 text-center text-sm text-gray-500">No notifications yet.</div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] to-[#a67a26] flex items-center justify-center">
              <span className="text-black text-xs font-bold">A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
