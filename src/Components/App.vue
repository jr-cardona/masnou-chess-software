<template>
  <div class='container-full'>
    <SettingsModal></SettingsModal>
    <div class="d-flex align-items-center justify-content-center">
      <h1 v-if="tournamentStore.status !== 'finished'" class="me-3">{{ settingsStore.settings.tournamentName }}</h1>
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
      <b-button size="lg"
                variant="danger"
                v-if="tournamentStore.status === 'inCourse'"
                class="mx-3"
                @click="confirmEndTournament"
      >
        <i class="bi bi-exclamation-triangle-fill"></i> {{ t('finish') }}
      </b-button>
    </div>
    <div v-if="tournamentStore.status === 'finished'" class="d-flex justify-content-center align-items-center">
      <PlayersList class="fs-1 w-75"/>
    </div>

    <div v-else>
      <div class="d-flex flex-column flex-md-row mt-2 position-relative">
        <div class="col-md-3 px-4">
          <AddPlayer v-if="tournamentStore.timer > 0"/>
        </div>
        <div class="col-md-6 d-flex flex-column align-items-center px-4">
          <div class="w-100">
            <TournamentTimer/>
          </div>
        </div>
        <div class="col-md-3 px-4 d-flex flex-column position-absolute end-0">
          <PlayersList class="flex-grow-1 overflow-auto"/>
        </div>
      </div>
      <div class="d-flex flex-column flex-md-row mt-2">
        <div class="col-md-3 px-4">
          <QueuePlayers v-if="tournamentStore.timer > 0"/>
        </div>
        <div class="col-md-6 d-flex flex-column align-items-center px-4">
          <div class="w-100">
            <GameList/>
            <EventsHistory></EventsHistory>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TournamentTimer from '../Components/TournamentTimer.vue';
import AddPlayer from '../Components/AddPlayer.vue';
import PlayersList from './PlayersTable.vue';
import GameList from './GamesTable.vue';
import QueuePlayers from './QueuePlayers.vue';
import SettingsModal from './SettingsModal.vue';
import Swal from 'sweetalert2';
import {BButton} from 'bootstrap-vue-3';
import {useTournamentStore} from '../stores/useTournamentStore';
import {useSettingsStore} from '../stores/useSettingsStore';
import {useHistoryStore} from '../stores/useHistoryStore';
import {useI18n} from 'vue-i18n';
import {onMounted} from 'vue';
import EventsHistory from "./EventsHistory.vue";

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

onMounted(() => {
  window.electron.ipcRenderer.on('open-settings', () => {
    if (tournamentStore.status !== 'inCourse') {
      settingsStore.showModal = true;
      return;
    }
    Swal.fire({
      title: t('tournamentInCourse'),
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      icon: 'error',
      timer: 4000,
      timerProgressBar: true,
    });
  });

  window.electron.ipcRenderer.on('perform-undo', () => {
    historyStore.undo();
  });
});
</script>