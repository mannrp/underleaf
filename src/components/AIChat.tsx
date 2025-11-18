import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Check, X } from 'lucide-react'
import { Button } from './ui/button'
import { useAIStore } from '@/stores/aiStore'
import { useEditorStore } from '@/stores/editorStore'
import { DocumentAgent, EditResponse } from '@/services/documentAgent'

export function AIChat() {
  const { chatHistory, addChatMessage, isChatProcessing, setChatProcessing } = useAIStore()
  const { content, setContent } = useEditorStore()
  const [input, setInput] = useState('')
  const [pendingChanges, setPendingChanges] = useState<EditResponse | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory, pendingChanges])

  const handleSend = async () => {
    if (!input.trim() || isChatProcessing) return

    const userMessage = input.trim()
    setInput('')

    // Add user message to history
    addChatMessage({
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    })

    setChatProcessing(true)

    try {
      const { useSettingsStore } = await import('@/stores/settingsStore')
      const { LLMService } = await import('@/services/llmService')
      const { DocumentAgent } = await import('@/services/documentAgent')

      const settings = useSettingsStore.getState()
      const llmService = new LLMService(
        settings.llmProvider,
        settings.llmApiKey,
        settings.llmModel,
        settings.llmBaseUrl
      )

      const agent = new DocumentAgent(llmService)

      const response = await agent.processEditRequest(userMessage, content, chatHistory)

      // Add assistant response
      addChatMessage({
        role: 'assistant',
        content: response.explanation,
        timestamp: Date.now(),
      })

      // Set pending changes for user review
      if (response.changes.length > 0) {
        setPendingChanges(response)
      }
    } catch (error) {
      console.error('Chat error:', error)
      
      // Extract detailed error message
      let errorMessage = 'Sorry, I encountered an error processing your request.'
      if (error instanceof Error) {
        errorMessage += `\n\nError: ${error.message}`
        if (error.stack) {
          console.error('Stack trace:', error.stack)
        }
      } else {
        errorMessage += `\n\nError: ${String(error)}`
      }
      
      addChatMessage({
        role: 'assistant',
        content: errorMessage,
        timestamp: Date.now(),
      })
    } finally {
      setChatProcessing(false)
    }
  }

  const handleApplyChanges = () => {
    if (!pendingChanges) return

    try {
      console.log('Applying changes:', pendingChanges.changes)
      console.log('Current content length:', content.length)
      
      const agent = new DocumentAgent(null as any)
      const newContent = agent.applyChanges(content, pendingChanges.changes)
      
      console.log('New content length:', newContent.length)
      console.log('Setting new content...')
      
      setContent(newContent)
      setPendingChanges(null)
      
      addChatMessage({
        role: 'assistant',
        content: 'Changes applied successfully!',
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Error applying changes:', error)
      addChatMessage({
        role: 'assistant',
        content: `Failed to apply changes: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: Date.now(),
      })
    }
  }

  const handleRejectChanges = () => {
    setPendingChanges(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-full flex flex-col bg-bg-secondary">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">AI Document Editor</h3>
        <p className="text-sm text-text-secondary">
          Describe changes you want to make
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 ${
                msg.role === 'user'
                  ? 'bg-accent-primary text-white'
                  : 'bg-bg-tertiary text-text-primary border border-border'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
        ))}

        {isChatProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-bg-tertiary p-3 border border-border flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-sm">Thinking...</span>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {pendingChanges && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 bg-accent-warning/10 border border-accent-warning"
            >
              <p className="font-semibold mb-2">Suggested Changes:</p>
              <p className="text-sm mb-3">{pendingChanges.explanation}</p>
              <div className="text-xs text-text-secondary mb-3">
                {pendingChanges.changes.length} change(s) to apply
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleApplyChanges}
                  variant="primary"
                  size="sm"
                  icon={<Check size={16} />}
                >
                  Apply Changes
                </Button>
                <Button
                  onClick={handleRejectChanges}
                  variant="secondary"
                  size="sm"
                  icon={<X size={16} />}
                >
                  Reject
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe changes to make..."
            className="flex-1 px-3 py-2 bg-bg-tertiary border border-border text-text-primary placeholder-text-tertiary resize-none"
            rows={2}
            disabled={isChatProcessing}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isChatProcessing}
            variant="primary"
            icon={isChatProcessing ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
