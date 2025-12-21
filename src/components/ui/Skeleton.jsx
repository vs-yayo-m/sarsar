import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({
  width,
  height,
  className = '',
  variant = 'rect',
  animation = 'pulse',
  count = 1,
  inline = false,
}) => {
  const baseClass = 'bg-gray-200';
  
  const variantClasses = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded',
  };

  const animationVariants = {
    pulse: {
      animate: {
        opacity: [0.5, 1, 0.5],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    },
    shimmer: {
      animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        },
      },
      style: {
        background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
        backgroundSize: '200% 100%',
      },
    },
    wave: {
      animate: {
        scale: [1, 1.02, 1],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    },
    none: {},
  };

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '20px'),
    ...animationVariants[animation].style,
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <motion.div
      key={index}
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
      style={style}
      {...animationVariants[animation]}
    />
  ));

  return inline ? (
    skeletons
  ) : count > 1 ? (
    <div className="space-y-3">{skeletons}</div>
  ) : (
    skeletons[0]
  );
};

// Product Card Skeleton
export const ProductCardSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Image skeleton */}
      <Skeleton height="200px" variant="rect" className="rounded-none" />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <Skeleton width="60px" height="16px" variant="text" />
        
        {/* Title */}
        <Skeleton height="20px" variant="text" />
        <Skeleton width="80%" height="20px" variant="text" />
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <Skeleton width="100px" height="16px" variant="text" />
          <Skeleton width="40px" height="16px" variant="text" />
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton width="80px" height="24px" variant="text" />
          <Skeleton width="80px" height="36px" variant="rect" />
        </div>
      </div>
    </div>
  );
};

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 8, columns = 4 }) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

// List Item Skeleton
export const ListItemSkeleton = ({ withAvatar = true, className = '' }) => {
  return (
    <div className={`flex items-center gap-4 p-4 ${className}`}>
      {withAvatar && <Skeleton width="48px" height="48px" variant="circle" />}
      <div className="flex-1 space-y-2">
        <Skeleton height="16px" />
        <Skeleton width="70%" height="14px" />
      </div>
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex gap-4 p-4 border-b border-gray-200">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} height="20px" className="flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 p-4 border-b border-gray-200">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} height="16px" className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

// Order Card Skeleton
export const OrderCardSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton width="120px" height="20px" />
        <Skeleton width="80px" height="24px" variant="rect" />
      </div>
      
      {/* Items */}
      <div className="space-y-3 mb-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton width="48px" height="48px" variant="rect" />
            <div className="flex-1 space-y-2">
              <Skeleton height="16px" />
              <Skeleton width="60%" height="14px" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Skeleton width="100px" height="16px" />
        <Skeleton width="120px" height="36px" variant="rect" />
      </div>
    </div>
  );
};

// Dashboard Card Skeleton
export const DashboardCardSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2 flex-1">
          <Skeleton width="100px" height="14px" />
          <Skeleton width="120px" height="32px" />
        </div>
        <Skeleton width="48px" height="48px" variant="circle" />
      </div>
      <Skeleton width="60%" height="14px" />
    </div>
  );
};

// Profile Skeleton
export const ProfileSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Avatar and basic info */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton width="80px" height="80px" variant="circle" />
        <div className="flex-1 space-y-3">
          <Skeleton width="200px" height="24px" />
          <Skeleton width="150px" height="16px" />
          <Skeleton width="180px" height="16px" />
        </div>
      </div>
      
      {/* Details */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton width="100px" height="14px" />
            <Skeleton height="40px" variant="rect" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Comment Skeleton
export const CommentSkeleton = ({ className = '' }) => {
  return (
    <div className={`flex gap-3 ${className}`}>
      <Skeleton width="40px" height="40px" variant="circle" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton width="120px" height="16px" />
          <Skeleton width="80px" height="14px" />
        </div>
        <Skeleton count={2} height="14px" />
      </div>
    </div>
  );
};

// Chart Skeleton
export const ChartSkeleton = ({ type = 'bar', className = '' }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Title */}
      <div className="mb-6">
        <Skeleton width="200px" height="24px" />
        <Skeleton width="150px" height="14px" className="mt-2" />
      </div>
      
      {/* Chart area */}
      {type === 'bar' && (
        <div className="flex items-end justify-between gap-4 h-48">
          {Array.from({ length: 7 }).map((_, i) => {
            const height = Math.random() * 100 + 50;
            return (
              <Skeleton
                key={i}
                width="100%"
                height={`${height}px`}
                variant="rect"
                className="flex-1"
              />
            );
          })}
        </div>
      )}
      
      {type === 'line' && (
        <Skeleton height="192px" variant="rect" />
      )}
      
      {type === 'pie' && (
        <div className="flex items-center justify-center">
          <Skeleton width="192px" height="192px" variant="circle" />
        </div>
      )}
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton width="12px" height="12px" variant="circle" />
            <Skeleton width="60px" height="14px" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Form Skeleton
export const FormSkeleton = ({ fields = 4, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton width="120px" height="16px" />
          <Skeleton height="44px" variant="rect" />
        </div>
      ))}
      <Skeleton width="120px" height="44px" variant="rect" className="mt-6" />
    </div>
  );
};

// Page Skeleton (full page loader)
export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton width="120px" height="32px" />
            <div className="flex items-center gap-4">
              <Skeleton width="200px" height="40px" variant="rect" />
              <Skeleton width="40px" height="40px" variant="circle" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height="48px" variant="rect" />
            ))}
          </div>
          
          {/* Content */}
          <div className="lg:col-span-2 space-y-6">
            <Skeleton height="200px" variant="rect" />
            <div className="grid grid-cols-2 gap-4">
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
            </div>
            <Skeleton height="400px" variant="rect" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;