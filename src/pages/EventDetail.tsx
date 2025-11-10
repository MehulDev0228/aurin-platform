// src/pages/EventDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { enrollInEvent, getEnrollment } from '../lib/enrollmentService';
import { logger } from '../lib/logger';
import { parseError, isRetryableError, retryWithBackoff } from '../lib/errorHandler';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { useToast } from '../components/ui/use-toast';
import SteveJobsNavbar from '../components/SteveJobsNavbar';

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
  const [retrying, setRetrying] = useState(false);
  const { toast } = useToast();

  const loadEvent = async () => {
    setLoading(true);
    setErr(null);
    try {
      const { data, error } = await retryWithBackoff(async () => {
        const result = await supabase
          .from('events')
          .select('id, name, description, start_at, end_at, category')
          .eq('id', id)
          .maybeSingle();
        if (result.error) throw result.error;
        return result;
      });

      if (!data) throw new Error('Event not found');
      setEvent(data as any);

      if (user) {
        const en = await getEnrollment(user.id, (data as any).id);
        setEnrollment(en || null);
      }
    } catch (e: any) {
      const errorInfo = parseError(e);
      logger.error('Failed to load event', { error: e, context: 'EventDetail', eventId: id });
      setErr(errorInfo.message);
      toast({
        title: 'Failed to load event',
        description: errorInfo.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [id, user]);

  const onEnroll = async () => {
    if (!user || !event) return;
    setEnrolling(true);
    setMsg(null);
    setErr(null);
    try {
      const en = await retryWithBackoff(async () => {
        return await enrollInEvent(user.id, event.id);
      });
      setEnrollment(en);
      setMsg('Enrolled successfully');
      toast({
        title: 'Enrolled successfully',
        description: 'You have been enrolled in this event.',
      });
    } catch (e: any) {
      const errorInfo = parseError(e);
      logger.error('Failed to enroll in event', { error: e, context: 'EventDetail', eventId: event.id, userId: user.id });
      setErr(errorInfo.message);
      toast({
        title: 'Enrollment failed',
        description: errorInfo.message,
        variant: 'destructive',
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    await loadEvent();
    setRetrying(false);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-3xl mx-auto p-6">
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (err && !event) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20">
            <AlertCircle size={40} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Failed to load event</h1>
            <p className="text-gray-400 mb-6">{err}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-semibold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
            <Link
              to="/events"
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-28">
      <SteveJobsNavbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <Link to="/events" className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-6">
          ← Back to Events
        </Link>

        <h1 className="mt-2 text-2xl md:text-3xl font-bold">{event.name}</h1>
        {event.category && <div className="mt-1 text-xs inline-block px-2 py-1 rounded-lg border border-zinc-700">{event.category}</div>}
        <div className="mt-2 text-gray-400">
          {new Date(event.start_at).toLocaleString()} → {new Date(event.end_at).toLocaleString()}
        </div>

        <p className="mt-4 text-gray-200 whitespace-pre-wrap">{event.description}</p>

        <div className="mt-6">
          {!user ? (
            <Link to="/login" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all">
              Login to enroll
            </Link>
          ) : enrollment ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
              <span>Status: {enrollment.status}</span>
            </div>
          ) : (
            <button
              onClick={onEnroll}
              disabled={enrolling}
              aria-label="Enroll in event"
              aria-busy={enrolling}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {enrolling ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" aria-hidden="true" />
                  <span>Enrolling...</span>
                </>
              ) : (
                <span>Enroll</span>
              )}
            </button>
          )}
        </div>

        {msg && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            {msg}
          </div>
        )}
        {err && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            {err}
          </div>
        )}
      </div>
    </div>
  );
}
