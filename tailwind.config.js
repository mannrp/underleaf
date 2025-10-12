/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS custom properties
        'theme': {
          'bg': 'var(--color-background)',
          'bg-secondary': 'var(--color-background-secondary)',
          'bg-tertiary': 'var(--color-background-tertiary)',
          'surface': 'var(--color-surface)',
          'surface-secondary': 'var(--color-surface-secondary)',
          'surface-hover': 'var(--color-surface-hover)',
          'text': 'var(--color-text)',
          'text-secondary': 'var(--color-text-secondary)',
          'text-muted': 'var(--color-text-muted)',
          'text-inverse': 'var(--color-text-inverse)',
          'border': 'var(--color-border)',
          'border-secondary': 'var(--color-border-secondary)',
          'border-focus': 'var(--color-border-focus)',
          'primary': 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          'secondary': 'var(--color-secondary)',
          'secondary-hover': 'var(--color-secondary-hover)',
          'accent': 'var(--color-accent)',
          'accent-hover': 'var(--color-accent-hover)',
          'success': 'var(--color-success)',
          'warning': 'var(--color-warning)',
          'error': 'var(--color-error)',
          'info': 'var(--color-info)',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'theme-transition': 'themeTransition 0.3s ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        themeTransition: {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        }
      },
      transitionProperty: {
        'theme': 'background-color, color, border-color',
      }
    },
  },
  plugins: [],
}