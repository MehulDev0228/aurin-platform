// src/components/EnhancedNavbar.tsx - Premium SaaS-Level Navbar
// Inspired by modern SaaS landing pages with premium animations
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Award, User, Settings, Copy, CheckCircle2, 
  LayoutDashboard, Shield, FileText, LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserStatus } from '../lib/userStatus';
import { getUserProfile } from '../lib/queries';
import { useToast } from '../components/ui/use-toast';

export default function EnhancedNavbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userStatus, setUserStatus] = useState<{ isOrganizer: boolean; isAdmin: boolean } | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    try {
      const [status, profile] = await Promise.all([
        getUserStatus(user.id),
        getUserProfile(user.id)
      ]);
      setUserStatus(status);
      setUserProfile(profile);
    } catch (error) {
      // Silently fail
    }
  };

  const navItems = [
    { to: '/explore', label: 'Explore' },
    { to: '/events', label: 'Events' },
  ];

  const copyProfileLink = () => {
    if (!userProfile?.username) return;
    const profileUrl = `${window.location.origin}/profile/${userProfile.username}`;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast({
      title: 'Profile link copied!',
      description: 'Share your profile with others',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const profileUrl = userProfile?.username ? `${window.location.origin}/profile/${userProfile.username}` : '';

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Animated gradient border on scroll */}
      {scrolled && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      )}

      <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo with premium animations */}
          <Link to="/" className="relative group">
            <motion.div
              className="flex items-center gap-3 lg:gap-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative">
                {/* Animated glow effect */}
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-emerald-400/0 via-emerald-400/30 to-emerald-400/0 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl"
                  animate={{
                    opacity: [0, 0.3, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Logo container with premium effects */}
                <motion.div
                  className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] border border-emerald-400/30"
                  whileHover={{
                    boxShadow: "0 0 60px rgba(16,185,129,0.6)",
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Award size={24} className="lg:w-[30px] lg:h-[30px] text-black" strokeWidth={2.5} />
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>
              <div>
                <motion.span
                  className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-white via-emerald-50 to-white bg-clip-text text-transparent tracking-[-0.02em] leading-none block"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  AURIN
                </motion.span>
                <motion.div
                  className="text-[8px] lg:text-[9px] text-emerald-400/60 font-medium tracking-[0.3em] uppercase mt-0.5"
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: [0.6, 0.8, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Digital Legacy
                </motion.div>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation with stagger animations */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.to;
              return (
                <NavLink key={item.to} to={item.to} className="relative">
                  {({ isActive: navIsActive }) => (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="relative"
                    >
                      <motion.div
                        className={`relative px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-medium text-[14px] lg:text-[15px] tracking-[-0.01em] transition-all duration-300 ${
                          navIsActive || isActive
                            ? 'text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                        whileHover={{ 
                          scale: 1.05,
                          y: -2,
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {/* Hover background effect */}
                        <motion.div
                          className="absolute inset-0 rounded-xl lg:rounded-2xl bg-white/[0.03] opacity-0"
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                        <span className="relative z-10">{item.label}</span>
                        
                        {/* Active indicator with smooth animation */}
                        {(navIsActive || isActive) && (
                          <motion.div
                            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                            layoutId="activeNavDot"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Actions with premium animations */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {user ? (
              <>
                <NavLink to="/dashboard" className="relative">
                  {({ isActive }) => (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className={`relative px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-medium text-[14px] lg:text-[15px] tracking-[-0.01em] transition-all duration-300 overflow-hidden ${
                        isActive
                          ? 'bg-white/5 text-white border border-white/10'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.02] border border-transparent'
                      }`}
                      whileHover={{ 
                        scale: 1.05,
                        y: -2,
                        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Shimmer effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <span className="relative z-10">Dashboard</span>
                    </motion.button>
                  )}
                </NavLink>

                {/* Profile Dropdown with premium animations */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="relative w-11 h-11 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-500/10 border border-emerald-400/20 flex items-center justify-center overflow-hidden group"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, -5, 5, 0],
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Animated border glow */}
                    <motion.div
                      className="absolute inset-0 rounded-xl lg:rounded-2xl border-2 border-emerald-400/0 group-hover:border-emerald-400/50"
                      animate={{
                        boxShadow: [
                          '0 0 0px rgba(16,185,129,0)',
                          '0 0 20px rgba(16,185,129,0.4)',
                          '0 0 0px rgba(16,185,129,0)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    {userProfile?.avatar_url ? (
                      <img 
                        src={userProfile.avatar_url} 
                        alt={userProfile.username || 'Profile'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={18} className="lg:w-5 lg:h-5 text-emerald-400" />
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {profileOpen && (
                      <>
                        {/* Backdrop */}
                        <motion.div
                          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setProfileOpen(false)}
                        />
                        {/* Dropdown */}
                        <motion.div
                          className="absolute right-0 top-16 w-80 rounded-2xl bg-black/95 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden z-50"
                          initial={{ opacity: 0, y: -10, scale: 0.95, filter: 'blur(10px)' }}
                          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, y: -10, scale: 0.95, filter: 'blur(10px)' }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          {/* Gradient border */}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-transparent to-teal-500/20 opacity-50" />
                          
                          <div className="relative p-6 border-b border-white/10">
                            <div className="flex items-center gap-4 mb-4">
                              {userProfile?.avatar_url ? (
                                <motion.img 
                                  src={userProfile.avatar_url} 
                                  alt={userProfile.username || 'Profile'} 
                                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400/30"
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  transition={{ duration: 0.3 }}
                                />
                              ) : (
                                <motion.div
                                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-500/10 border-2 border-emerald-400/30 flex items-center justify-center"
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <User size={32} className="text-emerald-400" />
                                </motion.div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-white truncate">
                                  {userProfile?.full_name || userProfile?.username || 'User'}
                                </div>
                                <div className="text-sm text-gray-400 truncate">
                                  @{userProfile?.username || 'username'}
                                </div>
                              </div>
                            </div>
                            
                            {/* Public Profile Link with premium styling */}
                            {profileUrl && (
                              <motion.div
                                className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                              >
                                <div className="text-xs text-emerald-400 mb-2 font-medium flex items-center gap-2">
                                  <motion.div
                                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                  />
                                  Your Public Profile
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={profileUrl}
                                    readOnly
                                    className="flex-1 text-xs bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-gray-300 font-mono truncate focus:outline-none focus:border-emerald-500/50 transition-colors"
                                  />
                                  <motion.button
                                    onClick={copyProfileLink}
                                    className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors relative overflow-hidden"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <motion.div
                                      className="absolute inset-0 bg-emerald-500/20"
                                      initial={{ scale: 0 }}
                                      whileHover={{ scale: 1 }}
                                      transition={{ duration: 0.3 }}
                                    />
                                    {copied ? (
                                      <CheckCircle2 size={16} className="text-emerald-400 relative z-10" />
                                    ) : (
                                      <Copy size={16} className="text-emerald-400 relative z-10" />
                                    )}
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}
                          </div>

                          <div className="relative p-2">
                            <DropdownItem
                              icon={User}
                              label="View Profile"
                              onClick={() => {
                                if (userProfile?.username) {
                                  navigate(`/profile/${userProfile.username}`);
                                  setProfileOpen(false);
                                }
                              }}
                              delay={0.1}
                            />
                            <DropdownItem
                              icon={Settings}
                              label="Settings"
                              onClick={() => {
                                navigate('/settings');
                                setProfileOpen(false);
                              }}
                              delay={0.15}
                            />
                            <DropdownItem
                              icon={LayoutDashboard}
                              label="Dashboard"
                              onClick={() => {
                                navigate('/dashboard');
                                setProfileOpen(false);
                              }}
                              delay={0.2}
                            />
                            
                            {userStatus?.isOrganizer && (
                              <DropdownItem
                                icon={FileText}
                                label="Organizer Dashboard"
                                onClick={() => {
                                  navigate('/organizer');
                                  setProfileOpen(false);
                                }}
                                delay={0.25}
                              />
                            )}
                            
                            {userStatus?.isAdmin && (
                              <DropdownItem
                                icon={Shield}
                                label="Admin Dashboard"
                                onClick={() => {
                                  navigate('/admin');
                                  setProfileOpen(false);
                                }}
                                delay={0.3}
                              />
                            )}

                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

                            <DropdownItem
                              icon={LogOut}
                              label="Sign Out"
                              onClick={async () => {
                                await signOut?.();
                                setProfileOpen(false);
                              }}
                              danger
                              delay={0.35}
                            />
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </motion.div>
              </>
            ) : (
              <>
                <NavLink to="/login">
                  {({ isActive }) => (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className={`relative px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-medium text-[14px] lg:text-[15px] tracking-[-0.01em] transition-all duration-300 overflow-hidden ${
                        isActive
                          ? 'bg-white/5 text-white border border-white/10'
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.02] border border-transparent'
                      }`}
                      whileHover={{ 
                        scale: 1.05,
                        y: -2,
                        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <span className="relative z-10">Login</span>
                    </motion.button>
                  )}
                </NavLink>
                <Link to="/signup">
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative px-8 lg:px-10 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-semibold text-[14px] lg:text-[15px] tracking-[-0.01em] bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.4)] overflow-hidden group"
                    whileHover={{ 
                      scale: 1.05,
                      y: -2,
                      boxShadow: "0 0 50px rgba(16,185,129,0.6)",
                      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Animated gradient overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10">Get Started</span>
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button with premium animation */}
          <motion.button
            className="md:hidden w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-white backdrop-blur-xl relative overflow-hidden group"
            onClick={() => setOpen(!open)}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="absolute inset-0 bg-emerald-500/10"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {open ? <X size={24} className="relative z-10" /> : <Menu size={24} className="relative z-10" />}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu with premium animations */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden fixed inset-x-0 top-20 bg-black/98 backdrop-blur-3xl border-b border-white/[0.03]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-6 lg:px-8 py-6 space-y-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <NavLink
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block px-6 py-4 rounded-2xl text-gray-400 hover:text-white hover:bg-white/[0.02] transition-all duration-300 font-medium text-[15px] tracking-[-0.01em]"
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />
              {user ? (
                <>
                  {[
                    { to: '/dashboard', label: 'Dashboard' },
                    ...(userStatus?.isOrganizer ? [{ to: '/organizer', label: 'Organizer Dashboard' }] : []),
                    ...(userStatus?.isAdmin ? [{ to: '/admin', label: 'Admin Dashboard' }] : []),
                    { to: '/settings', label: 'Settings' },
                    ...(userProfile?.username ? [{ to: `/profile/${userProfile.username}`, label: 'View Profile' }] : []),
                  ].map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navItems.length + index) * 0.05, duration: 0.3 }}
                    >
                      <NavLink
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="block px-6 py-4 rounded-2xl text-gray-400 hover:text-white hover:bg-white/[0.02] transition-all duration-300 font-medium text-[15px] tracking-[-0.01em]"
                      >
                        {item.label}
                      </NavLink>
                    </motion.div>
                  ))}
                  <motion.button
                    onClick={async () => {
                      setOpen(false);
                      await signOut?.();
                    }}
                    className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-semibold text-[15px] tracking-[-0.01em] mt-2 text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign Out
                  </motion.button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="block px-6 py-4 rounded-2xl text-gray-400 hover:text-white hover:bg-white/[0.02] transition-all duration-300 font-medium text-[15px] tracking-[-0.01em]"
                  >
                    Login
                  </NavLink>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="block px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-semibold text-[15px] tracking-[-0.01em] mt-2 text-center"
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

function DropdownItem({ 
  icon: Icon, 
  label, 
  onClick, 
  danger = false,
  delay = 0
}: { 
  icon: any; 
  label: string; 
  onClick: () => void;
  danger?: boolean;
  delay?: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.2 }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 relative overflow-hidden group ${
        danger
          ? 'text-red-400 hover:bg-red-500/10'
          : 'text-gray-300 hover:bg-white/[0.02] hover:text-white'
      }`}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Hover effect */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400/0 group-hover:bg-emerald-400/50"
        initial={{ scaleY: 0 }}
        whileHover={{ scaleY: 1 }}
        transition={{ duration: 0.2 }}
      />
      <Icon size={18} className={danger ? 'text-red-400' : 'text-gray-400 group-hover:text-emerald-400 transition-colors'} />
      <span className="text-[15px] font-medium tracking-[-0.01em]">{label}</span>
    </motion.button>
  );
}
