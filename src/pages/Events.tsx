// src/pages/Events.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type EventLite = { id: string; name: string; start_at: string; end_at: string; description: string };

export default function Events() {
  const [events, setEvents] = useState<EventLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true); setErr(null);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('id, name, start_at, end_at, description')
          .eq('is_public', true)
          .order('start_at', { ascending: false })
          .limit(50);
        if (error) throw error;
        setEvents((data || []) as any);
      } catch (e: any) {
        setErr(e?.message || 'Failed to load events.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading…</div>;
  if (err) return <div className="min-h-screen bg-black text-white flex items-center justify-center">{err}</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">Events</h1>
        <div className="mt-6 grid gap-4">
          {events.map(e => (
            <a key={e.id} href={`/events/${e.id}`} className="block bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 hover:bg-zinc-900/60">
              <div className="text-lg font-semibold">{e.name}</div>
              <div className="text-gray-400 text-sm mt-1">
                {new Date(e.start_at).toLocaleString()} → {new Date(e.end_at).toLocaleString()}
              </div>
              <p className="text-gray-300 mt-2 line-clamp-2">{e.description}</p>
            </a>
          ))}
          {events.length === 0 && <div className="text-gray-400">No public events yet.</div>}
        </div>
      </div>
    </div>
  );
}
