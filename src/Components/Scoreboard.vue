<template>
  <b-table
      :items="playersStore.players"
      :fields="finalFields"
      class="custom-table text-center mt-3"
      striped="true"
      hover="true"
  >
    <template #cell(rank)="data">
      <strong>#{{ data.index + 1 }}</strong>
    </template>
    <template #cell(gamesPlayed)="data">
      {{ (data.item.wins || 0) + (data.item.draws || 0) + (data.item.losses || 0) }}
    </template>
    <template #cell(winRate)="data">
        {{ calculateWinRate(data.item) }}%
    </template>
  </b-table>
</template>

<script setup>
import {usePlayersStore} from '../stores/usePlayersStore';
import {BTable} from 'bootstrap-vue-3';
import {useI18n} from 'vue-i18n';

const {t} = useI18n({useScope: 'global'})
const playersStore = usePlayersStore();

const finalFields = [
  {key: 'rank', label: t('position'), class: 'text-center'},
  {key: 'name', label: t('name')},
  {key: 'points', label: t('point', 2), class: 'text-center'},
  {key: 'wins', label: t('wins'), class: 'text-center'},
  {key: 'draws', label: t('draw'), class: 'text-center'},
  {key: 'losses', label: t('losses'), class: 'text-center'},
  {key: 'gamesPlayed', label: t('game', 2), class: 'text-center'},
  {key: 'winRate', label: 'Win%', class: 'text-center'},
];

const calculateWinRate = (player) => {
  const gamesPlayed = (player.wins || 0) + (player.draws || 0) + (player.losses || 0);
  return gamesPlayed > 0 ? ((player.wins || 0) / gamesPlayed * 100).toFixed(2) : "0.00";
};
</script>
