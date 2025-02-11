<template>
  <div class="mt-3">
    <h4 class="text-center text-warning"><i class="bi bi-hourglass-split"></i> Waiting Players</h4>
    <ul class="list-group mt-3">
      <li v-for="(player, index) in queueStore.queue" :key="player" class="list-group-item bg-dark text-light">
        <strong>#{{ index + 1 }}</strong> {{ player }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useQueueStore } from '../stores/useQueueStore';

const queueStore = useQueueStore();
</script>
