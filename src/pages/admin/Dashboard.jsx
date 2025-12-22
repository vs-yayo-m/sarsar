// FILE PATH: src/pages/admin/Dashboard.jsx
// Admin Dashboard - Main entry point for admin panel
// Displays key metrics, live order feed, and system health

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  AlertCircle,
  Activity
} from 'lucide-react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import MetricsCard from '@/components/admin/MetricsCard';
import LiveOrderFeed from '@/components/admin/LiveOrderFeed';
import RevenueChart from '@/components/admin/RevenueChart';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Dashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    activeOrders: 0,
    totalCustomers: 0,
    platformHealth: 98,
    revenueGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  
  // Fetch dashboard metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get today's orders
        const ordersQuery = query(
          collection(db, 'orders'),
          where('createdAt', '>=', today)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const todayOrders = ordersSnapshot.docs;
        
        // Calculate today's revenue
        const todayRevenue = todayOrders.reduce((sum, doc) => {
          return sum + (doc.data().total || 0);
        }, 0);
        
        // Get active orders (not delivered/cancelled)
        const activeOrdersQuery = query(
          collection(db, 'orders'),
          where('status', 'in', ['placed', 'confirmed', 'picking', 'packing', 'out_for_delivery'])
        );
        const activeSnapshot = await getDocs(activeOrdersQuery);
        
        // Get total customers
        const customersSnapshot = await getDocs(collection(db, 'users'));
        const customers = customersSnapshot.docs.filter(
          doc => doc.data().role === 'customer'
        );
        
        // Get yesterday's data for comparison
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayQuery = query(
          collection(db, 'orders'),
          where('createdAt', '>=', yesterday),
          where('createdAt', '<', today)
        );
        const yesterdaySnapshot = await getDocs(yesterdayQuery);
        const yesterdayRevenue = yesterdaySnapshot.docs.reduce((sum, doc) => {
          return sum + (doc.data().total || 0);
        }, 0);
        
        // Calculate growth percentages
        const revenueGrowth = yesterdayRevenue > 0 ?
          ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 :
          100;
        const ordersGrowth = yesterdaySnapshot.size > 0 ?
          ((todayOrders.length - yesterdaySnapshot.size) / yesterdaySnapshot.size) * 100 :
          100;
        
        setMetrics({
          todayRevenue,
          todayOrders: todayOrders.length,
          activeOrders: activeSnapshot.size,
          totalCustomers: customers.length,
          platformHealth: 98, // Can be calculated based on errors, uptime, etc.
          revenueGrowth: Math.round(revenueGrowth),
          ordersGrowth: Math.round(ordersGrowth),
          customersGrowth: 5 // Calculate from user growth data
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setLoading(false);
      }
    };
    
    fetchMetrics();
    
    // Real-time listener for orders
    const ordersQuery = query(
      collection(db, 'orders'),
      where('status', 'in', ['placed', 'confirmed', 'picking', 'packing', 'out_for_delivery'])
    );
    
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData.slice(0, 10)); // Latest 10 orders
    });
    
    return () => unsubscribe();
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {user?.name || 'Admin'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  System Healthy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Hero Metrics - Large Cards */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Revenue */}
              <MetricsCard
                title="Today's Revenue"
                value={`Rs. ${metrics.todayRevenue.toLocaleString()}`}
                change={metrics.revenueGrowth}
                icon={DollarSign}
                color="orange"
                loading={loading}
                trend="up"
              />

              {/* Active Orders */}
              <MetricsCard
                title="Active Orders"
                value={metrics.activeOrders}
                change={metrics.ordersGrowth}
                icon={ShoppingCart}
                color="blue"
                loading={loading}
                trend="up"
              />

              {/* Total Orders Today */}
              <MetricsCard
                title="Orders Today"
                value={metrics.todayOrders}
                change={metrics.ordersGrowth}
                icon={TrendingUp}
                color="green"
                loading={loading}
                trend="up"
              />

              {/* Total Customers */}
              <MetricsCard
                title="Total Customers"
                value={metrics.totalCustomers}
                change={metrics.customersGrowth}
                icon={Users}
                color="purple"
                loading={loading}
                trend="up"
              />
            </div>
          </motion.div>

          {/* Revenue Chart and Live Orders */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Chart - 2 columns */}
              <div className="lg:col-span-2">
                <RevenueChart />
              </div>

              {/* Live Order Feed - 1 column */}
              <div className="lg:col-span-1">
                <LiveOrderFeed orders={orders} />
              </div>
            </div>
          </motion.div>

          {/* Admin Dashboard Component (additional stats, quick actions) */}
          <motion.div variants={itemVariants}>
            <AdminDashboard metrics={metrics} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;