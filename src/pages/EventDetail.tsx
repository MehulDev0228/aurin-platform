// src/pages/EventDetail.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { enrollInEvent, getEnrollment } from '../lib/enrollmentService';

type EventFull = { id: string; name: string; description: string; start_at: string; end_at: string; category?: string | null };

export default function EventDetail() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [event, setEvent] = useState<EventFull | null>(null);
  const [enrollment, setEnrollment] = useState<{ id: string; status: string; attended: boolean } | null>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true); setErr(null);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('id, name, description, start_at, end_at, category')
          .eq('id', id)
          .maybeSingle();
        if (error) throw error;
        if (!data) throw new Error('Event not found');
        setEvent(data as any);

        if (user) {
          const en = await getEnrollment(user.id, (data as any).id);
          setEnrollment(en || null);
        }
      } catch (e: any) {
        setErr(e?.message || 'Failed to load event.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user]);

  const onEnroll = async () => {
    if (!user || !event) return;
    setEnrolling(true); setMsg(null); setErr(null);
    try {
      const en = await enrollInEvent(user.id, event.id);
      setEnrollment(en);
      setMsg('Enrolled ✓');
    } catch (e: any) {
      setErr(e?.message || 'Failed to enroll.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading || authLoading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading…</div>;
  if (err) return <div className="min-h-screen bg-black text-white flex items-center justify-center">{err}</div>;
  if (!event) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-sm text-gray-400">
          <a href="/explore" className="hover:underline">← Back to Explore</a>
        </div>

        <h1 className="mt-2 text-2xl md:text-3xl font-bold">{event.name}</h1>
        {event.category && <div className="mt-1 text-xs inline-block px-2 py-1 rounded-lg border border-zinc-700">{event.category}</div>}
        <div className="mt-2 text-gray-400">
          {new Date(event.start_at).toLocaleString()} → {new Date(event.end_at).toLocaleString()}
        </div>

        <p className="mt-4 text-gray-200 whitespace-pre-wrap">{event.description}</p>

        <div className="mt-6">
          {!user ? (
            <a href="/login" className="px-5 py-2 rounded-xl bg-white text-black font-semibold">Login to enroll</a>
          ) : enrollment ? (
            <div className="text-emerald-400">Status: {enrollment.status} ✓</div>
          ) : (
            <button onClick={onEnroll} disabled={enrolling} className="px-5 py-2 rounded-xl bg-white text-black font-semibold disabled:opacity-60">
              {enrolling ? 'Enrolling…' : 'Enroll'}
            </button>
          )}
        </div>

        {msg && <div className="mt-3 text-emerald-400">{msg}</div>}
        {err && <div className="mt-3 text-red-400">{err}</div>}
      </div>
    </div>
  );
}
