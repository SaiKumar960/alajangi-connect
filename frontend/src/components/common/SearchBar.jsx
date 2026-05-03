import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { RiSearchLine } from 'react-icons/ri';
import { usersAPI } from '../../services/api';
import Avatar from './Avatar';
import styles from './SearchBar.module.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      setLoading(true);
      try {
        const { data } = await usersAPI.searchUsers(query);
        setResults(data.users || []);
        setIsOpen(true);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <div className={styles.inputWrapper}>
        <RiSearchLine className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.trim()) setIsOpen(true); }}
        />
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {loading ? (
            <div className={styles.empty}>Searching...</div>
          ) : results.length > 0 ? (
            results.map((user) => (
              <Link
                key={user._id}
                to={`/profile/${user._id}`}
                className={styles.resultItem}
                onClick={() => setIsOpen(false)}
              >
                <Avatar src={user.avatar} name={user.name} size="sm" />
                <div className={styles.resultInfo}>
                  <span className={styles.resultName}>{user.name}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.empty}>No users found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
