import { useState } from 'react';
import { Bell, Check, CheckCheck, AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DataFetcher } from '@/components/DataFetcher';
import { Badge } from '@/components/Badge';
import { PageHeader } from '@/components/PageHeader';
import { SEVERITY_COLORS, timeAgo } from '@/lib/constants';
import type { Alert } from '@/types';

const SEV_ICON: Record<string, typeof Bell> = { critical: AlertOctagon, warning: AlertTriangle, info: Info };

export function AlertsPage() {
  const [f, setF] = useState('all'); const [rk, setRk] = useState(0);
  return (
    <div className="p-6">
      <PageHeader title="Alerts" description="Real-time alerts triggered by trend spikes, sentiment shifts, and job failures" />
      <div className="flex items-center gap-2 mb-5">{['all','critical','warning','info','unresolved'].map(x => <button key={x} onClick={() => setF(x)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${f === x ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200 border border-slate-800'}`}>{x.charAt(0).toUpperCase()+x.slice(1)}</button>)}</div>
      <DataFetcher key={rk} query={() => { let q = supabase.from('alerts').select('*').order('triggered_at', { ascending: false }); if (f === 'critical' || f === 'warning' || f === 'info') q = q.eq('severity', f); if (f === 'unresolved') q = q.eq('resolved', false); return q; }}>
        {(alerts: Alert[]) => (
          <div className="space-y-3">{alerts.map(a => { const Icon = SEV_ICON[a.severity] || Bell; const c = SEVERITY_COLORS[a.severity] || '#6b7280'; return (
            <div key={a.id} className={`card p-4 fade-in ${a.resolved ? 'opacity-60' : ''}`} style={{ borderLeftWidth: '3px', borderLeftColor: c }}>
              <div className="flex items-start gap-3"><div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: c + '15', color: c }}><Icon className="w-4 h-4" /></div>
              <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><Badge text={a.severity} color={c} dot /><Badge text={a.alert_type} color="#6b7280" />{a.platform && <span className="text-xs text-slate-500">· {a.platform}</span>}<span className="text-xs text-slate-500 ml-auto">{timeAgo(a.triggered_at)}</span></div>
              <p className="text-sm text-slate-200">{a.message}</p>{a.sent_to.length > 0 && <div className="flex items-center gap-1.5 mt-2"><span className="text-xs text-slate-500">Sent to:</span>{a.sent_to.map(ch => <span key={ch} className="text-xs px-1.5 py-0.5 rounded bg-slate-800/50 text-slate-400">{ch}</span>)}</div>}</div>
              <div className="flex items-center gap-1.5 shrink-0">{!a.acknowledged && <button title="Acknowledge" className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200" onClick={async () => { await supabase.from('alerts').update({ acknowledged: true }).eq('id', a.id); setRk(k => k+1); }}><Check className="w-4 h-4" /></button>}{!a.resolved && <button title="Resolve" className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-emerald-400" onClick={async () => { await supabase.from('alerts').update({ resolved: true, acknowledged: true }).eq('id', a.id); setRk(k => k+1); }}><CheckCheck className="w-4 h-4" /></button>}</div></div>
            </div>
          );})}{!alerts.length && <div className="card p-12 text-center"><Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" /><p className="text-sm text-slate-400">No alerts in this category</p></div>}</div>
        )}
      </DataFetcher>
    </div>
  );
}
