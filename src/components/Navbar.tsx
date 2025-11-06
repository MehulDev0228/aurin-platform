import { Award, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-[1600px] mx-auto">
        <div
          className={`flex items-center justify-between px-8 py-4 rounded-2xl transition-all duration-500 ${
            scrolled
              ? 'bg-black/80 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50'
              : 'bg-transparent'
          }`}
        >
          <div className="flex items-center gap-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/50 group-hover:scale-110 transition-transform duration-500">
                  <Award size={20} className="text-black" />
                </div>
              </div>
              <span className="font-semibold text-xl tracking-tight">Aurin</span>
            </Link>

            <div className="hidden lg:flex items-center gap-2">
              <a
                href="#features"
                className="px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300"
              >
                Features
              </a>
              <Link
                to="/explore"
                className="px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300"
              >
                Explore
              </Link>
              <a
                href="#how-it-works"
                className="px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300"
              >
                How it Works
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-sm font-bold text-black">
                    {user.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium">{user.email}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-3 border-b border-white/10">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                      <p className="text-xs text-gray-500">User ID: {user.id.slice(0, 8)}...</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User size={16} />
                        Dashboard
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <SettingsIcon size={16} />
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <LogOut size={16} />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:block px-6 py-2.5 text-sm font-medium text-white hover:text-emerald-400 transition-colors duration-300"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative px-6 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl text-sm font-semibold text-black shadow-2xl shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300">
                    Get started
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
