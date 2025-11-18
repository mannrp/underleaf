/**
 * Document Agent Service
 * AI-powered document editing with natural language requests
 */

import { LLMService } from './llmService'
import { ChatMessage } from '@/stores/aiStore'

export interface Change {
  type: 'replace' | 'insert' | 'delete'
  startLine: number
  endLine: number
  newContent: string
}

export interface EditResponse {
  explanation: string
  changes: Change[]
}

export class DocumentAgent {
  constructor(private llmService: LLMService) {}

  /**
   * Processes an edit request from the user
   */
  async processEditRequest(
    request: string,
    currentDocument: string,
    chatHistory: ChatMessage[]
  ): Promise<EditResponse> {
    const prompt = this.buildEditPrompt(request, currentDocument, chatHistory)
    const response = await this.llmService.callLLM(prompt)
    
    return this.parseEditResponse(response)
  }

  /**
   * Builds the prompt for the LLM
   */
  private buildEditPrompt(
    request: string,
    document: string,
    history: ChatMessage[]
  ): string {
    const historyText = history.length > 0
      ? `\n\nPrevious conversation:\n${this.formatHistory(history)}`
      : ''

    return `You are a LaTeX document editor. The user wants to make changes to their document.

Current document:
\`\`\`latex
${document}
\`\`\`${historyText}

User request: ${request}

Provide your response as JSON with this exact structure:
{
  "explanation": "Brief explanation of changes you will make",
  "changes": [
    {
      "type": "replace" | "insert" | "delete",
      "startLine": number (1-indexed),
      "endLine": number (1-indexed),
      "newContent": "the new content (empty string for delete)"
    }
  ]
}

Rules:
- Only suggest changes that directly address the user's request
- Be precise with line numbers (1-indexed)
- For replace: startLine and endLine define the range to replace
- For insert: insert newContent before startLine
- For delete: remove lines from startLine to endLine
- Return valid JSON only, no other text

Only return valid JSON, no other text.`
  }

  /**
   * Formats chat history for the prompt
   */
  private formatHistory(history: ChatMessage[]): string {
    return history
      .slice(-5) // Only include last 5 messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n')
  }

  /**
   * Parses the LLM response into an EditResponse
   */
  private parseEditResponse(response: string): EditResponse {
    try {
      // Try to extract JSON from markdown code blocks if present
      let jsonStr = response.trim()
      const jsonMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1].trim()
      }
      
      const json = JSON.parse(jsonStr)
      
      // Validate the response structure
      if (!json.explanation || !Array.isArray(json.changes)) {
        throw new Error('Invalid response structure: missing explanation or changes array')
      }
      
      return {
        explanation: json.explanation,
        changes: json.changes,
      }
    } catch (error) {
      console.error('Failed to parse LLM response:', response)
      console.error('Parse error:', error)
      throw new Error(`Failed to parse LLM response as JSON: ${error instanceof Error ? error.message : String(error)}`)
    }
  }


  /**
   * Applies changes to a document
   */
  applyChanges(document: string, changes: Change[]): string {
    const lines = document.split('\n')
    
    // Sort changes by line number (descending) to avoid offset issues
    const sortedChanges = [...changes].sort((a, b) => b.startLine - a.startLine)
    
    for (const change of sortedChanges) {
      const startIdx = change.startLine - 1 // Convert to 0-indexed
      const endIdx = change.endLine - 1
      
      switch (change.type) {
        case 'replace':
          // Replace lines from startLine to endLine with newContent
          lines.splice(startIdx, endIdx - startIdx + 1, change.newContent)
          break
          
        case 'insert':
          // Insert newContent before startLine
          lines.splice(startIdx, 0, change.newContent)
          break
          
        case 'delete':
          // Delete lines from startLine to endLine
          lines.splice(startIdx, endIdx - startIdx + 1)
          break
      }
    }
    
    return lines.join('\n')
  }
}
