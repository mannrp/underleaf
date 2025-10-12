/**
 * Theme management hook for Underleaf LaTeX Editor
 * Handles theme application, transitions, and persistence using CSS custom properties
 */

import { useThemeContext } from '@/contexts/ThemeContext'

export interface UseThemeReturn {
  currentTheme: any
  themeName: string
  setTheme: (themeName: string) => void
  toggleTheme: () => void
  isTransitioning: boolean
}

export function useTheme(): UseThemeReturn {
  return useThemeContext()
}

// Hook for getting theme-aware CSS classes using CSS custom properties
export function useThemeClasses() {
  const { currentTheme } = useTheme()
  
  return {
    // Background classes
    bg: 'bg-[var(--color-background)]',
    bgSecondary: 'bg-[var(--color-background-secondary)]',
    bgTertiary: 'bg-[var(--color-background-tertiary)]',
    
    // Surface classes
    surface: 'bg-[var(--color-surface)]',
    surfaceSecondary: 'bg-[var(--color-surface-secondary)]',
    surfaceHover: 'hover:bg-[var(--color-surface-hover)]',
    
    // Text classes
    text: 'text-[var(--color-text)]',
    textSecondary: 'text-[var(--color-text-secondary)]',
    textMuted: 'text-[var(--color-text-muted)]',
    textInverse: 'text-[var(--color-text-inverse)]',
    
    // Border classes
    border: 'border-[var(--color-border)]',
    borderSecondary: 'border-[var(--color-border-secondary)]',
    borderFocus: 'focus:border-[var(--color-border-focus)]',
    
    // Accent classes
    primary: 'bg-[var(--color-primary)] text-[var(--color-text-inverse)]',
    primaryHover: 'hover:bg-[var(--color-primary-hover)]',
    secondary: 'bg-[var(--color-secondary)] text-[var(--color-text-inverse)]',
    secondaryHover: 'hover:bg-[var(--color-secondary-hover)]',
    accent: 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]',
    accentHover: 'hover:bg-[var(--color-accent-hover)]',
    
    // Status classes
    success: 'text-[var(--color-success)]',
    warning: 'text-[var(--color-warning)]',
    error: 'text-[var(--color-error)]',
    info: 'text-[var(--color-info)]',
    
    // Interactive classes - using CSS custom properties
    button: 'bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border-[var(--color-border)] text-[var(--color-text)]',
    input: 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-border-focus)]',
    
    // Specialized component classes
    toggle: {
      track: 'bg-[var(--color-surface)] border-[var(--color-border)]',
      trackActive: 'bg-[var(--color-primary)]',
      trackDisabled: 'bg-[var(--color-surface)] opacity-50',
      thumb: 'bg-[var(--color-text-inverse)]',
      label: 'text-[var(--color-text)]',
      labelDisabled: 'text-[var(--color-text-muted)] opacity-50',
      description: 'text-[var(--color-text-muted)]'
    },
    
    slider: {
      track: 'bg-[var(--color-surface)]',
      progress: 'bg-[var(--color-primary)]',
      thumb: 'bg-[var(--color-text-inverse)] border-[var(--color-primary)]',
      label: 'text-[var(--color-text)]',
      value: 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)]'
    },
    
    select: {
      button: 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)]',
      buttonOpen: 'border-[var(--color-primary)]',
      dropdown: 'bg-[var(--color-surface)] border-[var(--color-border)]',
      option: 'text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]',
      optionSelected: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
      optionFocused: 'bg-[var(--color-primary)]/20'
    },
    
    // Theme mode
    mode: currentTheme?.mode || 'dark'
  }
}

// Hook for getting CSS custom property values directly
export function useThemeVariables() {
  return {
    // Get CSS custom property value
    getCSSVar: (property: string): string => {
      if (typeof window !== 'undefined') {
        return getComputedStyle(document.documentElement).getPropertyValue(property).trim()
      }
      return ''
    },
    
    // Set CSS custom property value
    setCSSVar: (property: string, value: string): void => {
      if (typeof window !== 'undefined') {
        document.documentElement.style.setProperty(property, value)
      }
    },
    
    // Common CSS custom properties
    colors: {
      background: 'var(--color-background)',
      backgroundSecondary: 'var(--color-background-secondary)',
      backgroundTertiary: 'var(--color-background-tertiary)',
      surface: 'var(--color-surface)',
      surfaceSecondary: 'var(--color-surface-secondary)',
      surfaceHover: 'var(--color-surface-hover)',
      text: 'var(--color-text)',
      textSecondary: 'var(--color-text-secondary)',
      textMuted: 'var(--color-text-muted)',
      textInverse: 'var(--color-text-inverse)',
      border: 'var(--color-border)',
      borderSecondary: 'var(--color-border-secondary)',
      borderFocus: 'var(--color-border-focus)',
      primary: 'var(--color-primary)',
      primaryHover: 'var(--color-primary-hover)',
      secondary: 'var(--color-secondary)',
      secondaryHover: 'var(--color-secondary-hover)',
      accent: 'var(--color-accent)',
      accentHover: 'var(--color-accent-hover)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      error: 'var(--color-error)',
      info: 'var(--color-info)'
    }
  }
}