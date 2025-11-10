// src/pages/Login.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/use-toast';
import SpotlightCard from '../components/aceternity/SpotlightCard';
import RippleButton from '../components/aceternity/RippleButton';
import EncryptedText from '../components/aceternity/EncryptedText';

export default function Login() {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(form.email, form.password);
      toast({ title: 'Welcome back', description: 'Logged in successfully.', variant: 'success' });
      nav('/dashboard', { replace: true });
    } catch (err: any) {
      toast({ title: 'Login failed', description: err?.message || 'Please check your credentials.', variant: 'destructive' });
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <SpotlightCard className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">
          <EncryptedText text="Log in to AURIN" />
        </h1>
        <form onSubmit={submit} className="mt-5 grid gap-4">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl bg-black/40 border border-zinc-800 px-3 py-2"
              required value={form.email}
              onChange={(e)=>setForm({...form,email:e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl bg-black/40 border border-zinc-800 px-3 py-2"
              required value={form.password}
              onChange={(e)=>setForm({...form,password:e.target.value})}
            />
          </div>
          <RippleButton
            disabled={busy}
            className="mt-2 w-full rounded-xl bg-white text-black font-semibold py-2 disabled:opacity-60"
          >
            {busy ? 'Logging in…' : 'Log in'}
          </RippleButton>
          <div className="text-sm text-gray-400">
            No account? <Link to="/signup" className="underline">Sign up</Link>
          </div>
        </form>
      </SpotlightCard>
    </div>
  );
}
