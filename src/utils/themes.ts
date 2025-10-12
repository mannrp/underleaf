/**
 * Theme configuration system for Underleaf LaTeX Editor
 * Provides comprehensive theme definitions for light/dark modes and color schemes
 */

export interface ThemeColors {
  // Background colors
  background: string
  backgroundSecondary: string
  backgroundTertiary: string
  
  // Surface colors
  surface: string
  surfaceSecondary: string
  surfaceHover: string
  
  // Text colors
  text: string
  textSecondary: string
  textMuted: string
  textInverse: string
  
  // Border colors
  border: string
  borderSecondary: string
  borderFocus: string
  
  // Accent colors
  primary: string
  primaryHover: string
  secondary: string
  secondaryHover: string
  accent: string
  accentHover: string
  
  // Status colors
  success: string
  warning: string
  error: string
  info: string
  
  // Editor specific colors
  editorBackground: string
  editorGutter: string
  editorSelection: string
  editorCursor: string
  editorLineHighlight: string
}

export interface ThemeConfig {
  name: string
  displayName: string
  mode: 'light' | 'dark'
  colors: ThemeColors
  monacoTheme: string
  syntax: {
    command: string
    environment: string
    math: string
    comment: string
    string: string
    keyword: string
    number: string
    operator: string
    bracket: string
  }
}

// Light theme configuration
export const lightTheme: ThemeConfig = {
  name: 'light',
  displayName: 'Light',
  mode: 'light',
  colors: {
    // Background colors
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    backgroundTertiary: '#f1f5f9',
    
    // Surface colors
    surface: '#ffffff',
    surfaceSecondary: '#f8fafc',
    surfaceHover: '#f1f5f9',
    
    // Text colors
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    textInverse: '#ffffff',
    
    // Border colors
    border: '#e2e8f0',
    borderSecondary: '#cbd5e1',
    borderFocus: '#3b82f6',
    
    // Accent colors
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#64748b',
    secondaryHover: '#475569',
    accent: '#8b5cf6',
    accentHover: '#7c3aed',
    
    // Status colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
    
    // Editor specific colors
    editorBackground: '#ffffff',
    editorGutter: '#f8fafc',
    editorSelection: '#dbeafe',
    editorCursor: '#3b82f6',
    editorLineHighlight: '#f8fafc'
  },
  monacoTheme: 'vs',
  syntax: {
    command: '#dc2626',
    environment: '#059669',
    math: '#7c3aed',
    comment: '#6b7280',
    string: '#0891b2',
    keyword: '#dc2626',
    number: '#ea580c',
    operator: '#374151',
    bracket: '#4b5563'
  }
}

// Dark theme configuration
export const darkTheme: ThemeConfig = {
  name: 'dark',
  displayName: 'Dark',
  mode: 'dark',
  colors: {
    // Background colors
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    backgroundTertiary: '#334155',
    
    // Surface colors
    surface: '#1e293b',
    surfaceSecondary: '#334155',
    surfaceHover: '#475569',
    
    // Text colors
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    textInverse: '#0f172a',
    
    // Border colors
    border: '#334155',
    borderSecondary: '#475569',
    borderFocus: '#60a5fa',
    
    // Accent colors
    primary: '#60a5fa',
    primaryHover: '#3b82f6',
    secondary: '#94a3b8',
    secondaryHover: '#cbd5e1',
    accent: '#a78bfa',
    accentHover: '#8b5cf6',
    
    // Status colors
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#22d3ee',
    
    // Editor specific colors
    editorBackground: '#0f172a',
    editorGutter: '#1e293b',
    editorSelection: '#1e40af',
    editorCursor: '#60a5fa',
    editorLineHighlight: '#1e293b'
  },
  monacoTheme: 'vs-dark',
  syntax: {
    command: '#f87171',
    environment: '#34d399',
    math: '#a78bfa',
    comment: '#9ca3af',
    string: '#22d3ee',
    keyword: '#f87171',
    number: '#fb923c',
    operator: '#d1d5db',
    bracket: '#9ca3af'
  }
}

// Additional color themes
export const monokaiTheme: ThemeConfig = {
  name: 'monokai',
  displayName: 'Monokai',
  mode: 'dark',
  colors: {
    background: '#272822',
    backgroundSecondary: '#3e3d32',
    backgroundTertiary: '#49483e',
    
    surface: '#3e3d32',
    surfaceSecondary: '#49483e',
    surfaceHover: '#5a5a4a',
    
    text: '#f8f8f2',
    textSecondary: '#cfcfc2',
    textMuted: '#75715e',
    textInverse: '#272822',
    
    border: '#49483e',
    borderSecondary: '#5a5a4a',
    borderFocus: '#66d9ef',
    
    primary: '#66d9ef',
    primaryHover: '#4db8d9',
    secondary: '#a6e22e',
    secondaryHover: '#8cc91f',
    accent: '#f92672',
    accentHover: '#e91e63',
    
    success: '#a6e22e',
    warning: '#e6db74',
    error: '#f92672',
    info: '#66d9ef',
    
    editorBackground: '#272822',
    editorGutter: '#3e3d32',
    editorSelection: '#49483e',
    editorCursor: '#f8f8f0',
    editorLineHighlight: '#3e3d32'
  },
  monacoTheme: 'vs-dark',
  syntax: {
    command: '#f92672',
    environment: '#a6e22e',
    math: '#ae81ff',
    comment: '#75715e',
    string: '#e6db74',
    keyword: '#f92672',
    number: '#ae81ff',
    operator: '#f8f8f2',
    bracket: '#f8f8f2'
  }
}

export const solarizedDarkTheme: ThemeConfig = {
  name: 'solarized-dark',
  displayName: 'Solarized Dark',
  mode: 'dark',
  colors: {
    background: '#002b36',
    backgroundSecondary: '#073642',
    backgroundTertiary: '#0f4c5c',
    
    surface: '#073642',
    surfaceSecondary: '#0f4c5c',
    surfaceHover: '#1a5a6b',
    
    text: '#839496',
    textSecondary: '#657b83',
    textMuted: '#586e75',
    textInverse: '#002b36',
    
    border: '#0f4c5c',
    borderSecondary: '#1a5a6b',
    borderFocus: '#268bd2',
    
    primary: '#268bd2',
    primaryHover: '#2176bd',
    secondary: '#2aa198',
    secondaryHover: '#238b83',
    accent: '#d33682',
    accentHover: '#c02670',
    
    success: '#859900',
    warning: '#b58900',
    error: '#dc322f',
    info: '#268bd2',
    
    editorBackground: '#002b36',
    editorGutter: '#073642',
    editorSelection: '#0f4c5c',
    editorCursor: '#839496',
    editorLineHighlight: '#073642'
  },
  monacoTheme: 'vs-dark',
  syntax: {
    command: '#dc322f',
    environment: '#859900',
    math: '#6c71c4',
    comment: '#586e75',
    string: '#2aa198',
    keyword: '#dc322f',
    number: '#d33682',
    operator: '#839496',
    bracket: '#839496'
  }
}

export const solarizedLightTheme: ThemeConfig = {
  name: 'solarized-light',
  displayName: 'Solarized Light',
  mode: 'light',
  colors: {
    background: '#fdf6e3',
    backgroundSecondary: '#eee8d5',
    backgroundTertiary: '#e4dcc6',
    
    surface: '#eee8d5',
    surfaceSecondary: '#e4dcc6',
    surfaceHover: '#d9d0b7',
    
    text: '#657b83',
    textSecondary: '#586e75',
    textMuted: '#93a1a1',
    textInverse: '#fdf6e3',
    
    border: '#e4dcc6',
    borderSecondary: '#d9d0b7',
    borderFocus: '#268bd2',
    
    primary: '#268bd2',
    primaryHover: '#2176bd',
    secondary: '#2aa198',
    secondaryHover: '#238b83',
    accent: '#d33682',
    accentHover: '#c02670',
    
    success: '#859900',
    warning: '#b58900',
    error: '#dc322f',
    info: '#268bd2',
    
    editorBackground: '#fdf6e3',
    editorGutter: '#eee8d5',
    editorSelection: '#e4dcc6',
    editorCursor: '#657b83',
    editorLineHighlight: '#eee8d5'
  },
  monacoTheme: 'vs',
  syntax: {
    command: '#dc322f',
    environment: '#859900',
    math: '#6c71c4',
    comment: '#93a1a1',
    string: '#2aa198',
    keyword: '#dc322f',
    number: '#d33682',
    operator: '#657b83',
    bracket: '#657b83'
  }
}

export const githubLightTheme: ThemeConfig = {
  name: 'github-light',
  displayName: 'GitHub Light',
  mode: 'light',
  colors: {
    background: '#ffffff',
    backgroundSecondary: '#f6f8fa',
    backgroundTertiary: '#f1f3f4',
    
    surface: '#ffffff',
    surfaceSecondary: '#f6f8fa',
    surfaceHover: '#f1f3f4',
    
    text: '#24292f',
    textSecondary: '#57606a',
    textMuted: '#656d76',
    textInverse: '#ffffff',
    
    border: '#d0d7de',
    borderSecondary: '#afb8c1',
    borderFocus: '#0969da',
    
    primary: '#0969da',
    primaryHover: '#0860ca',
    secondary: '#656d76',
    secondaryHover: '#57606a',
    accent: '#8250df',
    accentHover: '#7c3aed',
    
    success: '#1a7f37',
    warning: '#9a6700',
    error: '#cf222e',
    info: '#0969da',
    
    editorBackground: '#ffffff',
    editorGutter: '#f6f8fa',
    editorSelection: '#dbeafe',
    editorCursor: '#0969da',
    editorLineHighlight: '#f6f8fa'
  },
  monacoTheme: 'vs',
  syntax: {
    command: '#cf222e',
    environment: '#1a7f37',
    math: '#8250df',
    comment: '#6e7781',
    string: '#0a3069',
    keyword: '#cf222e',
    number: '#0550ae',
    operator: '#24292f',
    bracket: '#57606a'
  }
}

export const githubDarkTheme: ThemeConfig = {
  name: 'github-dark',
  displayName: 'GitHub Dark',
  mode: 'dark',
  colors: {
    background: '#0d1117',
    backgroundSecondary: '#161b22',
    backgroundTertiary: '#21262d',
    
    surface: '#161b22',
    surfaceSecondary: '#21262d',
    surfaceHover: '#30363d',
    
    text: '#f0f6fc',
    textSecondary: '#8b949e',
    textMuted: '#7d8590',
    textInverse: '#0d1117',
    
    border: '#30363d',
    borderSecondary: '#484f58',
    borderFocus: '#58a6ff',
    
    primary: '#58a6ff',
    primaryHover: '#409cff',
    secondary: '#8b949e',
    secondaryHover: '#b1bac4',
    accent: '#a5a5ff',
    accentHover: '#9d9dff',
    
    success: '#3fb950',
    warning: '#d29922',
    error: '#f85149',
    info: '#58a6ff',
    
    editorBackground: '#0d1117',
    editorGutter: '#161b22',
    editorSelection: '#264f78',
    editorCursor: '#58a6ff',
    editorLineHighlight: '#161b22'
  },
  monacoTheme: 'vs-dark',
  syntax: {
    command: '#f85149',
    environment: '#3fb950',
    math: '#a5a5ff',
    comment: '#8b949e',
    string: '#a5c9ea',
    keyword: '#f85149',
    number: '#79c0ff',
    operator: '#f0f6fc',
    bracket: '#8b949e'
  }
}

// Theme registry
export const themes: Record<string, ThemeConfig> = {
  light: lightTheme,
  dark: darkTheme,
  monokai: monokaiTheme,
  'solarized-dark': solarizedDarkTheme,
  'solarized-light': solarizedLightTheme,
  'github-light': githubLightTheme,
  'github-dark': githubDarkTheme
}

// Theme utilities
export function getTheme(themeName: string): ThemeConfig {
  return themes[themeName] || lightTheme
}

export function getThemeNames(): string[] {
  return Object.keys(themes)
}

export function getThemesByMode(mode: 'light' | 'dark'): ThemeConfig[] {
  return Object.values(themes).filter(theme => theme.mode === mode)
}

export function isValidTheme(themeName: string): boolean {
  return themeName in themes
}

// CSS custom properties generator
export function generateCSSCustomProperties(theme: ThemeConfig): Record<string, string> {
  const properties: Record<string, string> = {}
  
  // Generate CSS custom properties for all theme colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    // Convert camelCase to kebab-case
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    properties[`--color-${cssKey}`] = value
  })
  
  // Add syntax highlighting colors
  Object.entries(theme.syntax).forEach(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    properties[`--syntax-${cssKey}`] = value
  })
  
  return properties
}

// Apply theme to document root
export function applyThemeToDocument(theme: ThemeConfig): void {
  const root = document.documentElement
  const properties = generateCSSCustomProperties(theme)
  
  Object.entries(properties).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
  
  // Add theme class to body for conditional styling
  document.body.className = document.body.className
    .replace(/theme-\w+/g, '')
    .concat(` theme-${theme.name}`)
    .trim()
}