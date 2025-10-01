# Underleaf

A local LaTeX editor with live PDF preview. Built with Electron, React, and TypeScript.

## Features

- **Auto-compile**: Automatically compiles LaTeX as you type (2-second delay)
- **Live PDF preview** with real-time compilation
- **Monaco Editor** (VS Code editor) with LaTeX syntax highlighting
- **Resizable split panes** for optimal workflow
- **Manual compile** option with compile button
- Cross-platform support
- Dark theme optimized for long editing sessions

## Prerequisites

Install a LaTeX distribution:
- **Windows**: [MiKTeX](https://miktex.org/download)
- **macOS**: [MacTeX](https://www.tug.org/mactex/)
- **Linux**: `sudo apt-get install texlive-full`

## Installation

### Download Release
Coming soon - releases will be available at [Releases](https://github.com/mannrp/underleaf/releases)

### Build from Source
```bash
git clone https://github.com/mannrp/underleaf.git
cd underleaf
npm install
npm run electron:dev
```

## Development

### Scripts
```bash
npm run dev              # Vite dev server
npm run electron:dev     # Electron development
npm run build           # Build for production
npm run electron:build  # Package for distribution
```

### Tech Stack
- React 18 + TypeScript
- Monaco Editor
- Electron
- Zustand (state)
- Tailwind CSS
- Vite

## Usage

1. **Open/Create**: Click "Open" to load a .tex file or start typing in the editor
2. **Auto-compile**: Toggle the "Auto" button (⚡) to enable/disable automatic compilation
3. **Manual compile**: Click "Compile" button to manually compile your document
4. **Save**: Click "Save" to save your work (auto-compile requires saved files)

The auto-compile feature will automatically save and compile your document 2 seconds after you stop typing, keeping the PDF preview always up-to-date.

## Troubleshooting

**Compilation fails**: Ensure LaTeX is installed and `pdflatex` is in PATH
**PDF not showing**: Check compilation succeeded and PDF exists
**Auto-compile not working**: Make sure file is saved first (has a file path)
**App won't start**: Use Node.js 18+, try `rm -rf node_modules && npm install`

## License

MIT