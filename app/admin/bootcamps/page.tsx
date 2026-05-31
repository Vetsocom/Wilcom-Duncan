'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Save, ArrowLeft, CheckCircle } from 'lucide-react';
import MultiImagePicker from '@/components/admin/MultiImagePicker';
import ImagePicker from '@/components/admin/ImagePicker';

const inputCls = "w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#d4af37] transition-colors";
const btnPrimary = "flex items-center gap-2 bg-[#d4af37] text-black font-semibold rounded-lg px-5 py-2.5 hover:bg-[#e5c158] transition-colors disabled:opacity-50";

const emptySpeaker = { name: '', title: '', image: '', bio: '' };
const emptyBootcamp = { slug:'', title:'', date:'', location:'', theme:'', status:'upcoming', overview:'', objectives:[], topics:[], speakers:[{ ...emptySpeaker }], images:[], videos:[], testimonials:[] };

function normalizeSpeakersForForm(speakers: any[] = []) {
  const normalized = speakers
    .map((speaker) => {
      if (typeof speaker === 'string') return { ...emptySpeaker, name: speaker };
      return {
        ...emptySpeaker,
        ...(speaker || {}),
      };
    })
    .filter((speaker) => speaker.name || speaker.title || speaker.image || speaker.bio);

  return normalized.length ? normalized : [{ ...emptySpeaker }];
}

export default function AdminBootcampsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = () => { setLoading(true); fetch('/api/admin/bootcamps').then(r=>r.json()).then(d=>{setItems(Array.isArray(d)?d:[]); setLoading(false)}).catch(()=>setLoading(false)); };
  useEffect(load, []);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      const isNew = !editing.id;
      const url = isNew ? '/api/admin/bootcamps' : `/api/admin/bootcamps/${editing.id}`;
      const payload = {
        ...editing,
        speakers: normalizeSpeakersForForm(editing.speakers).filter((speaker) => speaker.name.trim()),
      };
      await fetch(url, { method: isNew?'POST':'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      setSaved(true); setTimeout(()=>setSaved(false),2000); load(); setEditing(null);
    } catch { alert('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this bootcamp?')) return;
    await fetch(`/api/admin/bootcamps/${id}`, { method:'DELETE' }); load();
  };

  const setSpeaker = (index: number, field: string, value: string) => {
    const speakers = normalizeSpeakersForForm(editing.speakers);
    speakers[index] = { ...speakers[index], [field]: value };
    setEditing({ ...editing, speakers });
  };

  const addSpeaker = () => {
    setEditing({ ...editing, speakers: [...normalizeSpeakersForForm(editing.speakers), { ...emptySpeaker }] });
  };

  const removeSpeaker = (index: number) => {
    const speakers = normalizeSpeakersForForm(editing.speakers).filter((_, currentIndex) => currentIndex !== index);
    setEditing({ ...editing, speakers: speakers.length ? speakers : [{ ...emptySpeaker }] });
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
      <h1 className="text-2xl font-bold text-white">{editing.id ? 'Edit Bootcamp' : 'New Bootcamp'}</h1>
      <div className="bg-[#111] border border-white/5 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm text-gray-300 mb-2">Title</label><input value={editing.title||''} onChange={e=>setEditing({...editing,title:e.target.value})} className={inputCls} /></div>
          <div><label className="block text-sm text-gray-300 mb-2">Page URL Slug</label><input value={editing.slug||''} onChange={e=>setEditing({...editing,slug:e.target.value})} className={inputCls} /></div>
          <div><label className="block text-sm text-gray-300 mb-2">Date</label><input value={editing.date||''} onChange={e=>setEditing({...editing,date:e.target.value})} className={inputCls} /></div>
          <div><label className="block text-sm text-gray-300 mb-2">Location</label><input value={editing.location||''} onChange={e=>setEditing({...editing,location:e.target.value})} className={inputCls} /></div>
          <div><label className="block text-sm text-gray-300 mb-2">Theme</label><input value={editing.theme||''} onChange={e=>setEditing({...editing,theme:e.target.value})} className={inputCls} /></div>
          <div><label className="block text-sm text-gray-300 mb-2">Status</label>
            <select value={editing.status||'upcoming'} onChange={e=>setEditing({...editing,status:e.target.value})} className={inputCls}>
              <option value="upcoming">Upcoming</option><option value="past">Past</option>
            </select>
          </div>
        </div>
        <div><label className="block text-sm text-gray-300 mb-2">Overview</label><textarea rows={4} value={editing.overview||''} onChange={e=>setEditing({...editing,overview:e.target.value})} className={inputCls+" resize-y"} /></div>
        <div><label className="block text-sm text-gray-300 mb-2">Objectives (one per line)</label><textarea rows={3} value={(editing.objectives||[]).join('\n')} onChange={e=>setEditing({...editing,objectives:e.target.value.split('\n').filter((t:string)=>t.trim())})} className={inputCls+" resize-y font-mono text-sm"} /></div>
        <div><label className="block text-sm text-gray-300 mb-2">Topics (one per line)</label><textarea rows={3} value={(editing.topics||[]).join('\n')} onChange={e=>setEditing({...editing,topics:e.target.value.split('\n').filter((t:string)=>t.trim())})} className={inputCls+" resize-y font-mono text-sm"} /></div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Speakers</h2>
              <p className="text-sm text-gray-500">Add each speaker profile and choose their photo.</p>
            </div>
            <button type="button" onClick={addSpeaker} className="flex items-center gap-2 rounded-lg border border-[#d4af37]/40 px-4 py-2 text-sm font-semibold text-[#d4af37] hover:bg-[#d4af37]/10">
              <Plus className="h-4 w-4" /> Add Speaker
            </button>
          </div>
          {normalizeSpeakersForForm(editing.speakers).map((speaker, index) => (
            <div key={index} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">Speaker {index + 1}</p>
                <button type="button" onClick={() => removeSpeaker(index)} className="rounded-lg p-2 text-red-300 hover:bg-red-500/10" aria-label="Remove speaker">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div><label className="block text-sm text-gray-300 mb-2">Name</label><input value={speaker.name||''} onChange={e=>setSpeaker(index,'name',e.target.value)} className={inputCls} /></div>
                <div><label className="block text-sm text-gray-300 mb-2">Title</label><input value={speaker.title||''} onChange={e=>setSpeaker(index,'title',e.target.value)} className={inputCls} placeholder="Guest Speaker, Host, Facilitator" /></div>
              </div>
              <div><label className="block text-sm text-gray-300 mb-2">Bio</label><textarea rows={3} value={speaker.bio||''} onChange={e=>setSpeaker(index,'bio',e.target.value)} className={inputCls+" resize-y"} /></div>
              <ImagePicker label="Speaker photo" value={speaker.image||''} onChange={value=>setSpeaker(index,'image',value)} folder="bootcamps" helperText="Choose or upload a speaker headshot." />
            </div>
          ))}
        </div>
        <MultiImagePicker label="Choose or upload bootcamp images" value={editing.images||[]} onChange={images=>setEditing({...editing,images})} folder="bootcamps" />
        <div><label className="block text-sm text-gray-300 mb-2">Testimonials (one per line)</label><textarea rows={3} value={(editing.testimonials||[]).join('\n')} onChange={e=>setEditing({...editing,testimonials:e.target.value.split('\n').filter((t:string)=>t.trim())})} className={inputCls+" resize-y font-mono text-sm"} /></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-white">Bootcamps</h1><p className="text-gray-400 mt-1">{items.length} total</p></div>
        <button onClick={()=>setEditing({...emptyBootcamp, speakers: [{ ...emptySpeaker }]})} className={btnPrimary}><Plus className="w-4 h-4" />New Bootcamp</button>
      </div>
      <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/5 text-gray-400">
            <th className="text-left px-4 py-3 font-medium">Title</th>
            <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Theme</th>
            <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/[.02]">
                <td className="px-4 py-3 text-white font-medium">{item.title}</td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{item.theme}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status==='past'?'bg-gray-700 text-gray-300':'bg-[#0f766e]/20 text-[#0f766e]'}`}>{item.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={()=>setEditing({...item, speakers: normalizeSpeakersForForm(item.speakers)})} className="text-gray-400 hover:text-[#d4af37] mr-3"><Pencil className="w-4 h-4" /></button>
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
