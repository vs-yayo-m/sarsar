// SARSAR Platform - Input Component
import { forwardRef, useState } from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  success,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  required = false,
  className = '',
  wrapperClassName = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  
  // Determine input type
  const inputType = type === 'password' && showPassword ? 'text' : type
  
  // Base input classes
  const baseClasses = 'w-full px-4 py-3 rounded-xl border-2 bg-white text-dark-900 placeholder:text-dark-400 transition-all duration-200 focus:outline-none disabled:bg-dark-50 disabled:cursor-not-allowed'
  
  // State classes
  const stateClasses = error ?
    'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' :
    success ?
    'border-secondary-500 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20' :
    'border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
  
  // Icon padding
  const iconPaddingClass = Icon && iconPosition === 'left' ?
    'pl-12' :
    Icon && iconPosition === 'right' ?
    'pr-12' :
    ''
  
  // Password toggle padding
  const passwordPaddingClass = type === 'password' ? 'pr-12' : ''
  
  // Combine input classes
  const inputClasses = `
    ${baseClasses}
    ${stateClasses}
    ${iconPaddingClass}
    ${passwordPaddingClass}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  // Wrapper width class
  const widthClass = fullWidth ? 'w-full' : ''
  
  return (
    <div className={`${widthClass} ${wrapperClassName}`}>
      {/* Label */}
      {label && (
        <label className="block mb-2 text-sm font-medium text-dark-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Wrapper */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        {/* Input */}
        <input
          ref={ref}
          type={inputType}
          className={inputClasses}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {/* Right Icon */}
        {Icon && iconPosition === 'right' && !type === 'password' && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
        
        {/* Error/Success Icon */}
        {(error || success) && (
          <div className={`absolute right-4 top-1/2 -translate-y-1/2 ${type === 'password' ? 'right-12' : ''}`}>
            {error && <AlertCircle className="w-5 h-5 text-red-500" />}
            {success && <CheckCircle className="w-5 h-5 text-secondary-500" />}
          </div>
        )}
      </div>
      
      {/* Helper/Error Text */}
      {(error || success || helperText) && (
        <p className={`mt-2 text-sm ${
          error
            ? 'text-red-500'
            : success
            ? 'text-secondary-500'
            : 'text-dark-600'
        }`}>
          {error || success || helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

// Textarea Component
export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  fullWidth = false,
  disabled = false,
  required = false,
  rows = 4,
  className = '',
  wrapperClassName = '',
  ...props
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 rounded-xl border-2 bg-white text-dark-900 placeholder:text-dark-400 transition-all duration-200 focus:outline-none disabled:bg-dark-50 disabled:cursor-not-allowed resize-none'
  
  const stateClasses = error ?
    'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' :
    'border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
  
  const textareaClasses = `
    ${baseClasses}
    ${stateClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  const widthClass = fullWidth ? 'w-full' : ''
  
  return (
    <div className={`${widthClass} ${wrapperClassName}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-dark-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        className={textareaClasses}
        disabled={disabled}
        {...props}
      />
      
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-500' : 'text-dark-600'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Input