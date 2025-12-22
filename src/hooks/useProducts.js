// FILE PATH: src/hooks/useProducts.js

import { useState, useCallback } from 'react';
import { collection, query, getDocs, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ MANUAL FETCH FOR FEATURED PRODUCTS
  const fetchFeatured = useCallback(async (count = 8) => {
    try {
      setLoading(true);
      setError(null);

      const q = query(
        collection(db, 'products'),
        where('featured', '==', true),
        limit(count)
      );

      const snapshot = await getDocs(q);

      setProducts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (err) {
      console.error('fetchFeatured error:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    fetchFeatured, // ✅ DEFINED & RETURNED
  };
}
export default useProducts 