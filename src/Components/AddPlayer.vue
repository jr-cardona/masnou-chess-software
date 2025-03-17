<template>
  <div class="mt-2">
    <b-form @submit.prevent="addNewPlayers">
      <div class="d-flex align-items-center gap-2">
        <div class="form-floating flex-grow-1 pe-4">
          <b-form-input
              id="playerNames"
              placeholder=""
              ref="playerNamesInput"
              v-model="playerNames"
              :class="{'is-invalid': playerNamesError}"
              @input="validatePlayerNames"
          ></b-form-input>
          <label for="playerNames" class="text-dark">{{ t('enterPlayerNames') }} *</label>
          <div v-if="playerNamesError" class="invalid-feedback">
            {{ playerNamesError }}
          </div>
        </div>

        <b-button type="submit" variant="warning" class="w-auto fs-5 fw-medium">
          <i class="bi bi-floppy"></i> {{ t('save') }}
        </b-button>
      </div>
    </b-form>
  </div>
</template>


<script setup>
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {usePlayersStore} from '../stores/usePlayersStore';
import {BForm, BButton} from 'bootstrap-vue-3';

const {t} = useI18n({useScope: 'global'})
const playersStore = usePlayersStore();
const playerNames = ref('');
const playerNamesError = ref('');

const addNewPlayers = () => {
  if (!validatePlayerNames()) return;

  const playerList = playerNames.value
      .split(",")
      .map(name => name.trim())
      .filter(name => name.length > 0);

  playerList.forEach(name => {
    if (name.length <= 30 && !playersStore.players.some(player => player.name === name)) {
      playersStore.addPlayer(name, null, false);
    }
  });

  playerNames.value = '';
};
const validatePlayerNames = () => {
  const names = playerNames.value.split(",").map(name => name.trim()).filter(name => name.length > 0);

  if (names.length === 0) {
    playerNamesError.value = t('playerNameRequired');
    return false;
  }

  if (names.some(name => name.length > 30)) {
    playerNamesError.value = t('playerNameTooLong');
    return false;
  }

  playerNamesError.value = "";
  return true;
};
</script>
