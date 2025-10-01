import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  fileOpen: () => ipcRenderer.invoke('file:open'),
  fileSave: (path: string, content: string) => 
    ipcRenderer.invoke('file:save', path, content),
  fileSaveAs: (content: string) => 
    ipcRenderer.invoke('file:saveAs', content),
  latexCompile: (path: string) => 
    ipcRenderer.invoke('latex:compile', path),
  pdfRead: (path: string) => 
    ipcRenderer.invoke('pdf:read', path),
})