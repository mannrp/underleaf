import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSettingsStore, type LLMProvider } from '@/stores/settingsStore'
import { useThemeStore, type ThemeName } from '@/stores/themeStore'
import { CheckCircle2, XCircle } from 'lucide-react'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const {
    llmProvider,
    llmApiKey,
    llmModel,
    llmBaseUrl,
    editorFontSize,
    autoCompileDelay,
    setLlmProvider,
    setLlmApiKey,
    setLlmModel,
    setLlmBaseUrl,
    setEditorFontSize,
    setAutoCompileDelay,
    resetToDefaults,
  } = useSettingsStore()

  const { currentTheme, setTheme, glassEffectEnabled, toggleGlassEffect } = useThemeStore()

  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleTestConnection = async () => {
    setTestingConnection(true)
    setConnectionStatus('idle')

    try {
      // Simulate connection test (in real implementation, this would call the LLM API)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For now, just check if API key is provided
      if (llmProvider === 'ollama') {
        setConnectionStatus('success')
      } else if (llmApiKey.trim()) {
        setConnectionStatus('success')
      } else {
        setConnectionStatus('error')
      }
    } catch (error) {
      setConnectionStatus('error')
    } finally {
      setTestingConnection(false)
    }
  }

  const getDefaultModel = (provider: LLMProvider): string => {
    switch (provider) {
      case 'gemini':
        return 'gemini-pro'
      case 'openai':
        return 'gpt-4'
      case 'anthropic':
        return 'claude-3-sonnet-20240229'
      case 'ollama':
        return 'llama2'
      default:
        return ''
    }
  }

  const handleProviderChange = (provider: LLMProvider) => {
    setLlmProvider(provider)
    setLlmModel(getDefaultModel(provider))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="lg">
      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">Appearance</h3>

          <div className="space-y-2">
            <label className="text-sm text-text-secondary">Theme</label>
            <Select value={currentTheme} onValueChange={(value) => setTheme(value as ThemeName)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="glassy">Glassy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-text-secondary">Glass Effect</label>
            <Button
              variant={glassEffectEnabled ? 'primary' : 'secondary'}
              size="sm"
              onClick={toggleGlassEffect}
            >
              {glassEffectEnabled ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </div>

        {/* LLM Configuration */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-text-primary">AI Provider</h3>

          <div className="space-y-2">
            <label className="text-sm text-text-secondary">Provider</label>
            <Select value={llmProvider} onValueChange={handleProviderChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Google Gemini</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                <SelectItem value="ollama">Ollama (Local)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {llmProvider !== 'ollama' && (
            <div className="space-y-2">
              <label className="text-sm text-text-secondary">API Key</label>
              <Input
                type="password"
                value={llmApiKey}
                onChange={(e) => setLlmApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-text-secondary">Model</label>
            <Input
              value={llmModel}
              onChange={(e) => setLlmModel(e.target.value)}
              placeholder="Model name"
            />
          </div>

          {llmProvider === 'ollama' && (
            <div className="space-y-2">
              <label className="text-sm text-text-secondary">Base URL</label>
              <Input
                value={llmBaseUrl}
                onChange={(e) => setLlmBaseUrl(e.target.value)}
                placeholder="http://localhost:11434"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              onClick={handleTestConnection}
              disabled={testingConnection}
              loading={testingConnection}
              size="sm"
            >
              Test Connection
            </Button>
            {connectionStatus === 'success' && (
              <div className="flex items-center gap-1 text-accent-success text-sm">
                <CheckCircle2 size={16} />
                <span>Connected</span>
              </div>
            )}
            {connectionStatus === 'error' && (
              <div className="flex items-center gap-1 text-accent-error text-sm">
                <XCircle size={16} />
                <span>Failed</span>
              </div>
            )}
          </div>
        </div>

        {/* Editor Preferences */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-text-primary">Editor</h3>

          <div className="space-y-2">
            <label className="text-sm text-text-secondary">
              Font Size: {editorFontSize}px
            </label>
            <input
              type="range"
              min="10"
              max="24"
              value={editorFontSize}
              onChange={(e) => setEditorFontSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-text-secondary">
              Auto-compile Delay: {autoCompileDelay / 1000}s
            </label>
            <input
              type="range"
              min="1000"
              max="5000"
              step="500"
              value={autoCompileDelay}
              onChange={(e) => setAutoCompileDelay(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button variant="danger" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  )
}
