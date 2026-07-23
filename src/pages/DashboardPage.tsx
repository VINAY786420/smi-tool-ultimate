import { useMemo } from 'react';
import { Database, TrendingUp, Users, Briefcase, Activity, Eye, Heart, MessageCircle, Share2, Sparkles, Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DataFetcher } from '@/components/DataFetcher';
import { StatCard } from '@/components/StatCard';
import { Badge } from '@/components/Badge';
import { BarChart } from '@/components/BarChart';
import { DonutChart } from '@/components/DonutChart';
import { LineChart } from '@/components/LineChart';
import { PageHeader } from '@/components/PageHeader';
import { PLATFORMS, SENTIMENT_COLORS, formatNumber, timeAgo } from '@/lib/constants';
import type { CollectedData, Job, Alert, Influencer } from '@/types';

export function DashboardPage() {
  return (
    <div className="p-6">
      <PageHeader title="Dashboard" description="Real-time overview of social media intelligence across all 18 platforms" />
      <DataFetcher query={() => supabase.from('collected_data').select('*').order('collected_at', { ascending: false }).limit(500)}>
        {(collected: CollectedData[]) => <DashboardContent collected={collected} />}
      </DataFetcher>
    </div>
  );
}

function DashboardContent({ collected }: { collected: CollectedData[] }) {
  const totalRecords = collected.length;
  const totalEng = collected.reduce((s, d) => s + (d.likes ?? 0) + (d.comments ?? 0) + (d.shares ?? 0), 0);
  const totalViews = collected.reduce((s, d) => s + (d.views ?? 0), 0);
  const sentCounts = useMemo(() => { const c: Record<string, number> = { Positive: 0, Negative: 0, Neutral: 0 }; collected.forEach(d => { if (d.sentiment) c[d.sentiment] = (c[d.sentiment] || 0) + 1; }); return c; }, [collected]);
  const platCounts = useMemo(() => { const c: Record<string, number> = {}; collected.forEach(d => { c[d.platform] = (c[d.platform] || 0) + 1; }); return Object.entries(c).sort((a,b) => b[1]-a[1]).slice(0,8).map(([label,value]) => ({ label, value, color: PLATFORMS.find(p => p.name === label)?.color || '#3b82f6' })); }, [collected]);
  const engData = useMemo(() => { const days = 7; const now = new Date(); const buckets: { label: string; value: number }[] = []; for (let i = days-1; i >= 0; i--) { const day = new Date(now); day.setDate(day.getDate()-i); const ds = new Date(day); ds.setHours(0,0,0,0); const de = new Date(day); de.setHours(23,59,59,999); const val = collected.filter(d => { const dt = new Date(d.collected_at); return dt >= ds && dt <= de; }).reduce((s,d) => s + (d.likes??0) + (d.comments??0) + (d.shares??0), 0); buckets.push({ label: day.toLocaleDateString('en',{weekday:'short'}), value: val }); } return buckets; }, [collected]);
  const recent = collected.slice(0, 6);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Records" value={formatNumber(totalRecords)} icon={<Database className="w-5 h-5" />} trend={{ value: 12, positive: true }} accentColor="#3b82f6" />
        <StatCard label="Total Engagement" value={formatNumber(totalEng)} icon={<Activity className="w-5 h-5" />} trend={{ value: 8, positive: true }} accentColor="#10b981" />
        <StatCard label="Total Views" value={formatNumber(totalViews)} icon={<Eye className="w-5 h-5" />} trend={{ value: 24, positive: true }} accentColor="#f59e0b" />
        <StatCard label="Platforms Active" value={platCounts.length} icon={<TrendingUp className="w-5 h-5" />} accentColor="#8b5cf6" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2"><h3 className="text-sm font-semibold text-slate-200 mb-4">Engagement Over Last 7 Days</h3><LineChart data={engData} height={220} color="#3b82f6" /></div>
        <div className="card p-5"><h3 className="text-sm font-semibold text-slate-200 mb-4">Sentiment Distribution</h3><div className="flex items-center justify-center py-4"><DonutChart data={[{ label: 'Positive', value: sentCounts.Positive, color: SENTIMENT_COLORS.Positive }, { label: 'Negative', value: sentCounts.Negative, color: SENTIMENT_COLORS.Negative }, { label: 'Neutral', value: sentCounts.Neutral, color: SENTIMENT_COLORS.Neutral }]} centerValue={`${totalRecords}`} centerLabel="Records" /></div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5"><h3 className="text-sm font-semibold text-slate-200 mb-4">Records by Platform</h3><BarChart data={platCounts} height={220} /></div>
        <div className="card p-5"><h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Collected Data</h3><div className="space-y-3">{recent.map(item => (
          <div key={item.id} className="flex items-start gap-3 py-2 border-b border-slate-800/50 last:border-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: (PLATFORMS.find(p => p.name === item.platform)?.color || '#3b82f6') + '20' }}><Sparkles className="w-4 h-4 text-slate-300" /></div>
            <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><span className="text-xs font-semibold text-slate-200">{item.platform}</span>{item.sentiment && <Badge text={item.sentiment} color={SENTIMENT_COLORS[item.sentiment]} dot />}</div>
            <p className="text-xs text-slate-400 truncate">{item.title || item.content || 'No content'}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500"><span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(item.likes ?? 0)}</span><span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{formatNumber(item.comments ?? 0)}</span><span className="flex items-center gap-1"><Share2 className="w-3 h-3" />{formatNumber(item.shares ?? 0)}</span><span>{timeAgo(item.collected_at)}</span></div></div>
          </div>))}</div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DataFetcher query={() => supabase.from('jobs').select('*').order('created_at', { ascending: false }).limit(5)}>{(jobs: Job[]) => (
          <div className="card p-5"><div className="flex items-center gap-2 mb-4"><Briefcase className="w-4 h-4 text-blue-400" /><h3 className="text-sm font-semibold text-slate-200">Recent Jobs</h3></div><div className="space-y-2">{jobs.map(j => <div key={j.id} className="flex items-center justify-between py-1.5 text-xs"><span className="text-slate-300">{j.job_type} · {j.platform || 'all'}</span><Badge text={j.status} color={j.status === 'completed' ? '#10b981' : j.status === 'running' ? '#3b82f6' : j.status === 'failed' ? '#ef4444' : '#6b7280'} dot /></div>)}</div></div>
        )}</DataFetcher>
        <DataFetcher query={() => supabase.from('alerts').select('*').order('triggered_at', { ascending: false }).limit(5)}>{(alerts: Alert[]) => (
          <div className="card p-5"><div className="flex items-center gap-2 mb-4"><Bell className="w-4 h-4 text-amber-400" /><h3 className="text-sm font-semibold text-slate-200">Recent Alerts</h3></div><div className="space-y-2">{alerts.map(a => <div key={a.id} className="py-1.5"><div className="flex items-center gap-2 mb-0.5"><Badge text={a.severity} color={a.severity === 'critical' ? '#ef4444' : a.severity === 'warning' ? '#f59e0b' : '#3b82f6'} dot /><span className="text-xs text-slate-500">{timeAgo(a.triggered_at)}</span></div><p className="text-xs text-slate-400 truncate">{a.message}</p></div>)}</div></div>
        )}</DataFetcher>
        <DataFetcher query={() => supabase.from('influencers').select('*').order('score', { ascending: false }).limit(5)}>{(infs: Influencer[]) => (
          <div className="card p-5"><div className="flex items-center gap-2 mb-4"><Users className="w-4 h-4 text-emerald-400" /><h3 className="text-sm font-semibold text-slate-200">Top Influencers</h3></div><div className="space-y-2">{infs.map(i => <div key={i.id} className="flex items-center justify-between py-1.5"><div className="flex items-center gap-2 min-w-0"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shrink-0">{i.username.charAt(0).toUpperCase()}</div><div className="min-w-0"><div className="text-xs font-semibold text-slate-200 truncate">{i.username}</div><div className="text-xs text-slate-500">{formatNumber(i.followers)} followers</div></div></div><span className="text-xs font-bold text-emerald-400">{i.score.toFixed(1)}</span></div>)}</div></div>
        )}</DataFetcher>
      </div>
    </div>
  );
}
