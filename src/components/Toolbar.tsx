import { FolderOpen, Save, Play, Zap, ZapOff } from 'lucide-react'
import { useEditorStore } from '@/stores/editorStore'

export function Toolbar() {
  const { 
    filePath, 
    content, 
    isCompiling, 
    autoCompileEnabled,
    setContent, 
    setFilePath, 
    setPdfPath, 
    setIsCompiling, 
    setCompilationResult,
    setAutoCompileEnabled,
    updatePdfTime
  } = useEditorStore()
  
  const handleOpen = async () => {
    const result = await window.electron.fileOpen()
    if (result) {
      setContent(result.content)
      setFilePath(result.path)
    }
  }
  
  const handleSave = async () => {
    if (filePath) {
      await window.electron.fileSave(filePath, content)
    } else {
      const newPath = await window.electron.fileSaveAs(content)
      if (newPath) setFilePath(newPath)
    }
  }
  
  const handleCompile = async () => {
    if (!filePath) {
      alert('Please save the file first')
      return
    }
    
    setIsCompiling(true)
    try {
      // Save the file first
      await window.electron.fileSave(filePath, content)
      
      const result = await window.electron.latexCompile(filePath)
      setCompilationResult(result)
      
      if (result.success && result.pdfPath) {
        setPdfPath(result.pdfPath)
        updatePdfTime() // Force PDF refresh
        console.log('Compilation successful:', result.pdfPath)
      } else {
        console.error('Compilation failed:', result.output)
        console.error('Logs:', result.logs)
        alert(`Compilation failed. Check console for details.\n\nError: ${result.output.slice(0, 200)}...`)
      }
    } catch (error) {
      console.error('Compilation error:', error)
      alert('Compilation error: ' + error)
    } finally {
      setIsCompiling(false)
    }
  }
  
  return (
    <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-2">
      <button onClick={handleOpen} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2 text-white">
        <FolderOpen size={16} />
        Open
      </button>
      <button onClick={handleSave} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2 text-white">
        <Save size={16} />
        Save
      </button>
      <div className="w-px h-6 bg-gray-700 mx-2" />
      <button 
        onClick={handleCompile} 
        disabled={isCompiling}
        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded flex items-center gap-2 text-white"
      >
        <Play size={16} />
        {isCompiling ? 'Compiling...' : 'Compile'}
      </button>
      <div className="w-px h-6 bg-gray-700 mx-2" />
      <button 
        onClick={() => setAutoCompileEnabled(!autoCompileEnabled)}
        className={`px-3 py-1.5 rounded flex items-center gap-2 text-white ${
          autoCompileEnabled 
            ? 'bg-green-600 hover:bg-green-500' 
            : 'bg-gray-700 hover:bg-gray-600'
        }`}
        title={autoCompileEnabled ? 'Disable auto-compile' : 'Enable auto-compile'}
      >
        {autoCompileEnabled ? <Zap size={16} /> : <ZapOff size={16} />}
        Auto
      </button>
      <div className="flex-1" />
      <span className="text-sm text-gray-400">
        {filePath ? filePath : 'Untitled'}
      </span>
    </div>
  )
}