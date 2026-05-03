import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RiHome5Line, RiHome5Fill, RiUser3Line, RiUser3Fill, RiAddBoxLine, RiAddBoxFill } from 'react-icons/ri';
import { useAuth } from '../../hooks/useAuth';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isHome = location.pathname === '/';
  const isProfile = location.pathname === `/profile/${user._id}`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={styles.bottomNav} aria-label="Mobile bottom navigation">
      <div className={styles.navInner}>
        <Link 
          to="/" 
          className={`${styles.navItem} ${isHome ? styles.active : ''}`}
          onClick={isHome ? scrollToTop : undefined}
          aria-label="Home"
        >
          {isHome ? <RiHome5Fill size={26} /> : <RiHome5Line size={26} />}
        </Link>
        
        <button 
          className={styles.createBtn}
          onClick={() => {
            if (!isHome) {
              window.location.href = '/'; // Go home to create post
            } else {
              const input = document.getElementById('post-text-input');
              if (input) {
                scrollToTop();
                input.focus();
              }
            }
          }}
          aria-label="Create Post"
        >
          {isHome ? <RiAddBoxFill size={28} /> : <RiAddBoxLine size={28} />}
        </button>

        <Link 
          to={`/profile/${user._id}`} 
          className={`${styles.navItem} ${isProfile ? styles.active : ''}`}
          onClick={isProfile ? scrollToTop : undefined}
          aria-label="My Profile"
        >
          {isProfile ? <RiUser3Fill size={26} /> : <RiUser3Line size={26} />}
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
