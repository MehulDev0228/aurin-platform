import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Award, Trophy, Eye, CheckCircle, Flame, Sparkles, Crown,
  Share2, ExternalLink, Users, Plus, TrendingUp, Calendar,
  Target, Zap, Star, ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, getUserStats } from '../lib/queries';
import { useToast } from '../components/Toast';
import Navbar from '../components/Navbar';

export default function NewDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    badges: 0,
    profileViews: 0,
    verifications: 0,
    dayStreak: 1
  });
  const [recentBadges, setRecentBadges] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  async function loadDashboard() {
    if (!user) return;

    try {
      setLoading(true);
      const [profile, statsData] = await Promise.all([
        getUserProfile(user.id),
        getUserStats(user.id)
      ]);

      setUserProfile(profile);
      setStats({
        badges: statsData.badgesEarned || 0,
        profileViews: profile.profile_views || 0,
        verifications: statsData.badgesEarned || 0,
        dayStreak: profile.day_streak || 1
      });
      setRecentBadges(statsData.recentAchievements || []);
      setRecommendations(statsData.recommendations || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }

  const copyProfileLink = () => {
    const profileUrl = `${window.location.origin}/profile/${userProfile.username}`;
    navigator.clipboard.writeText(profileUrl);
    showToast('Profile link copied!', 'success');
  };

  const handleShareProfile = () => copyProfileLink();
  const handleViewPublicProfile = () => window.open(`/profile/${userProfile.username}`, '_blank');
  const handleInviteFriends = () => {
    const inviteUrl = `${window.location.origin}/signup?ref=${userProfile.username}`;
    navigator.clipboard.writeText(inviteUrl);
    showToast('Invite link copied!', 'success');
  };
  const handleBecomeOrganizer = () => navigate('/organizer-dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Loading your achievements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent_50%)]" />

              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl opacity-50 group-hover:opacity-100 blur transition duration-500" />
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-500/30">
                      {userProfile?.avatar_url ? (
                        <img src={userProfile.avatar_url} alt={userProfile.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-3xl font-bold">
                          {userProfile?.username?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h1 className="text-4xl font-bold mb-2">{userProfile?.full_name || userProfile?.username}</h1>
                    <p className="text-gray-400 mb-3">@{userProfile?.username}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                      <Star size={16} className="text-emerald-400" />
                      <span className="text-sm font-semibold text-emerald-400">Rising Star</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={copyProfileLink}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <Share2 size={18} className="text-emerald-400" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: Trophy, value: stats.badges, label: 'Badges', color: 'emerald', subtext: 'Keep earning!' },
                { icon: Eye, value: stats.profileViews, label: 'Profile Views', color: 'blue', subtext: 'Growing' },
                { icon: CheckCircle, value: stats.verifications, label: 'Verified', color: 'purple', subtext: 'Nice!' },
                { icon: Flame, value: stats.dayStreak, label: 'Day Streak', color: 'orange', subtext: 'Keep it up!' }
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 hover:border-white/20 transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <stat.icon className={`text-${stat.color}-400 mb-3`} size={24} />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-600">{stat.subtext}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Sparkles size={24} className="text-emerald-400" />
                  <h2 className="text-2xl font-bold">Recent Achievements</h2>
                </div>
                <Link
                  to="/explore"
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  View All
                  <ArrowRight size={16} />
                </Link>
              </div>

              {recentBadges.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <Trophy size={32} className="text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No badges yet</h3>
                  <p className="text-gray-400 mb-6">Start earning badges to build your reputation</p>
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl font-semibold text-black hover:shadow-xl hover:shadow-emerald-500/50 transition-all"
                  >
                    <Plus size={18} />
                    <span>Explore Badges</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {recentBadges.slice(0, 6).map((badge, i) => (
                    <div
                      key={badge.id}
                      className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-6 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                      <div className="text-4xl mb-3">{badge.badge?.image_url || '🏆'}</div>
                      <h4 className="font-semibold mb-1 text-sm">{badge.badge?.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2">{badge.badge?.description}</p>
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <CheckCircle size={14} className="text-emerald-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={handleShareProfile}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Share2 size={20} className="text-emerald-400" />
                    <span className="font-medium">Share Profile</span>
                  </div>
                  <ArrowRight size={18} className="text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </button>
                <button
                  onClick={handleViewPublicProfile}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <ExternalLink size={20} className="text-emerald-400" />
                    <span className="font-medium">View Public Profile</span>
                  </div>
                  <ArrowRight size={18} className="text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </button>
                <button
                  onClick={handleInviteFriends}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-emerald-400" />
                    <span className="font-medium">Invite Friends</span>
                  </div>
                  <ArrowRight size={18} className="text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </button>
                <button
                  onClick={handleBecomeOrganizer}
                  className="w-full p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl hover:from-purple-500/20 hover:to-pink-500/20 transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Crown size={20} className="text-purple-400" />
                    <div>
                      <div className="font-medium">Become Organizer</div>
                      <div className="text-xs text-gray-500">Host events & issue badges</div>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Zap size={20} className="text-emerald-400" />
                <h3 className="text-xl font-bold">Recommended for You</h3>
              </div>

              <div className="space-y-3 mb-4">
                {recommendations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Award size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recommendations yet</p>
                  </div>
                ) : (
                  recommendations.slice(0, 3).map((badge) => (
                    <Link
                      key={badge.id}
                      to={`/explore?badge=${badge.id}`}
                      className="block p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-emerald-500/30 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-lg flex-shrink-0">
                          {badge.image_url || '🏆'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm group-hover:text-emerald-400 transition-colors mb-1">
                            {badge.name}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-2">{badge.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              <Link
                to="/explore"
                className="block w-full px-4 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl font-semibold text-black hover:shadow-xl hover:shadow-emerald-500/50 transition-all text-center"
              >
                <div className="flex items-center justify-center gap-2">
                  <Plus size={18} />
                  <span>Explore All Badges</span>
                </div>
              </Link>
            </div>

            {stats.badges > 0 && (
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 p-6">
                <div className="flex items-start gap-3">
                  <Target size={24} className="text-emerald-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Your Progress</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      {stats.badges < 5
                        ? `Earn ${5 - stats.badges} more badge${5 - stats.badges === 1 ? '' : 's'} to reach Beginner level!`
                        : stats.badges < 10
                        ? `Earn ${10 - stats.badges} more badge${10 - stats.badges === 1 ? '' : 's'} to reach Intermediate level!`
                        : stats.badges < 20
                        ? `Earn ${20 - stats.badges} more badge${20 - stats.badges === 1 ? '' : 's'} to reach Expert level!`
                        : 'You\'ve reached Expert level! Keep earning to become a Master!'}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{stats.badges} badge{stats.badges === 1 ? '' : 's'} earned</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((stats.badges / 20) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
