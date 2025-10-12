import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EditorSettings } from '@/components/settings/sections/EditorSettings'
import { useSettingsStore } from '@/stores/settingsStore'

// Mock the settings store
vi.mock('@/stores/settingsStore')
const mockUseSettingsStore = vi.mocked(useSettingsStore)

// Mock the theme hook
vi.mock('@/hooks/useTheme', () => ({
  useThemeClasses: () => ({
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    textSecondary: 'text-gray-600'
  })
}))

describe('EditorSettings', () => {
  const mockUpdateEditor = vi.fn()
  
  const defaultEditorSettings = {
    lineNumbers: true,
    wordWrap: false,
    minimap: true,
    tabSize: 2,
    insertSpaces: true,
    fontSize: 14
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUseSettingsStore.mockReturnValue({
      editor: defaultEditorSettings,
      updateEditor: mockUpdateEditor,
      // Add other required store properties as needed
      appearance: { theme: 'dark' },
      pdf: { fitMode: 'width', autoRefresh: true, zoom: 1 },
      files: { autoSave: true, autoSaveInterval: 30, sessionRestore: true, recentFilesLimit: 10 },
      version: '1.0.0',
      isLoaded: true,
      recentFiles: [],
      ui: { animations: true, tooltips: true, compactMode: false, showWelcome: true },
      keyboard: { shortcuts: {}, customShortcuts: {} },
      updateAppearance: vi.fn(),
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
      toggleTheme: vi.fn()
    } as any)
  })

  it('renders editor settings sections', () => {
    render(<EditorSettings />)
    
    expect(screen.getByText('Editor Settings')).toBeInTheDocument()
    expect(screen.getByText('Display Options')).toBeInTheDocument()
    expect(screen.getByText('Formatting Options')).toBeInTheDocument()
    expect(screen.getByText('Typography')).toBeInTheDocument()
    expect(screen.getByText('Live Preview')).toBeInTheDocument()
  })

  it('renders all display option toggles', () => {
    render(<EditorSettings />)
    
    expect(screen.getByRole('switch', { name: /show line numbers/i })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: /word wrap/i })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: /show minimap/i })).toBeInTheDocument()
  })

  it('renders formatting options', () => {
    render(<EditorSettings />)
    
    expect(screen.getByRole('button', { name: /tab size/i })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: /insert spaces/i })).toBeInTheDocument()
  })

  it('renders typography controls', () => {
    render(<EditorSettings />)
    
    expect(screen.getByText('Font Size')).toBeInTheDocument()
  })

  it('displays current settings values correctly', () => {
    render(<EditorSettings />)
    
    // Check that toggles reflect current state
    const lineNumbersToggle = screen.getByRole('switch', { name: /show line numbers/i })
    expect(lineNumbersToggle).toHaveAttribute('aria-checked', 'true')
    
    const wordWrapToggle = screen.getByRole('switch', { name: /word wrap/i })
    expect(wordWrapToggle).toHaveAttribute('aria-checked', 'false')
    
    const minimapToggle = screen.getByRole('switch', { name: /show minimap/i })
    expect(minimapToggle).toHaveAttribute('aria-checked', 'true')
  })

  it('calls updateEditor when line numbers toggle is changed', () => {
    render(<EditorSettings />)
    
    const lineNumbersToggle = screen.getByRole('switch', { name: /show line numbers/i })
    fireEvent.click(lineNumbersToggle)
    
    expect(mockUpdateEditor).toHaveBeenCalledWith({ lineNumbers: false })
  })

  it('calls updateEditor when word wrap toggle is changed', () => {
    render(<EditorSettings />)
    
    const wordWrapToggle = screen.getByRole('switch', { name: /word wrap/i })
    fireEvent.click(wordWrapToggle)
    
    expect(mockUpdateEditor).toHaveBeenCalledWith({ wordWrap: true })
  })

  it('calls updateEditor when minimap toggle is changed', () => {
    render(<EditorSettings />)
    
    const minimapToggle = screen.getByRole('switch', { name: /show minimap/i })
    fireEvent.click(minimapToggle)
    
    expect(mockUpdateEditor).toHaveBeenCalledWith({ minimap: false })
  })

  it('calls updateEditor when insert spaces toggle is changed', () => {
    render(<EditorSettings />)
    
    const insertSpacesToggle = screen.getByRole('switch', { name: /insert spaces/i })
    fireEvent.click(insertSpacesToggle)
    
    expect(mockUpdateEditor).toHaveBeenCalledWith({ insertSpaces: false })
  })

  it('displays live preview with current settings', () => {
    render(<EditorSettings />)
    
    expect(screen.getByText('Line Numbers: On')).toBeInTheDocument()
    expect(screen.getByText('Word Wrap: Off')).toBeInTheDocument()
    expect(screen.getByText('Minimap: On')).toBeInTheDocument()
    expect(screen.getByText('Tab Size: 2 spaces')).toBeInTheDocument()
    expect(screen.getByText('Font: 14px')).toBeInTheDocument()
  })

  it('updates live preview when settings change', () => {
    const { rerender } = render(<EditorSettings />)
    
    // Update the mock to return different settings
    mockUseSettingsStore.mockReturnValue({
      editor: { ...defaultEditorSettings, lineNumbers: false, wordWrap: true },
      updateEditor: mockUpdateEditor,
      appearance: { theme: 'dark' },
      pdf: { fitMode: 'width', autoRefresh: true, zoom: 1 },
      files: { autoSave: true, autoSaveInterval: 30, sessionRestore: true, recentFilesLimit: 10 },
      version: '1.0.0',
      isLoaded: true,
      recentFiles: [],
      ui: { animations: true, tooltips: true, compactMode: false, showWelcome: true },
      keyboard: { shortcuts: {}, customShortcuts: {} },
      updateAppearance: vi.fn(),
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
      toggleTheme: vi.fn()
    } as any)
    
    rerender(<EditorSettings />)
    
    expect(screen.getByText('Line Numbers: Off')).toBeInTheDocument()
    expect(screen.getByText('Word Wrap: On')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<EditorSettings />)
    
    // Check that toggles have proper ARIA attributes
    const toggles = screen.getAllByRole('switch')
    toggles.forEach(toggle => {
      expect(toggle).toHaveAttribute('aria-checked')
      expect(toggle).toHaveAttribute('aria-disabled', 'false')
    })
    
    // Check that sliders have proper ARIA attributes
    const fontSizeSlider = screen.getByRole('slider', { name: /font size/i })
    expect(fontSizeSlider).toHaveAttribute('aria-valuemin', '8')
    expect(fontSizeSlider).toHaveAttribute('aria-valuemax', '72')
    expect(fontSizeSlider).toHaveAttribute('aria-valuenow', '14')
  })
})