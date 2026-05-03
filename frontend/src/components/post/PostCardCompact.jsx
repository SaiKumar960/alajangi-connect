import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import PostActions from './PostActions';
import getMediaUrl from '../../utils/getMediaUrl';

// This variant is used for the "Fresh Voices" section
// It's smaller, text-focused, with media acting as a small thumbnail
const PostCardCompact = ({ post, onLike, onDelete }) => {
  return (
    <article className="glass-panel border-l-2 border-l-cyan-500 rounded-r-xl rounded-l-sm p-3 sm:p-4 mb-3 group hover:bg-white/5 transition-colors relative overflow-hidden">
      
      <div className="flex gap-3">
        {/* Left side: Avatar */}
        <div className="flex-shrink-0">
          <Avatar src={post.author?.avatar} name={post.author?.name} size="sm" />
        </div>

        {/* Right side: Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link to={`/profile/${post.author?._id}`} className="font-medium text-sm text-white hover:text-cyan-400 truncate transition-colors">
              {post.author?.name}
            </Link>
            <span className="text-[10px] text-gray-500 font-mono">
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </span>
          </div>

          <div className="flex gap-3">
            <p className="text-gray-300 text-sm line-clamp-3 flex-1 break-words">
              {post.text}
            </p>
            {post.imageUrl && (
              <img 
                src={getMediaUrl(post.imageUrl)} 
                alt="Thumbnail" 
                className="w-16 h-16 rounded-lg object-cover border border-white/10 flex-shrink-0"
              />
            )}
          </div>

          <div className="mt-1 scale-90 origin-left">
            <PostActions post={post} onLike={onLike} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCardCompact;
