import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  selectGameDirectory: () => ipcRenderer.invoke('select-game-directory'),
  installModFiles: (params) => ipcRenderer.invoke('install-mod-files', params),
  isDesktop: true
});
