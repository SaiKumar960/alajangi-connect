import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import usePosts from '../../hooks/usePosts';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import TopNav from '../../components/layout/TopNav';
import MobileNav from '../../components/layout/MobileNav';
import DynamicFeed from '../../components/feed/DynamicFeed';
import AIInsightsPanel from '../../components/insights/AIInsightsPanel';
import FloatingComposer from '../../components/composer/FloatingComposer';
import Loader from '../../components/common/Loader';
import SuggestedUsers from '../../components/user/SuggestedUsers';
import { RiAddLine, RiGlobalLine, RiUserHeartLine } from 'react-icons/ri';

const Home = () => {
  const { user } = useAuth();
  const [feedFilter, setFeedFilter] = useState(''); // '' = For You, 'following' = Following
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const {
    posts, loading, hasMore, initialLoad, page,
    loadMore, addPostToFeed, toggleLike, removePost, editPost,
  } = usePosts(feedFilter);

  // Load feed when filter changes
  useEffect(() => { loadMore(1); }, [feedFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll sentinel
  const sentinelRef = useInfiniteScroll(
    () => { if (hasMore && !loading) loadMore(page); },
    hasMore && !initialLoad
  );

  const handleFilterChange = useCallback((filter) => {
    if (filter === feedFilter) return;
    setFeedFilter(filter);
  }, [feedFilter]);

  return (
    <div className="min-h-screen bg-void flex flex-col">
      <TopNav />
      
      {/* Background Neural Grid */}
      <div className="fixed inset-0 neural-bg opacity-30 pointer-events-none"></div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Center/Main: Feed */}
          <div className="lg:col-span-2 max-w-2xl mx-auto w-full">
            
            {/* Mobile Suggested Users */}
            <div className="lg:hidden mb-8">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 px-1">Suggested Users</h2>
              <SuggestedUsers layout="horizontal" />
            </div>

            {/* Feed Filter Tabs */}
            <div className="flex items-center gap-1 mb-6 p-1 bg-white/5 rounded-2xl border border-white/5">
              <button
                onClick={() => handleFilterChange('')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                  feedFilter === ''
                    ? 'bg-electric/20 text-electric border border-electric/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <RiGlobalLine size={16} />
                For You
              </button>
              <button
                onClick={() => handleFilterChange('following')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                  feedFilter === 'following'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <RiUserHeartLine size={16} />
                Following
              </button>
            </div>

            {/* Dynamic Feed Content */}
            {initialLoad ? (
              <Loader text="Loading your feed..." />
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-3xl border border-white/5">
                <div className="w-20 h-20 bg-electric/10 rounded-full flex items-center justify-center mb-6 text-electric">
                  <RiAddLine size={40} className="animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feedFilter === 'following' ? 'No posts from people you follow' : 'No posts yet'}
                </h3>
                <p className="text-gray-400 max-w-xs mx-auto">
                  {feedFilter === 'following'
                    ? 'Follow some users to see their posts here.'
                    : 'Be the first to share something with the community.'}
                </p>
                {feedFilter !== 'following' && (
                  <button 
                    onClick={() => setIsComposerOpen(true)}
                    className="mt-6 px-8 py-3 bg-electric text-white rounded-full font-medium hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all"
                  >
                    Create Post
                  </button>
                )}
              </div>
            ) : (
              <>
                <DynamicFeed 
                  posts={posts} 
                  onLike={toggleLike} 
                  onDelete={removePost}
                  onEdit={editPost}
                />

                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="h-20 flex items-center justify-center">
                  {loading && !initialLoad && (
                    <Loader inline text="Loading more posts..." />
                  )}
                  {!hasMore && posts.length > 0 && (
                    <div className="py-10 text-center">
                      <span className="text-xs font-mono text-gray-600 tracking-[0.3em] uppercase">No more posts</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right: AI Insights */}
          <div className="hidden lg:block">
            <AIInsightsPanel />
          </div>
        </div>
      </main>

      {/* Floating Composer Modal */}
      <FloatingComposer 
        isOpen={isComposerOpen} 
        onClose={() => setIsComposerOpen(false)} 
        onPostCreated={addPostToFeed}
      />

      {/* Desktop Floating Action Button */}
      <button 
        onClick={() => setIsComposerOpen(true)}
        className="hidden md:flex fixed bottom-10 right-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-electric to-cyan-500 items-center justify-center text-white shadow-2xl shadow-electric/40 hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <RiAddLine size={32} />
      </button>

      {/* Mobile Navigation */}
      <MobileNav onOpenComposer={() => setIsComposerOpen(true)} />
    </div>
  );
};

export default Home;
