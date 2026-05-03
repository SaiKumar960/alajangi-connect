import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../../services/api';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import styles from './SuggestedUsers.module.css';

const SuggestedUsers = ({ layout = 'vertical' }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await usersAPI.getSuggestedUsers();
        setUsers(data.users || []);
      } catch (err) {
        console.error('Failed to fetch suggestions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  const handleFollow = async (userId) => {
    try {
      await usersAPI.toggleFollow(userId);
      // Remove followed user from suggestions
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error('Follow failed', err);
    }
  };

  if (loading) return <div className={styles.loading}>Loading suggestions...</div>;
  if (users.length === 0) return null;

  const isHorizontal = layout === 'horizontal';

  return (
    <div className={`${styles.container} ${isHorizontal ? styles.horizontalContainer : ''}`}>
      <h3 className={styles.title}>Suggested for you</h3>
      <div className={isHorizontal ? styles.listHorizontal : styles.listVertical}>
        {users.map((user) => (
          <div key={user._id} className={isHorizontal ? styles.card : styles.itemRow}>
            <Link to={`/profile/${user._id}`} className={isHorizontal ? styles.cardInfo : styles.userInfo}>
              <Avatar src={user.avatar} name={user.name} size={isHorizontal ? 'lg' : 'md'} />
              <div className={styles.details}>
                <span className={styles.name}>{user.name}</span>
              </div>
            </Link>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => handleFollow(user._id)}
              className={isHorizontal ? styles.cardBtn : ''}
            >
              Follow
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
