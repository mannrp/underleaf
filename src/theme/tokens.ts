export const themes = {
  dark: {
    colors: {
      bg: {
        primary: '#0a0a0a',
        secondary: '#141414',
        tertiary: '#1e1e1e',
      },
      text: {
        primary: '#ffffff',
        secondary: '#a3a3a3',
        tertiary: '#737373',
      },
      accent: {
        primary: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      border: '#262626',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    typography: {
      fontFamily: {
        sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        mono: '"Fira Code", "Cascadia Code", Consolas, Monaco, "Courier New", monospace',
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
    },
    glass: {
      enabled: false,
      blur: '12px',
      opacity: 0.7,
    },
  },
  light: {
    colors: {
      bg: {
        primary: '#ffffff',
        secondary: '#fafafa',
        tertiary: '#f5f5f5',
      },
      text: {
        primary: '#0a0a0a',
        secondary: '#525252',
        tertiary: '#737373',
      },
      accent: {
        primary: '#2563eb',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
      },
      border: '#e5e5e5',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    typography: {
      fontFamily: {
        sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        mono: '"Fira Code", "Cascadia Code", Consolas, Monaco, "Courier New", monospace',
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
    },
    glass: {
      enabled: false,
      blur: '12px',
      opacity: 0.8,
    },
  },
  glassy: {
    colors: {
      bg: {
        primary: 'rgba(10, 10, 10, 0.7)',
        secondary: 'rgba(20, 20, 20, 0.7)',
        tertiary: 'rgba(30, 30, 30, 0.7)',
      },
      text: {
        primary: '#ffffff',
        secondary: '#a3a3a3',
        tertiary: '#737373',
      },
      accent: {
        primary: '#60a5fa',
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
      },
      border: 'rgba(255, 255, 255, 0.1)',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    typography: {
      fontFamily: {
        sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        mono: '"Fira Code", "Cascadia Code", Consolas, Monaco, "Courier New", monospace',
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
    },
    glass: {
      enabled: true,
      blur: '16px',
      opacity: 0.7,
    },
  },
} as const

export type ThemeName = keyof typeof themes
export type Theme = (typeof themes)[ThemeName]
