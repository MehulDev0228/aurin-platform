import { CheckCircle, ExternalLink, Globe, Lock, Share2, Sparkles } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Globe,
      title: 'PUBLIC PROFILE',
      description: 'Clean, professional URL: aurin.com/username',
      details: [
        'Stats dashboard with total badges and verifications',
        'Achievement timeline with chronological history',
        'Skills and categories organized beautifully',
        'Activity heatmap like GitHub contributions',
      ],
    },
    {
      icon: Lock,
      title: 'BLOCKCHAIN VERIFIED',
      description: 'Every badge is permanently on-chain',
      details: [
        'Ethereum-based smart contracts',
        'Immutable achievement records',
        'One-click verification for employers',
        'QR code scanning for instant proof',
      ],
    },
    {
      icon: Share2,
      title: 'EASY SHARING',
      description: 'Share your achievements everywhere',
      details: [
        'Direct profile links for LinkedIn, GitHub',
        'Individual badge sharing capability',
        'Export to PDF for traditional resumes',
        'Social media integrations built-in',
      ],
    },
    {
      icon: Sparkles,
      title: 'DISCOVERY',
      description: 'Find and earn new badges',
      details: [
        'Browse badges by category and issuer',
        'See trending achievements in your field',
        'Discover opportunities to earn more',
        'Connect with verified badge issuers',
      ],
    },
  ];

  return (
    <section id="features" className="py-32 px-4 md:px-8 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-6 animate-slide-up">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
            Everything You <span className="gradient-text">Need</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A complete platform to showcase, verify, and share your professional achievements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="premium-card p-10 space-y-6 hover-lift hover-glow smooth-transition"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center border border-emerald-500/20">
                <feature.icon size={32} className="text-emerald-400" />
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-bold tracking-tight capitalize">
                  {feature.title.toLowerCase()}
                </h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>

              <ul className="space-y-3">
                {feature.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <CheckCircle size={18} className="flex-shrink-0 mt-0.5 text-emerald-500" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="premium-button px-10 py-5 font-semibold text-lg text-white inline-flex items-center gap-3">
            Get Started Free
            <ExternalLink size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
