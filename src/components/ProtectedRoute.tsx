import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getUserStatus } from '../lib/userStatus';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    async function checkStatus() {
      if (!user) {
        setChecking(false);
        return;
      }

      const publicPaths = ['/verify-email', '/wallet-connect', '/onboarding'];
      if (publicPaths.includes(location.pathname)) {
        setChecking(false);
        return;
      }

      try {
        const status = await getUserStatus(user.id);
        console.log('User status:', status);

        if (!status.emailVerified) {
          console.log('Redirecting to verify-email');
          setRedirect('/verify-email');
        } else if (!status.walletConnected) {
          console.log('Redirecting to wallet-connect');
          setRedirect('/wallet-connect');
        } else if (!status.onboardingComplete) {
          console.log('Redirecting to onboarding');
          setRedirect('/onboarding');
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      }

      setChecking(false);
    }

    checkStatus();
  }, [user, location.pathname]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (redirect) {
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
}
