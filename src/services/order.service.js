// File: src/services/order.service.js
// Order Management Service - Handles all order operations

import { 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Generate unique order ID
 * Format: SARSAR-YYYYMMDD-XXX
 */
const generateOrderId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `SARSAR-${year}${month}${day}-${random}`;
};

/**
 * Create new order
 */
export const createOrder = async (orderData) => {
  try {
    const orderId = generateOrderId();
    
    const order = {
      orderId,
      customerId: orderData.customerId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      discount: orderData.discount || 0,
      total: orderData.total,
      deliveryType: orderData.deliveryType, // 'standard' | 'express' | 'scheduled'
      deliveryAddress: orderData.deliveryAddress,
      deliveryInstructions: orderData.deliveryInstructions || '',
      scheduledTime: orderData.scheduledTime || null,
      status: 'placed', // placed → confirmed → picking → packing → out_for_delivery → delivered
      statusHistory: [
        {
          status: 'placed',
          timestamp: new Date().toISOString(),
          note: 'Order placed successfully'
        }
      ],
      paymentMethod: orderData.paymentMethod, // 'COD' | 'esewa' | 'khalti'
      paymentStatus: 'pending', // pending | paid | failed
      estimatedDelivery: calculateEstimatedDelivery(orderData.deliveryType),
      actualDelivery: null,
      rating: null,
      review: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'orders'), order);
    
    return {
      success: true,
      orderId: docRef.id,
      orderNumber: orderId,
      data: order
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Calculate estimated delivery time
 */
const calculateEstimatedDelivery = (deliveryType) => {
  const now = new Date();
  let minutes = 60; // Default 1 hour
  
  if (deliveryType === 'express') {
    minutes = 30; // 30 minutes for express
  } else if (deliveryType === 'scheduled') {
    minutes = 0; // Will be set by scheduled time
  }
  
  return new Date(now.getTime() + minutes * 60000).toISOString();
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        success: true,
        data: { id: docSnap.id, ...docSnap.data() }
      };
    } else {
      return {
        success: false,
        error: 'Order not found'
      };
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get customer orders
 */
export const getCustomerOrders = async (customerId, filters = {}) => {
  try {
    let q = query(
      collection(db, 'orders'),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );

    // Apply status filter if provided
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    // Apply limit if provided
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    return {
      success: true,
      data: orders
    };
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get supplier orders
 */
export const getSupplierOrders = async (supplierId, filters = {}) => {
  try {
    // Get orders containing items from this supplier
    const ordersRef = collection(db, 'orders');
    let q = query(ordersRef, orderBy('createdAt', 'desc'));

    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      const orderData = doc.data();
      // Filter orders that have items from this supplier
      const supplierItems = orderData.items.filter(
        item => item.supplierId === supplierId
      );
      
      if (supplierItems.length > 0) {
        orders.push({
          id: doc.id,
          ...orderData,
          items: supplierItems // Only show supplier's items
        });
      }
    });

    // Apply status filter after fetching
    let filteredOrders = orders;
    if (filters.status) {
      filteredOrders = orders.filter(order => order.status === filters.status);
    }

    return {
      success: true,
      data: filteredOrders
    };
  } catch (error) {
    console.error('Error fetching supplier orders:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId, newStatus, note = '') => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      return { success: false, error: 'Order not found' };
    }

    const currentOrder = orderSnap.data();
    const statusUpdate = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Order status updated to ${newStatus}`
    };

    // Add to status history
    const updatedHistory = [...currentOrder.statusHistory, statusUpdate];

    // Update actual delivery time if delivered
    const updates = {
      status: newStatus,
      statusHistory: updatedHistory,
      updatedAt: serverTimestamp()
    };

    if (newStatus === 'delivered') {
      updates.actualDelivery = new Date().toISOString();
    }

    await updateDoc(orderRef, updates);

    return {
      success: true,
      data: { status: newStatus }
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Cancel order (within 5 minutes)
 */
export const cancelOrder = async (orderId, reason) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      return { success: false, error: 'Order not found' };
    }

    const order = orderSnap.data();
    const orderTime = order.createdAt?.toDate();
    const now = new Date();
    const minutesPassed = (now - orderTime) / 1000 / 60;

    // Check if order can be cancelled (within 5 minutes and not yet confirmed)
    if (minutesPassed > 5 && order.status !== 'placed') {
      return {
        success: false,
        error: 'Order cannot be cancelled after 5 minutes or if already confirmed'
      };
    }

    await updateOrderStatus(orderId, 'cancelled', `Cancelled by customer: ${reason}`);

    return {
      success: true,
      message: 'Order cancelled successfully'
    };
  } catch (error) {
    console.error('Error cancelling order:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Add review and rating to order
 */
export const addOrderReview = async (orderId, rating, review) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    
    await updateDoc(orderRef, {
      rating,
      review,
      reviewedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      success: true,
      message: 'Review added successfully'
    };
  } catch (error) {
    console.error('Error adding review:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Subscribe to order updates (real-time)
 */
export const subscribeToOrder = (orderId, callback) => {
  const orderRef = doc(db, 'orders', orderId);
  
  return onSnapshot(orderRef, (doc) => {
    if (doc.exists()) {
      callback({
        success: true,
        data: { id: doc.id, ...doc.data() }
      });
    } else {
      callback({
        success: false,
        error: 'Order not found'
      });
    }
  }, (error) => {
    console.error('Error subscribing to order:', error);
    callback({
      success: false,
      error: error.message
    });
  });
};

/**
 * Get all orders (Admin only)
 */
export const getAllOrders = async (filters = {}) => {
  try {
    let q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );

    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    return {
      success: true,
      data: orders
    };
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return {
      success: false,
      error: error.message
    };
  }
};