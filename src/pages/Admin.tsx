// src/pages/Admin.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import AdminBadgeManager from '../components/AdminBadgeManager';

type Counts = { users: number; events: number; achievements: number; badges: number };

export default function Admin() {
  const { user, loading } = useAuth();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user) return;
      setBusy(true); setErr(null);
      try {
        const [u, e, a, b] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('events').select('*', { count: 'exact', head: true }),
          supabase.from('achievements').select('*', { count: 'exact', head: true }),
          supabase.from('badges').select('*', { count: 'exact', head: true }),
        ]);
        setCounts({
          users: u.count || 0,
          events: e.count || 0,
          achievements: a.count || 0,
          badges: b.count || 0,
        });
      } catch (e: any) {
        setErr(e?.message || 'Failed to load metrics.');
      } finally {
        setBusy(false);
      }
    })();
  }, [user]);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading…</div>;
  if (!user) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Login required</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">Admin</h1>

        {/* Metrics */}
        <div className="mt-6 grid md:grid-cols-4 gap-4">
          {busy ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-zinc-900/40 border border-zinc-800 animate-pulse" />)
          ) : err ? (
            <div className="md:col-span-4 text-red-400">{err}</div>
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
