import { useState } from 'react';
import { Award, Shield, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/use-toast';
import { supabase } from '../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (adminError || !adminData) {
          showToast({
            title: 'Access denied',
            description: 'Admin privileges required',
            variant: 'destructive',
          });
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        showToast({
          title: `Welcome back, ${adminData.role}!`,
          description: 'Accessing admin panel...',
        });
        navigate('/admin');
      }
    } catch (error: any) {
      showToast({
        title: 'Login failed',
        description: error.message || 'Invalid admin credentials',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]" />
        <div className="absolute inset-0 grain opacity-20" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-2xl">
                <Shield size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Admin Portal</h1>
            <p className="text-gray-400">Secure access for authorized administrators</p>
          </div>

          <div className="premium-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aurin.com"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-semibold text-white hover:shadow-xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock size={18} />
                <span>{loading ? 'Verifying...' : 'Access Admin Panel'}</span>
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <Link
                to="/login"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                ← Back to regular login
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              <Shield size={16} />
              <span>Authorized access only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
