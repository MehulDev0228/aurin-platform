import { supabase } from './supabase';
import { logger } from './logger';

export interface UserStatus {
  emailVerified: boolean;
  walletConnected: boolean;
  onboardingComplete: boolean;
  isOrganizer: boolean;
  isAdmin: boolean;
}

export async function getUserStatus(userId: string): Promise<UserStatus> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('email_verified, wallet_connected, onboarding_completed')
      .eq('id', userId)
      .single();

    if (error) throw error;

    const { data: organizerData } = await supabase
      .from('organizer_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    return {
      emailVerified: profile?.email_verified || false,
      walletConnected: profile?.wallet_connected || false,
      onboardingComplete: profile?.onboarding_completed || false,
      isOrganizer: !!organizerData,
      isAdmin: !!adminData
    };
  } catch (error) {
    logger.error('Failed to get user status', { error, context: 'UserStatus', userId });
    return {
      emailVerified: false,
      walletConnected: false,
      onboardingComplete: false,
      isOrganizer: false,
      isAdmin: false
    };
  }
}

export function getRequiredRedirect(status: UserStatus, currentPath: string): string | null {
  const publicPaths = ['/', '/login', '/signup', '/admin/login', '/verify-email', '/wallet-connect', '/onboarding'];

  if (publicPaths.includes(currentPath)) {
    return null;
  }

  if (!status.emailVerified) {
    return '/verify-email';
  }

  if (!status.walletConnected) {
    return '/wallet-connect';
  }

  if (!status.onboardingComplete) {
    return '/onboarding';
  }

  return null;
}
