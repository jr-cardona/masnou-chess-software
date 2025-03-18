<template>
  <div class="mt-3">
    <h3 class="text-center text-yellow-500 text-2xl">
      <i class="bi bi-trophy"></i> {{ t('scoreboard') }}
    </h3>
    <div class="mt-3 overflow-auto max-h-[700px]">
      <table class="w-full text-left custom-table bg-gray-800 border border-gray-900">
        <thead>
        <tr class="bg-black text-yellow-500">
          <th class="p-2 text-center">#</th>
          <th class="p-2">
            <div class="flex items-center">
              <span>{{ t('name') }}</span>
              <div class="flex items-center bg-gray-700 text-white rounded-md ml-5 h-[25px] border border-gray-400">
                <span class="px-2">
                  <i class="bi bi-search text-sm"></i>
                </span>
                <input
                    v-model="searchQuery"
                    class="bg-gray-700 text-white text-sm outline-none pl-2 h-[25px] rounded-r-md border border-gray-400"
                    :placeholder="t('search') + '...'"
                />
              </div>
            </div>
          </th>
          <th class="p-2 text-center">
              <span v-if="tournamentStore.status !== 'finished'" class="flex items-center justify-center">
                {{ t('P') }}
                <button class="p-0 bg-transparent text-gray-400 hover:text-gray-200 ml-1" :title="t('point', 2)">
                  <i class="bi bi-info-circle"></i>
                </button>
              </span>
            <span v-else>{{ t('point', 2) }}</span>
          </th>
          <th class="p-2 text-center">
              <span v-if="tournamentStore.status !== 'finished'" class="flex items-center justify-center">
                {{ t('W') }}
                <button class="p-0 bg-transparent text-gray-400 hover:text-gray-200 ml-1" :title="t('wins')">
                  <i class="bi bi-info-circle"></i>
                </button>
              </span>
            <span v-else>{{ t('wins') }}</span>
          </th>
          <th class="p-2 text-center">
              <span v-if="tournamentStore.status !== 'finished'" class="flex items-center justify-center">
                {{ t('D') }}
                <button class="p-0 bg-transparent text-gray-400 hover:text-gray-200 ml-1" :title="t('draw', 2)">
                  <i class="bi bi-info-circle"></i>
                </button>
              </span>
            <span v-else>{{ t('draw', 2) }}</span>
          </th>
          <th class="p-2 text-center">
              <span v-if="tournamentStore.status !== 'finished'" class="flex items-center justify-center">
                {{ t('L') }}
                <button class="p-0 bg-transparent text-gray-400 hover:text-gray-200 ml-1" :title="t('losses')">
                  <i class="bi bi-info-circle"></i>
                </button>
              </span>
            <span v-else>{{ t('losses') }}</span>
          </th>
          <th class="p-2 text-center">
              <span v-if="tournamentStore.status !== 'finished'" class="flex items-center justify-center">
                {{ t('T') }}
                <button class="p-0 bg-transparent text-gray-400 hover:text-gray-200 ml-1" :title="t('gamesPlayed')">
                  <i class="bi bi-info-circle"></i>
                </button>
              </span>
            <span v-else>{{ t('gamesPlayed') }}</span>
          </th>
          <th class="p-2 text-center">Win%</th>
          <th class="p-2 text-center">
            <span v-if="tournamentStore.status !== 'finished'">{{ t('status') }}</span>
          </th>
          <th class="p-2 text-center flex justify-center">
            <button
                class="p-1 text-white bg-green-600 hover:bg-green-700 rounded text-sm flex items-center"
                :title="t('export')"
                @click="exportToExcel"
            >
              <i class="bi bi-file-earmark-excel"></i>
              <span class="pl-1" v-if="tournamentStore.status === 'finished'">{{ t('export') }}</span>
            </button>
          </th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(player) in filteredPlayers" :key="player.name" class="border-t">
          <td class="p-2 text-center">{{ player.rank }}</td>
          <td class="p-2">{{ player.name }}</td>
          <td class="p-2 text-center">{{ player.points }}</td>
          <td class="p-2 text-center">{{ player.wins }}</td>
          <td class="p-2 text-center">{{ player.draws }}</td>
          <td class="p-2 text-center">{{ player.losses }}</td>
          <td class="p-2 text-center">{{ player.gamesPlayed }}</td>
          <td class="p-2 text-center">{{ player.winRate }}%</td>
          <td class="p-2">
            <span v-if="tournamentStore.status !== 'finished'">
              <i :class="statusMap[player.status]?.icon || 'bi bi-question-circle'"
                 class="text-blue-500 mr-1 text-yellow-500"></i>
              {{ statusMap[player.status]?.text || player.status }}
            </span>
          </td>
          <td class="p-2 text-center">
            <span v-if="tournamentStore.status !== 'finished'">
            <button
                class="p-1 text-white rounded text-sm"
                :class="getPlayerAction(player).variant"
                :title="getPlayerAction(player).title"
                @click="getPlayerAction(player).action">
              <i :class="getPlayerAction(player).icon"></i>
            </button>
            </span>
          </td>
        </tr>
        <tr v-if="filteredPlayers.length === 0">
          <td colspan="10" class="text-center py-4 text-lg">
            {{ t('notEnoughPlayers') }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-if="filteredPlayers.length === 0" class="text-center">
      <button
          v-if="tournamentStore.status === 'idle'"
          class="w-full mt-2 text-lg font-medium bg-yellow-500 text-black py-2 rounded"
          @click="playersStore.addTestData">
        {{ t('addTestData') }} <i class="bi bi-plus-lg"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import {usePlayersStore} from '../stores/usePlayersStore';
import {useTournamentStore} from '../stores/useTournamentStore';
import {useI18n} from 'vue-i18n';
import {computed, ref} from 'vue';
import * as XLSX from "xlsx";
import Swal from 'sweetalert2';

const {t} = useI18n({useScope: 'global'});
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
const getPlayerAction = (player) => {
  if (tournamentStore.status === 'idle') {
    return {
      title: t('removePlayer'),
      variant: 'bg-red-500',
      icon: 'bi bi-trash',
      action: () => playersStore.removePlayer(player.name)
    };
  }
  if (player.status === 'paused') {
    return {
      title: t('resumePlayer'),
      variant: 'bg-yellow-500',
      icon: 'bi bi-play',
      action: () => playersStore.resumePlayer(player.name)
    };
  }
  return {
    title: t('pausePlayer'),
    variant: 'bg-gray-500',
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