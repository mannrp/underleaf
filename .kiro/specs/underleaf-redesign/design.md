# Design Document

## Overview

This design document outlines the architecture for redesigning Underleaf with a themeable component system and AI-powered features. The redesign maintains the existing Electron + React + Monaco Editor foundation while introducing:

1. **Theme System**: CSS variables + TypeScript theme tokens for consistent, switchable themes
2. **Component Library**: Rebuilt UI components with theme awareness
3. **OCR Pipeline**: Tesseract.js + LLM integration for image-to-LaTeX conversion
4. **Context Engine**: Document analysis for intelligent autocomplete
5. **AI Services**: Unified LLM client supporting multiple providers (Gemini, OpenAI, Anthropic, local)
6. **Error Analyzer**: AI-powered LaTeX error diagnosis and fixing
7. **Document Agent**: Natural language document editing interface

The architecture prioritizes lightweight implementation, code splitting, and modern React patterns.

## Architecture

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Electron Main Process                    │
│  - File I/O          - LaTeX Compilation                     │
│  - PDF Generation    - IPC Handlers                          │
└─────────────────────────────────────────────────────────────┘
                              ↕ IPC
┌─────────────────────────────────────────────────────────────┐
│                   Renderer Process (React)                   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Theme System (CSS Variables)            │   │
│  └─────────────────────────────────────────────────────┘   │
│                              ↓                               │
│  ┌──────────────┬──────────────┬──────────────────────┐   │
│  │  UI Layer    │  State Layer │   Service Layer       │   │
│  │              │              │                        │   │
│  │ Components   │  Zustand     │  AI Service Client    │   │
│  │ - Toolbar    │  Stores:     │  - LLM Provider       │   │
│  │ - Editor     │  - editor    │  - OCR Engine         │   │
│  │ - PDFViewer  │  - theme     │  - Context Analyzer   │   │
│  │ - Settings   │  - ai        │  - Error Analyzer     │   │
│  │ - AIChat     │  - settings  │                        │   │
│  └──────────────┴──────────────┴──────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```


### Technology Stack

**Core Framework:**
- Electron 32+ (main + renderer processes)
- React 18+ with TypeScript strict mode
- Vite 5+ for bundling and HMR
- Zustand for state management

**UI & Styling:**
- Tailwind CSS 3+ for utility classes
- shadcn/ui for component primitives
- CSS Variables for theme tokens
- Framer Motion for animations
- Monaco Editor for code editing
- Lucide React for icons

**AI & Processing:**
- Tesseract.js for OCR (browser-compatible)
- Fetch API for LLM communication (Gemini, OpenAI, Anthropic, Ollama)
- Web Workers for heavy processing

**Development:**
- TypeScript 5+ with strict mode
- ESLint + Prettier for code quality
- Vitest for unit testing (optional)

## Components and Interfaces

### 1. Theme System

**Design Philosophy:**
- Single source of truth for all visual tokens
- Runtime theme switching without reload
- Type-safe theme access in TypeScript
- Minimal performance overhead

**Implementation:**

```typescript
// src/theme/tokens.ts
export const themes = {
  dark: {
    colors: {
      bg: {
        primary: '#0a0a0a',
        secondary: '#141414',
        tertiary: '#1e1e1e',
      },
      text: {
        primary: '#ffffff',
        secondary: '#a3a3a3',
        tertiary: '#737373',
      },
      accent: {
        primary: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      border: '#262626',
    },
    glass: {
      enabled: false,
      blur: '12px',
      opacity: 0.7,
    },
  },
  light: {
    colors: {
      bg: {
        primary: '#ffffff',
        secondary: '#fafafa',
        tertiary: '#f5f5f5',
      },
      text: {
        primary: '#0a0a0a',
        secondary: '#525252',
        tertiary: '#737373',
      },
      accent: {
        primary: '#2563eb',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
      },
      border: '#e5e5e5',
    },
    glass: {
      enabled: false,
      blur: '12px',
      opacity: 0.8,
    },
  },
  glassy: {
    colors: {
      bg: {
        primary: 'rgba(10, 10, 10, 0.7)',
        secondary: 'rgba(20, 20, 20, 0.7)',
        tertiary: 'rgba(30, 30, 30, 0.7)',
      },
      text: {
        primary: '#ffffff',
        secondary: '#a3a3a3',
        tertiary: '#737373',
      },
      accent: {
        primary: '#60a5fa',
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
      },
      border: 'rgba(255, 255, 255, 0.1)',
    },
    glass: {
      enabled: true,
      blur: '16px',
      opacity: 0.7,
    },
  },
}

export type Theme = typeof themes.dark
export type ThemeName = keyof typeof themes
```


**Theme Provider:**

```typescript
// src/theme/ThemeProvider.tsx
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { currentTheme } = useThemeStore()
  const theme = themes[currentTheme]
  
  useEffect(() => {
    // Apply CSS variables to :root
    const root = document.documentElement
    Object.entries(theme.colors.bg).forEach(([key, value]) => {
      root.style.setProperty(`--color-bg-${key}`, value)
    })
    // ... apply all theme tokens
  }, [theme])
  
  return <>{children}</>
}
```

**Usage in Components:**

```typescript
// Using Tailwind with theme classes
<div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">

// Using theme hook
const { theme } = useThemeStore()
<div style={{ backgroundColor: theme.colors.bg.primary }}>
```

### 2. Component Library Redesign

**Core Principles:**
- All components accept theme-aware className props
- Consistent API across all components
- Accessible by default (ARIA labels, keyboard navigation)
- Minimal prop drilling via context where appropriate

**Button Component (using shadcn/ui + Framer Motion):**

```typescript
// src/components/ui/Button.tsx
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

export function Button({ 
  variant = 'secondary', 
  size = 'md', 
  loading = false,
  className,
  ...props 
}: ButtonProps) {
  const { theme } = useThemeStore()
  const glassEffect = theme.glass.enabled 
    ? `backdrop-blur-[${theme.glass.blur}] bg-opacity-${Math.round(theme.glass.opacity * 100)}`
    : ''
  
  const baseClasses = 'flex items-center gap-2 transition-all font-medium'
  const variantClasses = {
    primary: 'bg-[var(--color-accent-primary)] hover:brightness-110 text-white',
    secondary: `bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-secondary)] ${glassEffect}`,
    ghost: 'hover:bg-[var(--color-bg-tertiary)]',
    danger: 'bg-[var(--color-accent-error)] hover:brightness-110 text-white',
  }
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glassEffect,
        className
      )}
      disabled={props.disabled || loading}
      onClick={props.onClick}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      ) : props.icon}
      {props.children}
    </motion.button>
  )
}
```

**Modal Component (with Framer Motion animations):**

```typescript
// src/components/ui/Modal.tsx
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const { theme } = useThemeStore()
  const glassEffect = theme.glass.enabled 
    ? `backdrop-blur-[${theme.glass.blur}]`
    : ''
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-[var(--color-bg-secondary)] ${glassEffect} ${sizeClasses[size]} w-full mx-4 border border-[var(--color-border)]`}
          >
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-semibold">{title}</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1 hover:bg-[var(--color-bg-tertiary)]"
              >
                <X size={20} />
              </motion.button>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```


### 3. State Management Architecture

**Store Structure:**

```typescript
// src/stores/themeStore.ts
interface ThemeState {
  currentTheme: ThemeName
  setTheme: (theme: ThemeName) => void
}

// src/stores/settingsStore.ts
interface SettingsState {
  llmProvider: 'gemini' | 'openai' | 'anthropic' | 'ollama'
  llmApiKey: string
  llmModel: string
  llmBaseUrl?: string // for Ollama
  autoCompileDelay: number
  editorFontSize: number
  glassEffectEnabled: boolean
  
  setLlmProvider: (provider: SettingsState['llmProvider']) => void
  setLlmApiKey: (key: string) => void
  setGlassEffect: (enabled: boolean) => void
  // ... other setters
}

// src/stores/aiStore.ts
interface AIState {
  isProcessing: boolean
  ocrResult: string | null
  chatHistory: ChatMessage[]
  errorAnalysis: ErrorAnalysis | null
  
  processOCR: (imageFile: File) => Promise<void>
  sendChatMessage: (message: string) => Promise<void>
  analyzeError: (errorLog: string, code: string) => Promise<void>
  clearChat: () => void
}
```

**Persistence Strategy:**
- Theme preference → localStorage
- Settings (including API keys) → localStorage (encrypted)
- Editor state → Zustand (ephemeral)
- AI chat history → sessionStorage (cleared on close)

### 4. OCR Pipeline Architecture

**Flow:**
```
User uploads image → Tesseract.js (Web Worker) → Text extraction
→ LLM API call with prompt → LaTeX code → Insert at cursor
```

**Implementation:**

```typescript
// src/services/ocrService.ts
import Tesseract from 'tesseract.js'

export class OCRService {
  private worker: Tesseract.Worker | null = null
  
  async initialize() {
    this.worker = await Tesseract.createWorker('eng', 1, {
      logger: (m) => console.log(m),
    })
  }
  
  async extractText(imageFile: File): Promise<string> {
    if (!this.worker) await this.initialize()
    
    const { data: { text } } = await this.worker!.recognize(imageFile)
    return text
  }
  
  async terminate() {
    await this.worker?.terminate()
    this.worker = null
  }
}

// src/services/llmService.ts
export class LLMService {
  constructor(
    private provider: string,
    private apiKey: string,
    private model: string,
    private baseUrl?: string
  ) {}
  
  async convertToLatex(text: string): Promise<string> {
    const prompt = `Convert the following text to LaTeX code. 
    Only return the LaTeX code, no explanations:
    
    ${text}`
    
    const response = await this.callLLM(prompt)
    return this.extractLatexCode(response)
  }
  
  private async callLLM(prompt: string): Promise<string> {
    switch (this.provider) {
      case 'gemini':
        return this.callGemini(prompt)
      case 'openai':
        return this.callOpenAI(prompt)
      case 'anthropic':
        return this.callAnthropic(prompt)
      case 'local':
        return this.callLocal(prompt)
    }
  }
  
  private async callGemini(prompt: string): Promise<string> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    )
    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  }
  
  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await response.json()
    return data.choices[0].message.content
  }
  
  private async callAnthropic(prompt: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4096,
      }),
    })
    const data = await response.json()
    return data.content[0].text
  }
  
  private async callLocal(prompt: string): Promise<string> {
    // Ollama API
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: prompt,
        stream: false,
      }),
    })
    const data = await response.json()
    return data.response
  }
}
```


**OCR UI Component (with loading animations):**

```typescript
// src/components/OCRPanel.tsx
import { motion } from 'framer-motion'
import { Upload, Loader2 } from 'lucide-react'

export function OCRPanel() {
  const { processOCR, isProcessing, ocrResult } = useAIStore()
  const { setContent, content } = useEditorStore()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setImagePreview(URL.createObjectURL(file))
    await processOCR(file)
  }
  
  const insertLatex = () => {
    if (ocrResult) {
      setContent(content + '\n' + ocrResult)
    }
  }
  
  return (
    <div className="p-4 space-y-4">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-accent-primary)] transition-colors cursor-pointer">
        <Upload size={32} className="text-[var(--color-text-tertiary)]" />
        <span className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Click to upload image
        </span>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </label>
      
      <AnimatePresence>
        {imagePreview && (
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            src={imagePreview}
            className="max-w-full border border-[var(--color-border)]"
          />
        )}
        
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-[var(--color-accent-primary)]"
          >
            <Loader2 className="animate-spin" size={20} />
            <span>Processing with Tesseract & AI...</span>
          </motion.div>
        )}
        
        {ocrResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <pre className="bg-[var(--color-bg-tertiary)] p-3 text-sm overflow-x-auto border border-[var(--color-border)]">
              {ocrResult}
            </pre>
            <Button onClick={insertLatex}>Insert into Editor</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

### 5. Context-Aware Autocomplete

**Architecture:**

```typescript
// src/services/contextEngine.ts
export class ContextEngine {
  analyzeDocument(content: string, cursorPosition: number) {
    return {
      currentEnvironment: this.detectEnvironment(content, cursorPosition),
      availablePackages: this.extractPackages(content),
      customCommands: this.extractCustomCommands(content),
      recentCommands: this.getRecentCommands(content, cursorPosition),
    }
  }
  
  private detectEnvironment(content: string, cursor: number): string | null {
    const beforeCursor = content.slice(0, cursor)
    const envMatch = beforeCursor.match(/\\begin\{([^}]+)\}(?![\s\S]*\\end\{\1\})/g)
    return envMatch ? envMatch[envMatch.length - 1].match(/\{([^}]+)\}/)?.[1] || null : null
  }
  
  private extractPackages(content: string): string[] {
    const matches = content.matchAll(/\\usepackage(?:\[.*?\])?\{([^}]+)\}/g)
    return Array.from(matches, m => m[1])
  }
  
  private extractCustomCommands(content: string): CustomCommand[] {
    const matches = content.matchAll(/\\newcommand\{\\([^}]+)\}(?:\[(\d+)\])?\{([^}]+)\}/g)
    return Array.from(matches, m => ({
      name: m[1],
      paramCount: parseInt(m[2] || '0'),
      definition: m[3],
    }))
  }
  
  getSuggestions(context: DocumentContext): Suggestion[] {
    const suggestions: Suggestion[] = []
    
    // Add environment-specific commands
    if (context.currentEnvironment === 'equation') {
      suggestions.push(...MATH_COMMANDS)
    }
    
    // Add custom commands
    suggestions.push(...context.customCommands.map(cmd => ({
      label: `\\${cmd.name}`,
      kind: 'function',
      detail: cmd.definition,
      insertText: `\\${cmd.name}${cmd.paramCount > 0 ? '{$1}' : ''}`,
    })))
    
    return suggestions
  }
}
```

**Monaco Integration:**

```typescript
// src/components/Editor.tsx
import * as monaco from 'monaco-editor'

export function LatexEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()
  const contextEngine = useMemo(() => new ContextEngine(), [])
  
  const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
    
    // Register completion provider
    monaco.languages.registerCompletionItemProvider('latex', {
      provideCompletionItems: (model, position) => {
        const content = model.getValue()
        const offset = model.getOffsetAt(position)
        const context = contextEngine.analyzeDocument(content, offset)
        const suggestions = contextEngine.getSuggestions(context)
        
        return {
          suggestions: suggestions.map(s => ({
            label: s.label,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: s.insertText,
            detail: s.detail,
          })),
        }
      },
    })
  }
  
  return <Editor onMount={handleEditorMount} {...otherProps} />
}
```


### 6. AI Build Error Analyzer

**Architecture:**

```typescript
// src/services/errorAnalyzer.ts
export class ErrorAnalyzer {
  constructor(private llmService: LLMService) {}
  
  async analyzeError(errorLog: string, sourceCode: string): Promise<ErrorAnalysis> {
    const parsedErrors = this.parseLatexLog(errorLog)
    
    const analyses = await Promise.all(
      parsedErrors.map(error => this.analyzeIndividualError(error, sourceCode))
    )
    
    return {
      errors: analyses,
      canAutoFix: analyses.every(a => a.suggestedFix),
    }
  }
  
  private parseLatexLog(log: string): ParsedError[] {
    const errors: ParsedError[] = []
    const errorPattern = /^! (.+?)$/gm
    const linePattern = /l\.(\d+)/
    
    let match
    while ((match = errorPattern.exec(log)) !== null) {
      const errorMessage = match[1]
      const lineMatch = log.slice(match.index).match(linePattern)
      const lineNumber = lineMatch ? parseInt(lineMatch[1]) : null
      
      errors.push({
        message: errorMessage,
        line: lineNumber,
        context: this.extractErrorContext(log, match.index),
      })
    }
    
    return errors
  }
  
  private async analyzeIndividualError(
    error: ParsedError,
    sourceCode: string
  ): Promise<ErrorAnalysisResult> {
    const codeContext = this.getCodeContext(sourceCode, error.line)
    
    const prompt = `Analyze this LaTeX error and suggest a fix:
    
Error: ${error.message}
Line ${error.line}: ${codeContext}

Provide:
1. Explanation of the error
2. Exact code fix (if possible)
3. Line number to apply fix

Format as JSON: { "explanation": "...", "fix": "...", "line": number }`
    
    const response = await this.llmService.callLLM(prompt)
    return JSON.parse(response)
  }
  
  applyFix(sourceCode: string, fix: ErrorAnalysisResult): string {
    const lines = sourceCode.split('\n')
    if (fix.line && fix.fix) {
      lines[fix.line - 1] = fix.fix
    }
    return lines.join('\n')
  }
}
```

**UI Component:**

```typescript
// src/components/ErrorPanel.tsx
export function ErrorPanel() {
  const { compilationResult } = useEditorStore()
  const { errorAnalysis, analyzeError } = useAIStore()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const handleAnalyze = async () => {
    if (!compilationResult?.logs) return
    setIsAnalyzing(true)
    await analyzeError(compilationResult.logs, content)
    setIsAnalyzing(false)
  }
  
  const handleApplyFix = (fix: ErrorAnalysisResult) => {
    const newCode = errorAnalyzer.applyFix(content, fix)
    setContent(newCode)
  }
  
  if (!compilationResult || compilationResult.success) return null
  
  return (
    <div className="p-4 bg-[var(--color-accent-error)]/10 border-l-4 border-[var(--color-accent-error)]">
      <h3 className="font-semibold text-[var(--color-accent-error)]">Compilation Errors</h3>
      
      {!errorAnalysis && (
        <Button onClick={handleAnalyze} disabled={isAnalyzing}>
          {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
        </Button>
      )}
      
      {errorAnalysis?.errors.map((error, i) => (
        <div key={i} className="mt-4 p-3 bg-[var(--color-bg-secondary)] rounded">
          <div className="font-mono text-sm text-[var(--color-accent-error)]">
            Line {error.line}: {error.message}
          </div>
          <p className="mt-2 text-sm">{error.explanation}</p>
          {error.fix && (
            <div className="mt-2">
              <pre className="bg-[var(--color-bg-tertiary)] p-2 rounded text-xs">
                {error.fix}
              </pre>
              <Button size="sm" onClick={() => handleApplyFix(error)}>
                Apply Fix
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```


### 7. AI Document Editor Agent

**Architecture:**

```typescript
// src/services/documentAgent.ts
export class DocumentAgent {
  constructor(private llmService: LLMService) {}
  
  async processEditRequest(
    request: string,
    currentDocument: string,
    chatHistory: ChatMessage[]
  ): Promise<EditResponse> {
    const prompt = this.buildEditPrompt(request, currentDocument, chatHistory)
    const response = await this.llmService.callLLM(prompt)
    
    return this.parseEditResponse(response)
  }
  
  private buildEditPrompt(
    request: string,
    document: string,
    history: ChatMessage[]
  ): string {
    return `You are a LaTeX document editor. The user wants to make changes to their document.

Current document:
\`\`\`latex
${document}
\`\`\`

${history.length > 0 ? `Previous conversation:\n${this.formatHistory(history)}\n` : ''}

User request: ${request}

Provide your response as JSON:
{
  "explanation": "Brief explanation of changes",
  "changes": [
    {
      "type": "replace" | "insert" | "delete",
      "startLine": number,
      "endLine": number,
      "newContent": "..."
    }
  ]
}

Only suggest changes that directly address the user's request.`
  }
  
  private parseEditResponse(response: string): EditResponse {
    const json = JSON.parse(response)
    return {
      explanation: json.explanation,
      changes: json.changes,
    }
  }
  
  applyChanges(document: string, changes: Change[]): string {
    const lines = document.split('\n')
    
    // Sort changes by line number (descending) to avoid offset issues
    const sortedChanges = [...changes].sort((a, b) => b.startLine - a.startLine)
    
    for (const change of sortedChanges) {
      switch (change.type) {
        case 'replace':
          lines.splice(
            change.startLine - 1,
            change.endLine - change.startLine + 1,
            change.newContent
          )
          break
        case 'insert':
          lines.splice(change.startLine - 1, 0, change.newContent)
          break
        case 'delete':
          lines.splice(change.startLine - 1, change.endLine - change.startLine + 1)
          break
      }
    }
    
    return lines.join('\n')
  }
}
```

**Chat UI Component:**

```typescript
// src/components/AIChat.tsx
export function AIChat() {
  const { chatHistory, sendChatMessage } = useAIStore()
  const { content, setContent } = useEditorStore()
  const [input, setInput] = useState('')
  const [pendingChanges, setPendingChanges] = useState<EditResponse | null>(null)
  
  const handleSend = async () => {
    if (!input.trim()) return
    
    const response = await sendChatMessage(input)
    setPendingChanges(response)
    setInput('')
  }
  
  const handleApplyChanges = () => {
    if (!pendingChanges) return
    
    const newContent = documentAgent.applyChanges(content, pendingChanges.changes)
    setContent(newContent)
    setPendingChanges(null)
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-[var(--color-accent-primary)] text-white' 
                : 'bg-[var(--color-bg-tertiary)]'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {pendingChanges && (
          <div className="p-4 bg-[var(--color-accent-warning)]/10 border border-[var(--color-accent-warning)] rounded">
            <p className="font-semibold">Suggested Changes:</p>
            <p className="text-sm mt-2">{pendingChanges.explanation}</p>
            <div className="mt-3 space-x-2">
              <Button onClick={handleApplyChanges}>Apply Changes</Button>
              <Button variant="ghost" onClick={() => setPendingChanges(null)}>Reject</Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-[var(--color-border)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe changes to make..."
            className="flex-1 px-3 py-2 bg-[var(--color-bg-tertiary)] rounded"
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  )
}
```


### 8. Settings Panel

**Design:**

```typescript
// src/components/Settings.tsx
export function Settings({ isOpen, onClose }: SettingsProps) {
  const { currentTheme, setTheme } = useThemeStore()
  const {
    llmProvider,
    llmApiKey,
    llmModel,
    llmBaseUrl,
    autoCompileDelay,
    editorFontSize,
    setLlmProvider,
    setLlmApiKey,
    setLlmModel,
    setLlmBaseUrl,
    setAutoCompileDelay,
    setEditorFontSize,
  } = useSettingsStore()
  
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  const handleTestConnection = async () => {
    setTestingConnection(true)
    try {
      const llm = new LLMService(llmProvider, llmApiKey, llmModel, llmBaseUrl)
      await llm.callLLM('Test connection')
      setConnectionStatus('success')
    } catch (error) {
      setConnectionStatus('error')
    } finally {
      setTestingConnection(false)
    }
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="lg">
      <div className="space-y-6">
        {/* Theme Section */}
        <section>
          <h3 className="font-semibold mb-3">Appearance</h3>
          <div className="space-y-2">
            <label className="block">
              <span className="text-sm">Theme</span>
              <select
                value={currentTheme}
                onChange={(e) => setTheme(e.target.value as ThemeName)}
                className="w-full mt-1 px-3 py-2 bg-[var(--color-bg-tertiary)] rounded"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </label>
            
            <label className="block">
              <span className="text-sm">Editor Font Size</span>
              <input
                type="number"
                value={editorFontSize}
                onChange={(e) => setEditorFontSize(parseInt(e.target.value))}
                min={10}
                max={24}
                className="w-full mt-1 px-3 py-2 bg-[var(--color-bg-tertiary)] rounded"
              />
            </label>
          </div>
        </section>
        
        {/* AI Provider Section */}
        <section>
          <h3 className="font-semibold mb-3">AI Provider (BYOK)</h3>
          <div className="space-y-2">
            <label className="block">
              <span className="text-sm">Provider</span>
              <select
                value={llmProvider}
                onChange={(e) => setLlmProvider(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]"
              >
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic Claude</option>
                <option value="ollama">Ollama (Local)</option>
              </select>
            </label>
            
            {llmProvider !== 'ollama' && (
              <label className="block">
                <span className="text-sm">API Key</span>
                <input
                  type="password"
                  value={llmApiKey}
                  onChange={(e) => setLlmApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full mt-1 px-3 py-2 bg-[var(--color-bg-tertiary)] rounded"
                />
              </label>
            )}
            
            <label className="block">
              <span className="text-sm">Model</span>
              <input
                type="text"
                value={llmModel}
                onChange={(e) => setLlmModel(e.target.value)}
                placeholder={llmProvider === 'gemini' ? 'gemini-pro' : 'gpt-4'}
                className="w-full mt-1 px-3 py-2 bg-[var(--color-bg-tertiary)] rounded"
              />
            </label>
            
            {llmProvider === 'ollama' && (
              <label className="block">
                <span className="text-sm">Base URL</span>
                <input
                  type="text"
                  value={llmBaseUrl}
                  onChange={(e) => setLlmBaseUrl(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="w-full mt-1 px-3 py-2 bg-[var(--color-bg-tertiary)] rounded"
                />
              </label>
            )}
            
            <Button onClick={handleTestConnection} disabled={testingConnection}>
              {testingConnection ? 'Testing...' : 'Test Connection'}
            </Button>
            
            {connectionStatus === 'success' && (
              <p className="text-sm text-[var(--color-accent-success)]">✓ Connection successful</p>
            )}
            {connectionStatus === 'error' && (
              <p className="text-sm text-[var(--color-accent-error)]">✗ Connection failed</p>
            )}
          </div>
        </section>
        
        {/* Editor Section */}
        <section>
          <h3 className="font-semibold mb-3">Editor</h3>
          <label className="block">
            <span className="text-sm">Auto-compile Delay (ms)</span>
            <input
              type="number"
              value={autoCompileDelay}
              onChange={(e) => setAutoCompileDelay(parseInt(e.target.value))}
              min={500}
              max={5000}
              step={100}
              className="w-full mt-1 px-3 py-2 bg-[var(--color-bg-tertiary)] rounded"
            />
          </label>
        </section>
      </div>
    </Modal>
  )
}
```


## Data Models

### Theme Types

```typescript
export interface ThemeColors {
  bg: {
    primary: string
    secondary: string
    tertiary: string
  }
  text: {
    primary: string
    secondary: string
    tertiary: string
  }
  accent: {
    primary: string
    success: string
    warning: string
    error: string
  }
  border: string
}

export interface Theme {
  colors: ThemeColors
  spacing: Record<string, string>
  typography: {
    fontFamily: string
    fontSize: Record<string, string>
  }
}
```

### AI Service Types

```typescript
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface OCRResult {
  text: string
  confidence: number
  processingTime: number
}

export interface ParsedError {
  message: string
  line: number | null
  context: string
}

export interface ErrorAnalysisResult {
  message: string
  line: number
  explanation: string
  fix: string | null
}

export interface ErrorAnalysis {
  errors: ErrorAnalysisResult[]
  canAutoFix: boolean
}

export interface Change {
  type: 'replace' | 'insert' | 'delete'
  startLine: number
  endLine: number
  newContent: string
}

export interface EditResponse {
  explanation: string
  changes: Change[]
}

export interface DocumentContext {
  currentEnvironment: string | null
  availablePackages: string[]
  customCommands: CustomCommand[]
  recentCommands: string[]
}

export interface CustomCommand {
  name: string
  paramCount: number
  definition: string
}

export interface Suggestion {
  label: string
  kind: 'function' | 'keyword' | 'snippet'
  detail: string
  insertText: string
}
```

### Settings Types

```typescript
export interface AppSettings {
  theme: ThemeName
  glassEffect: boolean
  llm: {
    provider: 'gemini' | 'openai' | 'anthropic' | 'ollama'
    apiKey: string
    model: string
    baseUrl?: string
  }
  editor: {
    fontSize: number
    autoCompileDelay: number
    enableAutoComplete: boolean
    monacoTheme: 'vs-dark' | 'vs-light'
  }
}
```

## Error Handling

### Error Categories

1. **Network Errors**: LLM API failures, timeout
2. **Processing Errors**: OCR failures, invalid image format
3. **Compilation Errors**: LaTeX syntax errors (handled by error analyzer)
4. **Validation Errors**: Invalid settings, missing API keys

### Error Handling Strategy

```typescript
// src/utils/errorHandler.ts
export class ErrorHandler {
  static handle(error: Error, context: string): UserFacingError {
    console.error(`[${context}]`, error)
    
    if (error instanceof NetworkError) {
      return {
        title: 'Connection Error',
        message: 'Failed to connect to AI service. Check your internet connection and API key.',
        action: 'Open Settings',
      }
    }
    
    if (error instanceof OCRError) {
      return {
        title: 'OCR Processing Failed',
        message: 'Could not extract text from image. Try a clearer image.',
        action: null,
      }
    }
    
    return {
      title: 'Unexpected Error',
      message: error.message,
      action: null,
    }
  }
}

// Usage in components
try {
  await processOCR(file)
} catch (error) {
  const userError = ErrorHandler.handle(error, 'OCR')
  showNotification(userError)
}
```


## Testing Strategy

### Unit Testing

**Priority Areas:**
1. Theme system token resolution
2. Context engine document analysis
3. Error log parsing
4. Document agent change application

**Example Test:**

```typescript
// src/services/__tests__/contextEngine.test.ts
import { describe, it, expect } from 'vitest'
import { ContextEngine } from '../contextEngine'

describe('ContextEngine', () => {
  const engine = new ContextEngine()
  
  it('should detect current environment', () => {
    const content = '\\begin{equation}\n  x = 5\n'
    const context = engine.analyzeDocument(content, content.length)
    expect(context.currentEnvironment).toBe('equation')
  })
  
  it('should extract custom commands', () => {
    const content = '\\newcommand{\\mycommand}[2]{#1 + #2}'
    const context = engine.analyzeDocument(content, 0)
    expect(context.customCommands).toHaveLength(1)
    expect(context.customCommands[0].name).toBe('mycommand')
    expect(context.customCommands[0].paramCount).toBe(2)
  })
})
```

### Integration Testing

**Test Scenarios:**
1. OCR → LLM → Editor insertion flow
2. Error compilation → AI analysis → Fix application
3. Chat message → Document edit → Monaco update
4. Theme switch → CSS variable update → Component re-render

### Manual Testing Checklist

- [ ] Theme switching updates all components
- [ ] OCR processes images and generates LaTeX
- [ ] Autocomplete shows context-aware suggestions
- [ ] Error analyzer correctly identifies and fixes errors
- [ ] Document agent applies changes accurately
- [ ] Settings persist across app restarts
- [ ] All LLM providers work with valid API keys

## Performance Considerations

### Bundle Size Optimization

1. **Code Splitting:**
```typescript
// Lazy load AI features
const OCRPanel = lazy(() => import('./components/OCRPanel'))
const AIChat = lazy(() => import('./components/AIChat'))
const ErrorPanel = lazy(() => import('./components/ErrorPanel'))
```

2. **Tree Shaking:**
- Import only used Lucide icons
- Use Monaco's ESM build
- Avoid importing entire libraries

3. **Dependency Audit:**
```bash
# Regular checks
npm run build -- --analyze
npx webpack-bundle-analyzer dist/stats.json
```

### Runtime Performance

1. **Debouncing:**
```typescript
// Debounce autocomplete requests
const debouncedAnalyze = useMemo(
  () => debounce((content: string, cursor: number) => {
    const context = contextEngine.analyzeDocument(content, cursor)
    setSuggestions(contextEngine.getSuggestions(context))
  }, 300),
  []
)
```

2. **Web Workers:**
- OCR processing in worker thread
- Large document parsing in worker

3. **Memoization:**
```typescript
// Memoize expensive computations
const suggestions = useMemo(
  () => contextEngine.getSuggestions(documentContext),
  [documentContext]
)
```

### Memory Management

1. **Cleanup:**
```typescript
useEffect(() => {
  const ocrService = new OCRService()
  ocrService.initialize()
  
  return () => {
    ocrService.terminate() // Clean up Tesseract worker
  }
}, [])
```

2. **Image Handling:**
- Revoke object URLs after use
- Compress images before OCR
- Limit chat history size


## Migration Strategy

### Phase 1: Theme System Foundation
1. Create theme tokens and CSS variables
2. Implement ThemeProvider and store
3. Update existing components to use theme tokens
4. Test theme switching

### Phase 2: Component Library Rebuild
1. Create base UI components (Button, Modal, Input)
2. Rebuild Toolbar with new components
3. Rebuild StatusBar with theme support
4. Update Editor wrapper for theme integration

### Phase 3: AI Infrastructure
1. Implement LLMService with provider abstraction
2. Create Settings panel with API key management
3. Add connection testing
4. Implement error handling

### Phase 4: OCR Feature
1. Integrate Tesseract.js
2. Create OCRService
3. Build OCRPanel UI
4. Connect to LLM for LaTeX conversion
5. Implement editor insertion

### Phase 5: Autocomplete
1. Build ContextEngine
2. Implement document analysis
3. Create suggestion generator
4. Integrate with Monaco completion API
5. Test with various LaTeX documents

### Phase 6: Error Analyzer
1. Implement error log parser
2. Create ErrorAnalyzer service
3. Build ErrorPanel UI
4. Add fix application logic
5. Test with common LaTeX errors

### Phase 7: Document Agent
1. Implement DocumentAgent service
2. Create AIChat UI component
3. Add change preview and application
4. Implement conversation history
5. Test multi-turn editing

### Phase 8: Polish & Optimization
1. Code splitting for AI features
2. Bundle size optimization
3. Performance profiling
4. Accessibility audit
5. Documentation

## Deployment Considerations

### Electron Build Configuration

```javascript
// electron-builder.json updates
{
  "extraResources": [
    {
      "from": "node_modules/tesseract.js-core",
      "to": "tesseract-core"
    }
  ],
  "files": [
    "dist/**/*",
    "dist-electron/**/*",
    "!node_modules/tesseract.js/src/**/*"
  ]
}
```

### Environment Variables

```typescript
// .env.example
VITE_DEFAULT_LLM_PROVIDER=gemini
VITE_ENABLE_TELEMETRY=false
```

### Security Considerations

1. **API Key Storage:**
- Encrypt API keys in localStorage
- Never log API keys
- Clear keys on logout/reset

2. **LLM Communication:**
- Validate all LLM responses
- Sanitize user input before sending
- Implement rate limiting

3. **File Access:**
- Validate file paths
- Restrict file operations to user documents
- Sanitize LaTeX output

## Future Enhancements

### Potential Features (Post-MVP)

1. **Collaborative Editing:**
- Real-time collaboration via WebRTC
- Conflict resolution
- User presence indicators

2. **Template Library:**
- Pre-built LaTeX templates
- Custom template creation
- Template sharing

3. **Advanced OCR:**
- Handwriting recognition
- Diagram/figure extraction
- Batch processing

4. **Plugin System:**
- Custom LaTeX commands
- Third-party integrations
- Extension marketplace

5. **Cloud Sync:**
- Optional cloud backup
- Cross-device sync
- Version history

6. **Advanced AI Features:**
- Document summarization
- Citation management
- Style checking
- Plagiarism detection

## Conclusion

This design provides a comprehensive architecture for redesigning Underleaf with:

- **Themeable UI**: Centralized theme system with runtime switching
- **AI Integration**: OCR, autocomplete, error fixing, and document editing
- **Modern Architecture**: React hooks, TypeScript, Zustand state management
- **Performance**: Code splitting, lazy loading, web workers
- **Extensibility**: Plugin-ready architecture for future features

The implementation follows a phased approach, allowing incremental development and testing. Each phase builds on the previous, ensuring a stable foundation before adding complexity.

Key design decisions prioritize:
- Developer experience (TypeScript, modern patterns)
- User experience (fast, intuitive, helpful)
- Maintainability (clear separation of concerns, testable)
- Performance (lightweight, optimized, responsive)


## Additional Design Notes

### Sharp, Square Design Language

All UI components use sharp edges and rectangular shapes:
- No rounded corners on panels and containers
- Square buttons with sharp edges
- Rectangular modals and dialogs
- Clean, geometric layout

**Exception:** Small interactive elements (buttons, inputs) may have minimal rounding (1-2px) for usability.

### Glass Effect Implementation

The glass effect is optional and can be toggled independently of theme:

```typescript
// Glass effect CSS utility
const glassClasses = theme.glass.enabled
  ? `backdrop-blur-[${theme.glass.blur}] bg-opacity-${Math.round(theme.glass.opacity * 100)}`
  : ''

// Applied to panels, modals, and overlays
<div className={`bg-[var(--color-bg-secondary)] ${glassClasses}`}>
```

**Glass Effect Behavior:**
- Works with all three themes (dark, light, glassy)
- When enabled, adds backdrop blur and reduces opacity
- Maintains readability with proper contrast
- Subtle effect, not overpowering

### Monaco Editor Theme Integration

Monaco supports theme customization:

```typescript
// src/components/Editor.tsx
import * as monaco from 'monaco-editor'

const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
  const { currentTheme } = useThemeStore()
  
  // Define custom Monaco theme matching app theme
  monaco.editor.defineTheme('underleaf-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#0a0a0a',
      'editor.foreground': '#ffffff',
      'editor.lineHighlightBackground': '#1e1e1e',
      'editorCursor.foreground': '#3b82f6',
      'editor.selectionBackground': '#3b82f640',
    },
  })
  
  monaco.editor.defineTheme('underleaf-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#0a0a0a',
      'editor.lineHighlightBackground': '#f5f5f5',
      'editorCursor.foreground': '#2563eb',
      'editor.selectionBackground': '#2563eb40',
    },
  })
  
  editor.updateOptions({
    theme: currentTheme === 'light' ? 'underleaf-light' : 'underleaf-dark',
  })
}
```

### Framer Motion Animation Guidelines

**Loading States:**
- Spinner rotation: `animate={{ rotate: 360 }}` with linear easing
- Fade in: `initial={{ opacity: 0 }}` → `animate={{ opacity: 1 }}`
- Duration: 200-300ms for UI feedback

**Modal/Panel Animations:**
- Scale + fade: `initial={{ scale: 0.9, opacity: 0 }}`
- Spring physics: `type: 'spring', damping: 25, stiffness: 300`
- Exit animations mirror entry

**Button Interactions:**
- Hover: `whileHover={{ scale: 1.02 }}`
- Tap: `whileTap={{ scale: 0.98 }}`
- Keep subtle for professional feel

**Performance:**
- Use `AnimatePresence` for mount/unmount animations
- Avoid animating expensive properties (avoid `filter`, prefer `opacity` and `transform`)
- Disable animations during heavy operations (OCR, compilation)

### shadcn/ui Integration

Install shadcn/ui components as needed:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add input
npx shadcn-ui@latest add tabs
```

Customize shadcn components to match sharp design:
- Override default rounded corners in `tailwind.config.js`
- Adjust component variants for glass effect support
- Ensure theme token compatibility

### Dependency Management

**New Dependencies to Add:**
```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "tesseract.js": "^5.0.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4"
  }
}
```

**Bundle Size Targets:**
- Core app (without AI): < 3MB
- With AI features loaded: < 10MB
- Tesseract.js worker: ~2MB (lazy loaded)

**Bloat Prevention:**
- Monthly dependency audit with `npm-check-updates`
- Use `webpack-bundle-analyzer` to identify large dependencies
- Prefer lightweight alternatives (e.g., `clsx` over `classnames`)
- Tree-shake unused code
