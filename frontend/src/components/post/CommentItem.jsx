import { timeAgo } from '../../utils/formatDate';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RiDeleteBinLine } from 'react-icons/ri';
import Avatar from '../common/Avatar';
import { motion } from 'framer-motion';
import styles from './CommentItem.module.css';

const CommentItem = ({ comment, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user?._id === comment.author?._id;
  // Avatar handles fallback automatically

  return (
    <motion.div 
      className={styles.comment}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/profile/${comment.author?._id}`}>
        <Avatar src={comment.author?.avatar} name={comment.author?.name} size="sm" className={styles.avatar} />
      </Link>
      <div className={styles.bubble}>
        <div className={styles.meta}>
          <Link to={`/profile/${comment.author?._id}`} className={styles.authorName}>
            {comment.author?.name}
          </Link>
          <time className={styles.time}>{timeAgo(comment.createdAt)}</time>
        </div>
        <p className={styles.text}>{comment.text}</p>
      </div>
      {isOwner && (
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete?.(comment._id)}
          aria-label="Delete comment"
          title="Delete"
        >
          <RiDeleteBinLine size={14} />
        </button>
      )}
    </motion.div>
  );
};

export default CommentItem;
