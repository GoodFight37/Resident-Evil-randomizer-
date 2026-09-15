import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),

  // Game path - BioRand + Kyro compatibility
  selectGameDirectory: () => ipcRenderer.invoke('select-game-directory'),
  browseGamePath: () => ipcRenderer.invoke('browse-game-path'),
  detectGamePath: () => ipcRenderer.invoke('detect-game-path'),
  checkReframework: (gamePath) => ipcRenderer.invoke('check-reframework', gamePath),
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),

  // Install - BioRand
  installModFiles: (params) => ipcRenderer.invoke('install-mod-files', params),
  // Kyro aliases
  writeSeed: (args) => ipcRenderer.invoke('write-seed', args),
  installLuaMod: (args) => ipcRenderer.invoke('install-lua-mod', args),

  // Legacy aliases
  isDesktop: true
});
