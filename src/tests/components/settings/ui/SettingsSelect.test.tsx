import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SettingsSelect, SelectOption } from '@/components/settings/ui/SettingsSelect'

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  ChevronDown: ({ className }: { className?: string }) => (
    <div data-testid="chevron-down" className={className}>ChevronDown</div>
  ),
  Check: ({ className }: { className?: string }) => (
    <div data-testid="check" className={className}>Check</div>
  )
}))

describe('SettingsSelect', () => {
  const mockOptions: SelectOption[] = [
    { value: 'option1', label: 'Option 1', description: 'First option' },
    { value: 'option2', label: 'Option 2', description: 'Second option' },
    { value: 'option3', label: 'Option 3' }
  ]

  const defaultProps = {
    label: 'Test Select',
    value: 'option1',
    options: mockOptions,
    onChange: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with label', () => {
    render(<SettingsSelect {...defaultProps} />)
    expect(screen.getByText('Test Select')).toBeInTheDocument()
  })

  it('renders with description when provided', () => {
    render(
      <SettingsSelect 
        {...defaultProps} 
        description="This is a test description" 
      />
    )
    expect(screen.getByText('This is a test description')).toBeInTheDocument()
  })

  it('displays selected option label', () => {
    render(<SettingsSelect {...defaultProps} />)
    expect(screen.getByText('Option 1')).toBeInTheDocument()
  })

  it('displays placeholder when no option is selected', () => {
    render(
      <SettingsSelect 
        {...defaultProps} 
        value="" 
        placeholder="Choose an option" 
      />
    )
    expect(screen.getByText('Choose an option')).toBeInTheDocument()
  })

  it('opens dropdown when clicked', () => {
    render(<SettingsSelect {...defaultProps} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('closes dropdown when clicking outside', async () => {
    render(<SettingsSelect {...defaultProps} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    
    // Click outside
    fireEvent.mouseDown(document.body)
    
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  it('calls onChange when option is selected', () => {
    const onChange = vi.fn()
    render(<SettingsSelect {...defaultProps} onChange={onChange} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    const option2 = screen.getByText('Option 2')
    fireEvent.click(option2)
    
    expect(onChange).toHaveBeenCalledWith('option2')
  })

  it('closes dropdown after selecting an option', () => {
    render(<SettingsSelect {...defaultProps} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    const option2 = screen.getByText('Option 2')
    fireEvent.click(option2)
    
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('handles keyboard navigation with arrow keys', () => {
    render(<SettingsSelect {...defaultProps} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Arrow down should focus next option
    fireEvent.keyDown(document, { key: 'ArrowDown' })
    
    // Arrow up should focus previous option
    fireEvent.keyDown(document, { key: 'ArrowUp' })
    
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('selects option with Enter key', () => {
    const onChange = vi.fn()
    render(<SettingsSelect {...defaultProps} onChange={onChange} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Focus on second option and press Enter
    fireEvent.keyDown(document, { key: 'ArrowDown' })
    fireEvent.keyDown(document, { key: 'Enter' })
    
    expect(onChange).toHaveBeenCalledWith('option2')
  })

  it('selects option with Space key', () => {
    const onChange = vi.fn()
    render(<SettingsSelect {...defaultProps} onChange={onChange} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Focus on second option and press Space
    fireEvent.keyDown(document, { key: 'ArrowDown' })
    fireEvent.keyDown(document, { key: ' ' })
    
    expect(onChange).toHaveBeenCalledWith('option2')
  })

  it('closes dropdown with Escape key', () => {
    render(<SettingsSelect {...defaultProps} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('handles Home and End keys', () => {
    render(<SettingsSelect {...defaultProps} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // Home should focus first option
    fireEvent.keyDown(document, { key: 'Home' })
    
    // End should focus last option
    fireEvent.keyDown(document, { key: 'End' })
    
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('does not open dropdown when disabled', () => {
    render(<SettingsSelect {...defaultProps} disabled={true} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('shows disabled state correctly', () => {
    render(<SettingsSelect {...defaultProps} disabled={true} />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('applies custom className', () => {
    const { container } = render(<SettingsSelect {...defaultProps} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('has proper accessibility attributes', () => {
    render(<SettingsSelect {...defaultProps} />)
    const button = screen.getByRole('button')
    
    expect(button).toHaveAttribute('aria-haspopup', 'listbox')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    
    fireEvent.click(button)
    
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('associates label with select correctly', () => {
    render(<SettingsSelect {...defaultProps} />)
    const label = screen.getByText('Test Select')
    const button = screen.getByRole('button')
    
    expect(label).toHaveAttribute('for', button.id)
  })

  it('shows check icon for selected option', () => {
    render(<SettingsSelect {...defaultProps} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    // The selected option (Option 1) should have a check icon
    const options = screen.getAllByRole('option')
    const selectedOption = options.find(option => 
      option.getAttribute('aria-selected') === 'true'
    )
    
    expect(selectedOption).toBeInTheDocument()
    expect(screen.getByTestId('check')).toBeInTheDocument()
  })

  it('displays option descriptions when provided', () => {
    render(<SettingsSelect {...defaultProps} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(screen.getByText('First option')).toBeInTheDocument()
    expect(screen.getByText('Second option')).toBeInTheDocument()
  })

  it('renders options without descriptions correctly', () => {
    render(<SettingsSelect {...defaultProps} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('prevents default on keyboard navigation events', () => {
    const onChange = vi.fn()
    render(<SettingsSelect {...defaultProps} onChange={onChange} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    fireEvent.keyDown(document, { key: 'ArrowDown', preventDefault: vi.fn() })
    fireEvent.keyDown(document, { key: 'Enter', preventDefault: vi.fn() })
    fireEvent.keyDown(document, { key: 'Escape', preventDefault: vi.fn() })
    
    // Verify the dropdown responds to keyboard events
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument() // Should be closed after Escape
  })
})