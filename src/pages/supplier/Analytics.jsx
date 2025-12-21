// FILE PATH: src/pages/supplier/Analytics.jsx

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Clock,
  Star,
  Calendar
} from 'lucide-react';
import LoadingScreen from '@/components/shared/LoadingScreen';

const SupplierAnalyticsPage = () => {
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authLoading && (!user || userRole !== 'supplier')) {
      navigate('/login');
    }
  }, [user, userRole, authLoading, navigate]);
  
  if (authLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Analytics & Insights
        </h1>
        <p className="text-gray-600">
          Comprehensive view of your business performance
        </p>
      </div>

      {/* Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
      >
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <TrendingUp className="w-10 h-10 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Advanced Analytics Coming Soon
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          We're building powerful analytics tools to help you understand your business better. 
          Track revenue trends, customer behavior, product performance, and more.
        </p>
        
        {/* Feature Preview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <FeatureCard icon={DollarSign} label="Revenue Tracking" />
          <FeatureCard icon={ShoppingBag} label="Order Analytics" />
          <FeatureCard icon={Users} label="Customer Insights" />
          <FeatureCard icon={Package} label="Product Performance" />
          <FeatureCard icon={Clock} label="Time Analysis" />
          <FeatureCard icon={Star} label="Rating Trends" />
          <FeatureCard icon={Calendar} label="Seasonal Patterns" />
          <FeatureCard icon={TrendingUp} label="Growth Metrics" />
        </div>
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, label }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-gray-50 rounded-xl p-4 border border-gray-200"
  >
    <Icon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
    <p className="text-sm font-semibold text-gray-700">{label}</p>
  </motion.div>
);

export default SupplierAnalyticsPage;