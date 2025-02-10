<template>
  <div>
    <h4 class="mt-4">Active Games</h4>
    <pre>{{ gamesStore.activeGames }}</pre>
    <b-table :items="gamesStore.activeGames" :fields="['board', 'white', 'black', 'result']" responsive>
      <template #cell(board)="data">
        #{{ data.index + 1 }}
      </template>
      <template #cell(result)="data">
        <b-button-group>
          <b-button size="sm" variant="light" @click="gamesStore.processResult(data.index, 'white')">⚪ 1 - 0</b-button>
          <b-button size="sm" variant="light" @click="gamesStore.processResult(data.index, 'draw')">🤝 1/2 - 1/2</b-button>
          <b-button size="sm" variant="light" @click="gamesStore.processResult(data.index, 'black')">⚫ 0 - 1</b-button>
        </b-button-group>
      </template>
    </b-table>
  </div>
</template>

<script setup>
import {useGamesStore} from '../stores/useGamesStore';
import {BTable} from 'bootstrap-vue-3';
import {BButton} from 'bootstrap-vue-3';

const gamesStore = useGamesStore();
</script>
