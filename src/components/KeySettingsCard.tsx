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
          <h2 className="text-lg font-bold text-textMain">🔑 Randomization des Clés & Objets Requis</h2>
          <p className="text-xs text-textSecondary">Règles d'accessibilité et sécurité des verrous</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-textMain block mb-2">Mode de placement des clés</label>
          <select
            value={settings.keyItemPlacement}
            onChange={(e) => onChange({ ...settings, keyItemPlacement: e.target.value as any })}
            className="w-full bg-background border border-borderDark rounded-xl p-3 text-sm text-textMain focus:outline-none focus:border-secondary transition"
          >
            <option value="strict_accessible">Toujours accessible avant la serrure exigée (Strict RE Standards)</option>
            <option value="flexible">Flexible (Clés dans des conteneurs optionnels)</option>
            <option value="chaotic">Chaotique (Tout endroit valide du graphe)</option>
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
                <span className="text-sm font-semibold text-textMain block">🗎 Inclure les documents</span>
                <span className="text-xs text-textSecondary">Randomise aussi l'emplacement des notes, journaux et dossiers</span>
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
                <span className="text-sm font-semibold text-textMain block">🔂 Autoriser les routes alternatives</span>
                <span className="text-xs text-textSecondary">Permet la progression par des chemins secondaires déblocables</span>
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
                <span className="text-sm font-semibold text-textMain block">🔐 Placement sûr des clés (Anti points de non-retour)</span>
                <span className="text-xs text-textSecondary">Garantit qu'aucune clé ne se retrouve coincée après un effondrement ou cinématique</span>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
