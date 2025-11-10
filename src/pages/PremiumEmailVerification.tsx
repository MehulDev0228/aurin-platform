// src/pages/PremiumEmailVerification.tsx - Premium Email Verification Page
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import UltraPremiumNavbar from '../components/UltraPremiumNavbar';
import RippleButton from '../components/aceternity/RippleButton';

export default function PremiumEmailVerification() {
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
          // Update profile to mark email as verified
          await supabase
            .from('profiles')
            .update({ email_verified: true })
            .eq('id', user.id);
          // Redirect to wallet connection
          setTimeout(() => navigate('/wallet', { replace: true }), 1000);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-black text-white pt-24">
      <UltraPremiumNavbar />
      
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-purple-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
        
        <div className="relative max-w-2xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            {verified ? (
              <>
                <motion.div
                  className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/30 mb-8"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <CheckCircle2 size={48} className="text-emerald-400" />
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                  Email Verified!
                </h1>
                <p className="text-xl text-gray-400 mb-8">
                  Redirecting to wallet connection...
                </p>
              </>
            ) : (
              <>
                <motion.div
                  className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-purple-500/10 border-2 border-emerald-500/30 mb-8"
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(16, 185, 129, 0.4)',
                      '0 0 0 20px rgba(16, 185, 129, 0)',
                      '0 0 0 0 rgba(16, 185, 129, 0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Mail size={48} className="text-emerald-400" />
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                  Verify Your Email
                </h1>
                <p className="text-xl text-gray-400 mb-2">
                  We sent a verification link to
                </p>
                <p className="text-2xl font-bold text-white mb-8">
                  {user.email}
                </p>
              </>
            )}
          </motion.div>

          {!verified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={24} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Check Your Inbox</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Click the verification link in the email we sent. Once verified, you'll be automatically redirected to connect your wallet.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <RippleButton
                    onClick={resend}
                    disabled={resending}
                    className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {resending ? (
                      <>
                        <RefreshCw size={20} className="animate-spin" />
                        <span>Resending...</span>
                      </>
                    ) : (
                      <>
                        <Mail size={20} />
                        <span>Resend Email</span>
                      </>
                    )}
                  </RippleButton>

                  <div className="text-center">
                    <button
                      onClick={() => signOut()}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Wrong email? Sign out and try again
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-sm text-gray-300 leading-relaxed">
                  <strong className="text-emerald-400">Tip:</strong> Check your spam folder if you don't see the email. The verification link expires in 24 hours.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

