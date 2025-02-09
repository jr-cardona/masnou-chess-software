<template>
  <div>
    <h4 class="mt-4">Active Games</h4>
    <pre>{{ store.activeGames }}</pre>
    <b-table :items="store.activeGames" :fields="['board', 'white', 'black', 'result']">
      <template #cell(board)="data">
        #{{ data.index + 1 }}
      </template>
      <template #cell(result)="data">
        <b-button-group>
          <b-button size="sm" variant="light" @click="store.processResult(data.index, 'white')">⚪ 1 - 0</b-button>
          <b-button size="sm" variant="light" @click="store.processResult(data.index, 'draw')">🤝 1/2 - 1/2</b-button>
          <b-button size="sm" variant="light" @click="store.processResult(data.index, 'black')">⚫ 0 - 1</b-button>
        </b-button-group>
      </template>
    </b-table>
  </div>
</template>

<script setup>
import {useTournamentStore} from '../stores/useTournamentStore';
import {BTable} from 'bootstrap-vue-3';
import {BButton} from 'bootstrap-vue-3';

const store = useTournamentStore();
</script>
