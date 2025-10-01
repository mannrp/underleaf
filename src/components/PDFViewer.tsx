import { useState, useEffect } from 'react'
import { useEditorStore } from '@/stores/editorStore'

export function PDFViewer() {
  const { pdfPath } = useEditorStore()
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
        const base64Data = await window.electron.pdfRead(pdfPath)
        const dataUrl = `data:application/pdf;base64,${base64Data}`
        setPdfDataUrl(dataUrl)
      } catch (err) {
        console.error('Error loading PDF:', err)
        setError('Failed to load PDF. Make sure the file exists and compilation was successful.')
        setPdfDataUrl(null)
      } finally {
        setLoading(false)
      }
    }

    loadPdf()
  }, [pdfPath])
  
  if (!pdfPath) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
        <div className="text-center">
          <p className="text-lg">No PDF compiled yet</p>
          <p className="text-sm mt-2">Save and compile to see preview</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
        <div className="text-center">
          <p className="text-lg">Loading PDF...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
        <div className="text-center">
          <p className="text-lg text-red-400">Error loading PDF</p>
          <p className="text-sm mt-2">{error}</p>
          <p className="text-xs mt-2 text-gray-500">Path: {pdfPath}</p>
        </div>
      </div>
    )
  }

  if (!pdfDataUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
        <div className="text-center">
          <p className="text-lg">No PDF data</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full bg-gray-900">
      <iframe
        src={pdfDataUrl}
        className="w-full h-full border-0"
        title="PDF Preview"
      />
    </div>
  )
}