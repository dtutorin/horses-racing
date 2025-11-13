export const RaceRoundStatus = {
  Pending: 'pending',
  Running: 'running',
  Completed: 'completed',
} as const;

export type RaceRoundStatus = typeof RaceRoundStatus[keyof typeof RaceRoundStatus];

export interface RaceRoundSpec {
  index: number;
  distanceMeters: number;
  laneCount: number;
}

export interface RaceEntry {
  lane: number;
  horseId: string;
}

export interface RaceRound {
  spec: RaceRoundSpec;
  entries: RaceEntry[];
  results: RaceResultItem[] | null;
  status: RaceRoundStatus;
}

export interface RaceResultItem {
  position: number;
  horseId: string;
  timeMs: number;
}

export interface Program {
  rounds: RaceRound[];
}

export interface RacesState {
  program: Program | null;
  currentRoundIndex: number | null;
  isRunning: boolean;
}