// src/pages/SteveJobsLanding.tsx - Steve Jobs Level Landing Page
// Perfect Storytelling. Simplicity. Elegance.
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Users, Zap, Shield, CheckCircle2, TrendingUp, Award, Sparkles, FileText, Share2 } from "lucide-react";
import SteveJobsNavbar from "../components/SteveJobsNavbar";
import Footer from "../components/Footer";
import SpotlightCard from "../components/aceternity/SpotlightCard";
import SparklesText from "../components/aceternity/SparklesText";
import RippleButton from "../components/aceternity/RippleButton";
import ScrollReveal from "../components/ScrollReveal";

export default function SteveJobsLanding() {
  return (
    <div className="min-h-screen bg-black text-white pt-28">
      <SteveJobsNavbar />

      {/* Hero Section - Premium SaaS-Level Animations */}
      <section className="relative overflow-hidden pt-20 pb-40">
        {/* Animated background gradients with premium effects */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.03] via-transparent to-purple-500/[0.03]"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.06),transparent_50%)]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.06),transparent_50%)]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Animated mesh gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(at 20% 30%, rgba(16, 185, 129, 0.1) 0px, transparent 50%),
              radial-gradient(at 80% 70%, rgba(20, 184, 166, 0.1) 0px, transparent 50%),
              radial-gradient(at 50% 50%, rgba(16, 185, 129, 0.05) 0px, transparent 50%)
            `,
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
        />
        
        {/* Floating particles effect */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-emerald-400/20 blur-sm"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="relative max-w-[1600px] mx-auto px-8">
          <ScrollReveal direction="fade" delay={0.2}>
            <div className="text-center max-w-5xl mx-auto">
              {/* Badge - Premium with animations */}
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/20 mb-12 backdrop-blur-sm relative overflow-hidden group"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                {/* Animated glow */}
                <motion.div
                  className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 blur-xl"
                  transition={{ duration: 0.3 }}
                />
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={18} className="text-emerald-400 relative z-10" strokeWidth={2} />
                </motion.div>
                <span className="text-[14px] font-medium text-emerald-400 tracking-[-0.01em] relative z-10">Your achievements, verified forever</span>
              </motion.div>

              {/* Main Headline - Storytelling */}
              <motion.h1
                className="text-7xl md:text-8xl lg:text-9xl font-black leading-[1.05] tracking-[-0.03em] mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="bg-gradient-to-r from-white via-emerald-50 to-white bg-clip-text text-transparent">
                  Build Your
                </span>
                <br />
                <SparklesText className="text-7xl md:text-8xl lg:text-9xl">
                  Digital Legacy
                </SparklesText>
              </motion.h1>

              <motion.p
                className="text-2xl md:text-3xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed tracking-[-0.01em]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                Earn verifiable badges, showcase achievements, and let your work speak for itself.
                <span className="block mt-4 text-xl text-gray-400">
                  Powered by blockchain. Built for creators.
                </span>
              </motion.p>

              {/* CTA Buttons - Premium with advanced animations */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to="/signup">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                  >
                    <RippleButton className="relative px-12 py-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-[17px] tracking-[-0.01em] shadow-[0_0_40px_rgba(16,185,129,0.4)] overflow-hidden group">
                      {/* Animated gradient overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-emerald-300 via-teal-400 to-emerald-400"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      {/* Pulsing glow */}
                      <motion.div
                        className="absolute inset-0 bg-emerald-400/50 rounded-2xl blur-2xl"
                        animate={{
                          opacity: [0.4, 0.6, 0.4],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="relative z-10 flex items-center gap-3">
                        Start Building
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight size={22} strokeWidth={2.5} />
                        </motion.div>
                      </span>
                    </RippleButton>
                  </motion.div>
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to="/explore"
                    className="relative px-12 py-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500 font-semibold text-[17px] tracking-[-0.01em] flex items-center gap-3 overflow-hidden group"
                  >
                    {/* Hover shimmer */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10">Explore Badges</span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Social Proof Stats - Premium with stagger animations */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                {[
                  { value: "50K+", label: "Badges Earned", icon: Trophy, delay: 0 },
                  { value: "12K+", label: "Active Users", icon: Users, delay: 0.1 },
                  { value: "1.2K", label: "Organizations", icon: Shield, delay: 0.2 },
                  { value: "180+", label: "Countries", icon: TrendingUp, delay: 0.3 },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.9 + stat.delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <StatCard value={stat.value} label={stat.label} icon={stat.icon} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features - Storytelling */}
      <section className="relative py-32 border-t border-white/[0.03]">
        <div className="max-w-[1600px] mx-auto px-8">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-[-0.02em]">
                Everything you need to <span className="text-emerald-400">showcase</span> your achievements
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed tracking-[-0.01em]">
                From event badges to blockchain verification, we've got you covered.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "Blockchain Verified",
                description: "Every badge is minted on-chain, giving you permanent proof of achievement.",
                gradient: "from-emerald-500/[0.08] to-teal-500/[0.04]",
                delay: 0.2
              },
              {
                icon: Zap,
                title: "Instant Recognition",
                description: "Get badges immediately after completing events. No waiting, no hassle.",
                gradient: "from-purple-500/[0.08] to-pink-500/[0.04]",
                delay: 0.3
              },
              {
                icon: Shield,
                title: "Trusted by Organizations",
                description: "Used by universities, companies, and event organizers worldwide.",
                gradient: "from-blue-500/[0.08] to-cyan-500/[0.04]",
                delay: 0.4
              },
            ].map((feature, i) => (
              <ScrollReveal key={i} direction="up" delay={feature.delay}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  gradient={feature.gradient}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase - Live Badge Example */}
      <section className="relative py-32 border-t border-white/[0.03]">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-[-0.02em]">
              See it in <span className="text-emerald-400">action</span>
            </h2>
            <p className="text-xl text-gray-400 tracking-[-0.01em]">
              Real badges from real achievements
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <SpotlightCard className="p-12 md:p-16 rounded-[32px] border border-emerald-500/10 bg-gradient-to-br from-emerald-500/[0.06] via-transparent to-purple-500/[0.06]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[13px] font-semibold text-emerald-400 tracking-[0.1em] uppercase">Live Badge</span>
                </div>
                <div className="px-5 py-2 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-[13px] font-medium tracking-[-0.01em]">Verified on-chain</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-8 mx-auto md:mx-0 shadow-[0_0_60px_rgba(16,185,129,0.4)]">
                    <Trophy size={80} className="text-black" strokeWidth={2} />
                  </div>
                </div>
                <div>
                  <h3 className="text-4xl font-black mb-4 tracking-[-0.02em]">React Development Mastery</h3>
                  <p className="text-lg text-gray-300 mb-8 leading-relaxed tracking-[-0.01em]">
                    Issued by <span className="font-semibold text-white">Atra Engineering</span> for completing the advanced React course.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { value: "15.2K", label: "Holders" },
                      { value: "96%", label: "Completion" },
                      { value: "4.9", label: "Rating" },
                    ].map((stat, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-black/40 border border-white/10 text-center">
                        <div className="text-3xl font-black mb-2 tracking-[-0.02em] text-emerald-400">{stat.value}</div>
                        <div className="text-[12px] text-gray-400 tracking-[-0.01em] uppercase">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-[14px] text-gray-400 tracking-[-0.01em]">
                    <CheckCircle2 size={18} className="text-emerald-400" strokeWidth={2} />
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

      {/* Unique Features - What No Platform Has */}
      <section className="relative py-32 border-t border-white/[0.03]">
        <div className="max-w-[1600px] mx-auto px-8">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center mb-20">
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-purple-500/[0.08] border border-purple-500/20 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Sparkles size={18} className="text-purple-400" strokeWidth={2} />
                <span className="text-[14px] font-medium text-purple-400 tracking-[-0.01em]">Features no platform has</span>
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-[-0.02em]">
                Why <span className="text-emerald-400">AURIN</span> is different
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed tracking-[-0.01em]">
                We don't just store achievements. We help you showcase them professionally.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
            <ScrollReveal direction="up" delay={0.2}>
              <div className="p-10 rounded-3xl bg-gradient-to-br from-purple-500/[0.08] to-pink-500/[0.04] border border-purple-500/10 hover:border-purple-500/20 transition-all duration-500">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mb-6">
                  <FileText size={40} className="text-black" strokeWidth={2} />
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-[-0.02em]">Resume Line Generator</h3>
                <p className="text-[15px] text-gray-300 leading-relaxed tracking-[-0.01em] mb-6">
                  <strong className="text-white">No platform has this!</strong> Generate professional resume lines from your achievements. 
                  Copy and paste directly into your resume, LinkedIn, or cover letter. 
                  <span className="block mt-2 text-emerald-400">"Add this 4th line in your resume"</span>
                </p>
                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-xs text-purple-400 mb-2 font-medium">Example Output</div>
                  <div className="text-[14px] text-gray-300 italic leading-relaxed">
                    "Earned 5 verified badges in Technology, Leadership on AURIN, demonstrating commitment to professional development..."
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <div className="p-10 rounded-3xl bg-gradient-to-br from-emerald-500/[0.08] to-teal-500/[0.04] border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-500">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6">
                  <Share2 size={40} className="text-black" strokeWidth={2} />
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-[-0.02em]">Public Profile Link</h3>
                <p className="text-[15px] text-gray-300 leading-relaxed tracking-[-0.01em] mb-6">
                  Get a shareable link to your verified achievements. Perfect for resumes, LinkedIn, portfolios, and job applications.
                </p>
                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <div className="text-xs text-emerald-400 mb-2 font-medium">Your Profile URL</div>
                  <div className="text-[14px] text-gray-300 font-mono">
                    aurin.com/profile/yourname
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How It Works - Simple Steps */}
      <section className="relative py-32 border-t border-white/[0.03]">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-[-0.02em]">
              How it <span className="text-emerald-400">works</span>
            </h2>
            <p className="text-xl text-gray-400 tracking-[-0.01em]">
              Get started in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { step: "1", title: "Sign Up", desc: "Create your account in seconds", icon: Users },
              { step: "2", title: "Join Events", desc: "Enroll in events and complete tasks", icon: Zap },
              { step: "3", title: "Earn Badges", desc: "Get verified badges on the blockchain", icon: Trophy },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="absolute -top-6 -left-6 w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-black font-black text-2xl tracking-[-0.02em] z-10 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  {item.step}
                </div>
                <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/20 transition-all duration-500 h-full">
                  <item.icon size={40} className="text-emerald-400 mb-6" strokeWidth={2} />
                  <h3 className="text-3xl font-black mb-3 tracking-[-0.02em]">{item.title}</h3>
                  <p className="text-[15px] text-gray-400 leading-relaxed tracking-[-0.01em]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Final Storytelling */}
      <section className="relative py-40 border-t border-white/[0.03]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.06] via-transparent to-purple-500/[0.06]" />
        <div className="relative max-w-5xl mx-auto px-8 text-center">
          <motion.h2
            className="text-6xl md:text-7xl font-black mb-8 tracking-[-0.03em]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Ready to build your <span className="text-emerald-400">digital legacy</span>?
          </motion.h2>
          <motion.p
            className="text-2xl text-gray-300 mb-12 tracking-[-0.01em] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Join thousands of creators showcasing their achievements on AURIN.
          </motion.p>
          <Link to="/signup">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <RippleButton className="px-14 py-7 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-black text-[18px] tracking-[-0.01em] shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_rgba(16,185,129,0.7)] transition-all duration-500 inline-flex items-center gap-3">
                Get Started Free
                <ArrowRight size={26} strokeWidth={2.5} />
              </RippleButton>
            </motion.div>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatCard({ value, label, icon: Icon }: { value: string; label: string; icon: any }) {
  return (
    <motion.div
      className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/20 transition-all duration-500 overflow-hidden group"
      whileHover={{ scale: 1.05, y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Animated background on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
      />
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.8 }}
      />
      {/* Icon with rotation */}
      <motion.div
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        <Icon size={28} className="text-emerald-400 mb-4 relative z-10" strokeWidth={2} />
      </motion.div>
      {/* Value with counter animation */}
      <motion.div
        className="text-4xl font-black mb-2 tracking-[-0.02em] relative z-10 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        {value}
      </motion.div>
      <div className="text-[13px] text-gray-400 tracking-[-0.01em] uppercase font-medium relative z-10">{label}</div>
    </motion.div>
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
    <motion.div
      className={`relative p-10 rounded-3xl bg-gradient-to-br ${gradient} border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden group`}
      whileHover={{ scale: 1.05, y: -8, rotateY: 5 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Animated glow on hover */}
      <motion.div
        className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 blur-2xl"
        transition={{ duration: 0.3 }}
      />
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.8 }}
      />
      
      <motion.div
        className="w-20 h-20 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-8 relative z-10 group-hover:bg-white/[0.1] transition-colors"
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        <Icon size={40} className="text-emerald-400" strokeWidth={2} />
      </motion.div>
      <h3 className="text-3xl font-black mb-4 tracking-[-0.02em] relative z-10">{title}</h3>
      <p className="text-[15px] text-gray-300 leading-relaxed tracking-[-0.01em] relative z-10">{description}</p>
    </motion.div>
  );
}

