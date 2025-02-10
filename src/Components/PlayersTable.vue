<template>
  <div class="mt-3">
    <h5>👥 Players List</h5>
    <pre>{{ playersStore.players }}</pre>
    <b-table :items="sortedPlayers" :fields="['name', 'points', 'elo', 'status', 'actions']" responsive>
      <template #cell(actions)="data">
        <b-button
            v-if="store.status !== 'inCourse'"
            variant="danger"
            size="sm"
            @click="playersStore.removePlayer(data.item.name)">
          Delete
        </b-button>
        <b-button
            v-else-if="data.item.status === 'active'"
            variant="warning"
            size="sm"
            @click="playersStore.pausePlayer(data.item.name)">
          Pause
        </b-button>
        <b-button
            v-else
            variant="success"
            size="sm"
            @click="playersStore.resumePlayer(data.item.name)">
          Resume
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script setup>
import {usePlayersStore} from '../stores/usePlayersStore';
import {useTournamentStore} from '../stores/useTournamentStore';
import {BTable, BButton} from 'bootstrap-vue-3';
import {computed} from 'vue';

const playersStore = usePlayersStore();
const store = useTournamentStore();

const sortedPlayers = computed(() => {
  return [...playersStore.players].sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return b.elo - a.elo;
  });
});
</script>
