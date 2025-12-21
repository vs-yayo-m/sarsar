import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Radio = ({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  error,
  size = 'md',
  className = '',
  id,
  name,
  value,
  required = false,
}) => {
  const uniqueId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  const labelSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(value, e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!disabled && onChange) {
        onChange(value);
      }
    }
  };

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        {/* Hidden native radio for accessibility */}
        <input
          type="radio"
          id={uniqueId}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className="sr-only"
          aria-describedby={description ? `${uniqueId}-description` : undefined}
        />

        {/* Custom radio */}
        <label
          htmlFor={uniqueId}
          className={`
            relative flex items-center justify-center
            ${sizeClasses[size]}
            border-2 rounded-full cursor-pointer
            transition-all duration-200 ease-in-out
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            ${error ? 'border-red-500' : ''}
            ${
              checked
                ? 'bg-white border-primary'
                : 'bg-white border-gray-300 hover:border-gray-400'
            }
            ${!disabled && 'focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-20'}
          `}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="radio"
          aria-checked={checked}
        >
          {/* Inner dot */}
          <AnimatePresence>
            {checked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 500,
                  damping: 30 
                }}
                className={`${dotSizes[size]} bg-primary rounded-full`}
              />
            )}
          </AnimatePresence>

          {/* Ripple effect */}
          {checked && !disabled && (
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-full bg-primary"
            />
          )}
        </label>
      </div>

      {/* Label and description */}
      {(label || description) && (
        <div className="ml-3 flex-1">
          {label && (
            <label
              htmlFor={uniqueId}
              className={`
                font-medium text-gray-700 cursor-pointer select-none
                ${labelSizes[size]}
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          
          {description && (
            <p
              id={`${uniqueId}-description`}
              className={`
                text-gray-500 mt-0.5
                ${size === 'sm' ? 'text-xs' : 'text-sm'}
                ${disabled ? 'opacity-50' : ''}
              `}
            >
              {description}
            </p>
          )}
        </div>
      )}

      {/* Error message */}
      {error && !description && (
        <p className="ml-3 mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Radio Group Component
export const RadioGroup = ({
  options = [],
  value,
  onChange,
  label,
  description,
  error,
  disabled = false,
  required = false,
  orientation = 'vertical',
  size = 'md',
  name,
  className = '',
}) => {
  const groupName = name || `radio-group-${Math.random().toString(36).substr(2, 9)}`;

  const containerClasses = {
    vertical: 'flex flex-col space-y-3',
    horizontal: 'flex flex-wrap gap-4',
  };

  return (
    <div className={className} role="radiogroup">
      {/* Group label */}
      {label && (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}

      {/* Radio buttons */}
      <div className={containerClasses[orientation]}>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={groupName}
            value={option.value}
            checked={value === option.value}
            onChange={(val) => onChange(val)}
            label={option.label}
            description={option.description}
            disabled={disabled || option.disabled}
            size={size}
          />
        ))}
      </div>

      {/* Group error */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Radio Card Component (Premium style with cards)
export const RadioCard = ({
  checked = false,
  onChange,
  title,
  description,
  icon: Icon,
  badge,
  disabled = false,
  value,
  name,
  className = '',
}) => {
  const uniqueId = `radio-card-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`relative ${className}`}>
      <input
        type="radio"
        id={uniqueId}
        name={name}
        value={value}
        checked={checked}
        onChange={() => !disabled && onChange(value)}
        disabled={disabled}
        className="sr-only"
      />
      
      <label
        htmlFor={uniqueId}
        className={`
          block p-4 border-2 rounded-lg cursor-pointer
          transition-all duration-200
          ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-primary hover:shadow-md'}
          ${
            checked
              ? 'border-primary bg-orange-50 shadow-md'
              : 'border-gray-200 bg-white'
          }
        `}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* Icon */}
            {Icon && (
              <div className={`
                p-2 rounded-lg flex-shrink-0
                ${checked ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}
              `}>
                <Icon className="w-5 h-5" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className={`
                  font-semibold
                  ${checked ? 'text-primary' : 'text-gray-900'}
                `}>
                  {title}
                </h4>
                {badge && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-primary text-white rounded-full">
                    {badge}
                  </span>
                )}
              </div>
              {description && (
                <p className="mt-1 text-sm text-gray-600">{description}</p>
              )}
            </div>
          </div>

          {/* Radio indicator */}
          <div className={`
            flex-shrink-0 w-5 h-5 rounded-full border-2 ml-3
            flex items-center justify-center
            transition-all duration-200
            ${
              checked
                ? 'border-primary bg-white'
                : 'border-gray-300 bg-white'
            }
          `}>
            <AnimatePresence>
              {checked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-2.5 h-2.5 bg-primary rounded-full"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </label>
    </div>
  );
};

// Radio Card Group
export const RadioCardGroup = ({
  options = [],
  value,
  onChange,
  label,
  description,
  error,
  disabled = false,
  required = false,
  columns = 1,
  name,
  className = '',
}) => {
  const groupName = name || `radio-card-group-${Math.random().toString(36).substr(2, 9)}`;

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className={className}>
      {/* Group label */}
      {label && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}

      {/* Radio cards */}
      <div className={`grid ${gridClasses[columns]} gap-4`}>
        {options.map((option) => (
          <RadioCard
            key={option.value}
            name={groupName}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            title={option.title || option.label}
            description={option.description}
            icon={option.icon}
            badge={option.badge}
            disabled={disabled || option.disabled}
          />
        ))}
      </div>

      {/* Group error */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Radio;