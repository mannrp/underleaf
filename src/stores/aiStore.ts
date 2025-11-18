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
  fix: string | null
}

export interface ErrorAnalysis {
  errors: ErrorAnalysisResult[]
  canAutoFix: boolean
}

interface AIState {
  // Chat state
  chatHistory: ChatMessage[]
  isChatProcessing: boolean
  
  // Error analysis state
  errorAnalysis: ErrorAnalysis | null
  isAnalyzingErrors: boolean
  
  // Actions
  addChatMessage: (message: ChatMessage) => void
  setChatProcessing: (processing: boolean) => void
  clearChatHistory: () => void
  
  setErrorAnalysis: (analysis: ErrorAnalysis | null) => void
  setAnalyzingErrors: (analyzing: boolean) => void
  analyzeError: (errorLog: string, sourceCode: string) => Promise<void>
}

export const useAIStore = create<AIState>((set) => ({
  // Chat state
  chatHistory: [],
  isChatProcessing: false,
  
  // Error analysis state
  errorAnalysis: null,
  isAnalyzingErrors: false,
  
  // Actions
  addChatMessage: (message: ChatMessage) =>
    set((state) => ({
      chatHistory: [...state.chatHistory, message],
    })),
  setChatProcessing: (processing: boolean) => set({ isChatProcessing: processing }),
  clearChatHistory: () => set({ chatHistory: [] }),
  
  setErrorAnalysis: (analysis: ErrorAnalysis | null) => set({ errorAnalysis: analysis }),
  setAnalyzingErrors: (analyzing: boolean) => set({ isAnalyzingErrors: analyzing }),
  
  analyzeError: async (errorLog: string, sourceCode: string) => {
    set({ isAnalyzingErrors: true, errorAnalysis: null })
    
    try {
      const { useSettingsStore } = await import('./settingsStore')
      const { LLMService } = await import('@/services/llmService')
      const { ErrorAnalyzer } = await import('@/services/errorAnalyzer')
      
      const settings = useSettingsStore.getState()
      const llmService = new LLMService(
        settings.llmProvider,
        settings.llmApiKey,
        settings.llmModel,
        settings.llmBaseUrl
      )
      
      const analyzer = new ErrorAnalyzer(llmService)
      const analysis = await analyzer.analyzeError(errorLog, sourceCode)
      
      set({ errorAnalysis: analysis })
    } catch (error) {
      console.error('Error analyzing errors:', error)
      set({ errorAnalysis: null })
    } finally {
      set({ isAnalyzingErrors: false })
    }
  },
}))
