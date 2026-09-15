import React from 'react';
import { History, Play, Trash2, Calendar, Dices } from 'lucide-react';
import { RunHistoryEntry, RandomizerConfig } from '../types/randomizer';

interface RunHistoryViewProps {
  history: RunHistoryEntry[];
  onLoadConfig: (config: RandomizerConfig) => void;
  onClearHistory: () => void;
}

export const RunHistoryView: React.FC<RunHistoryViewProps> = ({
  history,
  onLoadConfig,
  onClearHistory
}) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between bg-surface border border-borderDark p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-textMain">Run History & Seeds</h2>
            <p className="text-xs text-textSecondary">Reload or share any configuration in 1 click</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-2 px-3 py-1.5 bg-error/15 text-error border border-error/30 hover:bg-error/25 rounded-xl text-xs font-semibold transition"
          >
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-borderDark rounded-2xl space-y-3">
          <Dices className="w-10 h-10 text-textSecondary mx-auto animate-bounce" />
          <p className="text-sm font-semibold text-textMain">No runs recorded yet</p>
          <p className="text-xs text-textSecondary">Your generated & exported seeds will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="bg-surface border border-borderDark rounded-2xl p-4 space-y-4 shadow-lg hover:border-primary/50 transition"
            >
              <div className="flex items-center justify-between border-b border-borderDark pb-3">
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                  {entry.seed}
                </span>
                <span className="text-[11px] text-textSecondary flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {entry.timestamp}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-textSecondary">Preset:</span>
                  <span className="font-semibold text-textMain capitalize">{entry.preset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Door Segments:</span>
                  <span className="font-semibold text-textMain">{entry.config.doors.segmentsCount} Segments</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Enemy Difficulty:</span>
                  <span className="font-semibold text-error">{entry.config.enemies.difficultyCurve}%</span>
                </div>
              </div>

              <button
                onClick={() => onLoadConfig(entry.config)}
                className="w-full flex items-center justify-center gap-2 py-2 bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 rounded-xl text-xs font-bold transition"
              >
                <Play className="w-4 h-4" /> Reload This Seed
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};