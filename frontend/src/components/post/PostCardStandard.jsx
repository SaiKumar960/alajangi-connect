import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';
import PostActions from './PostActions';
import getMediaUrl from '../../utils/getMediaUrl';
import { postsAPI } from '../../services/api';
import { RiMoreFill, RiDeleteBin6Line, RiEditLine, RiCheckLine, RiCloseLine } from 'react-icons/ri';
import { useState } from 'react';
import toast from 'react-hot-toast';

const PostCardStandard = ({ post, onLike, onDelete, onEdit }) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [saving, setSaving] = useState(false);
  const isOwner = user?._id === post.author?._id;

  const handleSaveEdit = async () => {
    if (!editText.trim() || editText.trim() === post.text) {
      setEditing(false);
      setEditText(post.text);
      return;
    }
    setSaving(true);
    try {
      const { data } = await postsAPI.editPost(post._id, editText.trim());
      if (onEdit) onEdit(post._id, data.post);
      toast.success('Post updated');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditText(post.text);
  };

  return (
    <article className="glass-panel rounded-2xl p-4 sm:p-5 mb-4 group hover:glow-border transition-all duration-500 relative">
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-electric/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <Link to={`/profile/${post.author?._id}`} className="flex items-center gap-3 group/author">
            <Avatar src={post.author?.avatar} name={post.author?.name} size="md" />
            <div>
              <h3 className="font-semibold text-white group-hover/author:text-cyan-400 transition-colors">
                {post.author?.name}
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </Link>

          {/* Options Menu */}
          {isOwner && (
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <RiMoreFill size={20} />
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)}></div>
                  <div className="absolute right-0 mt-1 w-36 glass-panel border border-white/10 rounded-xl shadow-xl z-40 overflow-hidden animate-in slide-in-from-top-2">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setEditing(true);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                    >
                      <RiEditLine />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(post._id);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors"
                    >
                      <RiDeleteBin6Line />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Content — editable or static */}
        {editing ? (
          <div className="mb-4">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm resize-none focus:outline-none focus:border-electric/50 transition-colors min-h-[80px]"
              maxLength={2000}
              autoFocus
            />
            <div className="flex items-center gap-2 mt-2 justify-end">
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors"
              >
                <RiCloseLine size={14} /> Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving || !editText.trim()}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-electric hover:bg-electric/80 rounded-lg transition-colors disabled:opacity-50"
              >
                <RiCheckLine size={14} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-4 whitespace-pre-wrap">
            {post.text}
          </p>
        )}

        {/* Media */}
        {post.imageUrl && (
          <div className="relative rounded-xl overflow-hidden border border-white/5 mb-4 group/media">
            <img 
              src={getMediaUrl(post.imageUrl)} 
              alt="Post attachment" 
              className="w-full max-h-[500px] object-cover bg-black/50"
              loading="lazy"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none"></div>
          </div>
        )}

        {/* Actions */}
        <PostActions post={post} onLike={onLike} />
      </div>
    </article>
  );
};

export default PostCardStandard;
