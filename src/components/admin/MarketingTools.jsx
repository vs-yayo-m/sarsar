// FILE PATH: src/components/admin/MarketingTools.jsx
// Marketing Tools Component - Campaign overview and quick actions
// Display marketing metrics and provide navigation to specific tools

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users,
  Target,
  BarChart3,
  ArrowRight,
  Plus
} from 'lucide-react';

const MarketingTools = ({ activeTab, stats, loading }) => {
  // Recent campaigns (mock data)
  const recentCampaigns = [
    {
      id: 1,
      name: 'New Year Sale 2025',
      type: 'Banner',
      status: 'active',
      reach: 1200,
      clicks: 450,
      conversions: 78
    },
    {
      id: 2,
      name: 'First Order Discount',
      type: 'Coupon',
      status: 'active',
      reach: 800,
      clicks: 320,
      conversions: 95
    },
    {
      id: 3,
      name: 'Weekend Special',
      type: 'Email',
      status: 'scheduled',
      reach: 0,
      clicks: 0,
      conversions: 0
    }
  ];

  // Quick actions
  const quickActions = [
    {
      title: 'Create Banner',
      description: 'Design homepage banners',
      icon: Plus,
      color: 'orange',
      action: 'banners'
    },
    {
      title: 'New Coupon',
      description: 'Generate discount codes',
      icon: Plus,
      color: 'green',
      action: 'coupons'
    },
    {
      title: 'Email Campaign',
      description: 'Send promotional emails',
      icon: Plus,
      color: 'blue',
      action: 'email'
    },
    {
      title: 'Push Notification',
      description: 'Notify all users',
      icon: Plus,
      color: 'purple',
      action: 'notifications'
    }
  ];

  // Get color classes
  const getColorClasses = (color) => {
    const colors = {
      orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
      green: 'bg-green-100 text-green-600 hover:bg-green-200',
      blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200'
    };
    return colors[color] || colors.orange;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-700',
      scheduled: 'bg-yellow-100 text-yellow-700',
      ended: 'bg-gray-100 text-gray-700'
    };
    return badges[status] || badges.active;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-b-xl border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-b-xl border-b border-l border-r border-gray-200 p-6">
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition-all text-left group"
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${getColorClasses(action.color)} transition-transform group-hover:scale-110`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Recent Campaigns */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Campaigns</h3>
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{campaign.type}</p>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Reach</p>
                      <p className="text-sm font-semibold text-gray-900">{campaign.reach.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Clicks</p>
                      <p className="text-sm font-semibold text-gray-900">{campaign.clicks.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Conversions</p>
                      <p className="text-sm font-semibold text-gray-900">{campaign.conversions}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Engagement Rate */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Engagement Rate</p>
                    <p className="text-2xl font-bold text-gray-900">18.5%</p>
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="h-2 bg-blue-600 rounded-full" style={{ width: '18.5%' }} />
                </div>
              </div>

              {/* Click-Through Rate */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Click-Through Rate</p>
                    <p className="text-2xl font-bold text-gray-900">12.3%</p>
                  </div>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div className="h-2 bg-purple-600 rounded-full" style={{ width: '12.3%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Marketing Insights */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Marketing Insights</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Strong Campaign Performance</p>
                  <p className="text-sm text-gray-600">
                    Your campaigns are reaching {stats.totalReach.toLocaleString()} users with a {stats.conversionRate}% conversion rate
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Active Promotions</p>
                  <p className="text-sm text-gray-600">
                    You have {stats.activeCoupons} active coupons generating customer interest
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'overview' && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {activeTab === 'banners' && 'Banner Management'}
            {activeTab === 'coupons' && 'Coupon Management'}
            {activeTab === 'email' && 'Email Campaigns'}
            {activeTab === 'notifications' && 'Push Notifications'}
          </h3>
          <p className="text-gray-600 mb-6">
            Create and manage your {activeTab} here
          </p>
          <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            Create New {activeTab === 'banners' ? 'Banner' : 
                       activeTab === 'coupons' ? 'Coupon' :
                       activeTab === 'email' ? 'Campaign' : 'Notification'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketingTools;