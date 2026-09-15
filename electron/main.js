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
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    title: 'BioRand RE9 Studio',
  });

  Menu.setApplicationMenu(null);

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  const isDev = Boolean(devServerUrl) && !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL(devServerUrl);
  } else {
    const indexPath = path.resolve(app.getAppPath(), 'dist', 'index.html');
    mainWindow.loadFile(indexPath).catch((err) => {
      console.error('Erreur de chargement HTML:', err);
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.on('window-minimize', () => mainWindow?.minimize());
ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});
ipcMain.on('window-close', () => mainWindow?.close());

ipcMain.handle('select-game-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow ?? undefined, {
    properties: ['openDirectory'],
    title: 'Select Resident Evil 9 Installation Directory'
  });
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('install-mod-files', async (_event, { gamePath, luaScript, jsonConfig, spoilerLog }) => {
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

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
