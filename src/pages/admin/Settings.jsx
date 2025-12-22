// FILE PATH: src/pages/admin/Settings.jsx
// Admin Settings Page - Platform configuration and settings
// System settings, delivery zones, payment config, and preferences

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Truck,
  CreditCard,
  Mail,
  Bell,
  Shield,
  Globe,
  AlertCircle
} from 'lucide-react';
import SettingsPanel from '@/components/admin/SettingsPanel';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    platformName: 'SARSAR',
    platformEmail: 'hello@sarsar.com.np',
    platformPhone: '+977 9821072912',
    platformAddress: 'Butwal, Nepal',
    businessHours: '6 AM - 11 PM',
    
    // Delivery Settings
    standardDeliveryTime: 60,
    expressDeliveryTime: 30,
    freeDeliveryThreshold: 1000,
    deliveryZones: [
      { ward: 1, charge: 0, time: 45 },
      { ward: 2, charge: 0, time: 45 },
      { ward: 3, charge: 30, time: 60 }
    ],
    
    // Payment Settings
    codEnabled: true,
    esewaEnabled: false,
    khaltiEnabled: false,
    platformCommission: 10,
    
    // Email Settings
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    
    // Notification Settings
    orderNotifications: true,
    marketingNotifications: true,
    systemNotifications: true
  });
  
  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'platform'));
        if (settingsDoc.exists()) {
          setSettings({ ...settings, ...settingsDoc.data() });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  // Save settings
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'settings', 'platform'), {
        ...settings,
        updatedAt: new Date()
      });
      
      alert('Settings saved successfully!');
      setSaving(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
      setSaving(false);
    }
  };
  
  const tabs = [
    { value: 'general', label: 'General', icon: SettingsIcon },
    { value: 'delivery', label: 'Delivery', icon: Truck },
    { value: 'payment', label: 'Payment', icon: CreditCard },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'notifications', label: 'Notifications', icon: Bell },
    { value: 'security', label: 'Security', icon: Shield }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
              <p className="text-sm text-gray-600 mt-1">
                Configure your platform settings and preferences
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-medium">Reset</span>
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {saving ? 'Saving...' : 'Save Changes'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.value
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Warning Box */}
            <div className="mt-4 bg-yellow-50 rounded-xl border border-yellow-200 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900 mb-1">
                    Important Notice
                  </p>
                  <p className="text-xs text-yellow-700">
                    Changes to these settings will affect the entire platform. 
                    Please review carefully before saving.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            <SettingsPanel 
              activeTab={activeTab}
              settings={settings}
              setSettings={setSettings}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;