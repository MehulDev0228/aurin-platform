// src/components/AdminBadgeManager.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { awardBadge } from '../lib/badgeAwardingService';
import { blockchainEnabled } from '../lib/env';

type UserLite = { id: string; username: string | null; email: string | null; wallet_address: string | null };
type BadgeLite = { id: string; name: string; token_uri: string | null; token_id: number | null };

export default function AdminBadgeManager() {
  const [q, setQ] = useState('');
  const [users, setUsers] = useState<UserLite[]>([]);
  const [badges, setBadges] = useState<BadgeLite[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedBadge, setSelectedBadge] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: badgeList, error } = await supabase
        .from('badges')
        .select('id, name, token_uri, token_id')
        .order('name');
      if (!error && badgeList) setBadges(badgeList as any);
    })();
  }, []);

  const searchUsers = async () => {
    setMsg(null); setErr(null);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, email, wallet_address')
      .or(`username.ilike.%${q}%,email.ilike.%${q}%`)
      .limit(10);
    if (error) { setErr(error.message); return; }
    setUsers((data || []) as any);
  };

  const doAward = async () => {
    setBusy(true); setErr(null); setMsg(null);
    try {
      const user = users.find(u => u.id === selectedUser);
      const badge = badges.find(b => b.id === selectedBadge);
      if (!user || !badge) throw new Error('Select a user and badge.');

      const shouldMint = blockchainEnabled() && !!user.wallet_address;
      const achievement = await awardBadge({
        userId: user.id,
        badgeId: badge.id,
        toAddress: shouldMint ? user.wallet_address! : undefined,
        tokenURI: badge.token_uri || undefined,
        tokenId: badge.token_id ?? undefined,
        amount: 1,
        isFeatured: true,
        makePublic: true,
      });

      setMsg(`Awarded ${badge.name} to ${user.username || user.email}. ${achievement.transaction_hash ? `Tx: ${achievement.transaction_hash}` : '(off-chain)'}`);
    } catch (e: any) {
      setErr(e?.message || 'Failed to award badge.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4">
      <h3 className="text-lg font-semibold text-white">Award Badge</h3>
      <div className="mt-4 grid md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <input
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white"
            placeholder="Search user by username or email"
            value={q} onChange={e => setQ(e.target.value)}
          />
        </div>
        <button onClick={searchUsers} className="px-4 py-2 rounded-xl bg-white text-black font-semibold">Search</button>
      </div>

      {users.length > 0 && (
        <div className="mt-4">
          <label className="text-sm text-gray-300">Select user</label>
          <select className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white"
                  value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
            <option value="">-- choose --</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {(u.username || u.email) + (u.wallet_address ? ` · ${u.wallet_address.slice(0,6)}…${u.wallet_address.slice(-4)}` : ' · no wallet')}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-4">
        <label className="text-sm text-gray-300">Select badge</label>
        <select className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-zinc-800 text-white"
                value={selectedBadge} onChange={e => setSelectedBadge(e.target.value)}>
          <option value="">-- choose --</option>
          {badges.map(b => (<option key={b.id} value={b.id}>{b.name}</option>))}
        </select>
      </div>

      <div className="mt-4">
        <button disabled={busy} onClick={doAward} className="px-5 py-2 rounded-xl bg-white text-black font-semibold disabled:opacity-60">
          {busy ? 'Awarding…' : 'Award badge'}
        </button>
      </div>

      {msg && <div className="mt-3 text-emerald-400 text-sm">{msg}</div>}
      {err && <div className="mt-3 text-red-400 text-sm">{err}</div>}
    </div>
  );
}
