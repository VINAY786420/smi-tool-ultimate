export function BarChart({ data, height = 200, horizontal = false }: {
  data: { label: string; value: number; color?: string }[]; height?: number; horizontal?: boolean;
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  if (horizontal) return (
    <div className="space-y-3">{data.map((d, i) => (
      <div key={i}><div className="flex items-center justify-between mb-1"><span className="text-xs text-slate-300">{d.label}</span><span className="text-xs font-semibold text-slate-200">{d.value.toLocaleString()}</span></div>
      <div className="h-2 bg-slate-800/60 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${(d.value / max) * 100}%`, backgroundColor: d.color || '#3b82f6' }} /></div></div>
    ))}</div>
  );
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>{data.map((d, i) => (
      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
        <div className="text-xs font-semibold text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">{d.value.toLocaleString()}</div>
        <div className="w-full rounded-t-md transition-all duration-500 hover:opacity-80" style={{ height: `${(d.value / max) * (height - 40)}px`, backgroundColor: d.color || '#3b82f6', minHeight: '4px' }} />
        <div className="text-xs text-slate-400 text-center truncate max-w-full">{d.label}</div>
      </div>
    ))}</div>
  );
}
