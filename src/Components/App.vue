<template>
  <div class='container-full'>
    <div class="text-center mt-3">
      <h2>Chess Masnou Tournament</h2>
      <div class="d-flex justify-content-center gap-2 mt-2">
        <b-button @click="tournamentStore.startPairing" v-if="tournamentStore.status === 'idle'">Pair</b-button>
        <b-button @click="tournamentStore.startTournament" v-if="tournamentStore.status === 'idle'">Start</b-button>
      </div>
    </div>
    <Winners v-if="tournamentStore.status === 'finished'"/>
    <div v-else>
      <div class="d-flex flex-column flex-md-row mt-4 text-center">
        <TournamentTimer/>
      </div>
      <div class="d-flex flex-column flex-md-row mt-4 text-center">
        <div class="col-md-4">
          <PlayersList/>
          <AddPlayer/>
        </div>
        <div class="col-md-4">
          <GameList/>
        </div>
        <div class="col-md-4">
          <QueuePlayersList/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TournamentTimer from '../Components/TournamentTimer.vue';
import Winners from '../Components/Winners.vue';
import AddPlayer from '../Components/AddPlayer.vue';
import PlayersList from './PlayersTable.vue';
import GameList from "./GamesTable.vue";
import QueuePlayersList from "./QueuePlayersTable.vue";
import {useTournamentStore} from '../stores/useTournamentStore';
import {BButton} from "bootstrap-vue-3";

const tournamentStore = useTournamentStore();
</script>