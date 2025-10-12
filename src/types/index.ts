export interface ElectronAPI {
  fileOpen: () => Promise<{ path: string; content: string } | null>
  fileSave: (path: string, content: string) => Promise<boolean>
  fileSaveAs: (content: string) => Promise<string | null>
  latexCompile: (path: string) => Promise<CompilationResult>
  pdfRead: (path: string) => Promise<string>
}

export interface CompilationResult {
  success: boolean
  pdfPath: string | null
  output: string
  logs: string
}

// Re-export environment types for easy access
export type { 
  EnvironmentInfo, 
  StorageAdapter, 
  EnvironmentAdapter 
} from '../utils/environment'

declare global {
  interface Window {
    electron: ElectronAPI
  }
}