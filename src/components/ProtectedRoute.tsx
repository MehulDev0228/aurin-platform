// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading, session } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="animate-pulse text-gray-300">Loading…</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const emailConfirmed = Boolean((user as any)?.email_confirmed_at || session?.user?.email_confirmed_at);
  if (!emailConfirmed) return <Navigate to="/email-verification" replace />;

  return children;
}
