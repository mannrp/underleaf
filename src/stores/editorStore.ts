import { create } from 'zustand'
import type { CompilationResult } from '@/types'

interface EditorState {
  content: string
  filePath: string | null
  pdfPath: string | null
  isCompiling: boolean
  compilationResult: CompilationResult | null
  
  setContent: (content: string) => void
  setFilePath: (path: string | null) => void
  setPdfPath: (path: string | null) => void
  setIsCompiling: (isCompiling: boolean) => void
  setCompilationResult: (result: CompilationResult | null) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  content: '% Start writing LaTeX here\n\\documentclass{article}\n\\begin{document}\n\nHello, World!\n\n\\end{document}',
  filePath: null,
  pdfPath: null,
  isCompiling: false,
  compilationResult: null,
  
  setContent: (content) => set({ content }),
  setFilePath: (filePath) => set({ filePath }),
  setPdfPath: (pdfPath) => set({ pdfPath }),
  setIsCompiling: (isCompiling) => set({ isCompiling }),
  setCompilationResult: (compilationResult) => set({ compilationResult }),
}))