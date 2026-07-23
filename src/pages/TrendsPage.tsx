import { useMemo } from 'react';
import { TrendingUp, Hash, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DataFetcher } from '@/components/DataFetcher';
import { Badge } from '@/components/Badge';
import { BarChart } from '@/components/BarChart';
import { PageHeader } from '@/components/PageHeader';
import { PLATFORMS, formatNumber, timeAgo } from '@/lib/constants';
import type { Trend } from '@/types';

export function TrendsPage() {
  return (
    <div className="p-6">
      <PageHeader title="Trends" description="Real-time trending topics and hashtag performance across platforms" />
      <DataFetcher query={() => supabase.from('trends').select('*').order('volume', { ascending: false })}>
        {(trends: Trend[]) => {
          const volByPlat = useMemo(() => { const c: Record<string, number> = {}; trends.forEach(t => { c[t.platform] = (c[t.platform] || 0) + t.volume; }); return Object.entries(c).sort((a,b) => b[1]-a[1]).slice(0,8).map(([label,value]) => ({ label, value, color: PLATFORMS.find(p => p.name === label)?.color || '#3b82f6' })); }, [trends]);
          const top = trends.slice(0, 5);
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="card p-5 lg:col-span-2"><h3 className="text-sm font-semibold text-slate-200 mb-4">Trend Volume by Platform</h3><BarChart data={volByPlat} height={240} /></div>
                <div className="card p-5"><h3 className="text-sm font-semibold text-slate-200 mb-4">Top Trending Keywords</h3><div className="space-y-3">{top.map((t, i) => <div key={t.id} className="flex items-center gap-3"><div className="text-lg font-bold text-slate-600 w-6">{i+1}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5 text-blue-400" /><span className="text-sm font-semibold text-slate-200 truncate">{t.keyword}</span></div><div className="flex items-center gap-2 mt-0.5"><span className="text-xs text-slate-500">{t.platform}</span>{t.hashtag && <span className="text-xs text-slate-500 flex items-center gap-0.5"><Hash className="w-3 h-3" />{t.hashtag.replace('#','')}</span>}</div></div><div className="text-right"><div className="text-sm font-bold text-slate-200">{formatNumber(t.volume)}</div><div className={`text-xs flex items-center gap-0.5 ${t.growth_rate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{t.growth_rate >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}{Math.abs(t.growth_rate)}%</div></div></div>)}</div></div>
              </div>
              <div className="card overflow-hidden"><div className="px-5 py-3 border-b border-slate-800"><h3 className="text-sm font-semibold text-slate-200">All Trends</h3></div><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider"><th className="text-left px-4 py-3 font-medium">Keyword</th><th className="text-left px-4 py-3 font-medium">Platform</th><th className="text-left px-4 py-3 font-medium">Hashtag</th><th className="text-right px-4 py-3 font-medium">Volume</th><th className="text-right px-4 py-3 font-medium">Growth</th><th className="text-left px-4 py-3 font-medium">Peak Time</th><th className="text-left px-4 py-3 font-medium">Predicted Peak</th><th className="text-left px-4 py-3 font-medium">Recorded</th></tr></thead><tbody>{trends.map(t => <tr key={t.id} className="table-row border-b border-slate-800/50 last:border-0"><td className="px-4 py-3"><span className="text-xs font-semibold text-slate-200">{t.keyword}</span></td><td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: PLATFORMS.find(p => p.name === t.platform)?.color || '#3b82f6' }} /><span className="text-xs text-slate-300">{t.platform}</span></div></td><td className="px-4 py-3">{t.hashtag ? <Badge text={t.hashtag} color="#8b5cf6" /> : <span className="text-xs text-slate-600">-</span>}</td><td className="px-4 py-3 text-right"><span className="text-xs font-semibold text-slate-200">{formatNumber(t.volume)}</span></td><td className="px-4 py-3 text-right"><span className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${t.growth_rate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{t.growth_rate >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}{Math.abs(t.growth_rate)}%</span></td><td className="px-4 py-3"><span className="text-xs text-slate-400">{t.peak_time || '-'}</span></td><td className="px-4 py-3"><span className="text-xs text-slate-400">{t.predicted_peak ? new Date(t.predicted_peak).toLocaleString('en',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '-'}</span></td><td className="px-4 py-3"><span className="text-xs text-slate-500">{timeAgo(t.recorded_at)}</span></td></tr>)}</tbody></table></div></div>
            </div>
          );
        }}
      </DataFetcher>
    </div>
  );
}
