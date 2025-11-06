import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Alex M.',
      role: 'Software Engineer',
      company: 'Tech Startup',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
      content: 'Blockchain verification gives me confidence that my credentials are permanent and tamper-proof.',
      badges: 5,
      rating: 5
    },
    {
      name: 'Jordan K.',
      role: 'Full Stack Developer',
      company: 'Early Adopter',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
      content: 'Love the idea of owning my credentials forever. No platform can take them away from me.',
      badges: 3,
      rating: 5
    },
    {
      name: 'Sam R.',
      role: 'Product Designer',
      company: 'Beta User',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
      content: 'Clean interface and the blockchain verification is a game-changer for professional credentialing.',
      badges: 4,
      rating: 5
    },
    {
      name: 'Taylor D.',
      role: 'Data Scientist',
      company: 'Early Adopter',
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200',
      content: 'Excited to be part of this new way of credentialing. The future is decentralized.',
      badges: 2,
      rating: 5
    },
    {
      name: 'Morgan P.',
      role: 'DevOps Engineer',
      company: 'Beta Tester',
      image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200',
      content: 'Simple, clean, and the blockchain aspect makes it trustworthy. Excited to see where this goes.',
      badges: 6,
      rating: 5
    },
    {
      name: 'Casey L.',
      role: 'Security Engineer',
      company: 'Early Adopter',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=200',
      content: 'The verification model is solid. Looking forward to building my credential portfolio on Aurin.',
      badges: 3,
      rating: 5
    }
  ];

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="absolute inset-0 grain opacity-10" />

      <div className="relative max-w-[1600px] mx-auto px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="block text-white">Loved by</span>
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              professionals worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed">
            Join thousands who've transformed their careers with Aurin
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="premium-card p-8 space-y-6 group cursor-pointer hover-lift"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-emerald-400 text-emerald-400" />
                ))}
              </div>

              <div className="relative">
                <Quote size={40} className="absolute -top-2 -left-2 text-emerald-500/20" />
                <p className="text-gray-300 leading-relaxed relative z-10">
                  "{testimonial.content}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                />
                <div className="flex-1">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400">
                  {testimonial.badges} badges
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="flex -space-x-3">
              {testimonials.slice(0, 4).map((t, i) => (
                <img
                  key={i}
                  src={t.image}
                  alt={t.name}
                  className="w-10 h-10 rounded-full border-2 border-black object-cover"
                />
              ))}
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">Join 50,000+ professionals</div>
              <div className="text-xs text-gray-500">Average rating: 4.9/5</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
