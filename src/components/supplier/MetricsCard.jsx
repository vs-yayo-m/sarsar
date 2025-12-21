// FILE PATH: src/components/supplier/MetricsCard.jsx

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MetricsCard = ({
  title,
  value,
  icon: Icon,
  color = 'orange',
  trend,
  trendUp,
  actionLabel,
  actionLink
}) => {
  const colorClasses = {
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-orange-500',
      gradient: 'from-orange-500 to-orange-600'
    },
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-500',
      gradient: 'from-blue-500 to-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-500',
      gradient: 'from-green-500 to-green-600'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-500',
      gradient: 'from-red-500 to-red-600'
    }
  };
  
  const colors = colorClasses[color];
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all"
    >
      {/* Icon */}
      <div className={`${colors.bg} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
        <Icon className={`w-7 h-7 ${colors.icon}`} />
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-3">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        
        {/* Trend */}
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>

      {/* Action Link */}
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className={`inline-flex items-center gap-1 text-sm font-semibold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}
        >
          {actionLabel}
          <ArrowRight className={`w-4 h-4 ${colors.icon}`} />
        </Link>
      )}

      {/* Background Decoration */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-full opacity-50 pointer-events-none" />
    </motion.div>
  );
};

export default MetricsCard;