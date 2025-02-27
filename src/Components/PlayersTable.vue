<template>
  <div class="mt-3">
    <h3 class="text-center text-warning"><i class="bi bi-trophy p-2"></i> {{ t('scoreboard') }}</h3>
    <b-table :items="playersStore.players"
             :fields=fields
             responsive
             striped
             hover
             class="custom-table mt-3"
             style="max-height: 1080px"
    >
      <template #cell(actions)="data">
        <b-button
            :title="t('removePlayer')"
            v-if="tournamentStore.status === 'idle'"
            variant="danger"
            size="sm"
            @click="playersStore.removePlayer(data.item.name)">
          <i class="bi bi-trash"></i>
        </b-button>
        <b-button
            :title="t('pausePlayer')"
            v-else-if="data.item.status === 'active'"
            variant="secondary"
            size="sm"
            @click="playersStore.pausePlayer(data.item.name)">
          <i class="bi bi-pause"></i>
        </b-button>
        <b-button
            :title="t('resumePlayer')"
            v-else
            variant="success"
            size="sm"
            @click="playersStore.resumePlayer(data.item.name)">
          <i class="bi bi-play"></i>
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script setup>
import {usePlayersStore} from '../stores/usePlayersStore';
import {useTournamentStore} from '../stores/useTournamentStore';
import {BTable, BButton} from 'bootstrap-vue-3';
import {useI18n} from "vue-i18n";

const {t} = useI18n({useScope: 'global'})
const playersStore = usePlayersStore();
const tournamentStore = useTournamentStore();
const fields = [
  {key: 'name', label: t('name')},
  'elo',
  {key: 'points', label: t('point', 2), class: 'text-center'},
  {key: 'actions', label: '', class: 'text-center'}
];

</script>
