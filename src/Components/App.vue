<template>
  <div class="w-full min-h-screen bg-gray-900 text-gray-100 p-4">
    <SettingsModal/>
    <StatsModal v-model:show="showReportsModal"/>

    <div class="flex flex-col items-center">
      <h1 v-if="tournamentStore.status !== 'finished'" class="text-2xl font-bold">
        {{ settingsStore.settings.tournamentName }}
      </h1>
      <div class="flex flex-wrap justify-center gap-2">
        <button v-if="tournamentStore.status === 'paired'"
                class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                @click="tournamentStore.startTournament">
          <i class="bi bi-play"></i> {{ t('start') }}
        </button>
        <button v-if="tournamentStore.status === 'inCourse' && tournamentStore.timer > 0"
                class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                @click="tournamentStore.pauseTournament">
          <i class="bi bi-pause"></i> {{ t('pause') }}
        </button>
        <button v-if="tournamentStore.status === 'stopped'"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                @click="tournamentStore.resumeTournament">
          <i class="bi bi-play"></i> {{ t('resume') }}
        </button>
        <button v-if="tournamentStore.status === 'inCourse' || tournamentStore.status === 'stopped'"
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                @click="confirmEndTournament">
          <i class="bi bi-exclamation-triangle-fill"></i> {{ t('finish') }}
        </button>
        <button v-if="tournamentStore.status !== 'idle'"
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                @click="saveTournament">
          <i class="bi bi-floppy-fill me-1"></i> {{ t('save') }}
        </button>
      </div>
    </div>
    <div v-if="tournamentStore.status === 'finished'" class="flex justify-center items-center mt-4">
      <Scoreboard class="text-lg w-full"/>
    </div>

    <div v-else>
      <div class="flex flex-col md:flex-row">
        <div class="md:w-1/2 px-4">
          <Scoreboard class="flex-grow overflow-auto"/>
          <AddPlayer/>
        </div>
        <div class="md:w-1/2 flex flex-col items-center px-4">
          <div class="w-full">
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
import {useTournamentStore} from '../stores/useTournamentStore';
import {useSettingsStore} from '../stores/useSettingsStore';
import {useHistoryStore} from '../stores/useHistoryStore';
import {loadTournament} from '../stores/useHistoryStore';
import {useI18n} from 'vue-i18n';
import {onMounted, ref} from 'vue';

const showReportsModal = ref(false);
const {t} = useI18n({useScope: 'global'});
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
    showReportsModal.value = true;
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