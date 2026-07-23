import { Search, Bell, RefreshCw } from 'lucide-react';
export function Topbar({ title, subtitle, onRefresh, refreshing }: { title: string; subtitle?: string; onRefresh?: () => void; refreshing?: boolean }) {
  return (
    <header className="h-16 shrink-0 border-b border-slate-800 bg-[#0d1320]/80 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between px-6">
      <div><h1 className="text-lg font-bold text-slate-100">{title}</h1>{subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}</div>
      <div className="flex items-center gap-3">
        <div className="relative"><Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" placeholder="Search (Cmd+K)" className="input-field pl-9 w-64" /></div>
        <button className="btn-ghost" onClick={onRefresh} disabled={refreshing}><RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />Refresh</button>
        <button className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors"><Bell className="w-5 h-5 text-slate-400" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /></button>
      </div>
    </header>
  );
}
