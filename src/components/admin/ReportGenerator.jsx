// FILE PATH: src/components/admin/ReportGenerator.jsx
// Report Generator Component - Custom report builder and export
// Generate various types of reports with date range and filters

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar,
  Filter,
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  CheckCircle
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ReportGenerator = () => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('month');
  const [generating, setGenerating] = useState(false);

  // Report types
  const reportTypes = [
    {
      id: 'sales',
      name: 'Sales Report',
      description: 'Revenue, orders, and sales trends',
      icon: DollarSign,
      color: 'orange'
    },
    {
      id: 'users',
      name: 'User Report',
      description: 'Customer acquisition and behavior',
      icon: Users,
      color: 'blue'
    },
    {
      id: 'products',
      name: 'Product Report',
      description: 'Product performance and inventory',
      icon: Package,
      color: 'purple'
    },
    {
      id: 'orders',
      name: 'Order Report',
      description: 'Order fulfillment and delivery',
      icon: ShoppingCart,
      color: 'green'
    },
    {
      id: 'suppliers',
      name: 'Supplier Report',
      description: 'Supplier performance metrics',
      icon: TrendingUp,
      color: 'yellow'
    }
  ];

  // Generate report
  const handleGenerateReport = async () => {
    setGenerating(true);

    try {
      const now = new Date();
      let startDate = new Date();

      // Calculate date range
      if (dateRange === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (dateRange === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      } else if (dateRange === 'year') {
        startDate.setFullYear(now.getFullYear() - 1);
      }

      let csvContent = '';
      let filename = '';

      // Generate report based on type
      switch (reportType) {
        case 'sales':
          csvContent = await generateSalesReport(startDate);
          filename = `sales_report_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'users':
          csvContent = await generateUsersReport(startDate);
          filename = `users_report_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'products':
          csvContent = await generateProductsReport(startDate);
          filename = `products_report_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'orders':
          csvContent = await generateOrdersReport(startDate);
          filename = `orders_report_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'suppliers':
          csvContent = await generateSuppliersReport(startDate);
          filename = `suppliers_report_${new Date().toISOString().split('T')[0]}.csv`;
          break;
      }

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();

      setGenerating(false);
    } catch (error) {
      console.error('Error generating report:', error);
      setGenerating(false);
      alert('Error generating report. Please try again.');
    }
  };

  // Generate sales report
  const generateSalesReport = async (startDate) => {
    const ordersQuery = query(
      collection(db, 'orders'),
      where('createdAt', '>=', startDate),
      where('status', '==', 'delivered')
    );
    
    const ordersSnapshot = await getDocs(ordersQuery);
    const orders = ordersSnapshot.docs.map(doc => doc.data());

    const header = ['Date', 'Order ID', 'Customer', 'Items', 'Total', 'Payment Method'].join(',');
    const rows = orders.map(order => [
      order.createdAt?.toDate().toLocaleDateString(),
      order.orderId || order.id,
      order.customerName,
      order.items?.length || 0,
      order.total,
      order.paymentMethod
    ].join(','));

    return [header, ...rows].join('\n');
  };

  // Generate users report
  const generateUsersReport = async (startDate) => {
    const usersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'customer')
    );
    
    const usersSnapshot = await getDocs(usersQuery);
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const header = ['User ID', 'Name', 'Email', 'Phone', 'Join Date', 'Total Orders', 'Total Spent'].join(',');
    const rows = users.map(user => [
      user.id,
      user.name,
      user.email,
      user.phone,
      user.createdAt?.toDate().toLocaleDateString(),
      user.orderCount || 0,
      user.totalSpent || 0
    ].join(','));

    return [header, ...rows].join('\n');
  };

  // Generate products report
  const generateProductsReport = async (startDate) => {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const header = ['Product ID', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Supplier'].join(',');
    const rows = products.map(product => [
      product.id,
      product.name,
      product.category,
      product.price,
      product.stock,
      product.active ? 'Active' : 'Inactive',
      product.supplierId
    ].join(','));

    return [header, ...rows].join('\n');
  };

  // Generate orders report
  const generateOrdersReport = async (startDate) => {
    const ordersQuery = query(
      collection(db, 'orders'),
      where('createdAt', '>=', startDate)
    );
    
    const ordersSnapshot = await getDocs(ordersQuery);
    const orders = ordersSnapshot.docs.map(doc => doc.data());

    const header = ['Order ID', 'Customer', 'Status', 'Total', 'Date', 'Delivery Time'].join(',');
    const rows = orders.map(order => [
      order.orderId,
      order.customerName,
      order.status,
      order.total,
      order.createdAt?.toDate().toLocaleDateString(),
      order.estimatedDelivery?.toDate().toLocaleDateString() || 'N/A'
    ].join(','));

    return [header, ...rows].join('\n');
  };

  // Generate suppliers report
  const generateSuppliersReport = async (startDate) => {
    const suppliersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'supplier')
    );
    
    const suppliersSnapshot = await getDocs(suppliersQuery);
    const suppliers = suppliersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const header = ['Supplier ID', 'Business Name', 'Contact', 'Email', 'Products', 'Status'].join(',');
    const rows = suppliers.map(supplier => [
      supplier.id,
      supplier.businessName,
      supplier.name,
      supplier.email,
      supplier.productsCount || 0,
      supplier.verified ? 'Verified' : 'Pending'
    ].join(','));

    return [header, ...rows].join('\n');
  };

  // Get color classes
  const getColorClasses = (color) => {
    const colors = {
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200'
    };
    return colors[color] || colors.orange;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Report Generator</h2>
          <p className="text-sm text-gray-600">Create custom reports for analysis</p>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Report Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setReportType(type.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  reportType === type.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(type.color)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {type.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {type.description}
                    </p>
                  </div>
                  {reportType === type.id && (
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Date Range Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Date Range
        </label>
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-600" />
          <div className="flex gap-2">
            {['week', 'month', 'year', 'all'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range === 'week' ? 'Last 7 Days' : 
                 range === 'month' ? 'Last Month' : 
                 range === 'year' ? 'Last Year' : 'All Time'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerateReport}
        disabled={generating}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {generating ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="font-medium">Generating Report...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span className="font-medium">Generate & Download Report</span>
          </>
        )}
      </motion.button>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> Reports are generated in CSV format and can be opened in Excel or Google Sheets.
          All timestamps are in local timezone.
        </p>
      </div>
    </div>
  );
};

export default ReportGenerator;