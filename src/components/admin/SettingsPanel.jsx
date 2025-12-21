// FILE PATH: src/components/admin/SettingsPanel.jsx
// Settings Panel Component - Display settings based on active tab
// Form inputs for various platform configurations

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe,
  MapPin,
  Clock,
  DollarSign,
  Mail,
  Bell,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2
} from 'lucide-react';

const SettingsPanel = ({ activeTab, settings, setSettings, loading }) => {
  // Update setting
  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  // Add delivery zone
  const addDeliveryZone = () => {
    const newZone = { ward: settings.deliveryZones.length + 1, charge: 0, time: 60 };
    updateSetting('deliveryZones', [...settings.deliveryZones, newZone]);
  };

  // Remove delivery zone
  const removeDeliveryZone = (index) => {
    const zones = settings.deliveryZones.filter((_, i) => i !== index);
    updateSetting('deliveryZones', zones);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* General Settings */}
      {activeTab === 'general' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">General Settings</h3>
            <p className="text-sm text-gray-600 mb-6">
              Basic platform information and configuration
            </p>
          </div>

          {/* Platform Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Name
            </label>
            <input
              type="text"
              value={settings.platformName}
              onChange={(e) => updateSetting('platformName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.platformEmail}
                onChange={(e) => updateSetting('platformEmail', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={settings.platformPhone}
                onChange={(e) => updateSetting('platformPhone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Address
            </label>
            <input
              type="text"
              value={settings.platformAddress}
              onChange={(e) => updateSetting('platformAddress', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>

          {/* Business Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Hours
            </label>
            <input
              type="text"
              value={settings.businessHours}
              onChange={(e) => updateSetting('businessHours', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              placeholder="6 AM - 11 PM"
            />
          </div>
        </motion.div>
      )}

      {/* Delivery Settings */}
      {activeTab === 'delivery' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Settings</h3>
            <p className="text-sm text-gray-600 mb-6">
              Configure delivery zones, times, and charges
            </p>
          </div>

          {/* Delivery Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Standard Delivery (minutes)
              </label>
              <input
                type="number"
                value={settings.standardDeliveryTime}
                onChange={(e) => updateSetting('standardDeliveryTime', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Express Delivery (minutes)
              </label>
              <input
                type="number"
                value={settings.expressDeliveryTime}
                onChange={(e) => updateSetting('expressDeliveryTime', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          {/* Free Delivery Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Free Delivery Threshold (Rs.)
            </label>
            <input
              type="number"
              value={settings.freeDeliveryThreshold}
              onChange={(e) => updateSetting('freeDeliveryThreshold', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>

          {/* Delivery Zones */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-gray-700">
                Delivery Zones
              </label>
              <button
                onClick={addDeliveryZone}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Zone
              </button>
            </div>

            <div className="space-y-3">
              {settings.deliveryZones.map((zone, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Ward</label>
                      <input
                        type="number"
                        value={zone.ward}
                        onChange={(e) => {
                          const zones = [...settings.deliveryZones];
                          zones[index].ward = parseInt(e.target.value);
                          updateSetting('deliveryZones', zones);
                        }}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Charge (Rs.)</label>
                      <input
                        type="number"
                        value={zone.charge}
                        onChange={(e) => {
                          const zones = [...settings.deliveryZones];
                          zones[index].charge = parseInt(e.target.value);
                          updateSetting('deliveryZones', zones);
                        }}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Time (min)</label>
                      <input
                        type="number"
                        value={zone.time}
                        onChange={(e) => {
                          const zones = [...settings.deliveryZones];
                          zones[index].time = parseInt(e.target.value);
                          updateSetting('deliveryZones', zones);
                        }}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeDeliveryZone(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Settings */}
      {activeTab === 'payment' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Settings</h3>
            <p className="text-sm text-gray-600 mb-6">
              Configure payment methods and commission rates
            </p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Cash on Delivery</p>
                <p className="text-sm text-gray-600">Accept cash payments on delivery</p>
              </div>
              <button
                onClick={() => updateSetting('codEnabled', !settings.codEnabled)}
                className="relative"
              >
                {settings.codEnabled ? (
                  <ToggleRight className="w-12 h-6 text-green-600" />
                ) : (
                  <ToggleLeft className="w-12 h-6 text-gray-400" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">eSewa</p>
                <p className="text-sm text-gray-600">Digital wallet payment</p>
              </div>
              <button
                onClick={() => updateSetting('esewaEnabled', !settings.esewaEnabled)}
                className="relative"
              >
                {settings.esewaEnabled ? (
                  <ToggleRight className="w-12 h-6 text-green-600" />
                ) : (
                  <ToggleLeft className="w-12 h-6 text-gray-400" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Khalti</p>
                <p className="text-sm text-gray-600">Digital wallet payment</p>
              </div>
              <button
                onClick={() => updateSetting('khaltiEnabled', !settings.khaltiEnabled)}
                className="relative"
              >
                {settings.khaltiEnabled ? (
                  <ToggleRight className="w-12 h-6 text-green-600" />
                ) : (
                  <ToggleLeft className="w-12 h-6 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Commission Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Commission (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={settings.platformCommission}
              onChange={(e) => updateSetting('platformCommission', parseFloat(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Commission charged on each order
            </p>
          </div>
        </motion.div>
      )}

      {/* Email Settings */}
      {activeTab === 'email' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Email Settings</h3>
            <p className="text-sm text-gray-600 mb-6">
              Configure SMTP settings for transactional emails
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Host
              </label>
              <input
                type="text"
                value={settings.smtpHost}
                onChange={(e) => updateSetting('smtpHost', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Port
              </label>
              <input
                type="number"
                value={settings.smtpPort}
                onChange={(e) => updateSetting('smtpPort', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Username
            </label>
            <input
              type="text"
              value={settings.smtpUser}
              onChange={(e) => updateSetting('smtpUser', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Password
            </label>
            <input
              type="password"
              value={settings.smtpPassword}
              onChange={(e) => updateSetting('smtpPassword', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>
        </motion.div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Settings</h3>
            <p className="text-sm text-gray-600 mb-6">
              Manage system notifications and alerts
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Order Notifications</p>
                <p className="text-sm text-gray-600">Notifications for new orders and updates</p>
              </div>
              <button
                onClick={() => updateSetting('orderNotifications', !settings.orderNotifications)}
                className="relative"
              >
                {settings.orderNotifications ? (
                  <ToggleRight className="w-12 h-6 text-green-600" />
                ) : (
                  <ToggleLeft className="w-12 h-6 text-gray-400" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Marketing Notifications</p>
                <p className="text-sm text-gray-600">Promotional and campaign notifications</p>
              </div>
              <button
                onClick={() => updateSetting('marketingNotifications', !settings.marketingNotifications)}
                className="relative"
              >
                {settings.marketingNotifications ? (
                  <ToggleRight className="w-12 h-6 text-green-600" />
                ) : (
                  <ToggleLeft className="w-12 h-6 text-gray-400" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">System Notifications</p>
                <p className="text-sm text-gray-600">Platform updates and alerts</p>
              </div>
              <button
                onClick={() => updateSetting('systemNotifications', !settings.systemNotifications)}
                className="relative"
              >
                {settings.systemNotifications ? (
                  <ToggleRight className="w-12 h-6 text-green-600" />
                ) : (
                  <ToggleLeft className="w-12 h-6 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Security Settings</h3>
            <p className="text-sm text-gray-600 mb-6">
              Security and privacy configurations
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Security settings are managed automatically by the platform. 
              For advanced security configurations, please contact support.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">SSL Certificate</p>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Your platform is secured with HTTPS encryption
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">Firewall Protection</p>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
              <p className="text-sm text-gray-600">
                DDoS protection and WAF enabled
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">Data Encryption</p>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
              <p className="text-sm text-gray-600">
                All data encrypted at rest and in transit
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SettingsPanel;