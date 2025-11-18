import { useState, lazy, Suspense } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Toolbar } from '@/components/Toolbar'
import { LatexEditor } from '@/components/Editor'
import { PDFViewer } from '@/components/PDFViewer'
import { StatusBar } from '@/components/StatusBar'
import { ToastContainer } from '@/components/ui/toast'
import { useAutoCompile } from '@/hooks/useAutoCompile'
import { useEditorStore } from '@/stores/editorStore'
import { Loader2 } from 'lucide-react'

// Lazy load AI features
const ErrorPanel = lazy(() => import('@/components/ErrorPanel').then(m => ({ default: m.ErrorPanel })))
const AIChat = lazy(() => import('@/components/AIChat').then(m => ({ default: m.AIChat })))

export default function App() {
  // Enable auto-compile with 2 second delay
  useAutoCompile(2000)
  
  const [showSidebar, setShowSidebar] = useState(false)
  const { compilationResult } = useEditorStore()
  
  // Show error panel when compilation fails
  const hasErrors = compilationResult && !compilationResult.success
  
  return (
    <div className="h-screen flex flex-col bg-bg-primary text-text-primary">
      <Toolbar onToggleSidebar={() => setShowSidebar(!showSidebar)} />
      
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <LatexEditor />
            </div>
            {hasErrors && (
              <Suspense fallback={null}>
                <ErrorPanel
                  errorLog={compilationResult.logs || null}
                  onClose={() => {}}
                />
              </Suspense>
            )}
          </div>
        </Panel>
        
        <PanelResizeHandle className="w-1 bg-border hover:bg-accent-primary transition-colors" />
        
        <Panel defaultSize={50} minSize={30}>
          <PDFViewer />
        </Panel>
        
        {showSidebar && (
          <>
            <PanelResizeHandle className="w-1 bg-border hover:bg-accent-primary transition-colors" />
            <Panel defaultSize={25} minSize={20} maxSize={40}>
              <div className="h-full bg-bg-secondary border-l border-border">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="animate-spin text-accent-primary" size={32} />
                    </div>
                  }
                >
                  <AIChat />
                </Suspense>
              </div>
            </Panel>
          </>
        )}
      </PanelGroup>
      
      <StatusBar />
      <ToastContainer />
    </div>
  )
}