import * as monaco from 'monaco-editor'
import { themes } from './tokens'

export const defineMonacoThemes = () => {
  // Dark theme
  monaco.editor.defineTheme('underleaf-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: themes.dark.colors.text.tertiary.replace('#', '') },
      { token: 'keyword', foreground: themes.dark.colors.accent.primary.replace('#', ''), fontStyle: 'bold' },
      { token: 'string', foreground: themes.dark.colors.accent.success.replace('#', '') },
      { token: 'number', foreground: themes.dark.colors.accent.warning.replace('#', '') },
    ],
    colors: {
      'editor.background': themes.dark.colors.bg.primary,
      'editor.foreground': themes.dark.colors.text.primary,
      'editor.lineHighlightBackground': themes.dark.colors.bg.secondary,
      'editorLineNumber.foreground': themes.dark.colors.text.tertiary,
      'editorLineNumber.activeForeground': themes.dark.colors.text.secondary,
      'editor.selectionBackground': themes.dark.colors.accent.primary + '40',
      'editor.inactiveSelectionBackground': themes.dark.colors.accent.primary + '20',
      'editorCursor.foreground': themes.dark.colors.accent.primary,
      'editorWhitespace.foreground': themes.dark.colors.text.tertiary + '40',
      'editorIndentGuide.background': themes.dark.colors.border,
      'editorIndentGuide.activeBackground': themes.dark.colors.text.tertiary,
    },
  })

  // Light theme
  monaco.editor.defineTheme('underleaf-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: themes.light.colors.text.tertiary.replace('#', '') },
      { token: 'keyword', foreground: themes.light.colors.accent.primary.replace('#', ''), fontStyle: 'bold' },
      { token: 'string', foreground: themes.light.colors.accent.success.replace('#', '') },
      { token: 'number', foreground: themes.light.colors.accent.warning.replace('#', '') },
    ],
    colors: {
      'editor.background': themes.light.colors.bg.primary,
      'editor.foreground': themes.light.colors.text.primary,
      'editor.lineHighlightBackground': themes.light.colors.bg.secondary,
      'editorLineNumber.foreground': themes.light.colors.text.tertiary,
      'editorLineNumber.activeForeground': themes.light.colors.text.secondary,
      'editor.selectionBackground': themes.light.colors.accent.primary + '40',
      'editor.inactiveSelectionBackground': themes.light.colors.accent.primary + '20',
      'editorCursor.foreground': themes.light.colors.accent.primary,
      'editorWhitespace.foreground': themes.light.colors.text.tertiary + '40',
      'editorIndentGuide.background': themes.light.colors.border,
      'editorIndentGuide.activeBackground': themes.light.colors.text.tertiary,
    },
  })

  // Glassy theme (based on dark with solid colors for Monaco)
  monaco.editor.defineTheme('underleaf-glassy', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: themes.glassy.colors.text.tertiary.replace('#', '') },
      { token: 'keyword', foreground: themes.glassy.colors.accent.primary.replace('#', ''), fontStyle: 'bold' },
      { token: 'string', foreground: themes.glassy.colors.accent.success.replace('#', '') },
      { token: 'number', foreground: themes.glassy.colors.accent.warning.replace('#', '') },
    ],
    colors: {
      'editor.background': '#0a0a0a', // Solid color instead of rgba
      'editor.foreground': themes.glassy.colors.text.primary,
      'editor.lineHighlightBackground': '#141414', // Solid color instead of rgba
      'editorLineNumber.foreground': themes.glassy.colors.text.tertiary,
      'editorLineNumber.activeForeground': themes.glassy.colors.text.secondary,
      'editor.selectionBackground': themes.glassy.colors.accent.primary + '40',
      'editor.inactiveSelectionBackground': themes.glassy.colors.accent.primary + '20',
      'editorCursor.foreground': themes.glassy.colors.accent.primary,
      'editorWhitespace.foreground': themes.glassy.colors.text.tertiary + '40',
      'editorIndentGuide.background': '#ffffff1a', // Solid hex with alpha
      'editorIndentGuide.activeBackground': themes.glassy.colors.text.tertiary,
    },
  })
}

export const getMonacoThemeName = (themeName: string): string => {
  switch (themeName) {
    case 'dark':
      return 'underleaf-dark'
    case 'light':
      return 'underleaf-light'
    case 'glassy':
      return 'underleaf-glassy'
    default:
      return 'underleaf-dark'
  }
}
