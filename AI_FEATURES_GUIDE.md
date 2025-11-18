# Where to Find AI Features in Underleaf

## Quick Access Guide

### 1. **Settings (Configure AI First!)**
**Location:** Click the ⚙️ Settings icon in the top toolbar

**What to do:**
1. Scroll to "AI Provider (BYOK)" section
2. Select your provider (Gemini, OpenAI, Anthropic, or Ollama)
3. Enter your API key
4. Enter model name (e.g., "gemini-pro", "gpt-4")
5. Click "Test Connection"

**⚠️ You MUST configure this before using any AI features!**

---

### 2. **OCR to LaTeX (Image → Code)**
**Location:** Click the 📱 sidebar toggle button → "OCR" tab

**What you'll see:**
- A file upload area
- "Click to upload image" button
- Image preview after upload
- Generated LaTeX code
- "Insert into Editor" button

**How to use:**
1. Click sidebar toggle (right side of toolbar)
2. Make sure "OCR" tab is selected
3. Upload an image of math/text
4. Wait for processing
5. Click "Insert into Editor"

---

### 3. **AI Chat (Natural Language Editing)**
**Location:** Click the 📱 sidebar toggle button → "AI Chat" tab

**What you'll see:**
- Chat interface with message history
- Text input box at bottom
- "Send" button
- Suggested changes with "Apply" or "Reject" buttons

**How to use:**
1. Click sidebar toggle
2. Select "AI Chat" tab
3. Type what you want (e.g., "Add a table of contents")
4. Press Enter or click Send
5. Review suggested changes
6. Click "Apply Changes" or "Reject"

**Example requests:**
- "Add a bibliography section"
- "Make all section titles bold"
- "Add line numbers to the code"
- "Create a figure with caption"

---

### 4. **AI Error Analyzer (Fix Compilation Errors)**
**Location:** Appears automatically below the editor when compilation fails

**What you'll see:**
- Red error panel with "⚠️ Compilation Errors"
- "Analyze with AI" button
- After analysis: error explanations and fixes
- "Apply Fix" buttons for each error

**How to use:**
1. Write some LaTeX that has errors
2. Wait for compilation to fail
3. Error panel appears automatically
4. Click "Analyze with AI"
5. Review explanations
6. Click "Apply Fix" for each error

---

### 5. **Smart Autocomplete (Context-Aware)**
**Location:** Works automatically in the editor

**What you'll see:**
- Dropdown suggestions when you type `\`
- Commands relevant to your current context
- Custom commands from your document
- Recently used commands

**How to use:**
1. Just start typing `\` in the editor
2. Suggestions appear automatically
3. Use arrow keys to navigate
4. Press Enter or Tab to accept
5. Press Escape to dismiss

**Smart features:**
- In math environments → shows math symbols
- In lists → shows `\item` first
- Shows your custom `\newcommand` definitions
- Adapts to loaded packages

---

## Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [Open] [Save] [Compile] [⚙️Settings] [📱Sidebar Toggle]    │ ← Toolbar
├──────────────────────────┬──────────────────┬───────────────┤
│                          │                  │               │
│   Editor (Left)          │  PDF (Middle)    │  Sidebar      │
│   - Type LaTeX here      │  - Live preview  │  (Right)      │
│   - Autocomplete works   │                  │               │
│   - Type \ for commands  │                  │  Tabs:        │
│                          │                  │  • OCR        │
│   ┌──────────────────┐   │                  │  • AI Chat    │
│   │ Error Panel      │   │                  │               │
│   │ (when errors)    │   │                  │               │
│   └──────────────────┘   │                  │               │
└──────────────────────────┴──────────────────┴───────────────┘
│  ● Compiled successfully                                     │ ← Status Bar
└─────────────────────────────────────────────────────────────┘
```

---

## First Time Setup Checklist

- [ ] Open Settings (⚙️ icon)
- [ ] Choose AI provider
- [ ] Enter API key
- [ ] Enter model name
- [ ] Click "Test Connection"
- [ ] See "✓ Connection successful"
- [ ] Click sidebar toggle to see OCR and AI Chat
- [ ] Try typing `\` in editor to see autocomplete

---

## Troubleshooting

**"I don't see the sidebar"**
→ Click the 📱 sidebar toggle button in the toolbar (top right area)

**"AI features don't work"**
→ Go to Settings and configure your API key first

**"Autocomplete doesn't show up"**
→ Type `\` (backslash) or press Ctrl+Space

**"Error panel doesn't appear"**
→ It only shows when compilation fails. Try adding `\invalid` to trigger an error

**"Where's the toolbar?"**
→ It's at the very top of the window with Open, Save, Compile buttons

---

## Quick Tips

1. **Start with Settings** - Configure AI before trying features
2. **Use Sidebar Toggle** - This reveals OCR and AI Chat
3. **Autocomplete is automatic** - Just type `\` 
4. **Error panel is automatic** - Appears when compilation fails
5. **Test with simple requests** - Try "Add a title" in AI Chat first

---

## Need Help?

- Check USER_GUIDE.md for detailed instructions
- Verify API key in Settings
- Click "Test Connection" to check AI setup
- Try Ctrl+Space to manually trigger autocomplete
