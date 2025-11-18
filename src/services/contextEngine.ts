/**
 * Context Engine Service
 * Analyzes LaTeX document structure to provide intelligent autocomplete suggestions
 */

import { MemoCache } from '@/utils/debounce'

export interface CustomCommand {
  name: string
  paramCount: number
  definition: string
}

export interface DocumentContext {
  currentEnvironment: string | null
  availablePackages: string[]
  customCommands: CustomCommand[]
  recentCommands: string[]
}

export interface Suggestion {
  label: string
  kind: 'function' | 'keyword' | 'snippet' | 'environment'
  detail: string
  insertText: string
  documentation?: string
  sortText?: string
}

// LaTeX command database
const COMMON_COMMANDS: Suggestion[] = [
  { label: '\\textbf', kind: 'function', detail: 'Bold text', insertText: '\\textbf{$1}', documentation: 'Makes text bold' },
  { label: '\\textit', kind: 'function', detail: 'Italic text', insertText: '\\textit{$1}', documentation: 'Makes text italic' },
  { label: '\\emph', kind: 'function', detail: 'Emphasized text', insertText: '\\emph{$1}', documentation: 'Emphasizes text' },
  { label: '\\section', kind: 'function', detail: 'Section heading', insertText: '\\section{$1}', documentation: 'Creates a section' },
  { label: '\\subsection', kind: 'function', detail: 'Subsection heading', insertText: '\\subsection{$1}', documentation: 'Creates a subsection' },
  { label: '\\subsubsection', kind: 'function', detail: 'Subsubsection heading', insertText: '\\subsubsection{$1}', documentation: 'Creates a subsubsection' },
  { label: '\\label', kind: 'function', detail: 'Label for reference', insertText: '\\label{$1}', documentation: 'Creates a label for cross-referencing' },
  { label: '\\ref', kind: 'function', detail: 'Reference to label', insertText: '\\ref{$1}', documentation: 'References a label' },
  { label: '\\cite', kind: 'function', detail: 'Citation', insertText: '\\cite{$1}', documentation: 'Cites a bibliography entry' },
  { label: '\\footnote', kind: 'function', detail: 'Footnote', insertText: '\\footnote{$1}', documentation: 'Creates a footnote' },
  { label: '\\item', kind: 'keyword', detail: 'List item', insertText: '\\item ', documentation: 'Creates a list item' },
  { label: '\\includegraphics', kind: 'function', detail: 'Include image', insertText: '\\includegraphics{$1}', documentation: 'Includes an image file' },
  { label: '\\caption', kind: 'function', detail: 'Figure/table caption', insertText: '\\caption{$1}', documentation: 'Adds a caption' },
  { label: '\\usepackage', kind: 'function', detail: 'Load package', insertText: '\\usepackage{$1}', documentation: 'Loads a LaTeX package' },
]

const MATH_COMMANDS: Suggestion[] = [
  { label: '\\frac', kind: 'function', detail: 'Fraction', insertText: '\\frac{$1}{$2}', documentation: 'Creates a fraction' },
  { label: '\\sqrt', kind: 'function', detail: 'Square root', insertText: '\\sqrt{$1}', documentation: 'Square root' },
  { label: '\\sum', kind: 'keyword', detail: 'Summation', insertText: '\\sum_{$1}^{$2}', documentation: 'Summation symbol' },
  { label: '\\int', kind: 'keyword', detail: 'Integral', insertText: '\\int_{$1}^{$2}', documentation: 'Integral symbol' },
  { label: '\\lim', kind: 'keyword', detail: 'Limit', insertText: '\\lim_{$1}', documentation: 'Limit operator' },
  { label: '\\alpha', kind: 'keyword', detail: 'Greek letter alpha', insertText: '\\alpha', documentation: 'Greek letter α' },
  { label: '\\beta', kind: 'keyword', detail: 'Greek letter beta', insertText: '\\beta', documentation: 'Greek letter β' },
  { label: '\\gamma', kind: 'keyword', detail: 'Greek letter gamma', insertText: '\\gamma', documentation: 'Greek letter γ' },
  { label: '\\delta', kind: 'keyword', detail: 'Greek letter delta', insertText: '\\delta', documentation: 'Greek letter δ' },
  { label: '\\epsilon', kind: 'keyword', detail: 'Greek letter epsilon', insertText: '\\epsilon', documentation: 'Greek letter ε' },
  { label: '\\theta', kind: 'keyword', detail: 'Greek letter theta', insertText: '\\theta', documentation: 'Greek letter θ' },
  { label: '\\lambda', kind: 'keyword', detail: 'Greek letter lambda', insertText: '\\lambda', documentation: 'Greek letter λ' },
  { label: '\\mu', kind: 'keyword', detail: 'Greek letter mu', insertText: '\\mu', documentation: 'Greek letter μ' },
  { label: '\\pi', kind: 'keyword', detail: 'Greek letter pi', insertText: '\\pi', documentation: 'Greek letter π' },
  { label: '\\sigma', kind: 'keyword', detail: 'Greek letter sigma', insertText: '\\sigma', documentation: 'Greek letter σ' },
  { label: '\\infty', kind: 'keyword', detail: 'Infinity symbol', insertText: '\\infty', documentation: 'Infinity ∞' },
  { label: '\\partial', kind: 'keyword', detail: 'Partial derivative', insertText: '\\partial', documentation: 'Partial derivative symbol ∂' },
  { label: '\\nabla', kind: 'keyword', detail: 'Nabla/gradient', insertText: '\\nabla', documentation: 'Nabla operator ∇' },
  { label: '\\times', kind: 'keyword', detail: 'Multiplication', insertText: '\\times', documentation: 'Multiplication symbol ×' },
  { label: '\\cdot', kind: 'keyword', detail: 'Dot product', insertText: '\\cdot', documentation: 'Centered dot ·' },
  { label: '\\leq', kind: 'keyword', detail: 'Less than or equal', insertText: '\\leq', documentation: 'Less than or equal ≤' },
  { label: '\\geq', kind: 'keyword', detail: 'Greater than or equal', insertText: '\\geq', documentation: 'Greater than or equal ≥' },
  { label: '\\neq', kind: 'keyword', detail: 'Not equal', insertText: '\\neq', documentation: 'Not equal ≠' },
  { label: '\\approx', kind: 'keyword', detail: 'Approximately equal', insertText: '\\approx', documentation: 'Approximately equal ≈' },
]

const ENVIRONMENTS: Suggestion[] = [
  { label: '\\begin{equation}', kind: 'environment', detail: 'Numbered equation', insertText: '\\begin{equation}\n\t$1\n\\end{equation}', documentation: 'Numbered equation environment' },
  { label: '\\begin{align}', kind: 'environment', detail: 'Aligned equations', insertText: '\\begin{align}\n\t$1\n\\end{align}', documentation: 'Aligned equations environment' },
  { label: '\\begin{itemize}', kind: 'environment', detail: 'Bulleted list', insertText: '\\begin{itemize}\n\t\\item $1\n\\end{itemize}', documentation: 'Bulleted list environment' },
  { label: '\\begin{enumerate}', kind: 'environment', detail: 'Numbered list', insertText: '\\begin{enumerate}\n\t\\item $1\n\\end{enumerate}', documentation: 'Numbered list environment' },
  { label: '\\begin{figure}', kind: 'environment', detail: 'Figure environment', insertText: '\\begin{figure}[h]\n\t\\centering\n\t$1\n\t\\caption{$2}\n\\end{figure}', documentation: 'Figure environment' },
  { label: '\\begin{table}', kind: 'environment', detail: 'Table environment', insertText: '\\begin{table}[h]\n\t\\centering\n\t$1\n\t\\caption{$2}\n\\end{table}', documentation: 'Table environment' },
  { label: '\\begin{center}', kind: 'environment', detail: 'Centered text', insertText: '\\begin{center}\n\t$1\n\\end{center}', documentation: 'Center environment' },
  { label: '\\begin{abstract}', kind: 'environment', detail: 'Abstract', insertText: '\\begin{abstract}\n\t$1\n\\end{abstract}', documentation: 'Abstract environment' },
]

// Environment-specific command mappings
const ENVIRONMENT_COMMANDS: Record<string, Suggestion[]> = {
  'equation': MATH_COMMANDS,
  'align': MATH_COMMANDS,
  'gather': MATH_COMMANDS,
  'multline': MATH_COMMANDS,
  'itemize': [
    { label: '\\item', kind: 'keyword', detail: 'List item', insertText: '\\item ', documentation: 'Creates a list item' },
  ],
  'enumerate': [
    { label: '\\item', kind: 'keyword', detail: 'List item', insertText: '\\item ', documentation: 'Creates a list item' },
  ],
  'tabular': [
    { label: '\\hline', kind: 'keyword', detail: 'Horizontal line', insertText: '\\hline', documentation: 'Horizontal line in table' },
    { label: '\\cline', kind: 'function', detail: 'Partial horizontal line', insertText: '\\cline{$1}', documentation: 'Partial horizontal line' },
  ],
}

export class ContextEngine {
  private analysisCache = new MemoCache<{ content: string; cursor: number }, DocumentContext>(3000, 50)
  private suggestionCache = new MemoCache<DocumentContext, Suggestion[]>(3000, 50)

  /**
   * Analyzes the document and returns context information
   * Results are cached for performance
   */
  analyzeDocument(content: string, cursorPosition: number): DocumentContext {
    // Check cache first
    const cacheKey = { content, cursor: cursorPosition }
    const cached = this.analysisCache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    // Perform analysis
    const result = this.performAnalysis(content, cursorPosition)
    
    // Cache result
    this.analysisCache.set(cacheKey, result)
    
    return result
  }
  
  /**
   * Internal method that performs the actual analysis
   */
  private performAnalysis(content: string, cursorPosition: number): DocumentContext {
    return {
      currentEnvironment: this.detectEnvironment(content, cursorPosition),
      availablePackages: this.extractPackages(content),
      customCommands: this.extractCustomCommands(content),
      recentCommands: this.getRecentCommands(content, cursorPosition),
    }
  }

  /**
   * Detects the current LaTeX environment at cursor position
   * Returns the innermost environment name or null if not in an environment
   */
  private detectEnvironment(content: string, cursor: number): string | null {
    const beforeCursor = content.slice(0, cursor)
    
    // Find all \begin{env} that don't have matching \end{env} before cursor
    const beginMatches = Array.from(beforeCursor.matchAll(/\\begin\{([^}]+)\}/g))
    const endMatches = Array.from(beforeCursor.matchAll(/\\end\{([^}]+)\}/g))
    
    // Build stack of open environments
    const envStack: string[] = []
    let beginIndex = 0
    let endIndex = 0
    
    while (beginIndex < beginMatches.length || endIndex < endMatches.length) {
      const nextBegin = beginMatches[beginIndex]
      const nextEnd = endMatches[endIndex]
      
      if (!nextEnd || (nextBegin && nextBegin.index! < nextEnd.index!)) {
        // Next is a begin
        envStack.push(nextBegin[1])
        beginIndex++
      } else {
        // Next is an end
        const envName = nextEnd[1]
        // Pop matching environment from stack
        const lastIndex = envStack.lastIndexOf(envName)
        if (lastIndex !== -1) {
          envStack.splice(lastIndex, 1)
        }
        endIndex++
      }
    }
    
    // Return innermost (last) environment
    return envStack.length > 0 ? envStack[envStack.length - 1] : null
  }

  /**
   * Extracts all packages loaded with \usepackage
   */
  private extractPackages(content: string): string[] {
    const packages: string[] = []
    const matches = content.matchAll(/\\usepackage(?:\[.*?\])?\{([^}]+)\}/g)
    
    for (const match of matches) {
      // Handle multiple packages in one command: \usepackage{pkg1,pkg2}
      const pkgList = match[1].split(',').map(p => p.trim())
      packages.push(...pkgList)
    }
    
    return [...new Set(packages)] // Remove duplicates
  }

  /**
   * Extracts custom commands defined with \newcommand
   */
  private extractCustomCommands(content: string): CustomCommand[] {
    const commands: CustomCommand[] = []
    
    // Match \newcommand{\name}[params]{definition}
    const matches = content.matchAll(/\\newcommand\{\\([^}]+)\}(?:\[(\d+)\])?\{([^}]+)\}/g)
    
    for (const match of matches) {
      commands.push({
        name: match[1],
        paramCount: parseInt(match[2] || '0'),
        definition: match[3],
      })
    }
    
    return commands
  }

  /**
   * Gets recently used commands before cursor position
   * Returns up to 10 most recent unique commands
   */
  private getRecentCommands(content: string, cursor: number): string[] {
    const beforeCursor = content.slice(Math.max(0, cursor - 1000), cursor)
    const commands: string[] = []
    
    // Match LaTeX commands: \commandname
    const matches = Array.from(beforeCursor.matchAll(/\\([a-zA-Z]+)/g))
    
    // Get last 10 unique commands in reverse order
    const seen = new Set<string>()
    for (let i = matches.length - 1; i >= 0 && commands.length < 10; i--) {
      const cmd = matches[i][1]
      if (!seen.has(cmd)) {
        seen.add(cmd)
        commands.push(cmd)
      }
    }
    
    return commands
  }

  /**
   * Generates autocomplete suggestions based on document context
   * Results are cached for performance
   */
  getSuggestions(context: DocumentContext): Suggestion[] {
    // Check cache first
    const cached = this.suggestionCache.get(context)
    if (cached) {
      return cached
    }
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(context)
    
    // Cache result
    this.suggestionCache.set(context, suggestions)
    
    return suggestions
  }
  
  /**
   * Internal method that generates suggestions
   */
  private generateSuggestions(context: DocumentContext): Suggestion[] {
    const suggestions: Suggestion[] = []
    
    // Add environment-specific commands first (highest priority)
    if (context.currentEnvironment) {
      const envCommands = ENVIRONMENT_COMMANDS[context.currentEnvironment]
      if (envCommands) {
        suggestions.push(...envCommands.map(s => ({ ...s, sortText: '0_' + s.label })))
      }
    }
    
    // Add custom commands (high priority)
    const customSuggestions = context.customCommands.map(cmd => ({
      label: `\\${cmd.name}`,
      kind: 'function' as const,
      detail: `Custom command (${cmd.paramCount} params)`,
      insertText: `\\${cmd.name}${cmd.paramCount > 0 ? '{$1}' : ''}`,
      documentation: `Definition: ${cmd.definition}`,
      sortText: '1_' + cmd.name,
    }))
    suggestions.push(...customSuggestions)
    
    // Add common commands
    suggestions.push(...COMMON_COMMANDS.map(s => ({ ...s, sortText: '2_' + s.label })))
    
    // Add math commands if in math environment
    if (context.currentEnvironment && this.isMathEnvironment(context.currentEnvironment)) {
      suggestions.push(...MATH_COMMANDS.map(s => ({ ...s, sortText: '1_' + s.label })))
    }
    
    // Add environments (lower priority)
    suggestions.push(...ENVIRONMENTS.map(s => ({ ...s, sortText: '3_' + s.label })))
    
    // Add recently used commands (boost their priority)
    const recentSuggestions = context.recentCommands
      .filter(cmd => !suggestions.some(s => s.label === `\\${cmd}`))
      .map(cmd => ({
        label: `\\${cmd}`,
        kind: 'keyword' as const,
        detail: 'Recently used',
        insertText: `\\${cmd}`,
        sortText: '0_recent_' + cmd,
      }))
    suggestions.push(...recentSuggestions)
    
    return suggestions
  }
  
  /**
   * Checks if an environment is a math environment
   */
  private isMathEnvironment(env: string): boolean {
    const mathEnvs = ['equation', 'align', 'gather', 'multline', 'displaymath', 'eqnarray', 'math']
    return mathEnvs.includes(env)
  }
}
