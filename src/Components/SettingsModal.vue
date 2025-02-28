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
      <!-- Language -->
      <b-tab>
        <template #title>
          <i class="bi bi-globe-americas me-1"></i> {{ t('language') }}
        </template>
        <div class="custom-dropdown" :class="{ open: isOpen }">
          <button class="custom-dropdown-toggle" @click="isOpen = !isOpen">
            <span>
              <span class="flag">
                <img :src="`/flags/${selectedLanguage.value}.svg`" width="30" :alt="selectedLanguage.text">
              </span>
              {{ selectedLanguage.text }}
            </span>
            <span>▼</span>
          </button>
          <div class="custom-dropdown-menu">
            <div v-for="(lang, index) in languages" :key="lang.value">
              <div @click="selectLanguage(lang)" class="custom-dropdown-item">
                <span class="flag">
                  <img :src="`/flags/${lang.value}.svg`" width="30" :alt="lang.text">
                </span>
                {{ lang.text }}
              </div>
              <div v-if="index < languages.length - 1" class="custom-dropdown-divider"></div>
            </div>
          </div>
        </div>
      </b-tab>
      <!-- Appearance -->
      <b-tab>
        <template #title>
          <i class="bi bi-brush"></i> {{ t('appearance') }}
        </template>
        <b-form-group :label="t('theme')">
          <b-form-radio v-model="theme" value="dark">Oscuro</b-form-radio>
          <b-form-radio v-model="theme" value="light">Claro</b-form-radio>
        </b-form-group>
      </b-tab>
      <!-- Tournament Settings -->
      <b-tab active>
        <template #title>
          <i class="bi bi-sliders me-1"></i> {{ t('generalSettings') }}
        </template>
        <b-form-group :label="t('tournamentName')">
          <b-form-input v-model="settingsStore.settings.tournamentName" required/>
        </b-form-group>

        <b-form-group :label="t('maxBoards')">
          <b-form-input
              type="number"
              v-model="settingsStore.settings.maxBoards"
              min="3"
              required
          />
          <div v-if="maxBoardsError" class="invalid-feedback d-block">{{ maxBoardsError }}</div>
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
const maxBoardsError = ref('');
const language = ref(localStorage.getItem('language') ?? 'us');
const theme = ref('dark');
const isOpen = ref(false);
const selectedLanguage = ref({text: t('selectLanguage'), value: ''});
const languages = [
  {value: 'es', text: 'Español'},
  {value: 'us', text: 'English'},
  {value: 'pt', text: 'Português'},
  {value: 'cn', text: '中文'},
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

  if (settingsStore.settings.maxBoards < 3) {
    maxBoardsError.value = t('minBoardsRequired');
    return;
  }
  maxBoardsError.value = '';

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
const selectLanguage = (lang) => {
  selectedLanguage.value = lang;
  isOpen.value = false;
  locale.value = lang.value;
  localStorage.setItem('language', lang.value);
};

onMounted(() => {
  settingsStore.loadSettings();
  locale.value = language.value;
  selectedLanguage.value = languages.find(lang => lang.value === language.value);
  if (!isFormValid.value) {
    settingsStore.showModal = true;
  }
});
</script>
<style>
.time-field {
  max-width: 50px;
}

.custom-dropdown {
  position: relative;
  display: inline-block;
  width: 240px;
}

.custom-dropdown-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  font-size: 16px;
  background: white;
  border: 2px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  transition: background 0.3s;
}

.custom-dropdown-toggle:hover {
  background: #f8f8f8;
}

.custom-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  display: none;
}

.custom-dropdown.open .custom-dropdown-menu {
  display: block;
}

.custom-dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  color: #1E1E1E;
}

.custom-dropdown-item:hover {
  background: #f0f0f0;
}

.flag {
  margin-right: 10px;
  font-size: 20px;
}

.custom-dropdown-divider {
  width: 100%;
  height: 1px;
  background: #ddd;
  margin: 8px 0;
}

</style>
