import React from 'react';
import { KeyRound, FileText, Route, ShieldCheck } from 'lucide-react';
import { KeySettings } from '../types/randomizer';

interface KeySettingsCardProps {
  settings: KeySettings;
  onChange: (settings: KeySettings) => void;
}

export const KeySettingsCard: React.FC<KeySettingsCardProps> = ({ settings, onChange }) => {
  return (
    <div className="bg-surface border border-borderDark rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-borderDark pb-4">
        <div className="p-2.5 bg-secondary/10 rounded-xl border border-secondary/20 text-secondary">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-textMain">Key Items & Required Objects</h2>
          <p className="text-xs text-textSecondary">Lock accessibility & security rules</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-textMain block mb-2">Key Placement Mode</label>
          <select
            value={settings.keyItemPlacement}
            onChange={(e) => onChange({ ...settings, keyItemPlacement: e.target.value as any })}
            className="w-full bg-background border border-borderDark rounded-xl p-3 text-sm text-textMain focus:outline-none focus:border-secondary transition"
          >
            <option value="strict_accessible">Always Accessible Before Required Lock (Strict)</option>
            <option value="flexible">Flexible (Keys in optional containers)</option>
            <option value="chaotic">Chaotic (Any valid location in graph)</option>
          </select>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-3 p-3 bg-background border border-borderDark rounded-xl cursor-pointer hover:border-secondary/50 transition">
            <input
              type="checkbox"
              checked={settings.includeDocuments}
              onChange={(e) => onChange({ ...settings, includeDocuments: e.target.checked })}
              className="w-4 h-4 accent-secondary rounded"
            />
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              <div>
                <span className="text-sm font-semibold text-textMain block">Include Documents</span>
                <span className="text-xs text-textSecondary">Also randomizes notes, journals and files</span>
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-background border border-borderDark rounded-xl cursor-pointer hover:border-secondary/50 transition">
            <input
              type="checkbox"
              checked={settings.allowAlternateRoutes}
              onChange={(e) => onChange({ ...settings, allowAlternateRoutes: e.target.checked })}
              className="w-4 h-4 accent-secondary rounded"
            />
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-primary" />
              <div>
                <span className="text-sm font-semibold text-textMain block">Allow Alternate Routes</span>
                <span className="text-xs text-textSecondary">Allows progression via secondary unlockable paths</span>
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-background border border-borderDark rounded-xl cursor-pointer hover:border-secondary/50 transition">
            <input
              type="checkbox"
              checked={settings.safeKeyPlacementNoReturn}
              onChange={(e) => onChange({ ...settings, safeKeyPlacementNoReturn: e.target.checked })}
              className="w-4 h-4 accent-secondary rounded"
            />
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-success" />
              <div>
                <span className="text-sm font-semibold text-textMain block">Safe Key Placement (Anti Soft-Lock)</span>
                <span className="text-xs text-textSecondary">Prevents keys from being locked behind point-of-no-return events</span>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};