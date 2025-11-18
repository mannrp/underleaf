# Underleaf

A beautiful local LaTeX editor with live PDF preview and AI-powered editing. Built with Electron, React, and TypeScript.

## Features

### Core Editor
- **Auto-compile**: Automatically compiles LaTeX as you type (configurable delay)
- **Live PDF preview** with real-time compilation
- **Monaco Editor** (VS Code editor) with LaTeX syntax highlighting
- **Resizable split panes** for optimal workflow
- **Manual compile** option with compile button
- **Multiple themes**: Dark, Light, and Glassy themes with smooth transitions
- **Context-aware LaTeX completions** for faster editing

### AI Features
- **AI Document Editor**: Natural language document editing with LLM integration
  - Describe changes in plain English
  - Review and apply suggested edits
  - Supports multiple LLM providers (OpenAI, Anthropic, Google Gemini, Ollama)
- **Error Analysis**: AI-powered LaTeX error diagnosis and fixes
- **Smart Context Engine**: Intelligent LaTeX command suggestions based on document context

### Cross-Platform
- Windows, macOS, and Linux support
- Native desktop application with Electron

## Prerequisites

Install a LaTeX distribution:
- **Windows**: [MiKTeX](https://miktex.org/download)
- **macOS**: [MacTeX](https://www.tug.org/mactex/)
- **Linux**: `sudo apt-get install texlive-full`

## Installation

### Download Release
[Release 1 - Windows x64](https://github.com/mannrp/underleaf/releases/download/v0.1.0/UnderleafSetup.exe)

More releases coming soon - releases will be available at [Releases](https://github.com/mannrp/underleaf/releases)

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

### Basic Editing
1. **Open/Create**: Click "Open" to load a .tex file or start typing in the editor
2. **Auto-compile**: Toggle the "Auto" button (⚡) to enable/disable automatic compilation
3. **Manual compile**: Click "Compile" button to manually compile your document
4. **Save**: Click "Save" to save your work (auto-compile requires saved files)
5. **Theme**: Open Settings to switch between Dark, Light, and Glassy themes

The auto-compile feature will automatically save and compile your document after you stop typing, keeping the PDF preview always up-to-date.

### AI Features
1. **Setup**: Open Settings and configure your preferred LLM provider (API key required for cloud providers)
2. **AI Chat**: Click the panel toggle button to open the AI Document Editor
3. **Edit with AI**: Describe changes in natural language (e.g., "Add a section about methodology")
4. **Review & Apply**: Review suggested changes and apply or reject them
5. **Error Help**: When compilation fails, the error panel provides AI-powered analysis and fixes

## Configuration

### LLM Providers
Underleaf supports multiple AI providers:
- **OpenAI**: GPT-4, GPT-3.5-turbo
- **Anthropic**: Claude 3 models
- **Google Gemini**: Gemini Pro
- **Ollama**: Local models (no API key required)

Configure in Settings → AI Provider section.

## Troubleshooting

**Compilation fails**: Ensure LaTeX is installed and `pdflatex` is in PATH
**PDF not showing**: Check compilation succeeded and PDF exists
**Auto-compile not working**: Make sure file is saved first (has a file path)
**App won't start**: Use Node.js 18+, try `rm -rf node_modules && npm install`
**AI features not working**: Verify API key is set correctly in Settings
**Theme not changing**: Restart the app if theme doesn't apply immediately

## License

MIT
