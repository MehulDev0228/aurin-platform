// My Proof - 3-tab structure for AURIN v1
// Timeline of badges with ProofScore at top

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Share2, Copy, CheckCircle2, Sparkles, TrendingUp, Linkedin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/use-toast';
import { generateLinkedInShare, openLinkedInShare, copyLinkedInText } from '../lib/linkedInShare';
import { logger } from '../lib/logger';
import SteveJobsNavbar from '../components/SteveJobsNavbar';
import { ListSkeleton } from '../components/LoadingSkeleton';

export default function MyProof() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [proofScore, setProofScore] = useState(0);
  const [badges, setBadges] = useState<any[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProof();
    }
  }, [user]);

  const loadProof = async () => {
    try {
      // Get user profile with proofscore
      const { data: profile } = await supabase
        .from('profiles')
        .select('proofscore, username')
        .eq('id', user!.id)
        .single();

      if (profile) {
        setProofScore(profile.proofscore || 0);
      }

      // Get user achievements
      const { data: achievements, error } = await supabase
        .from('achievements')
        .select(`
          *,
          badge:badges(
            id,
            name,
            description,
            image_url,
            rarity,
            category
          )
        `)
        .eq('user_id', user!.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setBadges(achievements || []);
    } catch (error) {
      logger.error('Failed to load proof', { error, context: 'MyProof', userId: user?.id });
      toast({
        title: 'Failed to load proof',
        description: 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (achievement: any) => {
    try {
      const shareText = await generateLinkedInShare({
        achievementId: achievement.id,
        badgeName: achievement.badge.name,
        badgeDescription: achievement.badge.description,
        verifyUrl: `${window.location.origin}/verify/${achievement.id}`,
      });
      openLinkedInShare(shareText);
    } catch (error) {
      logger.error('Failed to generate share', { error, context: 'MyProof' });
      toast({
        title: 'Failed to share',
        description: 'Please try again',
      });
    }
  };

  const handleCopyLink = async (achievement: any) => {
    const verifyUrl = `${window.location.origin}/verify/${achievement.id}`;
    await navigator.clipboard.writeText(verifyUrl);
    setCopied(achievement.id);
    toast({
      title: 'Link copied!',
      description: 'Share your proof',
    });
    setTimeout(() => setCopied(null), 2000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-500 to-orange-500';
      case 'rare':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-emerald-500 to-teal-500';
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'Legendary';
      case 'rare':
        return 'Rare';
      default:
        return 'Common';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-28">
        <SteveJobsNavbar />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
          <ListSkeleton count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28">
      <SteveJobsNavbar />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        {/* ProofScore Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Proof</h1>
                <p className="text-gray-400">Your verifiable achievements</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-2">
                  {Math.round(proofScore)}
                </div>
                <div className="text-sm text-gray-400">ProofScore™</div>
              </div>
            </div>
            
            {/* ProofScore Ring */}
            <div className="relative w-32 h-32 mx-auto">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - proofScore / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-2xl font-bold">{Math.round(proofScore)}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Badges Timeline */}
        <div className="space-y-6">
          {badges.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card text-center py-16"
            >
              <Sparkles size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No proof yet</h3>
              <p className="text-gray-400 mb-6">Start earning badges by attending events</p>
              <a href="/explore" className="btn-primary inline-block">
                Explore Events
              </a>
            </motion.div>
          ) : (
            badges.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-start gap-6">
                  {/* Badge Image */}
                  <div className="relative">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getRarityColor(achievement.badge?.rarity || 'common')} p-0.5`}>
                      <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                        {achievement.badge?.image_url ? (
                          <img
                            src={achievement.badge.image_url}
                            alt={achievement.badge.name}
                            className="w-full h-full rounded-2xl object-cover"
                          />
                        ) : (
                          <Award size={32} className="text-emerald-400" />
                        )}
                      </div>
                    </div>
                    {achievement.badge?.rarity && achievement.badge.rarity !== 'common' && (
                      <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${getRarityColor(achievement.badge.rarity)} text-black`}>
                        {getRarityLabel(achievement.badge.rarity)}
                      </div>
                    )}
                  </div>

                  {/* Badge Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {achievement.badge?.name || 'Unknown Badge'}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2">
                          {achievement.badge?.description || ''}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            {new Date(achievement.earned_at).toLocaleDateString()}
                          </span>
                          {achievement.blockchain_verified && (
                            <span className="flex items-center gap-1 text-emerald-400">
                              <CheckCircle2 size={12} />
                              Verified on-chain
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Share Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      <button
                        onClick={() => handleShare(achievement)}
                        className="btn-secondary text-sm flex items-center gap-2"
                      >
                        <Linkedin size={16} />
                        Share to LinkedIn
                      </button>
                      <button
                        onClick={() => handleCopyLink(achievement)}
                        className="btn-secondary text-sm flex items-center gap-2"
                      >
                        {copied === achievement.id ? (
                          <>
                            <CheckCircle2 size={16} />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copy Link
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

