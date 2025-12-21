import React from 'react';
import { Check, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Checkbox = ({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  indeterminate = false,
  error,
  size = 'md',
  className = '',
  id,
  name,
  value,
  required = false,
}) => {
  const uniqueId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };
  
  const labelSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };
  
  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.checked, e);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!disabled && onChange) {
        onChange(!checked);
      }
    }
  };
  
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        {/* Hidden native checkbox for accessibility */}
        <input
          type="checkbox"
          id={uniqueId}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className="sr-only"
          aria-checked={indeterminate ? 'mixed' : checked}
          aria-describedby={description ? `${uniqueId}-description` : undefined}
        />

        {/* Custom checkbox */}
        <label
          htmlFor={uniqueId}
          className={`
            relative flex items-center justify-center
            ${sizeClasses[size]}
            border-2 rounded-md cursor-pointer
            transition-all duration-200 ease-in-out
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            ${error ? 'border-red-500' : ''}
            ${
              checked || indeterminate
                ? 'bg-primary border-primary'
                : 'bg-white border-gray-300 hover:border-gray-400'
            }
            ${!disabled && 'focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-20'}
          `}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="checkbox"
        >
          {/* Ripple effect on click */}
          <AnimatePresence>
            {(checked || indeterminate) && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center text-white"
              >
                {indeterminate ? (
                  <Minus className={iconSizes[size]} strokeWidth={3} />
                ) : (
                  <Check className={iconSizes[size]} strokeWidth={3} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
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

// Checkbox Group Component
export const CheckboxGroup = ({
  options = [],
  value = [],
  onChange,
  label,
  description,
  error,
  disabled = false,
  required = false,
  orientation = 'vertical',
  size = 'md',
  className = '',
}) => {
  const handleCheckboxChange = (optionValue, checked) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };
  
  const containerClasses = {
    vertical: 'flex flex-col space-y-3',
    horizontal: 'flex flex-wrap gap-4',
  };
  
  return (
    <div className={className}>
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

      {/* Checkboxes */}
      <div className={containerClasses[orientation]}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            checked={value.includes(option.value)}
            onChange={(checked) => handleCheckboxChange(option.value, checked)}
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

export default Checkbox;