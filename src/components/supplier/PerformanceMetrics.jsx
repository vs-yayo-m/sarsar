// FILE PATH: src/components/supplier/PerformanceMetrics.jsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const PerformanceMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    overallScore: 0,
    onTimeDelivery: 0,
    orderAccuracy: 0,
    customerRating: 0,
    responseTime: 0,
    loading: true
  });

  useEffect(() => {
    if (!user) return;

    const fetchPerformanceData = async () => {
      try {
        // Fetch completed orders from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const ordersQuery = query(
          collection(db, 'orders'),
          where('supplierId', '==', user.uid),
          where('status', '==', 'delivered'),
          where('createdAt', '>=', thirtyDaysAgo)
        );

        const snapshot = await getDocs(ordersQuery);
        
        let totalOrders = 0;
        let onTimeOrders = 0;
        let totalRating = 0;
        let ratedOrders = 0;
        let totalResponseTime = 0;

        snapshot.forEach((doc) => {
          const order = doc.data();
          totalOrders++;

          // Check on-time delivery (within 1 hour)
          if (order.deliveredAt && order.createdAt) {
            const deliveryTime = (order.deliveredAt.toDate() - order.createdAt.toDate()) / (1000 * 60); // minutes
            if (deliveryTime <= 60) {
              onTimeOrders++;
            }
          }

          // Customer rating
          if (order.rating) {
            totalRating += order.rating;
            ratedOrders++;
          }

          // Response time (time to confirm order)
          if (order.confirmedAt && order.createdAt) {
            const responseTime = (order.confirmedAt.toDate() - order.createdAt.toDate()) / (1000 * 60); // minutes
            totalResponseTime += responseTime;
          }
        });

        const onTimePercent = totalOrders > 0 ? (onTimeOrders / totalOrders) * 100 : 0;
        const avgRating = ratedOrders > 0 ? totalRating / ratedOrders : 0;
        const avgResponseTime = totalOrders > 0 ? totalResponseTime / totalOrders : 0;
        const orderAccuracy = 98; // Would need more data tracking for this

        // Calculate overall score (weighted average)
        const overallScore = (
          (onTimePercent * 0.35) + 
          (orderAccuracy * 0.25) + 
          (avgRating * 20 * 0.25) + 
          (Math.max(0, 100 - avgResponseTime) * 0.15)
        );

        setMetrics({
          overallScore: Math.round(overallScore),
          onTimeDelivery: Math.round(onTimePercent),
          orderAccuracy: orderAccuracy,
          customerRating: avgRating.toFixed(1),
          responseTime: Math.round(avgResponseTime),
          loading: false
        });
      } catch (error) {
        console.error('Error fetching performance data:', error);
        setMetrics(prev => ({ ...prev, loading: false }));
      }
    };

    fetchPerformanceData();
  }, [user]);

  const performanceItems = [
    {
      label: 'On-Time Delivery',
      value: `${metrics.onTimeDelivery}%`,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      target: 95,
      current: metrics.onTimeDelivery
    },
    {
      label: 'Order Accuracy',
      value: `${metrics.orderAccuracy}%`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      target: 98,
      current: metrics.orderAccuracy
    },
    {
      label: 'Customer Rating',
      value: metrics.customerRating,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      target: 4.5,
      current: parseFloat(metrics.customerRating)
    },
    {
      label: 'Avg Response Time',
      value: `${metrics.responseTime} min`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      target: 5,
      current: 100 - metrics.responseTime // Inverted for progress bar
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Performance Score</h2>
        
        {/* Overall Score Circle */}
        <div className="flex items-center justify-center py-6">
          <div className="relative">
            {/* Circle Background */}
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#f3f4f6"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(metrics.overallScore / 100) * 351.86} 351.86`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6B35" />
                  <stop offset="100%" stopColor="#F7931E" />
                </linearGradient>
              </defs>
            </svg>

            {/* Score Number */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-900">
                {metrics.loading ? '--' : metrics.overallScore}
              </span>
              <span className="text-sm text-gray-600">/ 100</span>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600">
          {metrics.overallScore >= 90 ? 'Excellent Performance! 🎉' :
           metrics.overallScore >= 75 ? 'Good Performance! 👍' :
           metrics.overallScore >= 60 ? 'Room for Improvement 📈' :
           'Needs Attention ⚠️'}
        </p>
      </div>

      {/* Performance Breakdown */}
      <div className="space-y-4">
        {performanceItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`${item.bgColor} p-2 rounded-lg`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{item.value}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((item.current / item.target) * 100, 100)}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`h-full rounded-full ${
                  item.current >= item.target ? 'bg-green-500' :
                  item.current >= item.target * 0.8 ? 'bg-orange-500' :
                  'bg-red-500'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-orange-50 rounded-xl">
        <p className="text-xs font-semibold text-orange-900 mb-2">💡 Pro Tip</p>
        <p className="text-xs text-orange-700">
          {metrics.onTimeDelivery < 90 ? 'Focus on faster order fulfillment to improve on-time delivery.' :
           metrics.customerRating < 4.5 ? 'Respond to customer feedback to boost your rating.' :
           metrics.responseTime > 5 ? 'Accept orders faster to improve response time.' :
           'Keep up the great work! Maintain consistency to stay at the top.'}
        </p>
      </div>
    </motion.div>
  );
};

export default PerformanceMetrics;