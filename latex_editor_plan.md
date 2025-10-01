# LaTeX Editor - Complete Development Guide

## Project Overview

**Project Name:** LocalTeX Editor  
**Vision:** Side-by-side resizable panes (Code Editor | PDF Preview) like Overleaf  
**Platform:** Windows primary, using **Electron** for easiest development  
**Developer:** Solo developer  
**Repository:** Will be published on GitHub

---

## Technology Decision: Electron vs C#

### C# WPF/WinUI Analysis

**Pros:**
- Native Windows performance
- Smaller binary size (~30-50MB)
- Better system integration
- Direct access to Windows APIs

**Cons:**
- **Text editor is hard** - Need to build LaTeX syntax highlighting from scratch or use AvalonEdit (limited)
- **PDF viewer is hard** - Need to integrate PDFium or similar (complex)
- **Mac support impossible** - Would need complete rewrite
- Steeper learning curve for modern UI
- Limited community resources for this specific use case

### Electron Recommendation: **USE ELECTRON**

**Why Electron wins for your use case:**

1. **Monaco Editor is free** - World-class editor (VS Code) drops in with 10 lines of code
2. **PDF.js works perfectly** - Mature, reliable PDF rendering
3. **Resizable split panes** - Dozens of React libraries (react-split, allotment)
4. **Fast development** - You'll have a working prototype in 2 days vs 2 weeks
5. **Mac support bonus** - Literally free, same codebase
6. **GitHub stars** - More attractive to contributors (modern stack)

**Verdict:** Unless you need <50MB binary size or are already a C# expert, Electron is the clear winner.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                    Application Window                     │
│  ┌─────────────────────────────────────────────────────┐ │
│  │                Toolbar (48px)                       │ │
│  │  [New] [Open] [Save] | [Compile] | [Settings]      │ │
│  └─────────────────────────────────────────────────────┘ │
│  ┌─────────────────┬─────────────────────────────────┐  │
│  │                 │                                  │  │
│  │  LaTeX Editor   │  PDF Preview (resizable)         │  │
│  │  (Monaco)       │  (PDF.js)                        │  │
│  │                 │                                  │  │
│  │  [Code here]    │  [Compiled PDF]                  │  │
│  │                 │                                  │  │
│  │                 │  [Zoom: 100%] [Page 1/5]         │  │
│  └─────────────────┴─────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Status: ● Compiled successfully (0.8s) | Line 42   │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## Complete Step-by-Step Development Guide

### Prerequisites Setup

**Step 0: Install Required Software**

```bash
# 1. Install Node.js (LTS version)
# Download from: https://nodejs.org/
# Verify installation:
node --version  # Should show v20.x.x or higher
npm --version   # Should show v10.x.x or higher

# 2. Install Git
# Download from: https://git-scm.com/
git --version

# 3. Install MiKTeX (LaTeX distribution)
# Download from: https://miktex.org/download
# Choose "Basic MiKTeX Installer" for Windows
# During install: Select "Always install missing packages on-the-fly"

# 4. Install VS Code (recommended editor)
# Download from: https://code.visualstudio.com/
```

---

## Phase 1: Project Setup (Day 1 - Morning)

### Step 1: Create Project Structure

```bash
# Create project directory
mkdir localtex-editor
cd localtex-editor

# Initialize Git
git init

# Create .gitignore
echo "node_modules/
dist/
dist-electron/
*.log
.DS_Store
out/
*.pdf
*.aux
*.log
*.synctex.gz
.env.local" > .gitignore

# Initialize npm project
npm init -y
```

### Step 2: Install Core Dependencies

```bash
# Install Electron and build tools
npm install --save-dev electron electron-builder vite typescript @types/node

# Install React and TypeScript support
npm install react react-dom
npm install --save-dev @types/react @types/react-dom @vitejs/plugin-react

# Install Monaco Editor
npm install @monaco-editor/react monaco-editor

# Install PDF viewer
npm install react-pdf pdfjs-dist

# Install UI components
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
npm install --save-dev tailwindcss postcss autoprefixer

# Install utilities
npm install zustand          # State management
npm install react-resizable-panels  # Resizable split panes
npm install lucide-react     # Icons
npm install chokidar         # File watching
```

### Step 3: Create Project Structure

```bash
# Create directories
mkdir -p electron src/components src/hooks src/stores src/types public

# Create main files
touch electron/main.ts electron/preload.ts
touch src/App.tsx src/main.tsx src/index.css
touch vite.config.ts tsconfig.json tsconfig.node.json
touch electron-builder.json tailwind.config.js postcss.config.js
```

### Step 4: Configure TypeScript

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "electron"]
}
```

### Step 5: Configure Vite

Create `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
})
```

### Step 6: Configure Tailwind CSS

```bash
npx tailwindcss init -p
```

Edit `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Step 7: Update package.json Scripts

Edit `package.json` and add:
```json
{
  "name": "localtex-editor",
  "version": "0.1.0",
  "description": "A beautiful local LaTeX editor with live preview",
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build && tsc -p tsconfig.node.json",
    "electron:dev": "concurrently \"vite\" \"wait-on http://localhost:5173 && electron .\"",
    "electron:build": "npm run build && electron-builder",
    "preview": "vite preview"
  },
  "keywords": ["latex", "editor", "pdf"],
  "author": "Your Name",
  "license": "MIT"
}
```

Install additional dev dependencies:
```bash
npm install --save-dev concurrently wait-on
```

---

## Phase 2: Electron Setup (Day 1 - Afternoon)

### Step 8: Create Electron Main Process

Create `electron/main.ts`:
```typescript
import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { spawn } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // In development, load from Vite dev server
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// IPC Handlers
ipcMain.handle('file:open', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'LaTeX Files', extensions: ['tex'] }],
  })
  
  if (!result.canceled && result.filePaths.length > 0) {
    const content = fs.readFileSync(result.filePaths[0], 'utf-8')
    return { path: result.filePaths[0], content }
  }
  return null
})

ipcMain.handle('file:save', async (_, filePath: string, content: string) => {
  fs.writeFileSync(filePath, content, 'utf-8')
  return true
})

ipcMain.handle('file:saveAs', async (_, content: string) => {
  const result = await dialog.showSaveDialog({
    filters: [{ name: 'LaTeX Files', extensions: ['tex'] }],
  })
  
  if (!result.canceled && result.filePath) {
    fs.writeFileSync(result.filePath, content, 'utf-8')
    return result.filePath
  }
  return null
})

ipcMain.handle('latex:compile', async (_, texFilePath: string) => {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(texFilePath)
    const file = path.basename(texFilePath)
    
    const pdflatex = spawn('pdflatex', [
      '-interaction=nonstopmode',
      '-output-directory=' + dir,
      file
    ], { cwd: dir })
    
    let output = ''
    
    pdflatex.stdout.on('data', (data) => {
      output += data.toString()
    })
    
    pdflatex.stderr.on('data', (data) => {
      output += data.toString()
    })
    
    pdflatex.on('close', (code) => {
      const pdfPath = texFilePath.replace('.tex', '.pdf')
      const logPath = texFilePath.replace('.tex', '.log')
      
      let logs = ''
      if (fs.existsSync(logPath)) {
        logs = fs.readFileSync(logPath, 'utf-8')
      }
      
      resolve({
        success: code === 0 && fs.existsSync(pdfPath),
        pdfPath: fs.existsSync(pdfPath) ? pdfPath : null,
        output,
        logs,
      })
    })
    
    pdflatex.on('error', (err) => {
      reject(err)
    })
  })
})
```

### Step 9: Create Preload Script

Create `electron/preload.ts`:
```typescript
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  fileOpen: () => ipcRenderer.invoke('file:open'),
  fileSave: (path: string, content: string) => 
    ipcRenderer.invoke('file:save', path, content),
  fileSaveAs: (content: string) => 
    ipcRenderer.invoke('file:saveAs', content),
  latexCompile: (path: string) => 
    ipcRenderer.invoke('latex:compile', path),
})
```

### Step 10: Create Type Definitions

Create `src/types/index.ts`:
```typescript
export interface ElectronAPI {
  fileOpen: () => Promise<{ path: string; content: string } | null>
  fileSave: (path: string, content: string) => Promise<boolean>
  fileSaveAs: (content: string) => Promise<string | null>
  latexCompile: (path: string) => Promise<CompilationResult>
}

export interface CompilationResult {
  success: boolean
  pdfPath: string | null
  output: string
  logs: string
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
```

---

## Phase 3: React Application (Day 1 - Evening)

### Step 11: Create State Store

Create `src/stores/editorStore.ts`:
```typescript
import { create } from 'zustand'
import type { CompilationResult } from '@/types'

interface EditorState {
  content: string
  filePath: string | null
  pdfPath: string | null
  isCompiling: boolean
  compilationResult: CompilationResult | null
  
  setContent: (content: string) => void
  setFilePath: (path: string | null) => void
  setPdfPath: (path: string | null) => void
  setIsCompiling: (isCompiling: boolean) => void
  setCompilationResult: (result: CompilationResult | null) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  content: '% Start writing LaTeX here\n\\documentclass{article}\n\\begin{document}\n\nHello, World!\n\n\\end{document}',
  filePath: null,
  pdfPath: null,
  isCompiling: false,
  compilationResult: null,
  
  setContent: (content) => set({ content }),
  setFilePath: (filePath) => set({ filePath }),
  setPdfPath: (pdfPath) => set({ pdfPath }),
  setIsCompiling: (isCompiling) => set({ isCompiling }),
  setCompilationResult: (compilationResult) => set({ compilationResult }),
}))
```

### Step 12: Create Base Components

Create `src/components/Toolbar.tsx`:
```typescript
import { FileText, FolderOpen, Save, Play } from 'lucide-react'
import { useEditorStore } from '@/stores/editorStore'

export function Toolbar() {
  const { filePath, content, setContent, setFilePath, setPdfPath } = useEditorStore()
  
  const handleOpen = async () => {
    const result = await window.electron.fileOpen()
    if (result) {
      setContent(result.content)
      setFilePath(result.path)
    }
  }
  
  const handleSave = async () => {
    if (filePath) {
      await window.electron.fileSave(filePath, content)
    } else {
      const newPath = await window.electron.fileSaveAs(content)
      if (newPath) setFilePath(newPath)
    }
  }
  
  const handleCompile = async () => {
    if (!filePath) {
      alert('Please save the file first')
      return
    }
    
    const result = await window.electron.latexCompile(filePath)
    if (result.success && result.pdfPath) {
      setPdfPath(result.pdfPath)
    } else {
      alert('Compilation failed. Check console for details.')
      console.error(result.output)
    }
  }
  
  return (
    <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-2">
      <button onClick={handleOpen} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2">
        <FolderOpen size={16} />
        Open
      </button>
      <button onClick={handleSave} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2">
        <Save size={16} />
        Save
      </button>
      <div className="w-px h-6 bg-gray-700 mx-2" />
      <button onClick={handleCompile} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded flex items-center gap-2">
        <Play size={16} />
        Compile
      </button>
      <div className="flex-1" />
      <span className="text-sm text-gray-400">
        {filePath ? filePath : 'Untitled'}
      </span>
    </div>
  )
}
```

Create `src/components/Editor.tsx`:
```typescript
import Editor from '@monaco-editor/react'
import { useEditorStore } from '@/stores/editorStore'

export function LatexEditor() {
  const { content, setContent } = useEditorStore()
  
  return (
    <Editor
      height="100%"
      defaultLanguage="latex"
      theme="vs-dark"
      value={content}
      onChange={(value) => setContent(value || '')}
      options={{
        fontSize: 14,
        minimap: { enabled: true },
        wordWrap: 'on',
        automaticLayout: true,
      }}
    />
  )
}
```

Create `src/components/PDFViewer.tsx`:
```typescript
import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useEditorStore } from '@/stores/editorStore'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

export function PDFViewer() {
  const { pdfPath } = useEditorStore()
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  
  if (!pdfPath) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
        <div className="text-center">
          <p className="text-lg">No PDF compiled yet</p>
          <p className="text-sm mt-2">Click Compile to see preview</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full bg-gray-900 overflow-auto">
      <Document
        file={`file://${pdfPath}`}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      
      {numPages > 0 && (
        <div className="fixed bottom-4 right-4 bg-gray-800 px-4 py-2 rounded shadow-lg">
          <span className="text-sm text-gray-300">
            Page {pageNumber} of {numPages}
          </span>
        </div>
      )}
    </div>
  )
}
```

### Step 13: Create Main App Component

Create `src/App.tsx`:
```typescript
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Toolbar } from '@/components/Toolbar'
import { LatexEditor } from '@/components/Editor'
import { PDFViewer } from '@/components/PDFViewer'

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <Toolbar />
      
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={50} minSize={30}>
          <LatexEditor />
        </Panel>
        
        <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-blue-500 transition-colors" />
        
        <Panel defaultSize={50} minSize={30}>
          <PDFViewer />
        </Panel>
      </PanelGroup>
    </div>
  )
}
```

### Step 14: Create Entry Points

Create `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LocalTeX Editor</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `src/main.tsx`:
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

Create `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  overflow: hidden;
}

#root {
  height: 100vh;
}
```

---

## Phase 4: Building and Running (Day 2 - Morning)

### Step 15: Configure electron-builder

Create `electron-builder.json`:
```json
{
  "appId": "com.localtex.editor",
  "productName": "LocalTeX Editor",
  "directories": {
    "output": "release",
    "buildResources": "build"
  },
  "files": [
    "dist/**/*",
    "dist-electron/**/*"
  ],
  "win": {
    "target": [
      {
        "target": "nsis",
        "arch": ["x64"]
      }
    ],
    "icon": "build/icon.ico"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true
  }
}
```

### Step 16: First Run

```bash
# Run in development mode
npm run electron:dev
```

**You should now see:**
- Window opens with dark theme
- Left side: Monaco editor with sample LaTeX
- Right side: "No PDF compiled yet" message
- Top: Toolbar with Open, Save, Compile buttons

### Step 17: Test Basic Workflow

1. Click "Save" → Choose location → Save as `test.tex`
2. Click "Compile" → Should create `test.pdf`
3. Right side should show compiled PDF

**If compilation fails:**
- Verify MiKTeX is installed: `pdflatex --version` in CMD
- Check if `pdflatex` is in PATH
- Look at console for error messages

---

## Phase 5: Polish and Features (Day 2 - Afternoon)

### Step 18: Add Auto-Compile

Update `src/hooks/useAutoCompile.ts`:
```typescript
import { useEffect, useRef } from 'react'
import { useEditorStore } from '@/stores/editorStore'

export function useAutoCompile(enabled: boolean, delay: number = 1000) {
  const { content, filePath, setPdfPath } = useEditorStore()
  const timeoutRef = useRef<NodeJS.Timeout>()
  
  useEffect(() => {
    if (!enabled || !filePath) return
    
    clearTimeout(timeoutRef.current)
    
    timeoutRef.current = setTimeout(async () => {
      await window.electron.fileSave(filePath, content)
      const result = await window.electron.latexCompile(filePath)
      if (result.success && result.pdfPath) {
        setPdfPath(result.pdfPath)
      }
    }, delay)
    
    return () => clearTimeout(timeoutRef.current)
  }, [content, filePath, enabled, delay])
}
```

Add to `App.tsx`:
```typescript
import { useAutoCompile } from '@/hooks/useAutoCompile'

export default function App() {
  useAutoCompile(true) // Enable auto-compile
  // ... rest of component
}
```

### Step 19: Add Status Bar

Create `src/components/StatusBar.tsx`:
```typescript
import { useEditorStore } from '@/stores/editorStore'

export function StatusBar() {
  const { isCompiling, compilationResult } = useEditorStore()
  
  return (
    <div className="h-7 bg-gray-800 border-t border-gray-700 px-4 flex items-center text-sm text-gray-400">
      {isCompiling ? (
        <span className="text-yellow-400">● Compiling...</span>
      ) : compilationResult?.success ? (
        <span className="text-green-400">● Compiled successfully</span>
      ) : compilationResult ? (
        <span className="text-red-400">● Compilation failed</span>
      ) : (
        <span>Ready</span>
      )}
    </div>
  )
}
```

Add to `App.tsx` after PanelGroup.

### Step 20: Improve PDF Viewer

Update `PDFViewer.tsx` to add zoom and navigation:
```typescript
import { useState } from 'react'
import { Document, Page } from 'react-pdf'
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEditorStore } from '@/stores/editorStore'

export function PDFViewer() {
  const { pdfPath } = useEditorStore()
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  
  if (!pdfPath) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
        <div className="text-center">
          <p className="text-lg">No PDF compiled yet</p>
          <p className="text-sm mt-2">Save and compile to see preview</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Controls */}
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-center gap-4 px-4">
        <button
          onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
          disabled={pageNumber <= 1}
          className="p-1 hover:bg-gray-700 rounded disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>
        
        <span className="text-sm text-gray-300 min-w-[100px] text-center">
          {pageNumber} / {numPages}
        </span>
        
        <button
          onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
          disabled={pageNumber >= numPages}
          className="p-1 hover:bg-gray-700 rounded disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>
        
        <div className="w-px h-6 bg-gray-700 mx-2" />
        
        <button
          onClick={() => setScale(Math.max(0.5, scale - 0.1))}
          className="p-1 hover:bg-gray-700 rounded"
        >
          <ZoomOut size={20} />
        </button>
        
        <span className="text-sm text-gray-300 min-w-[60px] text-center">
          {Math.round(scale * 100)}%
        </span>
        
        <button
          onClick={() => setScale(Math.min(3, scale + 0.1))}
          className="p-1 hover:bg-gray-700 rounded"
        >
          <ZoomIn size={20} />
        </button>
      </div>
      
      {/* PDF Content */}
      <div className="flex-1 overflow-auto flex justify-center p-4">
        <Document
          file={`file://${pdfPath}`}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          <Page pageNumber={pageNumber} scale={scale} />
        </Document>
      </div>
    </div>
  )
}
```

---

## Phase 6: GitHub and Distribution (Day 2 - Evening)

### Step 21: Create README.md

```markdown
# LocalTeX Editor

A beautiful local LaTeX editor with live PDF preview, inspired by Overleaf.

## Features

- 🎨 Clean, modern UI with resizable split panes
- ⚡ Live PDF preview with auto-compile
- 📝 Monaco editor (same as VS Code)
- 🔍 Zoom and navigation controls
- 💾 Auto-save functionality
- 🪟 Windows native (Mac support coming)

## Installation

### Prerequisites
- [MiKTeX](https://miktex.org/download) (LaTeX distribution)
- Windows 10 or later

### Download
Download the latest release from the [Releases](https://github.com/yourusername/localtex-editor/releases) page.

## Development

### Setup
```bash
npm install
npm run electron:dev
```

### Build
```bash
npm run electron:build
```

## License
MIT

## Contributing
Pull requests welcome!
```

### Step 22: Prepare for GitHub

```bash
# Create LICENSE file
echo "MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the \"Software\"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE." > LICENSE

# Create .github/workflows directory for GitHub Actions (optional)
mkdir -p .github/workflows
```

### Step 23: Create GitHub Actions for Auto-Build (Optional)

Create `.github/workflows/build.yml`:
```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: windows-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run electron:build
      
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: localtex-editor-windows
          path: release/*.exe
```

### Step 24: Initial Git Commit

```bash
# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: LaTeX editor with live preview"

# Create GitHub repository (go to github.com/new)
# Then connect local repo to GitHub:
git remote add origin https://github.com/yourusername/localtex-editor.git
git branch -M main
git push -u origin main
```

---

## Phase 7: Building for Distribution

### Step 25: Create App Icon (Optional but Recommended)

```bash
# Create build directory
mkdir build

# Add an icon file (icon.ico for Windows)
# You can create one online at https://www.icoconverter.com/
# Icon should be 256x256 PNG converted to ICO
# Place it in: build/icon.ico
```

Quick icon creation:
1. Create a 256x256 PNG with your logo/design
2. Use online converter to create ICO
3. Save as `build/icon.ico`

### Step 26: Build Production Version

```bash
# Build the application
npm run electron:build

# Output will be in: release/
# You'll find: LocalTeX Editor Setup 0.1.0.exe
```

### Step 27: Test the Installer

```bash
# Navigate to release folder
cd release

# Run the installer
"LocalTeX Editor Setup 0.1.0.exe"

# Install and test the application
```

**Test checklist:**
- [ ] App opens without errors
- [ ] Can open .tex files
- [ ] Can save files
- [ ] Compilation works
- [ ] PDF preview displays
- [ ] Resizing panes works
- [ ] Auto-compile works
- [ ] Zoom controls work

---

## Phase 8: Advanced Features (Day 3+)

### Step 28: Add Settings Panel

Create `src/components/Settings.tsx`:
```typescript
import { useState } from 'react'
import { X, Settings as SettingsIcon } from 'lucide-react'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const [autoCompile, setAutoCompile] = useState(true)
  const [autoCompileDelay, setAutoCompileDelay] = useState(1000)
  const [fontSize, setFontSize] = useState(14)
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-[500px] max-h-[600px] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Auto-compile */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoCompile}
                onChange={(e) => setAutoCompile(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Enable auto-compile</span>
            </label>
            <p className="text-sm text-gray-400 mt-1">
              Automatically compile when you stop typing
            </p>
          </div>
          
          {/* Auto-compile delay */}
          {autoCompile && (
            <div>
              <label className="block text-sm mb-2">
                Auto-compile delay (ms)
              </label>
              <input
                type="range"
                min="500"
                max="3000"
                step="100"
                value={autoCompileDelay}
                onChange={(e) => setAutoCompileDelay(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-400 mt-1">
                {autoCompileDelay}ms
              </div>
            </div>
          )}
          
          {/* Font size */}
          <div>
            <label className="block text-sm mb-2">
              Editor font size
            </label>
            <input
              type="range"
              min="10"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-400 mt-1">
              {fontSize}px
            </div>
          </div>
          
          {/* Theme */}
          <div>
            <label className="block text-sm mb-2">Theme</label>
            <select className="w-full bg-gray-700 p-2 rounded">
              <option>Dark</option>
              <option>Light</option>
            </select>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
```

Add settings button to Toolbar:
```typescript
import { Settings as SettingsIcon } from 'lucide-react'
import { useState } from 'react'
import { Settings } from './Settings'

export function Toolbar() {
  const [showSettings, setShowSettings] = useState(false)
  
  return (
    <>
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-2">
        {/* ... existing buttons ... */}
        
        <button 
          onClick={() => setShowSettings(true)}
          className="ml-auto p-2 hover:bg-gray-700 rounded"
        >
          <SettingsIcon size={18} />
        </button>
      </div>
      
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  )
}
```

### Step 29: Add Error Display Panel

Create `src/components/ErrorPanel.tsx`:
```typescript
import { useState } from 'react'
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useEditorStore } from '@/stores/editorStore'

export function ErrorPanel() {
  const { compilationResult } = useEditorStore()
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (!compilationResult || compilationResult.success) return null
  
  // Parse errors from logs (simple implementation)
  const errors = compilationResult.logs
    .split('\n')
    .filter(line => line.includes('Error') || line.includes('!'))
    .slice(0, 5) // Show first 5 errors
  
  return (
    <div className="border-t border-gray-700 bg-gray-850">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-800"
      >
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle size={16} />
          <span className="text-sm font-medium">
            {errors.length} error{errors.length !== 1 ? 's' : ''} found
          </span>
        </div>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>
      
      {isExpanded && (
        <div className="max-h-48 overflow-auto p-4 space-y-2 text-sm">
          {errors.map((error, i) => (
            <div key={i} className="text-red-300 font-mono">
              {error}
            </div>
          ))}
          
          <details className="mt-4">
            <summary className="cursor-pointer text-gray-400 hover:text-gray-300">
              View full log
            </summary>
            <pre className="mt-2 text-xs text-gray-400 whitespace-pre-wrap">
              {compilationResult.logs}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}
```

Add to `App.tsx`:
```typescript
import { ErrorPanel } from '@/components/ErrorPanel'

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <Toolbar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <PanelGroup direction="horizontal" className="flex-1">
          {/* ... panels ... */}
        </PanelGroup>
        
        <ErrorPanel />
      </div>
      
      <StatusBar />
    </div>
  )
}
```

### Step 30: Add Templates System

Create `src/templates/index.ts`:
```typescript
export const templates = {
  article: `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{graphicx}

\\title{Article Title}
\\author{Author Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}

Your content here.

\\section{Conclusion}

\\end{document}`,

  beamer: `\\documentclass{beamer}
\\usetheme{Madrid}

\\title{Presentation Title}
\\author{Author Name}
\\date{\\today}

\\begin{document}

\\frame{\\titlepage}

\\begin{frame}
\\frametitle{First Slide}
Content here
\\end{frame}

\\end{document}`,

  report: `\\documentclass{report}
\\usepackage[utf8]{inputenc}

\\title{Report Title}
\\author{Author Name}
\\date{\\today}

\\begin{document}

\\maketitle
\\tableofcontents

\\chapter{Introduction}

Your content here.

\\end{document}`,
}
```

Add "New from Template" to Toolbar:
```typescript
import { templates } from '@/templates'

// In Toolbar component:
const handleNewFromTemplate = (template: keyof typeof templates) => {
  setContent(templates[template])
  setFilePath(null)
}

// Add dropdown menu button
<select 
  onChange={(e) => {
    if (e.target.value) {
      handleNewFromTemplate(e.target.value as keyof typeof templates)
      e.target.value = ''
    }
  }}
  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded"
>
  <option value="">New from Template</option>
  <option value="article">Article</option>
  <option value="beamer">Beamer Presentation</option>
  <option value="report">Report</option>
</select>
```

---

## Phase 9: Optimization and Refinement

### Step 31: Add Loading States

Update `src/stores/editorStore.ts`:
```typescript
interface EditorState {
  // ... existing fields ...
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}
```

Add loading spinner to PDFViewer when compiling:
```typescript
export function PDFViewer() {
  const { pdfPath, isCompiling } = useEditorStore()
  
  if (isCompiling) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Compiling...</p>
        </div>
      </div>
    )
  }
  
  // ... rest of component
}
```

### Step 32: Add Keyboard Shortcuts

Create `src/hooks/useKeyboardShortcuts.ts`:
```typescript
import { useEffect } from 'react'
import { useEditorStore } from '@/stores/editorStore'

export function useKeyboardShortcuts() {
  const { filePath, content, setFilePath } = useEditorStore()
  
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Ctrl+S: Save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        if (filePath) {
          await window.electron.fileSave(filePath, content)
        } else {
          const newPath = await window.electron.fileSaveAs(content)
          if (newPath) setFilePath(newPath)
        }
      }
      
      // Ctrl+O: Open
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault()
        const result = await window.electron.fileOpen()
        if (result) {
          useEditorStore.setState({
            content: result.content,
            filePath: result.path,
          })
        }
      }
      
      // Ctrl+Shift+C: Compile
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        if (filePath) {
          const result = await window.electron.latexCompile(filePath)
          if (result.success && result.pdfPath) {
            useEditorStore.setState({ pdfPath: result.pdfPath })
          }
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filePath, content])
}
```

Use in `App.tsx`:
```typescript
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

export default function App() {
  useKeyboardShortcuts()
  // ... rest
}
```

### Step 33: Improve Error Handling

Update `electron/main.ts` to handle common errors:
```typescript
ipcMain.handle('latex:compile', async (_, texFilePath: string) => {
  return new Promise((resolve) => {
    const dir = path.dirname(texFilePath)
    const file = path.basename(texFilePath)
    
    // Check if pdflatex exists
    const checkCmd = spawn('where', ['pdflatex'], { shell: true })
    
    checkCmd.on('error', () => {
      resolve({
        success: false,
        pdfPath: null,
        output: 'Error: pdflatex not found. Please install MiKTeX.',
        logs: '',
      })
      return
    })
    
    checkCmd.on('exit', (code) => {
      if (code !== 0) {
        resolve({
          success: false,
          pdfPath: null,
          output: 'Error: pdflatex not found in PATH. Please install MiKTeX.',
          logs: '',
        })
        return
      }
      
      // Proceed with compilation
      const pdflatex = spawn('pdflatex', [
        '-interaction=nonstopmode',
        '-output-directory=' + dir,
        file
      ], { cwd: dir })
      
      // ... rest of compilation logic
    })
  })
})
```

---

## Phase 10: Final Polish and Release

### Step 34: Add Splash Screen (Optional)

Create `electron/splash.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #1e1e1e;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .splash {
      text-align: center;
      color: #fff;
    }
    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid #333;
      border-top-color: #007acc;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="splash">
    <div class="spinner"></div>
    <h1>LocalTeX Editor</h1>
    <p>Loading...</p>
  </div>
</body>
</html>
```

### Step 35: Create Release Checklist

```markdown
## Pre-Release Checklist

- [ ] All features working
- [ ] No console errors
- [ ] Tested on clean Windows install
- [ ] MiKTeX detection works
- [ ] File save/open works
- [ ] Compilation works
- [ ] PDF preview works
- [ ] Resizing works smoothly
- [ ] Auto-compile works
- [ ] Error handling works
- [ ] App icon displays correctly
- [ ] Installer creates desktop shortcut
- [ ] Uninstaller works properly
- [ ] Version number updated in package.json
- [ ] README is complete
- [ ] LICENSE file included
```

### Step 36: Version and Release

```bash
# Update version in package.json
# "version": "1.0.0"

# Build final release
npm run electron:build

# Create Git tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# On GitHub:
# 1. Go to Releases
# 2. Click "Draft a new release"
# 3. Choose tag v1.0.0
# 4. Upload: release/LocalTeX Editor Setup 1.0.0.exe
# 5. Write release notes
# 6. Publish release
```

---

## Troubleshooting Guide

### Problem: "pdflatex not found"
**Solution:**
1. Install MiKTeX from https://miktex.org/
2. During install, choose "Add to PATH"
3. Restart computer
4. Verify: Open CMD and type `pdflatex --version`

### Problem: PDF doesn't update
**Solution:**
1. Check if PDF file exists in same folder as .tex
2. Look at compilation logs in console
3. Try manual compile button
4. Check Windows file permissions

### Problem: Monaco editor not loading
**Solution:**
1. Clear node_modules: `rm -rf node_modules`
2. Reinstall: `npm install`
3. Check internet connection (Monaco loads workers from CDN)

### Problem: App won't start after building
**Solution:**
1. Check electron-builder.json paths
2. Ensure all files in `dist` and `dist-electron`
3. Try: `npm run build` then `npm run electron:build`

### Problem: High memory usage
**Solution:**
1. Disable minimap in Monaco: `minimap: { enabled: false }`
2. Limit PDF page rendering
3. Clear compiled files regularly

---

## Project Timeline Summary

| Day | Focus | Hours | Deliverable |
|-----|-------|-------|-------------|
| 1 Morning | Setup + Electron | 3-4h | Basic window opens |
| 1 Afternoon | Main features | 3-4h | Editor + PDF preview |
| 1 Evening | Polish | 2-3h | Working MVP |
| 2 Morning | Auto-compile | 2h | Live preview works |
| 2 Afternoon | UI polish | 3h | Beautiful interface |
| 2 Evening | Build + test | 2h | Installable .exe |
| 3+ | Advanced features | 4-8h | Settings, templates, errors |

**Total: 19-28 hours for full-featured app**
**MVP (basic working): 8-12 hours**

---

## File Size Expectations

- Development `node_modules/`: ~500MB
- Built app (unpacked): ~200MB
- Installer .exe: ~80-100MB
- Installed on user machine: ~150MB

These are normal for Electron apps. The bundle includes:
- Chromium browser (~100MB)
- Node.js runtime (~30MB)
- Your app code (~5MB)
- Dependencies (~15MB)

---

## Next Steps After Release

1. **Gather feedback** from users
2. **Fix bugs** reported on GitHub issues
3. **Add features** from user requests:
   - BibTeX support
   - Multi-file projects
   - Git integration
   - Spell checking
4. **Optimize performance**
5. **Add Mac support** (already works, just need to build)
6. **Create documentation** site
7. **Add auto-updates** with electron-updater

---

## Success Metrics

After completing this guide, you should have:

✅ A working LaTeX editor on Windows  
✅ Live PDF preview  
✅ Beautiful, modern UI  
✅ Installable .exe file  
✅ GitHub repository  
✅ Ready for user testing  

**Congratulations! You've built a professional-grade desktop application!**