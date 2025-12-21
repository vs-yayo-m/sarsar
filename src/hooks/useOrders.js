// File: src/hooks/useOrders.js
// Custom hook for order management operations

import { useState, useEffect, useCallback } from 'react';
import {
  createOrder,
  getOrderById,
  getCustomerOrders,
  getSupplierOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  addOrderReview,
  subscribeToOrder
} from '@/services/order.service';
import { useAuth } from './useAuth';

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Place new order
   */
  const placeOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createOrder({
        ...orderData,
        customerId: user.uid,
        customerName: user.displayName || user.name,
        customerPhone: user.phoneNumber || user.phone,
        customerEmail: user.email
      });
      
      if (result.success) {
        return {
          success: true,
          orderId: result.orderId,
          orderNumber: result.orderNumber,
          data: result.data
        };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Fetch customer orders
   */
  const fetchMyOrders = useCallback(async (filters = {}) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getCustomerOrders(user.uid, filters);
      
      if (result.success) {
        setOrders(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  /**
   * Fetch supplier orders
   */
  const fetchSupplierOrders = useCallback(async (filters = {}) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getSupplierOrders(user.uid, filters);
      
      if (result.success) {
        setOrders(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  /**
   * Fetch all orders (Admin)
   */
  const fetchAllOrders = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getAllOrders(filters);
      
      if (result.success) {
        setOrders(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get single order
   */
  const getOrder = async (orderId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getOrderById(orderId);
      
      if (result.success) {
        return result.data;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Update order status
   */
  const updateStatus = async (orderId, newStatus, note) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateOrderStatus(orderId, newStatus, note);
      
      if (result.success) {
        // Update local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ?
            { ...order, status: newStatus } :
            order
          )
        );
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Cancel order
   */
  const cancel = async (orderId, reason) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await cancelOrder(orderId, reason);
      
      if (result.success) {
        // Update local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ?
            { ...order, status: 'cancelled' } :
            order
          )
        );
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Add review
   */
  const addReview = async (orderId, rating, review) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await addOrderReview(orderId, rating, review);
      
      if (result.success) {
        // Update local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ?
            { ...order, rating, review } :
            order
          )
        );
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Subscribe to real-time order updates
   */
  const subscribeToOrderUpdates = (orderId, callback) => {
    return subscribeToOrder(orderId, callback);
  };
  
  return {
    orders,
    loading,
    error,
    placeOrder,
    fetchMyOrders,
    fetchSupplierOrders,
    fetchAllOrders,
    getOrder,
    updateStatus,
    cancel,
    addReview,
    subscribeToOrderUpdates
  };
};