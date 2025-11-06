import { ArrowRight, Sparkles, Shield, Zap, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  const parallax = scrollY * 0.5;

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)]" />
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle 1200px at ${mousePos.x}% ${mousePos.y}%, rgba(16,185,129,0.12), transparent 60%)`,
          }}
        />
      </div>

      <div className="absolute inset-0 grain opacity-20" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />

      <div
        className="relative max-w-[1600px] mx-auto px-6 md:px-8 pt-40 pb-24"
        style={{ transform: `translateY(-${parallax}px)` }}
      >
        <div className="text-center max-w-5xl mx-auto space-y-8 mb-20">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm font-medium text-gray-300 animate-fade-in">
            <Sparkles size={16} className="text-emerald-400" />
            <span>Blockchain-verified credentials platform</span>
          </div>

          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.95] animate-slide-up">
            <span className="block text-white">Credentials</span>
            <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              that last forever
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto animate-slide-up delay-100">
            Build an immutable professional identity with blockchain-verified badges.
            <br className="hidden md:block" />
            <span className="text-gray-300">Permanent. Verifiable. Yours.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-slide-up delay-200">
            <Link
              to="/signup"
              className="group relative overflow-hidden px-10 py-5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl font-semibold text-lg text-black shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 hover:scale-105 transition-all duration-500 flex items-center gap-3"
            >
              <span>Start building free</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl font-semibold text-lg text-white hover:bg-white/10 hover:border-white/20 transition-all duration-500">
              Watch demo
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-gray-500 animate-fade-in delay-300">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-emerald-400" />
              <span>Blockchain secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-emerald-400" />
              <span>Instant verification</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={18} className="text-emerald-400" />
              <span>Globally recognized</span>
            </div>
          </div>
        </div>

        <div className="relative max-w-[1400px] mx-auto animate-fade-in delay-400">
          <div className="absolute -inset-40 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-[4rem] blur-[100px] opacity-50" />

          <div className="relative grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="premium-card p-10 group cursor-pointer hover-lift">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative space-y-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-2xl shadow-emerald-500/50 flex items-center justify-center text-4xl">
                        🎓
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold mb-2">React Development Mastery</h3>
                        <p className="text-gray-500 flex items-center gap-2">
                          <span>Issued by Meta Engineering</span>
                          <span className="w-1 h-1 rounded-full bg-gray-600" />
                          <span className="text-emerald-400 font-medium">Verified</span>
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-sm font-semibold text-emerald-400">Live</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {['React 18', 'Hooks', 'State Management', 'Performance', 'Testing', 'TypeScript'].map((skill) => (
                      <span key={skill} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="text-3xl font-bold text-emerald-400">15.2K</div>
                      <div className="text-sm text-gray-500 mt-1">Badge holders</div>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="text-3xl font-bold text-emerald-400">96%</div>
                      <div className="text-sm text-gray-500 mt-1">Completion rate</div>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="text-3xl font-bold text-emerald-400">4.9</div>
                      <div className="text-sm text-gray-500 mt-1">Average rating</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="text-sm text-gray-500">
                      Token: <span className="font-mono text-gray-400">0x7f9a...4d3c</span>
                    </div>
                    <button className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all duration-300 flex items-center gap-2">
                      View on chain
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              {[
                {
                  icon: '🏆',
                  title: 'Stanford ML',
                  count: '8.4K',
                  gradient: 'from-red-500/20 to-orange-500/20'
                },
                {
                  icon: '💻',
                  title: 'AWS Certified',
                  count: '12.1K',
                  gradient: 'from-orange-500/20 to-yellow-500/20'
                },
                {
                  icon: '🎨',
                  title: 'Figma Expert',
                  count: '6.8K',
                  gradient: 'from-purple-500/20 to-pink-500/20'
                },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="premium-card p-6 group cursor-pointer hover-lift"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${badge.gradient} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{badge.icon}</div>
                      <div>
                        <div className="font-bold text-lg">{badge.title}</div>
                        <div className="text-sm text-gray-500">{badge.count} holders</div>
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-gray-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24 animate-fade-in delay-500">
          {[
            { value: '50K+', label: 'Verified badges' },
            { value: '1,200+', label: 'Partner institutions' },
            { value: '180+', label: 'Countries' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3">
                {stat.value}
              </div>
              <div className="text-lg text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
