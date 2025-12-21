import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Alert = ({
  type = 'info',
  title,
  message,
  icon: CustomIcon,
  onClose,
  dismissible = true,
  actions,
  variant = 'filled',
  size = 'md',
  className = '',
}) => {
  const types = {
    success: {
      icon: CheckCircle,
      colors: {
        filled: 'bg-green-50 border-green-200 text-green-800',
        outlined: 'bg-white border-green-500 text-green-800',
        solid: 'bg-green-500 border-green-500 text-white',
      },
      iconColor: {
        filled: 'text-green-500',
        outlined: 'text-green-500',
        solid: 'text-white',
      },
    },
    error: {
      icon: AlertCircle,
      colors: {
        filled: 'bg-red-50 border-red-200 text-red-800',
        outlined: 'bg-white border-red-500 text-red-800',
        solid: 'bg-red-500 border-red-500 text-white',
      },
      iconColor: {
        filled: 'text-red-500',
        outlined: 'text-red-500',
        solid: 'text-white',
      },
    },
    warning: {
      icon: AlertTriangle,
      colors: {
        filled: 'bg-amber-50 border-amber-200 text-amber-800',
        outlined: 'bg-white border-amber-500 text-amber-800',
        solid: 'bg-amber-500 border-amber-500 text-white',
      },
      iconColor: {
        filled: 'text-amber-500',
        outlined: 'text-amber-500',
        solid: 'text-white',
      },
    },
    info: {
      icon: Info,
      colors: {
        filled: 'bg-blue-50 border-blue-200 text-blue-800',
        outlined: 'bg-white border-blue-500 text-blue-800',
        solid: 'bg-blue-500 border-blue-500 text-white',
      },
      iconColor: {
        filled: 'text-blue-500',
        outlined: 'text-blue-500',
        solid: 'text-white',
      },
    },
  };

  const sizes = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-5 text-lg',
  };

  const IconComponent = CustomIcon || types[type].icon;
  const colorClass = types[type].colors[variant];
  const iconColorClass = types[type].iconColor[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`
        ${colorClass}
        ${sizes[size]}
        border rounded-lg
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 ${iconColorClass}`}>
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold mb-1">{title}</h4>
          )}
          {message && (
            <div className={`${title ? 'mt-1' : ''} ${variant === 'solid' ? 'text-white' : ''}`}>
              {typeof message === 'string' ? <p>{message}</p> : message}
            </div>
          )}

          {/* Actions */}
          {actions && (
            <div className="flex gap-2 mt-3">
              {actions}
            </div>
          )}
        </div>

        {/* Close button */}
        {dismissible && onClose && (
          <button
            onClick={onClose}
            className={`
              flex-shrink-0 p-1 rounded-lg transition-colors
              ${variant === 'solid' ? 'text-white hover:bg-white/20' : 'hover:bg-black/10'}
            `}
            aria-label="Close alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Banner Alert (full width, top of page)
export const BannerAlert = ({
  type = 'info',
  message,
  icon: CustomIcon,
  onClose,
  dismissible = true,
  actions,
  className = '',
}) => {
  const types = {
    success: {
      icon: CheckCircle,
      bg: 'bg-green-500',
      text: 'text-white',
    },
    error: {
      icon: AlertCircle,
      bg: 'bg-red-500',
      text: 'text-white',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-500',
      text: 'text-white',
    },
    info: {
      icon: Info,
      bg: 'bg-blue-500',
      text: 'text-white',
    },
    promo: {
      icon: null,
      bg: 'bg-primary',
      text: 'text-white',
    },
  };

  const IconComponent = CustomIcon || types[type].icon;
  const bgClass = types[type].bg;
  const textClass = types[type].text;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`${bgClass} ${textClass} ${className}`}
      role="alert"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3">
          {/* Icon */}
          {IconComponent && (
            <IconComponent className="w-5 h-5 flex-shrink-0" />
          )}

          {/* Message */}
          <div className="flex-1 text-center sm:text-left">
            {typeof message === 'string' ? <p className="font-medium">{message}</p> : message}
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex gap-2">
              {actions}
            </div>
          )}

          {/* Close button */}
          {dismissible && onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Close banner"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Inline Alert (compact, for forms)
export const InlineAlert = ({
  type = 'info',
  message,
  className = '',
}) => {
  const types = {
    success: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    info: {
      icon: Info,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  };

  const IconComponent = types[type].icon;
  const colorClass = types[type].color;
  const bgClass = types[type].bg;

  return (
    <div className={`flex items-start gap-2 ${bgClass} ${colorClass} p-3 rounded-lg ${className}`}>
      <IconComponent className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

// Toast-style Alert (for notifications)
export const ToastAlert = ({
  type = 'info',
  title,
  message,
  onClose,
  duration = 5000,
  position = 'top-right',
  className = '',
}) => {
  React.useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  const types = {
    success: {
      icon: CheckCircle,
      bg: 'bg-white border-green-500',
      iconColor: 'text-green-500',
    },
    error: {
      icon: AlertCircle,
      bg: 'bg-white border-red-500',
      iconColor: 'text-red-500',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-white border-amber-500',
      iconColor: 'text-amber-500',
    },
    info: {
      icon: Info,
      bg: 'bg-white border-blue-500',
      iconColor: 'text-blue-500',
    },
  };

  const IconComponent = types[type].icon;
  const bgClass = types[type].bg;
  const iconColorClass = types[type].iconColor;

  return (
    <motion.div
      initial={{ opacity: 0, x: position.includes('right') ? 100 : position.includes('left') ? -100 : 0, y: position.includes('top') ? -100 : position.includes('bottom') ? 100 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: position.includes('right') ? 100 : position.includes('left') ? -100 : 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      className={`
        fixed ${positions[position]} z-50
        ${bgClass}
        border-l-4 rounded-lg shadow-lg p-4
        max-w-sm w-full
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${iconColorClass}`}>
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
          )}
          {message && (
            <p className="text-sm text-gray-600">{message}</p>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      {duration && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`absolute bottom-0 left-0 h-1 ${types[type].bg.split(' ')[0]} rounded-bl-lg`}
        />
      )}
    </motion.div>
  );
};

export default Alert;