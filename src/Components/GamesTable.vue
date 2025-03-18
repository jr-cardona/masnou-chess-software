<template>
  <div class="mt-3">
    <h3 class="text-center text-yellow-500 text-2xl font-bold gap-2 flex items-center justify-center">
      <i class="bi bi-puzzle"></i>{{ t('game', 2) }}
    </h3>
    <div class="mt-3 overflow-auto max-h-[700px]">
      <table class="w-full border-collapse text-left custom-table">
        <thead>
        <tr class="bg-gray-200">
          <th class="p-2 text-center text-nowrap small-col">{{ t('board') }}</th>
          <th class="p-2">{{ t('white') }}</th>
          <th class="p-2 text-center"></th>
          <th class="p-2 text-right">{{ t('black') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(game, index) in gamesStore.activeGames" :key="index" class="border-b">
          <td class="p-2 text-center">#{{ index + 1 }}</td>
          <td class="p-2">{{ game.white.name }}</td>
          <td class="p-2 text-center">
            <div v-if="tournamentStore.status === 'inCourse'" class="flex justify-center gap-2">
              <button
                  class="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm flex items-center text-black"
                  :title="t('whiteWins')"
                  @click="gamesStore.processResult(index, game.white, game.black)"
              >
                <WhiteKingIcon class="mr-1"/>
                1 — 0
              </button>
              <button
                  class="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 rounded text-sm flex items-center text-black"
                  :title="t('draw')"
                  @click="gamesStore.processResult(index, null, null)"
              >
                <DrawIcon class="mr-1"/>
                ½ — ½
              </button>
              <button
                  class="px-2 py-1 bg-gray-600 text-white hover:bg-gray-700 rounded text-sm flex items-center"
                  :title="t('blackWins')"
                  @click="gamesStore.processResult(index, game.black, game.white)"
              >
                <BlackKingIcon class="mr-1"/>
                0 — 1
              </button>
            </div>
            <span v-else class="italic">VS</span>
          </td>
          <td class="p-2 text-right">{{ game.black.name }}</td>
        </tr>
        <tr v-if="gamesStore.activeGames.length === 0">
          <td colspan="4" class="text-center py-4 text-lg">
            {{ t('noMatchesAvailable') }}
          </td>
        </tr>
        <tr v-if="canAddBoard">
          <td colspan="4" class="text-center bg-gray-800 text-white py-2">
            <button
                class="px-4 py-1 bg-yellow-400 hover:bg-yellow-500 rounded text-lg text-black font-medium"
                @click="gamesStore.addBoard()"
            >
              {{ t('enableBoard') }} <i class="bi bi-plus-lg ml-2"></i>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <button
        v-if="tournamentStore.status === 'idle'"
        class="w-full mt-2 text-lg font-medium bg-yellow-500 text-black py-2 rounded"
        @click="startPairing"
    >
      {{ t('randomPairing') }} <i class="bi bi-shuffle ml-2"></i>
    </button>
  </div>
</template>

<script setup>
import {useGamesStore} from '../stores/useGamesStore';
import {useTournamentStore} from '../stores/useTournamentStore';
import {usePlayersStore} from '../stores/usePlayersStore';
import {useQueueStore} from '../stores/useQueueStore';
import {useSettingsStore} from '../stores/useSettingsStore';
import {useI18n} from 'vue-i18n';
import DrawIcon from './icons/DrawIcon.vue';
import WhiteKingIcon from './icons/WhiteKingIcon.vue';
import BlackKingIcon from './icons/BlackKingIcon.vue';
import Swal from 'sweetalert2';
import {computed} from 'vue';

const {t} = useI18n({useScope: 'global'})
const queueStore = useQueueStore();
const gamesStore = useGamesStore();
const playersStore = usePlayersStore();
const tournamentStore = useTournamentStore();
const settingStore = useSettingsStore();
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
const canAddBoard = computed(() => {
  const activePlayers = playersStore.players.filter(p => p.status !== 'paused').length;
  const idealQueueSize = activePlayers - (Math.round(activePlayers / 3) * 2);
  const canEnable = queueStore.queue.length > idealQueueSize;
  const hasSpace = gamesStore.activeGames.length < settingStore.settings.maxBoards;
  return canEnable && hasSpace && tournamentStore.timer > 0;
});
</script>
<style>
.small-col {
  width: 1%;
}
</style>