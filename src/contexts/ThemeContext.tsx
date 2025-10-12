/**
 * Theme Context Provider for managing theme state and CSS custom properties
 * Provides theme switching functionality with proper CSS custom property application
 */

import React, { createContext, useContext, useEffect, useCallback } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'
import { getTheme, applyThemeToDocument, type ThemeConfig } from '@/utils/themes'

interface ThemeContextValue {
  currentTheme: ThemeConfig
  themeName: string
  setTheme: (themeName: string) => void
  toggleTheme: () => void
  isTransitioning: boolean
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
}

export function ThemeProvider({ children, defaultTheme = 'dark' }: ThemeProviderProps) {
  const { appearance, updateAppearance, toggleTheme: storeToggleTheme } = useSettingsStore()
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  
  const currentTheme = getTheme(appearance.theme)

  // Apply theme with smooth transitions
  const applyThemeWithTransition = useCallback((theme: ThemeConfig) => {
    setIsTransitioning(true)
    
    // Add transition class to body for smooth color changes
    document.body.classList.add('theme-transitioning')
    
    // Apply the theme CSS custom properties
    applyThemeToDocument(theme)
    
    // Remove transition class after animation completes
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning')
      setIsTransitioning(false)
    }, 300) // Match CSS transition duration
  }, [])

  // Set theme by name
  const setTheme = useCallback((themeName: string) => {
    const theme = getTheme(themeName)
    updateAppearance({ theme: themeName as any })
    applyThemeWithTransition(theme)
  }, [updateAppearance, applyThemeWithTransition])

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    storeToggleTheme()
    const newTheme = getTheme(useSettingsStore.getState().appearance.theme)
    applyThemeWithTransition(newTheme)
  }, [storeToggleTheme, applyThemeWithTransition])

  // Initialize theme on mount and when theme changes
  useEffect(() => {
    const themeName = appearance.theme || defaultTheme
    const theme = getTheme(themeName)
    console.log('Applying theme:', themeName, theme)
    applyThemeToDocument(theme)
  }, [appearance.theme, defaultTheme])

  const contextValue: ThemeContextValue = {
    currentTheme,
    themeName: appearance.theme,
    setTheme,
    toggleTheme,
    isTransitioning
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }
  return context
}