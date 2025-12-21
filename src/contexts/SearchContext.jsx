// FILE PATH: src/contexts/SearchContext.jsx
// Search Context - Manages search state and history

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { searchProducts } from '@/services/product.service';

// Create Search Context
const SearchContext = createContext();

// Custom hook to use search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
};

// Trending searches (mock data - replace with real data)
const TRENDING_SEARCHES = [
  'Fresh Vegetables',
  'Dairy Products',
  'Snacks',
  'Beverages',
  'Rice & Pulses'
];

// Search Provider Component
export const SearchProvider = ({ children }) => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches] = useState(TRENDING_SEARCHES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sarsar_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);
  
  // Save recent searches to localStorage
  useEffect(() => {
    localStorage.setItem('sarsar_recent_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);
  
  // Generate suggestions based on search term
  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      // Simple suggestion logic - in real app, use API
      const allTerms = [...trendingSearches, ...recentSearches];
      const filtered = allTerms.filter(term =>
        term.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions([...new Set(filtered)].slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, trendingSearches, recentSearches]);
  
  /**
   * Perform search
   */
  const performSearch = useCallback(async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await searchProducts(term);
      setSearchResults(results);
      addRecentSearch(term);
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Add to recent searches
   */
  const addRecentSearch = useCallback((term) => {
    if (!term.trim()) return;
    
    setRecentSearches(prev => {
      // Remove if already exists
      const filtered = prev.filter(s => s.toLowerCase() !== term.toLowerCase());
      // Add to beginning and limit to 10
      return [term, ...filtered].slice(0, 10);
    });
  }, []);
  
  /**
   * Clear recent searches
   */
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('sarsar_recent_searches');
  }, []);
  
  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setSuggestions([]);
    setError(null);
  }, []);
  
  // Context value
  const value = {
    searchTerm,
    setSearchTerm,
    searchResults,
    suggestions,
    recentSearches,
    trendingSearches,
    loading,
    error,
    performSearch,
    addRecentSearch,
    clearRecentSearches,
    clearSearch
  };
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;