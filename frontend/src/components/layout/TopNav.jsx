import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';
import { RiSearchLine, RiNotification3Line, RiMenu3Line, RiLogoutBoxRLine } from 'react-icons/ri';

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 glass-panel border-b border-white/10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group relative"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="absolute -inset-2 bg-electric/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <img src="/logo.png" alt="Alajangi Logo" className="w-10 h-10 object-contain relative z-10 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
          <span className="hidden md:block font-sans font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Alajangi
          </span>
        </Link>

        {/* Center: Smart Search */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative group">
            <div className="absolute inset-0 bg-electric/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center bg-void/80 border border-white/10 rounded-full overflow-hidden focus-within:border-electric/50 transition-colors">
              <span className="pl-4 text-gray-400"><RiSearchLine size={18} /></span>
              <input 
                type="text" 
                placeholder="Search Alajangi Connect..." 
                className="w-full bg-transparent border-none text-sm text-white px-3 py-2.5 focus:outline-none placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <div className="pr-2 hidden lg:flex items-center gap-1">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-white/5 border border-white/10 rounded">⌘</kbd>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-white/5 border border-white/10 rounded">K</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Mobile Search Toggle */}
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <RiSearchLine size={22} />
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-electric transition-colors group">
            <div className="absolute inset-0 bg-electric/10 rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
            <RiNotification3Line size={22} className="relative z-10" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button 
              className="relative rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-electric focus:ring-offset-2 focus:ring-offset-void transition-all"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <Avatar src={user?.avatar} name={user?.name} size="sm" className="border-2 border-transparent hover:border-electric transition-colors" />
            </button>

            {/* Dropdown */}
            {isProfileMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsProfileMenuOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel border border-white/10 shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all">
                  <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                    <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link 
                      to={`/profile/${user?._id}`}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      View Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors flex items-center gap-2"
                    >
                      <RiLogoutBoxRLine />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (Expandable) */}
      {isSearchOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 p-3 glass-panel border-b border-white/10 shadow-lg animate-in slide-in-from-top-2">
          <div className="relative flex items-center bg-void/80 border border-electric/30 rounded-full overflow-hidden">
            <span className="pl-4 text-electric"><RiSearchLine size={18} /></span>
            <input 
              type="text" 
              placeholder="Search..." 
              autoFocus
              className="w-full bg-transparent border-none text-sm text-white px-3 py-2 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNav;
