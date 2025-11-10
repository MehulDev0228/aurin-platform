// src/pages/Login.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/use-toast';
import { loginSchema, type LoginFormData } from '../lib/validations';
import { sanitizeEmail } from '../lib/sanitize';
import { logger } from '../lib/logger';
import SpotlightCard from '../components/aceternity/SpotlightCard';
import RippleButton from '../components/aceternity/RippleButton';
import EncryptedText from '../components/aceternity/EncryptedText';

export default function Login() {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const submit = async (data: LoginFormData) => {
    setBusy(true);
    try {
      const sanitizedEmail = sanitizeEmail(data.email);
      await signIn(sanitizedEmail, data.password);
      toast({ 
        title: 'Welcome back', 
        description: 'Logged in successfully.',
      });
      nav('/dashboard', { replace: true });
    } catch (err: any) {
      logger.error('Login failed', { error: err, context: 'Login' });
      const errorMessage = err?.message || 'Invalid email or password. Please check your credentials and try again.';
      
      // If email not confirmed, provide helpful message
      if (errorMessage.toLowerCase().includes('email not confirmed') || 
          errorMessage.toLowerCase().includes('email_not_confirmed')) {
        toast({ 
          title: 'Email not verified', 
          description: 'Please check your email and click the verification link. If you need help, contact support.', 
          variant: 'destructive' 
        });
      } else {
        toast({ 
          title: 'Login failed', 
          description: errorMessage, 
          variant: 'destructive' 
        });
      }
    } finally { 
      setBusy(false); 
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <SpotlightCard className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">
          <EncryptedText text="Log in to AURIN" />
        </h1>
        <form onSubmit={handleSubmit(submit)} className="mt-5 grid gap-4">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              {...register("email")}
              className={`mt-1 w-full rounded-xl bg-black/40 border px-3 py-2 ${
                errors.email ? 'border-red-500' : 'border-zinc-800'
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              {...register("password")}
              className={`mt-1 w-full rounded-xl bg-black/40 border px-3 py-2 ${
                errors.password ? 'border-red-500' : 'border-zinc-800'
              }`}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
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
