// FILE PATH: src/components/customer/SearchBar.jsx
// Search Bar Component with autocomplete and suggestions

import { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@/contexts/SearchContext';
import useDebounce from '@/hooks/useDebounce';

const SearchBar = ({ className = '', onSearch }) => {
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    suggestions,
    recentSearches,
    trendingSearches,
    addRecentSearch,
    clearRecentSearches
  } = useSearch();
  
  // Local state
  const [isFocused, setIsFocused] = useState(false);
  const [localTerm, setLocalTerm] = useState(searchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Refs
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  
  // Debounce search term
  const debouncedTerm = useDebounce(localTerm, 300);
  
  // Update search context when debounced term changes
  useEffect(() => {
    if (debouncedTerm) {
      setSearchTerm(debouncedTerm);
    }
  }, [debouncedTerm, setSearchTerm]);
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalTerm(value);
    setShowSuggestions(true);
  };
  
  // Handle search submit
  const handleSearch = (term = localTerm) => {
    if (!term.trim()) return;
    
    addRecentSearch(term);
    setSearchTerm(term);
    setShowSuggestions(false);
    
    if (onSearch) {
      onSearch(term);
    } else {
      navigate(`/shop?search=${encodeURIComponent(term)}`);
    }
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setLocalTerm(suggestion);
    handleSearch(suggestion);
  };
  
  // Handle clear
  const handleClear = () => {
    setLocalTerm('');
    setSearchTerm('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };
  
  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };
  
  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div
        className={`
          relative flex items-center bg-white rounded-full border-2 
          transition-all duration-200
          ${isFocused 
            ? 'border-orange-500 shadow-lg shadow-orange-500/20' 
            : 'border-gray-200 hover:border-gray-300'
          }
        `}
      >
        {/* Search Icon */}
        <div className="pl-4 pr-2">
          <Search className={`w-5 h-5 transition-colors ${isFocused ? 'text-orange-500' : 'text-gray-400'}`} />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={localTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search products, categories..."
          className="flex-1 py-3 px-2 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
        />

        {/* Clear Button */}
        {localTerm && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={handleClear}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </motion.button>
        )}

        {/* Search Button */}
        <button
          onClick={() => handleSearch()}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 mr-1"
        >
          Search
        </button>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (isFocused || localTerm) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {/* Search Suggestions (if typing) */}
            {localTerm && suggestions.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-orange-50 rounded-lg transition-colors text-left group"
                  >
                    <Search className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    <span className="text-sm text-gray-700 group-hover:text-orange-600">
                      {suggestion}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!localTerm && recentSearches.length > 0 && (
              <div className="p-2 border-t border-gray-100">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase">
                    Recent Searches
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-orange-50 rounded-lg transition-colors text-left group"
                  >
                    <Clock className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    <span className="text-sm text-gray-700 group-hover:text-orange-600">
                      {search}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Trending Searches */}
            {!localTerm && trendingSearches.length > 0 && (
              <div className="p-2 border-t border-gray-100">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Trending Searches
                </div>
                {trendingSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-orange-50 rounded-lg transition-colors text-left group"
                  >
                    <TrendingUp className="w-4 h-4 text-orange-500 group-hover:text-orange-600 transition-colors" />
                    <span className="text-sm text-gray-700 group-hover:text-orange-600">
                      {search}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {localTerm && suggestions.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-2">No suggestions found</p>
                <p className="text-xs text-gray-400">
                  Try searching for something else
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;