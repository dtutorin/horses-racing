import type { Module } from 'vuex';
import type { Horse, Program, RaceResultItem, RaceRound, RacesState, RootState } from '../../interfaces/index';
import { RaceRoundStatus } from '../../interfaces/IRaces.type';
import { generateProgram, simulateRound } from '../../services/raceEngine';

const MAX_ANIMATION_TIME_MS = 5000;
const REACTIVITY_DELAY_MS = 50;

export const racesModule: Module<RacesState, RootState> = {
  namespaced: true,
  state: () => ({
    program: null,
    currentRoundIndex: null,
    isRunning: false,
  }),
  getters: {
    currentRound(state): RaceRound | null {
      if (state.program == null || state.currentRoundIndex == null) return null;
      return state.program.rounds[state.currentRoundIndex] ?? null;
    },
  },
  mutations: {
    setProgram(state, program: Program) {
      state.program = program;
      state.currentRoundIndex = null;
    },
    setRoundStatus(state, payload: { index: number; status: RaceRoundStatus }) {
      if (!state.program) return;
      const round = state.program.rounds[payload.index];
      if (!round) return;
      round.status = payload.status;
    },
    setRoundResults(state, payload: { index: number; results: RaceResultItem[] }) {
      if (!state.program) return;
      const round = state.program.rounds[payload.index];
      if (!round) return;
      round.results = payload.results;
    },
    setCurrentRoundIndex(state, index: number | null) {
      state.currentRoundIndex = index;
    },
    setRunning(state, running: boolean) {
      state.isRunning = running;
    },
  },
  actions: {
    generateProgram({ rootState, commit }) {
      const horses = rootState.horses.list;
      const program = generateProgram(horses);
      commit('setProgram', program);
    },
    async runProgramSequentially({ state, rootGetters, commit, dispatch }) {
      if (!state.program) return;
      commit('setRunning', true);

      const horsesMap = rootGetters['horses/byId'] as Map<string, Horse>;

      for (let i = 0; i < state.program.rounds.length; i++) {
        commit('setCurrentRoundIndex', i);

        const round = state.program.rounds[i];
        if (!round) continue;

        const simResults = simulateRound(horsesMap, round);
        commit('setRoundResults', { index: i, results: simResults });

        await new Promise(resolve => setTimeout(resolve, REACTIVITY_DELAY_MS));

        commit('setRoundStatus', { index: i, status: RaceRoundStatus.Running });

        await new Promise(resolve => setTimeout(resolve, MAX_ANIMATION_TIME_MS));

        commit('setRoundStatus', { index: i, status: RaceRoundStatus.Completed });
      }

      commit('setCurrentRoundIndex', null);
      commit('setRunning', false);

      await dispatch('horses/refreshConditions', undefined, { root: true });
    },
  },
};


