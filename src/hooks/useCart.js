// FILE PATH: src/hooks/useCart.js
// Custom hook for cart operations

import { useContext } from 'react';
import CartContext from '@/contexts/CartContext';

/**
 * Custom hook to access cart context
 * @returns {Object} Cart context value with all cart operations
 */
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};