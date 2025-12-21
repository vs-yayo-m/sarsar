// FILE PATH: src/pages/supplier/Settings.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Store, 
  Bell, 
  Clock, 
  Printer,
  Shield,
  Save,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingScreen from '@/components/shared/LoadingScreen';
import toast from 'react-hot-toast';

const SupplierSettingsPage = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState({
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    businessEmail: '',
    operatingHours: {
      open: '09:00',
      close: '21:00'
    },
    notifications: {
      newOrders: true,
      lowStock: true,
      dailyReport: true,
      sms: false,
      email: true
    },
    printSettings: {
      autoPrint: false,
      printerType: 'thermal', // thermal, a4
      includeBarcode: true
    }
  });

  useEffect(() => {
    if (!authLoading && (!user || userRole !== 'supplier')) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchSettings();
    }
  }, [user, userRole, authLoading, navigate]);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings(prev => ({
          ...prev,
          businessName: data.businessName || '',
          businessAddress: data.businessAddress || '',
          businessPhone: data.businessPhone || data.phone || '',
          businessEmail: data.businessEmail || data.email || '',
          operatingHours: data.operatingHours || prev.operatingHours,
          notifications: data.notifications || prev.notifications,
          printSettings: data.printSettings || prev.printSettings
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSubmitting(true);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        businessName: settings.businessName,
        businessAddress: settings.businessAddress,
        businessPhone: settings.businessPhone,
        businessEmail: settings.businessEmail,
        operatingHours: settings.operatingHours,
        notifications: settings.notifications,
        printSettings: settings.printSettings,
        updatedAt: new Date()
      });

      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Supplier Settings
          </h1>
          <p className="text-gray-600">
            Manage your business information and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Business Information */}
          <SettingsCard
            icon={Store}
            title="Business Information"
            description="Update your store details"
          >
            <div className="space-y-4">
              <Input
                label="Business Name"
                value={settings.businessName}
                onChange={(e) => setSettings(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="Your Store Name"
              />
              <Input
                label="Business Address"
                value={settings.businessAddress}
                onChange={(e) => setSettings(prev => ({ ...prev, businessAddress: e.target.value }))}
                placeholder="Full business address"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Business Phone"
                  type="tel"
                  value={settings.businessPhone}
                  onChange={(e) => setSettings(prev => ({ ...prev, businessPhone: e.target.value }))}
                  placeholder="+977 9812345678"
                />
                <Input
                  label="Business Email"
                  type="email"
                  value={settings.businessEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, businessEmail: e.target.value }))}
                  placeholder="business@example.com"
                />
              </div>
            </div>
          </SettingsCard>

          {/* Operating Hours */}
          <SettingsCard
            icon={Clock}
            title="Operating Hours"
            description="Set your daily business hours"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Opening Time
                </label>
                <input
                  type="time"
                  value={settings.operatingHours.open}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    operatingHours: { ...prev.operatingHours, open: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Closing Time
                </label>
                <input
                  type="time"
                  value={settings.operatingHours.close}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    operatingHours: { ...prev.operatingHours, close: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </SettingsCard>

          {/* Notifications */}
          <SettingsCard
            icon={Bell}
            title="Notification Preferences"
            description="Choose how you want to be notified"
          >
            <div className="space-y-3">
              <ToggleSetting
                label="New Order Alerts"
                description="Get notified when you receive new orders"
                checked={settings.notifications.newOrders}
                onChange={(checked) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, newOrders: checked }
                }))}
              />
              <ToggleSetting
                label="Low Stock Alerts"
                description="Receive alerts when products are running low"
                checked={settings.notifications.lowStock}
                onChange={(checked) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, lowStock: checked }
                }))}
              />
              <ToggleSetting
                label="Daily Summary Report"
                description="Get a daily report of your sales and orders"
                checked={settings.notifications.dailyReport}
                onChange={(checked) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, dailyReport: checked }
                }))}
              />
              <ToggleSetting
                label="Email Notifications"
                description="Receive notifications via email"
                checked={settings.notifications.email}
                onChange={(checked) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: checked }
                }))}
              />
              <ToggleSetting
                label="SMS Notifications"
                description="Receive notifications via SMS"
                checked={settings.notifications.sms}
                onChange={(checked) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, sms: checked }
                }))}
              />
            </div>
          </SettingsCard>

          {/* Print Settings */}
          <SettingsCard
            icon={Printer}
            title="Print Settings"
            description="Configure printing preferences"
          >
            <div className="space-y-4">
              <ToggleSetting
                label="Auto-Print Packing Slips"
                description="Automatically print when order is ready to pack"
                checked={settings.printSettings.autoPrint}
                onChange={(checked) => setSettings(prev => ({
                  ...prev,
                  printSettings: { ...prev.printSettings, autoPrint: checked }
                }))}
              />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Printer Type
                </label>
                <select
                  value={settings.printSettings.printerType}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    printSettings: { ...prev.printSettings, printerType: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="thermal">Thermal Printer (80mm)</option>
                  <option value="a4">A4 Printer</option>
                </select>
              </div>
              <ToggleSetting
                label="Include QR Code"
                description="Print QR code on packing slips for easy tracking"
                checked={settings.printSettings.includeBarcode}
                onChange={(checked) => setSettings(prev => ({
                  ...prev,
                  printSettings: { ...prev.printSettings, includeBarcode: checked }
                }))}
              />
            </div>
          </SettingsCard>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              loading={submitting}
              disabled={submitting}
              className="flex items-center gap-2 px-8"
            >
              <Save className="w-5 h-5" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Card Component
const SettingsCard = ({ icon: Icon, title, description, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
};

// Toggle Setting Component
const ToggleSetting = ({ label, description, checked, onChange }) => {
  return (
    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <p className="font-semibold text-gray-900 mb-1">{label}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`
          relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4
          ${checked ? 'bg-orange-500' : 'bg-gray-300'}
        `}
      >
        <motion.div
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
};

export default SupplierSettingsPage;