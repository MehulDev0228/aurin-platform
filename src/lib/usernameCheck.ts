// src/lib/usernameCheck.ts - Username availability checking
import { supabase } from './supabase';
import { logger } from './logger';

export async function checkUsernameAvailability(username: string): Promise<{ available: boolean; message?: string }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase())
      .maybeSingle();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    if (data) {
      return { available: false, message: 'Username is already taken' };
    }

    return { available: true };
  } catch (error: any) {
    logger.error('Username check failed', { error, context: 'UsernameCheck' });
    return { available: false, message: 'Unable to check username availability. Please try again.' };
  }
}

