import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import TopNav from '../../components/layout/TopNav';
import MobileNav from '../../components/layout/MobileNav';
import SuggestedUsers from '../../components/user/SuggestedUsers';
import Loader from '../../components/common/Loader';
import Avatar from '../../components/common/Avatar';
import PostCardCompact from '../../components/post/PostCardCompact';
import FloatingComposer from '../../components/composer/FloatingComposer';
import { RiSearchLine, RiCompass3Line } from 'react-icons/ri';
import { userAPI, postsAPI } from '../../services/api';

const Explore = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [explorePosts, setExplorePosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  // Load explore posts on mount
  useEffect(() => {
    const fetchExplorePosts = async () => {
      try {
        const { data } = await postsAPI.getFeed(1, 12);
        setExplorePosts(data.posts || []);
      } catch (err) {
        console.error('Failed to load explore posts', err);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchExplorePosts();
  }, []);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const { data } = await userAPI.searchUsers(query);
      setSearchResults(data.users);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLike = async (postId) => {
    setExplorePosts(prev => prev.map(p => {
      if (p._id !== postId) return p;
      return { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 };
    }));
    try {
      await postsAPI.toggleLike(postId);
    } catch { /* revert handled by optimistic UI */ }
  };

  return (
    <div className="min-h-screen bg-void flex flex-col">
      <TopNav />
      <div className="fixed inset-0 neural-bg opacity-20 pointer-events-none"></div>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 pt-24 pb-24 relative z-10">
        
        {/* Search Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-white mb-6 glow-text flex items-center justify-center gap-3">
            <RiCompass3Line className="text-electric" />
            Explore the Network
          </h1>
          
          <div className="relative max-w-xl mx-auto group">
            <div className="absolute inset-0 bg-electric/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center bg-surface/80 border border-white/10 rounded-2xl overflow-hidden focus-within:border-electric/50 transition-all duration-300">
              <span className="pl-5 text-gray-400">
                <RiSearchLine size={24} />
              </span>
              <input 
                type="text" 
                placeholder="Search users..." 
                className="w-full bg-transparent border-none text-white px-4 py-4 focus:outline-none placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left/Main Column */}
          <div className="md:col-span-2 space-y-8">
            
            {searchQuery ? (
              <section className="glass-panel rounded-3xl p-6 border border-white/5 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <RiSearchLine className="text-cyan-400" />
                  Search Results
                </h2>
                
                {isSearching ? (
                  <Loader inline text="Scanning records..." />
                ) : searchResults.length === 0 ? (
                  <div className="py-12 text-center text-gray-500 font-mono text-sm uppercase tracking-widest">
                    No matching users found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {searchResults.map(u => (
                      <Link key={u._id} to={`/profile/${u._id}`} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-electric/30 transition-all group">
                        <div className="flex items-center gap-4">
                          <Avatar src={u.avatar} name={u.name} size="md" />
                          <div>
                            <h3 className="font-semibold text-white group-hover:text-electric transition-colors">{u.name}</h3>
                            <p className="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-xs">{u.bio || 'Alajangi member'}</p>
                          </div>
                        </div>
                        <span className="px-4 py-1.5 text-xs font-bold bg-white/5 text-gray-300 rounded-full border border-white/10 group-hover:border-electric group-hover:text-electric transition-all">
                          View
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <section className="glass-panel rounded-3xl p-6 border border-white/5">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <RiCompass3Line className="text-electric" />
                  Discover
                </h2>
                {loadingPosts ? (
                  <Loader inline text="Loading posts..." />
                ) : explorePosts.length === 0 ? (
                  <div className="py-12 text-center text-gray-500 font-mono text-sm uppercase tracking-widest">
                    No posts to explore yet
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {explorePosts.map(post => (
                      <PostCardCompact key={post._id} post={post} onLike={handleLike} onDelete={() => {}} />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Right Column: Suggestions */}
          <div className="space-y-8">
            <section className="glass-panel rounded-3xl p-6 border border-white/5 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-6">Suggested Users</h2>
              <SuggestedUsers layout="vertical" />
            </section>
          </div>

        </div>
      </main>

      <FloatingComposer 
        isOpen={isComposerOpen} 
        onClose={() => setIsComposerOpen(false)} 
        onPostCreated={() => {}}
      />
      
      <MobileNav onOpenComposer={() => setIsComposerOpen(true)} />
    </div>
  );
};

export default Explore;
