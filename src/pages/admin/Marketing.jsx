// FILE PATH: src/pages/admin/Marketing.jsx
// Admin Marketing Page - Campaign management and promotional tools
// Banners, coupons, email campaigns, and push notifications

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone,
  Tag,
  Mail,
  Bell,
  Image as ImageIcon,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Eye
} from 'lucide-react';
import MarketingTools from '@/components/admin/MarketingTools';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Marketing = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    activeCoupons: 0,
    totalReach: 0,
    conversionRate: 0,
    totalDiscount: 0
  });
  
  // Fetch marketing stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get all orders to calculate coupon usage
        const ordersSnapshot = await getDocs(collection(db, 'orders'));
        const orders = ordersSnapshot.docs.map(doc => doc.data());
        
        const ordersWithCoupons = orders.filter(o => o.couponCode);
        const totalDiscount = ordersWithCoupons.reduce((sum, o) => sum + (o.discount || 0), 0);
        
        // Mock stats (would come from actual campaign/coupon collections)
        setStats({
          activeCampaigns: 3,
          activeCoupons: 8,
          totalReach: 2500,
          conversionRate: 12.5,
          totalDiscount
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching marketing stats:', error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Marketing Center</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage campaigns, promotions, and customer engagement
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">New Campaign</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Active Campaigns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Active Campaigns</p>
            <p className="text-3xl font-bold text-gray-900">{stats.activeCampaigns}</p>
          </motion.div>

          {/* Active Coupons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Active Coupons</p>
            <p className="text-3xl font-bold text-gray-900">{stats.activeCoupons}</p>
          </motion.div>

          {/* Total Reach */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Reach</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalReach.toLocaleString()}</p>
          </motion.div>

          {/* Conversion Rate */}
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
            <p className="text-sm font-medium text-gray-600 mb-1">Conversion Rate</p>
            <p className="text-3xl font-bold text-gray-900">{stats.conversionRate}%</p>
          </motion.div>

          {/* Total Discount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Discount</p>
            <p className="text-2xl font-bold text-gray-900">
              Rs. {(stats.totalDiscount / 1000).toFixed(1)}k
            </p>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-t-xl border-t border-l border-r border-gray-200">
          <div className="flex items-center gap-1 overflow-x-auto px-4">
            {[
              { value: 'overview', label: 'Overview', icon: Eye },
              { value: 'banners', label: 'Banners', icon: ImageIcon },
              { value: 'coupons', label: 'Coupons', icon: Tag },
              { value: 'email', label: 'Email Campaigns', icon: Mail },
              { value: 'notifications', label: 'Push Notifications', icon: Bell }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.value
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Marketing Tools Component */}
        <MarketingTools 
          activeTab={activeTab}
          stats={stats}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Marketing;