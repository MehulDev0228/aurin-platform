import { supabase } from './supabase';

export async function getUserStats(userId: string) {
  try {
    const [badgesResult, viewsResult, activityResult] = await Promise.all([
      supabase
        .from('achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),

      supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', userId),

      supabase
        .from('user_activity')
        .select('activity_count')
        .eq('user_id', userId)
        .order('activity_date', { ascending: false })
        .limit(365)
    ]);

    const activityDays = activityResult.data?.filter(a => a.activity_count > 0).length || 0;

    return {
      badges: badgesResult.count || 0,
      profileViews: viewsResult.count || 0,
      verifications: 0,
      streak: activityDays
    };
  } catch (error) {
    console.error('getUserStats error:', error);
    return {
      badges: 0,
      profileViews: 0,
      verifications: 0,
      streak: 0
    };
  }
}

export async function getUserBadges(userId: string, limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select(`
        id,
        earned_at,
        blockchain_verified,
        badges (
          id,
          name,
          description,
          image_url,
          category,
          issuers (
            name
          )
        )
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getUserBadges error:', error);
    return [];
  }
}

export async function getPlatformStats() {
  const { data, error } = await supabase
    .from('platform_stats')
    .select('*')
    .single();

  if (error) {
    return {
      total_users: 0,
      total_badges: 0,
      total_verifications: 0
    };
  }

  return data;
}

export async function getAllBadges(category?: string, search?: string) {
  try {
    let query = supabase
      .from('badges')
      .select(`
        id,
        name,
        description,
        image_url,
        category,
        total_issued,
        issuers (
          name
        )
      `)
      .eq('is_active', true);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query.order('total_issued', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getAllBadges error:', error);
    return [];
  }
}

export async function getUserActivity(userId: string, days: number = 365) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('user_activity')
      .select('activity_date, activity_count')
      .eq('user_id', userId)
      .gte('activity_date', startDate.toISOString().split('T')[0])
      .order('activity_date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getUserActivity error:', error);
    return [];
  }
}

export async function trackProfileView(profileId: string, viewerIp?: string) {
  try {
    const { error } = await supabase
      .from('profile_views')
      .insert({
        profile_id: profileId,
        viewer_ip: viewerIp || 'unknown'
      });

    if (error) console.error('Track profile view error:', error);
  } catch (error) {
    console.error('Track profile view error:', error);
  }
}

export async function incrementUserActivity(userId: string) {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('user_activity')
      .upsert({
        user_id: userId,
        activity_date: today,
        activity_count: 1
      }, {
        onConflict: 'user_id,activity_date',
        ignoreDuplicates: false
      });

    if (error) console.error('Activity tracking error:', error);
  } catch (error) {
    console.error('Activity tracking error:', error);
  }
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('getUserProfile error:', error);
    return null;
  }
}
