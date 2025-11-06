import { useState, lazy, Suspense } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Toolbar } from '@/components/Toolbar'
import { LatexEditor } from '@/components/Editor'
import { PDFViewer } from '@/components/PDFViewer'
import { StatusBar } from '@/components/StatusBar'
import { ToastContainer } from '@/components/ui/toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAutoCompile } from '@/hooks/useAutoCompile'
import { Loader2 } from 'lucide-react'

// Lazy load AI features
const OCRPanel = lazy(() => import('@/components/OCRPanel').then(m => ({ default: m.OCRPanel })))

export default function App() {
  // Enable auto-compile with 2 second delay
  useAutoCompile(2000)
  
  const [showSidebar, setShowSidebar] = useState(false)
  
  return (
    <div className="h-screen flex flex-col bg-bg-primary text-text-primary">
      <Toolbar onToggleSidebar={() => setShowSidebar(!showSidebar)} />
      
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={50} minSize={30}>
          <LatexEditor />
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
                <Tabs defaultValue="ocr" className="h-full flex flex-col">
                  <TabsList className="w-full justify-start border-b border-border bg-bg-secondary">
                    <TabsTrigger value="ocr">OCR</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ocr" className="flex-1 overflow-hidden">
                    <Suspense
                      fallback={
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="animate-spin text-accent-primary" size={32} />
                        </div>
                      }
                    >
                      <OCRPanel />
                    </Suspense>
                  </TabsContent>
                </Tabs>
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