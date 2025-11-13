import { createStore } from 'vuex';
import type { RootState } from '../interfaces/index';
import { horsesModule } from './modules/horses';
import { racesModule } from './modules/races';

export const store = createStore<RootState>({
  modules: {
    horses: horsesModule,
    races: racesModule,
  },
});

export type StoreType = typeof store;
