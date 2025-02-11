<template>
  <b-modal v-model="showModal"
           size="md"
           body-bg-variant="dark"
           header-bg-variant="dark"
           title="Tournament Settings"
           centered
           hide-footer
           no-close-on-esc
           hide-header-close
           no-close-on-backdrop
  >
    <div v-if="step === 1">
      <h5 class="text-light">Step 1: Please select a language</h5>
      <b-form-group label="Language:" class="text-light">
        <b-form-select v-model="settings.language" :options="languages"/>
      </b-form-group>
      <b-button variant="warning" :disabled="!settings.language" @click="step++" class="w-100">Next</b-button>
    </div>
    <div v-else>
      <h5 class="text-light">Step 2: Rules</h5>
      <b-form-group label="Tournament Name:" class="text-light">
        <b-form-input v-model="settings.tournamentName" required/>
      </b-form-group>
      <b-form-group label="Max Physical Boards:" class="text-light">
        <b-form-input type="number" v-model="settings.maxBoards" min="1" required/>
      </b-form-group>
      <b-form-group label="Initial Pairing:" class="text-light">
        <b-form-select v-model="settings.initialPairing" :options="pairingOptions"/>
      </b-form-group>
      <b-form-group label="Initial Queue Order:" class="text-light">
        <b-form-select v-model="settings.queueOrder" :options="queueOptions"/>
      </b-form-group>
      <b-form-group label="Winner's Next Color:" class="text-light">
        <b-form-select v-model="settings.winnerColor" :options="winnerColorOptions"/>
      </b-form-group>
      <b-form-group label="Max Consecutive Wins Before Queue:" class="text-light">
        <b-form-select v-model="settings.maxWinsBeforeQueue" :options="winOptions"/>
      </b-form-group>
      <b-form-group label="Draw Outcome:" class="text-light">
        <b-form-select v-model="settings.drawOutcome" :options="drawOptions"/>
      </b-form-group>
      <b-button variant="warning" :disabled="!isFormValid" @click="saveSettings" class="w-100">Finish</b-button>
    </div>
  </b-modal>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import {useSettingsStore} from '../stores/useSettingsStore';
import {BModal, BButton, BFormGroup, BFormSelect, BFormInput} from 'bootstrap-vue-3';

const settingsStore = useSettingsStore();
const showModal = ref(true);
const step = ref(1);
const settings = ref({
  language: 'English',
  tournamentName: '',
  maxBoards: 10,
  initialPairing: 'Random',
  queueOrder: 'Random',
  winnerColor: 'Winner Chooses',
  maxWinsBeforeQueue: 'Indefinite',
  drawOutcome: 'White',
});

const languages = ['English', 'Español'];
const pairingOptions = ['Random', 'By ELO'];
const queueOptions = ['Random', 'By ELO'];
const winnerColorOptions = ['Repeat Pieces', 'Switch Color', 'Winner Chooses'];
const winOptions = ['Indefinite', '3', '4', '5'];
const drawOptions = ['White', 'Higher Points', 'Both'];

const isFormValid = computed(() => {
  return Object.values(settings.value).every(val => val !== '' && val !== null);
});

const saveSettings = () => {
  settingsStore.setSettings(settings.value);
  showModal.value = false;
};

onMounted(() => {
  settingsStore.loadSettings();
  showModal.value = true;
});
</script>
