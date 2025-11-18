/**
 * Error Analyzer Service
 * Parses LaTeX compilation errors and provides AI-powered analysis
 */

import { LLMService } from './llmService'

export interface ParsedError {
  message: string
  line: number | null
  context: string
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

export class ErrorAnalyzer {
  constructor(private llmService: LLMService) {}

  /**
   * Analyzes LaTeX compilation errors
   */
  async analyzeError(errorLog: string, sourceCode: string): Promise<ErrorAnalysis> {
    const parsedErrors = this.parseLatexLog(errorLog)
    
    const analyses = await Promise.all(
      parsedErrors.map(error => this.analyzeIndividualError(error, sourceCode))
    )
    
    return {
      errors: analyses,
      canAutoFix: analyses.every(a => a.fix !== null),
    }
  }

  /**
   * Parses LaTeX log file to extract errors
   */
  parseLatexLog(log: string): ParsedError[] {
    const errors: ParsedError[] = []
    const errorPattern = /^! (.+?)$/gm
    const linePattern = /l\.(\d+)/
    
    let match
    while ((match = errorPattern.exec(log)) !== null) {
      const errorMessage = match[1]
      const lineMatch = log.slice(match.index).match(linePattern)
      const lineNumber = lineMatch ? parseInt(lineMatch[1]) : null
      
      errors.push({
        message: errorMessage,
        line: lineNumber,
        context: this.extractErrorContext(log, match.index),
      })
    }
    
    return errors
  }

  /**
   * Extracts context around an error in the log
   */
  private extractErrorContext(log: string, errorIndex: number): string {
    const lines = log.split('\n')
    let currentPos = 0
    let errorLineIndex = 0
    
    for (let i = 0; i < lines.length; i++) {
      currentPos += lines[i].length + 1
      if (currentPos >= errorIndex) {
        errorLineIndex = i
        break
      }
    }
    
    // Get 2 lines before and after
    const start = Math.max(0, errorLineIndex - 2)
    const end = Math.min(lines.length, errorLineIndex + 3)
    return lines.slice(start, end).join('\n')
  }

  /**
   * Analyzes a single error using LLM
   */
  private async analyzeIndividualError(
    error: ParsedError,
    sourceCode: string
  ): Promise<ErrorAnalysisResult> {
    const codeContext = this.getCodeContext(sourceCode, error.line)
    
    const prompt = `Analyze this LaTeX compilation error and suggest a fix.

Error: ${error.message}
Line ${error.line}: ${codeContext}

Provide your response as JSON with this exact structure:
{
  "explanation": "Brief explanation of what caused the error",
  "fix": "The corrected line of code (or null if cannot fix)",
  "line": ${error.line}
}

Only return valid JSON, no other text.`
    
    try {
      const response = await this.llmService.callLLM(prompt)
      const parsed = JSON.parse(response)
      
      return {
        message: error.message,
        line: error.line,
        explanation: parsed.explanation || 'Unable to analyze error',
        fix: parsed.fix || null,
      }
    } catch (err) {
      return {
        message: error.message,
        line: error.line,
        explanation: 'Failed to analyze error with AI',
        fix: null,
      }
    }
  }

  /**
   * Gets code context around a specific line
   */
  private getCodeContext(sourceCode: string, line: number | null): string {
    if (!line) return ''
    
    const lines = sourceCode.split('\n')
    const targetLine = line - 1 // Convert to 0-indexed
    
    if (targetLine < 0 || targetLine >= lines.length) return ''
    
    // Get 2 lines before and after
    const start = Math.max(0, targetLine - 2)
    const end = Math.min(lines.length, targetLine + 3)
    
    return lines.slice(start, end).join('\n')
  }

  /**
   * Applies a fix to the source code
   */
  applyFix(sourceCode: string, fix: ErrorAnalysisResult): string {
    if (!fix.fix || !fix.line) return sourceCode
    
    const lines = sourceCode.split('\n')
    const targetLine = fix.line - 1 // Convert to 0-indexed
    
    if (targetLine >= 0 && targetLine < lines.length) {
      lines[targetLine] = fix.fix
    }
    
    return lines.join('\n')
  }
}
