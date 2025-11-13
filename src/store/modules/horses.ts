import type { Module } from 'vuex';
import type { Horse, HorsesState, RootState } from '../../interfaces/index';
import { generateHorses } from '../../services/raceEngine';

export const horsesModule: Module<HorsesState, RootState> = {
  namespaced: true,
  state: () => ({
    list: [],
  }),
  getters: {
    byId(state): Map<string, Horse> {
      return new Map(state.list.map((horse: Horse) => [horse.id, horse]));
    },
  },
  mutations: {
    setHorses(state, horses: Horse[]) {
      state.list = horses;
    },
  },
  actions: {
    generate({ commit }) {
      const horses = generateHorses();
      commit('setHorses', horses);
    },
    refreshConditions({ state, commit }) {
      const updated = state.list.map((horse: Horse) => ({
        ...horse,
        condition: Math.min(100, Math.max(1, horse.condition + Math.floor(Math.random() * 11) - 5)),
      }));
      commit('setHorses', updated);
    },
  },
};


