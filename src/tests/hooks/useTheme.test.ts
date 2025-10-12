import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '@/hooks/useTheme'
import { useSettingsStore } from '@/stores/settingsStore'

// Mock the settings store
vi.mock('@/stores/settingsStore', () => ({
  useSettingsStore: vi.fn()
}))

// Mock DOM methods
Object.defineProperty(document, 'documentElement', {
  value: {
    style: {
      setProperty: vi.fn()
    }
  },
  writable: true
})

Object.defineProperty(document, 'body', {
  value: {
    className: '',
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(() => false)
    }
  },
  writable: true
})

describe('useTheme', () => {
  const mockUpdateAppearance = vi.fn()
  const mockToggleTheme = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock the settings store return value
    ;(useSettingsStore as any).mockReturnValue({
      appearance: { theme: 'light' },
      updateAppearance: mockUpdateAppearance,
      toggleTheme: mockToggleTheme
    })
  })

  it('should return current theme information', () => {
    const { result } = renderHook(() => useTheme())

    expect(result.current.themeName).toBe('light')
    expect(result.current.currentTheme.name).toBe('light')
    expect(result.current.currentTheme.mode).toBe('light')
  })

  it('should set theme when setTheme is called', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.setTheme('dark')
    })

    expect(mockUpdateAppearance).toHaveBeenCalledWith({ theme: 'dark' })
  })

  it('should toggle theme when toggleTheme is called', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })

    expect(mockToggleTheme).toHaveBeenCalled()
  })

  it('should apply theme to document on mount', () => {
    renderHook(() => useTheme())

    expect(document.documentElement.style.setProperty).toHaveBeenCalled()
  })

  it('should add transition class when setting theme', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.setTheme('dark')
    })

    expect(document.body.classList.add).toHaveBeenCalledWith('theme-transitioning')
  })
})