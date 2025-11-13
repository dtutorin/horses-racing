<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import type { RootState } from '../interfaces/index';

const store = useStore<RootState>();

const canStart = computed(() => !!store.state.races.program && !store.state.races.isRunning);

function onGenerate() {
  if (!store.state.horses.list.length) {
    store.dispatch('horses/generate');
  }
  store.dispatch('races/generateProgram');
}
function onStart() {
  if (!store.state.races.program) return;
  store.dispatch('races/runProgramSequentially');
}
</script>

<template>
  <div class="controls">
    <button class="btn" @click="onGenerate">Generate Program</button>
    <button class="btn primary" :disabled="!canStart" @click="onStart">Start</button>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  gap: 12px;
  padding: 8px 0;
}
.btn {
  border: 1px solid #bbb;
  background: #f3f3f3;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}
.btn.primary {
  background: #42b883;
  color: white;
  border-color: #42b883;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>


