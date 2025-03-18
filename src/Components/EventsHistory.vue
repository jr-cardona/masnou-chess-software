<template>
  <ul>
    <li v-for="group in historyStore.events" :key="group.timestamp" class="mb-5">
      <strong>{{ group.timestamp }}</strong>
      <ul>
        <li v-for="event in group.events" :key="event.key + JSON.stringify(event.params)">
          {{ t(event.key, {...event.params, reason: t(`reason.${event.params.reason || 'unknown'}`)}) }}
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup>
import {useI18n} from 'vue-i18n';
import {useHistoryStore} from '../stores/useHistoryStore';

const {t} = useI18n();
const historyStore = useHistoryStore();
</script>