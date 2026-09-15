import React from 'react';
import { Backpack, Package, Crosshair, Droplet } from 'lucide-react';
import { ItemSettings } from '../types/randomizer';
import { AVAILABLE_WEAPONS } from '../utils/constants';

interface ItemSettingsCardProps {
  settings: ItemSettings;
  onChange: (settings: ItemSettings) => void;
}

export const ItemSettingsCard: React.FC<ItemSettingsCardProps> = ({ settings, onChange }) => {
  const toggleWeapon = (weapon: string) => {
    let current = [...settings.startingWeapons];
    if (current.includes(weapon)) {
      current = current.filter(w => w !== weapon);
    } else {
      if (current.length < 2) {
        current.push(weapon);
      }
    }
    onChange({ ...settings, startingWeapons: current });
  };

  return (
    <div className="bg-surface border border-borderDark rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-borderDark pb-4">
        <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20 text-accent">
          <Backpack className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-textMain">Inventory & Item Randomization</h2>
          <p className="text-xs text-textSecondary">Item pool, starting loadout, smart ammo & consumables</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Pool Mode */}
        <div>
          <label className="text-sm font-semibold text-textMain block mb-2">Item Pool Mode</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => onChange({ ...settings, poolMode: 'original_shuffle' })}
              className={`p-3 rounded-xl border text-left transition ${
                settings.poolMode === 'original_shuffle'
                  ? 'border-accent bg-accent/10 text-textMain font-semibold'
                  : 'border-borderDark bg-background text-textSecondary hover:text-textMain'
              }`}
            >
              <div className="text-sm font-bold">Shuffle Original Content</div>
              <div className="text-xs text-textSecondary">Keeps original quantities, shuffles locations</div>
            </button>
            <button
              onClick={() => onChange({ ...settings, poolMode: 'full_random_replacement' })}
              className={`p-3 rounded-xl border text-left transition ${
                settings.poolMode === 'full_random_replacement'
                  ? 'border-accent bg-accent/10 text-textMain font-semibold'
                  : 'border-borderDark bg-background text-textSecondary hover:text-textMain'
              }`}
            >
              <div className="text-sm font-bold">Fully Randomized Replacement</div>
              <div className="text-xs text-textSecondary">Full replacement by random types & weights</div>
            </button>
          </div>
        </div>

        {/* Starting Loadout Weapons */}
        <div>
          <label className="text-sm font-semibold text-textMain block mb-2">
            Starting Weapons (Up to 2)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AVAILABLE_WEAPONS.map((w) => {
              const selected = settings.startingWeapons.includes(w);
              return (
                <button
                  key={w}
                  onClick={() => toggleWeapon(w)}
                  className={`p-2 rounded-lg text-xs font-medium border text-center transition ${
                    selected
                      ? 'bg-accent text-background border-accent font-bold'
                      : 'bg-background text-textSecondary border-borderDark hover:border-accent/40'
                  }`}
                >
                  {w}
                </button>
              );
            })}
          </div>
        </div>

        {/* Smart ammo matching & Non-key randomizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-3 p-3 bg-background border border-borderDark rounded-xl cursor-pointer hover:border-accent/50 transition">
            <input
              type="checkbox"
              checked={settings.randomizeNonKeyItems}
              onChange={(e) => onChange({ ...settings, randomizeNonKeyItems: e.target.checked })}
              className="w-4 h-4 accent-accent rounded"
            />
            <div>
              <span className="text-sm font-semibold text-textMain block">Randomize Non-Key Items</span>
              <span className="text-xs text-textSecondary">Weapons & consumables on ground</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-background border border-borderDark rounded-xl cursor-pointer hover:border-accent/50 transition">
            <input
              type="checkbox"
              checked={settings.ammoOnlyForHeldWeapons}
              onChange={(e) => onChange({ ...settings, ammoOnlyForHeldWeapons: e.target.checked })}
              className="w-4 h-4 accent-accent rounded"
            />
            <div>
              <span className="text-sm font-semibold text-textMain block">Ammo For Owned Weapons Only</span>
              <span className="text-xs text-textSecondary">Only generates ammo if weapon is owned/found</span>
            </div>
          </label>
        </div>

        {/* Drop Ratios Sliders */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-textMain border-b border-borderDark pb-2 flex items-center gap-2">
            <Droplet className="w-4 h-4 text-accent" /> Loot Ratios (0 = Never)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-textSecondary">Gunpowder:</span>
                <span className="font-mono text-accent font-bold">{settings.dropRatioPowder}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.dropRatioPowder}
                onChange={(e) => onChange({ ...settings, dropRatioPowder: parseInt(e.target.value) })}
                className="w-full accent-accent bg-background rounded-lg h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-textSecondary">Direct Ammo:</span>
                <span className="font-mono text-accent font-bold">{settings.dropRatioAmmo}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.dropRatioAmmo}
                onChange={(e) => onChange({ ...settings, dropRatioAmmo: parseInt(e.target.value) })}
                className="w-full accent-accent bg-background rounded-lg h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-textSecondary">Healing (Herbs / Sprays):</span>
                <span className="font-mono text-accent font-bold">{settings.dropRatioHealing}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.dropRatioHealing}
                onChange={(e) => onChange({ ...settings, dropRatioHealing: parseInt(e.target.value) })}
                className="w-full accent-accent bg-background rounded-lg h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-textSecondary">Ink Ribbons:</span>
                <span className="font-mono text-accent font-bold">{settings.dropRatioInkRibbons}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.dropRatioInkRibbons}
                onChange={(e) => onChange({ ...settings, dropRatioInkRibbons: parseInt(e.target.value) })}
                className="w-full accent-accent bg-background rounded-lg h-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};