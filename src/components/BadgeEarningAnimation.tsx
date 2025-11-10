// src/components/BadgeEarningAnimation.tsx - Magical badge earning animation
import { useEffect, useState } from 'react';
import { CheckCircle, Trophy } from 'lucide-react';
import { createPortal } from 'react-dom';

interface BadgeEarningAnimationProps {
  badge: {
    name: string;
    image_url?: string;
    description?: string;
  };
  onComplete: () => void;
}

export default function BadgeEarningAnimation({ badge, onComplete }: BadgeEarningAnimationProps) {
  const [stage, setStage] = useState<'entering' | 'reveal' | 'celebration' | 'complete'>('entering');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('reveal'), 500);
    const timer2 = setTimeout(() => {
      setStage('celebration');
      setShowConfetti(true);
    }, 1000);
    const timer3 = setTimeout(() => setStage('complete'), 3000);
    const timer4 = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative">
        {/* Confetti Effect */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-emerald-400 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Badge Card */}
        <div
          className={`relative transform transition-all duration-1000 ${
            stage === 'entering'
              ? 'scale-0 rotate-180 opacity-0'
              : stage === 'reveal'
              ? 'scale-110 rotate-0 opacity-100'
              : stage === 'celebration'
              ? 'scale-100 rotate-0 opacity-100'
              : 'scale-95 opacity-0'
          }`}
        >
          <div className="relative w-64 h-64 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border-2 border-emerald-500/50 p-8 backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.3),transparent_70%)]" />
            
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              {badge.image_url ? (
                <img
                  src={badge.image_url}
                  alt={badge.name}
                  className="w-32 h-32 object-cover rounded-2xl mb-4 animate-pulse"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4 animate-pulse">
                  <Trophy size={64} className="text-black" />
                </div>
              )}

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle size={24} className="text-emerald-400" />
                  <h3 className="text-2xl font-bold">Badge Earned!</h3>
                </div>
                <h4 className="text-xl font-semibold mb-2">{badge.name}</h4>
                {badge.description && (
                  <p className="text-sm text-gray-400">{badge.description}</p>
                )}
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-emerald-500/20 rounded-3xl blur-2xl animate-pulse" />
          </div>
        </div>

        {/* Success Message */}
        {stage === 'celebration' && (
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center animate-fade-in">
            <p className="text-lg font-semibold text-emerald-400 mb-2">
              Congratulations
            </p>
            <p className="text-sm text-gray-400">
              Your achievement has been added to your profile
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(content, document.body) : null;
}

