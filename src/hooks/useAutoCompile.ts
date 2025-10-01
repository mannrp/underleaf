import { useEffect, useRef } from 'react'
import { useEditorStore } from '@/stores/editorStore'

export function useAutoCompile(delay: number = 2000) {
  const { 
    content, 
    filePath, 
    autoCompileEnabled, 
    setIsCompiling, 
    setPdfPath, 
    setCompilationResult,
    updatePdfTime
  } = useEditorStore()
  
  const timeoutRef = useRef<NodeJS.Timeout>()
  
  useEffect(() => {
    if (!autoCompileEnabled || !filePath) return
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Set new timeout for auto-compile
    timeoutRef.current = setTimeout(async () => {
      try {
        console.log('Auto-compile starting for:', filePath)
        setIsCompiling(true)
        
        // Save file first
        await window.electron.fileSave(filePath, content)
        console.log('File saved, starting compilation...')
        
        // Compile
        const result = await window.electron.latexCompile(filePath)
        console.log('Compilation result:', result)
        
        setCompilationResult(result)
        
        if (result.success && result.pdfPath) {
          setPdfPath(result.pdfPath)
          updatePdfTime() // Force PDF refresh
          console.log('PDF updated, timestamp:', Date.now())
        }
      } catch (error) {
        console.error('Auto-compile failed:', error)
        setCompilationResult({
          success: false,
          pdfPath: null,
          output: `Error: ${error}`,
          logs: ''
        })
      } finally {
        setIsCompiling(false)
      }
    }, delay)
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [content, filePath, autoCompileEnabled, delay])
}