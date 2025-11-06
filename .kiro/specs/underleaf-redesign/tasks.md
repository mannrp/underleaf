# Implementation Plan

This implementation plan breaks down the Underleaf redesign into discrete, manageable coding tasks. Each task builds incrementally on previous work, with AI features code-split for optimal bundle size.

## Task List

- [x] 1. Setup theme system foundation





- [x] 1.1 Install dependencies (shadcn/ui, framer-motion, tesseract.js)


  - Run `npm install framer-motion tesseract.js clsx tailwind-merge`
  - Run `npx shadcn-ui@latest init` and configure for sharp design
  - Install shadcn components: `npx shadcn-ui@latest add button dialog select input tabs`
  - _Requirements: 1.1, 6.1, 7.2_

- [x] 1.2 Create theme token system with three themes


  - Create `src/theme/tokens.ts` with dark, light, and glassy theme definitions
  - Define color, spacing, and typography tokens
  - Include glass effect configuration (blur, opacity)
  - _Requirements: 1.1, 1.3_

- [x] 1.3 Implement theme store with Zustand


  - Create `src/stores/themeStore.ts` with theme state management
  - Add theme switching logic
  - Add glass effect toggle
  - Implement localStorage persistence
  - _Requirements: 1.1, 1.2, 8.2_

- [x] 1.4 Create ThemeProvider component


  - Build `src/theme/ThemeProvider.tsx` to apply CSS variables
  - Map theme tokens to CSS custom properties on :root
  - Handle theme changes reactively
  - _Requirements: 1.1, 1.2_

- [x] 1.5 Configure Tailwind for sharp design and theme variables


  - Update `tailwind.config.js` to remove default rounded corners
  - Add CSS variable references for theme colors
  - Configure glass effect utilities
  - _Requirements: 1.1, 1.4_

- [x] 2. Rebuild UI component library



- [x] 2.1 Create base Button component with variants


  - Build `src/components/ui/Button.tsx` using shadcn + Framer Motion
  - Implement primary, secondary, ghost, danger variants
  - Add loading state with animated spinner
  - Add glass effect support
  - Include hover/tap animations
  - _Requirements: 1.4, 7.2_

- [x] 2.2 Create Modal component with animations


  - Build `src/components/ui/Modal.tsx` with Framer Motion
  - Implement AnimatePresence for mount/unmount
  - Add backdrop blur and glass effect support
  - Include scale + fade animations
  - _Requirements: 1.4, 7.2_

- [x] 2.3 Create Input and Select components


  - Build `src/components/ui/Input.tsx` with theme support
  - Build `src/components/ui/Select.tsx` using shadcn primitives
  - Apply sharp design language
  - Add focus states with theme colors
  - _Requirements: 1.4_

- [x] 2.4 Rebuild Toolbar component with new UI library


  - Update `src/components/Toolbar.tsx` to use new Button component
  - Apply theme-aware styling
  - Add glass effect support
  - Maintain existing functionality (open, save, compile, auto-compile toggle)
  - _Requirements: 1.4, 1.5_

- [x] 2.5 Rebuild StatusBar component with theme support


  - Update `src/components/StatusBar.tsx` with theme tokens
  - Use CSS variables for colors
  - Add glass effect support
  - Maintain compilation status display
  - _Requirements: 1.4, 1.5_

- [x] 2.6 Update PDFViewer component with theme styling


  - Update `src/components/PDFViewer.tsx` with theme-aware styling
  - Apply sharp design to controls
  - Add glass effect to control bar
  - _Requirements: 1.4, 1.5_

- [x] 3. Implement settings panel


- [x] 3.1 Create settings store


  - Build `src/stores/settingsStore.ts` with Zustand
  - Add LLM provider configuration (gemini, openai, anthropic, ollama)
  - Add API key storage
  - Add editor preferences (fontSize, autoCompileDelay)
  - Add glass effect toggle
  - Implement localStorage persistence with encryption for API keys
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 3.2 Build Settings modal UI


  - Create `src/components/Settings.tsx` using Modal component
  - Add theme selection dropdown (dark, light, glassy)
  - Add glass effect toggle
  - Add LLM provider configuration section
  - Add editor preferences section
  - Include connection test button for LLM providers
  - _Requirements: 8.1, 8.3, 8.4_

- [x] 3.3 Add settings button to Toolbar


  - Add settings icon button to Toolbar
  - Wire up modal open/close state
  - _Requirements: 8.1_

- [x] 4. Implement LLM service infrastructure


- [x] 4.1 Create base LLM service class


  - Build `src/services/llmService.ts` with provider abstraction
  - Implement constructor with provider, apiKey, model, baseUrl
  - Create `callLLM` method with provider routing
  - Add error handling and timeout logic
  - _Requirements: 2.3, 7.4_

- [x] 4.2 Implement Gemini provider

  - Add `callGemini` method with Google Generative AI API
  - Handle API response parsing
  - Add error handling for API failures
  - _Requirements: 2.3_

- [x] 4.3 Implement OpenAI provider

  - Add `callOpenAI` method with OpenAI Chat Completions API
  - Handle API response parsing
  - Add error handling
  - _Requirements: 2.3_

- [x] 4.4 Implement Anthropic provider

  - Add `callAnthropic` method with Anthropic Messages API
  - Handle API response parsing
  - Add error handling
  - _Requirements: 2.3_

- [x] 4.5 Implement Ollama provider

  - Add `callLocal` method for Ollama API
  - Support custom base URL configuration
  - Handle streaming and non-streaming responses
  - Add connection testing
  - _Requirements: 2.3_

- [x] 4.6 Create AI store for shared AI state


  - Build `src/stores/aiStore.ts` with Zustand
  - Add processing state flags
  - Add OCR result state
  - Add chat history state
  - Add error analysis state
  - _Requirements: 2.6, 4.5, 5.5_

- [x] 5. Implement OCR pipeline


- [x] 5.1 Create OCR service with Tesseract.js


  - Build `src/services/ocrService.ts`
  - Implement worker initialization
  - Add `extractText` method for image processing
  - Add progress callbacks
  - Implement cleanup/termination
  - _Requirements: 2.1, 2.6_

- [x] 5.2 Add LaTeX conversion to LLM service

  - Add `convertToLatex` method to LLMService
  - Create prompt template for OCR text → LaTeX conversion
  - Parse and extract LaTeX code from LLM response
  - _Requirements: 2.2_

- [x] 5.3 Build OCR panel UI component


  - Create `src/components/OCRPanel.tsx`
  - Add file upload with drag-and-drop
  - Add image preview
  - Add processing indicator with Framer Motion animation
  - Display extracted LaTeX code
  - Add "Insert into Editor" button
  - _Requirements: 2.1, 2.4, 2.5_

- [x] 5.4 Integrate OCR with editor insertion

  - Add method to insert text at Monaco cursor position
  - Handle editor focus after insertion
  - Add undo/redo support
  - _Requirements: 2.5_

- [x] 5.5 Add OCR panel to main layout


  - Create tabs or sidebar for OCR panel
  - Lazy load OCR components for bundle optimization
  - Add toggle button in Toolbar
  - _Requirements: 2.6, 6.2_

- [ ] 6. Implement context-aware autocomplete
- [ ] 6.1 Create context engine service
  - Build `src/services/contextEngine.ts`
  - Implement `analyzeDocument` method
  - Add `detectEnvironment` to find current LaTeX environment
  - Add `extractPackages` to parse \usepackage commands
  - Add `extractCustomCommands` to parse \newcommand definitions
  - _Requirements: 3.1, 3.3_

- [ ] 6.2 Build suggestion generator
  - Add `getSuggestions` method to ContextEngine
  - Create LaTeX command database (common commands, math symbols)
  - Filter suggestions by current environment
  - Include custom commands in suggestions
  - Rank suggestions by relevance
  - _Requirements: 3.2, 3.5_

- [ ] 6.3 Integrate with Monaco completion API
  - Update `src/components/Editor.tsx`
  - Register Monaco completion provider for 'latex' language
  - Call ContextEngine on completion trigger
  - Map suggestions to Monaco completion items
  - Add parameter hints for commands
  - _Requirements: 3.2, 3.4_

- [ ] 6.4 Add debouncing for performance
  - Debounce document analysis (300ms)
  - Cache analysis results
  - Optimize regex patterns
  - _Requirements: 3.1, 6.3_

- [ ]* 6.5 Test autocomplete with various LaTeX documents
  - Test with math environments
  - Test with custom commands
  - Test with different packages
  - Verify performance with large documents
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 7. Implement AI error analyzer
- [ ] 7.1 Create error analyzer service
  - Build `src/services/errorAnalyzer.ts`
  - Implement `parseLatexLog` to extract errors from compilation logs
  - Parse error messages, line numbers, and context
  - _Requirements: 4.1_

- [ ] 7.2 Add AI error analysis
  - Implement `analyzeIndividualError` method
  - Create prompt template for error explanation
  - Call LLM with error context and surrounding code
  - Parse JSON response with explanation and fix
  - _Requirements: 4.2_

- [ ] 7.3 Implement fix application logic
  - Add `applyFix` method to apply code changes
  - Handle line-based replacements
  - Support multiple fixes
  - _Requirements: 4.4_

- [ ] 7.4 Build error panel UI component
  - Create `src/components/ErrorPanel.tsx`
  - Display compilation errors
  - Add "Analyze with AI" button
  - Show AI explanations and suggested fixes
  - Add "Apply Fix" buttons for each error
  - Include loading animations
  - _Requirements: 4.1, 4.3, 4.4_

- [ ] 7.5 Integrate error panel with compilation flow
  - Show ErrorPanel when compilation fails
  - Pass error logs to analyzer
  - Update editor content when fixes are applied
  - Add undo support
  - _Requirements: 4.1, 4.4, 4.5_

- [ ] 7.6 Add error panel to main layout
  - Position below editor or in sidebar
  - Lazy load for bundle optimization
  - Add collapse/expand functionality
  - _Requirements: 4.6, 6.2_

- [ ] 8. Implement AI document editor agent
- [ ] 8.1 Create document agent service
  - Build `src/services/documentAgent.ts`
  - Implement `processEditRequest` method
  - Create prompt template for document editing
  - Include conversation history in context
  - Parse JSON response with changes
  - _Requirements: 5.2, 5.3_

- [ ] 8.2 Implement change application logic
  - Add `applyChanges` method
  - Support replace, insert, delete operations
  - Handle multiple changes in correct order
  - Preserve document formatting
  - _Requirements: 5.4_

- [ ] 8.3 Build AI chat UI component
  - Create `src/components/AIChat.tsx`
  - Add chat message display with user/assistant styling
  - Add input field with send button
  - Display pending changes with preview
  - Add "Apply Changes" and "Reject" buttons
  - Include typing indicators and animations
  - _Requirements: 5.1, 5.3, 5.4, 5.6_

- [ ] 8.4 Integrate chat with editor
  - Connect chat to editor content
  - Apply changes to Monaco editor
  - Highlight changed regions
  - Add undo/redo support
  - _Requirements: 5.4, 5.6_

- [ ] 8.5 Add conversation history management
  - Store chat history in AI store
  - Implement multi-turn context
  - Add clear conversation button
  - Limit history size for performance
  - _Requirements: 5.5_

- [ ] 8.6 Add AI chat panel to main layout
  - Create sidebar or panel for chat
  - Lazy load chat components
  - Add toggle button in Toolbar
  - _Requirements: 5.1, 6.2_

- [x] 9. Integrate Monaco editor theme



- [x] 9.1 Create custom Monaco themes


  - Define 'underleaf-dark' theme matching app dark theme
  - Define 'underleaf-light' theme matching app light theme
  - Map theme colors to Monaco editor colors
  - _Requirements: 1.3, 7.5_

- [x] 9.2 Sync Monaco theme with app theme


  - Update Editor component to apply Monaco theme
  - Listen to theme changes and update Monaco
  - Handle theme switching without editor reload
  - _Requirements: 1.2, 1.3_

- [x] 10. Performance optimization and code splitting



- [x] 10.1 Implement lazy loading for AI features

  - Lazy load OCRPanel component
  - Lazy load AIChat component
  - Lazy load ErrorPanel component
  - Use React.lazy and Suspense
  - _Requirements: 6.1, 6.2_

- [x] 10.2 Optimize Tesseract.js loading

  - Load Tesseract worker only when OCR is first used
  - Configure worker path for production build
  - Add cleanup on component unmount
  - _Requirements: 6.1, 6.2_

- [x] 10.3 Add bundle size monitoring

  - Configure webpack-bundle-analyzer
  - Add build script to generate bundle report
  - Document bundle size targets
  - _Requirements: 6.5_

- [x] 10.4 Implement debouncing and memoization


  - Debounce autocomplete analysis
  - Memoize expensive computations
  - Optimize re-renders with React.memo
  - _Requirements: 6.3_

- [x] 11. Error handling and user feedback


- [x] 11.1 Create error handler utility


  - Build `src/utils/errorHandler.ts`
  - Categorize errors (network, processing, validation)
  - Generate user-friendly error messages
  - _Requirements: 2.5, 4.5_

- [x] 11.2 Add toast notification system


  - Install or create toast component
  - Show notifications for errors and success
  - Add animations with Framer Motion
  - _Requirements: 2.5, 4.5_

- [x] 11.3 Add loading states to all async operations

  - Add loading indicators to OCR processing
  - Add loading to LLM API calls
  - Add loading to compilation
  - Use Framer Motion for smooth transitions
  - _Requirements: 2.6, 4.5_

- [ ] 12. Testing and polish
- [ ]* 12.1 Write unit tests for core services
  - Test ContextEngine document analysis
  - Test ErrorAnalyzer log parsing
  - Test DocumentAgent change application
  - Test theme token resolution
  - _Requirements: 7.2_

- [ ]* 12.2 Perform integration testing
  - Test OCR → LLM → Editor flow
  - Test error analysis → fix application
  - Test chat → document edit → Monaco update
  - Test theme switching across all components
  - _Requirements: 7.2_

- [x] 12.3 Accessibility audit


  - Add ARIA labels to all interactive elements
  - Test keyboard navigation
  - Verify color contrast ratios
  - Add focus indicators
  - _Requirements: 7.2_

- [ ] 12.4 Update Electron build configuration
  - Add Tesseract.js resources to build
  - Configure code signing (if applicable)
  - Test production build
  - _Requirements: 6.5_

- [ ] 12.5 Create user documentation
  - Document AI features usage
  - Document settings configuration
  - Add keyboard shortcuts reference
  - Create troubleshooting guide
  - _Requirements: 8.1_
