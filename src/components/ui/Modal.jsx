// SARSAR Platform - Modal Component
import { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  showClose = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full mx-4',
  }
  
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose()
    }
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1040]"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-[1050] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className={`
                  relative w-full bg-white rounded-2xl shadow-strong
                  ${sizeClasses[size] || sizeClasses.md}
                  ${className}
                `.trim().replace(/\s+/g, ' ')}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
                aria-describedby={description ? 'modal-description' : undefined}
              >
                {/* Close Button */}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg text-dark-400 hover:text-dark-600 hover:bg-dark-100 transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                
                {/* Content */}
                <div className="p-6">
                  {children}
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// Modal Header Component
export const ModalHeader = ({ children, className = '' }) => {
  return (
    <div className={`mb-4 pr-8 ${className}`}>
      {children}
    </div>
  )
}

// Modal Title Component
export const ModalTitle = ({ children, className = '' }) => {
  return (
    <h2
      id="modal-title"
      className={`text-2xl font-bold text-dark-900 ${className}`}
    >
      {children}
    </h2>
  )
}

// Modal Description Component
export const ModalDescription = ({ children, className = '' }) => {
  return (
    <p
      id="modal-description"
      className={`mt-2 text-sm text-dark-600 ${className}`}
    >
      {children}
    </p>
  )
}

// Modal Body Component
export const ModalBody = ({ children, className = '' }) => {
  return (
    <div className={`mb-6 ${className}`}>
      {children}
    </div>
  )
}

// Modal Footer Component
export const ModalFooter = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-end gap-3 pt-4 border-t border-dark-200 ${className}`}>
      {children}
    </div>
  )
}

// Confirm Dialog Component (pre-built)
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
}) => {
  const variantClasses = {
    primary: 'bg-gradient-orange text-white hover:shadow-glow-orange',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-gradient-green text-white hover:shadow-glow-green',
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        {message && <ModalDescription>{message}</ModalDescription>}
      </ModalHeader>
      
      <ModalFooter>
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-xl border-2 border-dark-300 text-dark-900 hover:border-primary-500 hover:text-primary-500 transition-all duration-200 font-semibold"
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${variantClasses[variant]}`}
        >
          {confirmText}
        </button>
      </ModalFooter>
    </Modal>
  )
}

export default Modal
 