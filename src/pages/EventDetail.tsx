import { useState, useEffect } from 'react';
import { Award, Calendar, MapPin, Users, Clock, Share2, CheckCircle, ArrowLeft, Sparkles, Shield } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../lib/eventQueries';
import { enrollInEvent as enrollService, isUserEnrolled } from '../lib/enrollmentService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { DashboardSkeleton } from '../components/Skeleton';

export default function EventDetail() {
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id && user?.id) {
      loadEventData();
    }
  }, [id, user?.id]);

  const loadEventData = async () => {
    try {
      const eventData = await getEventById(id!);
      const enrolled = await isUserEnrolled(user!.id, id!);

      setEvent(eventData);
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Failed to load event:', error);
      showToast('Failed to load event', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (event.current_attendees >= event.max_attendees) {
      showToast('This event is full', 'error');
      return;
    }

    setEnrolling(true);
    try {
      const result = await enrollService({
        eventId: event.id,
        userId: user.id,
      });

      if (result.success) {
        showToast(result.message || 'Successfully enrolled in event!', 'success');
        setIsEnrolled(true);
        setEvent({ ...event, current_attendees: event.current_attendees + 1 });
      } else {
        showToast(result.error || 'Failed to enroll', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to enroll', 'error');
    } finally {
      setEnrolling(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'online': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'in-person': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'hybrid': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 px-6">
        <div className="max-w-5xl mx-auto">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Event not found</h2>
          <Link to="/events" className="text-emerald-400 hover:text-emerald-300">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const spotsLeft = event.max_attendees - event.current_attendees;
  const percentFilled = (event.current_attendees / event.max_attendees) * 100;

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/events" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Events</span>
          </Link>

          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-2xl">
              <Award size={20} className="text-black" />
            </div>
            <span className="font-semibold text-xl">Aurin</span>
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
        <div className="relative h-80 rounded-3xl overflow-hidden mb-8">
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-xl capitalize ${getEventTypeColor(event.event_type)}`}>
                {event.event_type}
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20 backdrop-blur-xl capitalize">
                {event.category}
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-2">{event.title}</h1>
            <p className="text-xl text-gray-300">Hosted by {event.organizer.full_name}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="premium-card p-8">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>

            {event.badge && (
              <div className="premium-card p-8">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={event.badge.image_url} alt={event.badge.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={20} className="text-emerald-400" />
                      <h3 className="text-xl font-bold">Earn a Badge</h3>
                    </div>
                    <p className="text-gray-400 mb-3">
                      Complete this event to earn the <span className="text-emerald-400 font-semibold">{event.badge.name}</span> badge
                    </p>
                    <p className="text-sm text-gray-500">{event.badge.description}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="premium-card p-8">
              <h2 className="text-2xl font-bold mb-6">Event Organizer</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-black text-2xl font-bold">
                  {event.organizer.full_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold">{event.organizer.full_name}</h3>
                    {event.organizer_profile?.verified_organizer && (
                      <Shield size={16} className="text-emerald-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">@{event.organizer.username}</p>
                  {event.organizer_profile && (
                    <p className="text-sm text-gray-400">{event.organizer_profile.organization_name}</p>
                  )}
                  {event.organizer.bio && (
                    <p className="text-sm text-gray-400 mt-3">{event.organizer.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="premium-card p-6 sticky top-24">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-emerald-400" />
                    <div>
                      <div className="font-semibold">{formatDate(event.start_date)}</div>
                      <div className="text-sm text-gray-500">
                        {formatTime(event.start_date)} - {formatTime(event.end_date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-emerald-400" />
                    <div>
                      <div className="font-semibold">{event.location}</div>
                      <div className="text-sm text-gray-500 capitalize">{event.event_type} event</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users size={20} className="text-emerald-400" />
                    <div>
                      <div className="font-semibold">{event.current_attendees} / {event.max_attendees} enrolled</div>
                      <div className="text-sm text-gray-500">{spotsLeft} spots remaining</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Enrollment</span>
                    <span className="font-semibold">{Math.round(percentFilled)}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                </div>

                {isEnrolled ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                    <CheckCircle size={24} className="text-emerald-400 mx-auto mb-2" />
                    <p className="font-semibold text-emerald-400">You're enrolled!</p>
                    <p className="text-sm text-gray-400 mt-1">Check your email for details</p>
                  </div>
                ) : spotsLeft > 0 ? (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full px-6 py-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl font-semibold text-lg text-black hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                ) : (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                    <p className="font-semibold text-red-400">Event Full</p>
                    <p className="text-sm text-gray-400 mt-1">No spots available</p>
                  </div>
                )}

                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-all">
                  <Share2 size={18} />
                  <span>Share Event</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
