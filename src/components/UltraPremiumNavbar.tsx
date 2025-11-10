// src/components/UltraPremiumNavbar.tsx - Ultra Premium Design
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Wallet, LogOut, LogIn, Sparkles, Award, Crown, Settings } from 'lucide-react';

function useAuthOptional(): { user: any; signOut?: () => Promise<void> } | null {
  try {
    const { useAuth } = require('../contexts/AuthContext');
    return useAuth();
  } catch {
    return null;
  }
}

export default function UltraPremiumNavbar() {
  const auth = useAuthOptional();
  const user = auth?.user ?? null;
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: '/explore', label: 'Explore', icon: Sparkles },
    { to: '/events', label: 'Events', icon: Award },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'bg-black/95 backdrop-blur-2xl border-b border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Premium gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-24">
          {/* Ultra Premium Logo */}
          <Link
            to="/"
            className="relative group"
          >
            <motion.div
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"
                  animate={{
                    opacity: [0, 0.2, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20 border border-emerald-400/30">
                  <Award size={28} className="text-black" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent tracking-tight">
                  AURIN
                </span>
                <div className="text-[10px] text-emerald-400/60 font-medium tracking-widest uppercase">
                  Digital Legacy
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation - Ultra Premium */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="relative group"
                >
                  {({ isActive: navIsActive }) => (
                    <motion.div
                      className={`relative px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                        navIsActive || isActive
                          ? 'text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon size={18} className={navIsActive || isActive ? 'text-emerald-400' : ''} />
                        <span>{item.label}</span>
                      </div>
                      {(navIsActive || isActive) && (
                        <>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 rounded-2xl -z-10"
                            layoutId="activeNav"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                          <motion.div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                            layoutId="activeNavLine"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        </>
                      )}
                    </motion.div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Actions - Ultra Premium */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <NavLink to="/dashboard" className="relative group">
                  {({ isActive }) => (
                    <motion.button
                      className={`px-6 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2.5 transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-white border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <User size={18} />
                      <span>Dashboard</span>
                    </motion.button>
                  )}
                </NavLink>
                <NavLink to="/wallet" className="relative group">
                  {({ isActive }) => (
                    <motion.button
                      className={`px-6 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2.5 transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 shadow-lg shadow-purple-500/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Wallet size={18} />
                      <span>Wallet</span>
                    </motion.button>
                  )}
                </NavLink>
                <motion.button
                  onClick={() => auth?.signOut?.()}
                  className="px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500 text-black flex items-center gap-2.5 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50"
                  whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </motion.button>
              </>
            ) : (
              <>
                <NavLink to="/login">
                  {({ isActive }) => (
                    <motion.button
                      className={`px-6 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2.5 transition-all duration-300 ${
                        isActive
                          ? 'bg-white/10 text-white border border-white/20'
                          : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LogIn size={18} />
                      <span>Login</span>
                    </motion.button>
                  )}
                </NavLink>
                <Link to="/signup">
                  <motion.button
                    className="px-8 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500 text-black flex items-center gap-2.5 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50"
                    whileHover={{ scale: 1.08, y: -2, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white backdrop-blur-sm"
            onClick={() => setOpen(!open)}
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.9 }}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu - Premium */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden fixed inset-x-0 top-24 bg-black/98 backdrop-blur-2xl border-b border-white/5 shadow-2xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="px-6 py-6 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-4 rounded-2xl text-gray-300 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    <span className="font-semibold">{item.label}</span>
                  </div>
                </NavLink>
              ))}
              <div className="h-px bg-white/10 my-4" />
              {user ? (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block px-6 py-4 rounded-2xl text-gray-300 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <User size={20} />
                      <span className="font-semibold">Dashboard</span>
                    </div>
                  </NavLink>
                  <NavLink
                    to="/wallet"
                    onClick={() => setOpen(false)}
                    className="block px-6 py-4 rounded-2xl text-gray-300 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet size={20} />
                      <span className="font-semibold">Wallet</span>
                    </div>
                  </NavLink>
                  <button
                    onClick={async () => {
                      setOpen(false);
                      await auth?.signOut?.();
                    }}
                    className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-left flex items-center gap-3 mt-2"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="block px-6 py-4 rounded-2xl text-gray-300 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <LogIn size={20} />
                      <span className="font-semibold">Login</span>
                    </div>
                  </NavLink>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="block px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-center mt-2"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

