import Tesseract from 'tesseract.js'

export class OCRService {
  private worker: Tesseract.Worker | null = null

  async initialize(onProgress?: (progress: number) => void): Promise<void> {
    if (this.worker) return

    this.worker = await Tesseract.createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && onProgress) {
          onProgress(m.progress)
        }
      },
    })
  }

  async extractText(imageFile: File, onProgress?: (progress: number) => void): Promise<string> {
    if (!this.worker) {
      await this.initialize(onProgress)
    }

    const {
      data: { text },
    } = await this.worker!.recognize(imageFile)

    return text.trim()
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate()
      this.worker = null
    }
  }
}

// Singleton instance
let ocrServiceInstance: OCRService | null = null

export function getOCRService(): OCRService {
  if (!ocrServiceInstance) {
    ocrServiceInstance = new OCRService()
  }
  return ocrServiceInstance
}
