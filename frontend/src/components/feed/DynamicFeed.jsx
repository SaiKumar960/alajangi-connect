import React from 'react';
import FeedSection from './FeedSection';
import PostCardStandard from '../post/PostCardStandard';
import PostCardCompact from '../post/PostCardCompact';
import PostCardHighlight from '../post/PostCardHighlight';
import { RiFireLine, RiRobot2Line, RiVoiceprintLine } from 'react-icons/ri';

const DynamicFeed = ({ posts, onLike, onDelete, onEdit }) => {
  if (!posts || posts.length === 0) return null;

  // Split logic:
  // 1. Trending (first 2 posts) -> 1 Highlight + 1 Standard (or just 1 Highlight)
  // 2. AI Recommends (next 4 posts) -> Standard
  // 3. Fresh Voices (rest) -> Compact

  const trendingPosts = posts.slice(0, 2);
  const aiRecommendsPosts = posts.slice(2, 6);
  const freshVoicesPosts = posts.slice(6);

  return (
    <div className="w-full">
      {/* 1. Trending Now */}
      {trendingPosts.length > 0 && (
        <FeedSection title="Trending Now" icon={RiFireLine} layout="spotlight">
          {trendingPosts[0] && (
            <PostCardHighlight post={trendingPosts[0]} onLike={onLike} onDelete={onDelete} />
          )}
          {trendingPosts[1] && (
            <PostCardStandard post={trendingPosts[1]} onLike={onLike} onDelete={onDelete} onEdit={onEdit} />
          )}
        </FeedSection>
      )}

      {/* 2. Recommended for You */}
      {aiRecommendsPosts.length > 0 && (
        <FeedSection title="Recommended for You" icon={RiRobot2Line} layout="list">
          {aiRecommendsPosts.map(post => (
            <PostCardStandard key={post._id} post={post} onLike={onLike} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </FeedSection>
      )}

      {/* 3. Recent Posts */}
      {freshVoicesPosts.length > 0 && (
        <FeedSection title="Recent Posts" icon={RiVoiceprintLine} layout="masonry">
          {freshVoicesPosts.map(post => (
            <PostCardCompact key={post._id} post={post} onLike={onLike} onDelete={onDelete} />
          ))}
        </FeedSection>
      )}
    </div>
  );
};

export default DynamicFeed;
