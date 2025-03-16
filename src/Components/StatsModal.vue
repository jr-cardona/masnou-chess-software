<template>
  <b-modal
      v-model="props.show"
      size="xl"
      body-bg-variant="dark"
      header-bg-variant="dark"
      centered="true"
      hide-footer="true"
      scrollable="true"
      @hide="emit('update:show', false)"
  >
    <template #title>
      <i class="bi bi-bar-chart-fill me-1"></i> {{ t('tournamentStats') }}
    </template>
    <b-tabs pills vertical nav-wrapper-class="w-35">
      <!-- Events History -->
      <b-tab active>
        <template #title>
          <i class="bi bi-clock-history me-1"></i> {{ t('eventsHistory') }}
        </template>
        <EventsHistory></EventsHistory>
      </b-tab>
      <!-- Scoreboard -->
      <b-tab>
        <template #title>
          <i class="bi bi-trophy me-1"></i> {{ t('scoreboard') }}
        </template>
        <Scoreboard></Scoreboard>
      </b-tab>
    </b-tabs>
    <!-- Botones de acción -->
    <div class="justify-content-end d-flex mt-3">
      <b-button variant="success" @click="exportToExcel" class="w-25">
        <i class="bi bi-file-earmark-excel"></i> {{ t('export') }}
      </b-button>
    </div>
  </b-modal>
</template>

<script setup>
import {useI18n} from 'vue-i18n';
import {usePlayersStore} from '../stores/usePlayersStore';
import {useHistoryStore} from '../stores/useHistoryStore';
import {BModal} from 'bootstrap-vue-3';
import EventsHistory from './EventsHistory.vue';
import Scoreboard from './Scoreboard.vue';
import * as XLSX from 'xlsx';

const props = defineProps(["show"]);
const emit = defineEmits(["update:show"]);
const {t} = useI18n({useScope: 'global'});

const playersStore = usePlayersStore();
const historyStore = useHistoryStore();

const exportToExcel = async () => {
  const scoreboardData = playersStore.playersWithStats.map(player => ({
    [t('position')]: player.rank,
    [t('name')]: player.name,
    [t('point', 2)]: player.points,
    [t('wins')]: player.wins,
    [t('draw')]: player.draws,
    [t('losses')]: player.losses,
    [t('game', 2)]: player.gamesPlayed,
    'Win%': player.winRate
  }));

  const eventsData = historyStore.events.flatMap(group =>
      group.events.map(event => ({
        [t('timestamp')]: group.timestamp,
        [t('event')]: t(event.key, {
          ...event.params,
          reason: t(`reason.${event.params.reason || 'unknown'}`)
        }),
      }))
  );

  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.json_to_sheet(eventsData);
  const ws2 = XLSX.utils.json_to_sheet(scoreboardData);

  XLSX.utils.book_append_sheet(wb, ws1, "Events History");
  XLSX.utils.book_append_sheet(wb, ws2, "Scoreboard");

  const wbout = XLSX.write(wb, {bookType: "xlsx", type: "buffer"});

  window.electron.ipcRenderer.send('save-excel-file', wbout);
};
</script>
