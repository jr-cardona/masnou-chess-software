<template>
  <div class='container-full'>
    <SettingsModal></SettingsModal>
    <div class="text-center mt-3">
      <h2>{{ settingsStore.settings.tournamentName }}</h2>
      <div class="d-flex justify-content-center gap-2 mt-2">
        <b-button size="lg" @click="tournamentStore.startPairing" v-if="tournamentStore.status === 'idle'">
          <i class="bi bi-arrow-clockwise"></i> Pair
        </b-button>
        <b-button size="lg" variant="warning" @click="tournamentStore.startTournament" v-if="tournamentStore.status === 'paired'">
          <i class="bi bi-play"></i> Start
        </b-button>
        <b-button size="lg" variant="secondary" @click="settingsStore.showModal = true">⚙️ Settings</b-button>
      </div>
    </div>
    <Winners v-if="tournamentStore.status === 'finished'"/>
    <div v-else>
      <div class="d-flex flex-column flex-md-row mt-2">
        <TournamentTimer/>
      </div>
      <div class="d-flex flex-column flex-md-row mt-4">
        <div class="col-md-3 px-4">
          <PlayersList/>
          <AddPlayer/>
        </div>
        <div class="col-md-7 px-4">
          <GameList/>
        </div>
        <div class="col-md-2 px-4">
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
import SettingsModal from "./SettingsModal.vue";
import {BButton} from "bootstrap-vue-3";
import {useTournamentStore} from '../stores/useTournamentStore';
import {useSettingsStore} from '../stores/useSettingsStore';

const tournamentStore = useTournamentStore();
const settingsStore = useSettingsStore();
</script>