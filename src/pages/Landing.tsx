// src/pages/Landing.tsx
import ThemeShell from "../components/ThemeShell";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Features from "../components/Features";
import BadgeShowcase from "../components/BadgeShowcase";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import { Link } from "react-router-dom";
import SpotlightCard from "../components/aceternity/SpotlightCard";

export default function Landing() {
  return (
    <ThemeShell>
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
                Verifiable badges for
                <br className="hidden md:block" /> real achievements
              </h1>
              <p className="mt-5 text-gray-300 text-lg max-w-xl">
                Create events, award digital badges, and let participants showcase proof —
                on-chain optional, built for performance and trust.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  className="px-6 py-3 rounded-xl bg-white text-black font-semibold shadow hover:opacity-95 transition"
                >
                  Get started
                </Link>
                <Link
                  to="/explore"
                  className="px-6 py-3 rounded-xl border border-zinc-700 hover:bg-white/5 transition"
                >
                  Explore badges
                </Link>
              </div>

              {/* topline metrics */}
              <div className="mt-8 grid grid-cols-3 gap-6">
                <TopStat value="50K+" label="Verified badges" />
                <TopStat value="1,200+" label="Partner institutions" />
                <TopStat value="180+" label="Countries" />
              </div>
            </div>

            {/* Hero badge card */}
            <SpotlightCard className="p-6 rounded-[28px] border border-zinc-800 bg-zinc-950/60">
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-300">Live</span>
                <span className="text-sm text-gray-400">AURIN Badge</span>
              </div>
              <h3 className="mt-3 text-2xl md:text-3xl font-semibold">React Development Mastery</h3>
              <p className="mt-2 text-gray-300 text-sm">Issued by Atra Engineering • Verified</p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <MiniStat value="15.2K" label="Badge holders" />
                <MiniStat value="96%" label="Completion rate" />
                <MiniStat value="4.9" label="Average rating" />
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
                <span>Token: 0x27f9...4d8c</span>
                <a href="#" onClick={(e)=>e.preventDefault()} className="underline decoration-emerald-400/60 underline-offset-4 hover:text-white">
                  View on chain
                </a>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* TRUST BAR (transparent, no color band) */}
      <section className="border-t border-zinc-900/60">
        <div className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Trust value="100%" label="Blockchain Verified" sub="Every on-chain badge" />
          <Trust value="<$0.01" label="Cost Per Badge" sub="At Base L2 scale" />
          <Trust value="Base L2" label="Network" sub="Fast & secure" />
          <Trust value="∞" label="Years Permanent" sub="Forever (on-chain)" />
        </div>
      </section>

      <Features />
      <BadgeShowcase />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Footer />
    </ThemeShell>
  );
}

function TopStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-gray-400 text-sm mt-1">{label}</div>
    </div>
  );
}
function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-black/30 border border-zinc-800 p-4">
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-gray-400 text-xs mt-1">{label}</div>
    </div>
  );
}
function Trust({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="text-center sm:text-left">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-gray-300 mt-1">{label}</div>
      {sub && <div className="text-gray-500 text-sm">{sub}</div>}
    </div>
  );
}
