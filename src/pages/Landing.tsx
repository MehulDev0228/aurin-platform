// src/pages/Landing.tsx
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Trophy, Users, Zap, Shield, CheckCircle2, TrendingUp, Award } from "lucide-react";
import SteveJobsNavbar from "../components/SteveJobsNavbar";
import Footer from "../components/Footer";
import SpotlightCard from "../components/aceternity/SpotlightCard";
import SparklesText from "../components/aceternity/SparklesText";
import RippleButton from "../components/aceternity/RippleButton";
import ScrollReveal from "../components/ScrollReveal";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <SteveJobsNavbar />

      {/* HERO SECTION - Modern, Bold, Visual */}
      <section className="relative overflow-hidden pt-12 pb-32">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-purple-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-6">
          <ScrollReveal direction="fade" delay={0.2}>
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-8">
                <Sparkles size={16} className="text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Your achievements, verified forever</span>
              </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] tracking-tight mb-6">
              <span className="bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent">
                Build Your
              </span>
              <br />
              <SparklesText className="text-6xl md:text-7xl lg:text-8xl">
                Digital Legacy
              </SparklesText>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Earn verifiable badges, showcase achievements, and let your work speak for itself.
              <span className="block mt-2 text-lg text-gray-400">
                Powered by blockchain. Built for creators.
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/signup">
                <RippleButton className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-lg shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:scale-105 flex items-center gap-2">
                  Start Building
                  <ArrowRight size={20} />
                </RippleButton>
              </Link>
              <Link
                to="/explore"
                className="px-8 py-4 rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all font-semibold text-lg flex items-center gap-2"
              >
                Explore Badges
              </Link>
            </div>

              {/* Social Proof Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                <StatCard value="50K+" label="Badges Earned" icon={Trophy} />
                <StatCard value="12K+" label="Active Users" icon={Users} />
                <StatCard value="1.2K" label="Organizations" icon={Shield} />
                <StatCard value="180+" label="Countries" icon={TrendingUp} />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FEATURES - Visual Cards */}
      <section className="relative py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Everything you need to <span className="text-emerald-400">showcase</span> your achievements
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                From event badges to blockchain verification, we've got you covered.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal direction="up" delay={0.2}>
              <FeatureCard
                icon={Award}
                title="Blockchain Verified"
                description="Every badge is minted on-chain, giving you permanent proof of achievement."
                gradient="from-emerald-500/20 to-teal-500/10"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3}>
              <FeatureCard
                icon={Zap}
                title="Instant Recognition"
                description="Get badges immediately after completing events. No waiting, no hassle."
                gradient="from-purple-500/20 to-pink-500/10"
              />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.4}>
              <FeatureCard
                icon={Shield}
                title="Trusted by Organizations"
                description="Used by universities, companies, and event organizers worldwide."
                gradient="from-blue-500/20 to-cyan-500/10"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SHOWCASE - Live Badge Example */}
      <section className="relative py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              See it in <span className="text-emerald-400">action</span>
            </h2>
            <p className="text-xl text-gray-400">
              Real badges from real achievements
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <SpotlightCard className="p-8 md:p-12 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-semibold text-emerald-400">LIVE BADGE</span>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
                  <span className="text-sm font-medium">Verified on-chain</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6 mx-auto md:mx-0">
                    <Trophy size={64} className="text-black" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-3">React Development Mastery</h3>
                  <p className="text-gray-300 mb-6">
                    Issued by <span className="font-semibold text-white">Atra Engineering</span> for completing the advanced React course.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                      <div className="text-2xl font-bold text-emerald-400">15.2K</div>
                      <div className="text-xs text-gray-400 mt-1">Holders</div>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                      <div className="text-2xl font-bold text-emerald-400">96%</div>
                      <div className="text-xs text-gray-400 mt-1">Completion</div>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                      <div className="text-2xl font-bold text-emerald-400">4.9</div>
                      <div className="text-xs text-gray-400 mt-1">Rating</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    <span>Blockchain verified</span>
                    <span className="mx-2">•</span>
                    <span>Token: 0x27f9...4d8c</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - Simple Steps */}
      <section className="relative py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How it <span className="text-emerald-400">works</span>
            </h2>
            <p className="text-xl text-gray-400">
              Get started in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Sign Up", desc: "Create your account in seconds", icon: Users },
              { step: "2", title: "Join Events", desc: "Enroll in events and complete tasks", icon: Zap },
              { step: "3", title: "Earn Badges", desc: "Get verified badges on the blockchain", icon: Trophy },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-black font-bold text-xl z-10">
                  {item.step}
                </div>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all h-full">
                  <item.icon size={32} className="text-emerald-400 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-32 border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to build your <span className="text-emerald-400">digital legacy</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of creators showcasing their achievements on AURIN.
          </p>
          <Link to="/signup">
            <RippleButton className="px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:scale-105 inline-flex items-center gap-3">
              Get Started Free
              <ArrowRight size={24} />
            </RippleButton>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatCard({ value, label, icon: Icon }: { value: string; label: string; icon: any }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all">
      <Icon size={24} className="text-emerald-400 mb-3" />
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  gradient 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  gradient: string;
}) {
  return (
    <div className={`p-8 rounded-2xl bg-gradient-to-br ${gradient} border border-white/10 hover:border-white/20 transition-all`}>
      <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center mb-6">
        <Icon size={32} className="text-emerald-400" />
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}
