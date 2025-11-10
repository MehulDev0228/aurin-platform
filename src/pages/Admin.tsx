// src/pages/Admin.tsx
import { useEffect, useState } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import { parseError, retryWithBackoff } from '../lib/errorHandler';
import { StatsSkeleton } from '../components/LoadingSkeleton';
import AdminBadgeManager from '../components/AdminBadgeManager';
import { useToast } from '../components/ui/use-toast';
import SteveJobsNavbar from '../components/SteveJobsNavbar';

type Counts = { users: number; events: number; achievements: number; badges: number };

export default function Admin() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [retrying, setRetrying] = useState(false);

  const loadMetrics = async () => {
    if (!user) return;
    setBusy(true);
    setErr(null);
    try {
      const [u, e, a, b] = await retryWithBackoff(async () => {
        return await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('events').select('*', { count: 'exact', head: true }),
          supabase.from('achievements').select('*', { count: 'exact', head: true }),
          supabase.from('badges').select('*', { count: 'exact', head: true }),
        ]);
      });
      setCounts({
        users: u.count || 0,
        events: e.count || 0,
        achievements: a.count || 0,
        badges: b.count || 0,
      });
    } catch (e: any) {
      const errorInfo = parseError(e);
      logger.error('Failed to load admin metrics', { error: e, context: 'Admin', userId: user.id });
      setErr(errorInfo.message);
      toast({
        title: 'Failed to load metrics',
        description: errorInfo.message,
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [user]);

  const handleRetry = async () => {
    setRetrying(true);
    await loadMetrics();
    setRetrying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-28">
        <SteveJobsNavbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <StatsSkeleton />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white pt-28">
        <SteveJobsNavbar />
        <div className="flex items-center justify-center min-h-[80vh] p-6">
          <div className="max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Login required</h2>
            <a href="/login" className="text-emerald-400 hover:underline">Go to Login</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28">
      <SteveJobsNavbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold">Admin</h1>

        {/* Metrics */}
        <div className="mt-6 grid md:grid-cols-4 gap-4">
          {busy ? (
            <StatsSkeleton />
          ) : err ? (
            <div className="md:col-span-4 p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-4">
                <AlertCircle size={24} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Failed to load metrics</h3>
                  <p className="text-gray-300 mb-4">{err}</p>
                  <button
                    onClick={handleRetry}
                    disabled={retrying}
                    aria-label="Retry loading metrics"
                    className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-semibold hover:bg-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
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
            </div>
          ) : (
            <>
              <Stat label="Users" value={counts?.users ?? 0} />
              <Stat label="Events" value={counts?.events ?? 0} />
              <Stat label="Badges" value={counts?.badges ?? 0} />
              <Stat label="Achievements" value={counts?.achievements ?? 0} />
            </>
          )}
        </div>

        {/* Controls */}
        <div className="mt-8 grid gap-6">
          <AdminBadgeManager />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-zinc-900/40 border border-zinc-800 p-4">
      <div className="text-gray-400 text-sm">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
