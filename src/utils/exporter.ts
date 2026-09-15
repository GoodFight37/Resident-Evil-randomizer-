import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { RandomizerConfig } from '../types/randomizer';
import { generateREFrameworkLuaScript } from './luaGenerator';
import { generateRandomizerWorld } from './graphSolver';

export async function exportModZipPackage(config: RandomizerConfig) {
  const zip = new JSZip();
  const worldData = generateRandomizerWorld(config);
  const luaCode = generateREFrameworkLuaScript(config);

  // Readme File
  const readmeContent = `================================================================
BIORAND RE9 / REQUIEM - REFRAMEWORK LUA MOD BUNDLE
================================================================
Generated Seed: ${config.seed}
Preset: ${config.preset}
Generated Date: ${new Date().toLocaleString()}

INSTALLATION INSTRUCTIONS:
1. Ensure REFramework by Praydog is installed in your Resident Evil 9 game folder.
2. Extract the contents of this zip directly into your Resident Evil 9 directory:
   "Steam/steamapps/common/RESIDENT EVIL 9/"
3. Resulting files location:
   -> RESIDENT EVIL 9/reframework/autorun/re9_randomizer.lua
   -> RESIDENT EVIL 9/reframework/data/re9_randomizer/seed_data.json
   -> RESIDENT EVIL 9/reframework/data/re9_randomizer/spoilers.txt
4. Launch Resident Evil 9. Open the REFramework overlay (Insert key) to view BioRand status!

Enjoy your randomized run!
`;

  // JSON Config Data
  const jsonConfig = JSON.stringify({ config, worldData }, null, 2);

  // Text Spoiler Log
  let spoilerTxt = `====================================================
BIORAND RE9 - SPOILER LOG
Seed: ${config.seed}
====================================================\n\n`;

  spoilerTxt += `--- KEY ITEMS & PICKUPS ---\n`;
  worldData.itemSpoilers.forEach(item => {
    spoilerTxt += `[Segment ${item.segmentId}] ${item.roomName} -> Original: "${item.originalItem}" | Randomized: "${item.randomizedItem}"${item.keyRequired ? ` (Requires: ${item.keyRequired})` : ''}\n`;
  });

  spoilerTxt += `\n--- ENEMY REPLACEMENTS ---\n`;
  worldData.enemySpoilers.forEach(e => {
    spoilerTxt += `${e.location} -> Original: ${e.originalEnemy} | Replacement: ${e.replacementEnemy} [Threat: ${e.threatLevel}]\n`;
  });

  // Create Zip Folders
  const autorunFolder = zip.folder("reframework/autorun");
  const dataFolder = zip.folder("reframework/data/re9_randomizer");

  autorunFolder?.file("re9_randomizer.lua", luaCode);
  dataFolder?.file("seed_data.json", jsonConfig);
  dataFolder?.file("spoilers.txt", spoilerTxt);
  zip.file("README_RE9_BIORAND.txt", readmeContent);

  // Download ZIP file
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `BioRand_RE9_Mod_${config.seed.replace(/[^a-zA-Z0-9]/g, '_')}.zip`);
}
