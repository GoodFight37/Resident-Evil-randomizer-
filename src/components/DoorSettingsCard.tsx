import React from 'react';
import { DoorClosed, Shield, GitCommit, Layers } from 'lucide-react';
import { DoorSettings } from '../types/randomizer';

interface DoorSettingsCardProps {
  settings: DoorSettings;
  onChange: (settings: DoorSettings) => void;
}

export const DoorSettingsCard: React.FC<DoorSettingsCardProps> = ({ settings, onChange }) => {
  return (
    <div className="bg-surface border border-borderDark rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-borderDark pb-4">
        <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary">
          <DoorClosed className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-textMain">🚪 Randomization des Portes</h2>
          <p className="text-xs text-textSecondary">Génération du graphe de progression et découpage par segments</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Segments count */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-textMain font-medium flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" /> Nombre de segments
            </span>
            <span className="font-mono text-primary font-bold">{settings.segmentsCount} Segments</span>
          </div>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={settings.segmentsCount}
            onChange={(e) => onChange({ ...settings, segmentsCount: parseInt(e.target.value) })}
            className="w-full accent-primary bg-background rounded-lg h-2"
          />
          <div className="flex justify-between text-[11px] text-textSecondary mt-1">
            <span>1 (Linéaire)</span>
            <span>2 (Standard)</span>
            <span>3 (Complexe)</span>
            <span>4 (Super labyrinthique)</span>
          </div>
        </div>

        {/* Avg Segment Size */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-textMain font-medium flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-secondary" /> Taille moyenne de segment
            </span>
            <span className="font-mono text-secondary font-bold">{settings.averageSegmentSize} Salles</span>
          </div>
          <input
            type="range"
            min={2}
            max={10}
            step={1}
            value={settings.averageSegmentSize}
            onChange={(e) => onChange({ ...settings, averageSegmentSize: parseInt(e.target.value) })}
            className="w-full accent-secondary bg-background rounded-lg h-2"
          />
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-3 p-3 bg-background border border-borderDark rounded-xl cursor-pointer hover:border-primary/50 transition">
            <input
              type="checkbox"
              checked={settings.guaranteedGraphProgression}
              onChange={(e) => onChange({ ...settings, guaranteedGraphProgression: e.target.checked })}
              className="w-4 h-4 accent-primary rounded"
            />
            <div>
              <span className="text-sm font-semibold text-textMain block">Graphe de progression garanti complétable</span>
              <span className="text-xs text-textSecondary">Résolution mathématique empêchant tout blocage logique (softlock)</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-background border border-borderDark rounded-xl cursor-pointer hover:border-primary/50 transition">
            <input
              type="checkbox"
              checked={settings.unlockableShortcuts}
              onChange={(e) => onChange({ ...settings, unlockableShortcuts: e.target.checked })}
              className="w-4 h-4 accent-primary rounded"
            />
            <div>
              <span className="text-sm font-semibold text-textMain block">Raccourcis débloquables aléatoires</span>
              <span className="text-xs text-textSecondary">Ouvre des passages secrets vers les segments précédents</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-background border border-borderDark rounded-xl cursor-pointer hover:border-primary/50 transition">
            <input
              type="checkbox"
              checked={settings.safeHubRoomOnStart}
              onChange={(e) => onChange({ ...settings, safeHubRoomOnStart: e.target.checked })}
              className="w-4 h-4 accent-primary rounded"
            />
            <div>
              <span className="text-sm font-semibold text-textMain block flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-success" /> Salle avec coffre accessible au départ
              </span>
              <span className="text-xs text-textSecondary">Assure un accès immédiat au coffre et à la machine à écrire</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
