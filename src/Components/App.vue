<template>
  <div class='container-full'>
    <SettingsModal></SettingsModal>
    <div class="d-flex align-items-center justify-content-center">
      <h1 class="me-3">{{ settingsStore.settings.tournamentName }}</h1>
      <b-button size="lg"
                variant="warning"
                v-if="tournamentStore.status === 'paired'"
                @click="tournamentStore.startTournament"
      >
        <i class="bi bi-play"></i> {{ t('start') }}
      </b-button>
      <b-button size="lg"
                variant="secondary"
                v-if="tournamentStore.status === 'inCourse' && tournamentStore.timer > 0"
                @click="tournamentStore.pauseTournament"
      >
        <i class="bi bi-pause"></i> {{ t('pause') }}
      </b-button>
      <b-button size="lg"
                variant="success"
                v-if="tournamentStore.status === 'stopped'"
                @click="tournamentStore.resumeTournament"
      >
        <i class="bi bi-play"></i> {{ t('resume') }}
      </b-button>
    </div>
    <Winners v-if="tournamentStore.status === 'finished'"/>
    <div v-else class="d-flex flex-column flex-md-row mt-2">
      <div class="col-md-3 px-4">
        <AddPlayer/>
        <QueuePlayers/>
      </div>

      <div class="col-md-6 d-flex flex-column align-items-center px-4">
        <div class="w-100">
          <TournamentTimer/>
          <GameList/>
        </div>
      </div>

      <div class="col-md-3 px-4 d-flex flex-column">
        <PlayersList class="flex-grow-1"/>
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
import QueuePlayers from './QueuePlayers.vue';
import SettingsModal from './SettingsModal.vue';
import {BButton} from 'bootstrap-vue-3';
import {useTournamentStore} from '../stores/useTournamentStore';
import {useSettingsStore} from '../stores/useSettingsStore';
import {useHistoryStore} from "../stores/useHistoryStore";
import {useI18n} from "vue-i18n";
import {onMounted} from 'vue';

const {t} = useI18n({useScope: 'global'})
const tournamentStore = useTournamentStore();
const settingsStore = useSettingsStore();
const historyStore = useHistoryStore();

onMounted(() => {
  window.electron.ipcRenderer.on('open-settings', () => {
    if (tournamentStore.status === 'idle') {
      settingsStore.showModal = true;
    }
  });

  window.electron.ipcRenderer.on('perform-undo', () => {
    historyStore.undo();
  });
});
</script>