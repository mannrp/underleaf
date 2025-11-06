import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAIStore } from '@/stores/aiStore'
import { useEditorStore } from '@/stores/editorStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { getOCRService } from '@/services/ocrService'
import { LLMService } from '@/services/llmService'
import { toast } from '@/components/ui/toast'
import { getUserFriendlyMessage } from '@/utils/errorHandler'

export function OCRPanel() {
  const { isProcessingOCR, ocrResult, setProcessingOCR, setOCRResult } = useAIStore()
  const { content, setContent } = useEditorStore()
  const { llmProvider, llmApiKey, llmModel, llmBaseUrl } = useSettingsStore()
  
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'ocr' | 'llm' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    setImagePreview(URL.createObjectURL(file))
    setProcessingOCR(true)
    setStatus('ocr')
    setProgress(0)
    setOCRResult(null)

    try {
      // Step 1: OCR extraction
      const ocrService = getOCRService()
      const extractedText = await ocrService.extractText(file, (p) => {
        setProgress(p * 50) // OCR is first 50%
      })

      if (!extractedText.trim()) {
        throw new Error('No text detected in image')
      }

      // Step 2: LLM conversion
      setStatus('llm')
      setProgress(50)

      const llmService = new LLMService(llmProvider, llmApiKey, llmModel, llmBaseUrl)
      const latexCode = await llmService.convertToLatex(extractedText)

      setProgress(100)
      setOCRResult(latexCode)
      setStatus('success')
      toast.success('Image converted to LaTeX successfully!')
    } catch (error) {
      console.error('OCR processing failed:', error)
      setStatus('error')
      toast.error(getUserFriendlyMessage(error))
    } finally {
      setProcessingOCR(false)
    }
  }

  const handleInsertLatex = () => {
    if (ocrResult) {
      const newContent = content + '\n\n' + ocrResult
      setContent(newContent)
      toast.success('LaTeX code inserted into editor')
    }
  }

  const handleReset = () => {
    setImagePreview(null)
    setOCRResult(null)
    setStatus('idle')
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-text-primary">OCR to LaTeX</h3>
        <p className="text-sm text-text-secondary">
          Upload an image with mathematical content to convert it to LaTeX code
        </p>
      </div>

      {/* Upload Area */}
      {!imagePreview && (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border hover:border-accent-primary transition-colors cursor-pointer bg-bg-secondary">
          <Upload size={48} className="text-text-tertiary mb-2" />
          <span className="text-sm text-text-secondary">Click to upload image</span>
          <span className="text-xs text-text-tertiary mt-1">PNG, JPG, or JPEG</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      )}

      {/* Image Preview */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-3"
          >
            <img
              src={imagePreview}
              alt="Uploaded"
              className="max-w-full border border-border rounded"
            />

            {/* Processing Status */}
            {isProcessingOCR && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-accent-primary">
                  <Loader2 className="animate-spin" size={20} />
                  <span className="text-sm">
                    {status === 'ocr' && 'Extracting text with Tesseract...'}
                    {status === 'llm' && 'Converting to LaTeX with AI...'}
                  </span>
                </div>
                <div className="w-full bg-bg-tertiary h-2 rounded overflow-hidden">
                  <motion.div
                    className="h-full bg-accent-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Success Status */}
            {status === 'success' && (
              <div className="flex items-center gap-2 text-accent-success">
                <CheckCircle2 size={20} />
                <span className="text-sm">Conversion successful!</span>
              </div>
            )}

            {/* Error Status */}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-accent-error">
                <XCircle size={20} />
                <span className="text-sm">Conversion failed</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LaTeX Result */}
      <AnimatePresence>
        {ocrResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-3"
          >
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-text-primary">Generated LaTeX:</h4>
              <pre className="bg-bg-tertiary p-3 text-sm overflow-x-auto border border-border rounded text-text-primary font-mono">
                {ocrResult}
              </pre>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleInsertLatex} variant="primary">
                Insert into Editor
              </Button>
              <Button onClick={handleReset} variant="secondary">
                Upload Another
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
