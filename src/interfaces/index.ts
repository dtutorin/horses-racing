export * from './IHorses.type';
export * from './IRaces.type';

import type { HorsesState } from './IHorses.type';
import type { RacesState } from './IRaces.type';

export interface RootState {
  horses: HorsesState;
  races: RacesState;
}
