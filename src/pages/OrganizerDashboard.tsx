import { useState, useEffect } from 'react';
import { Award, Plus, Calendar, Users, TrendingUp, Settings as SettingsIcon, ArrowLeft, CheckCircle, Clock, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isUserOrganizer, createOrganizerProfile, getOrganizerEvents, getEventEnrollments, issueBadgeToAttendee } from '../lib/eventQueries';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import { DashboardSkeleton } from '../components/Skeleton';

export default function OrganizerDashboard() {
  const [loading, setLoading] = useState(true);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [showSetup, setShowSetup] = useState(false);
  const [showEnrollments, setShowEnrollments] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState('company');
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      checkOrganizerStatus();
    }
  }, [user?.id]);

  const checkOrganizerStatus = async () => {
    try {
      const organizerProfile = await isUserOrganizer(user!.id);
      if (organizerProfile) {
        setIsOrganizer(true);
        await loadEvents();
      } else {
        setShowSetup(true);
      }
    } catch (error) {
      console.error('Failed to check organizer status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const data = await getOrganizerEvents(user!.id);
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const handleBecomeOrganizer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrganizerProfile({
        user_id: user!.id,
        organization_name: organizationName,
        organization_type: organizationType
      });
      showToast('Organizer profile created successfully!', 'success');
      setIsOrganizer(true);
      setShowSetup(false);
      await loadEvents();
    } catch (error: any) {
      showToast(error.message || 'Failed to create organizer profile', 'error');
    }
  };

  const viewEnrollments = async (event: any) => {
    try {
      setSelectedEvent(event);
      const data = await getEventEnrollments(event.id);
      setEnrollments(data);
      setShowEnrollments(true);
    } catch (error) {
      showToast('Failed to load enrollments', 'error');
    }
  };

  const handleIssueBadge = async (enrollment: any) => {
    if (!selectedEvent?.badge_id) {
      showToast('This event has no badge configured', 'warning');
      return;
    }

    try {
      await issueBadgeToAttendee(enrollment.id, selectedEvent.badge_id, enrollment.user_id);
      showToast(`Badge issued to ${enrollment.user.full_name}!`, 'success');

      setEnrollments(prev => prev.map(e =>
        e.id === enrollment.id ? { ...e, badge_issued: true, status: 'completed' } : e
      ));
    } catch (error: any) {
      showToast(error.message || 'Failed to issue badge', 'error');
    }
  };

  const stats = [
    { label: 'Total Events', value: events.length, icon: Calendar, color: 'from-blue-400 to-cyan-500' },
    { label: 'Total Attendees', value: events.reduce((sum, e) => sum + e.current_attendees, 0), icon: Users, color: 'from-emerald-400 to-teal-500' },
    { label: 'Published', value: events.filter(e => e.status === 'published').length, icon: CheckCircle, color: 'from-purple-400 to-pink-500' },
    { label: 'Upcoming', value: events.filter(e => new Date(e.start_date) > new Date()).length, icon: Clock, color: 'from-orange-400 to-red-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 px-6">
        <div className="max-w-[1800px] mx-auto">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <Link to="/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Events</span>
          </Link>

          <div className="premium-card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Award size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Become an Organizer</h2>
              <p className="text-gray-400">Host events and issue verified badges to attendees</p>
            </div>

            <form onSubmit={handleBecomeOrganizer} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Organization Name</label>
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Your company or organization"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Organization Type</label>
                <select
                  value={organizationType}
                  onChange={(e) => setOrganizationType(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                >
                  <option value="company" className="bg-black">Company</option>
                  <option value="university" className="bg-black">University</option>
                  <option value="nonprofit" className="bg-black">Non-Profit</option>
                  <option value="community" className="bg-black">Community</option>
                  <option value="individual" className="bg-black">Individual</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl font-semibold text-black hover:scale-105 transition-all"
              >
                Create Organizer Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-2xl">
              <Award size={20} className="text-black" />
            </div>
            <span className="font-semibold text-xl">Aurin Organizer</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/events"
              className="px-6 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Browse Events
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6 max-w-[1800px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Organizer Dashboard</h1>
            <p className="text-gray-400">Manage your events and attendees</p>
          </div>
          <Link
            to="/organizer/create-event"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl font-semibold text-black hover:scale-105 transition-all"
          >
            <Plus size={20} />
            <span>Create Event</span>
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="premium-card p-6">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon size={24} className="text-black" />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="premium-card p-8">
          <h2 className="text-2xl font-bold mb-6">Your Events</h2>

          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                          <p className="text-sm text-gray-500 capitalize">{event.category} • {event.event_type}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${
                          event.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          event.status === 'draft' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {event.status}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{new Date(event.start_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={16} />
                          <span>{event.current_attendees} / {event.max_attendees} enrolled</span>
                        </div>
                        {event.badge && (
                          <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCircle size={16} />
                            <span>Badge: {event.badge.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => viewEnrollments(event)}
                          className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all"
                        >
                          View Enrollments ({event.current_attendees})
                        </button>
                        <Link
                          to={`/events/${event.id}`}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-all"
                        >
                          View Event
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar size={48} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-400">No events yet</h3>
              <p className="text-sm text-gray-500 mb-6">Create your first event to get started</p>
              <Link
                to="/organizer/create-event"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-semibold hover:bg-emerald-500/20 transition-all"
              >
                <Plus size={18} />
                <span>Create Event</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showEnrollments}
        onClose={() => setShowEnrollments(false)}
        title={`Enrollments: ${selectedEvent?.title}`}
        size="lg"
      >
        <div className="space-y-4">
          {enrollments.length > 0 ? (
            enrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-black font-bold">
                    {enrollment.user.full_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{enrollment.user.full_name}</div>
                    <div className="text-sm text-gray-500">@{enrollment.user.username}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${
                    enrollment.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    enrollment.status === 'attended' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-gray-500/10 text-gray-400 border-gray-500/20'
                  }`}>
                    {enrollment.status}
                  </div>

                  {selectedEvent?.badge_id && !enrollment.badge_issued && (
                    <button
                      onClick={() => handleIssueBadge(enrollment)}
                      className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all"
                    >
                      Issue Badge
                    </button>
                  )}

                  {enrollment.badge_issued && (
                    <div className="flex items-center gap-2 text-emerald-400 text-sm">
                      <CheckCircle size={16} />
                      <span>Badge Issued</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No enrollments yet
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
