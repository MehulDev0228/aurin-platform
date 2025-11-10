import { supabase } from './supabase';
import { logger } from './logger';

export async function getUserStats(userId: string) {
  try {
    const [badgesResult, viewsResult, achievementsResult] = await Promise.all([
      supabase
        .from('achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),

      supabase
        .from('profiles')
        .select('profile_views')
        .eq('id', userId)
        .single(),

      supabase
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
            category
          )
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false })
        .limit(6)
    ]);

    const badgesEarned = badgesResult.count || 0;
    const profileViews = viewsResult.data?.profile_views || 0;
    const recentAchievements = achievementsResult.data || [];
    const verifications = achievementsResult.data?.filter((a: any) => a.blockchain_verified).length || 0;

    // Calculate day streak (simplified - based on recent activity)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const recentBadges = achievementsResult.data?.filter((a: any) => {
      const earnedDate = new Date(a.earned_at);
      earnedDate.setHours(0, 0, 0, 0);
      const diffTime = today.getTime() - earnedDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }).length || 0;

    return {
      badgesEarned,
      profileViews,
      verifications,
      dayStreak: Math.min(recentBadges, 30),
      recentAchievements,
      recommendations: [] // Can be populated with recommendation logic
    };
  } catch (error) {
    logger.error('getUserStats failed', { error, context: 'Queries', userId });
    return {
      badgesEarned: 0,
      profileViews: 0,
      verifications: 0,
      dayStreak: 0,
      recentAchievements: [],
      recommendations: []
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
    logger.error('getUserBadges failed', { error, context: 'Queries', userId });
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
    logger.error('getAllBadges failed', { error, context: 'Queries', category, search });
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
    logger.error('getUserActivity failed', { error, context: 'Queries', userId, days });
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

    if (error) logger.error('Track profile view failed', { error, context: 'Queries', profileId, viewerIp });
  } catch (error) {
    logger.error('Track profile view failed', { error, context: 'Queries', profileId, viewerIp });
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

    if (error) logger.error('Activity tracking failed', { error, context: 'Queries', userId });
  } catch (error) {
    logger.error('Activity tracking failed', { error, context: 'Queries', userId });
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
    logger.error('getUserProfile failed', { error, context: 'Queries', userId });
    return null;
  }
}
