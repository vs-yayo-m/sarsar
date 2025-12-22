// FILE PATH: src/hooks/useProducts.js
// Custom hook for fetching and managing products

import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let q = collection(db, 'products');
        
        // Apply filters if provided
        const constraints = [];
        
        if (filters.category) {
          constraints.push(where('category', '==', filters.category));
        }
        
        if (filters.supplierId) {
          constraints.push(where('supplierId', '==', filters.supplierId));
        }
        
        if (filters.featured) {
          constraints.push(where('featured', '==', true));
        }
        
        if (filters.active !== undefined) {
          constraints.push(where('active', '==', filters.active));
        }
        
        // Apply sorting
        if (filters.sortBy) {
          constraints.push(orderBy(filters.sortBy, filters.sortOrder || 'asc'));
        }
        
        // Apply limit
        if (filters.limit) {
          constraints.push(limit(filters.limit));
        }
        
        // Build query with constraints
        if (constraints.length > 0) {
          q = query(q, ...constraints);
        }
        
        const snapshot = await getDocs(q);
        const productsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setProducts(productsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [
    filters.category,
    filters.supplierId,
    filters.featured,
    filters.active,
    filters.sortBy,
    filters.sortOrder,
    filters.limit,
  ]);
  
  return { products, loading, error };
};

export default useProducts;