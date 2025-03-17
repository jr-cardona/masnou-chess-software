<template>
  <div class='container-full'>
    <SettingsModal></SettingsModal>
    <StatsModal v-model:show="showReportsModal"></StatsModal>
    <div class="d-flex align-items-center justify-content-center">
      <h1 v-if="tournamentStore.status !== 'finished'" class="me-3">{{ settingsStore.settings.tournamentName }}</h1>
      <b-button size="md"
                class="me-3"
                variant="warning"
                v-if="tournamentStore.status === 'paired'"
                @click="tournamentStore.startTournament"
      >
        <i class="bi bi-play"></i> {{ t('start') }}
      </b-button>
      <b-button size="md"
                variant="secondary"
                class="me-3"
                v-if="tournamentStore.status === 'inCourse' && tournamentStore.timer > 0"
                @click="tournamentStore.pauseTournament"
      >
        <i class="bi bi-pause"></i> {{ t('pause') }}
      </b-button>
      <b-button size="md"
                class="me-3"
                variant="primary"
                v-if="tournamentStore.status === 'stopped'"
                @click="tournamentStore.resumeTournament"
      >
        <i class="bi bi-play"></i> {{ t('resume') }}
      </b-button>
      <b-button size="md"
                class="me-3"
                variant="danger"
                v-if="tournamentStore.status === 'inCourse' || tournamentStore.status === 'stopped'"
                @click="confirmEndTournament"
      >
        <i class="bi bi-exclamation-triangle-fill"></i> {{ t('finish') }}
      </b-button>
      <b-button size="md"
                class="me-3"
                variant="success"
                @click="saveTournament"
      >
        <i class="bi bi-floppy-fill me-1"></i> {{ t('save') }}
      </b-button>
    </div>
    <div v-if="tournamentStore.status === 'finished'" class="d-flex justify-content-center align-items-center">
      <Scoreboard class="fs-1 w-75"/>
    </div>
    <div v-else>
      <div class="d-flex flex-column flex-md-row mt-2">
        <div class="col-md-6 px-4">
          <Scoreboard class="flex-grow-1 overflow-auto"/>
          <AddPlayer/>
        </div>
        <div class="col-md-6 d-flex flex-column align-items-center px-4">
          <div class="w-100">
            <GameList/>
            <QueuePlayers/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AddPlayer from '../Components/AddPlayer.vue';
import GameList from './GamesTable.vue';
import Scoreboard from './Scoreboard.vue';
import QueuePlayers from './QueuePlayers.vue';
import StatsModal from './StatsModal.vue';
import SettingsModal from './SettingsModal.vue';
import Swal from 'sweetalert2';
import {BButton} from 'bootstrap-vue-3';
import {useTournamentStore} from '../stores/useTournamentStore';
import {useSettingsStore} from '../stores/useSettingsStore';
import {useHistoryStore} from '../stores/useHistoryStore';
import {loadTournament} from '../stores/useHistoryStore';
import {useI18n} from 'vue-i18n';
import {onMounted, ref} from 'vue';

const showReportsModal = ref(false);
const {t} = useI18n({useScope: 'global'})
const tournamentStore = useTournamentStore();
const settingsStore = useSettingsStore();
const historyStore = useHistoryStore();

const confirmEndTournament = () => {
  Swal.fire({
    title: t('areYouSure'),
    text: t('thisWillEndTournament'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel')
  }).then((result) => {
    if (result.isConfirmed) {
      tournamentStore.endTournament();
      Swal.fire(t('tournamentFinished'), '', 'success');
    }
  });
};

const saveTournament = () => {
  historyStore.saveManualState();
  Swal.fire(t('tournamentSaved'), '', 'success');
};

onMounted(async () => {
  await loadTournament();

  window.electron.ipcRenderer.on('open-statistics', () => {
    showReportsModal.value = true
  });

  window.electron.ipcRenderer.on('open-settings', () => {
    settingsStore.showModal = true;
  });

  window.electron.ipcRenderer.on('perform-undo', () => {
    historyStore.undo();
  });

  window.electron.ipcRenderer.send('open-timer-window', tournamentStore.timer);
});
</script>