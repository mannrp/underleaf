# Underleaf

A local LaTeX editor with live PDF preview. Built with Electron, React, and TypeScript.

## Features

- Live PDF preview with real-time compilation
- Monaco Editor (VS Code editor)
- Resizable split panes
- Cross-platform support
- Dark theme

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

## Troubleshooting

**Compilation fails**: Ensure LaTeX is installed and `pdflatex` is in PATH
**PDF not showing**: Check compilation succeeded and PDF exists
**App won't start**: Use Node.js 18+, try `rm -rf node_modules && npm install`

## License

MIT