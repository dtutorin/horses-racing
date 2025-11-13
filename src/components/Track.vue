<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import type { RootState } from '../interfaces/index';
import { RaceRoundStatus } from '../interfaces/IRaces.type';

const store = useStore<RootState>();
const isAnimating = ref(false);
const animationKey = ref(0);
const maxAnimationDurationMs = 5000;
const minAnimationDurationMs = 2500;

const currentRound = computed(() => {
  const idx = store.state.races.currentRoundIndex;
  if (idx == null || !store.state.races.program) return null;
  return store.state.races.program.rounds[idx] ?? null;
});

const animationDurations = computed(() => {
  if (!currentRound.value?.results || currentRound.value.results.length === 0) {
    return new Map<string, number>();
  }

  const results = currentRound.value.results;
  const times = results.map(r => r.timeMs);
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const timeRange = maxTime - minTime;

  const durations = new Map<string, number>();
  
  if (timeRange === 0) {
    const avgDuration = (minAnimationDurationMs + maxAnimationDurationMs) / 2;
    results.forEach(r => durations.set(r.horseId, avgDuration));
  } else {
    const durationRange = maxAnimationDurationMs - minAnimationDurationMs;
    results.forEach(r => {
      const normalized = minAnimationDurationMs + 
        ((r.timeMs - minTime) / timeRange) * durationRange;
      durations.set(r.horseId, normalized);
    });
  }

  return durations;
});

const getHorseAnimationDuration = (horseId: string): number => {
  return animationDurations.value.get(horseId) ?? maxAnimationDurationMs;
};

const horseDistances = ref<Record<string, number>>({});

const updateHorseDistances = async () => {
  await nextTick();
  const laneEls = document.querySelectorAll('.lane');
  laneEls.forEach((lane) => {
    const horseEl = lane.querySelector('.horse') as HTMLElement;
    if (horseEl) {
      const laneWidth = lane.clientWidth;
      const horseWidth = horseEl.offsetWidth;
      const finishOffset = 39;
      const laneId = horseEl.getAttribute('data-horseid');
      if (laneId)
        horseDistances.value[laneId] = laneWidth - horseWidth - finishOffset;
    }
  });
};

onMounted(() => {
  updateHorseDistances();

  window.addEventListener('resize', updateHorseDistances);
});

watch(
  () => currentRound.value?.status,
  (status) => {
    if (status === RaceRoundStatus.Running) {
      animationKey.value++;
      isAnimating.value = true;
      window.setTimeout(() => { isAnimating.value = false; }, maxAnimationDurationMs);
    } else {
      isAnimating.value = false;
    }
  }
);
</script>

<template>
  <div class="track">
    <div v-if="!currentRound" class="placeholder">
      Generate the program and click Start
    </div>
    <div v-else class="lanes">
      <div
        v-for="entry in currentRound.entries"
        :key="entry.lane"
        class="lane"
      >
        <div class="lane-num">{{ entry.lane }}</div>
        <div class="dash"></div>
        <div
          class="horse"
          :data-horseid="entry.horseId"
          :class="{ run: isAnimating && currentRound.results }"
          :style="{
            '--travel-distance': (horseDistances[entry.horseId] || 300) + 'px',
            animationDuration: getHorseAnimationDuration(entry.horseId) + 'ms',
            borderColor: (store.state.horses.list.find((h) => h.id === entry.horseId)?.color || '#000')
          }"
          :key="animationKey + '-' + entry.lane"
        >
          <span>🏇</span>
        </div>
      </div>
      <div class="finish"></div>
    </div>
  </div>
</template>

<style scoped>
.track {
  position: relative;
  background: #eee;
  border-radius: 8px;
  padding: 8px 8px 20px 40px;
  min-height: 420px;
  min-width: 300px;
}
.placeholder {
  padding: 20px;
  color: #777;
}
.lanes {
  position: relative;
}
.lane {
  position: relative;
  display: flex;
  align-items: center;
  height: 48px;
}
.lane + .lane {
  border-top: 1px dashed #c7c7c7;
}
.lane-num {
  position: absolute;
  left: -28px;
  width: 24px;
  text-align: center;
  font-weight: 600;
  color: #2b7a2b;
}
.dash {
  position: absolute;
  inset: auto 80px auto 0;
  height: 1px;
}
.horse {
  position: absolute;
  left: 0;
  top: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-left: 4px solid;
  border-radius: 2px;
}
.horse span {
  transform: scaleX(-1);
}
.horse.run {
  animation-name: run;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}
@keyframes run {
  from { transform: translateX(0); }
  to { transform: translateX(calc( var(--travel-distance) - 36px )); }
}
.finish {
  position: absolute;
  right: 28px;
  top: 8px;
  bottom: 20px;
  width: 4px;
  background: #e74c3c;
}
.finish::after {
  content: 'Finish';
  position: absolute;
  display: block;
  bottom: -30px;
  right: -50%;
  color: #e74c3c;
}

</style>
