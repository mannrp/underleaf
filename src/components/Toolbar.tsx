import { useState } from 'react'
import { FolderOpen, Save, Play, Zap, ZapOff, Settings as SettingsIcon, PanelRightOpen } from 'lucide-react'
import { useEditorStore } from '@/stores/editorStore'
import { useThemeStore } from '@/stores/themeStore'
import { Button } from '@/components/ui/button'
import { Settings } from '@/components/Settings'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

interface ToolbarProps {
  onToggleSidebar?: () => void
}

export function Toolbar({ onToggleSidebar }: ToolbarProps) {
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
  
  const { glassEffectEnabled, theme } = useThemeStore()
  const [settingsOpen, setSettingsOpen] = useState(false)
  
  const isElectron = typeof window !== 'undefined' && window.electron
  
  const handleOpen = async () => {
    if (!isElectron) {
      toast.warning('File operations are only available in the desktop app')
      return
    }
    const result = await window.electron.fileOpen()
    if (result) {
      setContent(result.content)
      setFilePath(result.path)
      toast.success('File opened successfully')
    }
  }
  
  const handleSave = async () => {
    if (!isElectron) {
      toast.warning('File operations are only available in the desktop app')
      return
    }
    try {
      if (filePath) {
        await window.electron.fileSave(filePath, content)
        toast.success('File saved successfully')
      } else {
        const newPath = await window.electron.fileSaveAs(content)
        if (newPath) {
          setFilePath(newPath)
          toast.success('File saved successfully')
        }
      }
    } catch (error) {
      toast.error('Failed to save file')
    }
  }
  
  const handleCompile = async () => {
    if (!isElectron) {
      toast.warning('LaTeX compilation is only available in the desktop app')
      return
    }
    if (!filePath) {
      toast.warning('Please save the file first')
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
        toast.success('Compilation successful!')
      } else {
        console.error('Compilation failed:', result.output)
        console.error('Logs:', result.logs)
        toast.error('Compilation failed. Check console for details.')
      }
    } catch (error) {
      console.error('Compilation error:', error)
      toast.error('Compilation error: ' + error)
    } finally {
      setIsCompiling(false)
    }
  }
  
  const glassClasses = glassEffectEnabled && theme.glass.enabled
    ? "backdrop-blur-glass bg-opacity-glass"
    : ""
  
  return (
    <div className={cn(
      "h-12 bg-bg-secondary border-b border-border flex items-center px-4 gap-2",
      glassClasses
    )}>
      <Button onClick={handleOpen} variant="secondary" size="sm" icon={<FolderOpen size={16} />}>
        Open
      </Button>
      <Button onClick={handleSave} variant="secondary" size="sm" icon={<Save size={16} />}>
        Save
      </Button>
      <div className="w-px h-6 bg-border mx-2" />
      <Button 
        onClick={handleCompile} 
        disabled={isCompiling}
        loading={isCompiling}
        variant="primary"
        size="sm"
        icon={<Play size={16} />}
      >
        {isCompiling ? 'Compiling...' : 'Compile'}
      </Button>
      <div className="w-px h-6 bg-border mx-2" />
      <Button 
        onClick={() => setAutoCompileEnabled(!autoCompileEnabled)}
        variant={autoCompileEnabled ? "primary" : "secondary"}
        size="sm"
        icon={autoCompileEnabled ? <Zap size={16} /> : <ZapOff size={16} />}
        title={autoCompileEnabled ? 'Disable auto-compile' : 'Enable auto-compile'}
        className={autoCompileEnabled ? "bg-accent-success hover:brightness-110" : ""}
      >
        Auto
      </Button>
      <div className="flex-1" />
      <span className="text-sm text-text-secondary">
        {filePath ? filePath : 'Untitled'}
      </span>
      <div className="w-px h-6 bg-border mx-2" />
      <Button
        onClick={onToggleSidebar}
        variant="ghost"
        size="icon"
        icon={<PanelRightOpen size={18} />}
        title="Toggle AI Panel"
      />
      <Button
        onClick={() => setSettingsOpen(true)}
        variant="ghost"
        size="icon"
        icon={<SettingsIcon size={18} />}
        title="Settings"
      />
      <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}