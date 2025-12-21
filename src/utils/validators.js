// SARSAR Platform - Validation Utilities
import { VALIDATION, LIMITS } from './constants'

// ==================== EMAIL VALIDATION ====================
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, error: 'Email is required' }
  }
  
  if (!VALIDATION.EMAIL.test(email)) {
    return { valid: false, error: 'Invalid email format' }
  }
  
  return { valid: true, error: null }
}

// ==================== PASSWORD VALIDATION ====================
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, error: 'Password is required' }
  }
  
  if (password.length < LIMITS.MIN_PASSWORD_LENGTH) {
    return { 
      valid: false, 
      error: `Password must be at least ${LIMITS.MIN_PASSWORD_LENGTH} characters` 
    }
  }
  
  if (!VALIDATION.PASSWORD.test(password)) {
    return { 
      valid: false, 
      error: 'Password must contain uppercase, lowercase, and number' 
    }
  }
  
  return { valid: true, error: null }
}

// ==================== PHONE VALIDATION ====================
export const validatePhone = (phone) => {
  if (!phone) {
    return { valid: false, error: 'Phone number is required' }
  }
  
  // Remove spaces and dashes
  const cleanPhone = phone.replace(/[\s-]/g, '')
  
  if (!VALIDATION.NEPAL_PHONE.test(cleanPhone)) {
    return { valid: false, error: 'Invalid phone number (must be 10 digits)' }
  }
  
  return { valid: true, error: null }
}

// ==================== NAME VALIDATION ====================
export const validateName = (name) => {
  if (!name) {
    return { valid: false, error: 'Name is required' }
  }
  
  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' }
  }
  
  if (name.trim().length > 50) {
    return { valid: false, error: 'Name must be less than 50 characters' }
  }
  
  return { valid: true, error: null }
}

// ==================== ADDRESS VALIDATION ====================
export const validateAddress = (address) => {
  const errors = {}
  
  if (!address.ward) {
    errors.ward = 'Ward is required'
  }
  
  if (!address.area || address.area.trim().length < 2) {
    errors.area = 'Area is required'
  }
  
  if (!address.street || address.street.trim().length < 2) {
    errors.street = 'Street address is required'
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

// ==================== PRODUCT VALIDATION ====================
export const validateProduct = (product) => {
  const errors = {}
  
  if (!product.name || product.name.trim().length < 2) {
    errors.name = 'Product name is required (min 2 characters)'
  }
  
  if (!product.category) {
    errors.category = 'Category is required'
  }
  
  if (!product.price || product.price <= 0) {
    errors.price = 'Valid price is required'
  }
  
  if (product.discountPrice && product.discountPrice >= product.price) {
    errors.discountPrice = 'Discount price must be less than regular price'
  }
  
  if (!product.stock || product.stock < 0) {
    errors.stock = 'Valid stock quantity is required'
  }
  
  if (!product.description || product.description.trim().length < 10) {
    errors.description = 'Description is required (min 10 characters)'
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

// ==================== ORDER VALIDATION ====================
export const validateOrder = (order) => {
  const errors = {}
  
  if (!order.items || order.items.length === 0) {
    errors.items = 'Order must contain at least one item'
  }
  
  if (order.items && order.items.length > LIMITS.MAX_CART_ITEMS) {
    errors.items = `Order cannot exceed ${LIMITS.MAX_CART_ITEMS} items`
  }
  
  if (!order.deliveryAddress) {
    errors.deliveryAddress = 'Delivery address is required'
  }
  
  if (!order.total || order.total < LIMITS.MIN_ORDER_AMOUNT) {
    errors.total = `Minimum order amount is NPR ${LIMITS.MIN_ORDER_AMOUNT}`
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

// ==================== REVIEW VALIDATION ====================
export const validateReview = (review) => {
  const errors = {}
  
  if (!review.rating || review.rating < 1 || review.rating > 5) {
    errors.rating = 'Rating must be between 1 and 5'
  }
  
  if (review.comment && review.comment.length > LIMITS.MAX_REVIEW_LENGTH) {
    errors.comment = `Review must be less than ${LIMITS.MAX_REVIEW_LENGTH} characters`
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

// ==================== FILE VALIDATION ====================
export const validateImage = (file) => {
  if (!file) {
    return { valid: false, error: 'File is required' }
  }
  
  if (file.size > LIMITS.MAX_IMAGE_SIZE) {
    return { 
      valid: false, 
      error: `Image must be less than ${LIMITS.MAX_IMAGE_SIZE / (1024 * 1024)}MB` 
    }
  }
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, and WebP images are allowed' }
  }
  
  return { valid: true, error: null }
}

// ==================== CREDIT CARD VALIDATION (Future) ====================
export const validateCardNumber = (cardNumber) => {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '')
  
  // Check if it's only numbers
  if (!/^\d+$/.test(cleaned)) {
    return { valid: false, error: 'Card number must contain only numbers' }
  }
  
  // Check length (13-19 digits for most cards)
  if (cleaned.length < 13 || cleaned.length > 19) {
    return { valid: false, error: 'Invalid card number length' }
  }
  
  // Luhn algorithm for checksum validation
  let sum = 0
  let isEven = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  if (sum % 10 !== 0) {
    return { valid: false, error: 'Invalid card number' }
  }
  
  return { valid: true, error: null }
}

export const validateCVV = (cvv) => {
  if (!cvv) {
    return { valid: false, error: 'CVV is required' }
  }
  
  if (!/^\d{3,4}$/.test(cvv)) {
    return { valid: false, error: 'CVV must be 3 or 4 digits' }
  }
  
  return { valid: true, error: null }
}

export const validateExpiryDate = (month, year) => {
  if (!month || !year) {
    return { valid: false, error: 'Expiry date is required' }
  }
  
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  
  const expMonth = parseInt(month)
  const expYear = parseInt(year)
  
  if (expMonth < 1 || expMonth > 12) {
    return { valid: false, error: 'Invalid month' }
  }
  
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return { valid: false, error: 'Card has expired' }
  }
  
  return { valid: true, error: null }
}

// ==================== SEARCH QUERY VALIDATION ====================
export const validateSearchQuery = (query) => {
  if (!query || query.trim().length === 0) {
    return { valid: false, error: 'Search query cannot be empty' }
  }
  
  if (query.length > 100) {
    return { valid: false, error: 'Search query too long' }
  }
  
  return { valid: true, error: null }
}

// ==================== COUPON CODE VALIDATION ====================
export const validateCouponCode = (code) => {
  if (!code) {
    return { valid: false, error: 'Coupon code is required' }
  }
  
  if (!/^[A-Z0-9]{4,20}$/.test(code)) {
    return { valid: false, error: 'Invalid coupon code format' }
  }
  
  return { valid: true, error: null }
}

// ==================== BULK VALIDATION ====================
export const validateBulkData = (data, validatorFn) => {
  const results = data.map((item, index) => {
    const result = validatorFn(item)
    return { index, ...result, data: item }
  })
  
  const valid = results.filter(r => r.valid)
  const invalid = results.filter(r => !r.valid)
  
  return {
    valid: valid.map(r => r.data),
    invalid,
    total: data.length,
    validCount: valid.length,
    invalidCount: invalid.length,
  }
}

// ==================== FORM VALIDATION HELPER ====================
export const validateForm = (formData, validationRules) => {
  const errors = {}
  
  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field]
    const value = formData[field]
    
    for (const rule of rules) {
      const result = rule.validator(value)
      if (!result.valid) {
        errors[field] = result.error
        break
      }
    }
  })
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

// Export all validators
export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
  validateAddress,
  validateProduct,
  validateOrder,
  validateReview,
  validateImage,
  validateCardNumber,
  validateCVV,
  validateExpiryDate,
  validateSearchQuery,
  validateCouponCode,
  validateBulkData,
  validateForm,
}