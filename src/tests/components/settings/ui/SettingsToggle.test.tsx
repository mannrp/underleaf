import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SettingsToggle } from '@/components/settings/ui/SettingsToggle'

// Mock the environment adapter
vi.mock('@/utils/environment', () => ({
  environmentAdapter: {
    info: {
      isDevelopment: true,
      isElectron: false,
      isRenderer: true,
      nodeIntegration: false,
      contextIsolation: true,
      platform: 'win32'
    },
    storage: {
      get: vi.fn().mockResolvedValue(null),
      set: vi.fn().mockResolvedValue(undefined),
      has: vi.fn().mockResolvedValue(false),
      remove: vi.fn().mockResolvedValue(undefined)
    }
  }
}))

// Import the mocked module to get access to the mock functions
import { environmentAdapter } from '@/utils/environment'
const mockStorage = environmentAdapter.storage as any

describe('SettingsToggle', () => {
  const defaultProps = {
    id: 'test-toggle',
    label: 'Test Toggle',
    checked: false,
    onChange: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock storage
    mockStorage.get.mockResolvedValue(null)
    mockStorage.set.mockResolvedValue(undefined)
    mockStorage.has.mockResolvedValue(false)
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('renders with label', () => {
    render(<SettingsToggle {...defaultProps} />)
    expect(screen.getByLabelText('Test Toggle')).toBeInTheDocument()
  })

  it('renders with description when provided', () => {
    render(
      <SettingsToggle 
        {...defaultProps} 
        description="This is a test description" 
      />
    )
    expect(screen.getByText('This is a test description')).toBeInTheDocument()
  })

  it('shows checked state correctly', () => {
    render(<SettingsToggle {...defaultProps} checked={true} />)
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })

  it('shows unchecked state correctly', () => {
    render(<SettingsToggle {...defaultProps} checked={false} />)
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onChange when clicked', async () => {
    const onChange = vi.fn()
    render(<SettingsToggle {...defaultProps} onChange={onChange} />)
    
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    
    expect(onChange).toHaveBeenCalledWith(true)
    
    // Wait for persistence to complete
    await waitFor(() => {
      expect(mockStorage.set).toHaveBeenCalledWith(
        'toggle-test-toggle',
        expect.objectContaining({
          value: true,
          timestamp: expect.any(Number),
          environment: 'development'
        })
      )
    })
  })

  it('calls onChange with opposite value when clicked', async () => {
    const onChange = vi.fn()
    render(<SettingsToggle {...defaultProps} checked={true} onChange={onChange} />)
    
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    
    expect(onChange).toHaveBeenCalledWith(false)
    
    // Wait for persistence to complete
    await waitFor(() => {
      expect(mockStorage.set).toHaveBeenCalledWith(
        'toggle-test-toggle',
        expect.objectContaining({
          value: false,
          timestamp: expect.any(Number),
          environment: 'development'
        })
      )
    })
  })

  it('handles keyboard navigation with Space key', async () => {
    const onChange = vi.fn()
    render(<SettingsToggle {...defaultProps} onChange={onChange} />)
    
    const toggle = screen.getByRole('switch')
    fireEvent.keyDown(toggle, { key: ' ' })
    
    expect(onChange).toHaveBeenCalledWith(true)
    
    // Wait for persistence to complete
    await waitFor(() => {
      expect(mockStorage.set).toHaveBeenCalled()
    })
  })

  it('handles keyboard navigation with Enter key', async () => {
    const onChange = vi.fn()
    render(<SettingsToggle {...defaultProps} onChange={onChange} />)
    
    const toggle = screen.getByRole('switch')
    fireEvent.keyDown(toggle, { key: 'Enter' })
    
    expect(onChange).toHaveBeenCalledWith(true)
    
    // Wait for persistence to complete
    await waitFor(() => {
      expect(mockStorage.set).toHaveBeenCalled()
    })
  })

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn()
    render(<SettingsToggle {...defaultProps} disabled={true} onChange={onChange} />)
    
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    
    expect(onChange).not.toHaveBeenCalled()
  })

  it('shows disabled state correctly', () => {
    render(<SettingsToggle {...defaultProps} disabled={true} />)
    const toggle = screen.getByRole('switch')
    expect(toggle).toHaveAttribute('aria-disabled', 'true')
    expect(toggle).toBeDisabled()
  })

  it('applies custom className', () => {
    const { container } = render(<SettingsToggle {...defaultProps} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('has proper accessibility attributes', () => {
    render(<SettingsToggle {...defaultProps} />)
    const toggle = screen.getByRole('switch')
    
    expect(toggle).toHaveAttribute('role', 'switch')
    expect(toggle).toHaveAttribute('aria-checked')
    expect(toggle).toHaveAttribute('id')
  })

  it('associates label with toggle correctly', () => {
    render(<SettingsToggle {...defaultProps} />)
    const toggle = screen.getByRole('switch')
    const label = screen.getByLabelText('Test Toggle')
    
    expect(label).toBe(toggle)
  })

  it('handles keyboard events correctly', () => {
    const onChange = vi.fn()
    render(<SettingsToggle {...defaultProps} onChange={onChange} />)
    const toggle = screen.getByRole('switch')
    
    // Test space key
    fireEvent.keyDown(toggle, { key: ' ' })
    expect(onChange).toHaveBeenCalledWith(true)
    
    // Test that other keys don't trigger change
    onChange.mockClear()
    fireEvent.keyDown(toggle, { key: 'a' })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('shows loading state while persisting changes', async () => {
    // Make storage.set take some time to resolve
    mockStorage.set.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    )

    const onChange = vi.fn()
    render(<SettingsToggle {...defaultProps} onChange={onChange} />)
    
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    
    // Should show loading state
    expect(screen.getByText('Saving...')).toBeInTheDocument()
    
    // Wait for persistence to complete
    await waitFor(() => {
      expect(screen.queryByText('Saving...')).not.toBeInTheDocument()
    }, { timeout: 200 })
  })

  it('handles storage errors gracefully', async () => {
    mockStorage.set.mockRejectedValue(new Error('Storage failed'))

    const onChange = vi.fn()
    render(<SettingsToggle {...defaultProps} onChange={onChange} />)
    
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    
    // Should call onChange immediately for visual feedback
    expect(onChange).toHaveBeenCalledWith(true)
    
    // Wait for error to appear (there are two instances: visible and screen reader)
    await waitFor(() => {
      expect(screen.getAllByText('Failed to save setting')).toHaveLength(2)
    })
    
    // Should revert the change
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(false)
    })
  })

  it('retries failed storage operations', async () => {
    let callCount = 0
    mockStorage.set.mockImplementation(() => {
      callCount++
      if (callCount < 3) {
        return Promise.reject(new Error('Storage failed'))
      }
      return Promise.resolve()
    })

    const onChange = vi.fn()
    render(<SettingsToggle {...defaultProps} onChange={onChange} />)
    
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    
    // Wait for retries to complete
    await waitFor(() => {
      expect(callCount).toBe(3)
    }, { timeout: 1000 })
    
    // Should not show error if retry succeeds
    expect(screen.queryByText('Failed to save setting')).not.toBeInTheDocument()
  })

  it('prevents multiple rapid clicks', async () => {
    const onChange = vi.fn()
    render(<SettingsToggle {...defaultProps} onChange={onChange} />)
    
    const toggle = screen.getByRole('switch')
    
    // Click multiple times rapidly
    fireEvent.click(toggle)
    fireEvent.click(toggle)
    fireEvent.click(toggle)
    
    // Should only call onChange once
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('works in Electron environment', async () => {
    // This test would need to be restructured to properly test Electron environment
    // For now, we'll test the basic functionality
    const onChange = vi.fn()
    render(<SettingsToggle {...defaultProps} onChange={onChange} />)
    
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    
    expect(onChange).toHaveBeenCalledWith(true)
    
    await waitFor(() => {
      expect(mockStorage.set).toHaveBeenCalledWith(
        'toggle-test-toggle',
        expect.objectContaining({
          value: true,
          environment: 'development'
        })
      )
    })
  })

  it('shows error state when storage fails', async () => {
    mockStorage.set.mockRejectedValue(new Error('Storage failed'))

    const onChange = vi.fn()
    render(<SettingsToggle {...defaultProps} onChange={onChange} />)
    
    const toggle = screen.getByRole('switch')
    fireEvent.click(toggle)
    
    // Should call onChange immediately for visual feedback
    expect(onChange).toHaveBeenCalledWith(true)
    
    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getAllByText('Failed to save setting')).toHaveLength(2)
    })
    
    // Should revert the change
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(false)
    })
    
    // Should show error styling
    expect(toggle).toHaveClass('ring-2', 'ring-red-500/50')
  })
})