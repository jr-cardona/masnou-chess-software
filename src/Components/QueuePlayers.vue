<template>
  <div class="mt-4">
    <h4 v-if="queueStore.queue.length > 0" class="text-center text-warning"><i class="bi bi-hourglass-split"></i>
      {{ t('queuePlayers') }}
    </h4>
    <ul class="list-group mt-3" style="max-height: 1000px">
      <li v-for="(player, index) in queueStore.queue" :key="player" class="list-group-item bg-dark text-light fs-4">
        <strong>#{{ index + 1 }}</strong> {{ player.name }} <span v-if="index === 0"><i class="bi bi-arrow-right"></i></span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import {useQueueStore} from '../stores/useQueueStore';
import {useI18n} from "vue-i18n";

const {t} = useI18n({useScope: 'global'})
const queueStore = useQueueStore();
</script>
