import { useState } from 'react';
import { Plus, Clock, CheckCircle, XCircle, Loader2, AlertCircle, Briefcase } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DataFetcher } from '@/components/DataFetcher';
import { Badge } from '@/components/Badge';
import { PageHeader } from '@/components/PageHeader';
import { JOB_STATUS_COLORS, timeAgo } from '@/lib/constants';
import type { Job } from '@/types';

const STATUS_ICON: Record<string, typeof Clock> = { pending: Clock, running: Loader2, completed: CheckCircle, failed: XCircle };

export function JobsPage() {
  const [sf, setSf] = useState('all'); const [rk, setRk] = useState(0);
  return (
    <div className="p-6">
      <PageHeader title="Jobs" description="Background collection and analysis jobs with priority scheduling" actions={<button className="btn-primary"><Plus className="w-4 h-4" />New Job</button>} />
      <div className="flex items-center gap-2 mb-5">{['all','pending','running','completed','failed'].map(s => <button key={s} onClick={() => setSf(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sf === s ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200 border border-slate-800'}`}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>)}</div>
      <DataFetcher key={rk} query={() => { let q = supabase.from('jobs').select('*').order('created_at', { ascending: false }); if (sf !== 'all') q = q.eq('status', sf); return q; }}>
        {(jobs: Job[]) => (
          <div className="space-y-3">{jobs.map(j => { const Icon = STATUS_ICON[j.status] || AlertCircle; const c = JOB_STATUS_COLORS[j.status] || '#6b7280'; return (
            <div key={j.id} className="card card-hover p-4 fade-in"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: c + '15', color: c }}><Icon className={`w-5 h-5 ${j.status === 'running' ? 'animate-spin' : ''}`} /></div>
            <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><span className="text-sm font-semibold text-slate-100 capitalize">{j.job_type}</span><Badge text={j.status} color={c} dot />{j.platform && <span className="text-xs text-slate-500">· {j.platform}</span>}{j.keyword && <span className="text-xs text-slate-500">· "{j.keyword}"</span>}</div>
            <div className="flex items-center gap-4 text-xs text-slate-500"><span>Priority: P{j.priority}</span>{j.retry_count > 0 && <span className="text-amber-400">Retries: {j.retry_count}</span>}<span>Created {timeAgo(j.created_at)}</span>{j.started_at && <span>Started {timeAgo(j.started_at)}</span>}{j.completed_at && <span>Completed {timeAgo(j.completed_at)}</span>}</div>
            {j.error_message && <div className="mt-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-xs text-red-400">{j.error_message}</div>}</div>
            {j.status === 'pending' && <button className="btn-ghost text-xs" onClick={async () => { await supabase.from('jobs').update({ status: 'running', started_at: new Date().toISOString() }).eq('id', j.id); setRk(k => k+1); }}>Start</button>}
            {(j.status === 'running' || j.status === 'failed') && <button className="btn-ghost text-xs" onClick={async () => { await supabase.from('jobs').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', j.id); setRk(k => k+1); }}>Mark Done</button>}</div></div>
          );})}{!jobs.length && <div className="card p-12 text-center"><Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-3" /><p className="text-sm text-slate-400">No jobs found for this filter</p></div>}</div>
        )}
      </DataFetcher>
    </div>
  );
}
