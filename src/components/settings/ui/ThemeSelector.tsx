/**
 * Theme selector component for the settings panel
 * Provides visual theme selection with preview cards
 */

import { Palette, Sun, Moon, Code, Github } from 'lucide-react'
import { useTheme, useThemeClasses } from '@/hooks/useTheme'
import { themes, type ThemeConfig } from '@/utils/themes'

interface ThemeSelectorProps {
  className?: string
}

interface ThemePreviewCardProps {
  theme: ThemeConfig
  isSelected: boolean
  onSelect: () => void
}

function ThemePreviewCard({ theme, isSelected, onSelect }: ThemePreviewCardProps) {
  const themeClasses = useThemeClasses()
  
  const getThemeIcon = (themeName: string) => {
    switch (themeName) {
      case 'light':
        return Sun
      case 'dark':
        return Moon
      case 'monokai':
        return Code
      case 'github-light':
      case 'github-dark':
        return Github
      default:
        return Palette
    }
  }

  const Icon = getThemeIcon(theme.name)

  return (
    <button
      onClick={onSelect}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-200 text-left w-full
        ${isSelected 
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 shadow-lg shadow-[var(--color-primary)]/25' 
          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-secondary)] hover:bg-[var(--color-surface-hover)]'
        }
      `}
    >
      {/* Theme preview colors */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="flex items-center space-x-1">
          <div 
            className="w-4 h-4 rounded-full border border-[var(--color-border)]" 
            style={{ backgroundColor: theme.colors.background }}
          />
          <div 
            className="w-4 h-4 rounded-full border border-[var(--color-border)]" 
            style={{ backgroundColor: theme.colors.primary }}
          />
          <div 
            className="w-4 h-4 rounded-full border border-[var(--color-border)]" 
            style={{ backgroundColor: theme.colors.accent }}
          />
        </div>
        <Icon size={16} className={isSelected ? 'text-[var(--color-primary)]' : themeClasses.textMuted} />
      </div>

      {/* Theme info */}
      <div>
        <h3 className={`font-medium text-sm ${isSelected ? 'text-[var(--color-primary)]' : themeClasses.text}`}>
          {theme.displayName}
        </h3>
        <p className={`text-xs mt-1 ${isSelected ? 'text-[var(--color-primary)]/80' : themeClasses.textMuted}`}>
          {theme.mode === 'light' ? 'Light theme' : 'Dark theme'}
        </p>
      </div>

      {/* Code preview */}
      <div 
        className="mt-3 p-2 rounded text-xs font-mono leading-relaxed border"
        style={{ 
          backgroundColor: theme.colors.editorBackground,
          borderColor: theme.colors.border,
          color: theme.colors.text
        }}
      >
        <div style={{ color: theme.syntax.command }}>\documentclass</div>
        <div style={{ color: theme.syntax.environment }}>\begin{'{document}'}</div>
        <div style={{ color: theme.syntax.math }}>$E = mc^2$</div>
        <div style={{ color: theme.syntax.environment }}>\end{'{document}'}</div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-[var(--color-text-inverse)] rounded-full" />
        </div>
      )}
    </button>
  )
}

export function ThemeSelector({ className = '' }: ThemeSelectorProps) {
  const { themeName, setTheme } = useTheme()
  const themeClasses = useThemeClasses()

  // Group themes by mode
  const lightThemes = Object.values(themes).filter(theme => theme.mode === 'light')
  const darkThemes = Object.values(themes).filter(theme => theme.mode === 'dark')

  return (
    <div className={`py-4 ${className}`}>
      <div className="mb-4">
        <h3 className={`text-sm font-medium ${themeClasses.text} mb-2`}>
          Choose Theme
        </h3>
        <p className={`text-xs ${themeClasses.textMuted}`}>
          Select a color theme for the editor and interface
        </p>
      </div>

      {/* Light themes */}
      <div className="mb-6">
        <h4 className={`text-xs font-medium ${themeClasses.textSecondary} mb-3 uppercase tracking-wide`}>
          Light Themes
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lightThemes.map((theme) => (
            <ThemePreviewCard
              key={theme.name}
              theme={theme}
              isSelected={themeName === theme.name}
              onSelect={() => setTheme(theme.name)}
            />
          ))}
        </div>
      </div>

      {/* Dark themes */}
      <div>
        <h4 className={`text-xs font-medium ${themeClasses.textSecondary} mb-3 uppercase tracking-wide`}>
          Dark Themes
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {darkThemes.map((theme) => (
            <ThemePreviewCard
              key={theme.name}
              theme={theme}
              isSelected={themeName === theme.name}
              onSelect={() => setTheme(theme.name)}
            />
          ))}
        </div>
      </div>

      {/* Quick toggle */}
      <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`text-sm font-medium ${themeClasses.text}`}>
              Quick Toggle
            </h4>
            <p className={`text-xs ${themeClasses.textMuted} mt-1`}>
              Switch between light and dark modes
            </p>
          </div>
          <button
            onClick={() => {
              const currentTheme = themes[themeName]
              const newTheme = currentTheme.mode === 'light' ? 'dark' : 'light'
              setTheme(newTheme)
            }}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200
              ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text}
              hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-secondary)]
            `}
          >
            {themes[themeName].mode === 'light' ? (
              <>
                <Moon size={16} />
                <span className="text-sm">Dark</span>
              </>
            ) : (
              <>
                <Sun size={16} />
                <span className="text-sm">Light</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}