// Invite system for AURIN v1
// Invite loops with ProofScore bonus

import { supabase } from './supabase';
import { logger } from './logger';

export interface InviteData {
  inviteeEmail: string;
}

/**
 * Send invite to email
 */
export async function sendInvite(data: InviteData): Promise<string> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if already invited
    const { data: existing } = await supabase
      .from('invites')
      .select('id')
      .eq('inviter_id', user.id)
      .eq('invitee_email', data.inviteeEmail)
      .maybeSingle();

    if (existing) {
      throw new Error('User already invited');
    }

    // Create invite record
    const { data: invite, error } = await supabase
      .from('invites')
      .insert({
        inviter_id: user.id,
        invitee_email: data.inviteeEmail,
        accepted: false,
      })
      .select('id')
      .single();

    if (error) throw error;

    // In production, send email via edge function
    // For now, just return invite ID
    return invite.id;
  } catch (error) {
    logger.error('Failed to send invite', { error, context: 'Invites', data });
    throw error;
  }
}

/**
 * Get user's invites
 */
export async function getUserInvites(): Promise<any[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: invites, error } = await supabase
      .from('invites')
      .select('*')
      .eq('inviter_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return invites || [];
  } catch (error) {
    logger.error('Failed to get invites', { error, context: 'Invites' });
    return [];
  }
}

/**
 * Check if user was invited and mark as accepted
 */
export async function acceptInvite(inviteeEmail: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Find invite
    const { data: invite, error: findError } = await supabase
      .from('invites')
      .select('*')
      .eq('invitee_email', inviteeEmail)
      .eq('accepted', false)
      .maybeSingle();

    if (findError || !invite) {
      // No invite found, that's okay
      return;
    }

    // Mark as accepted
    const { error: updateError } = await supabase
      .from('invites')
      .update({ accepted: true })
      .eq('id', invite.id);

    if (updateError) throw updateError;

    // Award +10 ProofScore bonus to inviter (capped per month)
    // This would be handled by a cron job or edge function
  } catch (error) {
    logger.error('Failed to accept invite', { error, context: 'Invites', inviteeEmail });
    // Don't throw - invite acceptance is optional
  }
}

/**
 * Get invite count for user
 */
export async function getInviteCount(): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { data: invites, error } = await supabase
      .from('invites')
      .select('id', { count: 'exact' })
      .eq('inviter_id', user.id)
      .eq('accepted', true);

    if (error) throw error;
    return invites?.length || 0;
  } catch (error) {
    logger.error('Failed to get invite count', { error, context: 'Invites' });
    return 0;
  }
}

