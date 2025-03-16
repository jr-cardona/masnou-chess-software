<template>
  <div class="mt-2">
    <b-badge :variant="timer <= 300 ? 'danger' : 'primary'" class="timer-badge w-100 p-0">
      {{ formattedTime }}
    </b-badge>
  </div>
</template>

<script setup>
import {computed, ref, onMounted} from 'vue';
import {BBadge} from 'bootstrap-vue-3';

const timer = ref(5400);

const formattedTime = computed(() => {
  const hours = Math.floor(timer.value / 3600);
  const minutes = Math.floor((timer.value % 3600) / 60);
  const seconds = timer.value % 60;
  return `${hours > 0 ? hours.toString().padStart(2, "0") + ":" : ""}${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
});

onMounted(() => {
  window.electron.ipcRenderer.on('update-timer', (newTimer) => {
    timer.value = newTimer;
  });
});
</script>

<style scoped>
.timer-badge {
  font-size: 20vw;
}
</style>
