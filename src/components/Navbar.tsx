// src/components/Navbar.tsx
import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown, LogIn, LogOut, User, Wallet } from 'lucide-react';

// Safe auth access (prevents crashes if navbar renders before/without provider)
function useAuthOptional(): { user: any; signOut?: () => Promise<void> } | null {
  try {
    const { useAuth } = require('../contexts/AuthContext');
    return useAuth();
  } catch {
    return null;
  }
}

export default function Navbar() {
  const auth = useAuthOptional();
  const user = auth?.user ?? null;

  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // aceternity-ish tokens (glass + subtle ring/underline)
  const base = 'relative px-3 py-2 rounded-lg text-sm transition';
  const idle = 'text-gray-300 hover:text-white';
  const active = 'text-white';
  const cls = ({ isActive }: { isActive: boolean }) =>
    `${base} ${isActive ? active : idle}`;

  const Underline = () => (
    <span className="pointer-events-none absolute inset-x-2 -bottom-[2px] h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition"></span>
  );

  return (
    <header
      className={`sticky top-0 z-40 border-b border-zinc-900 bg-black/70 backdrop-blur ${
        elevated ? 'shadow-[0_1px_0_0_rgba(255,255,255,0.04)]' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto h-14 px-4 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="text-white font-semibold tracking-wide inline-flex items-center gap-2"
        >
          AURIN
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          <NavLink to="/explore" className={(s) => `${cls(s)} group`}>
            Explore <Underline />
          </NavLink>
          <NavLink to="/events" className={(s) => `${cls(s)} group`}>
            Events <Underline />
          </NavLink>

          {/* Resources dropdown */}
          <div className="relative group">
            <button className={`${base} ${idle} inline-flex items-center gap-1`}>
              Resources <ChevronDown size={16} />
            </button>
            <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition
                            absolute mt-2 min-w-[220px] rounded-2xl border border-zinc-800 bg-black/95 p-1">
              <Link
                to="/terms"
                className="block px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/10"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="block px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/10"
              >
                Privacy
              </Link>
            </div>
          </div>
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <NavLink to="/dashboard" className={(s) => `${cls(s)} group`}>
                <span className="inline-flex items-center gap-2">
                  <User size={16} /> Dashboard
                </span>
              </NavLink>
              <NavLink to="/wallet" className={(s) => `${cls(s)} group`}>
                <span className="inline-flex items-center gap-2">
                  <Wallet size={16} /> Wallet
                </span>
              </NavLink>
              <button
                onClick={() => auth?.signOut?.()}
                className="px-3 py-2 rounded-xl text-sm text-black bg-white hover:opacity-90 transition"
              >
                <span className="inline-flex items-center gap-2">
                  <LogOut size={16} /> Sign out
                </span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={(s) => `${cls(s)} group`}>
                <span className="inline-flex items-center gap-2">
                  <LogIn size={16} /> Login
                </span>
              </NavLink>
              <Link
                to="/signup"
                className="px-3 py-2 rounded-xl text-sm text-black bg-white hover:opacity-90 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <button
          className="md:hidden inline-flex w-10 h-10 items-center justify-center rounded-lg text-gray-200 hover:text-white hover:bg-white/10 transition"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="md:hidden border-t border-zinc-900 bg-black/95">
          <div className="max-w-6xl mx-auto px-4 py-3 grid gap-1">
            <NavLink to="/explore" className={cls} onClick={() => setOpen(false)}>
              Explore
            </NavLink>
            <NavLink to="/events" className={cls} onClick={() => setOpen(false)}>
              Events
            </NavLink>
            <Link to="/terms" className={`${base} ${idle}`} onClick={() => setOpen(false)}>
              Terms
            </Link>
            <Link to="/privacy" className={`${base} ${idle}`} onClick={() => setOpen(false)}>
              Privacy
            </Link>
            <div className="h-2" />
            {user ? (
              <>
                <NavLink to="/dashboard" className={cls} onClick={() => setOpen(false)}>
                  <span className="inline-flex items-center gap-2">
                    <User size={16} /> Dashboard
                  </span>
                </NavLink>
                <NavLink to="/wallet" className={cls} onClick={() => setOpen(false)}>
                  <span className="inline-flex items-center gap-2">
                    <Wallet size={16} /> Wallet
                  </span>
                </NavLink>
                <button
                  onClick={async () => {
                    setOpen(false);
                    await auth?.signOut?.();
                  }}
                  className="mt-1 px-3 py-2 rounded-xl text-sm text-black bg-white hover:opacity-90 transition text-left"
                >
                  <span className="inline-flex items-center gap-2">
                    <LogOut size={16} /> Sign out
                  </span>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={cls} onClick={() => setOpen(false)}>
                  <span className="inline-flex items-center gap-2">
                    <LogIn size={16} /> Login
                  </span>
                </NavLink>
                <Link
                  to="/signup"
                  className="px-3 py-2 rounded-xl text-sm text-black bg-white hover:opacity-90 transition"
                  onClick={() => setOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
