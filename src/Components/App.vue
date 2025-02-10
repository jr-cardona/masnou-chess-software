<template>
  <div class='container-full mt-4'>
    <h2 class='text-center'>
      Chess Masnou Tournament
      <b-button variant="primary" @click="store.startTournament" v-if="store.status === 'idle'">▶️ Start</b-button>
    </h2>
    <Winners v-if="store.status === 'finished'"/>
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

const store = useTournamentStore();
</script>