import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Button } from './ui/button'
import { useAIStore } from '@/stores/aiStore'
import { useEditorStore } from '@/stores/editorStore'
import { ErrorAnalysisResult } from '@/services/errorAnalyzer'

interface ErrorPanelProps {
  errorLog: string | null
  onClose: () => void
}

export function ErrorPanel({ errorLog, onClose }: ErrorPanelProps) {
  const { errorAnalysis, analyzeError, isAnalyzingErrors } = useAIStore()
  const { content, setContent } = useEditorStore()
  const [analyzing, setAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!errorLog) return
    setAnalyzing(true)
    try {
      await analyzeError(errorLog, content)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleApplyFix = (fix: ErrorAnalysisResult) => {
    if (!fix.fix || !fix.line) return
    
    const lines = content.split('\n')
    const targetLine = fix.line - 1
    
    if (targetLine >= 0 && targetLine < lines.length) {
      lines[targetLine] = fix.fix
      setContent(lines.join('\n'))
    }
  }

  if (!errorLog) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="p-4 bg-[var(--color-accent-error)]/10 border-l-4 border-[var(--color-accent-error)]"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="text-[var(--color-accent-error)]" size={20} />
          <h3 className="font-semibold text-[var(--color-accent-error)]">
            Compilation Errors
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <XCircle size={20} />
        </button>
      </div>

      {!errorAnalysis && (
        <div className="space-y-2">
          <p className="text-sm text-[var(--color-text-secondary)]">
            LaTeX compilation failed. Use AI to analyze and suggest fixes.
          </p>
          <Button
            onClick={handleAnalyze}
            disabled={analyzing || isAnalyzingErrors}
            variant="primary"
            size="sm"
          >
            {analyzing ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Analyzing...
              </>
            ) : (
              'Analyze with AI'
            )}
          </Button>
        </div>
      )}

      <AnimatePresence>
        {errorAnalysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {errorAnalysis.errors.map((error, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)]"
              >
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle
                    className="text-[var(--color-accent-error)] flex-shrink-0 mt-0.5"
                    size={16}
                  />
                  <div className="flex-1">
                    <div className="font-mono text-sm text-[var(--color-accent-error)]">
                      {error.line && `Line ${error.line}: `}
                      {error.message}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                  {error.explanation}
                </p>

                {error.fix ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-accent-success)]">
                      <CheckCircle size={16} />
                      <span>Fix available</span>
                    </div>
                    <pre className="bg-[var(--color-bg-tertiary)] p-2 text-xs overflow-x-auto border border-[var(--color-border)] font-mono">
                      {error.fix}
                    </pre>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleApplyFix(error)}
                    >
                      Apply Fix
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)]">
                    <XCircle size={16} />
                    <span>No automatic fix available</span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
