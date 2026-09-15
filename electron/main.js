import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 1024,
    minHeight: 720,
    frame: false,
    backgroundColor: '#171717',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    title: 'BioRand RE9 Studio',
  });

  // Remove default window menu bar for borderless dark design
  Menu.setApplicationMenu(null);

  const isDev = Boolean(process.env.VITE_DEV_SERVER_URL) && !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // Check multiple potential relative paths in packaged ASAR / output distributions
    const possiblePaths = [
      path.join(__dirname, '../dist/index.html'),
      path.join(app.getAppPath(), 'dist/index.html'),
      path.join(process.resourcesPath, 'app.asar/dist/index.html'),
      path.join(process.resourcesPath, 'app/dist/index.html'),
    ];

    let loaded = false;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        mainWindow.loadFile(p);
        loaded = true;
        break;
      }
    }

    if (!loaded) {
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
  }

  // Window controls
  ipcMain.on('window-minimize', () => mainWindow?.minimize());
  ipcMain.on('window-maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });
  ipcMain.on('window-close', () => mainWindow?.close());

  // Native File System dialogs
  ipcMain.handle('select-game-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Select Resident Evil 9 Installation Directory'
    });
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  });

  // Direct installation to RE9 REFramework directory
  ipcMain.handle('install-mod-files', async (event, { gamePath, luaScript, jsonConfig, spoilerLog }) => {
    try {
      if (!gamePath || !fs.existsSync(gamePath)) {
        return { success: false, error: 'Invalid game directory path' };
      }

      const autorunDir = path.join(gamePath, 'reframework', 'autorun');
      const dataDir = path.join(gamePath, 'reframework', 'data', 're9_randomizer');

      fs.mkdirSync(autorunDir, { recursive: true });
      fs.mkdirSync(dataDir, { recursive: true });

      fs.writeFileSync(path.join(autorunDir, 're9_randomizer.lua'), luaScript, 'utf8');
      fs.writeFileSync(path.join(dataDir, 'seed_data.json'), jsonConfig, 'utf8');
      fs.writeFileSync(path.join(dataDir, 'spoilers.txt'), spoilerLog, 'utf8');

      return { success: true, autorunPath: path.join(autorunDir, 're9_randomizer.lua') };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});