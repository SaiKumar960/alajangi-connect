import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../services/api';
import Avatar from '../common/Avatar';
import Loader from '../common/Loader';
import { RiUserAddLine, RiCheckLine } from 'react-icons/ri';
import toast from 'react-hot-toast';

const SuggestedUsers = ({ layout = 'vertical' }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingMap, setFollowingMap] = useState({});
  const [followLoading, setFollowLoading] = useState({});

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await userAPI.getSuggestedUsers();
        // Take up to 5 users for the suggestions
        setUsers(data.users.slice(0, 5));
      } catch (err) {
        console.error('Error fetching suggestions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  const handleFollow = async (userId) => {
    setFollowLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const { data } = await userAPI.followUser(userId);
      setFollowingMap(prev => ({ ...prev, [userId]: true }));
      toast.success(`Followed ${data.user?.name || 'user'}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to follow user');
    } finally {
      setFollowLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (loading) return <div className="py-4"><Loader inline /></div>;
  if (users.length === 0) return null;

  if (layout === 'horizontal') {
    return (
      <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {users.map(u => {
          const isFollowing = followingMap[u._id];
          return (
            <div key={u._id} className="glass-panel p-4 rounded-xl flex flex-col items-center flex-shrink-0 w-36 border border-white/5 relative group hover:border-electric/30 transition-colors">
              <Link to={`/profile/${u._id}`} className="flex flex-col items-center">
                <Avatar src={u.avatar} name={u.name} size="lg" className="mb-2" />
                <p className="text-sm font-medium text-white truncate w-full text-center group-hover:text-cyan-400 transition-colors">{u.name}</p>
                <p className="text-xs text-gray-500 truncate w-full text-center mb-3">{u.email}</p>
              </Link>
              <button
                onClick={() => handleFollow(u._id)}
                disabled={isFollowing || followLoading[u._id]}
                className={`mt-auto w-full py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isFollowing 
                    ? 'bg-white/10 text-white border border-white/10' 
                    : 'bg-electric/20 text-electric border border-electric/30 hover:bg-electric hover:text-white'
                }`}
              >
                {followLoading[u._id] ? '...' : isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  // Vertical layout (for sidebar)
  return (
    <div className="flex flex-col gap-3">
      {users.map(u => {
        const isFollowing = followingMap[u._id];
        return (
          <div key={u._id} className="flex items-center justify-between group">
            <Link to={`/profile/${u._id}`} className="flex items-center gap-3 overflow-hidden">
              <Avatar src={u.avatar} name={u.name} size="sm" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate group-hover:text-cyan-400 transition-colors">{u.name}</p>
                <p className="text-xs text-gray-500 truncate">{u.email}</p>
              </div>
            </Link>
            <button
              onClick={() => handleFollow(u._id)}
              disabled={isFollowing || followLoading[u._id]}
              className={`p-1.5 rounded-full transition-all flex-shrink-0 ${
                isFollowing 
                  ? 'bg-white/10 text-white' 
                  : 'text-electric hover:bg-electric/20'
              }`}
            >
              {followLoading[u._id] ? (
                <div className="w-4 h-4 border-2 border-electric border-t-transparent rounded-full animate-spin" />
              ) : isFollowing ? (
                <RiCheckLine size={16} />
              ) : (
                <RiUserAddLine size={16} />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
