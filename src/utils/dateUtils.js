// File: src/utils/dateUtils.js
// Date and time utility functions

import { format, formatDistance, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Format timestamp to readable date
 * @param {Date|string|Timestamp} date - Date to format
 * @param {string} formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  
  try {
    // Handle Firestore Timestamp
    const dateObj = date.toDate ? date.toDate() :
      typeof date === 'string' ? parseISO(date) :
      new Date(date);
    
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format timestamp to readable time
 * @param {Date|string|Timestamp} date - Date to format
 * @param {string} formatStr - Format string (default: 'h:mm a')
 * @returns {string} Formatted time
 */
export const formatTime = (date, formatStr = 'h:mm a') => {
  if (!date) return '';
  
  try {
    const dateObj = date.toDate ? date.toDate() :
      typeof date === 'string' ? parseISO(date) :
      new Date(date);
    
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

/**
 * Format timestamp to readable datetime
 * @param {Date|string|Timestamp} date - Date to format
 * @returns {string} Formatted datetime
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = date.toDate ? date.toDate() :
      typeof date === 'string' ? parseISO(date) :
      new Date(date);
    
    return format(dateObj, 'MMM dd, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '';
  }
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {Date|string|Timestamp} date - Date to format
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = date.toDate ? date.toDate() :
      typeof date === 'string' ? parseISO(date) :
      new Date(date);
    
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error getting relative time:', error);
    return '';
  }
};

/**
 * Get smart date label (Today, Yesterday, or date)
 * @param {Date|string|Timestamp} date - Date to check
 * @returns {string} Smart date label
 */
export const getSmartDateLabel = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = date.toDate ? date.toDate() :
      typeof date === 'string' ? parseISO(date) :
      new Date(date);
    
    if (isToday(dateObj)) {
      return 'Today';
    } else if (isYesterday(dateObj)) {
      return 'Yesterday';
    } else {
      return format(dateObj, 'MMM dd, yyyy');
    }
  } catch (error) {
    console.error('Error getting smart date label:', error);
    return '';
  }
};

/**
 * Get time remaining until a future date
 * @param {Date|string|Timestamp} futureDate - Future date
 * @returns {Object} Time remaining object
 */
export const getTimeRemaining = (futureDate) => {
  if (!futureDate) return null;
  
  try {
    const future = futureDate.toDate ? futureDate.toDate() :
      typeof futureDate === 'string' ? parseISO(futureDate) :
      new Date(futureDate);
    
    const now = new Date();
    const diff = future - now;
    
    if (diff <= 0) {
      return {
        expired: true,
        minutes: 0,
        seconds: 0
      };
    }
    
    const minutes = Math.floor(diff / 1000 / 60);
    const seconds = Math.floor((diff / 1000) % 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    return {
      expired: false,
      total: diff,
      days,
      hours: hours % 24,
      minutes: minutes % 60,
      seconds
    };
  } catch (error) {
    console.error('Error calculating time remaining:', error);
    return null;
  }
};

/**
 * Format countdown timer (HH:MM:SS or MM:SS)
 * @param {Date|string|Timestamp} futureDate - Future date
 * @returns {string} Formatted countdown
 */
export const formatCountdown = (futureDate) => {
  const remaining = getTimeRemaining(futureDate);
  
  if (!remaining || remaining.expired) {
    return '00:00';
  }
  
  const { hours, minutes, seconds } = remaining;
  
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

/**
 * Check if date is in the past
 * @param {Date|string|Timestamp} date - Date to check
 * @returns {boolean} True if past
 */
export const isPast = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = date.toDate ? date.toDate() :
      typeof date === 'string' ? parseISO(date) :
      new Date(date);
    
    return dateObj < new Date();
  } catch (error) {
    console.error('Error checking if past:', error);
    return false;
  }
};

/**
 * Check if date is in the future
 * @param {Date|string|Timestamp} date - Date to check
 * @returns {boolean} True if future
 */
export const isFuture = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = date.toDate ? date.toDate() :
      typeof date === 'string' ? parseISO(date) :
      new Date(date);
    
    return dateObj > new Date();
  } catch (error) {
    console.error('Error checking if future:', error);
    return false;
  }
};

/**
 * Get time slot label (Morning, Afternoon, Evening)
 * @param {Date|string|Timestamp} date - Date to check
 * @returns {string} Time slot label
 */
export const getTimeSlot = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = date.toDate ? date.toDate() :
      typeof date === 'string' ? parseISO(date) :
      new Date(date);
    
    const hour = dateObj.getHours();
    
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  } catch (error) {
    console.error('Error getting time slot:', error);
    return '';
  }
};

/**
 * Add minutes to date
 * @param {Date|string|Timestamp} date - Base date
 * @param {number} minutes - Minutes to add
 * @returns {Date} New date
 */
export const addMinutes = (date, minutes) => {
  const dateObj = date.toDate ? date.toDate() :
    typeof date === 'string' ? parseISO(date) :
    new Date(date);
  
  return new Date(dateObj.getTime() + minutes * 60000);
};

/**
 * Calculate delivery time estimate
 * @param {string} deliveryType - 'standard' | 'express' | 'scheduled'
 * @param {Date} scheduledTime - Scheduled time (if applicable)
 * @returns {Date} Estimated delivery time
 */
export const calculateEstimatedDelivery = (deliveryType, scheduledTime = null) => {
  const now = new Date();
  
  if (deliveryType === 'express') {
    return addMinutes(now, 30); // 30 minutes for express
  } else if (deliveryType === 'scheduled' && scheduledTime) {
    return scheduledTime.toDate ? scheduledTime.toDate() : new Date(scheduledTime);
  } else {
    return addMinutes(now, 60); // 1 hour for standard
  }
};