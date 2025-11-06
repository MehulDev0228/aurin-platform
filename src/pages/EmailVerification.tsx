import { useState, useEffect } from 'react';
import { Award, Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';

export default function EmailVerification() {
  const [checking, setChecking] = useState(true);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const { user, loading, signOut } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      checkVerificationStatus();
      const interval = setInterval(checkVerificationStatus, 3000);
      return () => clearInterval(interval);
    }
  }, [user, loading]);

  const checkVerificationStatus = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser?.email_confirmed_at) {
        const { error } = await supabase
          .from('profiles')
          .update({ email_verified: true })
          .eq('id', authUser.id);

        if (!error) {
          setVerified(true);
          showToast('Email verified successfully!', 'success');
          setTimeout(() => {
            navigate('/wallet-connect');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Verification check error:', error);
    } finally {
      setChecking(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!user?.email) return;

    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) throw error;

      showToast('Verification email sent! Check your inbox.', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to resend email', 'error');
    } finally {
      setResending(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
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

  if (verified) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Email Verified!</h2>
          <p className="text-gray-400 mb-8">Redirecting to wallet connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 grain opacity-20" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-2xl">
                <Award size={28} className="text-black" />
              </div>
              <span className="font-bold text-2xl">Aurin</span>
            </Link>

            <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
              <Mail size={48} className="text-blue-400" />
            </div>

            <h1 className="text-3xl font-bold mb-4">
              Verify Your Email
            </h1>
            <p className="text-gray-400">
              We sent a verification link to
              <br />
              <span className="text-white font-semibold">{user?.email}</span>
            </p>
          </div>

          <div className="premium-card p-8 mb-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-400">
                  <p className="font-semibold text-white mb-2">Next Steps:</p>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>Check your email inbox</li>
                    <li>Click the verification link</li>
                    <li>Return to this page</li>
                  </ol>
                </div>
              </div>

              {checking && (
                <div className="flex items-center justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <RefreshCw size={20} className="text-emerald-400 animate-spin" />
                  <span className="text-sm text-gray-400">Checking verification status...</span>
                </div>
              )}

              <button
                onClick={resendVerificationEmail}
                disabled={resending}
                className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-all disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </button>

              <div className="text-center">
                <button
                  onClick={checkVerificationStatus}
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  I've verified my email
                </button>
              </div>
            </div>
          </div>

          <div className="text-center space-y-3">
            <button
              onClick={async () => {
                if (!user) return;
                await supabase
                  .from('profiles')
                  .update({ email_verified: true })
                  .eq('id', user.id);
                navigate('/wallet-connect');
              }}
              className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-medium transition-all"
            >
              Skip for now (Testing)
            </button>
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder
            </p>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Sign out and try a different email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
