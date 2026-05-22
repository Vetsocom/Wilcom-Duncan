'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Save, ArrowLeft, CheckCircle } from 'lucide-react';

const inputCls = "w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#d4af37] transition-colors";
const btnPrimary = "flex items-center gap-2 bg-[#d4af37] text-black font-semibold rounded-lg px-5 py-2.5 hover:bg-[#e5c158] transition-colors disabled:opacity-50";

const emptyActivity = { title:'', date:'', time:'', location:'', type:'training', description:'', link:'' };

export default function AdminCalendarPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = () => { setLoading(true); fetch('/api/admin/calendar').then(r=>r.json()).then(d=>{setItems(Array.isArray(d)?d:[]); setLoading(false)}).catch(()=>setLoading(false)); };
  useEffect(load, []);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      const isNew = !editing.id;
      const url = isNew ? '/api/admin/calendar' : `/api/admin/calendar/${editing.id}`;
      await fetch(url, { method: isNew?'POST':'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(editing) });
      setSaved(true); setTimeout(()=>setSaved(false),2000); load(); setEditing(null);
    } catch { alert('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this activity?')) return;
    await fetch(`/api/admin/calendar/${id}`, { method:'DELETE' }); load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-[#d4af37] animate-spin" /></div>;

  if (editing) return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button onClick={()=>setEditing(null)} className="flex items-center gap-2 text-gray-400 hover:text-white"><ArrowLeft className="w-4 h-4" />Back</button>
        <button onClick={handleSave} disabled={saving} className={btnPrimary}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </button>
      </div>
      <h1 className="text-2xl font-bold text-white">{editing.id ? 'Edit Activity' : 'New Activity'}</h1>
      <div className="bg-[#111] border border-white/5 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm text-gray-300 mb-2">Title</label><input value={editing.title||''} onChange={e=>setEditing({...editing,title:e.target.value})} className={inputCls} /></div>
          <div><label className="block text-sm text-gray-300 mb-2">Date</label><input value={editing.date||''} onChange={e=>setEditing({...editing,date:e.target.value})} className={inputCls} placeholder="e.g. 2025-06-15" /></div>
          <div><label className="block text-sm text-gray-300 mb-2">Time</label><input value={editing.time||''} onChange={e=>setEditing({...editing,time:e.target.value})} className={inputCls} placeholder="e.g. 10:00 AM" /></div>
          <div><label className="block text-sm text-gray-300 mb-2">Location</label><input value={editing.location||''} onChange={e=>setEditing({...editing,location:e.target.value})} className={inputCls} /></div>
          <div><label className="block text-sm text-gray-300 mb-2">Type</label>
            <select value={editing.type||'training'} onChange={e=>setEditing({...editing,type:e.target.value})} className={inputCls}>
              <option value="training">Training</option><option value="bootcamp">Bootcamp</option><option value="speaking">Speaking</option><option value="workshop">Workshop</option><option value="media">Media</option><option value="other">Other</option>
            </select>
          </div>
          <div><label className="block text-sm text-gray-300 mb-2">Link</label><input value={editing.link||''} onChange={e=>setEditing({...editing,link:e.target.value})} className={inputCls} placeholder="Optional URL" /></div>
        </div>
        <div><label className="block text-sm text-gray-300 mb-2">Description</label><textarea rows={3} value={editing.description||''} onChange={e=>setEditing({...editing,description:e.target.value})} className={inputCls+" resize-y"} /></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-white">Calendar Activities</h1><p className="text-gray-400 mt-1">{items.length} total</p></div>
        <button onClick={()=>setEditing({...emptyActivity})} className={btnPrimary}><Plus className="w-4 h-4" />New Activity</button>
      </div>
      <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/5 text-gray-400">
            <th className="text-left px-4 py-3 font-medium">Title</th>
            <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Date</th>
            <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Type</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/[.02]">
                <td className="px-4 py-3 text-white font-medium">{item.title}</td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{item.date}</td>
                <td className="px-4 py-3 hidden sm:table-cell"><span className="px-2 py-1 rounded-full text-xs font-medium bg-[#d4af37]/10 text-[#d4af37]">{item.type}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={()=>setEditing({...item})} className="text-gray-400 hover:text-[#d4af37] mr-3"><Pencil className="w-4 h-4" /></button>
                  <button onClick={()=>handleDelete(item.id)} className="text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
