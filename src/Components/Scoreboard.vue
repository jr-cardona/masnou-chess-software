<template>
  <div class="mt-3">
    <div>
      <h3 class="text-center text-warning"><i class="bi bi-trophy p-2"></i> {{ t('scoreboard') }}</h3>
      <b-table
          :items="filteredPlayers"
          :fields="fields"
          show-empty=""
          empty-text=""
          responsive
          class="custom-table mt-3"
          style="max-height: 700px"
      >
        <template #head(name)>
          <div class="d-flex align-items-center">
            <span>{{ t('name') }}</span>
            <b-input-group class="ms-3">
              <b-input-group-text class="bg-dark text-light height-25">
                <i class="bi bi-search small"></i>
              </b-input-group-text>
              <b-form-input
                  v-model="searchQuery"
                  class="bg-dark text-light height-25"
              />
            </b-input-group>
          </div>
        </template>
        <template #head(actions)>
          <div class="d-flex align-items-center">
            <b-button size="sm" variant="success" :title="t('export')" @click="exportToExcel">
              <i class="bi bi-file-earmark-excel"></i>
            </b-button>
          </div>
        </template>
        <template #cell(name)="data">
          #{{ data.index + 1 }} {{ data.item.name }}
        </template>
        <template #head(points)>
          <span>
            {{ t('P') }}
            <b-button variant="outline-secondary" size="sm" class="p-0 border-0" data-bs-toggle="tooltip"
                      data-bs-placement="top" :title="t('point', 2)">
              <i class="bi bi-info-circle"></i>
            </b-button>
          </span>
        </template>
        <template #head(wins)>
          <span>
            {{ t('W') }}
            <b-button variant="outline-secondary" size="sm" class="p-0 border-0" data-bs-toggle="tooltip"
                      data-bs-placement="top" :title="t('wins')">
              <i class="bi bi-info-circle"></i>
            </b-button>
          </span>
        </template>
        <template #head(draws)>
          <span>
            {{ t('D') }}
            <b-button variant="outline-secondary" size="sm" class="p-0 border-0" data-bs-toggle="tooltip"
                      data-bs-placement="top" :title="t('draw', 2)">
              <i class="bi bi-info-circle"></i>
            </b-button>
          </span>
        </template>
        <template #head(losses)>
          <span>
            {{ t('L') }}
            <b-button variant="outline-secondary" size="sm" class="p-0 border-0" data-bs-toggle="tooltip"
                      data-bs-placement="top" :title="t('losses')">
              <i class="bi bi-info-circle"></i>
            </b-button>
          </span>
        </template>
        <template #head(gamesPlayed)>
          <span>
            {{ t('T') }}
            <b-button variant="outline-secondary" size="sm" class="p-0 border-0" data-bs-toggle="tooltip"
                      data-bs-placement="top" :title="t('gamesPlayed')">
              <i class="bi bi-info-circle"></i>
            </b-button>
          </span>
        </template>
        <template #cell(winRate)="data">
          {{ data.item.winRate }}%
        </template>
        <template #cell(status)="data">
          <div v-if="tournamentStore.status !== 'finished'">
            <i :class="statusMap[data.item.status]?.icon || 'bi bi-question-circle'" class="me-1 text-primary"></i>
            {{ statusMap[data.item.status]?.text || data.item.status }}
          </div>
        </template>
        <template #cell(actions)="data">
          <div v-if="tournamentStore.status !== 'finished'">
            <b-button
                :title="getPlayerAction(data.item).title"
                :variant="getPlayerAction(data.item).variant"
                size="sm"
                @click="getPlayerAction(data.item).action"
            >
              <i :class="getPlayerAction(data.item).icon"></i>
            </b-button>
          </div>
        </template>
        <template #empty>
          <h4 class="text-center my-4 fw-normal">
            {{ t('noPlayersAvailable') }}
          </h4>
          <b-button
              variant="warning"
              @click="playersStore.addTestData"
              v-if="tournamentStore.status === 'idle'"
              class="w-100 mt-2 fs-5 fw-medium"
              size="md"
          >
            {{ t('addTestData') }} <i class="bi bi-plus-lg"></i>
          </b-button>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script setup>
import {usePlayersStore} from '../stores/usePlayersStore';
import {useTournamentStore} from '../stores/useTournamentStore';
import {BTable, BButton} from 'bootstrap-vue-3';
import {useI18n} from 'vue-i18n';
import {computed, ref} from 'vue';
import * as XLSX from "xlsx";
import Swal from 'sweetalert2';

const {t} = useI18n({useScope: 'global'})
const playersStore = usePlayersStore();
const tournamentStore = useTournamentStore();
const searchQuery = ref('');
const filteredPlayers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return playersStore.playersWithStats.filter(player => player.name.toLowerCase().includes(query));
});
const statusMap = {
  playing: {text: t('playing'), icon: 'bi bi-play-fill'},
  queued: {text: t('queued'), icon: 'bi bi-pause-circle'},
  active: {text: t('active'), icon: 'bi bi-check-circle'},
  paused: {text: t('paused'), icon: 'bi bi-x-circle'}
};
const fields = computed(() => [
  {key: 'name', label: t('name')},
  {key: 'points', label: 'P', class: ['text-center', 'fw-bold']},
  {key: 'wins', label: 'W', class: 'text-center'},
  {key: 'draws', label: 'D', class: 'text-center'},
  {key: 'losses', label: 'L', class: 'text-center'},
  {key: 'gamesPlayed', label: 'T', class: 'text-center'},
  {key: 'winRate', label: 'Win%', class: 'text-center'},
  {key: 'status', label: t('status'), class: 'text-center'},
  {key: 'actions', label: '', class: 'text-center'}
]);
const getPlayerAction = (player) => {
  if (tournamentStore.status === 'idle') {
    return {
      title: t('removePlayer'),
      variant: 'danger',
      icon: 'bi bi-trash',
      action: () => playersStore.removePlayer(player.name)
    };
  }
  if (player.status === 'paused') {
    return {
      title: t('resumePlayer'),
      variant: 'warning',
      icon: 'bi bi-play',
      action: () => playersStore.resumePlayer(player.name)
    };
  }
  return {
    title: t('pausePlayer'),
    variant: 'secondary',
    icon: 'bi bi-pause',
    action: () => playersStore.pausePlayer(player.name)
  };
};
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

  if (scoreboardData.length === 0) {
    Swal.fire(t('notEnoughPlayers'), '', 'warning');
    return;
  }

  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.json_to_sheet(scoreboardData);
  XLSX.utils.book_append_sheet(wb, ws1, t('scoreboard'));

  const wbout = XLSX.write(wb, {bookType: "xlsx", type: "buffer"});
  window.electron.ipcRenderer.send('save-excel-file', wbout);
};
</script>