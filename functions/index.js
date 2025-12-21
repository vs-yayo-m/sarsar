// FILE PATH: functions/index.js
// Firebase Cloud Functions - Serverless Backend Logic

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

// Firestore reference
const db = admin.firestore();

// ==================== ORDER FUNCTIONS ====================

/**
 * Trigger when a new order is created
 * Sends notifications to customer, supplier, and admin
 */
exports.onOrderCreated = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    const orderId = context.params.orderId;

    try {
      // Send notification to customer
      await sendNotificationToCustomer(order.customerId, {
        title: 'Order Confirmed!',
        body: `Your order #${order.orderId} has been confirmed. Estimated delivery in 1 hour.`,
        data: { orderId, type: 'order_created' },
      });

      // Send notification to supplier
      await sendNotificationToSupplier(order.supplierId, {
        title: 'New Order Received',
        body: `New order #${order.orderId} - Rs. ${order.total}`,
        data: { orderId, type: 'new_order' },
      });

      // Log to admin
      console.log(`Order ${orderId} created successfully`);

      return null;
    } catch (error) {
      console.error('Error in onOrderCreated:', error);
      return null;
    }
  });

/**
 * Trigger when order status changes
 * Sends real-time notifications
 */
exports.onOrderStatusChanged = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const orderId = context.params.orderId;

    // Check if status changed
    if (before.status === after.status) {
      return null;
    }

    try {
      // Notification based on new status
      let notification = {};
      
      switch (after.status) {
      case 'confirmed':
        notification = {
          title: 'Order Confirmed',
          body: 'Your order is being prepared.',
        };
        break;
      case 'picking':
        notification = {
          title: 'Order Being Picked',
          body: 'We\'re picking your items now!',
        };
        break;
      case 'packing':
        notification = {
          title: 'Order Being Packed',
          body: 'Almost ready for delivery!',
        };
        break;
      case 'out_for_delivery':
        notification = {
          title: 'On The Way!',
          body: 'Your order is out for delivery.',
        };
        break;
      case 'delivered':
        notification = {
          title: 'Order Delivered',
          body: 'Your order has been delivered. Enjoy!',
        };
        break;
      default:
        return null;
      }

      await sendNotificationToCustomer(after.customerId, {
        ...notification,
        data: { orderId, status: after.status, type: 'status_update' },
      });

      return null;
    } catch (error) {
      console.error('Error in onOrderStatusChanged:', error);
      return null;
    }
  });

// ==================== USER FUNCTIONS ====================

/**
 * Trigger when a new user signs up
 * Creates user document and sends welcome notification
 */
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  try {
    // Create user document in Firestore
    await db.collection('users').doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      phone: user.phoneNumber || null,
      role: 'customer', // Default role
      name: user.displayName || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      orderCount: 0,
      totalSpent: 0,
      wishlist: [],
    });

    console.log(`User ${user.uid} created successfully`);
    return null;
  } catch (error) {
    console.error('Error in onUserCreated:', error);
    return null;
  }
});

// ==================== ANALYTICS FUNCTIONS ====================

/**
 * Daily Analytics Aggregation
 * Runs every day at midnight
 */
exports.dailyAnalytics = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Asia/Kathmandu')
  .onRun(async (context) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Get yesterday's orders
      const ordersSnapshot = await db
        .collection('orders')
        .where('createdAt', '>=', yesterday)
        .where('createdAt', '<', today)
        .get();

      // Calculate metrics
      const totalOrders = ordersSnapshot.size;
      let totalRevenue = 0;
      let completedOrders = 0;

      ordersSnapshot.forEach((doc) => {
        const order = doc.data();
        totalRevenue += order.total;
        if (order.status === 'delivered') {
          completedOrders++;
        }
      });

      // Save analytics
      await db.collection('analytics').doc(yesterday.toISOString().split('T')[0]).set({
        date: yesterday,
        totalOrders,
        completedOrders,
        totalRevenue,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
      });

      console.log(`Daily analytics for ${yesterday.toDateString()} saved`);
      return null;
    } catch (error) {
      console.error('Error in dailyAnalytics:', error);
      return null;
    }
  });

// ==================== HELPER FUNCTIONS ====================

/**
 * Send notification to customer
 */
async function sendNotificationToCustomer(userId, notification) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    const user = userDoc.data();

    if (user && user.fcmToken) {
      await admin.messaging().send({
        token: user.fcmToken,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
      });
    }
  } catch (error) {
    console.error('Error sending notification to customer:', error);
  }
}

/**
 * Send notification to supplier
 */
async function sendNotificationToSupplier(supplierId, notification) {
  try {
    const supplierDoc = await db.collection('users').doc(supplierId).get();
    const supplier = supplierDoc.data();

    if (supplier && supplier.fcmToken) {
      await admin.messaging().send({
        token: supplier.fcmToken,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
      });
    }
  } catch (error) {
    console.error('Error sending notification to supplier:', error);
  }
}

// ==================== HTTP FUNCTIONS ====================

/**
 * HTTP function for generating order invoice
 */
exports.generateInvoice = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { orderId } = data;

  try {
    const orderDoc = await db.collection('orders').doc(orderId).get();
    
    if (!orderDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Order not found');
    }

    const order = orderDoc.data();

    // Verify user has access to this order
    if (order.customerId !== context.auth.uid) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'User does not have access to this order'
      );
    }

    // Generate invoice (simplified version)
    const invoice = {
      orderId: order.orderId,
      date: order.createdAt,
      customer: order.customerName,
      items: order.items,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      paymentMethod: order.paymentMethod,
    };

    return { success: true, invoice };
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ==================== CLEANUP FUNCTIONS ====================

/**
 * Clean up old cart data
 * Runs weekly
 */
exports.cleanupOldCarts = functions.pubsub
  .schedule('0 0 * * 0')
  .timeZone('Asia/Kathmandu')
  .onRun(async (context) => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const oldCartsSnapshot = await db
        .collection('carts')
        .where('updatedAt', '<', sevenDaysAgo)
        .get();

      const batch = db.batch();
      oldCartsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`Cleaned up ${oldCartsSnapshot.size} old carts`);
      return null;
    } catch (error) {
      console.error('Error cleaning up old carts:', error);
      return null;
    }
  });