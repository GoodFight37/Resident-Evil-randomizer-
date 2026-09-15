import { app, BrowserWindow, ipcMain, dialog, Menu, shell } from 'electron';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

// ── Enhanced Steam / RE9 path detection (borrowed from Kyro's RE9-Randomiser for stability) ──
const RE9_STEAM_ID = '2959330';
const RE9_FOLDER_VARIANTS = [
  'RESIDENT EVIL requiem BIOHAZARD requiem', // Kyro's observed name
  'RESIDENT EVIL 9',
  'Resident Evil 9',
  'RE9',
  'BIOHAZARD requiem'
];

function findSteamLibraries() {
  const candidates = [];
  if (process.platform === 'win32') {
    const drives = ['C', 'D', 'E', 'F', 'G', 'H'];
    for (const d of drives) {
      candidates.push(`${d}:\\Program Files (x86)\\Steam`);
      candidates.push(`${d}:\\Steam`);
      candidates.push(`${d}:\\SteamLibrary`);
      candidates.push(`${d}:\\Games\\Steam`);
    }
    const localAppData = process.env.LOCALAPPDATA || '';
    const steamBases = [
      path.join(localAppData, '..', 'Roaming', 'Valve', 'Steam'),
      'C:\\Program Files (x86)\\Steam',
    ];
    for (const steamBase of steamBases) {
      const vdf = path.join(steamBase, 'steamapps', 'libraryfolders.vdf');
      if (fs.existsSync(vdf)) {
        try {
          const text = fs.readFileSync(vdf, 'utf8');
          const matches = [...text.matchAll(/"path"\s+"([^"]+)"/g)];
          for (const m of matches) candidates.push(m[1].replace(/\\\\/g, '\\'));
        } catch {}
      }
    }
  }
  // Also check common Linux/Proton path (Steam on Linux via compat)
  if (process.platform === 'linux') {
    const home = os.homedir();
    candidates.push(path.join(home, '.steam', 'steam'));
    candidates.push(path.join(home, '.local', 'share', 'Steam'));
  }
  return [...new Set(candidates)];
}

function detectRE9Path() {
  const libraries = findSteamLibraries();
  for (const lib of libraries) {
    // Check by folder name variants
    for (const folder of RE9_FOLDER_VARIANTS) {
      const byName = path.join(lib, 'steamapps', 'common', folder);
      if (fs.existsSync(byName)) return byName;
    }
    // Check appmanifest for Steam ID
    const manifest = path.join(lib, 'steamapps', `appmanifest_${RE9_STEAM_ID}.acf`);
    if (fs.existsSync(manifest)) {
      try {
        const text = fs.readFileSync(manifest, 'utf8');
        const m = text.match(/"installdir"\s+"([^"]+)"/);
        if (m) {
          const gamePath = path.join(lib, 'steamapps', 'common', m[1]);
          if (fs.existsSync(gamePath)) return gamePath;
        }
      } catch {}
    }
  }
  return null;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 1024,
    minHeight: 720,
    frame: false,
    backgroundColor: '#0a0a0f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: false,
    },
    title: 'BioRand RE9 Studio',
    autoHideMenuBar: true,
  });

  Menu.setApplicationMenu(null);

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  const isDev = Boolean(devServerUrl) && !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL(devServerUrl);
  } else {
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
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html')).catch(err => {
        console.error('Failed to load HTML:', err);
      });
    }
  }

  // Open external links in browser (like Kyro does)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ── Window controls (used by custom title bar)
ipcMain.on('window-minimize', () => mainWindow?.minimize());
ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize();
  else mainWindow?.maximize();
});
ipcMain.on('window-close', () => mainWindow?.close());

// ── Enhanced IPC: Auto-detect + Browse + Install (Kyro-inspired stability) ──
ipcMain.handle('detect-game-path', async () => {
  const detected = detectRE9Path();
  return detected || null;
});

ipcMain.handle('select-game-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow ?? undefined, {
    properties: ['openDirectory'],
    title: 'Select Resident Evil 9 Installation Directory'
  });
  if (!result.canceled && result.filePaths.length > 0) return result.filePaths[0];
  return null;
});

// Keep compatibility with older renderer name
ipcMain.handle('browse-game-path', async () => {
  const result = await dialog.showOpenDialog(mainWindow ?? undefined, {
    properties: ['openDirectory'],
    title: 'Select Resident Evil 9 Installation Directory'
  });
  if (!result.canceled && result.filePaths.length > 0) return result.filePaths[0];
  return null;
});

ipcMain.handle('check-reframework', async (_event, gamePath) => {
  if (!gamePath || !fs.existsSync(gamePath)) return { installed: false, reason: 'Invalid path' };
  const dll1 = path.join(gamePath, 'dinput8.dll');
  const dll2 = path.join(gamePath, 'winmm.dll');
  const manifest = path.join(gamePath, 'reframework', 'autorun');
  return {
    installed: fs.existsSync(dll1) || fs.existsSync(dll2),
    hasAutorun: fs.existsSync(manifest),
    dllPath: fs.existsSync(dll1) ? dll1 : fs.existsSync(dll2) ? dll2 : null
  };
});

ipcMain.handle('open-folder', async (_event, folderPath) => {
  if (folderPath && fs.existsSync(folderPath)) {
    shell.openPath(folderPath);
    return { success: true };
  }
  return { success: false, error: 'Folder not found' };
});

// Robust install with Kyro's file structure + BioRand extras
ipcMain.handle('install-mod-files', async (_event, { gamePath, luaScript, jsonConfig, spoilerLog }) => {
  try {
    if (!gamePath || !fs.existsSync(gamePath)) {
      return { success: false, error: 'Invalid game directory path' };
    }
    const autorunDir = path.join(gamePath, 'reframework', 'autorun');
    const dataDir = path.join(gamePath, 'reframework', 'data', 're9_randomizer');
    const legacyDataDir = path.join(gamePath, 'reframework', 'data', 're9_randomiser'); // Kyro compat

    fs.mkdirSync(autorunDir, { recursive: true });
    fs.mkdirSync(dataDir, { recursive: true });

    // Write primary files (BioRand structure)
    fs.writeFileSync(path.join(autorunDir, 're9_randomizer.lua'), luaScript, 'utf8');
    fs.writeFileSync(path.join(dataDir, 'seed_data.json'), jsonConfig, 'utf8');
    fs.writeFileSync(path.join(dataDir, 'spoilers.txt'), spoilerLog, 'utf8');
    // Also write Kyro-compatible seed.json for cross-tool compatibility
    fs.writeFileSync(path.join(dataDir, 'seed.json'), jsonConfig, 'utf8');

    // Also ensure legacy folder has seed.json for RE9-Randomiser Lua compatibility
    try {
      fs.mkdirSync(legacyDataDir, { recursive: true });
      fs.writeFileSync(path.join(legacyDataDir, 'seed.json'), jsonConfig, 'utf8');
    } catch {}

    return { success: true, autorunPath: path.join(autorunDir, 're9_randomizer.lua'), dataPath: dataDir };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// Kyro-style IPC aliases
ipcMain.handle('write-seed', async (_event, args) => {
  // Compatibility: Kyro's frontend calls writeSeed({ gamePath, seedJson })
  const gamePath = args.gamePath || args.path || detectRE9Path();
  const seedJson = args.seedJson || args.jsonConfig || args.seed;
  if (!gamePath || !seedJson) return { success: false, error: 'Missing gamePath or seed' };
  try {
    const dataDir = path.join(gamePath, 'reframework', 'data', 're9_randomizer');
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(path.join(dataDir, 'seed_data.json'), typeof seedJson === 'string' ? seedJson : JSON.stringify(seedJson, null, 2), 'utf8');
    fs.writeFileSync(path.join(dataDir, 'seed.json'), typeof seedJson === 'string' ? seedJson : JSON.stringify(seedJson, null, 2), 'utf8');
    return { success: true };
  } catch (e) { return { success: false, error: e.message }; }
});

ipcMain.handle('install-lua-mod', async (_event, args) => {
  const gamePath = args.gamePath || detectRE9Path();
  if (!gamePath) return { success: false, error: 'Game path not detected' };
  // Copy bundled Lua if exists in assets
  const bundledLua = path.join(__dirname, '../assets/re9_randomiser.lua');
  const altBundled = path.join(process.resourcesPath, 'assets/re9_randomiser.lua');
  let luaContent = null;
  if (fs.existsSync(bundledLua)) luaContent = fs.readFileSync(bundledLua, 'utf8');
  else if (fs.existsSync(altBundled)) luaContent = fs.readFileSync(altBundled, 'utf8');
  else if (args.luaScript) luaContent = args.luaScript;
  if (!luaContent) return { success: false, error: 'No Lua content found' };
  try {
    const autorunDir = path.join(gamePath, 'reframework', 'autorun');
    fs.mkdirSync(autorunDir, { recursive: true });
    fs.writeFileSync(path.join(autorunDir, 're9_randomiser.lua'), luaContent, 'utf8');
    return { success: true };
  } catch (e) { return { success: false, error: e.message }; }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
