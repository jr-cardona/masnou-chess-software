<template>
  <b-modal
      v-model="props.show"
      size="xl"
      body-bg-variant="dark"
      header-bg-variant="dark"
      centered="true"
      hide-footer="true"
      scrollable="true"
      @hide="emit('update:show', false)"
  >
    <template #title>
      <i class="bi bi-bar-chart-fill me-1"></i> {{ t('tournamentStats') }}
    </template>
    <b-tabs pills vertical nav-wrapper-class="w-35">
      <!-- Events History -->
      <b-tab active>
        <template #title>
          <i class="bi bi-clock-history me-1"></i> {{ t('eventsHistory') }}
        </template>
        <EventsHistory></EventsHistory>
      </b-tab>
    </b-tabs>
    <!-- Export button -->
    <div class="flex justify-end mt-3">
      <button @click="exportToExcel"
              class="w-1/4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center hover:bg-green-600">
        <i class="bi bi-file-earmark-excel me-2"></i> {{ t('export') }}
      </button>
    </div>
  </b-modal>
</template>

<script setup>
import {useI18n} from 'vue-i18n';
import {useHistoryStore} from '../stores/useHistoryStore';
import {BModal} from 'bootstrap-vue-3';
import EventsHistory from './EventsHistory.vue';
import * as XLSX from 'xlsx';

const props = defineProps(["show"]);
const emit = defineEmits(["update:show"]);
const {t} = useI18n({useScope: 'global'});

const historyStore = useHistoryStore();

const exportToExcel = async () => {
  const eventsData = historyStore.events.flatMap(group =>
      group.events.map(event => ({
        [t('timestamp')]: group.timestamp,
        [t('event')]: t(event.key, {
          ...event.params,
          reason: t(`reason.${event.params.reason || 'unknown'}`)
        }),
      }))
  );

  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.json_to_sheet(eventsData);

  XLSX.utils.book_append_sheet(wb, ws1, "Events History");

  const wbout = XLSX.write(wb, {bookType: "xlsx", type: "buffer"});

  window.electron.ipcRenderer.send('save-excel-file', wbout);
};
</script>
