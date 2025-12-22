// FILE PATH: src/pages/admin/Suppliers.jsx
// Admin Supplier Management Page - Manage all suppliers
// Verification, performance metrics, and commission management

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Download, 
  RefreshCw,
  Store,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import SupplierDirectory from '@/components/admin/SupplierDirectory';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    totalProducts: 0,
    totalRevenue: 0
  });

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        // Get all users with role 'supplier'
        const suppliersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'supplier')
        );
        const suppliersSnapshot = await getDocs(suppliersQuery);
        
        // Get all products and orders for statistics
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        
        const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const orders = ordersSnapshot.docs.map(doc => doc.data());

        // Calculate supplier statistics
        const suppliersData = await Promise.all(
          suppliersSnapshot.docs.map(async (doc) => {
            const supplierData = doc.data();
            
            // Get supplier's products
            const supplierProducts = products.filter(p => p.supplierId === doc.id);
            
            // Get supplier's orders
            const supplierOrders = orders.filter(order => 
              order.items?.some(item => item.supplierId === doc.id)
            );

            // Calculate revenue from this supplier
            const revenue = supplierOrders.reduce((sum, order) => {
              const supplierItems = order.items.filter(item => item.supplierId === doc.id);
              return sum + supplierItems.reduce((itemSum, item) => itemSum + (item.total || 0), 0);
            }, 0);

            return {
              id: doc.id,
              ...supplierData,
              productsCount: supplierProducts.length,
              ordersCount: supplierOrders.length,
              revenue,
              rating: supplierData.rating || 0,
              verified: supplierData.verified || false
            };
          })
        );

        // Calculate overall stats
        const totalProducts = products.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const verifiedCount = suppliersData.filter(s => s.verified).length;
        const pendingCount = suppliersData.filter(s => !s.verified).length;

        setSuppliers(suppliersData);
        setFilteredSuppliers(suppliersData);
        setStats({
          total: suppliersData.length,
          verified: verifiedCount,
          pending: pendingCount,
          totalProducts,
          totalRevenue
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...suppliers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter === 'verified') {
      filtered = filtered.filter(s => s.verified === true);
    } else if (statusFilter === 'pending') {
      filtered = filtered.filter(s => !s.verified);
    }

    setFilteredSuppliers(filtered);
  }, [searchTerm, statusFilter, suppliers]);

  // Export suppliers
  const handleExport = () => {
    const csvContent = [
      ['Business Name', 'Contact', 'Email', 'Products', 'Orders', 'Revenue', 'Status'].join(','),
      ...filteredSuppliers.map(supplier => [
        supplier.businessName,
        supplier.name,
        supplier.email,
        supplier.productsCount,
        supplier.ordersCount,
        supplier.revenue,
        supplier.verified ? 'Verified' : 'Pending'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `suppliers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Supplier Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                {filteredSuppliers.length} of {suppliers.length} suppliers
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
                placeholder="Search by business name, contact, or email..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total Suppliers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Suppliers</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </motion.div>

          {/* Verified */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Verified</p>
            <p className="text-3xl font-bold text-gray-900">{stats.verified}</p>
          </motion.div>

          {/* Pending */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
          </motion.div>

          {/* Total Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
          </motion.div>

          {/* Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              Rs. {(stats.totalRevenue / 1000).toFixed(1)}k
            </p>
          </motion.div>
        </div>

        {/* Status Tabs */}
        <div className="bg-white rounded-t-xl border-t border-l border-r border-gray-200">
          <div className="flex items-center gap-1 overflow-x-auto px-4">
            {[
              { value: 'all', label: 'All Suppliers', count: stats.total },
              { value: 'verified', label: 'Verified', count: stats.verified },
              { value: 'pending', label: 'Pending', count: stats.pending }
            ].map(status => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  statusFilter === status.value
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {status.label} ({status.count})
              </button>
            ))}
          </div>
        </div>

        {/* Supplier Directory */}
        <SupplierDirectory 
          suppliers={filteredSuppliers} 
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Suppliers;