import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Toolbar } from '@/components/Toolbar'
import { LatexEditor } from '@/components/Editor'
import { PDFViewer } from '@/components/PDFViewer'
import { StatusBar } from '@/components/StatusBar'
import { SettingsPanel } from '@/components/SettingsPanel'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { useAutoCompile } from '@/hooks/useAutoCompile'
import { useSettingsPanel } from '@/hooks/useSettingsPanel'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useThemeClasses } from '@/hooks/useTheme'
// Import test utility for debugging
import '@/utils/environmentTest'

function AppContent() {
  // Enable auto-compile with 2 second delay
  useAutoCompile(2000)
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts()
  
  const { isOpen, closeSettings } = useSettingsPanel()
  const themeClasses = useThemeClasses()
  
  return (
    <div className={`h-screen flex flex-col ${themeClasses.bg} ${themeClasses.text}`}>
      <Toolbar />
      
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={50} minSize={30}>
          <LatexEditor />
        </Panel>
        
        <PanelResizeHandle className={`w-1 ${themeClasses.border} hover:bg-[var(--color-primary)] transition-colors`} />
        
        <Panel defaultSize={50} minSize={30}>
          <PDFViewer />
        </Panel>
      </PanelGroup>
      
      <StatusBar />
      
      {/* Settings Panel Modal */}
      <SettingsPanel isOpen={isOpen} onClose={closeSettings} />
    </div>
  )
}

export default function App() {
  const { appearance } = useSettingsStore()

  return (
    <ThemeProvider defaultTheme={appearance.theme}>
      <AppContent />
    </ThemeProvider>
  )
}