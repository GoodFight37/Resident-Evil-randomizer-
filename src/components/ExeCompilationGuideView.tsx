import React from 'react';
import { Package, Terminal, ShieldCheck, CheckCircle2, Download, HardDrive, Cpu } from 'lucide-react';

export const ExeCompilationGuideView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-surface border border-border rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Standalone Windows Executable (.exe) Packaging</h2>
            <p className="text-xs text-textSecondary">
              Compile BioRand RE9 Studio into a native Windows .EXE executable installer or portable binary
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-textSecondary leading-relaxed">
          <p>
            BioRand RE9 Studio is engineered with an Electron & Vite backend to compile directly into a native <code className="text-primary bg-background px-1.5 py-0.5 rounded border border-border">.exe</code> application that runs directly on your Windows OS desktop without any browser dependency.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-background border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2 text-white font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Option A: Run NPM Build Command</span>
              </div>
              <p className="text-[11px] text-textSecondary">
                Open your local terminal in this repository directory and execute:
              </p>
              <div className="bg-[#121212] p-2.5 rounded text-emerald-400 font-mono text-[11px] border border-border">
                npm run build:exe
              </div>
              <p className="text-[11px] text-textSecondary">
                The compiled installer <code className="text-white font-mono">BioRand_RE9_Studio_Setup.exe</code> will be generated inside the <code className="text-white font-mono">/dist-electron/</code> folder.
              </p>
            </div>

            <div className="bg-background border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2 text-white font-semibold">
                <HardDrive className="w-4 h-4 text-secondary" />
                <span>Option B: Portable Executable</span>
              </div>
              <p className="text-[11px] text-textSecondary">
                Electron Builder produces both an NSIS installer and a standalone portable <code className="text-white font-mono">.exe</code> file that requires no installation:
              </p>
              <div className="bg-[#121212] p-2.5 rounded text-secondary font-mono text-[11px] border border-border">
                dist-electron/BioRand-RE9-Studio-1.0.0-portable.exe
              </div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-white pt-2">Build Pipeline Script Configuration (`package.json`)</h3>
          <div className="bg-[#121212] p-4 rounded-lg font-mono text-gray-300 text-[11px] border border-border space-y-1">
            <div className="text-textSecondary">// Run build in your Windows CLI</div>
            <div><span className="text-primary">npm install</span></div>
            <div><span className="text-secondary">npm run build:exe</span></div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start space-x-3 mt-4">
            <Cpu className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="text-white font-medium text-xs">Direct Game Path Auto-Write Features</div>
              <p className="text-[11px] text-textSecondary mt-1">
                Once running the compiled <code className="text-white">BioRand RE9 Studio.exe</code> application, clicking the <strong>"Inject & Install to RE9"</strong> button will write the generated Lua scripts directly into your RE9 install path (<code className="text-emerald-400">reframework/autorun/re9_randomizer.lua</code>) with native Windows file permissions!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
