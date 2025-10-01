import { useEditorStore } from '@/stores/editorStore'

export function StatusBar() {
  const { isCompiling, compilationResult, autoCompileEnabled, filePath } = useEditorStore()
  
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
    if (isCompiling) return 'text-yellow-400'
    if (compilationResult?.success) return 'text-green-400'
    if (compilationResult && !compilationResult.success) return 'text-red-400'
    return 'text-gray-400'
  }
  
  return (
    <div className="h-7 bg-gray-800 border-t border-gray-700 px-4 flex items-center justify-between text-sm">
      <div className="flex items-center gap-4">
        <span className={getStatusColor()}>
          {getStatusText()}
        </span>
        {autoCompileEnabled && filePath && (
          <span className="text-green-400 text-xs">
            Auto-compile enabled
          </span>
        )}
      </div>
      
      <div className="text-gray-400">
        {filePath && (
          <span className="text-xs">
            {filePath.split('\\').pop() || filePath.split('/').pop()}
          </span>
        )}
      </div>
    </div>
  )
}