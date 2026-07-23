import { useState } from 'react';
import { Search, BadgeCheck, ExternalLink, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DataFetcher } from '@/components/DataFetcher';
import { PageHeader } from '@/components/PageHeader';
import { PLATFORMS, formatNumber } from '@/lib/constants';
import type { Influencer } from '@/types';

export function InfluencersPage() {
  const [search, setSearch] = useState(''); const [pf, setPf] = useState('all');
  return (
    <div className="p-6">
      <PageHeader title="Influencers" description="Auto-scored influencer profiles with engagement, sentiment, and virality metrics" />
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]"><Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" placeholder="Search by username or name..." className="input-field pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>
        <select className="input-field w-auto" value={pf} onChange={e => setPf(e.target.value)}><option value="all">All Platforms</option>{PLATFORMS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}</select>
      </div>
      <DataFetcher query={() => { let q = supabase.from('influencers').select('*').order('score', { ascending: false }); if (search) q = q.or(`username.ilike.%${search}%,full_name.ilike.%${search}%`); if (pf !== 'all') q = q.eq('platform', pf); return q; }}>
        {(infs: Influencer[]) => (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{infs.map(inf => {
            const plat = PLATFORMS.find(p => p.name === inf.platform);
            return <div key={inf.id} className="card card-hover p-5 fade-in">
              <div className="flex items-start gap-3 mb-4"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-lg font-bold text-white shrink-0">{inf.username.charAt(0).toUpperCase()}</div>
              <div className="flex-1 min-w-0"><div className="flex items-center gap-1.5"><span className="text-sm font-bold text-slate-100 truncate">{inf.username}</span>{inf.verified && <BadgeCheck className="w-4 h-4 text-blue-400 shrink-0" />}</div><div className="text-xs text-slate-500 truncate">{inf.full_name || 'Unknown'}</div><div className="flex items-center gap-1.5 mt-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: plat?.color || '#3b82f6' }} /><span className="text-xs text-slate-400">{inf.platform}</span></div></div>
              <div className="text-right shrink-0"><div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /><span className="text-lg font-bold text-slate-100">{inf.score.toFixed(1)}</span></div><div className="text-xs text-slate-500">Score</div></div></div>
              <div className="grid grid-cols-3 gap-2 mb-4"><div className="text-center p-2 rounded-lg bg-slate-800/30"><div className="text-sm font-bold text-slate-200">{formatNumber(inf.followers)}</div><div className="text-xs text-slate-500">Followers</div></div><div className="text-center p-2 rounded-lg bg-slate-800/30"><div className="text-sm font-bold text-slate-200">{inf.engagement_rate.toFixed(1)}%</div><div className="text-xs text-slate-500">Engagement</div></div><div className="text-center p-2 rounded-lg bg-slate-800/30"><div className="text-sm font-bold text-slate-200">{inf.virality_score.toFixed(1)}</div><div className="text-xs text-slate-500">Virality</div></div></div>
              <div className="flex items-center justify-between text-xs"><div className="flex items-center gap-3 text-slate-400"><span>Likes: {formatNumber(inf.avg_likes)}</span><span>Comments: {formatNumber(inf.avg_comments)}</span></div>{inf.profile_url && <a href={inf.profile_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:text-blue-300">Profile <ExternalLink className="w-3 h-3" /></a>}</div>
              <div className="mt-3 pt-3 border-t border-slate-800/50"><div className="flex items-center justify-between text-xs"><span className="text-slate-400">Sentiment Score</span><span className="font-semibold text-emerald-400">{inf.sentiment_score.toFixed(1)}</span></div><div className="h-1.5 bg-slate-800/60 rounded-full overflow-hidden mt-1.5"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${inf.sentiment_score}%` }} /></div></div>
            </div>;
          })}</div>
        )}
      </DataFetcher>
    </div>
  );
}
