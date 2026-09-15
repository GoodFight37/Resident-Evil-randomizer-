import React from 'react';
import { Minus, Square, X, Cpu, HardDrive } from 'lucide-react';
import { isDesktopApp } from '../utils/electronBridge';

interface DesktopTitleBarProps {
  gamePath: string;
  onBrowsePath: () => void;
}

export const DesktopTitleBar: React.FC<DesktopTitleBarProps> = ({ gamePath, onBrowsePath }) => {
  const isDesktop = isDesktopApp();
  const isDetected = gamePath && gamePath.toLowerCase().includes('common') && !gamePath.includes('Program Files (x86)\\Steam\\steamapps\\common\\RESIDENT EVIL 9') || gamePath.includes('requiem');

  return (
    <div className="bg-[#0a0a0f] border-b border-[#7b0d0d]/50 text-xs select-none flex items-center justify-between h-9 px-3 drag-handle" style={{ borderBottom: '1px solid #7b0d0d' }}>
      <div className="flex items-center space-x-2 text-gray-300 font-semibold no-drag">
        <Cpu className="w-4 h-4 text-[#e74c3c]" />
        <span className="font-display tracking-widest">BioRand RE9 Studio</span>
        <span className="bg-[#9E7FFF]/20 text-[#9E7FFF] text-[10px] px-1.5 py-0.5 rounded border border-[#9E7FFF]/30">
          v1.0.0 Win64 .EXE
        </span>
      </div>

      <div className="hidden md:flex items-center space-x-2 no-drag bg-[#111111] px-2.5 py-1 rounded border border-[#2a2a2a] text-gray-400">
        <span className={`w-2 h-2 rounded-full ${isDetected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} title={isDetected ? 'Auto-detected' : 'Default path'}></span>
        <HardDrive className="w-3.5 h-3.5 text-[#c0392b]" />
        <span className="text-[11px] text-gray-300 max-w-xs truncate font-mono" title={gamePath}>
          {gamePath || 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\RESIDENT EVIL 9'}
        </span>
        <button
          onClick={onBrowsePath}
          className="text-[10px] text-[#e74c3c] hover:text-white underline ml-1"
        >
          Change Path
        </button>
      </div>

      <div className="flex items-center space-x-1 no-drag">
        {isDesktop ? (
          <>
            <button
              onClick={() => window.electronAPI?.minimize()}
              className="p-1.5 hover:bg-[#2F2F2F] rounded text-gray-400 hover:text-white transition-colors"
              title="Minimize"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => window.electronAPI?.maximize()}
              className="p-1.5 hover:bg-[#2F2F2F] rounded text-gray-400 hover:text-white transition-colors"
              title="Maximize"
            >
              <Square className="w-3 h-3" />
            </button>
            <button
              onClick={() => window.electronAPI?.close()}
              className="p-1.5 hover:bg-red-700 rounded text-gray-400 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Executable Preview Mode
          </div>
        )}
      </div>
    </div>
  );
};
