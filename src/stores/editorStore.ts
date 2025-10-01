import { create } from 'zustand'
import type { CompilationResult } from '@/types'

interface EditorState {
  content: string
  filePath: string | null
  pdfPath: string | null
  pdfUpdateTime: number
  isCompiling: boolean
  compilationResult: CompilationResult | null
  autoCompileEnabled: boolean
  
  setContent: (content: string) => void
  setFilePath: (path: string | null) => void
  setPdfPath: (path: string | null) => void
  setIsCompiling: (isCompiling: boolean) => void
  setCompilationResult: (result: CompilationResult | null) => void
  setAutoCompileEnabled: (enabled: boolean) => void
  updatePdfTime: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  content: '% Start writing LaTeX here\n\\documentclass{article}\n\\begin{document}\n\nHello, World!\n\n\\end{document}',
  filePath: null,
  pdfPath: null,
  pdfUpdateTime: 0,
  isCompiling: false,
  compilationResult: null,
  autoCompileEnabled: true,
  
  setContent: (content) => set({ content }),
  setFilePath: (filePath) => set({ filePath }),
  setPdfPath: (pdfPath) => set({ pdfPath }),
  setIsCompiling: (isCompiling) => set({ isCompiling }),
  setCompilationResult: (compilationResult) => set({ compilationResult }),
  setAutoCompileEnabled: (enabled) => set({ autoCompileEnabled: enabled }),
  updatePdfTime: () => set({ pdfUpdateTime: Date.now() }),
}))