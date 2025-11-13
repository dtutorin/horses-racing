import type { Horse, Program, RaceEntry, RaceResultItem, RaceRound, RaceRoundSpec } from '../interfaces/index';
import { RaceRoundStatus } from '../interfaces/IRaces.type';
import { pickN, randomInt } from '../utils/random';

const ROUND_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200];

const DEFAULT_LANE_COUNT = 10;
const HORSES_COUNT = 20;

const DEFAULT_HORSE_NAMES = [
  "Starlight",
  "Thunderbolt",
  "Midnight",
  "Blaze",
  "Whisper",
  "Stormchaser",
  "Velvet",
  "Maverick",
  "Shadow",
  "Eclipse",
  "Ember",
  "Spirit",
  "Raven",
  "Zephyr",
  "Comet",
  "Sable",
  "Drifter",
  "Aurora",
  "Bandit",
  "Mist",
  "Phantom",
  "Cinder",
  "Scout",
  "Dusk",
  "Harmony",
  "Jet",
  "Willow",
  "Ranger",
  "Frost",
  "Gypsy"
];

const DISTINCT_COLORS = [
  '#e6194b', '#3cb44b', '#ffe119', '#0082c8', '#f58231',
  '#911eb4', '#46f0f0', '#f032e6', '#d2f53c', '#fabebe',
  '#008080', '#e6beff', '#aa6e28', '#fffac8', '#800000',
  '#aaffc3', '#808000', '#ffd8b1', '#000080', '#808080',
];

export function generateHorses(): Horse[] {
  const selectedNames = pickN(DEFAULT_HORSE_NAMES, HORSES_COUNT);
  return selectedNames.map((name, i): Horse => ({
    id: `h${i + 1}`,
    name,
    color: DISTINCT_COLORS[i % DISTINCT_COLORS.length]!,
    condition: randomInt(1, 100),
  }));
}

export function generateProgram(horses: Horse[]): Program {
  const rounds: RaceRound[] = ROUND_DISTANCES.map((distance, idx) => {
    const spec: RaceRoundSpec = {
      index: idx + 1,
      distanceMeters: distance,
      laneCount: DEFAULT_LANE_COUNT,
    };
    const selected = pickN(horses.map(h => h.id), DEFAULT_LANE_COUNT);
    const entries: RaceEntry[] = selected.map((horseId, laneIndex) => ({
      horseId,
      lane: laneIndex + 1,
    }));
    return {
      spec,
      entries,
      results: null,
      status: RaceRoundStatus.Pending,
    };
  });

  return { rounds };
}

export function simulateRound(horsesById: Map<string, Horse>, round: RaceRound): RaceResultItem[] {
  const baseSpeedMetersPerSec = 16;
  const maxConditionBoost = 0.25;

  const times: RaceResultItem[] = round.entries.map(entry => {
    const horse = horsesById.get(entry.horseId)!;
    const conditionFactor = 1 + (horse.condition / 100) * maxConditionBoost;
    const noiseFactor = 1 + (randomInt(-8, 8) / 100);
    const speed = baseSpeedMetersPerSec * conditionFactor * noiseFactor;
    const timeSec = round.spec.distanceMeters / speed;
    const timeMs = Math.round(timeSec * 1000);
    return {
      horseId: entry.horseId,
      timeMs,
      position: 0,
    };
  });

  times.sort((a, b) => a.timeMs - b.timeMs);
  times.forEach((t, idx) => (t.position = idx + 1));
  return times;
}

export function createHorsesMap(horses: Horse[]): Map<string, Horse> {
  return new Map(horses.map(h => [h.id, h]));
}

export function getRoundDistances(): number[] {
  return [...ROUND_DISTANCES];
}


