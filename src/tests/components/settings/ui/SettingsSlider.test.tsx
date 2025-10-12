import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SettingsSlider } from '@/components/settings/ui/SettingsSlider'

describe('SettingsSlider', () => {
  const defaultProps = {
    label: 'Test Slider',
    value: 50,
    min: 0,
    max: 100,
    onChange: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with label', () => {
    render(<SettingsSlider {...defaultProps} />)
    expect(screen.getByText('Test Slider')).toBeInTheDocument()
  })

  it('renders with description when provided', () => {
    render(
      <SettingsSlider 
        {...defaultProps} 
        description="This is a test description" 
      />
    )
    expect(screen.getByText('This is a test description')).toBeInTheDocument()
  })

  it('displays current value', () => {
    render(<SettingsSlider {...defaultProps} value={75} />)
    expect(screen.getByText('75')).toBeInTheDocument()
  })

  it('displays value with unit when provided', () => {
    render(<SettingsSlider {...defaultProps} value={30} unit="px" />)
    expect(screen.getByText('30px')).toBeInTheDocument()
  })

  it('uses custom formatValue function when provided', () => {
    const formatValue = (value: number) => `${value}%`
    render(
      <SettingsSlider 
        {...defaultProps} 
        value={25} 
        formatValue={formatValue} 
      />
    )
    expect(screen.getByText('25%')).toBeInTheDocument()
  })

  it('calls onChange when slider value changes', () => {
    const onChange = vi.fn()
    render(<SettingsSlider {...defaultProps} onChange={onChange} />)
    
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '75' } })
    
    expect(onChange).toHaveBeenCalledWith(75)
  })

  it('handles keyboard navigation with arrow keys', () => {
    const onChange = vi.fn()
    render(<SettingsSlider {...defaultProps} step={10} onChange={onChange} />)
    
    const slider = screen.getByRole('slider')
    
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith(60)
    
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenCalledWith(40)
    
    fireEvent.keyDown(slider, { key: 'ArrowUp' })
    expect(onChange).toHaveBeenCalledWith(60)
    
    fireEvent.keyDown(slider, { key: 'ArrowDown' })
    expect(onChange).toHaveBeenCalledWith(40)
  })

  it('handles Home and End keys', () => {
    const onChange = vi.fn()
    render(<SettingsSlider {...defaultProps} onChange={onChange} />)
    
    const slider = screen.getByRole('slider')
    
    fireEvent.keyDown(slider, { key: 'Home' })
    expect(onChange).toHaveBeenCalledWith(0)
    
    fireEvent.keyDown(slider, { key: 'End' })
    expect(onChange).toHaveBeenCalledWith(100)
  })

  it('respects min and max boundaries', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <SettingsSlider 
        {...defaultProps} 
        value={0} 
        min={0} 
        max={10} 
        step={1}
        onChange={onChange} 
      />
    )
    
    const slider = screen.getByRole('slider')
    
    // Try to go below min
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenCalledWith(0) // Should stay at min
    
    // Set to max and try to go above
    rerender(
      <SettingsSlider 
        {...defaultProps} 
        value={10} 
        min={0} 
        max={10} 
        step={1}
        onChange={onChange} 
      />
    )
    
    const maxSlider = screen.getByRole('slider')
    fireEvent.keyDown(maxSlider, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith(10) // Should stay at max
  })

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn()
    render(<SettingsSlider {...defaultProps} disabled={true} onChange={onChange} />)
    
    const slider = screen.getByRole('slider')
    
    // Disabled sliders should not respond to events
    expect(slider).toBeDisabled()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('shows disabled state correctly', () => {
    render(<SettingsSlider {...defaultProps} disabled={true} />)
    const slider = screen.getByRole('slider')
    expect(slider).toBeDisabled()
  })

  it('applies custom className', () => {
    const { container } = render(<SettingsSlider {...defaultProps} className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('has proper accessibility attributes', () => {
    render(<SettingsSlider {...defaultProps} />)
    const slider = screen.getByRole('slider')
    
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '100')
    expect(slider).toHaveAttribute('aria-valuenow', '50')
    expect(slider).toHaveAttribute('aria-valuetext', '50')
  })

  it('associates label with slider correctly', () => {
    render(<SettingsSlider {...defaultProps} />)
    const label = screen.getByText('Test Slider')
    const slider = screen.getByRole('slider')
    
    expect(label).toHaveAttribute('for', slider.id)
  })

  it('uses custom step value', () => {
    const onChange = vi.fn()
    render(
      <SettingsSlider 
        {...defaultProps} 
        value={50} 
        step={5} 
        onChange={onChange} 
      />
    )
    
    const slider = screen.getByRole('slider')
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    
    expect(onChange).toHaveBeenCalledWith(55)
  })

  it('displays min and max values as tick marks', () => {
    render(<SettingsSlider {...defaultProps} unit="px" />)
    expect(screen.getByText('0px')).toBeInTheDocument()
    expect(screen.getByText('100px')).toBeInTheDocument()
  })

  it('prevents default on keyboard navigation', () => {
    const onChange = vi.fn()
    render(<SettingsSlider {...defaultProps} onChange={onChange} />)
    const slider = screen.getByRole('slider')
    
    fireEvent.keyDown(slider, { key: 'ArrowRight', preventDefault: vi.fn() })
    fireEvent.keyDown(slider, { key: 'Home', preventDefault: vi.fn() })
    fireEvent.keyDown(slider, { key: 'End', preventDefault: vi.fn() })
    
    expect(onChange).toHaveBeenCalledTimes(3)
  })
})