// SARSAR Platform - Calculation Utilities
import { DELIVERY_FEES, DELIVERY_TYPES, LIMITS } from './constants'

// ==================== CART CALCULATIONS ====================
export const calculateSubtotal = (items) => {
  if (!items || items.length === 0) return 0
  
  return items.reduce((total, item) => {
    const price = item.discountPrice || item.price
    const quantity = item.quantity || 1
    return total + (price * quantity)
  }, 0)
}

export const calculateDiscount = (items) => {
  if (!items || items.length === 0) return 0
  
  return items.reduce((discount, item) => {
    if (item.discountPrice && item.price > item.discountPrice) {
      const itemDiscount = (item.price - item.discountPrice) * (item.quantity || 1)
      return discount + itemDiscount
    }
    return discount
  }, 0)
}

export const calculateDeliveryFee = (subtotal, deliveryType = DELIVERY_TYPES.STANDARD) => {
  // Free delivery for first order or above threshold
  if (subtotal >= LIMITS.FREE_DELIVERY_THRESHOLD) {
    return 0
  }
  
  return DELIVERY_FEES[deliveryType] || DELIVERY_FEES[DELIVERY_TYPES.STANDARD]
}

export const calculateTax = (subtotal, taxRate = 0) => {
  // Nepal currently has no VAT on essentials, but keeping for future
  return subtotal * (taxRate / 100)
}

export const calculateCouponDiscount = (subtotal, coupon) => {
  if (!coupon || !coupon.active) return 0
  
  // Check minimum order amount
  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return 0
  }
  
  // Calculate discount based on type
  if (coupon.type === 'percentage') {
    const discount = subtotal * (coupon.value / 100)
    return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount
  }
  
  if (coupon.type === 'fixed') {
    return Math.min(coupon.value, subtotal)
  }
  
  if (coupon.type === 'free_delivery') {
    return 0 // Handled separately in delivery fee calculation
  }
  
  return 0
}

export const calculateCartTotal = (items, deliveryType, coupon = null, taxRate = 0) => {
  const subtotal = calculateSubtotal(items)
  const itemDiscount = calculateDiscount(items)
  const deliveryFee = calculateDeliveryFee(subtotal, deliveryType)
  const couponDiscount = calculateCouponDiscount(subtotal, coupon)
  const tax = calculateTax(subtotal - couponDiscount, taxRate)
  
  // If coupon provides free delivery
  const finalDeliveryFee = coupon?.type === 'free_delivery' ? 0 : deliveryFee
  
  const total = subtotal - itemDiscount - couponDiscount + finalDeliveryFee + tax
  
  return {
    subtotal,
    itemDiscount,
    couponDiscount,
    deliveryFee: finalDeliveryFee,
    tax,
    total: Math.max(0, total), // Never negative
    savings: itemDiscount + couponDiscount + (deliveryFee - finalDeliveryFee),
  }
}

// ==================== PRODUCT CALCULATIONS ====================
export const calculateDiscountPercentage = (originalPrice, discountPrice) => {
  if (!originalPrice || !discountPrice || discountPrice >= originalPrice) return 0
  
  const discount = ((originalPrice - discountPrice) / originalPrice) * 100
  return Math.round(discount)
}

export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0
  
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0)
  return sum / reviews.length
}

export const calculateRatingDistribution = (reviews) => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  
  if (!reviews || reviews.length === 0) {
    return distribution
  }
  
  reviews.forEach(review => {
    const rating = Math.floor(review.rating)
    if (rating >= 1 && rating <= 5) {
      distribution[rating]++
    }
  })
  
  return distribution
}

export const calculateStockStatus = (currentStock, reorderPoint = 10) => {
  if (currentStock === 0) return 'out_of_stock'
  if (currentStock <= reorderPoint) return 'low_stock'
  return 'in_stock'
}

// ==================== ORDER CALCULATIONS ====================
export const calculateOrderTotal = (order) => {
  const subtotal = order.subtotal || 0
  const deliveryFee = order.deliveryFee || 0
  const discount = order.discount || 0
  const tax = order.tax || 0
  
  return subtotal + deliveryFee - discount + tax
}

export const calculateOrderProfit = (order, costPrice) => {
  const revenue = calculateOrderTotal(order)
  const cost = costPrice || 0
  const deliveryCost = order.deliveryFee * 0.5 // Assume 50% delivery cost
  
  return revenue - cost - deliveryCost
}

export const calculateCommission = (orderTotal, commissionRate = 10) => {
  return orderTotal * (commissionRate / 100)
}

// ==================== TIME & DELIVERY CALCULATIONS ====================
export const calculateEstimatedDeliveryTime = (orderTime, deliveryType = DELIVERY_TYPES.STANDARD) => {
  const now = orderTime || new Date()
  const deliveryMinutes = DELIVERY_TYPES[deliveryType] || 60
  
  const estimatedTime = new Date(now.getTime() + deliveryMinutes * 60000)
  return estimatedTime
}

export const calculateTimeRemaining = (estimatedTime) => {
  const now = new Date()
  const estimated = new Date(estimatedTime)
  const diffMs = estimated - now
  
  if (diffMs <= 0) return { minutes: 0, seconds: 0, overdue: true }
  
  const minutes = Math.floor(diffMs / 60000)
  const seconds = Math.floor((diffMs % 60000) / 1000)
  
  return { minutes, seconds, overdue: false }
}

export const calculateFulfillmentTime = (orderPlacedTime, deliveredTime) => {
  const start = new Date(orderPlacedTime)
  const end = new Date(deliveredTime)
  const diffMs = end - start
  
  return Math.floor(diffMs / 60000) // Return minutes
}

// ==================== ANALYTICS CALCULATIONS ====================
export const calculateGrowthRate = (current, previous) => {
  if (!previous || previous === 0) return 0
  
  const growth = ((current - previous) / previous) * 100
  return Math.round(growth * 10) / 10 // Round to 1 decimal
}

export const calculateConversionRate = (conversions, visits) => {
  if (!visits || visits === 0) return 0
  
  return (conversions / visits) * 100
}

export const calculateAverageOrderValue = (totalRevenue, totalOrders) => {
  if (!totalOrders || totalOrders === 0) return 0
  
  return totalRevenue / totalOrders
}

export const calculateCustomerLifetimeValue = (averageOrderValue, purchaseFrequency, customerLifespan) => {
  // CLV = Average Order Value × Purchase Frequency × Customer Lifespan
  return averageOrderValue * purchaseFrequency * customerLifespan
}

export const calculateRetentionRate = (customersAtEnd, newCustomers, customersAtStart) => {
  if (!customersAtStart || customersAtStart === 0) return 0
  
  const retained = customersAtEnd - newCustomers
  return (retained / customersAtStart) * 100
}

export const calculateChurnRate = (retentionRate) => {
  return 100 - retentionRate
}

// ==================== INVENTORY CALCULATIONS ====================
export const calculateReorderPoint = (dailySalesRate, leadTime, safetyStock = 0) => {
  // Reorder Point = (Daily Sales Rate × Lead Time) + Safety Stock
  return (dailySalesRate * leadTime) + safetyStock
}

export const calculateEconomicOrderQuantity = (annualDemand, orderCost, holdingCost) => {
  // EOQ = √((2 × Annual Demand × Order Cost) / Holding Cost)
  return Math.sqrt((2 * annualDemand * orderCost) / holdingCost)
}

export const calculateStockTurnoverRate = (costOfGoodsSold, averageInventory) => {
  if (!averageInventory || averageInventory === 0) return 0
  
  return costOfGoodsSold / averageInventory
}

export const calculateDaysOfInventory = (averageInventory, dailyCostOfGoodsSold) => {
  if (!dailyCostOfGoodsSold || dailyCostOfGoodsSold === 0) return 0
  
  return averageInventory / dailyCostOfGoodsSold
}

// ==================== FINANCIAL CALCULATIONS ====================
export const calculateProfitMargin = (revenue, cost) => {
  if (!revenue || revenue === 0) return 0
  
  const profit = revenue - cost
  return (profit / revenue) * 100
}

export const calculateROI = (gain, cost) => {
  if (!cost || cost === 0) return 0
  
  return ((gain - cost) / cost) * 100
}

export const calculateBreakEvenPoint = (fixedCosts, pricePerUnit, variableCostPerUnit) => {
  const contributionMargin = pricePerUnit - variableCostPerUnit
  
  if (contributionMargin <= 0) return Infinity
  
  return Math.ceil(fixedCosts / contributionMargin)
}

// ==================== DISTANCE CALCULATIONS ====================
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Haversine formula for calculating distance between two coordinates
  const R = 6371 // Earth's radius in kilometers
  
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return distance * 1000 // Return in meters
}

const toRadians = (degrees) => {
  return degrees * (Math.PI / 180)
}

// ==================== PAGINATION CALCULATIONS ====================
export const calculatePagination = (totalItems, currentPage = 1, itemsPerPage = 20) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const page = Math.max(1, Math.min(currentPage, totalPages))
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  
  return {
    currentPage: page,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    totalItems,
  }
}

// ==================== PERCENTAGE CALCULATIONS ====================
export const calculatePercentageOf = (value, total) => {
  if (!total || total === 0) return 0
  return (value / total) * 100
}

export const calculatePercentageChange = (newValue, oldValue) => {
  if (!oldValue || oldValue === 0) return 0
  return ((newValue - oldValue) / oldValue) * 100
}

// Export all calculations
export default {
  calculateSubtotal,
  calculateDiscount,
  calculateDeliveryFee,
  calculateTax,
  calculateCouponDiscount,
  calculateCartTotal,
  calculateDiscountPercentage,
  calculateAverageRating,
  calculateRatingDistribution,
  calculateStockStatus,
  calculateOrderTotal,
  calculateOrderProfit,
  calculateCommission,
  calculateEstimatedDeliveryTime,
  calculateTimeRemaining,
  calculateFulfillmentTime,
  calculateGrowthRate,
  calculateConversionRate,
  calculateAverageOrderValue,
  calculateCustomerLifetimeValue,
  calculateRetentionRate,
  calculateChurnRate,
  calculateReorderPoint,
  calculateEconomicOrderQuantity,
  calculateStockTurnoverRate,
  calculateDaysOfInventory,
  calculateProfitMargin,
  calculateROI,
  calculateBreakEvenPoint,
  calculateDistance,
  calculatePagination,
  calculatePercentageOf,
  calculatePercentageChange,
}