import { create } from 'zustand'

export type LLMProvider = 'gemini' | 'openai' | 'anthropic' | 'ollama'

interface SettingsState {
  // LLM Configuration
  llmProvider: LLMProvider
  llmApiKey: string
  llmModel: string
  llmBaseUrl: string // for Ollama
  
  // Editor Preferences
  editorFontSize: number
  autoCompileDelay: number
  
  // Actions
  setLlmProvider: (provider: LLMProvider) => void
  setLlmApiKey: (key: string) => void
  setLlmModel: (model: string) => void
  setLlmBaseUrl: (url: string) => void
  setEditorFontSize: (size: number) => void
  setAutoCompileDelay: (delay: number) => void
  resetToDefaults: () => void
}

// Simple encryption for API keys (base64 encoding - not secure, but better than plain text)
const encryptKey = (key: string): string => {
  try {
    return btoa(key)
  } catch {
    return key
  }
}

const decryptKey = (encrypted: string): string => {
  try {
    return atob(encrypted)
  } catch {
    return encrypted
  }
}

// Load settings from localStorage
const loadSettings = () => {
  try {
    const stored = localStorage.getItem('underleaf-settings')
    if (stored) {
      const parsed = JSON.parse(stored)
      // Decrypt API key
      if (parsed.llmApiKey) {
        parsed.llmApiKey = decryptKey(parsed.llmApiKey)
      }
      return parsed
    }
  } catch (error) {
    console.error('Failed to load settings from localStorage:', error)
  }
  return null
}

// Save settings to localStorage
const saveSettings = (state: Partial<SettingsState>) => {
  try {
    const toSave = { ...state }
    // Encrypt API key before saving
    if (toSave.llmApiKey) {
      toSave.llmApiKey = encryptKey(toSave.llmApiKey)
    }
    localStorage.setItem('underleaf-settings', JSON.stringify(toSave))
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error)
  }
}

const defaultSettings = {
  llmProvider: 'gemini' as LLMProvider,
  llmApiKey: '',
  llmModel: 'gemini-pro',
  llmBaseUrl: 'http://localhost:11434',
  editorFontSize: 14,
  autoCompileDelay: 2000,
}

export const useSettingsStore = create<SettingsState>((set, get) => {
  const stored = loadSettings()
  const initial = stored ? { ...defaultSettings, ...stored } : defaultSettings

  return {
    ...initial,
    
    setLlmProvider: (provider: LLMProvider) => {
      set({ llmProvider: provider })
      saveSettings(get())
    },
    
    setLlmApiKey: (key: string) => {
      set({ llmApiKey: key })
      saveSettings(get())
    },
    
    setLlmModel: (model: string) => {
      set({ llmModel: model })
      saveSettings(get())
    },
    
    setLlmBaseUrl: (url: string) => {
      set({ llmBaseUrl: url })
      saveSettings(get())
    },
    
    setEditorFontSize: (size: number) => {
      set({ editorFontSize: size })
      saveSettings(get())
    },
    
    setAutoCompileDelay: (delay: number) => {
      set({ autoCompileDelay: delay })
      saveSettings(get())
    },
    
    resetToDefaults: () => {
      set(defaultSettings)
      saveSettings(defaultSettings)
    },
  }
})
