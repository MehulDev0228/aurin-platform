// src/components/CinematicIntro.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, Zap } from 'lucide-react';

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 800),
      setTimeout(() => setStage(2), 2000),
      setTimeout(() => setStage(3), 3500),
      setTimeout(() => onComplete(), 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8 } }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-purple-500/10 to-transparent"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.15),transparent_70%)]"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative z-10 text-center">
          {/* Stage 0: Initial fade in */}
          <AnimatePresence mode="wait">
            {stage === 0 && (
              <motion.div
                key="stage0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Award size={64} className="text-black" />
                </motion.div>
              </motion.div>
            )}

            {/* Stage 1: Logo appears */}
            {stage === 1 && (
              <motion.div
                key="stage1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.h1
                  className="text-7xl md:text-9xl font-black mb-6 bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0%", "100%"],
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  style={{
                    backgroundSize: "200% auto",
                  }}
                >
                  AURIN
                </motion.h1>
                <motion.p
                  className="text-xl md:text-2xl text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Your Digital Legacy
                </motion.p>
              </motion.div>
            )}

            {/* Stage 2: Tagline */}
            {stage === 2 && (
              <motion.div
                key="stage2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="flex items-center justify-center gap-3 mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <Sparkles size={32} className="text-emerald-400" />
                  <span className="text-2xl md:text-3xl font-bold text-white">
                    Verified Achievements
                  </span>
                  <Zap size={32} className="text-purple-400" />
                </motion.div>
                <motion.p
                  className="text-lg text-gray-300 max-w-md mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Powered by blockchain. Built for creators.
                </motion.p>
              </motion.div>
            )}

            {/* Stage 3: Loading */}
            {stage === 3 && (
              <motion.div
                key="stage3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.p
                  className="mt-6 text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Entering AURIN...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

