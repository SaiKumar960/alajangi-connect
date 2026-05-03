import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { postsAPI } from '../../services/api';
import CommentItem from './CommentItem';
import Loader from '../common/Loader';
import styles from './CommentList.module.css';
import toast from 'react-hot-toast';

const CommentList = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const avatarSrc =
    user?.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'U')}&backgroundColor=6C63FF&textColor=ffffff`;

  const fetchComments = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const { data } = await postsAPI.getComments(postId, pageNum);
      setComments((prev) => (pageNum === 1 ? data.comments : [...prev, ...data.comments]));
      setHasMore(data.pagination?.hasMore ?? false);
      setPage(pageNum);
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => { fetchComments(1); }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      const { data } = await postsAPI.addComment(postId, trimmed);
      setComments((prev) => [...prev, data.comment]);
      setText('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await postsAPI.deleteComment(postId, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Comment input */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <img src={avatarSrc} alt={user?.name} className="avatar avatar-sm" />
        <div className={styles.inputRow}>
          <input
            id="comment-input"
            className={styles.input}
            placeholder="Write a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitting}
            maxLength={500}
          />
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!text.trim() || submitting}
            aria-label="Post comment"
          >
            {submitting ? '…' : 'Post'}
          </button>
        </div>
      </form>

      {/* Comment list */}
      {loading && comments.length === 0 ? (
        <Loader inline />
      ) : comments.length === 0 ? (
        <p className={styles.empty}>No comments yet. Be the first!</p>
      ) : (
        <div className={styles.list}>
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={handleDelete}
            />
          ))}
          {hasMore && (
            <button
              className={styles.loadMore}
              onClick={() => fetchComments(page + 1)}
              disabled={loading}
            >
              Load more comments
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentList;
