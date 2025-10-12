import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'
import { useThemeClasses } from '@/hooks/useTheme'
import { SettingsTabs, SettingsTab } from './SettingsTabs'
import { SettingsContent } from './SettingsContent'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const { isLoaded } = useSettingsStore()
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance')
  const themeClasses = useThemeClasses()

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Focus the modal for keyboard navigation
      modalRef.current?.focus()
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with fade animation */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-black/60 via-[var(--color-background)]/50 to-black/60 backdrop-blur-sm transition-all duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Modal with scale and fade animation */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        aria-describedby="settings-description"
        tabIndex={-1}
        className={`settings-panel-modal relative bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-background-secondary)] to-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl w-full max-w-5xl transform transition-all duration-500 ease-out ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0 rotate-0' 
            : 'opacity-0 scale-90 translate-y-8 rotate-1'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex-shrink-0 flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20`}>
          <div>
            <h2 id="settings-title" className={`text-2xl font-bold ${themeClasses.text} mb-1`}>Settings</h2>
            <p id="settings-description" className={`text-sm ${themeClasses.textSecondary}`}>Customize your LaTeX editor experience</p>
          </div>
          <button
            onClick={onClose}
            className={`p-3 ${themeClasses.textMuted} hover:${themeClasses.text} hover:bg-[var(--color-surface-hover)] rounded-xl transition-all duration-200 hover:scale-110`}
            aria-label="Close settings"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="settings-panel-content flex flex-1 min-h-0 overflow-hidden">
          {/* Sidebar Navigation */}
          <SettingsTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />

          {/* Main Content Area */}
          {!isLoaded ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-primary)]"></div>
                <div className={themeClasses.textSecondary}>Loading settings...</div>
              </div>
            </div>
          ) : (
            <SettingsContent activeTab={activeTab} />
          )}
        </div>

        {/* Footer */}
        <div className="settings-panel-footer flex-shrink-0 flex items-center justify-between border-t border-[var(--color-border)] bg-gradient-to-r from-[var(--color-background-secondary)]/50 to-[var(--color-surface)]/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse"></div>
            <div className={`text-sm ${themeClasses.textSecondary}`}>
              Settings are automatically saved
            </div>
          </div>
          <button
            onClick={onClose}
            className={`px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] hover:from-[var(--color-primary-hover)] hover:to-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[var(--color-primary)]/25 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}