/**
 * Tests for AppearanceSettings component
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppearanceSettings } from '@/components/settings/sections/AppearanceSettings'
import { useTheme } from '@/hooks/useTheme'
import { useSettingsStore } from '@/stores/settingsStore'
import { themes } from '@/utils/themes'

// Mock the hooks
vi.mock('@/hooks/useTheme')
vi.mock('@/stores/settingsStore')

const mockUseTheme = vi.mocked(useTheme)
const mockUseSettingsStore = vi.mocked(useSettingsStore)

// Mock useThemeClasses hook
vi.mock('@/hooks/useTheme', async () => {
  const actual = await vi.importActual('@/hooks/useTheme')
  return {
    ...actual,
    useTheme: vi.fn(),
    useThemeClasses: vi.fn(() => ({
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      surface: 'bg-white',
      border: 'border-gray-200',
      bg: 'bg-white'
    }))
  }
})

describe('AppearanceSettings', () => {
  const mockSetTheme = vi.fn()
  const mockToggleTheme = vi.fn()
  const mockUpdateAppearance = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUseTheme.mockReturnValue({
      currentTheme: themes.light,
      themeName: 'light',
      setTheme: mockSetTheme,
      toggleTheme: mockToggleTheme,
      isTransitioning: false
    })

    mockUseSettingsStore.mockReturnValue({
      appearance: { theme: 'light' },
      updateAppearance: mockUpdateAppearance,
      // Add other required store properties as needed
      isLoaded: true,
      editor: { lineNumbers: true, wordWrap: false, minimap: true, tabSize: 2, insertSpaces: true, fontSize: 14 },
      pdf: { fitMode: 'width', autoRefresh: true, zoom: 1 },
      files: { autoSave: true, autoSaveInterval: 30, sessionRestore: true, recentFilesLimit: 10 },
      recentFiles: [],
      ui: { animations: true, tooltips: true, compactMode: false, showWelcome: true },
      keyboard: { shortcuts: {}, customShortcuts: {} },
      version: '1.0.0',
      updateEditor: vi.fn(),
      updatePdf: vi.fn(),
      updateFiles: vi.fn(),
      updateUi: vi.fn(),
      updateKeyboard: vi.fn(),
      addRecentFile: vi.fn(),
      removeRecentFile: vi.fn(),
      clearRecentFiles: vi.fn(),
      pinRecentFile: vi.fn(),
      resetToDefaults: vi.fn(),
      resetSection: vi.fn(),
      loadSettings: vi.fn(),
      saveSettings: vi.fn(),
      toggleTheme: mockToggleTheme
    })
  })

  it('renders appearance settings header', () => {
    render(<AppearanceSettings />)
    
    expect(screen.getByText('Appearance')).toBeInTheDocument()
    expect(screen.getByText('Customize the visual appearance of your editor and interface')).toBeInTheDocument()
  })

  it('displays current theme information', () => {
    render(<AppearanceSettings />)
    
    expect(screen.getByText('Current Theme')).toBeInTheDocument()
    expect(screen.getByText('Light • Light mode')).toBeInTheDocument()
  })

  it('shows theme toggle button with correct text', () => {
    render(<AppearanceSettings />)
    
    const toggleButton = screen.getByText('Switch to Dark')
    expect(toggleButton).toBeInTheDocument()
  })

  it('calls toggleTheme when toggle button is clicked', () => {
    render(<AppearanceSettings />)
    
    const toggleButton = screen.getByText('Switch to Dark')
    fireEvent.click(toggleButton)
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1)
  })

  it('displays light themes section', () => {
    render(<AppearanceSettings />)
    
    expect(screen.getByText('Light Themes')).toBeInTheDocument()
    
    // Check for light theme cards
    const lightThemes = Object.values(themes).filter(theme => theme.mode === 'light')
    lightThemes.forEach(theme => {
      expect(screen.getByText(theme.displayName)).toBeInTheDocument()
    })
  })

  it('displays dark themes section', () => {
    render(<AppearanceSettings />)
    
    expect(screen.getByText('Dark Themes')).toBeInTheDocument()
    
    // Check for dark theme cards
    const darkThemes = Object.values(themes).filter(theme => theme.mode === 'dark')
    darkThemes.forEach(theme => {
      expect(screen.getByText(theme.displayName)).toBeInTheDocument()
    })
  })

  it('highlights the currently selected theme', () => {
    render(<AppearanceSettings />)
    
    // The light theme should be selected by default
    const lightThemeCard = screen.getByText('Light').closest('button')
    expect(lightThemeCard).toHaveClass('border-[var(--color-primary)]')
  })

  it('calls setTheme when a theme card is clicked', () => {
    render(<AppearanceSettings />)
    
    const darkThemeCard = screen.getByText('Dark').closest('button')
    fireEvent.click(darkThemeCard!)
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('displays theme preview with syntax highlighting', () => {
    render(<AppearanceSettings />)
    
    // Check that code preview elements are present
    expect(screen.getAllByText('\\documentclass')).toHaveLength(Object.keys(themes).length)
    expect(screen.getAllByText('\\begin')).toHaveLength(Object.keys(themes).length)
    expect(screen.getAllByText('\\end')).toHaveLength(Object.keys(themes).length)
  })

  it('shows theme information section', () => {
    render(<AppearanceSettings />)
    
    expect(screen.getByText('About Themes')).toBeInTheDocument()
    expect(screen.getByText(/Themes affect the entire interface/)).toBeInTheDocument()
  })

  it('displays correct toggle text for dark theme', () => {
    mockUseTheme.mockReturnValue({
      currentTheme: themes.dark,
      themeName: 'dark',
      setTheme: mockSetTheme,
      toggleTheme: mockToggleTheme,
      isTransitioning: false
    })

    render(<AppearanceSettings />)
    
    expect(screen.getByText('Switch to Light')).toBeInTheDocument()
    expect(screen.getByText('Dark • Dark mode')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<AppearanceSettings className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders all available themes', () => {
    render(<AppearanceSettings />)
    
    // Check that all themes from the themes object are rendered
    Object.values(themes).forEach(theme => {
      expect(screen.getByText(theme.displayName)).toBeInTheDocument()
    })
  })
})