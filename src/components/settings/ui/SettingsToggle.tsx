import { useState, useCallback, useEffect, useRef } from 'react'
import { environmentAdapter } from '@/utils/environment'
import { useThemeClasses } from '@/hooks/useTheme'

interface SettingsToggleProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function SettingsToggle({ 
  id,
  label, 
  description, 
  checked, 
  onChange, 
  disabled = false,
  className = '' 
}: SettingsToggleProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [isChanging, setIsChanging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const changeTimeoutRef = useRef<NodeJS.Timeout>()

  // Environment-aware change handler with proper error handling and state synchronization
  const handleChange = useCallback(async (newValue: boolean) => {
    if (disabled || isChanging) return

    setIsChanging(true)
    setError(null)

    try {
      // Clear any existing timeout
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current)
      }

      // Provide immediate visual feedback
      onChange(newValue)

      // Environment-aware persistence with retry logic
      const persistChange = async (retries = 3): Promise<void> => {
        try {
          // Store the change using environment-aware storage
          await environmentAdapter.storage.set(`toggle-${id}`, {
            value: newValue,
            timestamp: Date.now(),
            environment: environmentAdapter.info.isDevelopment ? 'development' : 'production'
          })
        } catch (error) {
          if (retries > 0) {
            // Retry with exponential backoff
            await new Promise(resolve => setTimeout(resolve, 100 * (4 - retries)))
            return persistChange(retries - 1)
          }
          throw error
        }
      }

      // Persist the change with timeout
      changeTimeoutRef.current = setTimeout(async () => {
        try {
          await persistChange()
        } catch (error) {
          console.warn(`Failed to persist toggle ${id} change:`, error)
          setError('Failed to save setting')
          // Revert the change on persistence failure
          onChange(!newValue)
        } finally {
          setIsChanging(false)
        }
      }, 50) // Small delay to batch rapid changes

    } catch (error) {
      console.error(`Toggle ${id} change failed:`, error)
      setError('Change failed')
      setIsChanging(false)
    }
  }, [id, disabled, isChanging, onChange])

  // Environment-aware click handler
  const handleClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (!disabled && !isChanging) {
      handleChange(!checked)
    }
  }, [disabled, isChanging, checked, handleChange])

  // Environment-aware keyboard handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      setIsPressed(true)
      
      if (!disabled && !isChanging) {
        handleChange(!checked)
      }
    }
  }, [disabled, isChanging, checked, handleChange])

  const handleKeyUp = useCallback((event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      setIsPressed(false)
    }
  }, [])

  // Mouse interaction handlers
  const handleMouseDown = useCallback(() => {
    if (!disabled) setIsPressed(true)
  }, [disabled])

  const handleMouseUp = useCallback(() => {
    setIsPressed(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsPressed(false)
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current)
      }
    }
  }, [])

  // Clear error after a delay
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const toggleId = `toggle-${id}`
  const isEffectivelyDisabled = disabled || isChanging
  const themeClasses = useThemeClasses()

  return (
    <div className={`flex items-start justify-between py-4 ${className}`}>
      <div className="flex-1 mr-4">
        <label 
          htmlFor={toggleId}
          className={`block text-sm font-medium transition-colors duration-200 cursor-pointer ${
            isEffectivelyDisabled 
              ? themeClasses.toggle.labelDisabled
              : `${themeClasses.toggle.label} hover:text-[var(--color-primary)]`
          }`}
        >
          {label}
          {isChanging && (
            <span className="ml-2 text-xs text-[var(--color-primary)] animate-pulse">
              Saving...
            </span>
          )}
        </label>
        {description && (
          <p className={`mt-1 text-xs transition-colors duration-200 ${
            isEffectivelyDisabled 
              ? themeClasses.toggle.labelDisabled
              : themeClasses.toggle.description
          }`}>
            {description}
          </p>
        )}
        {error && (
          <p className="mt-1 text-xs text-[var(--color-error)] animate-pulse">
            {error}
          </p>
        )}
      </div>
      
      <button
        id={toggleId}
        role="switch"
        aria-checked={checked}
        aria-disabled={isEffectivelyDisabled}
        aria-describedby={error ? `${toggleId}-error` : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        disabled={isEffectivelyDisabled}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-out
          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]
          ${isEffectivelyDisabled 
            ? themeClasses.toggle.trackDisabled + ' cursor-not-allowed' 
            : checked 
              ? `${themeClasses.toggle.trackActive} hover:bg-[var(--color-primary-hover)] shadow-lg shadow-[var(--color-primary)]/25` 
              : `${themeClasses.toggle.track} hover:bg-[var(--color-surface-hover)] shadow-inner`
          }
          ${isPressed && !isEffectivelyDisabled ? 'scale-95' : 'scale-100'}
          ${error ? 'ring-2 ring-[var(--color-error)]/50' : ''}
        `}
      >
        <span className="sr-only">{label}</span>
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full shadow-lg transition-all duration-300 ease-out
            ${themeClasses.toggle.thumb}
            ${checked ? 'translate-x-6' : 'translate-x-1'}
            ${isPressed && !isEffectivelyDisabled ? 'scale-110' : 'scale-100'}
            ${isEffectivelyDisabled ? 'opacity-70' : 'opacity-100'}
          `}
        >
          {/* Inner glow effect when active */}
          {checked && !isEffectivelyDisabled && (
            <span className="absolute inset-0 rounded-full bg-[var(--color-primary)]/30 animate-pulse opacity-50" />
          )}
          
          {/* Loading indicator when changing */}
          {isChanging && (
            <span className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
          )}
        </span>
        
        {/* Ripple effect on click */}
        {isPressed && !isEffectivelyDisabled && (
          <span className="absolute inset-0 rounded-full bg-[var(--color-text-inverse)]/20 animate-ping" />
        )}
      </button>
      
      {/* Hidden error message for screen readers */}
      {error && (
        <div id={`${toggleId}-error`} className="sr-only" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}