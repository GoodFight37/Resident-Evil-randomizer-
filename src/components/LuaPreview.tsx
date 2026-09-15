import React, { useState } from 'react';
import { FileCode, Copy, Check, Terminal } from 'lucide-react';
import { RandomizerConfig } from '../types/randomizer';
import { generateREFrameworkLuaScript } from '../utils/luaGenerator';

interface LuaPreviewProps {
  config: RandomizerConfig;
}

export const LuaPreview: React.FC<LuaPreviewProps> = ({ config }) => {
  const luaCode = generateREFrameworkLuaScript(config);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(luaCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between bg-surface border border-borderDark p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-secondary/10 rounded-xl text-secondary border border-secondary/20">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-textMain">Script Lua REFramework Compagnon (Généré)</h2>
            <p className="text-xs text-textSecondary">Destiné au dossier <code className="text-secondary font-mono">RESIDENT EVIL 9/reframework/autorun/re9_randomizer.lua</code></p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-background border border-borderDark hover:border-secondary text-textMain rounded-xl text-xs font-semibold transition"
        >
          {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-secondary" />}
          {copied ? 'Copié dans le presse-papier !' : 'Copier le code Lua'}
        </button>
      </div>

      <div className="bg-background border border-borderDark rounded-2xl p-4 font-mono text-xs overflow-x-auto text-secondary/90 leading-relaxed max-h-[600px] overflow-y-auto">
        <pre>{luaCode}</pre>
      </div>
    </div>
  );
};
