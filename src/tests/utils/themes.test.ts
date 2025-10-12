import { describe, it, expect } from 'vitest'
import { 
  getTheme, 
  getThemeNames, 
  getThemesByMode, 
  isValidTheme, 
  generateCSSCustomProperties,
  lightTheme,
  darkTheme,
  themes
} from '@/utils/themes'

describe('Theme System', () => {
  describe('getTheme', () => {
    it('should return the correct theme for valid theme names', () => {
      expect(getTheme('light')).toEqual(lightTheme)
      expect(getTheme('dark')).toEqual(darkTheme)
    })

    it('should return light theme as fallback for invalid theme names', () => {
      expect(getTheme('invalid-theme')).toEqual(lightTheme)
      expect(getTheme('')).toEqual(lightTheme)
    })
  })

  describe('getThemeNames', () => {
    it('should return all available theme names', () => {
      const names = getThemeNames()
      expect(names).toContain('light')
      expect(names).toContain('dark')
      expect(names).toContain('monokai')
      expect(names).toContain('solarized-dark')
      expect(names).toContain('solarized-light')
      expect(names).toContain('github-light')
      expect(names).toContain('github-dark')
    })
  })

  describe('getThemesByMode', () => {
    it('should return only light themes when mode is light', () => {
      const lightThemes = getThemesByMode('light')
      lightThemes.forEach(theme => {
        expect(theme.mode).toBe('light')
      })
    })

    it('should return only dark themes when mode is dark', () => {
      const darkThemes = getThemesByMode('dark')
      darkThemes.forEach(theme => {
        expect(theme.mode).toBe('dark')
      })
    })
  })

  describe('isValidTheme', () => {
    it('should return true for valid theme names', () => {
      expect(isValidTheme('light')).toBe(true)
      expect(isValidTheme('dark')).toBe(true)
      expect(isValidTheme('monokai')).toBe(true)
    })

    it('should return false for invalid theme names', () => {
      expect(isValidTheme('invalid')).toBe(false)
      expect(isValidTheme('')).toBe(false)
    })
  })

  describe('generateCSSCustomProperties', () => {
    it('should generate CSS custom properties for theme colors', () => {
      const properties = generateCSSCustomProperties(lightTheme)
      
      expect(properties['--color-background']).toBe(lightTheme.colors.background)
      expect(properties['--color-primary']).toBe(lightTheme.colors.primary)
      expect(properties['--color-text']).toBe(lightTheme.colors.text)
      expect(properties['--syntax-command']).toBe(lightTheme.syntax.command)
    })

    it('should convert camelCase to kebab-case', () => {
      const properties = generateCSSCustomProperties(lightTheme)
      
      expect(properties['--color-background-secondary']).toBeDefined()
      expect(properties['--color-text-secondary']).toBeDefined()
      expect(properties['--color-primary-hover']).toBeDefined()
    })
  })

  describe('Theme Configuration', () => {
    it('should have all required color properties', () => {
      Object.values(themes).forEach(theme => {
        expect(theme.colors.background).toBeDefined()
        expect(theme.colors.text).toBeDefined()
        expect(theme.colors.primary).toBeDefined()
        expect(theme.colors.border).toBeDefined()
      })
    })

    it('should have all required syntax properties', () => {
      Object.values(themes).forEach(theme => {
        expect(theme.syntax.command).toBeDefined()
        expect(theme.syntax.environment).toBeDefined()
        expect(theme.syntax.math).toBeDefined()
        expect(theme.syntax.comment).toBeDefined()
      })
    })

    it('should have valid mode values', () => {
      Object.values(themes).forEach(theme => {
        expect(['light', 'dark']).toContain(theme.mode)
      })
    })
  })
})