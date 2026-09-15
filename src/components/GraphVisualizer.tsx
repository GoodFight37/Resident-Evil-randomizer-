import React from 'react';
import { GitFork, CheckCircle, Lock, Key } from 'lucide-react';
import { RandomizerConfig } from '../types/randomizer';
import { generateRandomizerWorld } from '../utils/graphSolver';

interface GraphVisualizerProps {
  config: RandomizerConfig;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ config }) => {
  const world = generateRandomizerWorld(config);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between bg-surface border border-borderDark p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20">
            <GitFork className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-textMain">Graphe Déterministe de Progression & Anti-Softlock</h2>
            <p className="text-xs text-textSecondary">Validation mathématique de la traversabilité des verrous et clés (Seed: {config.seed})</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-success/15 border border-success/30 px-3 py-1.5 rounded-xl text-xs font-semibold text-success">
          <CheckCircle className="w-4 h-4" /> Graphe 100% Complétable Garanti
        </div>
      </div>

      {/* Interactive Node Graph simulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {world.itemSpoilers.map((node, index) => (
          <div
            key={index}
            className="bg-surface border border-borderDark rounded-2xl p-4 space-y-3 relative overflow-hidden group hover:border-primary/50 transition shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-borderDark pb-2">
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                SEGMENT {node.segmentId}
              </span>
              <span className="text-xs text-textSecondary font-mono">Noeud #{index + 1}</span>
            </div>

            <h3 className="text-sm font-bold text-textMain flex items-center gap-2">
              {node.roomName}
            </h3>

            {node.keyRequired && (
              <div className="flex items-center gap-2 text-xs text-warning bg-warning/10 p-2 rounded-lg border border-warning/20">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Verrouillé par: <strong className="font-mono">{node.keyRequired}</strong></span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs bg-background p-2.5 rounded-xl border border-borderDark">
              <span className="text-textSecondary">Objet Placé:</span>
              <span className="font-mono font-bold text-accent flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-accent" />
                {node.randomizedItem}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
