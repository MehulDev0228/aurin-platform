// src/pages/Explore.tsx
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

type EventLite = {
  id: string;
  name: string;
  description: string;
  start_at: string;
  end_at: string;
  category?: string | null;
};

const PAGE_SIZE = 12;

export default function Explore() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<string>('');
  const [sort, setSort] = useState<'date_desc' | 'date_asc'>('date_desc');
  const [page, setPage] = useState(1);

  const [events, setEvents] = useState<EventLite[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const filtersDesc = useMemo(() => {
    const parts = [];
    if (q) parts.push(`“${q}”`);
    if (category) parts.push(category);
    return parts.join(' • ');
  }, [q, category]);

  useEffect(() => {
    (async () => {
      setLoading(true); setErr(null);
      try {
        // Count total with filters
        let countQuery = supabase.from('events').select('*', { count: 'exact', head: true }).eq('is_public', true);
        if (q) countQuery = countQuery.ilike('name', `%${q}%`);
        if (category) countQuery = countQuery.eq('category', category);
        const { count, error: countErr } = await countQuery;
        if (countErr) throw countErr;
        setTotal(count || 0);

        // Page query
        let query = supabase
          .from('events')
          .select('id, name, description, start_at, end_at, category')
          .eq('is_public', true);

        if (q) query = query.ilike('name', `%${q}%`);
        if (category) query = query.eq('category', category);
        if (sort === 'date_desc') query = query.order('start_at', { ascending: false });
        if (sort === 'date_asc') query = query.order('start_at', { ascending: true });

        const { data, error } = await query.range(from, to);
        if (error) throw error;
        setEvents((data || []) as any);
      } catch (e: any) {
        setErr(e?.message || 'Failed to load events.');
      } finally {
        setLoading(false);
      }
    })();
  }, [q, category, sort, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">Explore</h1>

        {/* Controls */}
        <div className="mt-4 grid md:grid-cols-4 gap-3">
          <input
            placeholder="Search events…"
            value={q}
            onChange={(e) => { setPage(1); setQ(e.target.value); }}
            className="px-3 py-2 rounded-xl bg-black/40 border border-zinc-800"
          />
          <select
            value={category}
            onChange={(e) => { setPage(1); setCategory(e.target.value); }}
            className="px-3 py-2 rounded-xl bg-black/40 border border-zinc-800"
          >
            <option value="">All categories</option>
            <option value="tech">Tech</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-zinc-800"
          >
            <option value="date_desc">Newest first</option>
            <option value="date_asc">Oldest first</option>
          </select>
          <div className="text-sm text-gray-400 flex items-center">
            {loading ? 'Loading…' : (filtersDesc || 'All public events')}
          </div>
        </div>

        {/* Grid */}
        {err ? (
          <div className="min-h-[40vh] flex items-center justify-center">{err}</div>
        ) : loading ? (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-zinc-900/40 border border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((e) => (
                <a key={e.id} href={`/events/${e.id}`} className="block bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 hover:bg-zinc-900/60">
                  <div className="text-lg font-semibold">{e.name}</div>
                  <div className="text-gray-400 text-sm mt-1">
                    {new Date(e.start_at).toLocaleString()} → {new Date(e.end_at).toLocaleString()}
                  </div>
                  <p className="text-gray-300 mt-2 line-clamp-2">{e.description}</p>
                  {e.category && <div className="text-xs mt-2 px-2 py-1 rounded-lg border border-zinc-700 inline-block">{e.category}</div>}
                </a>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Page {page} / {totalPages} • {total} results
              </div>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-2 rounded-xl bg-white text-black font-semibold disabled:opacity-60"
                >Prev</button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-2 rounded-xl bg-white text-black font-semibold disabled:opacity-60"
                >Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
