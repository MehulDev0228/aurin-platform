// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import DashboardLock from './DashboardLock';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [profileStatus, setProfileStatus] = useState<{
    emailVerified: boolean;
    walletConnected: boolean;
    onboardingComplete: boolean;
  } | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkProfileStatus() {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email_verified, wallet_connected, onboarding_completed')
          .eq('id', user.id)
          .single();

        // Check email verification from auth.users (Supabase auth)
        const { data: authUser } = await supabase.auth.getUser();
        const emailVerifiedFromAuth = Boolean(authUser?.user?.email_confirmed_at);
        
        setProfileStatus({
          emailVerified: emailVerifiedFromAuth || ((profile as any)?.email_verified ?? false),
          walletConnected: (profile as any)?.wallet_connected ?? false,
          onboardingComplete: (profile as any)?.onboarding_completed ?? false,
        });
      } catch (error) {
        // Security: On error, deny access and redirect to login
        // Don't default to allowing access - this is a security risk
        setProfileStatus({
          emailVerified: false,
          walletConnected: false,
          onboardingComplete: false,
        });
        // Log error for debugging (in production, use proper logging service)
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Error checking profile status:', error);
        }
      } finally {
        setChecking(false);
      }
    }

    if (user && !profileStatus) {
      checkProfileStatus();
    } else if (!user) {
      setChecking(false);
    }
  }, [user, profileStatus]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // LOCK SYSTEM: All steps must be completed to access dashboard
  if (profileStatus) {
    const { emailVerified, walletConnected, onboardingComplete } = profileStatus;
    
    // If accessing dashboard, show lock screen if not all steps complete
    if (location.pathname === '/dashboard') {
      if (!emailVerified || !walletConnected || !onboardingComplete) {
        return <DashboardLock 
          emailVerified={emailVerified} 
          walletConnected={walletConnected} 
          onboardingComplete={onboardingComplete} 
        />;
      }
    }

    // Redirect to specific step if not completed (but allow access to those pages)
    if (location.pathname !== '/email-verification' && location.pathname !== '/wallet' && location.pathname !== '/onboarding') {
      if (!emailVerified) {
        return <Navigate to="/email-verification" replace />;
      }
      
      if (!walletConnected) {
        return <Navigate to="/wallet" replace />;
      }
      
      if (!onboardingComplete) {
        return <Navigate to="/onboarding" replace />;
      }
    }
  }

  return children;
}
