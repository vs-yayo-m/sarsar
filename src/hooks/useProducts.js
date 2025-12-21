// FILE PATH: src/hooks/useProducts.js
// Custom hook for product operations with state management

import { useState, useEffect, useCallback } from 'react';
import * as productService from '@/services/product.service';

/**
 * Custom hook for managing products
 * @param {Object} options - Hook options
 * @returns {Object} Products state and methods
 */
const useProducts = (options = {}) => {
  const {
    autoFetch = false,
      filters = {},
      productId = null
  } = options;
  
  // State
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  
  /**
   * Fetch all products
   */
  const fetchProducts = useCallback(async (customFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const mergedFilters = { ...filters, ...customFilters };
      const fetchedProducts = await productService.getAllProducts(mergedFilters);
      
      setProducts(fetchedProducts);
      setHasMore(fetchedProducts.length === (mergedFilters.limitCount || 20));
      
      if (fetchedProducts.length > 0) {
        setLastDoc(fetchedProducts[fetchedProducts.length - 1]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  /**
   * Fetch more products (pagination)
   */
  const fetchMoreProducts = useCallback(async () => {
    if (!hasMore || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const moreProducts = await productService.getAllProducts({
        ...filters,
        lastDoc
      });
      
      setProducts(prev => [...prev, ...moreProducts]);
      setHasMore(moreProducts.length === (filters.limitCount || 20));
      
      if (moreProducts.length > 0) {
        setLastDoc(moreProducts[moreProducts.length - 1]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching more products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, hasMore, lastDoc, loading]);
  
  /**
   * Fetch single product by ID
   */
  const fetchProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedProduct = await productService.getProductById(id);
      setProduct(fetchedProduct);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Search products
   */
  const searchProducts = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      fetchProducts();
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await productService.searchProducts(searchTerm);
      setProducts(results);
    } catch (err) {
      setError(err.message);
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);
  
  /**
   * Get products by category
   */
  const fetchByCategory = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    
    try {
      const categoryProducts = await productService.getProductsByCategory(category);
      setProducts(categoryProducts);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching category products:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get featured products
   */
  const fetchFeatured = useCallback(async (limitCount = 8) => {
    setLoading(true);
    setError(null);
    
    try {
      const featuredProducts = await productService.getFeaturedProducts(limitCount);
      setProducts(featuredProducts);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching featured products:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get related products
   */
  const fetchRelated = useCallback(async (id, category) => {
    setLoading(true);
    setError(null);
    
    try {
      const relatedProducts = await productService.getRelatedProducts(id, category);
      setProducts(relatedProducts);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching related products:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Create new product
   */
  const createProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);
    
    try {
      const productId = await productService.createProduct(productData);
      await fetchProducts(); // Refresh list
      return productId;
    } catch (err) {
      setError(err.message);
      console.error('Error creating product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);
  
  /**
   * Update product
   */
  const updateProduct = useCallback(async (id, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      await productService.updateProduct(id, updates);
      await fetchProducts(); // Refresh list
    } catch (err) {
      setError(err.message);
      console.error('Error updating product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);
  
  /**
   * Delete product
   */
  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Update product stock
   */
  const updateStock = useCallback(async (id, newStock) => {
    setLoading(true);
    setError(null);
    
    try {
      await productService.updateProductStock(id, newStock);
      // Update local state
      setProducts(prev =>
        prev.map(p => p.id === id ? { ...p, stock: newStock } : p)
      );
    } catch (err) {
      setError(err.message);
      console.error('Error updating stock:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Refresh products
   */
  const refresh = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      if (productId) {
        fetchProduct(productId);
      } else {
        fetchProducts();
      }
    }
  }, [autoFetch, productId, fetchProduct, fetchProducts]);
  
  return {
    // State
    products,
    product,
    loading,
    error,
    hasMore,
    
    // Methods
    fetchProducts,
    fetchMoreProducts,
    fetchProduct,
    searchProducts,
    fetchByCategory,
    fetchFeatured,
    fetchRelated,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    refresh
  };
};

export default useProducts;