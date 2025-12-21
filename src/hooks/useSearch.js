// FILE PATH: src/hooks/useSearch.js
// Custom hook for search operations - Alternative export

import { useContext } from 'react';
import SearchContext from '@/contexts/SearchContext';

/**
 * Custom hook to access search context
 * @returns {Object} Search context value with all search operations
 */
const useSearch = () => {
  const context = useContext(SearchContext);
  
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  
  return context;
};

export default useSearch;