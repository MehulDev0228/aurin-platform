import { supabase } from './supabase';

export async function getAllEvents(filters?: {
  category?: string;
  eventType?: string;
  search?: string;
}) {
  let query = supabase
    .from('events')
    .select(`
      *,
      organizer:profiles!events_organizer_id_fkey(
        username,
        full_name,
        avatar_url
      ),
      badge:badges(
        id,
        name,
        image_url
      )
    `)
    .in('status', ['published', 'ongoing'])
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true });

  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }

  if (filters?.eventType && filters.eventType !== 'all') {
    query = query.eq('event_type', filters.eventType);
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getEventById(eventId: string) {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      organizer:profiles!events_organizer_id_fkey(
        id,
        username,
        full_name,
        avatar_url,
        bio
      ),
      badge:badges(
        id,
        name,
        description,
        image_url
      ),
      organizer_profile:organizer_profiles!organizer_profiles_user_id_fkey(
        organization_name,
        verified_organizer
      )
    `)
    .eq('id', eventId)
    .single();

  if (error) throw error;
  return data;
}

export async function enrollInEvent(eventId: string, userId: string) {
  const { data, error } = await supabase
    .from('event_enrollments')
    .insert({
      event_id: eventId,
      user_id: userId,
      status: 'enrolled'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function cancelEnrollment(enrollmentId: string) {
  const { error } = await supabase
    .from('event_enrollments')
    .update({ status: 'cancelled' })
    .eq('id', enrollmentId);

  if (error) throw error;
}

export async function getUserEnrollments(userId: string) {
  const { data, error } = await supabase
    .from('event_enrollments')
    .select(`
      *,
      event:events(
        id,
        title,
        start_date,
        end_date,
        location,
        image_url,
        status
      )
    `)
    .eq('user_id', userId)
    .neq('status', 'cancelled')
    .order('enrolled_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function checkUserEnrollment(eventId: string, userId: string) {
  const { data, error } = await supabase
    .from('event_enrollments')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .neq('status', 'cancelled')
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createEvent(eventData: any) {
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEvent(eventId: string, eventData: any) {
  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', eventId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrganizerEvents(organizerId: string) {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      badge:badges(
        name,
        image_url
      )
    `)
    .eq('organizer_id', organizerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getEventEnrollments(eventId: string) {
  const { data, error } = await supabase
    .from('event_enrollments')
    .select(`
      *,
      user:profiles(
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('event_id', eventId)
    .order('enrolled_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function isUserOrganizer(userId: string) {
  const { data, error } = await supabase
    .from('organizer_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createOrganizerProfile(profileData: any) {
  const { data, error } = await supabase
    .from('organizer_profiles')
    .insert(profileData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function issueBadgeToAttendee(enrollmentId: string, badgeId: string, userId: string) {
  const { mintBadgeNFT } = await import('./blockchain');

  const { data: badge } = await supabase
    .from('badges')
    .select('name, description, image_url')
    .eq('id', badgeId)
    .single() as { data: { name: string; description: string; image_url: string } | null };

  const { data: profile } = await supabase
    .from('profiles')
    .select('wallet_address')
    .eq('id', userId)
    .single() as { data: { wallet_address: string | null } | null };

  if (!badge?.data || !profile?.data?.wallet_address) {
    throw new Error('Missing badge or wallet information');
  }

  const mintResult = await mintBadgeNFT(
    profile.data.wallet_address,
    badge.data.name,
    badge.data.description,
    badge.data.image_url
  );

  if (!mintResult.success) {
    throw new Error(mintResult.error || 'Failed to mint NFT');
  }

  const { data: achievement, error: achievementError } = await (supabase.from('achievements') as any)
    .insert({
      user_id: userId,
      badge_id: badgeId,
      blockchain_verified: true,
      nft_minted: true,
      token_id: mintResult.tokenId,
      mint_transaction_hash: mintResult.transactionHash,
      blockchain_network: 'base'
    })
    .select()
    .single();

  if (achievementError) throw achievementError;

  const { error: enrollmentError } = await (supabase.from('event_enrollments') as any)
    .update({
      badge_issued: true,
      status: 'completed'
    })
    .eq('id', enrollmentId);

  if (enrollmentError) throw enrollmentError;

  return achievement;
}
