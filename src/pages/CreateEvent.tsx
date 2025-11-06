import { useState, useEffect } from 'react';
import { Award, Calendar, MapPin, Users, Image as ImageIcon, ArrowLeft, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createEvent } from '../lib/eventQueries';
import { getAllBadges } from '../lib/queries';
import { useToast } from '../components/Toast';

export default function CreateEvent() {
  const [loading, setLoading] = useState(false);
  const [badges, setBadges] = useState<any[]>([]);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technology',
    location: '',
    event_type: 'online',
    start_date: '',
    end_date: '',
    max_attendees: 100,
    badge_id: '',
    image_url: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
  });

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      const data = await getAllBadges();
      setBadges(data);
    } catch (error) {
      console.error('Failed to load badges:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.start_date || !formData.end_date) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      showToast('End date must be after start date', 'error');
      return;
    }

    setLoading(true);
    try {
      const eventData = {
        ...formData,
        organizer_id: user!.id,
        badge_id: formData.badge_id || null,
        status: 'published',
      };

      await createEvent(eventData);

      showToast('Event created successfully!', 'success');
      setTimeout(() => {
        navigate('/organizer');
      }, 1000);
    } catch (error: any) {
      showToast(error.message || 'Failed to create event', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const eventImages = [
    'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=800',
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/organizer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New Event</h1>
          <p className="text-gray-400">Host an event and issue verified badges to attendees</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="premium-card p-8">
            <h2 className="text-2xl font-bold mb-6">Event Details</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Advanced React Workshop"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what attendees will learn and experience..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  >
                    <option value="technology" className="bg-black">Technology</option>
                    <option value="business" className="bg-black">Business</option>
                    <option value="design" className="bg-black">Design</option>
                    <option value="data" className="bg-black">Data Science</option>
                    <option value="marketing" className="bg-black">Marketing</option>
                    <option value="other" className="bg-black">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Event Type *</label>
                  <select
                    name="event_type"
                    value={formData.event_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  >
                    <option value="online" className="bg-black">Online</option>
                    <option value="in-person" className="bg-black">In Person</option>
                    <option value="hybrid" className="bg-black">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <div className="relative">
                  <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Zoom, San Francisco, CA"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="premium-card p-8">
            <h2 className="text-2xl font-bold mb-6">Schedule</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date & Time *</label>
                <input
                  type="datetime-local"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Date & Time *</label>
                <input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="premium-card p-8">
            <h2 className="text-2xl font-bold mb-6">Capacity & Badge</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Maximum Attendees *</label>
                <input
                  type="number"
                  name="max_attendees"
                  value={formData.max_attendees}
                  onChange={handleChange}
                  min="1"
                  max="10000"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Badge Reward (Optional)</label>
                <select
                  name="badge_id"
                  value={formData.badge_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                >
                  <option value="" className="bg-black">No badge (just attendance)</option>
                  {badges.map(badge => (
                    <option key={badge.id} value={badge.id} className="bg-black">
                      {badge.name} ({badge.category})
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  Attendees who complete the event will receive this badge as an NFT
                </p>
              </div>
            </div>
          </div>

          <div className="premium-card p-8">
            <h2 className="text-2xl font-bold mb-6">Event Image</h2>

            <div className="grid grid-cols-3 gap-4">
              {eventImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image_url: img }))}
                  className={`aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                    formData.image_url === img
                      ? 'border-emerald-500 scale-105'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img src={img} alt={`Option ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Or paste custom image URL</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl font-semibold text-lg text-black hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>

            <Link
              to="/organizer"
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
