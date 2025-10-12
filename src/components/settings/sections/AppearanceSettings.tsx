/**
 * Appearance settings section for the settings panel
 * Handles theme selection, color customization, and visual preferences
 */

import { Palette, Sun, Moon, Code, Github } from 'lucide-react'
import { useTheme, useThemeClasses } from '@/hooks/useTheme'
import { themes, type ThemeConfig } from '@/utils/themes'
import { SettingsToggle } from '../ui/SettingsToggle'

interface AppearanceSettingsProps {
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
        relative p-4 rounded-xl border-2 transition-all duration-200 text-left w-full group
        ${isSelected 
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 shadow-lg shadow-[var(--color-primary)]/25' 
          : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-secondary)] hover:bg-[var(--color-surface-hover)]'
        }
      `}
    >
      {/* Theme preview colors */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div 
              className="w-4 h-4 rounded-full border border-[var(--color-border)] shadow-sm" 
              style={{ backgroundColor: theme.colors.background }}
            />
            <div 
              className="w-4 h-4 rounded-full border border-[var(--color-border)] shadow-sm" 
              style={{ backgroundColor: theme.colors.primary }}
            />
            <div 
              className="w-4 h-4 rounded-full border border-[var(--color-border)] shadow-sm" 
              style={{ backgroundColor: theme.colors.accent }}
            />
          </div>
          <Icon size={16} className={isSelected ? 'text-[var(--color-primary)]' : themeClasses.textMuted} />
        </div>
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-[var(--color-text-inverse)] rounded-full" />
          </div>
        )}
      </div>

      {/* Theme info */}
      <div className="mb-3">
        <h3 className={`font-medium text-sm ${isSelected ? 'text-[var(--color-primary)]' : themeClasses.text}`}>
          {theme.displayName}
        </h3>
        <p className={`text-xs mt-1 ${isSelected ? 'text-[var(--color-primary)]/80' : themeClasses.textMuted}`}>
          {theme.mode === 'light' ? 'Light theme' : 'Dark theme'}
        </p>
      </div>

      {/* Code preview with syntax highlighting */}
      <div 
        className="p-3 rounded-lg text-xs font-mono leading-relaxed border transition-all duration-200"
        style={{ 
          backgroundColor: theme.colors.editorBackground,
          borderColor: theme.colors.border,
          color: theme.colors.text
        }}
      >
        <div className="space-y-1">
          <div className="flex">
            <span style={{ color: theme.syntax.command }}>\documentclass</span>
            <span style={{ color: theme.syntax.bracket }}>{'{'}</span>
            <span style={{ color: theme.syntax.string }}>article</span>
            <span style={{ color: theme.syntax.bracket }}>{'}'}</span>
          </div>
          <div className="flex">
            <span style={{ color: theme.syntax.environment }}>\begin</span>
            <span style={{ color: theme.syntax.bracket }}>{'{'}</span>
            <span style={{ color: theme.syntax.string }}>document</span>
            <span style={{ color: theme.syntax.bracket }}>{'}'}</span>
          </div>
          <div className="pl-2">
            <span style={{ color: theme.syntax.math }}>$E = mc^</span>
            <span style={{ color: theme.syntax.number }}>2</span>
            <span style={{ color: theme.syntax.math }}>$</span>
          </div>
          <div className="flex">
            <span style={{ color: theme.syntax.environment }}>\end</span>
            <span style={{ color: theme.syntax.bracket }}>{'{'}</span>
            <span style={{ color: theme.syntax.string }}>document</span>
            <span style={{ color: theme.syntax.bracket }}>{'}'}</span>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className={`
        absolute inset-0 rounded-xl transition-opacity duration-200 pointer-events-none
        ${isSelected ? 'opacity-0' : 'opacity-0 group-hover:opacity-5'}
        bg-[var(--color-primary)]
      `} />
    </button>
  )
}

export function AppearanceSettings({ className = '' }: AppearanceSettingsProps) {
  const { themeName, setTheme, toggleTheme } = useTheme()
  const themeClasses = useThemeClasses()

  // Group themes by mode for better organization
  const lightThemes = Object.values(themes).filter(theme => theme.mode === 'light')
  const darkThemes = Object.values(themes).filter(theme => theme.mode === 'dark')
  const currentTheme = themes[themeName]

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div>
        <h2 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>
          Appearance
        </h2>
        <p className={`text-sm ${themeClasses.textMuted}`}>
          Customize the visual appearance of your editor and interface
        </p>
      </div>

      {/* Theme Mode Toggle */}
      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-6 border border-blue-700/30">
        <h4 className="text-white font-semibold mb-6 flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
          Theme Mode
        </h4>
        
        <div className="space-y-4">
          <SettingsToggle
            id="theme-mode-toggle"
            label="Dark Mode"
            description={`Currently using ${currentTheme.displayName} theme. Toggle to switch between light and dark modes.`}
            checked={currentTheme.mode === 'dark'}
            onChange={(checked) => {
              const newTheme = checked ? 'dark' : 'light'
              setTheme(newTheme)
            }}
          />
          
          <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-[var(--color-background-secondary)]">
                {currentTheme.mode === 'light' ? (
                  <Sun size={20} className="text-yellow-500" />
                ) : (
                  <Moon size={20} className="text-blue-400" />
                )}
              </div>
              <div>
                <h4 className={`text-sm font-medium ${themeClasses.text}`}>
                  Active Theme
                </h4>
                <p className={`text-xs ${themeClasses.textMuted} mt-1`}>
                  {currentTheme.displayName} • {currentTheme.mode === 'light' ? 'Light mode' : 'Dark mode'}
                </p>
              </div>
            </div>
            
            <button
              onClick={toggleTheme}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 text-sm
                ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text}
                hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-secondary)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]
              `}
            >
              {currentTheme.mode === 'light' ? (
                <>
                  <Moon size={14} />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun size={14} />
                  <span>Light</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Theme selector */}
      <div className="space-y-6">
        <div>
          <h3 className={`text-sm font-medium ${themeClasses.text} mb-2`}>
            Color Themes
          </h3>
          <p className={`text-xs ${themeClasses.textMuted}`}>
            Choose from our curated collection of themes with syntax highlighting previews
          </p>
        </div>

        {/* Light themes */}
        <div>
          <h4 className={`text-xs font-medium ${themeClasses.textSecondary} mb-4 uppercase tracking-wide flex items-center space-x-2`}>
            <Sun size={14} />
            <span>Light Themes</span>
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          <h4 className={`text-xs font-medium ${themeClasses.textSecondary} mb-4 uppercase tracking-wide flex items-center space-x-2`}>
            <Moon size={14} />
            <span>Dark Themes</span>
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
      </div>

      {/* Theme information */}
      <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)]">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-[var(--color-surface)]">
            <Palette size={16} className={themeClasses.textSecondary} />
          </div>
          <div className="flex-1">
            <h4 className={`text-sm font-medium ${themeClasses.text} mb-1`}>
              About Themes
            </h4>
            <p className={`text-xs ${themeClasses.textMuted} leading-relaxed`}>
              Themes affect the entire interface including the editor, panels, and syntax highlighting. 
              Changes are applied immediately and persist across sessions. Each theme is carefully 
              designed for optimal readability and reduced eye strain.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}