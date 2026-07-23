export function LineChart({ data, height = 200, color = '#3b82f6' }: {
  data: { label: string; value: number }[]; height?: number; color?: string;
}) {
  const max = Math.max(...data.map(d => d.value), 1); const min = Math.min(...data.map(d => d.value), 0); const range = max - min || 1; const w = 100;
  const pts = data.map((d, i) => `${(i / (data.length-1 || 1)) * w},${height - ((d.value - min) / range) * (height - 30) - 10}`);
  const path = `M ${pts.join(' L ')}`; const area = `${path} L ${w},${height} L 0,${height} Z`;
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs><linearGradient id={`g-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
        <path d={area} fill={`url(#g-${color.replace('#','')})`} /><path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <div className="flex justify-between mt-2">{data.map((d, i) => <div key={i} className="text-xs text-slate-500 text-center" style={{ width: `${100/data.length}%` }}>{d.label}</div>)}</div>
    </div>
  );
}
