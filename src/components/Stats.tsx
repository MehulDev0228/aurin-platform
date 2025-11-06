import { useEffect, useRef, useState } from 'react';

export default function Stats() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: '100%', label: 'Blockchain Verified', subtext: 'Every credential' },
    { value: '<$0.01', label: 'Cost Per Badge', subtext: 'Affordable at scale' },
    { value: 'Base L2', label: 'Network', subtext: 'Fast & secure' },
    { value: '∞', label: 'Years Permanent', subtext: 'Forever on-chain' },
  ];

  return (
    <section ref={sectionRef} className="py-32 px-4 md:px-8 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.05),transparent_50%)]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center space-y-3 ${
                inView ? 'animate-scale-in' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-5xl md:text-7xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="space-y-1">
                <div className="text-base md:text-lg text-white font-semibold">
                  {stat.label}
                </div>
                <div className="text-xs md:text-sm text-gray-500">
                  {stat.subtext}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
