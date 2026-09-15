import React from 'react';
import { UserCheck, Mic, Music, Disc } from 'lucide-react';
import { CharacterAudioSettings } from '../types/randomizer';
import { AVAILABLE_CHARACTERS } from '../utils/constants';

interface CharacterAudioCardProps {
  settings: CharacterAudioSettings;
  onChange: (settings: CharacterAudioSettings) => void;
}

export const CharacterAudioCard: React.FC<CharacterAudioCardProps> = ({ settings, onChange }) => {
  return (
    <div className="bg-surface border border-borderDark rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-borderDark pb-4">
        <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 text-primary">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-textMain">Character & Audio / Music</h2>
          <p className="text-xs text-textSecondary">Playable model swap, voice sync & mood-based music</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Playable Character Selection */}
        <div>
          <label className="text-sm font-semibold text-textMain block mb-2">Playable Character Swap</label>
          <select
            value={settings.playableCharacter}
            onChange={(e) => onChange({ ...settings, playableCharacter: e.target.value })}
            className="w-full bg-background border border-borderDark rounded-xl p-3 text-sm text-textMain focus:outline-none focus:border-primary transition"
          >
            {AVAILABLE_CHARACTERS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Voice and NPC randomization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-3 p-3 bg-background border border-borderDark rounded-xl cursor-pointer hover:border-primary/50 transition">
            <input
              type="checkbox"
              checked={settings.randomizeNPCAndVoices}
              onChange={(e) => onChange({ ...settings, randomizeNPCAndVoices: e.target.checked })}
              className="w-4 h-4 accent-primary rounded"
            />
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-secondary" />
              <div>
                <span className="text-sm font-semibold text-textMain block">🎤 Randomize NPCs & Voices</span>
                <span className="text-xs text-textSecondary">Shuffles NPC voices & actors</span>
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-background border border-borderDark rounded-xl cursor-pointer hover:border-primary/50 transition">
            <input
              type="checkbox"
              checked={settings.syncVoiceWithSubstitutedModel}
              onChange={(e) => onChange({ ...settings, syncVoiceWithSubstitutedModel: e.target.checked })}
              className="w-4 h-4 accent-primary rounded"
            />
            <div>
              <span className="text-sm font-semibold text-textMain block">Sync Voice To Model</span>
              <span className="text-xs text-textSecondary">Matches voice timbre to selected character</span>
            </div>
          </label>
        </div>

        {/* Music Randomization */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-textMain flex items-center gap-2">
            <Music className="w-4 h-4 text-accent" /> 🎶 Soundtrack & Music
          </h3>

          <label className="flex items-center gap-3 p-3 bg-background border border-borderDark rounded-xl cursor-pointer hover:border-accent/50 transition">
            <input
              type="checkbox"
              checked={settings.randomizeMusicByMood}
              onChange={(e) => onChange({ ...settings, randomizeMusicByMood: e.target.checked })}
              className="w-4 h-4 accent-accent rounded"
            />
            <div>
              <span className="text-sm font-semibold text-textMain block">Mood-Based Music Shuffle</span>
              <span className="text-xs text-textSecondary">Consistent categories: [Calm / Eerie / Danger / Boss]</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 bg-background border border-borderDark rounded-xl cursor-pointer hover:border-accent/50 transition">
            <input
              type="checkbox"
              checked={settings.useCustomAudioFolders}
              onChange={(e) => onChange({ ...settings, useCustomAudioFolders: e.target.checked })}
              className="w-4 h-4 accent-accent rounded"
            />
            <div>
              <span className="text-sm font-semibold text-textMain block flex items-center gap-1.5">
                <Disc className="w-4 h-4 text-accent" /> Custom Music Folder Support
              </span>
              <span className="text-xs text-textSecondary">
                Auto-loads files placed in <code className="text-accent font-mono">custom/{'{tag}'}</code> (calm, eerie, danger)
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};