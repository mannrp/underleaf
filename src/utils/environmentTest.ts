/**
 * Simple test utility to verify environment detection and storage
 * This can be called from the browser console to debug issues
 */

import { environmentAdapter } from './environment'

export async function testEnvironment() {
  console.log('=== Environment Test ===')
  console.log('Environment info:', environmentAdapter.info)
  
  // Test storage
  console.log('\n=== Storage Test ===')
  
  try {
    // Test setting a value
    const testData = { test: true, timestamp: Date.now() }
    console.log('Setting test data:', testData)
    await environmentAdapter.storage.set('test', testData)
    
    // Test getting the value
    const retrieved = await environmentAdapter.storage.get('test')
    console.log('Retrieved test data:', retrieved)
    
    // Test has method
    const hasTest = await environmentAdapter.storage.has('test')
    console.log('Has test data:', hasTest)
    
    // Clean up
    await environmentAdapter.storage.remove('test')
    console.log('Cleaned up test data')
    
    console.log('✅ Storage test passed')
  } catch (error) {
    console.error('❌ Storage test failed:', error)
  }
  
  // Test settings loading
  console.log('\n=== Settings Test ===')
  try {
    const settings = await environmentAdapter.storage.get('settings')
    console.log('Current settings:', settings)
    console.log('✅ Settings test passed')
  } catch (error) {
    console.error('❌ Settings test failed:', error)
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).testEnvironment = testEnvironment
}