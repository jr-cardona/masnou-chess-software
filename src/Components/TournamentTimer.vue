<template>
  <div class="text-center my-3 w-100 display-1">
    <b-badge :variant="store.timer <= 90 ? 'danger' : 'primary'" class="timer-badge w-100 p-3">
      {{ formattedTime }}
    </b-badge>
  </div>
</template>

<script setup>
import {computed, onMounted} from 'vue';
import {useTournamentStore} from '../stores/useTournamentStore';
import {BBadge} from 'bootstrap-vue-3';

const store = useTournamentStore();

const formattedTime = computed(() => {
  const minutes = Math.floor(store.timer / 60);
  const seconds = store.timer % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

onMounted(() => {
  setInterval(() => {
    if (store.status === 'inCourse' && store.timer > 0) {
      store.decreaseTimer();
    }
  }, 1000);
});
</script>

<style scoped>
.timer-badge {
  font-size: 10vw;
}
</style>
