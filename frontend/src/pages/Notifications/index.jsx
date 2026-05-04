import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../../components/layout/TopNav';
import MobileNav from '../../components/layout/MobileNav';
import Loader from '../../components/common/Loader';
import Avatar from '../../components/common/Avatar';
import { notificationAPI } from '../../services/notificationService';
import { RiNotification3Line, RiHeartFill, RiUserFollowFill, RiChat3Fill } from 'react-icons/ri';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await notificationAPI.getNotifications();
        setNotifications(data.data.notifications);
        // Mark as read after viewing
        if (data.data.notifications.some(n => !n.isRead)) {
          await notificationAPI.markAsRead();
        }
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <RiHeartFill className="text-rose-500" />;
      case 'follow': return <RiUserFollowFill className="text-cyan-400" />;
      case 'comment': return <RiChat3Fill className="text-electric" />;
      default: return <RiNotification3Line />;
    }
  };

  const getMessage = (type) => {
    switch (type) {
      case 'like': return 'liked your post';
      case 'follow': return 'started following you';
      case 'comment': return 'commented on your post';
      default: return 'sent you a notification';
    }
  };

  return (
    <div className="min-h-screen bg-void flex flex-col">
      <TopNav />
      <div className="fixed inset-0 neural-bg opacity-20 pointer-events-none"></div>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-24 pb-24 relative z-10">
        <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <RiNotification3Line className="text-electric" />
          Notifications
        </h1>

        {loading ? (
          <Loader text="Retrieving signals..." />
        ) : notifications.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-white/5">
            <RiNotification3Line size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">
              No new transmissions detected
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((n) => (
              <div 
                key={n._id}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                  n.isRead 
                    ? 'bg-white/5 border-white/5 opacity-80' 
                    : 'bg-electric/10 border-electric/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                }`}
              >
                <div className="mt-1 text-lg">
                  {getIcon(n.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Link to={`/profile/${n.sender._id}`} className="hover:underline">
                      <Avatar src={n.sender.avatar} name={n.sender.name} size="xs" className="inline-block mr-1" />
                      <span className="font-bold text-white text-sm">{n.sender.name}</span>
                    </Link>
                    <span className="text-gray-400 text-sm">{getMessage(n.type)}</span>
                  </div>
                  
                  {n.post && (
                    <p className="text-xs text-gray-500 line-clamp-1 italic mb-2">
                      "{n.post.content || n.post.text}"
                    </p>
                  )}
                  
                  <span className="text-[10px] font-mono text-gray-600 uppercase tracking-tighter">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {!n.isRead && (
                  <div className="w-2 h-2 bg-electric rounded-full animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)] mt-2"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default Notifications;
