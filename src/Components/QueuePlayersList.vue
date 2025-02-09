<template>
  <div>
    <h4 class="mt-4">Waiting Players</h4>
    <pre>{{ store.queue }}</pre>
    <b-table
        :items="store.queue.map((player, index) => ({ position: index + 1, name: player }))"
        :fields="['position', 'name']"
        small
        fixed
        light
    />
  </div>
</template>

<script setup>
import {useTournamentStore} from '../stores/useTournamentStore';
import {BTable} from 'bootstrap-vue-3';

const store = useTournamentStore();
</script>
