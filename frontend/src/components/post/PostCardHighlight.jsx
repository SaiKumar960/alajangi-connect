import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import PostActions from './PostActions';
import getMediaUrl from '../../utils/getMediaUrl';

// This variant is used for the very top "Trending" post
const PostCardHighlight = ({ post, onLike, onDelete }) => {
  return (
    <article className="relative rounded-2xl overflow-hidden mb-6 group glow-border-intense">
      {/* Background Image with Overlay */}
      {post.imageUrl ? (
        <div className="absolute inset-0">
          <img 
            src={getMediaUrl(post.imageUrl)} 
            alt="Background" 
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/80 to-transparent"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-electric/20 to-cyan-500/10 neural-bg"></div>
      )}

      {/* Content */}
      <div className="relative z-10 p-5 sm:p-6 sm:pt-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 bg-electric/20 text-electric text-[10px] font-bold uppercase tracking-wider rounded border border-electric/30">
            Top Trend
          </span>
          <span className="text-xs text-gray-400 font-mono">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>

        <p className="text-white text-lg sm:text-xl font-medium leading-relaxed mb-6 line-clamp-4 glow-text text-balance">
          {post.text}
        </p>

        <div className="flex items-center justify-between">
          <Link to={`/profile/${post.author?._id}`} className="flex items-center gap-3">
            <Avatar src={post.author?.avatar} name={post.author?.name} size="md" />
            <div>
              <h3 className="font-medium text-white text-sm">{post.author?.name}</h3>
            </div>
          </Link>
          
          <div className="bg-void/50 rounded-xl px-2 backdrop-blur-md border border-white/5">
            <PostActions post={post} onLike={onLike} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCardHighlight;
