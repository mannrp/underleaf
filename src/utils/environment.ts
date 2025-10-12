/**
 * Environment detection utility for identifying runtime context
 * and providing environment-aware functionality
 */

export interface EnvironmentInfo {
  isDevelopment: boolean
  isElectron: boolean
  isRenderer: boolean
  nodeIntegration: boolean
  contextIsolation: boolean
  platform: string
  electronVersion?: string
}

export interface StorageAdapter {
  get: (key: string) => Promise<any>
  set: (key: string, value: any) => Promise<void>
  has: (key: string) => Promise<boolean>
  remove: (key: string) => Promise<void>
}

export interface EnvironmentAdapter {
  info: EnvironmentInfo
  storage: StorageAdapter
}

/**
 * Detects the current runtime environment
 */
export function detectEnvironment(): EnvironmentInfo {
  const hasProcess = typeof process !== 'undefined'
  const hasWindow = typeof window !== 'undefined'
  
  const isDevelopment = hasProcess && process.env?.NODE_ENV === 'development'
  // Better Electron detection - check for multiple indicators
  const isElectron = hasWindow && (
    (window as any).electron !== undefined ||
    (window as any).electronAPI !== undefined ||
    navigator.userAgent.toLowerCase().includes('electron')
  )
  const isRenderer = hasWindow
  
  // Check for node integration
  const nodeIntegration = hasProcess && process.versions?.node !== undefined
  
  // Check for context isolation (Electron security feature)
  const contextIsolation = isElectron && hasWindow && (
    (window as any).electron !== undefined || 
    (window as any).electronAPI !== undefined
  )
  
  const platform = hasProcess ? process.platform : 'unknown'
  
  // Get Electron version if available
  const electronVersion = hasProcess && process.versions?.electron
    ? process.versions.electron
    : undefined

  return {
    isDevelopment,
    isElectron,
    isRenderer,
    nodeIntegration,
    contextIsolation,
    platform,
    electronVersion
  }
}

/**
 * Local storage adapter for browser/development environment
 */
class LocalStorageAdapter implements StorageAdapter {
  private prefix = 'latex-editor-'

  async get(key: string): Promise<any> {
    try {
      const item = localStorage.getItem(this.prefix + key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.warn(`Failed to get item from localStorage: ${key}`, error)
      return null
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value))
    } catch (error) {
      console.error(`Failed to set item in localStorage: ${key}`, error)
      throw error
    }
  }

  async has(key: string): Promise<boolean> {
    return localStorage.getItem(this.prefix + key) !== null
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(this.prefix + key)
  }
}

/**
 * Electron storage adapter for production environment
 */
class ElectronStorageAdapter implements StorageAdapter {
  private electronAPI: any = null

  constructor() {
    // Check for Electron API
    if (typeof window !== 'undefined') {
      this.electronAPI = (window as any).electronAPI || (window as any).electron
    }
  }

  async get(key: string): Promise<any> {
    try {
      // Try to use Electron API first
      if (this.electronAPI && this.electronAPI.getSettings) {
        const result = await this.electronAPI.getSettings()
        return result
      }
      
      // Fallback to localStorage with electron prefix
      const item = localStorage.getItem('electron-' + key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.warn(`Failed to get item from Electron storage: ${key}`, error)
      return null
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      // Try to use Electron API first
      if (this.electronAPI && this.electronAPI.saveSettings) {
        await this.electronAPI.saveSettings(value)
        return
      }
      
      // Fallback to localStorage with electron prefix
      localStorage.setItem('electron-' + key, JSON.stringify(value))
    } catch (error) {
      console.error(`Failed to set item in Electron storage: ${key}`, error)
      // Don't throw error for storage failures, just log them
      console.warn('Falling back to localStorage for settings storage')
      try {
        localStorage.setItem('electron-fallback-' + key, JSON.stringify(value))
      } catch (fallbackError) {
        console.error('Even localStorage fallback failed:', fallbackError)
      }
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      if (this.electronAPI && this.electronAPI.getSettings) {
        const result = await this.electronAPI.getSettings()
        return result !== null && result !== undefined
      }
      return localStorage.getItem('electron-' + key) !== null
    } catch (error) {
      return false
    }
  }

  async remove(key: string): Promise<void> {
    try {
      if (this.electronAPI && this.electronAPI.removeSettings) {
        await this.electronAPI.removeSettings()
      }
      localStorage.removeItem('electron-' + key)
      localStorage.removeItem('electron-fallback-' + key)
    } catch (error) {
      console.warn(`Failed to remove item from Electron storage: ${key}`, error)
    }
  }
}

/**
 * Creates the appropriate storage adapter based on environment
 */
function createStorageAdapter(env: EnvironmentInfo): StorageAdapter {
  if (env.isElectron) {
    return new ElectronStorageAdapter()
  }
  return new LocalStorageAdapter()
}

/**
 * Creates an environment adapter with detected environment info and appropriate storage
 */
export function createEnvironmentAdapter(): EnvironmentAdapter {
  const info = detectEnvironment()
  const storage = createStorageAdapter(info)
  
  return {
    info,
    storage
  }
}

/**
 * Global environment adapter instance
 */
export const environmentAdapter = createEnvironmentAdapter()