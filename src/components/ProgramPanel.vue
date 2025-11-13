<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import type { Horse, RootState } from '../interfaces/index';

const store = useStore<RootState>();
const program = computed(() => store.state.races.program);
const horsesById = computed<Map<string, Horse>>(
  () => new Map(store.state.horses.list.map((h: Horse) => [h.id, h]))
);
</script>

<template>
  <div class="panel">
    <div class="panel-title program">Program</div>

    <div v-if="!program">Click Generate Program</div>
    <div v-else class="rounds">
      <div v-for="(round, idx) in program.rounds" :key="idx" class="round">
        <div class="round-header">
          <div>Round {{ round.spec.index }} — {{ round.spec.distanceMeters }}m</div>
          <div class="badge" :class="round.status">{{ round.status }}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Lane</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in round.entries" :key="e.lane">
              <td>{{ e.lane }}</td>
              <td>{{ horsesById.get(e.horseId)?.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-title.program {
  background: #6fa8dc;
  color: #fff;
}
.round-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.badge {
  text-transform: capitalize;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid #ccc;
}
.badge.running { background: #fff3cd; border-color: #ffec99; }
.badge.completed { background: #d1e7dd; border-color: #badbcc; }
th, td { padding: 4px 6px; font-size: 12px; border-bottom: 1px solid #f0f0f0; text-align: left; }
</style>


