import { describe, it, expect } from 'vitest'
import { environmentAdapter, detectEnvironment } from '../../utils/environment'

describe('Environment Integration Tests', () => {
  it('should detect current test environment correctly', () => {
    const env = detectEnvironment()
    
    // In test environment, we should have:
    expect(env.isRenderer).toBe(true) // Running in browser-like environment
    expect(env.platform).toBeDefined()
    expect(typeof env.isDevelopment).toBe('boolean')
    expect(typeof env.isElectron).toBe('boolean')
    expect(typeof env.nodeIntegration).toBe('boolean')
    expect(typeof env.contextIsolation).toBe('boolean')
  })

  it('should provide working storage adapter', async () => {
    const testKey = 'integration-test-key'
    const testValue = { test: 'integration-value', timestamp: Date.now() }
    
    // Test storage operations
    await environmentAdapter.storage.set(testKey, testValue)
    
    const hasKey = await environmentAdapter.storage.has(testKey)
    expect(hasKey).toBe(true)
    
    const retrievedValue = await environmentAdapter.storage.get(testKey)
    expect(retrievedValue).toEqual(testValue)
    
    await environmentAdapter.storage.remove(testKey)
    
    const hasKeyAfterRemoval = await environmentAdapter.storage.has(testKey)
    expect(hasKeyAfterRemoval).toBe(false)
  })

  it('should handle storage errors gracefully', async () => {
    // Test with invalid key that might cause issues
    const result = await environmentAdapter.storage.get('')
    expect(result).toBeNull()
  })

  it('should provide consistent environment info', () => {
    const env1 = detectEnvironment()
    const env2 = detectEnvironment()
    
    // Environment detection should be consistent
    expect(env1).toEqual(env2)
  })
})