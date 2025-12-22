// ============================================================
// FILE PATH: src/services/notification.service.js
// ============================================================
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const notificationService = {
  // Send notification
  async send(userId, notification) {
    try {
      const notificationData = {
        userId,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'info',
        read: false,
        createdAt: new Date(),
        data: notification.data || {},
      };

      const docRef = await addDoc(collection(db, 'notifications'), notificationData);
      return { id: docRef.id, ...notificationData };
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  },

  // Get user notifications
  async getByUser(userId) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  },

  // Mark as read
  async markAsRead(notificationId) {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },
};

export default notificationService;

