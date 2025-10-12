import { useEffect } from 'react'
import { useSettingsPanel } from '@/hooks/useSettingsPanel'

export function useKeyboardShortcuts() {
  const { openSettings } = useSettingsPanel()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+, (settings)
      if (event.ctrlKey && event.key === ',') {
        event.preventDefault()
        openSettings()
        return
      }

      // Check for F11 (fullscreen) - will be implemented later
      if (event.key === 'F11') {
        event.preventDefault()
        // Fullscreen toggle will be implemented in a later task
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openSettings])
}