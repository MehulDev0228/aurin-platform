// src/pages/Events.tsx - Enhanced Events page with search and filters
import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Users, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllEvents } from '../lib/eventQueries';
import { useToast } from '../components/ui/use-toast';
import { logger } from '../lib/logger';
import { parseError, retryWithBackoff } from '../lib/errorHandler';
import { ListSkeleton } from '../components/LoadingSkeleton';
import SteveJobsNavbar from '../components/SteveJobsNavbar';
import Button from '../components/Button';

const PAGE_SIZE = 12;

export default function Events() {
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ['all', 'workshop', 'conference', 'hackathon', 'webinar', 'meetup', 'course'];
  const eventTypes = ['all', 'online', 'in-person', 'hybrid'];

  useEffect(() => {
    loadEvents();
  }, [selectedCategory, selectedType, searchQuery]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await retryWithBackoff(async () => {
        return await getAllEvents({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          eventType: selectedType !== 'all' ? selectedType : undefined,
          search: searchQuery || undefined,
        });
      });
      setEvents(data || []);
    } catch (err: any) {
      const errorInfo = parseError(err);
      logger.error('Failed to load events', { error: err, context: 'Events', category: selectedCategory, type: selectedType, search: searchQuery });
      setError(errorInfo.message);
      toast({
        title: 'Error',
        description: errorInfo.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return events.slice(start, end);
  }, [events, currentPage]);

  const totalPages = Math.ceil(events.length / PAGE_SIZE);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadEvents();
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28">
      <SteveJobsNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Discover Events</h1>
          <p className="text-gray-400">Find events and earn verified badges</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                aria-label="Search events"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
              />
            </div>
            <Button type="submit" variant="primary" aria-label="Search events">
              Search
            </Button>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <span className="text-sm text-gray-400">Category:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                aria-label={`Filter by ${cat} category`}
                aria-pressed={selectedCategory === cat}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="text-sm text-gray-400">Type:</span>
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setCurrentPage(1);
                }}
                aria-label={`Filter by ${type} type`}
                aria-pressed={selectedType === type}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedType === type
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <ListSkeleton count={6} />
        ) : paginatedEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/[0.02] border border-white/10 mb-6">
              <Calendar size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">No events found</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Try adjusting your filters or search query to find more events</p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedType('all');
                setCurrentPage(1);
                loadEvents();
              }} 
              variant="secondary"
              aria-label="Clear all filters"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105"
                >
                  {event.image_url && (
                    <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{event.description}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar size={16} />
                        <span>
                          {new Date(event.start_date || event.start_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin size={16} />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}

                      {event.current_attendees !== undefined && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Users size={16} />
                          <span>{event.current_attendees} enrolled</span>
                        </div>
                      )}

                      {event.badge && (
                        <div className="flex items-center gap-2 text-sm text-emerald-400">
                          <Award size={16} />
                          <span>Badge: {event.badge.name}</span>
                        </div>
                      )}
                    </div>

                    {event.category && (
                      <div className="pt-2">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {event.category}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Go to previous page"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                  Previous
                </Button>
                <span className="text-sm text-gray-400 px-4" aria-label={`Page ${currentPage} of ${totalPages}`}>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Go to next page"
                >
                  Next
                  <ChevronRight size={18} aria-hidden="true" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
