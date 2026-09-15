import React, { useState } from 'react';
import { Dices, Download, Sparkles, FolderCheck, CheckCircle2, AlertTriangle, Play, Zap, SlidersHorizontal, RefreshCw } from 'lucide-react';
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
  const [isRolling, setIsRolling] = useState(false);

  const handleRollSeed = () => {
    setIsRolling(true);
    onGenerateSeed();
    setTimeout(() => setIsRolling(false), 400);
  };

  const handleDirectInstall = async () => {
    setInstalling(true);
    setInstallStatus(null);
    try {
      if (isDesktopApp()) {
        const res = await directInstallToGame(config, gamePath);
        if (res.success) {
          setInstallStatus({
            success: true,
            msg: `Successfully injected mod into RE9 REFramework Lua directory!`
          });
        } else {
          setInstallStatus({
            success: false,
            msg: res.error || 'Failed to install mod files directly to game.'
          });
        }
      } else {
        await exportModZipPackage(config);
        setInstallStatus({
          success: true,
          msg: 'Exported RE9 Randomizer ZIP mod archive package.'
        });
      }
    } catch (err: any) {
      setInstallStatus({
        success: false,
        msg: err.message || 'Error occurred during mod generation.'
      });
    } finally {
      setInstalling(false);
    }
  };

  return (
    <header className="bg-surface/90 border-b border-white/[0.08] backdrop-blur-xl sticky top-0 z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Brand Header & Logo Badge */}
        <div className="flex items-center space-x-3.5">
          <div className="relative group cursor-pointer">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary via-[#a855f7] to-secondary p-0.5 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
              <div className="w-full h-full bg-[#12121c] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-surface"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black tracking-tight text-white font-sans">
                BIORAND <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">RE9</span>
              </h1>
              <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full tracking-wider uppercase">
                STUDIO PRO
              </span>
            </div>
            <p className="text-[11px] text-textSecondary font-mono mt-0.5">
              Logic Engine & REFramework Injector
            </p>
          </div>
        </div>

        {/* Directory Input */}
        <div className="flex-1 max-w-md mx-0 lg:mx-3 bg-[#13131d] border border-white/[0.08] hover:border-white/20 transition-colors rounded-xl p-1.5 pl-3 flex items-center space-x-2.5">
          <FolderCheck className="w-4 h-4 text-secondary shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[9px] text-textSecondary uppercase font-mono font-semibold tracking-wider">RE9 Directory</div>
            <input
              type="text"
              value={gamePath}
              readOnly
              onClick={onBrowsePath}
              className="w-full bg-transparent text-xs text-white outline-none truncate font-mono cursor-pointer"
              placeholder="C:\Program Files (x86)\Steam\steamapps\common\RESIDENT EVIL 9"
            />
          </div>
          <button
            onClick={onBrowsePath}
            className="px-2.5 py-1 text-[11px] bg-white/[0.06] hover:bg-white/10 border border-white/10 rounded-lg text-textMain font-medium transition-colors shrink-0"
          >
            Browse
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center space-x-2.5 flex-wrap sm:flex-nowrap">
          {/* Seed Control Box */}
          <div className="bg-[#13131d] border border-white/[0.08] rounded-xl p-1 pl-3 flex items-center space-x-2">
            <div className="flex flex-col">
              <span className="text-[9px] text-textSecondary uppercase font-mono font-semibold">Seed Code</span>
              <input
                type="text"
                value={config.seed}
                onChange={(e) => onConfigChange({ ...config, seed: e.target.value, preset: 'custom' })}
                className="bg-transparent text-xs text-white font-mono font-bold outline-none w-28 text-primary"
              />
            </div>
            <button
              onClick={handleRollSeed}
              className={`p-2 hover:bg-white/10 rounded-lg text-textSecondary hover:text-primary transition-all duration-200 ${
                isRolling ? 'rotate-180 text-primary' : ''
              }`}
              title="Roll New Random Seed"
            >
              <Dices className="w-4 h-4" />
            </button>
          </div>

          {/* Preset Selector */}
          <div className="relative">
            <select
              value={config.preset}
              onChange={(e) => onApplyPreset(e.target.value as PresetType)}
              className="appearance-none bg-[#13131d] border border-white/[0.08] hover:border-primary/40 text-xs text-textMain rounded-xl px-3 py-2.5 pr-8 outline-none font-medium cursor-pointer transition-colors font-mono"
            >
              <option value="standard">Preset: Standard</option>
              <option value="hardcore">Preset: Hardcore</option>
              <option value="chaos">Preset: Full Chaos</option>
              <option value="speedrun">Preset: Speedrun Safe</option>
              <option value="custom">Preset: Custom</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-textSecondary pointer-events-none absolute right-2.5 top-3.5" />
          </div>

          {/* Inject Mod Button */}
          <button
            onClick={handleDirectInstall}
            disabled={installing}
            className="relative group overflow-hidden flex items-center space-x-2 bg-gradient-to-r from-primary via-[#8b5cf6] to-secondary hover:brightness-110 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-glow-sm hover:shadow-glow-lg transition-all duration-300 active:scale-95 disabled:opacity-50"
          >
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            {installing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Zap className="w-4 h-4 text-white fill-white" />
            )}
            <span>{installing ? 'Injecting Script...' : 'Inject & Install'}</span>
          </button>

          {/* Export Zip Button */}
          <button
            onClick={onExportMod}
            className="p-2.5 bg-[#13131d] border border-white/[0.08] hover:bg-white/10 rounded-xl text-textSecondary hover:text-white transition-colors"
            title="Download Mod .ZIP Archive"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Direct Feedback Notification Bar */}
      {installStatus && (
        <div
          className={`px-6 py-2.5 text-xs font-mono border-t flex items-center justify-between ${
            installStatus.success
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-red-500/10 border-red-500/20 text-red-300'
          }`}
        >
          <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full">
            {installStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span className="font-semibold">{installStatus.msg}</span>
          </div>
          <button
            onClick={() => setInstallStatus(null)}
            className="text-xs text-textSecondary hover:text-white px-2 py-0.5 rounded bg-white/5"
          >
            Dismiss
          </button>
        </div>
      )}
    </header>
  );
};
