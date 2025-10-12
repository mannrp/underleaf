import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SettingsPanel } from '@/components/SettingsPanel'

// Mock the settings store
vi.mock('@/stores/settingsStore', () => ({
  useSettingsStore: () => ({
    isLoaded: true,
  }),
}))

// Mock child components with different content heights to test scrolling
vi.mock('@/components/SettingsTabs', () => ({
  SettingsTabs: ({ onTabChange }: any) => (
    <div data-testid="settings-tabs" className="w-72 flex-shrink-0 bg-gray-800 p-4">
      <button onClick={() => onTabChange('appearance')}>Appearance</button>
      <button onClick={() => onTabChange('editor')}>Editor</button>
    </div>
  ),
}))

vi.mock('@/components/SettingsContent', () => ({
  SettingsContent: ({ activeTab }: any) => (
    <div 
      data-testid="settings-content" 
      className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
    >
      <div className="p-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <h3>Content for {activeTab}</h3>
          {/* Simulate long content that would cause scrolling */}
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} className="mb-4 p-4 bg-gray-700 rounded">
              Setting item {i + 1} - This is a long setting description that takes up space
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}))

describe('SettingsPanel Layout Visual Tests', () => {
  it('should maintain footer visibility with long content', () => {
    const onClose = vi.fn()
    render(<SettingsPanel isOpen={true} onClose={onClose} />)

    // Verify modal structure
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveClass('flex', 'flex-col', 'min-h-[600px]')

    // Verify header is fixed at top
    const headers = document.querySelectorAll('.flex-shrink-0.flex.items-center.justify-between')
    const header = headers[0]
    expect(header).toBeInTheDocument()

    // Verify content area allows scrolling
    const contentArea = document.querySelector('.flex.flex-1.min-h-0.overflow-hidden')
    expect(contentArea).toBeInTheDocument()

    // Verify footer is fixed at bottom with minimum height
    const footer = headers[1]
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveClass('min-h-[80px]', 'flex-shrink-0')

    // Verify Done button is accessible
    const doneButton = screen.getByRole('button', { name: /done/i })
    expect(doneButton).toBeInTheDocument()
    expect(doneButton).toHaveClass('px-6', 'py-3') // Has proper padding for click target
  })

  it('should handle different viewport constraints', () => {
    const onClose = vi.fn()
    render(<SettingsPanel isOpen={true} onClose={onClose} />)

    const modal = screen.getByRole('dialog')
    
    // Check responsive height constraints
    expect(modal).toHaveClass('h-[85vh]', 'max-h-[90vh]', 'min-h-[600px]')
    
    // Check maximum width constraint
    expect(modal).toHaveClass('max-w-5xl')
    
    // Verify the layout uses flexbox for proper space distribution
    expect(modal).toHaveClass('flex', 'flex-col')
  })

  it('should provide proper focus management', () => {
    const onClose = vi.fn()
    render(<SettingsPanel isOpen={true} onClose={onClose} />)

    // Check modal has proper ARIA attributes
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('aria-modal', 'true')
    expect(modal).toHaveAttribute('aria-labelledby', 'settings-title')
    expect(modal).toHaveAttribute('aria-describedby', 'settings-description')

    // Check Done button has focus styles
    const doneButton = screen.getByRole('button', { name: /done/i })
    expect(doneButton).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500')
  })
})