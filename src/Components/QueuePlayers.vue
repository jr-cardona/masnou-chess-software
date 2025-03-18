<template>
  <div class="mt-4">
    <h3 v-if="queueStore.queue.length > 0"
        class="text-center text-yellow-500 text-xl">
      <i class="bi bi-hourglass-split"></i> {{ t('queuePlayers') }}
    </h3>
    <ul class="mt-3 max-h-[1000px] overflow-auto grid grid-cols-4 gap-2">
      <li v-for="(player, index) in queueStore.queue" :key="player"
          class="bg-gray-800 text-white p-2 flex items-center justify-center rounded-lg">
        <strong class="me-1">#{{ index + 1 }}</strong> {{ player.name }}
        <span v-if="index === 0"><i class="bi bi-arrow-up"></i></span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {useQueueStore} from '../stores/useQueueStore';
import {useI18n} from "vue-i18n";

const {t} = useI18n({useScope: 'global'});
const queueStore = useQueueStore();
</script>
