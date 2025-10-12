/**
 * Demo component for AppearanceSettings
 * Shows the appearance settings in a standalone container for testing and development
 */

import { AppearanceSettings } from './AppearanceSettings'

export function AppearanceSettingsDemo() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            Appearance Settings Demo
          </h1>
          <p className="text-[var(--color-text-muted)]">
            This demo shows the AppearanceSettings component with all its features including theme selection, 
            color previews, and syntax highlighting examples.
          </p>
        </div>
        
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 shadow-sm">
          <AppearanceSettings />
        </div>
      </div>
    </div>
  )
}