import { useState, useEffect } from 'react';
import { Award, Users, CheckCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { awardBadge, awardBadgeToMultipleUsers } from '../lib/badgeAwardingService';
import { useToast } from './Toast';

interface AdminBadgeManagerProps {
  eventId?: string;
  onClose?: () => void;
}

export default function AdminBadgeManager({ eventId, onClose }: AdminBadgeManagerProps) {
  const [badges, setBadges] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedBadge, setSelectedBadge] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: badgesData } = await supabase
        .from('badges')
        .select('*')
        .eq('is_active', true)
        .order('name');

      setBadges(badgesData || []);

      if (eventId) {
        const { data: enrollmentsData } = await supabase
          .from('event_enrollments')
          .select(`
            user_id,
            profiles:user_id (
              id,
              full_name,
              username,
              avatar_url
            )
          `)
          .eq('event_id', eventId)
          .in('status', ['attended', 'completed']);

        setUsers(enrollmentsData?.map(e => e.profiles).filter(Boolean) || []);
      } else {
        const { data: usersData } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url')
          .order('full_name')
          .limit(100);

        setUsers(usersData || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleIssueBadges = async () => {
    if (!selectedBadge || selectedUsers.length === 0) {
      showToast('Please select a badge and at least one user', 'warning');
      return;
    }

    setIssuing(true);
    try {
      if (selectedUsers.length === 1) {
        const result = await awardBadge({
          userId: selectedUsers[0],
          badgeId: selectedBadge,
        });

        if (result.success) {
          showToast('Badge awarded successfully!', 'success');
        } else {
          showToast(result.error || 'Failed to award badge', 'error');
        }
      } else {
        const result = await awardBadgeToMultipleUsers(selectedUsers, selectedBadge);

        if (result.success) {
          showToast(`Badge awarded to ${result.count} users!`, 'success');
        } else {
          showToast(result.error || 'Failed to award badges', 'error');
        }
      }

      setSelectedUsers([]);
      setSelectedBadge('');
      if (onClose) onClose();
    } catch (error: any) {
      showToast(error.message || 'Failed to issue badges', 'error');
    } finally {
      setIssuing(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.id));
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Award size={24} className="text-emerald-400" />
          <h2 className="text-2xl font-bold">Issue Badges</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Badge</label>
            <select
              value={selectedBadge}
              onChange={(e) => setSelectedBadge(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Choose a badge...</option>
              {badges.map(badge => (
                <option key={badge.id} value={badge.id}>
                  {badge.name} - {badge.category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Select Users ({selectedUsers.length} selected)</label>
              <button
                onClick={selectAll}
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {selectedUsers.length === users.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 border border-white/10 rounded-xl p-4">
              {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No users found</p>
                </div>
              ) : (
                users.map(user => (
                  <button
                    key={user.id}
                    onClick={() => toggleUserSelection(user.id)}
                    className={`w-full p-3 flex items-center gap-3 rounded-lg transition-all ${
                      selectedUsers.includes(user.id)
                        ? 'bg-emerald-500/20 border-2 border-emerald-500'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{user.full_name}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                    {selectedUsers.includes(user.id) && (
                      <CheckCircle size={20} className="text-emerald-400" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          <button
            onClick={handleIssueBadges}
            disabled={issuing || !selectedBadge || selectedUsers.length === 0}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/20 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {issuing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Issuing...
              </>
            ) : (
              <>
                <Award size={20} />
                Issue Badge to {selectedUsers.length} User{selectedUsers.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
