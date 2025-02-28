<template>
  <div class="mt-3">
    <h3 class="text-center text-warning"><i class="bi bi-puzzle p-2"></i>{{ t('game', 2) }}</h3>
    <b-table
        :items="gamesStore.activeGames"
        :fields=fields
        show-empty=""
        empty-text=""
        responsive
        class="custom-table mt-3 games-table"
        style="max-height: 800px"
    >
      <template #cell(board)="data">
        #{{ data.index + 1 }}
      </template>
      <template #cell(result)="data" nowrap="nowrap">
        <div class="text-center">
          <b-button-group v-if="tournamentStore.status === 'inCourse'">
            <b-button :title="t('whiteWins')" class="mx-1" size="sm" variant="light"
                      @click="gamesStore.processResult(data.index, 'white')">
              <WhiteKingIcon></WhiteKingIcon>
              1 — 0
            </b-button>
            <b-button :title="t('draw')" class="mx-1" size="sm" variant="warning"
                      @click="gamesStore.processResult(data.index, 'draw')">
              <DrawIcon></DrawIcon>
              ½ — ½
            </b-button>
            <b-button :title="t('blackWins')" class="mx-1" size="sm" variant="secondary"
                      @click="gamesStore.processResult(data.index, 'black')">
              <BlackKingIcon></BlackKingIcon>
              0 — 1
            </b-button>
          </b-button-group>
          <span v-else class="fst-italic">VS</span>
        </div>
      </template>
      <template #empty>
        <h4 class="text-center my-4 fw-normal">
          {{ t('noMatchesAvailable') }}
        </h4>
        <b-button
            variant="warning"
            @click="startPairing"
            v-if="tournamentStore.status === 'idle'"
            class="w-100 mt-2 fs-5 fw-medium"
            size="md"
        >
          {{ t('randomPairing') }} <i class="bi bi-shuffle"></i>
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script setup>
import {useGamesStore} from '../stores/useGamesStore';
import {BTable, BButton, BButtonGroup} from 'bootstrap-vue-3';
import {useTournamentStore} from '../stores/useTournamentStore';
import {useI18n} from 'vue-i18n';
import DrawIcon from './icons/DrawIcon.vue';
import WhiteKingIcon from './icons/WhiteKingIcon.vue';
import BlackKingIcon from './icons/BlackKingIcon.vue';
import Swal from 'sweetalert2';

const {t} = useI18n({useScope: 'global'})
const gamesStore = useGamesStore();
const tournamentStore = useTournamentStore();
const fields = [
  {key: 'board', label: t('board'), class: 'text-center small-col'},
  {key: 'white', label: t('white'), class: 'w-25'},
  {key: 'result', label: '', class: 'text-nowrap text-center'},
  {key: 'black', label: t('black'), class: 'text-end w-25'},
];
const startPairing = () => {
  const result = tournamentStore.startPairing();
  if (!result.success) {
    Swal.fire({
      title: t(result.reason),
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      icon: 'error',
      timer: 4000,
      timerProgressBar: true,
    });
  }
};
</script>
<style>
.small-col {
  white-space: nowrap;
  width: 1%;
  max-width: fit-content;
}
</style>