// SARSAR Platform - Badge Component
import { X } from 'lucide-react'

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  removable = false,
  onRemove,
  icon: Icon,
  dot = false,
  pulse = false,
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center gap-1.5 font-semibold rounded-full transition-all duration-200'
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
    secondary: 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200',
    success: 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200',
    warning: 'bg-accent-100 text-accent-700 hover:bg-accent-200',
    danger: 'bg-red-100 text-red-700 hover:bg-red-200',
    info: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    dark: 'bg-dark-800 text-white hover:bg-dark-900',
    light: 'bg-dark-100 text-dark-700 hover:bg-dark-200',
    outline: 'bg-transparent border-2 border-current',
    gradient: 'bg-gradient-orange text-white hover:shadow-glow-orange',
  }
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }
  
  // Pulse animation
  const pulseClass = pulse ? 'animate-pulse-soft' : ''
  
  // Combine classes
  const badgeClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${pulseClass}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  return (
    <span className={badgeClasses} {...props}>
      {/* Dot indicator */}
      {dot && (
        <span className={`
          w-2 h-2 rounded-full
          ${pulse ? 'animate-pulse-soft' : ''}
          ${variant === 'primary' ? 'bg-primary-500' : ''}
          ${variant === 'success' ? 'bg-secondary-500' : ''}
          ${variant === 'warning' ? 'bg-accent-500' : ''}
          ${variant === 'danger' ? 'bg-red-500' : ''}
          ${variant === 'info' ? 'bg-blue-500' : ''}
          ${variant === 'dark' ? 'bg-white' : ''}
        `.trim().replace(/\s+/g, ' ')} />
      )}
      
      {/* Icon */}
      {Icon && <Icon className="w-3 h-3" />}
      
      {/* Content */}
      <span>{children}</span>
      
      {/* Remove button */}
      {removable && (
        <button
          onClick={onRemove}
          className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
          aria-label="Remove"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
}

// Notification Badge (for counters)
export const NotificationBadge = ({
  count = 0,
  max = 99,
  showZero = false,
  variant = 'danger',
  size = 'md',
  className = '',
  ...props
}) => {
  // Don't show if count is 0 and showZero is false
  if (count === 0 && !showZero) {
    return null
  }
  
  // Display count (show 99+ if over max)
  const displayCount = count > max ? `${max}+` : count
  
  // Size classes for notification badge
  const sizeClasses = {
    sm: 'min-w-[16px] h-4 text-[10px] px-1',
    md: 'min-w-[20px] h-5 text-xs px-1.5',
    lg: 'min-w-[24px] h-6 text-sm px-2',
  }
  
  return (
    <Badge
      variant={variant}
      size={size}
      className={`
        ${sizeClasses[size]}
        font-bold
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {displayCount}
    </Badge>
  )
}

// Status Badge (with predefined status styles)
export const StatusBadge = ({
  status,
  className = '',
  ...props
}) => {
  const statusConfig = {
    // Order statuses
    placed: { variant: 'info', label: 'Placed', dot: true, pulse: true },
    confirmed: { variant: 'success', label: 'Confirmed', dot: true },
    picking: { variant: 'warning', label: 'Picking', dot: true, pulse: true },
    packing: { variant: 'warning', label: 'Packing', dot: true },
    out_for_delivery: { variant: 'primary', label: 'Out for Delivery', dot: true, pulse: true },
    delivered: { variant: 'success', label: 'Delivered', dot: true },
    cancelled: { variant: 'danger', label: 'Cancelled', dot: true },
    
    // Stock statuses
    in_stock: { variant: 'success', label: 'In Stock', dot: true },
    low_stock: { variant: 'warning', label: 'Low Stock', dot: true, pulse: true },
    out_of_stock: { variant: 'danger', label: 'Out of Stock', dot: true },
    
    // Payment statuses
    pending: { variant: 'warning', label: 'Pending', dot: true, pulse: true },
    paid: { variant: 'success', label: 'Paid', dot: true },
    failed: { variant: 'danger', label: 'Failed', dot: true },
    refunded: { variant: 'info', label: 'Refunded', dot: true },
    
    // Generic statuses
    active: { variant: 'success', label: 'Active', dot: true },
    inactive: { variant: 'dark', label: 'Inactive', dot: true },
    draft: { variant: 'light', label: 'Draft', dot: true },
    archived: { variant: 'dark', label: 'Archived', dot: true },
  }
  
  const config = statusConfig[status] || statusConfig.active
  
  return (
    <Badge
      variant={config.variant}
      dot={config.dot}
      pulse={config.pulse}
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  )
}

// Discount Badge (for product discounts)
export const DiscountBadge = ({
  percentage,
  className = '',
  ...props
}) => {
  if (!percentage || percentage <= 0) {
    return null
  }
  
  return (
    <Badge
      variant="gradient"
      size="md"
      className={`font-bold ${className}`}
      {...props}
    >
      {percentage}% OFF
    </Badge>
  )
}

export default Badge 