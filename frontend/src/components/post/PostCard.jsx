import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RiHeartLine, RiHeartFill, RiChat3Line, RiDeleteBinLine, RiMoreLine,
} from 'react-icons/ri';
import { useAuth } from '../../hooks/useAuth';
import { postsAPI } from '../../services/api';
import { timeAgo } from '../../utils/formatDate';
import CommentList from './CommentList';
import Avatar from '../common/Avatar';
import { motion } from 'framer-motion';
import styles from './PostCard.module.css';
import toast from 'react-hot-toast';

const PostCard = ({ post, onLike, onDelete }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user?._id === post.author?._id;
  // Avatar handles fallback automatically

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    setDeleting(true);
    try {
      await postsAPI.deletePost(post._id);
      toast.success('Post deleted');
      onDelete?.(post._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete post');
    } finally {
      setDeleting(false);
      setMenuOpen(false);
    }
  };

  return (
    <motion.article 
      className={styles.card} 
      aria-label={`Post by ${post.author?.name}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <header className={styles.header}>
        <Link to={`/profile/${post.author?._id}`} className={styles.authorLink}>
          <Avatar src={post.author?.avatar} name={post.author?.name} size="md" />
          <div>
            <p className={styles.authorName}>{post.author?.name}</p>
            <time className={styles.time} dateTime={post.createdAt}>
              {timeAgo(post.createdAt)}
            </time>
          </div>
        </Link>

        {isOwner && (
          <div className={styles.menuWrapper}>
            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Post options"
              aria-haspopup="true"
            >
              <RiMoreLine size={20} />
            </button>
            {menuOpen && (
              <div className={styles.menu}>
                <button
                  className={`${styles.menuItem} ${styles.deleteItem}`}
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <RiDeleteBinLine size={15} />
                  {deleting ? 'Deleting…' : 'Delete Post'}
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Body */}
      <div className={styles.body}>
        <p className={styles.text}>{post.text}</p>
        {post.imageUrl && (
          <div className={styles.imageWrapper}>
            <img
              src={post.imageUrl}
              alt="Post media"
              className={styles.postImage}
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <footer className={styles.actions}>
        <button
          id={`like-btn-${post._id}`}
          className={`${styles.actionBtn} ${post.isLiked ? styles.liked : ''}`}
          onClick={() => onLike?.(post._id)}
          aria-label={post.isLiked ? 'Unlike post' : 'Like post'}
          aria-pressed={post.isLiked}
        >
          {post.isLiked
            ? <RiHeartFill size={19} className={styles.heartFilled} />
            : <RiHeartLine size={19} />}
          <span>{post.likesCount ?? post.likes?.length ?? 0}</span>
        </button>

        <button
          id={`comment-btn-${post._id}`}
          className={styles.actionBtn}
          onClick={() => setShowComments((v) => !v)}
          aria-expanded={showComments}
          aria-label="Toggle comments"
        >
          <RiChat3Line size={19} />
          <span>{post.commentsCount ?? 0}</span>
        </button>
      </footer>

      {/* Comment section */}
      {showComments && (
        <div className={styles.commentsSection}>
          <CommentList postId={post._id} />
        </div>
      )}
    </motion.article>
  );
};

export default PostCard;
