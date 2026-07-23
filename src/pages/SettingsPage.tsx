import { useState, useEffect } from 'react';
import { Shield, Key, Globe, Eye, Lock, Activity, Database, Server } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/Badge';
import { PLATFORMS } from '@/lib/constants';
import type { UserPreference } from '@/types';

export function SettingsPage() {
  const [prefs, setPrefs] = useState<UserPreference[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { supabase.from('user_preferences').select('*').then(({ data }) => { setPrefs(data ?? []); setLoading(false); }); }, []);
  const get = (k: string) => prefs.find(p => p.preference_key === k)?.preference_value || '';
  const set = async (k: string, v: string) => { const ex = prefs.find(p => p.preference_key === k); if (ex) await supabase.from('user_preferences').update({ preference_value: v }).eq('id', ex.id); else await supabase.from('user_preferences').insert({ preference_key: k, preference_value: v }); const { data } = await supabase.from('user_preferences').select('*'); setPrefs(data ?? []); };
  return (
    <div className="p-6">
      <PageHeader title="Settings" description="Configure API keys, security, and application preferences" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5"><div className="flex items-center gap-2 mb-4"><Key className="w-4 h-4 text-amber-400" /><h3 className="text-sm font-semibold text-slate-200">API Keys</h3></div><div className="space-y-3">{[{k:'twitter',l:'Twitter/X Bearer Token'},{k:'reddit',l:'Reddit Client ID'},{k:'youtube',l:'YouTube Data API Key'},{k:'newsapi',l:'NewsAPI Key'},{k:'instagram',l:'Instagram Access Token'}].map(f => <div key={f.k}><label className="text-xs text-slate-400 mb-1 block">{f.l}</label><div className="relative"><input type="password" className="input-field pr-9" placeholder="Enter API key..." /><Eye className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" /></div></div>)}</div></div>
        <div className="card p-5"><div className="flex items-center gap-2 mb-4"><Shield className="w-4 h-4 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-200">Security & Anti-Detection</h3></div><div className="space-y-3"><Toggle icon={<Lock className="w-4 h-4" />} label="Encrypt API Keys" desc="AES-256 encryption" checked={true} onChange={() => {}} /><Toggle icon={<Globe className="w-4 h-4" />} label="Proxy Rotation" desc="Auto-rotate IPs" checked={get('proxy_enabled') === 'true'} onChange={v => set('proxy_enabled', v ? 'true' : 'false')} /><Toggle icon={<Eye className="w-4 h-4" />} label="Stealth Browsing" desc="Undetectable Selenium" checked={true} onChange={() => {}} /><Toggle icon={<Activity className="w-4 h-4" />} label="Audit Logging" desc="Track all actions" checked={true} onChange={() => {}} /><Toggle icon={<Shield className="w-4 h-4" />} label="TLS Fingerprint Rotation" desc="Rotate TLS fingerprints" checked={false} onChange={() => {}} /></div></div>
        <div className="card p-5"><div className="flex items-center gap-2 mb-4"><Database className="w-4 h-4 text-blue-400" /><h3 className="text-sm font-semibold text-slate-200">Platform Configuration</h3></div><div className="space-y-2 max-h-64 overflow-y-auto">{PLATFORMS.map(p => <div key={p.name} className="flex items-center justify-between py-1.5"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} /><span className="text-xs text-slate-200">{p.name}</span></div><div className="flex items-center gap-2">{p.hasApi ? <Badge text="API" color="#10b981" /> : <Badge text="Scrape" color="#f59e0b" />}<Badge text={p.priority} color={p.priority === 'P0' ? '#3b82f6' : p.priority === 'P1' ? '#f59e0b' : '#6b7280'} /></div></div>)}</div></div>
        <div className="card p-5"><div className="flex items-center gap-2 mb-4"><Server className="w-4 h-4 text-violet-400" /><h3 className="text-sm font-semibold text-slate-200">General Preferences</h3></div><div className="space-y-3"><div><label className="text-xs text-slate-400 mb-1 block">Default Platform</label><select className="input-field" value={get('default_platform')} onChange={e => set('default_platform', e.target.value)}>{PLATFORMS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}</select></div><div><label className="text-xs text-slate-400 mb-1 block">Refresh Interval (seconds)</label><input type="number" className="input-field" value={get('refresh_interval') || '30'} onChange={e => set('refresh_interval', e.target.value)} /></div><Toggle icon={<Activity className="w-4 h-4" />} label="Enable Alerts" desc="Real-time notifications" checked={get('enable_alerts') === 'true'} onChange={v => set('enable_alerts', v ? 'true' : 'false')} /><Toggle icon={<Database className="w-4 h-4" />} label="Data Caching" desc="Cache API responses" checked={true} onChange={() => {}} /></div></div>
      </div>
      {loading && <div className="text-xs text-slate-500 text-center mt-4">Loading preferences...</div>}
    </div>
  );
}

function Toggle({ icon, label, desc, checked, onChange }: { icon: React.ReactNode; label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <div className="flex items-center justify-between py-1.5"><div className="flex items-center gap-3"><div className="text-slate-400">{icon}</div><div><div className="text-xs font-medium text-slate-200">{label}</div><div className="text-xs text-slate-500">{desc}</div></div></div><button onClick={() => onChange(!checked)} className={`relative rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-slate-700'}`} style={{ width: '40px', height: '22px' }}><div className="absolute bg-white rounded-full transition-transform" style={{ width: '18px', height: '18px', transform: checked ? 'translateX(18px)' : 'translateX(2px)', top: '2px' }} /></button></div>;
}
