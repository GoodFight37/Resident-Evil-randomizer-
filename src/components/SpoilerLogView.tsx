import React, { useState } from 'react';
import { Search, Eye, EyeOff, ShieldAlert, FileText } from 'lucide-react';
import { RandomizerConfig } from '../types/randomizer';
import { generateRandomizerWorld } from '../utils/graphSolver';

interface SpoilerLogViewProps {
  config: RandomizerConfig;
}

export const SpoilerLogView: React.FC<SpoilerLogViewProps> = ({ config }) => {
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const world = generateRandomizerWorld(config);

  const filteredItems = world.itemSpoilers.filter(item =>
    item.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.randomizedItem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between bg-surface border border-borderDark p-4 rounded-2xl gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-accent/10 rounded-xl text-accent border border-accent/20">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-textMain">Spoiler Log & Registre de la Seed</h2>
            <p className="text-xs text-textSecondary">Inspectez les emplacements d'objets et d'ennemis tirés au sort</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-textSecondary absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher salle ou objet..."
              className="bg-background border border-borderDark text-textMain text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-accent w-56"
            />
          </div>

          <button
            onClick={() => setShowSpoilers(!showSpoilers)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border ${
              showSpoilers
                ? 'bg-warning/15 text-warning border-warning/30'
                : 'bg-primary text-background border-primary'
            }`}
          >
            {showSpoilers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showSpoilers ? 'Masquer les Spoilers' : 'Afficher les Spoilers'}
          </button>
        </div>
      </div>

      {/* Table view */}
      <div className="bg-surface border border-borderDark rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-textMain border-collapse">
          <thead>
            <tr className="bg-background border-b border-borderDark text-textSecondary uppercase font-mono">
              <th className="p-3.5">Segment</th>
              <th className="p-3.5">Emplacement / Salle</th>
              <th className="p-3.5">Objet d'Origine</th>
              <th className="p-3.5">Objet Randomized</th>
              <th className="p-3.5">Ennemi Présent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderDark">
            {filteredItems.map((item, idx) => {
              const enemy = world.enemySpoilers[idx];
              return (
                <tr key={idx} className="hover:bg-background/50 transition">
                  <td className="p-3.5 font-mono text-primary font-bold">Seg {item.segmentId}</td>
                  <td className="p-3.5 font-semibold text-textMain">{item.roomName}</td>
                  <td className="p-3.5 text-textSecondary line-through decoration-borderDark">{item.originalItem}</td>
                  <td className="p-3.5">
                    {showSpoilers ? (
                      <span className="font-mono font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-lg border border-accent/20">
                        {item.randomizedItem}
                      </span>
                    ) : (
                      <span className="text-textSecondary italic select-none filter blur-sm">
                        [SPOILER HIDDEN]
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {showSpoilers ? (
                      <span className="text-error font-medium">{enemy?.replacementEnemy}</span>
                    ) : (
                      <span className="text-textSecondary italic select-none filter blur-sm">
                        [ENEMY HIDDEN]
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
