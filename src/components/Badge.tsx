export function Badge({ text, color = '#6b7280', dot = false }: { text: string; color?: string; dot?: boolean }) {
  return <span className="badge" style={{ backgroundColor: color + '20', color }}>{dot && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />}{text}</span>;
}
