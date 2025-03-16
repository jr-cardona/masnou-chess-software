<template>
  <b-table
      :items="playersStore.playersWithStats"
      :fields="finalFields"
      class="custom-table text-center mt-3"
      striped="true"
      hover="true"
  >
    <template #cell(rank)="data">
      <strong>#{{ data.item.rank }}</strong>
    </template>
    <template #cell(winRate)="data">
      {{ data.item.winRate }}%
    </template>
  </b-table>
</template>

<script setup>
import {usePlayersStore} from '../stores/usePlayersStore';
import {BTable} from 'bootstrap-vue-3';
import {useI18n} from 'vue-i18n';
import {computed} from "vue";

const {t} = useI18n({useScope: 'global'});
const playersStore = usePlayersStore();

const finalFields = computed(() => [
  {key: 'rank', label: t('position'), class: 'text-center'},
  {key: 'name', label: t('name')},
  {key: 'points', label: t('point', 2), class: 'text-center'},
  {key: 'wins', label: t('wins'), class: 'text-center'},
  {key: 'draws', label: t('draw'), class: 'text-center'},
  {key: 'losses', label: t('losses'), class: 'text-center'},
  {key: 'gamesPlayed', label: t('game', 2), class: 'text-center'},
  {key: 'winRate', label: 'Win%', class: 'text-center'},
]);
</script>
