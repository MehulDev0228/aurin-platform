// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let authSubscription: { subscription: { unsubscribe: () => void } } | null = null;

    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      // Only log in development to avoid exposing errors in production
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Error getting session:', error);
      }
      if (isMounted) {
        setLoading(false);
      }
    });

    // Subscribe to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (!isMounted) return;
      setSession(sess);
      setUser(sess?.user ?? null);
    });
    authSubscription = sub;

    return () => {
      isMounted = false;
      if (authSubscription?.subscription?.unsubscribe) {
        authSubscription.subscription.unsubscribe();
      }
    };
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { 
        data: { username },
        emailRedirectTo: `${window.location.origin}/dashboard`
      },
    });
    if (error) throw error;

    const uid = data.user?.id;
    if (uid) {
      // Don't auto-verify email - let user verify via email link
      await (supabase.from('profiles') as any).upsert(
        { id: uid, username, full_name: username, created_at: new Date().toISOString(), email_verified: false },
        { onConflict: 'id' }
      );
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    // For MVP: Handle email not confirmed error gracefully
    if (error) {
      // If email is not confirmed, we'll still allow access for MVP
      // Update the user's email_confirmed_at in auth.users via admin function
      // OR just mark profile as verified and continue
      if (error.message?.toLowerCase().includes('email not confirmed') || 
          error.message?.toLowerCase().includes('email_not_confirmed')) {
        // For MVP: We'll bypass this by updating the profile
        // Note: This requires email confirmation to be disabled in Supabase dashboard
        // Go to: Authentication > Settings > Email Auth > Disable "Confirm email"
        throw new Error('Email not confirmed. Please check your email and click the verification link. For MVP, email confirmation is optional - contact support if you need help.');
      }
      throw error;
    }
    
    // Check if email is verified from auth.users
    // Only update profile if email is actually confirmed in auth
    if (data?.user?.email_confirmed_at) {
      await (supabase.from('profiles') as any).update({ email_verified: true }).eq('id', data.user.id).catch(() => {
        // Ignore errors if profile doesn't exist yet
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
