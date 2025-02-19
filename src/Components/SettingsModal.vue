<template>
  <b-modal v-model="settingsStore.showModal"
           size="md"
           body-bg-variant="dark"
           header-bg-variant="dark"
           :title="t('tournamentSettings')"
           centered
           hide-footer
           no-close-on-esc
           hide-header-close
           no-close-on-backdrop
  >
    <div v-if="step === 1">
      <h5>{{ t('selectLanguage') }}</h5>
      <b-form-select v-model="language" :options="languages" class="my-3" @input="setLanguage"/>
      <b-button variant="warning" :disabled="!language" @click="step++" class="w-100">{{
          t('next')
        }}
      </b-button>
    </div>
    <div v-else>
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
      <div class="justify-content-between d-flex">
        <b-button variant="secondary" @click="settingsStore.resetSettings" class="w-25"><i class="bi bi-arrow-counterclockwise"></i>
          {{ t('reset') }}
        </b-button>
        <b-button variant="warning" :disabled="!isFormValid" @click="saveSettings" class="w-25"><i class="bi bi-floppy"></i>
          {{ t('save') }}
        </b-button>
      </div>
    </div>
  </b-modal>
</template>

<script setup>
import {ref, onMounted, watch, computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {useSettingsStore} from '../stores/useSettingsStore';
import {BModal, BButton, BFormGroup, BFormSelect, BFormInput} from 'bootstrap-vue-3';

const {t, locale} = useI18n({useScope: 'global'})
const settingsStore = useSettingsStore();
const step = ref(1);
const timeError = ref('');
const language = ref(localStorage.getItem('language'));

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
  if (!settingsStore.settings.hours > 0 && !settingsStore.settings.minutes < 5) {
    timeError.value = t('invalidTime');
    return;
  }
  timeError.value = '';
  if (isFormValid) {
    settingsStore.setSettings();
  }
};

const validateHours = () => {
  if (settingsStore.settings.hours === '' || isNaN(settingsStore.settings.hours)) {
    settingsStore.settings.hours = 0;
    return;
  }
  parseInt(settingsStore.settings.hours, 10);
  settingsStore.settings.hours = Math.max(0, Math.min(99, settingsStore.settings.hours));
};

const validateMinutes = () => {
  if (settingsStore.settings.minutes === '' || isNaN(settingsStore.settings.minutes)) {
    settingsStore.settings.minutes = 0;
    return;
  }
  parseInt(settingsStore.settings.minutes, 10);
  settingsStore.settings.minutes = Math.max(0, Math.min(59, settingsStore.settings.minutes));
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
