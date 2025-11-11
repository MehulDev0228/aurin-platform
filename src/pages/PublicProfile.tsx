import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Award, Calendar, MapPin, Briefcase,
  Github, Linkedin, Twitter, Globe, Share2, Copy, CheckCircle, ExternalLink, RefreshCw, AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import { logger } from '../lib/logger';
import { parseError, retryWithBackoff } from '../lib/errorHandler';
import { CardSkeleton } from '../components/LoadingSkeleton';
import SteveJobsNavbar from '../components/SteveJobsNavbar';

export default function PublicProfile() {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<any[]>([]);
  const [organizedEvents, setOrganizedEvents] = useState<any[]>([]);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (username) {
      loadProfile();
    }
  }, [username]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileData = await retryWithBackoff(async () => {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();
        if (profileError) throw profileError;
        return data;
      });

      setProfile(profileData);

      const [achievementsData, enrollmentsData, organizerData] = await Promise.all([
        retryWithBackoff(async () => {
          const { data, error: achievementsError } = await supabase
            .from('achievements')
            .select(`*, badge:badges(*)`)
            .eq('user_id', profileData.id)
            .order('earned_at', { ascending: false });
          if (achievementsError) throw achievementsError;
          return data || [];
        }),
        supabase
          .from('event_enrollments')
          .select(`*, events (id, title, description, start_date, image_url, category)`)
          .eq('user_id', profileData.id)
          .in('status', ['attended', 'completed'])
          .order('enrolled_at', { ascending: false })
          .then(({ data }) => data || []),
        supabase
          .from('organizer_profiles')
          .select('*')
          .eq('user_id', profileData.id)
          .maybeSingle()
          .then(({ data }) => data),
      ]);

      setBadges(achievementsData);
      setAttendedEvents(enrollmentsData);

      if (organizerData) {
        setIsOrganizer(true);
        const { data: organizedData } = await supabase
          .from('events')
          .select('*')
          .eq('organizer_id', profileData.id)
          .in('status', ['published', 'completed', 'ongoing'])
          .order('start_date', { ascending: false });
        setOrganizedEvents(organizedData || []);
      }
    } catch (error: any) {
      const errorInfo = parseError(error);
      logger.error('Failed to load profile', { error, context: 'PublicProfile', username });
      setError(errorInfo.message);
      showToast('Profile not found', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    await loadProfile();
    setRetrying(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Profile link copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.full_name || profile?.username}'s Aurin Profile`,
          text: `Check out ${profile?.full_name || profile?.username}'s verified credentials on Aurin!`,
          url: window.location.href,
        });
      } catch (error) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-5xl mx-auto p-6">
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20">
            <AlertCircle size={40} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Failed to load profile</h1>
            <p className="text-gray-400 mb-6">{error}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetry}
              disabled={retrying}
              aria-label="Retry loading profile"
              className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-semibold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {retrying ? (
                <>
                  <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <span>Retrying...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  <span>Try Again</span>
                </>
              )}
            </button>
            <Link
              to="/"
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-gray-400 mb-6">This user doesn't exist or their profile is private.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl font-semibold text-black hover:scale-105 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28">
      <SteveJobsNavbar />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 grain opacity-20" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-2xl">
              <Award size={20} className="text-black" />
            </div>
            <span className="font-semibold text-xl">Aurin</span>
          </Link>

          <Link
            to="/signup"
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl font-semibold text-black hover:scale-105 transition-all"
          >
            Create Your Profile
          </Link>
        </div>
      </nav>

      <div className="relative pt-24 pb-12 px-6 max-w-[1400px] mx-auto">
        <div className="premium-card p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-black font-bold text-4xl shadow-2xl flex-shrink-0">
              {(profile.full_name || profile.username).charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{profile.full_name || profile.username}</h1>
                  <p className="text-xl text-gray-400">@{profile.username}</p>
                  {profile.proofscore !== undefined && profile.proofscore !== null && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                        {Math.round(profile.proofscore)}
                      </div>
                      <div className="text-sm text-gray-400">ProofScore™</div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleShare}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  {copied ? <CheckCircle size={20} className="text-emerald-400" /> : <Share2 size={20} />}
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>
              </div>

              {profile.title && (
                <div className="flex items-center gap-2 text-lg mb-2">
                  <Briefcase size={20} className="text-emerald-400" />
                  <span>{profile.title}</span>
                </div>
              )}

              {profile.location && (
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <MapPin size={18} />
                  <span>{profile.location}</span>
                </div>
              )}

              {profile.bio && (
                <p className="text-gray-300 mb-6">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-3">
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <Linkedin size={18} />
                    <span className="text-sm">LinkedIn</span>
                    <ExternalLink size={14} className="text-gray-500" />
                  </a>
                )}

                {profile.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <Github size={18} />
                    <span className="text-sm">GitHub</span>
                    <ExternalLink size={14} className="text-gray-500" />
                  </a>
                )}

                {profile.twitter_url && (
                  <a
                    href={profile.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <Twitter size={18} />
                    <span className="text-sm">Twitter</span>
                    <ExternalLink size={14} className="text-gray-500" />
                  </a>
                )}

                {profile.website_url && (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <Globe size={18} />
                    <span className="text-sm">Website</span>
                    <ExternalLink size={14} className="text-gray-500" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="premium-card p-6 text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
              {badges.length}
            </div>
            <div className="text-gray-400">Verified Badges</div>
          </div>

          <div className="premium-card p-6 text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              {attendedEvents.length}
            </div>
            <div className="text-gray-400">Events Attended</div>
          </div>

          {isOrganizer && (
            <div className="premium-card p-6 text-center border border-purple-500/20 bg-purple-500/5">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {organizedEvents.length}
              </div>
              <div className="text-gray-400">Events Hosted</div>
            </div>
          )}

          <div className="premium-card p-6 text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
              {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
            <div className="text-gray-400">Member Since</div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Verified Credentials</h2>

          {badges.length === 0 ? (
            <div className="premium-card p-12 text-center">
              <Award size={64} className="text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No badges yet</h3>
              <p className="text-gray-500">This user hasn't earned any credentials yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {badges.map((achievement: any) => (
                <div key={achievement.id} className="premium-card p-6 hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-2xl shadow-xl flex-shrink-0">
                      {achievement.badge?.image_url ? (
                        <img src={achievement.badge.image_url} alt={achievement.badge.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Award size={32} className="text-black" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{achievement.badge?.name}</h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                        {achievement.badge?.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(achievement.earned_at).toLocaleDateString()}</span>
                        </div>

                        {achievement.blockchain_verified && (
                          <div className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle size={14} />
                            <span>Blockchain Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {attendedEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-6">Events Attended</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {attendedEvents.map((enrollment: any) => (
                <Link
                  key={enrollment.id}
                  to={`/events/${enrollment.events.id}`}
                  className="premium-card p-6 hover-lift"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0">
                      {enrollment.events.image_url ? (
                        <img src={enrollment.events.image_url} alt={enrollment.events.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                          <Calendar size={32} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{enrollment.events.title}</h3>
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">{enrollment.events.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>{new Date(enrollment.events.start_date).toLocaleDateString()}</span>
                      </div>
                      {enrollment.badge_issued && (
                        <div className="flex items-center gap-2 text-emerald-400 text-sm mt-2">
                          <CheckCircle size={14} />
                          <span>Badge Earned</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {isOrganizer && organizedEvents.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-bold">Events Hosted</h2>
              <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm font-semibold text-purple-400">
                Organizer
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {organizedEvents.map((event: any) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="premium-card p-6 hover-lift border border-purple-500/20"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
                      {event.image_url ? (
                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                          <Award size={32} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">{event.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(event.start_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-purple-400">
                          <Award size={14} />
                          <span>{event.current_attendees} attendees</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="premium-card p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Want to showcase your credentials?</h3>
          <p className="text-gray-400 mb-6">
            Join Aurin and earn blockchain-verified badges that prove your achievements
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl font-semibold text-black hover:scale-105 transition-all"
          >
            Create Your Free Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
