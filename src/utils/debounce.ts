/**
 * Debounce utility for performance optimization
 */

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Memoization cache for expensive computations
 */
export class MemoCache<K, V> {
  private cache = new Map<string, { value: V; timestamp: number }>()
  private maxAge: number
  private maxSize: number

  constructor(maxAge: number = 5000, maxSize: number = 100) {
    this.maxAge = maxAge
    this.maxSize = maxSize
  }

  get(key: K): V | undefined {
    const keyStr = JSON.stringify(key)
    const cached = this.cache.get(keyStr)

    if (!cached) return undefined

    // Check if expired
    if (Date.now() - cached.timestamp > this.maxAge) {
      this.cache.delete(keyStr)
      return undefined
    }

    return cached.value
  }

  set(key: K, value: V): void {
    const keyStr = JSON.stringify(key)

    // Evict oldest if at max size
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(keyStr, {
      value,
      timestamp: Date.now(),
    })
  }

  clear(): void {
    this.cache.clear()
  }
}
