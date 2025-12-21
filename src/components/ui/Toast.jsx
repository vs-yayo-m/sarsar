import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Toast Context
const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider = ({ children, position = 'top-right', maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      ...toast,
      duration: toast.duration ?? 5000,
    };

    setToasts((prev) => {
      const updated = [...prev, newToast];
      // Limit number of toasts
      return updated.slice(-maxToasts);
    });

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message, options = {}) => {
    return addToast({ type: 'success', message, ...options });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast({ type: 'error', message, ...options });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    return addToast({ type: 'warning', message, ...options });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    return addToast({ type: 'info', message, ...options });
  }, [addToast]);

  const promise = useCallback(async (promiseFn, messages) => {
    const id = addToast({
      type: 'info',
      message: messages.loading || 'Loading...',
      duration: null, // Don't auto-dismiss loading
    });

    try {
      const result = await promiseFn();
      removeToast(id);
      success(messages.success || 'Success!');
      return result;
    } catch (err) {
      removeToast(id);
      error(messages.error || 'Something went wrong');
      throw err;
    }
  }, [addToast, removeToast, success, error]);

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    promise,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} position={position} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, position, removeToast }) => {
  const positions = {
    'top-right': 'top-4 right-4 items-end',
    'top-left': 'top-4 left-4 items-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-right': 'bottom-4 right-4 items-end',
    'bottom-left': 'bottom-4 left-4 items-start',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className={`fixed ${positions[position]} z-50 pointer-events-none flex flex-col gap-2 max-w-md w-full`}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
            position={position}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};

// Individual Toast Component
const Toast = ({
  id,
  type = 'info',
  title,
  message,
  duration,
  onClose,
  position,
  action,
  icon: CustomIcon,
}) => {
  React.useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    success: {
      icon: CheckCircle,
      colors: 'bg-white border-l-4 border-green-500',
      iconColor: 'text-green-500',
      progressColor: 'bg-green-500',
    },
    error: {
      icon: AlertCircle,
      colors: 'bg-white border-l-4 border-red-500',
      iconColor: 'text-red-500',
      progressColor: 'bg-red-500',
    },
    warning: {
      icon: AlertTriangle,
      colors: 'bg-white border-l-4 border-amber-500',
      iconColor: 'text-amber-500',
      progressColor: 'bg-amber-500',
    },
    info: {
      icon: Info,
      colors: 'bg-white border-l-4 border-blue-500',
      iconColor: 'text-blue-500',
      progressColor: 'bg-blue-500',
    },
  };

  const IconComponent = CustomIcon || types[type].icon;
  const config = types[type];

  const slideDirection = {
    'top-right': { x: 100, y: 0 },
    'top-left': { x: -100, y: 0 },
    'top-center': { x: 0, y: -100 },
    'bottom-right': { x: 100, y: 0 },
    'bottom-left': { x: -100, y: 0 },
    'bottom-center': { x: 0, y: 100 },
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, ...slideDirection[position], scale: 0.9 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, ...slideDirection[position], scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      className={`
        ${config.colors}
        rounded-lg shadow-lg overflow-hidden
        pointer-events-auto
        w-full
      `}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <IconComponent className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
            )}
            {message && (
              <p className="text-sm text-gray-600 break-words">{message}</p>
            )}
            {action && (
              <div className="mt-2">
                {action}
              </div>
            )}
          </div>

          {/* Close button */}
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
      </div>

      {/* Progress bar */}
      {duration && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`h-1 ${config.progressColor}`}
        />
      )}
    </motion.div>
  );
};

// Standalone Toast function (without provider)
export const toast = {
  success: (message, options) => {
    console.warn('Toast Provider not found. Wrap your app with ToastProvider.');
    console.log('Success:', message);
  },
  error: (message, options) => {
    console.warn('Toast Provider not found. Wrap your app with ToastProvider.');
    console.log('Error:', message);
  },
  warning: (message, options) => {
    console.warn('Toast Provider not found. Wrap your app with ToastProvider.');
    console.log('Warning:', message);
  },
  info: (message, options) => {
    console.warn('Toast Provider not found. Wrap your app with ToastProvider.');
    console.log('Info:', message);
  },
};

// Compact Toast (smaller, minimal)
export const CompactToast = ({ type = 'info', message, onClose }) => {
  const types = {
    success: { icon: CheckCircle, color: 'bg-green-500' },
    error: { icon: AlertCircle, color: 'bg-red-500' },
    warning: { icon: AlertTriangle, color: 'bg-amber-500' },
    info: { icon: Info, color: 'bg-blue-500' },
  };

  const IconComponent = types[type].icon;
  const colorClass = types[type].color;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${colorClass} text-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2`}
    >
      <IconComponent className="w-4 h-4" />
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded-full p-0.5">
          <X className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  );
};

// Toast with custom action buttons
export const ActionToast = ({
  type = 'info',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  duration = null,
}) => {
  const { removeToast } = useToast();
  const [toastId] = React.useState(Date.now());

  React.useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        removeToast(toastId);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, toastId, removeToast]);

  const handleConfirm = () => {
    onConfirm?.();
    removeToast(toastId);
  };

  const handleCancel = () => {
    onCancel?.();
    removeToast(toastId);
  };

  return (
    <Toast
      id={toastId}
      type={type}
      message={message}
      duration={null}
      onClose={handleCancel}
      action={
        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            {confirmText}
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
        </div>
      }
    />
  );
};

export default Toast;