import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DesktopTitleBar } from './components/DesktopTitleBar';
import { Header } from './components/Header';
import { TabsNav, TabType } from './components/TabsNav';
import { DoorSettingsCard } from './components/DoorSettingsCard';
import { KeySettingsCard } from './components/KeySettingsCard';
import { ItemSettingsCard } from './components/ItemSettingsCard';
import { EnemySettingsCard } from './components/EnemySettingsCard';
import { CharacterAudioCard } from './components/CharacterAudioCard';
import { GraphVisualizer } from './components/GraphVisualizer';
import { LuaPreview } from './components/LuaPreview';
import { SpoilerLogView } from './components/SpoilerLogView';
import { RunHistoryView } from './components/RunHistoryView';
import { InstallationGuideView } from './components/InstallationGuideView';
import { ExeCompilationGuideView } from './components/ExeCompilationGuideView';
import { RandomizerConfig, PresetType, RunHistoryEntry } from './types/randomizer';
import { DEFAULT_PRESETS } from './utils/constants';
import { exportModZipPackage } from './utils/exporter';

// Deep clone helper to avoid mutating presets (prevents memory sharing leaks)
const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('settings');
  const [config, setConfig] = useState<RandomizerConfig>(() => deepClone(DEFAULT_PRESETS.standard));
  const [gamePath, setGamePath] = useState<string>(() => {
    try {
      return localStorage.getItem('biorand_re9_path') || 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\RESIDENT EVIL 9';
    } catch { return 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\RESIDENT EVIL 9'; }
  });
  const [history, setHistory] = useState<RunHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('biorand_re9_history');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Persist history - throttled to avoid rapid writes (memory pressure)
  useEffect(() => {
    try {
      // Cap at 20 entries, stringify once
      const toStore = JSON.stringify(history.slice(0, 20));
      localStorage.setItem('biorand_re9_history', toStore);
    } catch (e) {
      console.warn('Failed to save history', e);
    }
  }, [history]);

  useEffect(() => {
    try { localStorage.setItem('biorand_re9_path', gamePath); } catch {}
  }, [gamePath]);

  // Auto-detect RE9 install like Kyro's RE9-Randomiser (checks Steam libraries via VDF)
  useEffect(() => {
    if (gamePath.includes('Program Files') && window.electronAPI?.detectGamePath) {
      window.electronAPI.detectGamePath().then(detected => {
        if (detected && detected !== gamePath && detected.length > 5) {
          setGamePath(detected);
        }
      }).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBrowsePath = useCallback(async () => {
    if (window.electronAPI?.selectGameDirectory) {
      const selected = await window.electronAPI.selectGameDirectory();
      if (selected) setGamePath(selected);
    } else {
      const manual = prompt('Enter your Resident Evil 9 Directory path:', gamePath);
      if (manual) setGamePath(manual);
    }
  }, [gamePath]);

  const handleApplyPreset = useCallback((preset: PresetType) => {
    if (DEFAULT_PRESETS[preset]) {
      setConfig(deepClone(DEFAULT_PRESETS[preset]));
    }
  }, []);

  const handleGenerateSeed = useCallback(() => {
    const randomSeedStr = 'RE9-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
    setConfig(prev => ({ ...prev, seed: randomSeedStr, preset: 'custom' }));
  }, []);

  const handleExportMod = useCallback(async () => {
    await exportModZipPackage(config);
    const newEntry: RunHistoryEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }),
      seed: config.seed,
      preset: config.preset,
      config: deepClone(config)
    };
    setHistory(prev => [newEntry, ...prev.slice(0, 19)]);
  }, [config]);

  // Estimate completion time like classic BioRand (brown text)
  const estimate = useMemo(() => {
    const rooms = config.doors.segmentsCount * config.doors.averageSegmentSize * 4;
    const base = Math.round(rooms * 1.2);
    const min = Math.max(15, base - 10);
    const max = base + 25;
    const diff = config.enemies.difficultyCurve > 70 ? ' • High combat = longer' : config.enemies.difficultyCurve < 30 ? ' • Low combat = shorter' : '';
    return `${min} - ${max} minutes${diff}`;
  }, [config.doors.segmentsCount, config.doors.averageSegmentSize, config.enemies.difficultyCurve]);

  return (
    <div className="min-h-screen bg-background text-textMain flex flex-col font-sans select-none">
      <DesktopTitleBar gamePath={gamePath} onBrowsePath={handleBrowsePath} />
      <Header
        config={config}
        onConfigChange={setConfig}
        onApplyPreset={handleApplyPreset}
        onGenerateSeed={handleGenerateSeed}
        onExportMod={handleExportMod}
        gamePath={gamePath}
        onBrowsePath={handleBrowsePath}
      />
      <TabsNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 pb-12 max-w-7xl mx-auto w-full">
        {activeTab === 'settings' && (
          <div className="p-6 space-y-8 animate-fadeIn">
            {/* Intro Banner - English only, Kyro-style border-left red accent */}
            <div className="bg-surface border border-border border-l-4 border-l-red-700 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-blood">
              <div>
                <h2 className="text-sm font-bold text-textMain">Configure Your Randomized Run</h2>
                <p className="text-xs text-textSecondary mt-1">All settings are deterministic with your <span className="text-primary font-mono font-bold">{config.seed}</span> seed. Change a preset or tweak below, then click <span className="text-white font-semibold">Inject & Install</span> or <span className="text-white font-semibold">Export ZIP</span>.</p>
              </div>
              <div className="text-xs font-mono bg-amber-950/30 border border-amber-800/30 text-amber-200 px-3 py-2 rounded-xl whitespace-nowrap">
                Estimate: <span className="font-bold">{estimate}</span>
              </div>
            </div>

            {/* Section 1: World & Progression - Groups Door + Key like BioRand's "Randomize Doors" + "Randomize Items > keys" */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <span className="w-6 h-6 rounded bg-primary text-background text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="text-sm font-bold tracking-widest uppercase text-textMain">World & Progression</h3>
                <span className="text-xs text-textSecondary">— Doors, segments, keys & routing (BioRand-style door rando)</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DoorSettingsCard
                  settings={config.doors}
                  onChange={(doors) => setConfig(prev => ({ ...prev, doors, preset: 'custom' }))}
                />
                <KeySettingsCard
                  settings={config.keys}
                  onChange={(keys) => setConfig(prev => ({ ...prev, keys, preset: 'custom' }))}
                />
              </div>
            </section>

            {/* Section 2: Items & Economy - Like BioRand's "Randomize Items" with sliders */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <span className="w-6 h-6 rounded bg-accent text-background text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="text-sm font-bold tracking-widest uppercase text-textMain">Items & Inventory</h3>
                <span className="text-xs text-textSecondary">— Pool, starting weapons, loot ratios (matches BioRand item distribution)</span>
              </div>
              <ItemSettingsCard
                settings={config.items}
                onChange={(items) => setConfig(prev => ({ ...prev, items, preset: 'custom' }))}
              />
            </section>

            {/* Section 3: Combat */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <span className="w-6 h-6 rounded bg-error text-white text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="text-sm font-bold tracking-widest uppercase text-textMain">Combat</h3>
                <span className="text-xs text-textSecondary">— Enemy difficulty, density & crash blacklist</span>
              </div>
              <EnemySettingsCard
                settings={config.enemies}
                onChange={(enemies) => setConfig(prev => ({ ...prev, enemies, preset: 'custom' }))}
              />
            </section>

            {/* Section 4: Presentation */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <span className="w-6 h-6 rounded bg-secondary text-background text-xs font-bold flex items-center justify-center">4</span>
                <h3 className="text-sm font-bold tracking-widest uppercase text-textMain">Presentation</h3>
                <span className="text-xs text-textSecondary">— Character swap, NPC voices & music (safe for cutscenes)</span>
              </div>
              <CharacterAudioCard
                settings={config.characterAudio}
                onChange={(characterAudio) => setConfig(prev => ({ ...prev, characterAudio, preset: 'custom' }))}
              />
            </section>
          </div>
        )}

        {activeTab === 'graph' && <GraphVisualizer config={config} />}
        {activeTab === 'lua' && <LuaPreview config={config} />}
        {activeTab === 'spoilers' && <SpoilerLogView config={config} />}
        {activeTab === 'history' && (
          <RunHistoryView
            history={history}
            onLoadConfig={(cfg) => {
              setConfig(deepClone(cfg));
              setActiveTab('settings');
            }}
            onClearHistory={() => setHistory([])}
          />
        )}
        {activeTab === 'guide' && <InstallationGuideView />}
        {activeTab === 'exe-build' && <ExeCompilationGuideView />}
      </main>
    </div>
  );
}

export default App;
