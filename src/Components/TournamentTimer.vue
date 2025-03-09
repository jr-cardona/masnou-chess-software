<template>
  <div class="mt-4">
    <b-badge :variant="tournamentStore.timer <= 300 ? 'danger' : 'primary'" class="timer-badge w-100 p-3">
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
  const hours = Math.floor(tournamentStore.timer / 3600);
  const minutes = Math.floor((tournamentStore.timer % 3600) / 60);
  const seconds = tournamentStore.timer % 60;

  return `${hours > 0 ? hours.toString().padStart(2, "0") + ":" : ""}${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
});

onMounted(() => {
  setInterval(() => {
    if (tournamentStore.status === 'inCourse') {
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
