import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usersAPI, postsAPI } from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import PostCard from '../../components/post/PostCard';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import { RiEditLine, RiCheckLine, RiCloseLine } from 'react-icons/ri';
import styles from './Profile.module.css';
import toast from 'react-hot-toast';

const Profile = () => {
  const { id } = useParams();
  const { user: authUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const isOwn = authUser?._id === id;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [followingState, setFollowingState] = useState(false);
  const [togglingFollow, setTogglingFollow] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch profile
  useEffect(() => {
    const fetch = async () => {
      setLoadingProfile(true);
      try {
        const { data } = await usersAPI.getProfile(id);
        setProfile(data.user);
        setFollowingState(data.user.isFollowing);
        setEditForm({ name: data.user.name, bio: data.user.bio || '' });
      } catch (err) {
        if (err.response?.status === 404) navigate('/');
        else toast.error('Failed to load profile');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetch();
  }, [id, navigate]);

  // Fetch user posts
  const fetchPosts = useCallback(async (pageNum = 1) => {
    setLoadingPosts(true);
    try {
      const { data } = await usersAPI.getUserPosts(id, pageNum);
      setPosts((prev) => (pageNum === 1 ? data.posts : [...prev, ...data.posts]));
      setHasMore(data.pagination?.hasMore ?? false);
      setPage(pageNum);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setLoadingPosts(false);
    }
  }, [id]);

  useEffect(() => { fetchPosts(1); }, [fetchPosts]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!editForm.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', editForm.name.trim());
      fd.append('bio', editForm.bio.trim());
      if (avatarFile) fd.append('avatar', avatarFile);
      const { data } = await usersAPI.updateProfile(fd);
      setProfile((prev) => ({ ...prev, ...data.user }));
      updateUser(data.user);
      setEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setAvatarPreview(null);
    setAvatarFile(null);
    setEditForm({ name: profile.name, bio: profile.bio || '' });
  };

  const handleLike = async (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 }
          : p
      )
    );
    try {
      await postsAPI.toggleLike(postId);
    } catch {
      toast.error('Failed to update like');
    }
  };

  const handleFollowToggle = async () => {
    if (!authUser) { toast.error('Please login to follow'); return; }
    setTogglingFollow(true);
    try {
      const { data } = await usersAPI.toggleFollow(id);
      setFollowingState(data.isFollowing);
      setProfile((prev) => ({ 
        ...prev, 
        followersCount: data.followersCount,
        // Optional: Update array optimistically if we want
      }));
      toast.success(data.isFollowing ? `Following ${profile.name}` : `Unfollowed ${profile.name}`);
    } catch {
      toast.error('Failed to update follow status');
    } finally {
      setTogglingFollow(false);
    }
  };

  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    setProfile((prev) => ({ ...prev, postsCount: Math.max(0, (prev.postsCount || 1) - 1) }));
  };

  if (loadingProfile) return <><Navbar /><Loader fullPage /></>;

  const displayAvatar = avatarPreview || profile?.avatar;

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.coverBg} aria-hidden="true" />

        {/* ─── Profile header ─── */}
        <div className={styles.profileHeader}>
          {/* Avatar */}
          <div className={styles.avatarWrapper}>
            <Avatar src={displayAvatar} name={profile?.name} size="xl" className={styles.avatar} />
            {editing && isOwn && (
              <label className={styles.avatarEdit} htmlFor="avatar-input" title="Change photo">
                <RiEditLine size={15} />
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  className={styles.hiddenInput}
                  onChange={handleAvatarChange}
                />
              </label>
            )}
          </div>

          {/* Info */}
          <div className={styles.profileInfo}>
            {editing ? (
              <div className={styles.editFields}>
                <input
                  className={styles.editName}
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  maxLength={50}
                  placeholder="Your name"
                />
                <textarea
                  className={styles.editBio}
                  value={editForm.bio}
                  onChange={(e) => setEditForm((p) => ({ ...p, bio: e.target.value }))}
                  maxLength={160}
                  rows={2}
                  placeholder="Write a short bio…"
                />
              </div>
            ) : (
              <>
                <h1 className={styles.name}>{profile?.name}</h1>
                <p className={styles.email}>{profile?.email}</p>
                {profile?.bio && <p className={styles.bio}>{profile.bio}</p>}
              </>
            )}

            {/* Stats */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{profile?.postsCount ?? 0}</span>
                <span className={styles.statLabel}>Posts</span>
              </div>
              <div 
                className={styles.stat} 
                onClick={() => profile?.followers?.length > 0 && setShowFollowers(true)}
                style={{ cursor: profile?.followers?.length > 0 ? 'pointer' : 'default' }}
              >
                <span className={styles.statValue}>{profile?.followersCount ?? 0}</span>
                <span className={styles.statLabel}>Followers</span>
              </div>
              <div 
                className={styles.stat} 
                onClick={() => profile?.following?.length > 0 && setShowFollowing(true)}
                style={{ cursor: profile?.following?.length > 0 ? 'pointer' : 'default' }}
              >
                <span className={styles.statValue}>{profile?.followingCount ?? 0}</span>
                <span className={styles.statLabel}>Following</span>
              </div>
            </div>
          </div>

          {/* Edit / Save buttons */}
          {isOwn && (
            <div className={styles.editActions}>
              {editing ? (
                <>
                  <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>
                    <RiCheckLine size={15} /> Save
                  </Button>
                  <Button variant="ghost" size="sm" onClick={cancelEdit}>
                    <RiCloseLine size={15} /> Cancel
                  </Button>
                </>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                  <RiEditLine size={15} /> Edit Profile
                </Button>
              )}
            </div>
          )}

          {/* Follow button for other users */}
          {!isOwn && authUser && (
            <div className={styles.editActions}>
              <Button
                variant={followingState ? "secondary" : "primary"}
                size="sm"
                loading={togglingFollow}
                onClick={handleFollowToggle}
              >
                {followingState ? 'Unfollow' : 'Follow'}
              </Button>
            </div>
          )}
        </div>

        {/* ─── Posts ─── */}
        <div className={styles.postsSection}>
          <h2 className={styles.postsTitle}>Posts</h2>

          {loadingPosts && posts.length === 0 ? (
            <Loader />
          ) : posts.length === 0 ? (
            <p className={styles.noPosts}>
              {isOwn ? 'You haven\'t posted yet. Share something!' : 'No posts yet.'}
            </p>
          ) : (
            <>
              <div className={styles.postsList}>
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onLike={handleLike}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {hasMore && (
                <div className={styles.loadMore}>
                  <Button
                    variant="secondary"
                    size="sm"
                    loading={loadingPosts}
                    onClick={() => fetchPosts(page + 1)}
                  >
                    Load more posts
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Follows Modal */}
      {(showFollowers || showFollowing) && (
        <div className={styles.modalOverlay} onClick={() => { setShowFollowers(false); setShowFollowing(false); }}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{showFollowers ? 'Followers' : 'Following'}</h3>
              <button className={styles.closeBtn} onClick={() => { setShowFollowers(false); setShowFollowing(false); }}>
                <RiCloseLine size={20} />
              </button>
            </div>
            <div className={styles.modalList}>
              {((showFollowers ? profile?.followers : profile?.following) || []).filter(u => u && u._id).map((u) => (
                <Link
                  key={u._id}
                  to={`/profile/${u._id}`}
                  className={styles.modalItem}
                  onClick={() => { setShowFollowers(false); setShowFollowing(false); }}
                >
                  <Avatar src={u.avatar} name={u.name || 'User'} size="sm" />
                  <span className={styles.modalItemName}>{u.name || 'User'}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
