import type { LLMProvider } from '@/stores/settingsStore'

export class LLMService {
  constructor(
    private provider: LLMProvider,
    private apiKey: string,
    private model: string,
    private baseUrl?: string
  ) {}

  async callLLM(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      switch (this.provider) {
        case 'gemini':
          return await this.callGemini(prompt, systemPrompt)
        case 'openai':
          return await this.callOpenAI(prompt, systemPrompt)
        case 'anthropic':
          return await this.callAnthropic(prompt, systemPrompt)
        case 'ollama':
          return await this.callOllama(prompt, systemPrompt)
        default:
          throw new Error(`Unsupported provider: ${this.provider}`)
      }
    } catch (error) {
      console.error('LLM call failed:', error)
      throw error
    }
  }

  private async callGemini(prompt: string, systemPrompt?: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`
    
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Gemini API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  }

  private async callOpenAI(prompt: string, systemPrompt?: string): Promise<string> {
    const url = 'https://api.openai.com/v1/chat/completions'
    
    const messages: Array<{ role: string; content: string }> = []
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }
    messages.push({ role: 'user', content: prompt })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenAI API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  private async callAnthropic(prompt: string, systemPrompt?: string): Promise<string> {
    const url = 'https://api.anthropic.com/v1/messages'

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Anthropic API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    return data.content[0].text
  }

  private async callOllama(prompt: string, systemPrompt?: string): Promise<string> {
    const url = `${this.baseUrl || 'http://localhost:11434'}/api/generate`
    
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: fullPrompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Ollama API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    return data.response
  }

  async convertToLatex(text: string): Promise<string> {
    const prompt = `Convert the following text to LaTeX code. Only return the LaTeX code, no explanations:

${text}`

    const response = await this.callLLM(prompt)
    return this.extractLatexCode(response)
  }

  private extractLatexCode(response: string): string {
    // Try to extract code from markdown code blocks
    const codeBlockMatch = response.match(/```(?:latex)?\n?([\s\S]*?)```/)
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim()
    }
    
    // If no code block, return the whole response
    return response.trim()
  }
}
