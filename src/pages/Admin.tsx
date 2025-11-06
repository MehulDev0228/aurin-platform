import { useState, useEffect } from 'react';
import {
  Users, Calendar, Award, TrendingUp, AlertCircle, CheckCircle, X, Shield,
  Eye, Activity, Zap, Crown, ArrowUp, ArrowDown, Clock, Target
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  isUserAdmin,
  getDashboardStats,
  getPendingApprovals,
  verifyOrganizer,
  getUserGrowthData,
  getRecentUsers
} from '../lib/adminQueries';
import { useToast } from '../components/Toast';

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalEnrollments: 0,
    totalBadges: 0
  });
  const [pendingApprovals, setPendingApprovals] = useState<any>({ organizers: [], events: [] });
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, [user?.id]);

  const checkAdminAccess = async () => {
    if (!user?.id) {
      navigate('/admin/login');
      return;
    }

    const isAdmin = await isUserAdmin(user.id);
    if (!isAdmin) {
      showToast('Access denied. Admin privileges required.', 'error');
      navigate('/dashboard');
      return;
    }

    await loadData();
  };

  const loadData = async () => {
    try {
      const [statsData, approvalsData, growthData, usersData] = await Promise.all([
        getDashboardStats(),
        getPendingApprovals(),
        getUserGrowthData(30),
        getRecentUsers(10)
      ]);

      setStats(statsData);
      setPendingApprovals(approvalsData);
      setGrowthData(growthData);
      setRecentUsers(usersData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      showToast('Failed to load admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrganizer = async (userId: string) => {
    try {
      await verifyOrganizer(userId);
      showToast('Organizer approved!', 'success');
      await loadData();
    } catch (error: any) {
      showToast(error.message || 'Failed to approve organizer', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const calculateGrowth = () => {
    if (growthData.length < 2) return 0;
    const recent = growthData.slice(-7).reduce((sum, d) => sum + d.count, 0);
    const previous = growthData.slice(-14, -7).reduce((sum, d) => sum + d.count, 0);
    return previous === 0 ? 100 : ((recent - previous) / previous) * 100;
  };

  const userGrowth = calculateGrowth();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-xs text-gray-400">Platform Management</p>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 p-6 hover:scale-105 transition-transform">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <Users className="text-blue-400" size={24} />
                {userGrowth > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400">
                    <ArrowUp size={12} />
                    <span>{userGrowth.toFixed(1)}%</span>
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold mb-1">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Users</div>
              <div className="text-xs text-gray-600 mt-1">+{recentUsers.length} this week</div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 p-6 hover:scale-105 transition-transform">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="text-emerald-400" size={24} />
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400">
                  <Activity size={12} />
                  <span>Live</span>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stats.totalEvents.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Active Events</div>
              <div className="text-xs text-gray-600 mt-1">{stats.totalEnrollments} total enrollments</div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 p-6 hover:scale-105 transition-transform">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <Award className="text-purple-400" size={24} />
                <TrendingUp className="text-purple-400" size={16} />
              </div>
              <div className="text-3xl font-bold mb-1">{stats.totalBadges.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Badges Issued</div>
              <div className="text-xs text-gray-600 mt-1">Blockchain verified</div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 p-6 hover:scale-105 transition-transform">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <AlertCircle className="text-orange-400" size={24} />
                {(pendingApprovals.organizers.length + pendingApprovals.events.length) > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs text-orange-400">
                    <Clock size={12} />
                    <span>Urgent</span>
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold mb-1">
                {pendingApprovals.organizers.length + pendingApprovals.events.length}
              </div>
              <div className="text-sm text-gray-400">Pending Approvals</div>
              <div className="text-xs text-gray-600 mt-1">
                {pendingApprovals.organizers.length} organizers, {pendingApprovals.events.length} events
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-emerald-400" size={24} />
                  <h2 className="text-2xl font-bold">User Growth</h2>
                </div>
                <div className="text-sm text-gray-400">Last 30 days</div>
              </div>

              {growthData.length > 0 ? (
                <div className="space-y-4">
                  <div className="h-48 flex items-end gap-2">
                    {growthData.slice(-14).map((data, i) => {
                      const maxCount = Math.max(...growthData.map(d => d.count));
                      const height = maxCount === 0 ? 0 : (data.count / maxCount) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                          <div
                            className="w-full bg-gradient-to-t from-emerald-400 to-teal-500 rounded-t transition-all hover:from-emerald-300 hover:to-teal-400 relative"
                            style={{ height: `${Math.max(height, 10)}%` }}
                          >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {data.count}
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 rotate-0">
                            {new Date(data.date).getDate()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Activity size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No growth data yet</p>
                </div>
              )}
            </div>

            {pendingApprovals.organizers.length > 0 && (
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Crown className="text-purple-400" size={24} />
                  <h2 className="text-2xl font-bold">Pending Organizer Approvals</h2>
                  <span className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs text-orange-400">
                    {pendingApprovals.organizers.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {pendingApprovals.organizers.map((org: any) => (
                    <div
                      key={org.id}
                      className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xl">
                          {org.profiles?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <h4 className="font-semibold">{org.organization_name}</h4>
                          <p className="text-sm text-gray-400">
                            @{org.profiles?.username} • {org.organization_type}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Applied {new Date(org.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproveOrganizer(org.user_id)}
                          className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-lg transition-all flex items-center gap-2"
                        >
                          <CheckCircle size={16} />
                          <span>Approve</span>
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-all flex items-center gap-2"
                        >
                          <X size={16} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="text-yellow-400" size={24} />
                <h3 className="text-xl font-bold">Quick Actions</h3>
              </div>

              <div className="space-y-2">
                <Link
                  to="/admin"
                  className="block p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-sm font-medium"
                >
                  View All Users
                </Link>
                <Link
                  to="/admin"
                  className="block p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-sm font-medium"
                >
                  View All Events
                </Link>
                <Link
                  to="/admin"
                  className="block p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-sm font-medium"
                >
                  Manage Badges
                </Link>
                <Link
                  to="/admin"
                  className="block p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-sm font-medium"
                >
                  Activity Logs
                </Link>
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="text-blue-400" size={24} />
                <h3 className="text-xl font-bold">Recent Users</h3>
              </div>

              <div className="space-y-3">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user: any) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{user.full_name || user.username}</div>
                        <div className="text-xs text-gray-500">@{user.username}</div>
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent users</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
