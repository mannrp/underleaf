import { useEffect, useRef, useMemo } from 'react'
import Editor, { OnMount, Monaco } from '@monaco-editor/react'
import type * as monacoType from 'monaco-editor'
import { useEditorStore } from '@/stores/editorStore'
import { useThemeStore } from '@/stores/themeStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { ContextEngine } from '@/services/contextEngine'
import { themes } from '@/theme/tokens'

export function LatexEditor() {
  const { content, setContent } = useEditorStore()
  const { currentTheme } = useThemeStore()
  const { editorFontSize } = useSettingsStore()
  const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const contextEngine = useMemo(() => new ContextEngine(), [])
  
  const defineThemes = (monaco: Monaco) => {
    // Dark theme
    monaco.editor.defineTheme('underleaf-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: themes.dark.colors.text.tertiary.replace('#', '') },
        { token: 'keyword', foreground: themes.dark.colors.accent.primary.replace('#', ''), fontStyle: 'bold' },
        { token: 'string', foreground: themes.dark.colors.accent.success.replace('#', '') },
        { token: 'number', foreground: themes.dark.colors.accent.warning.replace('#', '') },
      ],
      colors: {
        'editor.background': themes.dark.colors.bg.primary,
        'editor.foreground': themes.dark.colors.text.primary,
        'editor.lineHighlightBackground': themes.dark.colors.bg.secondary,
        'editorLineNumber.foreground': themes.dark.colors.text.tertiary,
        'editorLineNumber.activeForeground': themes.dark.colors.text.secondary,
        'editor.selectionBackground': themes.dark.colors.accent.primary + '40',
        'editor.inactiveSelectionBackground': themes.dark.colors.accent.primary + '20',
        'editorCursor.foreground': themes.dark.colors.accent.primary,
        'editorWhitespace.foreground': themes.dark.colors.text.tertiary + '40',
        'editorIndentGuide.background': themes.dark.colors.border,
        'editorIndentGuide.activeBackground': themes.dark.colors.text.tertiary,
      },
    })

    // Light theme
    monaco.editor.defineTheme('underleaf-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: themes.light.colors.text.tertiary.replace('#', '') },
        { token: 'keyword', foreground: themes.light.colors.accent.primary.replace('#', ''), fontStyle: 'bold' },
        { token: 'string', foreground: themes.light.colors.accent.success.replace('#', '') },
        { token: 'number', foreground: themes.light.colors.accent.warning.replace('#', '') },
      ],
      colors: {
        'editor.background': themes.light.colors.bg.primary,
        'editor.foreground': themes.light.colors.text.primary,
        'editor.lineHighlightBackground': themes.light.colors.bg.secondary,
        'editorLineNumber.foreground': themes.light.colors.text.tertiary,
        'editorLineNumber.activeForeground': themes.light.colors.text.secondary,
        'editor.selectionBackground': themes.light.colors.accent.primary + '40',
        'editor.inactiveSelectionBackground': themes.light.colors.accent.primary + '20',
        'editorCursor.foreground': themes.light.colors.accent.primary,
        'editorWhitespace.foreground': themes.light.colors.text.tertiary + '40',
        'editorIndentGuide.background': themes.light.colors.border,
        'editorIndentGuide.activeBackground': themes.light.colors.text.tertiary,
      },
    })

    // Glassy theme
    monaco.editor.defineTheme('underleaf-glassy', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: themes.glassy.colors.text.tertiary.replace('#', '') },
        { token: 'keyword', foreground: themes.glassy.colors.accent.primary.replace('#', ''), fontStyle: 'bold' },
        { token: 'string', foreground: themes.glassy.colors.accent.success.replace('#', '') },
        { token: 'number', foreground: themes.glassy.colors.accent.warning.replace('#', '') },
      ],
      colors: {
        'editor.background': '#0a0a0a',
        'editor.foreground': themes.glassy.colors.text.primary,
        'editor.lineHighlightBackground': '#141414',
        'editorLineNumber.foreground': themes.glassy.colors.text.tertiary,
        'editorLineNumber.activeForeground': themes.glassy.colors.text.secondary,
        'editor.selectionBackground': themes.glassy.colors.accent.primary + '40',
        'editor.inactiveSelectionBackground': themes.glassy.colors.accent.primary + '20',
        'editorCursor.foreground': themes.glassy.colors.accent.primary,
        'editorWhitespace.foreground': themes.glassy.colors.text.tertiary + '40',
        'editorIndentGuide.background': '#ffffff1a',
        'editorIndentGuide.activeBackground': themes.glassy.colors.text.tertiary,
      },
    })
  }

  const getMonacoThemeName = (themeName: string): string => {
    switch (themeName) {
      case 'dark':
        return 'underleaf-dark'
      case 'light':
        return 'underleaf-light'
      case 'glassy':
        return 'underleaf-glassy'
      default:
        return 'underleaf-dark'
    }
  }
  
  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco
    
    // Define themes with the correct Monaco instance
    defineThemes(monaco)
    
    // Apply initial theme
    const themeName = getMonacoThemeName(currentTheme)
    monaco.editor.setTheme(themeName)
    
    // Register LaTeX completion provider
    const disposable = monaco.languages.registerCompletionItemProvider('latex', {
      triggerCharacters: ['\\', '{'],
      provideCompletionItems: (model, position) => {
        const content = model.getValue()
        const offset = model.getOffsetAt(position)
        
        // Analyze document context
        const context = contextEngine.analyzeDocument(content, offset)
        const suggestions = contextEngine.getSuggestions(context)
        
        // Get word range for replacement
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }
        
        // Map to Monaco completion items
        const completionItems: monacoType.languages.CompletionItem[] = suggestions.map(s => ({
          label: s.label,
          kind: s.kind === 'function' 
            ? monaco.languages.CompletionItemKind.Function
            : s.kind === 'environment'
            ? monaco.languages.CompletionItemKind.Snippet
            : monaco.languages.CompletionItemKind.Keyword,
          insertText: s.insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: s.detail,
          documentation: s.documentation,
          sortText: s.sortText,
          range: range,
        }))
        
        return {
          suggestions: completionItems,
        }
      },
    })
    
    // Cleanup on unmount
    return () => {
      disposable.dispose()
    }
  }
  
  // Update theme when it changes
  useEffect(() => {
    if (monacoRef.current && editorRef.current) {
      const themeName = getMonacoThemeName(currentTheme)
      monacoRef.current.editor.setTheme(themeName)
    }
  }, [currentTheme])
  
  return (
    <Editor
      height="100%"
      defaultLanguage="latex"
      theme={getMonacoThemeName(currentTheme)}
      value={content}
      onChange={(value) => setContent(value || '')}
      onMount={handleEditorMount}
      options={{
        fontSize: editorFontSize,
        minimap: { enabled: true },
        wordWrap: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        renderWhitespace: 'selection',
        cursorBlinking: 'smooth',
        smoothScrolling: true,
      }}
    />
  )
}