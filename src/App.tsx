import React, { useState, useEffect } from 'react';
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

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('settings');
  const [config, setConfig] = useState<RandomizerConfig>(DEFAULT_PRESETS.standard);
  const [gamePath, setGamePath] = useState<string>(() => {
    return localStorage.getItem('biorand_re9_path') || 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\RESIDENT EVIL 9';
  });
  const [history, setHistory] = useState<RunHistoryEntry[]>(() => {
    const saved = localStorage.getItem('biorand_re9_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('biorand_re9_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('biorand_re9_path', gamePath);
  }, [gamePath]);

  const handleBrowsePath = async () => {
    if (window.electronAPI?.selectGameDirectory) {
      const selected = await window.electronAPI.selectGameDirectory();
      if (selected) {
        setGamePath(selected);
      }
    } else {
      const manual = prompt('Enter your Resident Evil 9 Directory path:', gamePath);
      if (manual) {
        setGamePath(manual);
      }
    }
  };

  const handleApplyPreset = (preset: PresetType) => {
    if (DEFAULT_PRESETS[preset]) {
      const newConfig = { ...DEFAULT_PRESETS[preset] };
      setConfig(newConfig);
    }
  };

  const handleGenerateSeed = () => {
    const randomSeedStr = 'RE9-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
    setConfig(prev => ({ ...prev, seed: randomSeedStr, preset: 'custom' }));
  };

  const handleExportMod = async () => {
    await exportModZipPackage(config);

    const newEntry: RunHistoryEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      seed: config.seed,
      preset: config.preset,
      config: { ...config }
    };

    setHistory(prev => [newEntry, ...prev.slice(0, 19)]);
  };

  return (
    <div className="min-h-screen bg-background text-textMain flex flex-col font-sans select-none bg-mesh-pattern relative">
      {/* Background ambient lighting blur spheres */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Desktop Native Window Title Bar */}
      <DesktopTitleBar gamePath={gamePath} onBrowsePath={handleBrowsePath} />

      {/* Primary Header Studio Toolbar */}
      <Header
        config={config}
        onConfigChange={setConfig}
        onApplyPreset={handleApplyPreset}
        onGenerateSeed={handleGenerateSeed}
        onExportMod={handleExportMod}
        gamePath={gamePath}
        onBrowsePath={handleBrowsePath}
      />

      {/* Secondary Dynamic Tab Navigation */}
      <TabsNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Workspace Container */}
      <main className="flex-1 pb-12 pt-4 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
            <DoorSettingsCard
              settings={config.doors}
              onChange={(doors) => setConfig({ ...config, doors, preset: 'custom' })}
            />
            <KeySettingsCard
              settings={config.keys}
              onChange={(keys) => setConfig({ ...config, keys, preset: 'custom' })}
            />
            <ItemSettingsCard
              settings={config.items}
              onChange={(items) => setConfig({ ...config, items, preset: 'custom' })}
            />
            <EnemySettingsCard
              settings={config.enemies}
              onChange={(enemies) => setConfig({ ...config, enemies, preset: 'custom' })}
            />
            <div className="lg:col-span-2">
              <CharacterAudioCard
                settings={config.characterAudio}
                onChange={(characterAudio) => setConfig({ ...config, characterAudio, preset: 'custom' })}
              />
            </div>
          </div>
        )}

        {activeTab === 'graph' && <GraphVisualizer config={config} />}
        {activeTab === 'lua' && <LuaPreview config={config} />}
        {activeTab === 'spoilers' && <SpoilerLogView config={config} />}
        {activeTab === 'history' && (
          <RunHistoryView
            history={history}
            onLoadConfig={(cfg) => {
              setConfig(cfg);
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
