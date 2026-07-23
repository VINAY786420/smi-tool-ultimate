import { useState } from 'react';
import { Plus, Search, Filter, Heart, MessageCircle, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DataFetcher } from '@/components/DataFetcher';
import { Badge } from '@/components/Badge';
import { PageHeader } from '@/components/PageHeader';
import { PLATFORMS, SENTIMENT_COLORS, formatNumber, formatPrice, timeAgo } from '@/lib/constants';
import type { CollectedData } from '@/types';

export function CollectionPage() {
  const [search, setSearch] = useState(''); const [pf, setPf] = useState('all'); const [tf, setTf] = useState('all'); const [page, setPage] = useState(0); const ps = 12;
  return (
    <div className="p-6">
      <PageHeader title="Data Collection" description="Browse collected data across all 18 platforms" actions={<button className="btn-primary"><Plus className="w-4 h-4" />New Collection</button>} />
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]"><Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" placeholder="Search by keyword, title, author..." className="input-field pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} /></div>
        <select className="input-field w-auto" value={pf} onChange={e => { setPf(e.target.value); setPage(0); }}><option value="all">All Platforms</option>{PLATFORMS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}</select>
        <select className="input-field w-auto" value={tf} onChange={e => { setTf(e.target.value); setPage(0); }}><option value="all">All Types</option><option value="Post">Post</option><option value="Product">Product</option><option value="Article">Article</option></select>
      </div>
      <DataFetcher query={() => { let q = supabase.from('collected_data').select('*'); if (search) q = q.or(`keyword.ilike.%${search}%,title.ilike.%${search}%,author.ilike.%${search}%`); if (pf !== 'all') q = q.eq('platform', pf); if (tf !== 'all') q = q.eq('data_type', tf); return q.order('collected_at', { ascending: false }).range(page * ps, (page + 1) * ps - 1); }}>
        {(data: CollectedData[]) => {
          if (!data.length && page === 0) return <div className="card p-12 text-center"><Filter className="w-10 h-10 text-slate-600 mx-auto mb-3" /><p className="text-sm text-slate-400">No data matches your filters</p></div>;
          return (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider"><th className="text-left px-4 py-3 font-medium">Platform</th><th className="text-left px-4 py-3 font-medium">Type</th><th className="text-left px-4 py-3 font-medium">Content</th><th className="text-left px-4 py-3 font-medium">Author</th><th className="text-right px-4 py-3 font-medium">Engagement</th><th className="text-left px-4 py-3 font-medium">Sentiment</th><th className="text-left px-4 py-3 font-medium">Source</th><th className="text-left px-4 py-3 font-medium">Collected</th></tr></thead>
              <tbody>{data.map(item => <tr key={item.id} className="table-row border-b border-slate-800/50 last:border-0">
                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: PLATFORMS.find(p => p.name === item.platform)?.color || '#3b82f6' }} /><span className="text-xs font-medium text-slate-200">{item.platform}</span></div></td>
                <td className="px-4 py-3"><Badge text={item.data_type} color="#6b7280" /></td>
                <td className="px-4 py-3 max-w-xs"><div className="text-xs text-slate-200 font-medium truncate">{item.title || 'Untitled'}</div><div className="text-xs text-slate-500 truncate">{item.keyword}</div></td>
                <td className="px-4 py-3"><span className="text-xs text-slate-300">{item.author || '-'}</span></td>
                <td className="px-4 py-3"><div className="flex items-center gap-3 text-xs text-slate-400">{item.likes !== null && <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(item.likes)}</span>}{item.comments !== null && <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{formatNumber(item.comments)}</span>}{item.views !== null && <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(item.views)}</span>}</div>{item.price !== null && <div className="text-xs font-semibold text-emerald-400 mt-1">{formatPrice(item.price)}</div>}</td>
                <td className="px-4 py-3">{item.sentiment ? <Badge text={item.sentiment} color={SENTIMENT_COLORS[item.sentiment] || '#6b7280'} dot /> : <span className="text-xs text-slate-600">-</span>}</td>
                <td className="px-4 py-3"><Badge text={item.source} color={item.source === 'api' ? '#3b82f6' : '#6b7280'} /></td>
                <td className="px-4 py-3"><span className="text-xs text-slate-500">{timeAgo(item.collected_at)}</span></td>
              </tr>)}</tbody></table></div>
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800"><span className="text-xs text-slate-500">Page {page + 1}</span><div className="flex items-center gap-2"><button className="btn-ghost disabled:opacity-40" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button><button className="btn-ghost disabled:opacity-40" disabled={data.length === ps} onClick={() => setPage(page + 1)}>Next</button></div></div>
            </div>
          );
        }}
      </DataFetcher>
    </div>
  );
}
