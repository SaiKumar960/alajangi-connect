import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RiUser3Line, RiHome5Line, RiInformationLine } from 'react-icons/ri';
import SuggestedUsers from '../user/SuggestedUsers';
import Avatar from '../common/Avatar';
import styles from './Sidebar.module.css';

const Sidebar = ({ position = 'left' }) => {
  const { user } = useAuth();
  // Avatar handles fallback automatically

  if (position === 'right') {
    return (
      <aside className={styles.sidebar} aria-label="Info sidebar">
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>About Alajangi Connect</h4>
          <p className={styles.cardText}>
            A community for sharing ideas, moments, and conversations. Built for everyone.
          </p>
          <hr className="divider" />
          <div className={styles.links}>
            <a href="#" className={styles.link}><RiInformationLine size={14} /> Help Center</a>
          </div>
          <p className={styles.copy}>© 2026 Alajangi Connect</p>
        </div>
        <SuggestedUsers />
      </aside>
    );
  }

  return (
    <aside className={styles.sidebar} aria-label="Navigation sidebar">
      {/* Profile card */}
      <div className={styles.profileCard}>
        <Avatar src={user?.avatar} name={user?.name} size="lg" className={styles.avatar} />
        <div>
          <p className={styles.profileName}>{user?.name}</p>
          <p className={styles.profileEmail}>{user?.email}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <Link to="/" className={styles.navItem}>
          <RiHome5Line size={20} />
          Home
        </Link>
        <Link to={`/profile/${user?._id}`} className={styles.navItem}>
          <RiUser3Line size={20} />
          My Profile
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
