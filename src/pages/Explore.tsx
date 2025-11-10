// src/pages/Explore.tsx
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import { parseError, retryWithBackoff } from '../lib/errorHandler';
import { ListSkeleton } from '../components/LoadingSkeleton';
import SteveJobsNavbar from '../components/SteveJobsNavbar';
import { useToast } from '../components/ui/use-toast';

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
  const { toast } = useToast();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<string>('');
  const [sort, setSort] = useState<'date_desc' | 'date_asc'>('date_desc');
  const [page, setPage] = useState(1);
  const [retrying, setRetrying] = useState(false);

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

  const loadEvents = async () => {
    setLoading(true);
    setErr(null);
    try {
      const result = await retryWithBackoff(async () => {
        // Count total with filters
        let countQuery = (supabase.from('events') as any).select('*', { count: 'exact', head: true }).eq('status', 'published');
        if (q) countQuery = countQuery.ilike('title', `%${q}%`);
        if (category) countQuery = countQuery.eq('category', category);
        const { count, error: countErr } = await countQuery;
        if (countErr) throw countErr;

        // Page query
        let query = (supabase.from('events') as any)
          .select('id, title, description, start_date, end_date, category')
          .eq('status', 'published');

        if (q) query = query.ilike('title', `%${q}%`);
        if (category) query = query.eq('category', category);
        if (sort === 'date_desc') query = query.order('start_date', { ascending: false });
        if (sort === 'date_asc') query = query.order('start_date', { ascending: true });

        const { data, error } = await query.range(from, to);
        if (error) throw error;
        
        return { count: count || 0, data: data || [] };
      });

      setTotal(result.count);
      setEvents(result.data.map((e: any) => ({
        id: e.id,
        name: e.title,
        description: e.description,
        start_at: e.start_date,
        end_at: e.end_date,
        category: e.category,
      })));
    } catch (e: any) {
      const errorInfo = parseError(e);
      logger.error('Failed to load events', { error: e, context: 'Explore', query: q, category, sort, page });
      setErr(errorInfo.message);
      toast({
        title: 'Failed to load events',
        description: errorInfo.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [q, category, sort, page]);

  const handleRetry = async () => {
    setRetrying(true);
    await loadEvents();
    setRetrying(false);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-black text-white pt-28">
      <SteveJobsNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-[-0.02em] bg-gradient-to-r from-white via-emerald-50 to-white bg-clip-text text-transparent">
            Explore Events
          </h1>
          <p className="text-gray-400 text-lg">Discover events and earn verified badges</p>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); loadEvents(); }} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
              <input
                type="text"
                placeholder="Search events…"
                value={q}
                onChange={(e) => { setPage(1); setQ(e.target.value); }}
                aria-label="Search events"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>
            <button
              type="submit"
              aria-label="Search"
              className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl text-black font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" aria-hidden="true" />
              <span className="text-sm text-gray-400">Filters:</span>
            </div>
            <select
              value={category}
              onChange={(e) => { setPage(1); setCategory(e.target.value); }}
              aria-label="Filter by category"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
            >
              <option value="">All categories</option>
              <option value="workshop">Workshop</option>
              <option value="conference">Conference</option>
              <option value="hackathon">Hackathon</option>
              <option value="webinar">Webinar</option>
              <option value="meetup">Meetup</option>
              <option value="course">Course</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              aria-label="Sort events"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
            >
              <option value="date_desc">Newest first</option>
              <option value="date_asc">Oldest first</option>
            </select>
            <div className="text-sm text-gray-400 flex items-center ml-auto">
              {loading ? 'Loading…' : (filtersDesc || `All events • ${total} results`)}
            </div>
          </div>
        </div>

        {/* Grid */}
        {err ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="max-w-md w-full text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20">
                <AlertCircle size={40} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Failed to load events</h3>
                <p className="text-gray-400 mb-6">{err}</p>
              </div>
              <button
                onClick={handleRetry}
                disabled={retrying}
                aria-label="Retry loading events"
                className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-semibold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mx-auto"
              >
                {retrying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <span>Retrying...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={18} />
                    <span>Try Again</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : loading ? (
          <ListSkeleton count={6} />
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/[0.02] border border-white/10 mb-6">
              <Calendar size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">No events found</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Try adjusting your filters or search query</p>
            <button
              onClick={() => {
                setQ('');
                setCategory('');
                setPage(1);
                loadEvents();
              }}
              aria-label="Clear all filters"
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {events.map((e) => (
                <Link
                  key={e.id}
                  to={`/events/${e.id}`}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                        {e.name}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{e.description}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar size={16} aria-hidden="true" />
                        <span>
                          {new Date(e.start_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      {e.category && (
                        <div className="pt-2">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {e.category}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="Go to previous page"
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                  Previous
                </button>
                <span className="text-sm text-gray-400 px-4" aria-label={`Page ${page} of ${totalPages}`}>
                  Page {page} / {totalPages} • {total} results
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Go to next page"
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
