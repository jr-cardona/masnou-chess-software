<template>
  <div class="mt-3">
    <h3 class="text-center text-warning"><i class="bi bi-person"></i>
      {{ t('addPlayer', 2) }}
    </h3>
    <div class="card text-light p-4 rounded" style="background-color: #2A2A2A">
      <b-form @submit.prevent="addNewPlayer">
        <div class="form-floating mb-3">
          <b-form-input
              id="playerName"
              placeholder=""
              ref="playerNameInput"
              v-model="playerName"
              :class="{'is-invalid': playerNameError}"
              @input="validatePlayerName"
          ></b-form-input>
          <label for="playerName" class="text-dark">{{ t('name') }} *</label>
          <div v-if="playerNameError" class="invalid-feedback">
            {{ playerNameError }}
          </div>
        </div>

        <div class="form-floating mb-3">
          <b-form-input
              id="elo"
              type="number"
              placeholder=""
              v-model.number="playerElo"
              :class="{'is-invalid': playerEloError}"
              @input="validatePlayerElo"
          ></b-form-input>
          <label for="playerName" class="text-dark">ELO ({{ t('optional') }})</label>
          <div v-if="playerEloError " class="invalid-feedback">
            {{ playerEloError }}
          </div>
        </div>

        <b-form-group :label="t('startInQueue')">
          <b-form-checkbox
              v-model="startInQueue"
              :disabled="tournamentStore.status === 'inCourse'"
              class="text-warning"
          >
            {{ t('yes') }}
          </b-form-checkbox>
        </b-form-group>

        <b-button type="submit" variant="warning" class="w-100 fs-5 fw-medium"><i class="bi bi-floppy"></i>
          {{ t('save') }}
        </b-button>
      </b-form>
    </div>
  </div>
</template>


<script setup>
import {nextTick, ref} from 'vue';
import {usePlayersStore} from '../stores/usePlayersStore';
import {useTournamentStore} from '../stores/useTournamentStore';
import {BForm, BFormInput, BButton, BFormCheckbox} from 'bootstrap-vue-3';
import {useI18n} from "vue-i18n";

const {t} = useI18n({useScope: 'global'})
const playersStore = usePlayersStore();
const tournamentStore = useTournamentStore();
const playerNameInput = ref(null);
const playerName = ref('');
const playerNameError = ref('');
const playerElo = ref(0);
const playerEloError = ref('');
const startInQueue = ref(false);

const addNewPlayer = () => {
  if (validateForm()) {
    playersStore.addPlayer(playerName.value.trim(), playerElo.value, startInQueue.value);
    playerName.value = '';
    playerElo.value = 0;
    startInQueue.value = false;

    nextTick(() => {
      playerNameInput.value.focus();
    });
  }
};
const validateForm = () => {
  const isNameValid = validatePlayerName();
  const isEloValid = validatePlayerElo();
  return isNameValid && isEloValid;
};
const validatePlayerElo = () => {
  if (playerElo.value === null || playerElo.value === '') {
    playerElo.value = 0;
  }

  if (!Number.isInteger(playerElo.value) || playerElo.value < 0) {
    playerEloError.value = 'ELO must be a positive integer';
    return false;
  }
  if (playerElo.value > 3000) {
    playerEloError.value = 'ELO must be lower than 3000';
    return false;
  }
  playerEloError.value = '';
  return true;
};
const validatePlayerName = () => {
  if (!playerName.value.trim()) {
    playerNameError.value = 'Player name is required';
    return false;
  }
  if (playerName.value.length > 30) {
    playerNameError.value = 'Maximum 30 characters allowed';
    return false;
  }
  playerNameError.value = '';
  return true;
};
</script>
