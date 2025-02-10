<template>
  <div class="text-center my-3 w-100 display-1">
    <b-badge :variant="tournamentStore.timer <= 90 ? 'danger' : 'primary'" class="timer-badge w-100 p-3">
      {{ formattedTime }}
    </b-badge>
  </div>
</template>

<script setup>
import {computed, onMounted} from 'vue';
import {useTournamentStore} from '../stores/useTournamentStore';
import {BBadge} from 'bootstrap-vue-3';

const tournamentStore = useTournamentStore();

const formattedTime = computed(() => {
  const minutes = Math.floor(tournamentStore.timer / 60);
  const seconds = tournamentStore.timer % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

onMounted(() => {
  setInterval(() => {
    if (tournamentStore.status === 'inCourse' && tournamentStore.timer > 0) {
      tournamentStore.decreaseTimer();
    }
  }, 1000);
});
</script>

<style scoped>
.timer-badge {
  font-size: 10vw;
}
</style>
