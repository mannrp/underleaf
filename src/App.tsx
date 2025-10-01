import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Toolbar } from '@/components/Toolbar'
import { LatexEditor } from '@/components/Editor'
import { PDFViewer } from '@/components/PDFViewer'
import { StatusBar } from '@/components/StatusBar'
import { useAutoCompile } from '@/hooks/useAutoCompile'

export default function App() {
  // Enable auto-compile with 2 second delay
  useAutoCompile(2000)
  
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <Toolbar />
      
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={50} minSize={30}>
          <LatexEditor />
        </Panel>
        
        <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-blue-500 transition-colors" />
        
        <Panel defaultSize={50} minSize={30}>
          <PDFViewer />
        </Panel>
      </PanelGroup>
      
      <StatusBar />
    </div>
  )
}