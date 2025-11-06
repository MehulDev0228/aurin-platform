import { UserPlus, Award, Share2, TrendingUp } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: 'Create Your Profile',
      description: 'Sign up in seconds. Get your unique aurin.com/username URL instantly.',
      visual: '01'
    },
    {
      icon: Award,
      title: 'Earn Verified Badges',
      description: 'Complete courses, attend events, or get endorsed. Each achievement is blockchain-verified.',
      visual: '02'
    },
    {
      icon: Share2,
      title: 'Share Everywhere',
      description: 'Add your Aurin profile to LinkedIn, GitHub, and resumes. One link, infinite proof.',
      visual: '03'
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Career',
      description: 'Get discovered by employers. Unlock opportunities based on your verified skills.',
      visual: '04'
    }
  ];

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="absolute inset-0 grain opacity-10" />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="block text-white">Get started in</span>
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              four simple steps
            </span>
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed">
            Join 50,000+ professionals building their permanent digital identity
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="premium-card p-8 group cursor-pointer hover-lift"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute top-8 right-8 text-8xl font-bold text-white/5 group-hover:text-emerald-500/10 transition-colors duration-500">
                {step.visual}
              </div>

              <div className="relative space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/50 group-hover:scale-110 transition-transform duration-500">
                  <step.icon size={28} className="text-black" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button className="px-12 py-6 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl font-semibold text-lg text-black shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 hover:scale-105 transition-all duration-500">
            Start building your profile
          </button>
          <p className="mt-6 text-sm text-gray-500">
            No credit card required • Free forever • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
