import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Spinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  fullScreen = false,
  label,
  variant = 'circular',
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16',
  };

  const colors = {
    primary: 'text-primary',
    white: 'text-white',
    gray: 'text-gray-600',
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
  };

  const spinnerElement = variant === 'circular' ? (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
      className={`${sizes[size]} ${colors[color]} ${className}`}
    >
      <Loader2 className="w-full h-full" />
    </motion.div>
  ) : variant === 'dots' ? (
    <div className={`flex gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          className={`w-2 h-2 rounded-full ${colors[color].replace('text-', 'bg-')}`}
        />
      ))}
    </div>
  ) : variant === 'bars' ? (
    <div className={`flex gap-1 items-end ${className}`}>
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{
            scaleY: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
          }}
          className={`w-1 h-4 ${colors[color].replace('text-', 'bg-')}`}
          style={{ transformOrigin: 'bottom' }}
        />
      ))}
    </div>
  ) : variant === 'pulse' ? (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
      }}
      className={`${sizes[size]} rounded-full ${colors[color].replace('text-', 'bg-')}`}
    />
  ) : null;

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {spinnerElement}
      {label && (
        <p className={`text-sm ${colors[color]} font-medium`}>{label}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// Button Spinner (inline with button text)
export const ButtonSpinner = ({ size = 'sm', className = '' }) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
      className={`${sizes[size]} ${className}`}
    >
      <Loader2 className="w-full h-full" />
    </motion.div>
  );
};

// Overlay Spinner (with backdrop)
export const OverlaySpinner = ({
  show = false,
  size = 'xl',
  label,
  blur = true,
}) => {
  if (!show) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        ${blur ? 'bg-white/80 backdrop-blur-sm' : 'bg-white/90'}
      `}
    >
      <Spinner size={size} label={label} />
    </div>
  );
};

// Content Spinner (for loading content areas)
export const ContentSpinner = ({
  show = false,
  size = 'lg',
  label = 'Loading...',
  minHeight = '300px',
  className = '',
}) => {
  if (!show) return null;

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ minHeight }}
    >
      <Spinner size={size} label={label} />
    </div>
  );
};

// Inline Spinner (for inline loading states)
export const InlineSpinner = ({ size = 'sm', className = '' }) => {
  return (
    <span className={`inline-flex ${className}`}>
      <Spinner size={size} variant="circular" />
    </span>
  );
};

// Progress Spinner (with percentage)
export const ProgressSpinner = ({
  progress = 0,
  size = 'xl',
  color = 'primary',
  showPercentage = true,
  className = '',
}) => {
  const sizes = {
    md: { circle: 'w-16 h-16', stroke: 6 },
    lg: { circle: 'w-24 h-24', stroke: 8 },
    xl: { circle: 'w-32 h-32', stroke: 10 },
    '2xl': { circle: 'w-40 h-40', stroke: 12 },
  };

  const colors = {
    primary: '#FF6B35',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
  };

  const { circle, stroke } = sizes[size];
  const radius = 50 - stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg className={circle} viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={stroke}
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={colors[color]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

// Logo Spinner (custom brand spinner)
export const LogoSpinner = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-2xl shadow-lg flex items-center justify-center"
      >
        <span className="text-white font-bold text-2xl">S</span>
      </motion.div>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-2 h-2 rounded-full bg-primary"
          />
        ))}
      </div>
    </div>
  );
};

// Card Loader (for card components)
export const CardLoader = ({ count = 1, className = '' }) => {
  return (
    <div className={`grid gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center min-h-[200px]"
        >
          <Spinner size="lg" label="Loading..." />
        </div>
      ))}
    </div>
  );
};

// Search Spinner (for search boxes)
export const SearchSpinner = ({ className = '' }) => {
  return (
    <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${className}`}>
      <Spinner size="sm" variant="circular" />
    </div>
  );
};

// File Upload Spinner
export const FileUploadSpinner = ({ progress = 0, fileName, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg ${className}`}>
      <ProgressSpinner progress={progress} size="md" showPercentage={false} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
        <p className="text-xs text-gray-500">{Math.round(progress)}% uploaded</p>
      </div>
    </div>
  );
};

// List Loading Spinner
export const ListLoadingSpinner = ({ label = 'Loading more...', className = '' }) => {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="flex items-center gap-3">
        <Spinner size="md" variant="dots" />
        <span className="text-sm text-gray-600">{label}</span>
      </div>
    </div>
  );
};

export default Spinner;