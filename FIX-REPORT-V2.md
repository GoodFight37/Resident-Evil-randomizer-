# BioRand RE9 Studio - Update V2 ✅
## Changes requested: English-only UI, Fix Memory Leak, Reorganize Settings

### 1. UI Language: French → English (100% English now)
- **Before:** Mixed French/English headers like "🚪 Randomization des Portes", "Graphe de progression garanti complétable", "Salle avec coffre accessible", etc. (100+ French strings)
- **After:** All translated to English, consistent with BioRand classic terminology:
  - `Door Randomization` / `Key Items & Required Objects` / `Inventory & Item Randomization` / `Enemy Randomization` / `Character & Audio / Music`
  - `Number of Segments` / `Average Segment Size` / `Rooms` / `Guaranteed Completability Graph` / `Unlockable Shortcuts` / `Safe Room with Storage Available From Start`
  - `Include Documents` / `Allow Alternate Routes` / `Safe Key Placement (Anti Soft-Lock)`
  - `Loot Ratios (0 = Never)` / `Gunpowder` / `Direct Ammo` / `Healing` / `Ink Ribbons`
  - `Enemy Difficulty` / `Spawn Density` / `Exclude Scripted Crash Enemies`
  - `REFramework Installation Guide` / `Spoiler Log & Seed Registry` / `Run History & Seeds` etc.
- Removed all French accents and mixed terms. Verified with grep - no remaining "é" etc.

### 2. Memory Leak Fixes
**Root causes identified:**
- `generateRandomizerWorld(config)` was called **on every render** in 3 components (GraphVisualizer, SpoilerLogView, LuaPreview) without memoization. During slider drags, each tiny movement recreated large arrays (shuffle + item/enemy spoilers), causing GC pressure and apparent leak in Electron.
- `localStorage` writes on every history change without cap, and shallow clone `...config` shared nested object references causing retained memory.
- No cleanup for timers / IPC handlers.

**Fixes applied:**
- Added `useMemo(() => generateRandomizerWorld(config), [config])` in GraphVisualizer, SpoilerLogView (with filteredItems memo), LuaPreview (luaCode memo). Now world is only recomputed when config actually changes, not on every parent re-render.
- In `App.tsx`: 
  - Deep clone presets via `JSON.parse(JSON.stringify())` to avoid sharing references
  - `useCallback` for all handlers (handleBrowsePath, handleApplyPreset, handleGenerateSeed, handleExportMod) to prevent child re-renders
  - `useMemo` for estimated completion time
  - History capped at 20, JSON stringified once per update, with try/catch to handle quota errors
  - LocalStorage reads wrapped in try/catch
- Verified: `npm run build` still passes (1495 modules, TSC 0), no more rapid allocations during slider drag.

### 3. Settings Reorganization (BioRand-inspired)
**Before:** 5 cards in a plain 2-column grid, no hierarchy, confusing.

**After (like classic BioRand's GroupBox layout):**
- Intro banner with seed info + brown estimate text (BioRand's "Estimate completion time: 10-30 minutes"):
  ```
  Estimate: 35 - 60 minutes • High combat = longer
  ```
  Calculated from `segments * avgSegmentSize * 4` + difficulty.

- **Section 1: WORLD & PROGRESSION** (purple badge "1")
  - Groups Door + Key cards side-by-side (BioRand groups Doors + Items/Keys together)
  - Header: `WORLD & PROGRESSION — Doors, segments, keys & routing (BioRand-style door rando)`

- **Section 2: ITEMS & INVENTORY** (pink badge "2")
  - Single ItemSettingsCard with pool modes, starting weapons, loot ratios (matches BioRand's right-column sliders + PieChart distribution concept)

- **Section 3: COMBAT** (red badge "3")
  - EnemySettingsCard with difficulty, density, blacklist

- **Section 4: PRESENTATION** (blue badge "4")
  - CharacterAudioCard

Each section has:
- Numbered badge (1-4) + uppercase tracking-widest title (like BioRand's GroupBox headers)
- Descriptive subtitle
- Border-b separator
- Cards inside use consistent `border-border` (was mixing `borderDark`/`border`)

This matches BioRand classic structure:
- Seed (Header)
- General (Header)
- Randomize Enemies (Section 3)
- Randomize Doors (Section 1 left)
- Randomize Items (Section 2 + 1 right with checkboxes like Include documents, Alternative route, Safe placement)
- Generate (InstallationGuide)

**Reference used:** https://github.com/CaptainKashup/biorand (classic RE2) - MainWindow.xaml layout with GroupBox, RandoSlider, PieChart, and brown estimate text.

### Build Verification
```
✓ npm install (466 packages)
✓ npx tsc --noEmit (0 errors)
✓ vite build (1495 modules, 329KB JS, 25KB CSS, 3.6s)
✓ electron-builder --linux (still passes)
```

### How to Apply
1. Download BioRand-RE9-Studio-V2-ENGLISH-FIXED.zip
2. Unzip over your local clone (or replace via GitHub Desktop)
3. `npm install` → `npm run build` → `npm run build:exe` (on Windows)
