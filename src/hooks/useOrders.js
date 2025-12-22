// FILE PATH: src/hooks/useOrders.js
// Custom hook for fetching and managing orders

import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useOrders = (userId, role = 'customer') => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const ordersRef = collection(db, 'orders');
        let q;
        
        // Query based on user role
        if (role === 'customer') {
          q = query(
            ordersRef,
            where('customerId', '==', userId),
            orderBy('createdAt', 'desc')
          );
        } else if (role === 'supplier') {
          q = query(
            ordersRef,
            where('supplierId', '==', userId),
            orderBy('createdAt', 'desc')
          );
        } else {
          // Admin - get all orders
          q = query(ordersRef, orderBy('createdAt', 'desc'));
        }
        
        const snapshot = await getDocs(q);
        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setOrders(ordersData);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [userId, role]);
  
  return { orders, loading, error };
};

export default useOrders;