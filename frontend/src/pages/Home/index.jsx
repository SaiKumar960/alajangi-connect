import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { postsAPI } from '../../services/api';
import usePosts from '../../hooks/usePosts';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import SuggestedUsers from '../../components/user/SuggestedUsers';
import PostCard from '../../components/post/PostCard';
import Loader from '../../components/common/Loader';
import Avatar from '../../components/common/Avatar';
import { RiImageLine, RiSendPlaneLine, RiCloseLine } from 'react-icons/ri';
import styles from './Home.module.css';
import toast from 'react-hot-toast';

const CreatePostPanel = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  // Avatar handles fallback automatically

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5 MB');
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('text', text.trim());
      if (image) formData.append('image', image);

      const { data } = await postsAPI.createPost(formData);
      onPostCreated(data.post);
      setText('');
      clearImage();
      toast.success('Post created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const charCount = text.length;
  const charLimit = 2000;

  return (
    <div className={styles.createPanel}>
      <div className={styles.createHeader}>
        <Avatar src={user?.avatar} name={user?.name} size="md" />
        <form onSubmit={handleSubmit} className={styles.createForm}>
          <textarea
            id="post-text-input"
            className={styles.textarea}
            placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}?`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={text.length > 80 ? 4 : 2}
            maxLength={charLimit}
            disabled={submitting}
          />

          {preview && (
            <div className={styles.previewWrapper}>
              <img src={preview} alt="Preview" className={styles.previewImg} />
              <button
                type="button"
                className={styles.clearPreview}
                onClick={clearImage}
                aria-label="Remove image"
              >
                <RiCloseLine size={16} />
              </button>
            </div>
          )}

          <div className={styles.createActions}>
            <div className={styles.createLeft}>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                id="post-image-input"
                className={styles.fileInput}
                onChange={handleFileChange}
              />
              <button
                type="button"
                className={styles.imageBtn}
                onClick={() => fileRef.current?.click()}
                aria-label="Attach image"
              >
                <RiImageLine size={19} />
                Photo
              </button>
              {charCount > 0 && (
                <span className={`${styles.charCount} ${charCount > charLimit * 0.9 ? styles.charWarn : ''}`}>
                  {charCount}/{charLimit}
                </span>
              )}
            </div>
            <button
              type="submit"
              id="submit-post-btn"
              className={styles.submitBtn}
              disabled={!text.trim() || submitting}
            >
              {submitting ? (
                <Loader inline />
              ) : (
                <>
                  <RiSendPlaneLine size={16} />
                  Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Home = () => {
  const {
    posts, loading, hasMore, initialLoad, page,
    loadMore, addPostToFeed, toggleLike, removePost,
  } = usePosts();

  // Initial load
  useEffect(() => { loadMore(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll sentinel
  const sentinelRef = useInfiniteScroll(
    () => { if (hasMore && !loading) loadMore(page); },
    hasMore && !initialLoad
  );

  return (
    <>
      <Navbar />
      <div className="app-layout">
        <div className="left-sidebar">
          <Sidebar position="left" />
        </div>

        <main className="main-content" id="main-feed">
          {/* Create post */}
          <CreatePostPanel onPostCreated={addPostToFeed} />

          {/* Suggested Users for Mobile (hidden on desktop via CSS) */}
          <div className={styles.mobileSuggested}>
            <SuggestedUsers layout="horizontal" />
          </div>

          {/* Feed */}
          <section className={styles.feed} aria-label="Post feed">
            {initialLoad ? (
              <Loader text="Loading your feed…" />
            ) : posts.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyIcon}>🌟</p>
                <h3>Nothing here yet</h3>
                <p>Be the first to post something!</p>
              </div>
            ) : (
              <>
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onLike={toggleLike}
                    onDelete={removePost}
                  />
                ))}

                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

                {loading && !initialLoad && (
                  <div className={styles.loadingMore}>
                    <Loader inline />
                    <span>Loading more…</span>
                  </div>
                )}

                {!hasMore && posts.length > 0 && (
                  <p className={styles.endMessage}>You&apos;re all caught up! 🎉</p>
                )}
              </>
            )}
          </section>
        </main>

        <div className="right-sidebar">
          <Sidebar position="right" />
        </div>
      </div>
    </>
  );
};

export default Home;
