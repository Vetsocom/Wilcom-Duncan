'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban, GraduationCap, FileText, CalendarDays,
  TrendingUp, Users, Eye
} from 'lucide-react';

interface Counts {
  projects: number;
  bootcamps: number;
  blog: number;
  calendar: number;
}

const statCards = [
  { key: 'projects' as const, label: 'Projects', icon: FolderKanban, href: '/admin/projects', color: '#d4af37' },
  { key: 'bootcamps' as const, label: 'Bootcamps', icon: GraduationCap, href: '/admin/bootcamps', color: '#0f766e' },
  { key: 'blog' as const, label: 'Blog Posts', icon: FileText, href: '/admin/blog', color: '#a7653a' },
  { key: 'calendar' as const, label: 'Activities', icon: CalendarDays, href: '/admin/calendar', color: '#6366f1' },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({ projects: 0, bootcamps: 0, blog: 0, calendar: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [proj, boot, blog, cal] = await Promise.all([
          fetch('/api/admin/projects').then(r => r.json()),
          fetch('/api/admin/bootcamps').then(r => r.json()),
          fetch('/api/admin/blog').then(r => r.json()),
          fetch('/api/admin/calendar').then(r => r.json()),
        ]);
        setCounts({
          projects: Array.isArray(proj) ? proj.length : 0,
          bootcamps: Array.isArray(boot) ? boot.length : 0,
          blog: Array.isArray(blog) ? blog.length : 0,
          calendar: Array.isArray(cal) ? cal.length : 0,
        });
      } catch (e) {
        console.error('Failed to load counts', e);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back. Here&apos;s an overview of your content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="group bg-[#111] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-600 group-hover:text-[#d4af37] transition-colors" />
            </div>
            <div className="text-2xl font-bold text-white">
              {loading ? '—' : counts[card.key]}
            </div>
            <div className="text-sm text-gray-400 mt-1">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/projects"
            className="flex items-center gap-4 bg-[#111] border border-white/5 rounded-xl p-4 hover:border-[#d4af37]/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center shrink-0">
              <FolderKanban className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <div className="text-white font-medium group-hover:text-[#d4af37] transition-colors">Manage Projects</div>
              <div className="text-sm text-gray-500">Add, edit, or remove projects</div>
            </div>
          </Link>
          <Link
            href="/admin/blog"
            className="flex items-center gap-4 bg-[#111] border border-white/5 rounded-xl p-4 hover:border-[#a7653a]/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#a7653a]/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#a7653a]" />
            </div>
            <div>
              <div className="text-white font-medium group-hover:text-[#a7653a] transition-colors">Write Blog Post</div>
              <div className="text-sm text-gray-500">Create new articles and insights</div>
            </div>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-4 bg-[#111] border border-white/5 rounded-xl p-4 hover:border-[#0f766e]/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#0f766e]/10 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5 text-[#0f766e]" />
            </div>
            <div>
              <div className="text-white font-medium group-hover:text-[#0f766e] transition-colors">View Website</div>
              <div className="text-sm text-gray-500">Open the public website</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
