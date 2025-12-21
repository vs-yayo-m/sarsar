// SARSAR Platform - Button Component
import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}, ref) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-orange text-white hover:shadow-glow-orange hover:scale-105 active:scale-95 focus:ring-primary-500',
    secondary: 'bg-white text-primary-500 border-2 border-primary-500 hover:bg-primary-500 hover:text-white focus:ring-primary-500',
    ghost: 'bg-transparent text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
    outline: 'bg-transparent border-2 border-dark-300 text-dark-900 hover:border-primary-500 hover:text-primary-500 focus:ring-primary-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg focus:ring-red-500',
    success: 'bg-gradient-green text-white hover:shadow-glow-green hover:scale-105 active:scale-95 focus:ring-secondary-500',
    link: 'bg-transparent text-primary-500 hover:underline p-0 min-h-0',
  }
  
  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-lg min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg rounded-2xl min-h-[52px]',
  }
  
  // Width class
  const widthClass = fullWidth ? 'w-full' : ''
  
  // Combine classes
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${widthClass}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  // Determine if button should be disabled
  const isDisabled = disabled || loading
  
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="w-4 h-4" />
      )}
      
      {children}
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4" />
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button