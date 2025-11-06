import { supabase } from './supabase';

export interface AwardBadgeParams {
  userId: string;
  badgeId: string;
  metadata?: Record<string, any>;
  isFeatured?: boolean;
}

export async function awardBadge(params: AwardBadgeParams) {
  try {
    const { data: achievement, error } = await supabase
      .from('achievements')
      .insert({
        user_id: params.userId,
        badge_id: params.badgeId,
        is_featured: params.isFeatured || false,
        metadata: params.metadata || {},
        blockchain_verified: false,
        nft_minted: false,
      })
      .select(`
        *,
        badges (
          id,
          name,
          description,
          image_url,
          category
        )
      `)
      .single();

    if (error) throw error;

    await supabase
      .from('badges')
      .update({ total_issued: supabase.rpc('increment_total_issued', { badge_id: params.badgeId }) })
      .eq('id', params.badgeId);

    return { success: true, achievement };
  } catch (error: any) {
    console.error('Award badge error:', error);
    return { success: false, error: error.message };
  }
}

export async function awardBadgeToMultipleUsers(userIds: string[], badgeId: string) {
  try {
    const achievements = userIds.map(userId => ({
      user_id: userId,
      badge_id: badgeId,
      blockchain_verified: false,
      nft_minted: false,
    }));

    const { data, error } = await supabase
      .from('achievements')
      .insert(achievements)
      .select();

    if (error) throw error;

    return { success: true, count: data.length };
  } catch (error: any) {
    console.error('Award badge to multiple users error:', error);
    return { success: false, error: error.message };
  }
}

export async function removeBadge(achievementId: string) {
  try {
    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', achievementId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Remove badge error:', error);
    return { success: false, error: error.message };
  }
}

export async function checkUserHasBadge(userId: string, badgeId: string) {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_id', badgeId)
      .maybeSingle();

    if (error) throw error;

    return !!data;
  } catch (error) {
    console.error('Check user has badge error:', error);
    return false;
  }
}
