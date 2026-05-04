import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopNav from '../../components/layout/TopNav';
import MobileNav from '../../components/layout/MobileNav';
import SuggestedUsers from '../../components/user/SuggestedUsers';
import Loader from '../../components/common/Loader';
import FloatingComposer from '../../components/composer/FloatingComposer';
import { RiSearchLine, RiFireLine, RiLineChartLine, RiCompass3Line } from 'react-icons/ri';
import { userAPI, postsAPI } from '../../services/api';

const Explore = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [trendingTopics, setTrendingTopics] = useState([
    { tag: '#GlobalTech', growth: '+124%', posts: '2.4k' },
    { tag: '#AlajangiConnect', growth: '+85%', posts: '1.2k' },
    { tag: '#Web3', growth: '+64%', posts: '850' },
    { tag: '#FuturisticDesign', growth: '+42%', posts: '620' },
    { tag: '#SocialMedia', growth: '+31%', posts: '540' },
  ]);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

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
                placeholder="Search users or explore topics..." 
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
          
          {/* Left/Main Column: Results or Trending */}
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
                    {searchResults.map(user => (
                      <div key={user._id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-electric/30 transition-all group">
                        <div className="flex items-center gap-4">
                          <img src={user.avatar || '/default-avatar.png'} alt={user.name} className="w-12 h-12 rounded-full border border-white/10" />
                          <div>
                            <h3 className="font-semibold text-white group-hover:text-electric transition-colors">{user.name}</h3>
                            <p className="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-xs">{user.bio || 'Network node active'}</p>
                          </div>
                        </div>
                        <button className="px-4 py-1.5 text-xs font-bold bg-white/5 hover:bg-electric text-white rounded-full border border-white/10 hover:border-electric transition-all">
                          View Node
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <section className="glass-panel rounded-3xl p-6 border border-white/5">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <RiFireLine className="text-danger" />
                  Trending Topics
                </h2>
                <div className="space-y-4">
                  {trendingTopics.map((topic, i) => (
                    <div key={topic.tag} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                      <div>
                        <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{topic.tag}</span>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{topic.posts} Posts shared</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-green-400 flex items-center gap-1 justify-end">
                          <RiLineChartLine />
                          {topic.growth}
                        </span>
                        <p className="text-[10px] text-gray-600 uppercase mt-1 font-mono">Growth Index</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Explore Feed Grid (Placeholder for more dynamic content) */}
            {!searchQuery && (
              <section className="glass-panel rounded-3xl p-6 border border-white/5">
                <h2 className="text-lg font-bold text-white mb-6">Discover New Content</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse flex items-center justify-center border border-white/5">
                      <RiCompass3Line size={32} className="text-gray-700" />
                    </div>
                  ))}
                </div>
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
