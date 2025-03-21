<template>
  <div class="mt-3">
    <div v-if="tournamentStore.status === 'finished'">
      <div class="text-center text-warning fw-bold"><i class="bi bi-trophy p-2"></i> {{ t('finalRanking') }}</div>
      <Scoreboard></Scoreboard>
    </div>
    <div v-else>
      <h3 class="text-center text-warning"><i class="bi bi-trophy p-2"></i> {{ t('scoreboard') }}</h3>
      <b-table
          :items="filteredPlayers"
          :fields="fields"
          show-empty=""
          empty-text=""
          responsive
          class="custom-table mt-3 fs-5"
          style="max-height: 1200px"
      >
        <template #head(name)>
          <div class="d-flex align-items-center">
            <span>{{ t('name') }}</span>
            <BFormInput
                v-model="searchQuery"
                class="ms-4 bg-dark text-light"
                size="sm"
                placeholder="🔍"
            />
          </div>
        </template>
        <template #cell(name)="data">
          {{ data.index + 1 }}. {{ data.item.name }}
        </template>
        <template #cell(status)="data">
          <i :class="getStatusIcon(data.item.status)" class="me-1 text-primary"></i>
          {{ getStatusText(data.item.status) }}
        </template>
        <template #cell(actions)="data">
          <b-button
              :title="t('removePlayer')"
              v-if="tournamentStore.status === 'idle'"
              variant="danger"
              size="sm"
              @click="playersStore.removePlayer(data.item)">
            <i class="bi bi-trash"></i>
          </b-button>
          <b-button
              :title="t('resumePlayer')"
              v-else-if="data.item.status === 'paused'"
              variant="warning"
              size="sm"
              @click="playersStore.resumePlayer(data.item)">
            <i class="bi bi-play"></i>
          </b-button>
          <b-button
              :title="t('pausePlayer')"
              v-else
              variant="secondary"
              size="sm"
              @click="playersStore.pausePlayer(data.item)">
            <i class="bi bi-pause"></i>
          </b-button>
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
import Scoreboard from "./Scoreboard.vue";

const {t} = useI18n({useScope: 'global'})
const playersStore = usePlayersStore();
const tournamentStore = useTournamentStore();
const searchQuery = ref('');
const filteredPlayers = computed(() => {
  return playersStore.players.filter(player =>
      player.name.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
  );
});
const getStatusText = (status) => {
  const statusMap = {
    playing: t('playing'),
    queued: t('queued'),
    active: t('active'),
    paused: t('paused')
  };
  return statusMap[status] || status;
};
const getStatusIcon = (status) => {
  const iconMap = {
    playing: 'bi bi-play-fill',
    queued: 'bi bi-pause-circle',
    active: 'bi bi-check-circle',
    paused: 'bi bi-x-circle'
  };
  return iconMap[status] || 'bi bi-question-circle';
};
const fields = [
  {key: 'name', label: t('name')},
  {key: 'points', label: t('point', 2), class: 'text-center'},
  {key: 'status', label: t('status')},
  {key: 'actions', label: '', class: 'text-center'}
];
</script>
