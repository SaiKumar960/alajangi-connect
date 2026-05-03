import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { postsAPI } from '../../services/api';
import CommentItem from './CommentItem';
import Loader from '../common/Loader';
import GlowButton from '../common/GlowButton';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';

const CommentList = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

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
    <div className="space-y-6">
      {/* Comment input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Avatar src={user?.avatar} name={user?.name} size="sm" className="mt-1" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-electric/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>
            <textarea
              className="relative w-full bg-void/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-electric/50 resize-none placeholder-gray-600"
              placeholder="Transmit your response..."
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={submitting}
              maxLength={500}
            />
          </div>
          <div className="flex justify-end">
            <GlowButton
              type="submit"
              size="sm"
              disabled={!text.trim() || submitting}
              loading={submitting}
            >
              Post
            </GlowButton>
          </div>
        </div>
      </form>

      {/* Comment list */}
      <div className="space-y-4">
        {loading && comments.length === 0 ? (
          <Loader inline />
        ) : comments.length === 0 ? (
          <p className="text-center py-4 text-xs font-mono text-gray-600 uppercase tracking-widest">Zero responses found</p>
        ) : (
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                onDelete={handleDelete}
              />
            ))}
            {hasMore && (
              <button
                className="text-xs font-bold text-electric hover:text-cyan-400 transition-colors uppercase tracking-widest py-2"
                onClick={() => fetchComments(page + 1)}
                disabled={loading}
              >
                {loading ? 'Decrypting...' : 'Load more frequencies'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentList;
