import React from 'react';
import { HelpCircle, FolderCheck, Cpu, PlayCircle, ExternalLink } from 'lucide-react';

export const InstallationGuideView: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-surface border border-borderDark p-6 rounded-2xl space-y-2 shadow-xl">
        <h2 className="text-xl font-bold text-textMain flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary" /> Guide d'installation avec REFramework (Praydog)
        </h2>
        <p className="text-xs text-textSecondary leading-relaxed">
          Ce programme génère et configure dynamiquement le mod Lua pour Resident Evil 9. Voici comment l'utiliser directement avec votre jeu sur PC Windows.
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
            Installez REFramework (dinput8.dll) dans votre dossier principal du jeu :
            <code className="block mt-2 p-2 bg-background border border-borderDark rounded text-[11px] text-primary">
              steamapps/common/RESIDENT EVIL 9/
            </code>
          </p>
        </div>

        <div className="bg-surface border border-borderDark p-5 rounded-2xl space-y-3 shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h3 className="text-sm font-bold text-textMain flex items-center gap-2">
            <FolderCheck className="w-4 h-4 text-secondary" /> Extraire le ZIP Mod
          </h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            Cliquez sur <strong>"Exporter Mod (ZIP)"</strong> dans ce programme et dézippez le contenu directement dans le dossier du jeu.
          </p>
        </div>

        <div className="bg-surface border border-borderDark p-5 rounded-2xl space-y-3 shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h3 className="text-sm font-bold text-textMain flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-accent" /> Lancer RE9
          </h3>
          <p className="text-xs text-textSecondary leading-relaxed">
            Lancez Resident Evil 9. L'overlay REFramework (Touche <strong>Insert</strong>) affichera la seed active et gérera tout le randomizer en temps réel !
          </p>
        </div>
      </div>
    </div>
  );
};
