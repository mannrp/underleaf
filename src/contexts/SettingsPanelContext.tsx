import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface SettingsPanelContextType {
  isOpen: boolean
  openSettings: () => void
  closeSettings: () => void
  toggleSettings: () => void
}

const SettingsPanelContext = createContext<SettingsPanelContextType | undefined>(undefined)

export function SettingsPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openSettings = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeSettings = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggleSettings = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return (
    <SettingsPanelContext.Provider value={{
      isOpen,
      openSettings,
      closeSettings,
      toggleSettings
    }}>
      {children}
    </SettingsPanelContext.Provider>
  )
}

export function useSettingsPanel() {
  const context = useContext(SettingsPanelContext)
  if (context === undefined) {
    throw new Error('useSettingsPanel must be used within a SettingsPanelProvider')
  }
  return context
}