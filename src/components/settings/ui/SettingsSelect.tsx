import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useThemeClasses } from '@/hooks/useTheme'

export interface SelectOption {
  value: string
  label: string
  description?: string
  icon?: React.ComponentType<any>
}

interface SettingsSelectProps {
  label: string
  description?: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function SettingsSelect({
  label,
  description,
  value,
  options,
  onChange,
  disabled = false,
  className = '',
  placeholder = 'Select an option...'
}: SettingsSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const themeClasses = useThemeClasses()

  const selectedOption = options.find(option => option.value === value)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setFocusedIndex(prev => (prev + 1) % options.length)
          break
        case 'ArrowUp':
          event.preventDefault()
          setFocusedIndex(prev => (prev - 1 + options.length) % options.length)
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (focusedIndex >= 0) {
            handleSelect(options[focusedIndex].value)
          }
          break
        case 'Escape':
          event.preventDefault()
          setIsOpen(false)
          setFocusedIndex(-1)
          buttonRef.current?.focus()
          break
        case 'Home':
          event.preventDefault()
          setFocusedIndex(0)
          break
        case 'End':
          event.preventDefault()
          setFocusedIndex(options.length - 1)
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, focusedIndex, options])

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      if (!isOpen) {
        // Set focus to current selection when opening
        const currentIndex = options.findIndex(option => option.value === value)
        setFocusedIndex(currentIndex >= 0 ? currentIndex : 0)
      }
    }
  }

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setFocusedIndex(-1)
    buttonRef.current?.focus()
  }

  return (
    <div className={`py-4 ${className}`} ref={dropdownRef}>
      <div className="mb-3">
        <label 
          htmlFor={`select-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className={`block text-sm font-medium transition-colors duration-200 cursor-pointer ${
            disabled 
              ? themeClasses.textMuted + ' opacity-50' 
              : `${themeClasses.text} hover:text-[var(--color-primary)]`
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

      <div className="relative">
        <button
          ref={buttonRef}
          id={`select-${label.replace(/\s+/g, '-').toLowerCase()}`}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={`select-${label.replace(/\s+/g, '-').toLowerCase()}-label`}
          className={`
            relative w-full px-4 py-3 text-left rounded-xl border transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]
            ${disabled 
              ? `${themeClasses.select.button} opacity-50 cursor-not-allowed` 
              : isOpen
                ? `${themeClasses.select.button} ${themeClasses.select.buttonOpen} shadow-lg shadow-[var(--color-primary)]/25`
                : `${themeClasses.select.button} hover:border-[var(--color-border-secondary)] hover:bg-[var(--color-surface-hover)]`
            }
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedOption?.icon && (
                <selectedOption.icon size={16} className={themeClasses.textMuted} />
              )}
              <span className={selectedOption ? themeClasses.text : themeClasses.textMuted}>
                {selectedOption?.label || placeholder}
              </span>
            </div>
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${
                isOpen ? 'rotate-180' : 'rotate-0'
              } ${disabled ? themeClasses.textMuted : themeClasses.textMuted}`}
            />
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className={`
            absolute z-50 w-full mt-2 rounded-xl shadow-2xl transform transition-all duration-200 ease-out
            ${themeClasses.select.dropdown}
            ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2'}
          `}>
            <div 
              role="listbox" 
              aria-labelledby={`select-${label.replace(/\s+/g, '-').toLowerCase()}-label`}
              className="py-2 max-h-60 overflow-auto"
            >
              {options.map((option, index) => {
                const isSelected = option.value === value
                const isFocused = index === focusedIndex
                const Icon = option.icon

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full px-4 py-3 text-left flex items-center justify-between transition-all duration-150
                      ${isFocused 
                        ? themeClasses.select.optionFocused + ' ' + themeClasses.text
                        : isSelected 
                          ? themeClasses.select.optionSelected
                          : themeClasses.select.option
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      {Icon && (
                        <Icon 
                          size={16} 
                          className={`transition-colors duration-150 ${
                            isFocused || isSelected ? 'text-[var(--color-primary)]' : themeClasses.textMuted
                          }`} 
                        />
                      )}
                      <div>
                        <div className="font-medium">{option.label}</div>
                        {option.description && (
                          <div className={`text-xs mt-1 transition-colors duration-150 ${
                            isFocused || isSelected ? 'text-[var(--color-primary)]/80' : themeClasses.textMuted
                          }`}>
                            {option.description}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {isSelected && (
                      <Check 
                        size={16} 
                        className="text-[var(--color-primary)] animate-in fade-in duration-200" 
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}