// src/components/PremiumNavbar.tsx - Ultra Premium Navbar (DEPRECATED - Use UltraPremiumNavbar)
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Wallet, LogOut, LogIn, Sparkles, Crown, Award } from 'lucide-react';

function useAuthOptional(): { user: any; signOut?: () => Promise<void> } | null {
  try {
    const { useAuth } = require('../contexts/AuthContext');
    return useAuth();
  } catch {
    return null;
  }
}

export default function PremiumNavbar() {
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Premium Logo */}
          <Link
            to="/"
            className="relative group"
          >
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <Award size={24} className="text-black" />
                </div>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                AURIN
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
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
                      className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        navIsActive || isActive
                          ? 'text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon size={18} />
                        <span>{item.label}</span>
                      </div>
                      {(navIsActive || isActive) && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl -z-10"
                          layoutId="activeTab"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: navIsActive || isActive ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  className="relative group"
                >
                  {({ isActive }) => (
                    <motion.button
                      className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-white border border-emerald-500/30'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <User size={18} />
                      <span>Dashboard</span>
                    </motion.button>
                  )}
                </NavLink>
                <NavLink
                  to="/wallet"
                  className="relative group"
                >
                  {({ isActive }) => (
                    <motion.button
                      className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Wallet size={18} />
                      <span>Wallet</span>
                    </motion.button>
                  )}
                </NavLink>
                <motion.button
                  onClick={() => auth?.signOut?.()}
                  className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-400 to-teal-500 text-black flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
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
                      className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LogIn size={18} />
                      <span>Login</span>
                    </motion.button>
                  )}
                </NavLink>
                <Link to="/signup">
                  <motion.button
                    className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-400 to-teal-500 text-black flex items-center gap-2"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)" }}
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
            className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
            onClick={() => setOpen(!open)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden fixed inset-x-0 top-20 bg-black/95 backdrop-blur-xl border-b border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              ))}
              <div className="h-px bg-white/10 my-2" />
              {user ? (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <User size={20} />
                      <span>Dashboard</span>
                    </div>
                  </NavLink>
                  <NavLink
                    to="/wallet"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet size={20} />
                      <span>Wallet</span>
                    </div>
                  </NavLink>
                  <button
                    onClick={async () => {
                      setOpen(false);
                      await auth?.signOut?.();
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-semibold text-left flex items-center gap-3"
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
                    className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <LogIn size={20} />
                      <span>Login</span>
                    </div>
                  </NavLink>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-semibold text-center"
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

