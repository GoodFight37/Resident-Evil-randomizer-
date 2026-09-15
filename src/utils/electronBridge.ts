import { RandomizerConfig } from '../types/randomizer';
import { generateREFrameworkLuaScript } from './luaGenerator';
import { generateRandomizerWorld } from './graphSolver';

declare global {
  interface Window {
    electronAPI?: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      selectGameDirectory: () => Promise<string | null>;
      browseGamePath: () => Promise<string | null>;
      detectGamePath: () => Promise<string | null>;
      checkReframework: (gamePath: string) => Promise<{ installed: boolean; hasAutorun: boolean; dllPath: string | null }>;
      openFolder: (folderPath: string) => Promise<{ success: boolean; error?: string }>;
      installModFiles: (params: {
        gamePath: string;
        luaScript: string;
        jsonConfig: string;
        spoilerLog: string;
      }) => Promise<{ success: boolean; error?: string; autorunPath?: string; dataPath?: string }>;
      writeSeed: (args: any) => Promise<{ success: boolean; error?: string }>;
      installLuaMod: (args: any) => Promise<{ success: boolean; error?: string }>;
      isDesktop?: boolean;
    };
  }
}

export const isDesktopApp = (): boolean => {
  return typeof window !== 'undefined' && !!window.electronAPI?.isDesktop;
};

export const detectGamePath = async (): Promise<string | null> => {
  if (window.electronAPI?.detectGamePath) {
    try { return await window.electronAPI.detectGamePath(); } catch { return null; }
  }
  return null;
};

export async function directInstallToGame(config: RandomizerConfig, gamePath: string) {
  const worldData = generateRandomizerWorld(config);
  const luaScript = generateREFrameworkLuaScript(config);
  const jsonConfig = JSON.stringify({ config, worldData }, null, 2);

  let spoilerLog = `====================================================\n`;
  spoilerLog += `BIORAND RE9 - SPOILER LOG\nSeed: ${config.seed}\n`;
  spoilerLog += `====================================================\n\n`;

  spoilerLog += `--- KEY ITEMS & PICKUPS ---\n`;
  worldData.itemSpoilers.forEach(item => {
    spoilerLog += `[Segment ${item.segmentId}] ${item.roomName} -> Original: "${item.originalItem}" | Randomized: "${item.randomizedItem}"${item.keyRequired ? ` (Requires: ${item.keyRequired})` : ''}\n`;
  });

  spoilerLog += `\n--- ENEMY REPLACEMENTS ---\n`;
  worldData.enemySpoilers.forEach(e => {
    spoilerLog += `${e.location} -> Original: ${e.originalEnemy} | Replacement: ${e.replacementEnemy} [Threat: ${e.threatLevel}]\n`;
  });

  if (window.electronAPI?.installModFiles) {
    return await window.electronAPI.installModFiles({
      gamePath,
      luaScript,
      jsonConfig,
      spoilerLog,
    });
  }

  throw new Error("Electron API not available.");
}
