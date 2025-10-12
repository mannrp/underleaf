import Editor from '@monaco-editor/react'
import { useEditorStore } from '@/stores/editorStore'
import { useSettingsStore } from '@/stores/settingsStore'

export function LatexEditor() {
  const { content, setContent } = useEditorStore()
  const { editor } = useSettingsStore()
  
  return (
    <Editor
      height="100%"
      defaultLanguage="latex"
      theme="vs-dark"
      value={content}
      onChange={(value) => setContent(value || '')}
      options={{
        fontSize: editor.fontSize,
        minimap: { enabled: editor.minimap },
        wordWrap: editor.wordWrap ? 'on' : 'off',
        lineNumbers: editor.lineNumbers ? 'on' : 'off',
        tabSize: editor.tabSize,
        insertSpaces: editor.insertSpaces,
        automaticLayout: true,
      }}
    />
  )
}