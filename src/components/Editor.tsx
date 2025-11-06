import { useEffect, useState, useRef } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useEditorStore } from '@/stores/editorStore'
import { useThemeStore } from '@/stores/themeStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { defineMonacoThemes, getMonacoThemeName } from '@/theme/monacoThemes'

export function LatexEditor() {
  const { content, setContent } = useEditorStore()
  const { currentTheme } = useThemeStore()
  const { editorFontSize } = useSettingsStore()
  const [themesInitialized, setThemesInitialized] = useState(false)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  
  const handleEditorMount: OnMount = (editor, _monaco) => {
    editorRef.current = editor
    
    // Define custom themes if not already done
    if (!themesInitialized) {
      defineMonacoThemes()
      setThemesInitialized(true)
    }
    
    // Apply initial theme
    monaco.editor.setTheme(getMonacoThemeName(currentTheme))
  }
  
  // Update theme when it changes
  useEffect(() => {
    if (themesInitialized) {
      const monacoTheme = getMonacoThemeName(currentTheme)
      monaco.editor.setTheme(monacoTheme)
    }
  }, [currentTheme, themesInitialized])
  
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