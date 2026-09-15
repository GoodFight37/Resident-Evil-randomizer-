import React, { useState } from 'react';
import { Dices, Download, Sparkles, FolderCheck, CheckCircle2, AlertTriangle, Play, FileCode2 } from 'lucide-react';
import { RandomizerConfig, PresetType } from '../types/randomizer';
import { isDesktopApp, directInstallToGame } from '../utils/electronBridge';
import { exportModZipPackage } from '../utils/exporter';

interface HeaderProps {
  config: RandomizerConfig;
  onConfigChange: (config: RandomizerConfig) => void;
  onApplyPreset: (preset: PresetType) => void;
  onGenerateSeed: () => void;
  onExportMod: () => void;
  gamePath: string;
  onBrowsePath: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onConfigChange,
  onApplyPreset,
  onGenerateSeed,
  onExportMod,
  gamePath,
  onBrowsePath
}) => {
  const [installing, setInstalling] = useState(false);
  const [installStatus, setInstallStatus] = useState<{ success: boolean; msg: string } | null>(null);

  const handleDirectInstall = async () => {
    setInstalling(true);
    setInstallStatus(null);
    try {
      if (isDesktopApp()) {
        const res = await directInstallToGame(config, gamePath);
        if (res.success) {
          setInstallStatus({
            success: true,
            msg: `Successfully installed to RE9 reframework directory!`
          });
        } else {
          setInstallStatus({
            success: false,
            msg: res.error || 'Failed to install mod files.'
          });
        }
      } else {
        // Fallback to export ZIP
        await exportModZipPackage(config);
        setInstallStatus({
          success: true,
          msg: 'Exported ZIP archive bundle.'
        });
      }
    } catch (err: any) {
      setInstallStatus({
        success: false,
        msg: err.message || 'Error occurred during installation.'
      });
    } finally {
      setInstalling(false);
    }
  };

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-30 shadow-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Branding Title */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-[#8b5cf6] to-secondary p-0.5 shadow-lg shadow-primary/20">
            <div className="w-full h-full bg-[#171717] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white">BIORAND RE9 STUDIO</h1>
              <span className="text-[11px] font-medium bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full">
                Desktop EXE
              </span>
            </div>
            <p className="text-xs text-textSecondary font-mono mt-0.5">
              Native Windows REFramework Logic & Mod Injector Engine
            </p>
          </div>
        </div>

        {/* Target RE9 Game Directory Input */}
        <div className="flex-1 max-w-xl mx-0 lg:mx-4 bg-background/80 border border-border rounded-lg p-2 flex items-center space-x-3">
          <FolderCheck className="w-5 h-5 text-secondary shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-textSecondary uppercase font-mono tracking-wider">RE9 Executable Folder Path</div>
            <input
              type="text"
              value={gamePath}
              onChange={(e) => onBrowsePath()}
              readOnly
              className="w-full bg-transparent text-xs text-white outline-none truncate font-mono cursor-pointer"
              placeholder="C:\Program Files (x86)\Steam\steamapps\common\RESIDENT EVIL 9"
            />
          </div>
          <button
            onClick={onBrowsePath}
            className="px-2.5 py-1 text-xs bg-surface hover:bg-[#333] border border-border rounded text-textMain font-medium transition-colors shrink-0"
          >
            Browse EXE
          </button>
        </div>

        {/* Seed & Action Buttons */}
        <div className="flex items-center space-x-3 flex-wrap sm:flex-nowrap">
          {/* Seed Input */}
          <div className="bg-background border border-border rounded-lg p-1.5 flex items-center space-x-2">
            <input
              type="text"
              value={config.seed}
              onChange={(e) => onConfigChange({ ...config, seed: e.target.value, preset: 'custom' })}
              className="bg-transparent text-xs text-white font-mono font-semibold px-2 py-1 outline-none w-32 border-b border-dashed border-border focus:border-primary"
            />
            <button
              onClick={onGenerateSeed}
              className="p-1.5 hover:bg-surface rounded-md text-textSecondary hover:text-primary transition-colors"
              title="Roll New Seed"
            >
              <Dices className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Presets Dropdown */}
          <select
            value={config.preset}
            onChange={(e) => onApplyPreset(e.target.value as PresetType)}
            className="bg-background border border-border text-xs text-textMain rounded-lg px-3 py-2 outline-none font-medium cursor-pointer hover:border-primary/50 transition-colors"
          >
            <option value="standard">Preset: Standard</option>
            <option value="hardcore">Preset: Hardcore</option>
            <option value="chaos">Preset: Full Chaos</option>
            <option value="speedrun">Preset: Speedrun Safe</option>
            <option value="custom">Preset: Custom</option>
          </select>

          {/* Direct Mod Direct Install Button */}
          <button
            onClick={handleDirectInstall}
            disabled={installing}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary to-[#7c3aed] hover:from-[#8b5cf6] hover:to-primary text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg shadow-primary/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{installing ? 'Injecting Lua...' : 'Inject & Install to RE9'}</span>
          </button>

          {/* Export Zip Manual Archive */}
          <button
            onClick={onExportMod}
            className="p-2.5 bg-background border border-border hover:bg-surface rounded-lg text-textSecondary hover:text-white transition-colors"
            title="Save Backup .ZIP Package"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Feedback Banner */}
      {installStatus && (
        <div
          className={`px-6 py-2 text-xs font-mono border-t flex items-center justify-between ${
            installStatus.success
              ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/60 border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {installStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{installStatus.msg}</span>
          </div>
          <button
            onClick={() => setInstallStatus(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}
    </header>
  );
};