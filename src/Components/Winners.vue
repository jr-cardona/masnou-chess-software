<template>
  <div class="text-center mt-5">
    <h2 class="text-success">🏆 Tournament Winners</h2>
    <b-table striped hover :items="winners" :fields="['rank', 'name', 'points']" class="mt-3">
      <template #cell(rank)="data">
        🥇🥈🥉[data.index] || ''
      </template>
    </b-table>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTournamentStore } from '../stores/useTournamentStore';
import { BTable } from 'bootstrap-vue-3';

const tournamentStore = useTournamentStore();
const winners = computed(() =>
    Object.values(tournamentStore.players)
        .sort((a, b) => b.points - a.points)
        .map((player, index) => ({
          rank: index + 1,
          name: player.name,
          points: player.points
        }))
);
</script>