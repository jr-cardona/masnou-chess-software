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
      <!-- Scoreboard -->
      <b-tab>
        <template #title>
          <i class="bi bi-trophy me-1"></i> {{ t('scoreboard') }}
        </template>
        <Scoreboard></Scoreboard>
      </b-tab>
    </b-tabs>
    <!-- Botones de acción -->
    <div class="justify-content-end d-flex mt-3">
      <b-button variant="success" @click="exportToExcel" class="w-25">
        <i class="bi bi-file-earmark-excel"></i> {{ t('export') }}
      </b-button>
    </div>
  </b-modal>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue';
import EventsHistory from './EventsHistory.vue';
import {BModal} from 'bootstrap-vue-3';
import {useI18n} from 'vue-i18n';
import Scoreboard from './Scoreboard.vue';

const props = defineProps(["show"]);
const emit = defineEmits(["update:show"]);
const {t} = useI18n({useScope: 'global'});

const exportToExcel = () => {
  console.log('Exporting to Excel...');
}

</script>
