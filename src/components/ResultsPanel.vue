<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import type { Horse, RootState } from '../interfaces/index';
import { RaceRoundStatus } from '../interfaces/IRaces.type';

const store = useStore<RootState>();
const program = computed(() => store.state.races.program);
const horsesById = computed<Map<string, Horse>>(
  () => new Map(store.state.horses.list.map((h: Horse) => [h.id, h]))
);
</script>

<template>
  <div class="panel">
    <div class="panel-title results">Results</div>
    <div v-if="!program">—</div>
    <div v-else>
      <div v-for="round in program.rounds" :key="round.spec.index" class="round">
        <div class="round-header">
          <div>Round {{ round.spec.index }} — {{ round.spec.distanceMeters }}m</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Name</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!round.results || round.status !== RaceRoundStatus.Completed">
              <td colspan="3" class="muted">Waiting...</td>
            </tr>
            <tr v-else v-for="item in round.results" :key="item.horseId">
              <td>{{ item.position }}</td>
              <td>{{ horsesById.get(item.horseId)?.name }}</td>
              <td>{{ (item.timeMs/1000).toFixed(2) }}s</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-title.results {
  background: #93c47d;
  color: #fff;
}
th, td { padding: 4px 6px; font-size: 12px; border-bottom: 1px solid #f0f0f0; text-align: left; }
.muted { color: #999; font-style: italic; }
</style>


