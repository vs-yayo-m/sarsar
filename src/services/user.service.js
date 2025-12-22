// FILE PATH: src/services/user.service.js
// User Service - API calls for user management
// Handles CRUD operations, user verification, and statistics

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
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * User Service
 * Provides methods for managing users (customers, suppliers, admins)
 */
const userService = {
  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  /**
   * Get all users by role
   * @param {string} role - User role (customer, supplier, admin)
   * @returns {Promise<Array>} Array of users
   */
  async getUsersByRole(role) {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('role', '==', role),
        orderBy('createdAt', 'desc')
      );

      const usersSnapshot = await getDocs(usersQuery);
      
      return usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw error;
    }
  },

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<string>} New user ID
   */
  async createUser(userData) {
    try {
      const newUser = {
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: 'active'
      };

      const docRef = await addDoc(collection(db, 'users'), newUser);
      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {Object} updates - Data to update
   * @returns {Promise<void>}
   */
  async updateUser(userId, updates) {
    try {
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Delete user
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async deleteUser(userId) {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  /**
   * Verify supplier
   * @param {string} supplierId - Supplier ID
   * @returns {Promise<void>}
   */
  async verifySupplier(supplierId) {
    try {
      await this.updateUser(supplierId, {
        verified: true,
        verifiedAt: Timestamp.now(),
        verifiedBy: 'admin'
      });
    } catch (error) {
      console.error('Error verifying supplier:', error);
      throw error;
    }
  },

  /**
   * Suspend user
   * @param {string} userId - User ID
   * @param {string} reason - Suspension reason
   * @returns {Promise<void>}
   */
  async suspendUser(userId, reason = '') {
    try {
      await this.updateUser(userId, {
        status: 'suspended',
        suspendedAt: Timestamp.now(),
        suspendedBy: 'admin',
        suspensionReason: reason
      });
    } catch (error) {
      console.error('Error suspending user:', error);
      throw error;
    }
  },

  /**
   * Activate user
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async activateUser(userId) {
    try {
      await this.updateUser(userId, {
        status: 'active',
        activatedAt: Timestamp.now(),
        suspensionReason: null
      });
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  },

  /**
   * Get user statistics
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User statistics
   */
  async getUserStats(userId) {
    try {
      const user = await this.getUserById(userId);

      // Get user's orders
      const ordersQuery = query(
        collection(db, 'orders'),
        where('customerId', '==', userId)
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const orders = ordersSnapshot.docs.map(doc => doc.data());

      // Calculate statistics
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const completedOrders = orders.filter(o => o.status === 'delivered').length;
      const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

      return {
        userId,
        totalOrders,
        totalSpent,
        completedOrders,
        avgOrderValue,
        memberSince: user.createdAt,
        lastOrderDate: orders.length > 0 
          ? orders.sort((a, b) => b.createdAt - a.createdAt)[0].createdAt 
          : null
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  },

  /**
   * Search users
   * @param {string} searchTerm - Search term
   * @param {string} role - Filter by role (optional)
   * @returns {Promise<Array>} Matching users
   */
  async searchUsers(searchTerm, role = null) {
    try {
      let usersQuery = collection(db, 'users');
      
      if (role) {
        usersQuery = query(usersQuery, where('role', '==', role));
      }

      const usersSnapshot = await getDocs(usersQuery);
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter by search term (client-side for flexibility)
      const searchLower = searchTerm.toLowerCase();
      return users.filter(user => 
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.includes(searchTerm) ||
        user.businessName?.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  /**
   * Get recent users
   * @param {number} limitCount - Number of users to fetch
   * @param {string} role - Filter by role (optional)
   * @returns {Promise<Array>} Recent users
   */
  async getRecentUsers(limitCount = 10, role = null) {
    try {
      let usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (role) {
        usersQuery = query(
          collection(db, 'users'),
          where('role', '==', role),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );
      }

      const usersSnapshot = await getDocs(usersQuery);
      
      return usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting recent users:', error);
      throw error;
    }
  },

  /**
   * Get user activity log
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Activity log
   */
  async getUserActivity(userId) {
    try {
      // Get user's orders for activity
      const ordersQuery = query(
        collection(db, 'orders'),
        where('customerId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      const ordersSnapshot = await getDocs(ordersQuery);
      
      return ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'order',
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting user activity:', error);
      throw error;
    }
  },

  /**
   * Update user preferences
   * @param {string} userId - User ID
   * @param {Object} preferences - User preferences
   * @returns {Promise<void>}
   */
  async updateUserPreferences(userId, preferences) {
    try {
      await this.updateUser(userId, {
        preferences: {
          ...preferences,
          updatedAt: Timestamp.now()
        }
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  },

  /**
   * Get supplier performance metrics
   * @param {string} supplierId - Supplier ID
   * @returns {Promise<Object>} Performance metrics
   */
  async getSupplierPerformance(supplierId) {
    try {
      // Get supplier's products
      const productsQuery = query(
        collection(db, 'products'),
        where('supplierId', '==', supplierId)
      );
      const productsSnapshot = await getDocs(productsQuery);
      const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get all orders containing supplier's products
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const supplierOrders = ordersSnapshot.docs
        .map(doc => doc.data())
        .filter(order => 
          order.items?.some(item => item.supplierId === supplierId)
        );

      // Calculate metrics
      const totalProducts = products.length;
      const activeProducts = products.filter(p => p.active).length;
      const totalOrders = supplierOrders.length;
      const completedOrders = supplierOrders.filter(o => o.status === 'delivered').length;
      const revenue = supplierOrders.reduce((sum, order) => {
        const supplierItems = order.items.filter(item => item.supplierId === supplierId);
        return sum + supplierItems.reduce((itemSum, item) => itemSum + (item.total || 0), 0);
      }, 0);

      // Calculate average fulfillment time
      const completedWithTime = supplierOrders.filter(
        o => o.status === 'delivered' && o.actualDelivery && o.createdAt
      );
      const avgFulfillmentTime = completedWithTime.length > 0
        ? completedWithTime.reduce((sum, order) => {
            const diff = order.actualDelivery.toDate() - order.createdAt.toDate();
            return sum + diff;
          }, 0) / completedWithTime.length
        : 0;

      return {
        supplierId,
        totalProducts,
        activeProducts,
        totalOrders,
        completedOrders,
        revenue,
        fulfillmentRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
        avgFulfillmentTime: Math.round(avgFulfillmentTime / (1000 * 60)), // in minutes
        avgOrderValue: totalOrders > 0 ? revenue / totalOrders : 0
      };
    } catch (error) {
      console.error('Error getting supplier performance:', error);
      throw error;
    }
  }
};

export default userService;