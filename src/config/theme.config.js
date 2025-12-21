// SARSAR Platform - Theme Configuration
// Centralized theme settings for consistent design

export const theme = {
  // ==================== COLORS ====================
  colors: {
    primary: {
      50: '#FFF4ED',
      100: '#FFE6D5',
      200: '#FFCBAA',
      300: '#FFA574',
      400: '#FF7A3C',
      500: '#FF6B35', // Main Orange
      600: '#F7931E', // Deep Orange
      700: '#E8590C',
      800: '#B8460C',
      900: '#943B0D',
    },
    secondary: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#10B981', // Success Green
      600: '#059669',
      700: '#047857',
      800: '#065F46',
      900: '#064E3B',
    },
    accent: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B', // Amber
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
    dark: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#2D2D2D', // Dark Charcoal
    },
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    info: '#3B82F6',
  },

  // ==================== TYPOGRAPHY ====================
  typography: {
    fontFamily: {
      sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      display: ['Poppins', 'Inter', 'sans-serif'],
      body: ['Inter', 'SF Pro Text', 'system-ui', 'sans-serif'],
      mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
    },
    fontWeight: {
      thin: 100,
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6,
      loose: 2,
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em',
    },
  },

  // ==================== SPACING ====================
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },

  // ==================== BORDER RADIUS ====================
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    full: '9999px',
  },

  // ==================== SHADOWS ====================
  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.15)',
    soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
    medium: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.04)',
    strong: '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
    glowOrange: '0 0 20px rgba(255, 107, 53, 0.3)',
    glowGreen: '0 0 20px rgba(16, 185, 129, 0.3)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  },

  // ==================== TRANSITIONS ====================
  transitions: {
    fast: '150ms',
    base: '200ms',
    medium: '300ms',
    slow: '500ms',
    verySlow: '1000ms',
  },

  // ==================== EASING ====================
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // ==================== BREAKPOINTS ====================
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ==================== Z-INDEX ====================
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    backdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080,
  },

  // ==================== COMPONENT SIZES ====================
  componentSizes: {
    button: {
      sm: {
        height: '36px',
        padding: '0 16px',
        fontSize: '14px',
      },
      md: {
        height: '44px',
        padding: '0 24px',
        fontSize: '16px',
      },
      lg: {
        height: '52px',
        padding: '0 32px',
        fontSize: '18px',
      },
    },
    input: {
      sm: {
        height: '36px',
        padding: '0 12px',
        fontSize: '14px',
      },
      md: {
        height: '48px',
        padding: '0 16px',
        fontSize: '16px',
      },
      lg: {
        height: '56px',
        padding: '0 20px',
        fontSize: '18px',
      },
    },
    card: {
      padding: {
        sm: '16px',
        md: '24px',
        lg: '32px',
      },
    },
  },

  // ==================== GRADIENTS ====================
  gradients: {
    orange: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    green: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    sunset: 'linear-gradient(135deg, #FF6B35 0%, #F59E0B 100%)',
    ocean: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
    fire: 'linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)',
    mesh: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FF6B35 100%)',
  },

  // ==================== LAYOUT ====================
  layout: {
    headerHeight: '64px',
    footerHeight: '200px',
    sidebarWidth: '280px',
    mobileNavHeight: '56px',
    maxContentWidth: '1280px',
  },

  // ==================== ANIMATION DURATIONS ====================
  animationDurations: {
    instant: '0ms',
    fast: '150ms',
    base: '300ms',
    medium: '500ms',
    slow: '700ms',
    verySlow: '1000ms',
  },

  // ==================== TOUCH TARGETS ====================
  touchTargets: {
    minimum: '44px',
    comfortable: '48px',
    spacious: '56px',
  },
}

// ==================== THEME HELPERS ====================
export const getColor = (colorPath) => {
  const keys = colorPath.split('.')
  let value = theme.colors
  
  for (const key of keys) {
    value = value[key]
    if (value === undefined) return null
  }
  
  return value
}

export const getFontSize = (size) => {
  return theme.typography.fontSize[size] || theme.typography.fontSize.base
}

export const getSpacing = (size) => {
  return theme.spacing[size] || theme.spacing.md
}

export const getShadow = (size) => {
  return theme.shadows[size] || theme.shadows.md
}

export const getBreakpoint = (breakpoint) => {
  return theme.breakpoints[breakpoint]
}

export const getZIndex = (layer) => {
  return theme.zIndex[layer] || theme.zIndex.base
}

// ==================== RESPONSIVE HELPERS ====================
export const mediaQuery = {
  xs: `@media (min-width: ${theme.breakpoints.xs})`,
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
  '2xl': `@media (min-width: ${theme.breakpoints['2xl']})`,
}

// ==================== DARK MODE (Future) ====================
export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    // Dark mode color overrides will go here
  },
}

// Export as default
export default theme