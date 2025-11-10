// src/pages/SteveJobsDashboard.tsx - Steve Jobs Level Dashboard
// Simplicity. Elegance. Storytelling.
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award, Trophy, Eye, CheckCircle, Flame, Sparkles,
  Share2, ExternalLink, Users, Plus, Target, Zap, Star, ArrowRight, Upload, FileText, Copy
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, getUserStats } from '../lib/queries';
import { useToast } from '../components/ui/use-toast';
import { logger } from '../lib/logger';
import SteveJobsNavbar from '../components/SteveJobsNavbar';
import CertificateImport from '../components/CertificateImport';
import ScrollReveal from '../components/ScrollReveal';
import ResumeLineGenerator from '../components/ResumeLineGenerator';

export default function SteveJobsDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
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
  const [showCertImport, setShowCertImport] = useState(false);

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
        profileViews: statsData.profileViews || 0,
        verifications: statsData.verifications || 0,
        dayStreak: statsData.dayStreak || 1
      });
      setRecentBadges(statsData.recentAchievements || []);
      setRecommendations(statsData.recommendations || []);
    } catch (error) {
      logger.error('Failed to load dashboard', { error, context: 'Dashboard', userId: user.id });
      toast({
        title: 'Failed to load dashboard',
        description: 'Unable to load your dashboard. Please try refreshing the page or contact support if the issue persists.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const copyProfileLink = () => {
    if (!userProfile?.username) return;
    const profileUrl = `${window.location.origin}/profile/${userProfile.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'Profile link copied',
      description: 'Share your profile with others',
    });
  };

  const handleShareProfile = () => copyProfileLink();
  const handleViewPublicProfile = () => {
    if (!userProfile?.username) return;
    window.open(`/profile/${userProfile.username}`, '_blank');
  };
  const handleInviteFriends = () => {
    if (!userProfile?.username) return;
    const inviteUrl = `${window.location.origin}/signup?ref=${userProfile.username}`;
    navigator.clipboard.writeText(inviteUrl);
    toast({
      title: 'Invite link copied',
      description: 'Share with friends to earn rewards',
    });
  };
  const handleBecomeOrganizer = () => navigate('/organizer-dashboard');
  const handleImportCertificates = () => setShowCertImport(true);
  const handleCertImportSuccess = () => {
    loadDashboard();
    setShowCertImport(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <SteveJobsNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center gap-6">
            <motion.div
              className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-400 text-[15px] tracking-[-0.01em]">Loading your achievements</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SteveJobsNavbar />
      {showCertImport && (
        <CertificateImport
          onClose={() => setShowCertImport(false)}
          onSuccess={handleCertImportSuccess}
        />
      )}

      <div className="max-w-[1600px] mx-auto px-8 py-16">
        {/* Hero Section - Storytelling */}
        <ScrollReveal direction="fade" delay={0.1}>
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-500/[0.08] via-teal-500/[0.04] to-transparent border border-emerald-500/10 p-12 mb-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.08),transparent_60%)]" />
            
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-8">
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-emerald-400/0 via-emerald-400/30 to-emerald-400/0 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-1000"
                    animate={{
                      opacity: [0, 0.15, 0],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <div className="relative w-32 h-32 rounded-3xl overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-emerald-400 to-teal-500">
                    {userProfile?.avatar_url ? (
                      <img src={userProfile.avatar_url} alt={userProfile.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-black text-black">
                        {userProfile?.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                </motion.div>

                <div>
                  <h1 className="text-5xl font-black mb-3 tracking-[-0.02em] leading-none">
                    {userProfile?.full_name || userProfile?.username}
                  </h1>
                  <p className="text-xl text-gray-400 mb-4 tracking-[-0.01em]">@{userProfile?.username}</p>
                  {userProfile?.bio && (
                    <p className="text-[15px] text-gray-300 max-w-2xl leading-relaxed mb-4 tracking-[-0.01em]">
                      {userProfile.bio}
                    </p>
                  )}
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                    <Star size={16} className="text-emerald-400" />
                    <span className="text-[14px] font-semibold text-emerald-400 tracking-[-0.01em]">Rising Star</span>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={copyProfileLink}
                className="px-8 py-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-2xl font-medium text-[15px] tracking-[-0.01em] transition-all duration-500 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Share2 size={18} className="text-emerald-400" />
                <span>Share</span>
              </motion.button>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats - Elegant Cards */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="grid grid-cols-4 gap-4 mb-12">
            {[
              { icon: Trophy, value: stats.badges, label: 'Badges', color: 'emerald', story: stats.badges === 0 ? 'Start your journey' : `${stats.badges} achievement${stats.badges === 1 ? '' : 's'} earned` },
              { icon: Eye, value: stats.profileViews, label: 'Profile Views', color: 'blue', story: stats.profileViews === 0 ? 'Your story begins' : `${stats.profileViews} people viewed your profile` },
              { icon: CheckCircle, value: stats.verifications, label: 'Verified', color: 'purple', story: stats.verifications === 0 ? 'Build trust' : `${stats.verifications} verification${stats.verifications === 1 ? '' : 's'}` },
              { icon: Flame, value: stats.dayStreak, label: 'Day Streak', color: 'orange', story: stats.dayStreak === 1 ? 'Keep going' : `${stats.dayStreak} days strong` }
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/10 p-8 hover:border-white/20 transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <stat.icon className={`text-${stat.color}-400 mb-4`} size={28} strokeWidth={2} />
                <div className="text-4xl font-black mb-2 tracking-[-0.02em]">{stat.value}</div>
                <div className="text-[13px] text-gray-400 mb-1 tracking-[-0.01em] uppercase font-medium">{stat.label}</div>
                <div className="text-[12px] text-gray-500 tracking-[-0.01em]">{stat.story}</div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Public Profile Link - Prominent */}
            {userProfile?.username && (
              <ScrollReveal direction="up" delay={0.25}>
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500/[0.08] to-teal-500/[0.04] border border-emerald-500/10 p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <Share2 size={28} className="text-black" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black mb-3 tracking-[-0.02em]">Your Public Profile</h3>
                      <p className="text-[15px] text-gray-300 mb-6 leading-relaxed tracking-[-0.01em]">
                        Share your verified achievements with the world. This is your professional showcase.
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 p-4 rounded-xl bg-black/40 border border-white/10">
                          <div className="text-xs text-emerald-400 mb-1 font-medium">Profile URL</div>
                          <div className="text-[15px] font-mono text-white truncate">
                            {window.location.origin}/profile/{userProfile.username}
                          </div>
                        </div>
                        <motion.button
                          onClick={copyProfileLink}
                          className="px-6 py-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl font-semibold text-black text-[15px] tracking-[-0.01em] flex items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all duration-500"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <Copy size={18} />
                          <span>Copy Link</span>
                        </motion.button>
                        <motion.button
                          onClick={handleViewPublicProfile}
                          className="px-6 py-4 bg-white/[0.02] border border-white/10 rounded-xl font-medium text-white text-[15px] tracking-[-0.01em] flex items-center gap-2 hover:bg-white/[0.04] transition-all duration-500"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <ExternalLink size={18} />
                          <span>View</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Resume Line Generator - UNIQUE FEATURE */}
            {recentBadges.length > 0 && (
              <ScrollReveal direction="up" delay={0.3}>
                <ResumeLineGenerator 
                  achievements={recentBadges} 
                  username={userProfile?.username}
                />
              </ScrollReveal>
            )}

            {/* Certificate Import - Storytelling */}
            {stats.badges === 0 && (
              <ScrollReveal direction="up" delay={0.3}>
                <div className="rounded-2xl bg-gradient-to-br from-purple-500/[0.08] to-pink-500/[0.04] border border-purple-500/10 p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <FileText size={28} className="text-black" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black mb-3 tracking-[-0.02em]">Have existing certificates?</h3>
                      <p className="text-[15px] text-gray-300 mb-6 leading-relaxed tracking-[-0.01em]">
                        Import your certificates and achievements to build your AURIN profile. Your past accomplishments deserve recognition.
                      </p>
                      <motion.button
                        onClick={handleImportCertificates}
                        className="px-8 py-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl font-semibold text-black text-[15px] tracking-[-0.01em] flex items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all duration-500"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Upload size={18} />
                        <span>Import Certificates</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Recent Achievements - Storytelling */}
            <ScrollReveal direction="up" delay={0.4}>
              <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <Sparkles size={28} className="text-emerald-400" strokeWidth={2} />
                    <h2 className="text-3xl font-black tracking-[-0.02em]">Recent Achievements</h2>
                  </div>
                  <Link
                    to="/explore"
                    className="text-[14px] text-emerald-400 hover:text-emerald-300 transition-colors duration-300 flex items-center gap-2 tracking-[-0.01em]"
                  >
                    View All
                    <ArrowRight size={16} />
                  </Link>
                </div>

                {recentBadges.length === 0 ? (
                  <div className="text-center py-16">
                    <motion.div
                      className="w-24 h-24 rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center mx-auto mb-6"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Trophy size={40} className="text-gray-600" strokeWidth={2} />
                    </motion.div>
                    <h3 className="text-2xl font-black mb-3 tracking-[-0.02em]">No badges yet</h3>
                    <p className="text-[15px] text-gray-400 mb-8 tracking-[-0.01em] leading-relaxed max-w-md mx-auto">
                      Start earning badges to build your reputation. Every achievement tells your story.
                    </p>
                    <Link to="/explore">
                      <motion.button
                        className="px-10 py-5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl font-semibold text-black text-[15px] tracking-[-0.01em] flex items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all duration-500"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Plus size={20} />
                        <span>Explore Badges</span>
                      </motion.button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {recentBadges.slice(0, 6).map((achievement: any, i) => (
                      <motion.div
                        key={achievement.id}
                        className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/10 p-6 hover:border-emerald-500/30 transition-all duration-500 cursor-pointer"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ scale: 1.03, y: -4 }}
                      >
                        {achievement.badges?.image_url ? (
                          <img
                            src={achievement.badges.image_url}
                            alt={achievement.badges.name}
                            className="w-20 h-20 object-cover rounded-xl mb-4 mx-auto"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4">
                            <Trophy size={36} className="text-black" strokeWidth={2} />
                          </div>
                        )}
                        <h4 className="font-bold mb-2 text-center text-[14px] tracking-[-0.01em]">{achievement.badges?.name || 'Badge'}</h4>
                        <p className="text-[12px] text-gray-500 line-clamp-2 text-center leading-relaxed">{achievement.badges?.description}</p>
                        {achievement.blockchain_verified && (
                          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                            <CheckCircle size={16} className="text-emerald-400" strokeWidth={2} />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar - Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            <ScrollReveal direction="up" delay={0.5}>
              <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-8">
                <h3 className="text-2xl font-black mb-6 tracking-[-0.02em]">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { icon: Share2, label: 'Share Profile', onClick: handleShareProfile, color: 'emerald' },
                    { icon: ExternalLink, label: 'View Public Profile', onClick: handleViewPublicProfile, color: 'emerald' },
                    { icon: Users, label: 'Invite Friends', onClick: handleInviteFriends, color: 'emerald' },
                    { icon: Upload, label: 'Import Certificates', onClick: handleImportCertificates, color: 'emerald', show: stats.badges > 0 },
                  ].filter(item => item.show !== false).map((action, i) => (
                    <motion.button
                      key={i}
                      onClick={action.onClick}
                      className="w-full p-5 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500 text-left flex items-center justify-between group"
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="flex items-center gap-4">
                        <action.icon size={20} className={`text-${action.color}-400`} strokeWidth={2} />
                        <span className="font-medium text-[15px] tracking-[-0.01em]">{action.label}</span>
                      </div>
                      <ArrowRight size={18} className="text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" />
                    </motion.button>
                  ))}
                  <motion.button
                    onClick={handleBecomeOrganizer}
                    className="w-full p-5 bg-gradient-to-r from-purple-500/[0.08] to-pink-500/[0.04] border border-purple-500/20 rounded-2xl hover:from-purple-500/[0.12] hover:to-pink-500/[0.08] transition-all duration-500 text-left flex items-center justify-between group mt-4"
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-center gap-4">
                      <Zap size={20} className="text-purple-400" strokeWidth={2} />
                      <div>
                        <div className="font-semibold text-[15px] tracking-[-0.01em]">Become Organizer</div>
                        <div className="text-[12px] text-gray-500 tracking-[-0.01em]">Host events & issue badges</div>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
                  </motion.button>
                </div>
              </div>
            </ScrollReveal>

            {/* Progress - Storytelling */}
            {stats.badges > 0 && (
              <ScrollReveal direction="up" delay={0.6}>
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500/[0.08] to-teal-500/[0.04] border border-emerald-500/10 p-8">
                  <div className="flex items-start gap-4">
                    <Target size={28} className="text-emerald-400 flex-shrink-0 mt-1" strokeWidth={2} />
                    <div className="flex-1">
                      <h3 className="font-black text-2xl mb-3 tracking-[-0.02em]">Your Progress</h3>
                      <p className="text-[14px] text-gray-300 mb-6 leading-relaxed tracking-[-0.01em]">
                        {stats.badges < 5
                          ? `Earn ${5 - stats.badges} more badge${5 - stats.badges === 1 ? '' : 's'} to reach Beginner level. Every step counts.`
                          : stats.badges < 10
                          ? `Earn ${10 - stats.badges} more badge${10 - stats.badges === 1 ? '' : 's'} to reach Intermediate level. You're on the right path.`
                          : stats.badges < 20
                          ? `Earn ${20 - stats.badges} more badge${20 - stats.badges === 1 ? '' : 's'} to reach Expert level. Excellence is within reach.`
                          : 'You\'ve reached Expert level. Keep earning to become a Master. Your journey continues.'}
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-[12px] text-gray-400 tracking-[-0.01em]">
                          <span>Progress</span>
                          <span>{stats.badges} badge{stats.badges === 1 ? '' : 's'} earned</span>
                        </div>
                        <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((stats.badges / 20) * 100, 100)}%` }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

