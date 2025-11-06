import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { ExternalLink, CheckCircle, TrendingUp, Users, Award, ArrowRight } from 'lucide-react';

type Badge = Database['public']['Tables']['badges']['Row'] & {
  issuers: Database['public']['Tables']['issuers']['Row'] | null;
};

export default function BadgeShowcase() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadBadges();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const loadBadges = async () => {
    const { data, error } = await supabase
      .from('badges')
      .select('*, issuers(*)')
      .eq('is_active', true)
      .order('total_issued', { ascending: false })
      .limit(8);

    if (data) {
      setBadges(data);
    }
    setLoading(false);
  };

  const categories = ['all', 'skill', 'certification', 'achievement', 'course', 'event'];

  const filteredBadges =
    selectedCategory === 'all'
      ? badges
      : badges.filter((b) => b.category === selectedCategory);

  const getGridClass = (index: number) => {
    const patterns = [
      'col-span-12 md:col-span-8 row-span-2',
      'col-span-12 md:col-span-4 row-span-1',
      'col-span-12 md:col-span-4 row-span-1',
      'col-span-12 md:col-span-4 row-span-2',
      'col-span-12 md:col-span-4 row-span-1',
      'col-span-12 md:col-span-4 row-span-1',
      'col-span-12 md:col-span-6 row-span-1',
      'col-span-12 md:col-span-6 row-span-1',
    ];
    return patterns[index % patterns.length];
  };

  return (
    <section ref={sectionRef} id="explore" className="py-32 px-4 md:px-8 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      <div className="absolute inset-0 grain opacity-40" />

      <div className="max-w-[1400px] mx-auto relative z-10 space-y-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className={`inline-flex items-center gap-2 px-4 py-2 glass-effect rounded-full text-sm border border-emerald-500/20 ${inView ? 'animate-fade-in' : 'opacity-0'}`}>
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-gray-400">Trending Credentials</span>
          </div>

          <h2 className={`text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight ${inView ? 'animate-slide-up' : 'opacity-0'}`}>
            Discover <span className="gradient-text">Verified</span> Badges
          </h2>

          <p className={`text-lg md:text-xl text-gray-400 leading-relaxed ${inView ? 'animate-slide-up delay-100' : 'opacity-0'}`}>
            Browse badges from world-class institutions. Each credential is permanently recorded on the Ethereum blockchain.
          </p>
        </div>

        <div className={`flex flex-wrap justify-center gap-3 ${inView ? 'animate-fade-in delay-200' : 'opacity-0'}`}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 font-semibold text-sm capitalize rounded-2xl smooth-transition ${
                selectedCategory === cat
                  ? 'premium-button text-white'
                  : 'glass-effect border border-white/10 text-gray-400 hover:border-emerald-500/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-12 gap-6 auto-rows-[200px]">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`${getGridClass(i)} premium-card p-6 animate-pulse`}>
                <div className="w-full h-full bg-white/5 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6 auto-rows-[200px]">
            {filteredBadges.map((badge, index) => {
              const isLarge = index === 0 || index === 3;

              return (
                <div
                  key={badge.id}
                  className={`${getGridClass(index)} ${
                    inView ? 'animate-scale-in' : 'opacity-0'
                  } premium-card hover-lift hover-glow smooth-transition group cursor-pointer overflow-hidden`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {isLarge ? (
                    <div className="relative h-full p-8 flex flex-col justify-between">
                      <div className="absolute inset-0 opacity-10">
                        <img
                          src={badge.image_url}
                          alt={badge.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="relative z-10 space-y-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3">
                            <div className="inline-flex px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                              {badge.category}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold leading-tight group-hover:text-emerald-400 smooth-transition">
                              {badge.name}
                            </h3>
                          </div>
                          {badge.issuers?.verified && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                              <CheckCircle size={14} className="text-emerald-400" />
                              <span className="text-xs font-semibold text-emerald-300">Verified</span>
                            </div>
                          )}
                        </div>

                        {badge.issuers && (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                              <Award size={20} className="text-emerald-400" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold">{badge.issuers.name}</div>
                              <div className="text-xs text-gray-500">Issuing Authority</div>
                            </div>
                          </div>
                        )}

                        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                          {badge.description}
                        </p>
                      </div>

                      <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Users size={16} />
                          <span>{badge.total_issued.toLocaleString()} earned</span>
                        </div>
                        <button className="flex items-center gap-2 text-sm font-semibold text-emerald-400 group-hover:text-emerald-300 smooth-transition">
                          View Details
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-full p-6 flex flex-col">
                      <div className="flex-1 space-y-4">
                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500/10 to-teal-500/5">
                          <img
                            src={badge.image_url}
                            alt={badge.name}
                            className="w-full h-full object-cover group-hover:scale-110 smooth-transition"
                          />
                          {badge.issuers?.verified && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500/90 border border-emerald-400 flex items-center justify-center">
                              <CheckCircle size={14} className="text-white" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                            {badge.category}
                          </div>
                          <h3 className="font-bold leading-tight line-clamp-2 group-hover:text-emerald-400 smooth-transition">
                            {badge.name}
                          </h3>
                          {badge.issuers && (
                            <div className="text-xs text-gray-500">
                              {badge.issuers.name}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 flex items-center justify-between text-xs text-gray-500 border-t border-white/5 mt-auto">
                        <span>{badge.total_issued.toLocaleString()}</span>
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 smooth-transition" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center pt-8">
          <button className="premium-button px-12 py-6 font-semibold text-lg text-white inline-flex items-center gap-3 group">
            Explore All Badges
            <ArrowRight size={20} className="group-hover:translate-x-1 smooth-transition" />
          </button>
        </div>
      </div>
    </section>
  );
}
