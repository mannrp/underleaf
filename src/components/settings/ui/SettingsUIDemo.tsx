import { useState } from 'react'
import { SettingsToggle } from './SettingsToggle'
import { SettingsSlider } from './SettingsSlider'
import { SettingsSelect, SelectOption } from './SettingsSelect'
import { ThemeSelector } from './ThemeSelector'
import { Palette, Monitor, FileText } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

/**
 * Demo component showcasing all reusable settings UI components
 * This component demonstrates proper usage patterns and accessibility features
 */
export function SettingsUIDemo() {
  const { themeName } = useTheme()
  
  // Toggle states
  const [darkMode, setDarkMode] = useState(true)
  const [autoSave, setAutoSave] = useState(false)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [wordWrap, setWordWrap] = useState(false)

  // Slider states
  const [fontSize, setFontSize] = useState(14)
  const [autoSaveInterval, setAutoSaveInterval] = useState(30)
  const [tabSize, setTabSize] = useState(2)

  // Select states
  const [theme, setTheme] = useState('dark')
  const [pdfFitMode, setPdfFitMode] = useState('width')
  const [language, setLanguage] = useState('en')

  // Select options
  const themeOptions: SelectOption[] = [
    { value: 'dark', label: 'Dark Theme', description: 'Dark background with light text', icon: Monitor },
    { value: 'light', label: 'Light Theme', description: 'Light background with dark text', icon: Monitor },
    { value: 'monokai', label: 'Monokai', description: 'Popular dark theme for coding', icon: Palette },
    { value: 'solarized', label: 'Solarized Dark', description: 'Easy on the eyes dark theme', icon: Palette }
  ]

  const pdfFitOptions: SelectOption[] = [
    { value: 'width', label: 'Fit to Width', description: 'Scale PDF to fit viewer width' },
    { value: 'height', label: 'Fit to Height', description: 'Scale PDF to fit viewer height' },
    { value: 'actual', label: 'Actual Size', description: 'Display PDF at 100% zoom' }
  ]

  const languageOptions: SelectOption[] = [
    { value: 'en', label: 'English', icon: FileText },
    { value: 'es', label: 'Español', icon: FileText },
    { value: 'fr', label: 'Français', icon: FileText },
    { value: 'de', label: 'Deutsch', icon: FileText }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[var(--color-background)] text-[var(--color-text)] rounded-xl">
      <h2 className="text-2xl font-bold mb-8 text-center">Settings UI Components Demo</h2>
      
      {/* Theme System Section */}
      <section className="mb-12">
        <h3 className="text-lg font-semibold mb-6 text-[var(--color-primary)]">Theme System</h3>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            Current theme: <span className="font-medium text-[var(--color-primary)]">{themeName}</span>
          </p>
          <ThemeSelector />
        </div>
      </section>
      
      {/* Toggle Components Section */}
      <section className="mb-12">
        <h3 className="text-lg font-semibold mb-6 text-[var(--color-primary)]">Toggle Components</h3>
        <div className="space-y-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
          <SettingsToggle
            id="demo-dark-mode"
            label="Dark Mode"
            description="Use dark theme for better visibility in low light"
            checked={darkMode}
            onChange={setDarkMode}
          />
          
          <SettingsToggle
            id="demo-auto-save"
            label="Auto Save"
            description="Automatically save changes every few seconds"
            checked={autoSave}
            onChange={setAutoSave}
          />
          
          <SettingsToggle
            id="demo-line-numbers"
            label="Show Line Numbers"
            description="Display line numbers in the editor"
            checked={showLineNumbers}
            onChange={setShowLineNumbers}
          />
          
          <SettingsToggle
            id="demo-word-wrap"
            label="Word Wrap"
            description="Wrap long lines to fit in the editor"
            checked={wordWrap}
            onChange={setWordWrap}
          />
          
          <SettingsToggle
            id="demo-disabled-toggle"
            label="Disabled Toggle"
            description="This toggle is disabled to show the disabled state"
            checked={false}
            onChange={() => {}}
            disabled={true}
          />
        </div>
      </section>

      {/* Slider Components Section */}
      <section className="mb-12">
        <h3 className="text-lg font-semibold mb-6 text-[var(--color-secondary)]">Slider Components</h3>
        <div className="space-y-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
          <SettingsSlider
            label="Font Size"
            description="Adjust the editor font size"
            value={fontSize}
            min={8}
            max={32}
            step={1}
            unit="px"
            onChange={setFontSize}
          />
          
          <SettingsSlider
            label="Auto Save Interval"
            description="How often to automatically save changes"
            value={autoSaveInterval}
            min={5}
            max={300}
            step={5}
            unit="s"
            onChange={setAutoSaveInterval}
            formatValue={(value) => `${value} seconds`}
          />
          
          <SettingsSlider
            label="Tab Size"
            description="Number of spaces per tab indentation"
            value={tabSize}
            min={1}
            max={8}
            step={1}
            onChange={setTabSize}
          />
          
          <SettingsSlider
            label="Disabled Slider"
            description="This slider is disabled to show the disabled state"
            value={50}
            min={0}
            max={100}
            onChange={() => {}}
            disabled={true}
          />
        </div>
      </section>

      {/* Select Components Section */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-6 text-[var(--color-accent)]">Select Components</h3>
        <div className="space-y-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
          <SettingsSelect
            label="Color Theme"
            description="Choose your preferred color scheme"
            value={theme}
            options={themeOptions}
            onChange={setTheme}
          />
          
          <SettingsSelect
            label="PDF Fit Mode"
            description="How PDFs should be scaled in the viewer"
            value={pdfFitMode}
            options={pdfFitOptions}
            onChange={setPdfFitMode}
          />
          
          <SettingsSelect
            label="Language"
            description="Interface language preference"
            value={language}
            options={languageOptions}
            onChange={setLanguage}
          />
          
          <SettingsSelect
            label="Disabled Select"
            description="This select is disabled to show the disabled state"
            value=""
            options={themeOptions}
            onChange={() => {}}
            disabled={true}
            placeholder="Cannot select..."
          />
        </div>
      </section>

      {/* Current Values Display */}
      <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-[var(--color-warning)]">Current Values</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-[var(--color-text-secondary)] mb-2">Toggles</h4>
            <ul className="space-y-1 text-[var(--color-text-muted)]">
              <li>Dark Mode: <span className="text-[var(--color-primary)]">{darkMode ? 'On' : 'Off'}</span></li>
              <li>Auto Save: <span className="text-[var(--color-primary)]">{autoSave ? 'On' : 'Off'}</span></li>
              <li>Line Numbers: <span className="text-[var(--color-primary)]">{showLineNumbers ? 'On' : 'Off'}</span></li>
              <li>Word Wrap: <span className="text-[var(--color-primary)]">{wordWrap ? 'On' : 'Off'}</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-[var(--color-text-secondary)] mb-2">Sliders</h4>
            <ul className="space-y-1 text-[var(--color-text-muted)]">
              <li>Font Size: <span className="text-[var(--color-primary)]">{fontSize}px</span></li>
              <li>Auto Save: <span className="text-[var(--color-primary)]">{autoSaveInterval}s</span></li>
              <li>Tab Size: <span className="text-[var(--color-primary)]">{tabSize}</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-[var(--color-text-secondary)] mb-2">Selects</h4>
            <ul className="space-y-1 text-[var(--color-text-muted)]">
              <li>Theme: <span className="text-[var(--color-primary)]">{theme}</span></li>
              <li>PDF Fit: <span className="text-[var(--color-primary)]">{pdfFitMode}</span></li>
              <li>Language: <span className="text-[var(--color-primary)]">{language}</span></li>
              <li>Active Theme: <span className="text-[var(--color-primary)]">{themeName}</span></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}