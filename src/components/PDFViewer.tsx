import { useState, useEffect } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import { useThemeStore } from '@/stores/themeStore'
import { cn } from '@/lib/utils'

export function PDFViewer() {
  const { pdfPath, pdfUpdateTime } = useEditorStore()
  const { glassEffectEnabled, theme } = useThemeStore()
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (!pdfPath) {
      setPdfDataUrl(null)
      setError(null)
      return
    }

    const loadPdf = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log('Loading PDF:', pdfPath, 'Update time:', pdfUpdateTime)
        const base64Data = await window.electron.pdfRead(pdfPath)
        // Add timestamp to force refresh
        const dataUrl = `data:application/pdf;base64,${base64Data}#${pdfUpdateTime}`
        setPdfDataUrl(dataUrl)
        console.log('PDF loaded successfully')
      } catch (err) {
        console.error('Error loading PDF:', err)
        setError('Failed to load PDF. Make sure the file exists and compilation was successful.')
        setPdfDataUrl(null)
      } finally {
        setLoading(false)
      }
    }

    loadPdf()
  }, [pdfPath, pdfUpdateTime])
  
  const glassClasses = glassEffectEnabled && theme.glass.enabled
    ? "backdrop-blur-glass bg-opacity-glass"
    : ""
  
  if (!pdfPath) {
    return (
      <div className={cn("flex items-center justify-center h-full bg-bg-primary text-text-secondary", glassClasses)}>
        <div className="text-center">
          <p className="text-lg">No PDF compiled yet</p>
          <p className="text-sm mt-2">Save and compile to see preview</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center h-full bg-bg-primary text-text-secondary", glassClasses)}>
        <div className="text-center">
          <p className="text-lg">Loading PDF...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center h-full bg-bg-primary text-text-secondary", glassClasses)}>
        <div className="text-center">
          <p className="text-lg text-accent-error">Error loading PDF</p>
          <p className="text-sm mt-2">{error}</p>
          <p className="text-xs mt-2 text-text-tertiary">Path: {pdfPath}</p>
        </div>
      </div>
    )
  }

  if (!pdfDataUrl) {
    return (
      <div className={cn("flex items-center justify-center h-full bg-bg-primary text-text-secondary", glassClasses)}>
        <div className="text-center">
          <p className="text-lg">No PDF data</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full bg-bg-primary">
      <iframe
        key={pdfUpdateTime} // Force re-render when PDF updates
        src={pdfDataUrl}
        className="w-full h-full border-0"
        title="PDF Preview"
      />
    </div>
  )
}