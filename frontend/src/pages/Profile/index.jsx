import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { userAPI, postsAPI } from '../../services/api';
import TopNav from '../../components/layout/TopNav';
import MobileNav from '../../components/layout/MobileNav';
import Avatar from '../../components/common/Avatar';
import Loader from '../../components/common/Loader';
import GlowButton from '../../components/common/GlowButton';
import PostCardStandard from '../../components/post/PostCardStandard';
import PostCardCompact from '../../components/post/PostCardCompact';
import FloatingComposer from '../../components/composer/FloatingComposer';
import EditProfileModal from '../../components/user/EditProfileModal';
import { RiEditLine, RiUserAddLine, RiUserFollowLine, RiMapPinLine, RiCalendarLine, RiPulseLine } from 'react-icons/ri';
import toast from 'react-hot-toast';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const isOwnProfile = currentUser?._id === id;
  const fileRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const [{ data: userData }, { data: postData }] = await Promise.all([
          userAPI.getUser(id),
          userAPI.getUserPosts(id)
        ]);
        setUser(userData.user);
        setPosts(postData.posts);
        setIsFollowing(userData.user.followers?.includes(currentUser?._id));
      } catch (err) {
        toast.error('Failed to sync profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, currentUser?._id]);

  const handleFollow = async () => {
    try {
      await userAPI.followUser(id);
      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const { data } = await userAPI.updateProfile(formData);
      setUser(prev => ({ ...prev, avatar: data.user.avatar }));
      if (isOwnProfile) updateUser({ avatar: data.user.avatar });
      toast.success('Profile picture updated');
    } catch (err) {
      toast.error('Failed to update avatar');
    }
  };

  const handleLike = async (postId) => {
    // Optimistic UI update
    setPosts(prev => prev.map(p => {
      if (p._id !== postId) return p;
      return { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 };
    }));
    try {
      await postsAPI.toggleLike(postId);
    } catch {
      // Revert if failed
    }
  };

  if (loading) return <Loader fullPage text="Loading profile..." />;
  if (!user) return <div className="min-h-screen bg-void flex items-center justify-center text-white">User not found.</div>;

  return (
    <div className="min-h-screen bg-void flex flex-col">
      <TopNav />
      <div className="fixed inset-0 neural-bg opacity-20 pointer-events-none"></div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 pt-24 pb-20 relative z-10">
        
        {/* Profile Header */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 mb-8">
          {/* Cover Area */}
          <div className="h-32 sm:h-48 relative overflow-hidden bg-void">
            {user.banner ? (
              <img src={user.banner} alt="Profile Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-electric to-cyan-500 opacity-20"></div>
            )}
            <div className="absolute inset-0 neural-bg opacity-30"></div>
          </div>

          {/* Info Area */}
          <div className="px-6 pb-8 -mt-16 sm:-mt-20 relative z-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="relative group w-32 h-32 sm:w-40 sm:h-40">
                <Avatar src={user.avatar} name={user.name} size="xxl" className="border-4 border-void shadow-2xl" />
                {isOwnProfile && (
                  <button 
                    onClick={() => setEditMode(true)}
                    className="absolute inset-0 bg-black/60 rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer z-20"
                  >
                    <RiEditLine size={32} />
                  </button>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-1 glow-text">{user.name}</h1>
                <p className="text-electric font-mono text-sm tracking-widest mb-2">ID: {user._id.slice(-8).toUpperCase()}</p>
                {user.bio && (
                  <p className="text-gray-300 text-sm max-w-lg mb-4 line-clamp-2">
                    {user.bio}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <RiMapPinLine className="text-cyan-400" />
                    <span>Global Network</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RiCalendarLine className="text-electric" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {isOwnProfile ? (
                  <GlowButton variant="secondary" onClick={() => setEditMode(true)}>
                    <RiEditLine />
                    Edit Profile
                  </GlowButton>
                ) : (
                  <GlowButton variant={isFollowing ? 'secondary' : 'primary'} onClick={handleFollow}>
                    {isFollowing ? <RiUserFollowLine /> : <RiUserAddLine />}
                    {isFollowing ? 'Following' : 'Follow'}
                  </GlowButton>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-8 py-4 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">{posts.length}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Posts</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">{user.followers?.length || 0}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Followers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">{user.following?.length || 0}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex items-center gap-6 mb-6 px-2 border-b border-white/5">
          <button className="pb-3 border-b-2 border-electric text-white font-medium text-sm flex items-center gap-2">
            <RiPulseLine />
            Recent Activity
          </button>
        </div>

        {/* Posts Grid */}
        <div className="flex flex-col gap-4">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 font-mono text-sm">
              NO POSTS FOUND
            </div>
          ) : (
            posts.map((post, i) => (
              i === 0 ? 
              <PostCardStandard key={post._id} post={post} onLike={handleLike} onDelete={(id) => setPosts(prev => prev.filter(p => p._id !== id))} /> :
              <PostCardCompact key={post._id} post={post} onLike={handleLike} onDelete={(id) => setPosts(prev => prev.filter(p => p._id !== id))} />
            ))
          )}
        </div>

      </main>

      <FloatingComposer 
        isOpen={isComposerOpen} 
        onClose={() => setIsComposerOpen(false)} 
        onPostCreated={(post) => setPosts(prev => [post, ...prev])}
      />
      
      <MobileNav onOpenComposer={() => setIsComposerOpen(true)} />

      {editMode && (
        <EditProfileModal 
          user={user} 
          onClose={() => setEditMode(false)} 
          onUpdate={(updatedUser) => {
            setUser(updatedUser);
            if (isOwnProfile) updateUser(updatedUser);
          }}
        />
      )}
    </div>
  );
};

export default Profile;
