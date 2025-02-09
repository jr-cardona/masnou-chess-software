<template>
  <div class="mt-3">
    <h5>👥 Players List</h5>
    <pre>{{ store.players }}</pre>
    <b-table :items="store.players" :fields="['name', 'points', 'elo', 'actions']" bordered hover responsive>
      <template #cell(actions)="data">
        <b-button variant="danger" size="sm" @click="store.removePlayer(data.item.name)">Delete</b-button>
      </template>
    </b-table>
  </div>
</template>

<script setup>
import {useTournamentStore} from '../stores/useTournamentStore';
import {BTable, BButton} from 'bootstrap-vue-3';

const store = useTournamentStore();
</script>
