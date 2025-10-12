import { useSettingsStore } from '@/stores/settingsStore'
import { SettingsToggle } from '../ui/SettingsToggle'
import { SettingsSlider } from '../ui/SettingsSlider'
import { SettingsSelect, SelectOption } from '../ui/SettingsSelect'
import { Monitor, Type, Map, Hash, Indent, FileText } from 'lucide-react'

export function EditorSettings() {
  const { editor, updateEditor } = useSettingsStore()

  // Tab size options
  const tabSizeOptions: SelectOption[] = [
    { value: '2', label: '2 spaces', description: 'Compact indentation' },
    { value: '4', label: '4 spaces', description: 'Standard indentation' },
    { value: '8', label: '8 spaces', description: 'Wide indentation' }
  ]

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
          <Monitor className="mr-3 text-green-500" size={28} />
          Editor Settings
        </h3>
        <p className="text-gray-400">
          Configure your LaTeX editing experience with display options and formatting preferences
        </p>
      </div>

      {/* Display Options Section */}
      <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-6 border border-green-700/30">
        <h4 className="text-white font-semibold mb-6 flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
          Display Options
        </h4>
        
        <div className="space-y-2">
          <SettingsToggle
            id="editor-line-numbers"
            label="Show Line Numbers"
            description="Display line numbers in the editor gutter for easy navigation"
            checked={editor.lineNumbers}
            onChange={(checked) => updateEditor({ lineNumbers: checked })}
          />
          
          <SettingsToggle
            id="editor-word-wrap"
            label="Word Wrap"
            description="Wrap long lines to fit within the editor viewport"
            checked={editor.wordWrap}
            onChange={(checked) => updateEditor({ wordWrap: checked })}
          />
          
          <SettingsToggle
            id="editor-minimap"
            label="Show Minimap"
            description="Display a miniature overview of your document for quick navigation"
            checked={editor.minimap}
            onChange={(checked) => updateEditor({ minimap: checked })}
          />
        </div>
      </div>

      {/* Formatting Options Section */}
      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-6 border border-blue-700/30">
        <h4 className="text-white font-semibold mb-6 flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
          Formatting Options
        </h4>
        
        <div className="space-y-2">
          <SettingsSelect
            label="Tab Size"
            description="Number of spaces for each indentation level"
            value={editor.tabSize.toString()}
            options={tabSizeOptions}
            onChange={(value) => updateEditor({ tabSize: parseInt(value) })}
          />
          
          <SettingsToggle
            id="editor-insert-spaces"
            label="Insert Spaces"
            description="Use spaces instead of tab characters for indentation"
            checked={editor.insertSpaces}
            onChange={(checked) => updateEditor({ insertSpaces: checked })}
          />
        </div>
      </div>

      {/* Typography Section */}
      <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-6 border border-purple-700/30">
        <h4 className="text-white font-semibold mb-6 flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
          Typography
        </h4>
        
        <div className="space-y-2">
          <SettingsSlider
            label="Font Size"
            description="Adjust the editor font size for better readability"
            value={editor.fontSize}
            min={8}
            max={72}
            step={1}
            unit="px"
            onChange={(value) => updateEditor({ fontSize: value })}
            formatValue={(value) => `${value}px`}
          />
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-gradient-to-br from-teal-900/30 to-teal-800/20 rounded-xl p-6 border border-teal-700/30">
        <h4 className="text-white font-semibold mb-4 flex items-center">
          <div className="w-3 h-3 bg-teal-500 rounded-full mr-3"></div>
          Live Preview
        </h4>
        <p className="text-gray-400 text-sm mb-4">
          Changes are applied immediately to the editor. Your preferences are automatically saved.
        </p>
        
        {/* Settings Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Hash size={16} className={editor.lineNumbers ? 'text-green-400' : 'text-gray-500'} />
            <span className={editor.lineNumbers ? 'text-green-400' : 'text-gray-500'}>
              Line Numbers: {editor.lineNumbers ? 'On' : 'Off'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <FileText size={16} className={editor.wordWrap ? 'text-green-400' : 'text-gray-500'} />
            <span className={editor.wordWrap ? 'text-green-400' : 'text-gray-500'}>
              Word Wrap: {editor.wordWrap ? 'On' : 'Off'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Map size={16} className={editor.minimap ? 'text-green-400' : 'text-gray-500'} />
            <span className={editor.minimap ? 'text-green-400' : 'text-gray-500'}>
              Minimap: {editor.minimap ? 'On' : 'Off'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Indent size={16} className="text-blue-400" />
            <span className="text-blue-400">
              Tab Size: {editor.tabSize} {editor.insertSpaces ? 'spaces' : 'tabs'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Type size={16} className="text-purple-400" />
            <span className="text-purple-400">
              Font: {editor.fontSize}px
            </span>
          </div>
        </div>
      </div>

      {/* Additional Settings Section for Testing Scrolling */}
      <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 rounded-xl p-6 border border-indigo-700/30">
        <h4 className="text-white font-semibold mb-4 flex items-center">
          <div className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></div>
          Advanced Options
        </h4>
        <p className="text-gray-400 text-sm mb-4">
          Additional editor configuration options for power users.
        </p>
        
        <div className="space-y-2">
          <SettingsToggle
            id="editor-auto-close-brackets"
            label="Auto-close Brackets"
            description="Automatically close brackets, quotes, and parentheses"
            checked={true}
            onChange={() => {}}
          />
          
          <SettingsToggle
            id="editor-highlight-brackets"
            label="Highlight Matching Brackets"
            description="Highlight matching brackets when cursor is positioned on one"
            checked={true}
            onChange={() => {}}
          />
          
          <SettingsToggle
            id="editor-show-whitespace"
            label="Show Whitespace"
            description="Display whitespace characters like spaces and tabs"
            checked={false}
            onChange={() => {}}
          />
          
          <SettingsSlider
            label="Cursor Blink Rate"
            description="Control how fast the cursor blinks (in milliseconds)"
            value={530}
            min={0}
            max={2000}
            step={50}
            unit="ms"
            onChange={() => {}}
          />
        </div>
      </div>

      {/* LaTeX Specific Settings */}
      <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 rounded-xl p-6 border border-amber-700/30">
        <h4 className="text-white font-semibold mb-4 flex items-center">
          <div className="w-3 h-3 bg-amber-500 rounded-full mr-3"></div>
          LaTeX Features
        </h4>
        <p className="text-gray-400 text-sm mb-4">
          LaTeX-specific editor enhancements and features.
        </p>
        
        <div className="space-y-2">
          <SettingsToggle
            id="latex-auto-complete"
            label="Auto-complete Commands"
            description="Automatically suggest LaTeX commands as you type"
            checked={true}
            onChange={() => {}}
          />
          
          <SettingsToggle
            id="latex-math-highlighting"
            label="Math Mode Highlighting"
            description="Special syntax highlighting for math environments"
            checked={true}
            onChange={() => {}}
          />
          
          <SettingsToggle
            id="latex-error-squiggles"
            label="Error Squiggles"
            description="Show red underlines for LaTeX syntax errors"
            checked={true}
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  )
}