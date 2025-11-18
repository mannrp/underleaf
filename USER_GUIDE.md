# Underleaf User Guide

## Introduction

Underleaf is a modern LaTeX editor with AI-powered features designed to make LaTeX document creation faster and easier. This guide covers all the features and how to use them.

## Getting Started

### First Launch

When you first open Underleaf, you'll see:
- **Editor Panel** (left): Where you write your LaTeX code
- **PDF Preview** (right): Live preview of your compiled document
- **Toolbar** (top): Quick access to file operations and settings
- **Status Bar** (bottom): Compilation status and file information

### Basic Workflow

1. Write LaTeX code in the editor
2. The document auto-compiles after 2 seconds of inactivity
3. View the PDF preview in real-time
4. Save your work using Ctrl+S (Cmd+S on Mac)

## Features

### Theme System

Underleaf supports multiple themes:
- **Dark**: Default dark theme with blue accents
- **Light**: Clean light theme for daytime work
- **Glassy**: Modern theme with glass effects

**To change themes:**
1. Click the Settings icon in the toolbar
2. Select your preferred theme from the dropdown
3. Changes apply immediately

### AI Features

All AI features require an API key. Configure this in Settings before using AI features.

#### Setting Up AI

1. Click Settings in the toolbar
2. Under "AI Provider (BYOK)", select your provider:
   - **Google Gemini**: Requires Gemini API key
   - **OpenAI**: Requires OpenAI API key
   - **Anthropic**: Requires Claude API key
   - **Ollama**: For local models (no API key needed)
3. Enter your API key
4. Enter the model name (e.g., "gemini-pro", "gpt-4", "claude-3-sonnet")
5. Click "Test Connection" to verify

#### OCR to LaTeX

Convert images of equations or text into LaTeX code.

**How to use:**
1. Click the sidebar toggle button in the toolbar
2. Select the "OCR" tab
3. Click "Click to upload image" or drag an image file
4. Wait for processing (Tesseract OCR + AI conversion)
5. Review the generated LaTeX code
6. Click "Insert into Editor" to add it at your cursor position

**Tips:**
- Use clear, high-contrast images for best results
- Works best with printed text and equations
- Handwriting recognition is limited

#### Context-Aware Autocomplete

Intelligent LaTeX command suggestions based on your document.

**Features:**
- Triggers automatically when typing `\`
- Suggests commands relevant to current environment
- Shows custom commands defined in your document
- Displays recently used commands
- Provides parameter hints

**Example:**
- Type `\` in an equation environment → see math commands
- Type `\` in an itemize environment → see `\item` first
- Custom commands appear with their parameter counts

#### AI Error Analyzer

Get AI-powered help fixing LaTeX compilation errors.

**How to use:**
1. When compilation fails, an error panel appears below the editor
2. Click "Analyze with AI"
3. Wait for AI analysis
4. Review the explanation and suggested fix
5. Click "Apply Fix" to automatically correct the error

**What it does:**
- Parses LaTeX error logs
- Explains errors in plain language
- Suggests specific code fixes
- Can fix multiple errors at once

#### AI Document Editor

Make changes to your document using natural language.

**How to use:**
1. Click the sidebar toggle button
2. Select the "AI Chat" tab
3. Type your request in natural language
4. Examples:
   - "Add a table of contents"
   - "Change all section headings to bold"
   - "Add a figure environment with caption"
   - "Fix the spacing in the abstract"
5. Review the suggested changes
6. Click "Apply Changes" or "Reject"

**Tips:**
- Be specific about what you want to change
- Reference line numbers if needed
- The AI maintains conversation context
- You can make multiple requests in sequence

## Keyboard Shortcuts

### File Operations
- `Ctrl+O` / `Cmd+O`: Open file
- `Ctrl+S` / `Cmd+S`: Save file
- `Ctrl+Shift+S` / `Cmd+Shift+S`: Save as

### Editor
- `Ctrl+/` / `Cmd+/`: Toggle comment
- `Ctrl+F` / `Cmd+F`: Find
- `Ctrl+H` / `Cmd+H`: Replace
- `Ctrl+Space`: Trigger autocomplete

### Compilation
- `Ctrl+B` / `Cmd+B`: Manual compile
- Auto-compile is enabled by default (2s delay)

## Settings Reference

### Appearance
- **Theme**: Choose between dark, light, or glassy
- **Editor Font Size**: Adjust editor text size (10-24px)

### AI Provider
- **Provider**: Select LLM provider
- **API Key**: Your API key (stored locally)
- **Model**: Model name to use
- **Base URL**: For Ollama/local models only

### Editor
- **Auto-compile Delay**: Time to wait before auto-compiling (500-5000ms)

## Troubleshooting

### Compilation Errors

**Problem**: Document won't compile
**Solutions:**
1. Check the error panel for specific errors
2. Use "Analyze with AI" for help
3. Verify LaTeX syntax
4. Ensure all packages are available

### AI Features Not Working

**Problem**: AI features fail or don't respond
**Solutions:**
1. Verify API key in Settings
2. Click "Test Connection" to check connectivity
3. Check internet connection (except for Ollama)
4. Verify you have API credits/quota
5. Try a different model

### OCR Not Accurate

**Problem**: OCR produces incorrect LaTeX
**Solutions:**
1. Use higher quality images
2. Ensure good contrast
3. Crop to relevant content only
4. Try different lighting/scanning
5. Manually edit the generated code

### Performance Issues

**Problem**: Editor feels slow
**Solutions:**
1. Disable auto-compile for large documents
2. Close unused sidebar panels
3. Reduce editor font size
4. Clear browser cache (if using web version)

## Tips & Best Practices

### For Best Performance
- Keep documents under 10,000 lines
- Use `\input{}` to split large documents
- Disable auto-compile when not needed
- Close AI panels when not in use

### For AI Features
- Be specific in your requests
- Review AI suggestions before applying
- Keep API keys secure
- Use local models (Ollama) for privacy

### For LaTeX Writing
- Use autocomplete to discover commands
- Define custom commands for repeated patterns
- Use the AI chat for complex formatting
- Let AI fix errors instead of manual debugging

## Privacy & Security

### Data Storage
- All documents stored locally on your computer
- API keys encrypted in local storage
- No data sent to Underleaf servers

### AI Provider Data
- Your LaTeX code is sent to your chosen AI provider
- Review your provider's privacy policy
- Use Ollama for completely local AI processing
- API keys are never logged or transmitted to Underleaf

## Support

### Getting Help
- Check this guide first
- Review error messages carefully
- Use AI error analyzer for LaTeX errors
- Check provider documentation for API issues

### Reporting Issues
- Note the exact error message
- Include steps to reproduce
- Specify your OS and Underleaf version
- Check if issue occurs with AI disabled

## Keyboard Shortcuts Reference

| Action | Windows/Linux | macOS |
|--------|--------------|-------|
| Open File | Ctrl+O | Cmd+O |
| Save File | Ctrl+S | Cmd+S |
| Save As | Ctrl+Shift+S | Cmd+Shift+S |
| Compile | Ctrl+B | Cmd+B |
| Find | Ctrl+F | Cmd+F |
| Replace | Ctrl+H | Cmd+H |
| Autocomplete | Ctrl+Space | Ctrl+Space |
| Comment | Ctrl+/ | Cmd+/ |

## Advanced Features

### Custom Commands
Define custom commands in your preamble:
```latex
\newcommand{\mycommand}[2]{#1 + #2}
```
They'll appear in autocomplete with parameter hints.

### Environment Detection
Autocomplete adapts to your current environment:
- Math environments show math symbols
- List environments prioritize `\item`
- Table environments show table commands

### Conversation Context
The AI chat remembers your conversation:
- Make follow-up requests
- Refine previous changes
- Build complex edits step-by-step

## Conclusion

Underleaf combines traditional LaTeX editing with modern AI assistance. Start with basic editing, then explore AI features as you become comfortable. The AI is there to help, but you're always in control of your document.

Happy LaTeXing!
