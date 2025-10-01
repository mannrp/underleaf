import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('electron', {
    fileOpen: function () { return ipcRenderer.invoke('file:open'); },
    fileSave: function (path, content) {
        return ipcRenderer.invoke('file:save', path, content);
    },
    fileSaveAs: function (content) {
        return ipcRenderer.invoke('file:saveAs', content);
    },
    latexCompile: function (path) {
        return ipcRenderer.invoke('latex:compile', path);
    },
});
