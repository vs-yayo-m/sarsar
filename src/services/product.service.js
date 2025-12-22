// FILE PATH: src/services/product.service.js
// Product Service - All product-related API calls

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc,
  updateDoc,
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Collection reference
const PRODUCTS_COLLECTION = 'products';

/**
 * Get all products with optional filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Array of products
 */
export const getAllProducts = async (filters = {}) => {
  try {
    let q = collection(db, PRODUCTS_COLLECTION);
    
    // Apply filters
    const constraints = [];
    
    // Filter by category
    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }
    
    // Filter by supplier
    if (filters.supplierId) {
      constraints.push(where('supplierId', '==', filters.supplierId));
    }
    
    // Filter by active status
    if (filters.active !== undefined) {
      constraints.push(where('active', '==', filters.active));
    }
    
    // Filter by featured
    if (filters.featured) {
      constraints.push(where('featured', '==', true));
    }
    
    // Filter by in stock
    if (filters.inStock) {
      constraints.push(where('stock', '>', 0));
    }
    
    // Filter by price range
    if (filters.minPrice !== undefined) {
      constraints.push(where('price', '>=', filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      constraints.push(where('price', '<=', filters.maxPrice));
    }
    
    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          constraints.push(orderBy('price', 'asc'));
          break;
        case 'price_desc':
          constraints.push(orderBy('price', 'desc'));
          break;
        case 'newest':
          constraints.push(orderBy('createdAt', 'desc'));
          break;
        case 'popular':
          constraints.push(orderBy('orderCount', 'desc'));
          break;
        case 'rating':
          constraints.push(orderBy('rating', 'desc'));
          break;
        default:
          constraints.push(orderBy('createdAt', 'desc'));
      }
    } else {
      constraints.push(orderBy('createdAt', 'desc'));
    }
    
    // Pagination
    if (filters.limitCount) {
      constraints.push(limit(filters.limitCount));
    }
    
    if (filters.lastDoc) {
      constraints.push(startAfter(filters.lastDoc));
    }
    
    // Build query
    if (constraints.length > 0) {
      q = query(collection(db, PRODUCTS_COLLECTION), ...constraints);
    }
    
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

/**
 * Get single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Product object
 */
export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

/**
 * Search products by name or description
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Array of matching products
 */
export const searchProducts = async (searchTerm) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('active', '==', true),
      orderBy('name')
    );
    
    const snapshot = await getDocs(q);
    const allProducts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Client-side filtering for text search
    const searchLower = searchTerm.toLowerCase();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Get products by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of products
 */
export const getProductsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category),
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw error;
  }
};

/**
 * Get featured products
 * @param {number} limitCount - Number of products to fetch
 * @returns {Promise<Array>} Array of featured products
 */
export const getFeaturedProducts = async (limitCount = 8) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('featured', '==', true),
      where('active', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting featured products:', error);
    throw error;
  }
};

/**
 * Get related products
 * @param {string} productId - Product ID
 * @param {string} category - Product category
 * @returns {Promise<Array>} Array of related products
 */
export const getRelatedProducts = async (productId, category) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category),
      where('active', '==', true),
      limit(8)
    );
    
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Filter out current product
    return products.filter(product => product.id !== productId);
  } catch (error) {
    console.error('Error getting related products:', error);
    throw error;
  }
};

/**
 * Create new product (Supplier)
 * @param {Object} productData - Product data
 * @returns {Promise<string>} Product ID
 */
export const createProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true,
      orderCount: 0,
      rating: 0,
      reviewCount: 0
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update product
 * @param {string} productId - Product ID
 * @param {Object} updates - Update data
 * @returns {Promise<void>}
 */
export const updateProduct = async (productId, updates) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete product
 * @param {string} productId - Product ID
 * @returns {Promise<void>}
 */
export const deleteProduct = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Update product stock
 * @param {string} productId - Product ID
 * @param {number} newStock - New stock value
 * @returns {Promise<void>}
 */
export const updateProductStock = async (productId, newStock) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, {
      stock: newStock,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};

/**
 * Subscribe to product changes (Real-time)
 * @param {string} productId - Product ID
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const subscribeToProduct = (productId, callback) => {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({
        id: doc.id,
        ...doc.data()
      });
    }
  });
};

export default {
  getAllProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  subscribeToProduct
};