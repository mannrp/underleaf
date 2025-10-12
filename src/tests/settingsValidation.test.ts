import { describe, it, expect } from 'vitest'
import {
  validateSettings,
  validatePartialSettings,
  migrateSettings,
  mergeSettings,
  resetSettingsSection,
  defaultSettings,
  settingsSchema,
  type Settings
} from '@/utils/settingsValidation'

describe('Settings Validation', () => {
  describe('Schema Validation', () => {
    it('should validate correct settings', () => {
      const validSettings = {
        editor: {
          fontSize: 16,
          lineNumbers: true,
          wordWrap: false,
          minimap: true,
          tabSize: 4,
          insertSpaces: true
        },
        pdf: {
          fitMode: 'width' as const,
          autoRefresh: true,
          zoom: 1.5
        },
        files: {
          autoSave: true,
          autoSaveInterval: 60,
          sessionRestore: true,
          recentFilesLimit: 15
        },
        appearance: {
          theme: 'dark' as const
        },
        version: '1.0.0'
      }

      const result = settingsSchema.parse(validSettings)
      expect(result).toEqual(validSettings)
    })

    it('should apply defaults for missing properties', () => {
      const partialSettings = {
        editor: {
          fontSize: 16
        },
        pdf: {},
        files: {},
        appearance: {}
      }

      const result = settingsSchema.parse(partialSettings)
      
      expect(result.editor.fontSize).toBe(16)
      expect(result.editor.lineNumbers).toBe(true) // default
      expect(result.pdf.fitMode).toBe('width') // default
      expect(result.appearance.theme).toBe('light') // default
    })

    it('should reject invalid values', () => {
      const invalidSettings = {
        editor: {
          fontSize: 100, // exceeds max of 72
          lineNumbers: 'yes', // should be boolean
          tabSize: 0 // below min of 1
        }
      }

      expect(() => settingsSchema.parse(invalidSettings)).toThrow()
    })

    it('should validate theme enum values', () => {
      const validThemes = ['light', 'dark', 'monokai', 'solarized-dark', 'solarized-light', 'github-light', 'github-dark']
      
      validThemes.forEach(theme => {
        const settings = {
          editor: {},
          pdf: {},
          files: {},
          appearance: { theme }
        }
        
        expect(() => settingsSchema.parse(settings)).not.toThrow()
      })

      const invalidTheme = {
        editor: {},
        pdf: {},
        files: {},
        appearance: { theme: 'invalid-theme' }
      }
      
      expect(() => settingsSchema.parse(invalidTheme)).toThrow()
    })
  })

  describe('validateSettings function', () => {
    it('should return valid settings unchanged', () => {
      const validSettings = defaultSettings
      const result = validateSettings(validSettings)
      
      expect(result).toEqual(validSettings)
    })

    it('should return defaults for invalid settings', () => {
      const invalidSettings = {
        editor: {
          fontSize: 'invalid'
        }
      }
      
      const result = validateSettings(invalidSettings)
      
      expect(result).toEqual(defaultSettings)
    })

    it('should return defaults for null/undefined input', () => {
      expect(validateSettings(null)).toEqual(defaultSettings)
      expect(validateSettings(undefined)).toEqual(defaultSettings)
    })

    it('should handle malformed objects gracefully', () => {
      const malformed = {
        editor: 'not an object',
        pdf: null,
        files: [],
        appearance: 123
      }
      
      const result = validateSettings(malformed)
      
      expect(result).toEqual(defaultSettings)
    })
  })

  describe('validatePartialSettings function', () => {
    it('should validate partial settings', () => {
      const partial: Partial<Settings> = {
        editor: {
          fontSize: 18,
          lineNumbers: true,
          wordWrap: false,
          minimap: true,
          tabSize: 2,
          insertSpaces: true
        }
      }
      
      const result = validatePartialSettings(partial)
      
      expect(result.editor?.fontSize).toBe(18)
    })

    it('should filter out invalid properties', () => {
      const partialWithInvalid = {
        editor: {
          fontSize: 'invalid' as any,
          lineNumbers: true,
          wordWrap: false,
          minimap: true,
          tabSize: 2,
          insertSpaces: true
        }
      }
      
      const result = validatePartialSettings(partialWithInvalid)
      
      expect(result).toEqual({})
    })
  })

  describe('mergeSettings function', () => {
    it('should merge settings correctly', () => {
      const base = defaultSettings
      const overrides: Partial<Settings> = {
        editor: {
          fontSize: 18,
          lineNumbers: false,
          wordWrap: false,
          minimap: true,
          tabSize: 2,
          insertSpaces: true
        },
        appearance: {
          theme: 'dark' as const
        }
      }
      
      const result = mergeSettings(base, overrides)
      
      expect(result.editor.fontSize).toBe(18)
      expect(result.editor.lineNumbers).toBe(false)
      expect(result.editor.wordWrap).toBe(false)
      expect(result.appearance.theme).toBe('dark')
      expect(result.pdf).toEqual(base.pdf) // unchanged
    })

    it('should validate merged result', () => {
      const base = defaultSettings
      const invalidOverrides: Partial<Settings> = {
        editor: {
          fontSize: 100, // exceeds max
          lineNumbers: true,
          wordWrap: false,
          minimap: true,
          tabSize: 2,
          insertSpaces: true
        }
      }
      
      const result = mergeSettings(base, invalidOverrides)
      
      // Should fall back to defaults due to validation failure
      expect(result).toEqual(defaultSettings)
    })
  })

  describe('resetSettingsSection function', () => {
    it('should reset editor section', () => {
      const modifiedSettings: Settings = {
        ...defaultSettings,
        editor: {
          ...defaultSettings.editor,
          fontSize: 20,
          lineNumbers: false
        }
      }
      
      const result = resetSettingsSection(modifiedSettings, 'editor')
      
      expect(result.editor).toEqual(defaultSettings.editor)
      expect(result.pdf).toEqual(modifiedSettings.pdf) // unchanged
    })

    it('should reset appearance section', () => {
      const modifiedSettings: Settings = {
        ...defaultSettings,
        appearance: {
          theme: 'dark'
        }
      }
      
      const result = resetSettingsSection(modifiedSettings, 'appearance')
      
      expect(result.appearance).toEqual(defaultSettings.appearance)
      expect(result.editor).toEqual(modifiedSettings.editor) // unchanged
    })
  })

  describe('migrateSettings function', () => {
    it('should migrate from version 0.9.0 to 1.0.0', () => {
      const oldSettings = {
        editorFontSize: 16,
        editor: {
          lineNumbers: true,
          fontSize: 12 // This will be overridden by migration
        },
        pdf: {},
        files: {},
        appearance: {},
        version: '0.9.0'
      }
      
      const result = migrateSettings(oldSettings, '0.9.0', '1.0.0')
      
      expect(result.editor.fontSize).toBe(16) // Should be migrated from editorFontSize
      expect(result.version).toBe('1.0.0')
      expect((result as any).editorFontSize).toBeUndefined()
    })

    it('should handle migration with no changes needed', () => {
      const settings = defaultSettings
      
      const result = migrateSettings(settings, '1.0.0', '1.0.0')
      
      expect(result.version).toBe('1.0.0')
    })

    it('should validate migrated settings', () => {
      const invalidOldSettings = {
        editorFontSize: 'invalid',
        version: '0.9.0'
      }
      
      const result = migrateSettings(invalidOldSettings, '0.9.0', '1.0.0')
      
      // Should fall back to defaults due to validation failure
      expect(result.version).toBe('1.0.0')
      expect(result.editor.fontSize).toBe(defaultSettings.editor.fontSize)
    })
  })

  describe('Default Settings', () => {
    it('should have valid default settings', () => {
      expect(() => settingsSchema.parse(defaultSettings)).not.toThrow()
    })

    it('should have sensible default values', () => {
      expect(defaultSettings.editor.fontSize).toBe(14)
      expect(defaultSettings.editor.lineNumbers).toBe(true)
      expect(defaultSettings.editor.tabSize).toBe(2)
      expect(defaultSettings.pdf.fitMode).toBe('width')
      expect(defaultSettings.files.autoSave).toBe(true)
      expect(defaultSettings.files.autoSaveInterval).toBe(30)
      expect(defaultSettings.appearance.theme).toBe('light')
    })

    it('should have all required sections', () => {
      expect(defaultSettings).toHaveProperty('editor')
      expect(defaultSettings).toHaveProperty('pdf')
      expect(defaultSettings).toHaveProperty('files')
      expect(defaultSettings).toHaveProperty('appearance')
      expect(defaultSettings).toHaveProperty('version')
    })
  })

  describe('Type Safety', () => {
    it('should enforce font size limits', () => {
      const tooSmall = { editor: { fontSize: 5 } }
      const tooLarge = { editor: { fontSize: 80 } }
      
      expect(() => settingsSchema.parse(tooSmall)).toThrow()
      expect(() => settingsSchema.parse(tooLarge)).toThrow()
    })

    it('should enforce tab size limits', () => {
      const tooSmall = { editor: { tabSize: 0 } }
      const tooLarge = { editor: { tabSize: 10 } }
      
      expect(() => settingsSchema.parse(tooSmall)).toThrow()
      expect(() => settingsSchema.parse(tooLarge)).toThrow()
    })

    it('should enforce auto-save interval limits', () => {
      const tooSmall = { files: { autoSaveInterval: 0 } }
      const tooLarge = { files: { autoSaveInterval: 400 } }
      
      expect(() => settingsSchema.parse(tooSmall)).toThrow()
      expect(() => settingsSchema.parse(tooLarge)).toThrow()
    })

    it('should enforce PDF zoom limits', () => {
      const tooSmall = { pdf: { zoom: 0.05 } }
      const tooLarge = { pdf: { zoom: 6 } }
      
      expect(() => settingsSchema.parse(tooSmall)).toThrow()
      expect(() => settingsSchema.parse(tooLarge)).toThrow()
    })
  })
})