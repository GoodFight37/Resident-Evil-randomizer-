import React from 'react';
import { Skull, AlertTriangle, ShieldOff, Gauge } from 'lucide-react';
import { EnemySettings } from '../types/randomizer';
import { AVAILABLE_ENEMIES } from '../utils/constants';

interface EnemySettingsCardProps {
  settings: EnemySettings;
  onChange: (settings: EnemySettings) => void;
}

export const EnemySettingsCard: React.FC<EnemySettingsCardProps> = ({ settings, onChange }) => {
  const toggleEnemy = (enemy: string) => {
    let current = [...settings.allowedEnemies];
    if (current.includes(enemy)) {
      current = current.filter(e => e !== enemy);
    } else {
      current.push(enemy);
    }
    onChange({ ...settings, allowedEnemies: current });
  };

  return (
    <div className="bg-surface border border-borderDark rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-borderDark pb-4">
        <div className="p-2.5 bg-error/10 rounded-xl border border-error/20 text-error">
          <Skull className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-textMain">🧟 Randomization des Ennemis</h2>
          <p className="text-xs text-textSecondary">Courbe de difficulté, densité et liste d'exclusion anti-crash</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Difficulty Slider */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-textMain font-medium flex items-center gap-2">
              <Gauge className="w-4 h-4 text-error" /> Curseur de Difficulté des Ennemis
            </span>
            <span className="font-mono text-error font-bold">{settings.difficultyCurve}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.difficultyCurve}
            onChange={(e) => onChange({ ...settings, difficultyCurve: parseInt(e.target.value) })}
            className="w-full accent-error bg-background rounded-lg h-2"
          />
          <div className="flex justify-between text-[11px] text-textSecondary mt-1">
            <span>0 (Lents & Esquivables)</span>
            <span>50 (Équilibré)</span>
            <span>100 (Rapides & Létaux)</span>
          </div>
        </div>

        {/* Density Multiplier */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-textMain font-medium">Densité d'apparition</span>
            <span className="font-mono text-primary font-bold">{settings.densityMultiplier.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2.5}
            step={0.1}
            value={settings.densityMultiplier}
            onChange={(e) => onChange({ ...settings, densityMultiplier: parseFloat(e.target.value) })}
            className="w-full accent-primary bg-background rounded-lg h-2"
          />
        </div>

        {/* Scripted Enemy Blacklist Anti-Crash */}
        <label className="flex items-center gap-3 p-3.5 bg-background border border-error/30 rounded-xl cursor-pointer hover:border-error transition">
          <input
            type="checkbox"
            checked={settings.blacklistedScriptedEnemies}
            onChange={(e) => onChange({ ...settings, blacklistedScriptedEnemies: e.target.checked })}
            className="w-4 h-4 accent-error rounded"
          />
          <div>
            <span className="text-sm font-semibold text-textMain flex items-center gap-1.5">
              <ShieldOff className="w-4 h-4 text-warning" /> Exclure les ennemis scriptés à crash
            </span>
            <span className="text-xs text-textSecondary">Évite de remplacer les boss déclenchant une cinématique pour préserver le jeu</span>
          </div>
        </label>

        {/* Allowed Enemies Checkboxes */}
        <div>
          <label className="text-sm font-semibold text-textMain block mb-2">Types d'ennemis autorisés</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {AVAILABLE_ENEMIES.map((e) => {
              const selected = settings.allowedEnemies.includes(e);
              return (
                <button
                  key={e}
                  onClick={() => toggleEnemy(e)}
                  className={`p-2.5 rounded-xl text-xs text-left border transition flex items-center justify-between ${
                    selected
                      ? 'bg-surface border-error text-textMain font-bold shadow-md shadow-error/10'
                      : 'bg-background text-textSecondary border-borderDark hover:text-textMain'
                  }`}
                >
                  <span>{e}</span>
                  <span className={`w-2 h-2 rounded-full ${selected ? 'bg-error' : 'bg-borderDark'}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
