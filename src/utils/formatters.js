// SARSAR Platform - Formatting Utilities
import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'
import { DATE_FORMATS } from './constants'

// ==================== CURRENCY FORMATTING ====================
export const formatPrice = (amount, includeSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return includeSymbol ? 'NPR 0' : '0'
  }
  
  const formatted = Number(amount).toLocaleString('en-NP', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  
  return includeSymbol ? `NPR ${formatted}` : formatted
}

export const formatCurrency = formatPrice // Alias

export const parseCurrency = (formattedPrice) => {
  if (!formattedPrice) return 0
  
  // Remove currency symbols, spaces, and commas
  const cleaned = formattedPrice.toString().replace(/[^0-9.-]/g, '')
  return parseFloat(cleaned) || 0
}

// ==================== NUMBER FORMATTING ====================
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined || isNaN(num)) return '0'
  
  return Number(num).toLocaleString('en-NP', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export const formatCompactNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0'
  
  const absNum = Math.abs(num)
  
  if (absNum >= 10000000) { // 1 Crore
    return `${(num / 10000000).toFixed(1)}Cr`
  }
  if (absNum >= 100000) { // 1 Lakh
    return `${(num / 100000).toFixed(1)}L`
  }
  if (absNum >= 1000) { // 1 Thousand
    return `${(num / 1000).toFixed(1)}K`
  }
  
  return formatNumber(num)
}

export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined || isNaN(value)) return '0%'
  return `${formatNumber(value, decimals)}%`
}

// ==================== PHONE NUMBER FORMATTING ====================
export const formatPhone = (phone) => {
  if (!phone) return ''
  
  // Remove all non-numeric characters
  const cleaned = phone.toString().replace(/\D/g, '')
  
  // Nepal format: +977 98-XXXX-XXXX or +977 1-XXXX-XXXX
  if (cleaned.startsWith('977')) {
    const countryCode = cleaned.slice(0, 3)
    const rest = cleaned.slice(3)
    if (rest.length === 10) {
      return `+${countryCode} ${rest.slice(0, 2)}-${rest.slice(2, 6)}-${rest.slice(6)}`
    }
  }
  
  // Local format: 98-XXXX-XXXX
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  }
  
  return phone
}

export const formatPhoneForDisplay = formatPhone // Alias

export const unformatPhone = (phone) => {
  if (!phone) return ''
  return phone.toString().replace(/\D/g, '')
}

// ==================== DATE & TIME FORMATTING ====================
export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY) => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
    if (!isValid(dateObj)) return ''
    return format(dateObj, formatStr)
  } catch (error) {
    console.error('Date formatting error:', error)
    return ''
  }
}

export const formatDateTime = (date) => {
  return formatDate(date, DATE_FORMATS.DISPLAY_TIME)
}

export const formatTime = (date) => {
  return formatDate(date, DATE_FORMATS.TIME_ONLY)
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
    if (!isValid(dateObj)) return ''
    return formatDistanceToNow(dateObj, { addSuffix: true })
  } catch (error) {
    console.error('Relative time formatting error:', error)
    return ''
  }
}

export const formatTimeAgo = formatRelativeTime // Alias

// ==================== TEXT FORMATTING ====================
export const formatName = (name) => {
  if (!name) return ''
  
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const formatInitials = (name) => {
  if (!name) return ''
  
  const words = name.trim().split(' ')
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase()
  }
  
  return words[0].charAt(0).toUpperCase() + words[words.length - 1].charAt(0).toUpperCase()
}

export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  
  return text.slice(0, maxLength).trim() + suffix
}

export const formatSlug = (text) => {
  if (!text) return ''
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const capitalizeFirst = (text) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const capitalizeWords = (text) => {
  if (!text) return ''
  return text.split(' ').map(capitalizeFirst).join(' ')
}

// ==================== ADDRESS FORMATTING ====================
export const formatAddress = (address) => {
  if (!address) return ''
  
  const parts = [
    address.house,
    address.street,
    address.area,
    address.landmark ? `(Near ${address.landmark})` : null,
    address.ward ? `Ward ${address.ward}` : null,
    'Butwal',
  ].filter(Boolean)
  
  return parts.join(', ')
}

export const formatAddressShort = (address) => {
  if (!address) return ''
  
  const parts = [
    address.area,
    address.ward ? `Ward ${address.ward}` : null,
  ].filter(Boolean)
  
  return parts.join(', ')
}

// ==================== FILE SIZE FORMATTING ====================
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// ==================== RATING FORMATTING ====================
export const formatRating = (rating, decimals = 1) => {
  if (rating === null || rating === undefined || isNaN(rating)) return '0.0'
  return Number(rating).toFixed(decimals)
}

// ==================== ORDER ID FORMATTING ====================
export const formatOrderId = (orderId, prefix = 'SAR') => {
  if (!orderId) return ''
  
  // If already formatted, return as is
  if (orderId.includes('-')) return orderId
  
  // Format: SAR-YYYYMMDD-XXXX
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const num = orderId.toString().padStart(4, '0')
  return `${prefix}-${date}-${num}`
}

export const extractOrderNumber = (formattedId) => {
  if (!formattedId) return ''
  const parts = formattedId.split('-')
  return parts[parts.length - 1]
}

// ==================== DISTANCE FORMATTING ====================
export const formatDistance = (meters) => {
  if (!meters || meters === 0) return '0 m'
  
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  
  return `${(meters / 1000).toFixed(1)} km`
}

// ==================== DURATION FORMATTING ====================
export const formatDuration = (minutes) => {
  if (!minutes || minutes === 0) return '0 min'
  
  if (minutes < 60) {
    return `${Math.round(minutes)} min`
  }
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (mins === 0) {
    return `${hours} hr`
  }
  
  return `${hours} hr ${mins} min`
}

// ==================== CARD NUMBER FORMATTING ====================
export const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return ''
  
  // Remove all non-numeric characters
  const cleaned = cardNumber.toString().replace(/\D/g, '')
  
  // Format as XXXX XXXX XXXX XXXX
  return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
}

export const maskCardNumber = (cardNumber) => {
  if (!cardNumber) return ''
  
  const cleaned = cardNumber.toString().replace(/\D/g, '')
  const lastFour = cleaned.slice(-4)
  const masked = '**** **** **** ' + lastFour
  
  return masked
}

// ==================== ARRAY FORMATTING ====================
export const formatList = (items, conjunction = 'and') => {
  if (!items || items.length === 0) return ''
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`
  
  const allButLast = items.slice(0, -1).join(', ')
  const last = items[items.length - 1]
  
  return `${allButLast}, ${conjunction} ${last}`
}

// ==================== STATUS FORMATTING ====================
export const formatStatus = (status) => {
  if (!status) return ''
  
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Export all formatters
export default {
  formatPrice,
  formatCurrency,
  parseCurrency,
  formatNumber,
  formatCompactNumber,
  formatPercentage,
  formatPhone,
  formatPhoneForDisplay,
  unformatPhone,
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatTimeAgo,
  formatName,
  formatInitials,
  truncateText,
  formatSlug,
  capitalizeFirst,
  capitalizeWords,
  formatAddress,
  formatAddressShort,
  formatFileSize,
  formatRating,
  formatOrderId,
  extractOrderNumber,
  formatDistance,
  formatDuration,
  formatCardNumber,
  maskCardNumber,
  formatList,
  formatStatus,
}