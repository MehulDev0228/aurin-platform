import { supabase } from './supabase';
import { logger } from './logger';

export async function isUserAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) return false;
  return !!data;
}

export async function isUserSuperAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'super_admin')
    .maybeSingle();

  if (error) return false;
  return !!data;
}

export async function getDashboardStats() {
  const [usersCount, eventsCount, enrollmentsCount, badgesCount] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('events').select('id', { count: 'exact', head: true }),
    supabase.from('event_enrollments').select('id', { count: 'exact', head: true }),
    supabase.from('achievements').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalUsers: usersCount.count || 0,
    totalEvents: eventsCount.count || 0,
    totalEnrollments: enrollmentsCount.count || 0,
    totalBadges: badgesCount.count || 0,
  };
}

export async function getAllUsers(limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      achievements(count),
      event_enrollments(count)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data || [];
}

export async function getAllEventsAdmin(limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      organizer:profiles!events_organizer_id_fkey(username, full_name),
      event_enrollments(count)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data || [];
}

export async function getAllOrganizers() {
  const { data, error } = await supabase
    .from('organizer_profiles')
    .select(`
      *,
      user:profiles(id, username, full_name, email, avatar_url)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateUserStatus(userId: string, updates: any) {
  const { error } = await (supabase.from('profiles') as any)
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
}

export async function deleteUser(userId: string) {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) throw error;
}

export async function verifyOrganizer(userId: string) {
  const { error } = await (supabase.from('organizer_profiles') as any)
    .update({ verified_organizer: true })
    .eq('user_id', userId);

  if (error) throw error;
}

export async function verifyEvent(eventId: string) {
  const { error } = await (supabase.from('events') as any)
    .update({ event_verified: true })
    .eq('id', eventId);

  if (error) throw error;
}

export async function rejectEvent(eventId: string) {
  const { error } = await (supabase.from('events') as any)
    .update({ status: 'cancelled', event_verified: false })
    .eq('id', eventId);

  if (error) throw error;
}

export async function deleteEvent(eventId: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId);

  if (error) throw error;
}

export async function getActivityLogs(limit = 100) {
  const { data, error } = await supabase
    .from('admin_activity_logs')
    .select(`
      *,
      admin:admin_users!admin_activity_logs_admin_id_fkey(
        user:profiles(username, full_name)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function logAdminAction(
  userId: string,
  action: string,
  targetType: string,
  targetId: string,
  details: any = {}
) {
  const { error } = await (supabase.rpc as any)('log_admin_action', {
    p_admin_user_id: userId,
    p_action: action,
    p_target_type: targetType,
    p_target_id: targetId,
    p_details: details,
  });

  if (error) logger.error('Failed to log admin action', { error, context: 'AdminQueries', userId, action, targetType, targetId });
}

export async function getAnalytics(days = 30) {
  const { data, error } = await supabase
    .from('platform_analytics')
    .select('*')
    .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateAnalytics() {
  const { error } = await supabase.rpc('update_platform_analytics');
  if (error) throw error;
}

export async function createBadge(badgeData: any) {
  const { data, error } = await supabase
    .from('badges')
    .insert(badgeData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBadge(badgeId: string, badgeData: any) {
  const { data, error } = await (supabase.from('badges') as any)
    .update(badgeData)
    .eq('id', badgeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBadge(badgeId: string) {
  const { error } = await supabase
    .from('badges')
    .delete()
    .eq('id', badgeId);

  if (error) throw error;
}

export async function getPendingApprovals() {
  const [pendingOrganizers, pendingEvents] = await Promise.all([
    supabase
      .from('organizer_profiles')
      .select('*, profiles(username, full_name)')
      .eq('verified_organizer', false),
    supabase
      .from('events')
      .select('*, profiles(username, full_name)')
      .eq('status', 'draft')
  ]);

  return {
    organizers: pendingOrganizers.data || [],
    events: pendingEvents.data || []
  };
}

export async function getRecentUsers(limit: number = 10) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getUserGrowthData(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('profiles')
    .select('created_at')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) throw error;

  const dailyCounts: { [key: string]: number } = {};
  data?.forEach((profile: any) => {
    const date = new Date(profile.created_at).toISOString().split('T')[0];
    dailyCounts[date] = (dailyCounts[date] || 0) + 1;
  });

  return Object.entries(dailyCounts).map(([date, count]) => ({ date, count }));
}
