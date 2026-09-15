import React from 'react';
import { Cpu, Minus, Square, X, FolderOpen, ShieldCheck } from 'lucide-react';
import { isDesktopApp } from '../utils/electronBridge';

interface DesktopTitleBarProps {
  gamePath: string;
  onBrowsePath: () => void;
}

export const DesktopTitleBar: React.FC<DesktopTitleBarProps> = ({ gamePath, onBrowsePath }) => {
  const isDesktop = isDesktopApp();

  return (
    <div className="h-9 bg-[#0b0b0f] border-b border-white/[0.06] flex items-center justify-between px-3 select-none text-xs z-50 drag-handle">
      <div className="flex items-center space-x-2.5 no-drag">
        <div className="flex items-center space-x-1.5 bg-primary/15 border border-primary/30 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          <span className="font-mono text-[10px] font-bold tracking-wider text-primary uppercase">
            REENGINE LUA INJECTOR v2.9
          </span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <span className="text-textSecondary text-[11px] font-medium hidden sm:inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> BioRand Studio Native Mode
        </span>
      </div>

      <div className="hidden md:flex items-center space-x-2 bg-surface/80 border border-white/5 px-2.5 py-0.5 rounded-md max-w-sm truncate text-[11px] font-mono text-textSecondary no-drag">
        <Cpu className="w-3.5 h-3.5 text-secondary shrink-0" />
        <span className="truncate" title={gamePath}>{gamePath}</span>
        <button
          onClick={onBrowsePath}
          className="text-xs text-primary hover:text-white transition-colors ml-1 font-sans"
        >
          <FolderOpen className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center space-x-1 no-drag">
        {isDesktop ? (
          <>
            <button
              onClick={() => window.electronAPI?.minimize()}
              className="w-7 h-6 flex items-center justify-center rounded hover:bg-white/10 text-textSecondary hover:text-white transition-colors"
              title="Minimize"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => window.electronAPI?.maximize()}
              className="w-7 h-6 flex items-center justify-center rounded hover:bg-white/10 text-textSecondary hover:text-white transition-colors"
              title="Maximize"
            >
              <Square className="w-3 h-3" />
            </button>
            <button
              onClick={() => window.electronAPI?.close()}
              className="w-7 h-6 flex items-center justify-center rounded hover:bg-red-500/80 text-textSecondary hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Preview Mode
          </div>
        )}
      </div>
    </div>
  );
};
