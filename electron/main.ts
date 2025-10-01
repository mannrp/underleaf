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
      preload: path.join(__dirname, 'preload.cjs'),
    },
  })

  // In development, load from Vite dev server
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'))
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

ipcMain.handle('pdf:read', async (_, pdfPath: string) => {
  try {
    if (!fs.existsSync(pdfPath)) {
      throw new Error('PDF file does not exist')
    }
    const buffer = fs.readFileSync(pdfPath)
    return buffer.toString('base64')
  } catch (error) {
    console.error('Error reading PDF:', error)
    throw error
  }
})