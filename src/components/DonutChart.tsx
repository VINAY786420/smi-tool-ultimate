export function DonutChart({ data, size = 160, thickness = 24, centerLabel, centerValue }: {
  data: { label: string; value: number; color: string }[]; size?: number; thickness?: number; centerLabel?: string; centerValue?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = (size - thickness) / 2; const circ = 2 * Math.PI * radius; let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">{data.map((d, i) => {
          const frac = d.value / total; const dash = frac * circ;
          const seg = <circle key={i} cx={size/2} cy={size/2} r={radius} fill="none" stroke={d.color} strokeWidth={thickness} strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={-offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s' }} />;
          offset += dash; return seg;
        })}</svg>
        {(centerLabel || centerValue) && <div className="absolute inset-0 flex flex-col items-center justify-center">{centerValue && <div className="text-xl font-bold text-slate-100">{centerValue}</div>}{centerLabel && <div className="text-xs text-slate-400">{centerLabel}</div>}</div>}
      </div>
      <div className="space-y-2">{data.map((d, i) => <div key={i} className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} /><span className="text-xs text-slate-300">{d.label}</span><span className="text-xs font-semibold text-slate-200">{d.value.toLocaleString()}</span></div>)}</div>
    </div>
  );
}
