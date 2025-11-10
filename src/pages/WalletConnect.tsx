// src/pages/WalletConnect.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { connectWallet, isWalletAvailable, signOwnership } from '../hooks/useWallet';
import { supabase } from '../lib/supabase';

export default function WalletConnect() {
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => { setSaved(false); setErr(null); }, [user]);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading…</div>;
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in</h2>
          <a href="/login" className="text-emerald-400 hover:underline">Go to Login</a>
        </div>
      </div>
    );
  }

  const doConnect = async () => {
    if (!isWalletAvailable()) { setErr('No wallet detected. Install MetaMask.'); return; }
    setBusy(true); setErr(null); setSaved(false);
    try {
      const { address } = await connectWallet();
      setAddress(address);

      const { signature, message } = await signOwnership(address);

      // Cast to any so TS doesn’t complain until you regenerate types
      const { error } = await supabase
        .from('profiles')
        .update({ wallet_address: address, wallet_signature: signature, wallet_sig_message: message } as any)
        .eq('id', user.id);
      if (error) throw error;

      setSaved(true);
    } catch (e: any) {
      setErr(e?.message || 'Failed to connect wallet.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl md:text-3xl font-bold">Wallet</h1>
        <p className="text-gray-300 mt-2">Link your wallet to receive on-chain badges. We’ll verify ownership with a signature.</p>

        <button className="mt-6 px-5 py-2 rounded-xl bg-white text-black font-semibold disabled:opacity-60"
                onClick={doConnect} disabled={busy}>
          {busy ? 'Connecting…' : 'Connect & Verify'}
        </button>

        {address && <div className="mt-4 text-sm text-gray-300 break-all">Address: {address}</div>}
        {saved && <div className="mt-3 text-emerald-400">Verified & saved ✓</div>}
        {err && <div className="mt-3 text-red-400">{err}</div>}
      </div>
    </div>
  );
}
