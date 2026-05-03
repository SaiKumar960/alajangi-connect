import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RiHome5Line, RiHome5Fill, RiCompass3Line, RiCompass3Fill, RiAddLine, RiUser3Line, RiUser3Fill } from 'react-icons/ri';

const MobileNav = ({ onOpenComposer }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isHome = location.pathname === '/';
  const isProfile = location.pathname === `/profile/${user._id}`;
  // For demo, Explore just routes to home but shows different active state visually if we had the route
  const isExplore = location.pathname === '/explore'; 

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const NavItem = ({ to, isActive, iconLine, iconFill, label }) => {
    return (
      <Link 
        to={to} 
        className="relative flex flex-col items-center justify-center w-16 h-full group"
        onClick={isActive ? scrollToTop : undefined}
      >
        <div className="relative z-10 text-gray-400 group-hover:text-white transition-colors duration-300">
          {isActive ? iconFill : iconLine}
        </div>
        {isActive && (
          <>
            <span className="absolute -bottom-1 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
            <div className="absolute inset-0 bg-cyan-400/10 rounded-full blur-md opacity-50"></div>
          </>
        )}
      </Link>
    );
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 z-50 glass-panel border-t border-white/10 pb-safe">
      <div className="flex items-center justify-around h-full px-2">
        
        <NavItem 
          to="/" 
          isActive={isHome} 
          iconLine={<RiHome5Line size={24} />} 
          iconFill={<RiHome5Fill size={24} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />} 
          label="Home"
        />

        <NavItem 
          to="/explore" 
          isActive={isExplore} 
          iconLine={<RiCompass3Line size={24} />} 
          iconFill={<RiCompass3Fill size={24} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />} 
          label="Explore"
        />

        {/* Center FAB */}
        <div className="relative -top-5">
          <div className="absolute inset-0 bg-electric/30 rounded-full blur-lg"></div>
          <button 
            onClick={onOpenComposer}
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-electric to-cyan-500 text-white shadow-lg shadow-electric/30 hover:scale-105 active:scale-95 transition-all"
            aria-label="Create Post"
          >
            <RiAddLine size={28} />
          </button>
        </div>

        {/* Spacer for FAB */}
        <div className="w-4"></div>

        <NavItem 
          to={`/profile/${user._id}`} 
          isActive={isProfile} 
          iconLine={<RiUser3Line size={24} />} 
          iconFill={<RiUser3Fill size={24} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />} 
          label="Profile"
        />

      </div>
    </nav>
  );
};

export default MobileNav;
