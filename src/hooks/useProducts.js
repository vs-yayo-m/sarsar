// FILE PATH: src/hooks/useProducts.js
// Custom Hook for Product Data Management

import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, getDoc, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/config/firebase';

/**
 * Hook to fetch all products or filtered products
 * @param {Object} filters - Optional filters (category, search, etc.)
 * @returns {Object} - { products, loading, error, refetch }
 */
export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const productsRef = collection(db, 'products');
      let q = query(productsRef);
      
      // Apply filters
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      
      if (filters.supplierId) {
        q = query(q, where('supplierId', '==', filters.supplierId));
      }
      
      if (filters.featured) {
        q = query(q, where('featured', '==', true));
      }
      
      if (filters.active !== undefined) {
        q = query(q, where('active', '==', filters.active));
      }
      
      // Apply sorting
      if (filters.sortBy) {
        const sortField = filters.sortBy === 'price' ? 'price' : 'createdAt';
        const sortDirection = filters.sortDirection || 'asc';
        q = query(q, orderBy(sortField, sortDirection));
      }
      
      // Apply limit
      if (filters.limit) {
        q = query(q, limit(filters.limit));
      }
      
      const snapshot = await getDocs(q);
      const productsData = snapshot.docs.map(doc => ({
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
  
  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]); // Re-fetch when filters change
  
  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};

/**
 * Hook to fetch a single product by ID
 * @param {string} productId - Product ID
 * @returns {Object} - { product, loading, error }
 */
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productRef = doc(db, 'products', productId);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          setProduct({
            id: productSnap.id,
            ...productSnap.data(),
          });
          setError(null);
        } else {
          setError('Product not found');
          setProduct(null);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  return {
    product,
    loading,
    error,
  };
};

/**
 * Hook to search products
 * @param {string} searchQuery - Search term
 * @returns {Object} - { results, loading, error }
 */
export const useProductSearch = (searchQuery) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }
    
    const searchProducts = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('active', '==', true));
        
        const snapshot = await getDocs(q);
        const allProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Filter products by search query (client-side)
        const searchLower = searchQuery.toLowerCase();
        const filtered = allProducts.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.category?.toLowerCase().includes(searchLower)
        );
        
        setResults(filtered);
        setError(null);
      } catch (err) {
        console.error('Error searching products:', err);
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce search
    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  return {
    results,
    loading,
    error,
  };
};

export default useProducts;