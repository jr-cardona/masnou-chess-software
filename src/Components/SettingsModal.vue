<template>
  <b-modal v-model="settingsStore.showModal"
           size="lg"
           body-bg-variant="dark"
           header-bg-variant="dark"
           centered
           hide-footer
           no-close-on-esc
           hide-header-close
           no-close-on-backdrop
  >
    <template #title>
      <i class="bi bi-trophy me-1"></i> {{ t('tournamentSettings') }}
    </template>
    <b-tabs pills vertical nav-wrapper-class="w-35">
      <!-- Idioma -->
      <b-tab>
        <template #title>
          <i class="bi bi-globe-americas me-1"></i> {{ t('language') }}
        </template>
        <b-form-group :label="t('selectLanguage')">
          <b-form-select v-model="language" :options="languages" class="my-3" @input="setLanguage"/>
        </b-form-group>
      </b-tab>
      <!-- Apariencia -->
      <b-tab>
        <template #title>
          <i class="bi bi-brush"></i> {{ t('appearance') }}
        </template>
        <b-form-group :label="t('theme')">
          <b-form-radio v-model="theme" value="dark">Oscuro</b-form-radio>
          <b-form-radio v-model="theme" value="light">Claro</b-form-radio>
        </b-form-group>
      </b-tab>
      <!-- Configuración del Torneo -->
      <b-tab active>
        <template #title>
          <i class="bi bi-sliders me-1"></i> {{ t('generalSettings') }}
        </template>
        <b-form-group :label="t('tournamentName')">
          <b-form-input v-model="settingsStore.settings.tournamentName" required/>
        </b-form-group>

        <b-form-group :label="t('maxBoards')">
          <b-form-input type="number" v-model="settingsStore.settings.maxBoards" min="1" required/>
        </b-form-group>

        <b-form-group :label="t('tournamentDuration')">
          <div class="d-flex align-items-center">
            <b-input-group class="w-auto">
              <b-form-input v-model.number="settingsStore.settings.hours"
                            class="text-center time-field"
                            @blur="validateHours"
              />
              <b-input-group-text>h</b-input-group-text>
            </b-input-group>
            <span class="mx-2">:</span>
            <b-input-group class="w-auto">
              <b-form-input v-model.number="settingsStore.settings.minutes"
                            class="text-center time-field"
                            @blur="validateMinutes"
              />
              <b-input-group-text>m</b-input-group-text>
            </b-input-group>
          </div>
          <div v-if="timeError" class="invalid-feedback d-block">{{ timeError }}</div>
        </b-form-group>

        <b-form-group :label="t('winnerColor')">
          <b-form-select v-model="settingsStore.settings.winnerColor" :options="winnerOptions"/>
        </b-form-group>

        <b-form-group :label="t('maxWins')">
          <b-form-select v-model="settingsStore.settings.maxWins" :options="winLimitOptions"/>
        </b-form-group>

        <b-form-group :label="t('drawScenario')">
          <b-form-select v-model="settingsStore.settings.drawScenario" :options="drawOptions"/>
        </b-form-group>
      </b-tab>
    </b-tabs>
    <!-- Botones de acción -->
    <div class="justify-content-between d-flex mt-3">
      <b-button variant="secondary" @click="settingsStore.resetSettings" class="w-25">
        <i class="bi bi-arrow-counterclockwise"></i> {{ t('reset') }}
      </b-button>
      <b-button variant="warning" :disabled="!isFormValid" @click="saveSettings" class="w-25">
        <i class="bi bi-floppy"></i> {{ t('save') }}
      </b-button>
    </div>
  </b-modal>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {useSettingsStore} from '../stores/useSettingsStore';
import {BModal, BButton, BFormGroup, BFormSelect, BFormInput, BTabs} from 'bootstrap-vue-3';

const {t, locale} = useI18n({useScope: 'global'});
const settingsStore = useSettingsStore();
const timeError = ref('');
const language = ref(localStorage.getItem('language'));
const theme = ref('dark');

const languages = [
  {value: 'en', text: 'English'},
  {value: 'es', text: 'Español'},
];
const winnerOptions = [
  {value: 'changes', text: t('changesColor')},
  {value: 'repeats', text: t('repeatsColor')},
];
const winLimitOptions = [
  {value: 'unlimited', text: t('unlimited')},
  {value: '3', text: '3'},
  {value: '4', text: '4'},
  {value: '5', text: '5'},
  {value: '6', text: '6'},
];
const drawOptions = [
  {value: 'whiteOut', text: t('whiteSitsOut')},
  {value: 'higherOut', text: t('higherScoreSitsOut')},
  {value: 'bothOut', text: t('bothSitOut')},
];

const isFormValid = computed(() => {
  return Object.values(settingsStore.settings).every(val => val !== '' && val !== null);
});

const saveSettings = () => {
  if (settingsStore.settings.hours === 0 && settingsStore.settings.minutes < 5) {
    timeError.value = t('invalidTime');
    return;
  }
  timeError.value = '';
  settingsStore.setSettings();
};

const validateHours = () => {
  if (settingsStore.settings.hours === '' || isNaN(settingsStore.settings.hours)) {
    settingsStore.settings.hours = 0;
    return;
  }
  settingsStore.settings.hours = Math.max(0, Math.min(99, parseInt(settingsStore.settings.hours, 10)));
};

const validateMinutes = () => {
  if (settingsStore.settings.minutes === '' || isNaN(settingsStore.settings.minutes)) {
    settingsStore.settings.minutes = 0;
    return;
  }
  settingsStore.settings.minutes = Math.max(0, Math.min(59, parseInt(settingsStore.settings.minutes, 10)));
};

const setLanguage = () => {
  locale.value = language.value;
  localStorage.setItem('language', language.value);
};

onMounted(() => {
  settingsStore.loadSettings();
  locale.value = language.value;
  if (!isFormValid.value) {
    settingsStore.showModal = true;
  }
});
</script>
<style>
.time-field {
  max-width: 50px;
}
</style>
