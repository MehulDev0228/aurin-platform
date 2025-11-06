import { useState, useEffect } from 'react';
import { Award, Search, Filter, TrendingUp, Users, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllBadges } from '../lib/queries';
import { BadgeCardSkeleton } from '../components/Skeleton';

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState<any[]>([]);
  const [filteredBadges, setFilteredBadges] = useState<any[]>([]);

  useEffect(() => {
    loadBadges();
  }, []);

  useEffect(() => {
    filterBadges();
  }, [searchQuery, selectedCategory, badges]);

  const loadBadges = async () => {
    try {
      const data = await getAllBadges();
      setBadges(data);
    } catch (error) {
      console.error('Failed to load badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBadges = () => {
    let result = badges;

    if (selectedCategory !== 'all') {
      result = result.filter(b => b.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.name.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.issuers.name.toLowerCase().includes(query)
      );
    }

    setFilteredBadges(result);
  };

  const getCategoryCounts = () => {
    return {
      all: badges.length,
      skill: badges.filter(b => b.category === 'skill').length,
      certification: badges.filter(b => b.category === 'certification').length,
      achievement: badges.filter(b => b.category === 'achievement').length,
      course: badges.filter(b => b.category === 'course').length,
      event: badges.filter(b => b.category === 'event').length,
    };
  };

  const counts = getCategoryCounts();
  const categories = [
    { id: 'all', label: 'All Badges', count: counts.all },
    { id: 'skill', label: 'Skills', count: counts.skill },
    { id: 'certification', label: 'Certifications', count: counts.certification },
    { id: 'achievement', label: 'Achievements', count: counts.achievement },
    { id: 'course', label: 'Courses', count: counts.course },
    { id: 'event', label: 'Events', count: counts.event },
  ];

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

          <Link
            to="/dashboard"
            className="px-6 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6 max-w-[1600px] mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-3">
            <span className="block">Explore</span>
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Verified Credentials
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Discover and earn badges from world-class institutions
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
                placeholder="Search badges, issuers, skills..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
              />
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <Filter size={20} />
                <span className="hidden md:inline">Filters</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
              <span className="ml-2 text-xs opacity-60">({cat.count})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <BadgeCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredBadges.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBadges.map((badge) => (
              <div
                key={badge.id}
                className="premium-card p-6 group cursor-pointer hover-lift"
              >
                <div className="relative mb-6">
                  <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                    <img src={badge.image_url} alt={badge.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-emerald-500/90 backdrop-blur-xl flex items-center justify-center">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="inline-block px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-gray-400 mb-2 capitalize">
                      {badge.category}
                    </div>
                    <h3 className="text-lg font-bold leading-tight group-hover:text-emerald-400 transition-colors">
                      {badge.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{badge.issuers.name}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users size={14} />
                      <span>{badge.total_issued.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <Star size={14} className="fill-emerald-400" />
                      <span className="text-sm font-semibold">4.8</span>
                    </div>
                  </div>

                  <button className="w-full px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all opacity-0 group-hover:opacity-100">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <Search size={40} className="text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-400">No badges found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
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
