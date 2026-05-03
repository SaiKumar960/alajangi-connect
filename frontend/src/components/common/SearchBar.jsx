import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiSearchLine, RiCloseLine, RiHistoryLine } from 'react-icons/ri';

const SearchBar = ({ onSearch, placeholder = 'Search...', className = '' }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  
  // Basic debounce if an onSearch prop is provided
  useEffect(() => {
    const handler = setTimeout(() => {
      if (onSearch) onSearch(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query, onSearch]);

  const clearSearch = () => {
    setQuery('');
    if (onSearch) onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-electric/20 rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>
        <div className="relative flex items-center bg-surface border border-white/10 rounded-full overflow-hidden focus-within:border-electric/50 transition-colors h-10">
          <span className="pl-3 text-gray-400 group-focus-within:text-electric transition-colors">
            <RiSearchLine size={18} />
          </span>
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-white px-3 py-2 text-sm focus:outline-none placeholder-gray-500"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />
          {query && (
            <button
              onClick={clearSearch}
              className="pr-3 text-gray-500 hover:text-white transition-colors"
            >
              <RiCloseLine size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
