'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Save, ArrowLeft, CheckCircle } from 'lucide-react';
import MultiImagePicker from '@/components/admin/MultiImagePicker';

const inputCls = "w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#d4af37] transition-colors";
const btnPrimary = "flex items-center gap-2 bg-[#d4af37] text-black font-semibold rounded-lg px-5 py-2.5 hover:bg-[#e5c158] transition-colors disabled:opacity-50";

const emptyProject = { slug:'', title:'', year: new Date().getFullYear(), location:'', category:'', status:'upcoming', excerpt:'', description:'', role:'', topics:[], images:[], videos:[], outcomes:[] };

export default function AdminProjectsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = () => { setLoading(true); fetch('/api/admin/projects').then(r=>r.json()).then(d=>{setItems(Array.isArray(d)?d:[]); setLoading(false)}).catch(()=>setLoading(false)); };
  useEffect(load, []);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      const isNew = !editing.id;
      const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${editing.id}`;
      const method = isNew ? 'POST' : 'PUT';
      await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(editing) });
      setSaved(true); setTimeout(()=>setSaved(false),2000);
      load(); setEditing(null);
    } catch { alert('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/admin/projects/${id}`, { method:'DELETE' });
    load();
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
      <h1 className="text-2xl font-bold text-white">{editing.id ? 'Edit Project' : 'New Project'}</h1>
      <div className="bg-[#111] border border-white/5 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm text-gray-300 mb-2">Title</label><input value={editing.title||''} onChange={e=>setEditing({...editing,title:e.target.value})} className={inputCls} /></div>
          <div><label className="block text-sm text-gray-300 mb-2">Page URL Slug</label><input value={editing.slug||''} onChange={e=>setEditing({...editing,slug:e.target.value})} className={inputCls} /></div>
          <div><label className="block text-sm text-gray-300 mb-2">Year</label><input type="number" value={editing.year||''} onChange={e=>setEditing({...editing,year:parseInt(e.target.value)})} className={inputCls} /></div>
          <div><label className="block text-sm text-gray-300 mb-2">Location</label><input value={editing.location||''} onChange={e=>setEditing({...editing,location:e.target.value})} className={inputCls} /></div>
          <div><label className="block text-sm text-gray-300 mb-2">Category</label><input value={editing.category||''} onChange={e=>setEditing({...editing,category:e.target.value})} className={inputCls} /></div>
          <div><label className="block text-sm text-gray-300 mb-2">Status</label>
            <select value={editing.status||'upcoming'} onChange={e=>setEditing({...editing,status:e.target.value})} className={inputCls}>
              <option value="upcoming">Upcoming</option><option value="past">Past</option>
            </select>
          </div>
        </div>
        <div><label className="block text-sm text-gray-300 mb-2">Excerpt</label><textarea rows={2} value={editing.excerpt||''} onChange={e=>setEditing({...editing,excerpt:e.target.value})} className={inputCls+" resize-y"} /></div>
        <div><label className="block text-sm text-gray-300 mb-2">Description</label><textarea rows={4} value={editing.description||''} onChange={e=>setEditing({...editing,description:e.target.value})} className={inputCls+" resize-y"} /></div>
        <div><label className="block text-sm text-gray-300 mb-2">Role</label><textarea rows={2} value={editing.role||''} onChange={e=>setEditing({...editing,role:e.target.value})} className={inputCls+" resize-y"} /></div>
        <div><label className="block text-sm text-gray-300 mb-2">Topics (one per line)</label><textarea rows={3} value={(editing.topics||[]).join('\n')} onChange={e=>setEditing({...editing,topics:e.target.value.split('\n').filter((t:string)=>t.trim())})} className={inputCls+" resize-y font-mono text-sm"} /></div>
        <MultiImagePicker label="Choose or upload project images" value={editing.images||[]} onChange={images=>setEditing({...editing,images})} folder="projects" />
        <div><label className="block text-sm text-gray-300 mb-2">Outcomes (one per line)</label><textarea rows={3} value={(editing.outcomes||[]).join('\n')} onChange={e=>setEditing({...editing,outcomes:e.target.value.split('\n').filter((t:string)=>t.trim())})} className={inputCls+" resize-y font-mono text-sm"} /></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-white">Projects</h1><p className="text-gray-400 mt-1">{items.length} total</p></div>
        <button onClick={()=>setEditing({...emptyProject})} className={btnPrimary}><Plus className="w-4 h-4" />New Project</button>
      </div>
      <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/5 text-gray-400">
            <th className="text-left px-4 py-3 font-medium">Title</th>
            <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
            <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/[.02]">
                <td className="px-4 py-3 text-white font-medium">{item.title}</td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{item.category}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status==='past'?'bg-gray-700 text-gray-300':'bg-[#0f766e]/20 text-[#0f766e]'}`}>{item.status}</span>
                </td>
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
