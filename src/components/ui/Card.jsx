// SARSAR Platform - Card Component
import { forwardRef } from 'react'

const Card = forwardRef(({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  className = '',
  onClick,
  ...props
}, ref) => {
  // Base classes
  const baseClasses = 'bg-white rounded-2xl'
  
  // Variant classes
  const variantClasses = {
    default: 'shadow-soft',
    bordered: 'border-2 border-dark-200',
    elevated: 'shadow-medium',
    flat: 'shadow-none',
    gradient: 'bg-gradient-to-br from-white to-dark-50 shadow-soft',
    glass: 'glass-effect',
  }
  
  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
  
  // Hover effect
  const hoverClasses = hover ?
    'transition-all duration-300 hover:shadow-medium hover:-translate-y-1 cursor-pointer' :
    ''
  
  // Clickable effect
  const clickableClasses = clickable ?
    'cursor-pointer transition-transform active:scale-98' :
    ''
  
  // Combine classes
  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.default}
    ${paddingClasses[padding] || paddingClasses.md}
    ${hoverClasses}
    ${clickableClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  return (
    <div
      ref={ref}
      className={cardClasses}
      onClick={onClick}
      role={clickable || onClick ? 'button' : undefined}
      tabIndex={clickable || onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

// Card Header Component
export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

// Card Title Component
export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`text-xl font-bold text-dark-900 ${className}`} {...props}>
      {children}
    </h3>
  )
}

// Card Description Component
export const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`text-sm text-dark-600 ${className}`} {...props}>
      {children}
    </p>
  )
}

// Card Content Component
export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  )
}

// Card Footer Component
export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`mt-4 pt-4 border-t border-dark-200 ${className}`} {...props}>
      {children}
    </div>
  )
}

// Export all components
export default Card
