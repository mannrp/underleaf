/**
 * Basic tests for ThemeContext functionality
 */

import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { ThemeProvider, useThemeContext } from '@/contexts/ThemeContext'

// Mock the settings store
vi.mock('@/stores/settingsStore', () => ({
  useSettingsStore: () => ({
    appearance: { theme: 'dark' },
    updateAppearance: vi.fn(),
    toggleTheme: vi.fn()
  })
}))

// Test component that uses the theme context
function TestComponent() {
  const { currentTheme, themeName } = useThemeContext()
  
  return (
    <div>
      <div data-testid="theme-name">{themeName}</div>
      <div data-testid="theme-mode">{currentTheme.mode}</div>
    </div>
  )
}

describe('ThemeContext', () => {
  it('provides theme context to children', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    expect(screen.getByTestId('theme-name')).toHaveTextContent('dark')
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark')
  })
})