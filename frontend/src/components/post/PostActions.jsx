import { useState } from 'react';
import { RiHeart3Line, RiHeart3Fill, RiChat3Line, RiShareForwardLine, RiBookmarkLine, RiBookmarkFill } from 'react-icons/ri';
import CommentList from './CommentList';
import { postsAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const PostActions = ({ post, onLike, onSaveToggle }) => {
  const [showComments, setShowComments] = useState(false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.author?.name}`,
        text: post.text,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    const prev = isSaved;
    setIsSaved(!prev); // optimistic
    try {
      await postsAPI.toggleSave(post._id);
      if (onSaveToggle) onSaveToggle(post._id, !prev);
    } catch {
      setIsSaved(prev); // revert
      toast.error('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4">
      {/* Action Bar */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors group ${
            post.isLiked ? 'text-danger' : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${
            post.isLiked ? 'bg-danger/10' : 'group-hover:bg-white/5'
          }`}>
            {post.isLiked ? <RiHeart3Fill size={20} className="drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" /> : <RiHeart3Line size={20} />}
          </div>
          <span>{post.likesCount || 0}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors group ${
            showComments ? 'text-electric' : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${
            showComments ? 'bg-electric/10' : 'group-hover:bg-white/5'
          }`}>
            <RiChat3Line size={20} className={showComments ? 'drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]' : ''} />
          </div>
          <span>{post.commentsCount || 0}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors group"
        >
          <div className="p-1.5 rounded-full group-hover:bg-white/5 transition-colors">
            <RiShareForwardLine size={20} />
          </div>
        </button>

        {/* Bookmark */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors group ml-auto ${
            isSaved ? 'text-amber-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${
            isSaved ? 'bg-amber-400/10' : 'group-hover:bg-white/5'
          }`}>
            {isSaved ? <RiBookmarkFill size={20} className="drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" /> : <RiBookmarkLine size={20} />}
          </div>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/5 animate-in slide-in-from-top-2">
          <CommentList postId={post._id} />
        </div>
      )}
    </div>
  );
};

export default PostActions;
