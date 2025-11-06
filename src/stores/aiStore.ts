import { create } from 'zustand'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface ErrorAnalysisResult {
  message: string
  line: number | null
  explanation: string
  fix?: string
}

export interface ErrorAnalysis {
  errors: ErrorAnalysisResult[]
  canAutoFix: boolean
}

interface AIState {
  // OCR state
  isProcessingOCR: boolean
  ocrResult: string | null
  
  // Chat state
  chatHistory: ChatMessage[]
  isChatProcessing: boolean
  
  // Error analysis state
  errorAnalysis: ErrorAnalysis | null
  isAnalyzingErrors: boolean
  
  // Actions
  setProcessingOCR: (processing: boolean) => void
  setOCRResult: (result: string | null) => void
  
  addChatMessage: (message: ChatMessage) => void
  setChatProcessing: (processing: boolean) => void
  clearChatHistory: () => void
  
  setErrorAnalysis: (analysis: ErrorAnalysis | null) => void
  setAnalyzingErrors: (analyzing: boolean) => void
}

export const useAIStore = create<AIState>((set) => ({
  // OCR state
  isProcessingOCR: false,
  ocrResult: null,
  
  // Chat state
  chatHistory: [],
  isChatProcessing: false,
  
  // Error analysis state
  errorAnalysis: null,
  isAnalyzingErrors: false,
  
  // Actions
  setProcessingOCR: (processing: boolean) => set({ isProcessingOCR: processing }),
  setOCRResult: (result: string | null) => set({ ocrResult: result }),
  
  addChatMessage: (message: ChatMessage) =>
    set((state) => ({
      chatHistory: [...state.chatHistory, message],
    })),
  setChatProcessing: (processing: boolean) => set({ isChatProcessing: processing }),
  clearChatHistory: () => set({ chatHistory: [] }),
  
  setErrorAnalysis: (analysis: ErrorAnalysis | null) => set({ errorAnalysis: analysis }),
  setAnalyzingErrors: (analyzing: boolean) => set({ isAnalyzingErrors: analyzing }),
}))
