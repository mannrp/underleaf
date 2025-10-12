import { useState, useEffect } from 'react'
import { 
  Palette, 
  FileText, 
  FileImage, 
  FolderOpen,
  ChevronRight
} from 'lucide-react'

export type SettingsTab = 'appearance' | 'editor' | 'pdf' | 'files'

interface SettingsTabsProps {
  activeTab: SettingsTab
  onTabChange: (tab: SettingsTab) => void
}

interface TabConfig {
  id: SettingsTab
  label: string
  icon: React.ComponentType<any>
  color: string
  hoverColor: string
  description: string
}

const tabs: TabConfig[] = [
  {
    id: 'appearance',
    label: 'Appearance',
    icon: Palette,
    color: 'bg-blue-500',
    hoverColor: 'hover:from-blue-600/20 hover:to-purple-600/20',
    description: 'Themes and visual preferences'
  },
  {
    id: 'editor',
    label: 'Editor',
    icon: FileText,
    color: 'bg-green-500',
    hoverColor: 'hover:from-green-600/20 hover:to-blue-600/20',
    description: 'Code editing preferences'
  },
  {
    id: 'pdf',
    label: 'PDF Viewer',
    icon: FileImage,
    color: 'bg-purple-500',
    hoverColor: 'hover:from-purple-600/20 hover:to-pink-600/20',
    description: 'PDF display settings'
  },
  {
    id: 'files',
    label: 'Files',
    icon: FolderOpen,
    color: 'bg-orange-500',
    hoverColor: 'hover:from-orange-600/20 hover:to-red-600/20',
    description: 'File management options'
  }
]

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (focusedIndex === -1) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setFocusedIndex((prev) => (prev + 1) % tabs.length)
          break
        case 'ArrowUp':
          event.preventDefault()
          setFocusedIndex((prev) => (prev - 1 + tabs.length) % tabs.length)
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          onTabChange(tabs[focusedIndex].id)
          break
        case 'Escape':
          setFocusedIndex(-1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [focusedIndex, onTabChange])

  return (
    <div className="w-72 flex-shrink-0 bg-gradient-to-b from-gray-800/50 to-gray-900/50 border-r border-gray-600 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      <div className="p-6">
        <nav className="space-y-3" role="tablist" aria-label="Settings categories">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">
          Categories
        </div>
        
        {tabs.map((tab, index) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const isFocused = focusedIndex === index
          
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              tabIndex={isFocused ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
              className={`
                w-full text-left px-4 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden
                ${isActive 
                  ? `bg-gradient-to-r ${tab.hoverColor.replace('hover:', '')} text-white shadow-lg scale-105 border border-white/10` 
                  : `text-gray-300 hover:text-white hover:bg-gradient-to-r ${tab.hoverColor} hover:scale-105 hover:shadow-lg`
                }
                ${isFocused ? 'ring-2 ring-blue-500/50 ring-offset-2 ring-offset-gray-900' : ''}
              `}
            >
              {/* Background glow effect for active tab */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl" />
              )}
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                    ${isActive ? 'bg-white/20 shadow-lg' : 'bg-gray-700/50 group-hover:bg-white/10'}
                  `}>
                    <Icon 
                      size={16} 
                      className={`transition-all duration-300 ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                      }`} 
                    />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{tab.label}</div>
                    <div className={`text-xs transition-colors duration-300 ${
                      isActive ? 'text-gray-200' : 'text-gray-500 group-hover:text-gray-300'
                    }`}>
                      {tab.description}
                    </div>
                  </div>
                </div>
                
                <ChevronRight 
                  size={16} 
                  className={`transition-all duration-300 ${
                    isActive 
                      ? 'text-white transform rotate-90' 
                      : 'text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1'
                  }`}
                />
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full shadow-lg" />
              )}
            </button>
          )
        })}
      </nav>
      
      {/* Quick actions section */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Quick Actions
        </div>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-700/30 rounded-lg transition-all duration-200">
            Reset to Defaults
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-700/30 rounded-lg transition-all duration-200">
            Export Settings
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-700/30 rounded-lg transition-all duration-200">
            Import Settings
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}