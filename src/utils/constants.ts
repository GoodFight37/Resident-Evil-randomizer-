import { RandomizerConfig } from '../types/randomizer';

export const AVAILABLE_WEAPONS = [
  'Handgun VP9',
  'Shotgun Remington 870',
  'Magnum Lightning Hawk',
  'Submachine Gun MP5',
  'Grenade Launcher',
  'Sniper Rifle Bolt-Action',
  'Combat Knife High-Carbon',
  'Spark Shot Special'
];

export const AVAILABLE_ENEMIES = [
  'Basic Zombie (Slow)',
  'Crimson Head (Runner)',
  'Licker (Blind Screamer)',
  'Hunter Alpha (Leaping)',
  'Molded (Armblade)',
  'Ganado Axe Thrower',
  'Executioner Majini',
  'Tyrant T-103 (Roaming)',
  'Chainsaw Ganado'
];

export const AVAILABLE_CHARACTERS = [
  'Grace Howard (RE9 Protagonist)',
  'Leon S. Kennedy (Tactical Spec-Ops)',
  'Chris Redfield (BSAA Lead)',
  'Jill Valentine (STARS Original)',
  'Ada Wong (Undercover)'
];

export const DEFAULT_PRESETS: Record<string, RandomizerConfig> = {
  beginner: {
    seed: 'BEGINNER-SAFE-999',
    preset: 'beginner',
    doors: {
      segmentsCount: 2,
      averageSegmentSize: 4,
      guaranteedGraphProgression: true,
      unlockableShortcuts: true,
      safeHubRoomOnStart: true
    },
    keys: {
      keyItemPlacement: 'strict_accessible',
      includeDocuments: true,
      allowAlternateRoutes: true,
      safeKeyPlacementNoReturn: true
    },
    items: {
      poolMode: 'original_shuffle',
      startingWeapons: ['Handgun VP9', 'Combat Knife High-Carbon'],
      startingPowderCount: 3,
      startingAmmoCount: 60,
      startingHealingCount: 3,
      randomizeNonKeyItems: true,
      randomizeWeaponsPlacement: true,
      ammoOnlyForHeldWeapons: true,
      dropRatioPowder: 30,
      dropRatioAmmo: 45,
      dropRatioHealing: 25,
      dropRatioInkRibbons: 0,
      averagePickQuantityMultiplier: 1.5
    },
    enemies: {
      difficultyCurve: 25,
      blacklistedScriptedEnemies: true,
      densityMultiplier: 0.8,
      allowedEnemies: ['Basic Zombie (Slow)', 'Crimson Head (Runner)', 'Ganado Axe Thrower']
    },
    characterAudio: {
      playableCharacter: 'Grace Howard (RE9 Protagonist)',
      randomizeNPCAndVoices: false,
      syncVoiceWithSubstitutedModel: true,
      audioBlacklistCutsceneCrash: true,
      randomizeMusicByMood: true,
      useCustomAudioFolders: false,
      customFolderTags: ['calm', 'eerie', 'danger']
    }
  },
  standard: {
    seed: 'BIO-RAND-9-STANDARD',
    preset: 'standard',
    doors: {
      segmentsCount: 3,
      averageSegmentSize: 6,
      guaranteedGraphProgression: true,
      unlockableShortcuts: true,
      safeHubRoomOnStart: true
    },
    keys: {
      keyItemPlacement: 'strict_accessible',
      includeDocuments: true,
      allowAlternateRoutes: true,
      safeKeyPlacementNoReturn: true
    },
    items: {
      poolMode: 'original_shuffle',
      startingWeapons: ['Handgun VP9'],
      startingPowderCount: 2,
      startingAmmoCount: 30,
      startingHealingCount: 2,
      randomizeNonKeyItems: true,
      randomizeWeaponsPlacement: true,
      ammoOnlyForHeldWeapons: true,
      dropRatioPowder: 25,
      dropRatioAmmo: 40,
      dropRatioHealing: 20,
      dropRatioInkRibbons: 15,
      averagePickQuantityMultiplier: 1.0
    },
    enemies: {
      difficultyCurve: 50,
      blacklistedScriptedEnemies: true,
      densityMultiplier: 1.0,
      allowedEnemies: ['Basic Zombie (Slow)', 'Crimson Head (Runner)', 'Licker (Blind Screamer)', 'Hunter Alpha (Leaping)', 'Ganado Axe Thrower']
    },
    characterAudio: {
      playableCharacter: 'Grace Howard (RE9 Protagonist)',
      randomizeNPCAndVoices: true,
      syncVoiceWithSubstitutedModel: true,
      audioBlacklistCutsceneCrash: true,
      randomizeMusicByMood: true,
      useCustomAudioFolders: true,
      customFolderTags: ['calm', 'eerie', 'danger']
    }
  },
  hardcore: {
    seed: 'HARDCORE-REQUIEM-007',
    preset: 'hardcore',
    doors: {
      segmentsCount: 4,
      averageSegmentSize: 8,
      guaranteedGraphProgression: true,
      unlockableShortcuts: false,
      safeHubRoomOnStart: false
    },
    keys: {
      keyItemPlacement: 'strict_accessible',
      includeDocuments: false,
      allowAlternateRoutes: true,
      safeKeyPlacementNoReturn: true
    },
    items: {
      poolMode: 'full_random_replacement',
      startingWeapons: ['Combat Knife High-Carbon'],
      startingPowderCount: 1,
      startingAmmoCount: 15,
      startingHealingCount: 1,
      randomizeNonKeyItems: true,
      randomizeWeaponsPlacement: true,
      ammoOnlyForHeldWeapons: false,
      dropRatioPowder: 20,
      dropRatioAmmo: 30,
      dropRatioHealing: 10,
      dropRatioInkRibbons: 20,
      averagePickQuantityMultiplier: 0.7
    },
    enemies: {
      difficultyCurve: 80,
      blacklistedScriptedEnemies: true,
      densityMultiplier: 1.4,
      allowedEnemies: ['Crimson Head (Runner)', 'Licker (Blind Screamer)', 'Hunter Alpha (Leaping)', 'Molded (Armblade)', 'Tyrant T-103 (Roaming)']
    },
    characterAudio: {
      playableCharacter: 'Leon S. Kennedy (Tactical Spec-Ops)',
      randomizeNPCAndVoices: true,
      syncVoiceWithSubstitutedModel: true,
      audioBlacklistCutsceneCrash: true,
      randomizeMusicByMood: true,
      useCustomAudioFolders: true,
      customFolderTags: ['calm', 'eerie', 'danger']
    }
  },
  chaos: {
    seed: 'PURE-CHAOS-RE9-666',
    preset: 'chaos',
    doors: {
      segmentsCount: 4,
      averageSegmentSize: 10,
      guaranteedGraphProgression: true,
      unlockableShortcuts: true,
      safeHubRoomOnStart: false
    },
    keys: {
      keyItemPlacement: 'chaotic',
      includeDocuments: true,
      allowAlternateRoutes: true,
      safeKeyPlacementNoReturn: true
    },
    items: {
      poolMode: 'full_random_replacement',
      startingWeapons: ['Magnum Lightning Hawk'],
      startingPowderCount: 0,
      startingAmmoCount: 6,
      startingHealingCount: 0,
      randomizeNonKeyItems: true,
      randomizeWeaponsPlacement: true,
      ammoOnlyForHeldWeapons: false,
      dropRatioPowder: 15,
      dropRatioAmmo: 50,
      dropRatioHealing: 15,
      dropRatioInkRibbons: 20,
      averagePickQuantityMultiplier: 2.0
    },
    enemies: {
      difficultyCurve: 100,
      blacklistedScriptedEnemies: true,
      densityMultiplier: 2.0,
      allowedEnemies: AVAILABLE_ENEMIES
    },
    characterAudio: {
      playableCharacter: 'Ada Wong (Undercover)',
      randomizeNPCAndVoices: true,
      syncVoiceWithSubstitutedModel: false,
      audioBlacklistCutsceneCrash: true,
      randomizeMusicByMood: true,
      useCustomAudioFolders: true,
      customFolderTags: ['calm', 'eerie', 'danger']
    }
  }
};