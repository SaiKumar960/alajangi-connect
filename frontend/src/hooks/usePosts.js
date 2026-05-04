import { useState, useCallback, useRef } from 'react';
import { postsAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Manages paginated feed state.
 * Returns posts[], loading, hasMore, loadMore(), refresh(), toggleLike()
 */
const usePosts = (filter = '') => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const fetchedPages = useRef(new Set());

  const loadMore = useCallback(async (pageNum = 1) => {
    // Prevent duplicate fetches for the same page
    if (fetchedPages.current.has(pageNum) || loading) return;
    fetchedPages.current.add(pageNum);

    setLoading(true);
    try {
      const { data } = await postsAPI.getFeed(pageNum, 10, filter);
      const newPosts = data.posts || [];
      setPosts((prev) => (pageNum === 1 ? newPosts : [...prev, ...newPosts]));
      setHasMore(data.pagination?.hasMore ?? false);
      setPage(pageNum + 1);
    } catch (err) {
      fetchedPages.current.delete(pageNum); // allow retry
      toast.error(err.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [loading, filter]);

  const refresh = useCallback(() => {
    fetchedPages.current.clear();
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setInitialLoad(true);
    loadMore(1);
  }, [loadMore]);

  // Optimistic like toggle
  const toggleLike = useCallback(async (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;
        const nowLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nowLiked,
          likesCount: nowLiked ? p.likesCount + 1 : p.likesCount - 1,
        };
      })
    );
    try {
      await postsAPI.toggleLike(postId);
    } catch {
      // Revert optimistic update on error
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id !== postId) return p;
          const revert = !p.isLiked;
          return {
            ...p,
            isLiked: revert,
            likesCount: revert ? p.likesCount + 1 : p.likesCount - 1,
          };
        })
      );
      toast.error('Failed to update like');
    }
  }, []);

  const addPostToFeed = useCallback((newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  const removePost = useCallback((postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  }, []);

  const editPost = useCallback((postId, updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === postId ? { ...p, ...updatedPost } : p))
    );
  }, []);

  return {
    posts,
    loading,
    hasMore,
    initialLoad,
    page,
    loadMore,
    refresh,
    toggleLike,
    addPostToFeed,
    removePost,
    editPost,
  };
};

export default usePosts;
