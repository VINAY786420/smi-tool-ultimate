import { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export function DataFetcher<T>({ query, children }: {
  query: () => PromiseLike<{ data: T[] | null; error: { message: string } | null }>;
  children: (data: T[], loading: boolean, error: string | null, refetch: () => void) => React.ReactNode;
}) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = async () => { setLoading(true); setError(null); const { data: r, error: e } = await query(); if (e) { setError(e.message); setData([]); } else setData(r ?? []); setLoading(false); };
  useEffect(() => { fetchData(); }, []);
  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 text-blue-500 animate-spin" /></div>;
  if (error) return <div className="flex items-center justify-center gap-2 py-12 text-red-400"><AlertCircle className="w-5 h-5" /><span className="text-sm">{error}</span></div>;
  return <>{children(data, loading, error, fetchData)}</>;
}
