import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';
import { RiDeleteBin6Line } from 'react-icons/ri';

const CommentItem = ({ comment, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user?._id === comment.user?._id;

  return (
    <div className="group flex gap-3 animate-in fade-in slide-in-from-left-2 transition-all">
      <Link to={`/profile/${comment.user?._id}`} className="flex-shrink-0">
        <Avatar src={comment.user?.avatar} name={comment.user?.name} size="sm" />
      </Link>
      
      <div className="flex-1 min-w-0">
        <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none px-4 py-2 relative group-hover:bg-white/[0.08] transition-colors">
          <div className="flex items-center justify-between gap-2 mb-1">
            <Link 
              to={`/profile/${comment.user?._id}`} 
              className="text-sm font-bold text-white hover:text-cyan-400 transition-colors truncate"
            >
              {comment.user?.name}
            </Link>
            <span className="text-[10px] font-mono text-gray-500 uppercase">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-sm text-gray-300 break-words whitespace-pre-wrap">
            {comment.text}
          </p>

          {isOwner && (
            <button
              onClick={() => onDelete(comment._id)}
              className="absolute -right-2 -top-2 p-1.5 bg-void border border-white/10 rounded-full text-gray-500 hover:text-danger opacity-0 group-hover:opacity-100 transition-all shadow-xl"
              aria-label="Delete comment"
            >
              <RiDeleteBin6Line size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
