import { BarChart3, Smile, Frown, Meh } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DataFetcher } from '@/components/DataFetcher';
import { DonutChart } from '@/components/DonutChart';
import { PageHeader } from '@/components/PageHeader';
import { SENTIMENT_COLORS, formatNumber } from '@/lib/constants';
import type { Analytics } from '@/types';

export function AnalyticsPage() {
  return (
    <div className="p-6">
      <PageHeader title="AI Analytics" description="Sentiment analysis, emotion detection, virality scoring, and trend prediction" />
      <DataFetcher query={() => supabase.from('analytics').select('*').order('generated_at', { ascending: false })}>
        {(analytics: Analytics[]) => (
          <div className="space-y-6">{analytics.map(item => (
            <div key={item.id} className="card p-5 fade-in">
              <div className="flex items-center justify-between mb-5"><div><div className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-400" /><h3 className="text-sm font-bold text-slate-100">{item.keyword}</h3></div><p className="text-xs text-slate-500 mt-0.5">{formatNumber(item.total_mentions)} mentions · {item.top_platform || 'All platforms'}</p></div><div className="text-right"><div className="text-xs text-slate-500">Avg Engagement</div><div className="text-lg font-bold text-slate-100">{formatNumber(item.avg_engagement)}</div></div></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div><h4 className="text-xs font-semibold text-slate-300 mb-3">Sentiment Breakdown</h4><div className="flex items-center justify-center py-2"><DonutChart data={[{ label: 'Positive', value: item.positive_pct, color: SENTIMENT_COLORS.Positive }, { label: 'Negative', value: item.negative_pct, color: SENTIMENT_COLORS.Negative }, { label: 'Neutral', value: item.neutral_pct, color: SENTIMENT_COLORS.Neutral }]} centerValue={`${item.positive_pct.toFixed(0)}%`} centerLabel="Positive" size={140} /></div></div>
                <div><h4 className="text-xs font-semibold text-slate-300 mb-3">Sentiment Scores</h4><div className="space-y-3"><SentBar label="Positive" value={item.positive_pct} color={SENTIMENT_COLORS.Positive} icon={<Smile className="w-4 h-4" />} /><SentBar label="Negative" value={item.negative_pct} color={SENTIMENT_COLORS.Negative} icon={<Frown className="w-4 h-4" />} /><SentBar label="Neutral" value={item.neutral_pct} color={SENTIMENT_COLORS.Neutral} icon={<Meh className="w-4 h-4" />} /></div></div>
                <div><h4 className="text-xs font-semibold text-slate-300 mb-3">Trending Topics</h4><div className="flex flex-wrap gap-2">{item.trending_topics.map((t, i) => <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: '#3b82f615', color: '#60a5fa' }}>{t}</span>)}</div><div className="mt-4"><h4 className="text-xs font-semibold text-slate-300 mb-2">Virality Stats</h4><div className="space-y-1.5">{item.virality_stats.avg_virality !== undefined && <div className="flex items-center justify-between text-xs"><span className="text-slate-400">Avg Virality</span><span className="font-semibold text-slate-200">{item.virality_stats.avg_virality.toFixed(1)}</span></div>}{item.virality_stats.peak_day && <div className="flex items-center justify-between text-xs"><span className="text-slate-400">Peak Day</span><span className="font-semibold text-slate-200">{item.virality_stats.peak_day}</span></div>}</div></div></div>
              </div>
              {item.top_influencers.length > 0 && <div className="mt-5 pt-4 border-t border-slate-800"><h4 className="text-xs font-semibold text-slate-300 mb-3">Top Influencers</h4><div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{item.top_influencers.map((inf, i) => <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white">{inf.username.charAt(0).toUpperCase()}</div><div className="min-w-0"><div className="text-xs font-semibold text-slate-200 truncate">{inf.username}</div><div className="text-xs text-emerald-400 font-bold">Score: {inf.score.toFixed(1)}</div></div></div>)}</div></div>}
            </div>
          ))}</div>
        )}
      </DataFetcher>
    </div>
  );
}

function SentBar({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return <div><div className="flex items-center justify-between mb-1"><span className="flex items-center gap-1.5 text-xs text-slate-300"><span style={{ color }}>{icon}</span>{label}</span><span className="text-xs font-semibold text-slate-200">{value.toFixed(1)}%</span></div><div className="h-2 bg-slate-800/60 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }} /></div></div>;
}
