<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import ControlPanel from './components/ControlPanel.vue';
import HorseList from './components/HorseList.vue';
import ProgramPanel from './components/ProgramPanel.vue';
import ResultsPanel from './components/ResultsPanel.vue';
import Track from './components/Track.vue';
import type { RootState } from './interfaces/index';

const store = useStore<RootState>();
onMounted(() => {
  store.dispatch('horses/generate');
});
</script>

<template>
  <div class="container">
    <div class="header">
      <h2>Horse Racing</h2>
      <ControlPanel />
    </div>
    <div class="layout">
      <div class="left">
        <HorseList />
      </div>
      <div class="center">
        <Track />
      </div>
      <div class="right col-programs">
        <ProgramPanel />
      </div>
      <div class="right col-results">
        <ResultsPanel />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 14px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f7cac9;
  padding: 10px 12px;
  border-radius: 8px;
}
.layout {
  display: grid;
  grid-template-columns: 250px 1fr 250px 250px;
  gap: 12px;
  margin-top: 12px;
}
.left, .center, .right { min-height: 420px; }
</style>
