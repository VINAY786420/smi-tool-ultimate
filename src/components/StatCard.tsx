import type { ReactNode } from 'react';
export function StatCard({ label, value, icon, trend, accentColor = '#3b82f6' }: {
  label: string; value: string | number; icon: ReactNode; trend?: { value: number; positive: boolean }; accentColor?: string;
}) {
  return (
    <div className="stat-card fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentColor + '15', color: accentColor }}>{icon}</div>
        {trend && <span className={`text-xs font-semibold ${trend.positive ? 'text-emerald-400' : 'text-red-400'}`}>{trend.positive ? '+' : ''}{trend.value}%</span>}
      </div>
      <div className="text-2xl font-bold text-slate-100">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  );
}
