// FILE PATH: src/pages/admin/Customers.jsx
// Admin Customer Management Page - View and manage all customers
// Customer database with analytics, search, and management tools

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Download,
  RefreshCw,
  Users,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Filter
} from 'lucide-react';
import UserManagement from '@/components/admin/UserManagement';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  
  // Fetch customers and their statistics
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Get all users with role 'customer'
        const usersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'customer')
        );
        const usersSnapshot = await getDocs(usersQuery);
        
        // Get all orders for statistics
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const orders = ordersSnapshot.docs.map(doc => doc.data());
        
        // Calculate customer statistics
        const customersData = await Promise.all(
          usersSnapshot.docs.map(async (doc) => {
            const userData = doc.data();
            const customerOrders = orders.filter(
              order => order.customerId === doc.id
            );
            
            const totalSpent = customerOrders.reduce(
              (sum, order) => sum + (order.total || 0),
              0
            );
            
            const lastOrder = customerOrders.length > 0 ?
              customerOrders.sort((a, b) =>
                (b.createdAt?.toDate() || new Date()) - (a.createdAt?.toDate() || new Date())
              )[0] :
              null;
            
            return {
              id: doc.id,
              ...userData,
              orderCount: customerOrders.length,
              totalSpent,
              lastOrderDate: lastOrder?.createdAt,
              avgOrderValue: customerOrders.length > 0 ? totalSpent / customerOrders.length : 0
            };
          })
        );
        
        // Calculate overall stats
        const activeCustomers = customersData.filter(c => c.orderCount > 0).length;
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        
        setCustomers(customersData);
        setFilteredCustomers(customersData);
        setStats({
          total: customersData.length,
          active: activeCustomers,
          totalOrders,
          totalRevenue
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, []);
  
  // Search filter
  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(customer =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);
  
  // Export customers
  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Joined Date'].join(','),
      ...filteredCustomers.map(customer => [
        customer.name,
        customer.email,
        customer.phone,
        customer.orderCount,
        customer.totalSpent,
        customer.createdAt?.toDate().toLocaleDateString()
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                {filteredCustomers.length} of {customers.length} customers
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-medium">Refresh</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Customers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Customers</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </motion.div>

          {/* Active Customers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Active Customers</p>
            <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
          </motion.div>

          {/* Total Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
          </motion.div>

          {/* Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">
              Rs. {stats.totalRevenue.toLocaleString()}
            </p>
          </motion.div>
        </div>

        {/* Customer Table */}
        <UserManagement 
          users={filteredCustomers} 
          loading={loading}
          userType="customer"
        />
      </div>
    </div>
  );
};

export default Customers;