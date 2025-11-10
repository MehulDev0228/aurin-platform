// src/components/DashboardLock.tsx - Premium Lock Screen
import { motion } from 'framer-motion';
import { Lock, Mail, Wallet, GraduationCap, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import RippleButton from './aceternity/RippleButton';

interface LockStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
  route: string;
  color: string;
}

export default function DashboardLock({ 
  emailVerified, 
  walletConnected, 
  onboardingComplete 
}: { 
  emailVerified: boolean;
  walletConnected: boolean;
  onboardingComplete: boolean;
}) {
  const steps: LockStep[] = [
    {
      id: 'email',
      title: 'Verify Your Email',
      description: 'Confirm your email address to secure your account',
      icon: Mail,
      completed: emailVerified,
      route: '/email-verification',
      color: 'emerald'
    },
    {
      id: 'wallet',
      title: 'Connect Your Wallet',
      description: 'Link your blockchain wallet to receive NFT badges',
      icon: Wallet,
      completed: walletConnected,
      route: '/wallet',
      color: 'purple'
    },
    {
      id: 'onboarding',
      title: 'Complete Onboarding',
      description: 'Set up your profile and learn how AURIN works',
      icon: GraduationCap,
      completed: onboardingComplete,
      route: '/onboarding',
      color: 'blue'
    }
  ];

  const allCompleted = emailVerified && walletConnected && onboardingComplete;
  const nextStep = steps.find(step => !step.completed);

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-purple-500/20 border-2 border-emerald-500/30 mb-8"
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 0 0 rgba(16, 185, 129, 0.4)',
                '0 0 0 20px rgba(16, 185, 129, 0)',
                '0 0 0 0 rgba(16, 185, 129, 0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Lock size={48} className="text-emerald-400" />
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
            Unlock Your Dashboard
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Complete these steps to access your full AURIN experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-3xl border-2 transition-all ${
                  step.completed
                    ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/30'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Step Number */}
                <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                  step.completed
                    ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-black'
                    : 'bg-white/10 text-white'
                }`}>
                  {step.completed ? <CheckCircle2 size={24} /> : index + 1}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  step.completed
                    ? 'bg-emerald-500/20'
                    : 'bg-white/10'
                }`}>
                  <Icon size={32} className={step.completed ? 'text-emerald-400' : 'text-gray-400'} />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400 mb-6">{step.description}</p>

                {step.completed ? (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={20} />
                    <span className="font-semibold">Completed</span>
                  </div>
                ) : (
                  <Link to={step.route}>
                    <RippleButton className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-semibold flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-emerald-500/30 transition-all">
                      Get Started
                      <ArrowRight size={18} />
                    </RippleButton>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>

        {!allCompleted && nextStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Link to={nextStep.route}>
              <RippleButton className="px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-lg shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all inline-flex items-center gap-3">
                <Sparkles size={24} />
                <span>Continue to {nextStep.title}</span>
                <ArrowRight size={24} />
              </RippleButton>
            </Link>
          </motion.div>
        )}

        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/30 mb-6">
              <CheckCircle2 size={32} className="text-emerald-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-emerald-400">All Steps Complete!</div>
                <div className="text-gray-300">Your dashboard is now unlocked</div>
              </div>
            </div>
            <Link to="/dashboard">
              <RippleButton className="px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-lg shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all inline-flex items-center gap-3">
                <span>Enter Dashboard</span>
                <ArrowRight size={24} />
              </RippleButton>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

