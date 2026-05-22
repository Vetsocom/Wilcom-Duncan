'use client';

import { useEffect, useState } from 'react';
import { Save, Loader2, CheckCircle } from 'lucide-react';

const inputCls = "w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#d4af37] transition-colors";
const cardCls = "bg-[#111] border border-white/5 rounded-xl p-6 space-y-4";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/profile').then(r => r.json()).then(d => { setProfile(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      await fetch('/api/admin/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) });
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch { alert('Failed to save'); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-[#d4af37] animate-spin" /></div>;
  if (!profile) return <div className="text-red-400">Failed to load profile.</div>;

  const update = (key: string, val: any) => setProfile({ ...profile, [key]: val });

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Profile</h1>
          <p className="text-gray-400 mt-1">Update your personal and professional information.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#d4af37] text-black font-semibold rounded-lg px-5 py-2.5 hover:bg-[#e5c158] transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className={cardCls}>
        <h2 className="text-lg font-semibold text-white">Basic Info</h2>
        <div><label className="block text-sm text-gray-300 mb-2">Full Name</label><input type="text" value={profile.name||''} onChange={e => update('name', e.target.value)} className={inputCls} /></div>
        <div><label className="block text-sm text-gray-300 mb-2">Location</label><input type="text" value={profile.location||''} onChange={e => update('location', e.target.value)} className={inputCls} /></div>
        <div><label className="block text-sm text-gray-300 mb-2">Bio</label><textarea rows={5} value={profile.bio||''} onChange={e => update('bio', e.target.value)} className={inputCls + " resize-y"} /></div>
      </div>

      <div className={cardCls}>
        <h2 className="text-lg font-semibold text-white">Titles (one per line)</h2>
        <textarea rows={6} value={(profile.titles||[]).join('\n')} onChange={e => update('titles', e.target.value.split('\n').filter((t:string)=>t.trim()))} className={inputCls + " resize-y font-mono text-sm"} />
      </div>

      <div className={cardCls}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Expertise Areas</h2>
          <button onClick={() => update('expertiseAreas', [...(profile.expertiseAreas||[]), {title:'',description:''}])} className="text-sm text-[#d4af37] hover:text-[#e5c158]">+ Add</button>
        </div>
        {(profile.expertiseAreas||[]).map((a:any,i:number) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr,2fr,auto] gap-3">
            <input placeholder="Title" value={a.title||''} onChange={e => { const u=[...profile.expertiseAreas]; u[i]={...u[i],title:e.target.value}; update('expertiseAreas',u); }} className={inputCls + " text-sm"} />
            <input placeholder="Description" value={a.description||''} onChange={e => { const u=[...profile.expertiseAreas]; u[i]={...u[i],description:e.target.value}; update('expertiseAreas',u); }} className={inputCls + " text-sm"} />
            <button onClick={() => update('expertiseAreas', profile.expertiseAreas.filter((_:any,idx:number)=>idx!==i))} className="text-red-400 hover:text-red-300 text-sm px-2">Remove</button>
          </div>
        ))}
      </div>

      <div className={cardCls}>
        <h2 className="text-lg font-semibold text-white">Platforms (one per line)</h2>
        <textarea rows={4} value={(profile.platforms||[]).join('\n')} onChange={e => update('platforms', e.target.value.split('\n').filter((t:string)=>t.trim()))} className={inputCls + " resize-y font-mono text-sm"} />
      </div>

      <div className={cardCls}>
        <h2 className="text-lg font-semibold text-white">Speaking Topics (one per line)</h2>
        <textarea rows={6} value={(profile.speakingTopics||[]).join('\n')} onChange={e => update('speakingTopics', e.target.value.split('\n').filter((t:string)=>t.trim()))} className={inputCls + " resize-y font-mono text-sm"} />
      </div>

      <div className={cardCls}>
        <h2 className="text-lg font-semibold text-white">Social Links</h2>
        {['facebook','instagram','linkedin','youtube'].map(p => (
          <div key={p}><label className="block text-sm text-gray-300 mb-2 capitalize">{p}</label>
          <input value={profile.socialLinks?.[p]||''} onChange={e => update('socialLinks', {...profile.socialLinks,[p]:e.target.value})} className={inputCls} /></div>
        ))}
      </div>
    </div>
  );
}
