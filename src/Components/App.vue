<template>
  <div class='container-full'>
    <SettingsModal></SettingsModal>
    <div class="d-flex align-items-center justify-content-center mt-3">
      <h2 class="me-3">{{ settingsStore.settings.tournamentName }}</h2>
      <b-button size="lg"
                variant="warning"
                @click="tournamentStore.startTournament"
                v-if="tournamentStore.status === 'paired'"
      >
        <i class="bi bi-play"></i> Start
      </b-button>
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
import GameList from './GamesTable.vue';
import QueuePlayersList from './QueuePlayersTable.vue';
import SettingsModal from './SettingsModal.vue';
import {BButton} from 'bootstrap-vue-3';
import {useTournamentStore} from '../stores/useTournamentStore';
import {useSettingsStore} from '../stores/useSettingsStore';
import {onMounted} from 'vue';
import {useHistoryStore} from "../stores/useHistoryStore";

const tournamentStore = useTournamentStore();
const settingsStore = useSettingsStore();
const historyStore = useHistoryStore();

onMounted(() => {
  window.electron.ipcRenderer.on('open-settings', () => {
    settingsStore.showModal = true;
  });

  window.electron.ipcRenderer.on('perform-undo', () => {
    historyStore.undo();
  });
});
</script>