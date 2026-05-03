import { useEffect, useState } from 'react';
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
import { RiAddLine } from 'react-icons/ri';

const Home = () => {
  const { user } = useAuth();
  const {
    posts, loading, hasMore, initialLoad, page,
    loadMore, addPostToFeed, toggleLike, removePost,
  } = usePosts();

  const [isComposerOpen, setIsComposerOpen] = useState(false);

  // Initial load
  useEffect(() => { loadMore(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll sentinel
  const sentinelRef = useInfiniteScroll(
    () => { if (hasMore && !loading) loadMore(page); },
    hasMore && !initialLoad
  );

  return (
    <div className="min-h-screen bg-void flex flex-col">
      <TopNav />
      
      {/* Background Neural Grid */}
      <div className="fixed inset-0 neural-bg opacity-30 pointer-events-none"></div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-20 md:pb-8 flex gap-8 relative z-10">
        
        {/* Left spacing for centering if no panel */}
        <div className="hidden lg:block w-0 xl:w-20"></div>

        {/* Center: Feed */}
        <div className="flex-1 max-w-2xl">
          
          {/* Mobile Suggested Users */}
          <div className="lg:hidden mb-8">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 px-1">Network Recommendations</h2>
            <SuggestedUsers layout="horizontal" />
          </div>

          {/* Dynamic Feed Content */}
          {initialLoad ? (
            <Loader text="Syncing with the neural network..." />
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-3xl border border-white/5">
              <div className="w-20 h-20 bg-electric/10 rounded-full flex items-center justify-center mb-6 text-electric">
                <RiAddLine size={40} className="animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">The network is quiet</h3>
              <p className="text-gray-400 max-w-xs mx-auto">Be the first to transmit a thought into the void.</p>
              <button 
                onClick={() => setIsComposerOpen(true)}
                className="mt-6 px-8 py-3 bg-electric text-white rounded-full font-medium hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all"
              >
                Start Transmission
              </button>
            </div>
          ) : (
            <>
              <DynamicFeed 
                posts={posts} 
                onLike={toggleLike} 
                onDelete={removePost} 
              />

              {/* Infinite scroll sentinel */}
              <div ref={sentinelRef} className="h-20 flex items-center justify-center">
                {loading && !initialLoad && (
                  <Loader inline text="Fetching more frequencies..." />
                )}
                {!hasMore && posts.length > 0 && (
                  <div className="py-10 text-center">
                    <span className="text-xs font-mono text-gray-600 tracking-[0.3em] uppercase">End of transmission</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right: AI Insights */}
        <AIInsightsPanel />

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
