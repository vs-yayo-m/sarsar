// FILE PATH: src/pages/supplier/Dashboard.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import SupplierDashboard from '@/components/supplier/SupplierDashboard';
import LoadingScreen from '@/components/shared/LoadingScreen';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/config/firebase';

const SupplierDashboardPage = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    recentOrders: [],
    topProducts: [],
    loading: true
  });
  
  useEffect(() => {
    // Redirect if not supplier
    if (!authLoading && (!user || userRole !== 'supplier')) {
      navigate('/login');
      return;
    }
    
    if (!user) return;
    
    // Real-time dashboard data listeners
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Listen to orders
    const ordersQuery = query(
      collection(db, 'orders'),
      where('supplierId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const orders = [];
      let todayRev = 0;
      let todayCount = 0;
      let pendingCount = 0;
      
      snapshot.forEach((doc) => {
        const order = { id: doc.id, ...doc.data() };
        orders.push(order);
        
        // Calculate today's metrics
        const orderDate = order.createdAt?.toDate();
        if (orderDate >= today) {
          todayRev += order.total || 0;
          todayCount++;
        }
        
        // Count pending orders
        if (['placed', 'confirmed', 'picking'].includes(order.status)) {
          pendingCount++;
        }
      });
      
      setDashboardData(prev => ({
        ...prev,
        todayRevenue: todayRev,
        todayOrders: todayCount,
        pendingOrders: pendingCount,
        recentOrders: orders,
        loading: false
      }));
    });
    
    // Listen to products for low stock
    const productsQuery = query(
      collection(db, 'products'),
      where('supplierId', '==', user.uid),
      where('active', '==', true)
    );
    
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      let lowStockCount = 0;
      const productSales = [];
      
      snapshot.forEach((doc) => {
        const product = { id: doc.id, ...doc.data() };
        
        // Count low stock (less than 10)
        if (product.stock < 10) {
          lowStockCount++;
        }
        
        // Collect for top products
        productSales.push({
          id: product.id,
          name: product.name,
          sales: product.salesCount || 0,
          revenue: product.revenue || 0,
          stock: product.stock
        });
      });
      
      // Sort by sales and get top 5
      const topProducts = productSales
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);
      
      setDashboardData(prev => ({
        ...prev,
        lowStockProducts: lowStockCount,
        topProducts
      }));
    });
    
    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
    };
  }, [user, userRole, authLoading, navigate]);
  
  if (authLoading || dashboardData.loading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <SupplierDashboard data={dashboardData} />
    </div>
  );
};

export default SupplierDashboardPage;