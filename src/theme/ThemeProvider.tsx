import { useEffect } from 'react'
import { useThemeStore } from '@/stores/themeStore'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, glassEffectEnabled } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement

    // Apply background colors
    root.style.setProperty('--color-bg-primary', theme.colors.bg.primary)
    root.style.setProperty('--color-bg-secondary', theme.colors.bg.secondary)
    root.style.setProperty('--color-bg-tertiary', theme.colors.bg.tertiary)

    // Apply text colors
    root.style.setProperty('--color-text-primary', theme.colors.text.primary)
    root.style.setProperty('--color-text-secondary', theme.colors.text.secondary)
    root.style.setProperty('--color-text-tertiary', theme.colors.text.tertiary)

    // Apply accent colors
    root.style.setProperty('--color-accent-primary', theme.colors.accent.primary)
    root.style.setProperty('--color-accent-success', theme.colors.accent.success)
    root.style.setProperty('--color-accent-warning', theme.colors.accent.warning)
    root.style.setProperty('--color-accent-error', theme.colors.accent.error)

    // Apply border color
    root.style.setProperty('--color-border', theme.colors.border)

    // Apply spacing
    root.style.setProperty('--spacing-xs', theme.spacing.xs)
    root.style.setProperty('--spacing-sm', theme.spacing.sm)
    root.style.setProperty('--spacing-md', theme.spacing.md)
    root.style.setProperty('--spacing-lg', theme.spacing.lg)
    root.style.setProperty('--spacing-xl', theme.spacing.xl)

    // Apply typography
    root.style.setProperty('--font-family-sans', theme.typography.fontFamily.sans)
    root.style.setProperty('--font-family-mono', theme.typography.fontFamily.mono)
    root.style.setProperty('--font-size-xs', theme.typography.fontSize.xs)
    root.style.setProperty('--font-size-sm', theme.typography.fontSize.sm)
    root.style.setProperty('--font-size-base', theme.typography.fontSize.base)
    root.style.setProperty('--font-size-lg', theme.typography.fontSize.lg)
    root.style.setProperty('--font-size-xl', theme.typography.fontSize.xl)
    root.style.setProperty('--font-size-2xl', theme.typography.fontSize['2xl'])

    // Apply glass effect settings
    const glassEnabled = glassEffectEnabled && theme.glass.enabled
    root.style.setProperty('--glass-blur', glassEnabled ? theme.glass.blur : '0px')
    root.style.setProperty('--glass-opacity', glassEnabled ? theme.glass.opacity.toString() : '1')
    root.style.setProperty('--glass-enabled', glassEnabled ? '1' : '0')
  }, [theme, glassEffectEnabled])

  return <>{children}</>
}
