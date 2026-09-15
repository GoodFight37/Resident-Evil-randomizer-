import React from 'react';
import { HelpCircle, FolderCheck, Cpu, PlayCircle, ExternalLink } from 'lucide-react';

export const InstallationGuideView: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-surface border border-borderDark p-6 rounded-2xl space-y-2 shadow-xl">
        <h2 className="text-xl font-bold text-textMain flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary" /> REFramework (Praydog) Installation Guide
        </h2>
        <p className="text-xs text-textSecondary leading-relaxed">
          This program dynamically generates and configures the Lua mod for Resident Evil 9. Here's how to use it with your Windows PC game.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface border border-borderDark p-5 rounded-2xl space-y-3 shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h3 className="text-sm font-bold text-textMain flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" /> REFramework
          </h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            Install REFramework (dinput8.dll) into your main game folder:
            <code className="block mt-2 p-2 bg-background border border-border rounded text-[11px] text-primary">
              steamapps/common/RESIDENT EVIL 9/
            </code>
          </p>
        </div>

        <div className="bg-surface border border-borderDark p-5 rounded-2xl space-y-3 shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h3 className="text-sm font-bold text-textMain flex items-center gap-2">
            <FolderCheck className="w-4 h-4 text-secondary" /> Extract Mod ZIP
          </h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            Click <strong>"Export Mod (ZIP)"</strong> in this program and unzip the contents directly into your game folder.
          </p>
        </div>

        <div className="bg-surface border border-borderDark p-5 rounded-2xl space-y-3 shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h3 className="text-sm font-bold text-textMain flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-accent" /> Launch RE9
          </h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            Launch Resident Evil 9. The REFramework overlay (Press <strong>Insert</strong>) will display the active seed and handle all randomization in real-time!
          </p>
        </div>
      </div>
    </div>
  );
};