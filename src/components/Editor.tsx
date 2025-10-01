import Editor from '@monaco-editor/react'
import { useEditorStore } from '@/stores/editorStore'

export function LatexEditor() {
  const { content, setContent } = useEditorStore()
  
  return (
    <Editor
      height="100%"
      defaultLanguage="latex"
      theme="vs-dark"
      value={content}
      onChange={(value) => setContent(value || '')}
      options={{
        fontSize: 14,
        minimap: { enabled: true },
        wordWrap: 'on',
        automaticLayout: true,
      }}
    />
  )
}