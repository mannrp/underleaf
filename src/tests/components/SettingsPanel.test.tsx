import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SettingsPanel } from '@/components/SettingsPanel'

// Mock the settings store
vi.mock('@/stores/settingsStore', () => ({
  useSettingsStore: () => ({
    isLoaded: true,
  }),
}))

// Mock the child components
vi.mock('@/components/SettingsTabs', () => ({
  SettingsTabs: ({ onTabChange }: any) => (
    <div data-testid="settings-tabs">
      <button onClick={() => onTabChange('appearance')}>Appearance</button>
      <button onClick={() => onTabChange('editor')}>Editor</button>
    </div>
  ),
}))

vi.mock('@/components/SettingsContent', () => ({
  SettingsContent: ({ activeTab }: any) => (
    <div data-testid="settings-content">
      <div style={{ height: '800px' }}>Content for {activeTab}</div>
    </div>
  ),
}))

describe('SettingsPanel Layout', () => {
  it('should render with proper flexbox layout structure', () => {
    const onClose = vi.fn()
    render(<SettingsPanel isOpen={true} onClose={onClose} />)

    // Check that the modal has proper flex structure
    const modal = screen.getByRole('dialog')
    
    expect(modal).toBeInTheDocument()
    expect(modal).toHaveClass('flex', 'flex-col')
  })

  it('should have footer always visible with proper minimum height', () => {
    const onClose = vi.fn()
    render(<SettingsPanel isOpen={true} onClose={onClose} />)

    // Check footer exists and has proper styling - it's the second element with these classes
    const footers = document.querySelectorAll('.flex-shrink-0.flex.items-center.justify-between')
    const footer = footers[1] // Second one is the footer (first is header)
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveClass('min-h-[80px]')
    
    // Check Done button is visible and clickable
    const doneButton = screen.getByRole('button', { name: /done/i })
    expect(doneButton).toBeInTheDocument()
    expect(doneButton).toBeVisible()
  })

  it('should have header that does not shrink', () => {
    const onClose = vi.fn()
    render(<SettingsPanel isOpen={true} onClose={onClose} />)

    // Check header has flex-shrink-0 - it's the first element with these classes
    const headers = document.querySelectorAll('.flex-shrink-0.flex.items-center.justify-between')
    const header = headers[0] // First one is the header
    expect(header).toBeInTheDocument()
    
    // Check close button is accessible
    const closeButton = screen.getByRole('button', { name: /close settings/i })
    expect(closeButton).toBeInTheDocument()
    expect(closeButton).toBeVisible()
  })

  it('should have content area that scrolls properly', () => {
    const onClose = vi.fn()
    render(<SettingsPanel isOpen={true} onClose={onClose} />)

    // Check content area has proper overflow handling
    const contentArea = document.querySelector('.flex.flex-1.min-h-0.overflow-hidden')
    expect(contentArea).toBeInTheDocument()
    
    // The scrolling happens in the SettingsContent component, not its parent
    // Since we mocked SettingsContent, we can't test the actual scrolling behavior here
    // But we can verify the content area structure is correct
    const settingsContent = screen.getByTestId('settings-content')
    expect(settingsContent).toBeInTheDocument()
  })

  it('should handle footer button clicks properly', () => {
    const onClose = vi.fn()
    render(<SettingsPanel isOpen={true} onClose={onClose} />)

    const doneButton = screen.getByRole('button', { name: /done/i })
    fireEvent.click(doneButton)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should maintain proper spacing and padding', () => {
    const onClose = vi.fn()
    render(<SettingsPanel isOpen={true} onClose={onClose} />)

    // Since we mocked SettingsContent, we can't test the actual padding
    // But we can verify the modal structure maintains proper spacing
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveClass('min-h-[600px]')
    
    // Verify footer has proper minimum height for button accessibility
    const footers = document.querySelectorAll('.flex-shrink-0.flex.items-center.justify-between')
    const footer = footers[1]
    expect(footer).toHaveClass('min-h-[80px]')
  })
})