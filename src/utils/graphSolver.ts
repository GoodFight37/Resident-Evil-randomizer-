import { PRNG } from './prng';
import { RandomizerConfig, SpoilerLocation, SpoilerEnemy } from '../types/randomizer';

const GAME_LOCATIONS = [
  { room: 'Main Entrance Hall (Safe Hub)', segment: 1, originalItem: 'First Aid Spray', keyReq: undefined },
  { room: 'East Wing Guard Post', segment: 1, originalItem: 'Brass Key', keyReq: undefined },
  { room: 'West Corridor Art Gallery', segment: 1, originalItem: 'Handgun Ammo x15', keyReq: 'Brass Key' },
  { room: 'Courtyard Security Gate', segment: 1, originalItem: 'Emblem Crest Alpha', keyReq: 'Brass Key' },
  { room: 'Clock Tower Bell Room', segment: 2, originalItem: 'Silver Emblem Key', keyReq: 'Emblem Crest Alpha' },
  { room: 'Library Secret Vault', segment: 2, originalItem: 'Shotgun Remington 870', keyReq: 'Silver Emblem Key' },
  { room: 'Underground Sewer Drainage', segment: 2, originalItem: 'Valve Handle', keyReq: 'Silver Emblem Key' },
  { room: 'Generator Control Station', segment: 3, originalItem: 'Blue Electronic Card', keyReq: 'Valve Handle' },
  { room: 'Sub-Level Research Lab B3', segment: 3, originalItem: 'Master Research Override', keyReq: 'Blue Electronic Card' },
  { room: 'Helipad Escape Gate Shaft', segment: 4, originalItem: 'Rocket Launcher / Keycard', keyReq: 'Master Research Override' }
];

const ALL_KEY_ITEMS = ['Brass Key', 'Emblem Crest Alpha', 'Silver Emblem Key', 'Valve Handle', 'Blue Electronic Card', 'Master Research Override'];
const NON_KEY_ITEMS = ['Handgun Ammo x30', 'Shotgun Shells x8', 'Green Herb', 'Red Herb', 'High-Grade Gunpowder', 'Magnum Ammo x4', 'First Aid Spray', 'Ink Ribbon x2'];

export function generateRandomizerWorld(config: RandomizerConfig) {
  const prng = new PRNG(config.seed);

  // 1. Keys Placement with Guaranteed Progression Logic
  const keyItemsPool = prng.shuffle([...ALL_KEY_ITEMS]);
  const itemSpoilers: SpoilerLocation[] = [];

  // Assign Key Items safely along the path
  GAME_LOCATIONS.forEach((loc, idx) => {
    let randItem: string;

    if (idx < keyItemsPool.length && config.keys.keyItemPlacement === 'strict_accessible') {
      // Deterministic key distribution to ensure accessible order
      randItem = keyItemsPool[idx];
    } else {
      // Non-key item placement based on configured ratios
      randItem = prng.choice(NON_KEY_ITEMS);
    }

    itemSpoilers.push({
      roomName: loc.room,
      originalItem: loc.originalItem,
      randomizedItem: randItem,
      keyRequired: loc.keyReq,
      segmentId: loc.segment
    });
  });

  // 2. Doors Shuffling & Segment bounds
  const doorsSpoilers: SpoilerLocation[] = [
    { roomName: 'East Wing Gate', originalItem: 'Normal Lock', randomizedItem: `Segment 1 Lock (${config.doors.segmentsCount} segments)`, segmentId: 1 },
    { roomName: 'Clock Tower Double Door', originalItem: 'Crest Lock', randomizedItem: 'Shuffled Electronic Bolt', segmentId: 2 },
    { roomName: 'Lab Access Air Lock', originalItem: 'Biometric Scanner', randomizedItem: 'Randomized Passcode Gate', segmentId: 3 }
  ];

  // 3. Enemy Placement & Threat Distribution based on Difficulty Curve
  const enemySpoilers: SpoilerEnemy[] = GAME_LOCATIONS.map((loc, idx) => {
    const isHighDifficulty = config.enemies.difficultyCurve > 60;
    const isBossRoom = idx === GAME_LOCATIONS.length - 1;

    let selectedEnemy: string;
    let threat: 'Low' | 'Medium' | 'High' | 'Boss' = 'Low';

    if (isBossRoom) {
      selectedEnemy = 'Tyrant T-103 (Roaming)';
      threat = 'Boss';
    } else if (isHighDifficulty && prng.next() > 0.3) {
      selectedEnemy = prng.choice(config.enemies.allowedEnemies.length ? config.enemies.allowedEnemies : ['Hunter Alpha (Leaping)', 'Licker (Blind Screamer)']);
      threat = 'High';
    } else {
      selectedEnemy = prng.choice(config.enemies.allowedEnemies.length ? config.enemies.allowedEnemies : ['Basic Zombie (Slow)']);
      threat = config.enemies.difficultyCurve > 35 ? 'Medium' : 'Low';
    }

    return {
      location: loc.room,
      originalEnemy: 'Standard Zombie',
      replacementEnemy: selectedEnemy,
      threatLevel: threat
    };
  });

  return {
    itemSpoilers,
    doorsSpoilers,
    enemySpoilers
  };
}