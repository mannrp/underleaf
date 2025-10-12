import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSettingsStore } from '@/stores/settingsStore'

// Mock localStorage for testing
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Settings Store', () => {
  beforeEach(() => {
    // Reset store to defaults before each test
    useSettingsStore.getState().resetToDefaults()
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with default settings', () => {
      const state = useSettingsStore.getState()
      
      expect(state.editor.lineNumbers).toBe(true)
      expect(state.editor.wordWrap).toBe(false)
      expect(state.appearance.theme).toBe('light')
      expect(state.pdf.fitMode).toBe('width')
      expect(state.files.autoSave).toBe(true)
      expect(state.recentFiles).toEqual([])
    })

    it('should have all required action methods', () => {
      const state = useSettingsStore.getState()
      
      expect(typeof state.updateEditor).toBe('function')
      expect(typeof state.updateAppearance).toBe('function')
      expect(typeof state.updatePdf).toBe('function')
      expect(typeof state.updateFiles).toBe('function')
      expect(typeof state.addRecentFile).toBe('function')
      expect(typeof state.resetToDefaults).toBe('function')
    })
  })

  describe('Editor Settings', () => {
    it('should update editor line numbers', () => {
      const { updateEditor } = useSettingsStore.getState()
      
      updateEditor({ lineNumbers: false })
      
      const state = useSettingsStore.getState()
      expect(state.editor.lineNumbers).toBe(false)
    })

    it('should update multiple editor settings at once', () => {
      const { updateEditor } = useSettingsStore.getState()
      
      updateEditor({ 
        lineNumbers: false, 
        wordWrap: true,
        minimap: false
      })
      
      const state = useSettingsStore.getState()
      expect(state.editor.lineNumbers).toBe(false)
      expect(state.editor.wordWrap).toBe(true)
      expect(state.editor.minimap).toBe(false)
    })
  })

  describe('Appearance Settings', () => {
    it('should update theme', () => {
      const { updateAppearance } = useSettingsStore.getState()
      
      updateAppearance({ theme: 'dark' })
      
      const state = useSettingsStore.getState()
      expect(state.appearance.theme).toBe('dark')
    })

    it('should toggle theme', () => {
      const { toggleTheme } = useSettingsStore.getState()
      
      // Start with light theme
      expect(useSettingsStore.getState().appearance.theme).toBe('light')
      
      // Toggle to dark
      toggleTheme()
      expect(useSettingsStore.getState().appearance.theme).toBe('dark')
      
      // Toggle back to light
      toggleTheme()
      expect(useSettingsStore.getState().appearance.theme).toBe('light')
    })
  })

  describe('Recent Files Management', () => {
    it('should add recent file', () => {
      const { addRecentFile } = useSettingsStore.getState()
      
      const file = {
        path: '/test/file.tex',
        name: 'file.tex',
        pinned: false
      }
      
      addRecentFile(file)
      
      const state = useSettingsStore.getState()
      expect(state.recentFiles).toHaveLength(1)
      expect(state.recentFiles[0].path).toBe('/test/file.tex')
      expect(state.recentFiles[0].lastOpened).toBeGreaterThan(0)
    })

    it('should update existing recent file', () => {
      const { addRecentFile } = useSettingsStore.getState()
      
      const file = {
        path: '/test/file.tex',
        name: 'file.tex',
        pinned: false
      }
      
      // Add file twice
      addRecentFile(file)
      const firstTime = useSettingsStore.getState().recentFiles[0].lastOpened
      
      // Wait a bit and add again
      setTimeout(() => {
        addRecentFile(file)
        const state = useSettingsStore.getState()
        
        expect(state.recentFiles).toHaveLength(1)
        expect(state.recentFiles[0].lastOpened).toBeGreaterThan(firstTime)
      }, 10)
    })

    it('should remove recent file', () => {
      const { addRecentFile, removeRecentFile } = useSettingsStore.getState()
      
      addRecentFile({
        path: '/test/file.tex',
        name: 'file.tex',
        pinned: false
      })
      
      expect(useSettingsStore.getState().recentFiles).toHaveLength(1)
      
      removeRecentFile('/test/file.tex')
      
      expect(useSettingsStore.getState().recentFiles).toHaveLength(0)
    })

    it('should clear all recent files', () => {
      const { addRecentFile, clearRecentFiles } = useSettingsStore.getState()
      
      // Add multiple files
      addRecentFile({ path: '/test/file1.tex', name: 'file1.tex', pinned: false })
      addRecentFile({ path: '/test/file2.tex', name: 'file2.tex', pinned: false })
      
      expect(useSettingsStore.getState().recentFiles).toHaveLength(2)
      
      clearRecentFiles()
      
      expect(useSettingsStore.getState().recentFiles).toHaveLength(0)
    })

    it('should pin and unpin recent files', () => {
      const { addRecentFile, pinRecentFile } = useSettingsStore.getState()
      
      addRecentFile({
        path: '/test/file.tex',
        name: 'file.tex',
        pinned: false
      })
      
      expect(useSettingsStore.getState().recentFiles[0].pinned).toBe(false)
      
      pinRecentFile('/test/file.tex', true)
      
      expect(useSettingsStore.getState().recentFiles[0].pinned).toBe(true)
    })

    it('should respect recent files limit', () => {
      const { addRecentFile, updateFiles } = useSettingsStore.getState()
      
      // Set limit to 3
      updateFiles({ recentFilesLimit: 3 })
      
      // Add 5 files
      for (let i = 1; i <= 5; i++) {
        addRecentFile({
          path: `/test/file${i}.tex`,
          name: `file${i}.tex`,
          pinned: false
        })
      }
      
      const state = useSettingsStore.getState()
      expect(state.recentFiles).toHaveLength(3)
      expect(state.recentFiles[0].name).toBe('file5.tex') // Most recent first
    })
  })

  describe('Settings Reset', () => {
    it('should reset to defaults', () => {
      const { updateEditor, updateAppearance, resetToDefaults } = useSettingsStore.getState()
      
      // Change some settings
      updateEditor({ lineNumbers: false })
      updateAppearance({ theme: 'dark' })
      
      // Verify changes
      expect(useSettingsStore.getState().editor.lineNumbers).toBe(false)
      expect(useSettingsStore.getState().appearance.theme).toBe('dark')
      
      // Reset
      resetToDefaults()
      
      // Verify reset
      const state = useSettingsStore.getState()
      expect(state.editor.lineNumbers).toBe(true)
      expect(state.appearance.theme).toBe('light')
    })

    it('should reset individual sections', () => {
      const { updateEditor, resetSection } = useSettingsStore.getState()
      
      // Change editor settings
      updateEditor({ lineNumbers: false, wordWrap: true })
      
      expect(useSettingsStore.getState().editor.lineNumbers).toBe(false)
      expect(useSettingsStore.getState().editor.wordWrap).toBe(true)
      
      // Reset only editor section
      resetSection('editor')
      
      const state = useSettingsStore.getState()
      expect(state.editor.lineNumbers).toBe(true)
      expect(state.editor.wordWrap).toBe(false)
    })
  })

  describe('Storage Integration', () => {
    it('should have save and load methods', () => {
      const { saveSettings, loadSettings } = useSettingsStore.getState()
      
      expect(typeof saveSettings).toBe('function')
      expect(typeof loadSettings).toBe('function')
    })

    it('should handle storage errors gracefully', () => {
      // Mock localStorage to throw error
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      const { updateEditor } = useSettingsStore.getState()
      
      // Should not throw error
      expect(() => {
        updateEditor({ fontSize: 16 })
      }).not.toThrow()
    })
  })
})