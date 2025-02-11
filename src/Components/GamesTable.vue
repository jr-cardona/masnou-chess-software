<template>
  <div class="mt-3">
    <h4 class="text-warning text-center"><i class="bi bi-puzzle p-2"></i>Games</h4>
    <b-table
        :items="gamesStore.activeGames"
        :fields="['board', 'white', {key:'result',class:'text-center'}, {key:'black',class:'text-end'}]"
        class="custom-table"
        responsive
    >
      <template #cell(board)="data">
        #{{ data.index + 1 }}
      </template>
      <template #cell(result)="data">
        <b-button-group>
          <b-button class="mx-1" size="md" variant="light" @click="gamesStore.processResult(data.index, 'white')">⚪ 1 - 0</b-button>
          <b-button class="mx-1" size="md" variant="warning" @click="gamesStore.processResult(data.index, 'draw')">🤝 ½ - ½</b-button>
          <b-button class="mx-1" size="md" variant="dark" @click="gamesStore.processResult(data.index, 'black')">⚫ 0 - 1</b-button>
        </b-button-group>
      </template>
    </b-table>
  </div>
</template>

<script setup>
import {useGamesStore} from "../stores/useGamesStore";
import {BTable, BButton, BButtonGroup} from "bootstrap-vue-3";

const gamesStore = useGamesStore();
</script>
