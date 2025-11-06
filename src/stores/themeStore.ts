import { create } from 'zustand'
import { themes, type ThemeName, type Theme } from '@/theme/tokens'

// Re-export ThemeName for convenience
export type { ThemeName }

interface ThemeState {
  currentTheme: ThemeName
  theme: Theme
  glassEffectEnabled: boolean
  setTheme: (themeName: ThemeName) => void
  toggleGlassEffect: () => void
  setGlassEffect: (enabled: boolean) => void
}

// Load theme from localStorage or default to 'dark'
const loadThemeFromStorage = (): ThemeName => {
  try {
    const stored = localStorage.getItem('underleaf-theme')
    if (stored && (stored === 'dark' || stored === 'light' || stored === 'glassy')) {
      return stored as ThemeName
    }
  } catch (error) {
    console.error('Failed to load theme from localStorage:', error)
  }
  return 'dark'
}

// Load glass effect preference from localStorage
const loadGlassEffectFromStorage = (): boolean => {
  try {
    const stored = localStorage.getItem('underleaf-glass-effect')
    return stored === 'true'
  } catch (error) {
    console.error('Failed to load glass effect preference from localStorage:', error)
  }
  return false
}

// Save theme to localStorage
const saveThemeToStorage = (themeName: ThemeName) => {
  try {
    localStorage.setItem('underleaf-theme', themeName)
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error)
  }
}

// Save glass effect preference to localStorage
const saveGlassEffectToStorage = (enabled: boolean) => {
  try {
    localStorage.setItem('underleaf-glass-effect', enabled.toString())
  } catch (error) {
    console.error('Failed to save glass effect preference to localStorage:', error)
  }
}

export const useThemeStore = create<ThemeState>((set) => {
  const initialTheme = loadThemeFromStorage()
  const initialGlassEffect = loadGlassEffectFromStorage()

  return {
    currentTheme: initialTheme,
    theme: themes[initialTheme],
    glassEffectEnabled: initialGlassEffect,
    
    setTheme: (themeName: ThemeName) => {
      saveThemeToStorage(themeName)
      set({
        currentTheme: themeName,
        theme: themes[themeName],
      })
    },
    
    toggleGlassEffect: () => {
      set((state) => {
        const newEnabled = !state.glassEffectEnabled
        saveGlassEffectToStorage(newEnabled)
        return { glassEffectEnabled: newEnabled }
      })
    },
    
    setGlassEffect: (enabled: boolean) => {
      saveGlassEffectToStorage(enabled)
      set({ glassEffectEnabled: enabled })
    },
  }
})
