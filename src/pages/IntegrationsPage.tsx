import { useState } from 'react';
import { Plus, Webhook, Trash2, Power, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DataFetcher } from '@/components/DataFetcher';
import { Badge } from '@/components/Badge';
import { PageHeader } from '@/components/PageHeader';
import { timeAgo } from '@/lib/constants';
import type { Webhook as WH } from '@/types';

export function IntegrationsPage() {
  const [rk, setRk] = useState(0); const [show, setShow] = useState(false); const [nw, setNw] = useState({ name: '', url: '', events: '' });
  const add = async () => { if (!nw.name || !nw.url) return; await supabase.from('webhooks').insert({ name: nw.name, url: nw.url, events: nw.events, headers: '{}', active: true }); setNw({ name: '', url: '', events: '' }); setShow(false); setRk(k => k+1); };
  return (
    <div className="p-6">
      <PageHeader title="Integrations" description="Webhooks and external service integrations for alerts and data export" actions={<button className="btn-primary" onClick={() => setShow(!show)}><Plus className="w-4 h-4" />Add Webhook</button>} />
      {show && <div className="card p-5 mb-5 fade-in"><h3 className="text-sm font-semibold text-slate-200 mb-4">New Webhook</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-3"><input className="input-field" placeholder="Name" value={nw.name} onChange={e => setNw({...nw, name: e.target.value})} /><input className="input-field" placeholder="URL" value={nw.url} onChange={e => setNw({...nw, url: e.target.value})} /><input className="input-field" placeholder="Events (comma-separated)" value={nw.events} onChange={e => setNw({...nw, events: e.target.value})} /></div><div className="flex items-center gap-2 mt-3"><button className="btn-primary" onClick={add}>Save</button><button className="btn-ghost" onClick={() => setShow(false)}>Cancel</button></div></div>}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">{[{'name':'Slack','color':'#4a154b','icon':'S'},{'name':'Telegram','color':'#0088cc','icon':'T'},{'name':'Discord','color':'#5865f2','icon':'D'},{'name':'Google Sheets','color':'#0f9d58','icon':'G'},{'name':'Notion','color':'#000000','icon':'N'},{'name':'Email','color':'#ea4335','icon':'E'},{'name':'WordPress','color':'#21759b','icon':'W'},{'name':'Apify','color':'#3a3a3a','icon':'A'},{'name':'Zapier','color':'#ff4f00','icon':'Z'},{'name':'Webhooks','color':'#3b82f6','icon':'H'}].map(i => <div key={i.name} className="card p-3 text-center card-hover"><div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: i.color }}>{i.icon}</div><div className="text-xs font-medium text-slate-300">{i.name}</div></div>)}</div>
      <div className="mb-4"><h3 className="text-sm font-semibold text-slate-200 mb-3">Configured Webhooks</h3></div>
      <DataFetcher key={rk} query={() => supabase.from('webhooks').select('*').order('created_at', { ascending: false })}>
        {(whs: WH[]) => (
          <div className="space-y-3">{whs.map(w => <div key={w.id} className="card p-4 fade-in"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: w.active ? '#10b98115' : '#6b728015', color: w.active ? '#10b981' : '#6b7280' }}><Webhook className="w-5 h-5" /></div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><span className="text-sm font-semibold text-slate-100">{w.name}</span><Badge text={w.active ? 'Active' : 'Inactive'} color={w.active ? '#10b981' : '#6b7280'} dot /></div><div className="text-xs text-slate-500 truncate">{w.url}</div>{w.events && <div className="flex items-center gap-1.5 mt-1.5">{w.events.split(',').map(ev => <span key={ev} className="text-xs px-1.5 py-0.5 rounded bg-slate-800/50 text-slate-400">{ev.trim()}</span>)}</div>}</div><div className="text-xs text-slate-500 shrink-0">{timeAgo(w.created_at)}</div><div className="flex items-center gap-1.5 shrink-0"><button title={w.active ? 'Disable' : 'Enable'} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200" onClick={async () => { await supabase.from('webhooks').update({ active: !w.active }).eq('id', w.id); setRk(k => k+1); }}><Power className="w-4 h-4" /></button><button title="Test" className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-blue-400"><Send className="w-4 h-4" /></button><button title="Delete" className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400" onClick={async () => { await supabase.from('webhooks').delete().eq('id', w.id); setRk(k => k+1); }}><Trash2 className="w-4 h-4" /></button></div></div></div>)}
          {!whs.length && <div className="card p-12 text-center"><Webhook className="w-10 h-10 text-slate-600 mx-auto mb-3" /><p className="text-sm text-slate-400">No webhooks configured</p></div>}</div>
        )}
      </DataFetcher>
    </div>
  );
}
