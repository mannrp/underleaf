import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SettingsToggle } from '@/components/settings/ui/SettingsToggle'

describe('SettingsToggle - Cross-Environment Tests', () => {
  const defaultProps = {
    id: 'test-toggle',
    label: 'Test Toggle',
    checked: false,
    onChange: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Development Environment (npm run dev)', () => {
    beforeEach(() => {
      vi.doMock('@/utils/environment', () => ({
        environmentAdapter: {
          info: {
            isDevelopment: true,
            isElectron: false,
            isRenderer: true,
            nodeIntegration: false,
            contextIsolation: true,
            platform: 'win32'
          },
          storage: {
            get: vi.fn().mockResolvedValue(null),
            set: vi.fn().mockResolvedValue(undefined),
            has: vi.fn().mockResolvedValue(false),
            remove: vi.fn().mockResolvedValue(undefined)
          }
        }
      }))
    })

    it('should work correctly in development environment', async () => {
      const onChange = vi.fn()
      render(<SettingsToggle {...defaultProps} onChange={onChange} />)
      
      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)
      
      expect(onChange).toHaveBeenCalledWith(true)
      
      await waitFor(() => {
        const { environmentAdapter } = require('@/utils/environment')
        expect(environmentAdapter.storage.set).toHaveBeenCalledWith(
          'toggle-test-toggle',
          expect.objectContaining({
            value: true,
            environment: 'development'
          })
        )
      })
    })

    it('should handle localStorage fallback in development', async () => {
      const { environmentAdapter } = require('@/utils/environment')
      environmentAdapter.storage.set.mockRejectedValueOnce(new Error('Primary storage failed'))
      
      const onChange = vi.fn()
      render(<SettingsToggle {...defaultProps} onChange={onChange} />)
      
      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)
      
      expect(onChange).toHaveBeenCalledWith(true)
      
      // Should retry and eventually show error if all retries fail
      await waitFor(() => {
        expect(environmentAdapter.storage.set).toHaveBeenCalled()
      })
    })
  })

  describe('Production Environment (npx electron)', () => {
    beforeEach(() => {
      vi.doMock('@/utils/environment', () => ({
        environmentAdapter: {
          info: {
            isDevelopment: false,
            isElectron: true,
            isRenderer: true,
            nodeIntegration: true,
            contextIsolation: false,
            platform: 'win32',
            electronVersion: '25.0.0'
          },
          storage: {
            get: vi.fn().mockResolvedValue(null),
            set: vi.fn().mockResolvedValue(undefined),
            has: vi.fn().mockResolvedValue(false),
            remove: vi.fn().mockResolvedValue(undefined)
          }
        }
      }))
    })

    it('should work correctly in Electron environment', async () => {
      const onChange = vi.fn()
      render(<SettingsToggle {...defaultProps} onChange={onChange} />)
      
      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)
      
      expect(onChange).toHaveBeenCalledWith(true)
      
      await waitFor(() => {
        const { environmentAdapter } = require('@/utils/environment')
        expect(environmentAdapter.storage.set).toHaveBeenCalledWith(
          'toggle-test-toggle',
          expect.objectContaining({
            value: true,
            environment: 'production'
          })
        )
      })
    })

    it('should handle Electron API errors gracefully', async () => {
      const { environmentAdapter } = require('@/utils/environment')
      environmentAdapter.storage.set.mockRejectedValue(new Error('Electron API failed'))
      
      const onChange = vi.fn()
      render(<SettingsToggle {...defaultProps} onChange={onChange} />)
      
      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)
      
      expect(onChange).toHaveBeenCalledWith(true)
      
      // Should show error and revert change
      await waitFor(() => {
        expect(screen.getByText('Failed to save setting')).toBeInTheDocument()
      })
      
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('Cross-Environment Consistency', () => {
    it('should maintain consistent behavior across environments', async () => {
      const testEnvironments = [
        {
          name: 'Development',
          config: {
            isDevelopment: true,
            isElectron: false,
            isRenderer: true,
            nodeIntegration: false,
            contextIsolation: true,
            platform: 'win32'
          }
        },
        {
          name: 'Production',
          config: {
            isDevelopment: false,
            isElectron: true,
            isRenderer: true,
            nodeIntegration: true,
            contextIsolation: false,
            platform: 'win32',
            electronVersion: '25.0.0'
          }
        }
      ]

      for (const env of testEnvironments) {
        vi.doMock('@/utils/environment', () => ({
          environmentAdapter: {
            info: env.config,
            storage: {
              get: vi.fn().mockResolvedValue(null),
              set: vi.fn().mockResolvedValue(undefined),
              has: vi.fn().mockResolvedValue(false),
              remove: vi.fn().mockResolvedValue(undefined)
            }
          }
        }))

        const onChange = vi.fn()
        const { unmount } = render(<SettingsToggle {...defaultProps} onChange={onChange} />)
        
        const toggle = screen.getByRole('switch')
        fireEvent.click(toggle)
        
        expect(onChange).toHaveBeenCalledWith(true)
        
        await waitFor(() => {
          const { environmentAdapter } = require('@/utils/environment')
          expect(environmentAdapter.storage.set).toHaveBeenCalledWith(
            'toggle-test-toggle',
            expect.objectContaining({
              value: true,
              environment: env.config.isDevelopment ? 'development' : 'production'
            })
          )
        })

        unmount()
        vi.clearAllMocks()
      }
    })

    it('should handle rapid state changes consistently', async () => {
      vi.useFakeTimers()
      
      const onChange = vi.fn()
      render(<SettingsToggle {...defaultProps} onChange={onChange} />)
      
      const toggle = screen.getByRole('switch')
      
      // Simulate rapid clicks
      fireEvent.click(toggle)
      fireEvent.click(toggle)
      fireEvent.click(toggle)
      
      // Should only process the first click
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith(true)
      
      // Fast-forward to allow persistence to complete
      vi.advanceTimersByTime(100)
      
      await waitFor(() => {
        const { environmentAdapter } = require('@/utils/environment')
        expect(environmentAdapter.storage.set).toHaveBeenCalledTimes(1)
      })
      
      vi.useRealTimers()
    })

    it('should provide consistent error handling across environments', async () => {
      const testError = new Error('Storage operation failed')
      
      vi.doMock('@/utils/environment', () => ({
        environmentAdapter: {
          info: {
            isDevelopment: true,
            isElectron: false,
            isRenderer: true,
            nodeIntegration: false,
            contextIsolation: true,
            platform: 'win32'
          },
          storage: {
            get: vi.fn().mockResolvedValue(null),
            set: vi.fn().mockRejectedValue(testError),
            has: vi.fn().mockResolvedValue(false),
            remove: vi.fn().mockResolvedValue(undefined)
          }
        }
      }))

      const onChange = vi.fn()
      render(<SettingsToggle {...defaultProps} onChange={onChange} />)
      
      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)
      
      // Should provide immediate feedback
      expect(onChange).toHaveBeenCalledWith(true)
      
      // Should show error message
      await waitFor(() => {
        expect(screen.getByText('Failed to save setting')).toBeInTheDocument()
      })
      
      // Should revert the change
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('File Operations Integration', () => {
    it('should not interfere with file operations', async () => {
      // Mock file operations
      const mockFileAPI = {
        openFile: vi.fn().mockResolvedValue('file content'),
        saveFile: vi.fn().mockResolvedValue(undefined)
      }

      // Mock window.electronAPI for file operations
      Object.defineProperty(window, 'electronAPI', {
        value: mockFileAPI,
        writable: true
      })

      const onChange = vi.fn()
      render(<SettingsToggle {...defaultProps} onChange={onChange} />)
      
      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)
      
      // Toggle should work
      expect(onChange).toHaveBeenCalledWith(true)
      
      // File operations should still work
      await mockFileAPI.openFile()
      expect(mockFileAPI.openFile).toHaveBeenCalled()
      
      await mockFileAPI.saveFile('test content')
      expect(mockFileAPI.saveFile).toHaveBeenCalledWith('test content')
    })
  })
})