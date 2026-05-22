'use client';

import { useEffect, useState } from 'react';
import { Save, Loader2, CheckCircle } from 'lucide-react';

const inputCls = "w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#d4af37] transition-colors";
const cardCls = "bg-[#111] border border-white/5 rounded-xl p-6 space-y-4";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings').then(r=>r.json()).then(d=>{setSettings(d); setLoading(false)}).catch(()=>setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      await fetch('/api/admin/settings', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(settings) });
      setSaved(true); setTimeout(()=>setSaved(false),3000);
    } catch { alert('Failed to save'); } finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-[#d4af37] animate-spin" /></div>;
  if (!settings) return <div className="text-red-400">Failed to load settings.</div>;

  const update = (key: string, val: string) => setSettings({...settings, [key]: val});

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Site Settings</h1>
          <p className="text-gray-400 mt-1">Configure global site settings.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#d4af37] text-black font-semibold rounded-lg px-5 py-2.5 hover:bg-[#e5c158] transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className={cardCls}>
        <h2 className="text-lg font-semibold text-white">SEO & Meta</h2>
        <div><label className="block text-sm text-gray-300 mb-2">Site Title</label><input value={settings.siteTitle||''} onChange={e=>update('siteTitle',e.target.value)} className={inputCls} /></div>
        <div><label className="block text-sm text-gray-300 mb-2">Site Description</label><textarea rows={2} value={settings.siteDescription||''} onChange={e=>update('siteDescription',e.target.value)} className={inputCls+" resize-y"} /></div>
        <div><label className="block text-sm text-gray-300 mb-2">SEO Keywords</label><input value={settings.seoKeywords||''} onChange={e=>update('seoKeywords',e.target.value)} className={inputCls} /></div>
        <div><label className="block text-sm text-gray-300 mb-2">Default Meta Image</label><input value={settings.defaultMetaImage||''} onChange={e=>update('defaultMetaImage',e.target.value)} className={inputCls} /></div>
      </div>

      <div className={cardCls}>
        <h2 className="text-lg font-semibold text-white">Contact</h2>
        <div><label className="block text-sm text-gray-300 mb-2">Contact Email</label><input value={settings.contactEmail||''} onChange={e=>update('contactEmail',e.target.value)} className={inputCls} /></div>
        <div><label className="block text-sm text-gray-300 mb-2">Phone</label><input value={settings.phone||''} onChange={e=>update('phone',e.target.value)} className={inputCls} /></div>
        <div><label className="block text-sm text-gray-300 mb-2">WhatsApp</label><input value={settings.whatsapp||''} onChange={e=>update('whatsapp',e.target.value)} className={inputCls} /></div>
      </div>

      <div className={cardCls}>
        <h2 className="text-lg font-semibold text-white">Social Media</h2>
        {['facebook','instagram','linkedin','youtube'].map(p=>(
          <div key={p}><label className="block text-sm text-gray-300 mb-2 capitalize">{p}</label><input value={settings[p]||''} onChange={e=>update(p,e.target.value)} className={inputCls} /></div>
        ))}
      </div>

      <div className={cardCls}>
        <h2 className="text-lg font-semibold text-white">Footer</h2>
        <div><label className="block text-sm text-gray-300 mb-2">Footer Text</label><input value={settings.footerText||''} onChange={e=>update('footerText',e.target.value)} className={inputCls} /></div>
      </div>
    </div>
  );
}
