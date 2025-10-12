import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { 
  detectEnvironment, 
  createEnvironmentAdapter,
  environmentAdapter
} from '../../utils/environment'

// Mock global objects
const mockWindow = {
  electron: {
    fileOpen: vi.fn(),
    fileSave: vi.fn(),
    fileSaveAs: vi.fn(),
    latexCompile: vi.fn(),
    pdfRead: vi.fn()
  }
}

const mockProcess = {
  env: { NODE_ENV: 'development' },
  platform: 'win32',
  versions: {
    node: '18.0.0',
    electron: '25.0.0'
  }
}

describe('Environment Detection', () => {
  let originalWindow: any
  let originalProcess: any

  beforeEach(() => {
    // Store original globals
    originalWindow = global.window
    originalProcess = global.process
    
    // Clear localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  afterEach(() => {
    // Restore original globals
    global.window = originalWindow
    global.process = originalProcess
    
    // Clear mocks
    vi.clearAllMocks()
  })

  describe('detectEnvironment', () => {
    it('should detect development environment correctly', () => {
      // Setup development environment
      global.process = { ...mockProcess, env: { NODE_ENV: 'development' } } as any
      global.window = mockWindow as any

      const env = detectEnvironment()

      expect(env.isDevelopment).toBe(true)
      expect(env.isElectron).toBe(true)
      expect(env.isRenderer).toBe(true)
      expect(env.nodeIntegration).toBe(true)
      expect(env.contextIsolation).toBe(true)
      expect(env.platform).toBe('win32')
      expect(env.electronVersion).toBe('25.0.0')
    })

    it('should detect production environment correctly', () => {
      // Setup production environment
      global.process = { ...mockProcess, env: { NODE_ENV: 'production' } } as any
      global.window = mockWindow as any

      const env = detectEnvironment()

      expect(env.isDevelopment).toBe(false)
      expect(env.isElectron).toBe(true)
      expect(env.isRenderer).toBe(true)
      expect(env.nodeIntegration).toBe(true)
      expect(env.contextIsolation).toBe(true)
      expect(env.platform).toBe('win32')
      expect(env.electronVersion).toBe('25.0.0')
    })

    it('should detect browser environment correctly', () => {
      // Setup browser environment (no Electron)
      global.process = { ...mockProcess } as any
      global.window = {} as any

      const env = detectEnvironment()

      expect(env.isDevelopment).toBe(true)
      expect(env.isElectron).toBe(false)
      expect(env.isRenderer).toBe(true)
      expect(env.nodeIntegration).toBe(true)
      expect(env.contextIsolation).toBe(false)
      expect(env.platform).toBe('win32')
      expect(env.electronVersion).toBe('25.0.0')
    })

    it('should handle missing process object', () => {
      // Setup environment without process
      global.process = undefined as any
      global.window = {} as any

      const env = detectEnvironment()

      expect(env.isDevelopment).toBe(false) // NODE_ENV undefined
      expect(env.isElectron).toBe(false)
      expect(env.isRenderer).toBe(true) // window exists
      expect(env.nodeIntegration).toBe(false)
      expect(env.contextIsolation).toBe(false)
      expect(env.platform).toBe('unknown')
      expect(env.electronVersion).toBeUndefined()
    })

    it('should handle missing window object', () => {
      // Setup server-side environment
      global.process = mockProcess as any
      global.window = undefined as any

      const env = detectEnvironment()

      expect(env.isDevelopment).toBe(true)
      expect(env.isElectron).toBe(false)
      expect(env.isRenderer).toBe(false)
      expect(env.nodeIntegration).toBe(true)
      expect(env.contextIsolation).toBe(false)
      expect(env.platform).toBe('win32')
      expect(env.electronVersion).toBe('25.0.0')
    })

    it('should handle different platforms', () => {
      const platforms = ['darwin', 'linux', 'win32']
      
      platforms.forEach(platform => {
        global.process = { ...mockProcess, platform } as any
        global.window = mockWindow as any

        const env = detectEnvironment()
        expect(env.platform).toBe(platform)
      })
    })
  })

  describe('Storage Adapters', () => {
    beforeEach(() => {
      // Mock localStorage
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      }
      global.localStorage = localStorageMock as any
    })

    describe('LocalStorageAdapter (Development)', () => {
      it('should get items from localStorage with prefix', async () => {
        global.process = { ...mockProcess, env: { NODE_ENV: 'development' } } as any
        global.window = {} as any // No Electron
        
        const adapter = createEnvironmentAdapter()
        const mockData = { test: 'value' }
        
        vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(mockData))
        
        const result = await adapter.storage.get('test-key')
        
        expect(localStorage.getItem).toHaveBeenCalledWith('latex-editor-test-key')
        expect(result).toEqual(mockData)
      })

      it('should set items in localStorage with prefix', async () => {
        global.process = { ...mockProcess, env: { NODE_ENV: 'development' } } as any
        global.window = {} as any // No Electron
        
        const adapter = createEnvironmentAdapter()
        const testData = { test: 'value' }
        
        await adapter.storage.set('test-key', testData)
        
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'latex-editor-test-key', 
          JSON.stringify(testData)
        )
      })

      it('should check if items exist in localStorage', async () => {
        global.process = { ...mockProcess, env: { NODE_ENV: 'development' } } as any
        global.window = {} as any // No Electron
        
        const adapter = createEnvironmentAdapter()
        
        vi.mocked(localStorage.getItem).mockReturnValue('{"test": "value"}')
        
        const exists = await adapter.storage.has('test-key')
        
        expect(localStorage.getItem).toHaveBeenCalledWith('latex-editor-test-key')
        expect(exists).toBe(true)
      })

      it('should remove items from localStorage', async () => {
        global.process = { ...mockProcess, env: { NODE_ENV: 'development' } } as any
        global.window = {} as any // No Electron
        
        const adapter = createEnvironmentAdapter()
        
        await adapter.storage.remove('test-key')
        
        expect(localStorage.removeItem).toHaveBeenCalledWith('latex-editor-test-key')
      })

      it('should handle localStorage errors gracefully', async () => {
        global.process = { ...mockProcess, env: { NODE_ENV: 'development' } } as any
        global.window = {} as any // No Electron
        
        const adapter = createEnvironmentAdapter()
        
        vi.mocked(localStorage.getItem).mockImplementation(() => {
          throw new Error('Storage error')
        })
        
        const result = await adapter.storage.get('test-key')
        expect(result).toBeNull()
      })
    })

    describe('ElectronStorageAdapter (Production)', () => {
      it('should use electron storage in production', async () => {
        global.process = { ...mockProcess, env: { NODE_ENV: 'production' } } as any
        global.window = mockWindow as any
        
        const adapter = createEnvironmentAdapter()
        const mockData = { test: 'value' }
        
        vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(mockData))
        
        const result = await adapter.storage.get('test-key')
        
        expect(localStorage.getItem).toHaveBeenCalledWith('electron-test-key')
        expect(result).toEqual(mockData)
      })

      it('should set items in electron storage', async () => {
        global.process = { ...mockProcess, env: { NODE_ENV: 'production' } } as any
        global.window = mockWindow as any
        
        const adapter = createEnvironmentAdapter()
        const testData = { test: 'value' }
        
        await adapter.storage.set('test-key', testData)
        
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'electron-test-key', 
          JSON.stringify(testData)
        )
      })
    })
  })

  describe('createEnvironmentAdapter', () => {
    it('should create adapter with correct environment info', () => {
      global.process = mockProcess as any
      global.window = mockWindow as any
      
      const adapter = createEnvironmentAdapter()
      
      expect(adapter.info).toBeDefined()
      expect(adapter.storage).toBeDefined()
      expect(adapter.info.isDevelopment).toBe(true)
      expect(adapter.info.isElectron).toBe(true)
    })

    it('should select appropriate storage adapter based on environment', () => {
      // Test development environment
      global.process = { ...mockProcess, env: { NODE_ENV: 'development' } } as any
      global.window = mockWindow as any
      
      const devAdapter = createEnvironmentAdapter()
      expect(devAdapter.storage).toBeDefined()
      
      // Test production environment
      global.process = { ...mockProcess, env: { NODE_ENV: 'production' } } as any
      global.window = mockWindow as any
      
      const prodAdapter = createEnvironmentAdapter()
      expect(prodAdapter.storage).toBeDefined()
    })
  })

  describe('Global environmentAdapter', () => {
    it('should provide a global instance', () => {
      expect(environmentAdapter).toBeDefined()
      expect(environmentAdapter.info).toBeDefined()
      expect(environmentAdapter.storage).toBeDefined()
    })
  })
})