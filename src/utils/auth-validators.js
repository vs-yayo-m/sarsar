/**
 * Authentication Validators
 * Validation functions for auth-related forms
 */

// Email validation
export const validateEmail = (email) => {
  if (!email) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  
  if (password.length > 128) {
    return 'Password must be less than 128 characters';
  }
  
  return null;
};

// Strong password validation
export const validateStrongPassword = (password) => {
  const basicValidation = validatePassword(password);
  if (basicValidation) return basicValidation;
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character';
  }
  
  return null;
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  if (!name) {
    return `${fieldName} is required`;
  }
  
  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters`;
  }
  
  if (name.length > 50) {
    return `${fieldName} must be less than 50 characters`;
  }
  
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }
  
  return null;
};

// Phone validation (Nepal)
export const validatePhone = (phone) => {
  if (!phone) {
    return 'Phone number is required';
  }
  
  // Remove spaces and dashes
  const cleanPhone = phone.replace(/[\s-]/g, '');
  
  // Nepal phone format: +977-9XXXXXXXXX or 9XXXXXXXXX
  const nepalPhoneRegex = /^(\+977)?9[0-9]{9}$/;
  
  if (!nepalPhoneRegex.test(cleanPhone)) {
    return 'Please enter a valid Nepal phone number (e.g., 9812345678)';
  }
  
  return null;
};

// Business name validation
export const validateBusinessName = (name) => {
  if (!name) {
    return 'Business name is required';
  }
  
  if (name.trim().length < 3) {
    return 'Business name must be at least 3 characters';
  }
  
  if (name.length > 100) {
    return 'Business name must be less than 100 characters';
  }
  
  return null;
};

// Address validation
export const validateAddress = (address) => {
  const errors = {};
  
  if (!address.area || address.area.trim().length < 2) {
    errors.area = 'Area is required';
  }
  
  if (!address.ward || address.ward < 1 || address.ward > 19) {
    errors.ward = 'Please select a valid ward (1-19)';
  }
  
  if (!address.street || address.street.trim().length < 3) {
    errors.street = 'Street address is required';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

// Login form validation
export const validateLoginForm = (formData) => {
  const errors = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  return Object.keys(errors).length > 0 ? errors : null;
};

// Registration form validation (Customer)
export const validateCustomerRegistrationForm = (formData) => {
  const errors = {};
  
  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  if (!formData.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms and conditions';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

// Registration form validation (Supplier)
export const validateSupplierRegistrationForm = (formData) => {
  const errors = {};
  
  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;
  
  const businessNameError = validateBusinessName(formData.businessName);
  if (businessNameError) errors.businessName = businessNameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;
  
  const businessPhoneError = validatePhone(formData.businessPhone);
  if (businessPhoneError) errors.businessPhone = businessPhoneError;
  
  if (!formData.businessAddress || formData.businessAddress.trim().length < 5) {
    errors.businessAddress = 'Business address is required';
  }
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  if (!formData.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms and conditions';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

// Password reset form validation
export const validatePasswordResetForm = (formData) => {
  const errors = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  return Object.keys(errors).length > 0 ? errors : null;
};

// Change password form validation
export const validateChangePasswordForm = (formData) => {
  const errors = {};
  
  const currentPasswordError = validatePassword(formData.currentPassword);
  if (currentPasswordError) errors.currentPassword = 'Current password is required';
  
  const newPasswordError = validateStrongPassword(formData.newPassword);
  if (newPasswordError) errors.newPassword = newPasswordError;
  
  const confirmPasswordError = validateConfirmPassword(formData.newPassword, formData.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  
  if (formData.currentPassword === formData.newPassword) {
    errors.newPassword = 'New password must be different from current password';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

// Profile update form validation
export const validateProfileUpdateForm = (formData) => {
  const errors = {};
  
  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;
  
  if (formData.phone) {
    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

// Password strength checker
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'None', color: 'gray' };
  
  let strength = 0;
  
  // Length
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  
  // Complexity
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
  
  const strengthMap = {
    0: { strength: 0, label: 'Very Weak', color: 'red' },
    1: { strength: 1, label: 'Weak', color: 'red' },
    2: { strength: 2, label: 'Fair', color: 'amber' },
    3: { strength: 3, label: 'Good', color: 'amber' },
    4: { strength: 4, label: 'Strong', color: 'green' },
    5: { strength: 5, label: 'Very Strong', color: 'green' },
    6: { strength: 6, label: 'Excellent', color: 'green' },
  };
  
  return strengthMap[strength] || strengthMap[0];
};

// Check if password is compromised (common passwords)
export const isCommonPassword = (password) => {
  const commonPasswords = [
    'password', '12345678', 'qwerty', 'abc123', 'monkey',
    'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou',
    'master', 'sunshine', 'ashley', 'bailey', 'shadow',
    'superman', 'qazwsx', 'michael', 'football', 'password1',
  ];
  
  return commonPasswords.includes(password.toLowerCase());
};

// Validate all auth forms
export const validateAuthForm = (formType, formData) => {
  switch (formType) {
    case 'login':
      return validateLoginForm(formData);
    case 'customer-register':
      return validateCustomerRegistrationForm(formData);
    case 'supplier-register':
      return validateSupplierRegistrationForm(formData);
    case 'password-reset':
      return validatePasswordResetForm(formData);
    case 'change-password':
      return validateChangePasswordForm(formData);
    case 'profile-update':
      return validateProfileUpdateForm(formData);
    default:
      return null;
  }
};

export default {
  validateEmail,
  validatePassword,
  validateStrongPassword,
  validateConfirmPassword,
  validateName,
  validatePhone,
  validateBusinessName,
  validateAddress,
  validateLoginForm,
  validateCustomerRegistrationForm,
  validateSupplierRegistrationForm,
  validatePasswordResetForm,
  validateChangePasswordForm,
  validateProfileUpdateForm,
  getPasswordStrength,
  isCommonPassword,
  validateAuthForm,
};