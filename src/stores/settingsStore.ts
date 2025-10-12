import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { 
  type Settings, 
  type EditorSettings, 
  type PdfSettings, 
  type FileSettings, 
  type AppearanceSettings,
  defaultSettings,
  validateSettings,
  resetSettingsSection
} from '@/utils/settingsValidation'
import { environmentAdapter } from '@/utils/environment'

// Additional interfaces for recent files
export interface RecentFile {
  path: string
  name: string
  lastOpened: number
  pinned: boolean
}

// Extended settings with UI-specific properties
export interface ExtendedSettings extends Settings {
  recentFiles: RecentFile[]
  ui: {
    animations: boolean
    tooltips: boolean
    compactMode: boolean
    showWelcome: boolean
  }
  keyboard: {
    shortcuts: Record<string, string>
    customShortcuts: Record<string, string>
  }
}

// Extended default settings
export const extendedDefaultSettings: ExtendedSettings = {
  ...defaultSettings,
  recentFiles: [],
  ui: {
    animations: true,
    tooltips: true,
    compactMode: false,
    showWelcome: true
  },
  keyboard: {
    shortcuts: {
      'settings': 'Ctrl+,',
      'fullscreen': 'F11',
      'find': 'Ctrl+F',
      'replace': 'Ctrl+H'
    },
    customShortcuts: {}
  }
}

// Electron storage interface
interface ElectronStorage {
  getSettings: () => Promise<any>
  saveSettings: (settings: ExtendedSettings) => Promise<void>
}

// Storage adapter for Electron
class SettingsStorage {
  private electron: ElectronStorage | null = null

  constructor() {
    // Check if running in Electron
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      this.electron = (window as any).electronAPI
    }
  }

  async load(): Promise<ExtendedSettings> {
    try {
      // Use environment-aware storage first
      const envStored = await environmentAdapter.storage.get('settings')
      if (envStored) {
        console.log('Loaded settings from environment storage:', envStored)
        const validated = validateSettings(envStored)
        return {
          ...extendedDefaultSettings,
          ...validated,
          recentFiles: envStored.recentFiles || [],
          ui: envStored.ui || extendedDefaultSettings.ui,
          keyboard: envStored.keyboard || extendedDefaultSettings.keyboard
        }
      }

      // Fallback to legacy storage methods for migration
      if (this.electron) {
        try {
          const stored = await this.electron.getSettings()
          if (stored) {
            console.log('Loaded settings from Electron API:', stored)
            // Validate and migrate if needed
            const validated = validateSettings(stored)
            const migrated = {
              ...extendedDefaultSettings,
              ...validated,
              recentFiles: stored.recentFiles || [],
              ui: stored.ui || extendedDefaultSettings.ui,
              keyboard: stored.keyboard || extendedDefaultSettings.keyboard
            }
            
            // Migrate to new storage
            await this.save(migrated)
            return migrated
          }
        } catch (electronError) {
          console.warn('Electron storage failed, trying localStorage:', electronError)
        }
      }
      
      // Always try localStorage as final fallback
      try {
        const stored = localStorage.getItem('underleaf-settings')
        if (stored) {
          console.log('Loaded settings from localStorage fallback')
          const parsed = JSON.parse(stored)
          const validated = validateSettings(parsed)
          const migrated = {
            ...extendedDefaultSettings,
            ...validated,
            recentFiles: parsed.recentFiles || [],
            ui: parsed.ui || extendedDefaultSettings.ui,
            keyboard: parsed.keyboard || extendedDefaultSettings.keyboard
          }
          
          // Migrate to new storage
          await this.save(migrated)
          return migrated
        }
      } catch (localStorageError) {
        console.warn('localStorage fallback failed:', localStorageError)
      }
    } catch (error) {
      console.warn('Failed to load settings:', error)
    }
    
    console.log('Using default settings')
    return extendedDefaultSettings
  }

  async save(settings: ExtendedSettings): Promise<void> {
    try {
      console.log('Saving settings:', settings)
      
      // Use environment-aware storage as primary method
      await environmentAdapter.storage.set('settings', settings)
      
      // Also save to legacy storage for compatibility during transition
      if (this.electron) {
        try {
          await this.electron.saveSettings(settings)
          console.log('Saved to Electron storage')
        } catch (error) {
          console.warn('Failed to save to Electron storage:', error)
        }
      }
      
      // Always save to localStorage as backup
      try {
        localStorage.setItem('underleaf-settings', JSON.stringify(settings))
        console.log('Saved to localStorage backup')
      } catch (error) {
        console.warn('Failed to save to localStorage backup:', error)
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      // Don't throw error, just log it to prevent app crashes
      console.warn('Settings save failed, but continuing...')
    }
  }
}

const storage = new SettingsStorage()

interface SettingsState extends ExtendedSettings {
  // Loading state
  isLoaded: boolean
  
  // Actions
  updateAppearance: (appearance: Partial<AppearanceSettings>) => void
  updateEditor: (editor: Partial<EditorSettings>) => void
  updatePdf: (pdf: Partial<PdfSettings>) => void
  updateFiles: (files: Partial<FileSettings>) => void
  updateUi: (ui: Partial<ExtendedSettings['ui']>) => void
  updateKeyboard: (keyboard: Partial<ExtendedSettings['keyboard']>) => void
  
  // Recent files management
  addRecentFile: (file: Omit<RecentFile, 'lastOpened'>) => void
  removeRecentFile: (path: string) => void
  clearRecentFiles: () => void
  pinRecentFile: (path: string, pinned: boolean) => void
  
  // Settings management
  resetToDefaults: () => void
  resetSection: <K extends keyof Settings>(section: K) => void
  loadSettings: () => Promise<void>
  saveSettings: () => Promise<void>
  
  // Utility actions
  toggleTheme: () => void
}

export const useSettingsStore = create<SettingsState>()(
  subscribeWithSelector((set, get) => ({
    ...extendedDefaultSettings,
    isLoaded: false,
    
    updateAppearance: (appearance) => {
      const state = get()
      const updated = { ...state, appearance: { ...state.appearance, ...appearance } }
      set(updated)
      
      // Save asynchronously without blocking UI
      storage.save(updated).catch(error => {
        console.error('Failed to save appearance settings:', error)
      })
    },
    
    updateEditor: (editor) => {
      const state = get()
      const updated = { ...state, editor: { ...state.editor, ...editor } }
      set(updated)
      
      // Save asynchronously without blocking UI
      storage.save(updated).catch(error => {
        console.error('Failed to save editor settings:', error)
      })
    },
    
    updatePdf: (pdf) => {
      const state = get()
      const updated = { ...state, pdf: { ...state.pdf, ...pdf } }
      set(updated)
      
      storage.save(updated).catch(error => {
        console.error('Failed to save PDF settings:', error)
      })
    },
    
    updateFiles: (files) => {
      const state = get()
      const updated = { ...state, files: { ...state.files, ...files } }
      set(updated)
      
      storage.save(updated).catch(error => {
        console.error('Failed to save file settings:', error)
      })
    },
    
    updateUi: (ui) => {
      const state = get()
      const updated = { ...state, ui: { ...state.ui, ...ui } }
      set(updated)
      
      storage.save(updated).catch(error => {
        console.error('Failed to save UI settings:', error)
      })
    },
    
    updateKeyboard: (keyboard) => {
      const state = get()
      const updated = { ...state, keyboard: { ...state.keyboard, ...keyboard } }
      set(updated)
      
      storage.save(updated).catch(error => {
        console.error('Failed to save keyboard settings:', error)
      })
    },
    
    addRecentFile: (file) => {
      const state = get()
      const existingIndex = state.recentFiles.findIndex(f => f.path === file.path)
      const newFile: RecentFile = { ...file, lastOpened: Date.now() }
      
      let updatedFiles = [...state.recentFiles]
      
      if (existingIndex >= 0) {
        updatedFiles[existingIndex] = newFile
      } else {
        updatedFiles.unshift(newFile)
      }
      
      // Keep only recentFilesLimit
      updatedFiles = updatedFiles.slice(0, state.files.recentFilesLimit)
      
      const updated = { ...state, recentFiles: updatedFiles }
      set(updated)
      
      storage.save(updated).catch(error => {
        console.error('Failed to save recent files:', error)
      })
    },
    
    removeRecentFile: (path) => {
      const state = get()
      const updated = {
        ...state,
        recentFiles: state.recentFiles.filter(f => f.path !== path)
      }
      set(updated)
      
      storage.save(updated).catch(error => {
        console.error('Failed to save recent files:', error)
      })
    },
    
    clearRecentFiles: () => {
      const state = get()
      const updated = { ...state, recentFiles: [] }
      set(updated)
      
      storage.save(updated).catch(error => {
        console.error('Failed to save recent files:', error)
      })
    },
    
    pinRecentFile: (path, pinned) => {
      const state = get()
      const updated = {
        ...state,
        recentFiles: state.recentFiles.map(f => 
          f.path === path ? { ...f, pinned } : f
        )
      }
      set(updated)
      
      storage.save(updated).catch(error => {
        console.error('Failed to save recent files:', error)
      })
    },
    
    resetToDefaults: () => {
      const state = get()
      const updated = { ...extendedDefaultSettings, isLoaded: state.isLoaded }
      set(updated)
      
      storage.save(updated).catch(error => {
        console.error('Failed to save reset settings:', error)
      })
    },
    
    resetSection: (section) => {
      const state = get()
      const updated = resetSettingsSection(state, section)
      const extendedUpdated = { ...state, ...updated }
      set(extendedUpdated)
      
      storage.save(extendedUpdated).catch(error => {
        console.error('Failed to save reset section:', error)
      })
    },
    
    loadSettings: async () => {
      try {
        const loaded = await storage.load()
        set({ ...loaded, isLoaded: true })
      } catch (error) {
        console.error('Failed to load settings:', error)
        set({ ...extendedDefaultSettings, isLoaded: true })
      }
    },
    
    saveSettings: async () => {
      try {
        const state = get()
        await storage.save(state)
      } catch (error) {
        console.error('Failed to save settings:', error)
      }
    },
    
    toggleTheme: () => {
      const state = get()
      const newTheme = state.appearance.theme === 'light' ? 'dark' : 'light'
      state.updateAppearance({ theme: newTheme })
    }
  }))
)

// Auto-load settings on store creation
useSettingsStore.getState().loadSettings()

// Export types for use in components
export type { Settings, EditorSettings, PdfSettings, FileSettings, AppearanceSettings }