// src/pages/EmailVerification.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function EmailVerification() {
  const { user, loading, signOut } = useAuth();
  const [checking, setChecking] = useState(true);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: any;
    async function poll() {
      if (!user) return;
      const { data, error } = await supabase.auth.getUser();
      if (!error) {
        const confirmed = Boolean(data.user?.email_confirmed_at);
        setVerified(confirmed);
        if (confirmed) {
          clearInterval(timer);
          setTimeout(() => navigate('/dashboard', { replace: true }), 600);
        }
      }
      setChecking(false);
    }
    poll();
    timer = setInterval(poll, 5000);
    return () => clearInterval(timer);
  }, [user, navigate]);

  const resend = async () => {
    if (!user) return;
    setResending(true);
    try {
      await supabase.auth.resend({ type: 'signup', email: user.email! });
    } finally {
      setResending(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading…</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in</h2>
          <Link to="/login" className="text-emerald-400 hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_55%)]" />
        <div className="absolute inset-0 grain opacity-20" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl md:text-3xl font-bold">Verify your email</h1>
          <p className="text-gray-300 mt-3">
            We sent a verification link to <span className="text-white font-semibold">{user.email}</span>.
          </p>

          {!verified ? (
            <>
              <p className="text-gray-400 mt-2">Click the link, then come back — we auto-detect it.</p>
              <button
                onClick={resend}
                disabled={resending}
                className="mt-6 px-5 py-2 rounded-xl bg-white text-black font-semibold disabled:opacity-60"
              >
                {resending ? 'Resending…' : 'Resend email'}
              </button>
              <div className="mt-6 text-sm text-gray-400">
                Stuck? <button onClick={() => signOut()} className="underline">Log out</button> and try again.
              </div>
            </>
          ) : (
            <div className="mt-6 text-emerald-400">Verified ✓ Redirecting…</div>
          )}
        </div>
      </div>
    </div>
  );
}
