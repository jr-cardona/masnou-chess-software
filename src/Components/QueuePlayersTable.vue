<template>
  <div>
    <h4 class="mt-4">Waiting Players</h4>
    <pre>{{ queueStore.queue }}</pre>
    <b-table
        :items="queueStore.queue.map((player, index) => ({ position: index + 1, name: player }))"
        :fields="['position', 'name']"
        responsive
    />
  </div>
</template>

<script setup>
import {useQueueStore} from '../stores/useQueueStore';
import {BTable} from 'bootstrap-vue-3';

const queueStore = useQueueStore();
</script>
