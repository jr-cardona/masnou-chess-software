<template>
  <b-modal v-model="settingsStore.showModal"
           size="lg"
           body-bg-variant="dark"
           header-bg-variant="dark"
           centered="true"
           hide-footer="true"
           no-close-on-esc="true"
           hide-header-close="true"
           no-close-on-backdrop="true"
  >
    <template #title>
      <i class="bi bi-trophy me-1"></i> {{ t('tournamentSettings') }}
    </template>
    <b-tabs pills vertical nav-wrapper-class="w-35">
      <!-- Language -->
      <b-tab active>
        <template #title>
          <i class="bi bi-globe-americas me-1"></i> {{ t('language') }}
        </template>
        <div class="relative inline-block w-60 text-black">
          <!-- Dropdown button -->
          <button
              @click="isOpen = !isOpen"
              class="flex w-full items-center justify-between rounded-lg border-2 border-gray-300 bg-white px-4 py-3 shadow-sm transition-colors hover:bg-gray-50"
          >
            <div class="flex items-center gap-2">
              <!-- Flag -->
              <div class="flag">
                <img :src="`flags/${selectedLanguage.value}.svg`" width="30" :alt="selectedLanguage.text">
              </div>
              <!-- Selected language text -->
              <span class="text-base">{{ selectedLanguage.text }}</span>
            </div>
            <!-- Arrow -->
            <span class="text-gray-500">▼</span>
          </button>
          <!-- Dropdown -->
          <div
              v-if="isOpen"
              class="absolute left-0 top-full z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            <!-- Dropdown options -->
            <div
                v-for="(lang, index) in languages"
                :key="lang.value"
                @click="selectLanguage(lang)"
                class="flex cursor-pointer items-center gap-2 px-4 py-3 transition-colors hover:bg-gray-100"
            >
              <!-- Flag -->
              <div class="flag">
                <img :src="`flags/${lang.value}.svg`" width="30" :alt="lang.text"/>
              </div>
              <!-- Language text -->
              <span class="text-base">{{ lang.text }}</span>
              <!-- Divisor -->
              <div v-if="index < languages.length - 1" class="border-t border-gray-200"></div>
            </div>
          </div>
        </div>
      </b-tab>
      <!-- Tournament Settings -->
      <b-tab>
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

        <b-form-group :disabled="tournamentStore.status === 'inCourse'" :label="t('tournamentDuration')">
          <div class="flex items-center gap-2">
            <b-input-group>
              <b-form-input v-model.number="settingsStore.settings.hours"
                            class="text-center time-field"
                            @blur="validateHours"
              />
              <b-input-group-text>h</b-input-group-text>
            </b-input-group>
            <span class="mx-2">:</span>
            <b-input-group>
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
    <!-- Action buttons -->
    <div class="flex justify-between mt-3 gap-4">
      <button
          @click="settingsStore.resetSettings"
          class="w-1/4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded flex items-center justify-center gap-2 transition-colors"
      >
        <i class="bi bi-arrow-counterclockwise"></i> {{ t('reset') }}
      </button>
      <button
          :disabled="!isFormValid"
          @click="saveSettings"
          class="w-1/4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i class="bi bi-floppy"></i> {{ t('save') }}
      </button>
    </div>
  </b-modal>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {useSettingsStore} from '../stores/useSettingsStore';
import {BModal, BFormGroup, BFormSelect, BFormInput, BTabs} from 'bootstrap-vue-3';
import {useTournamentStore} from '../stores/useTournamentStore';

const {t, locale} = useI18n({useScope: 'global'});
const settingsStore = useSettingsStore();
const tournamentStore = useTournamentStore();
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
const winnerOptions = computed(() => [
  {value: 'changes', text: t('changesColor')},
  {value: 'repeats', text: t('repeatsColor')},
  {value: 'alwaysWhite', text: t('alwaysWhite')},
  {value: 'alwaysBlack', text: t('alwaysBlack')},
]);
const winLimitOptions = computed(() => [
  {value: 'unlimited', text: t('unlimited')},
  {value: '3', text: '3'},
  {value: '4', text: '4'},
  {value: '5', text: '5'},
  {value: '6', text: '6'},
]);
const drawOptions = computed(() => [
  {value: 'whiteOut', text: t('whiteSitsOut')},
  {value: 'bothOut', text: t('bothSitOut')},
]);
const isFormValid = computed(() => {
  return Object.values(settingsStore.settings).every(val => val !== '' && val !== null);
});
const saveSettings = () => {
  if (settingsStore.settings.hours === 0 && settingsStore.settings.minutes < 1) {
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
<style scoped>
.time-field {
  max-width: 50px;
}
</style>
