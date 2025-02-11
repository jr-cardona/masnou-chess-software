<template>
  <div class="mt-3" style="overflow-y: auto;">
    <h5 class="text-center text-warning"><i class="bi bi-trophy p-2"></i> Scoreboard</h5>
    <b-table :items="playersStore.players"
             :fields="['name', 'elo', {key:'points', class:'text-center'}, {key:'actions', label: '', class:'text-center'}]"
             responsive
             striped
             hover
             class="custom-table"
             style="max-height: 750px"
    >
      <template #cell(actions)="data">
        <b-button
            title="Remove player"
            v-if="tournamentStore.status === 'idle'"
            variant="danger"
            size="sm"
            @click="playersStore.removePlayer(data.item.name)">
          <i class="bi bi-trash"></i>
        </b-button>
        <b-button
            title="Pause player"
            v-else-if="data.item.status === 'active'"
            variant="warning"
            size="sm"
            @click="playersStore.pausePlayer(data.item.name)">
          <i class="bi bi-pause"></i>
        </b-button>
        <b-button
            title="Resume player"
            v-else
            variant="success"
            size="sm"
            @click="playersStore.resumePlayer(data.item.name)">
          <i class="bi bi-play"></i>
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script setup>
import {usePlayersStore} from '../stores/usePlayersStore';
import {useTournamentStore} from '../stores/useTournamentStore';
import {BTable, BButton} from 'bootstrap-vue-3';

const playersStore = usePlayersStore();
const tournamentStore = useTournamentStore();

</script>
