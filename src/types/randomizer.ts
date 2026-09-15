export type PresetType = 'beginner' | 'standard' | 'hardcore' | 'chaos' | 'custom';

export interface DoorSettings {
  segmentsCount: number; // 1 to 4
  averageSegmentSize: number; // 2 to 10 rooms
  guaranteedGraphProgression: boolean;
  unlockableShortcuts: boolean;
  safeHubRoomOnStart: boolean;
}

export interface KeySettings {
  keyItemPlacement: 'strict_accessible' | 'flexible' | 'chaotic';
  includeDocuments: boolean;
  allowAlternateRoutes: boolean;
  safeKeyPlacementNoReturn: boolean;
}

export interface ItemSettings {
  poolMode: 'original_shuffle' | 'full_random_replacement';
  startingWeapons: string[]; // max 2
  startingPowderCount: number;
  startingAmmoCount: number;
  startingHealingCount: number;
  randomizeNonKeyItems: boolean;
  randomizeWeaponsPlacement: boolean;
  ammoOnlyForHeldWeapons: boolean;
  dropRatioPowder: number; // 0 - 100
  dropRatioAmmo: number; // 0 - 100
  dropRatioHealing: number; // 0 - 100
  dropRatioInkRibbons: number; // 0 - 100
  averagePickQuantityMultiplier: number; // 0.5 to 3.0
}

export interface EnemySettings {
  difficultyCurve: number; // 0 (slow/dodgeable) to 100 (fast/lethal)
  blacklistedScriptedEnemies: boolean;
  densityMultiplier: number; // 0.5 to 2.5
  allowedEnemies: string[];
}

export interface CharacterAudioSettings {
  playableCharacter: string; // "Leon", "Grace", "Ethan", "Ada", "Chris"
  randomizeNPCAndVoices: boolean;
  syncVoiceWithSubstitutedModel: boolean;
  audioBlacklistCutsceneCrash: boolean;
  randomizeMusicByMood: boolean;
  useCustomAudioFolders: boolean;
  customFolderTags: string[]; // ["calm", "eerie", "danger"]
}

export interface RandomizerConfig {
  seed: string;
  preset: PresetType;
  doors: DoorSettings;
  keys: KeySettings;
  items: ItemSettings;
  enemies: EnemySettings;
  characterAudio: CharacterAudioSettings;
}

export interface RunHistoryEntry {
  id: string;
  timestamp: string;
  seed: string;
  preset: PresetType;
  config: RandomizerConfig;
  notes?: string;
}

export interface SpoilerLocation {
  roomName: string;
  originalItem: string;
  randomizedItem: string;
  keyRequired?: string;
  segmentId: number;
}

export interface SpoilerEnemy {
  location: string;
  originalEnemy: string;
  replacementEnemy: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Boss';
}

export interface GeneratedData {
  config: RandomizerConfig;
  doorsSpoilers: SpoilerLocation[];
  itemSpoilers: SpoilerLocation[];
  enemySpoilers: SpoilerEnemy[];
  luaScript: string;
}