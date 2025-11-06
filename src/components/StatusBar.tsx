import { useEditorStore } from '@/stores/editorStore'
import { useThemeStore } from '@/stores/themeStore'
import { cn } from '@/lib/utils'

export function StatusBar() {
  const { isCompiling, compilationResult, autoCompileEnabled, filePath } = useEditorStore()
  const { glassEffectEnabled, theme } = useThemeStore()
  
  const getStatusText = () => {
    if (isCompiling) {
      return '● Compiling...'
    }
    
    if (compilationResult?.success) {
      return '● Compiled successfully'
    }
    
    if (compilationResult && !compilationResult.success) {
      return '● Compilation failed'
    }
    
    return 'Ready'
  }
  
  const getStatusColor = () => {
    if (isCompiling) return 'text-accent-warning'
    if (compilationResult?.success) return 'text-accent-success'
    if (compilationResult && !compilationResult.success) return 'text-accent-error'
    return 'text-text-secondary'
  }
  
  const glassClasses = glassEffectEnabled && theme.glass.enabled
    ? "backdrop-blur-glass bg-opacity-glass"
    : ""
  
  return (
    <div className={cn(
      "h-7 bg-bg-secondary border-t border-border px-4 flex items-center justify-between text-sm",
      glassClasses
    )}>
      <div className="flex items-center gap-4">
        <span className={getStatusColor()}>
          {getStatusText()}
        </span>
        {autoCompileEnabled && filePath && (
          <span className="text-accent-success text-xs">
            Auto-compile enabled
          </span>
        )}
      </div>
      
      <div className="text-text-secondary">
        {filePath && (
          <span className="text-xs">
            {filePath.split('\\').pop() || filePath.split('/').pop()}
          </span>
        )}
      </div>
    </div>
  )
}