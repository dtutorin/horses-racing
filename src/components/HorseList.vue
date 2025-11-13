<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import type { Horse, RootState } from '../interfaces/index';

const store = useStore<RootState>();
const horses = computed<Horse[]>(() => store.state.horses.list);
</script>

<template>
  <div class="panel">
    <div class="panel-title">Horse List (1 - {{ horses.length }})</div>
    <table class="list">
      <thead>
        <tr>
          <th style="width: 14px;"></th>
          <th>Name</th>
          <th>Condition</th>
          <th>Color</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="h in horses" :key="h.id">
          <td>
            <span class="color-dot" :style="{ backgroundColor: h.color }"></span>
          </td>
          <td>{{ h.name }}</td>
          <td>{{ h.condition }}</td>
          <td>{{ h.color }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  </template>

<style scoped>
.panel-title {
  background: #ffe08a;
}
.list {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 6px 8px;
  border-bottom: 1px solid #eee;
  text-align: left;
  font-size: 12px;
}
.color-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid #888;
}
</style>


