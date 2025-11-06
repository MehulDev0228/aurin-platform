import { useState, useEffect } from 'react';
import { Award, Search, Calendar, MapPin, Users, Clock, Filter, Sparkles, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllEvents } from '../lib/eventQueries';
import { BadgeCardSkeleton } from '../components/Skeleton';

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchQuery, selectedCategory, selectedType, events]);

  const loadEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let result = events;

    if (selectedCategory !== 'all') {
      result = result.filter(e => e.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      result = result.filter(e => e.event_type === selectedType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query)
      );
    }

    setFilteredEvents(result);
  };

  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'technology', label: 'Technology' },
    { id: 'business', label: 'Business' },
    { id: 'design', label: 'Design' },
    { id: 'data', label: 'Data Science' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'other', label: 'Other' },
  ];

  const types = [
    { id: 'all', label: 'All Types' },
    { id: 'online', label: 'Online' },
    { id: 'in-person', label: 'In Person' },
    { id: 'hybrid', label: 'Hybrid' },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'online': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'in-person': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'hybrid': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-2xl">
              <Award size={20} className="text-black" />
            </div>
            <span className="font-semibold text-xl">Aurin</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/organizer"
              className="px-6 py-2.5 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Become an Organizer
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

      <div className="pt-24 pb-12 px-6 max-w-[1600px] mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-3">
            <span className="block">Discover</span>
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Events & Workshops
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Attend events, earn verified badges, build your professional identity
          </p>
        </div>

        <div className="premium-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by name, location, or description..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-all"
              >
                {types.map(type => (
                  <option key={type.id} value={type.id} className="bg-black">{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all capitalize ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <BadgeCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="premium-card p-0 group cursor-pointer hover-lift overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-xl capitalize ${getEventTypeColor(event.event_type)}`}>
                    {event.event_type}
                  </div>
                  {event.badge && (
                    <div className="absolute bottom-4 right-4 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden">
                      <img src={event.badge.image_url} alt="Badge" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <div className="inline-block px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-gray-400 mb-2 capitalize">
                      {event.category}
                    </div>
                    <h3 className="text-xl font-bold leading-tight group-hover:text-emerald-400 transition-colors mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{event.description}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={16} />
                      <span>{formatDate(event.start_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={16} />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users size={16} />
                      <span>{event.current_attendees} / {event.max_attendees} enrolled</span>
                    </div>
                  </div>

                  {event.badge && (
                    <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                      <Sparkles size={16} className="text-emerald-400" />
                      <span className="text-sm text-emerald-400 font-medium">Earn: {event.badge.name}</span>
                    </div>
                  )}

                  <button className="w-full px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all opacity-0 group-hover:opacity-100">
                    View Details & Enroll
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <Calendar size={40} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-400">No events found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedType('all');
              }}
              className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 font-semibold hover:bg-emerald-500/20 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
