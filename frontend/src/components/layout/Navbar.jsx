import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { RiHome5Line, RiHome5Fill, RiUser3Line, RiLogoutBoxLine, RiMenuLine, RiCloseLine } from 'react-icons/ri';
import Avatar from '../common/Avatar';
import SearchBar from '../common/SearchBar';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isHome = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Avatar now handles its own fallback

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo} aria-label="Alajangi Connect home">
          <span className={styles.logoMark}>AC</span>
          <span className={styles.logoText}>Alajangi Connect</span>
        </Link>

        {/* Search Bar */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <SearchBar />
        </div>

        {/* Nav links */}
        <div className={styles.navLinks}>
          <Link
            to="/"
            className={`${styles.navLink} ${isHome ? styles.active : ''}`}
            aria-current={isHome ? 'page' : undefined}
          >
            {isHome ? <RiHome5Fill size={20} /> : <RiHome5Line size={20} />}
            <span>Home</span>
          </Link>
        </div>

        {/* Right: user menu */}
        <div className={styles.userArea} ref={menuRef}>
          <button
            id="user-menu-btn"
            className={styles.avatarBtn}
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-label="User menu"
          >
            <Avatar src={user?.avatar} name={user?.name} size="sm" className={styles.avatarImg} />
            <span className={styles.userName}>{user?.name}</span>
            <span className={styles.chevron}>{menuOpen ? '▲' : '▼'}</span>
          </button>

          {menuOpen && (
            <div className={styles.dropdown} role="menu">
              <Link
                to={`/profile/${user?._id}`}
                className={styles.dropdownItem}
                role="menuitem"
                onClick={() => setMenuOpen(false)}
              >
                <RiUser3Line size={16} />
                My Profile
              </Link>
              <hr className={styles.dropdownDivider} />
              <button
                className={`${styles.dropdownItem} ${styles.logoutItem}`}
                role="menuitem"
                onClick={handleLogout}
              >
                <RiLogoutBoxLine size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
