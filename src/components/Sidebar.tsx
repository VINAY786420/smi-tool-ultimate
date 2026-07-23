import { LayoutDashboard, Database, TrendingUp, BarChart3, Users, Briefcase, Bell, FileText, Webhook, Settings, Radar } from 'lucide-react';

export type PageId = 'dashboard' | 'collection' | 'trends' | 'analytics' | 'influencers' | 'jobs' | 'alerts' | 'reports' | 'integrations' | 'settings';

const NAV: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }, { id: 'collection', label: 'Data Collection', icon: Database },
  { id: 'trends', label: 'Trends', icon: TrendingUp }, { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'influencers', label: 'Influencers', icon: Users }, { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'alerts', label: 'Alerts', icon: Bell }, { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'integrations', label: 'Integrations', icon: Webhook }, { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ active, onNavigate, alertCount, jobCount }: { active: PageId; onNavigate: (p: PageId) => void; alertCount: number; jobCount: number }) {
  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 border-r border-slate-800 bg-[#0d1320] flex flex-col">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-800">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center"><Radar className="w-5 h-5 text-white" /></div>
        <div><div className="text-sm font-bold text-slate-100 leading-tight">SMI Tool</div><div className="text-xs text-slate-500 leading-tight">Ultimate v2.0</div></div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">{NAV.map(({ id, label, icon: Icon }) => (
        <button key={id} onClick={() => onNavigate(id)} className={`nav-item w-full ${active === id ? 'active' : ''}`}>
          <Icon className="w-4 h-4 shrink-0" /><span className="flex-1 text-left">{label}</span>
          {id === 'alerts' && alertCount > 0 && <span className="bg-red-500/20 text-red-400 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">{alertCount}</span>}
          {id === 'jobs' && jobCount > 0 && <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">{jobCount}</span>}
        </button>
      ))}</nav>
      <div className="p-3 border-t border-slate-800"><div className="flex items-center gap-3 px-2 py-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white">A</div><div className="flex-1 min-w-0"><div className="text-xs font-semibold text-slate-200 truncate">Admin</div><div className="text-xs text-slate-500 truncate">admin@smi-tool.io</div></div></div></div>
    </aside>
  );
}
