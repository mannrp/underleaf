import { useState, useRef, useCallback } from 'react'
import { useThemeClasses } from '@/hooks/useTheme'

interface SettingsSliderProps {
  label: string
  description?: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (value: number) => void
  disabled?: boolean
  className?: string
  formatValue?: (value: number) => string
}

export function SettingsSlider({
  label,
  description,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  disabled = false,
  className = '',
  formatValue
}: SettingsSliderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const sliderRef = useRef<HTMLInputElement>(null)
  const themeClasses = useThemeClasses()

  const percentage = ((value - min) / (max - min)) * 100
  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value)
    onChange(newValue)
  }, [onChange])

  const handleMouseDown = () => {
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return

    let newValue = value
    const stepSize = step

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault()
        newValue = Math.max(min, value - stepSize)
        break
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault()
        newValue = Math.min(max, value + stepSize)
        break
      case 'Home':
        event.preventDefault()
        newValue = min
        break
      case 'End':
        event.preventDefault()
        newValue = max
        break
      default:
        return
    }

    onChange(newValue)
  }

  return (
    <div className={`py-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <label 
            htmlFor={`slider-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className={`block text-sm font-medium transition-colors duration-200 cursor-pointer ${
              disabled 
                ? themeClasses.slider.label + ' opacity-50' 
                : `${themeClasses.slider.label} hover:text-[var(--color-primary)]`
            }`}
          >
            {label}
          </label>
          {description && (
            <p className={`mt-1 text-xs transition-colors duration-200 ${
              disabled 
                ? themeClasses.textMuted + ' opacity-50' 
                : themeClasses.textMuted
            }`}>
              {description}
            </p>
          )}
        </div>
        
        <div className={`
          px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200
          ${disabled 
            ? themeClasses.slider.value + ' opacity-50' 
            : themeClasses.slider.value
          }
          ${isDragging ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)]/50 text-[var(--color-primary)]' : ''}
        `}>
          {displayValue}
        </div>
      </div>

      <div className="relative">
        {/* Track */}
        <div className={`
          h-2 rounded-full transition-all duration-200
          ${disabled ? themeClasses.slider.track + ' opacity-50' : themeClasses.slider.track}
        `}>
          {/* Progress */}
          <div 
            className={`
              h-full rounded-full transition-all duration-300 ease-out
              ${disabled 
                ? themeClasses.slider.progress + ' opacity-50' 
                : `${themeClasses.slider.progress} shadow-lg shadow-[var(--color-primary)]/25`
              }
              ${isDragging ? 'shadow-lg shadow-[var(--color-primary)]/40' : ''}
            `}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Slider input */}
        <input
          ref={sliderRef}
          id={`slider-${label.replace(/\s+/g, '-').toLowerCase()}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`
            absolute inset-0 w-full h-full opacity-0 cursor-pointer
            focus:outline-none
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={displayValue}
        />

        {/* Thumb */}
        <div 
          className={`
            absolute top-1/2 w-5 h-5 -mt-2.5 rounded-full transition-all duration-200 ease-out pointer-events-none shadow-lg
            ${disabled 
              ? themeClasses.slider.thumb + ' opacity-50' 
              : themeClasses.slider.thumb
            }
            ${isDragging ? 'scale-125 shadow-xl shadow-[var(--color-primary)]/50' : 'scale-100'}
            ${isFocused && !disabled ? 'ring-2 ring-[var(--color-primary)]/50 ring-offset-2 ring-offset-[var(--color-background)]' : ''}
          `}
          style={{ left: `calc(${percentage}% - 10px)` }}
        >
          {/* Inner glow effect */}
          {!disabled && (
            <div className={`
              absolute inset-1 rounded-full transition-all duration-200
              ${isDragging ? 'bg-[var(--color-primary)]/30 animate-pulse' : 'bg-[var(--color-primary)]/20'}
            `} />
          )}
        </div>

        {/* Tick marks for important values */}
        {!disabled && (
          <div className={`absolute inset-x-0 top-full mt-2 flex justify-between text-xs ${themeClasses.textMuted}`}>
            <span>{min}{unit}</span>
            <span>{max}{unit}</span>
          </div>
        )}
      </div>
    </div>
  )
}