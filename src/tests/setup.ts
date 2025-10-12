import { vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
}

// Mock window.electronAPI for testing
Object.defineProperty(window, 'electronAPI', {
  value: {
    getSettings: vi.fn().mockResolvedValue(null),
    saveSettings: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
})