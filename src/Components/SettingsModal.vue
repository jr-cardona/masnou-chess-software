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
      <h5 class="text-light">{{ t('selectLanguage') }}</h5>
      <b-form-select v-model="settingsStore.settings.language" :options="languages" class="my-3"/>
      <b-button variant="warning" :disabled="!settingsStore.settings.language" @click="step++" class="w-100">{{
          t('next')
        }}
      </b-button>
    </div>
    <div v-else>
      <h5 class="text-light">{{ t('generalSettings') }}</h5>
      <b-form-group :label="t('tournamentName')" class="text-light">
        <b-form-input v-model="settingsStore.settings.tournamentName" required/>
      </b-form-group>
      <b-form-group :label="t('maxBoards')" class="text-light">
        <b-form-input type="number" v-model="settingsStore.settings.maxBoards" min="1" required/>
      </b-form-group>
      <b-form-group :label="t('initialPairing')" class="text-light">
        <b-form-select v-model="settingsStore.settings.initialPairing" :options="pairingOptions"/>
      </b-form-group>
      <b-form-group :label="t('initialQueueOrder')" class="text-light">
        <b-form-select v-model="settingsStore.settings.queueOrder" :options="queueOptions"/>
      </b-form-group>
      <b-form-group :label="t('winnerColor')" class="text-light">
        <b-form-select v-model="settingsStore.settings.winnerColor" :options="winnerOptions"/>
      </b-form-group>
      <b-form-group :label="t('maxWins')" class="text-light">
        <b-form-select v-model="settingsStore.settings.maxWins" :options="winLimitOptions"/>
      </b-form-group>
      <b-form-group :label="t('drawScenario')" class="text-light">
        <b-form-select v-model="settingsStore.settings.drawScenario" :options="drawOptions"/>
      </b-form-group>
      <div class="justify-content-between d-flex">
        <b-button variant="secondary" @click="step = 1" class="w-25"><i class="bi bi-arrow-left"></i> {{ t('back') }}
        </b-button>
        <b-button variant="warning" :disabled="!isFormValid" @click="saveSettings" class="w-25">{{
            t('finish')
          }}
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

const languages = [
  {value: 'en', text: 'English'},
  {value: 'es', text: 'Español'},
];
const pairingOptions = [
  {value: 'random', text: t('random')},
  {value: 'elo', text: t('byELO')},
];
const queueOptions = pairingOptions;
const winnerOptions = [
  {value: 'repeats', text: t('repeatsColor')},
  {value: 'changes', text: t('changesColor')},
  {value: 'chooses', text: t('chooses')},
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
  if (isFormValid) {
    settingsStore.setSettings();
  }
};

watch(() => settingsStore.settings.language, (newLang) => {
  locale.value = newLang;
  localStorage.setItem('language', newLang);
});

onMounted(() => {
  settingsStore.loadSettings();
  locale.value = settingsStore.settings.language;
  if (!isFormValid.value) {
    settingsStore.showModal = true;
  }
});
</script>
